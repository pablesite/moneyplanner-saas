import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLoginForm, useSaasAccountPage, useSaasAdminUsersPage } from '@/domains/auth/composables';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  setAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
  toApiErrorMessage: vi.fn(() => 'mapped-error'),
  push: vi.fn(),
  route: { query: {} as Record<string, unknown> },
  getAuthMode: vi.fn(),
  getSaasMe: vi.fn(),
  getSaasSubscription: vi.fn(),
  upsertCoreLink: vi.fn(),
  deleteCoreLink: vi.fn(),
  listSaasAdminUsers: vi.fn(),
  createSaasAdminUser: vi.fn(),
  patchSaasAdminUserRole: vi.fn(),
  patchSaasAdminUserStatus: vi.fn(),
}));

vi.mock('@/domains/auth/api', () => ({
  authApi: {
    login: mocks.login,
  },
}));

vi.mock('@/domains/auth/session', () => ({
  setAccessToken: mocks.setAccessToken,
  setRefreshToken: mocks.setRefreshToken,
}));

vi.mock('@/lib/errors', () => ({
  toApiErrorMessage: mocks.toApiErrorMessage,
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mocks.push }),
  useRoute: () => mocks.route,
}));

vi.mock('@/domains/auth/accountApi', () => ({
  getAuthMode: mocks.getAuthMode,
  getSaasMe: mocks.getSaasMe,
  getSaasSubscription: mocks.getSaasSubscription,
  upsertCoreLink: mocks.upsertCoreLink,
  deleteCoreLink: mocks.deleteCoreLink,
}));

vi.mock('@/domains/auth/adminApi', () => ({
  listSaasAdminUsers: mocks.listSaasAdminUsers,
  createSaasAdminUser: mocks.createSaasAdminUser,
  patchSaasAdminUserRole: mocks.patchSaasAdminUserRole,
  patchSaasAdminUserStatus: mocks.patchSaasAdminUserStatus,
}));

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('auth composables (saas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.route.query = {};
  });

  it('logs in and redirects', async () => {
    mocks.login.mockResolvedValueOnce({ data: { access: 'a1', refresh: 'r1' } });
    const form = useLoginForm();
    form.username.value = 'u';
    form.password.value = 'p';
    await form.login();

    expect(mocks.setAccessToken).toHaveBeenCalledWith('a1');
    expect(mocks.setRefreshToken).toHaveBeenCalledWith('r1');
    expect(mocks.push).toHaveBeenCalledWith('/');
  });

  it('loads and updates saas account data', async () => {
    mocks.getAuthMode.mockResolvedValue({ data: { account_linking_enabled: true } });
    mocks.getSaasMe.mockResolvedValue({
      data: {
        username: 'u',
        email: 'u@mail.test',
        role: 'saas_admin',
        subscription_status: 'active',
        premium_enabled: true,
        account_link: { core_user_ref: 'core:1', core_username: 'cuser', core_email: 'c@mail.test' },
      },
    });
    mocks.getSaasSubscription.mockResolvedValue({ data: { status: 'active' } });
    mocks.upsertCoreLink.mockResolvedValue({});
    mocks.deleteCoreLink.mockResolvedValue({});

    const page = useSaasAccountPage();
    await flushPromises();

    expect(page.username.value).toBe('u');
    expect(page.accountLinkingEnabled.value).toBe(true);
    expect(page.linkedCoreUserRef.value).toBe('core:1');

    await page.saveCoreLink();
    expect(mocks.upsertCoreLink).toHaveBeenCalled();
    await page.removeCoreLink();
    expect(mocks.deleteCoreLink).toHaveBeenCalled();
  });

  it('loads and mutates admin users', async () => {
    mocks.listSaasAdminUsers.mockResolvedValue({ data: [{ id: 1, username: 'a', is_active: true }] });
    mocks.createSaasAdminUser.mockResolvedValue({});
    mocks.patchSaasAdminUserRole.mockResolvedValue({});
    mocks.patchSaasAdminUserStatus.mockResolvedValue({});

    const page = useSaasAdminUsersPage();
    await flushPromises();
    expect(page.users.value).toHaveLength(1);

    page.createUsername.value = 'new';
    page.createPassword.value = 'pass12345';
    page.createEmail.value = 'new@mail.test';
    await page.createUser();
    expect(mocks.createSaasAdminUser).toHaveBeenCalled();

    await page.updateRole(1, 'saas_admin');
    expect(mocks.patchSaasAdminUserRole).toHaveBeenCalledWith(1, 'saas_admin');

    await page.toggleStatus({ id: 1, username: 'a', email: 'a@mail.test', role: 'saas_member', is_active: true });
    expect(mocks.patchSaasAdminUserStatus).toHaveBeenCalledWith(1, false);
  });

  it('maps account/admin load errors', async () => {
    mocks.getAuthMode.mockRejectedValue(new Error('boom'));
    const account = useSaasAccountPage();
    await flushPromises();
    expect(account.error.value).toBe('mapped-error');

    mocks.listSaasAdminUsers.mockRejectedValue(new Error('boom'));
    const admin = useSaasAdminUsersPage();
    await flushPromises();
    expect(admin.error.value).toBe('mapped-error');
  });
});
