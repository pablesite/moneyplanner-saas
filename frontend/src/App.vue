<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { capabilities } from '@/domains/capabilities';
import { clearAuthTokens, getAccessToken } from '@/domains/auth/session';

type NavItem = {
  id: string;
  label: string;
  hint: string;
  to: string;
};

const route = useRoute();
const router = useRouter();
const sidebarCollapsed = ref(true);

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
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

function logout(): void {
  clearAuthTokens();
  router.push('/login');
}
</script>

<template>
  <router-view v-if="isLoginRoute" />

  <div v-else class="ui-shell" :class="{ 'ui-shell-collapsed': sidebarCollapsed }">
    <aside class="ui-shell-sidebar">
      <div class="ui-shell-sidebar-top">
        <button class="btn ui-shell-toggle" type="button" @click="toggleSidebar">
          {{ sidebarCollapsed ? 'Abrir menu' : 'Cerrar menu' }}
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
        >
          <span class="ui-shell-link-label">{{ item.label }}</span>
          <span class="ui-shell-link-hint">{{ item.hint }}</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="ui-shell-main">
      <header class="ui-shell-header">
        <button class="btn ui-shell-toggle-mobile" type="button" @click="toggleSidebar">
          Menu
        </button>
        <div class="ui-shell-header-title">{{ pageTitle }}</div>
        <div v-if="hasToken" class="ui-shell-header-actions">
          <button class="btn" type="button" @click="logout">Logout</button>
        </div>
      </header>

      <main class="ui-shell-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.ui-shell {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 250px minmax(0, 1fr);
}

.ui-shell-collapsed {
  grid-template-columns: 108px minmax(0, 1fr);
}

.ui-shell-sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  padding: 20px 14px;
}

.ui-shell-sidebar-top {
  margin-bottom: 18px;
}

.ui-shell-toggle {
  width: 100%;
  font-size: 13px;
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

.ui-shell-header-title {
  font-size: 18px;
  font-weight: 600;
}

.ui-shell-toggle-mobile {
  display: none;
}

.ui-shell-content {
  min-width: 0;
}

.ui-shell-collapsed .ui-shell-link-hint {
  display: none;
}

.ui-shell-collapsed .ui-shell-link-label {
  font-size: 13px;
}

@media (max-width: 900px) {
  .ui-shell,
  .ui-shell-collapsed {
    grid-template-columns: 1fr;
  }

  .ui-shell-sidebar {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px;
  }

  .ui-shell-collapsed .ui-shell-sidebar {
    display: none;
  }

  .ui-shell-header {
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 12px;
  }

  .ui-shell-toggle-mobile {
    display: inline-flex;
    width: auto;
  }
}
</style>
