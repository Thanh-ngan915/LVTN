// Tạo file: components/ShopTable.tsx
"use client";

import { useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface StoreDTO {
    id: string;
    name: string;
    image: string | null;
    location: string;
    description: string;
    status: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updateAt?: string;
}

interface Props {
    shops: StoreDTO[];
    loading: boolean;
    onRefresh: () => void;
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
    logActivity: (action: string, target: string, category?: string) => Promise<void>;
}

export default function ShopTable({ shops, loading, onRefresh, authHeader, showToast, logActivity }: Props) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<{
        shopId: string; action: "approve" | "ban" | "unban"; label: string;
    } | null>(null);
    const [viewShop, setViewShop] = useState<StoreDTO | null>(null);


    const filtered = shops.filter(s => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.location ?? "").toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            filterStatus === "ALL" ? true :
                filterStatus === "PENDING" ? s.status === "pending" :
                    filterStatus === "ACTIVE"  ? s.status === "active"  :
                        s.status === "banned";
        return matchSearch && matchStatus;
    });

    const pendingCount = shops.filter(s => s.status === "pending").length;

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(confirm.shopId);
        try {
            const { shopId, action } = confirm;
            let endpoint = "";

            if (action === "approve") {
                endpoint = `/api/stores/${shopId}/approve`;
            } else if (action === "ban") {
                endpoint = `/api/stores/${shopId}/status?status=banned`;
            } else {
                endpoint = `/api/stores/${shopId}/status?status=active`;
            }

            const res = await fetch(endpoint, { method: "PATCH", headers: authHeader() });
            if (!res.ok) throw new Error();
            const actionLabel =
                action === "approve" ? "Duyệt shop" :
                action === "ban"     ? "Khóa shop"  :
                                      "Mở khóa shop";
            showToast(
                action === "approve" ? "✅ Đã duyệt shop" :
                    action === "ban"     ? "🔒 Đã khóa shop"  :
                        "🔓 Đã mở khóa shop"
            );
            await logActivity(actionLabel, confirm.label.replace(/["?]/g, "").trim(), "shop");
            onRefresh();
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
                <h1 className={styles.pageTitle}>Quản lý Shop</h1>
                <p className={styles.pageSubtitle}>
                    Duyệt & kiểm soát các shop trên hệ thống
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
                    placeholder="Tìm theo tên shop, địa điểm..."
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
                            <th>Shop</th>
                            <th>Địa điểm</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className={styles.emptyRow}>Không có dữ liệu</td></tr>
                        ) : filtered.map(s => (
                            <tr key={s.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.userAvatar}>
                                            {s.image
                                                ? <img src={s.image} alt="" />
                                                : s.name?.[0]?.toUpperCase() ?? "S"}
                                        </div>
                                        <span>{s.name}</span>
                                    </div>
                                </td>
                                <td className={styles.tdMuted}>{s.location || "—"}</td>
                                <td className={styles.tdMuted} style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {s.description || "—"}
                                </td>
                                <td>
                                    {s.status === "pending" && (
                                        <span className={`${styles.badge} ${styles.badgeAdmin}`}>⏳ Chờ duyệt</span>
                                    )}
                                    {s.status === "active" && (
                                        <span className={`${styles.statusDot} ${styles.statusActive}`}>Hoạt động</span>
                                    )}
                                    {s.status === "banned" && (
                                        <span className={`${styles.statusDot} ${styles.statusBanned}`}>Đã khóa</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        {/* Xem chi tiết */}
                                        <button
                                            className={`${styles.actionBtn}`}
                                            style={{ background: "#6366f1", color: "#fff" }}
                                            onClick={() => setViewShop(s)}
                                        >
                                            🔍 Xem
                                        </button>

                                        {s.status === "pending" && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                disabled={actionLoading === s.id}
                                                onClick={() => setConfirm({
                                                    shopId: s.id,
                                                    action: "approve",
                                                    label: `Duyệt shop "${s.name}"?`
                                                })}
                                            >
                                                ✅ Duyệt
                                            </button>
                                        )}
                                        {s.status === "active" && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.btnBan}`}
                                                disabled={actionLoading === s.id}
                                                onClick={() => setConfirm({
                                                    shopId: s.id,
                                                    action: "ban",
                                                    label: `Khóa shop "${s.name}"?`
                                                })}
                                            >
                                                🔒 Khóa
                                            </button>
                                        )}
                                        {s.status === "banned" && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                disabled={actionLoading === s.id}
                                                onClick={() => setConfirm({
                                                    shopId: s.id,
                                                    action: "unban",
                                                    label: `Mở khóa shop "${s.name}"?`
                                                })}
                                            >
                                                🔓 Mở khóa
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal xem chi tiết shop */}
            {viewShop && (
                <div className={styles.overlay} onClick={() => setViewShop(null)}>
                    <div className={styles.confirmBox} style={{ maxWidth: 480, textAlign: "left" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                            <div className={styles.userAvatar} style={{ width: 56, height: 56, fontSize: 24 }}>
                                {viewShop.image
                                    ? <img src={viewShop.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                                    : viewShop.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{viewShop.name}</h3>
                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{viewShop.status}</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                            <div><b>Shop ID:</b> <code style={{ fontSize: 12 }}>{viewShop.id}</code></div>
                            <div><b>Tên shop:</b> {viewShop.name}</div>
                            <div><b>Địa điểm:</b> {viewShop.location || "—"}</div>
                            <div><b>Mô tả:</b> {viewShop.description || "—"}</div>
                            <div><b>Người tạo:</b> {viewShop.createdBy || "—"}</div>
                            <div><b>Cập nhật bởi:</b> {viewShop.updatedBy || "—"}</div>
                            <div><b>Ảnh:</b> {viewShop.image || "—"}</div>
                            <div><b>Ngày tạo:</b> {viewShop.createdAt ? new Date(viewShop.createdAt).toLocaleString("vi-VN") : "—"}</div>
                            <div><b>Cập nhật lúc:</b> {viewShop.updateAt ? new Date(viewShop.updateAt).toLocaleString("vi-VN") : "—"}</div>
                        </div>
                        <div className={styles.confirmActions} style={{ marginTop: 20 }}>
                            <button className={styles.btnConfirm} onClick={() => setViewShop(null)}>Đóng</button>
                        </div>
                    </div>
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