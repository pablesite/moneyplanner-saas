<script setup lang="ts">
import { computed } from 'vue';
import { AInfoHint, AKindChip, AKpiBand, ASectHead, AState, type AKpiItem } from '@/domains/ui';
import type { AnnualIncomeEntry } from '@/domains/budget/annual-entries';

type MonthlyCloseStepId = 'liq' | 'income' | 'expense' | 'result';
type IncomeResetMode = 'zero' | 'planned';
type IncomeExecutionOrigin =
  | 'categorized_ledger'
  | 'user_override'
  | 'legacy_checkin'
  | 'ambiguous_taxonomy'
  | 'none';
type IncomeExecutionSource =
  | 'categorized_ledger'
  | 'legacy_fallback'
  | 'pending_classification'
  | 'none';

type IncomeCheckin = {
  id: number;
  annual_income_entry_id: number;
  fiscal_year: number;
  month: number;
  status: 'confirmed' | 'adjusted' | 'skipped' | 'estimated';
  executed_amount: string | null;
  note: string;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
};

type IncomeRow = {
  entry: AnnualIncomeEntry;
  planned: number;
  executed: number | null;
  categorizedLedgerExecuted: number | null;
  executionSource: IncomeExecutionSource;
  executionOrigin: IncomeExecutionOrigin;
  checkin: IncomeCheckin | null;
};

type IncomeGroup = {
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
  rows: IncomeRow[];
  editableRow: IncomeRow | null;
};

type IncomeCategoryBlock = {
  key: string;
  label: string;
  plannedTotal: number;
  executedTotal: number;
  deviation: number;
  completionRatio: number;
  reviewedCount: number;
  groups: IncomeGroup[];
};

function hasManualIncomeAdjustment(group: IncomeGroup): boolean {
  return Math.abs(group.executedTotal - group.ledgerDetectedTotal) >= 0.005;
}

// Estado de conciliación de una subcategoría de ingresos (desvío positivo = favorable).
function groupStatus(group: IncomeGroup): {
  label: string;
  tone: 'asset' | 'liability' | 'muted' | 'default';
} {
  if (group.checkedCount === 0 && group.ledgerDetectedTotal <= 0) {
    return { label: 'Pendiente', tone: 'muted' };
  }
  if (group.deviation > 0.005) return { label: 'Por encima', tone: 'asset' };
  if (group.deviation < -0.005) return { label: 'Por debajo', tone: 'liability' };
  return { label: 'Conciliado', tone: 'default' };
}

const props = defineProps<{
  isMonthlyCloseView: boolean;
  activeMonthlyCloseStep: MonthlyCloseStepId;
  groupedMonthlyIncomeExecutionEntries: IncomeGroup[];
  incomeExecutionLoading: boolean;
  incomeExecutionError: string | null;
  incomeExecutionBusyEntryId: number | null;
  incomeAdjustAmounts: Record<number, string>;
  setIncomeAdjustAmount: (entryId: number, value: string) => void;
  selectedIncomeMonthPlanned: number;
  selectedIncomeMonthExecuted: number;
  selectedIncomeMonthDeviation: number;
  selectedIncomeMonthCompletionRatio: number | null;
  monthlyIncomeCoverageSummary: { viaLedger: number; viaFallback: number; pending: number };
  monthlyIncomeCoverageDetail: string;
  monthlyIncomeCoverageLabel: string;
  monthlyIncomePendingClassification: { amount: number; ambiguousRows: number };
  formatMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
  isCloseLocked?: boolean;
  checkinStatusLabel: (status: 'confirmed' | 'adjusted' | 'skipped' | 'estimated') => string;
  isIncomeGroupUnlocked: (groupKey: string) => boolean;
  resetIncomeGroupCheckinDraftValue: (
    group: IncomeGroup,
    mode: IncomeResetMode,
  ) => void | Promise<void>;
  ensureIncomeGroupAdjustAmountPrefilled: (group: IncomeGroup) => void;
  saveIncomeGroupCheckinFromInput: (group: IncomeGroup) => void | Promise<void>;
  onIncomeGroupReviewedToggle: (group: IncomeGroup, checked: boolean) => void | Promise<void>;
  unlockIncomeGroupManualAdjustment: (group: IncomeGroup) => void | Promise<void>;
  relockIncomeGroupManualAdjustment: (group: IncomeGroup) => void | Promise<void>;
}>();

const kpiItems = computed<AKpiItem[]>(() => [
  { label: 'Previsto mes', value: `${props.formatMoney(props.selectedIncomeMonthPlanned)} €` },
  { label: 'Ejecutado mes', value: `${props.formatMoney(props.selectedIncomeMonthExecuted)} €` },
  {
    label: 'Desviación del mes',
    value: `${props.selectedIncomeMonthDeviation > 0 ? '+' : ''}${props.formatMoney(props.selectedIncomeMonthDeviation)} €`,
    cellClass: {
      'mc-kpi-dev-good': props.selectedIncomeMonthDeviation > 0,
      'mc-kpi-dev-danger': props.selectedIncomeMonthDeviation < 0,
    },
  },
  { label: 'Revisión', value: props.formatPercent(props.selectedIncomeMonthCompletionRatio, 0) },
]);

const incomeCategoryBlocks = computed<IncomeCategoryBlock[]>(() => {
  const blocks = new Map<string, IncomeCategoryBlock>();

  for (const group of props.groupedMonthlyIncomeExecutionEntries) {
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
  <section v-if="isMonthlyCloseView && activeMonthlyCloseStep === 'income'" class="sect mc-step">
    <ASectHead title="Check-in mensual de ingresos">
      <template #hint>
        <AInfoHint label="Sobre este paso">
          Confirma los ingresos previstos del mes; el cierre usa movimientos y deja pendientes solo
          las líneas a revisar.
        </AInfoHint>
      </template>
    </ASectHead>

    <AKpiBand class="mc-step-kpis" :items="kpiItems" />

    <div v-if="isCloseLocked" class="mc-locked">
      Este mes está finalizado. Reabre el cierre para editar.
    </div>

    <AState v-if="incomeExecutionLoading" status="loading" layout="inline"
      >Cargando check-ins de ingresos…</AState
    >
    <p v-else-if="incomeExecutionError" class="alert">{{ incomeExecutionError }}</p>
    <AState v-else-if="!groupedMonthlyIncomeExecutionEntries.length" status="empty" layout="inline">
      No hay ingresos previstos para este mes.
    </AState>
    <div v-else>
      <div v-if="monthlyIncomePendingClassification.amount > 0" class="mc-warn">
        <strong>Sin subcategoría</strong>
        <span>
          {{ formatMoney(monthlyIncomePendingClassification.amount) }} € del libro contable no tiene
          subcategoría de presupuesto todavía.
        </span>
        <small v-if="monthlyIncomePendingClassification.ambiguousRows > 0">
          {{ monthlyIncomePendingClassification.ambiguousRows }} líneas comparten la misma
          subcategoría y requieren revisión manual.
        </small>
      </div>

      <div class="mc-blocks">
        <details
          v-for="block in incomeCategoryBlocks"
          :key="`income-checkin-category-${block.key}`"
          class="mc-block"
          :open="block.completionRatio < 1 || block.deviation < 0"
        >
          <summary>
            <div class="mc-block-title-wrap">
              <strong class="mc-block-title">{{ block.label }}</strong>
              <span class="mc-block-meta">
                {{ block.groups.length }} subcategorías ·
                {{ Math.round(block.completionRatio * 100) }} % revisión
              </span>
            </div>
            <div class="mc-block-kpis">
              <span>P {{ formatMoney(block.plannedTotal) }} €</span>
              <span>E {{ formatMoney(block.executedTotal) }} €</span>
              <span
                :class="
                  block.deviation > 0 ? 'mc-dev-neg' : block.deviation < 0 ? 'mc-dev-pos' : ''
                "
              >
                D {{ block.deviation > 0 ? '+' : '' }}{{ formatMoney(block.deviation) }} €
              </span>
            </div>
          </summary>

          <div class="mc-rows">
            <article
              v-for="group in block.groups"
              :key="`income-checkin-group-${group.key}`"
              class="mc-row mc-row-checkin"
            >
              <div class="mc-row-main">
                <div class="mc-row-title" :title="group.subcategoryLabel">
                  {{ group.subcategoryLabel }}
                  <AKindChip v-if="group.editableRow?.checkin?.status === 'estimated'" tone="muted">
                    Estimado
                  </AKindChip>
                  <AKindChip :tone="groupStatus(group).tone">
                    {{ groupStatus(group).label }}
                  </AKindChip>
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
                    <strong>{{ formatMoney(group.plannedTotal) }} €</strong>
                  </span>
                  <span>
                    <small>Ejecutado</small>
                    <strong>{{ formatMoney(group.executedTotal) }} €</strong>
                  </span>
                  <span
                    :class="
                      group.deviation > 0 ? 'mc-dev-neg' : group.deviation < 0 ? 'mc-dev-pos' : ''
                    "
                  >
                    <small>Desv.</small>
                    <strong
                      >{{ group.deviation > 0 ? '+' : ''
                      }}{{ formatMoney(group.deviation) }} €</strong
                    >
                  </span>
                </div>
                <div
                  v-if="group.editableRow && !isIncomeGroupUnlocked(group.key)"
                  class="mc-adjust"
                >
                  <div v-if="hasManualIncomeAdjustment(group)" class="mc-ledger-readout">
                    <span>Movimientos</span>
                    <strong>{{ formatMoney(group.ledgerDetectedTotal) }} €</strong>
                  </div>
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="
                      isCloseLocked || incomeExecutionBusyEntryId === group.editableRow.entry.id
                    "
                    title="Añadir un ingreso manual a esta subcategoría sin tocar el libro contable"
                    @click="unlockIncomeGroupManualAdjustment(group)"
                  >
                    Añadir ingreso
                  </button>
                  <label class="mc-confirm" title="Marcar esta subcategoría como revisada">
                    <input
                      type="checkbox"
                      :checked="group.checkedCount > 0"
                      :disabled="
                        isCloseLocked ||
                        group.ledgerDetectedTotal > 0 ||
                        incomeExecutionBusyEntryId === group.editableRow.entry.id
                      "
                      aria-label="Marcar subcategoría de ingresos como revisada"
                      @change="
                        onIncomeGroupReviewedToggle(
                          group,
                          Boolean(($event.target as HTMLInputElement).checked),
                        )
                      "
                    />
                  </label>
                </div>
                <div v-else-if="group.editableRow" class="mc-adjust mc-adjust-editor">
                  <div class="mc-ledger-readout">
                    <span>Movimientos</span>
                    <strong>{{ formatMoney(group.ledgerDetectedTotal) }} €</strong>
                  </div>
                  <input
                    :value="incomeAdjustAmounts[group.editableRow.entry.id] ?? ''"
                    inputmode="decimal"
                    class="mc-input"
                    :disabled="isCloseLocked"
                    placeholder="Ingreso adicional"
                    @input="
                      setIncomeAdjustAmount(
                        group.editableRow.entry.id,
                        ($event.target as HTMLInputElement).value,
                      )
                    "
                    @focus="ensureIncomeGroupAdjustAmountPrefilled(group)"
                    @blur="saveIncomeGroupCheckinFromInput(group)"
                    @keydown.enter.prevent="saveIncomeGroupCheckinFromInput(group)"
                  />
                  <div class="mc-quick-actions">
                    <button
                      type="button"
                      class="mc-mini-btn"
                      :disabled="
                        isCloseLocked || incomeExecutionBusyEntryId === group.editableRow.entry.id
                      "
                      @click="resetIncomeGroupCheckinDraftValue(group, 'planned')"
                    >
                      Previsto
                    </button>
                    <button
                      type="button"
                      class="mc-mini-btn"
                      :disabled="
                        isCloseLocked || incomeExecutionBusyEntryId === group.editableRow.entry.id
                      "
                      title="Guardar el ingreso adicional"
                      @click="saveIncomeGroupCheckinFromInput(group)"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      class="mc-mini-btn"
                      :disabled="
                        isCloseLocked || incomeExecutionBusyEntryId === group.editableRow.entry.id
                      "
                      title="Volver a usar sólo el importe detectado en el libro contable"
                      @click="relockIncomeGroupManualAdjustment(group)"
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
    </div>
  </section>
</template>
