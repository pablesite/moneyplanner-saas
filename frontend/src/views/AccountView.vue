<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSaasAccountPage } from '@/domains/auth';

const route = useRoute();

const {
  loading,
  error,
  success,
  username,
  email,
  role,
  subscriptionStatus,
  premiumEnabled,
} = useSaasAccountPage();

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
          <span class="ui-profile-subtle">Cuenta local</span>
        </div>

        <div class="ui-profile-grid">
          <article class="ui-profile-field">
            <span class="ui-profile-label">Usuario</span>
            <strong class="ui-profile-value">{{ username }}</strong>
          </article>

          <article class="ui-profile-field">
            <span class="ui-profile-label">Email</span>
            <strong class="ui-profile-value">{{ email || 'sin email' }}</strong>
          </article>

          <article class="ui-profile-field">
            <span class="ui-profile-label">Rol</span>
            <strong class="ui-profile-value">{{ role }}</strong>
          </article>

          <article class="ui-profile-field">
            <span class="ui-profile-label">Suscripcion</span>
            <strong class="ui-profile-value">{{ subscriptionStatus }}</strong>
          </article>
        </div>

        <div class="ui-profile-status">
          <span class="badge" :class="premiumEnabled ? 'ui-profile-badge-on' : 'ui-profile-badge-off'">
            {{ premiumEnabled ? 'Premium habilitado' : 'Premium bloqueado' }}
          </span>
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
  padding: 16px;
}

.ui-profile-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ui-profile-head-title {
  margin: 0;
  font-size: 18px;
}

.ui-profile-subtle {
  font-size: 12px;
  color: var(--muted);
}

.ui-profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ui-profile-field {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  padding: 10px;
  display: grid;
  gap: 4px;
}

.ui-profile-label {
  font-size: 12px;
  color: var(--muted);
}

.ui-profile-value {
  font-size: 14px;
  overflow-wrap: anywhere;
}

.ui-profile-status {
  margin-top: 10px;
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
  .ui-profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
