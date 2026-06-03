'use client';
import type { Message, Source } from '@/lib/types';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SourceCard } from '@/components/shared/SourceCard';
import { Citation } from '@/components/shared/Citation';
import { SignalIcon, WifiIcon, SendArrowIcon } from '@/components/shared/Icons';

interface MobileShellProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  suggestedFollowups: string[];
  onChipClick: (q: string) => void;
}

export function MobileShell({
  theme,
  onToggleTheme,
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  suggestedFollowups,
  onChipClick,
}: MobileShellProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) onSubmit();
    }
  }

  // Build turn pairs: find user turns and their following assistant answer
  const turnPairs: Array<{ user: Message; assistant?: Message; sources?: Source[] }> = [];
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'user') {
      const next = messages[i + 1];
      turnPairs.push({
        user: msg,
        assistant: next?.role === 'assistant' ? next : undefined,
        sources: next?.role === 'assistant' ? next.sources : undefined,
      });
    }
  }

  return (
    <div className="organa-mobile-shell morg">
      <div className="m-app">

        {/* Faux status bar */}
        <div className="m-status">
          <span className="clock">9:41</span>
          <span className="live">CONSULTA · DEMO</span>
          <span className="sp" />
          <span className="sig">
            <SignalIcon />
            <WifiIcon />
            <span className="bat"><i /></span>
          </span>
        </div>

        {/* DEMO ribbon */}
        <a className="mc-ribbon" href="#">
          <span className="demo">Demo</span>
          <span className="txt">Demostración con <b>normativa chilena real</b>. Solicita acceso para tu propia materia.</span>
          <span className="arr">→</span>
        </a>

        {/* App bar */}
        <header className="m-appbar">
          <div className="ab-title-wrap">
            <div className="ab-kicker"><span style={{ color: 'var(--guinda)' }}>§</span> Investigación legal · RAG</div>
            <div className="ab-title">Consulta</div>
          </div>
          <div className="ab-actions">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="mobile" />
          </div>
        </header>

        {/* Scroll area */}
        <main className="m-scroll" role="log" aria-label="Conversación legal">

          {turnPairs.map(({ user, assistant, sources }) => (
            <div key={user.id} className="mc-turn">
              {/* User question */}
              <div className="mc-q">
                <div className="who">Consulta</div>
                <div className="txt">{user.text}</div>
              </div>

              {/* Trace line */}
              {assistant?.trace && (
                <div className="mc-trace">
                  <span className="dot" />
                  <span>
                    recuperó <b>{assistant.trace.passages} pasajes</b>
                    {!assistant.trace.contextCarried && <> · <b>{assistant.trace.sources} fuentes</b></>}
                    {assistant.trace.detail && ` · ${assistant.trace.detail}`}
                    {assistant.trace.contextCarried && ' · contexto conservado'}
                    {' · p95 '}
                    <b>{(assistant.trace.latencyMs / 1000).toFixed(1)}&nbsp;s</b>
                  </span>
                </div>
              )}

              {/* Loading trace — same turn as the just-asked question */}
              {!assistant && isLoading && (
                <div className="mc-trace">
                  <span className="dot" />
                  <span>recuperando pasajes…</span>
                </div>
              )}

              {/* Assistant answer */}
              {assistant && (
                <div className="mc-a">
                  <div className="who">Organa</div>
                  {assistant.paragraphs?.map((para, pi) => (
                    <p key={pi}>
                      {para.leadIn && <span className="lead-in">{para.leadIn}</span>}
                      {para.segments.map((seg, si) => {
                        if (seg.type === 'text') return <span key={si}>{seg.content}</span>;
                        if (seg.type === 'bold') return <b key={si}>{seg.content}</b>;
                        return (
                          <Citation
                            key={si}
                            label={seg.label}
                            sourceId={seg.sourceId}
                            kind={seg.kind}
                            variant="mobile"
                          />
                        );
                      })}
                    </p>
                  ))}

                  {/* Collapsible fuentes */}
                  {sources && sources.length > 0 && (
                    <details className="mc-fuentes" open>
                      <summary>
                        <span className="mk">§</span>
                        {' Fuentes citadas '}
                        <span className="ct">{sources.length}</span>
                        <span className="chev">›</span>
                      </summary>
                      {[...sources].sort((a, b) => b.score - a.score).map(src => (
                        <SourceCard
                          key={src.id}
                          source={src}
                          variant="mobile"
                          isActive={false}
                        />
                      ))}
                    </details>
                  )}
                  <div style={{ height: 2 }} />
                </div>
              )}
            </div>
          ))}

          {/* Disclaimer */}
          <div className="mc-disc">
            <span className="mk">§</span>
            <span>Cada respuesta enlaza su fuente canónica verificable · corpus al día · esto es una demostración y no constituye asesoría legal.</span>
          </div>

          {/* Suggested follow-ups */}
          <div className="mc-suggest">
            <div className="lbl">¶ Seguir consultando</div>
            <div className="row">
              {suggestedFollowups.map(q => (
                <button
                  key={q}
                  className="mc-sg"
                  type="button"
                  onClick={() => onChipClick(q)}
                  aria-label={`Preguntar: ${q}`}
                >
                  <span className="mk">›</span>{q}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 8 }} />
        </main>

        {/* Composer */}
        <div className="mc-composer">
          <div className="mc-inputrow">
            <div className="ph">
              <textarea
                value={inputValue}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre normativa chilena"
                rows={1}
                disabled={isLoading}
                aria-label="Escribir consulta legal"
              />
            </div>
            <button
              className="send"
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Consultar"
            >
              <SendArrowIcon />
            </button>
          </div>
          <div className="legalese">
            <span className="gd">§</span>
            <span>cita canónica en cada respuesta · <span className="gd">no constituye asesoría legal</span></span>
          </div>
        </div>

      </div>
    </div>
  );
}
