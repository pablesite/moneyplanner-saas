import { nextTick } from 'vue';
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
import PlanOccurredEventView from './views/PlanOccurredEventView.vue';
import PlanPlannedDecisionView from './views/PlanPlannedDecisionView.vue';
import PlanScenariosView from './views/PlanScenariosView.vue';
import PlanScenarioDetailView from './views/PlanScenarioDetailView.vue';
import PlanImprovementsView from './views/PlanImprovementsView.vue';
import PlanEventDetailView from './views/PlanEventDetailView.vue';
import PlanDecisionEditView from './views/PlanDecisionEditView.vue';
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
    path: '/plan/mejoras',
    name: 'plan-improvements',
    component: PlanImprovementsView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones',
    name: 'plan-decisions',
    component: PlanScenariosView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones/nueva',
    redirect: (to) => ({
      path: '/plan/decisiones',
      query: { ...to.query, create: '1' },
    }),
  },
  {
    path: '/plan/decisiones/eventos/:id/editar',
    name: 'plan-event-edit',
    component: PlanDecisionEditView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones/eventos/:id',
    name: 'plan-event-detail',
    component: PlanEventDetailView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones/:id',
    name: 'plan-decision-detail',
    component: PlanScenarioDetailView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones/registrar',
    name: 'plan-occurred-event',
    component: PlanOccurredEventView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/decisiones/agrupar',
    name: 'plan-planned-decision',
    component: PlanPlannedDecisionView,
    beforeEnter: () => (canUsePlan() ? true : '/'),
  },
  {
    path: '/plan/escenarios',
    redirect: (to) => ({ path: '/plan/decisiones', query: to.query }),
  },
  {
    path: '/plan/escenarios/:id',
    redirect: (to) => ({
      path: `/plan/decisiones/${String(to.params.id)}`,
      query: to.query,
    }),
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

router.afterEach(async (to, from) => {
  // Los filtros que se sincronizan con la URL (`router.replace` con query nueva) no
  // son navegaciones reales: mover el foco al shell ahí le roba el cursor al usuario
  // mientras escribe en un buscador.
  if (to.path === from.path) return;
  await nextTick();
  const main = document.querySelector<HTMLElement>('main');
  if (!main) return;
  main.setAttribute('tabindex', '-1');
  main.focus({ preventScroll: true });
  main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
});
