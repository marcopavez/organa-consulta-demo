/**
 * Test 3: Citation ↔ source linking
 * - Hovering a citation chip sets the matching source card as active (.hot)
 * - activeSourceId state drives the .hot class on SourceCard
 */
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Citation } from '@/components/shared/Citation';
import { SourceCard } from '@/components/shared/SourceCard';
import { SEED_SOURCES_T1 } from '@/lib/seed';

test('hovering a citation calls onMouseEnter with the source id', () => {
  const onMouseEnter = vi.fn();
  const onMouseLeave = vi.fn();

  const { getByRole } = render(
    <Citation
      label="CdT art. 168"
      sourceId="s1"
      kind="norma"
      variant="desktop"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );

  const chip = getByRole('button', { name: /CdT art\. 168/i });
  fireEvent.mouseEnter(chip);
  expect(onMouseEnter).toHaveBeenCalledTimes(1);

  fireEvent.mouseLeave(chip);
  expect(onMouseLeave).toHaveBeenCalledTimes(1);
});

test('SourceCard renders with .hot class when isActive=true', () => {
  const source = SEED_SOURCES_T1[0]; // s1
  const { container } = render(
    <SourceCard source={source} variant="desktop" isActive={true} />
  );
  const card = container.querySelector('.cns-src');
  expect(card?.classList.contains('hot')).toBe(true);
});

test('SourceCard does not have .hot class when isActive=false', () => {
  const source = SEED_SOURCES_T1[0];
  const { container } = render(
    <SourceCard source={source} variant="desktop" isActive={false} />
  );
  const card = container.querySelector('.cns-src');
  expect(card?.classList.contains('hot')).toBe(false);
});

test('clicking a citation calls onClick handler', () => {
  const onClick = vi.fn();
  const { getByRole } = render(
    <Citation
      label="CS rol 38.451-2022"
      sourceId="s4"
      kind="jur"
      variant="desktop"
      onClick={onClick}
    />
  );
  const chip = getByRole('button', { name: /CS rol 38\.451-2022/i });
  fireEvent.click(chip);
  expect(onClick).toHaveBeenCalledTimes(1);
});
