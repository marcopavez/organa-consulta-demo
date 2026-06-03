import type { Source } from '@/lib/types';

interface SourceCardProps {
  source: Source;
  variant: 'desktop' | 'mobile';
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export function SourceCard({
  source,
  variant,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: SourceCardProps) {
  const pct = Math.round(source.score * 100);

  if (variant === 'desktop') {
    return (
      <div
        className={`cns-src${isActive ? ' hot' : ''}`}
        id={source.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
        aria-label={`Fuente: ${source.title}`}
      >
        <div className="s-top">
          <span className="ticker">{source.ticker}</span>
          <span className="kindtag">{source.kindLabel}</span>
          <span className="score">{source.score.toFixed(2)}</span>
        </div>
        <div className="s-title">{source.title}</div>
        <div className="s-rel">
          <span className="bar"><i style={{ width: `${pct}%` }} /></span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="s-snip">{source.snippet}</div>
      </div>
    );
  }

  // Mobile variant — slightly different DOM: no kindtag column, inside mc-src
  return (
    <div className="mc-src">
      <div className="s-top">
        <span className="ticker">{source.ticker}</span>
        <span className="score">{source.score.toFixed(2)}</span>
      </div>
      <div className="s-title">{source.title}</div>
      <div className="s-rel">
        <span className="bar"><i style={{ width: `${pct}%` }} /></span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="s-snip">{source.snippet}</div>
    </div>
  );
}
