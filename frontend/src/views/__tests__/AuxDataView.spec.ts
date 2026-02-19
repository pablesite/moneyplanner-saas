/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import AuxDataView from '../AuxDataView.vue';

vi.mock('@/domains/people', () => ({
  FamilyMemberManager: {
    template: '<div data-testid="family-manager">Family manager mock</div>',
  },
  OwnershipManager: {
    template: '<div data-testid="ownership-manager">Ownership manager mock</div>',
  },
}));

vi.mock('@/domains/aux-data', () => ({
  useAuxDataPage: () => ({
    loading: ref(false),
    error: ref(null),
    successMessage: ref(null),
    inflation: ref([]),
    ipcForm: ref({ region: 'ES', period: '', index: '' }),
    createInflation: vi.fn(),
    deleteInflation: vi.fn(),
    formatInflationIndex: (value: string) => value,
    fxRates: ref([]),
    fxForm: ref({ rate_date: '', pair: 'USD_EUR', rate: '' }),
    fxPairs: [{ value: 'USD_EUR', label: 'USD -> EUR' }],
    fxRatePlaceholder: ref('0.92'),
    createFxRate: vi.fn(),
    deleteFxRate: vi.fn(),
    formatFxRate: (value: string) => value,
  }),
}));

describe('AuxDataView (settings accordion)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the three settings sections', () => {
    const wrapper = mount(AuxDataView);

    expect(wrapper.text()).toContain('Settings');
    expect(wrapper.text()).toContain('Miembros de la familia');
    expect(wrapper.text()).toContain('Datos IPC');
    expect(wrapper.text()).toContain('Tasas de conversion');
    expect(wrapper.text()).toContain('Titularidades');
  });

  it('toggles each section in the same view', async () => {
    const wrapper = mount(AuxDataView);

    expect(wrapper.find('[data-testid="family-manager"]').exists()).toBe(true);

    const toggles = wrapper.findAll('.ui-settings-toggle');
    await toggles[0]!.trigger('click');
    expect(wrapper.find('[data-testid="family-manager"]').exists()).toBe(false);

    await toggles[1]!.trigger('click');
    expect(wrapper.text()).toContain('No hay indices IPC todavia.');

    await toggles[1]!.trigger('click');
    expect(wrapper.text()).not.toContain('No hay indices IPC todavia.');

    await toggles[2]!.trigger('click');
    expect(wrapper.text()).toContain('No hay FX rates todavia.');
  });

  it('switches between miembros and titularidades inside family section', async () => {
    const wrapper = mount(AuxDataView);

    expect(wrapper.find('[data-testid="family-manager"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="ownership-manager"]').exists()).toBe(false);

    const ownershipTab = wrapper.findAll('.ui-settings-family-tabs button')[1];
    await ownershipTab!.trigger('click');

    expect(wrapper.find('[data-testid="family-manager"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="ownership-manager"]').exists()).toBe(true);
  });
});
