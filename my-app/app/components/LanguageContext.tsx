'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Dictionary = any; // You can type this properly based on your json

interface LanguageContextType {
  locale: string;
  dictionary: Dictionary;
  setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
  initialDictionary,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialDictionary: Dictionary;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [dictionary, setDictionary] = useState(initialDictionary);

  const setLocale = async (newLocale: string) => {
    setLocaleState(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Fetch new dictionary on client side when switching
    try {
      const res = await fetch(`/api-internal/dictionaries?locale=${newLocale}`);
      if (res.ok) {
        const dict = await res.json();
        setDictionary(dict);
      }
    } catch (e) {
      console.error('Failed to load dictionary', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, dictionary, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
