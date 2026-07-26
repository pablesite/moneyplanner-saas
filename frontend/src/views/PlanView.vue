<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import {
  NetWorthTrajectoryChart,
  PlanFoundations,
  PlanHero,
  ProductiveCapitalProgress,
  ProjectionAssumptionsDrawer,
} from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import { planEventMarkers } from '@/domains/plan/usePlanEvents';
import type { ProjectionScenario } from '@/domains/plan';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

const { store, loading, error, plan, planMissing, projection, netWorthTimeline, scenario } =
  usePlan();
const assumptionsOpen = ref(false);
const trajectoryOpen = ref(false);

const scenarioOptions: ASelectItem[] = [
  { value: 'prudent', label: 'Prudente' },
  { value: 'expected', label: 'Esperado' },
  { value: 'favorable', label: 'Favorable' },
];

const activeScenario = computed({
  get: () => scenario.value,
  set: (value) => {
    void store.fetchOverview(value as ProjectionScenario);
  },
});

const eventMarkers = computed(() => planEventMarkers(store.events));
const nextAction = computed(() => store.overview?.next_action ?? null);
const monthlyAction = computed(() => {
  const amount = Number(nextAction.value?.monthly_commitment ?? 0);
  return amount > 0 ? `${formatMoney(amount)} al mes` : null;
});
const foundationStatus = computed(() => {
  const values = Object.values(store.overview?.foundations ?? {});
  const critical = values.filter((item) => item.status === 'critical').length;
  const warning = values.filter((item) => item.status === 'warning').length;
  if (critical) return `${critical} bloquean el plan`;
  if (warning) return `${warning} necesitan atención`;
  return 'Cimientos sólidos';
});

onMounted(() => {
  document.title = 'Mi Plan · The Arkenstone';
  void Promise.all([store.loadDashboard(), store.fetchScenarios()]);
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Mi Plan">
      <template #meta>
        <span>Tu camino para que trabajar sea opcional</span>
      </template>
      <template #actions>
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
      <PlanHero
        :plan="plan"
        :projection="projection"
        :overview="store.overview"
        :foundations="store.foundations"
      />

      <section v-if="nextAction" class="sect plan-next-action" aria-labelledby="next-action-title">
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

      <div class="plan-main-grid">
        <ProductiveCapitalProgress :projection="projection" />
        <section class="sect plan-foundation-summary">
          <p class="eyebrow">Cimientos y datos</p>
          <h2 class="sect-title">{{ foundationStatus }}</h2>
          <PlanFoundations :foundations="store.foundations" compact />
        </section>
      </div>

      <section class="sect plan-calculation-settings">
        <details>
          <summary>Ajustes del cálculo</summary>
          <div class="plan-toolbar">
            <label class="context-field">
              <span>Escenario</span>
              <ASelect
                v-model="activeScenario"
                :options="scenarioOptions"
                class="filter-ctrl"
                :searchable="false"
              />
            </label>
            <span v-if="plan.preservation_target_eur">
              Capital que no quieres consumir:
              <strong>{{ formatMoney(plan.preservation_target_eur) }}</strong>
            </span>
            <AButton variant="ghost" @click="assumptionsOpen = true">Ver parámetros</AButton>
          </div>
        </details>
      </section>

      <section class="sect plan-trajectory-detail">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Detalle</p>
            <h2 class="sect-title">Cómo evoluciona tu patrimonio</h2>
          </div>
          <AButton variant="ghost" @click="trajectoryOpen = !trajectoryOpen">
            {{ trajectoryOpen ? 'Ocultar trayectoria' : 'Ver trayectoria' }}
          </AButton>
        </div>
        <NetWorthTrajectoryChart
          v-if="trajectoryOpen"
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

      <ProjectionAssumptionsDrawer
        :open="assumptionsOpen"
        :assumptions="projection.assumptions"
        @close="assumptionsOpen = false"
      />
    </template>
  </main>
</template>
