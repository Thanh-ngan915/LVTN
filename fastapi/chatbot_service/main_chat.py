from fastapi import FastAPI, Body
from shared.vector_db import load_vector_db
from chatbot_service.chatbot_logic import create_rag_chain
import uvicorn

app = FastAPI(title="Etsy AI Chatbot API")

# Load DB và Chain khi khởi động (Singleton)
vector_db = load_vector_db()
rag_chain = create_rag_chain(vector_db)

@app.post("/api/ai/chat")
async def chat_endpoint(payload: dict = Body(...)):
    """Spring Boot sẽ gọi endpoint này"""
    message = payload.get("message", "")
    try:
        response = rag_chain.invoke(message)
        return {"reply": response, "status": "success"}
    except Exception as e:
        return {"reply": f"Lỗi: {str(e)}", "status": "error"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)