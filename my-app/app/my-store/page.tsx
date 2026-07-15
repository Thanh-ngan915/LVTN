"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./my-store.module.css";
import StoreSidebar from "../components/StoreSidebar";

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
    updatedBy: string;
    imageUrls: string[];
}

const EMPTY_FORM: ProductForm = {
    name: "", priceBefore: "", priceAfter: "",
    initQuantity: "", description: "", categoryShortname: "",
    storeId: "", createdBy: "", status: "pending", updatedBy: "",
    imageUrls: [],
};

const PAGE_SIZE = 1000;
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqghfi8be/image/upload";
const CLOUDINARY_PRESET = "kltn_user_avatar";

export default function MyStorePage() {
    const router = useRouter();
    const [store, setStore]                 = useState<Store | null>(null);
    const [products, setProducts]           = useState<Product[]>([]);
    const [loading, setLoading]             = useState(true);
    const [search, setSearch]               = useState("");
    const [showModal, setShowModal]         = useState(false);
    const [editProduct, setEditProduct]     = useState<Product | null>(null);
    const [form, setForm]                   = useState<ProductForm>(EMPTY_FORM);
    const [saving, setSaving]               = useState(false);
    const [deleteId, setDeleteId]           = useState<number | null>(null);
    const [error, setError]                 = useState<string | null>(null);
    const [categories, setCategories]       = useState<{ shortname: string; name: string }[]>([]);
    const [activeTab, setActiveTab]         = useState<"active" | "deleted">("active");
    const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
    const [page, setPage]                   = useState(1);
    const [totalPages, setTotalPages]       = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [deletedPage, setDeletedPage]     = useState(1);
    const [deletedTotalPages, setDeletedTotalPages] = useState(1);
    const [uploadingImgs, setUploadingImgs] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        return { token, userId };
    };

    const authHeader = () => {
        const { token } = getAuth();
        return { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` };
    };

    // ── Fetch products với phân trang ──────────────────
    const fetchProducts = async (storeId: string, p = 1) => {
        const res = await fetch(`/api/products/store/${storeId}?page=${p - 1}&size=${PAGE_SIZE}`, {
            headers: authHeader(),
        });
        const data = await res.json();
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalElements || 0);
    };

    const fetchDeletedProducts = async (p = 1) => {
        const { token } = getAuth();
        const res = await fetch(`/api/products/store/${store?.id}/deleted?page=${p - 1}&size=${PAGE_SIZE}`, {
            headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
        });
        const data = await res.json();
        setDeletedProducts(data.data || []);
        setDeletedTotalPages(data.totalPages || 1);
    };

    useEffect(() => {
        fetch(`/api/categories`).then(r => r.json()).then(d => setCategories(d.data || []));
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/stores/my-store?userId=${userId}`, { headers: authHeader() })
            .then(r => r.json())
            .then(async (storeData: Store) => {
                setStore(storeData);
                await fetchProducts(storeData.id, 1);
                setLoading(false);
            })
            .catch(() => router.push("/profile"));
    }, [router]);

    // ── Phân trang active ──────────────────────────────
    const handlePageChange = async (p: number) => {
        setPage(p);
        await fetchProducts(store!.id, p);
    };

    // ── Phân trang deleted ─────────────────────────────
    const handleDeletedPageChange = async (p: number) => {
        setDeletedPage(p);
        await fetchDeletedProducts(p);
    };

    const handleTabChange = async (tab: "active" | "deleted") => {
        setActiveTab(tab);
        if (tab === "deleted") {
            setDeletedPage(1);
            await fetchDeletedProducts(1);
        }
    };

    // ── Upload ảnh lên Cloudinary ──────────────────────
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (form.imageUrls.length + files.length > 5) {
            setError("Tối đa 5 ảnh cho mỗi sản phẩm"); return;
        }
        setUploadingImgs(true);
        setError(null);
        try {
            const uploaded = await Promise.all(files.map(async (file) => {
                if (file.size > 5 * 1024 * 1024) throw new Error("Ảnh quá lớn (tối đa 5MB)");
                const fd = new FormData();
                fd.append("file", file);
                fd.append("upload_preset", CLOUDINARY_PRESET);
                const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error?.message || "Upload thất bại");
                return data.secure_url as string;
            }));
            setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...uploaded] }));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Upload thất bại");
        } finally {
            setUploadingImgs(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const removeImage = (idx: number) => {
        setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== idx) }));
    };

    // ── Search filter (client-side trên trang hiện tại) ─
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
            imageUrls: p.imageUrls || [],
        });
        setError(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim())         { setError("Vui lòng nhập tên sản phẩm"); return; }
        if (!form.priceBefore)         { setError("Vui lòng nhập giá gốc"); return; }
        if (!form.categoryShortname)   { setError("Vui lòng chọn danh mục"); return; }

        setSaving(true); setError(null);
        const { token } = getAuth();
        const body = {
            ...form,
            priceBefore:  parseFloat(form.priceBefore),
            priceAfter:   parseFloat(form.priceAfter || form.priceBefore),
            initQuantity: parseInt(form.initQuantity || "0"),
        };

        try {
            const url    = editProduct ? `/api/products/${editProduct.id}` : `/api/products`;
            const method = editProduct ? "PUT" : "POST";
            const sendBody = editProduct ? body : {
                name: body.name, priceBefore: body.priceBefore,
                priceAfter: body.priceAfter, initQuantity: body.initQuantity,
                description: body.description, categoryShortname: body.categoryShortname,
                status: body.status, imageUrls: body.imageUrls,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify(sendBody),
            });
            if (!res.ok) {
                const errBody = await res.text();
                console.error("Save failed:", res.status, errBody);
                throw new Error(errBody || "Lưu thất bại");
            }
            const data = await res.json();
            if (editProduct) {
                setProducts(prev => prev.map(p => p.id === editProduct.id ? data.data : p));
            } else {
                await fetchProducts(store!.id, page);
            }
            setShowModal(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
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
            await fetchProducts(store!.id, page);
            setDeleteId(null);
        } catch { alert("Xóa thất bại"); }
    };

    const handleRestore = async (id: number) => {
        try {
            await fetch(`/api/products/${id}/restore`, { method: "PUT", headers: authHeader() });
            await fetchDeletedProducts(deletedPage);
            await fetchProducts(store!.id, page);
        } catch { alert("Khôi phục thất bại"); }
    };

    // ── Pagination component ───────────────────────────
    const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => {
        if (total <= 1) return null;
        const pages = Array.from({ length: total }, (_, i) => i + 1);
        return (
            <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={() => onChange(current - 1)} disabled={current === 1}>←</button>
                {pages.map(p => (
                    <button key={p}
                            className={`${styles.pageBtn} ${p === current ? styles.pageBtnActive : ""}`}
                            onClick={() => onChange(p)}>{p}</button>
                ))}
                <button className={styles.pageBtn} onClick={() => onChange(current + 1)} disabled={current === total}>→</button>
            </div>
        );
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải shop...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                <header className={styles.topbar}>
                    <div className={styles.storeInfo}>
                        {store?.image
                            ? <img src={store.image} alt="logo" className={styles.storeLogo} />
                            : <div className={styles.storeLogoPlaceholder}>🏪</div>}
                        <div>
                            <h1 className={styles.storeName}>{store?.name}</h1>
                            <span className={`${styles.storeBadge} ${store?.status === "active" ? styles.badgeActive : styles.badgePending}`}>
                                {store?.status === "active" ? "✓ Đang hoạt động" : "⏳ Chờ duyệt"}
                            </span>
                        </div>
                    </div>
                    <button className={styles.btnCreate} onClick={openCreate}>+ Thêm sản phẩm</button>
                </header>

                {/* Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📦</div>
                        <div><div className={styles.statNum}>{totalProducts}</div><div className={styles.statLabel}>Sản phẩm</div></div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🛒</div>
                        <div><div className={styles.statNum}>{products.reduce((s, p) => s + (p.sold || 0), 0)}</div><div className={styles.statLabel}>Đã bán</div></div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📍</div>
                        <div><div className={styles.statNum} style={{ fontSize: "0.85rem" }}>{store?.location || "—"}</div><div className={styles.statLabel}>Địa chỉ</div></div>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Danh sách sản phẩm</h2>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button onClick={() => handleTabChange("active")} style={{
                                padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                background: activeTab === "active" ? "#6366f1" : "#f3f4f6",
                                color: activeTab === "active" ? "white" : "#374151", fontWeight: 600,
                            }}>Đang bán</button>
                            <button onClick={() => handleTabChange("deleted")} style={{
                                padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                background: activeTab === "deleted" ? "#ef4444" : "#f3f4f6",
                                color: activeTab === "deleted" ? "white" : "#374151", fontWeight: 600,
                            }}>Đã xóa</button>
                            <input className={styles.searchInput} placeholder="🔍 Tìm sản phẩm..."
                                   value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>

                    {/* Tab: Đang bán */}
                    {activeTab === "active" && (
                        filtered.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>📭</div>
                                <p>Chưa có sản phẩm nào</p>
                                <button className={styles.btnCreate} onClick={openCreate}>Thêm sản phẩm đầu tiên</button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr><th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Giá gốc</th><th>Giá bán</th><th>Tồn kho</th><th>Đã bán</th><th>Trạng thái</th><th>Thao tác</th></tr>
                                        </thead>
                                        <tbody>
                                        {filtered.map(p => (
                                            <tr key={p.id}>
                                                <td style={{ fontWeight: 600, color: "#6366f1" }}>#{p.id}</td>
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
                                                        <span className={`${styles.statusBadge} ${p.status === "active" ? styles.statusActive : p.status === "pending" ? styles.statusPending : styles.statusInactive}`}>
                                                            {p.status === "active" ? "✅ Đang bán" : p.status === "pending" ? "⏳ Chờ duyệt" : "🚫 Ẩn"}
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
                                <Pagination current={page} total={totalPages} onChange={handlePageChange} />
                            </>
                        )
                    )}

                    {/* Tab: Đã xóa */}
                    {activeTab === "deleted" && (
                        deletedProducts.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>🗑️</div>
                                <p>Không có sản phẩm nào đã xóa</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr><th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Giá gốc</th><th>Giá bán</th><th>Đã bán</th><th>Thao tác</th></tr>
                                        </thead>
                                        <tbody>
                                        {deletedProducts.map(p => (
                                            <tr key={p.id} style={{ opacity: 0.6 }}>
                                                <td style={{ fontWeight: 600 }}>#{p.id}</td>
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
                                                    <button className={styles.btnEdit} onClick={() => handleRestore(p.id)}>🔄 Khôi phục</button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination current={deletedPage} total={deletedTotalPages} onChange={handleDeletedPageChange} />
                            </>
                        )
                    )}
                </div>
            </main>

            {/* Modal sản phẩm */}
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
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ví dụ: Áo thun cotton basic" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giá gốc (đ) *</label>
                                    <input type="number" value={form.priceBefore} onChange={e => setForm({ ...form, priceBefore: e.target.value })} placeholder="150000" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giá bán (đ)</label>
                                    <input type="number" value={form.priceAfter} onChange={e => setForm({ ...form, priceAfter: e.target.value })} placeholder="120000" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Số lượng</label>
                                    <input type="number" value={form.initQuantity} onChange={e => setForm({ ...form, initQuantity: e.target.value })} placeholder="100" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Danh mục *</label>
                                    <select value={form.categoryShortname} onChange={e => setForm({ ...form, categoryShortname: e.target.value })}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => <option key={c.shortname} value={c.shortname}>{c.name}</option>)}
                                    </select>
                                </div>
                                {editProduct && (
                                    <div className={styles.formField}>
                                        <label>Trạng thái</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                            <option value="pending">⏳ Chờ duyệt</option>
                                            <option value="inactive">🚫 Ẩn sản phẩm</option>
                                        </select>
                                    </div>
                                )}
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Mô tả</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả chi tiết sản phẩm..." rows={3} />
                                </div>

                                {/* ── Ảnh sản phẩm ── */}
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Ảnh sản phẩm <span style={{ color: "#8a8a9a", fontWeight: 400 }}>(tối đa 5 ảnh)</span></label>
                                    <div className={styles.imageUploadRow}>
                                        {form.imageUrls.map((url, idx) => (
                                            <div key={idx} className={styles.uploadedImg}>
                                                <img src={url} alt={`img-${idx}`} />
                                                <button className={styles.removeImg} onClick={() => removeImage(idx)}>✕</button>
                                            </div>
                                        ))}
                                        {form.imageUrls.length < 5 && (
                                            <label className={styles.uploadBox}>
                                                {uploadingImgs ? <><span>⏳</span><span>Đang tải...</span></> : <><span style={{ fontSize: "1.4rem" }}>📷</span><span>Thêm ảnh</span></>}
                                                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} disabled={uploadingImgs} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => setShowModal(false)}>Hủy</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving || uploadingImgs}>
                                {saving ? "Đang lưu..." : editProduct ? "Cập nhật" : "Tạo sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm xóa */}
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