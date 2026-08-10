'use client';

import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { getCartCount } from '../services/cartService';
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
interface HeaderProps {
  onSearch?: (keyword: string) => void;
  cartUpdateTrigger?: number; // Increment this to trigger cart count refresh
}

import { Suspense } from 'react';

function HeaderInner({ onSearch, cartUpdateTrigger }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState('vi');

  // Read localStorage only on client after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const match = document.cookie.match(/googtrans=\/vi\/([a-z]{2})/);
      if (match) {
        setActiveLang(match[1]);
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUsername(user.fullName || user.username || user.email || 'Tài khoản');
      }
    } catch {
      // ignore
    }
  }, []);

  const switchLanguage = (lang: string) => {
    document.cookie = `googtrans=/vi/${lang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/vi/${lang}; path=/`;
    window.location.reload();
  };

  const handleLogout = () => {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUsername(null);
      window.location.href = '/login';
  };

  // Load cart count
  useEffect(() => {
    getCartCount().then(setCartCount).catch(() => setCartCount(0));
  }, [cartUpdateTrigger]);

  // Sync search input with URL
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('search');
      if (q !== null) {
        setSearchQuery(q);
      } else {
        setSearchQuery('');
      }
    }
  }, [searchParams]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (onSearch) {
      onSearch(query);
    } else {
      if (query) {
        router.push(`/?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    } else {
      router.push(`/`);
    }
  };

  return (
    <header className={styles.header} id="site-header">
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span>🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
            <div className={styles.topBarLinks}>
                {mounted && (
                    <div style={{display: 'inline-flex', gap: '8px', alignItems: 'center', cursor: 'pointer', marginRight: '15px'}} className="notranslate">
                        <span 
                            style={{ fontWeight: activeLang === 'vi' ? 'bold' : 'normal', color: activeLang === 'vi' ? 'inherit' : '#888' }}
                            onClick={() => switchLanguage('vi')}
                        >VI</span>
                        <span style={{color: '#ddd'}}>|</span>
                        <span 
                            style={{ fontWeight: activeLang === 'en' ? 'bold' : 'normal', color: activeLang === 'en' ? 'inherit' : '#888' }}
                            onClick={() => switchLanguage('en')}
                        >EN</span>
                    </div>
                )}
                {mounted && username ? (
                    <>
                        <Link href="/profile">👤 {username}</Link>
                        <span className={styles.divider}>|</span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login">Đăng nhập</Link>
                        <span className={styles.divider}>|</span>
                        <Link href="/register">Đăng ký</Link>
                    </>
                )}
            </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>ANVI</span>
            <span className={styles.logoSub}>SHOP</span>
          </Link>

          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
              id="search-input"
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search" id="search-clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
            <button className={styles.searchBtn} onClick={handleSearch} aria-label="Search" id="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          <div className={styles.actions}>
              <Link href="/chatbot" className={styles.iconBtn} aria-label="Trò chuyện với AI" id="chatbot-btn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {/* Phần đầu robot */}
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      {/* Hai mắt */}
                      <circle cx="8" cy="16" r="1"></circle>
                      <circle cx="16" cy="16" r="1"></circle>
                      {/* Ăng-ten và miệng */}
                      <path d="M12 11V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"></path>
                      <path d="M10 20h4"></path>
                  </svg>
              </Link>

            <Link href="/cart" className={styles.iconBtn} aria-label="Cart" id="cart-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span className={styles.cartBadge}>{cartCount}</span>
            </Link>
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
          <Link  href="/" className={styles.navLink}>Trang chủ</Link >
          <Link  href="/livestream" className={styles.navLinkLive}>
            <span className={styles.liveDot}></span>
            Live Stream
          </Link >

        </div>
      </nav>
    </header>
  );
}

export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={null}>
      <HeaderInner {...props} />
    </Suspense>
  );
}

