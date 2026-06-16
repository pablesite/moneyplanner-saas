<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

let modalIdCounter = 0;

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    panelClass?: string;
    bodyClass?: string;
    closeOnBackdrop?: boolean;
    variant?: 'default' | 'sheet';
  }>(),
  {
    closeOnBackdrop: false,
    variant: 'default',
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const titleId = `base-modal-title-${++modalIdCounter}`;

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

function onBackdropClick() {
  if (!props.closeOnBackdrop) return;
  emit('close');
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-5"
      :class="props.variant === 'sheet' ? 'ui-modal-backdrop' : 'bg-black/55'"
      @click.self="onBackdropClick"
    >
      <div
        class="flex max-h-[calc(100vh-2rem)] w-full max-w-[720px] flex-col overflow-hidden sm:max-h-[calc(100vh-2.5rem)]"
        :class="[
          props.variant === 'sheet'
            ? 'ui-modal-panel'
            : 'rounded-lg border border-white/10 bg-[#121212fa] shadow-2xl',
          panelClass,
        ]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
      >
        <div
          :class="
            props.variant === 'sheet'
              ? 'ui-modal-head'
              : 'flex items-center gap-3 border-b border-white/10 px-4 py-3.5'
          "
        >
          <slot name="header">
            <div
              :id="titleId"
              :class="props.variant === 'sheet' ? 'ui-modal-title' : 'text-base font-semibold'"
            >
              {{ title }}
            </div>
            <button
              :class="
                props.variant === 'sheet'
                  ? 'ui-modal-close'
                  : 'ml-auto rounded-md border border-white/10 px-2 py-1 text-sm text-white/70 transition hover:border-white/20 hover:text-white'
              "
              type="button"
              aria-label="Cerrar modal"
              @click="emit('close')"
            >
              Cerrar
            </button>
          </slot>
        </div>

        <div
          class="overflow-y-auto"
          :class="[props.variant === 'sheet' ? 'ui-modal-body' : 'px-4 py-3.5', bodyClass]"
        >
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
