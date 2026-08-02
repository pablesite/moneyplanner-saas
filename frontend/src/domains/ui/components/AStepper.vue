<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
export type StepperStep = {
  id: string;
  label: string;
  meta?: string;
  status?: 'done' | 'current' | 'pending';
};

const props = withDefaults(
  defineProps<{
    steps: StepperStep[];
    activeId?: string | null;
    eyebrowPrefix?: string;
  }>(),
  {
    activeId: null,
    eyebrowPrefix: 'Paso',
  },
);

const emit = defineEmits<{ (e: 'change', id: string): void }>();
const stepperElement = ref<HTMLElement | null>(null);

function isCurrent(step: StepperStep): boolean {
  return props.activeId ? step.id === props.activeId : step.status === 'current';
}

watch(
  () => props.activeId,
  async () => {
    await nextTick();
    const stepper = stepperElement.value;
    const activeStep = stepper?.querySelector<HTMLElement>('.stepper-step.is-active');
    if (stepper && activeStep && stepper.scrollWidth > stepper.clientWidth) {
      activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  },
);
</script>

<template>
  <div ref="stepperElement" class="stepper" :style="{ '--n': steps.length }">
    <button
      v-for="(step, index) in steps"
      :key="step.id"
      type="button"
      class="stepper-step"
      :class="{
        'is-active': isCurrent(step),
        'is-done': step.status === 'done',
      }"
      :aria-current="isCurrent(step) ? 'step' : undefined"
      @click="emit('change', step.id)"
    >
      <div class="stepper-step-head">
        <span class="stepper-eyebrow">{{ eyebrowPrefix }} {{ index + 1 }}</span>
        <span class="stepper-badge" aria-hidden="true">
          <slot name="badge" :step="step">
            <span v-if="step.status === 'done'">✓</span>
          </slot>
        </span>
      </div>
      <div class="stepper-label">{{ step.label }}</div>
      <div v-if="step.meta" class="stepper-meta">{{ step.meta }}</div>
    </button>
  </div>
</template>
