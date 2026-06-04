import os, re, tempfile, subprocess
import whisper
from openai import OpenAI
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import uvicorn

PORT = 5000

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "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")
openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Load Whisper large-v3 làm fallback (cần GPU)
print("🔄 Loading Whisper large-v3...")
whisper_model = whisper.load_model("large-v3")
print("✅ Whisper large-v3 ready!")

app = FastAPI(title="STT Service - Vietnamese ID")

# CẤU HÌNH CORS (PHẢI CÓ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả các nguồn
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

mapping = {


    "không": "0", "một": "1", "mốt": "1", "hai": "2",
    "ba": "3", "bốn": "4", "tư": "4", "năm": "5",
    "lăm": "5", "sáu": "6", "bảy": "7", "bẩy": "7",
    "tám": "8", "chín": "9",
}

ID_PATTERN = r"(?:id|mã|số|ai\s*đ[aâ][ềấy]|ai\s*đi|ây\s*đi|i\.d)[\s:là]*([0-9]+)"

def normalize(text: str) -> str:
    text = text.lower()
    for k, v in mapping.items():
        text = re.sub(rf"\b{k}\b", v, text)
    text = re.sub(r"(\d)[,\s]+(?=\d)", r"\1", text)
    return text

def extract_product_id(text: str) -> str | None:
    match = re.search(ID_PATTERN, normalize(text))
    return match.group(1) if match else None

def preprocess_audio(path: str) -> str:
    out = path.replace(".wav", "_clean.wav")
    subprocess.run([
        "ffmpeg", "-y", "-i", path,
        "-ar", "16000", "-ac", "1", "-af", "loudnorm",
        out
    ], capture_output=True)
    return out if os.path.exists(out) else path

# ===== GPT-4o Transcribe (Cloud, độ chính xác cao nhất) =====
def transcribe_gpt4o(audio_path: str) -> str:
    try:
        with open(audio_path, "rb") as f:
            result = openai_client.audio.transcriptions.create(
                model="gpt-4o-transcribe",  # Model tốt nhất hiện tại
                file=f,
                language="vi",
                prompt="Người dùng đọc mã ID sản phẩm gồm các chữ số. Ví dụ: ID 12345",
            )
        return result.text.strip()
    except Exception as e:
        print(f"⚠️ GPT-4o transcribe error: {e}")
        return ""

# ===== Whisper large-v3 (Local fallback) =====
def transcribe_whisper(audio_path: str) -> str:
    try:
        result = whisper_model.transcribe(
            audio_path,
            language="vi",
            initial_prompt="ID sản phẩm. Người dùng đọc mã ID gồm các chữ số.",
            temperature=0.0,
            condition_on_previous_text=False,
        )
        return result["text"].strip()
    except Exception as e:
        print(f"⚠️ Whisper error: {e}")
        return ""

class TranscriptionResponse(BaseModel):
    gpt4o_text: str
    whisper_text: str
    text: str # Thêm lại trường này để khớp với Frontend
    productId: str | None
    source: str  # "gpt4o" | "whisper" | "none"


@app.post("/speech-to-text", response_model=TranscriptionResponse)
async def speech_to_text(audio: UploadFile = File(...)):
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name

        clean_path = preprocess_audio(tmp_path)

        # Chạy cả 2 song song (GPT-4o là chính, Whisper là fallback)
        gpt4o_text = transcribe_gpt4o(clean_path)
        whisper_text = transcribe_whisper(clean_path)

        print(f"📝 GPT-4o: {gpt4o_text}")
        print(f"📝 Whisper: {whisper_text}")

        # Ưu tiên GPT-4o, fallback Whisper
        product_id = extract_product_id(gpt4o_text)
        source = "gpt4o"

        if not product_id:
            product_id = extract_product_id(whisper_text)
            source = "whisper" if product_id else "none"

        print(f"📦 Product ID: {product_id} (from {source})")

        return TranscriptionResponse(
            gpt4o_text=gpt4o_text,
            whisper_text=whisper_text,
            text=gpt4o_text if gpt4o_text else whisper_text, # Gán văn bản nhận diện được vào text
            productId=product_id,
            source=source,
        )

    finally:
        for p in [tmp_path]:
            if p and os.path.exists(p):
                os.unlink(p)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)