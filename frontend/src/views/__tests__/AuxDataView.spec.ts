/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import AuxDataView from '../AuxDataView.vue';

const mockUseAuxDataPage = vi.fn();
const routerReplace = vi.fn();
const route = { query: {} as Record<string, unknown> };

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ replace: routerReplace }),
}));

vi.mock('@/domains/aux-data', () => ({
  useAuxDataPage: () => mockUseAuxDataPage(),
}));

vi.mock('@/domains/people', () => ({
  FamilyMemberManager: {
    name: 'FamilyMemberManager',
    template: '<div data-test="FamilyMemberManager" />',
  },
  OwnershipManager: {
    name: 'OwnershipManager',
    template: '<div data-test="OwnershipManager" />',
  },
}));

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    loading: ref(false),
    error: ref<string | null>(null),
    syncError: ref<string | null>(null),
    syncSuccess: ref<string | null>(null),
    syncingInflation: ref(false),
    syncingFx: ref(false),
    fxRates: ref([]),
    inflation: ref([]),
    fxStates: ref([]),
    inflationStates: ref([]),
    supportedInflationRegions: ref([{ code: 'ES', label: 'Espana' }]),
    formatFxRate: vi.fn(() => '0.9200'),
    formatInflationIndex: vi.fn(() => '118.0'),
    syncInflationNow: vi.fn(),
    syncFxHistoryNow: vi.fn(),
    ...overrides,
  };
}

function marketState(overrides: Record<string, unknown> = {}) {
  return {
    scope: 'ES',
    required_start_date: '2020-01-01',
    covered_until: '2026-08-04',
    last_attempt_at: null,
    last_success_at: '2026-08-05T06:00:00Z',
    last_error: null,
    ...overrides,
  };
}

describe('AuxDataView', () => {
  beforeEach(() => {
    mockUseAuxDataPage.mockReset();
    routerReplace.mockReset();
    route.query = {};
  });

  it('abre en la pestaña Personas y monta sus gestores', () => {
    mockUseAuxDataPage.mockReturnValue(makeState());
    const wrapper = mount(AuxDataView);

    expect(wrapper.find('[data-test="FamilyMemberManager"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="OwnershipManager"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Índice de precios');
  });

  it('cambia a Datos de mercado y lo sincroniza con la URL', async () => {
    mockUseAuxDataPage.mockReturnValue(makeState());
    const wrapper = mount(AuxDataView);

    await wrapper.findAll('.tab')[1]!.trigger('click');

    expect(routerReplace).toHaveBeenCalledWith({ query: { tab: 'mercado' } });
    expect(wrapper.text()).toContain('Índice de precios (IPC)');
    expect(wrapper.text()).toContain('Tasas de cambio');
    expect(wrapper.find('[data-test="FamilyMemberManager"]').exists()).toBe(false);
  });

  it('entra directo en la pestaña indicada por la query', () => {
    route.query = { tab: 'mercado' };
    mockUseAuxDataPage.mockReturnValue(makeState());
    const wrapper = mount(AuxDataView);

    expect(wrapper.text()).toContain('Índice de precios (IPC)');
  });

  it('resume la cobertura de cada dataset como estado operativo', () => {
    route.query = { tab: 'mercado' };
    mockUseAuxDataPage.mockReturnValue(
      makeState({
        inflationStates: ref([marketState({ covered_until: '2026-06-30' })]),
        fxStates: ref([marketState({ scope: 'USD->EUR', last_error: 'timeout' })]),
      }),
    );
    const wrapper = mount(AuxDataView);

    expect(wrapper.text()).toContain('Cobertura IPC');
    expect(wrapper.text()).toContain('Cobertura divisas');
    expect(wrapper.text()).toContain('Incidencias');
    expect(wrapper.text()).toContain('timeout');
  });

  it('explica los estados vacíos y los errores', () => {
    route.query = { tab: 'mercado' };
    mockUseAuxDataPage.mockReturnValue(makeState({ error: ref('Error de red') }));
    const wrapper = mount(AuxDataView);

    expect(wrapper.text()).toContain('Error de red');
    expect(wrapper.text()).toContain('No hay índices IPC sincronizados todavía');
    expect(wrapper.text()).toContain('No hay tasas sincronizadas todavía');
  });
});
