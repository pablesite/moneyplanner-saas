import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  registerAuthGuard: vi.fn(),
  createRouter: vi.fn(),
  createWebHistory: vi.fn(() => 'history'),
}));

function viewStub(name: string) {
  return { default: { name } };
}

vi.mock('vue-router', () => ({
  createRouter: mocks.createRouter,
  createWebHistory: mocks.createWebHistory,
}));

vi.mock('@/domains/auth', () => ({
  registerAuthGuard: mocks.registerAuthGuard,
}));

vi.mock('@/domains/capabilities', () => ({
  capabilities: { people: true },
}));

vi.mock('./views/NetWorthView.vue', () => viewStub('NetWorthView'));
vi.mock('./views/LoginView.vue', () => viewStub('LoginView'));
vi.mock('./views/HomeView.vue', () => viewStub('HomeView'));
vi.mock('./views/GuidePhaseDetailView.vue', () => viewStub('GuidePhaseDetailView'));
vi.mock('./views/DataInputView.vue', () => viewStub('DataInputView'));
vi.mock('./views/BudgetDashboardView.vue', () => viewStub('BudgetDashboardView'));
vi.mock('./views/PeopleView.vue', () => viewStub('PeopleView'));
vi.mock('./views/AuxDataView.vue', () => viewStub('AuxDataView'));
vi.mock('./views/SettingsFxView.vue', () => viewStub('SettingsFxView'));
vi.mock('./views/SettingsIpcView.vue', () => viewStub('SettingsIpcView'));
vi.mock('./views/AccountView.vue', () => viewStub('AccountView'));
vi.mock('./views/AdminUsersView.vue', () => viewStub('AdminUsersView'));

describe('router (saas)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.createRouter.mockReturnValue({ __router: true });
  });

  it('registers auth guard and includes premium routes', async () => {
    const mod = await import('./router');

    expect(mod.router).toEqual({ __router: true });
    expect(mocks.createRouter).toHaveBeenCalledWith(
      expect.objectContaining({
        history: 'history',
        routes: expect.arrayContaining([
          expect.objectContaining({ path: '/login' }),
          expect.objectContaining({ path: '/introduccion-datos' }),
          expect.objectContaining({ path: '/presupuesto' }),
          expect.objectContaining({ path: '/guia/fases/:phaseId' }),
          expect.objectContaining({ path: '/' }),
          expect.objectContaining({ path: '/data' }),
          expect.objectContaining({ path: '/data/fx' }),
          expect.objectContaining({ path: '/data/ipc' }),
          expect.objectContaining({ path: '/account' }),
          expect.objectContaining({ path: '/admin/users' }),
          expect.objectContaining({ path: '/people' }),
        ]),
      }),
    );
    expect(mocks.registerAuthGuard).toHaveBeenCalledWith({ __router: true });
  });
});
