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
  monthly: string | null;
  capital: string | null;
  capitalValue: number | null;
  state: string;
  positionPct: number | null;
  beyondTarget: boolean;
  reached: boolean;
};

// Estado de un hito en una sola celda: cubierto, cuánto falta, o que su capital
// queda por encima del objetivo del plan (el tramo existe, pero no lo persigues).
function milestoneState(capitalNeeded: number | null, reached: boolean, beyond: boolean): string {
  if (reached) return 'Cubierto';
  if (beyond) return 'Por encima del objetivo';
  if (capitalNeeded == null) return '—';
  const gap = capitalNeeded - Number(productiveCapital.value || 0);
  return gap > 0 ? `Faltan ${formatMoney(gap)}` : 'Cubierto';
}

const budgetMilestones = computed<ProgressMilestone[]>(() =>
  mergeTierCapitals({
    tiers: tiers.value,
    requirements: requirements.value ?? [],
    productiveCapital: Number(productiveCapital.value || 0),
    targetCapital: Number(targetCapital.value || 0),
  }).map((milestone) => {
    const beyondTarget = milestone.positionPct != null && milestone.positionPct > 100;
    return {
      label: milestone.label,
      monthly: formatMoney(milestone.monthlyExpense),
      capital: formatMoney(milestone.capitalNeeded),
      capitalValue: milestone.capitalNeeded,
      state: milestoneState(milestone.capitalNeeded, milestone.reached, beyondTarget),
      positionPct: milestone.positionPct,
      beyondTarget,
      reached: milestone.reached,
    };
  }),
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
    const reached = target > 0 && capital >= target * row.ratio;
    return {
      label: row.label,
      monthly: income != null ? formatMoney(income) : null,
      capital: amount != null ? formatMoney(amount) : null,
      capitalValue: amount,
      state: milestoneState(amount, reached, false),
      positionPct: row.ratio * 100,
      beyondTarget: false,
      reached,
    };
  });
});

const usingBudgetMilestones = computed(() => budgetMilestones.value.length > 0);
const milestones = computed(() =>
  usingBudgetMilestones.value ? budgetMilestones.value : fallbackMilestones.value,
);

// La barra no termina en el objetivo, sino en el capital que cubriría el nivel de
// vida completo de hoy (el tramo más alto). Así el objetivo —que suele ser vivir con
// menos— cae donde le toca, hacia la mitad, y se ve cuánto de lo de hoy renuncias.
const scaleMax = computed(() => {
  const target = Number(targetCapital.value || 0);
  const capitals = milestones.value
    .map((milestone) => milestone.capitalValue)
    .filter((value): value is number => value != null && value > 0);
  return Math.max(target, ...capitals, 0);
});
const hasWiderScale = computed(() => scaleMax.value > Number(targetCapital.value || 0));

const scalePct = (value: number | null): number | null => {
  if (value == null || scaleMax.value <= 0) return null;
  return Math.max(0, Math.min(100, (value / scaleMax.value) * 100));
};
const barPct = computed(() => scalePct(Number(productiveCapital.value || 0)) ?? 0);
const targetPct = computed(() => scalePct(Number(targetCapital.value || 0)));
// Sin margen la etiqueta del objetivo se saldría de la caja cuando cae en un extremo.
const targetLabelLeft = computed(() => `${Math.max(8, Math.min(92, targetPct.value ?? 100))}%`);

function markerLeft(milestone: ProgressMilestone): string {
  return `${scalePct(milestone.capitalValue) ?? Math.min(milestone.positionPct ?? 100, 100)}%`;
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
    <!-- Mismo chrome que "Tu situación este año": eyebrow + acción, el dato grande
         alineado con el título, y el desglose en la tabla compartida de capas. -->
    <div class="plan-block-head">
      <p class="plan-block-eyebrow">Capital productivo</p>
      <!-- La clasificación vive junto al dato que altera: qué cuenta como productivo. -->
      <RouterLink class="plan-blocker-link" to="/plan/activos">Clasificar activos</RouterLink>
    </div>

    <div class="plan-progress-headline">
      <div class="plan-progress-headline-copy">
        <h2 class="sect-title">Progreso hacia el capital requerido</h2>
        <p class="sect-sub">
          El porcentaje mide tu capital frente al objetivo del escenario activo<template
            v-if="preservationAmount"
            >, que incluye {{ formatMoney(preservationAmount) }} a preservar</template
          >.<template v-if="hasWiderScale">
            La barra llega hasta el capital que cubriría tu nivel de vida completo de hoy.</template
          >
        </p>
      </div>
      <strong class="plan-progress-percent mono">{{ formatNumber(progress, 0) }} %</strong>
    </div>

    <div class="plan-progress-track" :class="{ 'has-target-mark': hasWiderScale }">
      <progress
        class="plan-progress-native"
        :value="barPct"
        max="100"
        :aria-label="`Capital productivo sobre ${formatMoney(scaleMax)}`"
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
      <template v-if="hasWiderScale && targetPct != null">
        <span
          class="plan-progress-target"
          :style="{ left: `${targetPct}%` }"
          :title="`Objetivo ${formatMoney(targetCapital)}`"
          aria-hidden="true"
        ></span>
        <span class="plan-progress-target-label" :style="{ left: targetLabelLeft }">
          Objetivo · <span class="mono">{{ formatMoney(targetCapital) }}</span>
        </span>
      </template>
    </div>

    <dl class="plan-progress-meta">
      <div class="plan-progress-meta-item">
        <dt>Productivo hoy</dt>
        <dd class="mono">{{ formatMoney(productiveCapital) }}</dd>
      </div>
      <div class="plan-progress-meta-item is-end">
        <dt>{{ hasWiderScale ? 'Tu nivel de vida de hoy' : 'Requerido' }}</dt>
        <dd class="mono">{{ formatMoney(hasWiderScale ? scaleMax : targetCapital) }}</dd>
        <dd v-if="!hasWiderScale && preservationAmount" class="plan-progress-meta-note">
          incluye {{ formatMoney(preservationAmount) }} a preservar
        </dd>
      </div>
    </dl>

    <div class="plan-milestones-head">
      <span>{{ usingBudgetMilestones ? 'Qué cubre ya tu capital' : 'Hitos del camino' }}</span>
      <AInfoHint :label="milestonesHint" />
    </div>
    <div class="plan-tier-table plan-table-scroll">
      <table>
        <thead>
          <tr>
            <th>{{ usingBudgetMilestones ? 'Nivel de vida' : 'Hito' }}</th>
            <th class="num">{{ usingBudgetMilestones ? 'Gasto mensual' : 'Renta mensual' }}</th>
            <th class="num">Capital necesario</th>
            <th class="num">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="milestone in milestones"
            :key="milestone.label"
            :class="{ 'is-reached': milestone.reached }"
          >
            <td class="plan-milestone-name">
              <span
                class="plan-milestone-mark"
                :class="{ reached: milestone.reached }"
                aria-hidden="true"
              ></span>
              {{ milestone.label }}
            </td>
            <td class="num mono">{{ milestone.monthly ?? '—' }}</td>
            <td class="num mono">{{ milestone.capital ?? '—' }}</td>
            <td class="num plan-milestone-state">{{ milestone.state }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
