import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  registerAuthGuard: vi.fn(),
  createRouter: vi.fn(),
  createWebHistory: vi.fn(() => 'history'),
  afterEach: vi.fn(),
  canUsePlan: vi.fn(() => true),
  canUsePortfolio: vi.fn(() => true),
}));

vi.mock('vue-router', () => ({
  createRouter: mocks.createRouter,
  createWebHistory: mocks.createWebHistory,
}));

vi.mock('@/domains/auth', () => ({
  registerAuthGuard: mocks.registerAuthGuard,
}));

vi.mock('@/domains/capabilities', () => ({
  canUsePlan: mocks.canUsePlan,
  canUsePortfolio: mocks.canUsePortfolio,
}));

vi.mock('./views/NetWorthView.vue', () => ({ default: { name: 'NetWorthView' } }));
vi.mock('./views/LoginView.vue', () => ({ default: { name: 'LoginView' } }));
vi.mock('./views/BudgetView.vue', () => ({ default: { name: 'BudgetView' } }));
vi.mock('./views/MonthlyCloseView.vue', () => ({ default: { name: 'MonthlyCloseView' } }));
vi.mock('./views/AuxDataView.vue', () => ({ default: { name: 'AuxDataView' } }));
vi.mock('./views/AccountView.vue', () => ({ default: { name: 'AccountView' } }));
vi.mock('./views/PeopleView.vue', () => ({ default: { name: 'PeopleView' } }));
vi.mock('./views/AccountingMovementsView.vue', () => ({
  default: { name: 'AccountingMovementsView' },
}));
vi.mock('./views/AccountingAccountsView.vue', () => ({
  default: { name: 'AccountingAccountsView' },
}));
vi.mock('./views/PlanView.vue', () => ({ default: { name: 'PlanView' } }));
vi.mock('./views/PlanAssetsView.vue', () => ({ default: { name: 'PlanAssetsView' } }));
vi.mock('./views/PlanSetupView.vue', () => ({ default: { name: 'PlanSetupView' } }));
vi.mock('./views/PlanOccurredEventView.vue', () => ({
  default: { name: 'PlanOccurredEventView' },
}));
vi.mock('./views/PlanScenariosView.vue', () => ({ default: { name: 'PlanScenariosView' } }));
vi.mock('./views/PlanScenarioDetailView.vue', () => ({
  default: { name: 'PlanScenarioDetailView' },
}));
vi.mock('./views/PlanImprovementsView.vue', () => ({
  default: { name: 'PlanImprovementsView' },
}));
vi.mock('./views/PlanEventDetailView.vue', () => ({
  default: { name: 'PlanEventDetailView' },
}));
vi.mock('./views/PlanDecisionEditView.vue', () => ({
  default: { name: 'PlanDecisionEditView' },
}));
vi.mock('./views/PortfolioView.vue', () => ({ default: { name: 'PortfolioView' } }));

describe('router (core)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.createRouter.mockReturnValue({ __router: true, afterEach: mocks.afterEach });
  });

  it('registers auth guard and mounts core routes', async () => {
    const mod = await import('./router');

    expect(mod.router).toEqual({ __router: true, afterEach: mocks.afterEach });
    expect(mocks.createRouter).toHaveBeenCalledWith(
      expect.objectContaining({
        history: 'history',
        routes: expect.arrayContaining([
          expect.objectContaining({ path: '/login' }),
          expect.objectContaining({ path: '/presupuesto' }),
          expect.objectContaining({ path: '/' }),
          expect.objectContaining({ path: '/data' }),
          expect.objectContaining({ path: '/contabilidad' }),
          expect.objectContaining({ path: '/contabilidad/cuentas' }),
          expect.objectContaining({ path: '/cartera' }),
          expect.objectContaining({ path: '/movimientos' }),
          expect.objectContaining({ path: '/estado-financiero', redirect: '/plan' }),
          expect.objectContaining({
            path: '/estado-financiero/ambitos/:phaseId',
            redirect: '/plan',
          }),
          expect.objectContaining({ path: '/plan' }),
          expect.objectContaining({ path: '/plan/mejoras' }),
          expect.objectContaining({ path: '/plan/decisiones' }),
          expect.objectContaining({ path: '/plan/decisiones/nueva' }),
          expect.objectContaining({ path: '/plan/decisiones/eventos/:id' }),
          expect.objectContaining({ path: '/plan/decisiones/eventos/:id/editar' }),
        ]),
      }),
    );
    expect(mocks.registerAuthGuard).toHaveBeenCalledWith({
      __router: true,
      afterEach: mocks.afterEach,
    });
    expect(mocks.afterEach).toHaveBeenCalledOnce();
  }, 20000);
});
