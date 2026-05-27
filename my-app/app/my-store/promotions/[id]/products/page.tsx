"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./products.module.css";
import {
    getProductsByPromotion,
    addProductToPromotion,
    removeProductFromPromotion,
    ProductPromotionDTO,
} from "../../../../services/salePromotionService";

interface StoreProduct {
    id: number;
    name: string;
    image: string;
    priceBefore: number;
    imageUrls: string[];
}

export default function PromotionProductsPage() {
    const router = useRouter();
    const params = useParams();
    const promotionId = params.id as string;

    const [storeId, setStoreId] = useState<string | null>(null);
    const [products, setProducts] = useState<ProductPromotionDTO[]>([]);
    const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
    const [priceAfter, setPriceAfter] = useState("");
    const [quantity, setQuantity] = useState("");
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [productSearch, setProductSearch] = useState("");

    const getAuth = () => {
        const token = localStorage.getItem("token") || "";
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return {
            authHeader: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            userId: user.userId || "",
        };
    };

    useEffect(() => {
        if (storeId) return;
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) { router.push("/login"); return; }

        const { authHeader } = getAuth();

        fetch(`/api/stores/my-store?userId=${JSON.parse(storedUser).userId}`, {
            headers: { Authorization: authHeader },
        })
            .then(res => res.json())
            .then(async (storeData) => {
                if (!storeData?.id) { router.push("/my-store"); return; }
                setStoreId(storeData.id);

                const [promoProducts, allProducts] = await Promise.all([
                    getProductsByPromotion(storeData.id, promotionId),
                    fetch(`/api/products/store/${storeData.id}?size=100`, {
                        headers: { Authorization: authHeader },
                    }).then(r => r.json()).then(d => d.data || []),
                ]);

                setProducts(promoProducts);
                setStoreProducts(allProducts);
                setLoading(false);
            })
            .catch(() => router.push("/login"));
    }, []);

    const fetchProducts = async (sid: string) => {
        const { authHeader } = getAuth();
        const promoProducts = await getProductsByPromotion(sid, promotionId);
        setProducts(promoProducts);
    };

    // Lọc sản phẩm store chưa có trong KM
    const registeredIds = new Set(products.map(p => p.productId));
    const availableProducts = storeProducts.filter(p =>
        !registeredIds.has(String(p.id)) &&
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleSelectProduct = (p: StoreProduct) => {
        setSelectedProduct(p);
        setDropdownOpen(false);
        setProductSearch(p.name);
        setPriceAfter("");
        setError(null);
    };

    const handleAdd = async () => {
        if (!selectedProduct) { setError("Vui lòng chọn sản phẩm"); return; }
        if (!priceAfter || parseFloat(priceAfter) <= 0) { setError("Vui lòng nhập giá KM hợp lệ"); return; }
        if (parseFloat(priceAfter) >= selectedProduct.priceBefore) {
            setError(`Giá KM phải nhỏ hơn giá gốc (${selectedProduct.priceBefore.toLocaleString("vi-VN")}đ)`);
            return;
        }
        if (!quantity || parseInt(quantity) <= 0) { setError("Vui lòng nhập số lượng hợp lệ"); return; }

        setAdding(true);
        setError(null);
        try {
            await addProductToPromotion(storeId!, promotionId, {
                productId: String(selectedProduct.id),
                priceAfter: parseFloat(priceAfter),
                quantity: parseInt(quantity),
            });
            await fetchProducts(storeId!);
            setShowForm(false);
            setSelectedProduct(null);
            setProductSearch("");
            setPriceAfter("");
            setQuantity("");
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm("Xóa sản phẩm khỏi KM này?")) return;
        try {
            await removeProductFromPromotion(storeId!, promotionId, id);
            await fetchProducts(storeId!);
        } catch (err: unknown) {
            alert((err as Error).message);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.main}>

                {/* Topbar */}
                <div className={styles.topbar}>
                    <div className={styles.titleGroup}>
                        <button className={styles.backBtn} onClick={() => router.push("/my-store/promotions")}>
                            ← Quay lại
                        </button>
                        <h1 className={styles.pageTitle}>Sản phẩm khuyến mãi</h1>
                    </div>
                    <button className={styles.btnCreate} onClick={() => { setShowForm(true); setError(null); }}>
                        + Thêm sản phẩm
                    </button>
                </div>

                {/* Form thêm sản phẩm */}
                {showForm && (
                    <div className={styles.formCard}>
                        <div className={styles.formCardHeader}>
                            <h2 className={styles.formCardTitle}>Thêm sản phẩm vào khuyến mãi</h2>
                            <button className={styles.closeBtn} onClick={() => {
                                setShowForm(false);
                                setSelectedProduct(null);
                                setProductSearch("");
                                setError(null);
                            }}>✕</button>
                        </div>

                        {error && <div className={styles.errorAlert}>{error}</div>}

                        <div className={styles.formCardBody}>
                            <div className={styles.formGrid}>

                                {/* Dropdown chọn sản phẩm */}
                                <div className={`${styles.formField} ${styles.fullWidth}`}>
                                    <label>Chọn sản phẩm *</label>
                                    <div className={styles.dropdownWrap}>
                                        <input
                                            value={productSearch}
                                            onChange={e => {
                                                setProductSearch(e.target.value);
                                                setSelectedProduct(null);
                                                setDropdownOpen(true);
                                            }}
                                            onFocus={() => setDropdownOpen(true)}
                                            placeholder="Tìm tên sản phẩm..."
                                            className={styles.dropdownInput}
                                        />
                                        {dropdownOpen && availableProducts.length > 0 && (
                                            <div className={styles.dropdownList}>
                                                {availableProducts.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className={styles.dropdownItem}
                                                        onClick={() => handleSelectProduct(p)}
                                                    >
                                                        <img
                                                            src={p.imageUrls?.[0] || "/placeholder.png"}
                                                            alt={p.name}
                                                            className={styles.dropdownImg}
                                                        />
                                                        <div>
                                                            <div className={styles.dropdownName}>{p.name}</div>
                                                            <div className={styles.dropdownPrice}>
                                                                Giá gốc: {p.priceBefore.toLocaleString("vi-VN")}đ
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {dropdownOpen && productSearch && availableProducts.length === 0 && (
                                            <div className={styles.dropdownEmpty}>Không tìm thấy sản phẩm</div>
                                        )}
                                    </div>
                                    {selectedProduct && (
                                        <div className={styles.selectedTag}>
                                            ✓ Đã chọn: <strong>{selectedProduct.name}</strong> — Giá gốc: {selectedProduct.priceBefore.toLocaleString("vi-VN")}đ
                                        </div>
                                    )}
                                </div>

                                {/* Giá KM */}
                                <div className={styles.formField}>
                                    <label>Giá khuyến mãi (đ) *</label>
                                    <input
                                        type="number"
                                        value={priceAfter}
                                        onChange={e => { setPriceAfter(e.target.value); setError(null); }}
                                        placeholder={selectedProduct ? `Nhỏ hơn ${selectedProduct.priceBefore.toLocaleString("vi-VN")}đ` : "VD: 150000"}
                                    />
                                </div>

                                {/* Số lượng */}
                                <div className={styles.formField}>
                                    <label>Số lượng *</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={e => { setQuantity(e.target.value); setError(null); }}
                                        placeholder="VD: 50"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => {
                                setShowForm(false);
                                setSelectedProduct(null);
                                setProductSearch("");
                                setError(null);
                            }}>Hủy</button>
                            <button className={styles.btnSave} onClick={handleAdd} disabled={adding}>
                                {adding ? "Đang thêm..." : "Thêm vào KM"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Danh sách sản phẩm trong KM */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>
                            Danh sách sản phẩm ({products.length})
                        </h2>
                        <input
                            className={styles.searchInput}
                            placeholder="🔍 Tìm sản phẩm..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {filtered.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>📦</div>
                            <p>Chưa có sản phẩm nào trong khuyến mãi này</p>
                            <button className={styles.btnCreate} onClick={() => setShowForm(true)}>
                                Thêm ngay
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá KM</th>
                                    <th>Số lượng</th>
                                    <th>Đã bán</th>
                                    <th>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            {p.image
                                                ? <img src={p.image} alt={p.name} className={styles.productThumb} />
                                                : <div className={styles.productThumbPlaceholder}>🖼️</div>}
                                        </td>
                                        <td className={styles.productName}>{p.name}</td>
                                        <td className={styles.priceNew}>
                                            {p.priceAfter.toLocaleString("vi-VN")}đ
                                        </td>
                                        <td>{p.quantity}</td>
                                        <td>{p.bought}</td>
                                        <td>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleRemove(p.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}