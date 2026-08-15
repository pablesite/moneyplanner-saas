/** @vitest-environment jsdom */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SettlementConfigurationSheet from '@/domains/budget/components/SettlementConfigurationSheet.vue';

const mocks = vi.hoisted(() => ({
  refreshAll: vi.fn().mockResolvedValue(undefined),
  getConfiguration: vi.fn().mockResolvedValue({
    is_enabled: false,
    activation_date: null,
    base_currency: 'EUR',
    readiness_status: 'not_checked',
    readiness_checked_at: null,
    accounts: [
      {
        id: 1,
        asset_id: 2,
        asset_name: 'Cuenta Compartida',
        role: 'operating',
        member_id: null,
        member_name: null,
        currency: 'EUR',
        is_primary: false,
        accepted_physical_balance: null,
        modeled_balance_at_activation: null,
        wallet_difference: null,
      },
      {
        id: 2,
        asset_id: 1,
        asset_name: 'Cuenta Pablo',
        role: 'personal_destination',
        member_id: 1,
        member_name: 'Pablo',
        currency: 'EUR',
        is_primary: true,
        accepted_physical_balance: null,
        modeled_balance_at_activation: null,
        wallet_difference: null,
      },
      {
        id: 3,
        asset_id: 82,
        asset_name: 'Cuenta Ana',
        role: 'personal_destination',
        member_id: 2,
        member_name: 'Ana',
        currency: 'EUR',
        is_primary: true,
        accepted_physical_balance: null,
        modeled_balance_at_activation: null,
        wallet_difference: null,
      },
      {
        id: 10,
        asset_id: 87,
        asset_name: 'Monedero Compartido',
        role: 'physical_cash',
        member_id: null,
        member_name: null,
        currency: 'EUR',
        is_primary: false,
        accepted_physical_balance: '178.72',
        modeled_balance_at_activation: null,
        wallet_difference: null,
      },
    ],
    opening_adjustments: [],
    opening_balances: [],
  }),
  saveConfiguration: vi.fn(),
  getReadiness: vi.fn().mockResolvedValue({
    status: 'blocked',
    is_enabled: false,
    activation_date: null,
    base_currency: 'EUR',
    target_period: { year: 2026, month: 8 },
    blockers: [{ code: 'income_missing_ownership', entry_id: 47, name: 'Dividendos' }],
    warnings: [],
    wallet_reconciliations: [
      {
        account_id: 10,
        asset_id: 87,
        asset_name: 'Monedero Compartido',
        currency: 'EUR',
        balance_date: '2026-08-15',
        modeled_balance: '178.72',
        accepted_physical_balance: '178.72',
        difference: '0.00',
        normalization_recorded: false,
      },
    ],
    allocation_coverage: [],
  }),
}));

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: { to: { type: Object, required: true } },
  template: '<a><slot /></a>',
});

vi.mock('@/domains/people/store', () => ({
  usePeopleStore: () => ({
    members: [
      { id: 1, name: 'Pablo' },
      { id: 2, name: 'Ana' },
    ],
    activeAdults: [
      { id: 1, name: 'Pablo' },
      { id: 2, name: 'Ana' },
    ],
    fetchMembers: vi.fn(),
  }),
}));

vi.mock('@/domains/net-worth/store', () => ({
  useNetWorthStore: () => ({
    assets: [
      {
        id: 2,
        name: 'Cuenta Compartida',
        category: 'cash',
        subcategory: 'bank_account',
        currency: 'EUR',
        amount: '1000.00',
        effective_amount: '1000.00',
        ownership_ref: 3,
        is_active: true,
      },
      {
        id: 1,
        name: 'Cuenta Pablo',
        category: 'cash',
        subcategory: 'bank_account',
        currency: 'EUR',
        amount: '100.00',
        effective_amount: '100.00',
        ownership_ref: 1,
        is_active: true,
      },
      {
        id: 82,
        name: 'Cuenta Ana',
        category: 'cash',
        subcategory: 'bank_account',
        currency: 'EUR',
        amount: '200.00',
        effective_amount: '200.00',
        ownership_ref: 2,
        is_active: true,
      },
      {
        id: 87,
        name: 'Monedero Compartido',
        category: 'cash',
        subcategory: 'wallet',
        currency: 'EUR',
        amount: '-947.25',
        effective_amount: '325.31',
        ownership_ref: 3,
        is_active: true,
      },
    ],
    ownerships: [
      { id: 1, kind: 'individual', member: { id: 1, name: 'Pablo' } },
      { id: 2, kind: 'individual', member: { id: 2, name: 'Ana' } },
      { id: 3, kind: 'shared', member: null },
    ],
    refreshAll: mocks.refreshAll,
  }),
}));

vi.mock('@/domains/budget/api', () => ({
  activateSettlement: vi.fn(),
  disableSettlement: vi.fn(),
  getSettlementConfiguration: mocks.getConfiguration,
  getSettlementReadiness: mocks.getReadiness,
  saveSettlementConfiguration: mocks.saveConfiguration,
  toBudgetErrorMessage: (reason: unknown) => String(reason),
}));

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('SettlementConfigurationSheet', () => {
  it('refreshes cached net worth data and formats the current wallet balance', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T12:00:00'));
    const wrapper = mount(SettlementConfigurationSheet, {
      attachTo: document.body,
      props: { open: true, year: 2026, month: 8 },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });

    await flushPromises();

    expect(mocks.refreshAll).toHaveBeenCalledOnce();
    expect(mocks.getReadiness).toHaveBeenCalledWith(2026, 8, '2026-08-15');
    expect(document.body.textContent).toContain('Saldo contable a 15/8/2026: 178,72 €');
    expect(document.body.textContent).toContain('Completa estos puntos antes de activar');
    expect(document.body.textContent).toContain('Abrir partida');
    expect(document.body.textContent).toContain('Dividendos');
    expect(wrapper.getComponent(RouterLinkStub).props('to')).toEqual({
      name: 'budget-dashboard',
      query: { editIncome: '47' },
    });
  });

  it('keeps the chosen activation date when saving and checks that exact day', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-15T12:00:00'));
    mocks.saveConfiguration.mockImplementation(async () => mocks.getConfiguration());
    mount(SettlementConfigurationSheet, {
      attachTo: document.body,
      props: { open: true, year: 2026, month: 7 },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    await flushPromises();

    const dateInput = document.body.querySelector<HTMLInputElement>('input[type="date"]');
    expect(dateInput).not.toBeNull();
    dateInput!.value = '2026-08-20';
    dateInput!.dispatchEvent(new Event('input', { bubbles: true }));
    await flushPromises();
    const saveButton = Array.from(document.body.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Guardar y comprobar'),
    );
    expect(saveButton).toBeDefined();
    saveButton!.click();
    await flushPromises();

    expect(mocks.saveConfiguration).toHaveBeenCalledOnce();
    expect(mocks.getReadiness).toHaveBeenLastCalledWith(2026, 8, '2026-08-20');
    expect(dateInput!.value).toBe('2026-08-20');
  });
});
