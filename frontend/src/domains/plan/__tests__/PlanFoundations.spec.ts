/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PlanFoundations from '@/domains/plan/components/PlanFoundations.vue';
import type { PlanFoundations as PlanFoundationsData } from '@/domains/plan/types';

// Datos reales de un plan con apretón transitorio: la base recurrente es sana y
// son los compromisos temporales los que dejan el año en negativo.
const foundations = {
  period: '2026',
  cash_flow: {
    score: 52,
    status: 'warning',
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
    score: 70,
    status: 'critical',
    eligible_liquidity: '16883.45',
    coverage_months_base: '5.5',
    coverage_months_committed: '3.7',
    target_months: '6.0',
  },
  debt: { score: 89, status: 'good', total_debt: '0.00', high_cost_debt: '0.00' },
  planned_contribution: { monthly_amount: '821.67' },
  data_quality: { score: 80, status: 'good', flags: { assets: true } },
} as unknown as PlanFoundationsData;

describe('PlanFoundations', () => {
  it('encadena la cuenta del flujo de caja sin mezclar alcances', () => {
    const wrapper = mount(PlanFoundations, { props: { foundations, compact: true } });
    const text = wrapper.text().replace(/\s+/g, ' ');

    // Ingresos − gastos operativos = base recurrente. La cifra intermedia (antes
    // ausente) es la que hacía que el déficit no cuadrara con la primera línea.
    expect(text).toContain('Ingresos 4.702,84 €/mes − gastos operativos 3.050,83 €/mes');
    expect(text).toContain('Base recurrente +1.652,01 €/mes');
    // El margen dice de qué es porcentaje.
    expect(text).toContain('35,1 % de tus ingresos');
    // El déficit se enuncia con los compromisos que lo provocan, no suelto.
    expect(text).toContain('Con los compromisos temporales de este año (2.298,55 €/mes)');
    expect(text).toContain('-646,54 €/mes');
  });

  it('sin compromisos temporales no enuncia la línea de compromisos', () => {
    const healthy = {
      ...foundations,
      cash_flow: {
        ...foundations.cash_flow,
        temporary_commitment_expense: '0.00',
        committed_surplus: '19824.08',
        committed_status: 'healthy',
      },
    } as unknown as PlanFoundationsData;
    const text = mount(PlanFoundations, { props: { foundations: healthy, compact: true } })
      .text()
      .replace(/\s+/g, ' ');

    expect(text).toContain('Base recurrente +1.652,01 €/mes');
    expect(text).not.toContain('Con los compromisos temporales');
  });
});
