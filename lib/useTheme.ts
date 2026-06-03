'use client';
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'organa-theme';
type Theme = 'light' | 'dark';

/**
 * Theme hook — reads from localStorage on mount, writes back on toggle.
 * The inline <script> in layout.tsx applies the initial value synchronously
 * before React hydrates, preventing flash-of-wrong-theme.
 */
export function useTheme(): [Theme, () => void] {
  // Start with 'light' — the blocking <script> has already set the attribute.
  // After mount we sync our state to whatever the script set.
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    // Sync attribute (in case hydration re-rendered without it)
    if (initial === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
