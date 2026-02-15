import { coreApi } from '@/lib/api';

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

export const auxDataApi = {
  getFxRates() {
    return coreApi.get('/api/core/fx-rates/');
  },
  getInflation() {
    return coreApi.get('/api/core/inflation/');
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
