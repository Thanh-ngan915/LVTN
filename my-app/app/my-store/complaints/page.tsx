"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./complaints.module.css";
import StoreSidebar from "../../components/StoreSidebar";
import ShopComplaintModal from "../../components/ShopComplaintModal";

interface ComplaintResponseDTO {
    id: string;
    orderId: number;
    buyerId: string;
    shopId: string;
    reason: string;
    description: string;
    images: string[];
    shopReply?: string;
    shopImages?: string[];
    status: string;
    adminNotes: string;
    resolvedBy: string;
    createdAt: string;
    resolvedAt: string;
}

const REASON_MAP: Record<string, string> = {
    'WRONG_ITEM': '📦 Sai sản phẩm',
    'DAMAGED_ITEM': '💔 Hàng bị hỏng',
    'NOT_RECEIVED': '❌ Chưa nhận được hàng',
    'QUALITY_ISSUE': '⚠️ Chất lượng kém',
    'OTHER': '📝 Khác',
};

const getReasonLabel = (reason: string) => REASON_MAP[reason] || reason;

export default function ShopComplaintsPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<ComplaintResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintResponseDTO | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        return { token, userId };
    };

    const authHeader = (token: string) =>
        token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const loadComplaints = () => {
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/seller/complaints`, {
            headers: { 
                Authorization: authHeader(token),
                "X-User-Id": userId 
            },
        })
            .then(r => r.json())
            .then(res => {
                if (res.success) {
                    setComplaints(res.data || []);
                } else {
                    console.error("Lỗi:", res.message);
                }
            })
            .catch(() => router.push("/my-store"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadComplaints();
    }, [router]);

    const filtered = complaints.filter(c => {
        if (filter === "pending") return !c.shopReply;
        if (filter === "replied") return !!c.shopReply;
        return true;
    });

    const pendingCount = complaints.filter(c => !c.shopReply && c.status === "PENDING").length;

    const handleReplySuccess = () => {
        setSelectedComplaint(null);
        showToast("✅ Đã gửi phản hồi thành công!");
        loadComplaints();
    };

    const timeAgo = (iso: string) => {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải dữ liệu khiếu nại...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <StoreSidebar />

            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>🚨 Quản lý khiếu nại</h1>
                        <p className={styles.pageSubtitle}>
                            {pendingCount > 0
                                ? `Có ${pendingCount} khiếu nại đang chờ bạn phản hồi`
                                : "Tất cả khiếu nại đã được phản hồi ✓"}
                        </p>
                    </div>
                </header>

                <div className={styles.tabs}>
                    {[
                        { key: "all",     label: `Tất cả (${complaints.length})` },
                        { key: "pending", label: `Chưa phản hồi (${complaints.filter(c => !c.shopReply).length})` },
                        { key: "replied", label: `Đã phản hồi (${complaints.filter(c => !!c.shopReply).length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`${styles.tab} ${filter === tab.key ? styles.tabActive : ""}`}
                            onClick={() => setFilter(tab.key as "all" | "pending" | "replied")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📭</div>
                        <p>Không có khiếu nại nào</p>
                    </div>
                ) : (
                    <div className={styles.complaintList}>
                        {filtered.map(c => (
                            <div key={c.id} className={styles.complaintCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.customerInfo}>
                                        <div className={styles.customerName}>Khiếu nại Đơn hàng #{c.orderId}</div>
                                        <div className={styles.metaRow}>
                                            <span className={styles.date}>{timeAgo(c.createdAt)}</span>
                                            <span className={styles.dot}>·</span>
                                            <span>Trạng thái Admin: {c.status === "PENDING" ? "⏳ Đang chờ" : c.status === "APPROVED" ? "✅ Hoàn tiền" : "❌ Từ chối"}</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${c.shopReply ? styles.replied : styles.pending}`}>
                                        {c.shopReply ? "✓ Đã phản hồi" : "Chưa phản hồi"}
                                    </span>
                                </div>

                                <div className={styles.complaintReason}>
                                    Lý do: {getReasonLabel(c.reason)}
                                </div>
                                {c.description && (
                                    <p className={styles.description}>"{c.description}"</p>
                                )}

                                {c.images && c.images.length > 0 && (
                                    <div className={styles.imageRow}>
                                        {c.images.map((url, i) => (
                                            url.match(/\.(mp4|webm|mov)$/i) ? (
                                                <video key={i} src={url} className={styles.reviewImg} />
                                            ) : (
                                                <img key={i} src={url} alt="" className={styles.reviewImg} />
                                            )
                                        ))}
                                    </div>
                                )}

                                {c.shopReply && (
                                    <div className={styles.replyBox}>
                                        <div className={styles.replyLabel}>Phản hồi của shop</div>
                                        <p className={styles.replyComment}>{c.shopReply}</p>
                                        {c.shopImages && c.shopImages.length > 0 && (
                                            <div className={styles.imageRow}>
                                                {c.shopImages.map((url, i) => (
                                                    url.match(/\.(mp4|webm|mov)$/i) ? (
                                                        <video key={i} src={url} className={styles.reviewImg} />
                                                    ) : (
                                                        <img key={i} src={url} alt="" className={styles.reviewImg} />
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {c.status !== "PENDING" && c.adminNotes && (
                                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
                                        <b style={{ color: "var(--text)", fontSize: 13, textTransform: "uppercase" }}>Kết quả xử lý từ Admin</b>
                                        {c.isShopFault && (
                                            <span style={{ marginLeft: 8, padding: "2px 8px", background: "#ffe3e3", color: "#c92a2a", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                                                ⚠️ Shop bị phạt
                                            </span>
                                        )}
                                        <p style={{ marginTop: 8, padding: 12, background: "#f8f9fa", color: "#495057", borderRadius: 8, border: "1px solid #dee2e6", fontSize: 14 }}>
                                            {c.adminNotes}
                                        </p>
                                    </div>
                                )}

                                {!c.shopReply && c.status === "PENDING" && (
                                    <div className={styles.cardFooter}>
                                        <button
                                            className={styles.replyBtn}
                                            onClick={() => setSelectedComplaint(c)}
                                        >
                                            ↩ Viết phản hồi
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {selectedComplaint && (
                <ShopComplaintModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                    onSuccess={handleReplySuccess}
                />
            )}

            {toast && <div className={styles.toast}>{toast}</div>}
        </div>
    );
}
