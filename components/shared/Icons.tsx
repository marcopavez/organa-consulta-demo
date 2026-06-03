/**
 * Inline SVG icons — verbatim from the handoff HTML.
 * No icon library; all shapes are <path>/<circle> primitives.
 */

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a6.5 6.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function SendArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

/** Signal-strength bars (4 bars) — from mobile handoff */
export function SignalIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
      <rect x="0" y="8" width="2.6" height="4" />
      <rect x="4" y="5" width="2.6" height="7" />
      <rect x="8" y="2.5" width="2.6" height="9.5" />
      <rect x="12" y="0" width="2.6" height="12" />
    </svg>
  );
}

/** WiFi icon — from mobile handoff */
export function WifiIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.3c2.3 0 4.4.9 6 2.4l-1.4 1.5A6.6 6.6 0 0 0 8 5.3c-1.8 0-3.4.7-4.6 1.9L2 5.7A8.6 8.6 0 0 1 8 2.3Zm0 3.9c1.2 0 2.3.5 3.1 1.3l-3.1 3.3-3.1-3.3A4.4 4.4 0 0 1 8 6.2Z" />
    </svg>
  );
}
