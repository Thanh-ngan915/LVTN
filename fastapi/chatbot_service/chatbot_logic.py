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

    # 👇 MỚI: map tên sản phẩm (viết thường, đã chuẩn hoá) -> doc, để match đúng chiều
    # Yêu cầu: metadata phải có field "name" (xem ghi chú build_and_save_index bên vector_db.py)
    name_to_doc = {
        doc.metadata.get("name", "").strip().lower(): doc
        for doc in vectorstore.docstore._dict.values()
        if doc.metadata.get("name") and doc.metadata.get("type") not in ["store", "system_policy"]
    }

    IMAGE_INTENT_KEYWORDS = ["ảnh", "hình", "photo", "image"]
    NARROW_INTENT_KEYWORDS = ["chỉ", "duy nhất", "mỗi", "riêng", "thôi"]
    BUY_INTENT_KEYWORDS = [
        "mua hàng", "đặt hàng", "đặt mua", "link mua", "mua ngay",
        "chốt đơn", "muốn mua", "muốn đặt", "cho tôi mua", "cho mình mua",
    ]
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

    def is_buy_intent(question: str) -> bool:
        """Người dùng có ý định mua/đặt hàng ngay."""
        q = question.lower()
        return any(kw in q for kw in BUY_INTENT_KEYWORDS)

    def clean_query_for_search(question: str) -> str:
        """Bỏ các từ nói về ý định xem ảnh, chỉ giữ lại phần tên sản phẩm để search chính xác hơn."""
        q = question.lower()
        for filler in IMAGE_FILLER_WORDS:
            q = q.replace(filler, "")
        return q.strip(" ?.,")

    def _find_doc_by_name_in_question(q_lower: str):
        """
        Match ĐÚNG CHIỀU: kiểm tra xem tên sản phẩm (ngắn, lấy từ DB) có xuất hiện
        như một đoạn trong câu hỏi của khách (thường dài, kèm giá/mô tả) hay không.
        Ưu tiên tên khớp DÀI NHẤT (cụ thể nhất) nếu có nhiều tên cùng là substring.
        """
        best_doc = None
        best_len = 0
        for prod_name, doc in name_to_doc.items():
            if len(prod_name) >= 3 and (prod_name in q_lower or q_lower in prod_name):
                if len(prod_name) > best_len:
                    best_doc = doc
                    best_len = len(prod_name)
        return best_doc

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
        buy_intent = is_buy_intent(question)

        # 0.4 Ý định mua hàng + chỉ đang bám theo đúng 1 sản phẩm vừa hiển thị trước đó
        # -> ưu tiên chốt luôn sản phẩm đó, kể cả khi tên bị gõ tắt/sai chính tả nhẹ
        if buy_intent and len(last_product_ids) == 1:
            doc = pid_to_doc.get(last_product_ids[0])
            if doc:
                return [doc]

        # 0.5 Match tên sản phẩm: tên (ngắn) có nằm trong câu hỏi (dài) hay không.
        # Đây là bản sửa so với bản cũ (bản cũ kiểm tra ngược chiều nên luôn fail
        # với câu hỏi dài kiểu "bạn cung cấp tôi link mua hàng **Ba lô... Giá:...**").
        name_matched_doc = _find_doc_by_name_in_question(q_lower)
        if name_matched_doc:
            return [name_matched_doc]

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
            
            matched = []
            store_info_docs = []
            
            for d in vectorstore.docstore._dict.values():
                is_store_doc = d.metadata.get("type") == "store"
                
                # Cửa hàng (doc loại store)
                if is_store_doc and shop_target in d.metadata.get("name", "").lower():
                    store_info_docs.append(d)
                
                # Sản phẩm của cửa hàng
                elif not is_store_doc and shop_target in d.metadata.get("shop_name", "").lower():
                    matched.append(d)
            
            # Ưu tiên trả về thông tin cửa hàng kèm theo vài sản phẩm
            final_docs = store_info_docs + matched
            if final_docs:
                return final_docs[:1] if narrow else final_docs[:6]

        # 2. Category filter
        category_keyword_found = False
        for cat_name, cat_short in category_map.items():
            if cat_name in q_lower or any(word in q_lower for word in cat_name.split(" & ")):
                category_keyword_found = True
                docs = vectorstore.similarity_search(query=query_for_faiss, k=8, filter={"category": cat_short})
                if docs:
                    return docs[:1] if narrow else docs
                break

        # 2.5 CONTINUATION FALLBACK: câu hỏi không hề có dấu hiệu tìm sản phẩm MỚI
        # (không match ID, không match tên, không có từ khóa shop, không có từ khóa category)
        # nhưng vẫn đang trong ngữ cảnh 1 sản phẩm cụ thể (last_product_ids) từ lượt trước
        # (vd: "chọn mẫu có dây", "lấy cái đó", "ok chốt vậy" ...).
        # -> Bám tiếp last_product_ids thay vì để tuột xuống semantic search ngẫu nhiên,
        #    tránh trả về ảnh của sản phẩm KHÔNG liên quan (bug đã gặp: hỏi về bông tai
        #    nhưng bị trả về ảnh sổ tay da do fallback k=3 khớp nhầm theo embedding).
        if not shop_match and not category_keyword_found and last_product_ids:
            docs = [pid_to_doc[pid] for pid in last_product_ids if pid in pid_to_doc]
            if docs:
                return docs[:1] if narrow else docs

        # 3. Fallback — chỉ chạy khi thực sự không tìm được gì để bám: không tên,
        # không shop, không category, và cũng không có last_product_ids để nối tiếp
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
        print(">>> BẮT ĐẦU XỬ LÝ YÊU CẦU:", inputs.get("question"))
        question = inputs["question"]
        last_product_ids = inputs.get("last_product_ids", [])

        print(">>> ĐANG GET DOCS...")
        docs = _get_docs(question, last_product_ids)
        print(">>> XONG GET DOCS, TÌM THẤY:", len(docs), "docs")
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
                print(f">>> GỌI GEMINI (LẦN {attempt+1})...")
                reply = chain.invoke(payload)
                print(">>> XONG GEMINI! REPLY:", reply[:50])
                
                # Xử lý thông minh: Nếu lúc đầu lấy 3 sản phẩm (is_single=False),
                # nhưng AI chỉ quyết định tư vấn về 1 sản phẩm duy nhất
                if not is_single:
                    mentioned_docs = [d for d in docs if d.metadata.get("product_id", "") in reply]
                    if len(mentioned_docs) == 1:
                        doc = mentioned_docs[0]
                        pid = doc.metadata.get("product_id", "")
                        all_imgs = doc.metadata.get("images_all", [])
                        images = [{"product_id": pid, "url": url} for url in all_imgs if url][:10]
                        if pid:
                            product_url = f"{FRONTEND_BASE_URL}/product/{pid}"
                            is_single = True

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

    def add_product(doc):
        """Cập nhật pid_to_doc và name_to_doc khi có sản phẩm mới từ Kafka."""
        pid = doc.metadata.get("product_id")
        name = doc.metadata.get("name", "").strip().lower()
        if pid:
            pid_to_doc[pid] = doc
        if name:
            name_to_doc[name] = doc

    def delete_product(pid: str):
        """Xóa sản phẩm khỏi pid_to_doc và name_to_doc."""
        if pid in pid_to_doc:
            doc = pid_to_doc.pop(pid)
            name = doc.metadata.get("name", "").strip().lower()
            if name in name_to_doc:
                del name_to_doc[name]

    invoke_with_retry.add_product = add_product
    invoke_with_retry.delete_product = delete_product
    return invoke_with_retry