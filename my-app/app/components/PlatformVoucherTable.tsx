"use client";

import { useEffect, useState } from "react";
import styles from "../admin/dashboard/dashboard.module.css";
import ConfirmModal from "./ConfirmModal";

export interface VoucherDTO {
    id?: number;
    code: string;
    name: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number | null;
    startDate: string;
    endDate: string;
    quantity: number;
    usedCount?: number;
    status: string;
    isPlatform?: boolean;
}

interface Props {
    authHeader: () => Record<string, string>;
    showToast: (msg: string) => void;
    logActivity: (action: string, target: string, type: string) => void;
}

export default function PlatformVoucherTable({ authHeader, showToast, logActivity }: Props) {
    const [vouchers, setVouchers] = useState<VoucherDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<VoucherDTO | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ id: number; name: string } | null>(null);

    const initialFormState: VoucherDTO = {
        code: "", name: "", description: "", discountType: "FIXED",
        discountValue: 0, minOrderValue: 0, maxDiscount: 0,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        quantity: 100, status: "active"
    };

    const [formData, setFormData] = useState<VoucherDTO>(initialFormState);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders/admin/vouchers", { headers: authHeader() });
            const data = await res.json();
            if (res.ok && data.success) {
                setVouchers(data.data);
            } else {
                setVouchers([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải voucher sàn:", error);
            showToast("❌ Lỗi khi tải dữ liệu voucher sàn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleOpenModal = (voucher?: VoucherDTO) => {
        if (voucher) {
            setEditingVoucher(voucher);
            setFormData({
                ...voucher,
                startDate: voucher.startDate ? voucher.startDate.slice(0, 16) : initialFormState.startDate,
                endDate: voucher.endDate ? voucher.endDate.slice(0, 16) : initialFormState.endDate,
            });
        } else {
            setEditingVoucher(null);
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isEdit = !!editingVoucher;
            const url = isEdit ? `/api/orders/admin/vouchers/${editingVoucher.id}` : "/api/orders/admin/vouchers";
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                ...formData,
                startDate: formData.startDate.length === 16 ? `${formData.startDate}:00` : formData.startDate.replace('Z', ''),
                endDate: formData.endDate.length === 16 ? `${formData.endDate}:00` : formData.endDate.replace('Z', ''),
            };

            const res = await fetch(url, {
                method,
                headers: authHeader(),
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                showToast(isEdit ? "✅ Cập nhật voucher thành công" : "✅ Thêm voucher thành công");
                logActivity(isEdit ? "Sửa voucher sàn" : "Thêm voucher sàn", formData.code, "voucher");
                setIsModalOpen(false);
                fetchVouchers();
            } else {
                showToast(`❌ ${data.message || "Lỗi lưu voucher"}`);
            }
        } catch (error) {
            showToast("❌ Lỗi hệ thống khi lưu voucher.");
        }
    };

    const handleDelete = async () => {
        if (!confirmModal) return;
        try {
            const res = await fetch(`/api/orders/admin/vouchers/${confirmModal.id}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                showToast("✅ Xóa (ẩn) voucher thành công");
                logActivity("Xóa voucher sàn", confirmModal.name, "voucher");
                fetchVouchers();
            } else {
                showToast(`❌ ${data.message || "Lỗi khi xóa voucher"}`);
            }
        } catch (error) {
            showToast("❌ Lỗi hệ thống khi xóa voucher.");
        } finally {
            setConfirmModal(null);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "active") return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Đang phát hành</span>;
        if (status === "inactive") return <span className={`${styles.badge} ${styles.badgeDanger}`}>Tạm dừng/Đã ẩn</span>;
        if (status === "expired") return <span className={`${styles.badge} ${styles.badgeWarning}`}>Đã hết hạn</span>;
        return <span className={`${styles.badge}`}>{status}</span>;
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>Quản lý Voucher Sàn</h2>
                <div className={styles.tableActions}>
                    <button className={styles.refreshBtn} onClick={fetchVouchers} disabled={loading}>
                        {loading ? "⏳ Đang tải..." : "🔄 Làm mới"}
                    </button>
                    <button className={styles.primaryBtn} onClick={() => handleOpenModal()}>
                        ➕ Thêm Voucher Mới
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loadingState}>Đang tải dữ liệu...</div>
                ) : vouchers.length === 0 ? (
                    <div className={styles.emptyState}>Chưa có voucher sàn nào.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã Voucher</th>
                                <th>Tên Voucher</th>
                                <th>Khuyến mãi</th>
                                <th>Đơn tối thiểu</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map(v => (
                                <tr key={v.id}>
                                    <td><strong>{v.code}</strong></td>
                                    <td>{v.name}</td>
                                    <td>
                                        {v.discountType === "PERCENT" 
                                            ? `${v.discountValue}% (Tối đa ${v.maxDiscount ? formatCurrency(v.maxDiscount) : "Không giới hạn"})` 
                                            : formatCurrency(v.discountValue)}
                                    </td>
                                    <td>{formatCurrency(v.minOrderValue)}</td>
                                    <td>{v.usedCount || 0} / {v.quantity}</td>
                                    <td>{getStatusBadge(v.status)}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.actionBtn} onClick={() => handleOpenModal(v)}>
                                                ✏️ Sửa
                                            </button>
                                            <button className={`${styles.actionBtn} ${styles.dangerBtn}`} onClick={() => setConfirmModal({ id: v.id!, name: v.code })}>
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                        <h3>{editingVoucher ? "Chỉnh sửa Voucher Sàn" : "Thêm Voucher Sàn Mới"}</h3>
                        <form onSubmit={handleSave} className={styles.formGroup}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mã Voucher (Code) *</label>
                                    <input type="text" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required 
                                           value={formData.code} 
                                           onChange={e => setFormData({ ...formData, code: e.target.value })} 
                                           placeholder="VD: FREESHIP, SALET5" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên Voucher *</label>
                                    <input type="text" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required 
                                           value={formData.name} 
                                           onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                           placeholder="Tên hiển thị cho KH" />
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mô tả chi tiết</label>
                                <textarea className={styles.searchInput} style={{ width: '100%', height: '80px', padding: '10px', resize: 'none' }}
                                          value={formData.description} 
                                          onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                          placeholder="Voucher giảm giá cho mọi đơn hàng..."></textarea>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Loại Giảm Giá</label>
                                    <select className={styles.filterSelect} style={{ width: '100%', padding: '10px' }}
                                            value={formData.discountType} 
                                            onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                                        <option value="FIXED">Giảm số tiền cố định (VNĐ)</option>
                                        <option value="PERCENT">Giảm theo phần trăm (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giá trị giảm *</label>
                                    <input type="number" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required min="0" step="0.01"
                                           value={formData.discountValue} 
                                           onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Đơn hàng tối thiểu *</label>
                                    <input type="number" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required min="0"
                                           value={formData.minOrderValue} 
                                           onChange={e => setFormData({ ...formData, minOrderValue: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giảm tối đa (nếu giảm %)</label>
                                    <input type="number" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} min="0" disabled={formData.discountType !== "PERCENT"}
                                           value={formData.maxDiscount || 0} 
                                           onChange={e => setFormData({ ...formData, maxDiscount: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thời gian bắt đầu *</label>
                                    <input type="datetime-local" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required 
                                           value={formData.startDate} 
                                           onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thời gian kết thúc *</label>
                                    <input type="datetime-local" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required 
                                           value={formData.endDate} 
                                           onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Số lượng giới hạn *</label>
                                    <input type="number" className={styles.searchInput} style={{ width: '100%', padding: '10px' }} required min="1"
                                           value={formData.quantity} 
                                           onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trạng thái</label>
                                    <select className={styles.filterSelect} style={{ width: '100%', padding: '10px' }}
                                            value={formData.status} 
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="active">Đang phát hành</option>
                                        <option value="inactive">Tạm dừng (Ẩn)</option>
                                        <option value="expired">Đã hết hạn</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.modalActions} style={{ marginTop: '10px' }}>
                                <button type="button" className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>
                                    Hủy bỏ
                                </button>
                                <button type="submit" className={styles.btnConfirm}>
                                    💾 Lưu Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmModal && (
                <ConfirmModal
                    label={`Bạn có chắc muốn xóa (ẩn) voucher sàn "${confirmModal.name}" không? Voucher sẽ không bị xóa vĩnh viễn mà chỉ bị đổi trạng thái để không áp dụng được nữa.`}
                    loading={false}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmModal(null)}
                />
            )}
        </div>
    );
}
