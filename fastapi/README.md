# 🎤 Whisper Speech-to-Text Service

## 📦 Cài đặt

### 1. Cài Python packages

```bash
pip install -r requirements.txt
```

### 2. Chạy service

```bash
python main.py
```

Service sẽ chạy tại: **http://localhost:5000**

API Docs: **http://localhost:5000/docs**

## 🧪 Test API

### Sử dụng Swagger UI

Truy cập: `http://localhost:5000/docs`

### Sử dụng curl

```bash
curl -X POST "http://localhost:5000/speech-to-text" \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@test_audio.wav"
```

### Test với text trực tiếp

```bash
curl -X POST "http://localhost:5000/extract-product-id?text=quần%20A%20có%20id%20là%20123"
```

## 📝 API Endpoints

### POST /speech-to-text

Upload audio file → transcript + productId

**Request:**
- `audio`: File audio (wav, mp3, m4a, webm)

**Response:**
```json
{
  "text": "quần A có id là một hai ba",
  "productId": "123",
  "numbers": ["123"],
  "confidence": 0.95
}
```

### POST /extract-product-id

Trích xuất productId từ text (không cần audio)

**Request:**
- `text`: String

**Response:**
```json
{
  "text": "quần A có id là 123",
  "productId": "123",
  "numbers": ["123"]
}
```

## 🔧 Whisper Models

Thay đổi model trong `main.py`:

```python
MODEL_SIZE = "base"  # tiny / base / small / medium / large
```

| Model  | Size   | Speed | Accuracy |
|--------|--------|-------|----------|
| tiny   | ~40MB  | Fast  | Low      |
| base   | ~150MB | Fast  | Medium   |
| small  | ~500MB | Mid   | Good     |
| medium | ~1.5GB | Slow  | Better   |
| large  | ~3GB   | Slow  | Best     |

**Khuyến nghị:** Dùng `base` hoặc `small` cho cân bằng tốc độ/độ chính xác.
