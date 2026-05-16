import os
import re
import tempfile
import whisper
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import assemblyai as aai
import asyncio

# ================== CONFIG ==================
MODEL_SIZE = "base"  # tiny / base / small / medium / large
PORT = 5000
ASSEMBLY_AI_KEY = "5c222829070c42d5a60b25ea9b00c63c"

# ============================================
aai.settings.api_key = ASSEMBLY_AI_KEY

app = FastAPI(title="Whisper Speech-to-Text Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8084"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model
print(f"🔄 Loading Whisper model '{MODEL_SIZE}'...")
model = whisper.load_model(MODEL_SIZE)
print(f"✅ Whisper model '{MODEL_SIZE}' loaded successfully!")

# ===== ÁNH XẠ CHỮ → SỐ =====
mapping = {
    "không": "0", "0": "0",
    "một": "1", "mốt": "1", "1": "1",
    "hai": "2", "2": "2",
    "ba": "3", "3": "3",
    "bốn": "4", "tư": "4", "4": "4",
    "năm": "5", "lăm": "5", "5": "5",
    "sáu": "6", "6": "6",
    "bảy": "7", "bẩy": "7", "7": "7",
    "tám": "8", "8": "8",
    "chín": "9", "9": "9",
}


def extract_numbers(text: str) -> list:
    """Trích xuất số từ text tiếng Việt"""
    text = text.lower()
    for k, v in mapping.items():
        text = text.replace(k, v)
    return re.findall(r"\d+", text)


def extract_product_id(text: str) -> str | None:
    """
    Trích xuất product ID từ text
    Pattern: "id là 123", "mã 456", "số 789"
    """
    text = text.lower()

    # Convert chữ sang số
    for k, v in mapping.items():
        text = text.replace(k, v)

    # Pattern tìm số sau "id", "mã", "số"
    pattern = r"(?:id|mã|số)[\s:là]*([0-9]+)"
    match = re.search(pattern, text)

    if match:
        return match.group(1)

    return None


# ===== RESPONSE MODEL =====
class TranscriptionResponse(BaseModel):
    text: str
    productId: str | None
    numbers: list[str]
    confidence: float | None = None


# ================= API ENDPOINTS =================
@app.get("/")
def root():
    return {
        "service": "Whisper Speech-to-Text",
        "model": MODEL_SIZE,
        "status": "running"
    }


@app.post("/speech-to-text", response_model=TranscriptionResponse)
async def speech_to_text(audio: UploadFile = File(...)):
    """
    Nhận audio file và chuyển đổi thành text

    - **audio**: File audio (wav, mp3, m4a, webm)
    - Returns: text, productId, numbers
    """

    # Validate file type (lenient - accept by content_type or file extension)
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/webm", "audio/x-m4a", "application/octet-stream"]
    allowed_extensions = [".wav", ".mp3", ".m4a", ".webm", ".ogg"]

    filename = audio.filename or "recording.webm"
    file_ext = os.path.splitext(filename)[1].lower()
    content_type = audio.content_type or "application/octet-stream"

    print(f"📁 Received file: {filename}, content_type: {content_type}")

    # Accept if content_type matches OR file extension matches
    if content_type not in allowed_types and file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid audio format. Content-Type: {content_type}, Extension: {file_ext}. Allowed types: {allowed_types}, extensions: {allowed_extensions}"
        )

    # Save uploaded file to temp
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Transcribe using Whisper (Local)
        print(f"🎤 Transcribing audio with Whisper: {audio.filename}")
        whisper_result = model.transcribe(tmp_path, language="vi")
        whisper_text = whisper_result["text"].strip()

        # Transcribe using AssemblyAI (Cloud) - Run in background/concurrently if needed
        # We use a wrapper to make it async-friendly
        print(f"☁️ Transcribing audio with AssemblyAI...")
        transcriber = aai.Transcriber()
        config = aai.TranscriptionConfig(language_code="vi")
        
        try:
            # AssemblyAI process
            aai_result = transcriber.transcribe(tmp_path, config=config)
            aai_text = aai_result.text if aai_result.text else ""
        except Exception as e:
            print(f"⚠️ AssemblyAI Error: {e}")
            aai_text = ""

        print(f"📝 Whisper Transcript: {whisper_text}")
        print(f"📝 AssemblyAI Transcript: {aai_text}")

        # Combine results: Try to extract ID from both
        product_id = extract_product_id(whisper_text)
        if not product_id and aai_text:
            product_id = extract_product_id(aai_text)
            
        numbers = list(set(extract_numbers(whisper_text) + extract_numbers(aai_text)))

        print(f"📦 Final Product ID: {product_id}")
        print(f"🔢 Combined Numbers: {numbers}")

        return TranscriptionResponse(
            text=f"Whisper: {whisper_text} | AAI: {aai_text}",
            productId=product_id,
            numbers=numbers,
            confidence=whisper_result.get("segments", [{}])[0].get("confidence") if whisper_result.get("segments") else None
        )


    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.post("/extract-product-id")
async def extract_product_id_endpoint(text: str):
    """
    Trích xuất product ID từ text (không cần audio)

    - **text**: Text cần trích xuất
    - Returns: productId
    """
    product_id = extract_product_id(text)
    numbers = extract_numbers(text)

    return {
        "text": text,
        "productId": product_id,
        "numbers": numbers
    }


# ================= RUN =================
if __name__ == "__main__":
    print(f"🚀 Whisper Speech Service starting on http://localhost:{PORT}")
    print(f"📚 API Docs: http://localhost:{PORT}/docs")
    uvicorn.run(app, host="0.0.0.0", port=PORT)

