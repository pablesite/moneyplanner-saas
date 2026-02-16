import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NetWorthView from './views/NetWorthView.vue';
import LoginView from './views/LoginView.vue';
import PeopleView from './views/PeopleView.vue';
import AuxDataView from './views/AuxDataView.vue';
import { registerAuthGuard } from '@/domains/auth';
import { capabilities } from '@/domains/capabilities';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'networth', component: NetWorthView },
  { path: '/data', name: 'aux-data', component: AuxDataView },
];

if (capabilities.people) {
  routes.push({ path: '/people', name: 'people', component: PeopleView });
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

registerAuthGuard(router);
