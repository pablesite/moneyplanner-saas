import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NetWorthView from './views/NetWorthView.vue';
import LoginView from './views/LoginView.vue';
import BudgetView from './views/BudgetView.vue';
import MonthlyCloseView from './views/MonthlyCloseView.vue';
import AuxDataView from './views/AuxDataView.vue';
import AccountView from './views/AccountView.vue';
import PeopleView from './views/PeopleView.vue';
import AccountingMovementsView from './views/AccountingMovementsView.vue';
import AccountingAccountsView from './views/AccountingAccountsView.vue';
import PlanView from './views/PlanView.vue';
import PlanAssetsView from './views/PlanAssetsView.vue';
import PlanSetupView from './views/PlanSetupView.vue';
import PlanScenariosView from './views/PlanScenariosView.vue';
import PlanScenarioDetailView from './views/PlanScenarioDetailView.vue';
import { registerAuthGuard } from '@/domains/auth';
import { canUsePlan } from '@/domains/capabilities';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'root', component: NetWorthView },
  { path: '/estado-financiero', redirect: '/plan' },
  { path: '/guia', redirect: '/plan' },
  { path: '/inicio', redirect: '/plan' },
  { path: '/estado-financiero/ambitos/:phaseId', redirect: '/plan' },
  {
    path: '/guia/fases/:phaseId',
    redirect: '/plan',
  },
  { path: '/patrimonio', redirect: '/' },
  { path: '/presupuesto', name: 'budget-dashboard', component: BudgetView },
  { path: '/cierre-mensual', name: 'monthly-close', component: MonthlyCloseView },
  { path: '/data', name: 'aux-data', component: AuxDataView },
  { path: '/data/fx', redirect: '/data' },
  { path: '/data/ipc', redirect: '/data' },
  { path: '/account', name: 'account', component: AccountView },
  { path: '/people', name: 'people', component: PeopleView },
  {
    path: '/plan',
    name: 'plan',
    component: PlanView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/setup',
    name: 'plan-setup',
    component: PlanSetupView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/activos',
    name: 'plan-assets',
    component: PlanAssetsView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/escenarios',
    name: 'plan-scenarios',
    component: PlanScenariosView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/escenarios/:id',
    name: 'plan-scenario-detail',
    component: PlanScenarioDetailView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/movimientos',
    redirect: (to) => ({
      path: to.query.tab === 'cuentas' ? '/contabilidad/cuentas' : '/contabilidad',
      query: Object.fromEntries(Object.entries(to.query).filter(([key]) => key !== 'tab')),
    }),
  },
  { path: '/contabilidad', name: 'accounting-movements', component: AccountingMovementsView },
  {
    path: '/contabilidad/cuentas',
    name: 'accounting-accounts',
    component: AccountingAccountsView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

registerAuthGuard(router);
