import { useState, useCallback, useEffect } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return getItem<boolean>(STORAGE_KEYS.DARK_MODE) ?? false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      setItem(STORAGE_KEYS.DARK_MODE, next);
      return next;
    });
  }, []);

  return { isDark, toggleDarkMode };
}
