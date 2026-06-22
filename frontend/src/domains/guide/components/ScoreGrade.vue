<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';

// Nota A–E derivada de la puntuación. Dos tratamientos visuales:
// - `badge`: caja con borde (.guide-grade), para strips y resúmenes.
// - `label`: solo el texto de la nota (.guide-grade-label), para medidores
//   y columnas de puntuación; `large` la agranda.
const props = withDefaults(
  defineProps<{ score: number; variant?: 'badge' | 'label'; large?: boolean }>(),
  { variant: 'badge', large: false },
);

const grade = computed(() => gradeFromScore(props.score));
</script>

<template>
  <span
    :class="[
      variant === 'badge' ? 'guide-grade' : 'guide-grade-label',
      `grade-${grade.toLowerCase()}`,
      { 'is-large': variant === 'label' && large },
    ]"
    >{{ grade }}</span
  >
</template>
