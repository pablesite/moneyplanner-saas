/** @vitest-environment jsdom */
import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AdminUsersView from '../AdminUsersView.vue';

const mockUseSaasAdminUsersPage = vi.fn();

vi.mock('@/domains/auth', () => ({
  useSaasAdminUsersPage: () => mockUseSaasAdminUsersPage(),
}));

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    loading: ref(false),
    saving: ref(false),
    error: ref<string | null>(null),
    success: ref<string | null>(null),
    users: ref([
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_active: true,
        role: 'saas_admin',
      },
    ]),
    createUsername: ref(''),
    createPassword: ref(''),
    createEmail: ref(''),
    createRole: ref<'saas_admin' | 'saas_member'>('saas_member'),
    createIsActive: ref(true),
    createUser: vi.fn(async () => {}),
    updateRole: vi.fn(async () => {}),
    toggleStatus: vi.fn(async () => {}),
    goBack: vi.fn(),
    reload: vi.fn(async () => {}),
    ...overrides,
  };
}

describe('AdminUsersView', () => {
  beforeEach(() => {
    mockUseSaasAdminUsersPage.mockReset();
  });

  it('renders users table and creation form', () => {
    mockUseSaasAdminUsersPage.mockReturnValue(makeState());
    const wrapper = mount(AdminUsersView);

    expect(wrapper.text()).toContain('Administracion SaaS');
    expect(wrapper.text()).toContain('Alta de usuario SaaS');
    expect(wrapper.text()).toContain('admin@example.com');
  });

  it('submits create user form through composable action', async () => {
    const state = makeState();
    mockUseSaasAdminUsersPage.mockReturnValue(state);
    const wrapper = mount(AdminUsersView);

    await wrapper.get('form').trigger('submit.prevent');
    expect(state.createUser).toHaveBeenCalledTimes(1);
  });
});
