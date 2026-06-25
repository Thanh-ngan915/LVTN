"use client";

import { useState, useEffect, useRef } from "react";
import StoreSidebar from "../../components/StoreSidebar";
import styles from "./chat.module.css";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBnBq7FKeyYlrsUqz968ikv_LyNkxTyJ1s",
    authDomain: "chat-project-7116f.firebaseapp.com",
    projectId: "chat-project-7116f",
    storageBucket: "chat-project-7116f.firebasestorage.app",
    messagingSenderId: "146419170637",
    appId: "1:146419170637:web:d7e19389b944ada0640b04",
    databaseURL: "https://chat-project-7116f-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

interface ChatMessage {
    id: string;
    sender: "customer" | "shop";
    text: string;
    timestamp: string;
}

interface CustomerChannel {
    customerId: string;
    customerName: string;
    lastMessage: string;
    updatedAt: string;
    updatedAtNum: number;
}

export default function SellerChatPage() {
    const [sellerStoreId, setSellerStoreId] = useState<string | null>(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const [customers, setCustomers] = useState<CustomerChannel[]>([]);
    const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeCustomer = customers.find((c) => c.customerId === activeCustomerId) || null;

    // Lấy storeId từ localStorage hoặc API
    useEffect(() => {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!stored || !token) { setLoadingStore(false); return; }
        const u = JSON.parse(stored);
        if (u.storeRoleId) { setSellerStoreId(u.storeRoleId); setLoadingStore(false); return; }

        fetch(`/api/stores/my-store?userId=${u.userId}`, {
            headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((store: { id: string }) => {
                setSellerStoreId(store.id);
                localStorage.setItem("user", JSON.stringify({ ...u, storeRoleId: store.id }));
            })
            .catch(() => console.error("Không lấy được storeId"))
            .finally(() => setLoadingStore(false));
    }, []);

    // Lắng nghe danh sách khách từ chatIndex
    useEffect(() => {
        if (!sellerStoreId) return;
        const indexRef = ref(db, `chatIndex/${sellerStoreId}`);
        return onValue(indexRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: CustomerChannel[] = Object.keys(data).map((customerId) => ({
                    customerId,
                    customerName: data[customerId].customerName || `Khách: ${customerId}`,
                    lastMessage: data[customerId].lastMessage || "Đoạn chat mới...",
                    updatedAt: data[customerId].updatedAt
                        ? new Date(data[customerId].updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                        : "Vừa xong",
                    updatedAtNum: data[customerId].updatedAt ?? 0,
                }));
                list.sort((a, b) => b.updatedAtNum - a.updatedAtNum);
                setCustomers(list);
            } else {
                setCustomers([]);
            }
        });
    }, [sellerStoreId]);

    // Tự động chọn khách đầu tiên
    useEffect(() => {
        if (customers.length > 0 && !activeCustomerId) {
            setActiveCustomerId(customers[0].customerId);
        }
    }, [customers, activeCustomerId]);

    // Lắng nghe tin nhắn
    useEffect(() => {
        if (!activeCustomerId || !sellerStoreId) { setMessages([]); return; }
        const roomId = `${activeCustomerId}|${sellerStoreId}`;
        return onValue(ref(db, `chats/${roomId}/messages`), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const fetched: ChatMessage[] = Object.keys(data)
                    .sort((a, b) => (data[a]?.createdAt ?? 0) - (data[b]?.createdAt ?? 0))
                    .map((key) => ({
                        id: key,
                        sender: data[key].sender as "customer" | "shop",
                        text: data[key].text,
                        timestamp: data[key].createdAt
                            ? new Date(data[key].createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                            : "",
                    }));
                setMessages(fetched);
            } else {
                setMessages([]);
            }
        });
    }, [activeCustomerId, sellerStoreId]);

    // Scroll xuống cuối
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeCustomerId || !sellerStoreId) return;
        const roomId = `${activeCustomerId}|${sellerStoreId}`;
        const currentText = newMessage.trim();
        const now = Date.now();
        setNewMessage("");
        try {
            const newMsgRef = push(ref(db, `chats/${roomId}/messages`));
            await set(newMsgRef, { sender: "shop", text: currentText, createdAt: now });
            await set(ref(db, `chatIndex/${sellerStoreId}/${activeCustomerId}`), {
                lastMessage: currentText,
                updatedAt: now,
                customerName: activeCustomer?.customerName || activeCustomerId,
            });
        } catch (err) {
            console.error("Lỗi gửi tin nhắn:", err);
        }
    };

    if (loadingStore) return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                <div className={styles.loadingWrap}>
                    <div className={styles.spinner} />
                    <p>Đang tải kênh chat…</p>
                </div>
            </main>
        </div>
    );

    if (!sellerStoreId) return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                <div className={styles.emptyWrap}>
                    <span className={styles.emptyIcon}>🏪</span>
                    <p>Bạn chưa có shop hoặc chưa được duyệt.</p>
                </div>
            </main>
        </div>
    );

    return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Tin nhắn</h1>
                        <p className={styles.pageSubtitle}>Phản hồi khách hàng của bạn</p>
                    </div>
                    <div className={styles.statsChip}>
                        <span>💬</span>
                        <span>{customers.length} cuộc trò chuyện</span>
                    </div>
                </div>

                {/* Chat layout */}
                <div className={styles.chatLayout}>
                    {/* Sidebar danh sách khách */}
                    <div className={styles.customerList}>
                        <div className={styles.customerListHeader}>
                            <span className={styles.cardTitle}>Khách hàng</span>
                            {customers.length > 0 && (
                                <span className={styles.countBadge}>{customers.length}</span>
                            )}
                        </div>

                        {customers.length === 0 ? (
                            <div className={styles.emptyList}>
                                <span>📭</span>
                                <p>Chưa có khách nhắn tin</p>
                            </div>
                        ) : (
                            customers.map((cust) => (
                                <button
                                    key={cust.customerId}
                                    className={`${styles.customerItem} ${activeCustomerId === cust.customerId ? styles.customerItemActive : ""}`}
                                    onClick={() => setActiveCustomerId(cust.customerId)}
                                >
                                    <div className={styles.customerAvatar}>
                                        {cust.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={styles.customerInfo}>
                                        <div className={styles.customerNameRow}>
                                            <span className={styles.customerName}>{cust.customerName}</span>
                                            <span className={styles.customerTime}>{cust.updatedAt}</span>
                                        </div>
                                        <p className={styles.customerLastMsg}>{cust.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Khung chat */}
                    <div className={styles.chatPane}>
                        {activeCustomer ? (
                            <>
                                {/* Header */}
                                <div className={styles.chatHeader}>
                                    <div className={styles.chatHeaderAvatar}>
                                        {activeCustomer.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className={styles.chatHeaderName}>{activeCustomer.customerName}</p>
                                        <p className={styles.chatHeaderStatus}>
                                            <span className={styles.onlineDot} /> Đang hoạt động
                                        </p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className={styles.messageBox}>
                                    {messages.length === 0 && (
                                        <div className={styles.emptyMessages}>
                                            <span>💬</span>
                                            <p>Bắt đầu cuộc trò chuyện</p>
                                        </div>
                                    )}
                                    {messages.map((msg) => {
                                        const isMe = msg.sender === "shop";
                                        return (
                                            <div key={msg.id} className={`${styles.msgRow} ${isMe ? styles.rowMe : styles.rowThem}`}>
                                                {!isMe && (
                                                    <div className={styles.msgAvatar}>
                                                        {activeCustomer.customerName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem}`}>
                                                    <p className={styles.msgText}>{msg.text}</p>
                                                    <span className={styles.msgTime}>{msg.timestamp}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} className={styles.inputArea}>
                                    <input
                                        type="text"
                                        placeholder="Nhập phản hồi cho khách..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className={styles.chatInput}
                                    />
                                    <button
                                        type="submit"
                                        className={styles.sendBtn}
                                        disabled={!newMessage.trim()}
                                    >
                                        Gửi
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className={styles.emptyChat}>
                                <span className={styles.emptyChatIcon}>💬</span>
                                <p>Chọn một khách để bắt đầu phản hồi</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}