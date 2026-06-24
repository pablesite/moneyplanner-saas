/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import AccountingMovementsView from '../AccountingMovementsView.vue';

const mockUseAccountingMovementsPage = vi.fn();

vi.mock('@/domains/accounting/useAccountingMovementsPage', () => ({
  useAccountingMovementsPage: () => mockUseAccountingMovementsPage(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, fullPath: '/contabilidad' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function makeState(tab: 'cuentas' | 'todos' | 'estadisticas' = 'cuentas') {
  return {
    activeTab: tab,
    accounts: [],
    groupedCuentasAccounts: [],
    ownershipFilterOptions: [],
    dailyBalanceOwnershipFilter: 'all',
    accountingAssetsTotal: 0,
    accountingLiabilitiesTotal: 0,
    accountingNetBalance: 0,
    summaryRows: [],
    formatMoney: vi.fn((value: number) => `${value} EUR`),
    hasAvailableManualPositions: computed(() => true),
    liquidityAccounts: computed(() => [{ id: 1 }]),
    dailyBalanceSeriesRows: computed(() => []),
    dailyBalanceSeriesLoading: computed(() => false),
    dailyBalanceSeriesError: computed(() => null),
    dailyBalanceSeriesUnit: computed(() => 'EUR'),
    dailyBalanceSeriesChartPoints: computed(() => []),
    dailyBalanceSeriesChartRows: computed(() => []),
    dailyBalanceSeriesMonthlyRows: computed(() => []),
    dailyBalanceSeriesRangeLabel: computed(() => '2025-04-17 - 2026-04-17'),
    dailyBalanceLatestChartPoint: computed(() => null),
    dailyTimelinePresetOptions: computed(() => ['1m', '3m', '6m', '1a', '5a', 'all']),
    selectedDailyTimelinePreset: '1a',
    dailyTimelineCustomWindow: null,
    dailyTimelineWindow: computed(() => ({ start: 0, end: 0 })),
    dailyTimelineExpanded: false,
    setDailyTimelinePreset: vi.fn(),
    updateDailyTimelineWindowStart: vi.fn(),
    updateDailyTimelineWindowEnd: vi.fn(),
    formatNumber: vi.fn((value: number) => String(value)),
    activityFilters: {
      query: '',
      accountId: 'all',
      kind: 'all',
      categoryKey: '',
      subcategoryKey: '',
      ownershipId: 'all',
      reviewState: 'all',
    },
    todosDatePreset: 'all',
    todosDateFrom: '',
    todosDateTo: '',
    showQuickEntryModal: ref(false),
    openActivationModal: vi.fn(),
  };
}

describe('AccountingMovementsView', () => {
  it('renders the daily operations workspace', () => {
    mockUseAccountingMovementsPage.mockReturnValue(makeState());
    const wrapper = shallowMount(AccountingMovementsView, {
      global: {
        stubs: {
          APageHead: {
            name: 'APageHead',
            props: ['title'],
            template: '<header><slot name="actions" /></header>',
          },
          AButton: { template: '<button><slot /></button>' },
        },
      },
    });

    expect(wrapper.text()).toContain('Nuevo movimiento');
    expect(wrapper.text()).not.toContain('Evolución');
    expect(wrapper.text()).not.toContain('Estadísticas');
    expect(wrapper.findComponent({ name: 'APageHead' }).props('title')).toBe('Contabilidad');
  });
});
