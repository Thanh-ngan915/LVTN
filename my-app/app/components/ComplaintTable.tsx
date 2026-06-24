"use client";

import React, { useState, useEffect } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface ComplaintResponseDTO {
    id: string;
    orderId: number;
    buyerId: string;
    shopId: string;
    reason: string;
    description: string;
    images: string[];
    status: string;
    adminNotes: string;
    resolvedBy: string;
    createdAt: string;
    resolvedAt: string;
}

interface Props {
    authHeader: () => HeadersInit;
    showToast: (msg: string) => void;
    logActivity: (action: string, target: string, category?: string) => Promise<void>;
}

export default function ComplaintTable({ authHeader, showToast, logActivity }: Props) {
    const [complaints, setComplaints] = useState<ComplaintResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [resolveModal, setResolveModal] = useState<{
        complaint: ComplaintResponseDTO;
        action: "approve" | "reject";
    } | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [isShopFault, setIsShopFault] = useState(false);
    const [resolving, setResolving] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/complaints/admin/pending", { headers: authHeader() });
            const data = await res.json();
            setComplaints(data.success ? (data.data || []) : []);
        } catch {
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleResolve = async () => {
        if (!resolveModal) return;
        setResolving(true);
        try {
            const body = {
                adminNotes,
                isShopFault: resolveModal.action === "approve" ? isShopFault : false,
            };
            const endpoint = `/api/complaints/admin/${resolveModal.complaint.id}/${resolveModal.action}`;
            const res = await fetch(endpoint, {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                const actionLabel = resolveModal.action === "approve" ? "Hoàn tiền khiếu nại" : "Từ chối khiếu nại";
                showToast(data.message || "✅ Xử lý khiếu nại thành công");
                await logActivity(actionLabel, `#${resolveModal.complaint.orderId}`, "complaint");
                fetchComplaints();
            } else {
                showToast(`❌ Lỗi: ${data.message}`);
            }
        } catch {
            showToast("❌ Lỗi hệ thống khi xử lý");
        } finally {
            setResolving(false);
            setResolveModal(null);
            setAdminNotes("");
            setIsShopFault(false);
        }
    };

    const pendingCount = complaints.length;

    return (
        <>
            {/* ── Page Header ── */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Quản lý Khiếu nại</h1>
                <p className={styles.pageSubtitle}>
                    Xử lý các khiếu nại từ người mua
                    {pendingCount > 0 && (
                        <span style={{
                            marginLeft: 10,
                            background: "var(--accent)",
                            color: "#fff",
                            borderRadius: 99,
                            padding: "2px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                        }}>
                            {pendingCount} chờ xử lý
                        </span>
                    )}
                </p>
            </div>

            {/* ── Filter Bar ── */}
            <div className={styles.filterBar}>
                <button className={styles.refreshBtn} onClick={fetchComplaints} disabled={loading}>
                    {loading ? "⏳ Đang tải..." : "🔄 Làm mới"}
                </button>
            </div>

            {/* ── Table ── */}
            {loading ? (
                <div className={styles.loading}>Đang tải dữ liệu...</div>
            ) : complaints.length === 0 ? (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <tbody>
                            <tr><td colSpan={7} className={styles.emptyRow}>Không có khiếu nại nào đang chờ xử lý</td></tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã ĐH</th>
                                <th>Người mua</th>
                                <th>Cửa hàng</th>
                                <th>Lý do</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id}>
                                    {/* Mã đơn hàng */}
                                    <td>
                                        <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14 }}>
                                            #{c.orderId}
                                        </span>
                                    </td>

                                    {/* Người mua */}
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.userAvatar}>
                                                {c.buyerId?.[0]?.toUpperCase() ?? "U"}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: 13 }}>
                                                {c.buyerId}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Cửa hàng */}
                                    <td>
                                        <span className={styles.tdMuted} style={{ fontWeight: 500 }}>
                                            {c.shopId}
                                        </span>
                                    </td>

                                    {/* Lý do — badge cam */}
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeAdmin}`}>
                                            {c.reason}
                                        </span>
                                    </td>

                                    {/* Mô tả */}
                                    <td>
                                        <div
                                            className={styles.tdMuted}
                                            style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                            title={c.description}
                                        >
                                            {c.description || "—"}
                                        </div>
                                    </td>

                                    {/* Ngày tạo */}
                                    <td className={styles.tdMuted}>
                                        {new Date(c.createdAt).toLocaleString("vi-VN")}
                                    </td>

                                    {/* Hành động */}
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                style={{ background: "#6366f1", color: "#fff" }}
                                                onClick={() => setResolveModal({ complaint: c, action: "approve" })}
                                            >
                                                ✅ Hoàn tiền
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.btnBan}`}
                                                onClick={() => setResolveModal({ complaint: c, action: "reject" })}
                                            >
                                                ❌ Shop giữ tiền
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Resolve Modal ── */}
            {resolveModal && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox} style={{ maxWidth: 480, textAlign: "left" }}>

                        {/* Icon + Tiêu đề */}
                        <div className={styles.confirmIcon}>
                            {resolveModal.action === "approve" ? "✅" : "❌"}
                        </div>
                        <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, margin: "0 0 4px", color: "var(--text)" }}>
                            {resolveModal.action === "approve" ? "Hoàn tiền cho khách" : "Shop giữ tiền"}
                        </h3>
                        <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 20px" }}>
                            {resolveModal.action === "approve"
                                ? "Khách hàng sẽ được hoàn tiền vào ví."
                                : "Tiền được giữ lại cho cửa hàng. Khách không được hoàn tiền."}
                        </p>

                        {/* Chi tiết khiếu nại */}
                        <div style={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "12px 16px",
                            marginBottom: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            fontSize: 13,
                            width: "100%",
                        }}>
                            <div><b>Mã đơn hàng:</b> <span style={{ color: "var(--accent)", fontWeight: 700 }}>#{resolveModal.complaint.orderId}</span></div>
                            <div><b>Lý do:</b> <span className={`${styles.badge} ${styles.badgeAdmin}`}>{resolveModal.complaint.reason}</span></div>
                            <div><b>Mô tả:</b> <span style={{ color: "var(--muted)" }}>{resolveModal.complaint.description || "—"}</span></div>
                        </div>

                        {/* Ghi chú Admin */}
                        <div style={{ width: "100%", marginBottom: 14 }}>
                            <label style={{
                                display: "block",
                                marginBottom: 6,
                                fontWeight: 700,
                                fontSize: 13,
                                color: "var(--text)",
                            }}>
                                Ghi chú Admin <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Nhập lý do hoặc ghi chú..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid var(--border)",
                                    background: "var(--surface)",
                                    color: "var(--text)",
                                    fontSize: 13,
                                    minHeight: 80,
                                    resize: "vertical",
                                    fontFamily: "Sora, sans-serif",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                            />
                        </div>

                        {/* Checkbox lỗi shop (chỉ khi approve) */}
                        {resolveModal.action === "approve" && (
                            <div style={{
                                width: "100%",
                                marginBottom: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 12px",
                                background: "var(--danger-bg)",
                                border: "1px solid var(--danger)",
                                borderRadius: "var(--radius-sm)",
                            }}>
                                <input
                                    type="checkbox"
                                    id="shopFault"
                                    checked={isShopFault}
                                    onChange={(e) => setIsShopFault(e.target.checked)}
                                    style={{ width: 16, height: 16, cursor: "pointer" }}
                                />
                                <label htmlFor="shopFault" style={{ color: "var(--danger)", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                                    Lỗi do cửa hàng (Phạt shop)
                                </label>
                            </div>
                        )}

                        {/* Actions */}
                        <div className={styles.confirmActions}>
                            <button
                                className={styles.btnCancel}
                                onClick={() => { setResolveModal(null); setAdminNotes(""); setIsShopFault(false); }}
                                disabled={resolving}
                            >
                                Huỷ
                            </button>
                            <button
                                className={styles.btnConfirm}
                                onClick={handleResolve}
                                disabled={resolving || !adminNotes.trim()}
                                style={{
                                    background: resolveModal.action === "approve" ? "var(--success)" : "var(--danger)",
                                    boxShadow: resolveModal.action === "approve"
                                        ? "0 4px 12px rgba(26,155,94,0.3)"
                                        : "0 4px 12px rgba(229,62,62,0.3)",
                                }}
                            >
                                {resolving ? "⏳ Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
