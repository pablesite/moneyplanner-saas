<script setup lang="ts">
import { computed } from 'vue';
import type { ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{ projection: ProjectionResponse }>();

const levelLabel: Record<string, string> = {
  initial: 'Inicial',
  medium: 'Media',
  high: 'Alta',
  needs_review: 'Necesita revisión',
};

const factorLabels: Record<string, string> = {
  assets: 'Patrimonio registrado',
  liabilities_reviewed: 'Deudas revisadas',
  budget: 'Presupuesto anual',
  accounting_history: 'Histórico contable',
  pensions: 'Pensiones configuradas',
  contributions: 'Aportaciones planificadas',
  fresh_data: 'Datos actualizados',
};

const missingFactors = computed(() =>
  Object.entries(props.projection.quality_factors)
    .filter(([, ok]) => !ok)
    .map(([key]) => factorLabels[key] ?? key),
);
</script>

<template>
  <section class="sect plan-quality">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Calidad de datos</p>
        <h2 class="sect-title">
          {{ levelLabel[projection.quality_level] ?? projection.quality_level }}
        </h2>
        <p class="sect-sub">
          La proyección ya puede apoyarse en los datos clave. Mantenerlos al día mejora la lectura.
        </p>
      </div>
    </div>

    <ul class="plan-quality-list">
      <li v-for="(ok, key) in projection.quality_factors" :key="key" :class="{ ok }">
        <span></span>
        {{ factorLabels[String(key)] ?? key }}
      </li>
    </ul>

    <p v-if="missingFactors.length" class="plan-quality-next">
      Próximo dato útil: {{ missingFactors[0] }}.
    </p>
  </section>
</template>
