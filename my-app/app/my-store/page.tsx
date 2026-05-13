"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./my-store.module.css";

interface Store {
    id: string;
    name: string;
    image: string;
    location: string;
    description: string;
    status: string;
}

interface Product {
    id: number;
    name: string;
    priceBefore: number;
    priceAfter: number;
    initQuantity: number;
    currentQuantity: number;
    sold: number;
    description: string;
    status: string;
    categoryShortname: string;
    storeId: string;
    rate: number;
    imageUrls: string[];
    updatedBy: string;
}

interface ProductForm {
    name: string;
    priceBefore: string;
    priceAfter: string;
    initQuantity: string;
    description: string;
    categoryShortname: string;
    storeId: string;
    createdBy: string;
    status: string;
    updatedBy: string,
}

const EMPTY_FORM: ProductForm = {
    name: "", priceBefore: "", priceAfter: "",
    initQuantity: "", description: "", categoryShortname: "",
    storeId: "", createdBy: "",
    status: "pending",
    updatedBy: "",
};

export default function MyStorePage() {
    const router = useRouter();
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<{shortname: string, name: string}[]>([]);
    const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
    const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        return { token, userId };
    };

    const fetchDeletedProducts = async () => {
        const { token } = getAuth();
        const res = await fetch(`/api/products/store/${store?.id}/deleted?size=100`, {
            headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
        });
        const data = await res.json();
        setDeletedProducts(data.data || []);
    };

    const handleRestore = async (id: number) => {
        const { token } = getAuth();
        try {
            await fetch(`/api/products/${id}/restore`, {
                method: "PUT",
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            // Xóa khỏi danh sách đã xóa
            setDeletedProducts(prev => prev.filter(p => p.id !== id));
            // Fetch lại danh sách active để cập nhật
            const res = await fetch(`/api/products/store/${store?.id}?size=100`, {
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(data.data || []);
        } catch {
            alert("Khôi phục thất bại");
        }
    };

    useEffect(() => {
        // Fetch categories riêng, không cần token
        fetch(`/api/categories`)
            .then(r => r.json())
            .then(catData => setCategories(catData.data || []));

        // Fetch store + products
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/stores/my-store?userId=${userId}`, {
            headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(async (storeData: Store) => {
                setStore(storeData);
                const res = await fetch(`/api/products/store/${storeData.id}?size=100`, {
                    headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` }
                });
                const data = await res.json();
                setProducts(data.data || []);
                setLoading(false);
            })
            .catch(() => { router.push("/profile"); });
    }, [router]);

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => {
        setEditProduct(null);
        const { userId } = getAuth();
        setForm({ ...EMPTY_FORM, storeId: store?.id || "", createdBy: userId || "" });
        setError(null);
        setShowModal(true);
    };

    const openEdit = (p: Product) => {
        const { userId } = getAuth();
        setEditProduct(p);
        setForm({
            name: p.name || "",
            priceBefore: String(p.priceBefore || ""),
            priceAfter: String(p.priceAfter || ""),
            initQuantity: String(p.initQuantity || ""),
            description: p.description || "",
            categoryShortname: p.categoryShortname || "",
            storeId: p.storeId || "",
            createdBy: "",
            status: p.status === "inactive" ? "inactive" : "pending",
            updatedBy: userId || "",
        });
        setError(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { setError("Vui lòng nhập tên sản phẩm"); return; }
        if (!form.priceBefore) { setError("Vui lòng nhập giá gốc"); return; }
        if (!form.categoryShortname) { setError("Vui lòng chọn danh mục"); return; }

        setSaving(true);
        setError(null);
        const { token } = getAuth();
        const body = {
            ...form,
            priceBefore: parseFloat(form.priceBefore),
            priceAfter: parseFloat(form.priceAfter || form.priceBefore),
            initQuantity: parseInt(form.initQuantity || "0"),
        };

        try {
            const url = editProduct ? `/api/products/${editProduct.id}` : `/api/products`;
            const method = editProduct ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Lưu thất bại");
            const data = await res.json();
            if (editProduct) {
                setProducts(prev => prev.map(p => p.id === editProduct.id ? data.data : p));
            } else {
                setProducts(prev => [data.data, ...prev]);
            }
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const { token } = getAuth();
        try {
            await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            setProducts(prev => prev.filter(p => p.id !== id));
            setDeleteId(null);
        } catch {
            alert("Xóa thất bại");
        }
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner}></div>
            <p>Đang tải shop...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo} onClick={() => router.push("/")}>
                    <span>✦</span> ANVI
                </div>
                <nav className={styles.sidebarNav}>
                    <button className={`${styles.navItem} ${styles.navActive}`}>
                        <span>📦</span> Sản phẩm
                    </button>
                    <button className={styles.navItem}><span>📋</span> Đơn hàng</button>
                    <button className={styles.navItem}><span>🎟️</span> Voucher</button>
                    <button className={styles.navItem}><span>📊</span> Thống kê</button>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.navItem} onClick={() => router.push("/profile")}>
                        <span>←</span> Trang cá nhân
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div className={styles.storeInfo}>
                        {store?.image ? (
                            <img src={store.image} alt="logo" className={styles.storeLogo} />
                        ) : (
                            <div className={styles.storeLogoPlaceholder}>🏪</div>
                        )}
                        <div>
                            <h1 className={styles.storeName}>{store?.name}</h1>
                            <span className={`${styles.storeBadge} ${store?.status === "active" ? styles.badgeActive : styles.badgePending}`}>
                                {store?.status === "active" ? "✓ Đang hoạt động" : "⏳ Chờ duyệt"}
                            </span>
                        </div>
                    </div>
                    <button className={styles.btnCreate} onClick={openCreate}>+ Thêm sản phẩm</button>
                </header>

                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📦</div>
                        <div>
                            <div className={styles.statNum}>{products.length}</div>
                            <div className={styles.statLabel}>Sản phẩm</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🛒</div>
                        <div>
                            <div className={styles.statNum}>{products.reduce((s, p) => s + (p.sold || 0), 0)}</div>
                            <div className={styles.statLabel}>Đã bán</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📍</div>
                        <div>
                            <div className={styles.statNum} style={{ fontSize: "0.95rem" }}>{store?.location || "—"}</div>
                            <div className={styles.statLabel}>Địa chỉ</div>
                        </div>
                    </div>
                </div>

                {/*<div className={styles.tableSection}>*/}
                {/*    <div className={styles.tableHeader}>*/}
                {/*        <h2 className={styles.tableTitle}>Danh sách sản phẩm</h2>*/}
                {/*        <input className={styles.searchInput} placeholder="🔍 Tìm sản phẩm..."*/}
                {/*               value={search} onChange={e => setSearch(e.target.value)} />*/}
                {/*    </div>*/}

                {/*    {filtered.length === 0 ? (*/}
                {/*        <div className={styles.empty}>*/}
                {/*            <div className={styles.emptyIcon}>📭</div>*/}
                {/*            <p>Chưa có sản phẩm nào</p>*/}
                {/*            <button className={styles.btnCreate} onClick={openCreate}>Thêm sản phẩm đầu tiên</button>*/}
                {/*        </div>*/}
                {/*    ) : (*/}
                {/*        <div className={styles.tableWrap}>*/}
                {/*            <table className={styles.table}>*/}
                {/*                <thead>*/}
                {/*                <tr>*/}
                {/*                    <th>Ảnh</th><th>Tên sản phẩm</th><th>Giá gốc</th>*/}
                {/*                    <th>Giá bán</th><th>Tồn kho</th><th>Đã bán</th>*/}
                {/*                    <th>Trạng thái</th><th>Thao tác</th>*/}
                {/*                </tr>*/}
                {/*                </thead>*/}
                {/*                <tbody>*/}
                {/*                {filtered.map(p => (*/}
                {/*                    <tr key={p.id}>*/}
                {/*                        <td>*/}
                {/*                            {p.imageUrls?.[0]*/}
                {/*                                ? <img src={p.imageUrls[0]} alt={p.name} className={styles.productThumb} />*/}
                {/*                                : <div className={styles.productThumbPlaceholder}>🖼️</div>}*/}
                {/*                        </td>*/}
                {/*                        <td className={styles.productName}>{p.name}</td>*/}
                {/*                        <td className={styles.priceOld}>{p.priceBefore?.toLocaleString("vi-VN")}đ</td>*/}
                {/*                        <td className={styles.priceNew}>{p.priceAfter?.toLocaleString("vi-VN")}đ</td>*/}
                {/*                        <td>{p.currentQuantity}</td>*/}
                {/*                        <td>{p.sold || 0}</td>*/}
                {/*                        <td>*/}
                {/*                                <span className={`${*/}
                {/*                                    styles.statusBadge} ${p.status === "active" ? */}
                {/*                                    styles.statusActive : p.status === "pending" ? styles.statusPending : */}
                {/*                                    styles.statusInactive}`}>*/}
                {/*                                    {p.status === "active" ? "Đang bán" :*/}
                {/*                                        p.status === "pending" ? "⏳ Chờ duyệt" :*/}
                {/*                                        "Ẩn"}*/}
                {/*                                </span>*/}
                {/*                        </td>*/}
                {/*                        <td>*/}
                {/*                            <div className={styles.actions}>*/}
                {/*                                <button className={styles.btnEdit} onClick={() => openEdit(p)}>Sửa</button>*/}
                {/*                                <button className={styles.btnDelete} onClick={() => setDeleteId(p.id)}>Xóa</button>*/}
                {/*                            </div>*/}
                {/*                        </td>*/}
                {/*                    </tr>*/}
                {/*                ))}*/}
                {/*                </tbody>*/}
                {/*            </table>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Danh sách sản phẩm</h2>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {/* Tab chuyển đổi */}
                            <button
                                onClick={() => setActiveTab("active")}
                                style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: activeTab === "active" ? "#6366f1" : "#f3f4f6",
                                    color: activeTab === "active" ? "white" : "#374151",
                                    fontWeight: 600,
                                }}>
                                Đang bán
                            </button>
                            <button
                                onClick={() => { setActiveTab("deleted"); fetchDeletedProducts(); }}
                                style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: activeTab === "deleted" ? "#ef4444" : "#f3f4f6",
                                    color: activeTab === "deleted" ? "white" : "#374151",
                                    fontWeight: 600,
                                }}>
                                Đã xóa
                            </button>
                            <input className={styles.searchInput} placeholder="🔍 Tìm sản phẩm..."
                                   value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    {/* Tab đang bán — giữ nguyên table hiện tại */}
                    {activeTab === "active" && (
                        filtered.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>📭</div>
                                <p>Chưa có sản phẩm nào</p>
                                <button className={styles.btnCreate} onClick={openCreate}>Thêm sản phẩm đầu tiên</button>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Ảnh</th><th>Tên sản phẩm</th><th>Giá gốc</th>
                                        <th>Giá bán</th><th>Tồn kho</th><th>Đã bán</th>
                                        <th>Trạng thái</th><th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                {p.imageUrls?.[0]
                                                    ? <img src={p.imageUrls[0]} alt={p.name} className={styles.productThumb} />
                                                    : <div className={styles.productThumbPlaceholder}>🖼️</div>}
                                            </td>
                                            <td className={styles.productName}>{p.name}</td>
                                            <td className={styles.priceOld}>{p.priceBefore?.toLocaleString("vi-VN")}đ</td>
                                            <td className={styles.priceNew}>{p.priceAfter?.toLocaleString("vi-VN")}đ</td>
                                            <td>{p.currentQuantity}</td>
                                            <td>{p.sold || 0}</td>
                                            <td>
                                <span className={`${styles.statusBadge} ${
                                    p.status === "active" ? styles.statusActive :
                                        p.status === "pending" ? styles.statusPending :
                                            styles.statusInactive}`}>
                                    {p.status === "active" ? "✅ Đang bán" :
                                        p.status === "pending" ? "⏳ Chờ duyệt" : "🚫 Ẩn"}
                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button className={styles.btnEdit} onClick={() => openEdit(p)}>Sửa</button>
                                                    <button className={styles.btnDelete} onClick={() => setDeleteId(p.id)}>Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {/* Tab đã xóa */}
                    {activeTab === "deleted" && (
                        deletedProducts.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>🗑️</div>
                                <p>Không có sản phẩm nào đã xóa</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Ảnh</th><th>Tên sản phẩm</th><th>Giá gốc</th>
                                        <th>Giá bán</th><th>Đã bán</th><th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {deletedProducts.map(p => (
                                        <tr key={p.id} style={{ opacity: 0.6 }}> {/* mờ để biết đã xóa */}
                                            <td>
                                                {p.imageUrls?.[0]
                                                    ? <img src={p.imageUrls[0]} alt={p.name} className={styles.productThumb} />
                                                    : <div className={styles.productThumbPlaceholder}>🖼️</div>}
                                            </td>
                                            <td className={styles.productName}>{p.name}</td>
                                            <td className={styles.priceOld}>{p.priceBefore?.toLocaleString("vi-VN")}đ</td>
                                            <td className={styles.priceNew}>{p.priceAfter?.toLocaleString("vi-VN")}đ</td>
                                            <td>{p.sold || 0}</td>
                                            <td>
                                                {/* Chỉ có nút Khôi phục, không có Sửa/Xóa */}
                                                <button
                                                    className={styles.btnEdit}
                                                    onClick={() => handleRestore(p.id)}>
                                                    🔄 Khôi phục
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </main>

            {showModal && (
                <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editProduct ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h2>
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        {error && <div className={styles.errorAlert}>{error}</div>}
                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Tên sản phẩm *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                           placeholder="Ví dụ: Áo thun cotton basic" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giá gốc (đ) *</label>
                                    <input type="number" value={form.priceBefore}
                                           onChange={e => setForm({ ...form, priceBefore: e.target.value })} placeholder="150000" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giá bán (đ)</label>
                                    <input type="number" value={form.priceAfter}
                                           onChange={e => setForm({ ...form, priceAfter: e.target.value })} placeholder="120000" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Số lượng</label>
                                    <input type="number" value={form.initQuantity}
                                           onChange={e => setForm({ ...form, initQuantity: e.target.value })} placeholder="100" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Danh mục</label>
                                    <select
                                        value={form.categoryShortname}
                                        onChange={e => setForm({ ...form, categoryShortname: e.target.value })}
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => (
                                            <option key={c.shortname} value={c.shortname}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {editProduct && (
                                    <div className={styles.formField}>
                                        <label>Trạng thái</label>
                                        <select
                                            value={form.status}
                                            onChange={e => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="pending">⏳ Chờ duyệt</option>
                                            <option value="inactive">🚫 Ẩn sản phẩm</option>
                                            {/* Không có option active — chỉ admin mới set được */}
                                        </select>
                                    </div>
                                )}
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Mô tả</label>
                                    <textarea value={form.description}
                                              onChange={e => setForm({ ...form, description: e.target.value })}
                                              placeholder="Mô tả chi tiết sản phẩm..." rows={3} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => setShowModal(false)}>Hủy</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? "Đang lưu..." : editProduct ? "Cập nhật" : "Tạo sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId !== null && (
                <div className={styles.overlay} onClick={() => setDeleteId(null)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>🗑️</div>
                        <h3>Xóa sản phẩm?</h3>
                        <p>Hành động này không thể hoàn tác.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={() => setDeleteId(null)}>Hủy</button>
                            <button className={styles.btnDelete} onClick={() => handleDelete(deleteId)}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}