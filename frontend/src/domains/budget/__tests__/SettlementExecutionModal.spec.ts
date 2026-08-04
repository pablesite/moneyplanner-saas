/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SettlementExecutionModal from '@/domains/budget/components/SettlementExecutionModal.vue';
import type { SettlementPage } from '@/domains/budget/settlementPresentation';

const recommendation = {
  id: 42,
  from_account_id: 10,
  to_account_id: 11,
  member_id: 1,
  ownership_id: 3,
  amount: '100.00',
  currency: 'EUR',
  reason: 'member_residual',
  status: 'partially_applied',
  applied_amount: '40.00',
  remaining_amount: '60.00',
  amountNumber: 100,
  appliedAmountNumber: 40,
  remainingAmountNumber: 60,
  statusLabel: 'Parcial',
  transactions: [],
  sourceName: 'Compartida',
  destinationName: 'Personal',
  sourceAssetId: 100,
  destinationAssetId: 101,
  memberName: 'Pablo',
  reasonLabel: 'Excedente personal',
} as SettlementPage['recommendations'][number];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SettlementExecutionModal', () => {
  it('confirms a partial amount and allows explicit reconciliation', async () => {
    const wrapper = mount(SettlementExecutionModal, {
      attachTo: document.body,
      props: {
        open: true,
        recommendation,
        candidates: [
          {
            transaction_id: 91,
            booking_date: '2026-08-03',
            description: 'Transferencia ya realizada',
            origin: 'manual',
            amount: '60.00',
            currency: 'EUR',
          },
        ],
      },
    });

    expect(document.body.textContent).toContain('No ordena una transferencia bancaria');
    const amountInput = document.body.querySelector<HTMLInputElement>('input[type="number"]')!;
    await amountInput.dispatchEvent(new Event('input'));
    await wrapper
      .findAllComponents({ name: 'AButton' })
      .find((button) => button.text().includes('Registrar transferencia'))
      ?.trigger('click');
    expect(wrapper.emitted('apply')?.[0]?.[0]).toMatchObject({ executionDate: expect.any(String) });
  });
});
