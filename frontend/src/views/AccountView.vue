<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSaasAccountPage } from '@/domains/auth';

const route = useRoute();

const { loading, error, success, username, email, role, subscriptionStatus, premiumEnabled } =
  useSaasAccountPage();

const permissionNotice = computed(() =>
  route.query.reason === 'permission_denied'
    ? 'No tienes permisos de administracion para acceder a esa seccion.'
    : null,
);
</script>

<template>
  <div class="container ui-pro-page">
    <h1 class="h1 ui-profile-title">Perfil</h1>

    <div v-if="error" class="alert mt-3">
      {{ error }}
    </div>

    <div v-if="permissionNotice" class="alert mt-3">
      {{ permissionNotice }}
    </div>

    <div v-if="success" class="ui-alert-success mt-3">
      {{ success }}
    </div>

    <div v-if="loading" class="ui-status-line mt-3">Cargando cuenta...</div>

    <div v-else class="grid gap-3.5">
      <section class="card ui-pro-panel ui-profile-panel">
        <div class="ui-profile-head">
          <h2 class="ui-profile-head-title">Identidad</h2>
        </div>

        <div class="ui-profile-layout">
          <div class="ui-profile-list">
            <div class="ui-profile-row">
              <span class="ui-profile-label">Usuario</span>
              <strong class="ui-profile-value">{{ username }}</strong>
            </div>
            <div class="ui-profile-row">
              <span class="ui-profile-label">Email</span>
              <strong class="ui-profile-value">{{ email || 'sin email' }}</strong>
            </div>
            <div class="ui-profile-row">
              <span class="ui-profile-label">Rol</span>
              <strong class="ui-profile-value">{{ role }}</strong>
            </div>
            <div class="ui-profile-row">
              <span class="ui-profile-label">Suscripcion</span>
              <strong class="ui-profile-value">{{ subscriptionStatus }}</strong>
            </div>
          </div>

          <aside class="ui-profile-aside">
            <span class="ui-profile-aside-label">Estado del plan</span>
            <span
              class="badge"
              :class="premiumEnabled ? 'ui-profile-badge-on' : 'ui-profile-badge-off'"
            >
              {{ premiumEnabled ? 'Premium habilitado' : 'Premium bloqueado' }}
            </span>
          </aside>
        </div>

        <div v-if="role === 'saas_admin'" class="mt-2.5">
          <button class="btn btn-sm" type="button" @click="$router.push('/admin/users')">
            Administrar usuarios SaaS
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ui-profile-title {
  margin: 0 0 4px;
}

.ui-profile-panel {
  padding: 18px;
}

.ui-profile-head {
  margin-bottom: 8px;
}

.ui-profile-head-title {
  margin: 0;
  font-size: 19px;
  letter-spacing: 0.01em;
}

.ui-profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 12px;
}

.ui-profile-list {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.015);
  overflow: hidden;
}

.ui-profile-row {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.ui-profile-row:first-child {
  border-top: 0;
}

.ui-profile-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.64);
}

.ui-profile-value {
  font-size: 16px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.92);
  overflow-wrap: anywhere;
}

.ui-profile-aside {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  padding: 12px;
  display: grid;
  align-content: start;
  gap: 8px;
}

.ui-profile-aside-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.ui-profile-badge-on {
  border-color: rgba(45, 212, 191, 0.55);
  color: rgba(45, 212, 191, 0.95);
  background: rgba(45, 212, 191, 0.12);
}

.ui-profile-badge-off {
  border-color: rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 900px) {
  .ui-profile-layout {
    grid-template-columns: 1fr;
  }

  .ui-profile-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
