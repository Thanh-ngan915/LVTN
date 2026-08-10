'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product, getProductById } from '../services/productService';
import { getActiveProductPromotions } from '../services/salePromotionService';
import styles from './FlashSale.module.css';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function FlashSale() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [targetEndDate, setTargetEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlashSale() {
      try {
        const activePromos = await getActiveProductPromotions();
        if (activePromos.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Set countdown to the earliest ending promotion
        let earliestEnd: Date | null = null;
        for (const promo of activePromos) {
          if (promo.endDate) {
            const endDateObj = new Date(promo.endDate);
            if (!earliestEnd || endDateObj < earliestEnd) {
              earliestEnd = endDateObj;
            }
          }
        }
        setTargetEndDate(earliestEnd);

        // Fetch full product details for each active promotion in parallel
        const productPromises = activePromos.map(async (promo) => {
          try {
            const res = await getProductById(Number(promo.productId));
            if (res.success && res.data) {
              return {
                ...res.data,
                // Override with promotion-specific details
                priceAfter: promo.priceAfter,
                currentQuantity: promo.quantity - promo.bought,
                sold: promo.bought,
              };
            }
          } catch (e) {
            console.error(`Error fetching details for product ${promo.productId}:`, e);
          }
          return null;
        });

        const resolved = await Promise.all(productPromises);
        const filtered = resolved.filter((p): p is Product => p !== null);
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load active promotions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFlashSale();
  }, []);

  useEffect(() => {
    if (!targetEndDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetEndDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetEndDate]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 10);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [products]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  if (loading || !products || products.length === 0) return null;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className={styles.flashSaleSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.titleWrapper}>
            <span className={styles.lightningIcon}>⚡</span>
            <h2 className={styles.flashSaleTitle}>FLASH SALE</h2>
          </div>
          
          <div className={styles.timerContainer}>
            <span className={styles.timerLabel}>KẾT THÚC TRONG</span>
            <div className={styles.countdown}>
              {timeLeft.days > 0 ? (
                <>
                  <span className={styles.timeBox}>{pad(timeLeft.days)}</span>
                  <span className={styles.colon}>:</span>
                  <span className={styles.timeBox}>{pad(timeLeft.hours)}</span>
                  <span className={styles.colon}>:</span>
                  <span className={styles.timeBox}>{pad(timeLeft.minutes)}</span>
                </>
              ) : (
                <>
                  <span className={styles.timeBox}>{pad(timeLeft.hours)}</span>
                  <span className={styles.colon}>:</span>
                  <span className={styles.timeBox}>{pad(timeLeft.minutes)}</span>
                  <span className={styles.colon}>:</span>
                  <span className={styles.timeBox}>{pad(timeLeft.seconds)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        {showLeftArrow && (
          <button 
            className={`${styles.navButton} ${styles.prevButton}`} 
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            ❮
          </button>
        )}

        <div className={scrollRef ? styles.scrollContainer : ''} ref={scrollRef}>
          {Array.from(new Map(products.map(p => [p.id, p])).values()).map((product) => {
            const total = (product.sold || 0) + (product.currentQuantity || 0);
            const percentSold = total > 0 ? Math.round(((product.sold || 0) / total) * 100) : 0;
            const displayPercent = product.sold && product.sold > 0 
              ? Math.max(15, percentSold) 
              : 0;

            return (
              <div key={product.id} className={styles.productWrapper}>
                <ProductCard product={product} />
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${displayPercent}%` }}
                  />
                  <span className={styles.progressBarText}>
                    {product.sold && product.sold > 0 
                      ? `ĐÃ BÁN ${product.sold}` 
                      : 'ĐANG BÁN CHẠY'}
                  </span>
                  {percentSold > 70 && (
                    <span className={styles.hotSaleIcon}>🔥</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showRightArrow && (
          <button 
            className={`${styles.navButton} ${styles.nextButton}`} 
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            ❯
          </button>
        )}
      </div>
    </section>
  );
}
