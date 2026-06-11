"use client";

import { useEffect, useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface WithdrawalRequest {
    id: string;
    storeId: string;
    walletId: string;
    amount: number;
    bankAccountNumber: string;
    bankName: string;
    accountHolderName: string;
    status: "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";
    vnpayTransactionCode?: string;
    vnpayFailReason?: string;
    rejectReason?: string;
    createdBy: string;
    createdAt: string;
    processedAt?: string;
    processedBy?: string;
}

interface PageResponse {
    content: WithdrawalRequest[];
    totalPages: number;
    totalElements: number;
    number: number;
}

interface Props {
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
}

export default function WithdrawalTable({ authHeader, showToast }: Props) {
    const [data, setData] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("PENDING");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Confirm modal
    const [confirm, setConfirm] = useState<{
        id: string;
        action: "approve" | "reject";
        label: string;
    } | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    // View detail modal
    const [viewItem, setViewItem] = useState<WithdrawalRequest | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const statusParam = filterStatus !== "ALL" ? `&status=${filterStatus}` : "";
            const res = await fetch(
                `/api/wallet/admin/withdrawals?page=${page}&size=10${statusParam}`,
                { headers: authHeader() }
            );
            const json: PageResponse = await res.json();
            setData(json.content ?? []);
            setTotalPages(json.totalPages ?? 0);
            setTotalElements(json.totalElements ?? 0);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filterStatus, page]);

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(confirm.id);
        try {
            if (confirm.action === "approve") {
                const res = await fetch(
                    `/api/wallet/admin/withdrawals/${confirm.id}/approve`,
                    { method: "PUT", headers: authHeader() }
                );
                const json = await res.json();

                if (json.status === "SUCCESS") {
                    showToast(`✅ VNPay chuyển khoản thành công! Mã GD: ${json.transactionCode}`);
                } else {
                    showToast(`⚠️ VNPay thất bại: ${json.reason} — Đã hoàn tiền về ví seller`);
                }
            } else {
                const res = await fetch(
                    `/api/wallet/admin/withdrawals/${confirm.id}/reject?reason=${encodeURIComponent(rejectReason)}`,
                    { method: "PUT", headers: authHeader() }
                );
                if (!res.ok) throw new Error();
                showToast("❌ Đã từ chối yêu cầu");
            }

            fetchData();
        } catch {
            showToast("❌ Thao tác thất bại");
        } finally {
            setActionLoading(null);
            setConfirm(null);
            setRejectReason("");
        }
    };

    const pendingCount = filterStatus === "PENDING" ? totalElements : undefined;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const statusBadge = (status: string) => {
        if (status === "PENDING")
            return <span className={`${styles.badge} ${styles.badgeAdmin}`}>⏳ Chờ duyệt</span>;
        if (status === "COMPLETED")
            return <span className={`${styles.statusDot} ${styles.statusActive}`}>✅ Đã thanh toán</span>;
        if (status === "FAILED")
            return <span className={`${styles.statusDot} ${styles.statusBanned}`}>⚠️ VNPay thất bại</span>;
        return <span className={`${styles.statusDot} ${styles.statusBanned}`}>❌ Từ chối</span>;
    };

    return (
        <>
            {/* Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Quản lý Rút tiền</h1>
                <p className={styles.pageSubtitle}>
                    Duyệt & từ chối các yêu cầu rút tiền từ seller
                    {filterStatus === "PENDING" && totalElements > 0 && (
                        <span style={{
                            marginLeft: 10, background: "var(--accent)", color: "#fff",
                            borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 700,
                        }}>
                            {totalElements} chờ duyệt
                        </span>
                    )}
                </p>
            </div>

            {/* Filter bar */}
            <div className={styles.filterBar}>
                <select
                    className={styles.filterSelect}
                    value={filterStatus}
                    onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="COMPLETED">Đã duyệt</option>
                    <option value="REJECTED">Từ chối</option>
                </select>
                <button className={styles.refreshBtn} onClick={() => fetchData()}>🔄 Làm mới</button>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Store ID</th>
                                    <th>Số tiền</th>
                                    <th>Ngân hàng</th>
                                    <th>Chủ tài khoản</th>
                                    <th>Số TK</th>
                                    <th>Ngày yêu cầu</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className={styles.emptyRow}>Không có dữ liệu</td>
                                    </tr>
                                ) : data.map(req => (
                                    <tr key={req.id}>
                                        <td className={styles.tdMuted} style={{ fontSize: 12 }}>
                                            <code>{req.storeId.slice(0, 8)}…</code>
                                        </td>
                                        <td style={{ fontWeight: 700, color: "var(--accent)" }}>
                                            {formatCurrency(req.amount)}
                                        </td>
                                        <td>{req.bankName}</td>
                                        <td>{req.accountHolderName}</td>
                                        <td className={styles.tdMuted}>{req.bankAccountNumber}</td>
                                        <td className={styles.tdMuted}>
                                            {new Date(req.createdAt).toLocaleString("vi-VN")}
                                        </td>
                                        <td>
                                            {statusBadge(req.status)}
                                            {req.status === "COMPLETED" && req.vnpayTransactionCode && (
                                                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                                                    Mã GD: {req.vnpayTransactionCode}
                                                </div>
                                            )}
                                            {req.status === "FAILED" && req.vnpayFailReason && (
                                                <div style={{ fontSize: 11, color: "var(--danger)", marginTop: 4 }}>
                                                    ↳ {req.vnpayFailReason}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.actionBtn}
                                                    style={{ background: "#6366f1", color: "#fff" }}
                                                    onClick={() => setViewItem(req)}
                                                >
                                                    🔍 Xem
                                                </button>
                                                {req.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                            disabled={actionLoading === req.id}
                                                            onClick={() => setConfirm({
                                                                id: req.id,
                                                                action: "approve",
                                                                label: `Duyệt rút ${formatCurrency(req.amount)} cho store ${req.storeId.slice(0, 8)}?`,
                                                            })}
                                                        >
                                                            ✅ Duyệt
                                                        </button>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.btnBan}`}
                                                            disabled={actionLoading === req.id}
                                                            onClick={() => setConfirm({
                                                                id: req.id,
                                                                action: "reject",
                                                                label: `Từ chối yêu cầu rút ${formatCurrency(req.amount)}?`,
                                                            })}
                                                        >
                                                            ❌ Từ chối
                                                        </button>
                                                    </>
                                                )}

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                            <button
                                className={styles.refreshBtn}
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                ← Trước
                            </button>
                            <span style={{ padding: "8px 12px", fontSize: 14, color: "var(--muted)" }}>
                                Trang {page + 1} / {totalPages}
                            </span>
                            <button
                                className={styles.refreshBtn}
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal xem chi tiết */}
            {viewItem && (
                <div className={styles.overlay} onClick={() => setViewItem(null)}>
                    <div
                        className={styles.confirmBox}
                        style={{ maxWidth: 480, textAlign: "left" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: "0 0 16px", fontFamily: "Fraunces, serif" }}>
                            Chi tiết yêu cầu rút tiền
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, width: "100%" }}>
                            <div><b>Mã yêu cầu:</b> <code style={{ fontSize: 12 }}>{viewItem.id}</code></div>
                            <div><b>Store ID:</b> <code style={{ fontSize: 12 }}>{viewItem.storeId}</code></div>
                            <div><b>Số tiền:</b> <span style={{ color: "var(--accent)", fontWeight: 700 }}>{formatCurrency(viewItem.amount)}</span></div>
                            <div><b>Ngân hàng:</b> {viewItem.bankName}</div>
                            <div><b>Số tài khoản:</b> {viewItem.bankAccountNumber}</div>
                            <div><b>Chủ tài khoản:</b> {viewItem.accountHolderName}</div>
                            <div><b>Trạng thái:</b> {statusBadge(viewItem.status)}</div>
                            <div><b>Ngày tạo:</b> {new Date(viewItem.createdAt).toLocaleString("vi-VN")}</div>
                            {viewItem.processedAt && (
                                <div><b>Xử lý lúc:</b> {new Date(viewItem.processedAt).toLocaleString("vi-VN")}</div>
                            )}
                            {viewItem.processedBy && (
                                <div><b>Xử lý bởi:</b> {viewItem.processedBy}</div>
                            )}
                            {viewItem.rejectReason && (
                                <div style={{ color: "var(--danger)" }}>
                                    <b>Lý do từ chối:</b> {viewItem.rejectReason}
                                </div>
                            )}
                        </div>
                        <div className={styles.confirmActions} style={{ marginTop: 20 }}>
                            <button className={styles.btnConfirm} onClick={() => setViewItem(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm modal */}
            {confirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <div className={styles.confirmIcon}>
                            {confirm.action === "approve" ? "✅" : "❌"}
                        </div>
                        <h3>Xác nhận</h3>
                        <p>{confirm.label}</p>

                        {/* Nhập lý do từ chối */}
                        {confirm.action === "reject" && (
                            <input
                                className={styles.searchInput}
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder="Nhập lý do từ chối..."
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                            />
                        )}

                        <div className={styles.confirmActions}>
                            <button
                                className={styles.btnCancel}
                                onClick={() => { setConfirm(null); setRejectReason(""); }}
                            >
                                Huỷ
                            </button>
                            <button
                                className={styles.btnConfirm}
                                disabled={
                                    !!actionLoading ||
                                    (confirm.action === "reject" && !rejectReason.trim())
                                }
                                onClick={handleAction}
                            >
                                {actionLoading
                                    ? (confirm?.action === "approve" ? "⏳ Đang gọi VNPay..." : "Đang xử lý...")
                                    : "Xác nhận"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}