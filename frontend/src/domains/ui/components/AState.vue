<script setup lang="ts">
// Bloque de estado Direction A: loading / empty / error / success.
// Dos layouts: `inline` (texto muted dentro de tablas/secciones) y `panel`
// (caja centrada con borde para áreas de gráfico). El contenido va por slot.
// Unifica los antiguos `a-nw-state` / `a-mov-state` (panel) y `bdg-loading` /
// `mc-loading` (inline), que estaban duplicados por dominio.
withDefaults(
  defineProps<{
    status?: 'neutral' | 'loading' | 'empty' | 'error' | 'success';
    layout?: 'inline' | 'panel';
  }>(),
  { status: 'neutral', layout: 'panel' },
);
</script>

<template>
  <div
    class="a-state"
    :class="[`a-state-${layout}`, `a-state-${status}`]"
    :aria-busy="status === 'loading' ? 'true' : undefined"
    :aria-live="status === 'loading' || status === 'error' ? 'polite' : undefined"
  >
    <slot />
  </div>
</template>
