"use client";
import styles from "./ReviewModal.module.css";
import { ReviewModalProps} from '../services/orderService';
import { RatingForm, Order, OrderItem} from '../services/orderService';
import {useState} from "react";
export default function ReviewModal({ order, onClose, onSuccess }: ReviewModalProps) {
    const [form, setForm] = useState<RatingForm>({
        orderId: order.id,
        storeId: order.storeId,
        stars: 5,
        comment: "",
        materialUrls: [],
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const username = storedUser ? JSON.parse(storedUser).username : null;
        return { token, username };
    };

    const compressImage = (file: File, maxSizeMB = 1): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    // Scale down nếu quá lớn
                    const maxDim = 1920;
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Nén với quality 0.8
                    canvas.toBlob(
                        (blob) => resolve(blob!),
                        'image/jpeg',
                        0.8
                    );
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            // Chỉ nén khi file > 10MB
            if (file.size > 10 * 1024 * 1024) {
                const compressed = await compressImage(file);
                fd.append("file", compressed, file.name);
            } else {
                fd.append("file", file);
            }
            fd.append("upload_preset", "kltn_user_avatar");
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload", {
                method: "POST", body: fd,
            });
            const data = await res.json();
            console.log('Cloudinary response:', data);
            if (data.secure_url) {
                setForm(prev => ({ ...prev, materialUrls: [...prev.materialUrls, data.secure_url] }));
            }
        } catch { } finally {
            setUploadingImg(false);
        }
    };

    const removeImage = (url: string) => {
        setForm(prev => ({ ...prev, materialUrls: prev.materialUrls.filter(u => u !== url) }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const { token, username } = getAuth();

        if (!token) {
            alert("Bạn cần đăng nhập lại");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`/api/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                    "X-User-Name": username || "anonymous",
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody?.message || "Gửi thất bại");
            }

            const ratedOrders: number[] = JSON.parse(localStorage.getItem("ratedOrders") || "[]");
            if (!ratedOrders.includes(form.orderId)) {
                localStorage.setItem("ratedOrders", JSON.stringify([...ratedOrders, form.orderId]));
            }

            onSuccess(form.orderId);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Lỗi không xác định";
            alert(`Gửi đánh giá thất bại: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
        <div className={styles.starPicker}>
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button"
                        className={`${styles.star} ${s <= value ? styles.starActive : ""}`}
                        onClick={() => onChange(s)}>★</button>
            ))}
        </div>
    );

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>⭐ Đánh giá đơn #{order.id}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.modalItems}>
                    {order.items?.slice(0, 2).map((item, i) => (
                        <div key={i} className={styles.modalItem}>
                            <img src={item.productImage || "https://ui-avatars.com/api/?name=P"}
                                 alt={item.productName} className={styles.modalItemImg} />
                            <span className={styles.modalItemName}>{item.productName}</span>
                        </div>
                    ))}
                    {(order.items?.length || 0) > 2 && (
                        <span className={styles.moreItems}>+{(order.items?.length || 0) - 2} sản phẩm khác</span>
                    )}
                </div>

                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Chất lượng sản phẩm</label>
                    <StarPicker value={form.stars} onChange={v => setForm({ ...form, stars: v })} />
                    <div className={styles.starLabel}>
                        {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"][form.stars]}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Nhận xét của bạn</label>
                    <textarea
                        className={styles.textarea}
                        value={form.comment}
                        onChange={e => setForm({ ...form, comment: e.target.value })}
                        placeholder="Hãy chia sẻ cảm nhận về sản phẩm..."
                        rows={4}
                    />
                </div>

                <div className={styles.formSection}>
                    <label className={styles.formLabel}>Thêm ảnh (không bắt buộc)</label>
                    <div className={styles.imageUploadRow}>
                        {form.materialUrls.map(url => (
                            <div key={url} className={styles.uploadedImg}>
                                <img src={url} alt="review" />
                                <button className={styles.removeImg} onClick={() => removeImage(url)}>✕</button>
                            </div>
                        ))}
                        {form.materialUrls.length < 5 && (
                            <label className={styles.uploadBox} htmlFor="review-img">
                                {uploadingImg ? "⏳" : "+ Thêm ảnh"}
                                <input id="review-img" type="file" accept="image/*"
                                       style={{ display: "none" }} onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>Hủy</button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>
        </div>
    );
}