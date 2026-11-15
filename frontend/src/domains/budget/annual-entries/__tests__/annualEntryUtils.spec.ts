import { describe, expect, it } from 'vitest';
import {
  amountInputValueFromStoredAnnual,
  effectiveAnnualAmountForEntry,
  normalizeOwnerName,
  parseAnnualAmount,
  termEntryActiveMonths,
} from '../annualEntryUtils';

describe('annualEntryUtils (core)', () => {
  it('parses annual amounts with locale/thousand separators', () => {
    expect(parseAnnualAmount('1.234,56')).toBe(1234.56);
    expect(parseAnnualAmount('1,234.56')).toBe(1234.56);
    expect(parseAnnualAmount(' 2 500,00 ')).toBe(2500);
  });

  it('returns zero for invalid or non-positive amounts', () => {
    expect(parseAnnualAmount('0')).toBe(0);
    expect(parseAnnualAmount('-20')).toBe(0);
    expect(parseAnnualAmount('abc')).toBe(0);
  });

  it('normalizes owner name safely', () => {
    expect(normalizeOwnerName('   Ana   LÃ³pez   ')).toBe('Ana LÃ³pez');
  });

  it('scales monthly temporary commitments to active months in the selected fiscal year', () => {
    expect(
      effectiveAnnualAmountForEntry({
        amountAnnual: 16488,
        amountInputPeriod: 'monthly',
        timeProfile: 'term_recurrent',
        termEndMonth: 9,
        termEndYear: 2026,
        fiscalYear: 2026,
      }),
    ).toBe(12366);
  });

  it('recovers the original monthly input for monthly temporary commitments', () => {
    expect(
      amountInputValueFromStoredAnnual(
        {
          amountAnnual: 16488,
          amountInputPeriod: 'monthly',
          timeProfile: 'term_recurrent',
          termEndMonth: 9,
          termEndYear: 2026,
          fiscalYear: 2026,
        },
        'monthly',
      ),
    ).toBe('1374');
  });

  it('prorates each year of a monthly term that spans several years', () => {
    // 36 cuotas de 36,99 € de noviembre de 2026 a octubre de 2029.
    const renting = {
      amountAnnual: 443.88,
      amountInputPeriod: 'monthly' as const,
      timeProfile: 'term_recurrent',
      termStartMonth: 11,
      termEndMonth: 10,
      termEndYear: 2029,
      fiscalYear: 2026,
    };

    expect(termEntryActiveMonths(renting, 2026)).toEqual({ startMonth: 11, endMonth: 12 });
    expect(termEntryActiveMonths(renting, 2027)).toEqual({ startMonth: 1, endMonth: 12 });
    expect(termEntryActiveMonths(renting, 2029)).toEqual({ startMonth: 1, endMonth: 10 });
    expect(effectiveAnnualAmountForEntry(renting, 2026)).toBe(73.98);
    expect(effectiveAnnualAmountForEntry(renting, 2027)).toBe(443.88);
    expect(effectiveAnnualAmountForEntry(renting, 2029)).toBe(369.9);
  });

  it('keeps an annual term amount whole while spreading it over its active months', () => {
    const entry = {
      amountAnnual: 1200,
      amountInputPeriod: 'annual' as const,
      timeProfile: 'term_recurrent',
      termStartMonth: 3,
      termEndMonth: 6,
      termEndYear: 2026,
      fiscalYear: 2026,
    };

    expect(effectiveAnnualAmountForEntry(entry, 2026)).toBe(1200);
    expect(termEntryActiveMonths(entry, 2026)).toEqual({ startMonth: 3, endMonth: 6 });
  });
});
