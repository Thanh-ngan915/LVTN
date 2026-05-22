"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./reviews.module.css";
import { Order } from "../services/orderService";
import ReviewModal from "../components/ReviewModal";

export default function ReviewsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [success, setSuccess] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/orders/user?userId=${userId}`, {
            headers: {
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                "X-User-Id": userId,
            }
        })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);  // ← thêm dòng này
                return r.json();
            })
            .then(data => {
                const doneOrders = (data.data || []).filter((o: Order) => o.status === "delivered");
                setOrders(doneOrders);
            })
            .catch((e) => {
                console.error("fetch orders error:", e);  // ← log ra để debug
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleSuccess = (orderId: number) => {
        setSuccess(orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rated: true } : o));
        setSelectedOrder(null);
    };

    if (loading) return (
        <div className={styles.loadingScreen}>
            <div className={styles.spinner} />
            <p>Đang tải đơn hàng...</p>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <button className={styles.backBtn} onClick={() => router.push("/profile")}>
                    ← Quay lại
                </button>
                <div>
                    <h1 className={styles.pageTitle}>Đánh giá sản phẩm</h1>
                    <p className={styles.pageSub}>Chia sẻ trải nghiệm mua sắm của bạn</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>⭐</div>
                    <h2>Chưa có đơn hàng nào để đánh giá</h2>
                    <p>Chỉ có thể đánh giá đơn hàng đã giao thành công</p>
                    <button className={styles.shopBtn} onClick={() => router.push("/")}>
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {orders.map((order, idx) => (
                        <div key={order.id} className={styles.orderCard}
                             style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className={styles.orderCardHeader}>
                                <div className={styles.orderId}>Đơn #{order.id}</div>
                                <div className={styles.orderDate}>
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : ""}
                                </div>
                                {order.rated || success === order.id ? (
                                    <span className={styles.ratedBadge}>✓ Đã đánh giá</span>
                                ) : (
                                    <button className={styles.rateBtn} onClick={() => setSelectedOrder(order)}>
                                        ⭐ Đánh giá
                                    </button>
                                )}
                            </div>
                            <div className={styles.itemList}>
                                {order.items?.map((item, i) => (
                                    <div key={i} className={styles.item}>
                                        <img src={item.productImage || "https://ui-avatars.com/api/?name=P"}
                                             alt={item.productName} className={styles.itemImg} />
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>{item.productName}</div>
                                            <div className={styles.itemMeta}>
                                                {item.color && <span>{item.color}</span>}
                                                {item.size && <span>{item.size}</span>}
                                                <span>x{item.quantity}</span>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                {item.priceAfter?.toLocaleString("vi-VN")}đ
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal dùng component tách riêng */}
            {selectedOrder && (
                <ReviewModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}