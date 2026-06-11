import { coreApi } from '@/lib/api';
import type { MarketDataStatus } from '@/domains/aux-data/types';

export type CreateFxRatePayload = {
  rate_date: string;
  from_currency: string;
  to_currency: string;
  rate: string;
};

export type CreateInflationPayload = {
  region: string;
  period: string;
  index: string;
};

export type AuxDataApiAdapter = {
  getStatus(): ReturnType<typeof coreApi.get<MarketDataStatus>>;
  syncMarketData(payload?: {
    datasets?: string[];
    mode?: 'reconcile' | 'refresh';
    fx_full_history?: boolean;
  }): ReturnType<typeof coreApi.post<{ summary: Record<string, number> }>>;
};

export const coreAuxDataApi: AuxDataApiAdapter = {
  getStatus() {
    return coreApi.get<MarketDataStatus>('/api/core/market-data/status/');
  },
  syncMarketData(payload) {
    return coreApi.post<{ summary: Record<string, number> }>(
      '/api/core/market-data/sync/',
      payload ?? {},
    );
  },
};

export const auxDataApi: AuxDataApiAdapter = coreAuxDataApi;
