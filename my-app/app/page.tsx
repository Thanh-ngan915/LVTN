'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import {
  Product,
  Category,
  getProducts,
  getProductsByCategory,
  getCategories,
} from './services/productService';
import styles from './page.module.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (pageNum: number, category: string | null, append: boolean) => {
    setLoading(true);
    try {
      const res = category
        ? await getProductsByCategory(category, pageNum, 12)
        : await getProducts(pageNum, 12);

      if (res.success) {
        setProducts(prev => append ? [...prev, ...res.data] : res.data);
        setHasMore(pageNum < res.totalPages - 1);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    setPage(0);
    fetchProducts(0, activeCategory, false);
  }, [activeCategory, fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, activeCategory, true);
  };

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  return (
    <div className={styles.page}>
      <Header />
      <HeroBanner />
      <main className={styles.main} id="products">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🔥</span>
              Sản phẩm nổi bật
            </h2>
            <p className={styles.sectionSubtitle}>
              Khám phá những sản phẩm được yêu thích nhất
            </p>
          </div>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <ProductGrid
            products={products}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </main>
      <footer className={styles.footer} id="site-footer">
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>✦ ANVI SHOP</span>
            <p className={styles.footerDesc}>
              Thời trang chất lượng cao, phong cách đa dạng, giá cả hợp lý.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Hỗ trợ</h4>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Hướng dẫn mua hàng</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className={styles.footerLinks}>
            <h4>Theo dõi</h4>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 ANVI Shop. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
