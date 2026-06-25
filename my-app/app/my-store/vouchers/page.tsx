"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StoreSidebar from "../../components/StoreSidebar";
import styles from "./vouchers.module.css";

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

export default function VouchersPage() {
    const router = useRouter();
    const [storeId, setStoreId]             = useState<string>("");
    const [vouchers, setVouchers]           = useState<Voucher[]>([]);
    const [deletedVouchers, setDeletedVouchers] = useState<Voucher[]>([]);
    const [categories, setCategories]       = useState<{ shortname: string; name: string }[]>([]);
    const [loading, setLoading]             = useState(true);
    const [voucherTab, setVoucherTab]       = useState<"active" | "deleted">("active");
    const [showModal, setShowModal]         = useState(false);
    const [editVoucher, setEditVoucher]     = useState<Voucher | null>(null);
    const [voucherForm, setVoucherForm]     = useState<VoucherForm>(EMPTY_VOUCHER_FORM);
    const [saving, setSaving]               = useState(false);
    const [error, setError]                 = useState<string | null>(null);
    const [deleteId, setDeleteId]           = useState<string | null>(null);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        return { token, userId };
    };

    // Fetch store + categories
    useEffect(() => {
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        Promise.all([
            fetch(`/api/stores/my-store?userId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json()),
            fetch(`/api/categories`).then(r => r.json()),
        ]).then(([storeData, catData]) => {
            setStoreId(storeData.id);
            setCategories(catData.data || []);
            return fetch(`/api/vouchers/store/${storeData.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.json());
        }).then(data => {
            setVouchers(data || []);
            setLoading(false);
        }).catch(() => router.push("/login"));
    }, [router]);

    const fetchVouchers = async () => {
        const { token } = getAuth();
        const res = await fetch(`/api/vouchers/store/${storeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setVouchers(await res.json() || []);
    };

    const fetchDeletedVouchers = async () => {
        const { token } = getAuth();
        const res = await fetch(`/api/vouchers/store/${storeId}/deleted`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setDeletedVouchers(await res.json() || []);
    };

    const buildBody = () => ({
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

    const validate = () => {
        if (!voucherForm.code.trim())    { setError("Vui lòng nhập mã vouchers"); return false; }
        if (!voucherForm.title.trim())   { setError("Vui lòng nhập tiêu đề"); return false; }
        if (!voucherForm.initQuantity)   { setError("Vui lòng nhập số lượng"); return false; }
        if (!voucherForm.percent)        { setError("Vui lòng nhập % hoặc số tiền giảm"); return false; }
        if (!voucherForm.startDate || !voucherForm.endDate) { setError("Vui lòng chọn ngày"); return false; }
        if (new Date(voucherForm.startDate) >= new Date(voucherForm.endDate)) {
            setError("Ngày bắt đầu phải trước ngày kết thúc"); return false;
        }
        return true;
    };

    const closeModal = () => {
        setShowModal(false);
        setEditVoucher(null);
        setVoucherForm(EMPTY_VOUCHER_FORM);
        setError(null);
    };

    const openCreate = () => {
        setEditVoucher(null);
        setVoucherForm(EMPTY_VOUCHER_FORM);
        setError(null);
        setShowModal(true);
    };

    const openEdit = (v: Voucher) => {
        setEditVoucher(v);
        setVoucherForm({
            code: v.code, title: v.title, description: v.description,
            initQuantity: String(v.initQuantity), type: String(v.type),
            percent: String(v.percent), maximum: v.maximum ? String(v.maximum) : "",
            startDate: v.startDate.slice(0, 16), endDate: v.endDate.slice(0, 16),
            categoryShortnames: v.categoryShortnames || [],
            hasPriceCondition: !!v.priceCondition,
            totalMin: v.priceCondition?.totalMin ? String(v.priceCondition.totalMin) : "",
            totalMax: v.priceCondition?.totalMax ? String(v.priceCondition.totalMax) : "",
            priceMin: v.priceCondition?.priceMin ? String(v.priceCondition.priceMin) : "",
        });
        setError(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true); setError(null);
        const { token, userId } = getAuth();
        try {
            const url = editVoucher
                ? `/api/vouchers/store/${storeId}/${editVoucher.id}?userId=${userId}`
                : `/api/vouchers/store/${storeId}?userId=${userId}`;
            const method = editVoucher ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(buildBody()),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Lưu thất bại");
            }
            const data = await res.json();
            if (editVoucher) {
                setVouchers(prev => prev.map(v => v.id === editVoucher.id ? data : v));
            } else {
                setVouchers(prev => [data, ...prev]);
            }
            closeModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${storeId}/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setVouchers(prev => prev.filter(v => v.id !== id));
            setDeleteId(null);
        } catch {
            alert("Xóa thất bại");
        }
    };

    const handleRestore = async (id: string) => {
        const { token, userId } = getAuth();
        try {
            const res = await fetch(`/api/vouchers/store/${storeId}/${id}/restore?userId=${userId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            setDeletedVouchers(prev => prev.filter(v => v.id !== id));
            await fetchVouchers();
        } catch {
            alert("Khôi phục thất bại");
        }
    };

    if (loading) return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                <div className={styles.loadingWrap}>
                    <div className={styles.spinner} />
                    <p>Đang tải voucher…</p>
                </div>
            </main>
        </div>
    );

    return (
        <div className={styles.page}>
            <StoreSidebar />

            <main className={styles.main}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Voucher</h1>
                        <p className={styles.pageSubtitle}>Quản lý mã giảm giá của cửa hàng</p>
                    </div>
                    {voucherTab === "active" && (
                        <button className={styles.btnCreate} onClick={openCreate}>
                            + Tạo Voucher
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${voucherTab === "active" ? styles.tabActive : ""}`}
                        onClick={() => setVoucherTab("active")}
                    >
                        🎟️ Đang dùng
                        <span className={styles.tabBadge}>{vouchers.length}</span>
                    </button>
                    <button
                        className={`${styles.tabBtn} ${voucherTab === "deleted" ? styles.tabActive : ""}`}
                        onClick={() => { setVoucherTab("deleted"); fetchDeletedVouchers(); }}
                    >
                        🗑️ Đã xóa
                        <span className={styles.tabBadge}>{deletedVouchers.length}</span>
                    </button>
                </div>

                {/* Table */}
                <div className={styles.tableSection}>
                    {voucherTab === "active" && (
                        vouchers.length === 0 ? (
                            <div className={styles.empty}>
                                <span className={styles.emptyIcon}>🎟️</span>
                                <p>Chưa có voucher nào</p>
                                <button className={styles.btnCreate} onClick={openCreate}>
                                    Tạo voucher đầu tiên
                                </button>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Mã</th><th>Tiêu đề</th><th>Loại</th>
                                        <th>Giảm</th><th>Số lượng</th>
                                        <th>Thời hạn</th><th>Trạng thái</th><th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vouchers.map(v => (
                                        <tr key={v.id}>
                                            <td><strong className={styles.voucherCode}>{v.code}</strong></td>
                                            <td>{v.title}</td>
                                            <td>
                                                    <span className={styles.typeBadge}>
                                                        {v.type === 1 ? "%" : "Tiền cố định"}
                                                    </span>
                                            </td>
                                            <td className={styles.discountCell}>
                                                {v.type === 1
                                                    ? `${v.percent}%${v.maximum ? ` (tối đa ${v.maximum.toLocaleString("vi-VN")}đ)` : ""}`
                                                    : `${v.percent.toLocaleString("vi-VN")}đ`}
                                            </td>
                                            <td>{v.currentQuantity}/{v.initQuantity}</td>
                                            <td className={styles.dateCell}>
                                                {new Date(v.startDate).toLocaleDateString("vi-VN")}
                                                <br />→ {new Date(v.endDate).toLocaleDateString("vi-VN")}
                                                {new Date(v.endDate) < new Date() && <div style={{ color: "red", fontSize: "0.85em", marginTop: "4px", fontWeight: 600 }}>⏳ Hết hạn</div>}
                                            </td>
                                            <td>
                                                {new Date(v.endDate) < new Date() ? (
                                                    <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
                                                        ⏳ Hết hạn
                                                    </span>
                                                ) : (
                                                    <span className={`${styles.statusBadge} ${v.status === 1 ? styles.statusActive : styles.statusInactive}`}>
                                                        {v.status === 1 ? "✅ Đang dùng" : "🚫 Tắt"}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button className={styles.btnEdit} onClick={() => openEdit(v)}>Sửa</button>
                                                    <button className={styles.btnDelete} onClick={() => setDeleteId(v.id)}>Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {voucherTab === "deleted" && (
                        deletedVouchers.length === 0 ? (
                            <div className={styles.empty}>
                                <span className={styles.emptyIcon}>🗑️</span>
                                <p>Không có voucher nào đã xóa</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <th>Mã</th><th>Tiêu đề</th><th>Giảm</th>
                                        <th>Số lượng</th><th>Thời hạn</th><th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {deletedVouchers.map(v => (
                                        <tr key={v.id} style={{ opacity: 0.6 }}>
                                            <td><strong className={styles.voucherCode}>{v.code}</strong></td>
                                            <td>{v.title}</td>
                                            <td className={styles.discountCell}>
                                                {v.type === 1 ? `${v.percent}%` : `${v.percent.toLocaleString("vi-VN")}đ`}
                                            </td>
                                            <td>{v.currentQuantity}/{v.initQuantity}</td>
                                            <td className={styles.dateCell}>
                                                {new Date(v.startDate).toLocaleDateString("vi-VN")}
                                                <br />→ {new Date(v.endDate).toLocaleDateString("vi-VN")}
                                                {new Date(v.endDate) < new Date() && <div style={{ color: "red", fontSize: "0.85em", marginTop: "4px", fontWeight: 600 }}>⏳ Hết hạn</div>}
                                            </td>
                                            <td>
                                                <button className={styles.btnEdit} onClick={() => handleRestore(v.id)}>
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

            {/* Modal tạo/sửa vouchers */}
            {showModal && (
                <div className={styles.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editVoucher ? "✏️ Sửa Voucher" : "🎟️ Tạo Voucher mới"}</h2>
                            <button className={styles.modalClose} onClick={closeModal}>✕</button>
                        </div>
                        {error && <div className={styles.errorAlert}>{error}</div>}
                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formField}>
                                    <label>Mã voucher *</label>
                                    <input value={voucherForm.code}
                                           onChange={e => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                                           placeholder="VD: SALE10" disabled={!!editVoucher} />
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
                                    <label>Số lượng *</label>
                                    <input type="number" value={voucherForm.initQuantity}
                                           onChange={e => setVoucherForm({ ...voucherForm, initQuantity: e.target.value })}
                                           placeholder="100" />
                                </div>
                                <div className={styles.formField}>
                                    <label>Giảm tối đa (đ)</label>
                                    <input type="number" value={voucherForm.maximum}
                                           onChange={e => setVoucherForm({ ...voucherForm, maximum: e.target.value })}
                                           placeholder="Để trống = không giới hạn" />
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
                                            }} style={{ height: "80px" }}>
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
                            <button className={styles.btnCancel} onClick={closeModal}>Hủy</button>
                            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                                {saving ? "Đang lưu..." : editVoucher ? "Cập nhật" : "Tạo Voucher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm xóa */}
            {deleteId && (
                <div className={styles.overlay} onClick={() => setDeleteId(null)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>🎟️</div>
                        <h3>Xóa voucher?</h3>
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