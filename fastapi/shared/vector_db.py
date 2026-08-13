import os
import pymysql
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

load_dotenv()

embeddings = HuggingFaceEmbeddings(
    model_name="intfloat/multilingual-e5-large",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"batch_size": 32, "normalize_embeddings": True}
)

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "productdb"),
    "charset":  "utf8mb4",
}

STORE_DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("STORE_DB_NAME", "storesdb"),
    "charset":  "utf8mb4",
}

USERS_DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 3306)),
    "user":     os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("USERS_DB_NAME", "usersdb"),
    "charset":  "utf8mb4",
}

INDEX_PATH = "/app/shared/faiss_data/faiss_etsy_index_v2"


def _load_store_map() -> dict[str, str]:
    """Lấy map store_id -> tên shop từ storesdb (chỉ lấy shop ACTIVE)."""
    conn = pymysql.connect(**STORE_DB_CONFIG)
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT id, name FROM store WHERE status = 'active'")
            rows = cur.fetchall()
        return {str(r["id"]): (r["name"] or "").strip() for r in rows}
    except Exception as e:
        print(f"Khong lay duoc du lieu store: {e}")
        return {}
    finally:
        conn.close()


def _load_docs_from_mysql() -> list[Document]:
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
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
                    p.store_id,
                    c.name  AS category_name,
                    p.category AS category_short
                FROM product p
                LEFT JOIN category c ON c.shortname = p.category
                WHERE (p.is_delete = 0 OR p.is_delete IS NULL) AND p.status = 'active'
                ORDER BY p.id
            """)
            products = cur.fetchall()

            cur.execute("SELECT product_id, url FROM product_image ORDER BY product_id")
            image_rows = cur.fetchall()
            images_map: dict[int, list[str]] = {}
            for row in image_rows:
                pid = row["product_id"]
                images_map.setdefault(pid, []).append(row["url"] or "")

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

    store_map = _load_store_map()

    docs: list[Document] = []

    for p in products:
        store_id   = str(p.get("store_id") or "")
        if store_id not in store_map:
            continue  # Bỏ qua sản phẩm nếu shop đã bị khóa hoặc không tồn tại
            
        pid        = p["id"]
        name       = (p["name"] or "").strip()
        desc_raw   = (p["description"] or "")[:400].strip()
        category_display   = p["category_name"] or p["category_short"] or "Không rõ"
        category_shortname = p["category_short"] or "khong_ro"
        price_b    = p["price_before"] or 0
        price_a    = p["price_after"]  or price_b
        rate       = p["rate"] or 0
        sold       = p["sold"] or 0
        status     = p["status"] or "active"
        store_id   = str(p.get("store_id") or "")
        shop_name  = store_map.get(store_id, "Không rõ")

        imgs  = images_map.get(pid, [])
        thumb = imgs[0] if imgs else ""

        variants = variants_map.get(pid, [])
        variant_summary = ""
        if variants:
            colors = sorted({v["color"] for v in variants if v["color"]})
            sizes  = sorted({v["size"]  for v in variants if v["size"]})
            if colors:
                variant_summary += f"Màu sắc: {', '.join(colors)}. "
            if sizes:
                variant_summary += f"Kích thước: {', '.join(sizes)}. "
            prices = [v["price_after"] or v["price_before"] for v in variants
                      if (v["price_after"] or v["price_before"])]
            if prices:
                variant_summary += (
                    f"Giá biến thể: {min(prices):,.0f}đ"
                    + (f" - {max(prices):,.0f}đ" if max(prices) != min(prices) else "")
                    + ". "
                )

        discount = ""
        if price_b and price_a and price_a < price_b:
            pct = round((1 - price_a / price_b) * 100)
            discount = f"Giảm {pct}% (từ {price_b:,.0f}đ còn {price_a:,.0f}đ). "
        else:
            discount = f"Giá: {price_a:,.0f}đ. "

        clean_text = (
            f"passage: Mã sản phẩm (ID): {pid}. "
            f"Tên sản phẩm: {name}. "
            f"Tên cửa hàng (Shop): {shop_name}. "
            f"Danh mục: {category_display}. "
            f"{discount}"
            f"Đánh giá: {rate}/5 ({sold} đã bán). "
            f"{variant_summary}"
            f"Mô tả: {desc_raw}."
        )

        meta_data = {
            "product_id": str(pid),
            "name": name,
            "category":   category_shortname,
            "status":     status,
            "images_url": thumb,
            "images_all": imgs,        # toàn bộ ảnh, phục vụ "xem ảnh khác"
            "shop_id":    store_id,
            "shop_name":  shop_name,
        }
        docs.append(Document(page_content=clean_text, metadata=meta_data))

    # Tải thêm các Policy (ACTIVE)
    conn_users = pymysql.connect(**USERS_DB_CONFIG)
    try:
        with conn_users.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT id, title, content FROM policy WHERE status = 'ACTIVE'")
            policies = cur.fetchall()
            for pol in policies:
                pol_id = pol["id"]
                title = (pol["title"] or "").strip()
                content = (pol["content"] or "").strip()
                clean_text = f"passage: [CHÍNH SÁCH HỆ THỐNG] Tiêu đề: {title}. Nội dung: {content}."
                meta_data = {
                    "policy_id": str(pol_id),
                    "type": "system_policy"
                }
                docs.append(Document(page_content=clean_text, metadata=meta_data))
    except Exception as e:
        print(f"Lỗi tải policies: {e}")
    finally:
        conn_users.close()

    # Tải thêm thông tin các Cửa hàng (Shop)
    conn_store = pymysql.connect(**STORE_DB_CONFIG)
    try:
        with conn_store.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT id, name, location, description, status FROM store WHERE status = 'active'")
            stores = cur.fetchall()
            for st in stores:
                st_id = st["id"]
                st_name = (st["name"] or "").strip()
                st_desc = (st["description"] or "").strip()
                st_location = (st["location"] or "").strip()
                
                clean_text = f"passage: [THÔNG TIN CỬA HÀNG/SHOP] Tên shop: {st_name}. Địa chỉ: {st_location}. Giới thiệu: {st_desc}."
                meta_data = {
                    "type": "store",
                    "store_id": str(st_id),
                    "name": st_name,
                    "location": st_location,
                }
                docs.append(Document(page_content=clean_text, metadata=meta_data))
    except Exception as e:
        print(f"Lỗi tải thông tin store: {e}")
    finally:
        conn_store.close()

    print(f"Doc duoc {len(docs)} items tu MySQL (product + policy + store)")
    return docs


def build_and_save_index() -> FAISS:
    docs = _load_docs_from_mysql()
    if not docs:
        raise ValueError("Không có sản phẩm nào trong DB để train!")
    print(f"Dang tao FAISS index tu {len(docs)} san pham…")
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(INDEX_PATH)
    print(f"Da luu index tai: {INDEX_PATH}")
    return vectorstore


def load_vector_db() -> FAISS:
    if os.path.exists(INDEX_PATH):
        print(f"Load FAISS index tu Persistent Volume: {INDEX_PATH}")
        return FAISS.load_local(
            INDEX_PATH, embeddings, allow_dangerous_deserialization=True,
        )
    print("Chua co FAISS index tren PVC — dang build tu MySQL lan dau…")
    return build_and_save_index()


def get_retriever():
    return load_vector_db().as_retriever(
        search_type="similarity", search_kwargs={"k": 3},
    )

def upsert_policy_in_index(policy_id):
    """Cập nhật hoặc thêm chính sách vào FAISS index nếu ACTIVE, nếu không thì xoá."""
    conn = pymysql.connect(**USERS_DB_CONFIG)
    policy = None
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT id, title, content, status FROM policy WHERE id = %s", (policy_id,))
            policy = cur.fetchone()
    finally:
        conn.close()

    if not policy or policy.get("status") != "ACTIVE":
        delete_policy_from_index(policy_id)
        return

    title = (policy["title"] or "").strip()
    content = (policy["content"] or "").strip()
    clean_text = f"passage: [CHÍNH SÁCH HỆ THỐNG] Tiêu đề: {title}. Nội dung: {content}."
    meta_data = {
        "policy_id": str(policy["id"]),
        "type": "system_policy"
    }
    
    doc = Document(page_content=clean_text, metadata=meta_data)
    
    try:
        vectorstore = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
        # Xóa cũ trước khi thêm mới
        to_delete = []
        for doc_id, doc_meta in vectorstore.docstore._dict.items():
            if str(doc_meta.metadata.get("policy_id")) == str(policy_id):
                to_delete.append(doc_id)
        if to_delete:
            vectorstore.delete(to_delete)
            
        vectorstore.add_documents([doc])
        vectorstore.save_local(INDEX_PATH)
        print(f"Đã upsert policy_id={policy_id} vào FAISS")
    except Exception as e:
        print(f"Lỗi khi upsert policy_id={policy_id}: {e}")

def delete_policy_from_index(policy_id):
    """Xóa chính sách khỏi FAISS index."""
    try:
        vectorstore = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
        to_delete = []
        for doc_id, doc_meta in vectorstore.docstore._dict.items():
            if str(doc_meta.metadata.get("policy_id")) == str(policy_id):
                to_delete.append(doc_id)
        
        if to_delete:
            vectorstore.delete(to_delete)
            vectorstore.save_local(INDEX_PATH)
            print(f"Đã xóa policy_id={policy_id} khỏi FAISS")
    except Exception as e:
        print(f"Lỗi khi xóa policy_id={policy_id} khỏi FAISS: {e}")

def get_products_for_store(target_store_id: str, store_name: str = None):
    store_map = _load_store_map()
    if target_store_id not in store_map and not store_name:
        return []
    if store_name:
        store_map[target_store_id] = store_name

    conn = pymysql.connect(**DB_CONFIG)
    products = []
    images_map = {}
    variants_map = {}
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("""
                SELECT
                    p.id, p.name, p.price_before, p.price_after, p.description, p.status, p.rate, p.sold, p.store_id,
                    c.name AS category_name, p.category AS category_short
                FROM product p
                LEFT JOIN category c ON c.shortname = p.category
                WHERE (p.is_delete = 0 OR p.is_delete IS NULL) AND p.status = 'active' AND p.store_id = %s
            """, (target_store_id,))
            products = cur.fetchall()
            
            if products:
                p_ids = [str(p["id"]) for p in products]
                p_ids_str = ",".join(p_ids)
                
                cur.execute(f"SELECT product_id, url FROM product_image WHERE product_id IN ({p_ids_str}) ORDER BY product_id")
                image_rows = cur.fetchall()
                for row in image_rows:
                    images_map.setdefault(row["product_id"], []).append(row["url"] or "")
                    
                cur.execute(f"SELECT product_id, color, size, price_before, price_after FROM product_variant WHERE product_id IN ({p_ids_str})")
                variant_rows = cur.fetchall()
                for row in variant_rows:
                    variants_map.setdefault(row["product_id"], []).append(row)
    finally:
        conn.close()

    docs = []
    for p in products:
        pid = p["id"]
        name = (p["name"] or "").strip()
        desc_raw = (p["description"] or "")[:400].strip()
        category_display = p["category_name"] or p["category_short"] or "Không rõ"
        category_shortname = p["category_short"] or "khong_ro"
        price_b = p["price_before"] or 0
        price_a = p["price_after"] or price_b
        rate = p["rate"] or 0
        sold = p["sold"] or 0
        status = p["status"] or "active"
        store_id = str(p.get("store_id") or "")
        shop_name = store_map.get(store_id, "Không rõ")

        imgs = images_map.get(pid, [])
        thumb = imgs[0] if imgs else ""

        variants = variants_map.get(pid, [])
        variant_summary = ""
        if variants:
            colors = sorted({v["color"] for v in variants if v["color"]})
            sizes = sorted({v["size"] for v in variants if v["size"]})
            if colors: variant_summary += f"Màu sắc: {', '.join(colors)}. "
            if sizes: variant_summary += f"Kích thước: {', '.join(sizes)}. "
            prices = [v["price_after"] or v["price_before"] for v in variants if (v["price_after"] or v["price_before"])]
            if prices:
                variant_summary += f"Giá biến thể: {min(prices):,.0f}đ" + (f" - {max(prices):,.0f}đ" if max(prices) != min(prices) else "") + ". "

        discount = ""
        if price_b and price_a and price_a < price_b:
            pct = round((1 - price_a / price_b) * 100)
            discount = f"Giảm {pct}% (từ {price_b:,.0f}đ còn {price_a:,.0f}đ). "
        else:
            discount = f"Giá: {price_a:,.0f}đ. "

        clean_text = (
            f"passage: Mã sản phẩm (ID): {pid}. Tên sản phẩm: {name}. Tên cửa hàng (Shop): {shop_name}. "
            f"Danh mục: {category_display}. {discount}Đánh giá: {rate}/5 ({sold} đã bán). {variant_summary}Mô tả: {desc_raw}."
        )

        meta_data = {
            "product_id": str(pid),
            "name": name,
            "category": category_shortname,
            "status": status,
            "images_url": thumb,
            "images_all": imgs,
            "shop_id": store_id,
            "shop_name": shop_name,
        }
        docs.append(Document(page_content=clean_text, metadata=meta_data))
    return docs