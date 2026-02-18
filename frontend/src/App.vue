<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { capabilities } from '@/domains/capabilities';
import { getSaasMe } from '@/domains/auth/accountApi';
import { getAccessToken } from '@/domains/auth/session';

type NavItem = {
  id: string;
  label: string;
  hint: string;
  to: string;
};

const route = useRoute();
const sidebarOpen = ref(false);
const accountLabel = ref('Mi cuenta');
const accountRole = ref('');

const hasToken = computed(() => !!getAccessToken());
const isLoginRoute = computed(() => route.name === 'login');
const navItems = computed<NavItem[]>(() => {
  const baseItems: NavItem[] = [
    { id: 'home', label: 'Inicio', hint: 'Plan guiado', to: '/inicio' },
    { id: 'net-worth', label: 'Patrimonio', hint: 'Estado financiero', to: '/' },
    { id: 'account', label: 'Cuenta', hint: 'Perfil y seguridad', to: '/account' },
    { id: 'settings', label: 'Settings', hint: 'Preferencias y datos', to: '/data' },
  ];

  if (capabilities.people) {
    baseItems.splice(2, 0, {
      id: 'people',
      label: 'Personas',
      hint: 'Familia y titulares',
      to: '/people',
    });
  }

  return baseItems;
});

const pageTitle = computed(() => {
  if (route.path === '/inicio') {
    return 'Tu plan financiero';
  }
  return 'Moneyplanner';
});

function toggleSidebar(): void {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar(): void {
  sidebarOpen.value = false;
}

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);

watch(
  hasToken,
  async (tokenPresent) => {
    if (!tokenPresent) {
      accountLabel.value = 'Mi cuenta';
      accountRole.value = '';
      return;
    }
    try {
      const res = await getSaasMe();
      accountLabel.value = res.data.username;
      accountRole.value = res.data.role === 'saas_admin' ? 'Admin' : 'Member';
    } catch {
      accountLabel.value = 'Mi cuenta';
      accountRole.value = '';
    }
  },
  { immediate: true },
);
</script>

<template>
  <router-view v-if="isLoginRoute" />

  <div v-else class="ui-shell">
    <div v-if="sidebarOpen" class="ui-shell-backdrop" @click="closeSidebar" />

    <aside class="ui-shell-sidebar" :class="{ 'ui-shell-sidebar-open': sidebarOpen }">
      <div class="ui-shell-sidebar-top">
        <button
          class="icon-btn ui-shell-icon-btn"
          type="button"
          aria-label="Cerrar menu"
          @click="closeSidebar"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <nav class="ui-shell-nav" aria-label="Navegacion principal">
        <RouterLink
          v-for="item in navItems"
          :key="item.id"
          :to="item.to"
          class="ui-shell-link"
          :title="`${item.label}: ${item.hint}`"
          active-class="ui-shell-link-active"
          @click="closeSidebar"
        >
          <span class="ui-shell-link-label">{{ item.label }}</span>
          <span class="ui-shell-link-hint">{{ item.hint }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="ui-shell-main">
      <header class="ui-shell-header">
        <button
          class="icon-btn ui-shell-icon-btn"
          type="button"
          aria-label="Abrir menu"
          @click="toggleSidebar"
        >
          <span aria-hidden="true">&#9776;</span>
        </button>
        <div class="ui-shell-header-title">{{ pageTitle }}</div>
        <RouterLink v-if="hasToken" class="ui-shell-account-link" to="/account">
          <span class="ui-shell-account-name">{{ accountLabel }}</span>
          <span v-if="accountRole" class="ui-shell-account-role">{{ accountRole }}</span>
        </RouterLink>
      </header>

      <main class="ui-shell-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.ui-shell {
  position: relative;
  min-height: 100vh;
}

.ui-shell-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(1px);
  z-index: 30;
}

.ui-shell-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  height: 100vh;
  width: min(320px, calc(100vw - 24px));
  border-right: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  padding: 20px 14px;
  transform: translateX(-102%);
  transition: transform 0.2s ease;
}

.ui-shell-sidebar-open {
  transform: translateX(0);
}

.ui-shell-sidebar-top {
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-end;
}

.ui-shell-nav {
  display: grid;
  gap: 8px;
}

.ui-shell-link {
  display: grid;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.ui-shell-link:hover {
  border-color: rgba(255, 255, 255, 0.24);
}

.ui-shell-link-active {
  border-color: rgba(45, 212, 191, 0.7);
  background: rgba(45, 212, 191, 0.08);
}

.ui-shell-link-label {
  font-size: 14px;
  font-weight: 600;
}

.ui-shell-link-hint {
  font-size: 12px;
  color: var(--muted);
}

.ui-shell-main {
  min-width: 0;
}

.ui-shell-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 24px;
  background: rgba(11, 13, 18, 0.72);
  backdrop-filter: blur(7px);
}

.ui-shell-icon-btn {
  width: 36px;
  height: 36px;
}

.ui-shell-header-title {
  font-size: 18px;
  font-weight: 600;
}

.ui-shell-account-link {
  display: grid;
  justify-items: end;
  gap: 1px;
  text-decoration: none;
  color: var(--text);
}

.ui-shell-account-name {
  font-size: 13px;
  font-weight: 600;
}

.ui-shell-account-role {
  font-size: 11px;
  color: var(--muted);
}

.ui-shell-content {
  min-width: 0;
}

@media (max-width: 900px) {
  .ui-shell-header {
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 12px;
  }
}
</style>
