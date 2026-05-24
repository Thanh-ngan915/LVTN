'use client';

import { useState, useEffect } from 'react';
import { getAllVouchers, VoucherDTO } from '../services/orderService';
import styles from './PromotionsHome.module.css';

export default function PromotionsHome() {
  const [vouchers, setVouchers] = useState<VoucherDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    getAllVouchers()
      .then((res) => {
        if (res.success) {
          // Limit to active and valid vouchers
          setVouchers(res.data || []);
        }
      })
      .catch((err) => console.error('Failed to fetch home promotions:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <span className={styles.titleIcon}>🎟️</span>
            <h2 className={styles.title}>Khuyến Mãi Hot</h2>
          </div>
        </div>
        <div className={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return null; // Don't show the section if no vouchers are available
  }

  return (
    <div className={styles.section} id="home-promotions">
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.titleIcon}>🎟️</span>
          <div>
            <h2 className={styles.title}>Mã Giảm Giá Toàn Sàn</h2>
            <p className={styles.subtitle}>Nhận ngay mã giảm giá cực hot để mua sắm tiết kiệm hơn</p>
          </div>
        </div>
        <a href="/promotions" className={styles.viewAll}>
          Xem tất cả ({vouchers.length}) <span>→</span>
        </a>
      </div>

      <div className={styles.grid}>
        {vouchers.slice(0, 3).map((v) => {
          const isPercent = v.discountType === 'PERCENT';
          const discountLabel = isPercent 
            ? `${v.discountValue}%` 
            : formatPrice(v.discountValue).replace(/\s?₫/, 'k'); // shorthand like 50k
          
          return (
            <div key={v.id} className={styles.voucherCard} id={`home-voucher-${v.id}`}>
              {/* Left Side: Ticket Stub */}
              <div className={`${styles.stub} ${isPercent ? styles.stubPercent : styles.stubFixed}`}>
                <div className={styles.stubInner}>
                  <span className={styles.stubIcon}>{isPercent ? '🏷️' : '💰'}</span>
                  <span className={styles.stubType}>{isPercent ? 'Giảm %' : 'Giảm Tiền'}</span>
                </div>
                {/* Curved ticket notches */}
                <div className={styles.notchTop} />
                <div className={styles.notchBottom} />
              </div>

              {/* Right Side: Ticket Details */}
              <div className={styles.content}>
                <div className={styles.info}>
                  <h3 className={styles.discountTitle}>
                    Giảm {isPercent ? `${v.discountValue}%` : formatPrice(v.discountValue)}
                  </h3>
                  <p className={styles.minOrder}>
                    Đơn tối thiểu {formatPrice(v.minOrderValue)}
                  </p>
                  {v.maxDiscount && isPercent && (
                    <p className={styles.maxDiscount}>
                      Tối đa {formatPrice(v.maxDiscount)}
                    </p>
                  )}
                  <p className={styles.codeText}>
                    Mã: <span>{v.code}</span>
                  </p>
                </div>
                
                <div className={styles.action}>
                  <button 
                    className={`${styles.copyBtn} ${copiedCode === v.code ? styles.copied : ''}`}
                    onClick={() => handleCopy(v.code)}
                    id={`home-copy-${v.id}`}
                  >
                    {copiedCode === v.code ? 'Đã Lưu!' : 'Sao Chép'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
