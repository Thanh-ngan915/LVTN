"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./chatbot.module.css";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
}

interface BackendMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const API_URL = "http://localhost:8080/api/chat";
    const userId = "user-1766022973";

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${API_URL}/sessions?userId=${userId}`);
            if (!res.ok) return;
            const data: ChatSession[] = await res.json();
            setSessions(data);
        } catch (error) {
            console.error("Lỗi lấy sessions:", error);
        }
    };

    const loadSessionMessages = async (sid: string) => {
        setLoading(true);
        setSessionId(sid);
        try {
            const res = await fetch(`${API_URL}/sessions/${sid}/messages`);
            if (!res.ok) return;
            const data: BackendMessage[] = await res.json();

            const formattedMessages: Message[] = data.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: new Date(m.createdAt)
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Lỗi lấy tin nhắn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const autoResize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed, userId, sessionId }),
            });

            const data = await response.json();

            // Cập nhật sessionID nếu là cuộc hội thoại mới
            if (!sessionId && data.sessionId) {
                setSessionId(data.sessionId);
                fetchSessions(); // Tải lại Sidebar để hiện session mới
            }

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
            </div>

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <button className={styles.newChatBtn} onClick={handleNewChat}>
                            + Đoạn chat mới
                        </button>
                    </div>
                    <div className={styles.sessionList}>
                        {sessions.map((s) => (
                            <div
                                key={s.id}
                                className={`${styles.sessionItem} ${sessionId === s.id ? styles.activeSession : ""}`}
                                onClick={() => loadSessionMessages(s.id)}
                            >
                                📂 {s.title || "Cuộc trò chuyện mới"}
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={styles.glassmorphism}>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <div className={styles.botAvatar}>AI</div>
                            <div>
                                <h1>Etsy Assistant</h1>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusDot}></span> Trực tuyến
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.messagesArea}>
                        {messages.length === 0 && (
                            <div style={{textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.4)'}}>
                                <p>Hôm nay bạn cần trợ giúp gì nào? 😊</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.role === "user" ? styles.userRow : styles.botRow}`}>
                                <div className={styles.bubble}><p>{msg.content}</p></div>
                            </div>
                        ))}
                        {loading && (
                            <div className={`${styles.messageRow} ${styles.botRow}`}>
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
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                                onKeyDown={handleKeyDown}
                                rows={1}
                            />
                            <button
                                className={`${styles.sendBtn} ${!input.trim() || loading ? styles.sendBtnDisabled : ""}`}
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}