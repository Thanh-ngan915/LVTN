"use client";

import { useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";


interface ProductDTO {
    id: number;
    name: string;
    priceBefore: number;
    priceAfter: number;
    status: string;
    categoryName: string;
    storeId: string;
    currentQuantity: number;
    imageUrls: string[];
    createdBy: string;
    description: string;
}

interface Props {
    products: ProductDTO[];
    loading: boolean;
    onRefresh: () => void;
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
}

export default function ProductTable({ products, loading, onRefresh, authHeader, showToast }: Props) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("pending");
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [confirm, setConfirm] = useState<{
        productId: number; action: "approve" | "reject" | "hide"; label: string;
    } | null>(null);
    const [viewProduct, setViewProduct] = useState<ProductDTO | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 100;

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "ALL" ? true : p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);


    const pendingCount = products.filter(p => p.status === "pending").length;

    const handleAction = async () => {
        if (!confirm) return;
        setActionLoading(confirm.productId);
        try {
            const { productId, action } = confirm;
            const endpoint = action === "approve"
                ? `/api/products/${productId}/approve`
                : action === "reject"
                    ? `/api/products/${productId}/reject`
                    : `/api/products/${productId}/hide`; // thêm case hide

            const res = await fetch(endpoint, { method: "PATCH", headers: authHeader() });
            if (!res.ok) throw new Error();
            showToast(
                action === "approve" ? "✅ Đã duyệt sản phẩm" :
                    action === "reject"  ? "❌ Đã từ chối sản phẩm" :
                        "🙈 Đã ẩn sản phẩm"
            );
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
                <h1 className={styles.pageTitle}>Quản lý Sản phẩm</h1>
                <p className={styles.pageSubtitle}>
                    Duyệt & kiểm soát sản phẩm trên hệ thống
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

            <div className={styles.filterBar}>
                <input
                    className={styles.searchInput}
                    placeholder="Tìm theo tên sản phẩm..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
                <select
                    className={styles.filterSelect}
                    value={filterStatus}
                    onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Từ chối</option>
                </select>
                <button className={styles.refreshBtn} onClick={onRefresh}>🔄 Làm mới</button>
            </div>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} className={styles.emptyRow}>Không có dữ liệu</td></tr>
                        ) : paginated.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div className={styles.userAvatar}>
                                            {p.imageUrls?.[0]
                                                ? <img src={p.imageUrls[0]} alt="" />
                                                : p.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span>{p.name}</span>
                                    </div>
                                </td>
                                <td className={styles.tdMuted}>{p.categoryName || "—"}</td>
                                <td className={styles.tdMuted}>
                                    {p.priceAfter?.toLocaleString("vi-VN")}đ
                                </td>
                                <td className={styles.tdMuted}>{p.currentQuantity}</td>
                                <td>
                                    {p.status === "pending" && (
                                        <span className={`${styles.badge} ${styles.badgeAdmin}`}>Chờ duyệt</span>
                                    )}
                                    {p.status === "active" && (
                                        <span className={`${styles.statusDot} ${styles.statusActive}`}>Đang bán</span>
                                    )}
                                    {p.status === "inactive" && (
                                        <span className={`${styles.statusDot} ${styles.statusBanned}`}>Đã ẩn</span>
                                    )}
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.btnDetail}
                                            onClick={() => setViewProduct(p)}
                                        >
                                            🔍 Xem
                                        </button>
                                        {p.status === "pending" && (
                                            <>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnActivate}`}
                                                    disabled={actionLoading === p.id}
                                                    onClick={() => setConfirm({
                                                        productId: p.id,
                                                        action: "approve",
                                                        label: `Duyệt sản phẩm "${p.name}"?`
                                                    })}
                                                >
                                                    ✅ Duyệt
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.btnBan}`}
                                                    disabled={actionLoading === p.id}
                                                    onClick={() => setConfirm({
                                                        productId: p.id,
                                                        action: "reject",
                                                        label: `Từ chối sản phẩm "${p.name}"?`
                                                    })}
                                                >
                                                    ❌ Từ chối
                                                </button>
                                            </>
                                        )}
                                        {p.status === "active" && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.btnBan}`}
                                                disabled={actionLoading === p.id}
                                                onClick={() => setConfirm({
                                                    productId: p.id,
                                                    action: "hide",
                                                    label: `Ẩn sản phẩm "${p.name}"?`
                                                })}
                                            >
                                                🙈 Ẩn
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 16px",
                            borderTop: "1px solid var(--border)",
                            fontSize: 14,
                            color: "var(--muted)",
                        }}>
        <span>
            Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} sản phẩm
        </span>
                            <div style={{ display: "flex", gap: 6 }}>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: "6px 12px",
                                        border: "1px solid var(--border)",
                                        borderRadius: 6,
                                        background: currentPage === 1 ? "var(--bg)" : "var(--surface)",
                                        color: currentPage === 1 ? "var(--muted)" : "var(--text)",
                                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                        fontFamily: "Sora, sans-serif",
                                        fontSize: 13,
                                    }}
                                >
                                    ← Trước
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) => p === "..." ? (
                                        <span key={`ellipsis-${i}`} style={{ padding: "6px 4px" }}>...</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p as number)}
                                            style={{
                                                padding: "6px 12px",
                                                border: "1px solid var(--border)",
                                                borderRadius: 6,
                                                background: currentPage === p ? "var(--accent)" : "var(--surface)",
                                                color: currentPage === p ? "#fff" : "var(--text)",
                                                cursor: "pointer",
                                                fontWeight: currentPage === p ? 700 : 400,
                                                fontFamily: "Sora, sans-serif",
                                                fontSize: 13,
                                            }}
                                        >
                                            {p}
                                        </button>
                                    ))
                                }
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: "6px 12px",
                                        border: "1px solid var(--border)",
                                        borderRadius: 6,
                                        background: currentPage === totalPages ? "var(--bg)" : "var(--surface)",
                                        color: currentPage === totalPages ? "var(--muted)" : "var(--text)",
                                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                        fontFamily: "Sora, sans-serif",
                                        fontSize: 13,
                                    }}
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {viewProduct && (
                <div className={styles.overlay} onClick={() => setViewProduct(null)}>
                    <div className={styles.confirmBox} style={{ maxWidth: 520, textAlign: "left", maxHeight: "80vh", overflowY: "auto" }}
                         onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: "0 0 16px", fontFamily: "Fraunces, serif" }}>Chi tiết sản phẩm</h3>

                        {viewProduct.imageUrls?.length > 0 ? (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                                {viewProduct.imageUrls.map((url, i) => (
                                    <img key={i} src={url} alt=""
                                         style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ marginBottom: 16, color: "var(--muted)", fontSize: 13 }}>Không có ảnh</div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                            <div><b>🏷️ Tên:</b> {viewProduct.name}</div>
                            <div><b>📂 Danh mục:</b> {viewProduct.categoryName || "—"}</div>
                            <div><b>💰 Giá gốc:</b> {viewProduct.priceBefore?.toLocaleString("vi-VN")}đ</div>
                            <div><b>💸 Giá bán:</b> {viewProduct.priceAfter?.toLocaleString("vi-VN")}đ</div>
                            <div><b>📦 Tồn kho:</b> {viewProduct.currentQuantity}</div>
                            <div><b>🏪 Shop ID:</b> <code style={{ fontSize: 12 }}>{viewProduct.storeId}</code></div>
                            <div><b>📝 Mô tả:</b></div>
                            <div style={{
                                background: "var(--bg)",
                                borderRadius: 8,
                                padding: "10px 12px",
                                fontSize: 13,
                                color: "var(--muted)",
                                maxHeight: 150,
                                overflowY: "auto",
                                lineHeight: 1.6,
                            }}>
                                {viewProduct.description || "—"}
                            </div>
                        </div>

                        <div className={styles.confirmActions} style={{ marginTop: 20 }}>
                            {viewProduct.status === "pending" && (
                                <>
                                    <button
                                        className={`${styles.actionBtn} ${styles.btnActivate}`}
                                        onClick={() => {
                                            setConfirm({ productId: viewProduct.id, action: "approve", label: `Duyệt sản phẩm "${viewProduct.name}"?` });
                                            setViewProduct(null);
                                        }}
                                    >
                                        ✅ Duyệt
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.btnBan}`}
                                        onClick={() => {
                                            setConfirm({ productId: viewProduct.id, action: "reject", label: `Từ chối sản phẩm "${viewProduct.name}"?` });
                                            setViewProduct(null);
                                        }}
                                    >
                                        ❌ Từ chối
                                    </button>
                                </>
                            )}
                            <button className={styles.btnConfirm} onClick={() => setViewProduct(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {confirm && (
                <div className={styles.overlay}>
                    <div className={styles.confirmBox}>
                        <div className={styles.confirmIcon}>
                            {confirm.action === "approve" ? "✅" : confirm.action === "reject"  ? "❌" : "🙈"}
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