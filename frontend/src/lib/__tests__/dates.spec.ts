import { describe, expect, it } from 'vitest';
import { dateToIso, formatLongMonthYear, formatMonthYearLabel, parseIsoToDate } from '@/lib/dates';

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

  it('formats a long month/year label with a full year', () => {
    expect(formatLongMonthYear('2039-10-12')).toBe('octubre de 2039');
    expect(formatLongMonthYear('')).toBe('');
  });
});
