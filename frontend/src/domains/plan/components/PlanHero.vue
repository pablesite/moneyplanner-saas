<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { AHero, AKpiBand, AInfoHint, type AKpiItem } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import type { FinancialPlan, PlanFoundations, ProjectionResponse } from '@/domains/plan/types';
import { projectionScenarioLabel } from '@/domains/plan/scenarioTemplates';

const props = defineProps<{
  plan: FinancialPlan;
  projection: ProjectionResponse;
  foundations?: PlanFoundations | null;
}>();

const summary = computed(() => props.projection.summary);
const projectedYear = computed(() => summary.value.projected_year.value);
const targetYear = computed(() => summary.value.target_year.value);
const gap = computed(() =>
  projectedYear.value == null ? null : Number(projectedYear.value) - Number(targetYear.value),
);

const targetCopy = computed(
  () => `${formatMoney(props.plan.target_monthly_income_today_eur)} / mes`,
);
const productiveCapital = computed(() => Number(summary.value.productive_capital.value ?? 0));
const projectedCopy = computed(() =>
  projectedYear.value == null ? 'Sin fecha estimada' : String(projectedYear.value),
);
type Blocker = { text: string; to: string; cta: string };

const specificBlockers = computed<Blocker[]>(() => {
  if (gap.value != null) return [];
  const items: Blocker[] = [];
  const unknownCapital = Number(props.projection.classification?.unknown_capital ?? 0);
  const monthlyContribution = Number(props.foundations?.planned_contribution.monthly_amount ?? 0);
  const committedSurplus = Number(props.foundations?.cash_flow.committed_surplus ?? 0);
  if (productiveCapital.value <= 0) {
    items.push({
      text: 'No hay capital clasificado como productivo: la proyección no tiene base desde la que crecer.',
      to: '/plan/activos',
      cta: 'Clasificar activos',
    });
  }
  if (unknownCapital > 0) {
    items.push({
      text: `Hay ${formatMoney(unknownCapital)} en activos sin clasificar que no cuentan como capital productivo.`,
      to: '/plan/activos',
      cta: 'Clasificar activos',
    });
  }
  if (props.foundations && monthlyContribution <= 0) {
    items.push({
      text: 'No hay aportación mensual planificada hacia capital productivo.',
      to: '/presupuesto',
      cta: 'Planificar aportación',
    });
  }
  if (props.foundations && committedSurplus < 0) {
    items.push({
      text: 'El superávit comprometido es negativo: los compromisos consumen más de lo que entra.',
      to: '/presupuesto',
      cta: 'Revisar presupuesto',
    });
  }
  return items.slice(0, 3);
});

const blockers = computed<Blocker[]>(() => {
  if (gap.value != null) return [];
  if (specificBlockers.value.length) return specificBlockers.value;
  return [
    {
      text: 'Con los datos actuales el capital no alcanza el objetivo dentro del horizonte proyectado.',
      to: '/plan/setup',
      cta: 'Revisar objetivo y horizonte',
    },
  ];
});

const deltaCopy = computed(() => {
  if (gap.value == null) {
    const count = specificBlockers.value.length;
    if (count === 1) return 'El plan actual no llega al objetivo: hay 1 causa identificada';
    if (count > 1) return `El plan actual no llega al objetivo: hay ${count} causas identificadas`;
    return 'El capital proyectado no alcanza el objetivo dentro del horizonte';
  }
  if (gap.value === 0) return 'Alineado con la fecha objetivo';
  if (gap.value > 0) return `${gap.value} años después del objetivo`;
  return `${Math.abs(gap.value)} años antes del objetivo`;
});

const kpis = computed<AKpiItem[]>(() => [
  {
    label: 'Nivel de vida objetivo',
    value: targetCopy.value,
    meta: 'Euros actuales',
  },
  {
    label: 'Renta sostenible',
    value: formatMoney(summary.value.monthly_sustainable_income.value),
    meta: 'Aproximada, según hipótesis',
  },
  {
    label: 'Escenario',
    value: projectionScenarioLabel(props.projection.scenario),
    meta: 'Hipótesis globales',
  },
]);
</script>

<template>
  <section class="plan-hero a-hero-shell">
    <AHero eyebrow="Fecha proyectada" :value="projectedCopy">
      <template #delta>
        <span>{{ deltaCopy }}</span>
        <AInfoHint
          label="La fecha es una estimación calculada con capital productivo, hipótesis y datos actuales. No es una garantía."
        />
      </template>
      <div v-if="blockers.length" class="plan-hero-blockers">
        <strong>Por qué no hay fecha</strong>
        <ul>
          <li v-for="item in blockers" :key="item.text">
            <span>{{ item.text }}</span>
            <RouterLink class="plan-blocker-link" :to="item.to">{{ item.cta }}</RouterLink>
          </li>
        </ul>
      </div>
    </AHero>

    <div class="plan-hero-side">
      <AKpiBand :items="kpis" />
      <p class="plan-hero-note">
        Mi Plan separa capacidad financiera futura y patrimonio familiar. El progreso usa capital
        productivo, no patrimonio neto total.
      </p>
    </div>
  </section>
</template>
