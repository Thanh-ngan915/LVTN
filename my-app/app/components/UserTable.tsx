"use client";
import { useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";
import DetailModal from "./DetailModal";

interface UserDTO {
    id: string; username: string; fullName: string; email: string;
    image: string | null; status: string; role: string;
    storeRoleId: string | null; address?: string | null;
    birthday?: string | null; rankId?: string | null;
}

interface ConfirmPayload {
    type: "role" | "status"; userId: string; value: string; label: string;
}

interface Props {
    users: UserDTO[];
    loading: boolean;
    onRefresh: () => void;
    onAction: (payload: ConfirmPayload) => void;
    authHeader: () => Record<string, string>;  // ← thêm để fetch detail
}

export default function UserTable({ users, loading, onRefresh, onAction, authHeader }: Props) {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [detailUser, setDetailUser] = useState<UserDTO | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchDetail = async (userId: string) => {
        setLoadingDetail(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { headers: authHeader() });
            const data = await res.json();
            setDetailUser(data);
        } catch {
            alert("Không thể tải thông tin user");
        } finally {
            setLoadingDetail(false);
        }
    };

    const roleColor: Record<string, string> = {
        ADMIN: styles.badgeAdmin, SELLER: styles.badgeSeller, USER: styles.badgeUser,
    };
    const statusColor: Record<string, string> = {
        ACTIVE: styles.statusActive, BANNED: styles.statusBanned,
    };

    const filtered = users.filter(u => {
        const matchSearch =
            u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.username?.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "ALL" || u.role === roleFilter;
        const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Quản lý người dùng</h1>
                <p className={styles.pageSubtitle}>Phân quyền và kiểm soát tài khoản</p>
            </div>

            <div className={styles.filterBar}>
                <input className={styles.searchInput}
                       placeholder="🔍 Tìm theo tên, email, username..."
                       value={search} onChange={e => setSearch(e.target.value)} />
                <select className={styles.filterSelect} value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}>
                    <option value="ALL">Tất cả role</option>
                    <option value="USER">USER</option>
                    <option value="SELLER">SELLER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
                <select className={styles.filterSelect} value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BANNED">BANNED</option>
                </select>
                <button className={styles.refreshBtn} onClick={onRefresh}>🔄 Làm mới</button>
            </div>

            {loading ? <div className={styles.loading}>Đang tải...</div> : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Người dùng</th><th>Username</th><th>Email</th>
                            <th>Role</th><th>Trạng thái</th><th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.userAvatar}>
                                            {u.image
                                                ? <img src={u.image} alt={u.fullName} />
                                                : <span>{u.fullName?.[0] ?? "?"}</span>}
                                        </div>
                                        <span>{u.fullName}</span>
                                    </div>
                                </td>
                                <td className={styles.tdMuted}>{u.username}</td>
                                <td className={styles.tdMuted}>{u.email}</td>
                                <td>
                                        <span className={`${styles.badge} ${roleColor[u.role] ?? ""}`}>
                                            {u.role}
                                        </span>
                                </td>
                                <td>
                                        <span className={`${styles.statusDot} ${statusColor[u.status] ?? ""}`}>
                                            {u.status === "ACTIVE" ? "✅ Active" : "🚫 Banned"}
                                        </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        {/* ✅ Nút xem chi tiết */}
                                        <button
                                            className={styles.btnDetail}
                                            onClick={() => fetchDetail(u.id)}
                                            disabled={loadingDetail}
                                        >
                                            👁️
                                        </button>

                                        <select className={styles.actionSelect}
                                                value={u.role === "SELLER" ? "USER" : u.role}
                                                onChange={e => onAction({
                                                    type: "role", userId: u.id, value: e.target.value,
                                                    label: `Đổi role của "${u.fullName}" thành ${e.target.value}?`,
                                                })}>
                                            <option value="USER">
                                                USER{u.role === "SELLER" ? " " : ""}
                                            </option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>

                                        <button
                                            className={`${styles.actionBtn} ${u.status === "ACTIVE" ? styles.btnBan : styles.btnActivate}`}
                                            onClick={() => onAction({
                                                type: "status", userId: u.id,
                                                value: u.status === "ACTIVE" ? "BANNED" : "ACTIVE",
                                                label: u.status === "ACTIVE"
                                                    ? `Khóa tài khoản "${u.fullName}"?`
                                                    : `Mở khóa tài khoản "${u.fullName}"?`,
                                            })}>
                                            {u.status === "ACTIVE" ? "🔒 Khóa" : "🔓 Mở"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className={styles.emptyRow}>
                                    Không tìm thấy người dùng
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {detailUser && (
                <DetailModal
                    user={detailUser}
                    onClose={() => setDetailUser(null)}
                />
            )}
        </div>
    );
}