import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSaasAdminUser,
  listSaasAdminUsers,
  patchSaasAdminUserRole,
  patchSaasAdminUserStatus,
} from '@/domains/auth/adminApi';

const mocks = vi.hoisted(() => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('@/lib/api', () => ({
  api: mocks.api,
}));

describe('admin api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps admin user endpoints', async () => {
    await listSaasAdminUsers();
    await createSaasAdminUser({
      username: 'new-admin',
      password: 'secret123',
      role: 'saas_admin',
      is_active: true,
    });
    await patchSaasAdminUserRole(7, 'saas_member');
    await patchSaasAdminUserStatus(9, false);

    expect(mocks.api.get).toHaveBeenCalledWith('/api/admin/users/');
    expect(mocks.api.post).toHaveBeenCalledWith('/api/admin/users/', {
      username: 'new-admin',
      password: 'secret123',
      role: 'saas_admin',
      is_active: true,
    });
    expect(mocks.api.patch).toHaveBeenCalledWith('/api/admin/users/7/role/', {
      role: 'saas_member',
    });
    expect(mocks.api.patch).toHaveBeenCalledWith('/api/admin/users/9/status/', {
      is_active: false,
    });
  });
});
