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
    history_data = payload.get("history", [])
    formatted_history = ""
    for msg in history_data:
        role = "Khách" if msg['role'] == "user" else "AI"
        formatted_history += f"{role}: {msg['content']}\n"
    try:
        response = rag_chain.invoke({
            "question": message,
            "chat_history": formatted_history
        })
        return {"reply": response, "status": "success"}
    except Exception as e:
        return {"reply": f"Lỗi xử lý AI: {str(e)}", "status": "error"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)