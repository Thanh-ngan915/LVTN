'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { CartItemDTO, getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';
import styles from './cart.module.css';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCart();
      if (res.success) {
        setCartItems(res.data || []);
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleUpdateQuantity = async (item: CartItemDTO, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(item.id);
    try {
      await updateCartItem(item.id, newQuantity);
      setCartItems(prev =>
        prev.map(ci => ci.id === item.id ? { ...ci, quantity: newQuantity } : ci)
      );
      setCartUpdateTrigger(prev => prev + 1);
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Lỗi cập nhật'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      setCartItems(prev => prev.filter(ci => ci.id !== itemId));
      setCartUpdateTrigger(prev => prev + 1);
      showToast('🗑️ Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Lỗi xóa sản phẩm'}`);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
    try {
      await clearCart();
      setCartItems([]);
      setCartUpdateTrigger(prev => prev + 1);
      showToast('🗑️ Đã xóa toàn bộ giỏ hàng');
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Lỗi xóa giỏ hàng'}`);
    }
  };

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.priceAfter || 0) * item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.priceBefore || 0) * item.quantity, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  // Check login
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('user');

  if (loading) {
    return (
      <div className={styles.page}>
        <Header cartUpdateTrigger={cartUpdateTrigger} />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span>Đang tải giỏ hàng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header cartUpdateTrigger={cartUpdateTrigger} />

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/">Trang chủ</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span>Giỏ hàng</span>
        </div>

        <h1 className={styles.pageTitle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Giỏ hàng của bạn
          {cartItems.length > 0 && (
            <span className={styles.itemCount}>({totalItems} sản phẩm)</span>
          )}
        </h1>

        {!isLoggedIn ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem giỏ hàng</p>
            <a href="/login" className={styles.continueBtn}>Đăng nhập ngay</a>
          </div>
        ) : cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm yêu thích vào giỏ hàng!</p>
            <a href="/" className={styles.continueBtn}>Tiếp tục mua sắm</a>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              {/* Header Row */}
              <div className={styles.cartHeader}>
                <span className={styles.colProduct}>Sản phẩm</span>
                <span className={styles.colPrice}>Đơn giá</span>
                <span className={styles.colQuantity}>Số lượng</span>
                <span className={styles.colTotal}>Thành tiền</span>
                <span className={styles.colAction}>Thao tác</span>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className={styles.cartItem} id={`cart-item-${item.id}`}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} />
                      ) : (
                        <div className={styles.noImage}>🖼️</div>
                      )}
                    </div>
                    <div className={styles.productDetails}>
                      <a href={`/product/${item.productId}`} className={styles.productName}>
                        {item.productName || `Sản phẩm #${item.productId}`}
                      </a>
                      {item.categoryName && (
                        <span className={styles.productCategory}>{item.categoryName}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.priceCol}>
                    {item.priceBefore && item.priceBefore > item.priceAfter && (
                      <span className={styles.oldPrice}>{formatPrice(item.priceBefore)}</span>
                    )}
                    <span className={styles.currentPrice}>{formatPrice(item.priceAfter || 0)}</span>
                  </div>

                  <div className={styles.quantityCol}>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item.id}
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        disabled={updatingId === item.id}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.totalCol}>
                    <span className={styles.itemTotal}>
                      {formatPrice((item.priceAfter || 0) * item.quantity)}
                    </span>
                  </div>

                  <div className={styles.actionCol}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleRemoveItem(item.id)}
                      title="Xóa"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}

              <div className={styles.cartFooter}>
                <button className={styles.clearCartBtn} onClick={handleClearCart}>
                  🗑️ Xóa tất cả
                </button>
                <a href="/" className={styles.continueShoppingBtn}>
                  ← Tiếp tục mua sắm
                </a>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>

              <div className={styles.summaryRow}>
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{formatPrice(totalOriginalPrice)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Giảm giá</span>
                  <span className={styles.discountAmount}>-{formatPrice(totalDiscount)}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Phí vận chuyển</span>
                <span className={styles.freeShip}>
                  {totalPrice >= 500000 ? 'Miễn phí' : formatPrice(30000)}
                </span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Tổng cộng</span>
                <span className={styles.totalAmount}>
                  {formatPrice(totalPrice + (totalPrice >= 500000 ? 0 : 30000))}
                </span>
              </div>

              <button className={styles.checkoutBtn} id="checkout-btn">
                Đặt hàng ({totalItems})
              </button>

              <div className={styles.secureNote}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Thanh toán an toàn & bảo mật
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>
          <div className={styles.toastContent}>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
