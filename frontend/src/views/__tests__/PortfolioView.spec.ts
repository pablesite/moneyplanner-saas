/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import PortfolioView from '../PortfolioView.vue';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
  getWorkspace: vi.fn(),
  getMembers: vi.fn(),
  getOperationOptions: vi.fn(),
  route: { query: {} as Record<string, string> },
}));

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
}));

vi.mock('@/domains/portfolio/api', () => ({
  corePortfolioApi: {
    getWorkspace: mocks.getWorkspace,
    getMembers: mocks.getMembers,
    getOperationOptions: mocks.getOperationOptions,
  },
}));

const coverage = {
  value: 'complete',
  opening_positions: { covered: 1, total: 1 },
  closing_positions: { covered: 1, total: 1 },
  cash: 'complete',
  twr: 'exact',
  mwr: 'available',
  realized_pnl: 'complete',
  fx: 'complete',
};
const performance = {
  period: { from: '2025-01-01', to: '2025-12-31' },
  member_id: null,
  currency: 'EUR',
  opening_value: '10000',
  closing_value: '12000',
  covered_opening_value: '10000',
  covered_closing_value: '12000',
  net_contributed: '1000',
  monetary_result: '1000',
  gross_result: '1010',
  costs: '10',
  income: '50',
  realized_pnl: '100',
  unrealized_pnl: '900',
  return: {
    nominal: '0.10',
    real: '0.08',
    twr: '0.10',
    mwr_xirr: '0.11',
    method: 'twr',
    estimated: false,
  },
  coverage,
  fx_issues: [],
  flows: [],
};
const position = {
  position_id: 3,
  instrument_id: 5,
  instrument_name: 'Fondo Global',
  container_id: 2,
  container_name: 'Broker familiar',
  status: 'active',
  tracking_style: 'units_based',
  native_value: '12000',
  native_currency: 'EUR',
  holding_currency: 'EUR',
  observed_on: '2025-12-31',
  asset_class: 'equity',
  class_breakdown: [],
  value_status: 'fresh',
  performance,
  attribution: { asset: '1000', fx: '0', total: '1000', method: 'closing_fx_residual' },
};

describe('PortfolioView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.route.query = {};
    mocks.getMembers.mockResolvedValue({ data: [] });
    mocks.getOperationOptions.mockResolvedValue({
      data: {
        positions: [
          {
            id: 3,
            name: 'Fondo Global',
            container_id: 2,
            container_name: 'Broker familiar',
            tracking_style: 'units_based',
            status: 'active',
            operational: true,
            history_mode: 'reconstructed',
            history_start_date: null,
            setup_confirmed: false,
            performance_coverage: {
              status: 'complete',
              start_date: '2025-01-01',
              has_flows: true,
              has_valuations: true,
            },
            position_detail_coverage: { status: 'complete', tracks_units: true },
          },
        ],
        cash_accounts: [],
      },
    });
    mocks.getWorkspace.mockResolvedValue({
      cash: { value: '0' },
      overview: {
        period: performance.period,
        member_id: null,
        currency: 'EUR',
        value: '12000',
        covered_value: '12000',
        net_contributed: '1000',
        monetary_result: '1000',
        return: performance.return,
        coverage,
        position_count: 1,
        fresh_position_count: 1,
      },
      performance,
      positions: { period: performance.period, member_id: null, results: [position] },
      timeline: {
        period: performance.period,
        member_id: null,
        currency: 'EUR',
        results: [
          {
            date: '2025-01-01',
            value: '10000',
            net_contributed: '0',
            monetary_result: '0',
            coverage: 'complete',
          },
          {
            date: '2025-12-31',
            value: '12000',
            net_contributed: '1000',
            monetary_result: '1000',
            coverage: 'complete',
          },
        ],
      },
      quality: {
        period: performance.period,
        status: 'ready',
        positions: { total: 1, fresh: 1, stale: 0, missing: 0 },
        ownership_missing: 0,
        ownership_unattributed: 0,
        cash_ownership_missing: false,
        metric_coverage: coverage,
        fx_issues: [],
      },
      instruments: [
        {
          id: 5,
          name: 'Fondo Global',
          asset_class: 'equity',
          instrument_type: 'fund',
          quote_currency: 'EUR',
        },
      ],
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the family summary and opens a position detail without operation forms', async () => {
    const wrapper = mount(PortfolioView, {
      global: { plugins: [createPinia()] },
      attachTo: document.body,
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Valor de cartera');
    expect(wrapper.text()).toContain('12.000,00');
    expect(wrapper.text()).toContain('Dónde está invertida');
    // Registrar dinero vive en Contabilidad: aquí solo queda el mantenimiento de la
    // posición, tras un icono.
    expect(wrapper.text()).not.toContain('Registrar');
    expect(wrapper.find('[aria-label^="Operaciones de cartera"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Importar CSV');
    // Los recurrentes son botones de icono: su nombre vive en `aria-label`, no en el texto.
    expect(wrapper.find('[aria-label="Configurar posiciones · 1 pendientes"]').exists()).toBe(true);

    await wrapper.findAll('.a-pf-tabs-bar .tab')[1]!.trigger('click');
    await wrapper.get('.a-pf-position-list button').trigger('click');

    expect(document.body.textContent).toContain('Fondo Global');
    expect(document.body.textContent).toContain('Ha rendido tu dinero');
    expect(document.body.querySelector('form')).toBeNull();
  });

  it('keeps the return to Patrimonio available from the page head', async () => {
    const wrapper = mount(PortfolioView, { global: { plugins: [createPinia()] } });
    await flushPromises();

    await wrapper.get('[aria-label="Volver a Patrimonio"]').trigger('click');

    expect(mocks.push).toHaveBeenCalledWith('/patrimonio');
  });

  it('restores the Patrimonio context carried by the entry route', async () => {
    mocks.route.query = { return: '/?tab=evolution&range=3a' };
    const wrapper = mount(PortfolioView, { global: { plugins: [createPinia()] } });
    await flushPromises();

    await wrapper.get('[aria-label="Volver a Patrimonio"]').trigger('click');

    expect(mocks.push).toHaveBeenCalledWith('/?tab=evolution&range=3a');
  });
});
