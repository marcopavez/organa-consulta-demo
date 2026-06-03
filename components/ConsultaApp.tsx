'use client';
import { useState, useCallback } from 'react';
import { useTheme } from '@/lib/useTheme';
import { SEED_MESSAGES } from '@/lib/seed';
import { getCannedAnswer, SIMULATED_LATENCY_MS } from '@/lib/canned';
import type { Message, Source } from '@/lib/types';
import { DesktopShell } from '@/components/desktop/DesktopShell';
import { MobileShell } from '@/components/mobile/MobileShell';

const SUGGESTED_DESKTOP = [
  '¿Cómo se calcula la última remuneración mensual para el tope?',
  '¿Procede el autodespido del art. 171 en este caso?',
  'Compara con la nulidad del despido (Ley Bustos)',
];

const SUGGESTED_MOBILE = [
  'Cálculo de la última remuneración',
  'Autodespido art. 171',
  'Nulidad del despido (Ley Bustos)',
];

/** All distinct sources cited across the conversation, highest score first.
 *  The desktop rail aggregates every turn's sources (the mockup shows all 6),
 *  not just the latest answer's. */
function getConversationSources(messages: Message[]): Source[] {
  const byId = new Map<string, Source>();
  for (const m of messages) {
    if (m.role === 'assistant' && m.sources) {
      for (const s of m.sources) if (!byId.has(s.id)) byId.set(s.id, s);
    }
  }
  return [...byId.values()].sort((a, b) => b.score - a.score);
}

let idCounter = 100; // simple monotonic ID (no crypto in test env)
function nextId(): string {
  return String(++idCounter);
}

export default function ConsultaApp() {
  const [theme, toggleTheme] = useTheme();
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Highlight the top-scored source on first paint (the mockup shows s1 .hot).
  const [activeSourceId, setActiveSourceId] = useState<string | null>(
    () => getConversationSources(SEED_MESSAGES)[0]?.id ?? null,
  );

  const currentSources = getConversationSources(messages);

  const submitQuestion = useCallback((question: string) => {
    const q = question.trim();
    if (!q || isLoading) return;

    const userMsg: Message = { id: nextId(), role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Simulate retrieval latency, then append canned assistant answer
    setTimeout(() => {
      const canned = getCannedAnswer(q);
      const assistantMsg: Message = {
        id: nextId(),
        role: 'assistant',
        paragraphs: canned.paragraphs,
        sources: canned.sources,
        trace: canned.trace,
        footnote: canned.footnote,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, SIMULATED_LATENCY_MS);
  }, [isLoading]);

  const handleSubmit = useCallback(() => {
    submitQuestion(inputValue);
  }, [inputValue, submitQuestion]);

  const handleChipClick = useCallback((q: string) => {
    submitQuestion(q);
  }, [submitQuestion]);

  const handleCitationHover = useCallback((id: string | null) => {
    setActiveSourceId(id);
  }, []);

  const handleCitationClick = useCallback((id: string) => {
    setActiveSourceId(id);
  }, []);

  return (
    <>
      <DesktopShell
        theme={theme}
        onToggleTheme={toggleTheme}
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        activeSourceId={activeSourceId}
        onCitationHover={handleCitationHover}
        onCitationClick={handleCitationClick}
        currentSources={currentSources}
        suggestedFollowups={SUGGESTED_DESKTOP}
        onChipClick={handleChipClick}
      />
      <MobileShell
        theme={theme}
        onToggleTheme={toggleTheme}
        messages={messages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        suggestedFollowups={SUGGESTED_MOBILE}
        onChipClick={handleChipClick}
      />
    </>
  );
}
