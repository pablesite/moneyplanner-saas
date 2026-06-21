<script setup lang="ts">
type SummaryCard = {
  id: string;
  label: string;
  valueText: string;
  valueTone?: 'neutral' | 'positive' | 'negative' | 'warning';
  metaText?: string;
};
type SummarySection = {
  id: string;
  title: string;
  description?: string;
  columns: 2 | 4;
  cards: SummaryCard[];
};
type ScoreKpi = { id: string; label: string; valueText: string; hint: string };
type InfoCard = { id: string; title: string; description: string; kpis: ScoreKpi[] };

defineProps<{
  isCashFlowPhase: boolean;
  cashFlowContextSummarySections: SummarySection[];
  extraordinaryEventGroupOptions: string[];
  selectedExtraordinaryEventGroupLabel: string;
  selectedExtraordinaryEventGroup: string;
  selectExtraordinaryEventGroup: (eventGroup: string, event: MouseEvent) => void;
  phase2DistributionInfoCards: InfoCard[];
}>();
</script>

<template>
  <div class="guide-diagnostics">
    <div class="sect-head guide-diagnostics-head">
      <div>
        <div class="sect-title-row">
          <h2 class="sect-title">Diagnóstico</h2>
          <span class="sect-count">Indicadores reales</span>
        </div>
        <p class="sect-sub">Las palancas que explican la puntuación de esta fase.</p>
      </div>
    </div>

    <details v-if="isCashFlowPhase" class="guide-context-details">
      <summary>
        <span>Ver contexto completo</span>
        <small>Flujo, asignación patrimonial y extraordinarios</small>
      </summary>

      <div class="guide-context-content">
        <section
          v-for="section in cashFlowContextSummarySections"
          :key="section.id"
          class="guide-context-section"
        >
          <header>
            <div>
              <h3>{{ section.title }}</h3>
              <p v-if="section.description">{{ section.description }}</p>
            </div>
            <details
              v-if="
                section.id === 'cashflow-extraordinary' && extraordinaryEventGroupOptions.length
              "
              class="guide-event-filter"
            >
              <summary>{{ selectedExtraordinaryEventGroupLabel }} <span>⌄</span></summary>
              <div role="listbox" aria-label="Evento">
                <button
                  type="button"
                  :class="{ on: selectedExtraordinaryEventGroup === 'all' }"
                  @click="selectExtraordinaryEventGroup('all', $event)"
                >
                  Todos los eventos
                </button>
                <button
                  v-for="eventGroup in extraordinaryEventGroupOptions"
                  :key="eventGroup"
                  type="button"
                  :class="{ on: selectedExtraordinaryEventGroup === eventGroup }"
                  @click="selectExtraordinaryEventGroup(eventGroup, $event)"
                >
                  {{ eventGroup }}
                </button>
              </div>
            </details>
          </header>
          <div class="guide-context-grid" :class="`cols-${section.columns}`">
            <article v-for="card in section.cards" :key="card.id">
              <span>{{ card.label }}</span>
              <strong :class="card.valueTone ? `tone-${card.valueTone}` : ''">{{
                card.valueText
              }}</strong>
              <small v-if="card.metaText">{{ card.metaText }}</small>
            </article>
          </div>
        </section>

        <article v-for="card in phase2DistributionInfoCards" :key="card.id" class="guide-info-card">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <dl>
            <div v-for="kpi in card.kpis" :key="kpi.id">
              <dt>{{ kpi.label }}</dt>
              <dd>{{ kpi.valueText }}</dd>
              <small>{{ kpi.hint }}</small>
            </div>
          </dl>
        </article>
      </div>
    </details>

    <p v-else class="guide-diagnostics-note">
      Revisa cada indicador para entender qué mejora tendría más impacto en la fase actual.
    </p>
  </div>
</template>
