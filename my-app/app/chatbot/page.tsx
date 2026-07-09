"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./chatbot.module.css";

interface ImageItem {
    product_id: string;
    url: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    images?: ImageItem[];
    isSingleProduct?: boolean;
    productUrl?: string | null;
}

interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
}

interface BackendMessage {
    id: string | number;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
    images?: ImageItem[];
    is_single_product?: boolean;
    product_url?: string | null;
}

function ProductGallery({ images }: { images: ImageItem[] }) {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <div style={{ marginTop: "8px", maxWidth: "280px" }}>
            <img
                src={images[activeIdx].url}
                alt={`Sản phẩm ${images[activeIdx].product_id}`}
                style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                }}
            />
            {images.length > 1 && (
                <div style={{ display: "flex", gap: "6px", marginTop: "6px", overflowX: "auto" }}>
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img.url}
                            alt={`Ảnh ${idx + 1}`}
                            onClick={() => setActiveIdx(idx)}
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                cursor: "pointer",
                                flexShrink: 0,
                                border: idx === activeIdx ? "2px solid #6366f1" : "2px solid transparent",
                                opacity: idx === activeIdx ? 1 : 0.6,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

import Header from '../components/Header';
import pageStyles from '../page.module.css';

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [lastProductIds, setLastProductIds] = useState<string[]>([]);

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
                id: String(m.id),
                role: m.role,
                content: m.content,
                timestamp: new Date(m.createdAt),
                images: m.images || [],
                isSingleProduct: m.is_single_product ?? false,
                productUrl: m.product_url ?? null,
            }));
            setMessages(formattedMessages);

            const lastAssistantWithImages = [...formattedMessages]
                .reverse()
                .find((m) => m.role === "assistant" && m.images && m.images.length > 0);
            setLastProductIds(
                lastAssistantWithImages?.images?.map((img) => img.product_id) || []
            );
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
                body: JSON.stringify({
                    message: trimmed,
                    userId,
                    sessionId,
                    last_product_ids: lastProductIds,
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (!sessionId && data.sessionId) {
                setSessionId(data.sessionId);
                fetchSessions();
            }

            const newImages: ImageItem[] = data.images || [];

            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply,
                timestamp: new Date(),
                images: newImages,
                isSingleProduct: data.is_single_product ?? false,
                productUrl: data.product_url ?? null,
            }]);

            if (newImages.length > 0) {
                const uniqueIds = Array.from(new Set(newImages.map((img) => img.product_id)));
                setLastProductIds(uniqueIds);
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sid: string) => {
        e.stopPropagation();

        const confirmed = window.confirm("Bạn có chắc muốn xóa đoạn chat này không?");
        if (!confirmed) return;

        try {
            const res = await fetch(`${API_URL}/sessions/${sid}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setSessions((prev) => prev.filter((s) => s.id !== sid));

            if (sessionId === sid) {
                setMessages([]);
                setSessionId(null);
                setLastProductIds([]);
            }
        } catch (error) {
            console.error("Lỗi xóa đoạn chat:", error);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
        setLastProductIds([]);
    };

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages]);

    const handleSearch = (keyword: string) => {
        window.location.href = `/?search=${encodeURIComponent(keyword)}`;
    };

    return (
        <div className={pageStyles.page}>
            <Header onSearch={handleSearch} />
            <main className={pageStyles.main} style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', flex: 1 }}>

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
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                            >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📂 {s.title || "Cuộc trò chuyện mới"}
            </span>
                                <button
                                    onClick={(e) => handleDeleteSession(e, s.id)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "rgba(255,255,255,0.5)",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                        padding: "2px 6px",
                                        flexShrink: 0,
                                    }}
                                    title="Xóa đoạn chat"
                                >
                                    🗑️
                                </button>
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
                            <div style={{textAlign: 'center', marginTop: '40px', color: '#888'}}>
                                <p>Hôm nay bạn cần trợ giúp gì nào? 😊</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.role === "user" ? styles.userRow : styles.botRow}`}>
                                <div className={styles.bubble}>
                                    <p>{msg.content}</p>
                                    {msg.images && msg.images.length > 0 && (
                                        msg.isSingleProduct ? (
                                            <ProductGallery images={msg.images} />
                                        ) : (
                                            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                                                {msg.images.map((img: ImageItem, idx: number) => (
                                                    <img
                                                        key={`${img.product_id}-${idx}`}
                                                        src={img.url}
                                                        alt={`Sản phẩm ${img.product_id}`}
                                                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    )}
                                    {msg.isSingleProduct && msg.productUrl && (
                                        <a
                                        href={msg.productUrl}
                                        style={{
                                        display: "inline-block",
                                        marginTop: "10px",
                                        padding: "8px 16px",
                                        backgroundColor: "#6366f1",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        textDecoration: "none",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                    }}
                                        >
                                        🛒 Xem chi tiết & mua hàng
                                        </a>
                                        )}
                                </div>
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
            </main>
            <footer className={pageStyles.footer} id="site-footer">
                <div className={pageStyles.footerInner}>
                    <div className={pageStyles.footerBrand}>
                        <span className={pageStyles.footerLogo}>✦ ANVI SHOP</span>
                        <p className={pageStyles.footerDesc}>
                            Thời trang chất lượng cao, phong cách đa dạng, giá cả hợp lý.
                        </p>
                    </div>
                    <div className={pageStyles.footerLinks}>
                        <h4>Hỗ trợ</h4>
                        <a href="#">Chính sách đổi trả</a>
                        <a href="#">Hướng dẫn mua hàng</a>
                        <a href="#">Liên hệ</a>
                    </div>
                    <div className={pageStyles.footerLinks}>
                        <h4>Theo dõi</h4>
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">TikTok</a>
                    </div>
                </div>
                <div className={pageStyles.footerBottom}>
                    <span>© 2026 ANVI Shop. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}