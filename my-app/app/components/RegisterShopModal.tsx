"use client";

import { useState } from "react";
import styles from "./RegisterShopModal.module.css";

interface Props {
    userId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RegisterShopModal({ userId, onClose, onSuccess }: Props) {
    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        image: "",
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError("Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB");
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "kltn_user_avatar");
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "Upload thất bại");
            setForm(prev => ({ ...prev, image: data.secure_url }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { setError("Vui lòng nhập tên shop"); return; }
        if (!form.location.trim()) { setError("Vui lòng nhập địa chỉ shop"); return; }
        setSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/stores/register?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerIcon}>🏪</div>
                    <div>
                        <h2 className={styles.modalTitle}>Đăng ký bán hàng</h2>
                        <p className={styles.modalSub}>Điền thông tin để mở shop của bạn</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Logo */}
                    <div className={styles.logoSection}>
                        <label htmlFor="logo-upload" className={styles.logoUpload}>
                            {form.image ? (
                                <img src={form.image} alt="logo" className={styles.logoPreview} />
                            ) : (
                                <div className={styles.logoPlaceholder}>
                                    <span>{uploading ? "⏳" : "📷"}</span>
                                    <p>{uploading ? "Đang tải..." : "Tải logo shop"}</p>
                                </div>
                            )}
                        </label>
                        <input id="logo-upload" type="file" accept="image/*"
                               style={{ display: "none" }} onChange={handleLogoUpload} />
                        <p className={styles.logoHint}>Logo shop (không bắt buộc)</p>
                    </div>

                    {/* Tên shop */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Tên shop <span className={styles.required}>*</span>
                        </label>
                        <input type="text" name="name" value={form.name}
                               onChange={handleChange} className={styles.input}
                               placeholder="Ví dụ: Anvi Fashion Store"
                               maxLength={100} required />
                    </div>

                    {/* Địa chỉ */}
                    <div className={styles.field}>
                        <label className={styles.label}>
                            Địa chỉ shop <span className={styles.required}>*</span>
                        </label>
                        <input type="text" name="location" value={form.location}
                               onChange={handleChange} className={styles.input}
                               placeholder="Ví dụ: 123 Nguyễn Huệ, Q1, TP.HCM"
                               required />
                    </div>

                    {/* Mô tả */}
                    <div className={styles.field}>
                        <label className={styles.label}>Mô tả shop</label>
                        <textarea name="description" value={form.description}
                                  onChange={handleChange} className={styles.textarea}
                                  placeholder="Giới thiệu ngắn về shop của bạn..."
                                  rows={3} maxLength={1000} />
                        <span className={styles.charCount}>{form.description.length}/1000</span>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Hủy
                        </button>
                        <button type="submit" disabled={submitting || uploading}
                                className={styles.submitBtn}>
                            {submitting ? "Đang gửi..." : "🚀 Đăng ký ngay"}
                        </button>
                    </div>
                </form>

                <p className={styles.note}>
                    ℹ️ Shop sẽ được xét duyệt trong vòng 24 giờ sau khi đăng ký thành công.
                </p>
            </div>
        </div>
    );
}