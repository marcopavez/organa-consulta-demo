# Organa · Consulta — demo screen

A faithful, responsive Next.js (App Router + TypeScript) recreation of the
**Consulta** legal-research RAG surface. Conversational UI with fake/canned
interactivity — no backend, no real retrieval, no network calls.

## Stack
- Next.js 16 (App Router), TypeScript strict
- CSS: verbatim-ported design-handoff stylesheets (`styles/tokens.css`,
  `desktop.css`, `mobile.css`) — no Tailwind, no CSS Modules, no renaming
- Fonts: `next/font/google` (Fraunces + Geist + JetBrains Mono, self-hosted)
- Tests: Vitest + React Testing Library + jsdom

## Running locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

Three focused tests:
1. `theme.test.tsx` — toggle sets `data-theme="dark"` on `<html>` + localStorage
2. `composer.test.tsx` — submitting a question appends user + (after fake timer) assistant turns from canned answers
3. `citation.test.tsx` — hovering a citation sets matching source card to `.hot` / `activeSourceId`

## Architecture notes

- **Dual-DOM responsive strategy**: both `<DesktopShell>` and `<MobileShell>` are
  server-rendered; CSS hides the inactive one at the 820px breakpoint (`styles/responsive.css`).
  This guarantees DOM fidelity to each handoff file without hydration flash.
- **No-flash theme**: an inline blocking `<script>` in `app/layout.tsx` reads
  `localStorage['organa-theme']` and sets `data-theme="dark"` before first paint.
- **Canned answers**: `lib/canned.ts` maps known questions to structured answers
  (prose + citations + sources + trace). Unknown questions get a generic fallback —
  the app never errors on unexpected input.
- **CSS fidelity**: selectors, values, and class names are verbatim from the handoff.
  Only deviations: (1) font-family now supplied via CSS variables from `next/font`;
  (2) two wrapping divs carry `.organa-desktop-shell` / `.organa-mobile-shell`
  for the breakpoint rule; (3) textarea reset rules appended for the functional composer.

## Data note

All legal content (Código del Trabajo articles, CS jurisprudencia, DT dictámenes)
is illustrative demo data copied verbatim from the design handoff. It is NOT live
RAG output. **No backend, no database, no external API calls.**
