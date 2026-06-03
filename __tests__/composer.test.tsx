/**
 * Test 2: Composer / fake interactivity
 * - Submitting a question appends a user turn immediately
 * - After simulated latency (fake timers), an assistant turn is appended
 *   whose text comes from the canned response
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import ConsultaApp from '@/components/ConsultaApp';

// Mock next/font/google to avoid font network calls in tests
vi.mock('next/font/google', () => ({
  Fraunces: () => ({ variable: '--font-fraunces', className: '' }),
  Geist: () => ({ variable: '--font-geist', className: '' }),
  JetBrains_Mono: () => ({ variable: '--font-jetbrains-mono', className: '' }),
}));

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  vi.useRealTimers();
});

test('submitting a question appends user turn then assistant turn from canned answers', async () => {
  render(<ConsultaApp />);

  // Find the desktop textarea (the first one in the DOM)
  const textareas = screen.getAllByRole('textbox');
  const textarea = textareas[0];

  // Type a known question that matches a canned answer
  fireEvent.change(textarea, { target: { value: 'Nulidad del despido (Ley Bustos)' } });

  // Submit via the send button
  const sendButtons = screen.getAllByRole('button', { name: /consultar/i });
  fireEvent.click(sendButtons[0]);

  // User message should appear immediately
  expect(screen.getAllByText(/Nulidad del despido/i).length).toBeGreaterThan(0);

  // Advance fake timers past the simulated latency
  await act(async () => {
    vi.advanceTimersByTime(1000);
  });

  // Assistant message should now contain content from the canned Ley Bustos answer.
  // Use getAllByText because both desktop + mobile shells render the same content.
  const leyBustosNodes = screen.getAllByText(/Ley Bustos/i, { exact: false });
  expect(leyBustosNodes.length).toBeGreaterThan(0);

  // Ley 19.631 appears as a citation label in the canned Ley Bustos response.
  // Use a function matcher since the text may live inside a <span class="cns-cref">.
  const hasLey19 = document.documentElement.textContent?.includes('Ley 19.631') ?? false;
  expect(hasLey19).toBe(true);
});
