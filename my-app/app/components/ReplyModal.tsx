"use client";
import styles from "./ReplyModal.module.css";
import { useState } from "react";

interface ReplyModalProps {
    ratingId: number;
    customerName?: string;
    customerComment?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReplyModal({
                                       ratingId,
                                       customerName,
                                       customerComment,
                                       onClose,
                                       onSuccess,
                                   }: ReplyModalProps) {
    const [comment, setComment] = useState("");
    const [materialUrls, setMaterialUrls] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const username = storedUser ? JSON.parse(storedUser).username : null;
        return { token, username };
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "kltn_user_avatar");
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload", {
                method: "POST", body: fd,
            });
            const data = await res.json();
            if (data.secure_url) {
                setMaterialUrls(prev => [...prev, data.secure_url]);
            }
        } catch {}
        finally { setUploadingImg(false); }
    };

    const handleSubmit = async () => {
        if (!comment.trim()) { alert("Vui lòng nhập nội dung phản hồi"); return; }
        setSubmitting(true);
        const { token, username } = getAuth();
        try {
            const res = await fetch(`/api/ratings/${ratingId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token?.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                    "X-User-Name": username || "anonymous",
                },
                body: JSON.stringify({ comment, materialUrls }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || "Gửi thất bại");
            }
            onSuccess();
        } catch (e) {
            alert(`Phản hồi thất bại: ${e instanceof Error ? e.message : "Lỗi không xác định"}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Phản hồi đánh giá</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Hiển thị đánh giá gốc của khách */}
                {(customerName || customerComment) && (
                    <div className={styles.customerSection}>
                        <div className={styles.customerLabel}>Đánh giá của khách</div>
                        {customerName && (
                            <div className={styles.customerName}>{customerName}</div>
                        )}
                        {customerComment && (
                            <div className={styles.customerComment}>"{customerComment}"</div>
                        )}
                    </div>
                )}

                {/* Nội dung phản hồi */}
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Nội dung phản hồi</label>
                    <textarea
                        className={styles.textarea}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Cảm ơn bạn đã mua hàng tại shop! Shop rất tiếc vì..."
                        rows={4}
                    />
                </div>

                {/* Ảnh đính kèm */}
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Ảnh đính kèm (không bắt buộc)</label>
                    <div className={styles.imageUploadRow}>
                        {materialUrls.map(url => (
                            <div key={url} className={styles.uploadedImg}>
                                <img src={url} alt="reply" />
                                <button
                                    className={styles.removeImg}
                                    onClick={() => setMaterialUrls(prev => prev.filter(u => u !== url))}
                                >✕</button>
                            </div>
                        ))}
                        {materialUrls.length < 5 && (
                            <label className={styles.uploadBox} htmlFor="reply-img">
                                {uploadingImg ? "⏳" : "+ Thêm ảnh"}
                                <input
                                    id="reply-img"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>Hủy</button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                </div>
            </div>
        </div>
    );
}