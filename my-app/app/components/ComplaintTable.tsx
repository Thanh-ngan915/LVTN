import React, { useState, useEffect } from "react";
import styles from "../admin/dashboard/dashboard.module.css";

interface ComplaintResponseDTO {
    id: string;
    orderId: number;
    buyerId: string;
    shopId: string;
    reason: string;
    description: string;
    images: string[];
    status: string;
    adminNotes: string;
    resolvedBy: string;
    createdAt: string;
    resolvedAt: string;
}

interface Props {
    authHeader: () => HeadersInit;
    showToast: (msg: string) => void;
}

export default function ComplaintTable({ authHeader, showToast }: Props) {
    const [complaints, setComplaints] = useState<ComplaintResponseDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [resolveModal, setResolveModal] = useState<{
        complaintId: string;
        action: "approve" | "reject";
    } | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [isShopFault, setIsShopFault] = useState(false);
    const [resolving, setResolving] = useState(false);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/complaints/admin/pending", { headers: authHeader() });
            const data = await res.json();
            if (data.success) {
                setComplaints(data.data || []);
            } else {
                setComplaints([]);
            }
        } catch (err) {
            console.error(err);
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleResolve = async () => {
        if (!resolveModal) return;
        setResolving(true);
        try {
            const body = {
                adminNotes,
                isShopFault: resolveModal.action === "approve" ? isShopFault : false
            };

            const endpoint = `/api/complaints/admin/${resolveModal.complaintId}/${resolveModal.action}`;
            const res = await fetch(endpoint, {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || "Xử lý khiếu nại thành công");
                fetchComplaints();
            } else {
                showToast(`❌ Lỗi: ${data.message}`);
            }
        } catch (err) {
            showToast("❌ Lỗi hệ thống khi xử lý");
        } finally {
            setResolving(false);
            setResolveModal(null);
            setAdminNotes("");
            setIsShopFault(false);
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h2 className={styles.tableTitle}>Quản lý Khiếu Nại (Chờ duyệt)</h2>
                <button className={styles.refreshBtn} onClick={fetchComplaints} disabled={loading}>
                    {loading ? "Đang tải..." : "🔄 Làm mới"}
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Đang tải dữ liệu...</div>
            ) : complaints.length === 0 ? (
                <div className={styles.emptyState}>Không có khiếu nại nào đang chờ xử lý</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Mã ĐH</th>
                                <th>Người mua</th>
                                <th>Cửa hàng</th>
                                <th>Lý do</th>
                                <th>Mô tả</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id}>
                                    <td>#{c.orderId}</td>
                                    <td>{c.buyerId}</td>
                                    <td>{c.shopId}</td>
                                    <td>
                                        <span className={styles.badge} style={{ backgroundColor: '#ff9800', color: '#fff' }}>
                                            {c.reason}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.description}>
                                            {c.description}
                                        </div>
                                    </td>
                                    <td>{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.approveBtn}`}
                                                onClick={() => setResolveModal({ complaintId: c.id, action: "approve" })}
                                            >
                                                ✅ Hoàn tiền khách
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                                onClick={() => setResolveModal({ complaintId: c.id, action: "reject" })}
                                                style={{ backgroundColor: '#f44336', color: 'white', marginLeft: '8px' }}
                                            >
                                                ❌ Shop giữ tiền
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {resolveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
                        <h3>{resolveModal.action === "approve" ? "Xác nhận duyệt khiếu nại" : "Xác nhận từ chối khiếu nại"}</h3>
                        <p style={{ marginBottom: '16px', color: '#666' }}>
                            {resolveModal.action === "approve" 
                                ? "Khách hàng sẽ được hoàn tiền vào ví." 
                                : "Tiền sẽ được giữ lại cho cửa hàng. Khách hàng không được hoàn tiền."}
                        </p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ghi chú của Admin:</label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                                placeholder="Nhập lý do hoặc ghi chú..."
                            />
                        </div>

                        {resolveModal.action === "approve" && (
                            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="checkbox"
                                    id="shopFault"
                                    checked={isShopFault}
                                    onChange={(e) => setIsShopFault(e.target.checked)}
                                />
                                <label htmlFor="shopFault" style={{ color: '#f44336', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Lỗi do cửa hàng (Phạt shop)
                                </label>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setResolveModal(null);
                                    setAdminNotes("");
                                    setIsShopFault(false);
                                }}
                                disabled={resolving}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleResolve}
                                disabled={resolving || !adminNotes.trim()}
                                style={{ backgroundColor: resolveModal.action === "approve" ? '#4CAF50' : '#f44336' }}
                            >
                                {resolving ? "Đang xử lý..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
