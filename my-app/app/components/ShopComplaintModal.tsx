"use client";

import React, { useState } from "react";
import styles from "./ReplyModal.module.css";

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

interface Props {
    complaint: ComplaintResponseDTO;
    onClose: () => void;
    onSuccess: () => void;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqghfi8be/auto/upload";
const CLOUDINARY_PRESET = "kltn_user_avatar";

const REASON_MAP: Record<string, string> = {
    'WRONG_ITEM': '📦 Sai sản phẩm',
    'DAMAGED_ITEM': '💔 Hàng bị hỏng',
    'NOT_RECEIVED': '❌ Chưa nhận được hàng',
    'QUALITY_ISSUE': '⚠️ Chất lượng kém',
    'OTHER': '📝 Khác',
};

const getReasonLabel = (reason: string) => REASON_MAP[reason] || reason;

export default function ShopComplaintModal({ complaint, onClose, onSuccess }: Props) {
    const [shopReply, setShopReply] = useState("");
    const [shopImages, setShopImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImg, setUploadingImg] = useState(false);

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", CLOUDINARY_PRESET);
            const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "Upload thất bại");
            setShopImages((prev) => [...prev, data.secure_url]);
        } catch (err) {
            console.error("Upload error", err);
            setError("Lỗi khi tải ảnh/video lên");
        } finally {
            setUploadingImg(false);
        }
    };

    const removeImage = (index: number) => {
        setShopImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!shopReply.trim()) {
            setError("Vui lòng nhập nội dung phản hồi");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            if (!token || !storedUser) throw new Error("Chưa đăng nhập");
            const userId = JSON.parse(storedUser).userId;

            const res = await fetch(`/api/seller/complaints/${complaint.id}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-User-Id": userId,
                },
                body: JSON.stringify({
                    shopReply,
                    images: shopImages,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gửi phản hồi thất bại");

            onSuccess();
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal} style={{ maxWidth: 600 }}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Phản hồi khiếu nại #{complaint.orderId}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>
                
                {/* Chi tiết khiếu nại của khách */}
                <div className={styles.customerSection}>
                    <div className={styles.customerLabel}>Khiếu nại của khách hàng</div>
                    <div className={styles.customerName}>
                        Lý do: <span style={{ color: "var(--accent)" }}>{getReasonLabel(complaint.reason)}</span>
                    </div>
                    {complaint.description && (
                        <div className={styles.customerComment}>
                            Mô tả: {complaint.description}
                        </div>
                    )}
                    {complaint.images && complaint.images.length > 0 && (
                        <div className={styles.imageUploadRow} style={{ marginTop: 12 }}>
                            {complaint.images.map((url, i) => (
                                <div key={i} className={styles.uploadedImg} style={{ width: 64, height: 64 }}>
                                    {url.match(/\.(mp4|webm|mov)$/i) ? (
                                        <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <img src={url} alt={`evidence-${i}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form phản hồi */}
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Nội dung phản hồi của Shop</label>
                    <textarea
                        className={styles.textarea}
                        rows={4}
                        placeholder="Giải trình với Admin về vấn đề của đơn hàng này..."
                        value={shopReply}
                        onChange={(e) => setShopReply(e.target.value)}
                    />
                    {error && <div style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: 8 }}>{error}</div>}
                </div>

                {/* Tải lên bằng chứng */}
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Tải lên bằng chứng (Hình ảnh/Video)</label>
                    <div className={styles.imageUploadRow}>
                        {shopImages.map((url, i) => (
                            <div key={i} className={styles.uploadedImg}>
                                {url.match(/\.(mp4|webm|mov)$/i) ? (
                                    <video src={url} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <img src={url} alt={`shop-evidence-${i}`} />
                                )}
                                <button className={styles.removeImg} onClick={() => removeImage(i)}>✕</button>
                            </div>
                        ))}
                        {shopImages.length < 5 && (
                            <label className={styles.uploadBox} htmlFor={`shop-reply-media-${complaint.id}`}>
                                {uploadingImg ? "⏳..." : "+ Thêm tệp"}
                                <input
                                    id={`shop-reply-media-${complaint.id}`}
                                    type="file"
                                    accept="image/*,video/*"
                                    style={{ display: "none" }}
                                    onChange={handleMediaUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={submitting}>Hủy</button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting || uploadingImg}>
                        {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
