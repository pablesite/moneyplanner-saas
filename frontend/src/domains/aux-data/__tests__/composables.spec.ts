import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuxData } from '@/domains/aux-data/composables';

const mocks = vi.hoisted(() => ({
  getFxRates: vi.fn(),
  getInflation: vi.fn(),
  createFxRate: vi.fn(),
  deleteFxRate: vi.fn(),
  createInflation: vi.fn(),
  deleteInflation: vi.fn(),
  toApiErrorMessage: vi.fn(() => 'mapped-error'),
}));

vi.mock('@/domains/aux-data/api', () => ({
  auxDataApi: {
    getFxRates: mocks.getFxRates,
    getInflation: mocks.getInflation,
    createFxRate: mocks.createFxRate,
    deleteFxRate: mocks.deleteFxRate,
    createInflation: mocks.createInflation,
    deleteInflation: mocks.deleteInflation,
  },
}));

vi.mock('@/lib/errors', () => ({
  toApiErrorMessage: mocks.toApiErrorMessage,
}));

describe('useAuxData (saas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });

  it('creates FX and inflation records and sets success messages', async () => {
    mocks.getFxRates.mockResolvedValue({ data: [] });
    mocks.getInflation.mockResolvedValue({ data: [] });
    mocks.createFxRate.mockResolvedValue({});
    mocks.createInflation.mockResolvedValue({});
    const state = useAuxData();

    state.fxForm.value = { rate_date: '2026-02-18', pair: 'USD_EUR', rate: '0.95' };
    await state.createFxRate();
    expect(mocks.createFxRate).toHaveBeenCalledWith({
      rate_date: '2026-02-18',
      from_currency: 'USD',
      to_currency: 'EUR',
      rate: '0.95',
    });
    expect(state.successMessage.value).toContain('FX rate');

    state.ipcForm.value = { region: 'ES', period: '2026-02', index: '101.2' };
    await state.createInflation();
    expect(mocks.createInflation).toHaveBeenCalledWith({
      region: 'ES',
      period: '2026-02-01',
      index: '101.2',
    });
    expect(state.successMessage.value).toContain('IPC');
  });

  it('deletes records and maps API errors', async () => {
    mocks.getFxRates.mockResolvedValue({ data: [] });
    mocks.getInflation.mockResolvedValue({ data: [] });
    mocks.deleteFxRate.mockResolvedValue({});
    mocks.deleteInflation.mockRejectedValue(new Error('boom'));
    const state = useAuxData();

    await state.deleteFxRate(1);
    expect(mocks.deleteFxRate).toHaveBeenCalledWith(1);

    await state.deleteInflation(2);
    expect(state.error.value).toBe('mapped-error');
    expect(state.loading.value).toBe(false);
  });
});
