import { api, coreApi } from '@/lib/api';

type TargetType = 'asset' | 'liability';

export const coreNetWorthApi = {
  getSummary() {
    return coreApi.get('/api/net-worth/summary/');
  },
  getAssets() {
    return coreApi.get('/api/net-worth/assets/');
  },
  getLiabilities() {
    return coreApi.get('/api/net-worth/liabilities/');
  },
  getSnapshots() {
    return coreApi.get('/api/net-worth/snapshots/');
  },
  createSnapshotFromCurrent() {
    return coreApi.post('/api/net-worth/snapshots/from-current/');
  },
  deleteSnapshot(id: number) {
    return coreApi.delete(`/api/net-worth/snapshots/${id}/`);
  },
  createAsset(payload: Record<string, unknown>) {
    return coreApi.post('/api/net-worth/assets/', payload);
  },
  updateAsset(id: number, payload: Record<string, unknown>) {
    return coreApi.patch(`/api/net-worth/assets/${id}/`, payload);
  },
  createLiability(payload: Record<string, unknown>) {
    return coreApi.post('/api/net-worth/liabilities/', payload);
  },
  updateLiability(id: number, payload: Record<string, unknown>) {
    return coreApi.patch(`/api/net-worth/liabilities/${id}/`, payload);
  },
  getSettings() {
    return coreApi.get('/api/auth/settings/');
  },
  updateSettings(payload: { base_currency: string }) {
    return coreApi.put('/api/auth/settings/', payload);
  },
};

export const premiumOwnershipApi = {
  getOwnerships() {
    return api.get('/api/ownerships/');
  },
  getOwnershipLinks() {
    return api.get('/api/ownership-links/');
  },
  syncOwnershipLink(payload: { target_type: TargetType; target_id: number; ownership_id: number | null }) {
    return api.post('/api/ownership-links/sync/', payload);
  },
};
