/**
 * Test 1: Theme toggle
 * - Toggling sets data-theme="dark" on <html>
 * - Writes localStorage['organa-theme']
 * - Reading on mount restores the persisted value
 */
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/lib/useTheme';

const STORAGE_KEY = 'organa-theme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('defaults to light, no data-theme attribute', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current[0]).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBeNull();
});

test('toggle sets data-theme="dark" and writes localStorage', () => {
  const { result } = renderHook(() => useTheme());
  act(() => { result.current[1](); }); // toggle to dark
  expect(result.current[0]).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
});

test('toggle twice returns to light and removes data-theme', () => {
  const { result } = renderHook(() => useTheme());
  act(() => { result.current[1](); }); // → dark
  act(() => { result.current[1](); }); // → light
  expect(result.current[0]).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
});

test('reads dark from localStorage on mount', () => {
  localStorage.setItem(STORAGE_KEY, 'dark');
  const { result } = renderHook(() => useTheme());
  // useEffect fires after mount
  act(() => {}); // flush effects
  expect(result.current[0]).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});
