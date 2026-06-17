<script setup lang="ts">
// Marcador de ayuda Direction A: icono "i" con tooltip elegante al pasar el
// ratón o enfocar. El contenido va en el slot por defecto.
defineProps<{ label?: string }>();
</script>

<template>
  <span class="info-hint" tabindex="0" role="note" :aria-label="label">
    <svg class="info-hint-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" stroke-width="1.1" />
      <rect x="7.3" y="6.8" width="1.4" height="4.6" rx="0.7" fill="currentColor" />
      <circle cx="8" cy="4.6" r="0.85" fill="currentColor" />
    </svg>
    <span class="info-hint-tip" role="tooltip"><slot /></span>
  </span>
</template>
