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
    updatedBy: string;
}

const EMPTY_FORM: ProductForm = {
    name: "", priceBefore: "", priceAfter: "",
    initQuantity: "", description: "", categoryShortname: "",
    storeId: "", createdBy: "",
    status: "pending",
    updatedBy: "",
};

interface PriceConditionDTO {
    totalMin: number | null;
    totalMax: number | null;
    priceMin: number | null;
}

interface Voucher {
    id: string;
    code: string;
    title: string;
    description: string;
    initQuantity: number;
    currentQuantity: number;
    status: number;
    type: number;
    percent: number;
    maximum: number;
    startDate: string;
    endDate: string;
    categoryShortnames: string[];
    priceCondition: PriceConditionDTO | null;
}

interface VoucherForm {
    code: string;
    title: string;
    description: string;
    initQuantity: string;
    type: string;
    percent: string;
    maximum: string;
    startDate: string;
    endDate: string;
    categoryShortnames: string[];
    hasPriceCondition: boolean;
    totalMin: string;
    totalMax: string;
    priceMin: string;
}

const EMPTY_VOUCHER_FORM: VoucherForm = {
    code: "", title: "", description: "",
    initQuantity: "", type: "1", percent: "", maximum: "",
    startDate: "", endDate: "",
    categoryShortnames: [],
    hasPriceCondition: false,
    totalMin: "", totalMax: "", priceMin: "",
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
    const [categories, setCategories] = useState<{ shortname: string; name: string }[]>([]);
    const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
    const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
    const [activeSection, setActiveSection] = useState<"products" | "vouchers">("products");
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [voucherForm, setVoucherForm] = useState<VoucherForm>(EMPTY_VOUCHER_FORM);
    const [voucherSaving, setVoucherSaving] = useState(false);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
    const [deleteVoucherId, setDeleteVoucherId] = useState<string | null>(null);
    const [voucherTab, setVoucherTab] = useState<"active" | "deleted">("active");
    const [deletedVouchers, setDeletedVouchers] = useState<Voucher[]>([]);

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
            setDeletedProducts(prev => prev.filter(p => p.id !== id));
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
        fetch(`/api/categories`)
            .then(r => r.json())
            .then(catData => setCategories(catData.data || []));

        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/stores/my-store?userId=${userId}`, {
            headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(async (storeData: Store) => {
                setStore(storeData);
                const res = await fetch(`/api/products/store/${storeData.id}?size=100`, {
                    headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
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

            // Khi tạo mới: backend tự lấy storeId & createdBy từ JWT token
            // Chỉ cần gửi dữ liệu sản phẩm, KHÔNG cần gửi storeId/createdBy thủ công
            const sendBody = editProduct
                ? body  // Khi sửa: gửi toàn bộ bao gồm updatedBy
                : {     // Khi tạo: bỏ storeId và createdBy (backend tự lấy từ token)
                    name: body.name,
                    priceBefore: body.priceBefore,
                    priceAfter: body.priceAfter,
                    initQuantity: body.initQuantity,
                    description: body.description,
                    categoryShortname: body.categoryShortname,
                    status: body.status,
                };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify(sendBody),
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

    const fetchVouchers = async () => {
        if (!store) return;
        setVoucherLoading(true);
        const { token } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store.id}`, {
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            const data = await res.json();
            setVouchers(data || []);
        } catch {
            setVouchers([]);
        } finally {
            setVoucherLoading(false);
        }
    };

    const buildVoucherBody = () => ({
        code: voucherForm.code,
        title: voucherForm.title,
        description: voucherForm.description,
        initQuantity: parseInt(voucherForm.initQuantity),
        type: parseInt(voucherForm.type),
        percent: parseFloat(voucherForm.percent),
        maximum: voucherForm.maximum ? parseInt(voucherForm.maximum) : null,
        startDate: new Date(voucherForm.startDate).toISOString().slice(0, 19),
        endDate: new Date(voucherForm.endDate).toISOString().slice(0, 19),
        categoryShortnames: voucherForm.categoryShortnames.length > 0 ? voucherForm.categoryShortnames : null,
        priceCondition: voucherForm.hasPriceCondition ? {
            totalMin: voucherForm.totalMin ? parseFloat(voucherForm.totalMin) : null,
            totalMax: voucherForm.totalMax ? parseFloat(voucherForm.totalMax) : null,
            priceMin: voucherForm.priceMin ? parseFloat(voucherForm.priceMin) : null,
        } : null,
    });

    const validateVoucherForm = () => {
        if (!voucherForm.code.trim()) { setVoucherError("Vui lòng nhập mã voucher"); return false; }
        if (!voucherForm.title.trim()) { setVoucherError("Vui lòng nhập tiêu đề"); return false; }
        if (!voucherForm.initQuantity) { setVoucherError("Vui lòng nhập số lượng"); return false; }
        if (!voucherForm.percent) {
            setVoucherError(voucherForm.type === "1" ? "Vui lòng nhập % giảm" : "Vui lòng nhập số tiền giảm");
            return false;
        }
        if (!voucherForm.startDate || !voucherForm.endDate) { setVoucherError("Vui lòng chọn ngày"); return false; }
        if (new Date(voucherForm.startDate) >= new Date(voucherForm.endDate)) {
            setVoucherError("Ngày bắt đầu phải trước ngày kết thúc"); return false;
        }
        return true;
    };

    const closeVoucherModal = () => {
        setShowVoucherModal(false);
        setEditVoucher(null);
        setVoucherForm(EMPTY_VOUCHER_FORM);
        setVoucherError(null);
    };

    const handleCreateVoucher = async () => {
        if (!validateVoucherForm()) return;
        setVoucherSaving(true);
        setVoucherError(null);
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store!.id}?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify(buildVoucherBody()),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Tạo voucher thất bại");
            }
            const newVoucher = await res.json();
            setVouchers(prev => [newVoucher, ...prev]);
            closeVoucherModal();
        } catch (err: any) {
            setVoucherError(err.message);
        } finally {
            setVoucherSaving(false);
        }
    };

    const openEditVoucher = (v: Voucher) => {
        setEditVoucher(v);
        setVoucherForm({
            code: v.code,
            title: v.title,
            description: v.description,
            initQuantity: String(v.initQuantity),
            type: String(v.type),
            percent: String(v.percent),
            maximum: v.maximum ? String(v.maximum) : "",
            startDate: v.startDate.slice(0, 16),
            endDate: v.endDate.slice(0, 16),
            categoryShortnames: v.categoryShortnames || [],
            hasPriceCondition: !!v.priceCondition,
            totalMin: v.priceCondition?.totalMin ? String(v.priceCondition.totalMin) : "",
            totalMax: v.priceCondition?.totalMax ? String(v.priceCondition.totalMax) : "",
            priceMin: v.priceCondition?.priceMin ? String(v.priceCondition.priceMin) : "",
        });
        setVoucherError(null);
        setShowVoucherModal(true);
    };

    const handleUpdateVoucher = async () => {
        if (!validateVoucherForm()) return;
        setVoucherSaving(true);
        setVoucherError(null);
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store!.id}/${editVoucher!.id}?userId=${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                },
                body: JSON.stringify(buildVoucherBody()),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Cập nhật thất bại");
            }
            const updated = await res.json();
            setVouchers(prev => prev.map(v => v.id === editVoucher!.id ? updated : v));
            closeVoucherModal();
        } catch (err: any) {
            setVoucherError(err.message);
        } finally {
            setVoucherSaving(false);
        }
    };

    const handleDeleteVoucher = async (id: string) => {
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store!.id}/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Xóa thất bại");
            setVouchers(prev => prev.filter(v => v.id !== id));
            setDeleteVoucherId(null);
        } catch {
            alert("Xóa voucher thất bại");
        }
    };

    const fetchDeletedVouchers = async () => {
        if (!store) return;
        const { token } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store.id}/deleted`, {
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            const data = await res.json();
            setDeletedVouchers(data || []);
        } catch {
            setDeletedVouchers([]);
        }
    };

    const handleRestoreVoucher = async (id: string) => {
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${store!.id}/${id}/restore?userId=${userId}`, {
                method: "PUT",
                headers: { Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Khôi phục thất bại");
            setDeletedVouchers(prev => prev.filter(v => v.id !== id));
            await fetchVouchers(); // refresh lại tab active
        } catch {
            alert("Khôi phục voucher thất bại");
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
                    <button
                        className={`${styles.navItem} ${activeSection === "products" ? styles.navActive : ""}`}
                        onClick={() => setActiveSection("products")}>
                        <span>📦</span> Sản phẩm
                    </button>
                    <button
                        className={`${styles.navItem} ${activeSection === "orders" ? styles.navActive : ""}`}
                        onClick={() => router.push("/seller/orders")}>
                        <span>📋</span> Đơn hàng
                    </button>
                    <button
                        className={`${styles.navItem} ${activeSection === "vouchers" ? styles.navActive : ""}`}
                        onClick={() => { setActiveSection("vouchers"); fetchVouchers(); }}>
                        <span>🎟️</span> Voucher
                    </button>
                    <button
                        className={`${styles.navItem} ${activeSection === "ratings" ? styles.navActive : ""}`}
                        onClick={() => router.push("/my-store/ratings")}>
                        <span>⭐</span> Đánh giá
                    </button>
                    <button
                        className={styles.navItem}
                        onClick={() => router.push("/my-store/promotions")}>
                        <span>🎉</span> Khuyến mãi
                    </button>
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
                    {activeSection === "products" && (
                        <button className={styles.btnCreate} onClick={openCreate}>+ Thêm sản phẩm</button>
                    )}
                </header>

                {/* ── SECTION: SẢN PHẨM ── */}
                {activeSection === "products" && (<>
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

                    <div className={styles.tableSection}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>Danh sách sản phẩm</h2>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <button onClick={() => setActiveTab("active")} style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: activeTab === "active" ? "#6366f1" : "#f3f4f6",
                                    color: activeTab === "active" ? "white" : "#374151", fontWeight: 600,
                                }}>Đang bán</button>
                                <button onClick={() => { setActiveTab("deleted"); fetchDeletedProducts(); }} style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: activeTab === "deleted" ? "#ef4444" : "#f3f4f6",
                                    color: activeTab === "deleted" ? "white" : "#374151", fontWeight: 600,
                                }}>Đã xóa</button>
                                <input className={styles.searchInput} placeholder="🔍 Tìm sản phẩm..."
                                       value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </div>

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
                            )
                        )}
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
                                            <tr key={p.id} style={{ opacity: 0.6 }}>
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
                                                    <button className={styles.btnEdit} onClick={() => handleRestore(p.id)}>
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
                </>)}

                {/* ── SECTION: VOUCHER ── */}
                {activeSection === "vouchers" && (
                    <div className={styles.tableSection}>
                        <div className={styles.tableHeader}>
                            <h2 className={styles.tableTitle}>🎟️ Danh sách Voucher</h2>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <button onClick={() => setVoucherTab("active")} style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: voucherTab === "active" ? "#6366f1" : "#f3f4f6",
                                    color: voucherTab === "active" ? "white" : "#374151", fontWeight: 600,
                                }}>Đang dùng</button>
                                <button onClick={() => { setVoucherTab("deleted"); fetchDeletedVouchers(); }} style={{
                                    padding: "6px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
                                    background: voucherTab === "deleted" ? "#ef4444" : "#f3f4f6",
                                    color: voucherTab === "deleted" ? "white" : "#374151", fontWeight: 600,
                                }}>Đã xóa</button>
                                {voucherTab === "active" && (
                                    <button className={styles.btnCreate} onClick={() => {
                                        setVoucherForm(EMPTY_VOUCHER_FORM);
                                        setVoucherError(null);
                                        setEditVoucher(null);
                                        setShowVoucherModal(true);
                                    }}>+ Tạo Voucher</button>
                                )}
                            </div>
                        </div>

                        {/* Tab: Đang dùng */}
                        {voucherTab === "active" && (
                            voucherLoading ? (
                                <div className={styles.empty}><div className={styles.spinner}></div></div>
                            ) : vouchers.length === 0 ? (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>🎟️</div>
                                    <p>Chưa có voucher nào</p>
                                    <button className={styles.btnCreate} onClick={() => {
                                        setVoucherForm(EMPTY_VOUCHER_FORM);
                                        setVoucherError(null);
                                        setEditVoucher(null);
                                        setShowVoucherModal(true);
                                    }}>Tạo voucher đầu tiên</button>
                                </div>
                            ) : (
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Mã</th><th>Tiêu đề</th><th>Giảm</th>
                                            <th>Số lượng còn</th><th>Hạn dùng</th><th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {vouchers.map(v => (
                                            <tr key={v.id}>
                                                <td><strong>{v.code}</strong></td>
                                                <td>{v.title}</td>
                                                <td className={styles.priceNew}>
                                                    {v.type === 1
                                                        ? `${v.percent}%${v.maximum ? ` (tối đa ${v.maximum.toLocaleString("vi-VN")}đ)` : ""}`
                                                        : `${v.percent.toLocaleString("vi-VN")}đ`}
                                                </td>
                                                <td>{v.currentQuantity}/{v.initQuantity}</td>
                                                <td style={{ fontSize: "0.85rem" }}>
                                                    {new Date(v.startDate).toLocaleDateString("vi-VN")} →{" "}
                                                    {new Date(v.endDate).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td>
                                    <span className={`${styles.statusBadge} ${v.status === 1 ? styles.statusActive : styles.statusInactive}`}>
                                        {v.status === 1 ? "✅ Đang dùng" : "🚫 Tắt"}
                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button className={styles.btnEdit} onClick={() => openEditVoucher(v)}>Sửa</button>
                                                        <button className={styles.btnDelete} onClick={() => setDeleteVoucherId(v.id)}>Xóa</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}

                        {/* Tab: Đã xóa */}
                        {voucherTab === "deleted" && (
                            deletedVouchers.length === 0 ? (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>🗑️</div>
                                    <p>Không có voucher nào đã xóa</p>
                                </div>
                            ) : (
                                <div className={styles.tableWrap}>
                                    <table className={styles.table}>
                                        <thead>
                                        <tr>
                                            <th>Mã</th><th>Tiêu đề</th><th>Giảm</th>
                                            <th>Số lượng</th><th>Hạn dùng</th><th>Thao tác</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {deletedVouchers.map(v => (
                                            <tr key={v.id} style={{ opacity: 0.6 }}>
                                                <td><strong>{v.code}</strong></td>
                                                <td>{v.title}</td>
                                                <td className={styles.priceNew}>
                                                    {v.type === 1
                                                        ? `${v.percent}%${v.maximum ? ` (tối đa ${v.maximum.toLocaleString("vi-VN")}đ)` : ""}`
                                                        : `${v.percent.toLocaleString("vi-VN")}đ`}
                                                </td>
                                                <td>{v.currentQuantity}/{v.initQuantity}</td>
                                                <td style={{ fontSize: "0.85rem" }}>
                                                    {new Date(v.startDate).toLocaleDateString("vi-VN")} →{" "}
                                                    {new Date(v.endDate).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td>
                                                    <button className={styles.btnEdit} onClick={() => handleRestoreVoucher(v.id)}>
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
                )}
            </main>

            {/* ── MODAL VOUCHER (TẠO + SỬA) ── */}
            {showVoucherModal && (
                <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeVoucherModal()}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editVoucher ? "✏️ Sửa Voucher" : "🎟️ Tạo Voucher mới"}</h2>
                            <button className={styles.modalClose} onClick={closeVoucherModal}>✕</button>
                        </div>
                        {voucherError && <div className={styles.errorAlert}>{voucherError}</div>}
                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formField}>
                                    <label>Mã voucher *</label>
                                    <input value={voucherForm.code}
                                           onChange={e => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                                           placeholder="VD: SALE10"
                                           disabled={!!editVoucher} />
                                </div>
                                <div className={styles.formField}>
                                    <label>Tiêu đề *</label>
                                    <input value={voucherForm.title}
                                           onChange={e => setVoucherForm({ ...voucherForm, title: e.target.value })}
                                           placeholder="VD: Giảm 10% cho đơn từ 200k" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Loại giảm</label>
                                    <select value={voucherForm.type}
                                            onChange={e => setVoucherForm({ ...voucherForm, type: e.target.value })}>
                                        <option value="1">% Phần trăm</option>
                                        <option value="2">Tiền cố định</option>
                                    </select>
                                </div>
                                <div className={styles.formField}>
                                    <label>{voucherForm.type === "1" ? "% Giảm *" : "Số tiền giảm (đ) *"}</label>
                                    <input type="number" value={voucherForm.percent}
                                           onChange={e => setVoucherForm({ ...voucherForm, percent: e.target.value })}
                                           placeholder={voucherForm.type === "1" ? "10" : "50000"} />
                                </div>
                                <div className={styles.formField}>
                                    <label>Số lượng phát hành *</label>
                                    <input type="number" value={voucherForm.initQuantity}
                                           onChange={e => setVoucherForm({ ...voucherForm, initQuantity: e.target.value })}
                                           placeholder="100" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giảm tối đa (đ)</label>
                                    <input type="number" value={voucherForm.maximum}
                                           onChange={e => setVoucherForm({ ...voucherForm, maximum: e.target.value })}
                                           placeholder="50000 (để trống = không giới hạn)" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Ngày bắt đầu *</label>
                                    <input type="datetime-local" value={voucherForm.startDate}
                                           onChange={e => setVoucherForm({ ...voucherForm, startDate: e.target.value })} />
                                </div>
                                <div className={styles.formField}>
                                    <label>Ngày kết thúc *</label>
                                    <input type="datetime-local" value={voucherForm.endDate}
                                           onChange={e => setVoucherForm({ ...voucherForm, endDate: e.target.value })} />
                                </div>
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Mô tả</label>
                                    <textarea value={voucherForm.description}
                                              onChange={e => setVoucherForm({ ...voucherForm, description: e.target.value })}
                                              placeholder="Mô tả điều kiện áp dụng..." rows={2} />
                                </div>
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label>Áp dụng cho danh mục (để trống = tất cả)</label>
                                    <select multiple value={voucherForm.categoryShortnames}
                                            onChange={e => {
                                                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                                                setVoucherForm({ ...voucherForm, categoryShortnames: selected });
                                            }}
                                            style={{ height: "80px" }}>
                                        {categories.map(c => (
                                            <option key={c.shortname} value={c.shortname}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formField} style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <input type="checkbox" checked={voucherForm.hasPriceCondition}
                                               onChange={e => setVoucherForm({ ...voucherForm, hasPriceCondition: e.target.checked })} />
                                        Thêm điều kiện giá trị đơn hàng
                                    </label>
                                </div>
                                {voucherForm.hasPriceCondition && (<>
                                    <div className={styles.formField}>
                                        <label>Đơn tối thiểu (đ)</label>
                                        <input type="number" value={voucherForm.totalMin}
                                               onChange={e => setVoucherForm({ ...voucherForm, totalMin: e.target.value })}
                                               placeholder="200000" />
                                    </div>
                                    <div className={styles.formField}>
                                        <label>Đơn tối đa (đ)</label>
                                        <input type="number" value={voucherForm.totalMax}
                                               onChange={e => setVoucherForm({ ...voucherForm, totalMax: e.target.value })}
                                               placeholder="Để trống = không giới hạn" />
                                    </div>
                                    <div className={styles.formField}>
                                        <label>Giá sản phẩm tối thiểu (đ)</label>
                                        <input type="number" value={voucherForm.priceMin}
                                               onChange={e => setVoucherForm({ ...voucherForm, priceMin: e.target.value })}
                                               placeholder="Để trống = không giới hạn" />
                                    </div>
                                </>)}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={closeVoucherModal}>Hủy</button>
                            <button className={styles.btnSave}
                                    onClick={editVoucher ? handleUpdateVoucher : handleCreateVoucher}
                                    disabled={voucherSaving}>
                                {voucherSaving ? "Đang lưu..." : editVoucher ? "Cập nhật" : "Tạo Voucher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL SẢN PHẨM ── */}
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
                                    <select value={form.categoryShortname}
                                            onChange={e => setForm({ ...form, categoryShortname: e.target.value })}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(c => (
                                            <option key={c.shortname} value={c.shortname}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {editProduct && (
                                    <div className={styles.formField}>
                                        <label>Trạng thái</label>
                                        <select value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}>
                                            <option value="pending">⏳ Chờ duyệt</option>
                                            <option value="inactive">🚫 Ẩn sản phẩm</option>
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

            {/* ── CONFIRM XÓA SẢN PHẨM ── */}
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

            {/* ── CONFIRM XÓA VOUCHER ── */}
            {deleteVoucherId !== null && (
                <div className={styles.overlay} onClick={() => setDeleteVoucherId(null)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>🎟️</div>
                        <h3>Xóa voucher?</h3>
                        <p>Hành động này không thể hoàn tác.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={() => setDeleteVoucherId(null)}>Hủy</button>
                            <button className={styles.btnDelete} onClick={() => handleDeleteVoucher(deleteVoucherId)}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}