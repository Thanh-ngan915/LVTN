import os
import time
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

load_dotenv()


def create_rag_chain(vectorstore):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY"),
    )

    prompt = ChatPromptTemplate.from_template("""
Bạn là trợ lý ảo tư vấn sản phẩm của cửa hàng.
Dựa vào lịch sử trò chuyện và dữ liệu sản phẩm dưới đây để trả lời khách hàng.
Trả lời bằng tiếng Việt, rõ ràng và thân thiện.
Nếu không tìm thấy sản phẩm phù hợp, hãy nói thật thay vì bịa đặt.

Lịch sử trò chuyện:
{chat_history}

Dữ liệu sản phẩm liên quan:
{context}

Câu hỏi hiện tại: {question}
""")

    category_keywords = {
        "vòng tay": "vong_tay",
        "dây chuyền": "day_chuyen",
        "vòng cổ":  "day_chuyen",
        "trang sức": "trang_suc",
        "túi":       "tui_vi",
        "balo":      "tui_vi",
        "quần áo":   "quan_ao",
        "áo":        "ao",
        "quần":      "quan",
        "giày":      "giay",
        "nội thất":  "trang_tri_noi_that",
        "nến":       "nha_cua_cuoc_song",
        "thú cưng":  "do_dung_cho_thu_cung",
    }

    # Tách riêng: retrieve docs (trả về docs thô)
    def _get_docs(question: str):
        query_for_faiss = f"query: {question}"
        filter_meta = None
        q_lower = question.lower()
        for kw, cat_short in category_keywords.items():
            if kw in q_lower:
                filter_meta = {"category": cat_short}
                break

        if filter_meta:
            docs = vectorstore.similarity_search(query=query_for_faiss, k=3, filter=filter_meta)
            if not docs:
                docs = vectorstore.similarity_search(query=query_for_faiss, k=3)
        else:
            docs = vectorstore.similarity_search(query=query_for_faiss, k=3)

        return docs

    # Cho LangChain chain: chỉ trả về string context
    def smart_retrieve_text(inputs: dict) -> str:
        docs = _get_docs(inputs["question"])
        return "\n\n".join(
            doc.page_content.replace("passage: ", "")  # KHÔNG thêm URL vào đây
            for doc in docs
        )

    rag_chain = (
        {
            "context":      RunnableLambda(smart_retrieve_text),
            "question":     lambda x: x["question"],
            "chat_history": lambda x: x["chat_history"],
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    # Hàm invoke công khai: retry + trả về cả images
    def invoke_with_retry(inputs: dict, retries=3, delay=5) -> dict:
        docs = _get_docs(inputs["question"])

        # Chỉ lấy ảnh của sản phẩm liên quan nhất (doc[0])
        images = []
        if docs:
            top_doc = docs[0]
            url = top_doc.metadata.get("images_url", "")
            pid = top_doc.metadata.get("product_id", "")
            if url:
                images = [{"product_id": pid, "url": url}]

        for attempt in range(retries):
            try:
                reply = rag_chain.invoke(inputs)
                images = [
                    {"product_id": doc.metadata.get("product_id", ""), "url": doc.metadata.get("images_url", "")}
                    for doc in docs
                    if doc.metadata.get("images_url") and doc.metadata.get("product_id", "") in reply
                ]
                return {"reply": reply, "images": images}
            except Exception as e:
                if "503" in str(e) and attempt < retries - 1:
                    time.sleep(delay)
                else:
                    raise

    return invoke_with_retry