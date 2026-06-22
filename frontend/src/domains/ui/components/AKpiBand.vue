<script setup lang="ts">
// Banda de KPIs Direction A: rejilla de celdas label / value / meta.
// Sustituye las ~6 reimplementaciones inline de `.kpis`/`.kpi` en heroes y secciones.
// Casos simples: pasar `items` con `meta` string.
// Casos con meta rica (deltas coloreados): usar el slot `meta-<índice>`.
// `cellClass` aplica una clase al wrapper `.kpi` (p. ej. coloreado de desviación).
export interface AKpiItem {
  label: string;
  value: string;
  meta?: string;
  cellClass?: string | Record<string, boolean>;
}

defineProps<{ items?: AKpiItem[] }>();
</script>

<template>
  <div class="kpis">
    <div v-for="(kpi, i) in items ?? []" :key="i" class="kpi" :class="kpi.cellClass">
      <p class="kpi-label">{{ kpi.label }}</p>
      <div class="kpi-value mono">{{ kpi.value }}</div>
      <div v-if="$slots[`meta-${i}`] || kpi.meta" class="kpi-meta">
        <slot :name="`meta-${i}`">{{ kpi.meta }}</slot>
      </div>
    </div>
    <slot />
  </div>
</template>
