<script setup lang="ts">
import { useOnlineStatus } from '@/domains/pwa/useOnlineStatus';

// Indicador "sin conexión" global: aparece cuando el navegador pierde la red y
// desaparece al recuperarla. No bloquea acciones (el flag es indicativo); solo
// avisa de que los datos en vivo pueden no estar disponibles. El shell ya navega
// offline gracias al precache del SW (Fase 1); aquí damos el feedback explícito.
const { online } = useOnlineStatus();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="!online"
      class="dir-a fixed inset-x-0 bottom-4 z-[95] mx-auto flex w-[min(92vw,460px)] items-center gap-2.5 rounded-xl border border-[var(--line-strong)] bg-[var(--bg)]/95 px-4 py-2.5 text-sm text-[var(--muted)] shadow-2xl backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <span
        class="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--faint)]"
        aria-hidden="true"
      />
      <span>Sin conexión. Algunos datos pueden no estar disponibles hasta que vuelva la red.</span>
    </div>
  </Transition>
</template>
