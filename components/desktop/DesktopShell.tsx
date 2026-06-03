'use client';
import { useRef } from 'react';
import type { Message, Source } from '@/lib/types';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { LiveIndicator } from '@/components/shared/LiveIndicator';
import { SourceCard } from '@/components/shared/SourceCard';
import { Citation } from '@/components/shared/Citation';

interface DesktopShellProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  messages: Message[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activeSourceId: string | null;
  onCitationHover: (id: string | null) => void;
  onCitationClick: (id: string) => void;
  currentSources: Source[];
  suggestedFollowups: string[];
  onChipClick: (q: string) => void;
}

export function DesktopShell({
  theme,
  onToggleTheme,
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  activeSourceId,
  onCitationHover,
  onCitationClick,
  currentSources,
  suggestedFollowups,
  onChipClick,
}: DesktopShellProps) {
  const railScrollRef = useRef<HTMLDivElement>(null);

  function handleCitationClick(sourceId: string) {
    onCitationClick(sourceId);
    // Smooth-scroll the rail to the matching card
    const card = document.getElementById(sourceId);
    if (card && railScrollRef.current) {
      railScrollRef.current.scrollTo({ top: card.offsetTop - 80, behavior: 'smooth' });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) onSubmit();
    }
  }

  // Group the flat message list into Q→A exchanges so each is ONE .cns-turn
  // (the handoff keeps question + trace + answer together; the hairline is the
  // .cns-turn + .cns-turn separator between exchanges, not between Q and A).
  const turnPairs: Array<{ user: Message; assistant?: Message }> = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role === 'user') {
      const next = messages[i + 1];
      turnPairs.push({ user: m, assistant: next?.role === 'assistant' ? next : undefined });
    }
  }

  return (
    <div className="organa-desktop-shell organa">
      <div className="cns-screen">

        {/* DEMO ribbon */}
        <div className="cns-ribbon">
          <span className="demo">Demo</span>
          <span className="txt">Vista de demostración · respuestas con cita canónica sobre <b>normativa chilena real</b>. Sin acceso a tu materia todavía.</span>
          <span className="sp" />
          <a className="cta" href="#">Solicitar acceso para tu estudio <span className="arr">→</span></a>
        </div>

        {/* Masthead */}
        <div className="cns-mast">
          <div className="cell brand">
            <span className="word">Organa</span><span className="cl">CL</span>
          </div>
          <div className="cell mode">
            <span className="glyph">§</span>
            <span className="nm">Consulta</span>
            <span className="sub">Investigación legal · RAG</span>
          </div>
          <div className="cell">
            <LiveIndicator label="Corpus vigente · 14 fuentes" />
          </div>
          <div className="cell r">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="desktop" />
          </div>
          <div className="cell">
            <span className="stamp">demo · v1.0</span>
          </div>
        </div>

        {/* Body */}
        <div className="cns-body">

          {/* Chat column */}
          <div className="cns-chat">
            <div className="cns-thread" role="log" aria-label="Conversación legal">
              <div className="cns-thread-inner">
                {turnPairs.map(({ user, assistant }) => (
                  <div key={user.id} className="cns-turn">
                    <div className="cns-q">
                      <span className="who">Consulta</span>
                      <span className="txt">{user.text}</span>
                    </div>

                    {assistant?.trace && (
                      <div className="cns-trace">
                        <span className="dot" />
                        <span>
                          recuperó <b>{assistant.trace.passages} pasajes</b>
                          {!assistant.trace.contextCarried && <> de <b>{assistant.trace.sources} fuentes</b></>}
                          {assistant.trace.detail && ` · ${assistant.trace.detail}`}
                          {assistant.trace.contextCarried && ' · contexto de la consulta anterior conservado'}
                          {' · p95 '}
                          <b>{(assistant.trace.latencyMs / 1000).toFixed(1)}&nbsp;s</b>
                        </span>
                      </div>
                    )}

                    {!assistant && isLoading && (
                      <div className="cns-trace">
                        <span className="dot" />
                        <span>recuperando pasajes…</span>
                      </div>
                    )}

                    {assistant && (
                      <div className="cns-a">
                        <span className="who">Organa</span>
                        <div className="body">
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
                                    variant="desktop"
                                    onMouseEnter={() => onCitationHover(seg.sourceId)}
                                    onClick={() => handleCitationClick(seg.sourceId)}
                                  />
                                );
                              })}
                            </p>
                          ))}
                          {assistant.footnote && (
                            <div className="cns-foot">
                              <span className="mk">§</span>
                              <span>{assistant.footnote}</span>
                              <span className="acts">
                                <span className="b" role="button" tabIndex={0}>copiar</span>
                                <span className="b" role="button" tabIndex={0}>exportar pdf</span>
                                <span className="b" role="button" tabIndex={0}>guardar</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested follow-ups */}
            <div className="cns-suggest">
              <span className="lbl">¶ Seguir consultando</span>
              {suggestedFollowups.map(q => (
                <button
                  key={q}
                  className="cns-chip"
                  type="button"
                  onClick={() => onChipClick(q)}
                >
                  <span className="mk">›</span>{q}
                </button>
              ))}
            </div>

            {/* Composer */}
            <div className="cns-composer">
              <div className="cns-composer-inner">
                <div className="cns-inputrow">
                  <span className="k">⌃K</span>
                  <span className="div" />
                  <div className="ph">
                    <textarea
                      value={inputValue}
                      onChange={e => onInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pregunta sobre normativa, jurisprudencia o dictámenes chilenos"
                      rows={1}
                      disabled={isLoading}
                      aria-label="Escribir consulta legal"
                    />
                  </div>
                  <span className="cns-modepill">Materia · Laboral</span>
                  <button
                    className="cns-send"
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading || !inputValue.trim()}
                    aria-label="Enviar consulta"
                  >
                    Consultar <span className="arr">↵</span>
                  </button>
                </div>
              </div>
              <div className="legalese">
                <span className="gd">§</span>
                <span>Cada respuesta enlaza su fuente canónica verificable · corpus al día · esto es una demostración · <span className="gd">no constituye asesoría legal</span></span>
              </div>
            </div>
          </div>

          {/* Source rail */}
          <aside className="cns-rail" aria-label="Fuentes recuperadas">
            <div className="cns-rail-head">
              <span className="ttl">Fuentes recuperadas</span>
              <span className="ct">{currentSources.length} · RAG</span>
            </div>
            <div className="cns-rail-scroll" ref={railScrollRef}>
              <div className="cns-rail-note">
                <span className="mk">§</span> Pasajes que Organa recuperó y citó. Cada cifra y afirmación de la respuesta enlaza a uno de estos. Ordenados por relevancia.
              </div>
              {[...currentSources].sort((a, b) => b.score - a.score).map(src => (
                <SourceCard
                  key={src.id}
                  source={src}
                  variant="desktop"
                  isActive={activeSourceId === src.id}
                  onClick={() => onCitationClick(src.id)}
                />
              ))}
              <div style={{ height: 24 }} />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
