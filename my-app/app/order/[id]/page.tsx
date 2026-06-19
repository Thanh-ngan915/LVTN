'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { getOrderById, OrderResponseDTO } from '../../services/orderService';
import styles from './orderDetail.module.css';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || isNaN(orderId)) {
      setError('Mã đơn hàng không hợp lệ');
      setLoading(false);
      return;
    }

    getOrderById(orderId)
      .then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          setError(res.message || 'Không tìm thấy đơn hàng');
        }
      })
      .catch((e) => {
        setError(e.message || 'Đã có lỗi xảy ra');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { label: '⏳ Chờ xác nhận', cls: styles.statusPending };
      case 'confirmed': return { label: '✅ Đã xác nhận', cls: styles.statusConfirmed };
      case 'shipping': return { label: '🚚 Đang giao', cls: styles.statusShipping };
      case 'delivered': return { label: '📦 Đã giao', cls: styles.statusDelivered };
      case 'completed': return { label: '✅ Hoàn thành', cls: styles.statusDelivered };
      case 'cancelled': return { label: '❌ Đã hủy', cls: styles.statusCancelled };
      case 'complained': return { label: '🚨 Đang khiếu nại', cls: styles.statusCancelled };
      case 'refunded': return { label: '💸 Đã hoàn tiền', cls: styles.statusCancelled };
      default: return { label: status, cls: '' };
    }
  };

  const getPaymentStatusInfo = (ps: string) => {
    if (ps === 'paid') {
      return { label: 'Đã thanh toán', className: styles.paymentStatusPaid };
    }
    return { label: 'Chờ thanh toán', className: styles.paymentStatusPending };
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Đặt hàng thành công', icon: '📝' },
      { key: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
      { key: 'shipping', label: 'Đang giao hàng', icon: '🚚' },
      { key: 'delivered', label: 'Đã giao hàng', icon: '📦' },
      { key: 'completed', label: 'Hoàn thành', icon: '✅' },
    ];
    const statusOrder = ['pending', 'confirmed', 'shipping', 'delivered', 'completed'];
    const currentIdx = statusOrder.indexOf(status);

    return steps.map((step, idx) => ({
      ...step,
      active: idx <= currentIdx,
    }));
  };

  // Loading
  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !order) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>😔</div>
          <h2 className={styles.errorTitle}>Không tìm thấy đơn hàng</h2>
          <p className={styles.errorMessage}>{error || 'Đơn hàng không tồn tại hoặc đã bị xóa.'}</p>
          <button className={styles.errorBackBtn} onClick={() => router.push('/')}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
  const timelineSteps = getTimelineSteps(order.status);
  const delivery = order.deliveryInformation;
  const voucher = order.voucherInfo;

  const subtotal = order.total;
  const discount = order.discount;
  const shippingFee = order.shippingFee ?? 0;
  const totalPay = order.pay;

  return (
    <div className={styles.page}>
      <Header />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <a href="/">Trang chủ</a>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Chi tiết đơn hàng #{order.id}</span>
      </div>

      {/* Order Header */}
      <div className={styles.orderHeader}>
        <div className={styles.orderHeaderCard}>
          <div className={styles.orderHeaderLeft}>
            <p className={styles.orderHeaderLabel}>Đơn hàng</p>
            <h1 className={styles.orderHeaderId}>#{order.id}</h1>
            <p className={styles.orderHeaderDate}>
              📅 {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
            </p>
          </div>
          <div className={styles.orderHeaderRight}>
            <div className={`${styles.statusBadge} ${statusInfo.className}`}>
              <span className={styles.statusDot} />
              {statusInfo.icon} {statusInfo.label}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.leftCol}>

          {/* SECTION 1: Delivery Address */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.sectionIcon} ${styles.sectionIconAddress}`}>📍</span>
              Địa chỉ nhận hàng
            </h2>
            {delivery ? (
              <div className={styles.addressCard}>
                <div className={styles.addressIcon}>📍</div>
                <div className={styles.addressInfo}>
                  <p className={styles.addressName}>
                    {delivery.recipientName}
                    {delivery.isDefault && (
                      <span className={styles.addressNameTag}>Mặc định</span>
                    )}
                  </p>
                  <p className={styles.addressPhone}>📞 {delivery.phone}</p>
                  <p className={styles.addressFull}>
                    {delivery.addressDetail}, {delivery.ward}, {delivery.district}, {delivery.province}
                  </p>
                </div>
              </div>
            ) : (
              <p className={styles.noVoucherText}>Không có thông tin địa chỉ</p>
            )}
          </section>

          {/* SECTION 2: Products */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.sectionIcon} ${styles.sectionIconProduct}`}>🛍️</span>
              Sản phẩm đã mua
            </h2>
            <div className={styles.productList}>
              {order.items.map((item, idx) => {
                const itemSubtotal = item.priceAfter * item.quantity;
                return (
                  <div className={styles.productItem} key={idx}>
                    <div className={styles.productImageWrap}>
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName || `Sản phẩm #${item.productId}`}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.productImagePlaceholder}>🖼️</div>
                      )}
                    </div>
                    <div className={styles.productDetails}>
                      <p className={styles.productName}>
                        {item.productName || `Sản phẩm #${item.productId}`}
                      </p>
                      {(item.color || item.size) && (
                        <div className={styles.productVariant}>
                          {item.color && (
                            <span className={styles.variantChip}>🎨 {item.color}</span>
                          )}
                          {item.size && (
                            <span className={styles.variantChip}>📏 {item.size}</span>
                          )}
                        </div>
                      )}
                      <div className={styles.productPricingRow}>
                        {item.priceBefore > item.priceAfter && (
                          <span className={styles.priceOld}>{formatPrice(item.priceBefore)}</span>
                        )}
                        <span className={styles.priceNew}>{formatPrice(item.priceAfter)}</span>
                      </div>
                    </div>
                    <div className={styles.productRight}>
                      <span className={styles.productQty}>
                        Số lượng: <span className={styles.productQtyValue}>x{item.quantity}</span>
                      </span>
                      <span className={styles.productSubtotal}>{formatPrice(itemSubtotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Voucher */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.sectionIcon} ${styles.sectionIconVoucher}`}>🎟️</span>
              Voucher của sàn
            </h2>
            {voucher ? (
              <div className={styles.voucherCard}>
                <div className={styles.voucherIconWrap}>🎫</div>
                <div className={styles.voucherDetails}>
                  <p className={styles.voucherName}>{voucher.name}</p>
                  <span className={styles.voucherCode}>{voucher.code}</span>
                  <p className={styles.voucherDesc}>
                    {voucher.discountType === 'PERCENT'
                      ? `Giảm ${voucher.discountValue}%${voucher.maxDiscount ? ` (tối đa ${formatPrice(voucher.maxDiscount)})` : ''}`
                      : `Giảm ${formatPrice(voucher.discountValue)}`}
                  </p>
                </div>
                <div className={styles.voucherSaveAmount}>
                  <span className={styles.voucherSaveLabel}>Đã tiết kiệm</span>
                  <span className={styles.voucherSaveValue}>-{formatPrice(discount)}</span>
                </div>
              </div>
            ) : (
              <p className={styles.noVoucherText}>Không sử dụng voucher</p>
            )}
          </section>

          {/* SECTION 4: Payment Method */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.sectionIcon} ${styles.sectionIconPayment}`}>💳</span>
              Phương thức thanh toán
            </h2>
            <div className={styles.paymentMethodCard}>
              <div
                className={`${styles.paymentMethodIcon} ${
                  order.paymentMethod === 'COD'
                    ? styles.paymentMethodIconCOD
                    : styles.paymentMethodIconVNPAY
                }`}
              >
                {order.paymentMethod === 'COD' ? '💵' : '🏦'}
              </div>
              <div className={styles.paymentMethodInfo}>
                <p className={styles.paymentMethodName}>
                  {order.paymentMethod === 'COD'
                    ? 'Thanh toán khi nhận hàng (COD)'
                    : 'Thanh toán qua VNPay'}
                </p>
                <p className={styles.paymentMethodDesc}>
                  {order.paymentMethod === 'COD'
                    ? 'Trả tiền mặt khi nhận hàng'
                    : 'ATM, QR Code, Thẻ ngân hàng'}
                </p>
              </div>
              <span className={`${styles.paymentStatusBadge} ${paymentStatusInfo.className}`}>
                {paymentStatusInfo.label}
              </span>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Payment Summary */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>
              📋 Chi tiết thanh toán
            </h2>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tạm tính</span>
                <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Voucher giảm giá</span>
                  <span className={`${styles.summaryValue} ${styles.discountValue}`}>
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Phí vận chuyển</span>
                <span
                  className={`${styles.summaryValue} ${shippingFee === 0 ? styles.freeShipValue : ''}`}
                >
                  {shippingFee === 0 ? '🎉 Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>

              <div className={styles.summaryDivider} />

              <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                <span className={styles.summaryTotalLabel}>Tổng thanh toán</span>
                <span className={styles.summaryTotalValue}>{formatPrice(totalPay)}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          {order.status !== 'cancelled' && (
            <div className={styles.timelineCard}>
              <h3 className={styles.timelineTitle}>📌 Trạng thái đơn hàng</h3>
              <div className={styles.timeline}>
                {timelineSteps.map((step) => (
                  <div className={styles.timelineItem} key={step.key}>
                    <div
                      className={`${styles.timelineDot} ${
                        step.active ? styles.timelineDotActive : styles.timelineDotInactive
                      }`}
                    >
                      {step.active ? '✓' : ''}
                    </div>
                    <div className={styles.timelineContent}>
                      <p
                        className={`${styles.timelineLabel} ${
                          !step.active ? styles.timelineLabelInactive : ''
                        }`}
                      >
                        {step.icon} {step.label}
                      </p>
                      {step.active && step.key === 'pending' && order.createdAt && (
                        <p className={styles.timelineDate}>{formatDate(order.createdAt)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actionsCard}>
            <button
              className={styles.actionBtnPrimary}
              onClick={() => router.push('/')}
              id="continue-shopping-btn"
            >
              🛒 Tiếp tục mua sắm
            </button>
            <button
              className={styles.actionBtnSecondary}
              onClick={() => router.back()}
              id="go-back-btn"
            >
              ← Quay lại
            </button>
            <p className={styles.secureNote}>🔒 Thông tin đơn hàng được bảo mật</p>
          </div>
        </div>
      </div>
    </div>
  );
}
