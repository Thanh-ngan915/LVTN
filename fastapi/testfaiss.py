from shared.vector_db import load_vector_db

# Load bộ não
vector_db = load_vector_db()

# Thử tìm kiếm thuần túy (Không qua Gemini)
query = "query: handmade jewelry"
docs = vector_db.similarity_search(query, k=2)

print("--- KẾT QUẢ TỪ FAISS ---")
for doc in docs:
    print(f"ID: {doc.metadata['product_id']}")
    print(f"Content: {doc.page_content[:100]}...")
    print("-" * 20)