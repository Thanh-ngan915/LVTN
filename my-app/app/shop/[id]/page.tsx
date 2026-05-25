'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { 
  Product, 
  getProductsByStore, 
  getProductsByStoreAndCategory, 
  searchProductsByStore,
  getCategories,
  Category
} from '../../services/productService';
import { getStoreById, StoreProfileResponseDTO } from '../../services/storeService';
import styles from './page.module.css';

export default function ShopProfilePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [shopInfo, setShopInfo] = useState<StoreProfileResponseDTO | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Load Shop Info and Categories
  useEffect(() => {
    if (!storeId) return;

    setLoading(true);
    Promise.all([
      getStoreById(storeId).catch(() => null),
      getCategories().catch(() => ({ data: [] }))
    ]).then(([profile, catRes]) => {
      setShopInfo(profile as StoreProfileResponseDTO);
      setCategories(catRes.data || []);
    }).finally(() => setLoading(false));
  }, [storeId]);

  // Load Products
  const loadProducts = useCallback(async (p = 0) => {
    if (!storeId) return;
    setProductsLoading(true);
    try {
      let res;
      if (searchKeyword.trim()) {
        res = await searchProductsByStore(storeId, searchKeyword, p, 12);
      } else if (selectedCategory) {
        res = await getProductsByStoreAndCategory(storeId, selectedCategory, p, 12);
      } else {
        res = await getProductsByStore(storeId, p, 12);
      }

      if (res.success) {
        setProducts(res.data || []);
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      }
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setProductsLoading(false);
    }
  }, [storeId, selectedCategory, searchKeyword]);

  useEffect(() => {
    loadProducts(0);
  }, [loadProducts]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Đang tải thông tin shop...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      
      <div className={styles.container}>
        {/* Shop Header Card */}
        <div className={styles.headerCard}>
          <div className={styles.shopInfoMain}>
            <div className={styles.avatarWrapper}>
              {shopInfo?.store?.image ? (
                <img src={shopInfo.store.image} alt={shopInfo.store.name} />
              ) : (
                <div style={{fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee'}}>🏪</div>
              )}
              <span className={styles.shopBadge}>Yêu thích+</span>
            </div>
            <div className={styles.shopDetails}>
              <h1 className={styles.shopName}>{shopInfo?.store?.name || storeId}</h1>
              <div className={styles.shopStatus}>Online 2 phút trước</div>
              <div className={styles.headerActions}>
                <button className={`${styles.actionBtn} ${styles.followBtn}`}>
                  <span>+</span> Theo Dõi
                </button>
                <button className={`${styles.actionBtn} ${styles.chatBtn}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Chat
                </button>
              </div>
            </div>
          </div>
          <div className={styles.shopStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Sản phẩm:</span>
              <span className={styles.statValue}>{totalElements}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Người theo dõi:</span>
              <span className={styles.statValue}>2.5k</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Đánh giá:</span>
              <span className={styles.statValue}>4.8 (1.2k đánh giá)</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tỉ lệ phản hồi:</span>
              <span className={styles.statValue}>98% (Trong vài giờ)</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Sidebar - Categories */}
          <div className={styles.sidebar}>
            <div className={styles.sideTitle}>DANH MỤC SẢN PHẨM</div>
            <ul className={styles.categoryList}>
              <li 
                className={`${styles.categoryItem} ${!selectedCategory ? styles.categoryItemActive : ''}`}
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchKeyword('');
                }}
              >
                Tất cả sản phẩm
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.shortname} 
                  className={`${styles.categoryItem} ${selectedCategory === cat.shortname ? styles.categoryItemActive : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.shortname);
                    setSearchKeyword('');
                  }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Area - Search & Products */}
          <div className={styles.mainArea}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Tìm kiếm trong shop này..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadProducts(0)}
              />
            </div>

            <div className={styles.productGrid}>
              {productsLoading ? (
                <div className={styles.loading}>Đang tải sản phẩm...</div>
              ) : products.length === 0 ? (
                <div className={styles.noProducts}>Không tìm thấy sản phẩm nào.</div>
              ) : (
                products.map(prod => (
                  <div 
                    key={prod.id} 
                    className={styles.productCard}
                    onClick={() => router.push(`/product/${prod.id}`)}
                  >
                    <div className={styles.productImage}>
                      <img src={prod.imageUrls?.[0] || 'https://via.placeholder.com/200'} alt={prod.name} />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.prodName}>{prod.name}</div>
                      <div className={styles.prodPrice}>{formatPrice(prod.priceAfter)}</div>
                      <div className={styles.prodFooter}>
                        <div className={styles.prodRating}>
                          ★ {prod.rate?.toFixed(1) || '0.0'}
                        </div>
                        <div className={styles.prodSold}>Đã bán {prod.sold || 0}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i} 
                    className={`${styles.pageBtn} ${page === i ? styles.pageBtnActive : ''}`}
                    onClick={() => loadProducts(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
