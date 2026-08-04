<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

type MenuItem = {
  id: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
};

defineProps<{
  items: MenuItem[];
  label?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);

function toggleMenu(): void {
  open.value = !open.value;
}

function closeMenu(restoreFocus = false): void {
  const wasOpen = open.value;
  open.value = false;
  if (wasOpen && restoreFocus) trigger.value?.focus();
}

function onSelect(id: string): void {
  emit('select', id);
  closeMenu();
}

function handleDocumentClick(event: MouseEvent): void {
  const target = event.target as Node | null;
  if (!open.value || !target) return;
  if (root.value && !root.value.contains(target)) {
    closeMenu();
  }
}

document.addEventListener('click', handleDocumentClick);

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <!-- Esc cierra el menú y devuelve el foco al disparador: sin esto solo se podía
       salir con el ratón o tabulando fuera. -->
  <div ref="root" class="row-menu-wrap" @keydown.esc.stop="closeMenu(true)">
    <button
      ref="trigger"
      class="btn btn-icon"
      type="button"
      :aria-expanded="open"
      :aria-label="label ?? 'Acciones de fila'"
      @click.stop="toggleMenu"
    >
      <span aria-hidden="true">...</span>
    </button>
    <div v-if="open" class="row-menu" role="menu">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        :class="{ danger: item.danger }"
        :disabled="item.disabled"
        role="menuitem"
        @click="onSelect(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
