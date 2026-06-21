<script setup lang="ts">
import { computed } from 'vue';
import { gradeFromScore } from '@/domains/guide/scoreVisuals';

const props = defineProps<{ score: number }>();
const grade = computed(() => gradeFromScore(props.score));
</script>

<template>
  <span class="guide-grade" :class="`grade-${grade.toLowerCase()}`">{{ grade }}</span>
</template>
