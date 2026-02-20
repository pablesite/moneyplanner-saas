<script setup lang="ts">
import { useSaasAdminUsersPage } from '@/domains/auth';

const {
  loading,
  saving,
  error,
  success,
  users,
  createUsername,
  createPassword,
  createEmail,
  createRole,
  createIsActive,
  createUser,
  updateRole,
  toggleStatus,
  goBack,
  reload,
} = useSaasAdminUsersPage();

function onRoleSelect(userId: number, event: Event) {
  const target = event.target as HTMLSelectElement | null;
  const value = target?.value;
  if (value === 'saas_admin' || value === 'saas_member') {
    updateRole(userId, value);
  }
}
</script>

<template>
  <div class="container ui-pro-page">
    <div class="ui-page-header">
      <h1 class="h1 ui-page-title">Administracion SaaS</h1>

      <div class="ui-page-actions">
        <button class="btn" type="button" :disabled="saving" @click="reload">Recargar</button>
        <button class="btn" type="button" @click="goBack">Volver a Cuenta SaaS</button>
      </div>
    </div>

    <div v-if="error" class="alert mt-3">
      {{ error }}
    </div>

    <div v-if="success" class="ui-alert-success mt-3">
      {{ success }}
    </div>

    <div v-if="loading" class="ui-status-line mt-3">Cargando usuarios...</div>

    <div v-else class="grid gap-3.5">
      <section class="card ui-pro-panel">
        <h2 class="mt-0 text-base">Alta de usuario SaaS</h2>

        <form class="grid gap-2.5 md:max-w-xl" @submit.prevent="createUser">
          <label class="grid gap-1.5">
            <span class="subtle">Username</span>
            <input v-model="createUsername" class="input" required />
          </label>

          <label class="grid gap-1.5">
            <span class="subtle">Email</span>
            <input v-model="createEmail" class="input" type="email" />
          </label>

          <label class="grid gap-1.5">
            <span class="subtle">Password</span>
            <input v-model="createPassword" class="input" type="password" required minlength="8" />
          </label>

          <label class="grid gap-1.5">
            <span class="subtle">Rol</span>
            <select v-model="createRole" class="select">
              <option value="saas_member">saas_member</option>
              <option value="saas_admin">saas_admin</option>
            </select>
          </label>

          <label class="inline-flex items-center gap-2">
            <input v-model="createIsActive" type="checkbox" />
            <span>Usuario activo</span>
          </label>

          <div class="ui-form-actions">
            <button class="btn btn-primary" type="submit" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Crear usuario' }}
            </button>
          </div>
        </form>
      </section>

      <section class="card ui-pro-panel">
        <h2 class="mt-0 text-base">Usuarios SaaS</h2>

        <div class="overflow-x-auto">
          <table class="ui-data-table">
            <thead>
              <tr class="text-left">
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email || 'sin email' }}</td>
                <td>
                  <select
                    class="select"
                    :value="user.role"
                    :disabled="saving"
                    @change="onRoleSelect(user.id, $event)"
                  >
                    <option value="saas_member">saas_member</option>
                    <option value="saas_admin">saas_admin</option>
                  </select>
                </td>
                <td>
                  <span v-if="user.is_active">activo</span>
                  <span v-else>inactivo</span>
                </td>
                <td class="ui-data-table-actions">
                  <button
                    class="btn btn-sm"
                    type="button"
                    :disabled="saving"
                    @click="toggleStatus(user)"
                  >
                    {{ user.is_active ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
