import { defineStore } from 'pinia';
import { coreNetWorthApi, premiumOwnershipApi } from '@/lib/netWorthApi';
import { attachOwnershipRef, buildOwnershipMaps, type OwnershipLink } from '@/lib/netWorthOwnership';
import { buildByCategoryChart } from '@/lib/netWorthCharts';
import { toApiErrorMessage } from '@/lib/errors';

export type Asset = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  tracking_mode: string;
  accounting_account_id: number | null;
  currency: string;
  amount: string;
  amount_base?: string;
  is_active: boolean;
  notes: string;
};

export type Liability = Asset;

export type Snapshot = {
  id: number;
  snapshot_date: string;
  base_currency: string;
  total_assets: string;
  total_liabilities: string;
  net_worth: string;
  created_at: string;
};

export type Summary = {
  base_currency: string;

  total_assets: string;
  total_liabilities: string;
  net_worth: string;

  assets_by_category: Record<string, string>;
  assets_by_subcategory: Record<string, string>;
  liabilities_by_category: Record<string, string>;

  // IPC (solo si base_currency === "EUR")
  inflation_region: string | null;
  inflation_base_period: string | null;

  total_assets_real: string | null;
  total_liabilities_real: string | null;
  net_worth_real: string | null;

  assets_by_category_real: Record<string, string> | null;
  liabilities_by_category_real: Record<string, string> | null;
};

export type Ownership = {
  id: number;
  kind: 'individual' | 'shared';
  member: { id: number; name: string; role: 'adult' | 'child' } | null;
  splits: { member: { id: number; name: string; role: 'adult' | 'child' }; percent: string }[];
  notes: string;
};

export const useNetWorthStore = defineStore('netWorth', {
  state: () => ({
    loading: false as boolean,
    error: null as string | null,

    baseCurrency: null as string | null,

    summary: null as Summary | null,
    assets: [] as Asset[],
    liabilities: [] as Liability[],
    snapshots: [] as Snapshot[],

    ownerships: [] as Ownership[],
  }),

  getters: {
    byCategoryChart(state) {
      return buildByCategoryChart(state.summary, state.baseCurrency);
    },
  },

  actions: {
    async refreshAll() {
      this.loading = true;
      this.error = null;
      try {
        const [summaryRes, assetsRes, liabilitiesRes, snapshotsRes] = await Promise.all([
          coreNetWorthApi.getSummary(),
          coreNetWorthApi.getAssets(),
          coreNetWorthApi.getLiabilities(),
          coreNetWorthApi.getSnapshots(),
        ]);
        const [ownershipsRes, linksRes] = await Promise.all([
          premiumOwnershipApi.getOwnerships(),
          premiumOwnershipApi.getOwnershipLinks(),
        ]);
        const links = linksRes.data as OwnershipLink[];
        const { assetOwnership, liabilityOwnership } = buildOwnershipMaps(links);

        this.summary = summaryRes.data;
        this.baseCurrency = summaryRes.data.base_currency;
        this.assets = attachOwnershipRef(assetsRes.data, assetOwnership);
        this.liabilities = attachOwnershipRef(liabilitiesRes.data, liabilityOwnership);
        this.snapshots = snapshotsRes.data;
        this.ownerships = ownershipsRes.data;
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async createTodaySnapshot() {
      this.loading = true;
      this.error = null;
      try {
        await coreNetWorthApi.createSnapshotFromCurrent();
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
        this.loading = false;
      }
    },

    async deleteSnapshot(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await coreNetWorthApi.deleteSnapshot(id);
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async createAsset(payload: Partial<Asset> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        const res = await coreNetWorthApi.createAsset(corePayload);
        if (res?.data?.id) {
          await premiumOwnershipApi.syncOwnershipLink({
            target_type: 'asset',
            target_id: res.data.id,
            ownership_id,
          });
        }
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async updateAsset(id: number, payload: Partial<Asset> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        await coreNetWorthApi.updateAsset(id, corePayload);
        await premiumOwnershipApi.syncOwnershipLink({
          target_type: 'asset',
          target_id: id,
          ownership_id,
        });
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async archiveAsset(id: number) {
      return this.updateAsset(id, { is_active: false });
    },

    async createLiability(payload: Partial<Liability> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        const res = await coreNetWorthApi.createLiability(corePayload);
        if (res?.data?.id) {
          await premiumOwnershipApi.syncOwnershipLink({
            target_type: 'liability',
            target_id: res.data.id,
            ownership_id,
          });
        }
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async updateLiability(
      id: number,
      payload: Partial<Liability> & { ownership_id?: number | null },
    ) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        await coreNetWorthApi.updateLiability(id, corePayload);
        await premiumOwnershipApi.syncOwnershipLink({
          target_type: 'liability',
          target_id: id,
          ownership_id,
        });
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },

    async archiveLiability(id: number) {
      return this.updateLiability(id, { is_active: false });
    },

    async fetchSettings() {
      try {
        const res = await coreNetWorthApi.getSettings();
        this.baseCurrency = res.data.base_currency;
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      }
    },

    async updateBaseCurrency(currency: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await coreNetWorthApi.updateSettings({ base_currency: currency });
        this.baseCurrency = res.data.base_currency;
        await this.refreshAll();
      } catch (e: any) {
        this.error = toApiErrorMessage(e);
      } finally {
        this.loading = false;
      }
    },
  },
});
