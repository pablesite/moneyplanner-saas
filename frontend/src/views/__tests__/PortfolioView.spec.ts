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
  getAllocationScopes: vi.fn(),
  getAllocation: vi.fn(),
  getStrategies: vi.fn(),
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
    getAllocationScopes: mocks.getAllocationScopes,
    getAllocation: mocks.getAllocation,
    getStrategies: mocks.getStrategies,
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
    mwr_cumulative: '0.11',
    twr_annualized: '0.08',
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
    mocks.getAllocationScopes.mockResolvedValue({
      data: [{ ownership_id: 1, label: 'Familia', position_count: 1 }],
    });
    mocks.getStrategies.mockResolvedValue({
      data: [
        {
          id: 2,
          ownership_id: 1,
          effective_from: '2022-03-01',
          note: '',
          max_cost_share: '0.005',
          min_line_amount: '0',
          targets: [
            { asset_class: 'equity', target_percent: '100', min_percent: null, max_percent: null },
          ],
          target_total: '100',
          created_at: '2022-03-01T00:00:00Z',
        },
        {
          id: 1,
          ownership_id: 1,
          effective_from: '2026-08-19',
          note: '',
          max_cost_share: '0.005',
          min_line_amount: '0',
          targets: [
            { asset_class: 'equity', target_percent: '100', min_percent: null, max_percent: null },
          ],
          target_total: '100',
          created_at: '2026-08-19T00:00:00Z',
        },
      ],
    });
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
            return: performance.return,
            coverage: 'complete',
          },
          {
            date: '2025-12-31',
            value: '12000',
            net_contributed: '1000',
            monetary_result: '1000',
            return: performance.return,
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

  it('shows only the value exposed to each class for a partially declared product', async () => {
    mocks.route.query = { tab: 'allocation' };
    mocks.getAllocation.mockResolvedValue({
      data: {
        ownership_id: 1,
        on_date: '2025-12-31',
        currency: 'EUR',
        strategy: null,
        total_value: '10000',
        by_class: [
          {
            asset_class: 'equity',
            value: '7000',
            actual_percent: '70',
            target_percent: null,
            min_percent: null,
            max_percent: null,
            drift_value: null,
            band: 'unplanned',
          },
          {
            asset_class: 'unclassified',
            value: '3000',
            actual_percent: '30',
            target_percent: null,
            min_percent: null,
            max_percent: null,
            drift_value: null,
            band: 'unplanned',
          },
        ],
        by_position: [
          {
            position_id: 3,
            name: 'Fondo parcial',
            asset_class: 'equity',
            value: '10000',
            actual_percent: '100',
            target_percent: '60',
            class_share: '100',
            drift_value: '4000',
            band: 'derived',
            class_breakdown: [
              { asset_class: 'equity', value: '7000', actual_percent: '70' },
              { asset_class: 'unclassified', value: '3000', actual_percent: '30' },
            ],
          },
        ],
      },
    });
    const wrapper = mount(PortfolioView, {
      global: { plugins: [createPinia()], stubs: { PortfolioBasketsPanel: true } },
      attachTo: document.body,
    });
    await flushPromises();
    for (const row of wrapper.findAll('.a-pf-allocation-class')) await row.trigger('click');

    const rows = wrapper.findAll('.a-pf-allocation-position');
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.isVisible())).toBe(true);
    expect(rows[0]!.text()).toContain('7.000,00');
    expect(rows[1]!.text()).toContain('3.000,00');
    for (const row of rows) {
      expect(row.text()).toContain('Fondo parcial');
      expect(row.text()).toContain('Exposición');
      expect(row.text()).not.toContain('10.000,00');
      // El objetivo del producto completo no se replica en cada subyacente.
      expect(row.findAll('td')[3]!.text()).toBe('—');
      expect(row.findAll('td')[5]!.text()).toBe('—');
    }
    expect(wrapper.text()).toContain('Sin clasificar');
    wrapper.unmount();
  });

  it('renders the family summary and opens a position detail without operation forms', async () => {
    const wrapper = mount(PortfolioView, {
      global: { plugins: [createPinia()] },
      attachTo: document.body,
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Valor de cartera');
    expect(wrapper.text()).toContain('12.000,00');
    expect(wrapper.text()).toContain('Rendimiento de tus activos');
    expect(wrapper.text()).toContain('TWR exacta');
    expect(wrapper.text()).toMatch(/8,0\s+%/);
    expect(wrapper.text()).toMatch(/10,0\s+%\s+acumulada/);
    expect(wrapper.text()).toContain('TIR anualizada');
    expect(wrapper.text()).toMatch(/11,0\s+%\s+acumulada/);
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

  it('shows risk only inside evolution', async () => {
    const wrapper = mount(PortfolioView, { global: { plugins: [createPinia()] } });
    await flushPromises();

    expect(wrapper.text()).not.toContain('Cómo se ha comportado, y contra qué');

    await wrapper.findAll('.a-pf-tabs-bar .tab')[4]!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Cómo se ha comportado, y contra qué');
    expect(mocks.getAllocationScopes).toHaveBeenCalledTimes(1);
  });

  it('opens from the current investment policy and keeps the policy range prominent', async () => {
    const wrapper = mount(PortfolioView, { global: { plugins: [createPinia()] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Horizonte de análisis');
    expect(wrapper.text()).toContain('Desde tu política de inversión');
    expect(wrapper.text()).toContain('La estrategia vigente se lee desde mar 2022.');
    expect(wrapper.get('[aria-label="Periodo de política"]')).toBeDefined();
    expect(mocks.getWorkspace).toHaveBeenLastCalledWith({ date_from: '2022-03-01' });
  });

  it('restores the Patrimonio context carried by the entry route', async () => {
    mocks.route.query = { return: '/?tab=evolution&range=3a' };
    const wrapper = mount(PortfolioView, { global: { plugins: [createPinia()] } });
    await flushPromises();

    await wrapper.get('[aria-label="Volver a Patrimonio"]').trigger('click');

    expect(mocks.push).toHaveBeenCalledWith('/?tab=evolution&range=3a');
  });
});
