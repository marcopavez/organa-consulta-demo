import type { SourceKind } from '@/lib/types';

interface CitationProps {
  label: string;
  sourceId: string;
  kind: SourceKind;
  /** Desktop uses cns-cref; mobile uses mc-cref */
  variant: 'desktop' | 'mobile';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export function Citation({
  label,
  sourceId,
  kind,
  variant,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CitationProps) {
  const className = variant === 'desktop' ? 'cns-cref' : 'mc-cref';
  // Only add data-kind for non-default kinds (§ is the default ::before)
  const dataKind = kind !== 'norma' ? kind : undefined;

  return (
    <span
      className={className}
      data-src={sourceId}
      data-kind={dataKind}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-label={`Cita: ${label}`}
    >
      {label}
    </span>
  );
}
