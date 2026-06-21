<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { GuidePhase } from '@/domains/guide';
import ScoreGradeBadge from './ScoreGradeBadge.vue';

defineProps<{
  guidePhases: GuidePhase[];
  phase: GuidePhase | null;
  phaseScores: Record<number, number>;
  phaseDetailTo: (phaseId: number) => string;
}>();
</script>

<template>
  <section class="sect" aria-label="Estado por ámbitos">
    <ol class="guide-phase-strip guide-phase-strip-compact">
      <li v-for="phaseItem in guidePhases" :key="phaseItem.id">
        <RouterLink
          class="guide-phase-step"
          :class="{
            'is-active': phaseItem.id === phase?.id,
            'is-done': (phaseScores[phaseItem.id] ?? phaseItem.progress) >= 100,
          }"
          :to="phaseDetailTo(phaseItem.id)"
        >
          <div class="guide-phase-head">
            <span class="guide-phase-eyebrow">Ámbito {{ phaseItem.id }}</span>
            <ScoreGradeBadge :score="phaseScores[phaseItem.id] ?? phaseItem.progress" />
          </div>
          <strong class="guide-phase-label">{{ phaseItem.title }}</strong>
          <span class="guide-phase-score mono">
            {{ Math.round(phaseScores[phaseItem.id] ?? phaseItem.progress) }}/100
          </span>
        </RouterLink>
      </li>
    </ol>
  </section>
</template>
