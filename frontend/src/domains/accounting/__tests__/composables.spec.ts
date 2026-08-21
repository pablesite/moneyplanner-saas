import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

import { useAccountingPage } from '../composables';
import { useAccountingStore } from '../store';
import { coreAccountingApi } from '../api';
import { coreNetWorthApi } from '@/domains/net-worth/api';

const loadAnnualIncome = vi.fn();
const loadAnnualExpense = vi.fn();
const fetchOwnerships = vi.fn();

vi.mock('../api', () => ({
  coreAccountingApi: {
    getAccounts: vi.fn(),
    getTransactions: vi.fn(),
    getMonthlySummary: vi.fn(),
    getAccountBalances: vi.fn(),
    getDailyBalanceSeries: vi.fn(),
    createAccount: vi.fn(),
    deleteAccount: vi.fn(),
    createTransaction: vi.fn(),
    createQuickEntry: vi.fn(),
  },
}));

vi.mock('@/domains/net-worth/api', () => ({
  coreNetWorthApi: {
    getAssets: vi.fn(),
    getLiabilities: vi.fn(),
    updateAsset: vi.fn(),
    updateLiability: vi.fn(),
  },
}));

vi.mock('@/domains/budget/taxonomy', () => ({
  incomeCategories: [{ value: 'salary', label: 'Salarios y trabajo' }],
  incomeSubcategories: [{ category: 'salary', value: 'employee_salary', label: 'Nomina' }],
  expenseCategories: [{ value: 'consumption_expenses', label: 'Gastos de consumo' }],
  expenseSubcategories: [
    { category: 'consumption_expenses', value: 'living_expenses', label: 'Alimentacion' },
  ],
}));

vi.mock('@/domains/budget/annual-entries', () => ({
  useAnnualIncomeStore: () => ({
    entries: { value: [] },
    loadAll: loadAnnualIncome,
  }),
  useAnnualExpenseStore: () => ({
    entries: { value: [] },
    loadAll: loadAnnualExpense,
  }),
}));

vi.mock('@/domains/people/store', () => ({
  usePeopleStore: () => ({
    ownerships: [],
    fetchOwnerships,
  }),
}));

function seedRefreshResponses() {
  vi.mocked(coreAccountingApi.getAccounts).mockResolvedValue({
    data: [
      {
        id: 1,
        name: 'Cuenta corriente',
        account_type: 'asset',
        currency: 'EUR',
        origin: 'user',
        asset_id: null,
        liability_id: null,
        is_active: true,
        notes: '',
        current_balance: '1000.00',
        created_at: '',
        updated_at: '',
      },
      {
        id: 2,
        name: 'Fondo indexado',
        account_type: 'asset',
        currency: 'EUR',
        origin: 'user',
        asset_id: 7,
        liability_id: null,
        is_active: true,
        notes: '',
        current_balance: '5000.00',
        created_at: '',
        updated_at: '',
      },
      {
        id: 3,
        name: 'Bitcoin',
        account_type: 'asset',
        currency: 'BTC',
        origin: 'user',
        asset_id: 9,
        liability_id: null,
        is_active: true,
        notes: '',
        current_balance: '0.05000000',
        created_at: '',
        updated_at: '',
      },
    ],
  } as never);
  vi.mocked(coreAccountingApi.getTransactions).mockResolvedValue({
    data: { results: [], next_cursor: null, total_count: 0 },
  } as never);
  vi.mocked(coreAccountingApi.getMonthlySummary).mockResolvedValue({
    data: { fiscal_year: 2026, months: [] },
  } as never);
  vi.mocked(coreAccountingApi.getAccountBalances).mockResolvedValue({
    data: {
      filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
      totals_by_account_type: { asset: '1000.00' },
      accounts: [],
    },
  } as never);
  vi.mocked(coreAccountingApi.getDailyBalanceSeries).mockResolvedValue({
    data: { base_currency: 'EUR', rows: [] },
  } as never);
}

function seedNetWorthResponses() {
  vi.mocked(coreNetWorthApi.getAssets).mockResolvedValue({
    data: [
      {
        id: 7,
        name: 'Fondo indexado',
        category: 'investments',
        subcategory: 'index_funds',
        currency: 'EUR',
        amount: '5000.00',
        amount_base: '5000.00',
        is_active: true,
        tracking_mode: 'accounting',
      },
      {
        id: 9,
        name: 'Bitcoin',
        category: 'investments',
        subcategory: 'cryptocurrencies',
        currency: 'BTC',
        amount: '0.05',
        amount_base: '3000.00',
        is_active: true,
        tracking_mode: 'accounting',
      },
    ],
  } as never);
  vi.mocked(coreNetWorthApi.getLiabilities).mockResolvedValue({ data: [] } as never);
}

async function mountInvestmentHarness(
  overrides: { fee_amount?: string; investment_direction?: 'inflow' | 'outflow' } = {},
) {
  const Harness = defineComponent({
    setup() {
      return useAccountingPage();
    },
    template: '<div />',
  });
  const wrapper = mount(Harness);
  await wrapper.vm.$nextTick();

  // El tipo de movimiento limpia el formulario al cambiar, así que el resto se rellena
  // después de que ese reinicio haya corrido.
  wrapper.vm.quickEntryForm.movement_type = 'investment';
  await wrapper.vm.$nextTick();
  wrapper.vm.quickEntryForm.investment_direction = overrides.investment_direction ?? 'inflow';
  wrapper.vm.quickEntryForm.booking_date = '2026-03-15';
  wrapper.vm.quickEntryForm.value_date = '2026-03-15';
  wrapper.vm.quickEntryForm.description = 'Compra fondo marzo';
  wrapper.vm.quickEntryForm.amount = '250.00';
  wrapper.vm.quickEntryForm.account_id = 1;
  wrapper.vm.quickEntryForm.counterparty_account_id = 2;
  wrapper.vm.quickEntryForm.fee_amount = overrides.fee_amount ?? '';
  vi.mocked(coreAccountingApi.createQuickEntry).mockResolvedValue({ data: {} } as never);
  await wrapper.vm.$nextTick();
  return wrapper;
}

describe('useAccountingPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    seedRefreshResponses();
    seedNetWorthResponses();
    fetchOwnerships.mockResolvedValue(undefined);
  });

  it('sends taxonomy in quick-entry payload', async () => {
    const store = useAccountingStore();
    const Harness = defineComponent({
      setup() {
        return useAccountingPage();
      },
      template: '<div />',
    });

    const wrapper = mount(Harness);
    await wrapper.vm.$nextTick();

    wrapper.vm.quickEntryForm.movement_type = 'income';
    wrapper.vm.quickEntryForm.booking_date = '2026-03-15';
    wrapper.vm.quickEntryForm.value_date = '2026-03-15';
    wrapper.vm.quickEntryForm.description = 'Nomina marzo';
    wrapper.vm.quickEntryForm.amount = '500.00';
    wrapper.vm.quickEntryForm.account_id = 1;
    wrapper.vm.quickEntryForm.category_key = 'salary';
    wrapper.vm.quickEntryForm.subcategory_key = 'employee_salary';
    vi.mocked(coreAccountingApi.createQuickEntry).mockResolvedValue({ data: {} } as never);

    await wrapper.vm.submitQuickEntry();

    expect(coreAccountingApi.createQuickEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        movement_type: 'income',
        category_key: 'salary',
        subcategory_key: 'employee_salary',
      }),
    );
    expect(store.transactionCreationLoading).toBe(false);

    wrapper.unmount();
  });

  it('sends the broker fee alongside an investment', async () => {
    const wrapper = await mountInvestmentHarness({ fee_amount: '3,50' });

    await wrapper.vm.submitQuickEntry();

    expect(coreAccountingApi.createQuickEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        movement_type: 'investment',
        investment_direction: 'inflow',
        amount: '250.00',
        fee_amount: '3.50',
      }),
    );

    wrapper.unmount();
  });

  it('omits the fee when the investment did not carry one', async () => {
    const wrapper = await mountInvestmentHarness();

    await wrapper.vm.submitQuickEntry();

    const payload = vi.mocked(coreAccountingApi.createQuickEntry).mock.calls[0][0];
    expect(payload).not.toHaveProperty('fee_amount');

    wrapper.unmount();
  });

  it('announces what the funding account really pays for an aporte', async () => {
    // El importe es el capital que llega a la posición, así que sin decirlo el saldo de la
    // cuenta que paga no cuadraría con lo que se acaba de teclear.
    const wrapper = await mountInvestmentHarness({ fee_amount: '3.50' });

    expect(wrapper.vm.quickInvestmentFeePreview).toEqual({
      kind: 'charged',
      amount: 253.5,
      currency: 'EUR',
    });

    wrapper.unmount();
  });

  it('lets a crypto account be reconciled by adjustment', async () => {
    // Cripto no se marca a mercado —su valor en € sale del cambio—, así que sin esto una
    // cuenta descuadrada no tenía ninguna vía para cuadrarse.
    const wrapper = await mountInvestmentHarness();

    const options = wrapper.vm.quickAdjustmentAccountOptions.map(
      (account: { id: number }) => account.id,
    );
    expect(options).toContain(3);
    // Un fondo sí se marca a mercado: su diferencia es ganancia o pérdida.
    expect(options).not.toContain(7);

    wrapper.unmount();
  });

  it('lets an expense be charged to an investment account', async () => {
    // Un exchange cobra su comisión en cripto, del propio saldo: si esa cuenta no se
    // puede elegir como origen del gasto, el descuadre no hay forma de explicarlo.
    const wrapper = await mountInvestmentHarness();

    const options = wrapper.vm.quickExpenseAccountOptions.map(
      (account: { id: number }) => account.id,
    );
    expect(options).toContain(3);

    wrapper.unmount();
  });

  it('announces the net credit for a retirada', async () => {
    const wrapper = await mountInvestmentHarness({
      fee_amount: '3.50',
      investment_direction: 'outflow',
    });

    expect(wrapper.vm.quickInvestmentFeePreview).toEqual({
      kind: 'credited',
      amount: 246.5,
      currency: 'EUR',
    });

    wrapper.unmount();
  });
});
