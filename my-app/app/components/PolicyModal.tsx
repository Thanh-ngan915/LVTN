"use client";

import { useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface PolicyDTO {
    id: string;
    title: string;
    content: string;
    type: string;
    status: string;
}

interface Props {
    policy: PolicyDTO | null; // null if creating
    onClose: () => void;
    onSuccess: () => void;
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
    logActivity: (action: string, target: string, category?: string) => Promise<void>;
}

export default function PolicyModal({ policy, onClose, onSuccess, authHeader, showToast, logActivity }: Props) {
    const [title, setTitle] = useState(policy?.title || "");
    const [type, setType] = useState(policy?.type || "");
    const [content, setContent] = useState(policy?.content || "");
    const [status, setStatus] = useState(policy?.status || "ACTIVE");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            showToast("⚠️ Vui lòng nhập đầy đủ tiêu đề và nội dung.");
            return;
        }

        setLoading(true);
        try {
            const isEditing = !!policy;
            const endpoint = isEditing ? `/api/admin/policies/${policy.id}` : `/api/admin/policies`;
            const method = isEditing ? "PUT" : "POST";
            
            const payload = { title, type, content, status };

            const res = await fetch(endpoint, {
                method,
                headers: authHeader(),
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error();

            showToast(isEditing ? "✅ Đã cập nhật chính sách" : "✅ Đã thêm chính sách");
            await logActivity(
                isEditing ? "Cập nhật chính sách" : "Thêm chính sách", 
                title, 
                "policy"
            );
            onSuccess();
        } catch {
            showToast("❌ Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{policy ? "Sửa Chính sách" : "Thêm Chính sách mới"}</h2>
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tiêu đề (*)</label>
                        <input 
                            className={styles.searchInput}
                            style={{ width: "100%", padding: "10px" }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="VD: Điều khoản dịch vụ"
                            required
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Loại chính sách</label>
                        <select 
                            className={styles.filterSelect}
                            style={{ width: "100%", padding: "10px" }}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">-- Chọn loại chính sách --</option>
                            <option value="terms">Điều khoản dịch vụ</option>
                            <option value="privacy">Chính sách bảo mật</option>
                            <option value="return">Chính sách đổi trả</option>
                            <option value="shipping">Chính sách giao hàng</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Trạng thái</label>
                        <select 
                            className={styles.filterSelect}
                            style={{ width: "100%", padding: "10px" }}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                            <option value="INACTIVE">Vô hiệu hóa (INACTIVE)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nội dung (*)</label>
                        <textarea 
                            className={styles.searchInput}
                            style={{ width: "100%", minHeight: "120px", maxHeight: "250px", padding: "10px", resize: "none", overflowY: "auto" }}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                e.target.style.height = '120px';
                                e.target.style.height = Math.min(e.target.scrollHeight, 250) + 'px';
                            }}
                            placeholder="Nhập nội dung HTML hoặc Text..."
                            required
                        />
                    </div>

                    <div className={styles.modalActions} style={{ marginTop: "10px" }}>
                        <button 
                            type="button" 
                            className={styles.btnCancel} 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className={styles.btnConfirm}
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : "Lưu lại"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
