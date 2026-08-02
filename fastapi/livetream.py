import os, re, tempfile, subprocess
import whisper
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import uvicorn

PORT = 5000

# Load Whisper small làm fallback (vì CPU chạy large-v3 quá nặng)
print("🔄 Loading Whisper small...")
whisper_model = whisper.load_model("small")
print("✅ Whisper small ready!")

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
    try:
        res = subprocess.run([
            "ffmpeg", "-y", "-i", path,
            "-ar", "16000", "-ac", "1",
            out
        ], capture_output=True, timeout=5)
        if res.returncode == 0 and os.path.exists(out):
            return out
    except Exception:
        pass
    return path

# ===== Whisper (Local) =====
def transcribe_whisper(audio_path: str) -> str:
    try:
        result = whisper_model.transcribe(
            audio_path,
            language="vi",
            initial_prompt="Mã ID sản phẩm:",
            temperature=0.0,
            condition_on_previous_text=False,
        )
        text = result.get("text", "").strip()
        # Nếu âm thanh im lặng bị ảo giác lặp lại prompt
        if any(h in text.lower() for h in ["người dùng đọc mã", "tên phần của các chữ số", "mã id sản phẩm"]):
            if not extract_product_id(text):
                return ""
        return text
    except Exception as e:
        print(f"⚠️ Whisper error: {e}")
        return ""

class TranscriptionResponse(BaseModel):
    whisper_text: str
    text: str # Thêm lại trường này để khớp với Frontend
    productId: str | None
    source: str  # "whisper" | "none"


@app.post("/speech-to-text", response_model=TranscriptionResponse)
async def speech_to_text(audio: UploadFile = File(...)):
    tmp_path = None
    clean_path = None
    try:
        content = await audio.read()
        if len(content) < 1000:
            return TranscriptionResponse(whisper_text="", text="", productId=None, source="none")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        clean_path = preprocess_audio(tmp_path)
        whisper_text = transcribe_whisper(clean_path)

        if whisper_text:
            print(f"📝 Whisper: {whisper_text}")

        product_id = extract_product_id(whisper_text)
        source = "whisper" if product_id else "none"

        if product_id:
            print(f"📦 Product ID: {product_id} (from {source})")

        return TranscriptionResponse(
            whisper_text=whisper_text,
            text=whisper_text,
            productId=product_id,
            source=source,
        )

    finally:
        for p in [tmp_path, clean_path]:
            if p and os.path.exists(p):
                try:
                    os.unlink(p)
                except Exception:
                    pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)