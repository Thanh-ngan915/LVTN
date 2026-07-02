'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLocale('vi')}
        className={`text-sm px-2 py-1 rounded ${locale === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        VI
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`text-sm px-2 py-1 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        EN
      </button>
    </div>
  );
}
