'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import styles from './FloatingChatbot.module.css';

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const API_URL = "http://localhost:8080/api/chat";
    const userId = "user-1766022973"; // Nên đồng bộ với userId bên trang chính

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, userId, sessionId }),
            });

            const data = await response.json();

            if (!sessionId && data.sessionId) {
                setSessionId(data.sessionId);
            }

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply
            }]);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className={styles.wrapper}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <span className={styles.dotOnline}></span>
                            <span>Trợ lý ảo ANVI</span>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className={styles.chatBody}>
                        {messages.length === 0 && (
                            <p className={styles.welcomeText}>Chào bạn! ANVI có thể giúp gì cho bạn hôm nay?</p>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.botRow}`}>
                                <div className={styles.bubble}>{msg.content}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className={styles.botRow}>
                                <div className={styles.typing}><span>.</span><span>.</span><span>.</span></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSend} disabled={loading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <button className={styles.fab} onClick={() => setIsOpen(!isOpen)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="8" cy="16" r="1"></circle>
                    <circle cx="16" cy="16" r="1"></circle>
                    <path d="M12 11V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"></path>
                </svg>
            </button>
        </div>
    );
}