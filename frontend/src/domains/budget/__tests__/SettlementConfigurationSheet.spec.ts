/** @vitest-environment jsdom */
import { flushPromises, mount } from '@vue/test-utils';
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
    accounts: [],
    opening_adjustments: [],
    opening_balances: [],
  }),
  getReadiness: vi.fn().mockResolvedValue({
    status: 'blocked',
    is_enabled: false,
    activation_date: null,
    base_currency: 'EUR',
    target_period: { year: 2026, month: 8 },
    blockers: [],
    warnings: [],
    allocation_coverage: [],
  }),
}));

vi.mock('@/domains/people/store', () => ({
  usePeopleStore: () => ({ members: [], activeAdults: [], fetchMembers: vi.fn() }),
}));

vi.mock('@/domains/net-worth/store', () => ({
  useNetWorthStore: () => ({
    assets: [
      {
        id: 87,
        name: 'Monedero Compartido',
        category: 'cash',
        subcategory: 'wallet',
        currency: 'EUR',
        amount: '-947.25',
        effective_amount: '325.31',
        is_active: true,
      },
    ],
    ownerships: [],
    refreshAll: mocks.refreshAll,
  }),
}));

vi.mock('@/domains/budget/api', () => ({
  activateSettlement: vi.fn(),
  disableSettlement: vi.fn(),
  getSettlementConfiguration: mocks.getConfiguration,
  getSettlementReadiness: mocks.getReadiness,
  saveSettlementConfiguration: vi.fn(),
  toBudgetErrorMessage: (reason: unknown) => String(reason),
}));

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('SettlementConfigurationSheet', () => {
  it('refreshes cached net worth data and formats the current wallet balance', async () => {
    mount(SettlementConfigurationSheet, {
      attachTo: document.body,
      props: { open: true, year: 2026, month: 8 },
    });

    await flushPromises();

    expect(mocks.refreshAll).toHaveBeenCalledOnce();
    expect(document.body.textContent).toContain('Saldo contable actualizado: 325,31 €');
  });
});
