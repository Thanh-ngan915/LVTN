'use client';

import { Product } from '../services/productService';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ProductGrid({ products, loading, hasMore, onLoadMore }: ProductGridProps) {
  if (!loading && products.length === 0) {
    return (
      <div className={styles.empty} id="products-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Vui lòng thử lại với từ khóa hoặc danh mục khác</p>
      </div>
    );
  }

  return (
    <div id="products-section">
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`skeleton-${i}`} className={styles.skeleton}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonInfo}>
                <div className={styles.skeletonLine} style={{ width: '40%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
              </div>
            </div>
          ))
        }
      </div>
      {hasMore && !loading && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMore} onClick={onLoadMore} id="load-more-btn">
            Xem thêm sản phẩm
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
