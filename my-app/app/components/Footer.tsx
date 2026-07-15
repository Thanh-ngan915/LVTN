import { useState, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/policies")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPolicies(data);
      })
      .catch(err => console.error('Failed to fetch policies:', err));
  }, []);

  return (
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
          {policies.map(p => (
            <a key={p.id} href={`/policy/${p.id}`}>{p.title}</a>
          ))}
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
  );
}
