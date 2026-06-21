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
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

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
                    images: [],
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