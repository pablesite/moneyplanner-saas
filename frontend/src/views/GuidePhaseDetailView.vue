<script setup lang="ts">
import { RouterLink } from 'vue-router';
import APageHead from '@/domains/ui/components/APageHead.vue';
import GuidePhaseDiagnostics from '@/domains/guide/components/GuidePhaseDiagnostics.vue';
import GuidePhaseProgress from '@/domains/guide/components/GuidePhaseProgress.vue';
import GuidePhaseSummary from '@/domains/guide/components/GuidePhaseSummary.vue';
import { guidePhases, useGuidePhaseDetail } from '@/domains/guide';

const {
  store,
  formatNumber,
  selectedExtraordinaryEventGroup,
  phase,
  isCashFlowPhase,
  hasDiagnosticPhase,
  phaseQuickActions,
  phaseDiagnosticCopy,
  globalScoreValue,
  globalToneValue,
  globalLabelValue,
  phaseScores,
  scoreCards,
  summaryCards,
  cashFlowHeroSummaryCards,
  cashFlowContextSummarySections,
  cashFlowDistortionWarning,
  phase2DistributionInfoCards,
  phaseDetailTo,
  selectedExtraordinaryEventGroupLabel,
  extraordinaryEventGroupOptions,
  selectExtraordinaryEventGroup,
} = useGuidePhaseDetail('saas');
</script>

<template>
  <main class="page guide-detail">
    <APageHead
      :title="
        phase ? `Estado financiero · ${phase.title}` : 'Estado financiero · Ámbito no encontrado'
      "
    >
      <template v-if="phase" #meta>
        <span>Ámbito {{ phase.id }} de {{ guidePhases.length }}</span>
        <span class="dot"></span>
        <span>{{ phase.focus }}</span>
        <span class="dot"></span>
        <span>Actualizado hoy</span>
      </template>
      <template v-if="phaseQuickActions.length" #actions>
        <RouterLink
          v-for="action in phaseQuickActions"
          :key="action.id"
          class="btn btn-ghost"
          :to="action.to"
          >{{ action.label }}</RouterLink
        >
      </template>
    </APageHead>

    <GuidePhaseProgress
      :guide-phases="guidePhases"
      :phase="phase"
      :phase-scores="phaseScores"
      :phase-detail-to="phaseDetailTo"
    />

    <section v-if="!phase" class="guide-state guide-state-error">
      <p class="eyebrow">Vista no disponible</p>
      <h2>El ámbito seleccionado no existe</h2>
      <p>Vuelve al mapa del estado financiero para elegir uno de los cinco ámbitos actuales.</p>
      <RouterLink class="btn btn-primary" to="/estado-financiero">Ver estado financiero</RouterLink>
    </section>

    <section v-else-if="!hasDiagnosticPhase" class="guide-state">
      <p class="eyebrow">Próximo ámbito</p>
      <h2>Detalle en construcción</h2>
      <p>
        Este ámbito ya tiene contexto funcional, pero su diagnóstico detallado llegará en una
        entrega posterior.
      </p>
      <dl class="guide-state-facts">
        <div>
          <dt>Objetivo</dt>
          <dd>{{ phase.objective }}</dd>
        </div>
        <div>
          <dt>Foco operativo</dt>
          <dd>{{ phase.focus }}</dd>
        </div>
      </dl>
    </section>

    <section v-else class="sect guide-detail-panel">
      <div v-if="store.loading" class="guide-state guide-state-loading" aria-live="polite">
        <div class="guide-skeleton guide-skeleton-heading"></div>
        <div class="guide-skeleton guide-skeleton-panel"></div>
        <span>Cargando diagnóstico…</span>
      </div>
      <div v-else-if="store.error" class="guide-state guide-state-error" role="alert">
        <p class="eyebrow">No se pudo actualizar</p>
        <h2>El diagnóstico no está disponible</h2>
        <p>{{ store.error }}</p>
      </div>
      <div v-else class="guide-detail-grid">
        <GuidePhaseSummary
          :phase-id="phase.id"
          :phase-diagnostic-copy="phaseDiagnosticCopy"
          :is-cash-flow-phase="isCashFlowPhase"
          :cash-flow-hero-summary-cards="cashFlowHeroSummaryCards"
          :summary-cards="summaryCards"
          :cash-flow-distortion-warning="cashFlowDistortionWarning"
          :global-label-value="globalLabelValue"
          :global-score-value="globalScoreValue"
          :global-tone-value="globalToneValue"
          :score-cards="scoreCards"
          :format-number="formatNumber"
        />

        <GuidePhaseDiagnostics
          :is-cash-flow-phase="isCashFlowPhase"
          :cash-flow-context-summary-sections="cashFlowContextSummarySections"
          :extraordinary-event-group-options="extraordinaryEventGroupOptions"
          :selected-extraordinary-event-group-label="selectedExtraordinaryEventGroupLabel"
          :selected-extraordinary-event-group="selectedExtraordinaryEventGroup"
          :select-extraordinary-event-group="selectExtraordinaryEventGroup"
          :phase2-distribution-info-cards="phase2DistributionInfoCards"
        />
      </div>
    </section>
  </main>
</template>
