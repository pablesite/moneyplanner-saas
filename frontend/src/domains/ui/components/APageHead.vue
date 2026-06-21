<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
}>();
</script>

<template>
  <header class="page-head">
    <div class="ui-a-page-head-copy">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <div v-if="$slots.meta" class="page-meta">
        <slot name="meta" />
      </div>
    </div>
    <div v-if="$slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </header>
</template>
