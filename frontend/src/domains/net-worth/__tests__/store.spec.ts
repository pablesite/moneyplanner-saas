import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useNetWorthStore } from '@/domains/net-worth/store';

const mocks = vi.hoisted(() => ({
  coreNetWorthApi: {
    getSummary: vi.fn(),
    getAssets: vi.fn(),
    getLiabilities: vi.fn(),
    getSnapshots: vi.fn(),
    createSnapshotFromCurrent: vi.fn(),
    deleteSnapshot: vi.fn(),
    createAsset: vi.fn(),
    updateAsset: vi.fn(),
    createLiability: vi.fn(),
    updateLiability: vi.fn(),
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
  premiumOwnershipApi: {
    getOwnerships: vi.fn(),
    getOwnershipLinks: vi.fn(),
    syncOwnershipLink: vi.fn(),
  },
  buildByCategoryChart: vi.fn(() => ({ labels: [], assets: [], liabilities: [] })),
  buildOwnershipMaps: vi.fn(() => ({ assetOwnership: {}, liabilityOwnership: {} })),
  attachOwnershipRef: vi.fn((items: unknown[]) => items),
  toApiErrorMessage: vi.fn(() => 'mapped-error'),
}));

vi.mock('@/domains/net-worth/api', () => ({
  coreNetWorthApi: mocks.coreNetWorthApi,
  premiumOwnershipApi: mocks.premiumOwnershipApi,
}));

vi.mock('@/domains/net-worth/charts', () => ({
  buildByCategoryChart: mocks.buildByCategoryChart,
}));

vi.mock('@/domains/net-worth/ownership', () => ({
  buildOwnershipMaps: mocks.buildOwnershipMaps,
  attachOwnershipRef: mocks.attachOwnershipRef,
}));

vi.mock('@/lib/errors', () => ({
  toApiErrorMessage: mocks.toApiErrorMessage,
}));

describe('net worth store (saas)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('refreshes core and premium datasets', async () => {
    mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
    mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [{ id: 1 }] });
    mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [{ id: 2 }] });
    mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [{ id: 3 }] });
    mocks.premiumOwnershipApi.getOwnerships.mockResolvedValue({ data: [{ id: 10 }] });
    mocks.premiumOwnershipApi.getOwnershipLinks.mockResolvedValue({ data: [] });
    const store = useNetWorthStore();

    await store.refreshAll();

    expect(store.baseCurrency).toBe('EUR');
    expect(store.assets).toEqual([{ id: 1 }]);
    expect(store.liabilities).toEqual([{ id: 2 }]);
    expect(store.ownerships).toEqual([{ id: 10 }]);
    expect(store.loading).toBe(false);
  });

  it('creates asset and syncs ownership link', async () => {
    mocks.coreNetWorthApi.createAsset.mockResolvedValue({ data: { id: 99 } });
    mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
    mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [] });
    mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [] });
    mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [] });
    mocks.premiumOwnershipApi.getOwnerships.mockResolvedValue({ data: [] });
    mocks.premiumOwnershipApi.getOwnershipLinks.mockResolvedValue({ data: [] });
    mocks.premiumOwnershipApi.syncOwnershipLink.mockResolvedValue({});
    const store = useNetWorthStore();

    await store.createAsset({ name: 'A', ownership_id: 10 });

    expect(mocks.coreNetWorthApi.createAsset).toHaveBeenCalled();
    expect(mocks.premiumOwnershipApi.syncOwnershipLink).toHaveBeenCalledWith({
      target_type: 'asset',
      target_id: 99,
      ownership_id: 10,
    });
  });
});
