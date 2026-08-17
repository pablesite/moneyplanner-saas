import { describe, expect, it } from 'vitest';
import { freshnessLabel, positionBaseValue, returnLabel } from '../presentation';
import type { PositionPerformance } from '../types';

describe('portfolio presentation', () => {
  it('keeps covered value visible without inventing a complete valuation', () => {
    const position = {
      performance: { closing_value: null, covered_closing_value: '123.45' },
    } as PositionPerformance;

    expect(positionBaseValue(position)).toBe(123.45);
  });

  it('explains freshness and estimated returns in product language', () => {
    expect(freshnessLabel('fresh')).toBe('Al día');
    expect(freshnessLabel('stale')).toBe('Desactualizada');
    expect(freshnessLabel('at_cost')).toBe('A coste');
    expect(freshnessLabel('missing')).toBe('Sin valoración');
    expect(returnLabel('linked_dietz', true)).toBe('TWR encadenada');
    expect(returnLabel('modified_dietz', true)).toBe('TWR estimada');
    expect(returnLabel('unavailable', false)).toBe('Rentabilidad no disponible');
  });
});
