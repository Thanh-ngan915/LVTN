"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./reviews.module.css";

interface OrderItem {
    productId: number;
    productName: string;
    productImage: string;
    color: string;
    size: string;
    quantity: number;
    priceAfter: number;
}

interface Order {
    id: number;
    storeId: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
    rated?: boolean;
}

interface RatingForm {
    orderId: number;
    storeId: string;
    stars: number;
    comment: string;
    materialUrls: string[];
}

export default function ReviewsPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form, setForm] = useState<RatingForm | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<number | null>(null);
    const [uploadingImg, setUploadingImg] = useState(false);

    const getAuth = () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        const username = storedUser ? JSON.parse(storedUser).username : null;
        return { token, userId, username };
    };

    useEffect(() => {
        const { token, userId } = getAuth();
        if (!token || !userId) { router.push("/login"); return; }

        fetch(`/api/orders/user?userId=${userId}`, {
            headers: {
                Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
                "X-User-Id": userId,
            }
        })
            .then(r => r.json())
            .then(data => {
                const doneOrders = (data.data || []).filter((o: Order) => o.status === "done");
                setOrders(doneOrders);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    const openRating = (order: Order) => {
        setSelectedOrder(order);
        setForm({
            orderId: order.id,
            storeId: order.storeId,
            stars: 5,
            comment: "",
            materialUrls: [],
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !form) return;
        setUploadingImg(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "kltn_user_avatar");
            const res = await fetch("https://api.cloudinary.com/v1_1/dqghfi8be/image/upload", {
                method: "POST", body: fd
            });
            const data = await res.json();
            if (data.secure_url) {
                setForm(prev => prev ? { ...prev, materialUrls: [...prev.materialUrls, data.secure_url] } : prev);
            }
        } catch { } finally {
            setUploadingImg(false);
        }
    };

    const removeImage = (url: string) => {
        setForm(prev => prev ? { ...prev, materialUrls: prev.materialUrls.filter(u => u !== url) } : prev);
    };

    const handleSubmit = async () => {
        if (!form) return;
        setSubmitting(true);
        const { token, username } = getAuth();
        try {
            const res = await fetch(`/api/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token!.startsWith("Bearer ") ? token! : `Bearer ${token}`,
                    "X-User-Name": username || "anonymous",
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Gửi thất bại");
            setSuccess(form.orderId);
            setOrders(prev => prev.map(o => o.id === form.orderId ? { ...o, rated: true } : o));
            setSelectedOrder(null);
            setForm(null);
        } catch {
            alert("Gửi đánh giá thất bại, thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
        <div className={styles.starPicker}>
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button"
                        className={`${styles.star} ${s <= value ? styles.starActive : ""}`}
                        onClick={() => onChange(s)}>★</button>
            ))}
        </div>
    );

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
                        <div key={order.id}
                             className={styles.orderCard}
                             style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className={styles.orderCardHeader}>
                                <div className={styles.orderId}>Đơn #{order.id}</div>
                                <div className={styles.orderDate}>
                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : ""}
                                </div>
                                {order.rated || success === order.id ? (
                                    <span className={styles.ratedBadge}>✓ Đã đánh giá</span>
                                ) : (
                                    <button className={styles.rateBtn} onClick={() => openRating(order)}>
                                        ⭐ Đánh giá
                                    </button>
                                )}
                            </div>

                            <div className={styles.itemList}>
                                {order.items?.map((item, i) => (
                                    <div key={i} className={styles.item}>
                                        <img
                                            src={item.productImage || "https://ui-avatars.com/api/?name=P"}
                                            alt={item.productName}
                                            className={styles.itemImg}
                                        />
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

            {selectedOrder && form && (
                <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>⭐ Đánh giá đơn #{selectedOrder.id}</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>✕</button>
                        </div>

                        <div className={styles.modalItems}>
                            {selectedOrder.items?.slice(0, 2).map((item, i) => (
                                <div key={i} className={styles.modalItem}>
                                    <img src={item.productImage || "https://ui-avatars.com/api/?name=P"}
                                         alt={item.productName} className={styles.modalItemImg} />
                                    <span className={styles.modalItemName}>{item.productName}</span>
                                </div>
                            ))}
                            {(selectedOrder.items?.length || 0) > 2 && (
                                <span className={styles.moreItems}>+{(selectedOrder.items?.length || 0) - 2} sản phẩm khác</span>
                            )}
                        </div>

                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>Chất lượng sản phẩm</label>
                            <StarPicker value={form.stars} onChange={v => setForm({ ...form, stars: v })} />
                            <div className={styles.starLabel}>
                                {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"][form.stars]}
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>Nhận xét của bạn</label>
                            <textarea
                                className={styles.textarea}
                                value={form.comment}
                                onChange={e => setForm({ ...form, comment: e.target.value })}
                                placeholder="Hãy chia sẻ cảm nhận về sản phẩm..."
                                rows={4}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>Thêm ảnh (không bắt buộc)</label>
                            <div className={styles.imageUploadRow}>
                                {form.materialUrls.map(url => (
                                    <div key={url} className={styles.uploadedImg}>
                                        <img src={url} alt="review" />
                                        <button className={styles.removeImg} onClick={() => removeImage(url)}>✕</button>
                                    </div>
                                ))}
                                {form.materialUrls.length < 5 && (
                                    <label className={styles.uploadBox} htmlFor="review-img">
                                        {uploadingImg ? "⏳" : "+ Thêm ảnh"}
                                        <input id="review-img" type="file" accept="image/*"
                                               style={{ display: "none" }} onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setSelectedOrder(null)}>Hủy</button>
                            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}