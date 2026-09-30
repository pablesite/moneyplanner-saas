import { beforeEach, describe, expect, it, vi } from 'vitest';
import { corePortfolioApi } from '../api';

const mocks = vi.hoisted(() => ({
  coreApi: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('@/lib/api', () => ({ coreApi: mocks.coreApi }));

describe('portfolio api', () => {
  beforeEach(() => vi.clearAllMocks());

  // Las cinco lecturas analíticas viajan en una sola petición: cargarlas por separado
  // reconstruía el mismo contexto cinco veces en el servidor.
  it('loads every analytical read in one workspace call with the same server scope', async () => {
    mocks.coreApi.get.mockResolvedValue({ data: [] });
    const params = { date_from: '2025-01-01', date_to: '2025-12-31', member_id: 7 };

    await corePortfolioApi.getWorkspace(params);

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/workspace/', { params });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/instruments/');
    expect(mocks.coreApi.get).toHaveBeenCalledTimes(2);
  });

  it('links and unlinks income without booking anything new', async () => {
    mocks.coreApi.get.mockResolvedValue({ data: { linked: [], candidates: [] } });
    mocks.coreApi.post.mockResolvedValue({ data: { linked: [], candidates: [] } });

    await corePortfolioApi.getPositionIncomeLinks(4, true);
    await corePortfolioApi.linkPositionIncome(4, [11, 12], 'dividend');
    await corePortfolioApi.unlinkPositionIncome(4, 11);

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/positions/4/income-links/', {
      params: { all: 1 },
    });
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(
      1,
      '/api/portfolio/positions/4/income-links/link/',
      { transaction_ids: [11, 12], operation_type: 'dividend' },
    );
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(
      2,
      '/api/portfolio/positions/4/income-links/unlink/',
      { transaction_id: 11 },
    );
  });

  it('keeps preview, confirmation, setup and CSV staging as separate writes', async () => {
    mocks.coreApi.post.mockResolvedValue({ data: {} });
    const operation = {
      operation_type: 'buy' as const,
      booking_date: '2025-03-01',
      position_id: 3,
      cash_account_id: 4,
      amount: '50',
    };

    await corePortfolioApi.previewOperation(operation);
    await corePortfolioApi.confirmOperation({ ...operation, preview_token: 'signed-preview' });
    await corePortfolioApi.confirmPositionSetup(3, {
      tracking_style: 'units_based',
      history_mode: 'cutoff',
      history_start_date: '2025-01-01',
    });
    await corePortfolioApi.previewImport(9, { operation_type: 'tipo' });
    await corePortfolioApi.confirmImport(9, [12]);

    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(
      1,
      '/api/portfolio/operations/preview/',
      operation,
    );
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(2, '/api/portfolio/operations/confirm/', {
      ...operation,
      preview_token: 'signed-preview',
    });
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(
      3,
      '/api/portfolio/positions/3/confirm-setup/',
      {
        tracking_style: 'units_based',
        history_mode: 'cutoff',
        history_start_date: '2025-01-01',
      },
    );
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(4, '/api/portfolio/imports/9/preview/', {
      mapping: { operation_type: 'tipo' },
    });
    expect(mocks.coreApi.post).toHaveBeenNthCalledWith(5, '/api/portfolio/imports/9/confirm/', {
      row_ids: [12],
    });
  });

  it('uses the allocation ownership when reading exposure', async () => {
    mocks.coreApi.get.mockResolvedValue({ data: {} });

    await corePortfolioApi.getExposure(7, '2025-03-01');

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/exposure/', {
      params: { ownership_id: 7, on_date: '2025-03-01' },
    });
  });

  it('persists the reviewed proposal token with a contribution basket', async () => {
    mocks.coreApi.post.mockResolvedValue({ data: {} });

    await corePortfolioApi.createBasket(7, '500', 12, 'reviewed-inputs');

    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/portfolio/baskets/', {
      ownership_id: 7,
      amount: '500',
      source_account_id: 12,
      review_token: 'reviewed-inputs',
    });
  });
});
