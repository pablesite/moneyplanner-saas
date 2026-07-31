<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { AHero, AKpiBand, AInfoHint, type AKpiItem } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import type {
  FinancialPlan,
  PlanFoundations,
  PlanOverview,
  ProjectionResponse,
} from '@/domains/plan/types';
import { projectionScenarioLabel } from '@/domains/plan/scenarioTemplates';
import { compactYearWithAges, yearWithAges } from '@/domains/plan/age';

const props = defineProps<{
  plan: FinancialPlan;
  projection: ProjectionResponse;
  overview?: PlanOverview | null;
  foundations?: PlanFoundations | null;
}>();

const summary = computed(() => props.projection.summary);
// El titular pasa a ser la jubilación sostenible más temprana (cuándo puedes
// dejar de trabajar sin quedarte sin dinero), no la vieja "fecha estimada".
const sustainableYear = computed(() => props.overview?.sustainable_year ?? null);
const desiredYear = computed(() => props.overview?.desired_year ?? null);
// gap_years > 0 = tu objetivo deseado aún no es sostenible; <= 0 = lo logras en/antes.
const gapYears = computed(() => props.overview?.gap_years ?? null);

// Sin "/ mes" en el valor: a 390px partía la cifra en dos líneas a mitad de unidad.
const targetCopy = computed(() => formatMoney(props.plan.target_monthly_income_today_eur));
const sustainableShare = computed(() => {
  const target = Number(props.plan.target_monthly_income_today_eur || 0);
  const sustainable = Number(summary.value.monthly_sustainable_income.value || 0);
  return target > 0 ? Math.round((sustainable / target) * 100) : 0;
});
const productiveCapital = computed(() => Number(summary.value.productive_capital.value ?? 0));
const projectedCopy = computed(() =>
  sustainableYear.value == null
    ? 'Sin fecha sostenible'
    : yearWithAges(sustainableYear.value, props.plan.members),
);
// En pantallas estrechas el nombre sobra (ya es tu plan): "2045 · 61 años".
const projectedCompactCopy = computed(() =>
  sustainableYear.value == null
    ? 'Sin fecha sostenible'
    : compactYearWithAges(sustainableYear.value, props.plan.members),
);
// Extremos del rango etiquetados para la ⓘ: favorable (optimista, antes) y
// prudente (conservador, después). Null si no hay spread (coinciden).
const rangeDetail = computed(() => {
  const range = props.overview?.sustainable_range;
  if (!range?.prudent_year || !range.favorable_year) return null;
  if (range.prudent_year === range.favorable_year) return null;
  return { favorable: range.favorable_year, prudent: range.prudent_year };
});
type Blocker = { text: string; to: string; cta: string };

const hasAnyAssets = computed(
  () => Number(props.foundations?.net_worth_health?.assets_value ?? 0) > 0,
);

// También con fecha proyectada: si la salud es crítica (0 activos, capital sin
// clasificar, déficit), el "por qué" del desvío debe leerse sin cambiar de pantalla.
const specificBlockers = computed<Blocker[]>(() => {
  const items: Blocker[] = [];
  const unknownCapital = Number(props.projection.classification?.unknown_capital ?? 0);
  const monthlyContribution = Number(props.foundations?.planned_contribution?.monthly_amount ?? 0);
  if (productiveCapital.value <= 0) {
    items.push(
      hasAnyAssets.value
        ? {
            text: 'No hay capital clasificado como productivo: la proyección no tiene base desde la que crecer.',
            to: '/plan/activos',
            cta: 'Clasificar activos',
          }
        : {
            text: 'Aún no has cargado ningún activo o pasivo en Patrimonio: la proyección arranca desde 0 € aunque tengas patrimonio real (cartera, hipoteca...).',
            to: '/patrimonio',
            cta: 'Añadir mi patrimonio',
          },
    );
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
  return items.slice(0, 3);
});

const blockers = computed<Blocker[]>(() => {
  if (specificBlockers.value.length) return specificBlockers.value;
  if (sustainableYear.value != null) return [];
  return [
    {
      text: 'Ni trabajando hasta el fin del horizonte el capital sostiene tu nivel de vida sin agotarse.',
      to: '/plan/setup',
      cta: 'Revisar objetivo y horizonte',
    },
  ];
});

// El hero solo diagnostica problemas de fondo (blockers). La base recurrente, el
// esfuerzo temporal y los movimientos puntuales viven en PlanSituationSection.
const diagnosisTitle = computed(() =>
  specificBlockers.value.length > 0 ? 'Qué está frenando el plan' : 'Por qué no hay fecha',
);

// El objetivo que fija el usuario es una aspiración; el delta compara esa
// aspiración con la jubilación sostenible más temprana que calcula el motor.
const objetivoCopy = computed(() =>
  desiredYear.value == null ? 'tu objetivo' : `tu objetivo de ${desiredYear.value}`,
);
const deltaCopy = computed(() => {
  if (sustainableYear.value == null) {
    const count = specificBlockers.value.length;
    if (count >= 1) {
      return `Aún no es sostenible · ${count} ${count === 1 ? 'causa a revisar' : 'causas a revisar'}`;
    }
    return 'Con los datos actuales no hay una jubilación sostenible en el horizonte';
  }
  if (gapYears.value == null || gapYears.value === 0) return `Justo en ${objetivoCopy.value}`;
  const years = Math.abs(gapYears.value) === 1 ? 'año' : 'años';
  if (gapYears.value > 0) return `${gapYears.value} ${years} más tarde que ${objetivoCopy.value}`;
  return `${Math.abs(gapYears.value)} ${years} antes que ${objetivoCopy.value}`;
});

const statusCopy = computed(() => {
  const status = props.overview?.status;
  if (status === 'on_track') return 'Tu plan avanza dentro del plazo';
  if (status === 'incomplete') return 'Faltan datos para afinar el plan';
  if (status === 'off_track') {
    // Cerca del objetivo no es "necesita ajustes": es "casi".
    return gapYears.value != null && gapYears.value <= 3
      ? 'Casi en objetivo'
      : 'Tu plan necesita ajustes';
  }
  return 'El objetivo aún no es alcanzable';
});

// Sin alarma roja para un desvío pequeño: solo un desfase grande (>3 años) es
// negativo; en/antes del objetivo es positivo; el resto, neutro.
const deltaTone = computed(() => {
  if (sustainableYear.value == null) return null;
  if (gapYears.value != null && gapYears.value <= 0) return 'pos';
  if (gapYears.value != null && gapYears.value > 3) return 'neg';
  return null;
});

// La renta sostenible hereda la señal semántica de los deltas: por debajo del
// objetivo es el aviso más accionable del hero, no un metadato neutro.
const sustainableTone = computed(() => (sustainableShare.value >= 100 ? 'pos' : 'neg'));
const sustainableMeta = computed(() => `${sustainableShare.value} % de tu objetivo mensual`);

const kpis = computed<AKpiItem[]>(() => [
  {
    label: 'Nivel de vida objetivo',
    value: targetCopy.value,
    meta: 'Al mes, en euros de hoy',
  },
  {
    label: 'Renta sostenible',
    value: formatMoney(summary.value.monthly_sustainable_income.value),
  },
  {
    label: 'Escenario central',
    value: projectionScenarioLabel(props.projection.scenario),
    meta: 'Cámbialo en Ajustes del cálculo',
  },
]);
</script>

<template>
  <section class="plan-hero">
    <div class="plan-hero-top">
      <AHero class="plan-hero-headline" :eyebrow="statusCopy">
        <template #value>
          <div class="hero-value mono plan-hero-value-full">{{ projectedCopy }}</div>
          <div class="hero-value mono plan-hero-value-compact">{{ projectedCompactCopy }}</div>
        </template>
        <template #delta>
          <span class="plan-delta-main" :class="deltaTone">{{ deltaCopy }}</span>
          <AInfoHint label="Sobre la fecha sostenible">
            Estimación central.<template v-if="rangeDetail">
              Según las hipótesis, entre {{ rangeDetail.favorable }} (favorable) y
              {{ rangeDetail.prudent }} (prudente).</template
            >
            No es una garantía: se calcula con capital productivo, hipótesis y datos actuales.
          </AInfoHint>
        </template>
      </AHero>

      <div class="plan-hero-side">
        <AKpiBand :items="kpis">
          <template #meta-1>
            <span :class="sustainableTone">{{ sustainableMeta }}</span>
          </template>
        </AKpiBand>
        <p class="plan-hero-note">
          Mi Plan separa capacidad financiera futura y patrimonio familiar. El progreso usa capital
          productivo, no patrimonio neto total.
        </p>
      </div>
    </div>

    <div v-if="blockers.length" class="plan-diagnosis">
      <p class="plan-diagnosis-title">{{ diagnosisTitle }}</p>
      <ul class="plan-diagnosis-blockers">
        <li v-for="item in blockers" :key="item.text">
          <span>{{ item.text }}</span>
          <RouterLink class="plan-blocker-link" :to="item.to">{{ item.cta }}</RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>
