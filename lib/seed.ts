/**
 * Seed data — the TWO opening turns from the handoff HTML, copied verbatim.
 * Legal prose, tickers, titles, scores, and snippets match exactly.
 */
import type { Message, Source } from './types';

export const SEED_SOURCES_T1: Source[] = [
  {
    id: 's1',
    ticker: 'CdT art. 168',
    kind: 'norma',
    title: 'Código del Trabajo · art. 168 — reclamo y recargos del despido',
    score: 0.96,
    snippet: '"…dentro del plazo de sesenta días hábiles, contado desde la separación… el plazo se suspenderá cuando… no pudiendo exceder de noventa días hábiles."',
    kindLabel: 'norma · vigente',
  },
  {
    id: 's2',
    ticker: 'CdT art. 163',
    kind: 'norma',
    title: 'Código del Trabajo · art. 163 — indemnización por años de servicio',
    score: 0.93,
    snippet: '"…treinta días de la última remuneración mensual devengada por cada año de servicio y fracción superior a seis meses… con un límite máximo de trescientos treinta días."',
    kindLabel: 'norma · vigente',
  },
  {
    id: 's3',
    ticker: 'CdT art. 162',
    kind: 'norma',
    title: 'Código del Trabajo · art. 162 — aviso previo y sustitución',
    score: 0.88,
    snippet: '"…si el empleador no diere el aviso con treinta días de anticipación, deberá pagar una indemnización en dinero efectivo sustitutiva…"',
    kindLabel: 'norma · vigente',
  },
  {
    id: 's4',
    ticker: 'CS 38.451-2022',
    kind: 'jur',
    title: 'Corte Suprema · rol 38.451-2022 — tope del plazo suspendido',
    score: 0.82,
    snippet: '"…el límite de noventa días hábiles opera como tope absoluto, sin que la prolongación del reclamo administrativo lo extienda."',
    kindLabel: 'jurisprudencia ‡',
  },
  {
    id: 's5',
    ticker: 'DT 1086/027',
    kind: 'dt',
    title: 'Dirección del Trabajo · dictamen 1086/027 — despido de aforado',
    score: 0.79,
    snippet: '"…el término de contrato de un trabajador con fuero sin autorización judicial previa es nulo, procediendo su reincorporación…"',
    kindLabel: 'dictamen †',
  },
  {
    id: 's6',
    ticker: 'CdT art. 174',
    kind: 'norma',
    title: 'Código del Trabajo · art. 174 — desafuero',
    score: 0.77,
    snippet: '"…el empleador no podrá poner término al contrato sino con autorización previa del juez competente, quien podrá concederla…"',
    kindLabel: 'norma · vigente',
  },
];

export const SEED_SOURCES_T2: Source[] = [
  SEED_SOURCES_T1[5], // s6 CdT art. 174
  SEED_SOURCES_T1[4], // s5 DT 1086/027
];

export const SEED_MESSAGES: Message[] = [
  // Turn 1 — user question
  {
    id: 'u1',
    role: 'user',
    text: '¿Qué plazo tengo para demandar un despido injustificado y qué indemnizaciones corresponden?',
  },
  // Turn 1 — assistant answer
  {
    id: 'a1',
    role: 'assistant',
    paragraphs: [
      {
        leadIn: 'El plazo es de 60 días hábiles',
        segments: [
          { type: 'text', content: ' contados desde la separación para reclamar que el despido fue injustificado, indebido o improcedente ' },
          { type: 'citation', label: 'CdT art. 168', sourceId: 's1', kind: 'norma' },
          { type: 'text', content: '. Ese plazo se suspende cuando interpones reclamo ante la Inspección del Trabajo y se reanuda al concluir ese trámite, sin que en ningún caso pueda exceder de 90 días hábiles ' },
          { type: 'citation', label: 'art. 168 inc. final', sourceId: 's1', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'Si el tribunal acoge la demanda, el empleador debe pagar la indemnización sustitutiva del aviso previo cuando no se dio el aviso de 30 días ' },
          { type: 'citation', label: 'art. 162', sourceId: 's3', kind: 'norma' },
          { type: 'text', content: ', más la indemnización por años de servicio: 30 días de la última remuneración mensual por cada año trabajado y fracción superior a seis meses, con un tope de 11 años ' },
          { type: 'citation', label: 'art. 163', sourceId: 's2', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'Esa indemnización por años de servicio se incrementa con un recargo según la causal: ' },
          { type: 'bold', content: '30%' },
          { type: 'text', content: ' si se aplicó indebidamente el art. 161; ' },
          { type: 'bold', content: '50%' },
          { type: 'text', content: ' si no se invocó causal alguna; ' },
          { type: 'bold', content: '80%' },
          { type: 'text', content: ' tratándose de las causales del art. 160; y hasta ' },
          { type: 'bold', content: '100%' },
          { type: 'text', content: ' cuando las causales del art. 160 N°1, 5 o 6 se declaran carentes de motivo plausible ' },
          { type: 'citation', label: 'art. 168 letras a–c', sourceId: 's1', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'La Corte Suprema ha reiterado que el tope de 90 días opera como límite absoluto del plazo suspendido, aun cuando el reclamo administrativo se prolongue ' },
          { type: 'citation', label: 'CS rol 38.451-2022', sourceId: 's4', kind: 'jur' },
          { type: 'text', content: '.' },
        ],
      },
    ],
    // Turn 1 cites arts. 168/163/162 + the CS ruling → its 4 backing sources (s1–s4),
    // matching the "4 fuentes citadas" footnote. The desktop rail unions all turns'
    // sources, so s5/s6 (turn 2) still surface there for the full 6-source mockup.
    sources: SEED_SOURCES_T1.slice(0, 4),
    trace: { passages: 6, sources: 4, latencyMs: 1800, detail: 'Código del Trabajo · jurisprudencia CS · dictámenes DT' },
    footnote: '4 fuentes citadas · verificables en el panel derecho · Organa cita la fuente, no constituye asesoría legal',
  },
  // Turn 2 — user follow-up
  {
    id: 'u2',
    role: 'user',
    text: '¿Y si el trabajador tenía fuero?',
  },
  // Turn 2 — assistant answer
  {
    id: 'a2',
    role: 'assistant',
    paragraphs: [
      {
        segments: [
          { type: 'text', content: 'Si el trabajador gozaba de fuero —por ejemplo fuero maternal o sindical— el empleador no puede poner término al contrato sino con autorización judicial previa, mediante el juicio de desafuero ' },
          { type: 'citation', label: 'CdT art. 174', sourceId: 's6', kind: 'norma' },
          { type: 'text', content: '. El despido practicado sin esa autorización es nulo: procede la reincorporación y el pago de las remuneraciones del período en que estuvo separado ' },
          { type: 'citation', label: 'Dictamen DT 1086/027', sourceId: 's5', kind: 'dt' },
          { type: 'text', content: '.' },
        ],
      },
    ],
    sources: SEED_SOURCES_T2,
    trace: { passages: 3, sources: 2, latencyMs: 1400, contextCarried: true },
    footnote: '2 fuentes citadas · norma vigente + dictamen DT',
  },
];
