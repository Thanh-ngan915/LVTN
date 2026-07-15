from sentence_transformers import SentenceTransformer

# Khởi tạo model một lần khi start
# all-MiniLM-L6-v2 là model nhỏ, nhanh, phù hợp cho việc sinh embedding chung
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text: str) -> list[float]:
    """
    Sinh embedding vector từ văn bản đầu vào.
    :param text: Văn bản (ví dụ: tên + mô tả sản phẩm)
    :return: list các số thực đại diện cho vector
    """
    if not text:
        return []
    
    # model.encode trả về numpy array, chuyển thành list để dễ lưu vào JSON
    embedding = model.encode(text)
    return embedding.tolist()
