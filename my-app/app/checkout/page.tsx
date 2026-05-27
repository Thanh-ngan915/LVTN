'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Header';
import {
  createOrder,
  getVouchersByStore,
  VoucherDTO,
  OrderRequestDTO,
  OrderItemRequestDTO,
} from '../services/orderService';
import { getCart, removeMultipleFromCart, CartItemDTO } from '../services/cartService';
import styles from './checkout.module.css';

const SHIPPING_FEE = 30000;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Product info from URL params (Single item checkout)
  const productId = Number(searchParams.get('productId'));
  const productName = searchParams.get('productName') || '';
  const quantity = Number(searchParams.get('quantity')) || 1;
  const storeId = searchParams.get('storeId') || '';
  const priceBefore = Number(searchParams.get('priceBefore')) || 0;
  const priceAfter = Number(searchParams.get('priceAfter')) || 0;
  const image = searchParams.get('image') || '';
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';
  const variantId = Number(searchParams.get('variantId')) || undefined;

  // Cart checkout info
  const cartItemIdsStr = searchParams.get('cartItemIds');
  const cartItemIds = cartItemIdsStr ? cartItemIdsStr.split(',') : [];
  const isCartCheckout = cartItemIds.length > 0;
  const [checkoutItems, setCheckoutItems] = useState<CartItemDTO[]>([]);

  useEffect(() => {
    if (isCartCheckout) {
      getCart().then(res => {
        if (res.success) {
          const items = res.data.filter(item => cartItemIds.includes(item.id));
          setCheckoutItems(items);
        }
      }).catch(console.error);
    }
  }, [cartItemIdsStr]);

  const actualStoreId = isCartCheckout ? (checkoutItems.length > 0 ? checkoutItems[0].storeId : '') : storeId;

  // Delivery form
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Vouchers
  const [vouchers, setVouchers] = useState<VoucherDTO[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherDTO | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');

  // UI State
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ id: number; pay: number } | null>(null);

  // Load user info from localStorage
  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setRecipientName(user.fullName || user.username || '');
      setPhone(user.phone || '');
    } catch {}
  }, [router]);

  // Load vouchers
  useEffect(() => {
    if (!actualStoreId) return;
    getVouchersByStore(actualStoreId)
      .then((res) => {
        if (res.success) setVouchers(res.data || []);
      })
      .catch(() => {});
  }, [actualStoreId]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Calculate discount from voucher
  const calcDiscount = useCallback(
    (voucher: VoucherDTO | null, subtotal: number): number => {
      if (!voucher) return 0;
      if (subtotal < (voucher.minOrderValue || 0)) return 0;
      let discount = 0;
      if (voucher.discountType === 'PERCENT') {
        discount = subtotal * (voucher.discountValue / 100);
        if (voucher.maxDiscount != null) discount = Math.min(discount, voucher.maxDiscount);
      } else {
        discount = voucher.discountValue;
      }
      return Math.min(discount, subtotal);
    },
    []
  );

  const subtotal = isCartCheckout 
    ? checkoutItems.reduce((sum, item) => sum + (item.priceAfter || 0) * item.quantity, 0)
    : priceAfter * quantity;
  const discount = calcDiscount(selectedVoucher, subtotal);
  const shippingFee = subtotal >= 500000 ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shippingFee;

  const handleApplyVoucherCode = () => {
    const found = vouchers.find((v) => v.code.toLowerCase() === voucherCode.toLowerCase());
    if (!found) {
      showToast('❌ Mã voucher không hợp lệ hoặc đã hết hạn');
      return;
    }
    if (subtotal < (found.minOrderValue || 0)) {
      showToast(`❌ Đơn hàng tối thiểu ${formatPrice(found.minOrderValue)} để áp dụng voucher này`);
      return;
    }
    setSelectedVoucher(found);
    setShowVoucherModal(false);
    showToast(`✅ Áp dụng voucher "${found.name}" thành công!`);
  };

  const handleSelectVoucher = (v: VoucherDTO) => {
    if (subtotal < (v.minOrderValue || 0)) {
      showToast(`❌ Cần đơn tối thiểu ${formatPrice(v.minOrderValue)} để dùng voucher này`);
      return;
    }
    setSelectedVoucher(v);
    setShowVoucherModal(false);
    showToast(`✅ Đã chọn voucher "${v.name}"`);
  };

  const validate = () => {
    if (!recipientName.trim()) { showToast('⚠️ Vui lòng nhập tên người nhận'); return false; }
    if (!phone.trim()) { showToast('⚠️ Vui lòng nhập số điện thoại'); return false; }
    if (!province.trim()) { showToast('⚠️ Vui lòng nhập tỉnh/thành phố'); return false; }
    if (!district.trim()) { showToast('⚠️ Vui lòng nhập quận/huyện'); return false; }
    if (!ward.trim()) { showToast('⚠️ Vui lòng nhập phường/xã'); return false; }
    if (!addressDetail.trim()) { showToast('⚠️ Vui lòng nhập địa chỉ chi tiết'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      const request: OrderRequestDTO = {
        productId: isCartCheckout && checkoutItems.length > 0 ? Number(checkoutItems[0].productId) : productId,
        variantId,
        quantity: isCartCheckout && checkoutItems.length > 0 ? checkoutItems[0].quantity : quantity,
        storeId: actualStoreId,
        productPriceBefore: isCartCheckout && checkoutItems.length > 0 ? checkoutItems[0].priceBefore : priceBefore,
        productPriceAfter: isCartCheckout && checkoutItems.length > 0 ? checkoutItems[0].priceAfter : priceAfter,
        voucherId: selectedVoucher?.id ?? null,
        paymentMethod,
        productName: isCartCheckout && checkoutItems.length > 0 ? checkoutItems[0].productName : (productName || undefined),
        productImage: isCartCheckout && checkoutItems.length > 0 ? (checkoutItems[0].productImage || undefined) : (image || undefined),
        color: color || undefined,
        size: size || undefined,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        province: province.trim(),
        district: district.trim(),
        ward: ward.trim(),
        addressDetail: addressDetail.trim(),
        items: isCartCheckout ? checkoutItems.map(item => ({
          productId: Number(item.productId),
          quantity: item.quantity,
          productPriceBefore: item.priceBefore,
          productPriceAfter: item.priceAfter,
          productName: item.productName,
          productImage: item.productImage || undefined,
        })) : undefined
      };
      const res = await createOrder(request);
      if (res.success) {
        if (isCartCheckout) {
          try {
            await removeMultipleFromCart(cartItemIds);
          } catch (e) {
            console.error('Failed to remove items from cart after checkout', e);
          }
        }
        if (paymentMethod === 'VNPAY') {
          // Gọi API tạo URL thanh toán VNPay thực tế
          showToast('🏦 Đang chuyển đến cổng thanh toán VNPay...');
          try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
            const vnpayRes = await fetch('/api/orders/vnpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                orderId: res.data.id,
                amount: Math.round(res.data.pay),
              }),
            });
            const vnpayData = await vnpayRes.json();
            if (vnpayData.success && vnpayData.data?.paymentUrl) {
              // Redirect đến cổng thanh toán VNPay
              window.location.href = vnpayData.data.paymentUrl;
              return;
            } else {
              showToast(`❌ Lỗi tạo thanh toán VNPay: ${vnpayData.message || 'Không rõ lỗi'}`);
            }
          } catch (vnpayError: any) {
            showToast(`❌ Lỗi kết nối VNPay: ${vnpayError.message}`);
          }
        } else {
          // COD - hiển thị thành công ngay
          setOrderSuccess({ id: res.data.id, pay: res.data.pay });
        }
      }
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Đặt hàng thất bại'}`);
    } finally {
      setPlacing(false);
    }
  };


  // Success screen
  if (orderSuccess) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
            <p className={styles.successSub}>
              Mã đơn hàng: <strong>#{orderSuccess.id}</strong>
            </p>
            <p className={styles.successAmount}>
              Tổng thanh toán: <span>{formatPrice(orderSuccess.pay)}</span>
            </p>
            {paymentMethod === 'COD' && (
              <p className={styles.successNote}>
                💵 Thanh toán khi nhận hàng (COD). Cảm ơn bạn đã mua hàng!
              </p>
            )}
            {paymentMethod === 'VNPAY' && (
              <p className={styles.successNote}>
                🏦 Thanh toán qua VNPay. Đơn hàng đang chờ xác nhận thanh toán.
              </p>
            )}
            <div className={styles.successActions}>
              <button className={styles.successBtnPrimary} onClick={() => router.push('/')}>
                Tiếp tục mua sắm
              </button>
              <button className={styles.successBtnSecondary} onClick={() => router.push(`/order/${orderSuccess.id}`)}>
                Xem đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <a href="/">Trang chủ</a>
        <span className={styles.sep}>›</span>
        <a href={`/product/${productId}`}>Sản phẩm</a>
        <span className={styles.sep}>›</span>
        <span>Thanh toán</span>
      </div>

      <div className={styles.container}>
        {/* Left Column */}
        <div className={styles.leftCol}>

          {/* === SECTION 1: SẢN PHẨM === */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🛍️</span>
              Sản phẩm đặt mua
            </h2>
            {isCartCheckout ? (
              checkoutItems.map(item => (
                <div key={item.id} className={styles.productRow}>
                  <div className={styles.productImageWrap}>
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className={styles.productImage} />
                    ) : (
                      <div className={styles.productImagePlaceholder}>🖼️</div>
                    )}
                  </div>
                  <div className={styles.productMeta}>
                    <p className={styles.productName}>{item.productName}</p>
                    {item.categoryName && (
                      <p className={styles.productVariant}>
                        <span>{item.categoryName}</span>
                      </p>
                    )}
                    <div className={styles.productPricing}>
                      {item.priceBefore > item.priceAfter && (
                        <span className={styles.oldPrice}>{formatPrice(item.priceBefore)}</span>
                      )}
                      <span className={styles.newPrice}>{formatPrice(item.priceAfter)}</span>
                    </div>
                  </div>
                  <div className={styles.productQty}>
                    <span className={styles.qtyLabel}>Số lượng</span>
                    <span className={styles.qtyValue}>x{item.quantity}</span>
                  </div>
                  <div className={styles.productTotal}>
                    <span className={styles.totalLabel}>Thành tiền</span>
                    <span className={styles.totalValue}>{formatPrice(item.priceAfter * item.quantity)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.productRow}>
                <div className={styles.productImageWrap}>
                  {image ? (
                    <img src={image} alt={productName} className={styles.productImage} />
                  ) : (
                    <div className={styles.productImagePlaceholder}>🖼️</div>
                  )}
                </div>
                <div className={styles.productMeta}>
                  <p className={styles.productName}>{productName}</p>
                  {(color || size) && (
                    <p className={styles.productVariant}>
                      {color && <span>Màu: {color}</span>}
                      {color && size && <span className={styles.variantDot}>•</span>}
                      {size && <span>Size: {size}</span>}
                    </p>
                  )}
                  <div className={styles.productPricing}>
                    {priceBefore > priceAfter && (
                      <span className={styles.oldPrice}>{formatPrice(priceBefore)}</span>
                    )}
                    <span className={styles.newPrice}>{formatPrice(priceAfter)}</span>
                  </div>
                </div>
                <div className={styles.productQty}>
                  <span className={styles.qtyLabel}>Số lượng</span>
                  <span className={styles.qtyValue}>x{quantity}</span>
                </div>
                <div className={styles.productTotal}>
                  <span className={styles.totalLabel}>Thành tiền</span>
                  <span className={styles.totalValue}>{formatPrice(subtotal)}</span>
                </div>
              </div>
            )}
          </section>

          {/* === SECTION 2: ĐỊA CHỈ GIAO HÀNG === */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📍</span>
              Địa chỉ giao hàng
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Họ tên người nhận *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  id="checkout-recipient-name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số điện thoại *</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  id="checkout-phone"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tỉnh / Thành phố *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="TP. Hồ Chí Minh"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  id="checkout-province"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Quận / Huyện *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Quận 1"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  id="checkout-district"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phường / Xã *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Phường Bến Nghé"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  id="checkout-ward"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Địa chỉ chi tiết *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Số nhà, tên đường..."
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  id="checkout-address"
                />
              </div>
            </div>
          </section>

          {/* === SECTION 3: VOUCHER === */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🎟️</span>
              Voucher của sàn
            </h2>
            {selectedVoucher ? (
              <div className={styles.voucherSelected}>
                <div className={styles.voucherSelectedInfo}>
                  <span className={styles.voucherTag}>🏷️ {selectedVoucher.name}</span>
                  <span className={styles.voucherSave}>
                    Tiết kiệm {formatPrice(calcDiscount(selectedVoucher, subtotal))}
                  </span>
                </div>
                <button
                  className={styles.voucherChangeBtn}
                  onClick={() => setSelectedVoucher(null)}
                  id="remove-voucher-btn"
                >
                  Bỏ chọn
                </button>
              </div>
            ) : (
              <div className={styles.voucherInputRow}>
                <input
                  className={styles.voucherInput}
                  type="text"
                  placeholder="Nhập mã voucher..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  id="voucher-code-input"
                />
                <button
                  className={styles.voucherApplyBtn}
                  onClick={handleApplyVoucherCode}
                  id="apply-voucher-btn"
                >
                  Áp dụng
                </button>
                {vouchers.length > 0 && (
                  <button
                    className={styles.voucherListBtn}
                    onClick={() => setShowVoucherModal(true)}
                    id="select-voucher-btn"
                  >
                    Chọn voucher
                  </button>
                )}
              </div>
            )}
          </section>

          {/* === SECTION 4: PHƯƠNG THỨC THANH TOÁN === */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💳</span>
              Phương thức thanh toán
            </h2>
            <div className={styles.paymentOptions}>
              <label
                className={`${styles.paymentOption} ${paymentMethod === 'COD' ? styles.paymentActive : ''}`}
                id="payment-cod"
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className={styles.radioInput}
                />
                <span className={styles.paymentIcon}>💵</span>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentName}>Thanh toán khi nhận hàng (COD)</span>
                  <span className={styles.paymentDesc}>Trả tiền mặt khi nhận hàng</span>
                </div>
              </label>

              <label
                className={`${styles.paymentOption} ${paymentMethod === 'VNPAY' ? styles.paymentActive : ''}`}
                id="payment-vnpay"
              >
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className={styles.radioInput}
                />
                <span className={styles.paymentIcon}>🏦</span>
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentName}>Thanh toán qua VNPay</span>
                  <span className={styles.paymentDesc}>ATM, QR Code, Thẻ ngân hàng</span>
                </div>
                <div className={styles.vnpayBadge}>VNPay</div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Chi tiết thanh toán</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tạm tính</span>
                <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Voucher giảm giá</span>
                  <span className={`${styles.summaryValue} ${styles.discountVal}`}>
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Phí vận chuyển</span>
                <span className={`${styles.summaryValue} ${shippingFee === 0 ? styles.freeShip : ''}`}>
                  {shippingFee === 0 ? '🎉 Miễn phí' : formatPrice(shippingFee)}
                </span>
              </div>

              <div className={styles.summaryDivider} />

              <div className={`${styles.summaryRow} ${styles.summaryTotalRow}`}>
                <span className={styles.summaryTotalLabel}>Tổng thanh toán</span>
                <span className={styles.summaryTotalValue}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className={styles.paymentBadge}>
              {paymentMethod === 'COD' ? '💵 Thanh toán COD' : '🏦 Thanh toán VNPay'}
            </div>

            <button
              className={styles.placeOrderBtn}
              onClick={handlePlaceOrder}
              disabled={placing}
              id="place-order-btn"
            >
              {placing ? (
                <span className={styles.placingSpinner}>Đang xử lý...</span>
              ) : (
                <>
                  <span>🛒</span>
                  <span>Đặt hàng ngay</span>
                </>
              )}
            </button>

            <p className={styles.secureNote}>
              🔒 Thông tin của bạn được bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className={styles.modalOverlay} onClick={() => setShowVoucherModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>🎟️ Chọn voucher của shop</h3>
              <button className={styles.modalClose} onClick={() => setShowVoucherModal(false)}>✕</button>
            </div>
            <div className={styles.voucherList}>
              {vouchers.length === 0 ? (
                <p className={styles.noVoucher}>Không có voucher nào khả dụng</p>
              ) : (
                vouchers.map((v) => {
                  const saveable = calcDiscount(v, subtotal);
                  const canApply = subtotal >= (v.minOrderValue || 0);
                  return (
                    <div
                      key={v.id}
                      className={`${styles.voucherCard} ${!canApply ? styles.voucherDisabled : ''}`}
                      onClick={() => canApply && handleSelectVoucher(v)}
                    >
                      <div className={styles.voucherLeft}>
                        <span className={styles.voucherCode}>{v.code}</span>
                        <span className={styles.voucherName}>{v.name}</span>
                        {v.discountType === 'PERCENT' ? (
                          <span className={styles.voucherDiscount}>Giảm {v.discountValue}%</span>
                        ) : (
                          <span className={styles.voucherDiscount}>Giảm {formatPrice(v.discountValue)}</span>
                        )}
                        {v.minOrderValue > 0 && (
                          <span className={styles.voucherMin}>Đơn tối thiểu {formatPrice(v.minOrderValue)}</span>
                        )}
                      </div>
                      <div className={styles.voucherRight}>
                        {canApply ? (
                          <span className={styles.voucherSaveAmt}>Tiết kiệm {formatPrice(saveable)}</span>
                        ) : (
                          <span className={styles.voucherLocked}>Chưa đủ điều kiện</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={styles.toast} id="checkout-toast">
          <div className={styles.toastContent}>{toast}</div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontSize: 18 }}>
        Đang tải...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
