import { describe, expect, it } from 'vitest';
import { dateToIso, formatMonthYearLabel, parseIsoToDate } from '@/lib/dates';

describe('date helpers', () => {
  it('parses an ISO date as local midnight and round-trips back', () => {
    const date = parseIsoToDate('2026-03-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(15);
    expect(dateToIso(date)).toBe('2026-03-15');
  });

  it('formats a short month/year label', () => {
    expect(formatMonthYearLabel('2026-01-01')).toMatch(/26/);
  });
});
