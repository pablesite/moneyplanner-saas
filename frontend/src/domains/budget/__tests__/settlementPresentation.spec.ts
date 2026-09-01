/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { buildSettlementPage } from '@/domains/budget/settlementPresentation';
import type { OwnershipSettlement } from '@/domains/budget/types';
import MonthlyCloseSettlementSection from '@/domains/budget/components/MonthlyCloseSettlementSection.vue';

const members = [
  { id: 1, name: 'Pablo', role: 'adult' as const, is_active: true },
  { id: 2, name: 'Ana', role: 'adult' as const, is_active: true },
];

function readySettlement(): OwnershipSettlement {
  return {
    status: 'ready',
    is_frozen: false,
    base_currency: 'EUR',
    target_period: { year: 2026, month: 9 },
    allocations: [
      {
        ownership_id: 7,
        allocation_basis: 'recurring_income_12m',
        fiscal_year: 2026,
        month: 9,
        window_start: '2025-09-01',
        window_end: '2026-08-31',
        base_currency: 'EUR',
        status: 'ready',
        quality_reasons: [],
        observed_months: 12,
        eligible_transaction_count: 24,
        excluded_transaction_count: 0,
        total_qualifying_income: '60000.00',
        source_hash: 'hash',
        is_frozen: false,
        shares: [
          { member_id: 1, member_name: 'Pablo', qualifying_income: '36600.00', percent: '61.00' },
          { member_id: 2, member_name: 'Ana', qualifying_income: '23400.00', percent: '39.00' },
        ],
      },
    ],
    economic_balances: [
      {
        member_id: 1,
        opening: '1000.00',
        income: '3000.00',
        expense: '500.00',
        compensation: '120.00',
        requirement: '610.00',
        closing: '3500.00',
        excess: '2890.00',
      },
    ],
    accounts: [
      {
        account_id: 10,
        asset_id: 100,
        name: 'Compartida',
        role: 'operating',
        ownership_id: 7,
        opening: '1000.00',
        physical_delta: '3000.00',
        observed_close: '4000.00',
        target_close: '1000.00',
        closing_by_member: [],
        target_by_member: [],
      },
      {
        account_id: 11,
        asset_id: 101,
        name: 'Personal Pablo',
        role: 'personal_destination',
        ownership_id: 8,
        opening: '0.00',
        physical_delta: '0.00',
        observed_close: '0.00',
        target_close: '3000.00',
        closing_by_member: [],
        target_by_member: [],
      },
    ],
    reserves: [
      {
        entry_id: 20,
        name: 'Casa',
        kind: 'reserve',
        cashflow_role: 'operating',
        ownership_id: 7,
        settlement_account_id: 10,
        amount: '1000.00',
        currency: 'EUR',
        members: [],
      },
    ],
    compensations: [],
    recommendations: [
      {
        from_account_id: 10,
        to_account_id: 11,
        member_id: 1,
        ownership_id: 8,
        amount: '3000.00',
        currency: 'EUR',
        reason: 'member_residual',
      },
    ],
    reconciliation: {
      physical_total: '4000.00',
      economic_total: '4000.00',
      target_total: '4000.00',
      physical_vs_economic: '0.00',
      economic_vs_target: '0.00',
    },
    quality: { blockers: [], warnings: [] },
  };
}

describe('settlement presentation', () => {
  it('keeps disabled profiles invisible', () => {
    const page = buildSettlementPage(
      { status: 'disabled', is_frozen: false, quality: { blockers: [], warnings: [] } },
      members,
    );
    expect(page.isVisible).toBe(false);
  });

  it('maps the canonical split, destination and manual route without recalculating it', () => {
    const page = buildSettlementPage(readySettlement(), members);

    expect(page.summary).toEqual({
      distributable: 4000,
      retainedOrAllocated: 1000,
      sharedOperatingReserve: 1000,
      personalOrAllocated: 0,
      towardPersonal: 3000,
    });
    expect(page.reserveOwnershipGroups).toMatchObject([
      {
        ownershipLabel: 'Pablo 61 % · Ana 39 %',
        destinationName: 'Compartida',
        totalNumber: 1000,
        reserveNumber: 1000,
        allocationNumber: 0,
      },
    ]);
    expect(page.destinations[0]?.ownership).toBe('Pablo 61 % · Ana 39 %');
    expect(page.recommendations[0]).toMatchObject({
      sourceAssetId: 100,
      destinationAssetId: 101,
      memberName: 'Pablo',
      amountNumber: 3000,
    });
    expect(page.members[0]).toMatchObject({
      openingNumber: 1000,
      incomeNumber: 3000,
      expenseNumber: 500,
      closingNumber: 3500,
      excessNumber: 2890,
    });
  });

  it('turns blockers into corrective copy and links to the affected movement', async () => {
    const settlement = readySettlement();
    settlement.status = 'not_ready';
    settlement.quality.blockers = [{ code: 'transaction_missing_ownership', transaction_id: 9 }];
    const page = buildSettlementPage(settlement, members);

    expect(page.isReady).toBe(false);
    expect(page.blockers[0]?.message).toContain('movimientos sin titularidad');

    const wrapper = mount(MonthlyCloseSettlementSection, {
      props: {
        page,
        formatMoney: (value: number) => value.toFixed(2),
        formatSignedMoney: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`,
      },
    });
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Abrir movimiento'))
      ?.trigger('click');
    expect(wrapper.emitted('movement')).toEqual([[9]]);
  });

  it('renders a manual recommendation and emits its prefill intent', async () => {
    const page = buildSettlementPage(readySettlement(), members);
    const wrapper = mount(MonthlyCloseSettlementSection, {
      props: {
        page,
        formatMoney: (value: number) => value.toFixed(2),
        formatSignedMoney: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`,
      },
    });

    expect(wrapper.text()).toContain('Prepara las transferencias');
    expect(wrapper.text()).toContain('Compartida → Personal Pablo');
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Preparar transferencia'))
      ?.trigger('click');
    expect(wrapper.emitted('transfer')?.[0]?.[0]).toMatchObject({ amount: '3000.00' });
  });

  it('shows authoritative partial state and emits finalized execution actions', async () => {
    const settlement = readySettlement();
    settlement.status = 'finalized';
    settlement.calculation_status = 'ready';
    settlement.is_frozen = true;
    settlement.recommendations![0] = {
      ...settlement.recommendations![0]!,
      id: 42,
      status: 'partially_applied',
      applied_amount: '1000.00',
      remaining_amount: '2000.00',
      transactions: [
        {
          id: 77,
          booking_date: '2026-08-04',
          origin: 'system',
          action: 'application',
          amount: '1000.00',
          idempotency_key: 'test-key',
        },
      ],
    };
    const page = buildSettlementPage(settlement, members);
    const wrapper = mount(MonthlyCloseSettlementSection, {
      props: {
        page,
        formatMoney: (value: number) => value.toFixed(2),
        formatSignedMoney: (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`,
      },
    });

    expect(wrapper.text()).toContain('Parcial');
    expect(wrapper.text()).toContain('2000.00 pendientes');
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Registrar todas'))
      ?.trigger('click');
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Gestionar'))
      ?.trigger('click');
    expect(wrapper.emitted('applyAll')).toHaveLength(1);
    expect(wrapper.emitted('manage')?.[0]?.[0]).toMatchObject({ id: 42 });
  });
});
