<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';
import ScoreGradeLabel from './ScoreGradeLabel.vue';

const props = withDefaults(
  defineProps<{
    score: number;
    largeGrade?: boolean;
    rowClass?: string;
    trackClass?: string;
    fillClass?: string;
    gradeClass?: string;
  }>(),
  { largeGrade: false, rowClass: '', trackClass: '', fillClass: '', gradeClass: '' },
);

const value = computed(() => Math.max(0, Math.min(100, props.score)));
const grade = computed(() => gradeFromScore(props.score));
</script>

<template>
  <div class="guide-meter-row" :class="rowClass">
    <ScoreGradeLabel :score="score" :large="largeGrade" :class="gradeClass" />
    <progress
      class="guide-meter"
      :class="[`grade-${grade.toLowerCase()}`, trackClass, fillClass]"
      :value="value"
      max="100"
      :aria-label="`Puntuación ${Math.round(value)} de 100`"
    ></progress>
  </div>
</template>
