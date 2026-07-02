'use client';

import { useEffect, useState } from 'react';
import styles from './GoogleTranslate.module.css';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function getActiveLang(): 'vi' | 'en' {
  if (typeof document === 'undefined') return 'vi';
  const match = document.cookie.match(/googtrans=\/vi\/(\w+)/);
  return match?.[1] === 'en' ? 'en' : 'vi';
}

function setGoogTransCookie(lang: 'vi' | 'en') {
  const value = lang === 'en' ? '/vi/en' : '/vi/vi';
  // Ghi cookie cho cả domain gốc và có dấu chấm (để Google Translate nhận)
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}`;
}

export default function GoogleTranslate() {
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    // Đọc trạng thái hiện tại từ cookie khi mount
    setActiveLang(getActiveLang());

    // Load Google Translate script
    const existingScript = document.getElementById('google-translate-script');
    if (existingScript) return; // Script đã có rồi, không load lại

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'vi', includedLanguages: 'en,vi', autoDisplay: false },
        'google_translate_element_hidden'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const switchLanguage = (lang: 'vi' | 'en') => {
    if (lang === activeLang) return;
    setGoogTransCookie(lang);
    setActiveLang(lang);
    // Reload để Google Translate áp dụng cookie — đây là cách đáng tin cậy nhất
    window.location.reload();
  };

  return (
    <>
      {/* Widget Google ẩn — chỉ để script khởi tạo */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />

      {/* Nút VI | EN tùy chỉnh */}
      <div className={styles.switcher}>
        <button
          className={`${styles.btn} ${activeLang === 'vi' ? styles.active : ''}`}
          onClick={() => switchLanguage('vi')}
          aria-label="Tiếng Việt"
        >
          VI
        </button>
        <span className={styles.sep}>|</span>
        <button
          className={`${styles.btn} ${activeLang === 'en' ? styles.active : ''}`}
          onClick={() => switchLanguage('en')}
          aria-label="English"
        >
          EN
        </button>
      </div>
    </>
  );
}


