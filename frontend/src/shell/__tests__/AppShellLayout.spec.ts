import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { version as appVersion } from '../../../package.json';
import AppShellLayout from '../AppShellLayout.vue';

const mocks = vi.hoisted(() => ({
  hasAccessToken: { value: true },
  route: {
    name: 'root',
    path: '/',
    fullPath: '/',
  },
  router: {
    push: vi.fn(),
  },
  validateSession: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => mocks.route,
  useRouter: () => mocks.router,
}));

vi.mock('@/domains/auth/session', () => ({
  clearAuthTokens: vi.fn(),
  hasAccessToken: mocks.hasAccessToken,
}));

vi.mock('@/domains/auth', () => ({
  authApi: {
    validateSession: mocks.validateSession,
  },
}));

describe('AppShellLayout', () => {
  beforeEach(() => {
    mocks.hasAccessToken.value = true;
    mocks.route.name = 'root';
    mocks.route.path = '/';
    mocks.route.fullPath = '/';
    mocks.router.push.mockReset();
    mocks.validateSession.mockReset();
    mocks.validateSession.mockResolvedValue({
      data: {
        username: 'Pablo Perez',
        role: 'saas_member',
        subscription_status: 'trial',
      },
    });
  });

  it('renders the mobile bottom navigation for product users', async () => {
    const wrapper = mountShell();
    await flushPromises();

    const bottomNav = wrapper.get('nav.ui-shell-bottom-nav');
    const tabs = bottomNav.findAll('.ui-shell-bottom-nav-item');

    expect(wrapper.get('.topnav-brand-logo').attributes('src')).toContain('svg');
    expect(wrapper.get('.topnav-brand-logo').attributes('alt')).toBe('');
    expect(wrapper.text()).not.toContain('TA');
    expect(wrapper.find('.ui-shell-footer').exists()).toBe(false);
    expect(tabs).toHaveLength(5);
    expect(tabs.map((tab) => tab.text())).toEqual([
      'Estado',
      'Patrimonio',
      'Presupuesto',
      'Movimientos',
      'Cierre',
    ]);
    expect(wrapper.find('.ui-shell-nav-toggle').exists()).toBe(false);
    expect(wrapper.find('.ui-shell-mobile-nav').exists()).toBe(false);
  });

  it('does not render product navigation for SaaS admins', async () => {
    mocks.validateSession.mockResolvedValue({
      data: {
        username: 'Admin',
        role: 'saas_admin',
        subscription_status: 'trial',
      },
    });

    const wrapper = mountShell();
    await flushPromises();

    expect(wrapper.find('nav.ui-shell-bottom-nav').exists()).toBe(false);
    expect(wrapper.find('nav.ui-shell-desktop-nav').exists()).toBe(false);
    expect(wrapper.get('.ui-shell-page-chip').text()).toBe('The Arkenstone Admin');
    expect(wrapper.find('.ui-shell-footer').exists()).toBe(false);
  });

  it('opens the about dialog from the account menu', async () => {
    const wrapper = mountShell();
    await flushPromises();

    await wrapper.get('.ui-shell-account-link').trigger('click');
    await wrapper.get('.ui-shell-account-dropdown button[role="menuitem"]').trigger('click');

    expect(document.body.textContent).toContain('Acerca de');
    expect(document.body.textContent).toContain('The Arkenstone');
    expect(document.body.textContent).toContain(`v${appVersion}`);
  });
});

function mountShell() {
  return mount(AppShellLayout, {
    global: {
      stubs: {
        RouterLink: {
          props: ['to'],
          template: '<a :href="typeof to === `string` ? to : `#`"><slot /></a>',
        },
        RouterView: {
          template: '<main data-test="router-view" />',
        },
      },
    },
  });
}
