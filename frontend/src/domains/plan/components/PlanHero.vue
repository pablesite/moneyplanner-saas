<script setup lang="ts">
import { computed, ref } from 'vue';
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
// Banda de escenarios (prudente–favorable) como subtexto, no como titular.
const rangeCopy = computed(() => {
  const range = props.overview?.sustainable_range;
  if (!range?.prudent_year || !range.favorable_year) return null;
  const first = Math.min(range.prudent_year, range.favorable_year);
  const last = Math.max(range.prudent_year, range.favorable_year);
  return first === last ? null : `entre ${first} y ${last}`;
});
type BlockerRow = { label: string; value: string; kind?: 'sub' | 'total' };
type Blocker = {
  text: string;
  to: string;
  cta: string;
  detail?: BlockerRow[];
  detailNote?: string;
};

const hasAnyAssets = computed(
  () => Number(props.foundations?.net_worth_health?.assets_value ?? 0) > 0,
);

// Un desplegable por blocker (identificado por su texto): el detalle numérico se
// lee sin salir del hero; "Revisar presupuesto" queda para cuando toque modificar.
const openDetails = ref<Set<string>>(new Set());
const toggleDetail = (key: string) => {
  const next = new Set(openDetails.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  openDetails.value = next;
};

// Cascada del superávit comprometido con los números que ya publica cimientos.
const committedBreakdown = computed<BlockerRow[]>(() => {
  const cf = props.foundations?.cash_flow;
  if (!cf) return [];
  return [
    { label: 'Ingresos estructurales', value: formatMoney(cf.structural_annual_income) },
    { label: 'Gasto operativo', value: `− ${formatMoney(cf.structural_operating_expense)}` },
    { label: 'Superávit operativo', value: formatMoney(cf.operating_surplus), kind: 'sub' },
    { label: 'Compromisos temporales', value: `− ${formatMoney(cf.temporary_commitment_expense)}` },
    { label: 'Superávit comprometido', value: formatMoney(cf.committed_surplus), kind: 'total' },
  ];
});

// También con fecha proyectada: si la salud es crítica (0 activos, capital sin
// clasificar, déficit), el "por qué" del desvío debe leerse sin cambiar de pantalla.
const specificBlockers = computed<Blocker[]>(() => {
  const items: Blocker[] = [];
  const unknownCapital = Number(props.projection.classification?.unknown_capital ?? 0);
  const monthlyContribution = Number(props.foundations?.planned_contribution?.monthly_amount ?? 0);
  const committedSurplus = Number(props.foundations?.cash_flow?.committed_surplus ?? 0);
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
  if (props.foundations && committedSurplus < 0) {
    items.push({
      text: 'El superávit comprometido es negativo: los compromisos consumen más de lo que entra.',
      to: '/presupuesto',
      cta: 'Revisar presupuesto',
      detail: committedBreakdown.value,
      detailNote:
        'Los compromisos temporales terminan al vencer cada deuda; no son gasto permanente como el operativo.',
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

const blockersTitle = computed(() =>
  sustainableYear.value == null ? 'Por qué no hay fecha' : 'Qué está frenando el plan',
);

// El objetivo que fija el usuario es una aspiración; el delta compara esa
// aspiración con la jubilación sostenible más temprana que calcula el motor.
const desiredCopy = computed(() =>
  desiredYear.value == null ? 'tu objetivo' : `tu objetivo (${desiredYear.value})`,
);
const deltaCopy = computed(() => {
  if (sustainableYear.value == null) {
    const count = specificBlockers.value.length;
    if (count === 1) return 'Tu plan aún no es sostenible: hay 1 causa identificada';
    if (count > 1) return `Tu plan aún no es sostenible: hay ${count} causas identificadas`;
    return 'Con los datos actuales no hay una jubilación sostenible en el horizonte';
  }
  if (gapYears.value == null || gapYears.value === 0) return `Coincide con ${desiredCopy.value}`;
  const years = Math.abs(gapYears.value) === 1 ? 'año' : 'años';
  if (gapYears.value > 0)
    return `${desiredCopy.value} aún no es sostenible · ${gapYears.value} ${years} más`;
  return `${Math.abs(gapYears.value)} ${years} antes de ${desiredCopy.value}`;
});

const statusCopy = computed(() => {
  const status = props.overview?.status;
  if (status === 'on_track') return 'Tu plan avanza dentro del plazo';
  if (status === 'off_track') return 'Tu plan necesita ajustes';
  if (status === 'incomplete') return 'Faltan datos para afinar el plan';
  return 'El objetivo aún no es alcanzable';
});

// El dato más importante del plan merece la misma señal semántica que los deltas de Patrimonio.
// Sin fecha estimada no se colorea: el bloque de causas ya carga ese peso.
const deltaTone = computed(() => {
  if (sustainableYear.value == null) return null;
  return gapYears.value != null && gapYears.value > 0 ? 'neg' : 'pos';
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
    meta: 'Puedes cambiarlo en Ajustes',
  },
]);
</script>

<template>
  <section class="plan-hero a-hero-shell">
    <AHero :eyebrow="statusCopy">
      <template #value>
        <div class="hero-value mono plan-hero-value-full">{{ projectedCopy }}</div>
        <div class="hero-value mono plan-hero-value-compact">{{ projectedCompactCopy }}</div>
      </template>
      <template #delta>
        <span :class="deltaTone">
          {{ deltaCopy }}
          <template v-if="rangeCopy"> · {{ rangeCopy }} </template>
        </span>
        <AInfoHint
          label="La fecha es una estimación calculada con capital productivo, hipótesis y datos actuales. No es una garantía."
        />
      </template>
      <div v-if="blockers.length" class="plan-hero-blockers">
        <strong>{{ blockersTitle }}</strong>
        <ul>
          <li v-for="item in blockers" :key="item.text">
            <span>{{ item.text }}</span>
            <button
              v-if="item.detail && item.detail.length"
              class="plan-details-toggle"
              type="button"
              :aria-expanded="openDetails.has(item.text)"
              @click="toggleDetail(item.text)"
            >
              {{ openDetails.has(item.text) ? 'Ocultar detalle' : 'Ver detalle' }}
            </button>
            <div v-if="item.detail && openDetails.has(item.text)" class="plan-blocker-breakdown">
              <dl>
                <div v-for="row in item.detail" :key="row.label" :class="row.kind">
                  <dt>{{ row.label }}</dt>
                  <dd class="mono">{{ row.value }}</dd>
                </div>
              </dl>
              <p v-if="item.detailNote" class="plan-blocker-breakdown-note">
                {{ item.detailNote }}
              </p>
            </div>
            <RouterLink class="plan-blocker-link" :to="item.to">{{ item.cta }}</RouterLink>
          </li>
        </ul>
      </div>
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
  </section>
</template>
