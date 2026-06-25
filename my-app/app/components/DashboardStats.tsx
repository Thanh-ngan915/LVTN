"use client";
import { useEffect, useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface UserDTO {
    id: string; username: string; fullName: string; email: string;
    image: string | null; status: string; role: string; storeRoleId: string | null;
}
interface ProductStats {
    total: number;
    pending: number;
    active: number;
    inactive: number;
}
interface AdminStats {
    total: number;
    active: number;
    banned: number;
    sellers: number;
    admins: number;
}

interface Props {
    users: UserDTO[];
    productStats: ProductStats | null;
    authHeader: (tok?: string, uid?: string) => HeadersInit;
}

export default function DashboardStats({ users, productStats, authHeader }: Props) {
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        // Đọc token trực tiếp từ localStorage — tránh lỗi closure (token state cha = null lúc mount)
        const token = localStorage.getItem("token") || "";
        const userStr = localStorage.getItem("user");
        const userId = userStr ? (JSON.parse(userStr).userId || "") : "";

        if (!token) return;

        // Gọi /api/admin/stats — mọi ADMIN đều có quyền, không cần PERM_users
        fetch("/api/admin/stats", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-Id": userId,
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setStats({
                    total:   data.total   ?? 0,
                    active:  data.active  ?? 0,
                    banned:  data.banned  ?? 0,
                    sellers: data.sellers ?? 0,
                    admins:  data.admins  ?? 0,
                });
            })
            .catch(() => {});
    }, []);

    // Nếu stats chưa về thì fallback từ users array (nếu có)
    const total   = stats?.total   ?? users.length;
    const active  = stats?.active  ?? users.filter(u => u.status === "ACTIVE").length;
    const banned  = stats?.banned  ?? users.filter(u => u.status === "BANNED").length;
    const sellers = stats?.sellers ?? users.filter(u => u.role === "SELLER").length;
    const admins  = stats?.admins  ?? users.filter(u => u.role === "ADMIN").length;

    const roleColor: Record<string, string> = {
        ADMIN: styles.badgeAdmin, SELLER: styles.badgeSeller, USER: styles.badgeUser,
    };
    const statusColor: Record<string, string> = {
        ACTIVE: styles.statusActive, BANNED: styles.statusBanned,
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSubtitle}>Tổng quan hệ thống</p>
            </div>
            <div className={styles.statsGrid}>
                {[
                    { icon: "👥", value: total,   label: "Tổng người dùng", cls: styles.statBlue },
                    { icon: "✅", value: active,  label: "Đang hoạt động",  cls: styles.statGreen },
                    { icon: "🚫", value: banned,  label: "Bị khóa",         cls: styles.statRed },
                    { icon: "🏪", value: sellers, label: "Người bán",       cls: styles.statPurple },
                    { icon: "🛡️", value: admins,  label: "Quản trị viên",  cls: styles.statOrange },
                ].map(({ icon, value, label, cls }) => (
                    <div key={label} className={`${styles.statCard} ${cls}`}>
                        <div className={styles.statIcon}>{icon}</div>
                        <div className={styles.statValue}>{value}</div>
                        <div className={styles.statLabel}>{label}</div>
                    </div>
                ))}
            </div>

            {productStats && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>📦 Thống kê sản phẩm</h2>
                    <div className={styles.statsGrid}>
                        {[
                            { icon: "📦", value: productStats.total,
                                label: "Tổng sản phẩm", cls: styles.statBlue },
                            { icon: "⏳", value: productStats.pending,
                                label: "Chờ duyệt", cls: styles.statOrange },
                            { icon: "✅", value: productStats.active,
                                label: "Đang bán", cls: styles.statGreen },
                            { icon: "🚫", value: productStats.inactive,
                                label: "Ngừng bán", cls: styles.statRed },
                        ].map(({ icon, value, label, cls }) => (
                            <div key={label} className={`${styles.statCard} ${cls}`}>
                                <div className={styles.statIcon}>{icon}</div>
                                <div className={styles.statValue}>{value}</div>
                                <div className={styles.statLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Phân bố vai trò</h2>
                <div className={styles.roleChart}>
                    {[
                        { role: "USER",   count: total - sellers - admins },
                        { role: "SELLER", count: sellers },
                        { role: "ADMIN",  count: admins },
                    ].map(({ role, count }) => {
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <div key={role} className={styles.roleRow}>
                                <span className={styles.roleLabel}>{role}</span>
                                <div className={styles.roleBar}>
                                    <div className={`${styles.roleBarFill} ${styles["roleBarFill" + role]}`}
                                         style={{ width: `${pct}%` }} />
                                </div>
                                <span className={styles.roleCount}>{count} ({pct}%)</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bảng người dùng mới nhất — chỉ hiện nếu có dữ liệu */}
            {users.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Người dùng mới nhất</h2>
                    <table className={styles.table}>
                        <thead><tr><th>Tên</th><th>Email</th><th>Role</th><th>Trạng thái</th></tr></thead>
                        <tbody>
                        {users.slice(0, 5).map(u => (
                            <tr key={u.id}>
                                <td>{u.fullName}</td>
                                <td className={styles.tdMuted}>{u.email}</td>
                                <td><span className={`${styles.badge} ${roleColor[u.role] ?? ""}`}>{u.role}</span></td>
                                <td><span className={`${styles.statusDot} ${statusColor[u.status] ?? ""}`}>{u.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}