"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../admin/dashboard/dashboard.module.css"; // ⚠️ chỉnh lại path cho khớp project

interface SettlementStatsDTO {
    totalRevenue: number;
    totalCommissionFee: number;
    totalCompletedOrders: number;
}

interface SettlementRowDTO {
    orderId: string;
    storeId: string;
    completedAt: string;
    grossAmount: number;
    commissionRate: number;
    commissionFee: number;
    status: string;
}

interface Props {
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
}

export default function RevenueTable({ authHeader, showToast }: Props) {
    const [stats, setStats] = useState<SettlementStatsDTO | null>(null);
    const [rows, setRows] = useState<SettlementRowDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [exporting, setExporting] = useState(false);

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        return params;
    }, [from, to]);

    const fetchStats = useCallback(async () => {
        const res = await fetch(`/api/admin/settlements/stats?${buildQuery()}`, { headers: authHeader() });
        const data = await res.json();
        if (data.success) setStats(data.data);
    }, [buildQuery, authHeader]);

    const fetchRows = useCallback(async (p = 0) => {
        setLoading(true);
        try {
            const params = buildQuery();
            params.set("page", String(p));
            params.set("size", "20");
            const res = await fetch(`/api/admin/settlements?${params}`, { headers: authHeader() });
            const data = await res.json();
            setRows(Array.isArray(data.data) ? data.data : []);
            setTotalPages(data.totalPages ?? 0);
            setPage(p);
        } catch {
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [buildQuery, authHeader]);

    useEffect(() => {
        fetchStats();
        fetchRows(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from, to]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`/api/admin/settlements/export?${buildQuery()}`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "doanh-thu-san.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch {
            showToast("❌ Xuất file thất bại");
        } finally {
            setExporting(false);
        }
    };

    const formatMoney = (n: number) =>
        n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const formatDate = (iso: string) =>
        iso ? new Date(iso).toLocaleString("vi-VN") : "—";

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>💰 Doanh thu sàn</h1>
                <p className={styles.pageSubtitle}>Theo dõi doanh thu, phí sàn và đơn hàng đã hoàn thành</p>
            </div>

            <div className={styles.filterBar}>
                <input
                    type="date"
                    className={styles.dateInput}
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                />
                <input
                    type="date"
                    className={styles.dateInput}
                    value={to}
                    onChange={e => setTo(e.target.value)}
                />
                <button
                    className={styles.refreshBtn}
                    onClick={() => { fetchStats(); fetchRows(page); }}
                >
                    🔄 Làm mới
                </button>
                <button
                    className={styles.btnConfirm}
                    onClick={handleExport}
                    disabled={exporting}
                >
                    {exporting ? "Đang xuất..." : "📊 Xuất Excel"}
                </button>
            </div>

            {stats && (
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.statGreen}`}>
                        <span className={styles.statIcon}>💵</span>
                        <span className={styles.statValue}>{formatMoney(stats.totalRevenue)}</span>
                        <span className={styles.statLabel}>Tổng doanh thu toàn sàn</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statOrange}`}>
                        <span className={styles.statIcon}>🏦</span>
                        <span className={styles.statValue}>{formatMoney(stats.totalCommissionFee)}</span>
                        <span className={styles.statLabel}>Tổng phí sàn thu về</span>
                    </div>
                    <div className={`${styles.statCard} ${styles.statBlue}`}>
                        <span className={styles.statIcon}>📦</span>
                        <span className={styles.statValue}>{stats.totalCompletedOrders}</span>
                        <span className={styles.statLabel}>Tổng đơn hoàn thành</span>
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Ngày hoàn thành</th>
                        <th>Tổng giá trị đơn</th>
                        <th>Phí % sàn</th>
                        <th>Tiền phí thu về</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={5} className={styles.emptyRow}>Đang tải...</td></tr>
                    ) : rows.length === 0 ? (
                        <tr><td colSpan={5} className={styles.emptyRow}>Không có dữ liệu</td></tr>
                    ) : rows.map(r => (
                        <tr key={r.orderId}>
                            <td>#{r.orderId}</td>
                            <td className={styles.tdMuted}>{formatDate(r.completedAt)}</td>
                            <td>{formatMoney(r.grossAmount)}</td>
                            <td className={styles.tdMuted}>{r.commissionRate.toFixed(1)}%</td>
                            <td>{formatMoney(r.commissionFee)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button className={styles.refreshBtn} disabled={page === 0} onClick={() => fetchRows(page - 1)}>
                        ‹ Trước
                    </button>
                    <span className={styles.pageInfo}>Trang {page + 1} / {totalPages}</span>
                    <button className={styles.refreshBtn} disabled={page >= totalPages - 1} onClick={() => fetchRows(page + 1)}>
                        Sau ›
                    </button>
                </div>
            )}
        </div>
    );
}