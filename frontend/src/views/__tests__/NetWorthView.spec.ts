/** @vitest-environment jsdom */
import { defineComponent, reactive, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import NetWorthView from '../NetWorthView.vue';

const mockUseNetWorthViewState = vi.fn();
const mockUseNetWorthViewExtensions = vi.fn();
const mockAnnualExpenseStore = {
  listBySourceLiability: vi.fn(async () => []),
};
const mockCoreNetWorthApi = vi.hoisted(() => ({
  getAssetTimeline: vi.fn(),
  getLiabilityTimeline: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn() }),
}));

function makeStub(name: string, template = `<div data-test="${name}"><slot /></div>`) {
  return defineComponent({
    name,
    template,
  });
}

vi.mock('@/domains/net-worth', () => ({
  NetWorthEvolutionChart: makeStub('NetWorthEvolutionChart'),
  NetWorthDeltaChart: makeStub('NetWorthDeltaChart'),
  NetWorthTimelineChart: makeStub('NetWorthTimelineChart'),
  NetWorthDonut: makeStub('NetWorthDonut'),
  coreNetWorthApi: mockCoreNetWorthApi,
  useNetWorthViewState: () => mockUseNetWorthViewState(),
  useNetWorthViewExtensions: () => mockUseNetWorthViewExtensions(),
}));

vi.mock('@/domains/net-worth/components/NetWorthItemModals.vue', () => ({
  default: defineComponent({
    name: 'NetWorthItemModals',
    props: {
      showAssetModal: { type: Boolean, required: true },
      showLiabilityModal: { type: Boolean, required: true },
      showEditModal: { type: Boolean, required: true },
    },
    template: `
      <div>
        <div v-if="showAssetModal" data-test="asset-modal">asset-modal</div>
        <div v-if="showLiabilityModal" data-test="liability-modal">liability-modal</div>
        <div v-if="showEditModal" data-test="edit-modal">edit-modal</div>
      </div>
    `,
  }),
}));

vi.mock('@/domains/ui', () => ({
  AButton: defineComponent({
    name: 'AButton',
    props: {
      variant: { type: String, required: false, default: 'default' },
      size: { type: String, required: false, default: 'md' },
      disabled: { type: Boolean, default: false },
      type: { type: String, required: false, default: 'button' },
    },
    template: `
      <button
        :type="type"
        class="btn"
        :class="[
          variant !== 'default' ? 'btn-' + variant : '',
          size === 'sm' ? 'btn-sm' : '',
        ]"
        :disabled="disabled"
      >
        <slot />
      </button>
    `,
  }),
  APageHead: defineComponent({
    name: 'APageHead',
    props: { title: { type: String, required: true } },
    template: `
      <header>
        <h1>{{ title }}</h1>
        <div><slot name="meta" /></div>
        <div><slot name="actions" /></div>
      </header>
    `,
  }),
  AInfoHint: defineComponent({
    name: 'AInfoHint',
    props: { label: { type: String, required: false, default: '' } },
    template: `<span class="info-hint"><slot /></span>`,
  }),
  AContextBar: makeStub('AContextBar'),
  AMetaPill: makeStub('AMetaPill'),
  AState: makeStub('AState'),
  AHero: defineComponent({
    name: 'AHero',
    props: {
      eyebrow: { type: String, required: false, default: '' },
      value: { type: String, required: false, default: '' },
    },
    template: `
      <div>
        <p v-if="eyebrow">{{ eyebrow }}</p>
        <slot name="value"><span v-if="value">{{ value }}</span></slot>
        <div><slot name="delta" /></div>
        <slot />
      </div>
    `,
  }),
  ASelect: defineComponent({
    name: 'ASelect',
    props: {
      modelValue: { type: [String, Number], required: false, default: null },
      options: { type: Array, required: true },
      disabled: { type: Boolean, default: false },
      searchable: { type: Boolean, default: undefined },
    },
    emits: ['update:modelValue'],
    template: `
      <select
        :value="modelValue == null ? '' : String(modelValue)"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <template v-for="opt in options">
          <optgroup v-if="opt.group" :key="opt.group" :label="opt.group">
            <option v-for="o in opt.options" :key="String(o.value)" :value="String(o.value)">{{ o.label }}</option>
          </optgroup>
          <option v-else :key="String(opt.value)" :value="String(opt.value)">{{ opt.label }}</option>
        </template>
      </select>
    `,
  }),
  ASectHead: defineComponent({
    name: 'ASectHead',
    props: {
      title: { type: String, required: true },
      subtitle: { type: String, required: false, default: '' },
    },
    template: `
      <header>
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
        <div><slot name="actions" /></div>
      </header>
    `,
  }),
  ARowMenu: defineComponent({
    name: 'ARowMenu',
    props: {
      items: { type: Array, required: true },
    },
    emits: ['select'],
    template: `
      <div>
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          :data-test="'row-menu-' + item.id"
          @click="$emit('select', item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    `,
  }),
  BaseModal: defineComponent({
    name: 'BaseModal',
    props: {
      open: { type: Boolean, required: true },
      title: { type: String, required: false, default: '' },
    },
    emits: ['close'],
    template: `
      <section v-if="open">
        <slot name="header" title-id="test-title" :close="() => $emit('close')">
          <h3>{{ title }}</h3>
        </slot>
        <slot />
      </section>
    `,
  }),
}));

vi.mock('@/domains/budget/annual-entries', () => ({
  useAnnualExpenseStore: () => mockAnnualExpenseStore,
}));

function makeState(overrides: Record<string, unknown> = {}) {
  const { store: storeOverrides, ...otherOverrides } = overrides;
  const store = reactive({
    loading: false,
    error: null as string | null,
    baseCurrency: 'EUR',
    inflationRegion: 'ES',
    summary: {
      base_currency: 'EUR',
      total_assets: '1000',
      total_liabilities: '250',
      net_worth: '750',
      assets_by_category: {},
      assets_by_subcategory: {},
      liabilities_by_category: {},
      inflation_region: 'ES',
      inflation_base_period: '2025-01',
      inflation_available: true,
      inflation_status: 'available',
    },
    assets: [
      {
        id: 11,
        name: 'Cuenta principal',
        category: 'cash',
        subcategory: 'bank_account',
        amount: '1000',
        amount_base: '1000',
        currency: 'EUR',
        is_active: true,
        ownership_ref: null,
      },
    ],
    liabilities: [
      {
        id: 41,
        name: 'Hipoteca',
        category: 'mortgage',
        amount: '250',
        amount_base: '250',
        currency: 'EUR',
        is_active: true,
        ownership_ref: null,
        financed_asset_ref: 11,
      },
    ],
    ownerships: [],
    timeline: {
      group_by: 'month',
      start_date: '2025-01-01',
      end_date: '2026-03-31',
      base_currency: 'EUR',
      filters: {
        asset_category: null,
        liability_category: null,
      },
      rows: [
        { date: '2025-11-30', net_worth: '500', total_assets: '700', total_liabilities: '200' },
        { date: '2025-12-31', net_worth: '520', total_assets: '720', total_liabilities: '200' },
        { date: '2026-01-31', net_worth: '540', total_assets: '750', total_liabilities: '210' },
        { date: '2026-02-28', net_worth: '560', total_assets: '780', total_liabilities: '220' },
        { date: '2026-03-31', net_worth: '600', total_assets: '830', total_liabilities: '230' },
      ],
      comparisons: {
        previous_month_close: {
          date: '2026-02-28',
          net_worth: '560',
          total_assets: '780',
          total_liabilities: '220',
        },
        same_day_previous_month: {
          date: '2026-02-01',
          net_worth: '550',
          total_assets: '770',
          total_liabilities: '220',
        },
        previous_year_close: {
          date: '2025-12-31',
          net_worth: '520',
          total_assets: '720',
          total_liabilities: '200',
        },
        same_day_previous_year: {
          date: '2025-01-01',
          net_worth: '500',
          total_assets: '700',
          total_liabilities: '200',
        },
      },
    },
    timelineLoading: false,
    positionTimeline: {
      rows: [{ date: '2026-01-31', value: '1000', value_base: '1000' }],
      base_currency: 'EUR',
      position_type: 'asset',
      position_id: 11,
    },
    positionTimelineLoading: false,
    positionActivityLoading: false,
    assetValuations: [],
    liabilityValuations: [],
    investmentEvents: [],
    liquidityEvents: [],
    liabilityEvents: [],
    snapshots: [],
    refreshAll: vi.fn(),
    fetchTimeline: vi.fn(async () => {}),
    fetchPositionTimeline: vi.fn(async () => {}),
    fetchPositionActivity: vi.fn(async () => {}),
    createTodaySnapshot: vi.fn(),
    updateBaseCurrency: vi.fn(),
    updateInflationRegion: vi.fn(),
    createLiability: vi.fn(async () => null),
    updateAsset: vi.fn(async () => {}),
    archiveAsset: vi.fn(async () => {}),
    unarchiveAsset: vi.fn(async () => {}),
    deleteAsset: vi.fn(async () => {}),
    updateLiability: vi.fn(async () => {}),
    archiveLiability: vi.fn(async () => {}),
    unarchiveLiability: vi.fn(async () => {}),
    deleteLiability: vi.fn(async () => {}),
    ...((storeOverrides as object) ?? {}),
  });

  return {
    store,
    valueMode: ref<'nominal' | 'real'>('nominal'),
    currencies: [
      { value: 'EUR', label: 'EUR' },
      { value: 'USD', label: 'USD' },
    ],
    assetCategories: [{ value: 'cash', label: 'Liquidez' }],
    assetSubcategories: [{ category: 'cash', value: 'bank_account', label: 'Cuenta bancaria' }],
    liabilityCategories: [{ value: 'mortgage', label: 'Hipoteca' }],
    prettyError: vi.fn(() => 'Error bonito'),
    showAssetModal: ref(false),
    showLiabilityModal: ref(false),
    showBreakdown: ref(false),
    showEditModal: ref(false),
    editItem: ref(null),
    editKind: ref<'asset' | 'liability' | null>(null),
    canShowReal: vi.fn(() => true),
    submitAsset: vi.fn(async () => {}),
    submitLiability: vi.fn(async () => {}),
    openEdit: vi.fn(),
    closeEdit: vi.fn(),
    editTitle: 'Editar activo',
    editCategories: [],
    editInitial: null,
    submitEdit: vi.fn(async () => {}),
    unitLabel: vi.fn(() => 'EUR'),
    modeLabel: vi.fn(() => 'Nominal'),
    realBaseLabel: ref('Base: 2025-01'),
    summaryAssets: ref('1000'),
    summaryLiabilities: ref('250'),
    summaryNetWorth: ref('750'),
    byCategoryKeys: ref(['cash']),
    byCategoryAssets: ref([1000]),
    byCategoryLiabilities: ref([250]),
    summaryAssetBackedLiabilities: ref('150'),
    summaryUnbackedLiabilities: ref('100'),
    editError: ref<string | null>(null),
    ...otherOverrides,
  };
}

async function openTab(wrapper: ReturnType<typeof mount>, label: string): Promise<void> {
  const tab = wrapper.findAll('.a-nw-tabs-bar .tab').find((button) => button.text() === label);
  if (!tab) throw new Error(`Tab not found: ${label}`);
  await tab.trigger('click');
}

describe('NetWorthView', () => {
  beforeEach(() => {
    mockUseNetWorthViewState.mockReset();
    mockUseNetWorthViewExtensions.mockReset();
    mockAnnualExpenseStore.listBySourceLiability.mockClear();
    mockCoreNetWorthApi.getAssetTimeline.mockReset();
    mockCoreNetWorthApi.getLiabilityTimeline.mockReset();
  });

  it('renders the direction-a sections and visible euro amounts', () => {
    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...makeState().store,
          snapshots: [{ id: 5, snapshot_date: '2026-01-01' }],
        },
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);

    expect(wrapper.text()).toContain('Patrimonio');
    expect(wrapper.text()).toContain('Patrimonio neto');
    expect(wrapper.text()).toContain('Evolución');
    expect(wrapper.text()).toContain('Balance');
    expect(wrapper.text()).toContain('Mes');
    expect(wrapper.text()).toContain('Año');
    expect(wrapper.text()).toContain('vs cierre anterior');
    expect(wrapper.text()).toContain('vs 1 de febrero');
    expect(wrapper.text()).toContain('vs 1 de enero de 2025');
    expect(wrapper.text()).not.toContain('Mismo día');
    expect(wrapper.text()).not.toContain('este año');
    expect(wrapper.text()).toContain('+190 €');
    expect(wrapper.text()).toContain('+200 €');
    expect(wrapper.text()).toContain('+230 €');
    expect(wrapper.text()).toContain('+250 €');
    expect(wrapper.text()).toContain('Capital propio');
    expect(wrapper.text()).toContain('patrimonio neto dividido entre activos totales');
    expect(wrapper.text()).toContain('01 ene 2026');
    expect(wrapper.text()).toContain('750,00€');
    expect(wrapper.text()).toContain('1.000,00 €');
    expect(wrapper.text()).not.toContain('Base EUR');
    expect(wrapper.text()).not.toContain('+ Añadir cuenta');
  });

  it('keeps archived positions inside the page head metadata', () => {
    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...makeState().store,
          assets: [
            {
              id: 11,
              name: 'Cuenta principal',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '1000',
              amount_base: '1000',
              currency: 'EUR',
              is_active: true,
              ownership_ref: null,
            },
            {
              id: 12,
              name: 'Cuenta antigua',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '100',
              amount_base: '100',
              currency: 'EUR',
              is_active: false,
              ownership_ref: null,
            },
          ],
        },
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);

    expect(wrapper.find('header .a-nw-archived-trigger').text()).toContain('1 archivadas');
    expect(wrapper.find('.page > .a-nw-archived-trigger').exists()).toBe(false);
  });

  it('calculates hero comparisons inside the selected ownership scope', async () => {
    mockCoreNetWorthApi.getAssetTimeline.mockImplementation(async (id: number) => ({
      data: {
        rows:
          id === 11
            ? [
                { date: '2026-02-28', value: '180', value_base: '180' },
                { date: '2026-03-31', value: '200', value_base: '200' },
              ]
            : [
                { date: '2026-02-28', value: '40', value_base: '40' },
                { date: '2026-03-31', value: '50', value_base: '50' },
              ],
      },
    }));
    mockCoreNetWorthApi.getLiabilityTimeline.mockResolvedValue({
      data: {
        rows: [
          { date: '2026-02-28', value: '90', value_base: '90' },
          { date: '2026-03-31', value: '100', value_base: '100' },
        ],
      },
    });

    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...makeState().store,
          snapshots: [{ id: 5, snapshot_date: '2026-03-31' }],
          assets: [
            {
              id: 11,
              name: 'Cuenta compartida',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '200',
              amount_base: '200',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 2,
            },
            {
              id: 12,
              name: 'Cuenta Pablo',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '50',
              amount_base: '50',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 1,
            },
          ],
          liabilities: [
            {
              id: 41,
              name: 'Prestamo compartido',
              category: 'mortgage',
              amount: '100',
              amount_base: '100',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 2,
              financed_asset_ref: 11,
            },
          ],
          ownerships: [
            {
              id: 1,
              kind: 'individual',
              member: { id: 7, name: 'Pablo', role: 'adult' },
              splits: [],
              notes: '',
            },
            {
              id: 2,
              kind: 'shared',
              member: null,
              splits: [
                { member: { id: 7, name: 'Pablo', role: 'adult' }, percent: '50' },
                { member: { id: 8, name: 'Ana', role: 'adult' }, percent: '50' },
              ],
              notes: '',
            },
          ],
        },
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await wrapper.get('[data-test="ownership-filter"] select').setValue('7');
    await flushPromises();

    expect(mockCoreNetWorthApi.getAssetTimeline).toHaveBeenCalledWith(11);
    expect(mockCoreNetWorthApi.getAssetTimeline).toHaveBeenCalledWith(12);
    expect(mockCoreNetWorthApi.getLiabilityTimeline).toHaveBeenCalledWith(41);
    expect(wrapper.text()).toContain('100,00€');
    expect(wrapper.text()).toContain('+15 €');
    expect(wrapper.text()).not.toContain('-460 €');
  });

  it('recalculates the visible totals when ownership changes', async () => {
    const base = makeState();
    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...base.store,
          ownerships: [
            {
              id: 7,
              kind: 'shared',
              member: null,
              splits: [
                { member: { id: 3, name: 'Ana', role: 'adult' }, percent: '60' },
                { member: { id: 4, name: 'Luis', role: 'adult' }, percent: '40' },
              ],
              notes: '',
            },
            {
              id: 8,
              kind: 'individual',
              member: { id: 3, name: 'Ana', role: 'adult' },
              splits: [],
              notes: '',
            },
          ],
          assets: [
            {
              id: 11,
              name: 'Cuenta compartida',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '1000',
              amount_base: '1000',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 7,
            },
            {
              id: 12,
              name: 'Cuenta Ana',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '200',
              amount_base: '200',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 8,
            },
          ],
          liabilities: [
            {
              id: 41,
              name: 'Hipoteca compartida',
              category: 'mortgage',
              amount: '100',
              amount_base: '100',
              currency: 'EUR',
              is_active: true,
              ownership_ref: 7,
              financed_asset_ref: 11,
            },
          ],
        },
        summaryAssets: ref('1200'),
        summaryLiabilities: ref('100'),
        summaryNetWorth: ref('1100'),
        byCategoryAssets: ref([1200]),
        byCategoryLiabilities: ref([100]),
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await wrapper.get('[data-test="ownership-filter"] select').setValue('3');

    expect(wrapper.text()).toContain('740,00€');
    expect(wrapper.text()).toContain('800,00 €');
    expect(wrapper.text()).toContain('60,00 €');
  });

  it('opens the asset modal from the mobile balance action', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    expect(wrapper.text()).not.toContain('Hoy');
    expect(wrapper.find('.a-nw-mobile-create').exists()).toBe(false);

    await openTab(wrapper, 'Balance');
    await wrapper.get('.a-nw-mobile-create').trigger('click');

    expect(wrapper.find('[data-test="asset-modal"]').exists()).toBe(false);

    await wrapper.get('.a-nw-mobile-create-menu .btn:first-child').trigger('click');
    expect(wrapper.find('[data-test="asset-modal"]').exists()).toBe(true);
  });

  it('opens the liability modal from the mobile balance action', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');
    await wrapper.get('.a-nw-mobile-create').trigger('click');
    await wrapper.get('.a-nw-mobile-create-menu .btn:nth-child(2)').trigger('click');

    expect(wrapper.find('[data-test="liability-modal"]').exists()).toBe(true);
  });

  it('opens evolution from a hero breakdown category and returns to general', async () => {
    const state = makeState();
    mockUseNetWorthViewState.mockReturnValue(state);
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await wrapper.get('.comp-row').trigger('click');
    await flushPromises();

    expect(state.store.fetchTimeline).toHaveBeenCalledWith('cash', 'asset');
    expect(wrapper.find('.a-nw-evolution-section').exists()).toBe(true);
    expect(wrapper.find('.a-nw-evolution-back').exists()).toBe(true);

    await wrapper.get('.a-nw-evolution-back').trigger('click');
    expect(wrapper.find('.hero-breakdown').exists()).toBe(true);
    expect(wrapper.find('.a-nw-evolution-section').exists()).toBe(false);
  });

  it('selects a balance row and fetches the per-position timeline', async () => {
    const state = makeState();
    mockUseNetWorthViewState.mockReturnValue(state);
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');
    await wrapper.findAll('tr.clickable')[1]!.trigger('click');

    expect(state.store.fetchPositionTimeline).toHaveBeenCalledWith('asset', 11);
    expect(state.store.fetchPositionActivity).toHaveBeenCalledWith('asset', 11, 'cash');
  });

  it('opens a mobile position detail from the compact balance list', async () => {
    const state = makeState();
    mockUseNetWorthViewState.mockReturnValue(state);
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');
    const mobileRows = wrapper.findAll('.a-nw-mobile-row');

    expect(mobileRows).toHaveLength(2);
    await mobileRows[0]!.trigger('click');

    expect(state.store.fetchPositionTimeline).toHaveBeenCalledWith('asset', 11);
    expect(wrapper.text()).toContain('Detalle de activo');
    expect(wrapper.text()).toContain('Cuenta principal');
    expect(wrapper.text()).toContain('Fuente');
    expect(wrapper.text()).toContain('Manual');
    expect(wrapper.text()).toContain('Último valor');
    expect(wrapper.text()).toContain('Cambio mensual');
    expect(wrapper.text()).toContain('Cambio YTD');
    expect(wrapper.get('[aria-label="Editar posición"]').attributes('title')).toBe(
      'Editar posición',
    );
    expect(wrapper.get('[aria-label="Cerrar detalle"]').attributes('title')).toBe('Cerrar');
    expect(wrapper.text()).not.toContain('Editar posición');
  });

  it('filters the mobile balance list by search text', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');
    await wrapper.get('.a-nw-mobile-search').setValue('hipoteca');
    const mobileListText = wrapper.get('.a-nw-mobile-balance-list').text();

    expect(wrapper.findAll('.a-nw-mobile-row')).toHaveLength(1);
    expect(mobileListText).toContain('Hipoteca');
    expect(mobileListText).not.toContain('Cuenta principal');
  });

  it('collapses and expands balance groups', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');

    expect(wrapper.findAll('.a-nw-mobile-row')).toHaveLength(2);

    const firstGroup = wrapper.get('.a-nw-mobile-group-head');
    expect(firstGroup.attributes('aria-expanded')).toBe('true');

    await firstGroup.trigger('click');
    expect(firstGroup.attributes('aria-expanded')).toBe('false');
    expect(wrapper.findAll('.a-nw-mobile-row')).toHaveLength(1);
    expect(wrapper.get('.a-nw-mobile-balance-list').text()).not.toContain('Cuenta principal');

    await firstGroup.trigger('click');
    expect(firstGroup.attributes('aria-expanded')).toBe('true');
    expect(wrapper.findAll('.a-nw-mobile-row')).toHaveLength(2);
  });

  it('renders each balance kind label once around its collapsible groups', async () => {
    const state = makeState({
      store: {
        ...makeState().store,
        assets: [
          ...makeState().store.assets,
          {
            id: 12,
            name: 'Cartera indexada',
            category: 'investments',
            subcategory: 'funds',
            amount: '200',
            amount_base: '200',
            currency: 'EUR',
            is_active: true,
            ownership_ref: null,
          },
        ],
      },
      assetCategories: [
        { value: 'cash', label: 'Liquidez' },
        { value: 'investments', label: 'Inversiones' },
      ],
    });
    mockUseNetWorthViewState.mockReturnValue(state);
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');

    const labels = wrapper.findAll('.a-nw-mobile-section-head').map((node) => node.text());
    expect(labels).toHaveLength(2);
    expect(labels[0]).toContain('Activos');
    expect(labels[1]).toContain('Pasivos');
    expect(wrapper.findAll('.a-nw-mobile-group-head')).toHaveLength(3);
    expect(
      wrapper.findAll('.a-nw-mobile-group-head').some((node) => node.text().includes('Activos')),
    ).toBe(false);
    expect(
      wrapper.findAll('.a-nw-mobile-group-head').some((node) => node.text().includes('Pasivos')),
    ).toBe(false);
  });

  it('shows eight decimals for crypto original amounts', async () => {
    const base = makeState();
    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...base.store,
          assets: [
            {
              id: 15,
              name: 'Cripto',
              category: 'investments',
              subcategory: 'cryptocurrencies',
              amount: '0.17123456',
              amount_base: '233.21',
              currency: 'ETH',
              is_active: true,
              ownership_ref: null,
            },
          ],
          liabilities: [],
        },
        assetCategories: [{ value: 'investments', label: 'Inversiones' }],
        assetSubcategories: [
          { category: 'investments', value: 'cryptocurrencies', label: 'Criptomonedas' },
        ],
        byCategoryKeys: ref(['investments']),
        byCategoryAssets: ref([233.21]),
        byCategoryLiabilities: ref([0]),
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Balance');

    expect(wrapper.text()).toContain('(0,17123456 ETH)');
  });

  it('shows archived items and restores them from the archived modal', async () => {
    const base = makeState();
    mockUseNetWorthViewState.mockReturnValue(
      makeState({
        store: {
          ...base.store,
          assets: [
            ...base.store.assets,
            {
              id: 91,
              name: 'Cuenta antigua',
              category: 'cash',
              subcategory: 'bank_account',
              amount: '500',
              amount_base: '500',
              currency: 'EUR',
              is_active: false,
              ownership_ref: null,
            },
          ],
        },
      }),
    );
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await wrapper.get('.a-nw-archived-trigger').trigger('click');
    await wrapper.get('.a-nw-archived-list .btn').trigger('click');

    const state = mockUseNetWorthViewState.mock.results[0]?.value;
    expect(wrapper.text()).toContain('Cuenta antigua');
    expect(state.store.unarchiveAsset).toHaveBeenCalledWith(91);
  });

  it('simplifies evolution controls to scope and range only', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Evolución');

    expect(wrapper.text()).toContain('3a');
    expect(wrapper.text()).toContain('Fechas');
    expect(wrapper.find('.a-nw-evolution-scope-inline').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Rango de evolución"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Detalle');
    expect(wrapper.text()).not.toContain('Personalizado');
    expect(wrapper.text()).not.toContain('Diaria');
    expect(
      wrapper.findAll('.a-nw-evolution-mini-seg .btn').some((button) => button.text() === '1m'),
    ).toBe(false);
  });

  it('keeps range controls visible when a custom date range has no data', async () => {
    mockUseNetWorthViewState.mockReturnValue(makeState());
    mockUseNetWorthViewExtensions.mockReturnValue({ itemFormProps: {} });

    const wrapper = mount(NetWorthView);
    await openTab(wrapper, 'Evolución');
    const datesButton = wrapper
      .findAll('.a-nw-evolution-mini-seg .btn')
      .find((button) => button.text() === 'Fechas');
    if (!datesButton) throw new Error('Fechas button not found');

    await datesButton.trigger('click');
    await wrapper.get('.a-nw-evolution-date-range input[type="date"]').setValue('2099-01-01');

    expect(wrapper.text()).toContain('No hay historial suficiente');
    expect(wrapper.find('[aria-label="Rango de evolución"]').exists()).toBe(true);
    expect(
      wrapper.findAll('.a-nw-evolution-mini-seg .btn').some((button) => button.text() === '5a'),
    ).toBe(true);
  });
});
