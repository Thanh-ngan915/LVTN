"""
train_index.py
──────────────
Script rebuild FAISS index từ MySQL.
Chạy lại mỗi khi thêm / sửa / xoá sản phẩm trong DB.

    python train_index.py
"""

from vector_db import build_and_save_index

if __name__ == "__main__":
    print("🚀 Bắt đầu train lại FAISS index từ MySQL…")
    build_and_save_index()
    print("🎉 Hoàn tất! Server FastAPI cần restart để load index mới.")