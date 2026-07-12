<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, AMetaPill, type ASelectItem } from '@/domains/ui';
import {
  NetWorthTrajectoryChart,
  PlanFoundations,
  PlanHero,
  PlanEventsTimeline,
  ProductiveCapitalProgress,
  ProjectedDateCard,
  ProjectionAssumptionsDrawer,
  PlanRecommendationCard,
} from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import { planEventMarkers } from '@/domains/plan/usePlanEvents';
import type { ProjectionScenario } from '@/domains/plan';
import { scenarioStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import '@/domains/plan/plan.css';

const { store, loading, error, plan, planMissing, projection, netWorthTimeline, scenario } =
  usePlan();
const router = useRouter();
const route = useRoute();
const assumptionsOpen = ref(false);
type PlanTab = 'summary' | 'trajectory' | 'decisions' | 'diagnosis';
const planTabs: Array<{ id: PlanTab; label: string }> = [
  { id: 'summary', label: 'Resumen' },
  { id: 'trajectory', label: 'Trayectoria' },
  { id: 'decisions', label: 'Decisiones' },
  { id: 'diagnosis', label: 'Diagnóstico' },
];

function parsePlanTab(raw: unknown): PlanTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'trajectory' || value === 'decisions' || value === 'diagnosis'
    ? value
    : 'summary';
}

const activeTab = ref<PlanTab>(parsePlanTab(route.query.tab));

function setPlanTab(tab: PlanTab): void {
  activeTab.value = tab;
  const query = { ...route.query };
  if (tab === 'summary') delete query.tab;
  else query.tab = tab;
  void router.replace({ query });
}

const scenarioOptions: ASelectItem[] = [
  { value: 'prudent', label: 'Prudente' },
  { value: 'expected', label: 'Esperado' },
  { value: 'favorable', label: 'Favorable' },
];

const activeScenario = computed({
  get: () => scenario.value,
  set: (value) => {
    void store.fetchProjection(value as ProjectionScenario);
  },
});

const visibleRecommendations = computed(() =>
  store.recommendations.filter((item) => item.status === 'open').slice(0, 2),
);

const eventMarkers = computed(() => planEventMarkers(store.events));

async function simulateRecommendation(id: number): Promise<void> {
  const scenario = await store.simulateRecommendation(id);
  await router.push({ name: 'plan-scenario-detail', params: { id: scenario.id } });
}

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = parsePlanTab(tab);
  },
);

onMounted(() => {
  void Promise.all([store.loadDashboard(), store.fetchScenarios()]);
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Mi Plan" eyebrow="Planificación financiera">
      <template #meta>
        <span>Motor Core</span><span class="dot"></span><span>Estimaciones deterministas</span>
      </template>
      <template #actions>
        <RouterLink class="btn btn-primary" to="/plan/escenarios?create=1">
          Simular decisión
        </RouterLink>
        <RouterLink class="btn btn-ghost" to="/plan/setup">Editar plan</RouterLink>
        <AButton
          v-if="projection"
          variant="primary"
          :loading="store.recalculating"
          @click="store.recalculate()"
        >
          Recalcular
        </AButton>
      </template>
    </APageHead>

    <AState v-if="loading && !projection && !planMissing" status="loading">
      Cargando Mi Plan...
    </AState>

    <AState v-else-if="error" status="error">
      {{ error }}
    </AState>

    <AState v-else-if="planMissing || !plan" status="empty">
      <div class="plan-empty">
        <p class="eyebrow">Primer paso</p>
        <h2>Crea tu plan financiero</h2>
        <p>
          Define fecha objetivo, nivel de vida y adultos del plan para generar la primera
          proyección.
        </p>
        <RouterLink class="btn btn-primary" to="/plan/setup">Configurar Mi Plan</RouterLink>
      </div>
    </AState>

    <template v-else-if="projection">
      <nav class="plan-tabs-bar" aria-label="Secciones de Mi Plan">
        <div class="tabs">
          <button
            v-for="tab in planTabs"
            :key="tab.id"
            type="button"
            class="tab"
            :class="{ on: activeTab === tab.id }"
            @click="setPlanTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </nav>

      <div class="plan-toolbar">
        <AMetaPill>Objetivo {{ plan.target_date.slice(0, 4) }}</AMetaPill>
        <label class="context-field">
          <span>Hipótesis</span>
          <ASelect
            v-model="activeScenario"
            :options="scenarioOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <span v-if="loading && projection" class="plan-muted" role="status">Actualizando…</span>
        <AButton variant="ghost" @click="assumptionsOpen = true">Supuestos</AButton>
        <RouterLink class="btn btn-ghost" to="/plan/activos">Clasificar activos</RouterLink>
      </div>

      <template v-if="activeTab === 'summary'">
        <PlanHero :plan="plan" :projection="projection" :foundations="store.foundations" />

        <section v-if="visibleRecommendations.length" class="sect plan-recommendations">
          <div class="sect-head">
            <div>
              <p class="eyebrow">Recomendaciones</p>
              <h2 class="sect-title">Siguiente acción</h2>
              <p class="sect-sub">
                Máximo una acción principal y una secundaria, generadas por reglas.
              </p>
            </div>
          </div>
          <div class="plan-recommendation-list">
            <PlanRecommendationCard
              v-for="recommendation in visibleRecommendations.slice(0, 1)"
              :key="recommendation.id"
              :recommendation="recommendation"
              @accept="store.acceptRecommendation"
              @dismiss="store.dismissRecommendation"
              @simulate="simulateRecommendation"
            />
          </div>
        </section>
      </template>

      <NetWorthTrajectoryChart
        v-if="activeTab === 'trajectory'"
        :timeline="netWorthTimeline"
        :projection="projection"
        :members="plan.members"
        :events="eventMarkers"
      />

      <div v-if="activeTab === 'decisions'" class="plan-diagnosis-detail">
        <section class="sect plan-decision-intro">
          <div class="sect-head">
            <div>
              <p class="eyebrow">Laboratorio de decisiones</p>
              <h2 class="sect-title">¿Qué quieres probar?</h2>
              <p class="sect-sub">
                Simula una compra, una vivienda, una excedencia u otro cambio antes de incorporarlo
                al plan. Si la decisión ya la tomaste, regístrala en retrospectiva.
              </p>
            </div>
            <div class="plan-decision-actions">
              <RouterLink class="btn btn-ghost" to="/plan/decisiones/registrar">
                Registrar decisión tomada
              </RouterLink>
              <RouterLink class="btn btn-primary" to="/plan/escenarios?create=1">
                Nueva simulación
              </RouterLink>
            </div>
          </div>
        </section>
        <section class="sect plan-scenario-list">
          <div class="sect-head">
            <div>
              <p class="eyebrow">Escenarios</p>
              <h2 class="sect-title">Guardados</h2>
            </div>
            <RouterLink class="btn btn-ghost btn-sm" to="/plan/escenarios">Ver todos</RouterLink>
          </div>
          <RouterLink
            v-for="item in store.scenarios.slice(0, 5)"
            :key="item.id"
            class="plan-scenario-row"
            :to="`/plan/escenarios/${item.id}`"
          >
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ scenarioTemplateLabel(item.template_type) }}</span>
            </div>
            <span class="plan-status-chip" :class="`is-${item.status}`">
              {{ scenarioStatusLabel(item.status) }}
            </span>
          </RouterLink>
        </section>
        <PlanEventsTimeline
          :events="store.events"
          :saving="store.saving"
          :close-event="store.closePlanEvent"
          :release-event="store.releaseEvent"
          :materialize-event="store.materializeEvent"
          :cancel-event="store.cancelEvent"
        />
      </div>

      <div v-if="activeTab === 'diagnosis'" class="plan-diagnosis-detail">
        <div class="plan-main-grid">
          <ProductiveCapitalProgress :projection="projection" />
          <ProjectedDateCard :projection="projection" :members="plan.members" />
        </div>
        <section v-if="visibleRecommendations.length > 1" class="sect plan-recommendations">
          <div class="sect-head">
            <div>
              <p class="eyebrow">Alternativa</p>
              <h2 class="sect-title">Acción secundaria</h2>
            </div>
          </div>
          <PlanRecommendationCard
            :recommendation="visibleRecommendations[1]!"
            secondary
            @accept="store.acceptRecommendation"
            @dismiss="store.dismissRecommendation"
            @simulate="simulateRecommendation"
          />
        </section>
        <PlanFoundations :foundations="store.foundations" />
      </div>

      <ProjectionAssumptionsDrawer
        :open="assumptionsOpen"
        :assumptions="projection.assumptions"
        @close="assumptionsOpen = false"
      />
    </template>
  </main>
</template>
