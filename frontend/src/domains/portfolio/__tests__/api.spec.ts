import { beforeEach, describe, expect, it, vi } from 'vitest';
import { corePortfolioApi } from '../api';

const mocks = vi.hoisted(() => ({
  coreApi: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('@/lib/api', () => ({ coreApi: mocks.coreApi }));

describe('portfolio api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads the five analytical reads with the same server scope', async () => {
    mocks.coreApi.get.mockResolvedValue({ data: [] });
    const params = { date_from: '2025-01-01', date_to: '2025-12-31', member_id: 7 };

    await corePortfolioApi.getWorkspace(params);

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/overview/', { params });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/performance/', { params });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/positions/performance/', {
      params,
    });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/timeline/', { params });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/quality/', { params });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/portfolio/instruments/');
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
});
