<script setup lang="ts">
import { useLoginForm } from '@/domains/auth';
import { AButton } from '@/domains/ui';

const { username, password, error, loading, sessionNotice, login } = useLoginForm();
</script>

<template>
  <div class="ui-auth-page">
    <div class="ui-auth-shell">
      <div class="ui-auth-card">
        <h1 class="ui-auth-title">Acceso</h1>
        <div class="ui-auth-subtitle">Gestiona tu patrimonio familiar con claridad.</div>

        <div v-if="sessionNotice" class="ui-status-line ui-auth-alert">
          {{ sessionNotice }}
        </div>

        <div v-if="error" class="alert ui-auth-alert">
          {{ error }}
        </div>

        <form class="ui-auth-form" @submit.prevent="login">
          <label class="ui-auth-field">
            <span class="ui-auth-label">Usuario</span>
            <input v-model="username" autocomplete="username" class="input" />
          </label>

          <label class="ui-auth-field">
            <span class="ui-auth-label">Contraseña</span>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="input"
            />
          </label>

          <AButton variant="primary" type="submit" :disabled="loading" class="ui-auth-submit">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </AButton>
        </form>
      </div>
    </div>
  </div>
</template>
