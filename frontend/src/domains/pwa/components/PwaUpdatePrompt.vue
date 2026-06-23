<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { AButton } from '@/domains/ui';

// `registerType: 'prompt'`: avisamos de la versión nueva y dejamos que el usuario
// recargue (no autorecarga → no se pierde estado de formularios a mitad de edición).
const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW();

const reload = () => {
  void updateServiceWorker(true);
};

const dismiss = () => {
  needRefresh.value = false;
  offlineReady.value = false;
};
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
      v-if="needRefresh || offlineReady"
      class="dir-a fixed inset-x-0 bottom-4 z-[90] mx-auto flex w-[min(92vw,460px)] items-center gap-3 rounded-xl border border-[var(--line-strong)] bg-[var(--bg)]/95 px-4 py-3 text-sm text-[var(--text)] shadow-2xl backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <span
        class="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)]"
        aria-hidden="true"
      />
      <span class="flex-1">
        {{
          needRefresh
            ? 'Hay una versión nueva disponible.'
            : 'La aplicación está lista para usarse sin conexión.'
        }}
      </span>
      <AButton v-if="needRefresh" variant="primary" size="sm" @click="reload"> Actualizar </AButton>
      <AButton variant="ghost" size="sm" @click="dismiss">
        {{ needRefresh ? 'Después' : 'Entendido' }}
      </AButton>
    </div>
  </Transition>
</template>
