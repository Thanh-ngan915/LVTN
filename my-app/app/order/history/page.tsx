'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { getOrdersByUser, OrderResponseDTO, cancelOrder} from '../../services/orderService';
import styles from './order-history.module.css';
import { useEffect, useState, useCallback } from 'react';
import ReviewModal from '../../components/ReviewModal';
import { Order } from '../../services/orderService';

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [cancelId, setCancelId] = useState<number | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

    const handleCancel = async () => {
        if (!cancelId) return;
        setCancelling(true);
        try {
            const res = await cancelOrder(cancelId);
            if (res.success) {
                // Cập nhật state local, không cần fetch lại
                setOrders(prev => prev.map(o =>
                    o.id === cancelId ? { ...o, status: 'cancelled' } : o
                ));
                setCancelId(null);
                setToast('✅ Hủy đơn hàng thành công');
                setTimeout(() => setToast(null), 3000);
            }
        } catch (e) {
            const errMsg = e instanceof Error ? e.message : 'Hủy đơn thất bại';
            setToast(`❌ ${errMsg}`);
            setTimeout(() => setToast(null), 3000);
        }finally {
            setCancelling(false);
        }
    };
    const fetchOrders = useCallback(async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) { router.push('/login'); return; }

        setLoading(true);
        getOrdersByUser()
            .then(res => { if (res.success) setOrders(res.data || []); })
            .finally(() => setLoading(false));
    }, [router]);
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    useEffect(() => {
        window.addEventListener('focus', fetchOrders);
        return () => window.removeEventListener('focus', fetchOrders);
    }, [fetchOrders]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending':   return { label: '⏳ Chờ xác nhận', cls: styles.statusPending };
            case 'confirmed': return { label: '✅ Đã xác nhận',  cls: styles.statusConfirmed };
            case 'shipping':  return { label: '🚚 Đang giao',    cls: styles.statusShipping };
            case 'delivered': return { label: '📦 Đã giao',      cls: styles.statusDelivered };
            case 'cancelled': return { label: '❌ Đã hủy',       cls: styles.statusCancelled };
            default:          return { label: status,             cls: '' };
        }
    };

    const tabs = [
        { key: 'all',       label: 'Tất cả' },
        { key: 'pending',   label: 'Chờ xác nhận' },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'shipping',  label: 'Đang giao' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'cancelled', label: 'Đã hủy' },
    ];

    const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

    if (loading) return <div className={styles.loading}>Đang tải...</div>;

    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.title}>📋 Lịch sử đơn hàng</h1>

                {/* Tabs */}
                <div className={styles.tabs}>
                    {tabs.map(tab => (
                        <button key={tab.key}
                                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.key)}>
                            {tab.label}
                            <span className={styles.tabCount}>
                {tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length}
              </span>
                        </button>
                    ))}
                </div>

                {/* Empty */}
                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📭</div>
                        <p className={styles.emptyText}>Không có đơn hàng nào</p>
                        <button className={styles.emptyBtn} onClick={() => router.push('/')}>
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    <div className={styles.orderList}>
                        {filtered.map(order => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div key={order.id} className={styles.orderCard}>
                                    {/* Header */}
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderId}>Đơn hàng #{order.id}</span>
                                        <span className={`${styles.statusBadge} ${statusInfo.cls}`}>
                      {statusInfo.label}
                    </span>
                                    </div>

                                    {/* Items */}
                                    {order.items?.map((item, i) => (
                                        <div key={i} className={styles.orderItem}>
                                            {item.productImage
                                                ? <img src={item.productImage} alt={item.productName || ''} className={styles.productImage} />
                                                : <div className={styles.productImagePlaceholder}>🖼️</div>
                                            }
                                            <div className={styles.productInfo}>
                                                <p className={styles.productName}>{item.productName || 'Sản phẩm'}</p>
                                                {(item.color || item.size) && (
                                                    <p className={styles.productVariant}>
                                                        {item.color && `Màu: ${item.color}`}
                                                        {item.color && item.size && ' • '}
                                                        {item.size && `Size: ${item.size}`}
                                                    </p>
                                                )}
                                                <p className={styles.productQty}>x{item.quantity}</p>
                                            </div>
                                            <div className={styles.productPrice}>
                                                {item.priceBefore > item.priceAfter && (
                                                    <p className={styles.priceBefore}>{formatPrice(item.priceBefore)}</p>
                                                )}
                                                <p className={styles.priceAfter}>{formatPrice(item.priceAfter)}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Footer */}
                                    <div className={styles.orderFooter}>
                                        <p className={styles.orderDate}>
                                            {order.createdAt ? formatDate(order.createdAt) : ''}
                                        </p>
                                        <div className={styles.orderActions}>
                      <span className={styles.orderTotal}>
                        Tổng: {formatPrice(order.pay)}
                      </span>
                                            <button className={styles.btnDetail}
                                                    onClick={() => router.push(`/order/${order.id}`)}>
                                                Xem chi tiết
                                            </button>
                                            {order.status === 'pending' && (
                                                <button className={styles.btnCancel} onClick={() => setCancelId(order.id)}>
                                                    Hủy đơn
                                                </button>
                                            )}
                                            {order.status === 'delivered' && (
                                                order.rated
                                                ? <span className={styles.ratedBadge}> ✓ Đã đánh giá</span>
                                                : <button className={styles.btnReview} onClick={() => setReviewOrder(order as Order)}>
                                                    Đánh giá
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {reviewOrder && (
                <ReviewModal
                    order={reviewOrder}
                    onClose={() => setReviewOrder(null)}
                    onSuccess={(orderId) => {
                        setOrders(prev => prev.map(o =>
                            o.id === orderId ? { ...o, rated: true } : o
                        ));
                        setReviewOrder(null);
                        setToast('✅ Đánh giá thành công');
                        setTimeout(() => setToast(null), 3000);
                    }}
                />
            )}
            {cancelId !== null && (
                <div className={styles.overlay} onClick={() => setCancelId(null)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>🗑️</div>
                        <h3 className={styles.confirmTitle}>Hủy đơn hàng?</h3>
                        <p className={styles.confirmText}>
                            Bạn có chắc muốn hủy đơn hàng #{cancelId}?<br />
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className={styles.confirmActions}>
                            <button className={styles.btnBack} onClick={() => setCancelId(null)}>
                                Quay lại
                            </button>
                            <button className={styles.btnConfirmCancel}
                                    onClick={handleCancel} disabled={cancelling}>
                                {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <div className={styles.toast}>{toast}</div>}
        </div>
    );
}