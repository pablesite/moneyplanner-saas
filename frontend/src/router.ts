import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NetWorthView from './views/NetWorthView.vue';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import GuidePhaseDetailView from './views/GuidePhaseDetailView.vue';
import BudgetView from './views/BudgetView.vue';
import MonthlyCloseView from './views/MonthlyCloseView.vue';
import AuxDataView from './views/AuxDataView.vue';
import AccountView from './views/AccountView.vue';
import PeopleView from './views/PeopleView.vue';
import AccountingMovementsView from './views/AccountingMovementsView.vue';
import AccountingAccountsView from './views/AccountingAccountsView.vue';
import PlanView from './views/PlanView.vue';
import PlanSetupView from './views/PlanSetupView.vue';
import { registerAuthGuard } from '@/domains/auth';
import { canUsePlan } from '@/domains/capabilities';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'root', component: NetWorthView },
  { path: '/estado-financiero', name: 'home', component: HomeView },
  { path: '/guia', redirect: '/estado-financiero' },
  { path: '/inicio', redirect: '/estado-financiero' },
  {
    path: '/estado-financiero/ambitos/:phaseId',
    name: 'guide-phase',
    component: GuidePhaseDetailView,
  },
  {
    path: '/guia/fases/:phaseId',
    redirect: (to) => `/estado-financiero/ambitos/${to.params.phaseId}`,
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
    beforeEnter: () => (canUsePlan() ? true : '/estado-financiero'),
  },
  {
    path: '/plan/setup',
    name: 'plan-setup',
    component: PlanSetupView,
    beforeEnter: () => (canUsePlan() ? true : '/estado-financiero'),
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
