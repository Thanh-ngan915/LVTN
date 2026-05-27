"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";
import { createSalePromotion, SalePromotionRequestDTO } from "../../../services/salePromotionService";

export default function CreatePromotionPage() {
    const router = useRouter();
    const [storeId, setStoreId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<SalePromotionRequestDTO>({
        title: "",
        description: "",
        type: "SALE",
        startDate: "",
        endDate: "",
    });

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
            })
            .catch(() => router.push("/login"));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            await createSalePromotion(storeId!, {
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

    return (
        <div className={styles.page}>
            <div className={styles.main}>

                {/* Topbar */}
                <div className={styles.topbar}>
                    <div className={styles.titleGroup}>
                        <button className={styles.backBtn} onClick={() => router.push("/my-store/promotions")}>
                            ← Quay lại
                        </button>
                        <h1 className={styles.pageTitle}>Tạo chương trình khuyến mãi</h1>
                    </div>
                </div>

                {/* Form card - ĐÃ THAY ĐỔI CÁC INLINE STYLE THÀNH CLASS .formCard */}
                <div className={styles.formCard}>

                    {/* Form header */}
                    <div className={styles.formCardHeader}>
                        <h2 className={styles.formCardTitle}>
                            Thông tin chương trình
                        </h2>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className={styles.errorAlert}>{error}</div>
                    )}

                    {/* Body */}
                    <div className={styles.formCardBody}>
                        <div className={styles.formGrid}>

                            {/* Title - full width */}
                            <div className={`${styles.formField} ${styles.fullWidth}`}>
                                <label>Tên chương trình *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="VD: Khuyến mãi hè 2025"
                                />
                            </div>

                            {/* Start date + End date - cùng hàng */}
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

                            {/* Type - full width */}
                            <div className={`${styles.formField} ${styles.fullWidth}`}>
                                <label>Loại khuyến mãi</label>
                                <select name="type" value={form.type} onChange={handleChange}>
                                    <option value="SALE">Giảm giá sản phẩm</option>
                                    <option value="FLASH_SALE">Flash Sale</option>
                                    <option value="BUNDLE">Combo</option>
                                </select>
                            </div>

                            {/* Description - full width */}
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

                    {/* Footer */}
                    <div className={styles.modalFooter}>
                        <button
                            className={styles.btnCancel}
                            onClick={() => router.push("/my-store/promotions")}
                        >
                            Hủy
                        </button>
                        <button
                            className={styles.btnSave}
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? "Đang tạo..." : "Tạo chương trình KM"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}