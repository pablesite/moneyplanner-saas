<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AButton, ASelect, AState, AToast } from '@/domains/ui';
import { planApi } from '@/domains/plan/api';
import type { PlanEventBudgetLines, PlanManagedBudgetLine } from '@/domains/plan/types';
import { toApiErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/format';

const props = defineProps<{ eventId: number }>();

const trace = ref<PlanEventBudgetLines | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const saveError = ref<string | null>(null);
const savingId = ref<number | null>(null);
const savedId = ref<number | null>(null);
const destinations = ref<Record<number, string>>({});
type ExpenseGroup = { line: PlanManagedBudgetLine; entries: PlanManagedBudgetLine[] };

const expenseGroups = computed<ExpenseGroup[]>(() => {
  const groups: ExpenseGroup[] = [];
  const bySeries = new Map<number, ExpenseGroup>();
  for (const line of trace.value?.expenses ?? []) {
    const seriesId = line.settlement_series_id;
    const existing = seriesId != null ? bySeries.get(seriesId) : undefined;
    if (existing) {
      existing.entries.push(line);
    } else {
      const group = { line, entries: [line] };
      groups.push(group);
      if (seriesId != null) bySeries.set(seriesId, group);
    }
  }
  return groups;
});

function total(lines: { amount_annual: string }[]): number {
  return lines.reduce((sum, line) => sum + Number(line.amount_annual), 0);
}

const oneOffExpenses = computed(
  () => trace.value?.expenses.filter((line) => line.time_profile === 'one_off') ?? [],
);
const structuralExpenses = computed(
  () => trace.value?.expenses.filter((line) => line.time_profile === 'structural_recurrent') ?? [],
);
const spent = computed(() => total(oneOffExpenses.value));
const received = computed(() => (trace.value ? total(trace.value.income) : 0));
const recurringAnnual = computed(() => total(structuralExpenses.value));
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

function linePeriod(line: PlanManagedBudgetLine): string {
  if (line.time_profile === 'structural_recurrent') {
    return `Cada año desde ${line.fiscal_year}`;
  }
  return String(line.fiscal_year);
}

function destinationOptions(group: ExpenseGroup) {
  const { line } = group;
  const options = [{ value: '', label: 'Automática' }];
  if (destinations.value[line.id] === '__mixed__') {
    options.push({ value: '__mixed__', label: 'Varias cuentas' });
  }
  for (const account of line.settlement_destinations ?? []) {
    options.push({ value: String(account.id), label: account.name });
  }
  const selected = destinations.value[line.id];
  if (
    selected &&
    selected !== '__mixed__' &&
    !options.some((option) => option.value === selected)
  ) {
    options.push({
      value: selected,
      label: 'Cuenta actual no disponible',
    });
  }
  return options;
}

async function saveDestination(group: ExpenseGroup): Promise<void> {
  const { line, entries } = group;
  savingId.value = line.id;
  savedId.value = null;
  saveError.value = null;
  try {
    const selected = destinations.value[line.id] ?? '';
    await planApi.setBudgetLineDestination(
      props.eventId,
      line.id,
      selected ? Number(selected) : null,
      entries.length > 1,
    );
    for (const entry of entries) entry.settlement_account_id = selected ? Number(selected) : null;
    savedId.value = line.id;
  } catch (err) {
    saveError.value = toApiErrorMessage(err);
  } finally {
    savingId.value = null;
  }
}

onMounted(async () => {
  try {
    const { data } = await planApi.getEventBudgetLines(props.eventId);
    trace.value = data;
    destinations.value = Object.fromEntries(
      expenseGroups.value.map(({ line, entries }) => {
        const assigned = new Set(
          entries
            .filter((entry) => entry.settlement_account_id != null)
            .map((entry) => String(entry.settlement_account_id)),
        );
        return [line.id, assigned.size > 1 ? '__mixed__' : ([...assigned][0] ?? '')];
      }),
    );
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
          <dt>Pago puntual</dt>
          <dd class="mono">{{ formatMoney(spent) }}</dd>
        </div>
        <div v-if="recurringAnnual">
          <dt>Coste recurrente</dt>
          <dd class="mono">{{ formatMoney(recurringAnnual) }}<small>/año</small></dd>
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
        <AState v-if="saveError" status="error" layout="inline">{{ saveError }}</AState>
        <template v-for="group in expenseGroups" :key="`expense:${group.line.id}`">
          <div class="plan-impact-row">
            <span>
              <strong>{{ group.line.name }}</strong>
              <small v-if="group.entries.length > 1">
                {{ group.entries[0]?.fiscal_year }}–{{
                  group.entries[group.entries.length - 1]?.fiscal_year
                }}
                · {{ group.entries.length }} anualidades
              </small>
              <small v-else>{{ linePeriod(group.line) }}</small>
            </span>
            <span v-if="group.entries.length === 1" class="mono">{{
              formatMoney(group.line.amount_annual)
            }}</span>
          </div>
          <details v-if="group.entries.length > 1">
            <summary>Ver importes por año</summary>
            <div v-for="entry in group.entries" :key="entry.id" class="plan-impact-row">
              <span>{{ entry.fiscal_year }}</span
              ><span class="mono">{{ formatMoney(entry.amount_annual) }}</span>
            </div>
          </details>
          <div v-if="group.line.settlement_editable" class="ui-item-form-grid">
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">Cuenta que recibirá la reserva</span>
              <ASelect
                :model-value="destinations[group.line.id] ?? ''"
                :options="destinationOptions(group)"
                :aria-label="`Cuenta destino de ${group.line.name} ${group.line.fiscal_year}`"
                @update:model-value="(value) => (destinations[group.line.id] = String(value ?? ''))"
              />
              <small v-if="group.entries.length > 1">Se aplicará a todas las anualidades.</small>
            </label>
            <div class="ui-item-form-field">
              <AButton
                variant="ghost"
                size="sm"
                :loading="savingId === group.line.id"
                :disabled="
                  savingId !== null ||
                  destinations[group.line.id] === '__mixed__' ||
                  group.entries.every(
                    (entry) =>
                      destinations[group.line.id] === String(entry.settlement_account_id ?? ''),
                  )
                "
                @click="saveDestination(group)"
                >Guardar destino</AButton
              >
            </div>
          </div>
        </template>
        <div v-for="line in trace.income" :key="`income:${line.id}`" class="plan-impact-row">
          <span>
            <strong>{{ line.name }}</strong>
            <small>{{ linePeriod(line) }}</small>
          </span>
          <span class="mono pos">{{ formatMoney(line.amount_annual) }}</span>
        </div>
      </div>
    </template>
    <AToast :open="savedId !== null" message="Destino guardado." @close="savedId = null" />
  </div>
</template>
