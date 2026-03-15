import { beforeEach, describe, expect, it, vi } from 'vitest';
import { coreNetWorthApi, premiumOwnershipApi } from '@/domains/net-worth/api';

const mocks = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  api: mocks.api,
  coreApi: mocks.coreApi,
}));

describe('net worth api (core)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps all net worth endpoints', async () => {
    await coreNetWorthApi.getSummary();
    await coreNetWorthApi.getAssets();
    await coreNetWorthApi.getLiabilities();
    await coreNetWorthApi.getSnapshots();
    await coreNetWorthApi.getTimeline({ asset_category: 'investments' });
    await coreNetWorthApi.getAssetTimeline(8);
    await coreNetWorthApi.getLiabilityTimeline(9);
    await coreNetWorthApi.getAssetValuations();
    await coreNetWorthApi.getLiabilityValuations();
    await coreNetWorthApi.getInvestmentEvents();
    await coreNetWorthApi.getLiquidityEvents();
    await coreNetWorthApi.getLiabilityEvents();
    await coreNetWorthApi.createSnapshotFromCurrent();
    await coreNetWorthApi.deleteSnapshot(3);
    await coreNetWorthApi.createAsset({ name: 'Cash' });
    await coreNetWorthApi.updateAsset(2, { name: 'Cash EUR' });
    await coreNetWorthApi.deleteAsset(2);
    await coreNetWorthApi.createLiability({ name: 'Loan' });
    await coreNetWorthApi.updateLiability(4, { name: 'Loan EUR' });
    await coreNetWorthApi.deleteLiability(4);
    await coreNetWorthApi.getSettings();
    await coreNetWorthApi.updateSettings({ base_currency: 'EUR' });

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/summary/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/assets/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/liabilities/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/snapshots/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/timeline/', {
      params: { asset_category: 'investments' },
    });
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/assets/8/timeline/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/liabilities/9/timeline/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/asset-valuations/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/liability-valuations/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/investment-events/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/liquidity-events/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/net-worth/liability-events/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/net-worth/snapshots/from-current/');
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/net-worth/snapshots/3/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/net-worth/assets/', { name: 'Cash' });
    expect(mocks.coreApi.patch).toHaveBeenCalledWith('/api/net-worth/assets/2/', {
      name: 'Cash EUR',
    });
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/net-worth/assets/2/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/net-worth/liabilities/', {
      name: 'Loan',
    });
    expect(mocks.coreApi.patch).toHaveBeenCalledWith('/api/net-worth/liabilities/4/', {
      name: 'Loan EUR',
    });
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/net-worth/liabilities/4/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/auth/settings/');
    expect(mocks.coreApi.put).toHaveBeenCalledWith('/api/auth/settings/', {
      base_currency: 'EUR',
    });
  });

  it('routes ownership endpoints through core api', async () => {
    await premiumOwnershipApi.getOwnerships();
    await premiumOwnershipApi.getOwnershipLinks();
    await premiumOwnershipApi.syncOwnershipLink({
      target_type: 'asset',
      target_id: 9,
      ownership_id: 3,
    });

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/ownerships/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/ownership-links/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/ownership-links/sync/', {
      target_type: 'asset',
      target_id: 9,
      ownership_id: 3,
    });
  });
});
