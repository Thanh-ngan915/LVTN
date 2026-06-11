FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (ffmpeg is required by Whisper)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY requirements.txt .

# Install PyTorch CPU version to keep the image size reasonable
RUN pip install --no-cache-dir torch==2.5.1 --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir openai openai-whisper

# Copy application files
COPY . .

EXPOSE 5000

CMD ["python", "livetream.py"]
