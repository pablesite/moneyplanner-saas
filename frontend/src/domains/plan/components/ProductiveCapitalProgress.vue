<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { AInfoHint } from '@/domains/ui';
import { formatMoney, formatNumber } from '@/lib/format';
import type { ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{ projection: ProjectionResponse }>();

const progress = computed(() =>
  Math.max(0, Math.min(100, Number(props.projection.summary.progress_percent.value ?? 0))),
);
const productiveCapital = computed(() => props.projection.summary.productive_capital.value);
const targetCapital = computed(() => props.projection.summary.target_capital.value);

const milestones = computed(() => {
  const target = Number(targetCapital.value || 0);
  const capital = Number(productiveCapital.value || 0);
  const rows = [
    { label: 'Base flexible', ratio: 0.25 },
    { label: 'Gastos esenciales', ratio: 0.5 },
    { label: 'Vida completa', ratio: 0.75 },
    { label: 'Objetivo completo', ratio: 1 },
  ];
  // Cada hito lleva su % y su importe: sin eso, los puntos de la barra y las
  // etiquetas de la leyenda eran dos listas sin relación visible entre sí.
  return rows.map((row) => ({
    ...row,
    pct: Math.round(row.ratio * 100),
    amount: target > 0 ? target * row.ratio : null,
    reached: target > 0 && capital >= target * row.ratio,
    markerClass: `m-${Math.round(row.ratio * 100)}`,
  }));
});
</script>

<template>
  <section class="sect plan-progress">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Capital productivo</p>
        <h2 class="sect-title">Progreso hacia el capital requerido</h2>
        <p class="sect-sub">
          Denominador: capital objetivo del escenario activo, incluyendo periodo puente si aplica.
        </p>
      </div>
      <div class="plan-progress-head-side">
        <strong class="plan-progress-percent mono">{{ formatNumber(progress, 0) }}%</strong>
        <!-- La clasificación vive junto al dato que altera: qué cuenta como productivo. -->
        <RouterLink class="btn btn-ghost btn-sm" to="/plan/activos">Clasificar activos</RouterLink>
      </div>
    </div>

    <div class="plan-progress-track">
      <progress
        class="plan-progress-native"
        :value="progress"
        max="100"
        aria-label="Progreso de capital productivo"
      ></progress>
      <span
        v-for="milestone in milestones"
        :key="milestone.label"
        class="plan-progress-mark"
        :class="[{ reached: milestone.reached }, milestone.markerClass]"
        :title="`${milestone.label} · ${milestone.pct} %`"
        aria-hidden="true"
      ></span>
    </div>

    <div class="plan-progress-meta">
      <span>{{ formatMoney(productiveCapital) }} productivos</span>
      <span>{{ formatMoney(targetCapital) }} requeridos</span>
    </div>

    <div class="plan-milestones-head">
      <span>Hitos del camino</span>
      <AInfoHint
        label="Cortes orientativos al 25, 50, 75 y 100 % del capital requerido. Los nombres son referencias de avance, no cálculos: el único hito con significado exacto es el 100 %."
      />
    </div>
    <ol class="plan-milestones">
      <li
        v-for="milestone in milestones"
        :key="milestone.label"
        :class="{ reached: milestone.reached }"
      >
        <span></span>
        <div class="plan-milestone-copy">
          <strong>{{ milestone.label }}</strong>
          <small>
            {{ milestone.pct }} %
            <template v-if="milestone.amount != null">
              · {{ formatMoney(milestone.amount) }}</template
            >
          </small>
        </div>
      </li>
    </ol>
  </section>
</template>
