import os
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

load_dotenv()

def create_rag_chain(vectorstore):
    # Khởi tạo LLM Gemini
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

    # Prompt Template từ file code của bạn
    prompt = ChatPromptTemplate.from_template("""
    Bạn là trợ lý ảo tư vấn sản phẩm Etsy. 
    Dựa vào lịch sử trò chuyện và dữ liệu sản phẩm dưới đây để trả lời khách hàng.

    Lịch sử trò chuyện:
    {chat_history}

    Dữ liệu sản phẩm liên quan:
    {context}

    Câu hỏi hiện tại: {question}
    """)

    # Hàm truy vấn thông minh (Smart Retrieve) từ code Colab
    def smart_retrieve(question):
        # Nhận diện tên shop từ câu hỏi
        match = re.search(r'(?:shop|cửa hàng)\s+([a-zA-Z0-9_\-\s]+?)(?:\s+sell|\?|$)', question, re.IGNORECASE)
        query_for_faiss = f"query: {question}"

        # Giảm k từ 5 xuống 3 để tránh quá tải token (nguyên nhân gây lỗi 429)
        k_neighbors = 3

        if match:
            shop_name = match.group(1).strip()
            docs = vectorstore.similarity_search(
                query=query_for_faiss,
                k=k_neighbors,
                filter={"shop_name": shop_name}
            )
        else:
            docs = vectorstore.similarity_search(query=query_for_faiss, k=k_neighbors)

        # Trả về nội dung thô để LLM xử lý
        return "\n\n".join(doc.page_content for doc in docs)

    # Xây dựng Chain
    rag_chain = (
            {
                "context": lambda x: smart_retrieve(x["question"]),
                "question": lambda x: x["question"],
                "chat_history": lambda x: x["chat_history"]
            }
            | prompt
            | llm
            | StrOutputParser()
    )
    return rag_chain