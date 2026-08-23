/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

import PortfolioRiskPanel from '../components/PortfolioRiskPanel.vue';

const getBenchmark = vi.hoisted(() => vi.fn());
const getRisk = vi.hoisted(() => vi.fn());

vi.mock('../api', () => ({
  corePortfolioApi: { getBenchmark, getRisk },
}));

function benchmark(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      ownership_id: 1,
      currency: 'EUR',
      period: { from: '2025-01-31', to: '2026-01-31' },
      calendar: { frequency: 'monthly', boundaries: 'month_end' },
      status: 'ok',
      reason: '',
      months: 12,
      months_with_benchmark: 12,
      unreachable_classes: [],
      cash_excluded: false,
      portfolio_return: '0.12',
      benchmark_return: '0.10',
      benchmark_annualized_return: { status: 'available', value: '0.10' },
      excess_return: '0.02',
      points: [],
      secondary: { status: 'unavailable', reason: 'not_configured', instrument: null },
      ...overrides,
    },
  };
}

function risk(overrides: Record<string, unknown> = {}) {
  const insufficient = { status: 'insufficient', value: null, reason: 'gaps_in_series' };
  return {
    data: {
      ownership_id: 1,
      currency: 'EUR',
      period: { from: '2025-01-31', to: '2026-01-31' },
      calendar: { frequency: 'monthly', boundaries: 'month_end' },
      risk_free_rate: '0.02',
      observations: 12,
      coverage: {
        months_in_period: 12,
        months_used: 12,
        window: { from: '2025-02', to: '2026-01' },
        months_without_data: [],
      },
      annualized_return: { status: 'available', value: '0.0335' },
      volatility: { status: 'available', value: '0.1284' },
      max_drawdown: { status: 'available', value: '-0.1066', trough_period: '2025-04' },
      best_period: { status: 'available', value: '0.0836', period: '2025-05' },
      worst_period: { status: 'available', value: '-0.0666', period: '2025-03' },
      sharpe: { ...insufficient, reason: 'not_enough_observations', observations: 6, required: 12 },
      advanced: { beta: { status: 'unavailable', reason: 'not_implemented' } },
      ...overrides,
    },
  };
}

async function mountPanel() {
  const wrapper = mount(PortfolioRiskPanel, {
    props: { ownershipId: 1, dateFrom: '2025-01-31', dateTo: '2026-01-31' },
    global: { stubs: { AInfoHint: { template: '<i />' } } },
  });
  await flushPromises();
  return wrapper;
}

describe('PortfolioRiskPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getBenchmark.mockResolvedValue(benchmark());
    getRisk.mockResolvedValue(risk());
  });

  it('compara la cartera con su propia política y muestra el exceso acumulado', async () => {
    const wrapper = await mountPanel();

    const text = wrapper.text();
    expect(text).toContain('Tu política');
    expect(text).toContain('Exceso frente a tu política');
    expect(text).toContain('puntos porcentuales acumulados');
    expect(text).toContain('Rentabilidad anual del tramo medido');
    expect(text).toContain('El Resumen incluye los extremos exactos del periodo');
  });

  it('nunca pinta un cero donde no hay dato', async () => {
    // Un cero es una medición. Una métrica sin cobertura tiene que decir qué le falta.
    const wrapper = await mountPanel();

    const text = wrapper.text();
    expect(text).toContain('Faltan meses (6 de 12)');
    expect(text).not.toContain('0,00 %');
  });

  it('explica por qué no hay comparación en vez de enseñar un vacío', async () => {
    getBenchmark.mockResolvedValue(
      benchmark({
        status: 'insufficient',
        reason: 'months_without_benchmark',
        portfolio_return: null,
        benchmark_return: null,
        excess_return: null,
        points: [
          {
            period: '2025-06',
            from: '',
            to: '',
            portfolio: '0.01',
            benchmark: null,
            reason: 'no_strategy',
          },
        ],
      }),
    );

    const wrapper = await mountPanel();

    expect(wrapper.text()).toContain('Tu política es más reciente que este periodo');
  });

  it('dice sobre cuántos meses se ha medido cuando la serie tiene huecos', async () => {
    getRisk.mockResolvedValue(
      risk({
        coverage: {
          months_in_period: 18,
          months_used: 17,
          window: { from: '2025-03', to: '2026-07' },
          months_without_data: ['2025-02'],
        },
      }),
    );

    const wrapper = await mountPanel();

    expect(wrapper.text()).toContain('Medido sobre 17 de 18 meses');
    expect(wrapper.text()).toContain('Sin datos en 2025-02');
  });
});
