'use client';

import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header} id="site-header">
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span>🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
          <div className={styles.topBarLinks}>
            <a href="/login">Đăng nhập</a>
            <span className={styles.divider}>|</span>
            <a href="/register">Đăng ký</a>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainInner}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>ANVI</span>
            <span className={styles.logoSub}>SHOP</span>
          </a>

          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              id="search-input"
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.iconBtn} aria-label="Wishlist" id="wishlist-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Cart" id="cart-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span className={styles.cartBadge}>0</span>
            </button>
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`} id="main-nav">
        <div className={styles.navInner}>
          <a href="/" className={styles.navLink}>Trang chủ</a>
          <a href="#" className={styles.navLink}>Sản phẩm</a>
          <a href="#" className={styles.navLink}>Khuyến mãi</a>
          <a href="#" className={styles.navLink}>Bộ sưu tập</a>
          <a href="/livestream" className={styles.navLinkLive}>
            <span className={styles.liveDot}></span>
            Live Stream
          </a>
          <a href="#" className={styles.navLink}>Liên hệ</a>
        </div>
      </nav>
    </header>
  );
}
