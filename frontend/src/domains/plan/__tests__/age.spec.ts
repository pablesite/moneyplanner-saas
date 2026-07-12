import { describe, expect, it } from 'vitest';
import { ageInYear, compactYearWithAges, yearWithAges } from '@/domains/plan/age';
import type { PlanMember } from '@/domains/plan/types';

function member(name: string, birthDate: string | null): PlanMember {
  return {
    id: 1,
    name,
    role: 'adult',
    is_active: true,
    birth_date: birthDate,
    employment_income_end_date: null,
    pension_start_date: null,
    estimated_monthly_pension_today_eur: null,
    other_future_income_today_eur: null,
  };
}

describe('plan age labels', () => {
  it('calculates age in a projected year', () => {
    expect(ageInYear('1982-07-11', 2049)).toBe(67);
  });

  it('labels a year with both adults when available', () => {
    const members = [member('Pablo', '1982-07-11'), member('Ana', '1984-03-02')];

    expect(yearWithAges(2049, members)).toBe('2049 · Pablo 67 años · Ana 65 años');
    expect(compactYearWithAges(2049, members)).toBe('2049 · 67/65 años');
  });

  it('keeps the year readable when birth dates are missing', () => {
    expect(yearWithAges(2049, [member('Pablo', null)])).toBe('2049');
    expect(yearWithAges(null, [])).toBe('Sin fecha');
  });
});
