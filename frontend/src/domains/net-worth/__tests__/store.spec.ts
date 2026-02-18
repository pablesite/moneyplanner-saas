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

  function mockRefreshPayloads() {
    mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
    mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [{ id: 1 }] });
    mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [{ id: 2 }] });
    mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [{ id: 3 }] });
    mocks.premiumOwnershipApi.getOwnerships.mockResolvedValue({ data: [{ id: 10 }] });
    mocks.premiumOwnershipApi.getOwnershipLinks.mockResolvedValue({ data: [] });
  }

  it('refreshes core and premium datasets', async () => {
    mockRefreshPayloads();
    const store = useNetWorthStore();

    await store.refreshAll();

    expect(store.baseCurrency).toBe('EUR');
    expect(store.assets).toEqual([{ id: 1 }]);
    expect(store.liabilities).toEqual([{ id: 2 }]);
    expect(store.ownerships).toEqual([{ id: 10 }]);
    expect(store.loading).toBe(false);
  });

  it('maps refresh errors', async () => {
    mocks.coreNetWorthApi.getSummary.mockRejectedValue(new Error('boom'));
    const store = useNetWorthStore();

    await store.refreshAll();

    expect(store.error).toBe('mapped-error');
    expect(store.loading).toBe(false);
  });

  it('creates asset and syncs ownership link', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.createAsset.mockResolvedValue({ data: { id: 99 } });
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

  it('updates and archives assets with premium ownership sync', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.updateAsset.mockResolvedValue({});
    mocks.premiumOwnershipApi.syncOwnershipLink.mockResolvedValue({});
    const store = useNetWorthStore();

    await store.updateAsset(7, { name: 'Asset', ownership_id: 11 });
    expect(mocks.coreNetWorthApi.updateAsset).toHaveBeenCalledWith(7, { name: 'Asset' });
    expect(mocks.premiumOwnershipApi.syncOwnershipLink).toHaveBeenCalledWith({
      target_type: 'asset',
      target_id: 7,
      ownership_id: 11,
    });

    await store.archiveAsset(7);
    expect(mocks.coreNetWorthApi.updateAsset).toHaveBeenCalledWith(7, { is_active: false });
  });

  it('creates and updates liabilities with premium ownership sync', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.createLiability.mockResolvedValue({ data: { id: 55 } });
    mocks.coreNetWorthApi.updateLiability.mockResolvedValue({});
    mocks.premiumOwnershipApi.syncOwnershipLink.mockResolvedValue({});
    const store = useNetWorthStore();

    await store.createLiability({ name: 'Debt', ownership_id: 20 });
    expect(mocks.coreNetWorthApi.createLiability).toHaveBeenCalledWith({ name: 'Debt' });
    expect(mocks.premiumOwnershipApi.syncOwnershipLink).toHaveBeenCalledWith({
      target_type: 'liability',
      target_id: 55,
      ownership_id: 20,
    });

    await store.updateLiability(9, { name: 'Debt 2', ownership_id: 21 });
    expect(mocks.coreNetWorthApi.updateLiability).toHaveBeenCalledWith(9, { name: 'Debt 2' });
    expect(mocks.premiumOwnershipApi.syncOwnershipLink).toHaveBeenCalledWith({
      target_type: 'liability',
      target_id: 9,
      ownership_id: 21,
    });

    await store.archiveLiability(9);
    expect(mocks.coreNetWorthApi.updateLiability).toHaveBeenCalledWith(9, { is_active: false });
  });

  it('skips ownership sync when create operations return no id', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.createAsset.mockResolvedValue({ data: {} });
    mocks.coreNetWorthApi.createLiability.mockResolvedValue({ data: {} });
    const store = useNetWorthStore();

    await store.createAsset({ name: 'Asset' });
    await store.createLiability({ name: 'Debt' });

    expect(mocks.premiumOwnershipApi.syncOwnershipLink).not.toHaveBeenCalled();
  });

  it('handles snapshot create/delete and maps errors', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.createSnapshotFromCurrent.mockResolvedValue({});
    mocks.coreNetWorthApi.deleteSnapshot.mockResolvedValue({});
    const store = useNetWorthStore();

    await store.createTodaySnapshot();
    expect(mocks.coreNetWorthApi.createSnapshotFromCurrent).toHaveBeenCalled();

    await store.deleteSnapshot(4);
    expect(mocks.coreNetWorthApi.deleteSnapshot).toHaveBeenCalledWith(4);

    mocks.coreNetWorthApi.createSnapshotFromCurrent.mockRejectedValueOnce(new Error('boom'));
    await store.createTodaySnapshot();
    expect(store.error).toBe('mapped-error');
    expect(store.loading).toBe(false);
  });

  it('fetches and updates base currency', async () => {
    mockRefreshPayloads();
    mocks.coreNetWorthApi.getSettings.mockResolvedValue({ data: { base_currency: 'USD' } });
    mocks.coreNetWorthApi.updateSettings.mockResolvedValue({ data: { base_currency: 'EUR' } });
    const store = useNetWorthStore();

    await store.fetchSettings();
    expect(store.baseCurrency).toBe('USD');

    await store.updateBaseCurrency('EUR');
    expect(mocks.coreNetWorthApi.updateSettings).toHaveBeenCalledWith({ base_currency: 'EUR' });
    expect(store.baseCurrency).toBe('EUR');
  });

  it('maps write/settings errors', async () => {
    mocks.coreNetWorthApi.createAsset.mockRejectedValueOnce(new Error('boom'));
    mocks.coreNetWorthApi.getSettings.mockRejectedValueOnce(new Error('boom'));
    mocks.coreNetWorthApi.updateSettings.mockRejectedValueOnce(new Error('boom'));
    const store = useNetWorthStore();

    await store.createAsset({ name: 'Asset', ownership_id: 2 });
    expect(store.error).toBe('mapped-error');

    await store.fetchSettings();
    expect(store.error).toBe('mapped-error');

    await store.updateBaseCurrency('EUR');
    expect(store.error).toBe('mapped-error');
    expect(store.loading).toBe(false);
  });
});
