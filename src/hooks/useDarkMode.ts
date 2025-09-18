// hooks/useDarkMode.ts
'use client';

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const el = document.documentElement;

    // Observe class changes (tailwind dark mode class toggles)
    const observer = new MutationObserver(() => {
      setIsDarkMode(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    // Also respect prefers-color-scheme
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = () => setIsDarkMode(el.classList.contains('dark') || mql.matches);
    mql.addEventListener?.('change', onScheme);

    return () => {
      observer.disconnect();
      mql.removeEventListener?.('change', onScheme);
    };
  }, []);

  return isDarkMode;
};