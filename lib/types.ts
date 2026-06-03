/** Source kind drives the citation glyph: § norma, ‡ jur, † dt */
export type SourceKind = 'norma' | 'jur' | 'dt';

export interface Source {
  id: string;
  ticker: string;
  kind: SourceKind;
  title: string;
  /** 0–1 relevance score; relevance bar width = score * 100% */
  score: number;
  snippet: string;
  /** Display label exactly as in the handoff, e.g. "norma · vigente", "jurisprudencia ‡", "dictamen †" */
  kindLabel: string;
}

/**
 * A segment of answer text. Either plain prose or an inline citation chip.
 * Using a union array (not dangerouslySetInnerHTML) keeps the render type-safe.
 */
export type TextSegment =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'citation'; label: string; sourceId: string; kind: SourceKind };

/** A paragraph in an assistant answer — may contain mixed text + citation segments */
export interface AnswerParagraph {
  /** Optional lead-in span (bold) that starts the paragraph */
  leadIn?: string;
  segments: TextSegment[];
}

export interface Trace {
  passages: number;
  sources: number;
  latencyMs: number;
  /** Free-form detail line (e.g. "Código del Trabajo · jurisprudencia CS · dictámenes DT") */
  detail?: string;
  /** Whether prior context was reused in retrieval */
  contextCarried?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  /** Plain text for user messages */
  text?: string;
  /** Structured paragraphs for assistant messages */
  paragraphs?: AnswerParagraph[];
  /** Sources that back this assistant turn (last assistant turn populates the rail) */
  sources?: Source[];
  trace?: Trace;
  /** Footnote disclaimer text (assistant only) */
  footnote?: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  messages: Message[];
  inputValue: string;
  /** Active RAG mode label */
  mode: string;
  isLoading: boolean;
  /** Which source card is highlighted (.hot) — driven by citation hover/click */
  activeSourceId: string | null;
}
