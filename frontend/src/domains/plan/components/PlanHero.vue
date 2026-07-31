<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { AHero, AKpiBand, AInfoHint, type AKpiItem } from '@/domains/ui';
import { formatMoney, formatPct } from '@/lib/format';
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
// El motor devuelve el primer año de retiro sostenible. Visualmente mostramos
// el cierre anterior, cuando el capital queda preparado, igual que el gráfico.
const sustainableYear = computed(() => props.overview?.sustainable_year ?? null);
const desiredYear = computed(() => props.overview?.desired_year ?? null);
const sustainableReadinessYear = computed(() =>
  sustainableYear.value == null ? null : sustainableYear.value - 1,
);
const desiredReadinessYear = computed(() =>
  desiredYear.value == null ? null : desiredYear.value - 1,
);
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
  sustainableReadinessYear.value == null
    ? 'Sin fecha sostenible'
    : yearWithAges(sustainableReadinessYear.value, props.plan.members),
);
// En pantallas estrechas el nombre sobra (ya es tu plan): "2045 · 61 años".
const projectedCompactCopy = computed(() =>
  sustainableReadinessYear.value == null
    ? 'Sin fecha sostenible'
    : compactYearWithAges(sustainableReadinessYear.value, props.plan.members),
);
// Extremos del rango etiquetados para la ⓘ: favorable (optimista, antes) y
// prudente (conservador, después). Null si no hay spread (coinciden).
const rangeDetail = computed(() => {
  const range = props.overview?.sustainable_range;
  if (!range?.prudent_year || !range.favorable_year) return null;
  if (range.prudent_year === range.favorable_year) return null;
  return { favorable: range.favorable_year - 1, prudent: range.prudent_year - 1 };
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
  desiredReadinessYear.value == null
    ? 'el cierre de tu objetivo'
    : `el cierre objetivo de ${desiredReadinessYear.value}`,
);
const deltaCopy = computed(() => {
  if (sustainableYear.value == null) {
    const count = specificBlockers.value.length;
    if (count >= 1) {
      return `Aún no es sostenible · ${count} ${count === 1 ? 'causa a revisar' : 'causas a revisar'}`;
    }
    return 'Con los datos actuales no hay una jubilación sostenible en el horizonte';
  }
  const retirementCopy = `podrías dejar de trabajar en ${sustainableYear.value}`;
  if (gapYears.value == null || gapYears.value === 0) {
    return `Consolidado justo en ${objetivoCopy.value} · ${retirementCopy}`;
  }
  const years = Math.abs(gapYears.value) === 1 ? 'año' : 'años';
  if (gapYears.value > 0) {
    return `Consolidado ${gapYears.value} ${years} más tarde que ${objetivoCopy.value} · ${retirementCopy}`;
  }
  return `Consolidado ${Math.abs(gapYears.value)} ${years} antes que ${objetivoCopy.value} · ${retirementCopy}`;
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
const sustainableMeta = computed(
  () => `${sustainableShare.value} % de tu objetivo, sin contar la pensión`,
);

// Este porcentaje y el del progreso de capital no coinciden y parecen lo mismo. No
// lo son: aquí se compara la renta que da tu capital HOY, a perpetuidad y sin
// pensión; allí, tu capital frente al que necesitarás en la fecha proyectada, donde
// la pensión ya cubre parte del gasto y solo hay que financiar el puente.
const withdrawalPct = computed(() => {
  const rate = Number(props.projection.assumptions?.withdrawal_rate ?? 0);
  return rate > 0 ? formatPct(rate, 1) : null;
});
const sustainableHint = computed(() => {
  const capital = formatMoney(productiveCapital.value);
  const base = withdrawalPct.value
    ? `Es lo que renta hoy tu capital productivo (${capital} al ${withdrawalPct.value} anual), como si tuviera que durar para siempre.`
    : `Es lo que renta hoy tu capital productivo (${capital}), como si tuviera que durar para siempre.`;
  return `${base} El progreso hacia el capital requerido sale más alto porque ese objetivo cuenta con tus pensiones y solo financia los años hasta cobrarlas.`;
});

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
          <AInfoHint label="Sobre la fecha de consolidación">
            El año principal es el cierre en que el capital queda preparado; podrías dejar de
            trabajar al año siguiente.<template v-if="rangeDetail">
              Según las hipótesis, ese cierre estaría entre {{ rangeDetail.favorable }} (favorable)
              y {{ rangeDetail.prudent }} (prudente).</template
            >
            No es una garantía: se calcula con capital productivo, hipótesis y datos actuales.
          </AInfoHint>
        </template>
      </AHero>

      <div class="plan-hero-side">
        <AKpiBand :items="kpis">
          <template #meta-1>
            <span :class="sustainableTone">{{ sustainableMeta }}</span>
            <AInfoHint :label="sustainableHint" />
          </template>
        </AKpiBand>
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
