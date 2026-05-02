'use client';

import { useRouter } from 'next/navigation';
import { Product } from '../services/productService';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const discount = product.priceBefore && product.priceAfter
    ? Math.round(((product.priceBefore - product.priceAfter) / product.priceBefore) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : null;

  const renderStars = (rate: number) => {
    const stars = [];
    const fullStars = Math.floor(rate || 0);
    const hasHalf = (rate || 0) - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.starFull}>★</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} className={styles.starHalf}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty}>★</span>);
      }
    }
    return stars;
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.card} id={`product-card-${product.id}`} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {discount > 0 && (
          <span className={styles.badge}>-{discount}%</span>
        )}
        <div className={styles.overlay} onClick={stopPropagation}>
          <button className={styles.quickView} aria-label="Quick view" onClick={() => router.push(`/product/${product.id}`)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button className={styles.addToCart} aria-label="Add to cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
          <button className={styles.wishlist} aria-label="Add to wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.info}>
        {product.categoryName && (
          <span className={styles.category}>{product.categoryName}</span>
        )}
        <h3 className={styles.name}>{product.name || 'Unnamed Product'}</h3>
        <div className={styles.rating}>
          <div className={styles.stars}>{renderStars(product.rate)}</div>
          {product.sold != null && product.sold > 0 && (
            <span className={styles.sold}>Đã bán {product.sold}</span>
          )}
        </div>
        <div className={styles.priceRow}>
          {product.priceAfter != null && (
            <span className={styles.priceAfter}>{formatPrice(product.priceAfter)}</span>
          )}
          {product.priceBefore != null && discount > 0 && (
            <span className={styles.priceBefore}>{formatPrice(product.priceBefore)}</span>
          )}
        </div>
        {product.variants && product.variants.length > 0 && (
          <div className={styles.variants}>
            {[...new Set(product.variants.map(v => v.color).filter(Boolean))].slice(0, 4).map((color, i) => (
              <span key={i} className={styles.colorDot} title={color}
                style={{ backgroundColor: color.toLowerCase() }} />
            ))}
            {product.variants.length > 4 && (
              <span className={styles.moreVariants}>+{product.variants.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
