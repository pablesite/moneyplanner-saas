import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useAppShell } from '@/shell/useAppShell';

const mocks = vi.hoisted(() => ({
  clearAuthTokens: vi.fn(),
  hasAccessToken: { value: false },
  validateSession: vi.fn(),
  route: {
    name: 'home',
    path: '/',
    fullPath: '/',
  },
  router: {
    push: vi.fn(),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => mocks.router,
}));

vi.mock('@/domains/auth/session', () => ({
  clearAuthTokens: mocks.clearAuthTokens,
  hasAccessToken: mocks.hasAccessToken,
}));

vi.mock('@/domains/auth', () => ({
  authApi: {
    validateSession: mocks.validateSession,
  },
}));

describe('useAppShell', () => {
  beforeEach(() => {
    mocks.clearAuthTokens.mockReset();
    mocks.validateSession.mockReset();
    mocks.router.push.mockReset();
    mocks.hasAccessToken.value = false;
    mocks.route.name = 'home';
    mocks.route.path = '/';
    mocks.route.fullPath = '/';
  });

  it('tracks login route and navigation state', () => {
    const { shell, unmount } = mountShell();

    expect(shell.isLoginRoute.value).toBe(false);
    expect(shell.navItems.value).toHaveLength(5);
    expect(shell.isNavItemActive(shell.navItems.value[1]!)).toBe(true);

    mocks.route.path = '/patrimonio';
    expect(shell.isNavItemActive(shell.navItems.value[1]!)).toBe(true);

    mocks.route.path = '/presupuesto';
    expect(shell.isNavItemActive(shell.navItems.value[2]!)).toBe(true);

    mocks.route.path = '/estado-financiero/ambitos/2';
    expect(shell.isNavItemActive(shell.navItems.value[0]!)).toBe(true);

    mocks.route.path = '/contabilidad/cuentas';
    expect(shell.isNavItemActive(shell.navItems.value[3]!)).toBe(true);

    mocks.route.path = '/cierre-mensual';
    expect(shell.isNavItemActive(shell.navItems.value[4]!)).toBe(true);

    unmount();
  });

  it('computes account initials and clears session on logout', async () => {
    mocks.hasAccessToken.value = true;
    mocks.validateSession.mockResolvedValue({
      data: {
        username: 'Pablo Perez',
        role: 'saas_admin',
        subscription_status: 'trial',
      },
    });
    const { shell, unmount } = mountShell();

    await nextTick();
    expect(shell.hasToken.value).toBe(true);
    expect(mocks.validateSession).toHaveBeenCalledTimes(1);
    expect(shell.accountInitials.value).toBe('PP');
    expect(shell.isSaasAdmin.value).toBe(true);

    shell.accountLabel.value = 'Pablo Perez';
    expect(shell.accountInitials.value).toBe('PP');

    shell.toggleAccountMenu();
    shell.logout();

    expect(mocks.clearAuthTokens).toHaveBeenCalledTimes(1);
    expect(shell.accountMenuOpen.value).toBe(false);
    expect(mocks.router.push).toHaveBeenCalledWith('/login');

    unmount();
  });
});

function mountShell() {
  let shell: ReturnType<typeof useAppShell> | null = null;
  const Host = defineComponent({
    setup() {
      shell = useAppShell();
      return () => null;
    },
  });

  const wrapper = mount(Host);
  if (!shell) {
    throw new Error('Failed to mount useAppShell host');
  }
  const mountedShell = shell as ReturnType<typeof useAppShell>;

  return {
    shell: mountedShell,
    unmount: () => wrapper.unmount(),
  };
}
