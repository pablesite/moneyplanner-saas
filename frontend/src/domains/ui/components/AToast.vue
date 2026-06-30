<script setup lang="ts">
// Toast de confirmación transitorio (teleport a body). Gestiona su propio
// temporizador de auto-descarte y emite `close` al expirar para que el padre
// limpie su estado. El mensaje va por slot (o prop `message`).
import { onBeforeUnmount, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    message?: string | null;
    tone?: 'success' | 'error';
    duration?: number;
    icon?: string;
  }>(),
  { tone: 'success', duration: 3200 },
);

const emit = defineEmits<{ (e: 'close'): void }>();

let timer: ReturnType<typeof setTimeout> | null = null;

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

watch(
  () => props.open,
  (open) => {
    clearTimer();
    if (!open || props.duration <= 0) return;
    timer = setTimeout(() => {
      timer = null;
      emit('close');
    }, props.duration);
  },
  { immediate: true },
);

onBeforeUnmount(clearTimer);
</script>

<template>
  <Teleport to="body">
    <Transition name="ui-toast">
      <div
        v-if="open"
        class="ui-toast"
        :class="{ 'ui-toast-error': tone === 'error' }"
        role="status"
        aria-live="polite"
      >
        <span class="ui-toast-icon" aria-hidden="true">{{
          icon ?? (tone === 'error' ? '!' : '✓')
        }}</span>
        <span
          ><slot>{{ message }}</slot></span
        >
      </div>
    </Transition>
  </Teleport>
</template>
