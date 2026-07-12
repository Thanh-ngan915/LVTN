import os
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
    global vector_db, rag_chain
    consumer = AIOKafkaConsumer(
        "product-created",
        bootstrap_servers=os.getenv("KAFKA_BROKER", "localhost:9092"),
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
            
            action = data.get("action", "CREATE")
            pid = str(data.get("id"))
            name = data.get("name", "")
            desc = data.get("description", "")
            cat = data.get("categoryName", "")
            image_urls = data.get("imageUrls") or []
            thumb = image_urls[0] if image_urls else ""
            
            print(f"Chatbot nhan event: {action} - {pid} - {name} ({len(image_urls)} anh)")
            
            if not vector_db:
                continue
                
            # Hàm phụ để tìm internal ID trong FAISS
            def get_internal_id(product_id_str):
                for internal_id, document in vector_db.docstore._dict.items():
                    if document.metadata.get("product_id") == product_id_str:
                        return internal_id
                return None

            if action in ["UPDATE", "DELETE"]:
                # Xóa khỏi FAISS
                internal_id = get_internal_id(pid)
                if internal_id:
                    vector_db.delete([internal_id])
                    print(f"Da xoa doc cu cua san pham {pid} khoi FAISS")
                # Xóa khỏi bảng tra cứu nhanh
                if rag_chain and hasattr(rag_chain, 'delete_product'):
                    rag_chain.delete_product(pid)

            if action in ["CREATE", "UPDATE"]:
                clean_text = (
                    f"passage: Mã sản phẩm (ID): {pid}. "
                    f"Tên sản phẩm: {name}. "
                    f"Danh mục: {cat}. "
                    f"Mô tả: {desc}."
                )
                meta_data = {
                    "product_id": pid,
                    "name": name,
                    "category": cat,
                    "status": "active",
                    "images_url": thumb,
                    "images_all": image_urls,
                    "shop_id": "",
                    "shop_name": "Không rõ",
                }
                doc = Document(page_content=clean_text, metadata=meta_data)
                vector_db.add_documents([doc])
                if rag_chain and hasattr(rag_chain, 'add_product'):
                    rag_chain.add_product(doc)
                print(f"Da them san pham {pid} vao FAISS index trong bo nho!")
            
            # LƯU XUỐNG Ổ CỨNG ẢO
            from shared.vector_db import INDEX_PATH
            vector_db.save_local(INDEX_PATH)
            print(f"Da save_local xuong Persistent Volume: {INDEX_PATH}")
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
    uvicorn.run(app, host="0.0.0.0", port=8000)