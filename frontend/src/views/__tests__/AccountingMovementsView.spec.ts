/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import AccountingMovementsView from '../AccountingMovementsView.vue';

const mockUseAccountingMovementsPage = vi.fn();
const mockRoute = { query: {} as Record<string, string>, fullPath: '/contabilidad' };
const mockRouter = { push: vi.fn(), replace: vi.fn(async () => undefined) };

vi.mock('@/domains/accounting/useAccountingMovementsPage', () => ({
  useAccountingMovementsPage: () => mockUseAccountingMovementsPage(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
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
  beforeEach(() => {
    mockRoute.query = {};
    mockRouter.push.mockClear();
    mockRouter.replace.mockClear();
  });

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

  it('opens a settlement transfer prefilled but never submits it', async () => {
    mockRoute.query = {
      create: 'transfer',
      from_asset_id: '10',
      to_asset_id: '20',
      amount: '1170.00',
      transfer_ownership_id: '4',
      booking_date: '2026-08-04',
      description: 'Liquidación agosto',
      return_to: '/cierre-mensual?year=2026&month=7&step=result',
    };
    const quickEntryForm = {
      movement_type: 'expense',
      account_id: null as number | null,
      counterparty_account_id: null as number | null,
      amount: '',
      ownership_id: null as number | null,
      booking_date: '',
      value_date: '',
      description: '',
    };
    const state = {
      ...makeState(),
      accounts: [
        { id: 1, asset_id: 10, account_type: 'asset' },
        { id: 2, asset_id: 20, account_type: 'asset' },
      ],
      quickEntryForm,
      openQuickEntryForCreate: vi.fn(),
      submitQuickEntryFromModal: vi.fn(),
    };
    mockUseAccountingMovementsPage.mockReturnValue(state);

    shallowMount(AccountingMovementsView, {
      global: {
        stubs: {
          APageHead: { template: '<header><slot name="actions" /></header>' },
          AButton: { template: '<button><slot /></button>' },
        },
      },
    });
    await flushPromises();

    expect(state.openQuickEntryForCreate).toHaveBeenCalledOnce();
    expect(quickEntryForm).toMatchObject({
      movement_type: 'transfer',
      account_id: 1,
      counterparty_account_id: 2,
      amount: '1170.00',
      ownership_id: 4,
      booking_date: '2026-08-04',
      value_date: '2026-08-04',
      description: 'Liquidación agosto',
    });
    expect(state.submitQuickEntryFromModal).not.toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith({
      name: 'accounting-movements',
      query: { return_to: '/cierre-mensual?year=2026&month=7&step=result' },
    });
  });
});
