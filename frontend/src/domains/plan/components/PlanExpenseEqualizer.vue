<script setup lang="ts">
// Ecualizador de gastos del asistente: una barra vertical por categoría,
// condicionado a los ingresos declarados en el paso anterior. Subir una barra
// nunca rebasa el total: se frena en lo que queda libre (más predecible que
// bajar las demás solas). El campo numérico de debajo es el ajuste fino.
import { computed } from 'vue';
import { formatMoney } from '@/lib/format';

const props = defineProps<{
  fields: Array<{ value: string; label: string }>;
  modelValue: Record<string, string>;
  /** Ingresos mensuales declarados; null cuando no hay tope que aplicar. */
  monthlyIncome: number | null;
}>();

const emit = defineEmits<{ 'update:modelValue': [Record<string, string>] }>();

const amounts = computed<Record<string, number>>(() =>
  Object.fromEntries(
    props.fields.map((field) => [field.value, Number(props.modelValue[field.value] || 0)]),
  ),
);

const totalAssigned = computed(() =>
  Object.values(amounts.value).reduce((sum, value) => sum + value, 0),
);

const income = computed(() =>
  props.monthlyIncome != null && props.monthlyIncome > 0 ? props.monthlyIncome : null,
);

const remaining = computed(() =>
  income.value != null ? Math.max(0, income.value - totalAssigned.value) : null,
);

// Escala común de todas las barras: los ingresos (o un tope razonable sin ellos).
const sliderMax = computed(() => {
  const base = income.value ?? Math.max(3000, totalAssigned.value);
  return Math.ceil(base / 100) * 100;
});

function setAmount(field: string, raw: number): void {
  let value = Math.max(0, Math.round(Number.isFinite(raw) ? raw : 0));
  if (income.value != null) {
    const othersTotal = totalAssigned.value - (amounts.value[field] ?? 0);
    value = Math.min(value, Math.max(0, income.value - othersTotal));
  }
  emit('update:modelValue', { ...props.modelValue, [field]: value > 0 ? String(value) : '' });
}

function onInput(field: string, event: Event): void {
  setAmount(field, Number((event.target as HTMLInputElement).value));
}
</script>

<template>
  <div class="plan-eq">
    <div v-if="income != null" class="plan-eq-summary" aria-live="polite">
      <span>Ingresos {{ formatMoney(income) }}/mes</span>
      <span>Asignado {{ formatMoney(totalAssigned) }}/mes</span>
      <strong :class="{ pos: remaining != null && remaining > 0 }">
        Libre {{ formatMoney(remaining ?? 0) }}/mes
      </strong>
    </div>

    <div class="plan-eq-board">
      <div v-for="field in fields" :key="field.value" class="plan-eq-col">
        <span class="plan-eq-amount mono">
          {{ amounts[field.value] ? formatMoney(amounts[field.value]!) : '—' }}
        </span>
        <input
          type="range"
          class="plan-eq-slider"
          min="0"
          :max="sliderMax"
          step="25"
          :value="amounts[field.value]"
          :aria-label="`${field.label} (€/mes)`"
          @input="onInput(field.value, $event)"
        />
        <input
          class="input plan-eq-input"
          type="number"
          inputmode="decimal"
          min="0"
          step="10"
          :value="modelValue[field.value]"
          :aria-label="`${field.label}, importe exacto en euros al mes`"
          @change="onInput(field.value, $event)"
        />
        <span class="plan-eq-label">{{ field.label }}</span>
      </div>
    </div>
  </div>
</template>
