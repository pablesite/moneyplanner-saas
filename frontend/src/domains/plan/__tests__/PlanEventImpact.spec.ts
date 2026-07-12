/** @vitest-environment jsdom */
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PlanEventImpact from '@/domains/plan/components/PlanEventImpact.vue';
import { planApi } from '@/domains/plan/api';

vi.mock('@/domains/plan/api', () => ({
  planApi: { getEventBudgetLines: vi.fn() },
}));

const trace = {
  event: { id: 4, name: 'Compra de Atrio' },
  income: [],
  expenses: [
    {
      id: 1,
      name: 'Atrio IVA',
      fiscal_year: 2026,
      amount_annual: '23920.00',
      time_profile: 'one_off',
      cashflow_role: 'tax_fee',
    },
    {
      id: 2,
      name: 'Atrio - Cocina',
      fiscal_year: 2026,
      amount_annual: '15000.00',
      time_profile: 'one_off',
      cashflow_role: 'asset_purchase',
    },
  ],
  linked: {
    assets: [{ id: 9, name: 'Reserva Atrio', amount: '32989.00', generated_expense_annual: '0' }],
    liabilities: [
      {
        id: 7,
        name: 'Préstamo - Reserva Atrio',
        amount: '32989.00',
        generated_expense_annual: '16494.50',
      },
    ],
  },
};

describe('PlanEventImpact', () => {
  it('counts the full impact: manual outflow plus the debt it brought', async () => {
    vi.mocked(planApi.getEventBudgetLines).mockResolvedValue({ data: trace } as never);

    const wrapper = mount(PlanEventImpact, { props: { eventId: 4 } });
    await flushPromises();

    const text = wrapper.text();
    // El desembolso es la suma de las partidas adoptadas...
    expect(text).toContain('Desembolso');
    expect(text).toContain('38.920,00');
    // ...y la deuda es la del pasivo enlazado, que el evento no posee.
    expect(text).toContain('Pasivo vinculado');
    expect(text).toContain('Préstamo - Reserva Atrio');
    expect(text).toContain('16.494,50');
    expect(text).toContain('los gestiona Patrimonio');
  });

  it('explains an empty decision instead of showing a blank block', async () => {
    vi.mocked(planApi.getEventBudgetLines).mockResolvedValue({
      data: { ...trace, expenses: [], linked: { assets: [], liabilities: [] } },
    } as never);

    const wrapper = mount(PlanEventImpact, { props: { eventId: 4 } });
    await flushPromises();

    expect(wrapper.text()).toContain('no tiene partidas ni posiciones asociadas');
  });
});
