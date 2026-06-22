<script setup lang="ts">
import { computed } from 'vue';
import { ADonut, type ADonutSlice } from '@/domains/ui';

// Donut estructural de Patrimonio: capital propio + deuda respaldada + deuda no
// respaldada (juntas suman el total de activos). Calcula los sectores y delega el
// render en ADonut (primitiva genérica).
type Props = {
  totalAssets: string | number | null | undefined;
  totalLiabilities?: string | number | null | undefined;
  netWorth: string | number | null | undefined;
  unit: string;
  assetBackedLiabilities?: string | number | null | undefined;
  unbackedLiabilities?: string | number | null | undefined;
  centerLabel?: string | undefined;
  centerValue?: string | undefined;
  size?: number | undefined;
  thickness?: number | undefined;
  // Aceptado por compatibilidad con la composición previa; ya no se renderiza.
  showComposition?: boolean | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  thickness: 14,
});

function normalizeNumberInput(raw: unknown) {
  return String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}

function toNumber(v: unknown) {
  const n = Number(normalizeNumberInput(v));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number, decimals = 2) {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

const displayUnit = computed(() => (props.unit === 'EUR' ? '€' : props.unit));

const assets = computed(() => Math.max(0, toNumber(props.totalAssets)));
const backedRaw = computed(() => Math.max(0, toNumber(props.assetBackedLiabilities)));
const unbackedRaw = computed(() => Math.max(0, toNumber(props.unbackedLiabilities)));

const backedSlice = computed(() => Math.min(backedRaw.value, assets.value));
const unbackedSlice = computed(() => {
  const room = Math.max(assets.value - backedSlice.value, 0);
  return Math.min(unbackedRaw.value, room);
});
const equitySlice = computed(() =>
  Math.max(assets.value - backedSlice.value - unbackedSlice.value, 0),
);

// Composición estructural: capital propio + deuda respaldada + deuda no respaldada.
// Tonos del handoff (NW_STRUCTURE).
const slices = computed<ADonutSlice[]>(() =>
  [
    {
      key: 'equity',
      label: 'Capital propio',
      value: equitySlice.value,
      color: 'oklch(0.74 0.13 148)',
    },
    {
      key: 'backed',
      label: 'Deuda respaldada',
      value: backedSlice.value,
      color: 'oklch(0.74 0.13 45)',
    },
    {
      key: 'unbacked',
      label: 'Deuda no respaldada',
      value: unbackedSlice.value,
      color: 'oklch(0.74 0.13 24)',
    },
  ]
    .filter((s) => s.value > 0)
    .map((s) => ({ ...s, hoverValue: `${formatMoney(s.value, 0)} ${displayUnit.value}` })),
);

const centerEyebrow = computed(() => props.centerLabel ?? 'Patrimonio neto');
const centerValue = computed(
  () => props.centerValue ?? `${formatMoney(toNumber(props.netWorth), 2)} ${displayUnit.value}`,
);
</script>

<template>
  <ADonut
    :slices="slices"
    :center-eyebrow="centerEyebrow"
    :center-value="centerValue"
    :size="size"
    :thickness="thickness"
    aria-label="Composición del patrimonio"
  />
</template>
