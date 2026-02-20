import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnnualExpenseStore } from '../annualExpenseStore';

const mocks = vi.hoisted(() => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  coreApi: mocks.coreApi,
}));

vi.mock('@/lib/errors', () => ({
  toApiErrorMessage: (error: unknown) => (error instanceof Error ? error.message : 'error'),
}));

describe('annual expense store (saas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads entries and totals from core api', async () => {
    mocks.coreApi.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: 'Alimentacion',
            category: 'consumption_expenses',
            subcategory: 'living_expenses',
            owner_name: 'Pablo',
            expense_type: 'recurrent',
            amount_annual: '5500.00',
            fiscal_year: 2026,
            currency: 'EUR',
            notes: '',
            created_at: '2026-02-20T00:00:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({ data: { total_annual: '5500.00', currency_hint: 'mixed' } });

    const store = useAnnualExpenseStore('saas');
    await store.loadAll(2026);

    expect(store.entries.value).toHaveLength(1);
    expect(store.totalAnnual.value).toBe(5500);
  });

  it('creates, updates and deletes entries via core api', async () => {
    mocks.coreApi.post.mockResolvedValue({ data: { id: 1 } });
    mocks.coreApi.patch.mockResolvedValue({ data: { id: 1 } });
    mocks.coreApi.delete.mockResolvedValue({ data: {} });
    mocks.coreApi.get.mockResolvedValue({ data: [] });

    const store = useAnnualExpenseStore('saas');
    const createResult = await store.addEntry(
      {
        name: 'Alimentacion',
        category: 'consumption_expenses',
        subcategory: 'living_expenses',
        owner: 'Pablo',
        expenseType: 'recurrent',
        amountAnnual: '5500,00',
        fiscalYear: 2026,
        currency: 'EUR',
        notes: '',
      },
      2026,
    );

    expect(createResult.ok).toBe(true);
    expect(mocks.coreApi.post).toHaveBeenCalledWith(
      '/api/budget/annual-expense/',
      expect.objectContaining({
        name: 'Alimentacion',
        category: 'consumption_expenses',
        subcategory: 'living_expenses',
        owner_name: 'Pablo',
        amount_annual: '5500.00',
        fiscal_year: 2026,
      }),
    );

    const updateResult = await store.updateEntry(
      1,
      {
        name: 'Alimentacion actualizada',
        category: 'consumption_expenses',
        subcategory: 'living_expenses',
        owner: '  Pablo   Ruiz  ',
        expenseType: 'recurrent',
        amountAnnual: '1.234,56',
        fiscalYear: 2026,
        currency: 'EUR',
        notes: 'update',
      },
      2026,
    );

    expect(updateResult.ok).toBe(true);
    expect(mocks.coreApi.patch).toHaveBeenCalledWith(
      '/api/budget/annual-expense/1/',
      expect.objectContaining({
        name: 'Alimentacion actualizada',
        owner_name: 'Pablo Ruiz',
        amount_annual: '1234.56',
      }),
    );

    await store.deleteEntry(10, 2026);
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/budget/annual-expense/10/');
  });
});
