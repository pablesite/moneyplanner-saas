import { beforeEach, describe, expect, it, vi } from 'vitest';
import { planApi } from '@/domains/plan/api';

const mocks = vi.hoisted(() => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({ coreApi: mocks.coreApi }));

describe('plan api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads eligible plan members from the plan contract', async () => {
    await planApi.getMembers();

    expect(mocks.coreApi.get).toHaveBeenCalledWith('/api/plan/members/');
  });
});
