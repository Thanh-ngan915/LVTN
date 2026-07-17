'use client';

import { Category } from '../services/productService';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className={styles.categoryContainer}>
      <div className={styles.categoryHeader}>
        <h3>DANH MỤC</h3>
      </div>
      <div className={styles.wrapper} id="category-filter">
        <button
          className={`${styles.categoryItem} ${activeCategory === null ? styles.active : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          <span className={styles.categoryName}>Tất cả</span>
        </button>
        {categories.map((cat) => {
          // Generate a deterministic color based on shortname length or characters
          const hue = (cat.shortname.length * 15 + cat.name.charCodeAt(0) * 10) % 360;
          return (
            <button
              key={cat.shortname}
              className={`${styles.categoryItem} ${activeCategory === cat.shortname ? styles.active : ''}`}
              onClick={() => onCategoryChange(cat.shortname)}
              id={`category-${cat.shortname}`}
            >
              <span className={styles.categoryName}>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
