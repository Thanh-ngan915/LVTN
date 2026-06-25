"use client";

import { useState, useRef, useEffect } from "react";
import { useAdminActivity, ActivityLog } from "./AdminActivityContext";
import styles from "./AdminNotificationBell.module.css";

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
}

function categoryIcon(category: string): string {
    const map: Record<string, string> = {
        user: "👤",
        shop: "🏪",
        product: "📦",
        withdrawal: "💸",
        complaint: "⚖️",
        revenue: "💰",
        general: "🔧",
    };
    return map[category] ?? "🔔";
}

export default function AdminNotificationBell() {
    const { logs, unreadCount, markAllAsRead, clearAll } = useAdminActivity();
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

    // Tính vị trí fixed panel từ button's bounding rect
    const handleOpen = () => {
        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const panelWidth = 360;
            let left = rect.right - panelWidth;
            // Đảm bảo không bị cắt bởi màn hình
            if (left < 8) left = 8;
            if (left + panelWidth > window.innerWidth - 8) left = window.innerWidth - panelWidth - 8;
            setPanelPos({ top: rect.bottom + 8, left });
        }
        setOpen(prev => !prev);
    };

    // Đóng khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
        <>
            {/* ─── Bell Button ─── */}
            <button
                ref={btnRef}
                className={styles.bellBtn}
                onClick={handleOpen}
                title="Thông báo hoạt động admin"
                aria-label={`${unreadCount} thông báo chưa đọc`}
            >
                <span className={`${styles.bellIcon} ${unreadCount > 0 ? styles.bellRing : ""}`}>🔔</span>
                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* ─── Dropdown Panel (position:fixed — thoát overflow sidebar) ─── */}
            {open && (
                <div
                    ref={panelRef}
                    className={styles.panel}
                    style={{ top: panelPos.top, left: panelPos.left }}
                >
                    {/* Header */}
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>🔔 Hoạt động Admin</span>
                        <div className={styles.panelActions}>
                            {unreadCount > 0 && (
                                <button
                                    className={styles.readAllBtn}
                                    onClick={markAllAsRead}
                                    title="Đánh dấu tất cả đã đọc"
                                >
                                    ✓ Đọc tất cả
                                </button>
                            )}
                            {logs.length > 0 && (
                                <button
                                    className={styles.clearBtn}
                                    onClick={clearAll}
                                    title="Xóa tất cả"
                                >
                                    🗑
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className={styles.list}>
                        {logs.length === 0 ? (
                            <div className={styles.empty}>
                                <span className={styles.emptyIcon}>🔕</span>
                                <p>Chưa có hoạt động nào</p>
                            </div>
                        ) : (
                            logs.map((log: ActivityLog, index: number) => (
                                <div
                                    key={log.id}
                                    className={`${styles.item} ${!log.isRead ? styles.itemUnread : ""}`}
                                >
                                    <div className={styles.seqNum}>{index + 1}</div>
                                    <div className={styles.itemIcon}>{categoryIcon(log.category)}</div>
                                    <div className={styles.itemContent}>
                                        <div className={styles.itemText}>
                                            <span className={styles.adminName}>{log.adminName}</span>
                                            <span className={styles.actionText}> {log.action} </span>
                                            {log.target && (
                                                <span className={styles.targetText}>「{log.target}」</span>
                                            )}
                                        </div>
                                        <div className={styles.itemTime}>{timeAgo(log.createdAt)}</div>
                                    </div>
                                    {!log.isRead && <div className={styles.unreadDot} />}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {logs.length > 0 && (
                        <div className={styles.panelFooter}>
                            Tổng {logs.length} hoạt động · {unreadCount} chưa đọc
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
