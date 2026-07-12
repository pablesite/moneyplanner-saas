<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AState } from '@/domains/ui';
import { planApi } from '@/domains/plan/api';
import type { PlanEventBudgetLines } from '@/domains/plan/types';
import { toApiErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/format';

const props = defineProps<{ eventId: number }>();

const trace = ref<PlanEventBudgetLines | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

function total(lines: { amount_annual: string }[]): number {
  return lines.reduce((sum, line) => sum + Number(line.amount_annual), 0);
}

const spent = computed(() => (trace.value ? total(trace.value.expenses) : 0));
const received = computed(() => (trace.value ? total(trace.value.income) : 0));
/** Deuda que trajo la decisión. La gobierna Patrimonio; aquí solo se cuenta. */
const debt = computed(() =>
  trace.value
    ? trace.value.linked.liabilities.reduce((sum, liability) => sum + Number(liability.amount), 0)
    : 0,
);
const owned = computed(() =>
  trace.value ? trace.value.linked.assets.reduce((sum, asset) => sum + Number(asset.amount), 0) : 0,
);

const hasAnything = computed(
  () =>
    Boolean(trace.value) &&
    (trace.value!.expenses.length > 0 ||
      trace.value!.income.length > 0 ||
      trace.value!.linked.liabilities.length > 0 ||
      trace.value!.linked.assets.length > 0),
);

onMounted(async () => {
  try {
    const { data } = await planApi.getEventBudgetLines(props.eventId);
    trace.value = data;
  } catch (err) {
    error.value = toApiErrorMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="plan-event-impact">
    <AState v-if="loading" status="loading" layout="inline">Cargando impacto...</AState>
    <AState v-else-if="error" status="error" layout="inline">{{ error }}</AState>
    <AState v-else-if="!hasAnything" status="empty" layout="inline">
      Esta decisión no tiene partidas ni posiciones asociadas.
    </AState>

    <template v-else-if="trace">
      <dl class="plan-impact-figures">
        <div v-if="spent">
          <dt>Desembolso</dt>
          <dd class="mono">{{ formatMoney(spent) }}</dd>
        </div>
        <!-- Neutro a propósito: una decisión puede contraer una deuda o cancelarla,
             comprar un activo o venderlo. "Vinculado" es cierto en los dos sentidos. -->
        <div v-if="debt">
          <dt>Pasivo vinculado</dt>
          <dd class="mono neg">{{ formatMoney(debt) }}</dd>
        </div>
        <div v-if="owned">
          <dt>Activo vinculado</dt>
          <dd class="mono">{{ formatMoney(owned) }}</dd>
        </div>
        <div v-if="received">
          <dt>Ingreso</dt>
          <dd class="mono pos">{{ formatMoney(received) }}</dd>
        </div>
      </dl>

      <div
        v-if="trace.linked.liabilities.length || trace.linked.assets.length"
        class="plan-impact-block"
      >
        <p class="eyebrow">En Patrimonio</p>
        <p class="plan-impact-hint">
          Los mueve esta decisión, pero los gestiona Patrimonio: es quien genera sus cuotas.
        </p>
        <div
          v-for="liability in trace.linked.liabilities"
          :key="`liability:${liability.id}`"
          class="plan-impact-row"
        >
          <span>
            <strong>{{ liability.name }}</strong>
            <small v-if="Number(liability.generated_expense_annual)">
              Genera {{ formatMoney(liability.generated_expense_annual) }} de cuotas
            </small>
          </span>
          <span class="mono neg">{{ formatMoney(liability.amount) }}</span>
        </div>
        <div
          v-for="asset in trace.linked.assets"
          :key="`asset:${asset.id}`"
          class="plan-impact-row"
        >
          <span>
            <strong>{{ asset.name }}</strong>
          </span>
          <span class="mono">{{ formatMoney(asset.amount) }}</span>
        </div>
      </div>

      <div v-if="trace.expenses.length || trace.income.length" class="plan-impact-block">
        <p class="eyebrow">En Presupuesto</p>
        <div v-for="line in trace.expenses" :key="`expense:${line.id}`" class="plan-impact-row">
          <span>
            <strong>{{ line.name }}</strong>
            <small>{{ line.fiscal_year }}</small>
          </span>
          <span class="mono">{{ formatMoney(line.amount_annual) }}</span>
        </div>
        <div v-for="line in trace.income" :key="`income:${line.id}`" class="plan-impact-row">
          <span>
            <strong>{{ line.name }}</strong>
            <small>{{ line.fiscal_year }}</small>
          </span>
          <span class="mono pos">{{ formatMoney(line.amount_annual) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
