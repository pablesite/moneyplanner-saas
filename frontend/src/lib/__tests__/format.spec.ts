import { describe, expect, it } from 'vitest';
import {
  currencySymbol,
  formatAmount,
  formatCompact,
  formatMoney,
  formatNumber,
  formatPct,
  getMaxDecimals,
  normalizeNumberInput,
  toNumber,
} from '@/lib/format';

describe('format helpers', () => {
  it('normalizes number input with spaces and commas', () => {
    expect(normalizeNumberInput(' 1 234,56 ')).toBe('1234.56');
    expect(normalizeNumberInput(undefined)).toBe('');
  });

  it('resolves max decimals by currency with fallback', () => {
    expect(getMaxDecimals('EUR')).toBe(2);
    expect(getMaxDecimals('BTC')).toBe(8);
    expect(getMaxDecimals('UNKNOWN')).toBe(2);
    expect(getMaxDecimals()).toBe(2);
  });

  it('formats amount and money values', () => {
    expect(formatAmount('1234,567', { currency: 'EUR' })).toBe('1.234,57');
    expect(formatAmount('0.12345678', { currency: 'BTC' })).toBe('0,12345678');
    expect(formatAmount('abc')).toBe('abc');

    const eur = formatMoney('1234,5', 'EUR');
    const usd = formatMoney('1234,5', 'USD');
    expect(eur).toContain('1.234,50');
    expect(usd).toContain('1.234,50');
    expect(formatMoney('abc')).toBe('abc');
  });

  it('parses numbers safely with comma/space tolerance', () => {
    expect(toNumber(' 1 234,56 ')).toBe(1234.56);
    expect(toNumber('1.5')).toBe(1.5);
    expect(toNumber('abc')).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });

  it('formats numbers with fixed decimals and grouping', () => {
    expect(formatNumber(1234.5)).toBe('1.234,50');
    expect(formatNumber(1234.5, 0)).toBe('1.235');
  });

  it('formats percentage ratios', () => {
    expect(formatPct(0.1234, 1).replace(/\s/u, ' ')).toBe('12,3 %');
    expect(formatPct(null)).toBe('-');
    expect(formatPct(Number.NaN)).toBe('-');
  });

  it('formats compact magnitudes', () => {
    expect(formatCompact(950)).toBe('950');
    expect(formatCompact(1500)).toBe('1,5k');
    expect(formatCompact(2_300_000)).toBe('2,3M');
    expect(formatCompact(4_000_000_000)).toBe('4,0B');
  });

  it('resolves a short currency symbol', () => {
    expect(currencySymbol('EUR')).toBe('€');
    expect(currencySymbol('USD')).toBe('USD');
    expect(currencySymbol(null)).toBe('');
  });
});
