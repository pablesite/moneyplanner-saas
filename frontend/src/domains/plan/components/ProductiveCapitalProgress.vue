<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { AInfoHint } from '@/domains/ui';
import { useAnnualExpenseStore } from '@/domains/budget/annual-entries';
import { planApi } from '@/domains/plan/api';
import { budgetExpenseTiers, mergeTierCapitals } from '@/domains/plan/budgetMilestones';
import { formatMoney, formatNumber, formatPct } from '@/lib/format';
import type { CapitalRequirementsResponse, ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{ projection: ProjectionResponse }>();

const progress = computed(() =>
  Math.max(0, Math.min(100, Number(props.projection.summary.progress_percent.value ?? 0))),
);
const productiveCapital = computed(() => props.projection.summary.productive_capital.value);
const targetCapital = computed(() => props.projection.summary.target_capital.value);

const withdrawalRate = computed(() => Number(props.projection.assumptions?.withdrawal_rate ?? 0));

// Parte del capital requerido que es patrimonio a preservar (no financia la renta).
const preservationAmount = computed(() => {
  const amount = Number(props.projection.summary.preservation_target_eur?.value ?? 0);
  return amount > 0 ? amount : null;
});

// Hitos anclados al presupuesto real: se cargan las partidas del año en curso
// y los tramos se recalculan cada vez que el presupuesto cambia.
const expenseStore = useAnnualExpenseStore();
const fiscalYear = new Date().getFullYear();
onMounted(() => void expenseStore.loadAll(fiscalYear));

const tiers = computed(() => budgetExpenseTiers(expenseStore.entries.value, fiscalYear));

// El capital de cada tramo lo calcula Core con la misma matemática que el
// capital objetivo (pensiones, periodo puente, inflación): hitos y barra
// comparten eje. La perpetuidad local (gasto/tasa) sobreestimaba siempre.
const requirements = ref<CapitalRequirementsResponse['requirements'] | null>(null);
const requestKey = computed(
  () =>
    `${tiers.value.map((tier) => tier.monthlyExpense.toFixed(2)).join(',')}|${props.projection.scenario}`,
);

watch(
  requestKey,
  async () => {
    requirements.value = null;
    if (!tiers.value.length) return;
    const requested = requestKey.value;
    try {
      const { data } = await planApi.getCapitalRequirements(
        tiers.value.map((tier) => tier.monthlyExpense),
        props.projection.scenario,
      );
      // Si presupuesto o hipótesis cambiaron mientras respondía, esta respuesta ya no vale.
      if (requestKey.value !== requested) return;
      requirements.value = data.requirements;
    } catch {
      // Sin capitales de Core se cae al fallback de cuartos: referencia antes que error.
      if (requestKey.value === requested) requirements.value = null;
    }
  },
  { immediate: true },
);

type ProgressMilestone = {
  label: string;
  detail: string;
  positionPct: number | null;
  beyondTarget: boolean;
  reached: boolean;
};

const budgetMilestones = computed<ProgressMilestone[]>(() =>
  mergeTierCapitals({
    tiers: tiers.value,
    requirements: requirements.value ?? [],
    productiveCapital: Number(productiveCapital.value || 0),
    targetCapital: Number(targetCapital.value || 0),
  }).map((milestone) => ({
    label: milestone.label,
    detail: `${formatMoney(milestone.monthlyExpense)}/mes · necesita ${formatMoney(milestone.capitalNeeded)}`,
    positionPct: milestone.positionPct,
    beyondTarget: milestone.positionPct != null && milestone.positionPct > 100,
    reached: milestone.reached,
  })),
);

// Sin presupuesto que ancle los tramos, los cuartos del objetivo siguen dando
// una referencia de avance honesta (marcas de regla, sin pretensión semántica).
const fallbackMilestones = computed<ProgressMilestone[]>(() => {
  const target = Number(targetCapital.value || 0);
  const capital = Number(productiveCapital.value || 0);
  const rows = [
    { label: '1/4 del objetivo', ratio: 0.25 },
    { label: 'Mitad del objetivo', ratio: 0.5 },
    { label: '3/4 del objetivo', ratio: 0.75 },
    { label: 'Objetivo completo', ratio: 1 },
  ];
  return rows.map((row) => {
    const amount = target > 0 ? target * row.ratio : null;
    const income =
      amount != null && withdrawalRate.value > 0 ? (amount * withdrawalRate.value) / 12 : null;
    return {
      label: row.label,
      detail:
        amount != null
          ? `${formatMoney(amount)}${income != null ? ` · renta de ${formatMoney(income)}/mes` : ''}`
          : `${Math.round(row.ratio * 100)} % del capital requerido`,
      positionPct: row.ratio * 100,
      beyondTarget: false,
      reached: target > 0 && capital >= target * row.ratio,
    };
  });
});

const usingBudgetMilestones = computed(() => budgetMilestones.value.length > 0);
const milestones = computed(() =>
  usingBudgetMilestones.value ? budgetMilestones.value : fallbackMilestones.value,
);

function markerLeft(milestone: ProgressMilestone): string {
  return `${Math.min(milestone.positionPct ?? 100, 100)}%`;
}

const milestonesHint = computed(() => {
  const rate = withdrawalRate.value > 0 ? formatPct(withdrawalRate.value, 1) : null;
  if (usingBudgetMilestones.value) {
    return 'Tramos acumulados de tu presupuesto de gastos recurrentes del año en curso: si el presupuesto cambia, los hitos cambian. El capital de cada tramo se calcula igual que tu capital objetivo (inflación, pensiones y periodo puente incluidos), así que es comparable con la barra.';
  }
  const base =
    'Marcas a cuartos del capital requerido, como referencia de avance. Se anclarán a tus gastos reales cuando tengas presupuesto cargado.';
  if (!rate) return base;
  return `${base} La renta de cada hito aplica tu tasa de retirada del escenario activo (${rate}).`;
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
        :class="{ reached: milestone.reached, beyond: milestone.beyondTarget }"
        :style="{ left: markerLeft(milestone) }"
        :title="milestone.label"
        aria-hidden="true"
      ></span>
    </div>

    <div class="plan-progress-meta">
      <span>{{ formatMoney(productiveCapital) }} productivos</span>
      <span>
        {{ formatMoney(targetCapital) }} requeridos<template v-if="preservationAmount">
          · incluye {{ formatMoney(preservationAmount) }} a preservar</template
        >
      </span>
    </div>

    <div class="plan-milestones-head">
      <span>{{ usingBudgetMilestones ? 'Qué cubre ya tu capital' : 'Hitos del camino' }}</span>
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
          <small>
            {{ milestone.detail
            }}<template v-if="milestone.beyondTarget"> · por encima de tu objetivo</template>
          </small>
        </div>
      </li>
    </ol>
  </section>
</template>
