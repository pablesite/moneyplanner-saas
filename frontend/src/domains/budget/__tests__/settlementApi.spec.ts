import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activateSettlement,
  disableSettlement,
  getSettlementConfiguration,
  getSettlementReadiness,
  saveSettlementConfiguration,
} from '@/domains/budget/api';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
}));

vi.mock('@/lib/api', () => ({ coreApi: mocks }));

describe('settlement api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps configuration and readiness endpoints', async () => {
    mocks.get.mockResolvedValue({ data: { is_enabled: false } });
    mocks.put.mockResolvedValue({ data: { is_enabled: false } });
    const payload = { base_currency: 'EUR', accounts: [], opening_adjustments: [] };

    await getSettlementConfiguration();
    await saveSettlementConfiguration(payload);
    await getSettlementReadiness(2026, 7);

    expect(mocks.get).toHaveBeenCalledWith('/api/budget/settlement/configuration/');
    expect(mocks.put).toHaveBeenCalledWith('/api/budget/settlement/configuration/', payload);
    expect(mocks.get).toHaveBeenCalledWith('/api/budget/settlement/readiness/', {
      params: { year: 2026, month: 7 },
    });
  });

  it('maps lifecycle actions', async () => {
    mocks.post.mockResolvedValue({ data: { is_enabled: true } });

    await activateSettlement('2026-08-01');
    await disableSettlement();

    expect(mocks.post).toHaveBeenCalledWith('/api/budget/settlement/activate/', {
      activation_date: '2026-08-01',
    });
    expect(mocks.post).toHaveBeenCalledWith('/api/budget/settlement/disable/');
  });
});
