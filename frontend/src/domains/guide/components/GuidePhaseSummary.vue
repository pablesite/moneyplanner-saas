<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';
import ScoreGrade from './ScoreGrade.vue';
import ScoreMeterRow from './ScoreMeterRow.vue';

type ScoreKpi = {
  id: string;
  label: string;
  valueText: string;
  score: number | null;
  hint: string;
  detailText?: string;
  incomplete?: boolean;
};
type ScoreCard = {
  id: string;
  title: string;
  score: number;
  description: string;
  kpis: ScoreKpi[];
};
type SummaryCard = {
  id: string;
  label: string;
  valueText: string;
  valueTone?: 'neutral' | 'positive' | 'negative' | 'warning';
  metaText?: string;
};

const props = defineProps<{
  phaseId: number;
  phaseDiagnosticCopy: string;
  isCashFlowPhase: boolean;
  cashFlowHeroSummaryCards: SummaryCard[];
  summaryCards: SummaryCard[];
  cashFlowDistortionWarning: string | null;
  globalLabelValue: string;
  globalScoreValue: number;
  globalToneValue: 'solid' | 'medium' | 'watch' | 'risk';
  scoreCards: ScoreCard[];
  formatNumber: (value: number, fractionDigits?: number) => string;
}>();

const grade = computed(() => gradeFromScore(props.globalScoreValue));
const visibleSummaryCards = computed(() =>
  props.isCashFlowPhase ? props.cashFlowHeroSummaryCards : props.summaryCards,
);
</script>

<template>
  <div class="guide-score-column">
    <div class="guide-score-hero">
      <div class="guide-score-heading">
        <p class="eyebrow">Puntuación del ámbito</p>
        <ScoreGrade :score="globalScoreValue" />
      </div>
      <div class="guide-score-value mono" :class="`grade-${grade.toLowerCase()}`">
        {{ formatNumber(globalScoreValue, 0) }}<span>/100</span>
      </div>
      <strong class="guide-score-label">{{ globalLabelValue }}</strong>
      <p class="guide-score-copy">{{ phaseDiagnosticCopy }}</p>
      <ScoreMeterRow :score="globalScoreValue" row-class="guide-score-progress" />
      <div class="guide-score-progress-meta">
        <span>Ámbito {{ phaseId }}</span>
        <span>{{ formatNumber(Math.max(0, 100 - globalScoreValue), 0) }}% restante</span>
      </div>
    </div>

    <div v-if="visibleSummaryCards.length" class="guide-summary-band">
      <article v-for="card in visibleSummaryCards" :key="card.id" class="guide-summary-item">
        <span>{{ card.label }}</span>
        <strong :class="card.valueTone ? `tone-${card.valueTone}` : ''">{{
          card.valueText
        }}</strong>
        <small v-if="card.metaText">{{ card.metaText }}</small>
      </article>
    </div>

    <p v-if="cashFlowDistortionWarning" class="guide-warning">{{ cashFlowDistortionWarning }}</p>

    <div class="guide-score-cards">
      <article v-for="card in scoreCards" :key="card.id" class="guide-score-card">
        <header>
          <div>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
          <div class="guide-card-score mono">
            <ScoreGrade :score="card.score" variant="label" />
            <span>{{ formatNumber(card.score, 0) }}/100</span>
          </div>
        </header>
        <div class="guide-score-kpis">
          <div v-for="kpi in card.kpis" :key="kpi.id" class="guide-score-kpi">
            <div class="guide-score-kpi-head">
              <span>{{ kpi.label }}</span>
              <strong
                >{{ kpi.valueText
                }}<span v-if="kpi.incomplete" class="guide-kpi-alert">!</span></strong
              >
            </div>
            <ScoreMeterRow v-if="kpi.score != null" :score="kpi.score" />
            <span v-else class="guide-info-label">Indicador informativo · no puntúa</span>
            <p>{{ kpi.hint }}</p>
            <p v-if="kpi.detailText">{{ kpi.detailText }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
