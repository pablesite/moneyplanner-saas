<script setup lang="ts">
import { computed, ref } from 'vue';
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

const factorCount = computed(() => Object.keys(props.projection.quality_factors).length);
const allOk = computed(() => missingFactors.value.length === 0);
const expanded = ref(false);
const showList = computed(() => !allOk.value || expanded.value);
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
          {{
            allOk
              ? `Los ${factorCount} factores clave están al día.`
              : 'La proyección ya puede apoyarse en los datos clave. Mantenerlos al día mejora la lectura.'
          }}
        </p>
      </div>
    </div>

    <ul v-if="showList" class="plan-quality-list">
      <li v-for="(ok, key) in projection.quality_factors" :key="key" :class="{ ok }">
        <span></span>
        {{ factorLabels[String(key)] ?? key }}
      </li>
    </ul>

    <button v-if="allOk" class="plan-details-toggle" type="button" @click="expanded = !expanded">
      {{ expanded ? 'Ocultar factores' : 'Ver factores' }}
    </button>

    <p v-if="missingFactors.length" class="plan-quality-next">
      Próximo dato útil: {{ missingFactors[0] }}.
    </p>
  </section>
</template>
