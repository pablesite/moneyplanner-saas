/** @vitest-environment jsdom */
import { defineComponent, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DataInputView from '../DataInputView.vue';

const mockUseNetWorthViewState = vi.fn();
const mockUseNetWorthViewExtensions = vi.fn();
const mockUseAnnualIncomeStore = vi.fn();

function makeStub(name: string) {
  return defineComponent({
    name,
    template: `<div data-test="${name}"><slot /></div>`,
  });
}

vi.mock('@/domains/net-worth', () => ({
  ItemForm: makeStub('ItemForm'),
  ItemList: makeStub('ItemList'),
  useNetWorthViewState: () => mockUseNetWorthViewState(),
  useNetWorthViewExtensions: () => mockUseNetWorthViewExtensions(),
}));

vi.mock('@/domains/ui', () => ({
  BaseModal: defineComponent({
    name: 'BaseModal',
    props: {
      open: { type: Boolean, required: true },
      title: { type: String, required: false, default: '' },
    },
    template: '<div><slot v-if="open" /></div>',
  }),
}));

vi.mock('@/domains/data-input/annualIncomeStore', () => ({
  useAnnualIncomeStore: () => mockUseAnnualIncomeStore(),
}));

function makeState(overrides: Record<string, unknown> = {}) {
  const store = {
    loading: false,
    error: null as string | null,
    baseCurrency: 'EUR',
    summary: {
      base_currency: 'EUR',
      total_assets: '1000',
      total_liabilities: '250',
      assets_by_category: {},
      assets_by_subcategory: {},
      liabilities_by_category: {},
    },
    assets: [],
    liabilities: [],
    updateAsset: vi.fn(),
    archiveAsset: vi.fn(),
    updateLiability: vi.fn(),
    archiveLiability: vi.fn(),
  };

  return {
    store,
    assetCategories: [{ value: 'cash', label: 'Liquidez' }],
    assetSubcategories: [{ category: 'cash', value: 'bank_account', label: 'Cuenta bancaria' }],
    liabilityCategories: [{ value: 'mortgage', label: 'Hipoteca' }],
    prettyError: vi.fn(() => 'Error bonito'),
    showAssetModal: ref(false),
    showLiabilityModal: ref(false),
    showEditModal: ref(false),
    editKind: ref<'asset' | 'liability' | null>(null),
    submitAsset: vi.fn(),
    submitLiability: vi.fn(),
    openEdit: vi.fn(),
    closeEdit: vi.fn(),
    editTitle: 'Editar activo',
    editCategories: [],
    editInitial: null,
    submitEdit: vi.fn(),
    ...overrides,
  };
}

describe('DataInputView', () => {
  beforeEach(() => {
    mockUseNetWorthViewState.mockReset();
    mockUseNetWorthViewExtensions.mockReset();
    mockUseAnnualIncomeStore.mockReset();
  });

  it('renders Activos and Pasivos sections moved from Patrimonio', () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({
      itemFormProps: {},
      itemListProps: {},
    });
    mockUseAnnualIncomeStore.mockReturnValue({
      entries: ref([]),
      totalAnnual: ref(0),
      loading: ref(false),
      error: ref(null),
      loadAll: vi.fn(),
      addEntry: vi.fn(async () => ({ ok: true })),
      deleteEntry: vi.fn(async () => {}),
    });

    const wrapper = mount(DataInputView);

    expect(wrapper.text()).toContain('Introduccion de datos');
    expect(wrapper.findAll('[data-test="ItemList"]')).toHaveLength(2);
  });
});
