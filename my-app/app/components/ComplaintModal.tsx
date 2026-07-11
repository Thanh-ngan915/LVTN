'use client';

import { useState } from 'react';
import styles from './ComplaintModal.module.css';

interface Props {
    orderId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const REASONS = [
    { value: 'WRONG_ITEM',    label: '📦 Sai sản phẩm' },
    { value: 'DAMAGED_ITEM',  label: '💔 Hàng bị hỏng' },
    { value: 'NOT_RECEIVED',  label: '❌ Chưa nhận được hàng' },
    { value: 'QUALITY_ISSUE', label: '⚠️ Chất lượng kém' },
    { value: 'OTHER',         label: '📝 Khác' },
];

export default function ComplaintModal({ orderId, onClose, onSuccess }: Props) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [error, setError] = useState('');

    const compressImage = (file: File, maxSizeMB = 1): Promise<Blob> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

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

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            if (file.size > 10 * 1024 * 1024 && file.type.startsWith('image/')) {
                const compressed = await compressImage(file);
                fd.append("file", compressed, file.name);
            } else {
                fd.append("file", file);
            }
            fd.append("upload_preset", "kltn_user_avatar");
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/auto/upload", {
                method: "POST", body: fd,
            });
            const data = await res.json();
            if (data.secure_url) {
                setImages(prev => [...prev, data.secure_url]);
            }
        } catch (err) { 
            console.error(err);
        } finally {
            setUploadingImg(false);
            e.target.value = '';
        }
    };

    const removeImage = (url: string) => {
        setImages(prev => prev.filter(u => u !== url));
    };

    const handleSubmit = async () => {
        if (!reason) { setError('Vui lòng chọn lý do khiếu nại'); return; }
        if (!description.trim()) { setError('Vui lòng mô tả chi tiết'); return; }

        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr).userId : null;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    'X-User-Id': userId,
                },
                body: JSON.stringify({
                    orderId,
                    reason,
                    description,
                    images,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || 'Gửi thất bại');

            onSuccess();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2 className={styles.title}>🚨 Khiếu nại đơn hàng #{orderId}</h2>

                <label className={styles.label}>Lý do khiếu nại</label>
                <div className={styles.reasonGrid}>
                    {REASONS.map(r => (
                        <button
                            key={r.value}
                            className={`${styles.reasonBtn} ${reason === r.value ? styles.reasonActive : ''}`}
                            onClick={() => setReason(r.value)}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <label className={styles.label}>Mô tả chi tiết</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Mô tả vấn đề bạn gặp phải..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                />

                <label className={styles.label}>Thêm ảnh/video (không bắt buộc)</label>
                <div className={styles.imageUploadRow}>
                    {images.map(url => {
                        const isVideo = url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');
                        return (
                            <div key={url} className={styles.uploadedImg}>
                                {isVideo ? (
                                    <video src={url} muted playsInline />
                                ) : (
                                    <img src={url} alt="complaint proof" />
                                )}
                                <button className={styles.removeImg} onClick={() => removeImage(url)}>✕</button>
                            </div>
                        );
                    })}
                    {images.length < 5 && (
                        <label className={styles.uploadBox} htmlFor={`complaint-media-${orderId}`}>
                            {uploadingImg ? "⏳..." : "+ Thêm tệp"}
                            <input id={`complaint-media-${orderId}`} type="file" accept="image/*,video/*"
                                   style={{ display: "none" }} onChange={handleMediaUpload} />
                        </label>
                    )}
                </div>

                {error && <p className={styles.error}>⚠️ {error}</p>}

                <div className={styles.actions}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
                    <button
                        className={styles.btnSubmit}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
                    </button>
                </div>
            </div>
        </div>
    );
}