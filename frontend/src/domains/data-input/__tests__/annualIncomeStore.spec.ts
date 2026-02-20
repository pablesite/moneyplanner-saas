import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnnualIncomeStore } from '../annualIncomeStore';

const mocks = vi.hoisted(() => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  coreApi: mocks.coreApi,
}));

vi.mock('@/lib/errors', () => ({
  toApiErrorMessage: (error: unknown) => (error instanceof Error ? error.message : 'error'),
}));

describe('annual income store (saas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads entries and totals from core api', async () => {
    mocks.coreApi.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: 'CTN',
            category: 'salary',
            subcategory: 'employee_salary',
            owner_name: 'Pablo',
            income_type: 'recurrent',
            amount_annual: '32460.00',
            fiscal_year: 2026,
            currency: 'EUR',
            notes: '',
            created_at: '2026-02-20T00:00:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({ data: { total_annual: '32460.00', currency_hint: 'mixed' } });

    const store = useAnnualIncomeStore('saas');
    await store.loadAll(2026);

    expect(store.entries.value).toHaveLength(1);
    expect(store.totalAnnual.value).toBe(32460);
  });

  it('creates and deletes entries via core api', async () => {
    mocks.coreApi.post.mockResolvedValue({ data: { id: 1 } });
    mocks.coreApi.delete.mockResolvedValue({ data: {} });
    mocks.coreApi.get.mockResolvedValue({ data: [] });

    const store = useAnnualIncomeStore('saas');
    const createResult = await store.addEntry(
      {
        name: 'CTN',
        category: 'salary',
        subcategory: 'employee_salary',
        owner: 'Pablo',
        incomeType: 'recurrent',
        amountAnnual: '32460,00',
        fiscalYear: 2026,
        currency: 'EUR',
        notes: '',
      },
      2026,
    );

    expect(createResult.ok).toBe(true);
    expect(mocks.coreApi.post).toHaveBeenCalledWith(
      '/api/budget/annual-income/',
      expect.objectContaining({
        name: 'CTN',
        category: 'salary',
        subcategory: 'employee_salary',
        amount_annual: '32460.00',
        fiscal_year: 2026,
      }),
    );

    await store.deleteEntry(10, 2026);
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/budget/annual-income/10/');
  });
});
