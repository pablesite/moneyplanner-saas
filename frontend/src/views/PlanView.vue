<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, AInfoHint, APageHead, AState } from '@/domains/ui';
import {
  NetWorthTrajectoryChart,
  PlanCalculationSettingsModal,
  PlanFoundations,
  PlanHero,
  PlanSituationSection,
  ProductiveCapitalProgress,
} from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import { planEventMarkers } from '@/domains/plan/usePlanEvents';
import type { ProjectionScenario } from '@/domains/plan';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

const { store, loading, error, plan, planMissing, projection, netWorthTimeline, scenario } =
  usePlan();
const settingsOpen = ref(false);

function selectScenario(value: ProjectionScenario): void {
  void store.fetchOverview(value);
}

const eventMarkers = computed(() => planEventMarkers(store.events));
// En un apretón transitorio no hay acción de mejora real (los compromisos vencen
// solos); el diagnóstico del hero ya lo explica, así que ocultamos la tarjeta.
const isTransientSqueeze = computed(
  () => store.foundations?.cash_flow?.committed_status === 'transient',
);
const nextAction = computed(() =>
  isTransientSqueeze.value ? null : (store.overview?.next_action ?? null),
);
const monthlyAction = computed(() => {
  const amount = Number(nextAction.value?.monthly_commitment ?? 0);
  return amount > 0 ? `${formatMoney(amount)} al mes` : null;
});
// El titular del bloque: nota global de Core y, debajo, qué dimensión la frena.
const FOUNDATION_LABELS: Record<string, string> = {
  cash_flow: 'Flujo de caja',
  emergency_fund: 'Fondo de emergencia',
  debt: 'Deuda',
  planned_contribution: 'Aportación planificada',
  net_worth_health: 'Salud patrimonial',
  data_quality: 'Calidad de datos',
};
const FOUNDATION_KEYS = [
  'cash_flow',
  'emergency_fund',
  'debt',
  'planned_contribution',
  'net_worth_health',
  'data_quality',
] as const;

const overallHealth = computed(() => store.foundations?.overall ?? null);

const foundationStatus = computed(() => {
  const foundations = store.overview?.foundations;
  const entries = FOUNDATION_KEYS.flatMap((key) => {
    const item = foundations?.[key];
    return item ? [[key, item] as const] : [];
  });
  const named = (status: string) =>
    entries
      .filter(([, item]) => item.status === status)
      .map(([key]) => FOUNDATION_LABELS[key] ?? key);
  const critical = named('critical');
  const warning = named('warning');
  if (critical.length === 1) return `${critical[0]} bloquea el plan`;
  if (critical.length) return `${critical.length} dimensiones bloquean el plan`;
  if (warning.length === 1) return `${warning[0]} necesita atención`;
  if (warning.length) return `${warning.length} dimensiones necesitan atención`;
  return 'Todas las dimensiones en verde';
});

onMounted(() => {
  document.title = 'Mi Plan · The Arkenstone';
  void store.loadDashboard();
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Mi Plan">
      <template #meta>
        <span>Tu camino para que trabajar sea opcional</span>
        <!-- El matiz de qué mide el plan vivía como párrafo dentro del hero, robando
             sitio a los KPIs: aquí explica el título sin ocupar espacio. -->
        <AInfoHint
          label="Mi Plan separa capacidad financiera futura y patrimonio familiar: el progreso usa tu capital productivo, no el patrimonio neto total."
        />
      </template>
      <template #actions>
        <!-- Lo que altera el cálculo vive junto a lo que altera el objetivo, no al
             final de la página. -->
        <AButton v-if="plan && !planMissing" variant="ghost" @click="settingsOpen = true">
          Ajustes del cálculo
        </AButton>
        <RouterLink v-if="plan && !planMissing" class="btn btn-ghost" to="/plan/setup">
          Editar objetivo
        </RouterLink>
      </template>
    </APageHead>

    <nav class="plan-tabs-bar" aria-label="Secciones de Mi Plan">
      <div class="tabs">
        <RouterLink class="tab on" to="/plan" aria-current="page">Resumen</RouterLink>
        <RouterLink class="tab" to="/plan/mejoras">Mejoras</RouterLink>
        <RouterLink class="tab" to="/plan/decisiones">Decisiones</RouterLink>
      </div>
    </nav>

    <AState v-if="loading && !projection && !planMissing" status="loading">
      Preparando tu plan...
    </AState>
    <AState v-else-if="error && !projection" status="error">
      {{ error }}
      <AButton variant="ghost" @click="store.loadDashboard()">Reintentar</AButton>
    </AState>
    <AState v-else-if="planMissing || !plan" status="empty" class="plan-onboarding">
      <div class="plan-empty">
        <p class="eyebrow">Primer paso</p>
        <h2>Crea tu plan financiero</h2>
        <p>Te haremos seis preguntas para estimar cuándo el trabajo puede ser opcional.</p>
        <RouterLink class="btn btn-primary" to="/plan/setup">Crear Mi Plan</RouterLink>
      </div>
    </AState>

    <template v-else-if="projection">
      <section class="plan-chapter" aria-label="Objetivo y situación actual">
        <div class="plan-chapter-label" aria-hidden="true">
          <span>01</span>
          <strong>Objetivo y presente</strong>
        </div>
        <PlanHero
          :plan="plan"
          :projection="projection"
          :overview="store.overview"
          :foundations="store.foundations"
        />

        <PlanSituationSection :foundations="store.foundations" />
      </section>

      <section class="plan-chapter" aria-label="Preparación financiera">
        <div class="plan-chapter-label" aria-hidden="true">
          <span>02</span>
          <strong>Capital y salud financiera</strong>
        </div>
        <div class="plan-main-grid">
          <ProductiveCapitalProgress :projection="projection" />
          <section class="sect plan-foundation-summary">
            <p class="plan-block-eyebrow">Salud financiera</p>
            <div class="plan-foundation-headline">
              <span
                v-if="overallHealth"
                class="plan-grade plan-grade-lg"
                :class="`is-${overallHealth.grade}`"
                :title="`Nota global ${overallHealth.grade} · ${overallHealth.score}/100`"
              >
                {{ overallHealth.grade }}
              </span>
              <h2 class="sect-title">{{ foundationStatus }}</h2>
            </div>
            <PlanFoundations :foundations="store.foundations" compact />
          </section>
        </div>

        <section
          v-if="nextAction"
          class="sect plan-next-action"
          aria-labelledby="next-action-title"
        >
          <div>
            <p class="eyebrow">Lo más útil ahora</p>
            <h2 id="next-action-title" class="sect-title">{{ nextAction.title }}</h2>
            <p class="sect-sub">{{ nextAction.reason }}</p>
          </div>
          <div class="plan-next-action-impact">
            <strong v-if="monthlyAction">{{ monthlyAction }}</strong>
            <span>Impacto estimado antes de incorporarlo</span>
          </div>
          <RouterLink
            class="btn btn-primary"
            :to="{ path: '/plan/mejoras', query: { action: nextAction.recommendation_id } }"
          >
            Ver cómo mejoraría mi plan
          </RouterLink>
        </section>
      </section>

      <!-- El gráfico trae su propia cabecera ("Trayectoria patrimonial · Histórico y
           proyección"): envolverlo en otra ("Detalle · Cómo evoluciona tu patrimonio")
           solo duplicaba rótulo, y esconderlo tras un toggle escondía el contenido. -->
      <section class="plan-chapter plan-chapter-trajectory" aria-label="Previsión patrimonial">
        <div class="plan-chapter-label" aria-hidden="true">
          <span>03</span>
          <strong>Previsión a largo plazo</strong>
        </div>
        <NetWorthTrajectoryChart
          :timeline="netWorthTimeline"
          :projection="projection"
          :members="plan.members"
          :events="eventMarkers"
          :sustainable-year="store.overview?.sustainable_year ?? null"
          :desired-year="store.overview?.desired_year ?? null"
        />
      </section>

      <p v-if="error" class="plan-inline-error" role="alert">
        Una parte no pudo actualizarse. Los demás datos siguen disponibles. {{ error }}
      </p>

      <PlanCalculationSettingsModal
        :open="settingsOpen"
        :scenario="scenario"
        :assumptions="projection.assumptions"
        :preservation-target="plan.preservation_target_eur"
        @update:scenario="selectScenario"
        @close="settingsOpen = false"
      />
    </template>
  </main>
</template>
