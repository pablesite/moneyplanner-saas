<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

// El template tiene dos root nodes (trigger + Teleport del panel), así que Vue
// no puede heredar los $attrs automáticamente. Los reenviamos a mano al botón
// trigger para que las clases del consumidor (.filter-ctrl, .select, etc.) y
// atributos como aria-label apliquen sobre el control visible.
defineOptions({ inheritAttrs: false });

export type ASelectOption = {
  value: string | number | null;
  label: string;
  disabled?: boolean;
};

export type ASelectGroup = {
  group: string;
  options: ASelectOption[];
};

export type ASelectItem = ASelectOption | ASelectGroup;

type RenderItem =
  | { kind: 'sep'; label: string; isFirst: boolean }
  | { kind: 'opt'; opt: ASelectOption; flatIdx: number };

function isGroup(item: ASelectItem): item is ASelectGroup {
  return 'group' in item;
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    options: ASelectItem[];
    disabled?: boolean;
    searchable?: boolean;
  }>(),
  { disabled: false, searchable: undefined },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();

const open = ref(false);
const query = ref('');
const triggerRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const highlightIdx = ref(0);
const panelStyle = ref<Record<string, string>>({});

const allFlat = computed<ASelectOption[]>(() =>
  props.options.flatMap((item) => (isGroup(item) ? item.options : [item as ASelectOption])),
);

const isSearchable = computed(() =>
  props.searchable !== undefined ? props.searchable : allFlat.value.length > 8,
);

const selectedLabel = computed(() => {
  const found = allFlat.value.find((o) => String(o.value) === String(props.modelValue));
  return found?.label ?? '—';
});

const filtered = computed<ASelectItem[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.flatMap((item): ASelectItem[] => {
    if (isGroup(item)) {
      const opts = item.options.filter((o) => o.label.toLowerCase().includes(q));
      return opts.length ? [{ group: item.group, options: opts }] : [];
    }
    return (item as ASelectOption).label.toLowerCase().includes(q) ? [item as ASelectOption] : [];
  });
});

const renderable = computed<RenderItem[]>(() => {
  const items: RenderItem[] = [];
  let flatIdx = 0;
  let groupCount = 0;
  for (const item of filtered.value) {
    if (isGroup(item)) {
      items.push({ kind: 'sep', label: item.group, isFirst: groupCount === 0 });
      groupCount++;
      for (const opt of item.options) {
        items.push({ kind: 'opt', opt, flatIdx: flatIdx++ });
      }
    } else {
      items.push({ kind: 'opt', opt: item, flatIdx: flatIdx++ });
    }
  }
  return items;
});

const filteredFlatLen = computed(() => renderable.value.filter((r) => r.kind === 'opt').length);

function computePosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom;
  const above = rect.top;
  if (below >= 200 || below >= above) {
    panelStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      minWidth: `${Math.max(rect.width, 180)}px`,
    };
  } else {
    panelStyle.value = {
      bottom: `${window.innerHeight - rect.top + 4}px`,
      left: `${rect.left}px`,
      minWidth: `${Math.max(rect.width, 180)}px`,
    };
  }
}

async function openPanel() {
  if (props.disabled) return;
  open.value = true;
  query.value = '';
  const currentIdx = allFlat.value.findIndex((o) => String(o.value) === String(props.modelValue));
  highlightIdx.value = Math.max(0, currentIdx);
  await nextTick();
  computePosition();
  if (isSearchable.value) searchRef.value?.focus();
}

function closePanel() {
  open.value = false;
  query.value = '';
}

function togglePanel() {
  if (open.value) closePanel();
  else openPanel();
}

function pickOption(value: string | number | null) {
  emit('update:modelValue', value);
  closePanel();
  triggerRef.value?.focus();
}

function scrollHighlighted() {
  nextTick(() => {
    panelRef.value?.querySelector('.a-select-opt--hi')?.scrollIntoView({ block: 'nearest' });
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    closePanel();
    triggerRef.value?.focus();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    highlightIdx.value = Math.min(highlightIdx.value + 1, filteredFlatLen.value - 1);
    scrollHighlighted();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    highlightIdx.value = Math.max(highlightIdx.value - 1, 0);
    scrollHighlighted();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const r = renderable.value.find((r) => r.kind === 'opt' && r.flatIdx === highlightIdx.value);
    if (r && r.kind === 'opt' && !r.opt.disabled) pickOption(r.opt.value);
  }
}

function onOutsideMousedown(e: MouseEvent) {
  if (!open.value) return;
  const target = e.target as Node;
  if (!triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) closePanel();
}

onMounted(() => document.addEventListener('mousedown', onOutsideMousedown, true));
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideMousedown, true));

watch(query, () => {
  highlightIdx.value = 0;
});
</script>

<template>
  <button
    ref="triggerRef"
    type="button"
    class="a-select-trigger"
    :class="{ 'a-select-open': open }"
    :disabled="disabled"
    aria-haspopup="listbox"
    :aria-expanded="open"
    v-bind="$attrs"
    @click="togglePanel"
    @keydown="handleKeydown"
  >
    <span class="a-select-label">{{ selectedLabel }}</span>
    <span class="a-select-caret" aria-hidden="true" />
  </button>

  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="a-select-panel dir-a"
      role="listbox"
      :style="panelStyle"
      @keydown.stop="handleKeydown"
    >
      <div v-if="isSearchable" class="a-select-search">
        <input
          ref="searchRef"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Buscar..."
          class="a-select-search-input"
        />
      </div>
      <div class="a-select-list">
        <template v-if="filteredFlatLen > 0">
          <template v-for="(item, i) in renderable" :key="i">
            <div
              v-if="item.kind === 'sep'"
              class="a-select-sep"
              :class="{ 'a-select-sep--first': item.isFirst }"
            >
              {{ item.label }}
            </div>
            <button
              v-else
              type="button"
              class="a-select-opt"
              :class="{
                'a-select-opt--sel': String(item.opt.value) === String(modelValue),
                'a-select-opt--hi': item.flatIdx === highlightIdx,
                'a-select-opt--dis': item.opt.disabled,
              }"
              role="option"
              :aria-selected="String(item.opt.value) === String(modelValue)"
              :disabled="item.opt.disabled"
              @click.stop="pickOption(item.opt.value)"
              @mouseenter="highlightIdx = item.flatIdx"
            >
              <span>{{ item.opt.label }}</span>
              <span
                v-if="String(item.opt.value) === String(modelValue)"
                class="a-select-check"
                aria-hidden="true"
                >✓</span
              >
            </button>
          </template>
        </template>
        <div v-else class="a-select-empty">Sin resultados</div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* ── ASelect trigger ──────────────────────────────────────────────────── */

.a-select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  cursor: pointer;
  user-select: none;
  /* Reset browser button defaults */
  -webkit-appearance: none;
  appearance: none;
  font: inherit;
  font-weight: 400;
  letter-spacing: normal;
  -webkit-font-smoothing: antialiased;
}

.a-select-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.a-select-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.a-select-caret {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg) translateY(-2px);
  opacity: 0.45;
  transition: transform 0.15s;
}

.a-select-open .a-select-caret {
  transform: rotate(225deg) translateY(2px);
}

/* ── Panel ────────────────────────────────────────────────────────────── */

.a-select-panel.dir-a {
  position: fixed;
  z-index: 9999;
  max-width: min(360px, calc(100vw - 24px));
  max-height: 320px;
  display: flex;
  flex-direction: column;
  background: oklch(13% 0.01 250 / 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

/* ── Search ───────────────────────────────────────────────────────────── */

.a-select-search {
  padding: 8px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}

.a-select-search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--text);
  font: inherit;
  font-size: 12px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.a-select-search-input:focus {
  border-color: var(--accent);
}

/* hide native search cancel button */
.a-select-search-input::-webkit-search-cancel-button {
  display: none;
}

/* ── List ─────────────────────────────────────────────────────────────── */

.a-select-list {
  overflow-y: auto;
  padding: 4px;
  flex: 1;
}

/* ── Group separator ──────────────────────────────────────────────────── */

.a-select-sep {
  padding: 8px 10px 2px;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
  font-weight: 600;
  border-top: 1px solid var(--line);
  margin-top: 4px;
}

.a-select-sep--first {
  border-top: none;
  margin-top: 0;
  padding-top: 4px;
}

/* ── Option ───────────────────────────────────────────────────────────── */

.a-select-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.08s;
}

.a-select-opt:hover,
.a-select-opt--hi {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.a-select-opt--sel {
  color: var(--accent);
}

.a-select-opt--sel.a-select-opt--hi,
.a-select-opt--sel:hover {
  background: color-mix(in oklab, var(--accent) 12%, transparent);
}

.a-select-opt--dis {
  opacity: 0.38;
  cursor: not-allowed;
}

.a-select-check {
  font-size: 11px;
  color: var(--accent);
  flex-shrink: 0;
  margin-left: 8px;
}

.a-select-empty {
  padding: 20px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
</style>
