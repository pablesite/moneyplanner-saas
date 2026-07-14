import { describe, expect, it } from 'vitest';
import { budgetExpenseTiers, mergeTierCapitals } from '@/domains/plan/budgetMilestones';
import type { AnnualExpenseEntry } from '@/domains/budget/annual-entries';

function makeEntry(overrides: Partial<AnnualExpenseEntry>): AnnualExpenseEntry {
  return {
    id: 1,
    sourceLiabilityId: null,
    sourceAssetId: null,
    isSystemGenerated: false,
    name: 'Partida',
    category: 'consumption_expenses',
    subcategory: 'housing_home',
    owner: 'shared',
    expenseType: 'recurrent',
    timeProfile: 'structural_recurrent',
    cashflowRole: 'operating',
    eventGroup: '',
    isPlanManaged: false,
    planEventId: null,
    planEventName: null,
    targetMonth: null,
    termStartMonth: null,
    termEndMonth: null,
    termEndYear: null,
    amountInputPeriod: 'annual',
    amountAnnual: 0,
    fiscalYear: 2026,
    currency: 'EUR',
    notes: '',
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  } as AnnualExpenseEntry;
}

describe('budgetExpenseTiers', () => {
  it('acumula los tramos en orden con su equivalente mensual', () => {
    const entries = [
      makeEntry({ id: 1, subcategory: 'housing_home', amountAnnual: 12000 }),
      makeEntry({ id: 2, subcategory: 'transport_mobility', amountAnnual: 6000 }),
      makeEntry({ id: 3, subcategory: 'leisure_lifestyle', amountAnnual: 2400 }),
      makeEntry({
        id: 4,
        category: 'financial_investments',
        subcategory: 'index_funds',
        cashflowRole: 'investment',
        amountAnnual: 3600,
      }),
    ];
    const tiers = budgetExpenseTiers(entries, 2026);
    expect(tiers.map((tier) => tier.annualExpense)).toEqual([12000, 18000, 20400, 24000]);
    expect(tiers[0]!.monthlyExpense).toBeCloseTo(1000, 2);
    expect(tiers[3]!.monthlyExpense).toBeCloseTo(2000, 2);
  });

  it('omite tramos sin partidas para no duplicar puntos en el mismo sitio', () => {
    const entries = [
      makeEntry({ id: 1, subcategory: 'housing_home', amountAnnual: 12000 }),
      makeEntry({ id: 2, subcategory: 'gifts_donations', amountAnnual: 1200 }),
    ];
    const tiers = budgetExpenseTiers(entries, 2026);
    expect(tiers.map((tier) => tier.label)).toEqual([
      'Techo, comida, familia y salud',
      '+ Ocio y regalos',
    ]);
    expect(tiers[1]!.annualExpense).toBe(13200);
  });

  it('solo cuenta partidas recurrentes, activas y del año fiscal pedido', () => {
    const entries = [
      makeEntry({ id: 1, amountAnnual: 12000 }),
      makeEntry({ id: 2, amountAnnual: 5000, expenseType: 'one_off' }),
      makeEntry({ id: 3, amountAnnual: 7000, fiscalYear: 2025 }),
      makeEntry({ id: 4, amountAnnual: 3000, isActive: false }),
    ];
    const tiers = budgetExpenseTiers(entries, 2026);
    expect(tiers).toHaveLength(1);
    expect(tiers[0]!.annualExpense).toBe(12000);
  });
});

describe('mergeTierCapitals', () => {
  const tiers = [
    { label: 'Techo, comida, familia y salud', annualExpense: 12000, monthlyExpense: 1000 },
    { label: '+ Ocio y regalos', annualExpense: 13200, monthlyExpense: 1100 },
  ];

  it('casa tramos y capitales por posición y marca alcanzados y fuera de objetivo', () => {
    const result = mergeTierCapitals({
      tiers,
      requirements: [
        { monthly_amount_today_eur: '1000.00', capital_required_eur: '174467.46' },
        { monthly_amount_today_eur: '1100.00', capital_required_eur: '360000.00' },
      ],
      productiveCapital: 200000,
      targetCapital: 300000,
    });
    expect(result[0]!.capitalNeeded).toBeCloseTo(174467.46, 2);
    expect(result[0]!.reached).toBe(true);
    expect(result[0]!.positionPct).toBeCloseTo(58.16, 1);
    expect(result[1]!.reached).toBe(false);
    // 360.000 € sobre un objetivo de 300.000 € → 120 %: el consumidor lo pinta fuera.
    expect(result[1]!.positionPct).toBeGreaterThan(100);
  });

  it('devuelve vacío si la respuesta no casa con los tramos (mejor fallback que mezclar)', () => {
    expect(
      mergeTierCapitals({
        tiers,
        requirements: [{ monthly_amount_today_eur: '1000.00', capital_required_eur: '1' }],
        productiveCapital: 0,
        targetCapital: 300000,
      }),
    ).toEqual([]);
    expect(
      mergeTierCapitals({
        tiers: [],
        requirements: [],
        productiveCapital: 0,
        targetCapital: 300000,
      }),
    ).toEqual([]);
  });
});
