<script setup lang="ts">
// Indicador de colapso compartido: ▾ cuando está expandido, ▸ cuando está
// plegado. Decorativo (aria-hidden); el estado accesible (aria-expanded) lo
// pone el control contenedor (botón/fila).
defineProps<{ expanded: boolean }>();
</script>

<template>
  <span class="ui-chevron" aria-hidden="true">{{ expanded ? '▾' : '▸' }}</span>
</template>
