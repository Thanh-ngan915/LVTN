'use client';

import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero} id="hero-banner">
      <div className={styles.bgPattern}></div>
      <div className={styles.content}>
        <div className={styles.textArea}>
          <span className={styles.tagline}>✨ Bộ sưu tập mới 2026</span>
          <h1 className={styles.title}>
            Khám phá phong cách
            <br />
            <span className={styles.highlight}>thời trang của bạn</span>
          </h1>
          <p className={styles.subtitle}>
            Những sản phẩm thời trang chất lượng cao, phong cách đa dạng, giá cả hợp lý.
            Mua sắm ngay hôm nay!
          </p>
          <div className={styles.cta}>
            <a href="#products" className={styles.ctaPrimary}>
              Mua sắm ngay
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <a href="#" className={styles.ctaSecondary}>Xem khuyến mãi</a>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Sản phẩm</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Khách hàng</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9</span>
              <span className={styles.statLabel}>Đánh giá ★</span>
            </div>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.floatingCard} style={{ animationDelay: '0s' }}>
            <span>🛍️ Giảm 50%</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '1s' }}>
            <span>🔥 Hot Sale</span>
          </div>
          <div className={styles.floatingCard} style={{ animationDelay: '2s' }}>
            <span>✅ Miễn phí ship</span>
          </div>
          <div className={styles.heroCircle}></div>
          <div className={styles.heroCircle2}></div>
        </div>
      </div>
    </section>
  );
}
