import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteCoreLink,
  getAuthMode,
  getSaasMe,
  getSaasSubscription,
  upsertCoreLink,
} from '@/domains/auth/accountApi';

const mocks = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  api: mocks.api,
}));

describe('account api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps account endpoints', async () => {
    await getAuthMode();
    await getSaasMe();
    await getSaasSubscription();
    await upsertCoreLink({ core_user_ref: 'core-1' });
    await deleteCoreLink();

    expect(mocks.api.get).toHaveBeenCalledWith('/api/auth/mode/');
    expect(mocks.api.get).toHaveBeenCalledWith('/api/auth/me/');
    expect(mocks.api.get).toHaveBeenCalledWith('/api/auth/subscription/');
    expect(mocks.api.post).toHaveBeenCalledWith('/api/auth/core-link/', {
      core_user_ref: 'core-1',
    });
    expect(mocks.api.delete).toHaveBeenCalledWith('/api/auth/core-link/');
  });
});
