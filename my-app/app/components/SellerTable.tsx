"use client";

import { useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface SellerDTO {
    userId: string;
    fullName: string;
    email: string;
    username: string;
    image: string | null;
    status: string;
    storeRoleId: string | null;
}

interface Props {
    sellers: SellerDTO[];
    loading: boolean;
    onRefresh: () => void;
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
}

export default function SellerTable({ sellers, loading, onRefresh, authHeader, showToast }: Props) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<{
        userId: string; action: "approve" | "ban" | "unban"; label: string;
    } | null>(null);

    const filtered = sellers.filter(s => {
        const matchSearch =
            s.fullName.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.username.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "ALL" ? true :
                filterStatus === "PENDING" ? !s.storeRoleId :
                    filterStatus === "ACTIVE" ? s.status === "ACTIVE" && !!s.storeRoleId :
                        s.status === "BANNED";
        return matchSearch && matchStatus;
    });

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(confirm.userId);
        try {
            const { userId, action } = confirm;
            let endpoint = "";
            let method = "PATCH";

            if (action === "approve") {
                endpoint = `/api/admin/sellers/${userId}/approve`;
            } else if (action === "ban") {
                endpoint = `/api/admin/users/${userId}/status?status=BANNED`;
            } else {
                endpoint = `/api/admin/users/${userId}/status?status=ACTIVE`;
            }

            const res = await fetch(endpoint, { method, headers: authHeader() });
            if (!res.ok) throw new Error();
            showToast(
                action === "approve" ? "✅ Đã duyệt người bán" :
                    action === "ban"     ? "🔒 Đã khóa tài khoản" :
                        "🔓 Đã mở khóa tài khoản"
            );
            onRefresh();
        } catch {
            showToast("❌ Thao tác thất bại");
        } finally {
            setActionLoading(null);
            setConfirm(null);
        }
    };

    const getSellerStatus = (s: SellerDTO) => {
        if (s.status === "BANNED") return "banned";
        if (!s.storeRoleId)        return "pending";
        return "active";
    };

    const pendingCount = sellers.filter(s => !s.storeRoleId && s.status !== "BANNED").length;

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Quản lý người bán</h1>
                <p className={styles.pageSubtitle}>
                    Duyệt đăng ký & kiểm soát tài khoản người bán
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
                            {pendingCount} chờ duyệt
                        </span>
                    )}
                </p>
            </div>

            {/* Filter bar */}
            <div className={styles.filterBar}>
                <input
                    className={styles.searchInput}
                    placeholder="Tìm theo tên, email, username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="ACTIVE">Đang hoạt động</option>
                    <option value="BANNED">Đã khóa</option>
                </select>
                <button className={styles.refreshBtn} onClick={onRefresh}>🔄 Làm mới</button>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Người bán</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className={styles.emptyRow}>Không có dữ liệu</td></tr>
                        ) : filtered.map(s => {
                            const st = getSellerStatus(s);
                            return (
                                <tr key={s.userId}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.userAvatar}>
                                                {s.image
                                                    ? <img src={s.image} alt="" />
                                                    : s.fullName?.[0]?.toUpperCase() ?? "S"}
                                            </div>
                                            <span>{s.fullName}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tdMuted}>{s.email}</td>
                                    <td className={styles.tdMuted}>@{s.username}</td>
                                    <td>
                                        {st === "pending" && (
                                            <span className={`${styles.badge} ${styles.badgeAdmin}`}>⏳ Chờ duyệt</span>
                                        )}
                                        {st === "active" && (
                                            <span className={`${styles.statusDot} ${styles.statusActive}`}>Hoạt động</span>
                                        )}
                                        {st === "banned" && (
                                            <span className={`${styles.statusDot} ${styles.statusBanned}`}>Đã khóa</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            {st === "pending" && (
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                    disabled={actionLoading === s.userId}
                                                    onClick={() => setConfirm({
                                                        userId: s.userId,
                                                        action: "approve",
                                                        label: `Duyệt người bán "${s.fullName}"?`
                                                    })}
                                                >
                                                    ✅ Duyệt
                                                </button>
                                            )}
                                            {st === "active" && (
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnBan}`}
                                                    disabled={actionLoading === s.userId}
                                                    onClick={() => setConfirm({
                                                        userId: s.userId,
                                                        action: "ban",
                                                        label: `Khóa tài khoản "${s.fullName}"?`
                                                    })}
                                                >
                                                    🔒 Khóa
                                                </button>
                                            )}
                                            {st === "banned" && (
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                    disabled={actionLoading === s.userId}
                                                    onClick={() => setConfirm({
                                                        userId: s.userId,
                                                        action: "unban",
                                                        label: `Mở khóa tài khoản "${s.fullName}"?`
                                                    })}
                                                >
                                                    🔓 Mở khóa
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm modal */}
            {confirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <div className={styles.confirmIcon}>
                            {confirm.action === "approve" ? "✅" : confirm.action === "ban" ? "🔒" : "🔓"}
                        </div>
                        <h3>Xác nhận</h3>
                        <p>{confirm.label}</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={() => setConfirm(null)}>Huỷ</button>
                            <button
                                className={styles.btnConfirm}
                                disabled={!!actionLoading}
                                onClick={handleAction}
                            >
                                {actionLoading ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}