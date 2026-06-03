/**
 * Canned answers for fake interactivity.
 * Maps known question strings (normalized) → structured assistant responses.
 * Returns a generic fallback for any unrecognized input — never errors.
 */
import type { Message, Source } from './types';
import { SEED_SOURCES_T1 } from './seed';

/** Delay before the assistant "responds" — keeps UX believable without being slow. */
export const SIMULATED_LATENCY_MS = 800;

type CannedAnswer = Pick<Message, 'paragraphs' | 'sources' | 'trace' | 'footnote'>;

/** Normalize a question string for map lookup: lowercase, strip all punctuation, trim. */
function normalizeQ(q: string): string {
  return q.toLowerCase().replace(/[¿?.,;!¡()·]/g, '').replace(/\s+/g, ' ').trim();
}

const CANNED_SOURCES_REMUNERACION: Source[] = [
  {
    id: 'r1',
    ticker: 'CdT art. 172',
    kind: 'norma',
    title: 'Código del Trabajo · art. 172 — base de cálculo de la última remuneración',
    score: 0.94,
    snippet: '"…la última remuneración mensual comprenderá toda cantidad que estuviere percibiendo el trabajador por la prestación de sus servicios al momento del término, incluidas las imposiciones…"',
    kindLabel: 'norma · vigente',
  },
  {
    id: 'r2',
    ticker: 'DT 3519/054',
    kind: 'dt',
    title: 'Dirección del Trabajo · dictamen 3519/054 — elementos variables en base de cálculo',
    score: 0.86,
    snippet: '"…las horas extraordinarias, bonos de producción y comisiones habituales deben incluirse en el promedio de los últimos tres meses…"',
    kindLabel: 'dictamen †',
  },
];

const CANNED_SOURCES_AUTODESPIDO: Source[] = [
  {
    id: 'ad1',
    ticker: 'CdT art. 171',
    kind: 'norma',
    title: 'Código del Trabajo · art. 171 — autodespido o despido indirecto',
    score: 0.97,
    snippet: '"…el trabajador podrá reclamar el pago de las indemnizaciones establecidas en el inciso cuarto del artículo 162 y en el artículo 163, con el recargo del cincuenta por ciento…"',
    kindLabel: 'norma · vigente',
  },
  SEED_SOURCES_T1[1], // CdT art. 163
];

const CANNED_SOURCES_NULIDAD: Source[] = [
  {
    id: 'nb1',
    ticker: 'Ley 19.631',
    kind: 'norma',
    title: 'Ley 19.631 ("Ley Bustos") — despido sin pagos previsionales',
    score: 0.95,
    snippet: '"…el despido del trabajador no producirá el efecto de poner término al contrato de trabajo si el empleador no hubiere pagado íntegramente las cotizaciones…"',
    kindLabel: 'norma · vigente',
  },
  {
    id: 'nb2',
    ticker: 'CS 12.430-2021',
    kind: 'jur',
    title: 'Corte Suprema · rol 12.430-2021 — alcance de la nulidad del despido',
    score: 0.87,
    snippet: '"…la nulidad opera de pleno derecho ante la falta de pago de cotizaciones, obligando al empleador al pago de remuneraciones por el período de nulidad."',
    kindLabel: 'jurisprudencia ‡',
  },
];

const ANSWERS: Record<string, CannedAnswer> = {
  // Suggested chip 1
  'cómo se calcula la última remuneración mensual para el tope': {
    paragraphs: [
      {
        leadIn: 'La base de cálculo',
        segments: [
          { type: 'text', content: ' comprende toda cantidad percibida al momento del término del contrato por la prestación de servicios, incluidas las imposiciones y cotizaciones de previsión social ' },
          { type: 'citation', label: 'CdT art. 172', sourceId: 'r1', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'Los elementos variables —horas extraordinarias habituales, bonos de producción y comisiones— se promedian según los últimos tres meses de trabajo efectivo ' },
          { type: 'citation', label: 'Dictamen DT 3519/054', sourceId: 'r2', kind: 'dt' },
          { type: 'text', content: '. Quedan excluidos los gastos de representación, viáticos de libre disposición y beneficios en especie que no sean de naturaleza remuneratoria.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_REMUNERACION,
    trace: { passages: 4, sources: 2, latencyMs: 820, contextCarried: true },
    footnote: '2 fuentes citadas · norma vigente + dictamen DT · no constituye asesoría legal',
  },

  // Mobile chip variant (shorter text)
  'cálculo de la última remuneración': {
    paragraphs: [
      {
        leadIn: 'La base de cálculo',
        segments: [
          { type: 'text', content: ' comprende toda cantidad percibida al momento del término del contrato por la prestación de servicios ' },
          { type: 'citation', label: 'CdT art. 172', sourceId: 'r1', kind: 'norma' },
          { type: 'text', content: '. Los elementos variables —horas extra, bonos habituales, comisiones— se promedian en los últimos tres meses ' },
          { type: 'citation', label: 'Dictamen DT 3519/054', sourceId: 'r2', kind: 'dt' },
          { type: 'text', content: '.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_REMUNERACION,
    trace: { passages: 3, sources: 2, latencyMs: 780, contextCarried: true },
    footnote: '2 fuentes citadas · no constituye asesoría legal',
  },

  // Suggested chip 2
  'procede el autodespido del art 171 en este caso': {
    paragraphs: [
      {
        leadIn: 'Sí procede el autodespido',
        segments: [
          { type: 'text', content: ' (o despido indirecto) si el empleador incurre en alguna de las causales del art. 160 que hagan intolerable la continuación del contrato. En ese caso, el trabajador puede invocar el art. 171 ' },
          { type: 'citation', label: 'CdT art. 171', sourceId: 'ad1', kind: 'norma' },
          { type: 'text', content: ' y reclamar las mismas indemnizaciones que en el despido injustificado, con un recargo del 50% sobre la indemnización por años de servicio ' },
          { type: 'citation', label: 'CdT art. 163', sourceId: 's2', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'El plazo de 60 días hábiles del art. 168 se aplica también en el autodespido, contados desde que el trabajador pone término al contrato.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_AUTODESPIDO,
    trace: { passages: 4, sources: 2, latencyMs: 750, contextCarried: true },
    footnote: '2 fuentes citadas · norma vigente · no constituye asesoría legal',
  },

  // Mobile chip variant
  'autodespido art 171': {
    paragraphs: [
      {
        leadIn: 'Sí procede el autodespido',
        segments: [
          { type: 'text', content: ' del art. 171 si el empleador incurre en causales del art. 160 ' },
          { type: 'citation', label: 'CdT art. 171', sourceId: 'ad1', kind: 'norma' },
          { type: 'text', content: '. El trabajador puede pedir las mismas indemnizaciones con recargo del 50% sobre años de servicio ' },
          { type: 'citation', label: 'CdT art. 163', sourceId: 's2', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_AUTODESPIDO,
    trace: { passages: 3, sources: 2, latencyMs: 730, contextCarried: true },
    footnote: '2 fuentes citadas · no constituye asesoría legal',
  },

  // Suggested chip 3
  'compara con la nulidad del despido ley bustos': {
    paragraphs: [
      {
        leadIn: 'La Ley Bustos (Ley 19.631)',
        segments: [
          { type: 'text', content: ' dispone que el despido no produce efecto de término si el empleador no ha pagado íntegramente las cotizaciones previsionales al momento del despido ' },
          { type: 'citation', label: 'Ley 19.631', sourceId: 'nb1', kind: 'norma' },
          { type: 'text', content: '.' },
        ],
      },
      {
        segments: [
          { type: 'text', content: 'A diferencia del despido injustificado —que solo genera indemnizaciones tasadas—, la nulidad del despido obliga al empleador a pagar todas las remuneraciones del período durante el cual el contrato se mantuvo nominalmente vigente, hasta convalidar el despido pagando las cotizaciones adeudadas ' },
          { type: 'citation', label: 'CS rol 12.430-2021', sourceId: 'nb2', kind: 'jur' },
          { type: 'text', content: '. Ambas acciones pueden coexistir si hay deuda previsional Y el despido fue injustificado.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_NULIDAD,
    trace: { passages: 4, sources: 2, latencyMs: 860, contextCarried: true },
    footnote: '2 fuentes citadas · norma vigente + jurisprudencia CS · no constituye asesoría legal',
  },

  // Mobile chip variant
  'nulidad del despido ley bustos': {
    paragraphs: [
      {
        leadIn: 'La Ley Bustos (Ley 19.631)',
        segments: [
          { type: 'text', content: ' suspende los efectos del despido si el empleador no ha pagado las cotizaciones previsionales ' },
          { type: 'citation', label: 'Ley 19.631', sourceId: 'nb1', kind: 'norma' },
          { type: 'text', content: '. A diferencia del despido injustificado, la nulidad genera derecho a remuneraciones del período completo de nulidad ' },
          { type: 'citation', label: 'CS rol 12.430-2021', sourceId: 'nb2', kind: 'jur' },
          { type: 'text', content: '.' },
        ],
      },
    ],
    sources: CANNED_SOURCES_NULIDAD,
    trace: { passages: 3, sources: 2, latencyMs: 830, contextCarried: true },
    footnote: '2 fuentes citadas · no constituye asesoría legal',
  },
};

/** Generic fallback for unrecognized questions — always returns a plausible structured answer. */
const FALLBACK_ANSWER: CannedAnswer = {
  paragraphs: [
    {
      segments: [
        { type: 'text', content: 'Esta consulta requiere cruzar normativa laboral vigente con jurisprudencia reciente. En materia de derecho del trabajo chileno, el Código del Trabajo establece el marco general ' },
        { type: 'citation', label: 'CdT art. 168', sourceId: 's1', kind: 'norma' },
        { type: 'text', content: ', mientras que los dictámenes de la Dirección del Trabajo y la jurisprudencia de la Corte Suprema precisar su alcance práctico ' },
        { type: 'citation', label: 'CS rol 38.451-2022', sourceId: 's4', kind: 'jur' },
        { type: 'text', content: '.' },
      ],
    },
    {
      segments: [
        { type: 'text', content: 'Para una respuesta precisa sobre este punto, Organa recuperaría los pasajes relevantes de la normativa vigente y los contrastaría con la jurisprudencia actual. Esta es una demostración con datos de ejemplo.' },
      ],
    },
  ],
  sources: [SEED_SOURCES_T1[0], SEED_SOURCES_T1[3]],
  trace: { passages: 2, sources: 2, latencyMs: 790, contextCarried: false },
  footnote: '2 fuentes citadas · esto es una demostración · no constituye asesoría legal',
};

/**
 * Look up a canned answer by question text.
 * Falls back to the generic response rather than throwing.
 */
export function getCannedAnswer(question: string): CannedAnswer {
  const key = normalizeQ(question);
  // Exact match first
  if (ANSWERS[key]) return ANSWERS[key];
  // Partial match: check if any registered key is contained in the question
  for (const [k, v] of Object.entries(ANSWERS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return FALLBACK_ANSWER;
}
