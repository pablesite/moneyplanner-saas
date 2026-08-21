/** @vitest-environment jsdom */
import { defineComponent, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

import { useBudgetDashboardPage } from '../useBudgetDashboardPage';

const YEAR = new Date().getFullYear();

const expenseEntries = vi.hoisted(() => ({ value: [] as unknown[] }));
const incomeEntries = vi.hoisted(() => ({ value: [] as unknown[] }));
const budgetGet = vi.hoisted(() => vi.fn());
const accountingTransactions = vi.hoisted(() => ({ value: [] as Record<string, unknown>[] }));
const ownerships = vi.hoisted(() => ({ value: [] as Record<string, unknown>[] }));

vi.mock('@/domains/budget', () => ({
  budgetApi: {
    get: budgetGet,
    post: vi.fn(async () => ({ data: {} })),
    patch: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
  },
  toBudgetErrorMessage: (error: unknown) => String(error),
  getMonthlyClose: vi.fn(async () => ({ data: null })),
  patchMonthlyClose: vi.fn(async () => ({ data: null })),
  finalizeMonthlyClose: vi.fn(async () => ({ data: null })),
  reopenMonthlyClose: vi.fn(async () => ({ data: null })),
  lockMonthlyClose: vi.fn(async () => ({ data: null })),
}));

vi.mock('@/domains/accounting', () => ({
  coreAccountingApi: {
    getMonthlySummary: vi.fn(async () => ({ data: { fiscal_year: YEAR, months: [] } })),
    getTransactions: vi.fn(async () => ({
      data: { results: accountingTransactions.value, next_cursor: null },
    })),
    getBudgetSuggestions: vi.fn(async () => ({
      data: {
        fiscal_year: YEAR,
        income: { series: [], categories: [], subcategories: [] },
        expense: { series: [], categories: [], subcategories: [] },
      },
    })),
    getAccounts: vi.fn(async () => ({ data: [] })),
  },
}));

vi.mock('@/domains/net-worth/api', () => ({
  coreNetWorthApi: { getAssets: vi.fn(async () => ({ data: [] })) },
  premiumOwnershipApi: { getOwnerships: vi.fn(async () => ({ data: ownerships.value })) },
}));

vi.mock('@/domains/budget/annual-entries', () => ({
  useAnnualExpenseStore: () => ({
    entries: expenseEntries,
    loading: { value: false },
    error: { value: null },
    loadAll: vi.fn(async () => undefined),
  }),
  useAnnualIncomeStore: () => ({
    entries: incomeEntries,
    loading: { value: false },
    error: { value: null },
    loadAll: vi.fn(async () => undefined),
  }),
  effectiveAnnualAmountForEntry: (entry: { amountAnnual: number }) => entry.amountAnnual,
}));

function expenseEntry(overrides: Record<string, unknown>) {
  return {
    id: 1,
    name: 'Partida',
    category: 'consumption_expenses',
    subcategory: 'housing_home',
    amountAnnual: 1200,
    fiscalYear: YEAR,
    expenseType: 'recurrent',
    timeProfile: 'structural_recurrent',
    targetMonth: null,
    termEndYear: null,
    termEndMonth: null,
    owner: 'Pablo',
    ownershipId: null,
    isActive: true,
    ...overrides,
  };
}

// Un mes de ejecución real por la vía del resumen del backend, que no viene repartido por
// titularidad: es el camino que se rompía.
function summaryWithExecution(executed: number) {
  return {
    fiscal_year: YEAR,
    planned_total: '200.00',
    executed_total: String(executed),
    pending_total: '0.00',
    variance_total: '0.00',
    checkins_expected: 1,
    checkins_confirmed: 1,
    months: [],
    expense_execution_breakdown: {
      categories: [
        {
          category: 'consumption_expenses',
          subcategories: [
            {
              subcategory: 'housing_home',
              has_budgeted_line: true,
              months: [
                { month: 1, planned: 200, executed_budgeted: executed, executed_unbudgeted: 0 },
              ],
            },
          ],
        },
      ],
    },
  };
}

async function mountDashboard() {
  const Harness = defineComponent({
    setup() {
      return useBudgetDashboardPage(ref('budget'));
    },
    template: '<div />',
  });
  const wrapper = mount(Harness);
  await flushPromises();
  wrapper.vm.expenseMonthlySummary = summaryWithExecution(200) as never;
  wrapper.vm.budgetDetailMonth = 1;
  await wrapper.vm.$nextTick();
  return wrapper;
}

describe('useBudgetDashboardPage · filtro por titularidad en gastos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    budgetGet.mockImplementation(async () => ({ data: [] }));
    incomeEntries.value = [];
    accountingTransactions.value = [];
    ownerships.value = [];
    // 100 €/mes de Pablo y 100 €/mes compartidos al 50%: a Pablo le corresponden 150 de los
    // 200 previstos, así que también 150 de los 200 ejecutados.
    expenseEntries.value = [
      expenseEntry({ id: 1, owner: 'Pablo' }),
      expenseEntry({ id: 2, owner: 'Compartido (Pablo 50% / Ana 50%)' }),
    ];
  });

  it('reparte lo ejecutado por titularidad, no solo lo previsto', async () => {
    const wrapper = await mountDashboard();

    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(200, 2);

    wrapper.vm.ownershipFilter = 'Pablo';
    await wrapper.vm.$nextTick();

    // Antes se quedaba en 200: el denominador del peso ya venía repartido, así que el
    // cociente daba 1 y la titularidad se anulaba a sí misma.
    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(150, 2);
    expect(wrapper.vm.expenseExecutionYtdTotals.planned).toBeCloseTo(150, 2);

    wrapper.unmount();
  });

  it('deja a cada titular su parte y nada más', async () => {
    const wrapper = await mountDashboard();

    wrapper.vm.ownershipFilter = 'Ana';
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(50, 2);

    wrapper.unmount();
  });

  it('reparte el libro con la titularidad compartida estructurada', async () => {
    // El libro recibe el formato vigente de ownershipDisplayLabel ("Compartido - ..."),
    // que no debe convertirse a texto para calcular el reparto.
    ownerships.value = [
      {
        id: 10,
        kind: 'shared',
        member: null,
        splits: [
          { member: { id: 1, name: 'Pablo', role: 'adult' }, percent: '50.00' },
          { member: { id: 2, name: 'Ana', role: 'adult' }, percent: '50.00' },
        ],
        allocation_basis: 'explicit_split',
      },
    ];
    accountingTransactions.value = [
      {
        id: 1,
        booking_date: `${YEAR}-01-15`,
        ownership_id: 10,
        member_tag: '',
        quick_entry_kind: 'expense',
        entries: [
          {
            amount: '200.00',
            amount_base: '200.00',
            side: 'debit',
            flow_family: 'expense',
            category_key: 'consumption_expenses',
            subcategory_key: 'housing_home',
            asset_id: null,
            liability_id: null,
          },
        ],
      },
    ];
    expenseEntries.value = [expenseEntry({ owner: 'Compartido (Pablo 50% / Ana 50%)' })];

    const wrapper = await mountDashboard();

    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(200, 2);

    wrapper.vm.ownershipFilter = 'Pablo';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(100, 2);

    wrapper.vm.ownershipFilter = 'Ana';
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.expenseExecutionYtdTotals.executedTotal).toBeCloseTo(100, 2);

    wrapper.unmount();
  });
});
