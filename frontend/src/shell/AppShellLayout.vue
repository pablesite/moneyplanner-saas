<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { version as appVersion } from '../../package.json';
import { useAppShell } from './useAppShell';

const {
  accountInitials,
  accountLabel,
  accountMenuOpen,
  accountMenuRef,
  accountPlan,
  accountRole,
  closeAccountMenu,
  closeSidebar,
  hasToken,
  isSaasAdmin,
  isNavItemActive,
  logout,
  navItems,
  pageTitle,
  sidebarOpen,
  toggleAccountMenu,
  toggleSidebar,
} = useAppShell();
const assignAccountMenuRef = (element: Element | ComponentPublicInstance | null) => {
  accountMenuRef.value = element as HTMLElement | null;
};
</script>

<template>
  <div class="ui-shell">
    <div v-if="sidebarOpen && !isSaasAdmin" class="ui-shell-backdrop" @click="closeSidebar" />

    <div class="ui-shell-main">
      <header class="ui-shell-header dir-a">
        <div class="topbar">
          <div class="ui-shell-header-left">
            <button
              v-if="!isSaasAdmin"
              class="icon-btn ui-shell-icon-btn ui-shell-nav-toggle"
              type="button"
              aria-label="Abrir menu"
              @click="toggleSidebar"
            >
              <span aria-hidden="true">=</span>
            </button>

            <RouterLink
              class="topnav-brand ui-shell-brand-link"
              :to="isSaasAdmin ? '/account' : '/'"
            >
              <span class="topnav-brand-mark">TA</span>
              <span class="topnav-brand-text">
                <span class="topnav-brand-title">The Arkenstone</span>
                <span class="topnav-brand-sub">SaaS financiero</span>
              </span>
            </RouterLink>

            <div v-if="!isSaasAdmin" class="topnav-divider ui-shell-nav-divider" />
          </div>

          <nav
            v-if="!isSaasAdmin"
            class="topnav-list ui-shell-desktop-nav"
            aria-label="Navegacion principal"
          >
            <RouterLink
              v-for="item in navItems"
              :key="item.id"
              :to="item.to"
              class="topnav-item"
              :class="{ on: isNavItemActive(item) }"
              :title="`${item.label}: ${item.hint}`"
            >
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="topnav-right">
            <div v-if="isSaasAdmin" class="ui-shell-page-chip">
              {{ pageTitle }}
            </div>

            <div v-if="hasToken" :ref="assignAccountMenuRef" class="ui-shell-account-menu">
              <button
                class="ui-shell-account-link"
                type="button"
                :aria-expanded="accountMenuOpen"
                aria-haspopup="menu"
                @click="toggleAccountMenu"
              >
                <span class="ui-shell-account-avatar avatar">{{ accountInitials }}</span>
                <span class="ui-shell-account-info">
                  <span class="ui-shell-account-name">{{ accountLabel }}</span>
                  <span class="ui-shell-account-meta">
                    <span v-if="accountRole">{{ accountRole }}</span>
                    <span v-if="accountRole && accountPlan"> | </span>
                    <span v-if="accountPlan">{{ accountPlan }}</span>
                  </span>
                </span>
              </button>

              <div v-if="accountMenuOpen" class="ui-shell-account-dropdown" role="menu">
                <RouterLink
                  class="ui-shell-account-item"
                  to="/account"
                  role="menuitem"
                  @click="closeAccountMenu"
                >
                  {{ isSaasAdmin ? 'Admin SaaS' : 'Perfil' }}
                </RouterLink>
                <RouterLink
                  v-if="!isSaasAdmin"
                  class="ui-shell-account-item"
                  to="/data"
                  role="menuitem"
                  @click="closeAccountMenu"
                >
                  Datos auxiliares
                </RouterLink>
                <button
                  class="ui-shell-account-item ui-shell-account-item-btn"
                  type="button"
                  role="menuitem"
                  @click="logout"
                >
                  Cerrar sesion
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div v-if="sidebarOpen && !isSaasAdmin" class="ui-shell-mobile-nav dir-a">
        <nav class="ui-shell-mobile-nav-list" aria-label="Navegacion principal movil">
          <RouterLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.to"
            class="ui-shell-mobile-nav-item"
            :class="{ on: isNavItemActive(item) }"
            :title="`${item.label}: ${item.hint}`"
            @click="closeSidebar"
          >
            <span class="ui-shell-mobile-nav-label">
              {{ item.label }}
            </span>
            <span class="ui-shell-mobile-nav-hint">
              {{ item.hint }}
            </span>
          </RouterLink>
        </nav>
      </div>

      <main class="ui-shell-content">
        <div class="dir-a ui-shell-content-stage">
          <router-view />
        </div>
      </main>

      <footer class="ui-shell-footer dir-a">
        <div class="ui-shell-footer-inner">
          <span class="ui-shell-footer-version">v{{ appVersion }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>
