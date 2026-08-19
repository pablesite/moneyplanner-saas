import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePortfolioStore } from '../store';

const mocks = vi.hoisted(() => ({
  getWorkspace: vi.fn(),
  getMembers: vi.fn(),
}));

vi.mock('../api', () => ({
  corePortfolioApi: {
    getWorkspace: mocks.getWorkspace,
    getMembers: mocks.getMembers,
  },
}));

describe('portfolio store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('publishes the workspace atomically', async () => {
    const payload = {
      cash: { value: '0' },
      overview: { value: '100' },
      performance: { monetary_result: '10' },
      positions: { results: [] },
      timeline: { results: [] },
      quality: { status: 'ready' },
      instruments: [{ id: 1, name: 'Fondo' }],
    };
    mocks.getWorkspace.mockResolvedValue(payload);
    const store = usePortfolioStore();

    await store.refresh({ date_from: '2025-01-01' });

    expect(store.overview).toEqual(payload.overview);
    expect(store.quality).toEqual(payload.quality);
    expect(store.instruments).toEqual(payload.instruments);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('keeps only active people in the ownership filter', async () => {
    mocks.getMembers.mockResolvedValue({
      data: [
        { id: 1, name: 'Ada', role: 'adult', is_active: true },
        { id: 2, name: 'Grace', role: 'adult', is_active: false },
      ],
    });
    const store = usePortfolioStore();

    await store.loadMembers();

    expect(store.members.map((member) => member.name)).toEqual(['Ada']);
  });
});
