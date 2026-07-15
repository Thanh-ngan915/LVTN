"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./orderdetail.module.css";
import StoreSidebar from "../../../components/StoreSidebar";

interface DeliveryInformationDTO {
    id?: number;
    recipientName?: string;
    phone?: string;
    province?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
}

interface ProductOrderItemDTO {
    id?: number;
    productId?: string;
    productName?: string;
    productImage?: string;
    quantity?: number;
    priceBefore?: number;
    priceAfter?: number;
    color?: string;
    size?: string;
}

interface OrderResponseDTO {
    id?: number;
    userId?: string;
    storeId?: string;
    total?: number;
    discount?: number;
    shopDiscount?: number;
    pay?: number;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    createdAt?: string;
    deliveryInformation?: DeliveryInformationDTO;
    items?: ProductOrderItemDTO[];
}

interface OrderFlowDTO {
    id?: string;
    orderId?: string;
    status?: string;
    note?: string;
    createdBy?: string;
    createdAt?: string;
}

interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
}

type ModalAction = "confirmed" | "cancelled" | "shipping";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const STATUS_LABEL: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    complained: "Đang khiếu nại",
    refunded: "Hoàn trả",
};

const PROGRESS_STEPS = [
    { key: "pending",   label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "shipping",  label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "completed", label: "Hoàn thành" },
];

function fmtVND(n?: number) {
    if (n == null) return "—";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
}

function fmtDatetime(s?: string) {
    if (!s) return "—";
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function initials(name?: string) {
    if (!name) return "?";
    return name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
}

function getUserId(): string {
    if (typeof window === "undefined") return "";
    try {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        return user.userId ?? "";
    } catch {
        return "";
    }
}

function progressIndex(status?: string): number {
    return PROGRESS_STEPS.findIndex((s) => s.key === status);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.orderId as string;

    const [order, setOrder] = useState<OrderResponseDTO | null>(null);
    const [flow, setFlow] = useState<OrderFlowDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState<ModalAction | null>(null);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const userId = getUserId();

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/seller/orders/${orderId}`, {
                headers: {
                    "X-User-Id": userId,
                    "Authorization": `Bearer ${token}`
                },
            });
            const json: ApiResponse<OrderResponseDTO> = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message ?? "Không thể tải đơn hàng");
            setOrder(json.data ?? null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    }, [orderId, userId]);

    const fetchFlow = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/seller/orders/${orderId}/flow`, {
                headers: {
                    "X-User-Id": userId,
                    "Authorization": `Bearer ${token ?? ""}`,
                },
            });
            const json: ApiResponse<OrderFlowDTO[]> = await res.json();
            if (res.ok && json.success) {
                setFlow(Array.isArray(json.data) ? json.data : []);
            }
        } catch {  }
    }, [orderId, userId]);

    useEffect(() => {
        if (orderId) { fetchOrder(); fetchFlow(); }
    }, [orderId, fetchOrder, fetchFlow]);

    async function handleUpdateStatus() {
        if (!modal || !order?.id) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/seller/orders/${order.id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-User-Id": userId },
                body: JSON.stringify({ status: modal, note }),
            });
            const json: ApiResponse<OrderResponseDTO> = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message ?? "Cập nhật thất bại");
            setOrder(json.data ?? null);
            fetchFlow();
            setModal(null);
            setNote("");
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : "Lỗi cập nhật trạng thái");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner} />
                <span>Đang tải chi tiết đơn hàng…</span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={styles.loadingScreen}>
                <p>Không tìm thấy đơn hàng.</p>
                <button className={styles.btnBack} onClick={() => router.push("/seller/orders")}>← Quay lại</button>
            </div>
        );
    }

    const isCancelled = order.status === "cancelled";
    const isRefunded  = order.status === "refunded";
    const currentStep = progressIndex(order.status);
    const delivery    = order.deliveryInformation;

    return (
        <div className={styles.page}>
            <StoreSidebar />
            <main className={styles.main}>
                <div className={styles.topbar}>
                    <div className={styles.titleGroup}>
                        <button className={styles.backBtn} onClick={() => router.push("/seller/orders")}>
                            ← Danh sách đơn hàng
                        </button>
                        <div className={styles.titleRow}>
                            <h1 className={styles.pageTitle}>Đơn #{order.id}</h1>
                            <span className={`${styles.statusBadge} ${styles[`status_${order.status}` as keyof typeof styles] ?? ""}`}>
                {STATUS_LABEL[order.status ?? ""] ?? order.status}
              </span>
                        </div>
                        <p className={styles.pageSubtitle}>Đặt lúc {fmtDatetime(order.createdAt)}</p>
                    </div>
                    <div className={styles.topActions}>
                        {order.status === "pending" && (
                            <>
                                <button className={styles.btnConfirmTop} onClick={() => setModal("confirmed")}>✓ Xác nhận đơn</button>
                                <button className={styles.btnRejectTop}  onClick={() => setModal("cancelled")}>✕ Từ chối</button>
                            </>
                        )}
                        {order.status === "confirmed" && (
                            <button className={styles.btnShipTop} onClick={() => setModal("shipping")}>🚚 Giao hàng</button>
                        )}
                    </div>
                </div>

                {error && <div className={styles.errorAlert}>⚠️ {error}</div>}

                {/* Progress tracker */}
                {!isCancelled && !isRefunded ? (
                    <div className={styles.progressCard}>
                        <div className={styles.progressSteps}>
                            {PROGRESS_STEPS.map((step, idx) => {
                                const isDone   = idx < currentStep;
                                const isActive = idx === currentStep;
                                return (
                                    <div key={step.key} className={styles.stepItem}>
                                        <div className={styles.stepLeft}>
                                            <div className={`${styles.stepDot} ${isDone ? styles.stepDone : isActive ? styles.stepActive : ""}`}>
                                                {isDone ? "✓" : idx + 1}
                                            </div>
                                            {idx < PROGRESS_STEPS.length - 1 && (
                                                <div className={`${styles.stepLine} ${isDone ? styles.stepLineDone : ""}`} />
                                            )}
                                        </div>
                                        <div className={styles.stepLabel}>
                      <span className={isActive ? styles.stepLabelActive : isDone ? styles.stepLabelDone : styles.stepLabelPending}>
                        {step.label}
                      </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className={styles.cancelledBanner}>
                        {isRefunded ? "↩️ Đơn hàng đã được hoàn trả" : "❌ Đơn hàng đã bị hủy"}
                    </div>
                )}

                <div className={styles.contentGrid}>
                    {/* Left */}
                    <div className={styles.leftCol}>
                        {/* Products */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Sản phẩm</h2>
                                <span className={styles.itemCountBadge}>{order.items?.length ?? 0} món</span>
                            </div>
                            <div className={styles.productList}>
                                {(order.items ?? []).map((item, i) => (
                                    <div key={item.id ?? i} className={styles.productRow}>
                                        <div className={styles.productImgWrap}>
                                            {item.productImage
                                                ? <img src={item.productImage} alt={item.productName} className={styles.productImg} />
                                                : <div className={styles.productImgPlaceholder}>📦</div>
                                            }
                                        </div>
                                        <div className={styles.productInfo}>
                                            <div className={styles.productName}>{item.productName ?? `Sản phẩm #${item.productId}`}</div>
                                            <div className={styles.productMeta}>
                                                {item.color && <span>{item.color}</span>}
                                                {item.color && item.size && <span className={styles.metaDot}>·</span>}
                                                {item.size && <span>{item.size}</span>}
                                            </div>
                                            <div className={styles.productQty}>x{item.quantity ?? 1}</div>
                                        </div>
                                        <div className={styles.productPriceCol}>
                                            {item.priceBefore != null && item.priceBefore !== item.priceAfter && (
                                                <div className={styles.priceOld}>{fmtVND(item.priceBefore)}</div>
                                            )}
                                            <div className={styles.priceNew}>{fmtVND(item.priceAfter)}</div>
                                            <div className={styles.priceTotal}>= {fmtVND((item.priceAfter ?? 0) * (item.quantity ?? 1))}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.pricingSummary}>
                                <div className={styles.pricingRow}>
                                    <span className={styles.pricingLabel}>Tạm tính</span>
                                    <span className={styles.pricingValue}>{fmtVND(order.total)}</span>
                                </div>
                                {(order.discount ?? 0) > 0 && (
                                    <div className={styles.pricingRow}>
                                        <span className={styles.pricingLabel}>Giảm giá sàn</span>
                                        <span className={styles.pricingDiscount}>-{fmtVND(order.discount)}</span>
                                    </div>
                                )}
                                {(order.shopDiscount ?? 0) > 0 && (
                                    <div className={styles.pricingRow}>
                                        <span className={styles.pricingLabel}>Giảm giá shop</span>
                                        <span className={styles.pricingDiscount}>-{fmtVND(order.shopDiscount)}</span>
                                    </div>
                                )}
                                <div className={`${styles.pricingRow} ${styles.pricingTotal}`}>
                                    <span>Tổng thanh toán</span>
                                    <span className={styles.pricingTotalValue}>{fmtVND(order.pay)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Flow */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Lịch sử trạng thái</h2>
                            </div>
                            {flow.length === 0 ? (
                                <p className={styles.emptyFlow}>Chưa có lịch sử thay đổi.</p>
                            ) : (
                                <div className={styles.flowList}>
                                    {flow.map((f, i) => (
                                        <div key={f.id ?? i} className={styles.flowItem}>
                                            <div className={styles.flowLeft}>
                                                <div className={`${styles.flowDot} ${i === 0 ? styles.flowDotActive : styles.flowDotDone}`} />
                                                {i < flow.length - 1 && <div className={styles.flowLine} />}
                                            </div>
                                            <div className={styles.flowContent}>
                                                <div className={styles.flowStatus}>
                          <span className={`${styles.statusBadge} ${styles[`status_${f.status}` as keyof typeof styles] ?? ""}`}>
                            {STATUS_LABEL[f.status ?? ""] ?? f.status}
                          </span>
                                                </div>
                                                {f.note && <p className={styles.flowNote}>{f.note}</p>}
                                                <div className={styles.flowMeta}>
                                                    <span className={styles.flowBy}>{f.createdBy ?? "Hệ thống"}</span> · {fmtDatetime(f.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right */}
                    <div className={styles.rightCol}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Khách hàng</h2>
                            </div>
                            <div className={styles.customerBlock}>
                                <div className={styles.avatar}>{initials(delivery?.recipientName)}</div>
                                <div>
                                    <div className={styles.customerName}>{delivery?.recipientName ?? "—"}</div>
                                    <div className={styles.customerPhone}>{delivery?.phone ?? "—"}</div>
                                    <div className={styles.customerId}>ID: {order.userId}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Địa chỉ giao hàng</h2>
                            </div>
                            <div className={styles.addressBlock}>
                                {delivery ? (
                                    <>
                                        <p className={styles.addressLine}>📍 {delivery.addressDetail}</p>
                                        <p className={styles.addressDetail}>
                                            {[delivery.ward, delivery.district, delivery.province].filter(Boolean).join(", ")}
                                        </p>
                                    </>
                                ) : (
                                    <p className={styles.addressDetail}>Không có thông tin địa chỉ</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Thanh toán</h2>
                            </div>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoKey}>Phương thức</span>
                                    <span className={styles.infoVal}>{order.paymentMethod ?? "COD"}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoKey}>Trạng thái</span>
                                    <span className={`${styles.payBadge} ${order.paymentStatus === "paid" ? styles.payPaid : styles.payPending}`}>
                    {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoKey}>Tổng đơn</span>
                                    <span className={styles.infoVal}>{fmtVND(order.total)}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoKey}>Khách trả</span>
                                    <span className={`${styles.infoVal} ${styles.pricingTotalValue}`}>{fmtVND(order.pay)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {modal && (
                <div className={styles.overlay} onClick={() => setModal(null)}>
                    <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.confirmIcon}>
                            {modal === "confirmed" ? "✅" : modal === "cancelled" ? "❌" : "🚚"}
                        </div>
                        <h3>
                            {modal === "confirmed" ? "Xác nhận đơn hàng"
                                : modal === "cancelled" ? "Từ chối đơn hàng"
                                    : "Giao cho vận chuyển"}
                        </h3>
                        <p>
                            {modal === "confirmed" ? `Xác nhận và chuẩn bị đơn #${order.id}?`
                                : modal === "cancelled" ? `Từ chối đơn #${order.id}? Hành động không thể hoàn tác.`
                                    : `Bàn giao đơn #${order.id} cho đơn vị vận chuyển?`}
                        </p>
                        <textarea
                            className={styles.noteInput}
                            rows={3}
                            placeholder="Ghi chú (tùy chọn)…"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className={styles.confirmActions}>
                            <button className={styles.btnCancel} onClick={() => { setModal(null); setNote(""); }}>Huỷ</button>
                            {modal === "cancelled" ? (
                                <button className={styles.btnDelete} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Từ chối đơn"}
                                </button>
                            ) : modal === "shipping" ? (
                                <button className={styles.btnShipModal} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Xác nhận giao"}
                                </button>
                            ) : (
                                <button className={styles.btnSave} disabled={submitting} onClick={handleUpdateStatus}>
                                    {submitting ? "Đang xử lý…" : "Xác nhận"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}