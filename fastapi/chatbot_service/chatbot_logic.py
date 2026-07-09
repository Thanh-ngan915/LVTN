import os
import re
import time
import pymysql
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnableLambda

load_dotenv()
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "productdb"),
    "charset": "utf8mb4",
}


def _load_category_map() -> dict[str, str]:
    """Lấy toàn bộ category từ DB, build map {tên viết thường: shortname}. Tự cập nhật, không hardcode."""
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT shortname, name FROM category")
            rows = cur.fetchall()
        return {r["name"].lower(): r["shortname"] for r in rows if r["name"]}
    except Exception as e:
        print(f"⚠️  Không load được category map: {e}")
        return {}
    finally:
        conn.close()


def create_rag_chain(vectorstore):
    llm = ChatGoogleGenerativeAI(
        model="gemini-flash-lite-latest",   # đổi từ 2.5-flash để đỡ hết quota
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )

    prompt = ChatPromptTemplate.from_template("""
Bạn là trợ lý ảo tư vấn sản phẩm của cửa hàng.
Dựa vào lịch sử trò chuyện và dữ liệu sản phẩm dưới đây để trả lời khách hàng.
Trả lời bằng tiếng Việt, rõ ràng và thân thiện.
Nếu không tìm thấy sản phẩm phù hợp, hãy nói thật thay vì bịa đặt.

QUAN TRỌNG: Hệ thống sẽ TỰ ĐỘNG hiển thị hình ảnh sản phẩm ngay bên dưới câu trả lời của bạn.
Khi khách hỏi về ảnh/hình sản phẩm, đừng nói "tôi không thể hiển thị ảnh" — thay vào đó
hãy trả lời tự nhiên kiểu "Đây là hình ảnh của sản phẩm ... ạ" hoặc "Mời bạn xem ảnh bên dưới nhé".

Khi khách hỏi chi tiết về MỘT sản phẩm cụ thể, hệ thống sẽ TỰ ĐỘNG hiển thị nút/link
"Xem chi tiết & mua hàng" ngay bên dưới câu trả lời — bạn KHÔNG cần tự viết link hay URL
trong câu trả lời của mình, chỉ cần trả lời thông tin sản phẩm bình thường.

Lịch sử trò chuyện:
{chat_history}

Dữ liệu sản phẩm liên quan:
{context}

Câu hỏi hiện tại: {question}
""")

    category_map = _load_category_map()
    pid_to_doc = {
        doc.metadata.get("product_id"): doc
        for doc in vectorstore.docstore._dict.values()
    }

    IMAGE_INTENT_KEYWORDS = ["ảnh", "hình", "photo", "image"]
    NARROW_INTENT_KEYWORDS = ["chỉ", "duy nhất", "mỗi", "riêng", "thôi"]
    IMAGE_FILLER_WORDS = [
        "ảnh của", "hình của", "ảnh", "hình ảnh", "hình",
        "cho tôi xem", "cho xem", "xem thêm", "gửi cho tôi", "gửi", "cho tôi", "xem",
    ]

    def is_image_intent(question: str) -> bool:
        q = question.lower()
        return any(kw in q for kw in IMAGE_INTENT_KEYWORDS)

    def is_narrow_intent(question: str) -> bool:
        """Người dùng muốn chỉ 1 sản phẩm duy nhất, không cần nói 'ảnh'/'hình'."""
        q = question.lower()
        return any(kw in q for kw in NARROW_INTENT_KEYWORDS)

    def clean_query_for_search(question: str) -> str:
        """Bỏ các từ nói về ý định xem ảnh, chỉ giữ lại phần tên sản phẩm để search chính xác hơn."""
        q = question.lower()
        for filler in IMAGE_FILLER_WORDS:
            q = q.replace(filler, "")
        return q.strip(" ?.,")

    def _get_docs(question: str, last_product_ids: list = None):
        query_for_faiss = f"query: {question}"
        q_lower = question.lower()
        last_product_ids = last_product_ids or []

        # 0. Hỏi theo ID cụ thể
        id_match = re.search(
            r'(?:sản phẩm|mã sản phẩm|mã|id)\s*(?:số|id)?\s*[:#]?\s*(\d+)',
            q_lower
        )
        if not id_match:
            bare = re.fullmatch(r'#?\s*(\d+)', q_lower.strip())
            if bare:
                id_match = bare
        if id_match:
            pid = id_match.group(1)
            doc = pid_to_doc.get(pid)
            if doc:
                return [doc]

        narrow = is_narrow_intent(question)
        image_q = is_image_intent(question)

        # 0.5 LUÔN thử match tên sản phẩm chính xác trước, bất kể có từ khóa ảnh/narrow hay không
        cleaned = clean_query_for_search(question)
        if len(cleaned) >= 3:
            name_matched_docs = vectorstore.similarity_search(f"query: {cleaned}", k=5)
            strict_matches = [
                d for d in name_matched_docs
                if cleaned in d.page_content.lower()
            ]
            if strict_matches:
                # Có match tên chính xác -> chỉ trả về đúng 1 sản phẩm khớp nhất,
                # bất kể câu hỏi có ý "chỉ/thôi" hay không
                return strict_matches[:1]

        # 0.6 Không match được tên -> nếu là ý hỏi ảnh, thử bám vào last_product_ids
        if image_q:
            if last_product_ids:
                docs = [pid_to_doc[pid] for pid in last_product_ids if pid in pid_to_doc]
                if docs:
                    return docs[:1] if narrow else docs
            # Không có gì để bám -> trả rỗng thay vì đoán bừa
            return []

        # 1. Shop filter
        shop_match = re.search(r'(?:shop|cửa hàng)\s+([a-zA-Z0-9À-ỹ_\-\s]+?)(?:\s+bán|\?|$)', question, re.IGNORECASE)
        if shop_match:
            shop_target = shop_match.group(1).strip().lower()
            candidate_docs = vectorstore.similarity_search(query=query_for_faiss, k=20)
            matched = [d for d in candidate_docs if shop_target in d.metadata.get("shop_name", "").lower()]
            if matched:
                return matched[:1] if narrow else matched[:5]

        # 2. Category filter
        for cat_name, cat_short in category_map.items():
            if cat_name in q_lower or any(word in q_lower for word in cat_name.split(" & ")):
                docs = vectorstore.similarity_search(query=query_for_faiss, k=8, filter={"category": cat_short})
                if docs:
                    return docs[:1] if narrow else docs
                break

        # 3. Fallback — chỉ chạy khi thực sự không tìm được tên cụ thể nào khớp
        docs = vectorstore.similarity_search(query=query_for_faiss, k=1 if narrow else 3)
        return docs

    # def smart_retrieve_text(inputs: dict) -> str:
    #     docs = _get_docs(inputs["question"], inputs.get("last_product_ids", []))
    #     return "\n\n".join(doc.page_content.replace("passage: ", "") for doc in docs)
    #
    # rag_chain = (
    #     {
    #         "context":      RunnableLambda(smart_retrieve_text),
    #         "question":     lambda x: x["question"],
    #         "chat_history": lambda x: x["chat_history"],
    #     }
    #     | prompt
    #     | llm
    #     | StrOutputParser()
    # )

    def invoke_with_retry(inputs: dict, retries=3, delay=5) -> dict:
        question = inputs["question"]
        last_product_ids = inputs.get("last_product_ids", [])

        docs = _get_docs(question, last_product_ids)
        context = "\n\n".join(doc.page_content.replace("passage: ", "") for doc in docs)

        is_single = len(docs) == 1
        product_url = None

        if is_single:
            doc = docs[0]
            pid = doc.metadata.get("product_id", "")
            all_imgs = doc.metadata.get("images_all", [])
            images = [{"product_id": pid, "url": url} for url in all_imgs if url][:10]
            if pid:
                product_url = f"{FRONTEND_BASE_URL}/product/{pid}"
        else:
            images = [
                {"product_id": doc.metadata.get("product_id", ""), "url": doc.metadata.get("images_url", "")}
                for doc in docs if doc.metadata.get("images_url")
            ][:3]

        chain = prompt | llm | StrOutputParser()
        payload = {**inputs, "context": context}

        for attempt in range(retries):
            try:
                reply = chain.invoke(payload)
                return {
                    "reply": reply,
                    "images": images,
                    "is_single_product": is_single,
                    "product_url": product_url,
                }
            except Exception as e:
                if "503" in str(e) and attempt < retries - 1:
                    time.sleep(delay)
                else:
                    raise

    return invoke_with_retry