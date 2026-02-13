import { defineStore } from "pinia";
import { api, coreApi } from "@/lib/api";

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
  kind: "individual" | "shared";
  member: { id: number; name: string; role: "adult" | "child" } | null;
  splits: { member: { id: number; name: string; role: "adult" | "child" }; percent: string }[];
  notes: string;
};

type OwnershipLink = {
  target_type: "asset" | "liability";
  target_id: number;
  ownership_id: number;
};


function normalizeNumberInput(raw: unknown) {
  return String(raw ?? "").trim().replace(/\s/g, "").replace(/,/g, ".");
}

function toNumber(v: unknown) {
  const n = Number(normalizeNumberInput(v));
  return Number.isFinite(n) ? n : 0;
}

export const useNetWorthStore = defineStore("netWorth", {
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
        const s = state.summary;
        const unit = state.baseCurrency ?? s?.base_currency ?? "EUR";

        const assetsBy = s?.assets_by_category ?? {};
        const liabsBy = s?.liabilities_by_category ?? {};

        // Unificamos claves para que el gráfico tenga filas consistentes
        const keys = Array.from(
          new Set<string>([...Object.keys(assetsBy), ...Object.keys(liabsBy)])
        );

        return {
          unit,
          keys,
          assets: keys.map((k) => Math.max(0, toNumber(assetsBy[k]))),
          liabilities: keys.map((k) => Math.max(0, toNumber(liabsBy[k]))),
        };
      },

  },

  actions: {
    async refreshAll() {
      this.loading = true;
      this.error = null;
      try {
        const [summaryRes, assetsRes, liabilitiesRes, snapshotsRes] = await Promise.all([
          coreApi.get("/api/net-worth/summary/"),
          coreApi.get("/api/net-worth/assets/"),
          coreApi.get("/api/net-worth/liabilities/"),
          coreApi.get("/api/net-worth/snapshots/"),
        ]);
        const [ownershipsRes, linksRes] = await Promise.all([
          api.get("/api/ownerships/"),
          api.get("/api/ownership-links/"),
        ]);
        const links = linksRes.data as OwnershipLink[];
        const assetOwnership = new Map(
          links.filter((l) => l.target_type === "asset").map((l) => [l.target_id, l.ownership_id] as const),
        );
        const liabilityOwnership = new Map(
          links.filter((l) => l.target_type === "liability").map((l) => [l.target_id, l.ownership_id] as const),
        );

        this.summary = summaryRes.data;
        this.baseCurrency = summaryRes.data.base_currency;
        this.assets = assetsRes.data.map((a: any) => ({
          ...a,
          ownership_ref: assetOwnership.get(a.id) ?? null,
        }));
        this.liabilities = liabilitiesRes.data.map((l: any) => ({
          ...l,
          ownership_ref: liabilityOwnership.get(l.id) ?? null,
        }));
        this.snapshots = snapshotsRes.data;
        this.ownerships = ownershipsRes.data;

      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

    async createTodaySnapshot() {
      this.loading = true;
      this.error = null;
      try {
        await coreApi.post("/api/net-worth/snapshots/from-current/");
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
        this.loading = false;
      }
    },

    async deleteSnapshot(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await coreApi.delete(`/api/net-worth/snapshots/${id}/`);
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

    async createAsset(payload: Partial<Asset> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        const res = await coreApi.post("/api/net-worth/assets/", corePayload);
        if (res?.data?.id) {
          await api.post("/api/ownership-links/sync/", {
            target_type: "asset",
            target_id: res.data.id,
            ownership_id,
          });
        }
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

    async updateAsset(id: number, payload: Partial<Asset> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        await coreApi.patch(`/api/net-worth/assets/${id}/`, corePayload);
        await api.post("/api/ownership-links/sync/", {
          target_type: "asset",
          target_id: id,
          ownership_id,
        });
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
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
        const res = await coreApi.post("/api/net-worth/liabilities/", corePayload);
        if (res?.data?.id) {
          await api.post("/api/ownership-links/sync/", {
            target_type: "liability",
            target_id: res.data.id,
            ownership_id,
          });
        }
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

    async updateLiability(id: number, payload: Partial<Liability> & { ownership_id?: number | null }) {
      this.loading = true;
      this.error = null;
      try {
        const { ownership_id = null, ...corePayload } = payload as any;
        await coreApi.patch(`/api/net-worth/liabilities/${id}/`, corePayload);
        await api.post("/api/ownership-links/sync/", {
          target_type: "liability",
          target_id: id,
          ownership_id,
        });
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data ? JSON.stringify(e.response.data) : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

    async archiveLiability(id: number) {
      return this.updateLiability(id, { is_active: false });
    },


    async fetchSettings() {
      try {
        const res = await coreApi.get("/api/auth/settings/");
        this.baseCurrency = res.data.base_currency;
      } catch (e: any) {
        this.error = e?.response?.data
          ? JSON.stringify(e.response.data)
          : (e?.message || "Error");
      }
    },

    async updateBaseCurrency(currency: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await coreApi.put("/api/auth/settings/", {
          base_currency: currency,
        });
        this.baseCurrency = res.data.base_currency;
        await this.refreshAll();
      } catch (e: any) {
        this.error = e?.response?.data
          ? JSON.stringify(e.response.data)
          : (e?.message || "Error");
      } finally {
        this.loading = false;
      }
    },

  },

});

