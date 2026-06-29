<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { ref } from 'vue';
import { version as appVersion } from '../../package.json';
import { BaseModal } from '@/domains/ui';
import AppShellNavIcon from './AppShellNavIcon.vue';
import { useAppShell } from './useAppShell';

const {
  accountInitials,
  accountLabel,
  accountMenuOpen,
  accountMenuRef,
  accountPlan,
  accountRole,
  closeAccountMenu,
  hasToken,
  isSaasAdmin,
  isNavItemActive,
  logout,
  navItems,
  pageTitle,
  toggleAccountMenu,
} = useAppShell();
const aboutOpen = ref(false);
const assignAccountMenuRef = (element: Element | ComponentPublicInstance | null) => {
  accountMenuRef.value = element as HTMLElement | null;
};

function openAbout() {
  closeAccountMenu();
  aboutOpen.value = true;
}
</script>

<template>
  <div class="ui-shell">
    <div class="ui-shell-main">
      <header class="ui-shell-header dir-a">
        <div class="topbar">
          <div class="ui-shell-header-left">
            <RouterLink
              class="topnav-brand ui-shell-brand-link"
              :to="isSaasAdmin ? '/account' : '/'"
            >
              <img class="topnav-brand-logo" src="/icons/icon.svg" alt="" aria-hidden="true" />
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
                  @click="openAbout"
                >
                  Acerca de
                </button>
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

      <main class="ui-shell-content">
        <div class="dir-a ui-shell-content-stage">
          <router-view />
        </div>
      </main>

      <nav
        v-if="!isSaasAdmin"
        class="ui-shell-bottom-nav dir-a"
        aria-label="Navegacion principal movil"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.id"
          :to="item.to"
          class="ui-shell-bottom-nav-item"
          :class="{ on: isNavItemActive(item) }"
          :aria-label="`${item.label}: ${item.hint}`"
          :title="`${item.label}: ${item.hint}`"
        >
          <AppShellNavIcon :name="item.iconKey" />
          <span class="ui-shell-bottom-nav-label">{{ item.mobileLabel }}</span>
        </RouterLink>
      </nav>
    </div>

    <BaseModal
      :open="aboutOpen"
      title="Acerca de"
      panel-class="ui-shell-about-modal"
      @close="aboutOpen = false"
    >
      <div class="ui-shell-about-body">
        <p class="ui-shell-about-name">The Arkenstone</p>
        <p class="ui-shell-about-copy">
          SaaS financiero para el seguimiento patrimonial, el presupuesto y la operativa diaria.
        </p>

        <dl class="ui-shell-about-meta">
          <div>
            <dt>Versión</dt>
            <dd>v{{ appVersion }}</dd>
          </div>
          <div>
            <dt>Edición</dt>
            <dd>SaaS</dd>
          </div>
        </dl>
      </div>
    </BaseModal>
  </div>
</template>
