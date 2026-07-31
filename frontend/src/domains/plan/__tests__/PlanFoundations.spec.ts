/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PlanFoundations from '@/domains/plan/components/PlanFoundations.vue';
import type { PlanFoundations as PlanFoundationsData } from '@/domains/plan/types';

// Datos reales de un plan con apretón transitorio: la base recurrente es sana y
// son los compromisos temporales los que dejan el año en negativo.
const foundations = {
  period: '2026',
  overall: { score: 65, status: 'warning', grade: 'C' },
  cash_flow: {
    score: 52,
    status: 'warning',
    grade: 'D',
    structural_annual_income: '56434.08',
    structural_operating_expense: '36610.00',
    temporary_commitment_expense: '27582.54',
    operating_surplus: '19824.08',
    committed_surplus: '-7758.46',
    operating_surplus_ratio: '0.351',
    committed_status: 'transient',
    committed_recovery_year: 2027,
    temporary_commitments: [],
  },
  emergency_fund: {
    score: 51,
    status: 'warning',
    grade: 'D',
    eligible_liquidity: '16883.45',
    coverage_months_base: '5.5',
    coverage_months_committed: '3.7',
    target_months: '6.0',
  },
  debt: {
    score: 89,
    status: 'good',
    grade: 'A',
    total_debt: '0.00',
    high_cost_debt: '0.00',
    debt_payment_to_income: null,
  },
  planned_contribution: {
    score: 83,
    status: 'good',
    grade: 'B',
    annual_amount: '9860.04',
    monthly_amount: '821.67',
    savings_rate: '0.1747',
    target_savings_rate: '0.2000',
  },
  net_worth_health: {
    score: 54,
    status: 'warning',
    grade: 'D',
    assets_value: '512000.00',
    illiquid_assets_share: '0.9155',
    top_asset_share: '0.7100',
    diversification_index: '0.6509',
  },
  data_quality: { score: 80, status: 'good', grade: 'B', flags: { assets: true } },
} as unknown as PlanFoundationsData;

function mountCompact(overrides: Partial<PlanFoundationsData> = {}) {
  return mount(PlanFoundations, {
    props: { foundations: { ...foundations, ...overrides }, compact: true },
  });
}

describe('PlanFoundations', () => {
  it('cada cimiento abre con su nota A-E', () => {
    const wrapper = mountCompact();
    const grades = wrapper.findAll('.plan-grade').map((node) => node.text());

    // Flujo, emergencia, deuda, aportación, patrimonio y calidad de datos.
    expect(grades).toEqual(['D', 'D', 'A', 'B', 'D', 'B']);
  });

  it('el flujo de caja titula con el resultado que juzga su nota', () => {
    const text = mountCompact().text().replace(/\s+/g, ' ');

    // Con compromisos, el valor es el resultado del año (lo que explica la D), y el
    // desglose enseña de dónde sale: base recurrente menos compromisos.
    expect(text).toContain('-646,54 €/mes');
    expect(text).toContain('Base recurrente +1.652,01 €/mes (35,1 % de tus ingresos)');
    expect(text).toContain('− compromisos temporales 2.298,55 €/mes');
    expect(text).toContain('que vencen en 2027');
  });

  it('deuda, patrimonio y aportación titulan con el KPI que puntúa cada nota', () => {
    const text = mountCompact({
      debt: {
        ...foundations.debt,
        total_debt: '27702.82',
        high_cost_debt: '0.00',
        weighted_tae_pct: '1.4716',
        debt_payment_to_income: '0.4888',
      },
    } as Partial<PlanFoundationsData>)
      .text()
      .replace(/\s+/g, ' ');

    // Deuda: la nota mira la deuda cara, no el saldo.
    expect(text).toContain('Deuda cara 0,00 €');
    expect(text).toContain('27.702,82 € en total · 1,5 % de interés medio');
    // Patrimonio: la nota mide composición, así que el valor es la parte ilíquida.
    expect(text).toContain('91,6 % poco líquido');
    expect(text).toContain('Sobre 512.000,00 € en activos');
  });

  it('la aportación se lee como tasa de ahorro frente a su objetivo', () => {
    const text = mountCompact().text().replace(/\s+/g, ' ');

    expect(text).toContain('821,67 €/mes');
    expect(text).toContain('Ahorras el 17,5 % de tus ingresos · objetivo 20,0 %');
  });

  it('sin compromisos temporales no enuncia la línea de compromisos', () => {
    const text = mountCompact({
      cash_flow: {
        ...foundations.cash_flow,
        temporary_commitment_expense: '0.00',
        committed_surplus: '19824.08',
        committed_status: 'healthy',
      },
    })
      .text()
      .replace(/\s+/g, ' ');

    expect(text).toContain('+1.652,01 €/mes');
    expect(text).not.toContain('Con los compromisos temporales');
  });
});
