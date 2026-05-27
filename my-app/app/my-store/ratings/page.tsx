"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ratings.module.css";
import ReplyModal from "../../components/ReplyModal";

interface RatingMaterialDTO {
    url: string;
}

interface RatingReplyDTO {
    id: number;
    comment: string;
    materialUrls: string[];
    createdBy: string;
    userFullName: string;
    userImage: string;
    createdAt: string;
}

interface RatingDTO {
    id: number;
    orderId: number;
    stars: number;
    isReply: boolean;
    comment: string;
    materialUrls: string[];
    createdBy: string;
    userFullName: string;
    userImage: string;
    createdAt: string;
    replies: RatingReplyDTO[];
}

export default function ShopRatingsPage() {
    const router = useRouter();
    const [ratings, setRatings] = useState<RatingDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");
    const [selectedRating, setSelectedRating] = useState<RatingDTO | null>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        return { token, userId };
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/stores/my-store?userId=${userId}`, {
            headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(store => {
                setStoreId(store.id);
                return fetch(`/api/ratings/store/${store.id}`, {
                    headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
                });
            })
            .then(r => r.json())
            .then(data => setRatings(data.data || []))
            .catch(() => router.push("/my-store"))
            .finally(() => setLoading(false));
    }, [router]);

    const filtered = ratings.filter(r => {
        if (filter === "pending") return !r.isReply;
        if (filter === "replied") return r.isReply;
        return true;
    });

    const pending = ratings.filter(r => !r.isReply).length;

    const handleReplySuccess = () => {
        setSelectedRating(null);
        showToast("✅ Phản hồi thành công!");
        // Refresh lại danh sách
        const { token } = getAuth();
        fetch(`/api/ratings/store/${storeId}`, {
            headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => setRatings(data.data || []));
    };

    const StarDisplay = ({ count }: { count: number }) => (
        <span style={{ display: "inline-flex", gap: 2 }}>
            {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= count ? "#f59e0b" : "#d1d5db", fontSize: 16 }}>★</span>
            ))}
        </span>
    );

    const timeAgo = (iso: string) =>
        new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải đánh giá...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo} onClick={() => router.push("/")}>
                    <span>✦</span> ANVI
                </div>
                <nav className={styles.sidebarNav}>
                    <button className={styles.navItem} onClick={() => router.push("/my-store")}>
                        <span>📦</span> Sản phẩm
                    </button>
                    <button className={styles.navItem}><span>📋</span> Đơn hàng</button>
                    <button className={styles.navItem} onClick={() => router.push("/my-store")}>
                        <span>🎟️</span> Voucher
                    </button>
                    <button className={styles.navItem} onClick={() => router.push("/my-store/promotions")}>
                        <span>🎉</span> Khuyến mãi
                    </button>
                    <button className={`${styles.navItem} ${styles.navActive}`}>
                        <span>⭐</span> Đánh giá
                        {pending > 0 && <span className={styles.badge}>{pending}</span>}
                    </button>
                    <button className={styles.navItem}><span>📊</span> Thống kê</button>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.navItem} onClick={() => router.push("/profile")}>
                        <span>←</span> Trang cá nhân
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>⭐ Quản lý đánh giá</h1>
                        <p className={styles.pageSub}>
                            {pending > 0
                                ? `${pending} đánh giá chưa được phản hồi`
                                : "Tất cả đánh giá đã được phản hồi ✓"}
                        </p>
                    </div>
                </header>

                {/* Filter tabs */}
                <div className={styles.tabs}>
                    {[
                        { key: "all",     label: `Tất cả (${ratings.length})` },
                        { key: "pending", label: `Chưa phản hồi (${pending})` },
                        { key: "replied", label: `Đã phản hồi (${ratings.length - pending})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`${styles.tab} ${filter === tab.key ? styles.tabActive : ""}`}
                            onClick={() => setFilter(tab.key as any)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Rating list */}
                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>💬</div>
                        <p>Không có đánh giá nào</p>
                    </div>
                ) : (
                    <div className={styles.ratingList}>
                        {filtered.map(rating => (
                            <div key={rating.id} className={styles.ratingCard}>
                                {/* Customer info */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.avatar}>
                                        {rating.userImage
                                            ? <img src={rating.userImage} alt="" />
                                            : <span>{(rating.userFullName || "K")[0]}</span>
                                        }
                                    </div>
                                    <div className={styles.customerInfo}>
                                        <div className={styles.customerName}>{rating.userFullName || rating.createdBy}</div>
                                        <div className={styles.metaRow}>
                                            <StarDisplay count={rating.stars} />
                                            <span className={styles.dot}>·</span>
                                            <span className={styles.date}>{timeAgo(rating.createdAt)}</span>
                                            <span className={styles.dot}>·</span>
                                            <span className={styles.orderId}>Đơn #{rating.orderId}</span>
                                        </div>
                                    </div>
                                    <span className={`${styles.statusBadge} ${rating.isReply ? styles.replied : styles.pending}`}>
                                        {rating.isReply ? "✓ Đã phản hồi" : "Chưa phản hồi"}
                                    </span>
                                </div>

                                {/* Customer comment */}
                                {rating.comment && (
                                    <p className={styles.comment}>"{rating.comment}"</p>
                                )}

                                {/* Customer images */}
                                {rating.materialUrls?.length > 0 && (
                                    <div className={styles.imageRow}>
                                        {rating.materialUrls.map((url, i) => (
                                            <img key={i} src={url} alt="" className={styles.reviewImg} />
                                        ))}
                                    </div>
                                )}

                                {/* Shop reply */}
                                {rating.replies?.length > 0 && (
                                    <div className={styles.replyBox}>
                                        <div className={styles.replyLabel}>Phản hồi của shop</div>
                                        <p className={styles.replyComment}>{rating.replies[0].comment}</p>
                                        {rating.replies[0].materialUrls?.length > 0 && (
                                            <div className={styles.imageRow}>
                                                {rating.replies[0].materialUrls.map((url, i) => (
                                                    <img key={i} src={url} alt="" className={styles.reviewImg} />
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.replyDate}>{timeAgo(rating.replies[0].createdAt)}</div>
                                    </div>
                                )}

                                {/* Reply button */}
                                {!rating.isReply && (
                                    <div className={styles.cardFooter}>
                                        <button
                                            className={styles.replyBtn}
                                            onClick={() => setSelectedRating(rating)}
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

            {/* Reply Modal */}
            {selectedRating && (
                <ReplyModal
                    ratingId={selectedRating.id}
                    customerName={selectedRating.userFullName || selectedRating.createdBy}
                    customerComment={selectedRating.comment}
                    onClose={() => setSelectedRating(null)}
                    onSuccess={handleReplySuccess}
                />
            )}

            {toast && <div className={styles.toast}>{toast}</div>}
        </div>
    );
}