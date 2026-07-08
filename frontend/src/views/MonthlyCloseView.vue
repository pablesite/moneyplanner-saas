<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  AButton,
  APageHead,
  AMetaPill,
  AStepper,
  ASelect,
  AState,
  type ASelectItem,
} from '@/domains/ui';
import {
  BudgetMonthlyCloseExpenseSection,
  BudgetMonthlyCloseIncomeSection,
  BudgetMonthlyCloseLiquiditySection,
  BudgetMonthlyCloseResultSection,
  MonthlyCloseHero,
} from '@/domains/budget';
import '@/domains/budget/styles/monthly-close.css';
import { useMonthlyCloseView } from './budget/useMonthlyCloseView';

const router = useRouter();

const {
  fiscalYear,
  ownershipFilter,
  monthLabels,
  selectedExecutionMonth,
  selectedExecutionMonthLabel,
  ownershipOptions,
  isMonthlyCloseView,
  isLoading,
  liquidityExecutionError,
  monthlyCloseError,
  // Stepper
  monthlyCloseFlowSteps,
  activeMonthlyCloseStep,
  previousMonthlyCloseStep,
  nextMonthlyCloseStep,
  setActiveMonthlyCloseStep,
  goToPreviousMonthlyCloseStep,
  goToNextMonthlyCloseStep,
  selectOwnershipFilterOption,
  updateSelectedExecutionMonth,
  // Hero
  selectedMonthlyCloseResidual,
  selectedLiquidityStartBase,
  selectedLiquidityMonthExecuted,
  selectedIncomeMonthExecuted,
  selectedIncomeMonthPlanned,
  selectedExpenseMonthExecuted,
  selectedExpenseMonthPlanned,
  // Expense step
  expenseMonthlySummary,
  expenseExecutionLoading,
  expenseExecutionBusyEntryId,
  groupedMonthlyExpenseExecutionEntries,
  monthlyExpenseCoverageSummary,
  monthlyExpenseCoverageDetail,
  monthlyExpenseCoverageLabel,
  monthlyExpensePendingClassification,
  expenseAdjustAmounts,
  setExpenseAdjustAmount,
  selectedExpenseMonthDeviation,
  executionSourceLabel,
  expenseCheckinRowSummary,
  checkinStatusLabel,
  isLockedExecutionRow,
  isExpenseGroupUnlocked,
  resetExpenseCheckinDraftValue,
  resetExpenseGroupCheckinDraftValue,
  ensureExpenseAdjustAmountPrefilled,
  ensureExpenseGroupAdjustAmountPrefilled,
  onExpenseAdjustAmountBlur,
  saveExpenseCheckinFromInput,
  saveExpenseGroupCheckinFromInput,
  onExpenseCheckinCheckboxToggle,
  onExpenseGroupReviewedToggle,
  unlockExpenseGroupManualAdjustment,
  relockExpenseGroupManualAdjustment,
  // Liquidity step
  liquidityMonthlySummary,
  liquidityExecutionLoading,
  liquidityExecutionBusyAssetId,
  monthlyLiquidityExecutionRows,
  selectedLiquidityMonthPlanned,
  selectedLiquidityMonthDeviation,
  liquidityAdjustAmounts,
  setLiquidityAdjustAmount,
  isLiquidityLedgerRowUnlocked,
  liquidityCheckinRowSummary,
  resetLiquidityCheckinDraftValue,
  ensureLiquidityAdjustAmountPrefilled,
  onLiquidityAdjustAmountBlur,
  saveLiquidityCheckinFromInput,
  unlockLiquidityLedgerRow,
  relockLiquidityLedgerRow,
  onLiquidityCheckinCheckboxToggle,
  // Income step
  groupedMonthlyIncomeExecutionEntries,
  incomeExecutionLoading,
  incomeExecutionError,
  incomeExecutionBusyEntryId,
  incomeAdjustAmounts,
  setIncomeAdjustAmount,
  selectedIncomeMonthDeviation,
  selectedIncomeMonthCompletionRatio,
  monthlyIncomeCoverageSummary,
  monthlyIncomeCoverageDetail,
  monthlyIncomeCoverageLabel,
  monthlyIncomePendingClassification,
  isIncomeGroupUnlocked,
  resetIncomeGroupCheckinDraftValue,
  ensureIncomeGroupAdjustAmountPrefilled,
  saveIncomeGroupCheckinFromInput,
  onIncomeGroupReviewedToggle,
  unlockIncomeGroupManualAdjustment,
  relockIncomeGroupManualAdjustment,
  // Result step
  selectedMonthlyCloseExpected,
  selectedMonthlyCloseCompletionRatio,
  selectedMonthlyExecutedVolume,
  selectedMonthlyResidualSeverity,
  selectedMonthlyResidualSeverityLabel,
  selectedMonthlyResidualVolumeRatio,
  selectedMonthlyResidualIncomeRatio,
  selectedMonthlyResidualExpenseRatio,
  selectedMonthlyResidualExpectedCloseRatio,
  selectedPerimeterInternalExpenseTotal,
  resultReconciliationFlowRows,
  resultReconciliationCompositionRows,
  monthlyIncomeExecutionEntries,
  monthlyExpenseExecutionEntries,
  monthlyIncomeResultBreakdown,
  monthlyExpenseResultBreakdown,
  closeStatus,
  isCloseLocked,
  monthlyCloseActionBusy,
  hasDistributionSuggestion,
  handleFinalizeClose,
  handleReopenClose,
  handleLockClose,
  handleApplyDistribution,
  // Formatters
  formatMoney,
  formatPercent,
  formatSignedMoney,
} = useMonthlyCloseView();

type MonthlyCloseStepId = Parameters<typeof setActiveMonthlyCloseStep>[0];

const stepperSteps = computed(() => {
  const steps = monthlyCloseFlowSteps.value;
  const activeIdx = steps.findIndex((s) => s.id === activeMonthlyCloseStep.value);
  return steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: (index < activeIdx ? 'done' : index === activeIdx ? 'current' : 'pending') as
      | 'done'
      | 'current'
      | 'pending',
  }));
});

const monthSelectOptions = computed<ASelectItem[]>(() =>
  monthLabels.map((label, i) => ({
    value: String(i + 1),
    label: `${label} ${fiscalYear.value}`,
  })),
);

const ownershipSelectOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos' },
  ...ownershipOptions.value.map((option) => ({ value: option.value, label: option.label })),
]);

function onStepChange(id: string): void {
  setActiveMonthlyCloseStep(id as MonthlyCloseStepId);
}

function goToBudget(): void {
  router.push({ name: 'budget-dashboard' });
}

function goToCloseStep(): void {
  setActiveMonthlyCloseStep('result' as MonthlyCloseStepId);
}
</script>

<template>
  <div class="page mc-page">
    <APageHead :title="`Cierre · ${selectedExecutionMonthLabel}`">
      <template #meta>
        <AMetaPill>FY {{ fiscalYear }}</AMetaPill>
        <span class="dot"></span>
        <span>{{ isCloseLocked ? 'Cerrado' : 'Borrador' }}</span>
      </template>
      <template #actions>
        <AButton variant="ghost" @click="goToBudget">Ver presupuesto</AButton>
        <AButton variant="primary" @click="goToCloseStep">Cerrar mes →</AButton>
      </template>
    </APageHead>

    <section class="mc-read-section" aria-label="Filtros de cierre mensual">
      <div class="mc-read-controls">
        <label class="context-field mc-control-chip">
          <span class="mc-sr-only">Mes</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Mes"
            :model-value="String(selectedExecutionMonth)"
            :options="monthSelectOptions"
            @update:model-value="(v) => updateSelectedExecutionMonth(Number(v))"
          />
        </label>

        <label class="context-field mc-control-chip">
          <span class="mc-sr-only">Titularidad</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Titularidad"
            :model-value="ownershipFilter"
            :options="ownershipSelectOptions"
            :searchable="false"
            @update:model-value="(v) => selectOwnershipFilterOption(String(v))"
          />
        </label>
      </div>
    </section>

    <section class="sect mc-stepper-section" aria-label="Pasos del cierre mensual">
      <div class="mc-stepper-row">
        <AStepper
          :steps="stepperSteps"
          :active-id="activeMonthlyCloseStep"
          eyebrow-prefix="Paso"
          @change="onStepChange"
        />
        <div class="mc-stepper-nav">
          <AButton
            variant="ghost"
            :disabled="!previousMonthlyCloseStep"
            @click="goToPreviousMonthlyCloseStep()"
          >
            ← Anterior
          </AButton>
          <AButton
            variant="primary"
            :disabled="!nextMonthlyCloseStep"
            @click="goToNextMonthlyCloseStep()"
          >
            Siguiente →
          </AButton>
        </div>
      </div>
    </section>

    <MonthlyCloseHero
      :month-label="selectedExecutionMonthLabel"
      :residual="selectedMonthlyCloseResidual"
      :liquidity-start="selectedLiquidityStartBase"
      :liquidity-end="selectedLiquidityMonthExecuted"
      :income-executed="selectedIncomeMonthExecuted"
      :income-planned="selectedIncomeMonthPlanned"
      :expense-executed="selectedExpenseMonthExecuted"
      :expense-planned="selectedExpenseMonthPlanned"
      :format-money="formatMoney"
      :format-signed-money="formatSignedMoney"
    />

    <AState v-if="liquidityExecutionError" status="error">{{ liquidityExecutionError }}</AState>
    <AState v-if="monthlyCloseError" status="error">{{ monthlyCloseError }}</AState>

    <BudgetMonthlyCloseLiquiditySection
      :is-monthly-close-view="isMonthlyCloseView"
      :active-monthly-close-step="activeMonthlyCloseStep"
      :is-close-locked="isCloseLocked"
      :month-labels="monthLabels"
      :selected-execution-month="selectedExecutionMonth"
      :liquidity-monthly-summary="liquidityMonthlySummary"
      :liquidity-execution-loading="liquidityExecutionLoading"
      :liquidity-execution-busy-asset-id="liquidityExecutionBusyAssetId"
      :monthly-liquidity-execution-rows="monthlyLiquidityExecutionRows"
      :selected-liquidity-month-planned="selectedLiquidityMonthPlanned"
      :selected-liquidity-month-executed="selectedLiquidityMonthExecuted"
      :selected-liquidity-month-deviation="selectedLiquidityMonthDeviation"
      :liquidity-adjust-amounts="liquidityAdjustAmounts"
      :set-liquidity-adjust-amount="setLiquidityAdjustAmount"
      :is-liquidity-ledger-row-unlocked="isLiquidityLedgerRowUnlocked"
      :format-money="formatMoney"
      :format-percent="formatPercent"
      :checkin-status-label="checkinStatusLabel"
      :liquidity-checkin-row-summary="liquidityCheckinRowSummary"
      :update-selected-execution-month="updateSelectedExecutionMonth"
      :reset-liquidity-checkin-draft-value="resetLiquidityCheckinDraftValue"
      :ensure-liquidity-adjust-amount-prefilled="ensureLiquidityAdjustAmountPrefilled"
      :on-liquidity-adjust-amount-blur="onLiquidityAdjustAmountBlur"
      :save-liquidity-checkin-from-input="saveLiquidityCheckinFromInput"
      :unlock-liquidity-ledger-row="unlockLiquidityLedgerRow"
      :relock-liquidity-ledger-row="relockLiquidityLedgerRow"
      :on-liquidity-checkin-checkbox-toggle="onLiquidityCheckinCheckboxToggle"
    />

    <BudgetMonthlyCloseIncomeSection
      :is-monthly-close-view="isMonthlyCloseView"
      :active-monthly-close-step="activeMonthlyCloseStep"
      :is-close-locked="isCloseLocked"
      :grouped-monthly-income-execution-entries="groupedMonthlyIncomeExecutionEntries"
      :income-execution-loading="incomeExecutionLoading"
      :income-execution-error="incomeExecutionError"
      :income-execution-busy-entry-id="incomeExecutionBusyEntryId"
      :income-adjust-amounts="incomeAdjustAmounts"
      :set-income-adjust-amount="setIncomeAdjustAmount"
      :selected-income-month-planned="selectedIncomeMonthPlanned"
      :selected-income-month-executed="selectedIncomeMonthExecuted"
      :selected-income-month-deviation="selectedIncomeMonthDeviation"
      :selected-income-month-completion-ratio="selectedIncomeMonthCompletionRatio"
      :monthly-income-coverage-summary="monthlyIncomeCoverageSummary"
      :monthly-income-coverage-detail="monthlyIncomeCoverageDetail"
      :monthly-income-coverage-label="monthlyIncomeCoverageLabel"
      :monthly-income-pending-classification="monthlyIncomePendingClassification"
      :format-money="formatMoney"
      :format-percent="formatPercent"
      :checkin-status-label="checkinStatusLabel"
      :is-income-group-unlocked="isIncomeGroupUnlocked"
      :reset-income-group-checkin-draft-value="resetIncomeGroupCheckinDraftValue"
      :ensure-income-group-adjust-amount-prefilled="ensureIncomeGroupAdjustAmountPrefilled"
      :save-income-group-checkin-from-input="saveIncomeGroupCheckinFromInput"
      :on-income-group-reviewed-toggle="onIncomeGroupReviewedToggle"
      :unlock-income-group-manual-adjustment="unlockIncomeGroupManualAdjustment"
      :relock-income-group-manual-adjustment="relockIncomeGroupManualAdjustment"
    />

    <BudgetMonthlyCloseExpenseSection
      :is-monthly-close-view="isMonthlyCloseView"
      :active-monthly-close-step="activeMonthlyCloseStep"
      :is-close-locked="isCloseLocked"
      :expense-monthly-summary="expenseMonthlySummary"
      :expense-execution-loading="expenseExecutionLoading"
      :expense-execution-busy-entry-id="expenseExecutionBusyEntryId"
      :grouped-monthly-expense-execution-entries="groupedMonthlyExpenseExecutionEntries"
      :monthly-expense-coverage-summary="monthlyExpenseCoverageSummary"
      :monthly-expense-coverage-detail="monthlyExpenseCoverageDetail"
      :monthly-expense-coverage-label="monthlyExpenseCoverageLabel"
      :monthly-expense-pending-classification="monthlyExpensePendingClassification"
      :expense-adjust-amounts="expenseAdjustAmounts"
      :set-expense-adjust-amount="setExpenseAdjustAmount"
      :selected-expense-month-planned="selectedExpenseMonthPlanned"
      :selected-expense-month-executed="selectedExpenseMonthExecuted"
      :selected-expense-month-deviation="selectedExpenseMonthDeviation"
      :format-money="formatMoney"
      :format-percent="formatPercent"
      :execution-source-label="executionSourceLabel"
      :expense-checkin-row-summary="expenseCheckinRowSummary"
      :checkin-status-label="checkinStatusLabel"
      :is-locked-execution-row="isLockedExecutionRow"
      :is-expense-group-unlocked="isExpenseGroupUnlocked"
      :reset-expense-checkin-draft-value="resetExpenseCheckinDraftValue"
      :reset-expense-group-checkin-draft-value="resetExpenseGroupCheckinDraftValue"
      :ensure-expense-adjust-amount-prefilled="ensureExpenseAdjustAmountPrefilled"
      :ensure-expense-group-adjust-amount-prefilled="ensureExpenseGroupAdjustAmountPrefilled"
      :on-expense-adjust-amount-blur="onExpenseAdjustAmountBlur"
      :save-expense-checkin-from-input="saveExpenseCheckinFromInput"
      :save-expense-group-checkin-from-input="saveExpenseGroupCheckinFromInput"
      :on-expense-checkin-checkbox-toggle="onExpenseCheckinCheckboxToggle"
      :on-expense-group-reviewed-toggle="onExpenseGroupReviewedToggle"
      :unlock-expense-group-manual-adjustment="unlockExpenseGroupManualAdjustment"
      :relock-expense-group-manual-adjustment="relockExpenseGroupManualAdjustment"
    />

    <BudgetMonthlyCloseResultSection
      :is-monthly-close-view="isMonthlyCloseView"
      :active-monthly-close-step="activeMonthlyCloseStep"
      :selected-liquidity-start-base="selectedLiquidityStartBase"
      :selected-monthly-close-expected="selectedMonthlyCloseExpected"
      :selected-liquidity-month-executed="selectedLiquidityMonthExecuted"
      :selected-monthly-close-residual="selectedMonthlyCloseResidual"
      :selected-income-month-executed="selectedIncomeMonthExecuted"
      :selected-expense-month-executed="selectedExpenseMonthExecuted"
      :selected-monthly-close-completion-ratio="selectedMonthlyCloseCompletionRatio"
      :selected-liquidity-month-deviation="selectedLiquidityMonthDeviation"
      :selected-monthly-executed-volume="selectedMonthlyExecutedVolume"
      :selected-monthly-residual-severity="selectedMonthlyResidualSeverity"
      :selected-monthly-residual-severity-label="selectedMonthlyResidualSeverityLabel"
      :selected-monthly-residual-volume-ratio="selectedMonthlyResidualVolumeRatio"
      :selected-monthly-residual-income-ratio="selectedMonthlyResidualIncomeRatio"
      :selected-monthly-residual-expense-ratio="selectedMonthlyResidualExpenseRatio"
      :selected-monthly-residual-expected-close-ratio="selectedMonthlyResidualExpectedCloseRatio"
      :selected-perimeter-internal-expense-total="selectedPerimeterInternalExpenseTotal"
      :result-reconciliation-flow-rows="resultReconciliationFlowRows"
      :result-reconciliation-composition-rows="resultReconciliationCompositionRows"
      :monthly-income-execution-entries="monthlyIncomeExecutionEntries"
      :monthly-expense-execution-entries="monthlyExpenseExecutionEntries"
      :monthly-income-result-breakdown="monthlyIncomeResultBreakdown"
      :monthly-expense-result-breakdown="monthlyExpenseResultBreakdown"
      :format-money="formatMoney"
      :format-percent="formatPercent"
      :format-signed-money="formatSignedMoney"
      :close-status="closeStatus ?? undefined"
      :is-close-locked="isCloseLocked"
      :monthly-close-action-busy="monthlyCloseActionBusy"
      :has-distribution-suggestion="hasDistributionSuggestion"
      :on-finalize-close="handleFinalizeClose"
      :on-reopen-close="handleReopenClose"
      :on-lock-close="handleLockClose"
      :on-apply-distribution="handleApplyDistribution"
    />

    <AState v-if="isLoading" status="loading" layout="inline">Cargando cierre mensual…</AState>
  </div>
</template>
