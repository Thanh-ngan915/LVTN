import os
import pymysql
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

load_dotenv()

# ── Model Embedding (giữ nguyên từ Colab) ────────────────────────────────────
embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/multilingual-e5-large",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"batch_size": 32},
)

# ── Kết nối MySQL — đặt biến môi trường trong file .env ──────────────────────
DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "productdb"),
    "charset":  "utf8mb4",
}

INDEX_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "faiss_etsy_index_v2"
)


# ── Lấy toàn bộ dữ liệu từ MySQL (JOIN 4 bảng) ───────────────────────────────
def _load_docs_from_mysql() -> list[Document]:
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:

            # 1. Lấy thông tin sản phẩm + tên danh mục
            cur.execute("""
                SELECT
                    p.id,
                    p.name,
                    p.price_before,
                    p.price_after,
                    p.description,
                    p.status,
                    p.rate,
                    p.sold,
                    c.name  AS category_name,
                    p.category AS category_short
                FROM product p
                LEFT JOIN category c ON c.shortname = p.category
                WHERE p.is_delete = 0 OR p.is_delete IS NULL
                ORDER BY p.id
            """)
            products = cur.fetchall()

            # 2. Lấy ảnh — gom theo product_id
            cur.execute("SELECT product_id, url FROM product_image ORDER BY product_id")
            image_rows = cur.fetchall()
            images_map: dict[int, list[str]] = {}
            for row in image_rows:
                pid = row["product_id"]
                images_map.setdefault(pid, []).append(row["url"] or "")

            # 3. Lấy biến thể — gom theo product_id
            cur.execute("""
                SELECT product_id, color, size, price_before, price_after, current_quantity
                FROM product_variant
                ORDER BY product_id
            """)
            variant_rows = cur.fetchall()
            variants_map: dict[int, list[dict]] = {}
            for row in variant_rows:
                pid = row["product_id"]
                variants_map.setdefault(pid, []).append(row)

    finally:
        conn.close()

    # ── Ghép thành Document cho FAISS ────────────────────────────────────────
    docs: list[Document] = []

    for p in products:
        pid        = p["id"]
        name       = (p["name"] or "").strip()
        desc_raw   = (p["description"] or "")[:400].strip()
        category   = p["category_name"] or p["category_short"] or "Không rõ"
        price_b    = p["price_before"] or 0
        price_a    = p["price_after"]  or price_b
        rate       = p["rate"] or 0
        sold       = p["sold"] or 0
        status     = p["status"] or "active"

        # Ảnh đầu tiên làm đại diện
        imgs       = images_map.get(pid, [])
        thumb      = imgs[0] if imgs else ""

        # Biến thể: tóm tắt màu & size
        variants   = variants_map.get(pid, [])
        variant_summary = ""
        if variants:
            colors = sorted({v["color"] for v in variants if v["color"]})
            sizes  = sorted({v["size"]  for v in variants if v["size"]})
            if colors:
                variant_summary += f"Màu sắc: {', '.join(colors)}. "
            if sizes:
                variant_summary += f"Kích thước: {', '.join(sizes)}. "
            # Giá biến thể thấp nhất / cao nhất
            prices = [v["price_after"] or v["price_before"] for v in variants
                      if (v["price_after"] or v["price_before"])]
            if prices:
                variant_summary += (
                    f"Giá biến thể: {min(prices):,.0f}đ"
                    + (f" - {max(prices):,.0f}đ" if max(prices) != min(prices) else "")
                    + ". "
                )

        # Giảm giá
        discount = ""
        if price_b and price_a and price_a < price_b:
            pct = round((1 - price_a / price_b) * 100)
            discount = f"Giảm {pct}% (từ {price_b:,.0f}đ còn {price_a:,.0f}đ). "
        else:
            discount = f"Giá: {price_a:,.0f}đ. "

        clean_text = (
            f"passage: Mã sản phẩm (ID): {pid}. "
            f"Tên sản phẩm: {name}. "
            f"Danh mục: {category}. "
            f"{discount}"
            f"Đánh giá: {rate}/5 ({sold} đã bán). "
            f"{variant_summary}"
            f"Mô tả: {desc_raw}."
        )

        meta_data = {
            "product_id": str(pid),
            "category":   category,
            "status":     status,
            "images_url": thumb,
        }
        docs.append(Document(page_content=clean_text, metadata=meta_data))

    print(f"✅ Đọc được {len(docs)} sản phẩm từ MySQL (product + image + variant)")
    return docs


# ── Build & lưu FAISS index ──────────────────────────────────────────────────
def build_and_save_index() -> FAISS:
    """
    Đọc toàn bộ dữ liệu từ MySQL → tạo FAISS index → lưu ra đĩa.
    Gọi hàm này mỗi khi thêm / cập nhật sản phẩm.
    """
    docs = _load_docs_from_mysql()
    if not docs:
        raise ValueError("Không có sản phẩm nào trong DB để train!")
    print(f"⏳ Đang tạo FAISS index từ {len(docs)} sản phẩm…")
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(INDEX_PATH)
    print(f"✅ Đã lưu index tại: {INDEX_PATH}")
    return vectorstore


# ── Load FAISS index từ đĩa (dùng khi server khởi động) ─────────────────────
def load_vector_db() -> FAISS:
    """
    Load FAISS index đã build sẵn từ đĩa.
    Nếu chưa có, tự động build từ MySQL lần đầu.
    """
    if os.path.exists(INDEX_PATH):
        print(f"📂 Load FAISS index từ: {INDEX_PATH}")
        return FAISS.load_local(
            INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True,
        )
    print("⚠️  Chưa có FAISS index — đang build từ MySQL lần đầu…")
    return build_and_save_index()


def get_retriever():
    """Tạo retriever dùng trong pipeline đơn giản."""
    return load_vector_db().as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3},
    )