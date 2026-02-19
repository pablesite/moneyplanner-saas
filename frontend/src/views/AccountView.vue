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
    <div class="ui-page-header">
      <h1 class="h1 ui-page-title">Cuenta SaaS</h1>
    </div>

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
      <section class="card ui-pro-panel">
        <h2 class="mt-0 text-base">Identidad SaaS</h2>
        <div class="ui-pro-toolbar mb-2">
          <span class="ui-pro-chip">Usuario: {{ username }}</span>
          <span class="ui-pro-chip">Email: {{ email || 'sin email' }}</span>
        </div>
        <p class="subtle">
          Rol: <strong>{{ role }}</strong>
        </p>
        <p class="subtle">
          Suscripcion: <strong>{{ subscriptionStatus }}</strong>
          <span v-if="premiumEnabled"> (premium habilitado)</span>
          <span v-else> (premium bloqueado)</span>
        </p>
        <div v-if="role === 'saas_admin'" class="mt-2.5">
          <button class="btn btn-sm" type="button" @click="$router.push('/admin/users')">
            Administrar usuarios SaaS
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
