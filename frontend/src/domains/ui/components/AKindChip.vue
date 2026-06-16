<script setup lang="ts">
defineProps<{
  tone?: 'default' | 'asset' | 'liability' | 'muted';
  active?: boolean;
}>();
</script>

<template>
  <span
    class="chip ui-a-kind-chip"
    :class="[tone ? `ui-a-kind-chip-${tone}` : 'ui-a-kind-chip-default', { active }]"
  >
    <slot />
  </span>
</template>
