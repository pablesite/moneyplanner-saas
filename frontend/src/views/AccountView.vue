<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSaasAccountPage } from '@/domains/auth';

const route = useRoute();

const {
  loading,
  saving,
  error,
  success,
  username,
  email,
  role,
  subscriptionStatus,
  premiumEnabled,
  accountLinkingEnabled,
  linkedCoreUserRef,
  linkedCoreUsername,
  linkedCoreEmail,
  coreUserRef,
  coreUsername,
  coreEmail,
  saveCoreLink,
  removeCoreLink,
  reload,
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

      <section class="card ui-pro-panel">
        <div class="mb-2.5 flex items-center justify-between gap-2.5">
          <h2 class="m-0 text-base">Vinculo opcional con core</h2>
          <button class="btn btn-sm" type="button" :disabled="saving" @click="reload">
            Recargar
          </button>
        </div>

        <div v-if="!accountLinkingEnabled" class="subtle">
          El account linking esta deshabilitado en este entorno.
        </div>

        <template v-else>
          <div v-if="linkedCoreUserRef" class="ui-status-line mb-3">
            Vinculado a core:
            <strong>{{ linkedCoreUserRef }}</strong>
            <span v-if="linkedCoreUsername"> ({{ linkedCoreUsername }})</span>
            <span v-if="linkedCoreEmail"> - {{ linkedCoreEmail }}</span>
          </div>

          <form class="grid gap-2.5 md:max-w-xl" @submit.prevent="saveCoreLink">
            <label class="grid gap-1.5">
              <span class="subtle">core_user_ref</span>
              <input v-model="coreUserRef" class="input" required />
            </label>

            <label class="grid gap-1.5">
              <span class="subtle">core_username (opcional)</span>
              <input v-model="coreUsername" class="input" />
            </label>

            <label class="grid gap-1.5">
              <span class="subtle">core_email (opcional)</span>
              <input v-model="coreEmail" class="input" type="email" />
            </label>

            <div class="ui-form-actions">
              <button class="btn btn-primary" type="submit" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar vinculo' }}
              </button>
              <button class="btn" type="button" :disabled="saving" @click="removeCoreLink">
                Desvincular
              </button>
            </div>
          </form>
        </template>
      </section>
    </div>
  </div>
</template>
