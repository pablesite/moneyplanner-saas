<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';

const props = withDefaults(defineProps<{ score: number; large?: boolean }>(), { large: false });
const grade = computed(() => gradeFromScore(props.score));
</script>

<template>
  <span
    class="guide-grade-label"
    :class="[`grade-${grade.toLowerCase()}`, { 'is-large': large }]"
    >{{ grade }}</span
  >
</template>
