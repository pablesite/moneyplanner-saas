import { describe, expect, it } from 'vitest';
import { budgetCapitalMilestones } from '@/domains/plan/budgetMilestones';
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

const baseInput = {
  fiscalYear: 2026,
  withdrawalRate: 0.035,
  productiveCapital: 0,
  targetCapital: 300000,
};

describe('budgetCapitalMilestones', () => {
  it('acumula los tramos en orden y traduce gasto anual a capital con la tasa de retirada', () => {
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
    const result = budgetCapitalMilestones({ ...baseInput, entries, productiveCapital: 400000 });
    expect(result.map((m) => m.annualExpense)).toEqual([12000, 18000, 20400, 24000]);
    expect(result[0]!.capitalNeeded).toBeCloseTo(12000 / 0.035, 2);
    expect(result[0]!.monthlyExpense).toBeCloseTo(1000, 2);
    expect(result[3]!.capitalNeeded).toBeCloseTo(24000 / 0.035, 2);
    // 400.000 € cubre el primer tramo (342.857 € necesarios) pero no el último (685.714 €).
    expect(result.map((m) => m.reached)).toEqual([true, false, false, false]);
  });

  it('omite tramos sin partidas para no duplicar puntos en el mismo sitio', () => {
    const entries = [
      makeEntry({ id: 1, subcategory: 'housing_home', amountAnnual: 12000 }),
      makeEntry({ id: 2, subcategory: 'gifts_donations', amountAnnual: 1200 }),
    ];
    const result = budgetCapitalMilestones({ ...baseInput, entries });
    expect(result.map((m) => m.label)).toEqual([
      'Techo, comida, familia y salud',
      '+ Ocio y regalos',
    ]);
    expect(result[1]!.annualExpense).toBe(13200);
  });

  it('solo cuenta partidas recurrentes, activas y del año fiscal pedido', () => {
    const entries = [
      makeEntry({ id: 1, amountAnnual: 12000 }),
      makeEntry({ id: 2, amountAnnual: 5000, expenseType: 'one_off' }),
      makeEntry({ id: 3, amountAnnual: 7000, fiscalYear: 2025 }),
      makeEntry({ id: 4, amountAnnual: 3000, isActive: false }),
    ];
    const result = budgetCapitalMilestones({ ...baseInput, entries });
    expect(result).toHaveLength(1);
    expect(result[0]!.annualExpense).toBe(12000);
  });

  it('marca la posición por encima de 100 % cuando el capital necesario supera el objetivo', () => {
    const entries = [makeEntry({ id: 1, amountAnnual: 12000 })];
    const result = budgetCapitalMilestones({ ...baseInput, entries, targetCapital: 300000 });
    // 342.857 € necesarios sobre un objetivo de 300.000 € → ~114 %.
    expect(result[0]!.positionPct).toBeGreaterThan(100);
  });

  it('devuelve vacío sin tasa de retirada o sin partidas que anclen los tramos', () => {
    const entries = [makeEntry({ id: 1, amountAnnual: 12000 })];
    expect(budgetCapitalMilestones({ ...baseInput, entries, withdrawalRate: 0 })).toEqual([]);
    expect(budgetCapitalMilestones({ ...baseInput, entries: [] })).toEqual([]);
  });
});
