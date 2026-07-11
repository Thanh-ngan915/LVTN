import json
import asyncio
from fastapi import FastAPI, Body
from shared.vector_db import load_vector_db
from chatbot_service.chatbot_logic import create_rag_chain
import uvicorn
from contextlib import asynccontextmanager
from aiokafka import AIOKafkaConsumer
from langchain_core.documents import Document

vector_db = None
rag_chain = None

async def consume_product_events():
    global vector_db
    consumer = AIOKafkaConsumer(
        "product-created",
        bootstrap_servers="localhost:9092",
        group_id="chatbot-dynamic-updater",
        auto_offset_reset="latest",
        value_deserializer=lambda x: json.loads(x.decode("utf-8")) if x else None
    )
    try:
        await consumer.start()
        print("Chatbot Kafka Consumer connected!")
        async for msg in consumer:
            data = msg.value
            if not data or "id" not in data:
                continue
            pid = data.get("id")
            name = data.get("name", "")
            desc = data.get("description", "")
            cat = data.get("categoryName", "")
            print(f"Chatbot nhan san pham moi: {pid} - {name}")
            
            clean_text = (
                f"passage: Mã sản phẩm (ID): {pid}. "
                f"Tên sản phẩm: {name}. "
                f"Danh mục: {cat}. "
                f"Mô tả: {desc}."
            )
            meta_data = {
                "product_id": str(pid),
                "name": name,
                "category": cat,
                "status": "active",
                "images_url": "",
                "images_all": [],
                "shop_id": "",
                "shop_name": "Không rõ",
            }
            if vector_db:
                vector_db.add_documents([Document(page_content=clean_text, metadata=meta_data)])
                print(f"Da them san pham {pid} vao FAISS index trong bo nho!")
    except Exception as e:
        print(f"Chatbot Kafka Consumer error: {e}")
    finally:
        await consumer.stop()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global vector_db, rag_chain
    vector_db = load_vector_db()
    rag_chain = create_rag_chain(vector_db)
    consumer_task = asyncio.create_task(consume_product_events())
    yield
    consumer_task.cancel()

app = FastAPI(title="Etsy AI Chatbot API", lifespan=lifespan)

@app.post("/api/ai/chat")
async def chat_endpoint(payload: dict = Body(...)):
    message = payload.get("message", "")
    history_data = payload.get("history", [])
    last_product_ids = payload.get("last_product_ids", [])

    formatted_history = ""
    for msg in history_data:
        role = "Khách" if msg['role'] == "user" else "AI"
        formatted_history += f"{role}: {msg['content']}\n"

    try:
        result = rag_chain({
            "question": message,
            "chat_history": formatted_history,
            "last_product_ids": last_product_ids,
        })
        return {
            "reply": result["reply"],
            "images": result["images"],
            "is_single_product": result.get("is_single_product", False),
            "product_url": result.get("product_url"),
            "status": "success"
        }
    except Exception as e:
        if "503" in str(e):
            return {
                "reply": "Hệ thống AI đang bận, vui lòng thử lại sau nhé! 🙏",
                "images": [], "is_single_product": False, "product_url": None, "status": "error"
            }
        return {
            "reply": f"Lỗi xử lý AI: {str(e)}",
            "images": [], "is_single_product": False, "product_url": None, "status": "error"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)