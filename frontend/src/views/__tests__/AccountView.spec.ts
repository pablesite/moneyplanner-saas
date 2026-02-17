/** @vitest-environment jsdom */
import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AccountView from '../AccountView.vue';

const mockUseSaasAccountPage = vi.fn();

vi.mock('@/domains/auth', () => ({
  useSaasAccountPage: () => mockUseSaasAccountPage(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
}));

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    loading: ref(false),
    saving: ref(false),
    error: ref<string | null>(null),
    success: ref<string | null>(null),
    username: ref('saas_user'),
    email: ref('saas@example.com'),
    role: ref<'saas_admin' | 'saas_member'>('saas_member'),
    subscriptionStatus: ref('trial'),
    premiumEnabled: ref(true),
    accountLinkingEnabled: ref(true),
    linkedCoreUserRef: ref<string | null>('core-123'),
    linkedCoreUsername: ref<string | null>('core_user'),
    linkedCoreEmail: ref<string | null>('core@example.com'),
    coreUserRef: ref('core-123'),
    coreUsername: ref('core_user'),
    coreEmail: ref('core@example.com'),
    saveCoreLink: vi.fn(async () => {}),
    removeCoreLink: vi.fn(async () => {}),
    goBack: vi.fn(),
    reload: vi.fn(async () => {}),
    ...overrides,
  };
}

describe('AccountView', () => {
  beforeEach(() => {
    mockUseSaasAccountPage.mockReset();
  });

  it('renders account identity and linking section', () => {
    mockUseSaasAccountPage.mockReturnValue(makeState());
    const wrapper = mount(AccountView);

    expect(wrapper.text()).toContain('Cuenta SaaS');
    expect(wrapper.text()).toContain('saas_user');
    expect(wrapper.text()).toContain('trial');
    expect(wrapper.text()).toContain('core-123');
  });

  it('renders loading state', () => {
    mockUseSaasAccountPage.mockReturnValue(makeState({ loading: ref(true) }));
    const wrapper = mount(AccountView);
    expect(wrapper.text()).toContain('Cargando cuenta...');
  });

  it('submits link form through composable action', async () => {
    const state = makeState();
    mockUseSaasAccountPage.mockReturnValue(state);
    const wrapper = mount(AccountView);

    await wrapper.get('form').trigger('submit.prevent');
    expect(state.saveCoreLink).toHaveBeenCalledTimes(1);
  });
});
