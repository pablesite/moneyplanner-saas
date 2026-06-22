<script setup lang="ts">
// Bloque de figura de hero Direction A: eyebrow + cifra grande + delta inline.
// Es el núcleo reutilizable común a los heroes (Presupuesto, Cierre, Contabilidad,
// Patrimonio). El grid exterior y el contenido lateral (year-strip, donut, KPIs)
// los aporta cada vista mediante sus propios contenedores y el slot por defecto.
defineProps<{
  eyebrow?: string;
  value?: string;
}>();
</script>

<template>
  <div class="a-hero-figure">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <slot name="value">
      <div v-if="value" class="hero-value mono">{{ value }}</div>
    </slot>
    <div v-if="$slots.delta" class="hero-delta"><slot name="delta" /></div>
    <slot />
  </div>
</template>
