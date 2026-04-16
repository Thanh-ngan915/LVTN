import os
import pandas as pd
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

# Cấu hình Model Embedding (Giữ nguyên từ Colab)
embeddings = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-large", model_kwargs={'device': 'cpu'})


def load_vector_db():
    """Load FAISS index từ thư mục cục bộ"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(base_dir, "faiss_etsy_index_v2")

    if os.path.exists(index_path):
        return FAISS.load_local(
            index_path,
            embeddings,
            allow_dangerous_deserialization=True
        )
    else:
        raise FileNotFoundError(f"Không tìm thấy Index tại: {index_path}")


def get_retriever():
    """Tạo bộ truy xuất dữ liệu"""
    vectorstore = load_vector_db()
    return vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )