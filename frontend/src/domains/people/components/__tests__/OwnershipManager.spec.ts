/** @vitest-environment jsdom */
import { computed, reactive, ref } from 'vue';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import OwnershipManager from '../OwnershipManager.vue';

const mockUsePeopleOwnerships = vi.fn();

vi.mock('@/domains/people/composables', () => ({
  usePeopleOwnerships: () => mockUsePeopleOwnerships(),
}));

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    store: { loading: false, error: null },
    showModal: ref(false),
    editId: ref<number | null>(null),
    successMessage: ref<string | null>(null),
    allocationPreview: ref(null),
    previewLoading: ref(false),
    dynamicAllocationPreviews: ref({}),
    form: reactive({ memberIds: [] as number[], percents: {} as Record<number, string> }),
    adults: computed(() => []),
    canCreate: computed(() => false),
    ownershipsSorted: computed(() => []),
    ensureLoaded: vi.fn(async () => {}),
    refreshOwnerships: vi.fn(async () => {}),
    resetModal: vi.fn(),
    openCreate: vi.fn(),
    openEdit: vi.fn(),
    toggleMember: vi.fn(),
    setEqualSplit: vi.fn(),
    submit: vi.fn(async () => {}),
    removeOwnership: vi.fn(async () => {}),
    ...overrides,
  };
}

describe('OwnershipManager', () => {
  beforeEach(() => {
    mockUsePeopleOwnerships.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows success and empty states', () => {
    mockUsePeopleOwnerships.mockReturnValue(
      makeState({
        successMessage: ref('Titularidad compartida creada correctamente.'),
      }),
    );

    const wrapper = mount(OwnershipManager, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
          OwnershipLabel: { template: '<span>ownership</span>' },
        },
      },
    });

    expect(document.body.textContent).toContain('Titularidad compartida creada correctamente.');
    expect(wrapper.text()).toContain('No hay titularidades');
  });

  it('calls create action from header button', async () => {
    const state = makeState();
    mockUsePeopleOwnerships.mockReturnValue(state);

    const wrapper = mount(OwnershipManager, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
          OwnershipLabel: { template: '<span>ownership</span>' },
        },
      },
    });

    await wrapper.get('button.btn.btn-primary').trigger('click');
    expect(state.openCreate).toHaveBeenCalled();
    expect(state.ensureLoaded).toHaveBeenCalled();
  });

  it('shows the calculated income allocation for dynamic ownerships', () => {
    mockUsePeopleOwnerships.mockReturnValue(
      makeState({
        ownershipsSorted: computed(() => [
          {
            id: 8,
            kind: 'shared',
            member: null,
            splits: [
              { member: { id: 1, name: 'Ana', role: 'adult' }, percent: '50' },
              { member: { id: 2, name: 'Pablo', role: 'adult' }, percent: '50' },
            ],
            allocation_basis: 'recurring_income_12m',
            income_rules: [],
            is_in_use: false,
          },
        ]),
        dynamicAllocationPreviews: ref({
          8: {
            ownership_id: 8,
            allocation_basis: 'recurring_income_12m',
            fiscal_year: 2026,
            month: 8,
            status: 'ready',
            window_start: '2025-08-01',
            window_end: '2026-07-31',
            base_currency: 'EUR',
            quality_reasons: [],
            observed_months: 12,
            eligible_transaction_count: 24,
            excluded_transaction_count: 0,
            total_qualifying_income: '10000.00',
            shares: [
              {
                member_id: 1,
                member_name: 'Ana',
                qualifying_income: '3900.00',
                percent: '39',
              },
              {
                member_id: 2,
                member_name: 'Pablo',
                qualifying_income: '6100.00',
                percent: '61',
              },
            ],
            is_frozen: false,
          },
        }),
      }),
    );

    const wrapper = mount(OwnershipManager, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
          OwnershipLabel: { template: '<span>ownership</span>' },
        },
      },
    });

    expect(wrapper.text()).toContain('Compartido dinámico');
    expect(wrapper.text()).toContain('Ana 39.00%');
    expect(wrapper.text()).toContain('Pablo 61.00%');
    expect(wrapper.text()).toContain('se recalcula cada mes');
    expect(wrapper.text()).not.toContain('Ana 50%');
  });
});
