'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import styles from '../../chat/chat.module.css';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBnBq7FKeyYlrsUqz968ikv_LyNkxTyJ1s",
    authDomain: "chat-project-7116f.firebaseapp.com",
    projectId: "chat-project-7116f",
    storageBucket: "chat-project-7116f.firebasestorage.app",
    messagingSenderId: "146419170637",
    appId: "1:146419170637:web:d7e19389b944ada0640b04",
    databaseURL: "https://chat-project-7116f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

interface ChatMessage {
    id: string;
    sender: 'customer' | 'shop';
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
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeCustomer = customers.find(c => c.customerId === activeCustomerId) || null;

    // Lấy storeId động từ localStorage hoặc API
    useEffect(() => {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (!stored || !token) { setLoadingStore(false); return; }

        const u = JSON.parse(stored);

        if (u.storeRoleId) {
            setSellerStoreId(u.storeRoleId);
            setLoadingStore(false);
            return;
        }

        fetch(`/api/stores/my-store?userId=${u.userId}`, {
            headers: {
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
            }
        })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
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
        const unsubscribe = onValue(indexRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const customerList: CustomerChannel[] = Object.keys(data).map(customerId => ({
                    customerId,
                    customerName: data[customerId].customerName || `Khách: ${customerId}`,
                    lastMessage: data[customerId].lastMessage || 'Đoạn chat mới...',
                    updatedAt: data[customerId].updatedAt
                        ? new Date(data[customerId].updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        : 'Vừa xong',
                    updatedAtNum: data[customerId].updatedAt ?? 0
                }));
                customerList.sort((a, b) => b.updatedAtNum - a.updatedAtNum);
                setCustomers(customerList);
            } else {
                setCustomers([]);
            }
        });

        return () => unsubscribe();
    }, [sellerStoreId]);

    // Tự động chọn khách đầu tiên
    useEffect(() => {
        if (customers.length > 0 && !activeCustomerId) {
            setActiveCustomerId(customers[0].customerId);
        }
    }, [customers, activeCustomerId]);

    // Lắng nghe tin nhắn của khách đang chọn
    useEffect(() => {
        if (!activeCustomerId || !sellerStoreId) {
            setMessages([]);
            return;
        }

        const roomId = `${activeCustomerId}|${sellerStoreId}`;
        const messagesRef = ref(db, `chats/${roomId}/messages`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const fetchedMessages: ChatMessage[] = Object.keys(data)
                    .sort((a, b) => (data[a]?.createdAt ?? 0) - (data[b]?.createdAt ?? 0))
                    .map(key => ({
                        id: key,
                        sender: data[key].sender as 'customer' | 'shop',
                        text: data[key].text,
                        timestamp: data[key].createdAt
                            ? new Date(data[key].createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : ''
                    }));
                setMessages(fetchedMessages); // ✅ dòng này bị thiếu
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [activeCustomerId, sellerStoreId]);

    // Scroll xuống cuối khi có tin mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeCustomerId || !sellerStoreId) return;

        const roomId = `${activeCustomerId}|${sellerStoreId}`;
        const currentText = newMessage.trim();
        const now = Date.now();
        setNewMessage('');

        try {
            const messagesRef = ref(db, `chats/${roomId}/messages`);
            const newMsgRef = push(messagesRef);
            await set(newMsgRef, {
                sender: 'shop',
                text: currentText,
                createdAt: now
            });

            const indexRef = ref(db, `chatIndex/${sellerStoreId}/${activeCustomerId}`);
            await set(indexRef, {
                lastMessage: currentText,
                updatedAt: now,
                customerName: activeCustomer?.customerName || activeCustomerId
            });
        } catch (error) {
            console.error("Lỗi gửi tin nhắn từ phía Seller:", error);
        }
    };

    // Guard sau tất cả hooks
    if (loadingStore) return <div>Đang tải...</div>;
    if (!sellerStoreId) return <div>Bạn chưa có shop hoặc chưa được duyệt.</div>;

    return (
        <div className={styles.chatPageWrapper}>
            <Header cartUpdateTrigger={0} />
            <div className={styles.chatContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Kênh Người Bán <span>.</span></h2>
                    </div>
                    <div className={styles.channelList}>
                        {customers.length === 0 ? (
                            <p style={{ padding: '16px', fontSize: '13px', color: '#8a8a9a' }}>
                                Chưa có khách nhắn tin...
                            </p>
                        ) : (
                            customers.map((cust) => (
                                <div
                                    key={cust.customerId}
                                    className={`${styles.channelItem} ${activeCustomerId === cust.customerId ? styles.channelActive : ''}`}
                                    onClick={() => setActiveCustomerId(cust.customerId)}
                                >
                                    <div className={styles.avatarPlaceholder}>👤</div>
                                    <div className={styles.channelInfo}>
                                        <div className={styles.channelNameRow}>
                                            <span className={styles.channelName}>{cust.customerName}</span>
                                            <span className={styles.channelTime}>{cust.updatedAt}</span>
                                        </div>
                                        <p className={styles.lastMsg}>{cust.lastMessage}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.chatMain}>
                    {activeCustomer ? (
                        <>
                            <div className={styles.chatMainHeader}>
                                <div className={styles.activeShopInfo}>
                                    <div className={styles.activeAvatar}>👤</div>
                                    <div>
                                        <h3 className={styles.activeShopName}>{activeCustomer.customerName}</h3>
                                        <p className={styles.activeShopStatus} style={{ color: '#e8572a' }}>
                                            Đang kết nối hội thoại
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.messageBox}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender === 'shop';
                                    return (
                                        <div key={msg.id} className={`${styles.msgRow} ${isMe ? styles.rowMe : styles.rowShop}`}>
                                            <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleShop}`}>
                                                <p className={styles.msgText}>{msg.text}</p>
                                                <span className={styles.msgTime}>{msg.timestamp}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className={styles.inputArea}>
                                <input
                                    type="text"
                                    placeholder="Phản hồi đến khách hàng..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className={styles.chatInput}
                                />
                                <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>
                                    Gửi phản hồi
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.emptyChat}>
                            <span className={styles.emptyIcon}>📥</span>
                            <p>Không có cuộc trò chuyện nào đang hoạt động</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}