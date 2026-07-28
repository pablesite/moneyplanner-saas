<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, AChevron, ASelect, AState, type ASelectItem } from '@/domains/ui';
import {
  useAnnualIncomeStore,
  type AnnualIncomeDraft,
  type AnnualIncomeEntry,
} from '@/domains/budget/annual-entries/annualIncomeStore';
import {
  useAnnualExpenseStore,
  type AnnualExpenseDraft,
  type AnnualExpenseEntry,
} from '@/domains/budget/annual-entries/annualExpenseStore';
import { formatMoney } from '@/lib/format';
import type { PlanFoundations } from '@/domains/plan/types';

// "Tu situación este año" reúne las tres capas del flujo del año en un solo bloque:
// base recurrente permanente, esfuerzo temporal (compromisos que vencen) y los
// movimientos puntuales. Las dos primeras salen del diagnóstico de cash-flow
// (`foundations`); la tercera reprograma partidas de presupuesto vía sus stores.
const props = defineProps<{
  foundations?: PlanFoundations | null;
}>();

const MONTH_ABBR = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

// ----- Capas 1 y 2: base recurrente + esfuerzo temporal (desde cash-flow) -----
const cleanCommitmentName = (name: string) => name.replace(/^Compromiso pasivo:\s*/i, '').trim();
const commitmentEnd = (endYear: number | null, endMonth: number | null) => {
  if (endYear == null) return 'sin fecha';
  if (endMonth == null) return String(endYear);
  return `${MONTH_ABBR[endMonth - 1] ?? ''} ${endYear}`.trim();
};
const committedDiagnosis = computed(() => {
  const cf = props.foundations?.cash_flow;
  if (!cf || cf.committed_status === 'healthy') return null;
  return {
    transient: cf.committed_status === 'transient',
    operatingSurplus: formatMoney(cf.operating_surplus),
    structuralIncome: formatMoney(cf.structural_annual_income),
    operatingExpense: formatMoney(cf.structural_operating_expense),
    committedSurplus: formatMoney(cf.committed_surplus),
    recoveryYear: cf.committed_recovery_year,
    commitments: cf.temporary_commitments.map((c) => ({
      name: cleanCommitmentName(c.name),
      amount: formatMoney(c.amount),
      end: commitmentEnd(c.end_year, c.end_month),
    })),
  };
});

// ----- Capa 3: movimientos puntuales (reprogramables) -----
const incomeStore = useAnnualIncomeStore('saas');
const expenseStore = useAnnualExpenseStore('saas');

const currentYear = new Date().getFullYear();
const oneOffOpen = ref(false);
const savingKey = ref<string | null>(null);
const editingKey = ref<string | null>(null);
const localError = ref<string | null>(null);

const draftAmount = ref('');
const draftMonth = ref<number | null>(null);
const draftYear = ref(currentYear);

type Kind = 'income' | 'expense';
type MovementRow = {
  key: string;
  kind: Kind;
  id: number;
  name: string;
  amountAnnual: number;
  fiscalYear: number;
  targetMonth: number | null;
  isPlanManaged: boolean;
  planEventName: string | null;
  income?: AnnualIncomeEntry;
  expense?: AnnualExpenseEntry;
};

const movements = computed<MovementRow[]>(() => {
  const rows: MovementRow[] = [];
  for (const entry of incomeStore.entries.value) {
    if (entry.timeProfile === 'one_off' && entry.fiscalYear >= currentYear) {
      rows.push({
        key: `income:${entry.id}`,
        kind: 'income',
        id: entry.id,
        name: entry.name,
        amountAnnual: entry.amountAnnual,
        fiscalYear: entry.fiscalYear,
        targetMonth: entry.targetMonth,
        isPlanManaged: entry.isPlanManaged,
        planEventName: entry.planEventName,
        income: entry,
      });
    }
  }
  for (const entry of expenseStore.entries.value) {
    // Los gastos generados por un activo/pasivo (is_system_generated) los gobierna
    // Patrimonio; reprogramarlos aquí desincronizaría. Se excluyen del listado.
    if (
      entry.timeProfile === 'one_off' &&
      entry.fiscalYear >= currentYear &&
      !entry.isSystemGenerated
    ) {
      rows.push({
        key: `expense:${entry.id}`,
        kind: 'expense',
        id: entry.id,
        name: entry.name,
        amountAnnual: entry.amountAnnual,
        fiscalYear: entry.fiscalYear,
        targetMonth: entry.targetMonth,
        isPlanManaged: entry.isPlanManaged,
        planEventName: entry.planEventName,
        expense: entry,
      });
    }
  }
  return rows.sort(
    (a, b) =>
      a.fiscalYear - b.fiscalYear ||
      (a.targetMonth ?? 13) - (b.targetMonth ?? 13) ||
      a.name.localeCompare(b.name),
  );
});

const oneOffCountLabel = computed(() => {
  const incomes = movements.value.filter((row) => row.kind === 'income').length;
  const expenses = movements.value.filter((row) => row.kind === 'expense').length;
  const parts: string[] = [];
  if (incomes) parts.push(`${incomes} ${incomes === 1 ? 'ingreso' : 'ingresos'}`);
  if (expenses) parts.push(`${expenses} ${expenses === 1 ? 'gasto' : 'gastos'}`);
  return parts.join(' · ');
});

const isLoading = computed(() => incomeStore.loading.value || expenseStore.loading.value);
const hasSituation = computed(() => committedDiagnosis.value != null || movements.value.length > 0);

const yearOptions: ASelectItem[] = Array.from({ length: 21 }, (_, index) => {
  const year = currentYear + index;
  return { value: year, label: String(year) };
});

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const monthOptions: ASelectItem[] = [
  { value: null, label: 'Sin mes' },
  ...MONTH_NAMES.map((label, index) => ({ value: index + 1, label })),
];

function whenLabel(month: number | null, year: number): string {
  return month ? `${MONTH_ABBR[month - 1]} ${year}` : String(year);
}

function amountLabel(row: MovementRow): string {
  return `${row.kind === 'expense' ? '−' : ''}${formatMoney(row.amountAnnual)}`;
}

function startEdit(row: MovementRow): void {
  editingKey.value = row.key;
  draftAmount.value = String(row.amountAnnual);
  draftMonth.value = row.targetMonth;
  draftYear.value = row.fiscalYear;
  localError.value = null;
}

function cancelEdit(): void {
  editingKey.value = null;
  localError.value = null;
}

function incomeToDraft(entry: AnnualIncomeEntry): AnnualIncomeDraft {
  return {
    name: entry.name,
    category: entry.category,
    subcategory: entry.subcategory,
    owner: entry.owner,
    incomeType: entry.incomeType,
    timeProfile: entry.timeProfile,
    cashflowRole: entry.cashflowRole,
    eventGroup: entry.eventGroup,
    targetMonth: entry.targetMonth,
    termStartMonth: entry.termStartMonth,
    termEndMonth: entry.termEndMonth,
    termEndYear: entry.termEndYear,
    amountInputPeriod: entry.amountInputPeriod,
    amountAnnual: String(entry.amountAnnual),
    fiscalYear: entry.fiscalYear,
    currency: entry.currency,
    notes: entry.notes,
  };
}

function expenseToDraft(entry: AnnualExpenseEntry): AnnualExpenseDraft {
  return {
    name: entry.name,
    category: entry.category,
    subcategory: entry.subcategory,
    owner: entry.owner,
    expenseType: entry.expenseType,
    timeProfile: entry.timeProfile,
    cashflowRole: entry.cashflowRole,
    eventGroup: entry.eventGroup,
    targetMonth: entry.targetMonth,
    termStartMonth: entry.termStartMonth,
    termEndMonth: entry.termEndMonth,
    termEndYear: entry.termEndYear,
    amountInputPeriod: entry.amountInputPeriod,
    amountAnnual: String(entry.amountAnnual),
    fiscalYear: entry.fiscalYear,
    currency: entry.currency,
    notes: entry.notes,
  };
}

async function reloadAll(): Promise<void> {
  await Promise.all([incomeStore.loadAll(), expenseStore.loadAll()]);
}

async function saveEdit(row: MovementRow): Promise<void> {
  localError.value = null;
  savingKey.value = row.key;
  const patch = {
    amountAnnual: draftAmount.value,
    targetMonth: draftMonth.value,
    fiscalYear: draftYear.value,
  };
  const result =
    row.kind === 'income' && row.income
      ? await incomeStore.updateEntry(row.id, { ...incomeToDraft(row.income), ...patch })
      : row.expense
        ? await expenseStore.updateEntry(row.id, { ...expenseToDraft(row.expense), ...patch })
        : { ok: false as const, error: 'No se pudo guardar el movimiento.' };
  // `updateEntry` recarga filtrando por el nuevo año; recargamos todo para no
  // perder los demás movimientos de la lista.
  await reloadAll();
  if (!result.ok) {
    localError.value = result.error;
  } else {
    editingKey.value = null;
  }
  savingKey.value = null;
}

async function removeRow(row: MovementRow): Promise<void> {
  localError.value = null;
  savingKey.value = row.key;
  if (row.kind === 'income') {
    await incomeStore.deleteEntry(row.id);
    if (incomeStore.error.value) localError.value = incomeStore.error.value;
  } else {
    await expenseStore.deleteEntry(row.id);
    if (expenseStore.error.value) localError.value = expenseStore.error.value;
  }
  await reloadAll();
  editingKey.value = null;
  savingKey.value = null;
}

onMounted(() => {
  void reloadAll();
});
</script>

<template>
  <section
    v-if="hasSituation || isLoading"
    class="sect plan-situacion"
    aria-label="Tu situación este año"
  >
    <div class="plan-situacion-head">
      <p class="plan-situacion-eyebrow">Tu situación este año</p>
      <span class="plan-situacion-year">{{ currentYear }}</span>
    </div>

    <div class="plan-situacion-tiers">
      <!-- Capa 1: base recurrente -->
      <div v-if="committedDiagnosis" class="plan-diag-tier plan-tier">
        <span class="tier-mark tier-mark-ok" aria-hidden="true"></span>
        <div class="tier-body">
          <div class="tier-head">
            <span class="tier-label">Base recurrente sana</span>
            <span class="tier-value pos mono">{{ committedDiagnosis.operatingSurplus }} /año</span>
          </div>
          <p class="tier-sub">
            Ingresos {{ committedDiagnosis.structuralIncome }} − gastos operativos
            {{ committedDiagnosis.operatingExpense }}
          </p>
        </div>
      </div>

      <!-- Capa 2: esfuerzo temporal / déficit estructural -->
      <div v-if="committedDiagnosis" class="plan-diag-tier plan-tier">
        <span class="tier-mark tier-mark-warn" aria-hidden="true"></span>
        <div class="tier-body">
          <div class="tier-head">
            <span class="tier-label">
              {{
                committedDiagnosis.transient
                  ? 'Esfuerzo temporal de este año'
                  : 'Déficit estructural'
              }}
            </span>
            <span class="tier-value neg mono">{{ committedDiagnosis.committedSurplus }}</span>
          </div>
          <p class="tier-sub">
            <template v-if="committedDiagnosis.transient && committedDiagnosis.recoveryYear">
              Vuelve a positivo en {{ committedDiagnosis.recoveryYear }}, al vencer estos
              compromisos:
            </template>
            <template v-else-if="committedDiagnosis.transient">
              Estos compromisos vencen y liberan tu superávit:
            </template>
            <template v-else>Los compromisos superan tu base recurrente:</template>
          </p>
          <ul class="plan-commitment-list">
            <li v-for="c in committedDiagnosis.commitments" :key="c.name">
              <span class="c-name">{{ c.name }}</span>
              <span class="c-end">{{ c.end }}</span>
              <span class="c-amount mono">{{ c.amount }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Capa 3: movimientos puntuales (reprogramables) -->
      <div
        v-if="movements.length"
        class="plan-diag-tier plan-tier plan-tier-oneoff"
        :class="{ open: oneOffOpen }"
      >
        <span class="tier-mark tier-mark-oneoff" aria-hidden="true"></span>
        <div class="tier-body">
          <button
            type="button"
            class="plan-tier-toggle"
            :aria-expanded="oneOffOpen"
            aria-controls="plan-oneoff-detail"
            @click="oneOffOpen = !oneOffOpen"
          >
            <span class="tier-head">
              <span class="tier-label">
                Movimientos puntuales previstos
                <span class="tier-count">{{ oneOffCountLabel }}</span>
              </span>
              <span class="tier-toggle-aside">
                <AChevron :expanded="oneOffOpen" />
              </span>
            </span>
            <p class="tier-sub">
              Ocurren una sola vez. Reprográmalos y el plan recalcula, sin borrar nada de tu
              presupuesto.
            </p>
          </button>

          <div v-show="oneOffOpen" id="plan-oneoff-detail" class="plan-oneoff-detail">
            <div class="plan-oneoff-table plan-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th class="num">Importe</th>
                    <th>Cuándo</th>
                    <th aria-hidden="true"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in movements"
                    :key="row.key"
                    :class="{ 'is-editing': editingKey === row.key }"
                  >
                    <td class="plan-oneoff-concept">
                      <span class="plan-oneoff-kind" :class="`is-${row.kind}`">
                        {{ row.kind === 'income' ? 'Ingreso' : 'Gasto' }}
                      </span>
                      <strong>{{ row.name }}</strong>
                    </td>

                    <template v-if="editingKey === row.key">
                      <td class="num">
                        <input
                          v-model="draftAmount"
                          class="input plan-oneoff-amount"
                          inputmode="decimal"
                          :aria-label="`Importe de ${row.name}`"
                        />
                      </td>
                      <td>
                        <div class="plan-oneoff-when-edit">
                          <ASelect
                            :model-value="draftMonth"
                            :options="monthOptions"
                            :searchable="false"
                            :aria-label="`Mes previsto de ${row.name}`"
                            class="select plan-oneoff-select"
                            @update:model-value="
                              (value) => (draftMonth = value === null ? null : Number(value))
                            "
                          />
                          <ASelect
                            :model-value="draftYear"
                            :options="yearOptions"
                            :searchable="false"
                            :aria-label="`Año previsto de ${row.name}`"
                            class="select plan-oneoff-select"
                            @update:model-value="(value) => (draftYear = Number(value))"
                          />
                        </div>
                      </td>
                      <td class="plan-oneoff-action-cell">
                        <div class="plan-oneoff-edit-actions">
                          <AButton
                            variant="primary"
                            size="sm"
                            :disabled="savingKey === row.key"
                            @click="saveEdit(row)"
                          >
                            Guardar
                          </AButton>
                          <AButton variant="ghost" size="sm" @click="cancelEdit()"
                            >Cancelar</AButton
                          >
                          <AButton
                            variant="ghost"
                            size="sm"
                            :disabled="savingKey === row.key"
                            @click="removeRow(row)"
                          >
                            Quitar
                          </AButton>
                        </div>
                      </td>
                    </template>

                    <template v-else>
                      <td class="num plan-oneoff-amount-label" :class="`is-${row.kind}`">
                        {{ amountLabel(row) }}
                      </td>
                      <td class="plan-oneoff-when-label">
                        {{ whenLabel(row.targetMonth, row.fiscalYear) }}
                      </td>
                      <td class="plan-oneoff-action-cell">
                        <span v-if="row.isPlanManaged" class="plan-oneoff-managed">
                          Gestionado por {{ row.planEventName || 'el plan' }}
                        </span>
                        <AButton v-else variant="ghost" size="sm" @click="startEdit(row)">
                          Editar
                        </AButton>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="localError" class="plan-inline-error" role="alert">{{ localError }}</p>

            <p class="plan-oneoff-budget-link">
              ¿Es una compra o venta de activo?
              <RouterLink class="plan-blocker-link" to="/plan/decisiones/agrupar"
                >Agrupar en una decisión</RouterLink
              >
              · ¿Ajustar un gasto o ingreso recurrente?
              <RouterLink class="plan-blocker-link" to="/presupuesto"
                >Revisar presupuesto</RouterLink
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <AState
      v-if="isLoading && !movements.length && !committedDiagnosis"
      status="loading"
      layout="inline"
    >
      Cargando tu situación…
    </AState>

    <div v-if="committedDiagnosis" class="plan-situacion-net">
      <span class="plan-situacion-net-label">Flujo recurrente neto · {{ currentYear }}</span>
      <span class="plan-situacion-net-value neg">
        {{ committedDiagnosis.committedSurplus }}
        <span
          v-if="committedDiagnosis.transient && committedDiagnosis.recoveryYear"
          class="plan-situacion-net-rec"
        >
          · vuelve a {{ committedDiagnosis.operatingSurplus }} /año desde
          {{ committedDiagnosis.recoveryYear }}
        </span>
      </span>
    </div>
  </section>
</template>
