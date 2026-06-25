"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./orders.module.css";
import StoreSidebar from "../../components/StoreSidebar";

interface DeliveryInformationDTO {
    id?: number;
    recipientName?: string;
    phone?: string;
    province?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
}

interface ProductOrderItemDTO {
    id?: number;
    productId?: string;
    productName?: string;
    productImage?: string;
    quantity?: number;
    priceBefore?: number;
    priceAfter?: number;
    color?: string;
    size?: string;
}

interface OrderResponseDTO {
    id?: number;
    userId?: string;
    storeId?: string;
    total?: number;
    discount?: number;
    shopDiscount?: number;
    pay?: number;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    createdAt?: string;
    deliveryInformation?: DeliveryInformationDTO;
    items?: ProductOrderItemDTO[];
}

interface SellerOrderStatsDTO {
    totalRevenue?: number;
    totalOrders?: number;
    pendingCount?: number;
    confirmedCount?: number;
    shippingCount?: number;
    deliveredCount?: number;
    completedCount?: number;
    cancelledCount?: number;
}

interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
}

interface ConfirmModal {
    orderId: number;
    action: "confirmed" | "cancelled" | "shipping";
}

const API_BASE = "";

const STATUS_TABS = [
    { key: "", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "complained", label: "Đang khiếu nại" },
    { key: "refunded", label: "Hoàn trả" },
];

const STATUS_LABEL: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    complained: "Đang khiếu nại",
    refunded: "Hoàn trả",
};

function fmtVND(n?: number) {
    if (n == null) return "—";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(n);
}

function fmtDate(s?: string) {
    if (!s) return "—";
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function initials(name?: string) {
    if (!name) return "?";
    return name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
}

function getUserId(): string {
    if (typeof window === "undefined") return "";
    try {
        const user = localStorage.getItem("user");
        if (!user) return "";
        return JSON.parse(user).userId ?? "";
    } catch {
        return "";
    }
}

export default function SellerOrdersPage() {
    const router = useRouter();

    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [stats, setStats] = useState<SellerOrderStatsDTO | null>(null);
    const [activeTab, setActiveTab] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState<ConfirmModal | null>(null);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchOrders = useCallback(async (status: string) => {
        const userId = getUserId();
        if (!userId) return;
        setLoading(true);
        setError("");
        try {
            const params = status ? `?status=${status}` : "";
            const res = await fetch(`${API_BASE}/api/seller/orders${params}`, {
                headers: { "X-User-Id": userId },
            });
            const json: ApiResponse<OrderResponseDTO[]> = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message ?? "Lỗi không xác định");
            setOrders(json.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Không thể tải đơn hàng");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        const userId = getUserId();
        if (!userId) return;
        try {
            const res = await fetch(`${API_BASE}/api/seller/orders/stats`, {
                headers: { "X-User-Id": userId },
            });
            const json: ApiResponse<SellerOrderStatsDTO> = await res.json();
            if (res.ok && json.success) setStats(json.data ?? null);
        } catch { /* stats không critical */ }
    }, []);

    useEffect(() => {
        fetchOrders(activeTab);
        fetchStats();
    }, [activeTab, fetchOrders, fetchStats]);

    async function handleUpdateStatus() {
        const userId = getUserId();
        if (!modal) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/seller/orders/${modal.orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-User-Id": userId },
                body: JSON.stringify({ status: modal.action, note }),
            });
            const json: ApiResponse<OrderResponseDTO> = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message ?? "Cập nhật thất bại");
            setOrders((prev) => prev.map((o) => (o.id === modal.orderId ? (json.data ?? o) : o)));
            fetchStats();
            setModal(null);
            setNote("");
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Lỗi cập nhật");
        } finally {
            setSubmitting(false);
        }
    }

    const filtered = orders.filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            String(o.id).includes(q) ||
            o.deliveryInformation?.recipientName?.toLowerCase().includes(q) ||
            o.deliveryInformation?.phone?.includes(q)
        );
    });

    function tabCount(key: string): number | null {
        if (!stats) return null;
        const map: Record<string, number | undefined> = {
            pending: stats.pendingCount,
            confirmed: stats.confirmedCount,
            shipping: stats.shippingCount,
            delivered: stats.deliveredCount,
            completed: stats.completedCount,
            cancelled: stats.cancelledCount,
        };
        return key && map[key] != null ? (map[key] as number) : null;
    }

    return (
        <div className={styles.page}>
            <StoreSidebar />

            <main className={styles.main}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>📋 Quản lý đơn hàng</h1>
                        <p className={styles.pageSubtitle}>
                            {stats?.totalOrders ?? 0} đơn hàng · Doanh thu {fmtVND(stats?.totalRevenue)}
                        </p>
                    </div>
                    <button className={styles.btnRefresh} onClick={() => fetchOrders(activeTab)}>
                        🔄 Làm mới
                    </button>
                </div>

                {/* Stats */}
                {stats && (
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💰</div>
                            <div>
                                <div className={`${styles.statNum} ${styles.statAccent}`}>{fmtVND(stats.totalRevenue)}</div>
                                <div className={styles.statLabel}>Doanh thu</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📋</div>
                            <div>
                                <div className={styles.statNum}>{stats.totalOrders}</div>
                                <div className={styles.statLabel}>Tổng đơn</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>⏳</div>
                            <div>
                                <div className={`${styles.statNum} ${styles.statWarning}`}>{stats.pendingCount}</div>
                                <div className={styles.statLabel}>Chờ xác nhận</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🚚</div>
                            <div>
                                <div className={`${styles.statNum} ${styles.statInfo}`}>{stats.shippingCount}</div>
                                <div className={styles.statLabel}>Đang giao</div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>✅</div>
                            <div>
                                <div className={`${styles.statNum} ${styles.statSuccess}`}>{stats.completedCount}</div>
                                <div className={styles.statLabel}>Hoàn thành</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className={styles.filterBar}>
                    <div className={styles.tabs}>
                        {STATUS_TABS.map((tab) => {
                            const count = tabCount(tab.key);
                            return (
                                <button
                                    key={tab.key}
                                    className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                    {count != null && count > 0 && (
                                        <span className={styles.tabBadge}>{count}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            className={styles.searchInput}
                            placeholder="Tìm theo mã đơn, tên, SĐT…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

                {/* Table */}
                <div className={styles.tableSection}>
                    {loading ? (
                        <div className={styles.empty}><div className={styles.spinner} /></div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>📭</div>
                            <p className={styles.emptyText}>Không có đơn hàng nào</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Tổng tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày đặt</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map((order) => (
                                    <tr key={order.id}>
                                        <td><span className={styles.orderId}>#{order.id}</span></td>
                                        <td>
                                            <div className={styles.customerCell}>
                                                <div className={styles.avatar}>{initials(order.deliveryInformation?.recipientName)}</div>
                                                <div>
                                                    <div className={styles.customerName}>{order.deliveryInformation?.recipientName ?? "—"}</div>
                                                    <div className={styles.customerId}>{order.deliveryInformation?.phone ?? ""}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={styles.itemCount}>{order.items?.length ?? 0} sản phẩm</span></td>
                                        <td><span className={styles.amount}>{fmtVND(order.pay)}</span></td>
                                        <td>
                                            <span className={`${styles.payBadge} ${order.paymentStatus === "paid" ? styles.payPaid : styles.payPending}`}>
                                                {order.paymentStatus === "paid" ? "Đã thanh toán" : "COD"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[`status_${order.status}` as keyof typeof styles] ?? ""}`}>
                                                {STATUS_LABEL[order.status ?? ""] ?? order.status}
                                            </span>
                                        </td>
                                        <td><span className={styles.dateText}>{fmtDate(order.createdAt)}</span></td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.btnView}
                                                    onClick={() => router.push(`/seller/orders/${order.id}`)}
                                                >
                                                    Xem
                                                </button>
                                                {order.status === "pending" && (
                                                    <>
                                                        <button
                                                            className={styles.btnConfirm}
                                                            onClick={() => setModal({ orderId: order.id!, action: "confirmed" })}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                        <button
                                                            className={styles.btnReject}
                                                            onClick={() => setModal({ orderId: order.id!, action: "cancelled" })}
                                                        >
                                                            ✕
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === "confirmed" && (
                                                    <button
                                                        className={styles.btnShip}
                                                        onClick={() => setModal({ orderId: order.id!, action: "shipping" })}
                                                    >
                                                        Giao hàng
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
                </div>
            </main>

            {/* Modal */}
            {modal && (
                <div className={styles.overlay} onClick={() => setModal(null)}>
                    <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>
                            {modal.action === "confirmed" ? "✅" : modal.action === "cancelled" ? "❌" : "🚚"}
                        </div>
                        <h3>
                            {modal.action === "confirmed" ? "Xác nhận đơn hàng"
                                : modal.action === "cancelled" ? "Từ chối đơn hàng"
                                    : "Giao cho vận chuyển"}
                        </h3>
                        <p>
                            {modal.action === "confirmed"
                                ? `Xác nhận đơn #${modal.orderId} và tiến hành chuẩn bị hàng?`
                                : modal.action === "cancelled"
                                    ? `Từ chối đơn #${modal.orderId}? Hành động này không thể hoàn tác.`
                                    : `Bàn giao đơn #${modal.orderId} cho đơn vị vận chuyển?`}
                        </p>
                        <textarea
                            className={styles.noteInput}
                            rows={3}
                            placeholder="Ghi chú (tùy chọn)…"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={() => { setModal(null); setNote(""); }}>
                                Huỷ
                            </button>
                            {modal.action === "cancelled" ? (
                                <button className={styles.btnDelete} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Từ chối"}
                                </button>
                            ) : modal.action === "shipping" ? (
                                <button className={styles.btnSave} style={{ background: "#1d4ed8" }} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Xác nhận giao"}
                                </button>
                            ) : (
                                <button className={styles.btnSave} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Xác nhận"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}