<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function go(name: string): void {
  if (route.name !== name) void router.push({ name });
}
</script>

<template>
  <nav class="a-mov-tabs-bar" aria-label="Secciones de contabilidad">
    <div class="tabs">
      <button
        class="tab"
        type="button"
        :class="{ on: route.name === 'accounting-movements' }"
        @click="go('accounting-movements')"
      >
        Movimientos
      </button>
      <button
        class="tab"
        type="button"
        :class="{ on: route.name === 'accounting-accounts' }"
        @click="go('accounting-accounts')"
      >
        Cuentas
      </button>
    </div>
  </nav>
</template>
