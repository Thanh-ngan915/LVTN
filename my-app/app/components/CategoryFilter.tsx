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
    <div className={styles.wrapper} id="category-filter">
      <button
        className={`${styles.chip} ${activeCategory === null ? styles.active : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        <span className={styles.chipIcon}>🏷️</span>
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.shortname}
          className={`${styles.chip} ${activeCategory === cat.shortname ? styles.active : ''}`}
          onClick={() => onCategoryChange(cat.shortname)}
          id={`category-${cat.shortname}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
