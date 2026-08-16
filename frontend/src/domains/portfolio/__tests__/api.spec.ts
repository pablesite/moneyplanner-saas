import { beforeEach, describe, expect, it, vi } from 'vitest';
import { corePortfolioApi } from '../api';

const mocks = vi.hoisted(() => ({
  coreApi: { get: vi.fn() },
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
});
