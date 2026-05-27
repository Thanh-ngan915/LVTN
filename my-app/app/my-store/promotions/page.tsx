"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./promotions.module.css";
import {
    SalePromotionDTO,
    getSalePromotions,
    getDeletedSalePromotions,
    deleteSalePromotion,
    restoreSalePromotion,
} from "../../services/salePromotionService";

export default function PromotionsPage() {
    const router = useRouter();
    const [promotions, setPromotions] = useState<SalePromotionDTO[]>([]);
    const [deletedPromotions, setDeletedPromotions] = useState<SalePromotionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) { router.push("/login"); return; }

        const user = JSON.parse(storedUser);
        const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

        fetch(`/api/stores/my-store?userId=${user.userId}`, {
            headers: { Authorization: authHeader },
        })
            .then(res => res.json())
            .then(storeData => {
                if (!storeData?.id) { router.push("/my-store"); return; }
                setStoreId(storeData.id);
                fetchAll(storeData.id);
            })
            .catch(() => router.push("/login"));
    }, []);

    const fetchAll = async (sid: string) => {
        setLoading(true);
        try {
            const [active, deleted] = await Promise.all([
                getSalePromotions(sid),
                getDeletedSalePromotions(sid),
            ]);
            setPromotions(active);
            setDeletedPromotions(deleted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa chương trình KM này?")) return;
        try {
            await deleteSalePromotion(storeId!, id);
            fetchAll(storeId!);
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await restoreSalePromotion(storeId!, id);
            fetchAll(storeId!);
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    };

    const getStatusBadge = (promo: SalePromotionDTO) => {
        const now = new Date();
        const start = new Date(promo.startDate);
        const end = new Date(promo.endDate);
        if (now < start) return { label: "Sắp diễn ra", bg: "#fff8e1", color: "#b07c00", border: "#fcd34d" };
        if (now > end) return { label: "Đã kết thúc", bg: "#f5f5f5", color: "#999", border: "#e5e5e5" };
        return { label: "Đang diễn ra", bg: "#e6f9f0", color: "#1a9b5e", border: "#b7f0d5" };
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

    const displayList = showDeleted ? deletedPromotions : promotions;

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.main}>

                {/* Topbar */}
                <div className={styles.topbar}>
                    <div className={styles.titleGroup}>
                        <button className={styles.backBtn} onClick={() => router.push("/my-store")}>
                            ← Quay lại
                        </button>
                        <h1 className={styles.pageTitle}>Quản lý khuyến mãi</h1>
                    </div>
                    <button className={styles.btnCreate} onClick={() => router.push("/my-store/promotions/create")}>
                        + Tạo chương trình KM
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${!showDeleted ? styles.tabActive : styles.tabInactive}`}
                        onClick={() => setShowDeleted(false)}
                    >
                        Đang hoạt động ({promotions.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${showDeleted ? styles.tabActive : styles.tabInactive}`}
                        onClick={() => setShowDeleted(true)}
                    >
                        Đã xóa ({deletedPromotions.length})
                    </button>
                </div>

                {/* List */}
                {displayList.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🎉</div>
                        <p className={styles.emptyText}>
                            {showDeleted ? "Không có chương trình KM nào đã xóa" : "Chưa có chương trình khuyến mãi nào"}
                        </p>
                        {!showDeleted && (
                            <button className={styles.emptyCreateBtn} onClick={() => router.push("/my-store/promotions/create")}>
                                Tạo ngay
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.list}>
                        {displayList.map((promo) => {
                            const badge = getStatusBadge(promo);
                            return (
                                <div key={promo.id} className={styles.card}>
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardTitleRow}>
                                            <span className={styles.cardTitle}>{promo.title}</span>
                                            <span
                                                className={styles.badge}
                                                style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>
                                        {promo.description && (
                                            <p className={styles.cardDesc}>{promo.description}</p>
                                        )}
                                        <p className={styles.cardDate}>
                                            🗓 {formatDate(promo.startDate)} → {formatDate(promo.endDate)}
                                        </p>
                                    </div>

                                    <div className={styles.cardActions}>
                                        {!showDeleted ? (
                                            <>
                                                <button className={styles.btnView} onClick={() => router.push(`/my-store/promotions/${promo.id}/products`)}>
                                                    Sản phẩm
                                                </button>
                                                <button className={styles.btnEdit} onClick={() => router.push(`/my-store/promotions/${promo.id}/edit`)}>
                                                    Sửa
                                                </button>
                                                <button className={styles.btnDelete} onClick={() => handleDelete(promo.id)}>
                                                    Xóa
                                                </button>
                                            </>
                                        ) : (
                                            <button className={styles.btnRestore} onClick={() => handleRestore(promo.id)}>
                                                Khôi phục
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}