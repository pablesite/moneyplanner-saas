<script setup lang="ts">
import { computed } from 'vue';
import { AInfoHint } from '@/domains/ui';
import type { PlanMember, ProjectionResponse } from '@/domains/plan/types';
import { yearWithAges } from '@/domains/plan/age';

const props = defineProps<{ projection: ProjectionResponse; members: PlanMember[] }>();

const projectedYear = computed(() => props.projection.summary.projected_year.value);
const targetYear = computed(() => props.projection.summary.target_year.value);
const difference = computed(() =>
  projectedYear.value == null ? null : Number(projectedYear.value) - Number(targetYear.value),
);
const targetCopy = computed(() => yearWithAges(targetYear.value, props.members));
const projectedCopy = computed(() => yearWithAges(projectedYear.value, props.members));
const statusCopy = computed(() => {
  if (difference.value == null) return 'Todavía no hay una fecha sostenible estimada.';
  if (difference.value === 0) return 'La proyección llega en el año objetivo.';
  if (difference.value > 0) return `La proyección queda ${difference.value} años por detrás.`;
  return `La proyección va ${Math.abs(difference.value)} años por delante.`;
});
</script>

<template>
  <article class="plan-date-card">
    <div>
      <p class="eyebrow">Fecha objetivo</p>
      <h3>{{ targetCopy }}</h3>
    </div>
    <div>
      <p class="eyebrow">Fecha estimada</p>
      <h3>{{ projectedCopy }}</h3>
    </div>
    <p>
      {{ statusCopy }}
      <AInfoHint
        label="La fecha estimada exige capital suficiente y sostenibilidad hasta el final del horizonte."
      />
    </p>
  </article>
</template>
