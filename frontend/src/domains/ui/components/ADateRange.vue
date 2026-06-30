<script setup lang="ts">
// Par de inputs de fecha "Desde / Hasta" para rangos personalizados.
// Presentacional: el padre mantiene el estado y la lógica de rango; este
// componente solo unifica el fragmento visual (antes duplicado en el popover
// de filtros de movimientos y en el control de evolución de patrimonio).
defineProps<{ from: string; to: string }>();
defineEmits<{ (e: 'update:from', value: string): void; (e: 'update:to', value: string): void }>();
</script>

<template>
  <label>
    <span>Desde</span>
    <input
      class="filter-ctrl"
      type="date"
      :value="from"
      @input="$emit('update:from', ($event.target as HTMLInputElement).value)"
    />
  </label>
  <label>
    <span>Hasta</span>
    <input
      class="filter-ctrl"
      type="date"
      :value="to"
      @input="$emit('update:to', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
