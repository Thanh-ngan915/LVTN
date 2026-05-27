"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import {
    getSalePromotionById,
    updateSalePromotion,
    SalePromotionRequestDTO,
} from "../../../../services/salePromotionService";

export default function EditPromotionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [storeId, setStoreId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<SalePromotionRequestDTO>({
        title: "",
        description: "",
        type: "SALE",
        startDate: "",
        endDate: "",
    });

    const toInputDate = (d: string) => {
        if (!d) return "";
        return new Date(d).toISOString().slice(0, 16);
    };

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
            .then(async (storeData) => {
                if (!storeData?.id) { router.push("/my-store"); return; }
                setStoreId(storeData.id);

                const promo = await getSalePromotionById(storeData.id, id);
                setForm({
                    title: promo.title,
                    description: promo.description || "",
                    type: promo.type,
                    startDate: toInputDate(promo.startDate),
                    endDate: toInputDate(promo.endDate),
                });
                setLoading(false);
            })
            .catch(() => router.push("/login"));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) { setError("Vui lòng nhập tên chương trình KM"); return; }
        if (!form.startDate) { setError("Vui lòng chọn ngày bắt đầu"); return; }
        if (!form.endDate) { setError("Vui lòng chọn ngày kết thúc"); return; }
        if (new Date(form.startDate) >= new Date(form.endDate)) {
            setError("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        setSaving(true);
        try {
            await updateSalePromotion(storeId!, id, {
                ...form,
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
            });
            router.push("/my-store/promotions");
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.main}>

                <div className={styles.topbar}>
                    <div className={styles.titleGroup}>
                        <button className={styles.backBtn} onClick={() => router.push("/my-store/promotions")}>
                            ← Quay lại
                        </button>
                        <h1 className={styles.pageTitle}>Sửa chương trình khuyến mãi</h1>
                    </div>
                </div>

                <div className={styles.formCard}>
                    <div className={styles.formCardHeader}>
                        <h2 className={styles.formCardTitle}>Thông tin chương trình</h2>
                    </div>

                    {error && <div className={styles.errorAlert}>{error}</div>}

                    <div className={styles.formCardBody}>
                        <div className={styles.formGrid}>

                            <div className={`${styles.formField} ${styles.fullWidth}`}>
                                <label>Tên chương trình *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="VD: Khuyến mãi hè 2025"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Ngày bắt đầu *</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Ngày kết thúc *</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`${styles.formField} ${styles.fullWidth}`}>
                                <label>Loại khuyến mãi</label>
                                <select name="type" value={form.type} onChange={handleChange}>
                                    <option value="SALE">Giảm giá sản phẩm</option>
                                    <option value="FLASH_SALE">Flash Sale</option>
                                    <option value="BUNDLE">Combo</option>
                                </select>
                            </div>

                            <div className={`${styles.formField} ${styles.fullWidth}`}>
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Mô tả chương trình khuyến mãi..."
                                    rows={4}
                                />
                            </div>

                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button className={styles.btnCancel} onClick={() => router.push("/my-store/promotions")}>
                            Hủy
                        </button>
                        <button className={styles.btnSave} onClick={handleSubmit} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}