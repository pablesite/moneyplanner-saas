import { coreApi } from '@/lib/api';
import { capabilities } from '@/domains/capabilities';
import type { FxRate, InflationIndex } from '@/domains/aux-data/types';

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
  getFxRates(): ReturnType<typeof coreApi.get<FxRate[]>>;
  getInflation(): ReturnType<typeof coreApi.get<InflationIndex[]>>;
  createFxRate(payload: CreateFxRatePayload): ReturnType<typeof coreApi.post>;
  deleteFxRate(id: number): ReturnType<typeof coreApi.delete>;
  createInflation(payload: CreateInflationPayload): ReturnType<typeof coreApi.post>;
  deleteInflation(id: number): ReturnType<typeof coreApi.delete>;
};

export const coreAuxDataApi: AuxDataApiAdapter = {
  getFxRates() {
    return coreApi.get<FxRate[]>('/api/core/fx-rates/');
  },
  getInflation() {
    return coreApi.get<InflationIndex[]>('/api/core/inflation/');
  },
  createFxRate(payload: CreateFxRatePayload) {
    return coreApi.post('/api/core/fx-rates/', payload);
  },
  deleteFxRate(id: number) {
    return coreApi.delete(`/api/core/fx-rates/${id}/`);
  },
  createInflation(payload: CreateInflationPayload) {
    return coreApi.post('/api/core/inflation/', payload);
  },
  deleteInflation(id: number) {
    return coreApi.delete(`/api/core/inflation/${id}/`);
  },
};

export const premiumAuxDataApi: AuxDataApiAdapter = {
  getFxRates() {
    return coreApi.get<FxRate[]>('/api/core/fx-rates/');
  },
  getInflation() {
    return coreApi.get<InflationIndex[]>('/api/core/inflation/');
  },
  createFxRate(payload: CreateFxRatePayload) {
    return coreApi.post('/api/core/fx-rates/', payload);
  },
  deleteFxRate(id: number) {
    return coreApi.delete(`/api/core/fx-rates/${id}/`);
  },
  createInflation(payload: CreateInflationPayload) {
    return coreApi.post('/api/core/inflation/', payload);
  },
  deleteInflation(id: number) {
    return coreApi.delete(`/api/core/inflation/${id}/`);
  },
};

export const auxDataApi: AuxDataApiAdapter = capabilities.isPremium
  ? premiumAuxDataApi
  : coreAuxDataApi;
