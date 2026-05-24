'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getAllVouchers, VoucherDTO } from '../services/orderService';
import styles from './promotions.module.css';

export default function PromotionsPage() {
  const [vouchers, setVouchers] = useState<VoucherDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'percent' | 'fixed'>('all');

  useEffect(() => {
    getAllVouchers()
      .then((res) => {
        if (res.success) setVouchers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Không giới hạn';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDiscountLabel = (v: VoucherDTO) => {
    if (v.discountType === 'PERCENT') {
      return `Giảm ${v.discountValue}%${v.maxDiscount ? ` (tối đa ${formatPrice(v.maxDiscount)})` : ''}`;
    }
    return `Giảm ${formatPrice(v.discountValue)}`;
  };

  const getVoucherIcon = (v: VoucherDTO) => {
    if (v.discountType === 'PERCENT') return '🏷️';
    return '💰';
  };

  const getVoucherColor = (v: VoucherDTO, idx: number) => {
    const colors = ['purple', 'orange', 'teal', 'pink', 'blue'];
    if (v.discountType === 'FIXED') return 'teal';
    return colors[idx % colors.length];
  };

  const getRemainingDays = (endDate: string | null) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filtered = vouchers.filter((v) => {
    if (filter === 'percent') return v.discountType === 'PERCENT';
    if (filter === 'fixed') return v.discountType === 'FIXED';
    return true;
  });

  return (
    <div className={styles.page}>
      <Header onSearch={() => {}} />

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>✦ ANVI SHOP</div>
          <h1 className={styles.heroTitle}>Kho Khuyến Mãi</h1>
          <p className={styles.heroSubtitle}>
            Săn ngay những mã giảm giá độc quyền, tiết kiệm lên đến hàng trăm nghìn đồng mỗi đơn hàng
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>{vouchers.length}</span>
              <span className={styles.heroStatLabel}>Voucher hiện có</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {vouchers.filter((v) => v.discountType === 'PERCENT').length}
              </span>
              <span className={styles.heroStatLabel}>Giảm theo %</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>
                {vouchers.filter((v) => v.discountType === 'FIXED').length}
              </span>
              <span className={styles.heroStatLabel}>Giảm cố định</span>
            </div>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.floatingTag}>🏷️ -20%</div>
          <div className={styles.floatingTag2}>💳 FREE</div>
          <div className={styles.floatingTag3}>🎁 SALE</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.container}>
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
            onClick={() => setFilter('all')}
          >
            🎟️ Tất cả ({vouchers.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'percent' ? styles.filterActive : ''}`}
            onClick={() => setFilter('percent')}
          >
            📉 Giảm % ({vouchers.filter((v) => v.discountType === 'PERCENT').length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'fixed' ? styles.filterActive : ''}`}
            onClick={() => setFilter('fixed')}
          >
            💰 Giảm cố định ({vouchers.filter((v) => v.discountType === 'FIXED').length})
          </button>
        </div>

        {/* Voucher Grid */}
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎫</span>
            <p>Chưa có voucher nào hiển thị</p>
          </div>
        ) : (
          <div className={styles.voucherGrid}>
            {filtered.map((v, idx) => {
              const remaining = getRemainingDays(v.endDate);
              const colorClass = getVoucherColor(v, idx);
              const isExpiringSoon = remaining !== null && remaining <= 3;
              const usedPercent =
                v.quantity ? Math.min(100, Math.round((v.usedCount / v.quantity) * 100)) : 0;

              return (
                <div
                  key={v.id}
                  className={`${styles.voucherCard} ${styles[`color_${colorClass}`]}`}
                  id={`voucher-${v.id}`}
                >
                  {/* Left accent strip */}
                  <div className={styles.cardStrip} />

                  {/* Expiry badge */}
                  {isExpiringSoon && (
                    <div className={styles.expirySoon}>⏰ Còn {remaining} ngày</div>
                  )}

                  {/* Top section */}
                  <div className={styles.cardTop}>
                    <div className={styles.iconCircle}>{getVoucherIcon(v)}</div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.voucherName}>{v.name || v.code}</h3>
                      <p className={styles.discountLabel}>{getDiscountLabel(v)}</p>
                    </div>
                  </div>

                  {/* Divider with notch */}
                  <div className={styles.dividerRow}>
                    <div className={styles.notchLeft} />
                    <div className={styles.dashedLine} />
                    <div className={styles.notchRight} />
                  </div>

                  {/* Details */}
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Mã code</span>
                      <strong className={styles.detailValue}>{v.code}</strong>
                    </div>
                    {v.minOrderValue > 0 && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Đơn tối thiểu</span>
                        <strong className={styles.detailValue}>{formatPrice(v.minOrderValue)}</strong>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Hết hạn</span>
                      <strong className={styles.detailValue}>{formatDate(v.endDate)}</strong>
                    </div>
                    {v.quantity && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Còn lại</span>
                        <strong className={styles.detailValue}>
                          {v.quantity - v.usedCount}/{v.quantity}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Usage progress bar */}
                  {v.quantity && (
                    <div className={styles.usageBar}>
                      <div
                        className={styles.usageFill}
                        style={{ width: `${usedPercent}%` }}
                      />
                      <span className={styles.usageText}>
                        {usedPercent >= 80 ? '🔥 Sắp hết!' : `Đã dùng ${usedPercent}%`}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {v.description && (
                    <p className={styles.description}>{v.description}</p>
                  )}

                  {/* Copy button */}
                  <button
                    className={`${styles.copyBtn} ${copied === v.code ? styles.copyBtnSuccess : ''}`}
                    onClick={() => handleCopy(v.code)}
                    id={`copy-btn-${v.id}`}
                  >
                    {copied === v.code ? (
                      <>✓ Đã sao chép!</>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Sao chép mã
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* How to use section */}
        <div className={styles.howToUse}>
          <h2 className={styles.howToTitle}>📌 Cách sử dụng voucher</h2>
          <div className={styles.steps}>
            {[
              { num: '01', icon: '🛍️', title: 'Chọn sản phẩm', desc: 'Thêm sản phẩm yêu thích vào giỏ hàng' },
              { num: '02', icon: '📋', title: 'Sao chép mã', desc: 'Bấm nút "Sao chép mã" ở voucher phù hợp' },
              { num: '03', icon: '💳', title: 'Áp dụng khi thanh toán', desc: 'Dán mã vào ô Voucher ở trang Thanh Toán' },
              { num: '04', icon: '🎉', title: 'Tiết kiệm ngay!', desc: 'Tận hưởng ưu đãi và nhận hàng nhanh chóng' },
            ].map((step) => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2026 ANVI Shop · Các voucher có thể thay đổi mà không cần báo trước</p>
      </footer>
    </div>
  );
}
