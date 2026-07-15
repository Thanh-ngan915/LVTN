"use client";

import { useEffect, useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";
import PolicyModal from "./PolicyModal";

interface PolicyDTO {
    id: string;
    title: string;
    content: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdByName: string | null;
    updatedByName: string | null;
}

interface Props {
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
    logActivity: (action: string, target: string, category?: string) => Promise<void>;
}

export default function PolicyTable({ authHeader, showToast, logActivity }: Props) {
    const [policies, setPolicies] = useState<PolicyDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<{
        policyId: string; action: "delete" | "toggle"; label: string; currentStatus?: string;
    } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<PolicyDTO | null>(null);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/policies", { headers: authHeader() });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPolicies(Array.isArray(data) ? data : []);
        } catch {
            showToast("❌ Không thể tải danh sách chính sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const filtered = policies.filter(p => {
        const matchSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.type ?? "").toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "ALL" ? true : p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(confirm.policyId);
        try {
            const { policyId, action, currentStatus } = confirm;
            let endpoint = `/api/admin/policies/${policyId}`;
            let method = "DELETE";
            let body = undefined;

            if (action === "toggle") {
                method = "PUT";
                const targetPolicy = policies.find(p => p.id === policyId);
                if (!targetPolicy) return;
                
                body = JSON.stringify({
                    title: targetPolicy.title,
                    content: targetPolicy.content,
                    type: targetPolicy.type,
                    status: currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                });
            }

            const res = await fetch(endpoint, { 
                method, 
                headers: authHeader(),
                body
            });
            
            if (!res.ok) throw new Error();
            
            showToast(
                action === "delete" ? "✅ Đã xóa chính sách" : "✅ Đã đổi trạng thái"
            );
            await logActivity(
                action === "delete" ? "Xóa chính sách" : "Đổi trạng thái chính sách", 
                confirm.label.replace(/["?]/g, "").trim(), 
                "policy"
            );
            fetchPolicies();
        } catch {
            showToast("❌ Thao tác thất bại");
        } finally {
            setActionLoading(null);
            setConfirm(null);
        }
    };

    return (
        <>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Quản lý Chính sách</h1>
                    <p className={styles.pageSubtitle}>
                        Quản lý các chính sách và điều khoản trên hệ thống
                    </p>
                </div>
                <button 
                    className={styles.refreshBtn} 
                    style={{ background: "var(--accent)", color: "white", padding: "8px 16px", fontWeight: "bold" }}
                    onClick={() => {
                        setEditingPolicy(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Thêm chính sách
                </button>
            </div>

            <div className={styles.filterBar}>
                <input
                    className={styles.searchInput}
                    placeholder="Tìm theo tiêu đề, loại..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="INACTIVE">Vô hiệu hóa</option>
                </select>
                <button className={styles.refreshBtn} onClick={fetchPolicies}>🔄 Làm mới</button>
            </div>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Loại</th>
                            <th>Người tạo/Cập nhật</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className={styles.emptyRow}>Không có dữ liệu</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.title}</td>
                                <td className={styles.tdMuted}>{p.type || "—"}</td>
                                <td className={styles.tdMuted} style={{ fontSize: "0.85rem" }}>
                                    Tạo bởi: {p.createdByName || "—"}<br />
                                    Sửa bởi: {p.updatedByName || "—"}
                                </td>
                                <td>
                                    {p.status === "ACTIVE" ? (
                                        <span className={`${styles.statusDot} ${styles.statusActive}`}>Hoạt động</span>
                                    ) : (
                                        <span className={`${styles.statusDot} ${styles.statusBanned}`}>Vô hiệu hóa</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.actionBtn}
                                            style={{ background: "#4caf50", color: "#fff" }}
                                            onClick={() => {
                                                setEditingPolicy(p);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${p.status === "ACTIVE" ? styles.btnBan : styles.btnActivate}`}
                                            disabled={actionLoading === p.id}
                                            onClick={() => setConfirm({
                                                policyId: p.id,
                                                action: "toggle",
                                                currentStatus: p.status,
                                                label: `Đổi trạng thái chính sách "${p.title}"?`
                                            })}
                                        >
                                            {p.status === "ACTIVE" ? "⏸ Ẩn" : "▶️ Hiện"}
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.btnBan}`}
                                            disabled={actionLoading === p.id}
                                            onClick={() => setConfirm({
                                                policyId: p.id,
                                                action: "delete",
                                                label: `Xóa vĩnh viễn chính sách "${p.title}"?`
                                            })}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Modal (inline for simplicity or use existing ConfirmModal) */}
            {confirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Xác nhận</h3>
                        <p>{confirm.label}</p>
                        <div className={styles.modalActions}>
                            <button 
                                className={styles.btnCancel} 
                                onClick={() => setConfirm(null)}
                                disabled={!!actionLoading}
                            >
                                Hủy
                            </button>
                            <button 
                                className={styles.btnConfirm} 
                                onClick={handleAction}
                                disabled={!!actionLoading}
                            >
                                {actionLoading ? "Đang xử lý..." : "Đồng ý"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <PolicyModal 
                    policy={editingPolicy} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchPolicies();
                    }}
                    authHeader={authHeader}
                    showToast={showToast}
                    logActivity={logActivity}
                />
            )}
        </>
    );
}
