'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.router = void 0;
var vue_router_1 = require('vue-router');
var NetWorthView_vue_1 = require('./views/NetWorthView.vue');
var LoginView_vue_1 = require('./views/LoginView.vue');
var HomeView_vue_1 = require('./views/HomeView.vue');
var GuidePhaseDetailView_vue_1 = require('./views/GuidePhaseDetailView.vue');
var DataInputView_vue_1 = require('./views/DataInputView.vue');
var BudgetDashboardView_vue_1 = require('./views/BudgetDashboardView.vue');
var AuxDataView_vue_1 = require('./views/AuxDataView.vue');
var AccountView_vue_1 = require('./views/AccountView.vue');
var PeopleView_vue_1 = require('./views/PeopleView.vue');
var AccountingMovementsView_vue_1 = require('./views/AccountingMovementsView.vue');
var auth_1 = require('@/domains/auth');
var routes = [
  { path: '/login', name: 'login', component: LoginView_vue_1.default },
  { path: '/', name: 'home', component: HomeView_vue_1.default },
  { path: '/inicio', redirect: '/' },
  {
    path: '/guia/fases/:phaseId',
    name: 'guide-phase',
    component: GuidePhaseDetailView_vue_1.default,
  },
  { path: '/introduccion-datos', name: 'data-input', component: DataInputView_vue_1.default },
  { path: '/patrimonio', name: 'networth', component: NetWorthView_vue_1.default },
  { path: '/presupuesto', name: 'budget-dashboard', component: BudgetDashboardView_vue_1.default },
  {
    path: '/cierre-mensual',
    name: 'monthly-close',
    component: BudgetDashboardView_vue_1.default,
    props: { mode: 'monthly-close' },
  },
  { path: '/data', name: 'aux-data', component: AuxDataView_vue_1.default },
  { path: '/data/fx', redirect: '/data' },
  { path: '/data/ipc', redirect: '/data' },
  { path: '/account', name: 'account', component: AccountView_vue_1.default },
  { path: '/people', name: 'people', component: PeopleView_vue_1.default },
  {
    path: '/movimientos',
    name: 'accounting-movements',
    component: AccountingMovementsView_vue_1.default,
  },
];
exports.router = (0, vue_router_1.createRouter)({
  history: (0, vue_router_1.createWebHistory)(),
  routes: routes,
});
(0, auth_1.registerAuthGuard)(exports.router);
