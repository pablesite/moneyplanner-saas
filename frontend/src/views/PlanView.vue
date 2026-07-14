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
  ProjectionAssumptionsDrawer,
  PlanRecommendationCard,
} from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import { planEventMarkers } from '@/domains/plan/usePlanEvents';
import type { ProjectionScenario } from '@/domains/plan';
import { scenarioStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

const { store, loading, error, plan, planMissing, projection, netWorthTimeline, scenario } =
  usePlan();
const router = useRouter();
const route = useRoute();
const assumptionsOpen = ref(false);
type PlanTab = 'summary' | 'trajectory' | 'decisions';
const planTabs: Array<{ id: PlanTab; label: string }> = [
  { id: 'summary', label: 'Resumen' },
  { id: 'trajectory', label: 'Trayectoria' },
  { id: 'decisions', label: 'Decisiones' },
];

// 'diagnosis' era un tab propio hasta la revisión UX de julio 2026: sus URLs
// guardadas caen en Resumen, que ahora absorbe el diagnóstico completo.
function parsePlanTab(raw: unknown): PlanTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'trajectory' || value === 'decisions' ? value : 'summary';
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

// El patrimonio a preservar exige capital extra: si está definido, se ve.
const preservationCopy = computed(() => {
  const amount = Number(plan.value?.preservation_target_eur ?? 0);
  return amount > 0 ? `Preserva ${formatMoney(amount)}` : null;
});

// Trazabilidad del cálculo: sin esto, "Recalcular" no dice si hace falta.
const calculatedCopy = computed(() => {
  const raw = projection.value?.calculated_at;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : `Calculado el ${date.toLocaleDateString('es-ES')}`;
});

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
    <APageHead title="Mi Plan">
      <template #meta>
        <AMetaPill>Motor Core</AMetaPill>
        <span class="dot"></span>
        <span>Estimaciones deterministas</span>
      </template>
      <template #actions>
        <template v-if="plan && !planMissing">
          <RouterLink class="btn btn-primary" to="/plan/escenarios?create=1">
            Simular decisión
          </RouterLink>
          <RouterLink class="btn btn-ghost" to="/plan/setup">Editar plan</RouterLink>
        </template>
      </template>
    </APageHead>

    <AState v-if="loading && !projection && !planMissing" status="loading">
      Cargando Mi Plan...
    </AState>

    <AState v-else-if="error" status="error">
      {{ error }}
    </AState>

    <AState v-else-if="planMissing || !plan" status="empty" class="plan-onboarding">
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

      <!-- La toolbar agrupa el contexto del cálculo: objetivo, hipótesis, parámetros
           y recálculo con su fecha. Las navegaciones (clasificar activos) viven en la
           sección de capital productivo del Resumen, junto al dato que explican. -->
      <div class="plan-toolbar">
        <RouterLink
          class="meta-pill plan-objective-link"
          to="/plan/setup"
          title="Editar objetivo y horizonte del plan"
        >
          Objetivo {{ plan.target_date.slice(0, 4) }}
        </RouterLink>
        <RouterLink
          v-if="preservationCopy"
          class="meta-pill plan-objective-link"
          to="/plan/setup"
          title="Patrimonio que no se toca: se exige además del capital que sostiene tu renta"
        >
          {{ preservationCopy }}
        </RouterLink>
        <label class="context-field">
          <span>Hipótesis</span>
          <ASelect
            v-model="activeScenario"
            :options="scenarioOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <!-- "Parámetros" y no "Supuestos": convivía con el selector "Hipótesis" y eran casi sinónimos. -->
        <AButton variant="ghost" @click="assumptionsOpen = true">Parámetros</AButton>
        <AButton variant="ghost" :loading="store.recalculating" @click="store.recalculate()">
          Recalcular
        </AButton>
        <span v-if="loading && projection" class="plan-muted" role="status">Actualizando…</span>
        <AMetaPill v-else-if="calculatedCopy">{{ calculatedCopy }}</AMetaPill>
      </div>

      <template v-if="activeTab === 'summary'">
        <PlanHero :plan="plan" :projection="projection" :foundations="store.foundations" />

        <!-- La tarjeta de fechas se retiró: el hero ya da fecha proyectada y desvío,
             y la pill "Objetivo" el año objetivo. Su hueco es de los cimientos,
             que son el porqué del plan y estaban enterrados al fondo. -->
        <div class="plan-main-grid">
          <ProductiveCapitalProgress :projection="projection" />
          <PlanFoundations :foundations="store.foundations" compact />
        </div>

        <section v-if="visibleRecommendations.length" class="sect plan-recommendations">
          <div class="sect-head">
            <div>
              <p class="eyebrow">Recomendaciones</p>
              <h2 class="sect-title">Siguiente acción</h2>
              <p class="sect-sub">Derivada del diagnóstico de tus cimientos.</p>
            </div>
          </div>
          <div class="plan-recommendation-list">
            <PlanRecommendationCard
              v-for="(recommendation, index) in visibleRecommendations"
              :key="recommendation.id"
              :recommendation="recommendation"
              :secondary="index > 0"
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
              <!-- Ghost: la primaria de la pantalla es el "Simular decisión" de la cabecera. -->
              <RouterLink class="btn btn-ghost" to="/plan/escenarios?create=1">
                Simular decisión
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

      <ProjectionAssumptionsDrawer
        :open="assumptionsOpen"
        :assumptions="projection.assumptions"
        @close="assumptionsOpen = false"
      />
    </template>
  </main>
</template>
