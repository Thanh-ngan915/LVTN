'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../services/productService';
import styles from './FlashSale.module.css';

interface FlashSaleProps {
  products: Product[];
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function FlashSale({ products }: FlashSaleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  // Calculate time remaining to the next Shopee-like flash sale slot:
  // Slots: 0:00, 9:00, 12:00, 15:00, 18:00, 21:00, 24:00
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextTarget = new Date();
      
      const slots = [0, 9, 12, 15, 18, 21, 24];
      const currentHour = now.getHours();
      
      let targetHour = slots.find(slot => slot > currentHour);
      if (targetHour === undefined || targetHour === 24) {
        targetHour = 0;
        nextTarget.setDate(now.getDate() + 1);
      }
      
      nextTarget.setHours(targetHour, 0, 0, 0);
      
      const difference = nextTarget.getTime() - now.getTime();
      
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial run
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      // Run once on load to establish arrow status
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

  if (!products || products.length === 0) return null;

  // Format single digits with leading zero
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
              <span className={styles.timeBox}>{pad(timeLeft.hours)}</span>
              <span className={styles.colon}>:</span>
              <span className={styles.timeBox}>{pad(timeLeft.minutes)}</span>
              <span className={styles.colon}>:</span>
              <span className={styles.timeBox}>{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
        
        <span className={styles.headerRight}>
          Xem tất cả <span className={styles.arrowIcon}>&gt;</span>
        </span>
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
          {products.map((product) => {
            const total = (product.sold || 0) + (product.currentQuantity || 0);
            const percentSold = total > 0 ? Math.round(((product.sold || 0) / total) * 100) : 0;
            // Limit percentage to look good (minimum 15% fill if sold > 0, to always display some color)
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
