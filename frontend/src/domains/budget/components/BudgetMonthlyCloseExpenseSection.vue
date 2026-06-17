<script setup lang="ts">
import { computed } from 'vue';
import { AKindChip } from '@/domains/ui';
import type { AnnualExpenseEntry } from '@/domains/budget/annual-entries';

type MonthlyCloseStepId = 'liq' | 'income' | 'expense' | 'result';
type ExpenseResetMode = 'zero' | 'planned';
type ExpenseExecutionOrigin =
  | 'categorized_ledger'
  | 'user_override'
  | 'legacy_checkin'
  | 'ambiguous_taxonomy'
  | 'none';
type ExpenseExecutionSource =
  | 'categorized_ledger'
  | 'legacy_fallback'
  | 'pending_classification'
  | 'none';

type ExpenseCheckin = {
  id: number;
  annual_expense_entry_id: number;
  fiscal_year: number;
  month: number;
  status: 'confirmed' | 'adjusted' | 'skipped' | 'estimated';
  executed_amount: string | null;
  note: string;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
};

type ExpenseExecutionEntry = AnnualExpenseEntry & {
  baseAmountAnnual: number;
};

type ExpenseRow = {
  entry: ExpenseExecutionEntry;
  planned: number;
  executed: number | null;
  categorizedLedgerExecuted: number | null;
  executionSource: ExpenseExecutionSource;
  executionOrigin: ExpenseExecutionOrigin;
  checkin: ExpenseCheckin | null;
};

type ExpenseGroup = {
  key: string;
  categoryKey: string;
  categoryLabel: string;
  subcategoryKey: string;
  subcategoryLabel: string;
  plannedTotal: number;
  ledgerDetectedTotal: number;
  executedTotal: number;
  deviation: number;
  completionRatio: number;
  checkedCount: number;
  rows: ExpenseRow[];
  editableRow: ExpenseRow | null;
};

type ExpenseCategoryBlock = {
  key: string;
  label: string;
  plannedTotal: number;
  executedTotal: number;
  deviation: number;
  completionRatio: number;
  reviewedCount: number;
  groups: ExpenseGroup[];
};

function hasManualExpenseAdjustment(group: ExpenseGroup): boolean {
  return Math.abs(group.executedTotal - group.ledgerDetectedTotal) >= 0.005;
}

// Estado de conciliación de una subcategoría para el chip Direction A.
function groupStatus(group: ExpenseGroup): {
  label: string;
  tone: 'asset' | 'liability' | 'muted' | 'default';
} {
  if (group.checkedCount === 0 && group.ledgerDetectedTotal <= 0) {
    return { label: 'Pendiente', tone: 'muted' };
  }
  if (group.deviation > 0.005) return { label: 'Excedido', tone: 'liability' };
  if (group.deviation < -0.005) return { label: 'Ahorrado', tone: 'asset' };
  return { label: 'Conciliado', tone: 'default' };
}

const props = defineProps<{
  isMonthlyCloseView: boolean;
  activeMonthlyCloseStep: MonthlyCloseStepId;
  expenseMonthlySummary: unknown;
  expenseExecutionLoading: boolean;
  expenseExecutionBusyEntryId: number | null;
  groupedMonthlyExpenseExecutionEntries: ExpenseGroup[];
  monthlyExpenseCoverageSummary: {
    ratio: number;
    viaLedger: number;
    viaFallback: number;
    pending: number;
  };
  monthlyExpenseCoverageDetail: string;
  monthlyExpenseCoverageLabel: string;
  monthlyExpensePendingClassification: { amount: number; ambiguousRows: number };
  expenseAdjustAmounts: Record<number, string>;
  setExpenseAdjustAmount: (entryId: number, value: string) => void;
  selectedExpenseMonthPlanned: number;
  selectedExpenseMonthExecuted: number;
  selectedExpenseMonthDeviation: number;
  formatMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
  executionSourceLabel: (origin: ExpenseExecutionOrigin) => string;
  expenseCheckinRowSummary: (row: ExpenseRow) => string;
  isCloseLocked?: boolean;
  checkinStatusLabel: (status: 'confirmed' | 'adjusted' | 'skipped' | 'estimated') => string;
  isLockedExecutionRow: (row: ExpenseRow) => boolean;
  isExpenseGroupUnlocked: (groupKey: string) => boolean;
  goToPreviousMonthlyCloseStep: () => void;
  goToNextMonthlyCloseStep: () => void;
  resetExpenseCheckinDraftValue: (row: ExpenseRow, mode: ExpenseResetMode) => void | Promise<void>;
  resetExpenseGroupCheckinDraftValue: (
    group: ExpenseGroup,
    mode: ExpenseResetMode,
  ) => void | Promise<void>;
  ensureExpenseAdjustAmountPrefilled: (row: ExpenseRow) => void;
  ensureExpenseGroupAdjustAmountPrefilled: (group: ExpenseGroup) => void;
  onExpenseAdjustAmountBlur: (row: ExpenseRow) => void | Promise<void>;
  saveExpenseCheckinFromInput: (row: ExpenseRow) => void | Promise<void>;
  saveExpenseGroupCheckinFromInput: (group: ExpenseGroup) => void | Promise<void>;
  onExpenseCheckinCheckboxToggle: (row: ExpenseRow, checked: boolean) => void | Promise<void>;
  onExpenseGroupReviewedToggle: (group: ExpenseGroup, checked: boolean) => void | Promise<void>;
  unlockExpenseGroupManualAdjustment: (group: ExpenseGroup) => void | Promise<void>;
  relockExpenseGroupManualAdjustment: (group: ExpenseGroup) => void | Promise<void>;
}>();

const expenseCategoryBlocks = computed<ExpenseCategoryBlock[]>(() => {
  const blocks = new Map<string, ExpenseCategoryBlock>();

  for (const group of props.groupedMonthlyExpenseExecutionEntries) {
    let block = blocks.get(group.categoryKey);
    if (!block) {
      block = {
        key: group.categoryKey,
        label: group.categoryLabel,
        plannedTotal: 0,
        executedTotal: 0,
        deviation: 0,
        completionRatio: 0,
        reviewedCount: 0,
        groups: [],
      };
      blocks.set(group.categoryKey, block);
    }

    block.groups.push(group);
    block.plannedTotal += group.plannedTotal;
    block.executedTotal += group.executedTotal;
    if (group.ledgerDetectedTotal > 0 || group.checkedCount > 0) block.reviewedCount += 1;
  }

  return Array.from(blocks.values()).map((block) => ({
    ...block,
    deviation: block.executedTotal - block.plannedTotal,
    completionRatio: block.groups.length ? block.reviewedCount / block.groups.length : 1,
  }));
});
</script>

<template>
  <section v-if="isMonthlyCloseView && activeMonthlyCloseStep === 'expense'" class="sect mc-step">
    <div class="sect-head">
      <div>
        <h2 class="sect-title">Paso 3 · Check-in mensual de gastos</h2>
        <p class="sect-sub">
          Confirma los gastos previstos del mes; el cierre usa movimientos y deja pendientes solo
          las líneas a revisar.
        </p>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-ghost" @click="goToPreviousMonthlyCloseStep()">
          ← Paso anterior
        </button>
        <button type="button" class="btn btn-primary" @click="goToNextMonthlyCloseStep()">
          Paso siguiente →
        </button>
      </div>
    </div>

    <div v-if="expenseMonthlySummary" class="kpis mc-step-kpis">
      <div class="kpi">
        <p class="kpi-label">Previsto mes</p>
        <div class="kpi-value mono">{{ formatMoney(selectedExpenseMonthPlanned) }} EUR</div>
      </div>
      <div class="kpi">
        <p class="kpi-label">Ejecutado mes</p>
        <div class="kpi-value mono">{{ formatMoney(selectedExpenseMonthExecuted) }} EUR</div>
      </div>
      <div
        class="kpi"
        :class="{
          'mc-kpi-dev-danger': selectedExpenseMonthDeviation > 0,
          'mc-kpi-dev-good': selectedExpenseMonthDeviation < 0,
        }"
      >
        <p class="kpi-label">Desviación del mes</p>
        <div class="kpi-value mono">
          {{ selectedExpenseMonthDeviation > 0 ? '+' : ''
          }}{{ formatMoney(selectedExpenseMonthDeviation) }} EUR
        </div>
      </div>
      <div class="kpi">
        <p class="kpi-label">Revisión</p>
        <div class="kpi-value mono">
          {{ formatPercent(monthlyExpenseCoverageSummary.ratio, 0) }}
        </div>
      </div>
    </div>

    <div v-if="isCloseLocked" class="mc-locked">
      Este mes está finalizado. Reabre el cierre para editar.
    </div>

    <div v-if="expenseExecutionLoading" class="mc-empty">Cargando check-ins mensuales…</div>
    <p v-else-if="!groupedMonthlyExpenseExecutionEntries.length" class="mc-empty">
      No hay gastos previstos para este mes con los filtros actuales.
    </p>
    <div v-else class="mc-blocks">
      <details
        v-for="block in expenseCategoryBlocks"
        :key="`expense-checkin-category-${block.key}`"
        class="mc-block"
        :open="block.completionRatio < 1 || block.deviation > 0"
      >
        <summary>
          <div class="mc-block-title-wrap">
            <strong class="mc-block-title">{{ block.label }}</strong>
            <span class="mc-block-meta">
              {{ block.groups.length }} subcategorías ·
              {{ Math.round(block.completionRatio * 100) }}
              % revisión
            </span>
          </div>
          <div class="mc-block-kpis">
            <span>P {{ formatMoney(block.plannedTotal) }} EUR</span>
            <span>E {{ formatMoney(block.executedTotal) }} EUR</span>
            <span
              :class="block.deviation > 0 ? 'mc-dev-pos' : block.deviation < 0 ? 'mc-dev-neg' : ''"
            >
              D {{ block.deviation > 0 ? '+' : '' }}{{ formatMoney(block.deviation) }} EUR
            </span>
          </div>
        </summary>

        <div class="mc-rows">
          <article
            v-for="group in block.groups"
            :key="`expense-checkin-group-${group.key}`"
            class="mc-row"
          >
            <div class="mc-row-main">
              <div class="mc-row-title" :title="group.subcategoryLabel">
                {{ group.subcategoryLabel }}
                <AKindChip v-if="group.editableRow?.checkin?.status === 'estimated'" tone="muted">
                  Estimado
                </AKindChip>
                <AKindChip :tone="groupStatus(group).tone">{{
                  groupStatus(group).label
                }}</AKindChip>
              </div>
              <div class="mc-row-state">
                <span>{{ group.categoryLabel }}</span>
                <span v-if="group.rows.length > 1">{{ group.rows.length }} líneas agrupadas</span>
                <span v-if="group.editableRow?.checkin">
                  {{ checkinStatusLabel(group.editableRow.checkin.status) }}
                </span>
              </div>
            </div>
            <div class="mc-row-actions">
              <div class="mc-metrics">
                <span>
                  <small>Previsto</small>
                  <strong>{{ formatMoney(group.plannedTotal) }} EUR</strong>
                </span>
                <span>
                  <small>Ejecutado</small>
                  <strong>{{ formatMoney(group.executedTotal) }} EUR</strong>
                </span>
                <span
                  :class="
                    group.deviation > 0 ? 'mc-dev-pos' : group.deviation < 0 ? 'mc-dev-neg' : ''
                  "
                >
                  <small>Desv.</small>
                  <strong
                    >{{ group.deviation > 0 ? '+' : ''
                    }}{{ formatMoney(group.deviation) }} EUR</strong
                  >
                </span>
              </div>
              <div v-if="group.editableRow && !isExpenseGroupUnlocked(group.key)" class="mc-adjust">
                <div v-if="hasManualExpenseAdjustment(group)" class="mc-ledger-readout">
                  <span>Movimientos</span>
                  <strong>{{ formatMoney(group.ledgerDetectedTotal) }} EUR</strong>
                </div>
                <button
                  type="button"
                  class="mc-mini-btn"
                  :disabled="
                    isCloseLocked || expenseExecutionBusyEntryId === group.editableRow.entry.id
                  "
                  title="Añadir un gasto manual a esta subcategoría sin tocar el libro contable"
                  @click="unlockExpenseGroupManualAdjustment(group)"
                >
                  Añadir gasto
                </button>
                <label class="mc-confirm" title="Marcar esta subcategoría como revisada">
                  <input
                    type="checkbox"
                    :checked="group.checkedCount > 0"
                    :disabled="
                      isCloseLocked ||
                      group.ledgerDetectedTotal > 0 ||
                      expenseExecutionBusyEntryId === group.editableRow.entry.id
                    "
                    aria-label="Marcar subcategoría de gastos como revisada"
                    @change="
                      onExpenseGroupReviewedToggle(
                        group,
                        Boolean(($event.target as HTMLInputElement).checked),
                      )
                    "
                  />
                </label>
              </div>
              <div v-else-if="group.editableRow" class="mc-adjust">
                <div class="mc-ledger-readout">
                  <span>Movimientos</span>
                  <strong>{{ formatMoney(group.ledgerDetectedTotal) }} EUR</strong>
                </div>
                <input
                  :value="expenseAdjustAmounts[group.editableRow.entry.id] ?? ''"
                  inputmode="decimal"
                  class="mc-input"
                  :disabled="isCloseLocked"
                  placeholder="Gasto adicional"
                  @input="
                    setExpenseAdjustAmount(
                      group.editableRow.entry.id,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  @focus="ensureExpenseGroupAdjustAmountPrefilled(group)"
                  @blur="saveExpenseGroupCheckinFromInput(group)"
                  @keydown.enter.prevent="saveExpenseGroupCheckinFromInput(group)"
                />
                <div class="mc-quick-actions">
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="
                      isCloseLocked || expenseExecutionBusyEntryId === group.editableRow.entry.id
                    "
                    @click="resetExpenseGroupCheckinDraftValue(group, 'planned')"
                  >
                    Previsto
                  </button>
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="
                      isCloseLocked || expenseExecutionBusyEntryId === group.editableRow.entry.id
                    "
                    title="Guardar el gasto adicional"
                    @click="saveExpenseGroupCheckinFromInput(group)"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="
                      isCloseLocked || expenseExecutionBusyEntryId === group.editableRow.entry.id
                    "
                    title="Volver a usar sólo el importe detectado en el libro contable"
                    @click="relockExpenseGroupManualAdjustment(group)"
                  >
                    Usar detectado
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </details>
    </div>
  </section>
</template>
