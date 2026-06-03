import type { Metadata } from 'next';
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/desktop.css';
import '@/styles/mobile.css';
import '@/styles/responsive.css';

// --- Fonts via next/font (self-hosted, no layout shift) ---
// Weights match the Google Fonts request in the handoff <head>:
// Fraunces: 400 500 600 700 (italic 400 too)
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

// Geist: 300 400 500 600 700
const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
});

// JetBrains Mono: 400 500 600
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Organa — Consulta · Investigación legal (demo)',
  description: 'Asistente legal conversacional con cita canónica sobre normativa chilena.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below mutates data-theme before
    // React hydrates, which would otherwise trigger a hydration warning.
    <html lang="es" suppressHydrationWarning>
      <head>
        {/*
          Inline blocking script — sets data-theme BEFORE first paint to prevent
          flash-of-wrong-theme. Must be synchronous (no defer/async).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('organa-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={[
          fraunces.variable,
          geist.variable,
          jetbrainsMono.variable,
        ].join(' ')}
      >
        {children}
      </body>
    </html>
  );
}
