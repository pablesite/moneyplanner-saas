<script setup lang="ts">
import { ref, watch } from 'vue';
import { AChevron } from '@/domains/ui';

const props = withDefaults(
  defineProps<{
    defaultOpen?: boolean;
    variant?: 'group' | 'breakdown';
  }>(),
  {
    defaultOpen: false,
    variant: 'group',
  },
);

const expanded = ref(props.defaultOpen);

watch(
  () => props.defaultOpen,
  (value) => {
    expanded.value = value;
  },
);

function handleToggle(event: Event): void {
  expanded.value = (event.currentTarget as HTMLDetailsElement).open;
}
</script>

<template>
  <details
    class="mc-disclosure"
    :class="`mc-disclosure-${variant}`"
    :open="defaultOpen"
    @toggle="handleToggle"
  >
    <summary>
      <AChevron :expanded="expanded" />
      <div class="mc-disclosure-summary">
        <slot name="summary" />
      </div>
    </summary>
    <div class="mc-disclosure-body">
      <slot />
    </div>
  </details>
</template>
