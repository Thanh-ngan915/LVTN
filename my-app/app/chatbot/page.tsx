"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./chatbot.module.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Xin chào! Tôi là trợ lý AI của Anvi System. Tôi có thể giúp gì cho bạn hôm nay?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const API_URL = "http://localhost:8080/api/chat";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const autoResize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = storedUser.id || "guest_user";

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Đảm bảo gửi kèm Token nếu người dùng đã đăng nhập
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                /**
                 * SỬA TẠI ĐÂY: Gửi kèm userId
                 * Backend Java nhận Map<String, String> request,
                 * nên cần cả 'message' và 'userId'.
                 */
                body: JSON.stringify({
                    message: trimmed,
                    userId: userId
                }),
            });

            // Kiểm tra nếu response trả về không ok (ví dụ lỗi 403, 500)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            /**
             * LƯU Ý: Đảm bảo tên trường 'reply' khớp với
             * response.put("reply", aiReply) trong Java của bạn.
             */
            const reply = data.reply || data.message || "Xin lỗi, tôi không thể xử lý yêu cầu này.";

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: reply,
                    timestamp: new Date(),
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error); // Debug lỗi ra console
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Lỗi kết nối. Hãy chắc chắn API Gateway (8080) và Service (8086) đang hoạt động.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className={styles.wrapper}>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.glassmorphism}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <div className={styles.botAvatar}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/>
                                </svg>
                            </div>
                            <div>
                                <h1>Anvi Assistant</h1>
                                <span className={styles.statusBadge}>
                  <span className={styles.statusDot}></span>
                  Trực tuyến
                </span>
                            </div>
                        </div>
                        <button
                            className={styles.clearBtn}
                            onClick={() =>
                                setMessages([{
                                    id: "welcome",
                                    role: "assistant",
                                    content: "Cuộc trò chuyện đã được làm mới. Tôi có thể giúp gì cho bạn?",
                                    timestamp: new Date(),
                                }])
                            }
                            title="Xóa lịch sử"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>

                    <div className={styles.messagesArea}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.role === "user" ? styles.userRow : styles.botRow}`}>
                                {msg.role === "assistant" && <div className={styles.avatarSmall}>AI</div>}
                                <div className={styles.bubble}>
                                    <p>{msg.content}</p>
                                    <span className={styles.timestamp}>{formatTime(msg.timestamp)}</span>
                                </div>
                                {msg.role === "user" && (
                                    <div className={`${styles.avatarSmall} ${styles.userAvatarSmall}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className={`${styles.messageRow} ${styles.botRow}`}>
                                <div className={styles.avatarSmall}>AI</div>
                                <div className={`${styles.bubble} ${styles.typingBubble}`}>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                    <span className={styles.dot}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <div className={styles.inputWrapper}>
              <textarea
                  ref={textareaRef}
                  className={styles.chatInput}
                  placeholder="Nhập tin nhắn... (Enter để gửi)"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={loading}
              />
                            <button
                                className={`${styles.sendBtn} ${loading || !input.trim() ? styles.sendBtnDisabled : ""}`}
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                        <p className={styles.hint}>Shift + Enter để xuống dòng</p>
                    </div>
                </div>
            </div>
        </div>
    );
}