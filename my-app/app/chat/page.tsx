'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import styles from './chat.module.css';

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

interface ChatChannel {
    storeId: string;
    storeName: string;
    lastMessage: string;
    updatedAt: string;
}

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryStoreId = searchParams.get('storeId') || 'store_001';
    const queryStoreName = searchParams.get('storeName') || 'Cửa Hàng';

    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const [activeChannel, setActiveChannel] = useState<ChatChannel | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) {
                const u = JSON.parse(stored);
                const name = u.username || u.name || u.userId || 'guest';
                // Reset state khi đổi user
                setChannels([]);
                setMessages([]);
                setActiveChannel(null);
                setUsername(name);
            }
        }
    }, []);

    useEffect(() => {
        setChannels((prev) => {
            if (prev.some(c => c.storeId === queryStoreId)) return prev;
            return [{
                storeId: queryStoreId,
                storeName: queryStoreName,
                lastMessage: 'Bắt đầu đoạn chat...',
                updatedAt: 'Vừa xong'
            }, ...prev];
        });
    }, [queryStoreId, queryStoreName]);

    useEffect(() => {
        const target = channels.find(c => c.storeId === queryStoreId);
        if (target) setActiveChannel(target);
    }, [queryStoreId, channels]);

    useEffect(() => {
        if (!activeChannel || !username) return;

        const roomId = `${username}|${activeChannel.storeId}`;
        const messagesRef = ref(db, `chats/${roomId}/messages`);

        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const fetchedMessages: ChatMessage[] = Object.keys(data)
                    .sort((a, b) => (data[a]?.createdAt ?? 0) - (data[b]?.createdAt ?? 0)) // ✅ sort trước
                    .map(key => ({
                        id: key,
                        sender: data[key].sender as 'customer' | 'shop',
                        text: data[key].text,
                        timestamp: data[key].createdAt
                            ? new Date(data[key].createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : ''
                    }));
                setMessages(fetchedMessages);
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [activeChannel, username]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChannel || !username) return;

        const roomId = `${username}|${activeChannel.storeId}`;
        const currentText = newMessage.trim();
        const now = Date.now();
        setNewMessage('');

        try {
            const messagesRef = ref(db, `chats/${roomId}/messages`);
            const newMsgRef = push(messagesRef);
            await set(newMsgRef, {
                sender: 'customer',
                text: currentText,
                createdAt: now
            });

            // Ghi index để seller nhận biết room — đây là fix chính
            const indexRef = ref(db, `chatIndex/${activeChannel.storeId}/${username}`);
            await set(indexRef, {
                lastMessage: currentText,
                updatedAt: now,
                customerName: username,
                storeName: activeChannel.storeName
            });

            setChannels(prev => prev.map(c =>
                c.storeId === activeChannel.storeId
                    ? { ...c, lastMessage: currentText, updatedAt: 'Vừa xong' }
                    : c
            ));
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className={styles.chatPageWrapper}>
            <Header cartUpdateTrigger={0} />
            <div className={styles.chatContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Trò chuyện <span>.</span></h2>
                    </div>
                    <div className={styles.channelList}>
                        {channels.map((channel) => (
                            <div
                                key={channel.storeId}
                                className={`${styles.channelItem} ${activeChannel?.storeId === channel.storeId ? styles.channelActive : ''}`}
                                onClick={() => router.push(`/chat?storeId=${channel.storeId}&storeName=${encodeURIComponent(channel.storeName)}`)}
                            >
                                <div className={styles.avatarPlaceholder}>🏪</div>
                                <div className={styles.channelInfo}>
                                    <div className={styles.channelNameRow}>
                                        <span className={styles.channelName}>{channel.storeName}</span>
                                        <span className={styles.channelTime}>{channel.updatedAt}</span>
                                    </div>
                                    <p className={styles.lastMsg}>{channel.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.chatMain}>
                    {activeChannel ? (
                        <>
                            <div className={styles.chatMainHeader}>
                                <div className={styles.activeShopInfo}>
                                    <div className={styles.activeAvatar}>🏪</div>
                                    <div>
                                        <h3 className={styles.activeShopName}>{activeChannel.storeName}</h3>
                                        <p className={styles.activeShopStatus}>Hỗ trợ trực tuyến</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.messageBox}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender === 'customer';
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
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className={styles.chatInput}
                                />
                                <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>Gửi</button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.emptyChat}>
                            <span className={styles.emptyIcon}>💬</span>
                            <p>Chọn một Shop để bắt đầu trò chuyện</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function CustomerChatPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Đang tải tin nhắn...</div>}>
            <ChatContent />
        </Suspense>
    );
}