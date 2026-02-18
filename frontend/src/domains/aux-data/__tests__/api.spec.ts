import { beforeEach, describe, expect, it, vi } from 'vitest';
import { auxDataApi, coreAuxDataApi, premiumAuxDataApi } from '@/domains/aux-data/api';

const mocks = vi.hoisted(() => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  coreApi: mocks.coreApi,
}));

describe('aux-data api (saas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports premium adapter as active api in saas', () => {
    expect(auxDataApi).toBe(premiumAuxDataApi);
    expect(auxDataApi).not.toBe(coreAuxDataApi);
  });

  it('maps all aux-data endpoints through core api client', async () => {
    const payloadFx = {
      rate_date: '2026-02-18',
      from_currency: 'USD',
      to_currency: 'EUR',
      rate: '0.95',
    };
    const payloadInflation = { region: 'ES', period: '2026-02-01', index: '101.2' };

    await premiumAuxDataApi.getFxRates();
    await premiumAuxDataApi.getInflation();
    await premiumAuxDataApi.createFxRate(payloadFx);
    await premiumAuxDataApi.deleteFxRate(7);
    await premiumAuxDataApi.createInflation(payloadInflation);
    await premiumAuxDataApi.deleteInflation(9);

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/core/fx-rates/');
    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/core/inflation/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/core/fx-rates/', payloadFx);
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/core/fx-rates/7/');
    expect(mocks.coreApi.post).toHaveBeenCalledWith('/api/core/inflation/', payloadInflation);
    expect(mocks.coreApi.delete).toHaveBeenCalledWith('/api/core/inflation/9/');
  });
});
