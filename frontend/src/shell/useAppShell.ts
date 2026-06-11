import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authApi, type CurrentUser } from '@/domains/auth';
import { clearAuthTokens, hasAccessToken } from '@/domains/auth/session';
import { appShellNavItems, type NavItem } from './appShellNav';

export function useAppShell() {
  const route = useRoute();
  const router = useRouter();
  const sidebarOpen = ref(false);
  const accountMenuOpen = ref(false);
  const accountMenuRef = ref<HTMLElement | null>(null);
  const accountLabel = ref('Mi cuenta');
  const accountRole = ref('');
  const accountRoleKey = ref<CurrentUser['role'] | ''>('');
  const accountPlan = ref('');

  const pageTitle = computed(() => (isSaasAdmin.value ? 'admin saas' : 'moneyplanner'));
  const hasToken = computed(() => hasAccessToken.value);
  const isLoginRoute = computed(() => route.name === 'login');
  const isSaasAdmin = computed(() => accountRoleKey.value === 'saas_admin');
  const navItems = computed<NavItem[]>(() => (isSaasAdmin.value ? [] : appShellNavItems));

  const accountInitials = computed(() => {
    const text = accountLabel.value.trim();
    if (!text || text === 'Mi cuenta') return 'MC';
    const words = text.split(/\s+/).filter(Boolean);
    const first = words[0] ?? '';
    const second = words[1] ?? '';
    if (!second) return first.slice(0, 2).toUpperCase();
    return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
  });

  function roleLabel(role: CurrentUser['role']): string {
    return role === 'saas_admin' ? 'Admin SaaS' : 'Miembro SaaS';
  }

  function subscriptionLabel(status: CurrentUser['subscription_status']): string {
    if (status === 'active') return 'Activa';
    if (status === 'past_due') return 'Pendiente';
    if (status === 'canceled') return 'Cancelada';
    return 'Trial';
  }

  async function hydrateAccountSummary(): Promise<void> {
    try {
      const response = await authApi.validateSession();
      const user = response.data;
      accountLabel.value = user.username || 'Mi cuenta';
      accountRoleKey.value = user.role;
      accountRole.value = roleLabel(user.role);
      accountPlan.value =
        user.role === 'saas_admin' ? '' : subscriptionLabel(user.subscription_status);
    } catch {
      accountLabel.value = 'Mi cuenta';
      accountRoleKey.value = '';
      accountRole.value = '';
      accountPlan.value = '';
    }
  }

  function isNavItemActive(item: NavItem): boolean {
    if (item.id === 'home') {
      return route.path === '/' || route.path.startsWith('/guia/');
    }
    return route.path === item.to || route.path.startsWith(`${item.to}/`);
  }

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function closeSidebar(): void {
    sidebarOpen.value = false;
  }

  function toggleAccountMenu(): void {
    accountMenuOpen.value = !accountMenuOpen.value;
  }

  function closeAccountMenu(): void {
    accountMenuOpen.value = false;
  }

  function logout(): void {
    clearAuthTokens();
    closeAccountMenu();
    sidebarOpen.value = false;
    void router.push('/login');
  }

  function handleGlobalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (sidebarOpen.value) closeSidebar();
      if (accountMenuOpen.value) closeAccountMenu();
    }
  }

  function handleGlobalClick(event: MouseEvent): void {
    if (!accountMenuOpen.value) return;
    const target = event.target as Node | null;
    if (!target) return;
    if (accountMenuRef.value && !accountMenuRef.value.contains(target)) {
      closeAccountMenu();
    }
  }

  watch(sidebarOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  });

  watch(
    () => route.fullPath,
    () => {
      sidebarOpen.value = false;
      accountMenuOpen.value = false;
    },
  );

  watch(
    hasToken,
    (tokenPresent) => {
      if (!tokenPresent) {
        accountLabel.value = 'Mi cuenta';
        accountRoleKey.value = '';
        accountRole.value = '';
        accountPlan.value = '';
        return;
      }
      void hydrateAccountSummary();
    },
    { immediate: true },
  );

  window.addEventListener('keydown', handleGlobalKeydown);
  document.addEventListener('click', handleGlobalClick);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
    document.removeEventListener('click', handleGlobalClick);
    document.body.style.overflow = '';
  });

  return {
    accountInitials,
    accountLabel,
    accountMenuOpen,
    accountMenuRef,
    accountPlan,
    accountRole,
    accountRoleKey,
    closeAccountMenu,
    closeSidebar,
    hasToken,
    isLoginRoute,
    isNavItemActive,
    isSaasAdmin,
    logout,
    navItems,
    pageTitle,
    sidebarOpen,
    toggleAccountMenu,
    toggleSidebar,
  };
}
