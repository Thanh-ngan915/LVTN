"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "../admin/dashboard/dashboard.module.css";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

interface UserDTO {
    id: string; username: string; fullName: string; email: string;
    image: string | null; status: string; role: string; storeRoleId: string | null;
    createdAt?: string;
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

    const userGrowthData = useMemo(() => {
        if (!users || users.length === 0) return [];
        
        let discrepancy = 0;
        if (stats?.total && stats.total > users.length) {
            discrepancy += (stats.total - users.length);
        }

        const countByMonth: Record<string, number> = {};
        let earliestKey: string | null = null;
        let earliestTime = Infinity;
        
        users.forEach(u => {
            if (!u.createdAt) {
                discrepancy++;
                return;
            }
            let dateVal: any = u.createdAt;
            if (Array.isArray(dateVal) && dateVal.length >= 3) {
                const [y, m, d] = dateVal;
                dateVal = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`;
            }
            const dateObj = new Date(dateVal);
            if (isNaN(dateObj.getTime())) {
                discrepancy++;
                return;
            }
            
            const y = dateObj.getFullYear();
            const m = dateObj.getMonth();
            const key = `${y}-${m}`;
            countByMonth[key] = (countByMonth[key] || 0) + 1;

            if (dateObj.getTime() < earliestTime) {
                earliestTime = dateObj.getTime();
                earliestKey = key;
            }
        });

        // Đưa những user bị ẩn/lỗi ngày vào tháng sớm nhất có user hoạt động (tránh hiện 1 ở các tháng trước khi dự án bắt đầu)
        if (discrepancy > 0) {
            if (earliestKey) {
                countByMonth[earliestKey] += discrepancy;
            } else {
                const td = new Date();
                countByMonth[`${td.getFullYear()}-${td.getMonth()}`] = discrepancy;
            }
        }

        const result = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const monthsWindow: {year: number, month: number}[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(currentYear, currentMonth - i, 1);
            monthsWindow.push({ year: d.getFullYear(), month: d.getMonth() });
        }

        let cumulative = 0;
        const startYear = monthsWindow[0].year;
        const startMonth = monthsWindow[0].month;

        Object.keys(countByMonth).forEach(k => {
            const [yStr, mStr] = k.split('-');
            const y = parseInt(yStr);
            const m = parseInt(mStr);
            if (y < startYear || (y === startYear && m < startMonth)) {
                cumulative += countByMonth[k];
            }
        });

        monthsWindow.forEach(({ year, month }) => {
            const key = `${year}-${month}`;
            cumulative += (countByMonth[key] || 0);
            result.push({
                name: `T${month + 1}`,
                "Người dùng": cumulative
            });
        });

        return result;
    }, [users, stats?.total]);

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

    const newestUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            const parseDate = (dateVal: any) => {
                if (!dateVal) return 0;
                if (Array.isArray(dateVal) && dateVal.length >= 3) {
                    const [y, m, d] = dateVal;
                    return new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`).getTime();
                }
                const ts = new Date(dateVal).getTime();
                return isNaN(ts) ? 0 : ts;
            };
            return parseDate(b.createdAt) - parseDate(a.createdAt);
        }).slice(0, 5);
    }, [users]);

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSubtitle}>Tổng quan hệ thống</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: '1 1 45%', minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#333', fontWeight: 600 }}>Phân bố người dùng</h3>
                    <div style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: "Tổng", "Số lượng": total },
                                    { name: "Hoạt động", "Số lượng": active },
                                    { name: "Bị khóa", "Số lượng": banned },
                                    { name: "Người bán", "Số lượng": sellers },
                                    { name: "Admin", "Số lượng": admins },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="Số lượng" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ flex: '1 1 45%', minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#333', fontWeight: 600 }}>Tăng trưởng người dùng</h3>
                    <div style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={userGrowthData.length > 0 ? userGrowthData : [
                                    { name: 'Chưa có', "Người dùng": 0 }
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Line type="monotone" dataKey="Người dùng" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {productStats && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>📦 Thống kê sản phẩm</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ flex: '1 1 100%', minWidth: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '16px', color: '#333', fontWeight: 600 }}>Phân bố trạng thái sản phẩm</h3>
                            <div style={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: "Tổng sản phẩm", "Số lượng": productStats.total },
                                            { name: "Chờ duyệt", "Số lượng": productStats.pending },
                                            { name: "Đang bán", "Số lượng": productStats.active },
                                            { name: "Ngừng bán", "Số lượng": productStats.inactive },
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                                        <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="Số lượng" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng người dùng mới nhất — chỉ hiện nếu có dữ liệu */}
            {newestUsers.length > 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Người dùng mới nhất</h2>
                    <table className={styles.table}>
                        <thead><tr><th>Tên</th><th>Email</th><th>Ngày đăng ký</th><th>Role</th><th>Trạng thái</th></tr></thead>
                        <tbody>
                        {newestUsers.map(u => {
                            let dateStr = "N/A";
                            if (u.createdAt) {
                                let dateVal: any = u.createdAt;
                                if (Array.isArray(dateVal) && dateVal.length >= 3) {
                                    const [y, m, d] = dateVal;
                                    dateVal = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`;
                                }
                                const dObj = new Date(dateVal);
                                if (!isNaN(dObj.getTime())) {
                                    dateStr = dObj.toLocaleDateString("vi-VN");
                                }
                            }
                            return (
                                <tr key={u.id}>
                                    <td>{u.fullName}</td>
                                    <td className={styles.tdMuted}>{u.email}</td>
                                    <td className={styles.tdMuted}>{dateStr}</td>
                                    <td><span className={`${styles.badge} ${roleColor[u.role] ?? ""}`}>{u.role}</span></td>
                                    <td><span className={`${styles.statusDot} ${statusColor[u.status] ?? ""}`}>{u.status}</span></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}