import { computed, onMounted, ref } from 'vue';
import { auxDataApi } from '@/domains/aux-data/api';
import { toApiErrorMessage } from '@/lib/errors';
import type {
  FxRate,
  InflationIndex,
  MarketDataState,
  MarketDataStatus,
} from '@/domains/aux-data/types';

export function useAuxData() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const syncError = ref<string | null>(null);
  const syncSuccess = ref<string | null>(null);
  const syncingInflation = ref(false);
  const syncingFx = ref(false);
  const status = ref<MarketDataStatus | null>(null);

  const fxRates = computed<FxRate[]>(() => status.value?.datasets.fx.latest_rows ?? []);
  const inflation = computed<InflationIndex[]>(
    () => status.value?.datasets.inflation.latest_rows ?? [],
  );
  const fxStates = computed<MarketDataState[]>(() => status.value?.datasets.fx.states ?? []);
  const inflationStates = computed<MarketDataState[]>(
    () => status.value?.datasets.inflation.states ?? [],
  );
  const supportedInflationRegions = computed(() => status.value?.supported_inflation_regions ?? []);

  async function loadAll() {
    loading.value = true;
    error.value = null;
    try {
      const response = await auxDataApi.getStatus();
      status.value = response.data ?? null;
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      loading.value = false;
    }
  }

  async function syncInflationNow() {
    syncingInflation.value = true;
    syncError.value = null;
    syncSuccess.value = null;
    try {
      const response = await auxDataApi.syncMarketData({ datasets: ['inflation'], mode: 'reconcile' });
      const rows = response.data?.summary?.inflation ?? 0;
      syncSuccess.value = `Sincronizacion IPC completada (${rows} filas actualizadas).`;
      await loadAll();
    } catch (e: unknown) {
      syncError.value = toApiErrorMessage(e);
    } finally {
      syncingInflation.value = false;
    }
  }

  async function syncFxHistoryNow() {
    syncingFx.value = true;
    syncError.value = null;
    syncSuccess.value = null;
    try {
      const response = await auxDataApi.syncMarketData({
        datasets: ['fx'],
        mode: 'reconcile',
        fx_full_history: true,
      });
      const rows = response.data?.summary?.fx ?? 0;
      syncSuccess.value = `Sincronizacion FX completada (${rows} filas actualizadas).`;
      await loadAll();
    } catch (e: unknown) {
      syncError.value = toApiErrorMessage(e);
    } finally {
      syncingFx.value = false;
    }
  }

  function formatFxRate(rate: string, from: string, to: string) {
    const n = Number(String(rate ?? '').replace(',', '.'));
    if (!Number.isFinite(n)) return rate;
    if (from === 'BTC' && to === 'USD') return n.toFixed(2);
    if (from === 'ETH' && to === 'USD') return n.toFixed(2);
    if (from === 'USD' && to === 'EUR') return n.toFixed(4);
    return String(rate);
  }

  function formatInflationIndex(value: string) {
    const n = Number(String(value ?? '').replace(',', '.'));
    if (!Number.isFinite(n)) return value;
    return n.toFixed(3);
  }

  return {
    loading,
    error,
    syncError,
    syncSuccess,
    syncingInflation,
    syncingFx,
    status,
    fxRates,
    inflation,
    fxStates,
    inflationStates,
    supportedInflationRegions,
    loadAll,
    syncInflationNow,
    syncFxHistoryNow,
    formatFxRate,
    formatInflationIndex,
  };
}

export function useAuxDataPage() {
  const state = useAuxData();
  onMounted(state.loadAll);
  return state;
}
