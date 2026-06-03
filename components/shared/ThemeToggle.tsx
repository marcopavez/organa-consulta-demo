'use client';
import { SunIcon, MoonIcon } from './Icons';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  /** Desktop shows icon + label; mobile shows icon-only */
  variant: 'desktop' | 'mobile';
}

export function ThemeToggle({ theme, onToggle, variant }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Claro' : 'Oscuro';

  if (variant === 'mobile') {
    return (
      <button
        className="mc-toggle"
        onClick={onToggle}
        aria-label={`Cambiar a tema ${label}`}
        type="button"
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </button>
    );
  }

  return (
    <button
      className="cns-toggle"
      onClick={onToggle}
      aria-label={`Cambiar a tema ${label}`}
      type="button"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span>{label}</span>
    </button>
  );
}
