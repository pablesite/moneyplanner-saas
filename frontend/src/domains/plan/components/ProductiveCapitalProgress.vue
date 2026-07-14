<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { AInfoHint } from '@/domains/ui';
import { formatMoney, formatNumber, formatPct } from '@/lib/format';
import type { ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{ projection: ProjectionResponse }>();

const progress = computed(() =>
  Math.max(0, Math.min(100, Number(props.projection.summary.progress_percent.value ?? 0))),
);
const productiveCapital = computed(() => props.projection.summary.productive_capital.value);
const targetCapital = computed(() => props.projection.summary.target_capital.value);

// La renta sostenible de Core es exactamente capital × tasa de retirada / 12:
// con la misma fórmula, cada hito puede decir qué renta mensual sostiene.
const withdrawalRate = computed(() => Number(props.projection.assumptions?.withdrawal_rate ?? 0));

const milestones = computed(() => {
  const target = Number(targetCapital.value || 0);
  const capital = Number(productiveCapital.value || 0);
  // Cuartos del capital requerido: marcas de regla sin pretensión semántica.
  // Los antiguos nombres ("Base flexible", "Vida completa") sugerían cálculos
  // que no existían; el significado real de cada marca es la renta que da.
  const rows = [
    { label: '1/4 del objetivo', ratio: 0.25 },
    { label: 'Mitad del objetivo', ratio: 0.5 },
    { label: '3/4 del objetivo', ratio: 0.75 },
    { label: 'Objetivo completo', ratio: 1 },
  ];
  return rows.map((row) => {
    const amount = target > 0 ? target * row.ratio : null;
    return {
      ...row,
      pct: Math.round(row.ratio * 100),
      amount,
      monthlyIncome:
        amount != null && withdrawalRate.value > 0 ? (amount * withdrawalRate.value) / 12 : null,
      reached: target > 0 && capital >= target * row.ratio,
      markerClass: `m-${Math.round(row.ratio * 100)}`,
    };
  });
});

const milestonesHint = computed(() => {
  const base = 'Marcas a cuartos del capital requerido, como referencia de avance.';
  if (withdrawalRate.value <= 0) return base;
  return `${base} La renta de cada hito aplica tu tasa de retirada del escenario activo (${formatPct(withdrawalRate.value, 1)}), la misma fórmula que la renta sostenible.`;
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
      <AInfoHint :label="milestonesHint" />
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
          <small v-if="milestone.amount != null">
            {{ formatMoney(milestone.amount) }}
            <template v-if="milestone.monthlyIncome != null">
              · renta de {{ formatMoney(milestone.monthlyIncome) }}/mes</template
            >
          </small>
          <small v-else>{{ milestone.pct }} % del capital requerido</small>
        </div>
      </li>
    </ol>
  </section>
</template>
