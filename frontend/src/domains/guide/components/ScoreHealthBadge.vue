<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';

const props = defineProps<{
  label: string;
  score: number;
  tone: 'solid' | 'medium' | 'watch' | 'risk';
  formattedScore?: string;
}>();
const grade = computed(() => gradeFromScore(props.score));
</script>

<template>
  <div class="guide-health" :class="[`grade-${grade.toLowerCase()}`, `tone-${tone}`]">
    <span>{{ label }}</span>
    <strong class="mono">{{ formattedScore ?? `${Math.round(score)}%` }}</strong>
  </div>
</template>
