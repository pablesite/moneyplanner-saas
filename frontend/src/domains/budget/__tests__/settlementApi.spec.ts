import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activateSettlement,
  acceptSettlementRecommendation,
  applyAllSettlementRecommendations,
  applySettlementRecommendation,
  cancelSettlementRecommendation,
  disableSettlement,
  getSettlementConfiguration,
  getSettlementReadiness,
  getSettlementCandidates,
  reconcileSettlementRecommendation,
  reverseSettlementRecommendation,
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
    await getSettlementReadiness(2026, 7, '2026-07-15');

    expect(mocks.get).toHaveBeenCalledWith('/api/budget/settlement/configuration/');
    expect(mocks.put).toHaveBeenCalledWith('/api/budget/settlement/configuration/', payload);
    expect(mocks.get).toHaveBeenCalledWith('/api/budget/settlement/readiness/', {
      params: { year: 2026, month: 7, balance_date: '2026-07-15' },
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

  it('maps execution, reconciliation and reversal endpoints', async () => {
    mocks.get.mockResolvedValue({ data: { candidates: [{ transaction_id: 91 }] } });
    mocks.post.mockResolvedValue({ data: { recommendations: [] } });

    await applyAllSettlementRecommendations(7, '2026-08-04');
    await applySettlementRecommendation(7, 12, {
      execution_date: '2026-08-04',
      amount: '25.00',
      idempotency_key: 'stable-key',
    });
    await acceptSettlementRecommendation(7, 12);
    await cancelSettlementRecommendation(7, 12);
    await reverseSettlementRecommendation(7, 12, {
      execution_date: '2026-08-05',
      idempotency_key: 'reverse-key',
    });
    await getSettlementCandidates(7, 12);
    await reconcileSettlementRecommendation(7, 12, 91);

    expect(mocks.post).toHaveBeenCalledWith('/api/budget/monthly-closes/7/settlement/apply/', {
      execution_date: '2026-08-04',
    });
    expect(mocks.post).toHaveBeenCalledWith(
      '/api/budget/monthly-closes/7/settlement/recommendations/12/apply/',
      { execution_date: '2026-08-04', amount: '25.00', idempotency_key: 'stable-key' },
    );
    expect(mocks.post).toHaveBeenCalledWith(
      '/api/budget/monthly-closes/7/settlement/recommendations/12/accept/',
    );
    expect(mocks.post).toHaveBeenCalledWith(
      '/api/budget/monthly-closes/7/settlement/recommendations/12/cancel/',
    );
    expect(mocks.get).toHaveBeenCalledWith(
      '/api/budget/monthly-closes/7/settlement/recommendations/12/candidates/',
    );
    expect(mocks.post).toHaveBeenCalledWith(
      '/api/budget/monthly-closes/7/settlement/recommendations/12/reconcile/',
      { transaction_id: 91 },
    );
  });
});
