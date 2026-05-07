'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { Product, ProductVariant, getProductById } from '../../services/productService';
import { RatingDTO, RatingSummaryDTO, getRatingsByProduct, getRatingSummary, submitRating } from '../../services/ratingService';
import { addToCart } from '../../services/cartService';
import styles from './page.module.css';

const COLOR_MAP: Record<string, string> = {
  'trắng': '#ffffff',
  'đen': '#222222',
  'navy': '#1a237e',
  'đỏ đô': '#b71c1c',
  'xanh đậm': '#0d47a1',
  'xanh nhạt': '#64b5f6',
  'kem': '#f5f0e1',
  'hồng': '#e91e63',
  'xám': '#9e9e9e',
  'nâu': '#795548',
  'be': '#d7ccc8',
  'cam': '#ff9800',
  'vàng': '#ffc107',
  'tím': '#9c27b0',
};

function getColorHex(colorName: string): string {
  return COLOR_MAP[colorName.toLowerCase()] || '#ccc';
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gallery
  const [selectedImage, setSelectedImage] = useState(0);

  // Variants
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Ratings from API
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [ratingSummary, setRatingSummary] = useState<RatingSummaryDTO | null>(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<number | null>(null);
  const [ratingPage, setRatingPage] = useState(0);
  const [ratingTotalPages, setRatingTotalPages] = useState(0);
  const [ratingTotalElements, setRatingTotalElements] = useState(0);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Cart
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load ratings
  const loadRatings = useCallback(async (page = 0, star?: number | null) => {
    if (!productId || isNaN(productId)) return;
    setRatingsLoading(true);
    try {
      const filterStar = star !== null && star !== undefined ? star : undefined;
      const res = await getRatingsByProduct(productId, page, 10, filterStar);
      if (res.success) {
        setRatings(res.data || []);
        setRatingPage(res.page);
        setRatingTotalPages(res.totalPages);
        setRatingTotalElements(res.totalElements);
      }
    } catch (e) {
      console.error('Failed to load ratings', e);
    } finally {
      setRatingsLoading(false);
    }
  }, [productId]);

  const loadRatingSummary = useCallback(async () => {
    if (!productId || isNaN(productId)) return;
    try {
      const res = await getRatingSummary(productId);
      if (res.success) {
        setRatingSummary(res.data);
      }
    } catch (e) {
      console.error('Failed to load rating summary', e);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId || isNaN(productId)) {
      setError('ID sản phẩm không hợp lệ');
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductById(productId)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
          if (res.data.variants && res.data.variants.length > 0) {
            const colors = [...new Set(res.data.variants.map(v => v.color).filter(Boolean))];
            const sizes = [...new Set(res.data.variants.map(v => v.size).filter(Boolean))];
            if (colors.length > 0) setSelectedColor(colors[0]);
            if (sizes.length > 0) setSelectedSize(sizes[0]);
          }
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      })
      .catch(() => setError('Không thể tải thông tin sản phẩm'))
      .finally(() => setLoading(false));

    // Load ratings and summary
    loadRatings(0);
    loadRatingSummary();
  }, [productId, loadRatings, loadRatingSummary]);

  // Get unique colors and sizes
  const colors = product?.variants
    ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
    : [];
  const sizes = product?.variants
    ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
    : [];

  // Find matching variant
  const selectedVariant: ProductVariant | undefined = product?.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  // Get available sizes for selected color
  const availableSizesForColor = product?.variants
    ?.filter(v => v.color === selectedColor)
    .map(v => v.size) || [];

  // Get available colors for selected size
  const availableColorsForSize = product?.variants
    ?.filter(v => v.size === selectedSize)
    .map(v => v.color) || [];

  // Price display
  const displayPrice = selectedVariant?.priceAfter ?? product?.priceAfter ?? 0;
  const displayOrigPrice = selectedVariant?.priceBefore ?? product?.priceBefore ?? 0;
  const discount = displayOrigPrice > 0
    ? Math.round(((displayOrigPrice - displayPrice) / displayOrigPrice) * 100)
    : 0;

  // Stock
  const maxStock = selectedVariant?.currentQuantity ?? product?.currentQuantity ?? 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const renderStars = (rate: number, size = 16) => {
    const stars = [];
    const full = Math.floor(rate);
    const hasHalf = rate - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<span key={i} className={styles.starFull} style={{ fontSize: size }}>★</span>);
      } else if (i === full && hasHalf) {
        stars.push(<span key={i} className={styles.starHalf} style={{ fontSize: size }}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.starEmpty} style={{ fontSize: size }}>★</span>);
      }
    }
    return stars;
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAddToCart = async () => {
    if (colors.length > 0 && !selectedColor) {
      showToast('Vui lòng chọn màu sắc');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      showToast('Vui lòng chọn kích thước');
      return;
    }

    // Kiểm tra đăng nhập
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) {
      showToast('⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(String(product!.id), quantity);
      showToast(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      setCartUpdateTrigger(prev => prev + 1); // Refresh cart count in Header
    } catch (e: any) {
      showToast(`❌ ${e.message || 'Không thể thêm vào giỏ hàng'}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (colors.length > 0 && !selectedColor) {
      showToast('Vui lòng chọn màu sắc');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      showToast('Vui lòng chọn kích thước');
      return;
    }
    showToast('🛒 Đang chuyển đến trang thanh toán...');
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    // Lấy username từ localStorage (đã lưu khi login)
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'anonymous' : 'anonymous';
    try {
      // Gửi đánh giá qua API - cần orderId, tạm thời gửi comment dạng text
      // Trong thực tế, user cần chọn đơn hàng đã mua để đánh giá
      await submitRating(0, product?.storeId ? parseInt(product.storeId) : 0, commentRating, commentText.trim(), [], username);
      setCommentText('');
      setCommentRating(5);
      showToast('✅ Đã gửi đánh giá thành công!');
      // Reload ratings
      loadRatings(0, reviewFilter);
      loadRatingSummary();
    } catch (e) {
      showToast('❌ Gửi đánh giá thất bại. Bạn cần mua hàng trước khi đánh giá.');
    }
  };

  const handleFilterChange = (star: number | null) => {
    setReviewFilter(star);
    loadRatings(0, star);
  };

  // Images for gallery
  const images = product?.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls
    : [];

  if (loading) {
    return (
      <div className={styles.page}>
        <Header cartUpdateTrigger={cartUpdateTrigger} />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Header cartUpdateTrigger={cartUpdateTrigger} />
        <div className={styles.error}>
          <span className={styles.errorIcon}>😔</span>
          <p className={styles.errorText}>{error || 'Không tìm thấy sản phẩm'}</p>
          <a href="/" className={styles.backBtn}>← Quay về trang chủ</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header cartUpdateTrigger={cartUpdateTrigger} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <a href="/">Trang chủ</a>
        <span className={styles.breadcrumbSep}>›</span>
        {product.categoryName && (
          <>
            <a href={`/?category=${product.categoryShortname}`}>{product.categoryName}</a>
            <span className={styles.breadcrumbSep}>›</span>
          </>
        )}
        <span>{product.name}</span>
      </div>

      <div className={styles.container}>
        {/* Product Top Section */}
        <div className={styles.productTop}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  id="product-main-image"
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#f5f5f5', color: '#ccc', fontSize: '64px'
                }}>
                  🖼️
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((url, i) => (
                  <div
                    key={i}
                    className={`${styles.thumbnail} ${i === selectedImage ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={url} alt={`${product.name} - ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <span className={styles.favBadge}>Yêu Thích</span>
            <h1 className={styles.productName} id="product-name">{product.name}</h1>

            {/* Rating Row */}
            <div className={styles.ratingRow}>
              <div className={styles.ratingScore}>
                <span className={styles.ratingNumber}>{product.rate?.toFixed(1) || '0.0'}</span>
                <div className={styles.ratingStars}>{renderStars(product.rate || 0)}</div>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.ratingMeta}>
                <span className={styles.metaValue}>{ratingSummary?.totalRatings || 0}</span> Đánh giá
              </div>
              <div className={styles.separator}></div>
              <div className={styles.ratingMeta}>
                <span className={styles.metaValue}>{product.sold || 0}</span> Đã bán
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              {discount > 0 && (
                <span className={styles.priceBefore}>{formatPrice(displayOrigPrice)}</span>
              )}
              <span className={styles.priceAfter}>{formatPrice(displayPrice)}</span>
              {discount > 0 && (
                <span className={styles.discountTag}>{discount}% GIẢM</span>
              )}
            </div>

            {/* Variant Selectors */}
            <div className={styles.variantSection}>
              {/* Color */}
              {colors.length > 0 && (
                <div className={styles.variantRow}>
                  <span className={styles.variantLabel}>Màu sắc</span>
                  <div className={styles.variantOptions}>
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`${styles.variantBtn} ${selectedColor === color ? styles.variantBtnActive : ''}`}
                        onClick={() => {
                          setSelectedColor(color);
                          // If current size is not available for this color, reset
                          const sizesForColor = product.variants
                            ?.filter(v => v.color === color)
                            .map(v => v.size) || [];
                          if (selectedSize && !sizesForColor.includes(selectedSize)) {
                            setSelectedSize(sizesForColor[0] || null);
                          }
                          setQuantity(1);
                        }}
                        id={`color-btn-${color}`}
                      >
                        <span
                          className={styles.colorIndicator}
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size */}
              {sizes.length > 0 && (
                <div className={styles.variantRow}>
                  <span className={styles.variantLabel}>Kích thước</span>
                  <div className={styles.variantOptions}>
                    {sizes.map((size) => {
                      const isAvailable = !selectedColor || availableSizesForColor.includes(size);
                      return (
                        <button
                          key={size}
                          className={`${styles.variantBtn} ${selectedSize === size ? styles.variantBtnActive : ''} ${!isAvailable ? styles.variantBtnDisabled : ''}`}
                          onClick={() => {
                            if (!isAvailable) return;
                            setSelectedSize(size);
                            setQuantity(1);
                          }}
                          disabled={!isAvailable}
                          id={`size-btn-${size}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className={styles.quantityRow}>
                <span className={styles.variantLabel}>Số lượng</span>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    id="qty-decrease"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className={styles.quantityInput}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), maxStock));
                    }}
                    min={1}
                    max={maxStock}
                    id="qty-input"
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    disabled={quantity >= maxStock}
                    id="qty-increase"
                  >
                    +
                  </button>
                </div>
                <span className={styles.stockInfo}>{maxStock} sản phẩm có sẵn</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionRow}>
              <button className={styles.addToCartBtn} onClick={handleAddToCart} disabled={addingToCart} id="add-to-cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {addingToCart ? 'Đang thêm...' : 'Thêm Vào Giỏ Hàng'}
              </button>
              <button className={styles.buyNowBtn} onClick={handleBuyNow} id="buy-now-btn">
                Mua Ngay
              </button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className={styles.descriptionSection}>
          <h2 className={styles.sectionTitle}>
            📋 CHI TIẾT SẢN PHẨM
          </h2>
          <table className={styles.detailsTable}>
            <tbody>
              {product.categoryName && (
                <tr>
                  <td>Danh mục</td>
                  <td>{product.categoryName}</td>
                </tr>
              )}
              {product.storeId && (
                <tr>
                  <td>Shop</td>
                  <td>{product.storeId}</td>
                </tr>
              )}
              {colors.length > 0 && (
                <tr>
                  <td>Màu sắc</td>
                  <td>{colors.join(', ')}</td>
                </tr>
              )}
              {sizes.length > 0 && (
                <tr>
                  <td>Kích thước</td>
                  <td>{sizes.join(', ')}</td>
                </tr>
              )}
              <tr>
                <td>Kho hàng</td>
                <td>{product.currentQuantity} sản phẩm</td>
              </tr>
              <tr>
                <td>Đã bán</td>
                <td>{product.sold}</td>
              </tr>
            </tbody>
          </table>

          <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>
            📝 MÔ TẢ SẢN PHẨM
          </h2>
          <div className={styles.descriptionContent}>
            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
          </div>
        </div>

        {/* Reviews */}
        <div className={styles.reviewSection} id="reviews-section">
          <h2 className={styles.sectionTitle}>⭐ ĐÁNH GIÁ SẢN PHẨM</h2>

          {/* Review Summary */}
          <div className={styles.reviewSummary}>
            <div className={styles.reviewScoreBig}>
              <span className={styles.reviewScoreNum}>{ratingSummary?.averageStars?.toFixed(1) || product.rate?.toFixed(1) || '0.0'}</span>
              <span className={styles.reviewScoreMax}> trên 5</span>
              <div className={styles.reviewScoreStars}>{renderStars(ratingSummary?.averageStars || product.rate || 0, 20)}</div>
            </div>
            <div className={styles.reviewFilters}>
              <button
                className={`${styles.filterBtn} ${reviewFilter === null ? styles.filterBtnActive : ''}`}
                onClick={() => handleFilterChange(null)}
              >
                Tất cả ({ratingSummary?.totalRatings || 0})
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  className={`${styles.filterBtn} ${reviewFilter === star ? styles.filterBtnActive : ''}`}
                  onClick={() => handleFilterChange(reviewFilter === star ? null : star)}
                >
                  {star} Sao ({ratingSummary?.starCounts?.[star] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Comment Form */}
          <div className={styles.commentForm}>
            <span className={styles.commentFormTitle}>✍️ Viết đánh giá của bạn</span>

            <div className={styles.starSelector}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`${styles.starSelect} ${(hoverRating || commentRating) >= star ? styles.starSelectActive : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setCommentRating(star)}
                  type="button"
                  aria-label={`${star} sao`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className={styles.commentTextarea}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
              id="comment-textarea"
            />
            <button
              className={styles.commentSubmitBtn}
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              id="comment-submit-btn"
            >
              Gửi đánh giá
            </button>
          </div>

          {/* Comment List */}
          <div className={styles.commentList}>
            {ratingsLoading ? (
              <div className={styles.noComments}>Đang tải đánh giá...</div>
            ) : ratings.length === 0 ? (
              <div className={styles.noComments}>
                Chưa có đánh giá nào{reviewFilter ? ` ${reviewFilter} sao` : ''}. Hãy là người đầu tiên đánh giá!
              </div>
            ) : (
              ratings.map((rating) => (
                <div key={rating.id} className={styles.commentItem} id={`comment-${rating.id}`}>
                  <div className={styles.commentAvatar}>
                    {rating.userImage ? (
                      <img src={rating.userImage} alt={rating.userFullName} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}} />
                    ) : (
                      (rating.userFullName || rating.createdBy || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentUser}>{rating.userFullName || rating.createdBy}</div>
                    <div className={styles.commentStars}>{renderStars(rating.stars, 12)}</div>
                    <div className={styles.commentDate}>
                      {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : ''}
                    </div>
                    {rating.materialUrls && rating.materialUrls.length > 0 && (
                      <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
                        {rating.materialUrls.map((url, i) => (
                          <img key={i} src={url} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:4,border:'1px solid #eee'}} />
                        ))}
                      </div>
                    )}
                    {rating.replies && rating.replies.length > 0 && (
                      <div style={{marginTop:12,paddingLeft:16,borderLeft:'2px solid #f0f0f0'}}>
                        {rating.replies.map((reply) => (
                          <div key={reply.id} style={{marginBottom:8}}>
                            <span style={{fontWeight:600,fontSize:13,color:'#ee4d2d'}}>{reply.userFullName || reply.createdBy}</span>
                            <span style={{fontSize:12,color:'#999',marginLeft:8}}>
                              {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('vi-VN') : ''}
                            </span>
                            {reply.url && <div style={{fontSize:13,color:'#555',marginTop:4}}>{reply.url}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {ratingTotalPages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
                {Array.from({length: ratingTotalPages}, (_, i) => (
                  <button
                    key={i}
                    onClick={() => loadRatings(i, reviewFilter)}
                    style={{
                      padding:'6px 12px',
                      border: ratingPage === i ? '1px solid #ee4d2d' : '1px solid #ccc',
                      color: ratingPage === i ? '#ee4d2d' : '#555',
                      background: ratingPage === i ? 'rgba(238,77,45,0.05)' : '#fff',
                      borderRadius:4,
                      cursor:'pointer',
                      fontSize:13
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={styles.toast} id="toast-notification">
          <div className={styles.toastContent}>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
