<script setup lang="ts">
import { computed } from 'vue';
import { AHero, AKpiBand, AInfoHint, type AKpiItem } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import type { FinancialPlan, ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{
  plan: FinancialPlan;
  projection: ProjectionResponse;
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
const projectedCopy = computed(() =>
  projectedYear.value == null ? 'Sin fecha estimada' : String(projectedYear.value),
);
const deltaCopy = computed(() => {
  if (gap.value == null) return 'Completa datos o ajusta hipótesis para estimar fecha';
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
    value: props.projection.scenario,
    meta: 'Hipótesis globales MVP',
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
