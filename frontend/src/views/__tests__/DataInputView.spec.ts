/** @vitest-environment jsdom */
import { reactive, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, shallowMount } from '@vue/test-utils';
import DataInputView from '../DataInputView.vue';

const mockCoreApiGet = vi.hoisted(() => vi.fn());
const mockNetWorthStore = vi.hoisted(() => ({
  assets: [],
  liabilities: [],
  ownerships: [],
  loading: false,
  error: null as string | null,
  baseCurrency: 'EUR',
  summary: {
    base_currency: 'EUR',
    total_assets: '0',
    total_liabilities: '0',
    assets_by_category: {},
    assets_by_subcategory: {},
    liabilities_by_category: {},
  },
  refreshAll: vi.fn(async () => undefined),
  archiveAsset: vi.fn(async () => undefined),
  archiveLiability: vi.fn(async () => undefined),
  createAsset: vi.fn(async () => ({ id: 1 })),
  updateAsset: vi.fn(async () => undefined),
  deleteAsset: vi.fn(async () => undefined),
  createLiability: vi.fn(async () => ({ id: 1 })),
  updateLiability: vi.fn(async () => undefined),
  deleteLiability: vi.fn(async () => undefined),
}));
const mockIncomeEntries = { value: [] as unknown[] };
const mockExpenseEntries = { value: [] as unknown[] };
const mockIncomeStore = {
  entries: mockIncomeEntries,
  loading: { value: false },
  error: { value: null as string | null },
  loadAll: vi.fn(async () => undefined),
  addEntry: vi.fn(async () => ({ ok: true })),
  updateEntry: vi.fn(async () => ({ ok: true })),
  deleteEntry: vi.fn(async () => undefined),
};
const mockExpenseStore = {
  entries: mockExpenseEntries,
  loading: { value: false },
  error: { value: null as string | null },
  loadAll: vi.fn(async () => undefined),
  addEntry: vi.fn(async () => ({ ok: true })),
  updateEntry: vi.fn(async () => ({ ok: true })),
  deleteEntry: vi.fn(async () => undefined),
  listBySourceLiability: vi.fn(async () => []),
};

vi.mock('@/lib/api', () => ({
  coreApi: {
    get: mockCoreApiGet,
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/domains/net-worth', () => ({
  useNetWorthViewState: () => {
    const state = reactive(mockNetWorthStore);
    return {
      store: state,
      assetCategories: [{ value: 'cash', label: 'Efectivo' }],
      assetSubcategories: [{ category: 'cash', value: 'bank_account', label: 'Cuenta bancaria' }],
      liabilityCategories: [{ value: 'loan', label: 'Prestamo' }],
      prettyError: () => 'Error',
      showAssetModal: ref(false),
      showLiabilityModal: ref(false),
      showEditModal: ref(false),
      editItem: ref(null),
      editKind: ref(null),
      openEdit: vi.fn(),
      closeEdit: vi.fn(),
      editTitle: ref('Editar'),
      editCategories: ref([]),
      editInitial: ref(null),
      submitEdit: vi.fn(async () => undefined),
      openAssetModal: vi.fn(),
      closeAssetModal: vi.fn(),
      openLiabilityModal: vi.fn(),
      closeLiabilityModal: vi.fn(),
    };
  },
  useNetWorthViewExtensions: () => ({
    itemFormProps: {},
    itemListProps: {},
  }),
  ItemForm: { template: '<div />' },
  ItemList: { template: '<div />' },
}));

vi.mock('@/domains/data-input', () => ({
  incomeCategories: [{ value: 'salary', label: 'Salario' }],
  incomeSubcategories: [{ category: 'salary', value: 'employee_salary', label: 'Nomina' }],
  expenseCategories: [{ value: 'consumption_expenses', label: 'Gastos' }],
  expenseSubcategories: [
    { category: 'consumption_expenses', value: 'living_expenses', label: 'Alimentacion' },
  ],
  useAnnualIncomeStore: () => mockIncomeStore,
  useAnnualExpenseStore: () => mockExpenseStore,
  useDataInputFilters: () => ({
    globalOwnershipFilter: ref<'all' | 'unassigned' | number>('all'),
    assetOwnershipFilter: ref<'all' | 'unassigned' | number>('all'),
    liabilityOwnershipFilter: ref<'all' | 'unassigned' | number>('all'),
    visibilityFilterMode: ref<'active' | 'archived' | 'all'>('active'),
  }),
}));

describe('DataInputView', () => {
  beforeEach(() => {
    mockCoreApiGet.mockImplementation(async (url: string) => {
      if (url === '/api/core/portable-data/meta/') return { data: { app_version: '0.0.0' } };
      if (url === '/api/budget/annual-income/') return { data: [] };
      if (url === '/api/budget/annual-expense/') return { data: [] };
      if (url === '/api/net-worth/assets/') return { data: [] };
      if (url === '/api/net-worth/liabilities/') return { data: [] };
      if (url === '/api/net-worth/snapshots/') return { data: [] };
      if (url === '/api/auth/settings/') return { data: {} };
      if (url === '/api/family-members/') return { data: [] };
      if (url === '/api/ownerships/') return { data: [] };
      if (url === '/api/ownership-links/') return { data: [] };
      throw new Error(`Unexpected GET ${url}`);
    });
  });

  it('mounts without crashing', async () => {
    const wrapper = shallowMount(DataInputView);
    await flushPromises();
    expect(wrapper.exists()).toBe(true);
  });
});
