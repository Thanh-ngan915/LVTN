"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ratings.module.css";
import StoreSidebar from "../../components/StoreSidebar";
import ReplyModal from "../../components/ReplyModal";

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

interface StoreRatingSummaryDTO {
    averageStars: number;
    totalRatings: number;
    starCounts: Record<string, number>;
    repliedCount: number;
    pendingCount: number;
    repliedRate: number;
    commentCount: number;
    commentRate: number;
    lowStarPendingCount: number;
}

export default function ShopRatingsPage() {
    const router = useRouter();
    const [ratings, setRatings] = useState<RatingDTO[]>([]);
    const [summary, setSummary] = useState<StoreRatingSummaryDTO | null>(null);
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

    const authHeader = (token: string) =>
        token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const loadRatingsAndSummary = (token: string, sid: string) => {
        Promise.all([
            fetch(`/api/ratings/store/${sid}?size=1000`, {
                headers: { Authorization: authHeader(token) },
            }).then(r => r.json()),
            fetch(`/api/ratings/store/${sid}/summary`, {
                headers: { Authorization: authHeader(token) },
            }).then(r => r.json()),
        ]).then(([ratingsRes, summaryRes]) => {
            setRatings(ratingsRes.data || []);
            setSummary(summaryRes.data || null);
        });
    };

    useEffect(() => {
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/stores/my-store?userId=${userId}`, {
            headers: { Authorization: authHeader(token) },
        })
            .then(r => r.json())
            .then(store => {
                setStoreId(store.id);
                loadRatingsAndSummary(token, store.id);
            })
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
        const { token } = getAuth();
        if (token && storeId) loadRatingsAndSummary(token, storeId);
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
            <StoreSidebar />

            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>⭐ Quản lý đánh giá</h1>
                        <p className={styles.pageSubtitle}>
                            {pending > 0
                                ? `${pending} đánh giá chưa được phản hồi`
                                : "Tất cả đánh giá đã được phản hồi ✓"}
                        </p>
                    </div>
                </header>

                {summary && summary.lowStarPendingCount > 0 && (
                    <div className={styles.warningBanner}>
                        ⚠️ Có <strong>{summary.lowStarPendingCount}</strong> đánh giá 1-2 sao chưa được phản hồi — nên ưu tiên xử lý sớm
                    </div>
                )}

                {summary && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{summary.totalRatings}</div>
                            <div className={styles.statLabel}>Tổng đánh giá</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>
                                {summary.averageStars.toFixed(1)} <span style={{ color: "#f59e0b" }}>★</span>
                            </div>
                            <div className={styles.statLabel}>Điểm trung bình</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{summary.repliedRate.toFixed(0)}%</div>
                            <div className={styles.statLabel}>Tỷ lệ phản hồi</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statValue}>{summary.commentRate.toFixed(0)}%</div>
                            <div className={styles.statLabel}>Có viết bình luận</div>
                        </div>
                    </div>
                )}

                {summary && summary.totalRatings > 0 && (
                    <div className={styles.distributionBox}>
                        <div className={styles.distributionTitle}>Phân bố theo số sao</div>
                        {[5,4,3,2,1].map(star => {
                            const count = summary.starCounts[star] ?? summary.starCounts[String(star)] ?? 0;
                            const pct = summary.totalRatings > 0 ? (count / summary.totalRatings) * 100 : 0;
                            return (
                                <div key={star} className={styles.distributionRow}>
                                    <span className={styles.distributionLabel}>{star} ★</span>
                                    <div className={styles.distributionBarTrack}>
                                        <div
                                            className={styles.distributionBarFill}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className={styles.distributionCount}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={styles.tabs}>
                    {[
                        { key: "all",     label: `Tất cả (${summary?.totalRatings ?? ratings.length})` },
                        { key: "pending", label: `Chưa phản hồi (${summary?.pendingCount ?? pending})` },
                        { key: "replied", label: `Đã phản hồi (${summary?.repliedCount ?? (ratings.length - pending)})` },
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
                        <div className={styles.emptyIcon}>💬</div>
                        <p>Không có đánh giá nào</p>
                    </div>
                ) : (
                    <div className={styles.ratingList}>
                        {filtered.map(rating => (
                            <div key={rating.id} className={styles.ratingCard}>
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

                                {rating.comment && (
                                    <p className={styles.comment}>"{rating.comment}"</p>
                                )}

                                {rating.materialUrls?.length > 0 && (
                                    <div className={styles.imageRow}>
                                        {rating.materialUrls.map((url, i) => (
                                            <img key={i} src={url} alt="" className={styles.reviewImg} />
                                        ))}
                                    </div>
                                )}

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