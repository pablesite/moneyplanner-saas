<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  AButton,
  APageHead,
  AMetaPill,
  AStepper,
  ASectHead,
  ASelect,
  AState,
  AToast,
  BaseModal,
  type ASelectItem,
} from '@/domains/ui';
import {
  BudgetMonthlyCloseExpenseSection,
  BudgetMonthlyCloseIncomeSection,
  BudgetMonthlyCloseLiquiditySection,
  BudgetMonthlyCloseResultSection,
  MonthlyCloseSettlementSection,
  MonthlyCloseHero,
  SettlementConfigurationSheet,
  SettlementExecutionModal,
  acceptSettlementRecommendation,
  applyAllSettlementRecommendations,
  applySettlementRecommendation,
  buildSettlementPage,
  cancelSettlementRecommendation,
  getSettlementCandidates,
  getMonthlyClosePlanImpact,
  reconcileSettlementRecommendation,
  reverseSettlementRecommendation,
  toBudgetErrorMessage,
  type SettlementPage,
  type SettlementCandidate,
  type MonthlyClosePlanImpact,
} from '@/domains/budget';
import { peopleApi } from '@/domains/people/api';
import type { FamilyMember } from '@/domains/people/types';
import '@/domains/budget/styles/monthly-close.css';
import { useMonthlyCloseView } from './budget/useMonthlyCloseView';

const router = useRouter();
const route = useRoute();
const settlementConfigurationOpen = ref(false);
const settlementExecutionOpen = ref(false);
const settlementApplyAllOpen = ref(false);
const settlementApplyAllDate = ref(new Date().toISOString().slice(0, 10));
const settlementExecutionBusy = ref(false);
const settlementExecutionError = ref<string | null>(null);
const settlementCandidatesLoading = ref(false);
const settlementCandidates = ref<SettlementCandidate[]>([]);
const selectedSettlementRecommendation = ref<SettlementPage['recommendations'][number] | null>(
  null,
);
const settlementToast = ref<string | null>(null);
const settlementIdempotencyKey = ref('');
const familyMembers = ref<FamilyMember[]>([]);
const activeAdultCount = computed(
  () => familyMembers.value.filter((member) => member.is_active && member.role === 'adult').length,
);
const showSettlementConfiguration = computed(() => activeAdultCount.value > 1);

onMounted(() => {
  void peopleApi
    .getMembers()
    .then(({ data }) => {
      familyMembers.value = data;
    })
    .catch(() => {
      familyMembers.value = [];
    });
});

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
  selectedLiquidityAdjustmentTotal,
  resultReconciliationFlowRows,
  resultReconciliationCompositionRows,
  monthlyIncomeExecutionEntries,
  monthlyExpenseExecutionEntries,
  monthlyIncomeResultBreakdown,
  monthlyExpenseResultBreakdown,
  closeStatus,
  isCloseLocked,
  monthlyCloseActionBusy,
  monthlyCloseData,
  hasDistributionSuggestion,
  handleFinalizeClose,
  handleReopenClose,
  handleLockClose,
  handleApplyDistribution,
  refreshMonthlyCloseData,
  // Formatters
  formatMoney,
  formatPercent,
  formatSignedMoney,
} = useMonthlyCloseView();

const settlementPage = computed(() =>
  buildSettlementPage(monthlyCloseData.value?.ownership_settlement, familyMembers.value),
);

const planImpact = ref<MonthlyClosePlanImpact | null>(null);
const planImpactLoading = ref(false);

const planTrajectoryLabel = computed(() => {
  if (!planImpact.value) return '';
  if (planImpact.value.trajectory.status === 'on_track') return 'En trayectoria';
  if (planImpact.value.trajectory.status === 'delayed') return 'Con retraso estimado';
  return 'Fuera de trayectoria';
});

async function refreshPlanImpact(): Promise<void> {
  const closeId = monthlyCloseData.value?.monthly_close.id;
  const status = monthlyCloseData.value?.monthly_close.status;
  if (!closeId || status === 'draft') {
    planImpact.value = null;
    return;
  }
  planImpactLoading.value = true;
  try {
    planImpact.value = await getMonthlyClosePlanImpact(closeId);
  } catch {
    planImpact.value = null;
  } finally {
    planImpactLoading.value = false;
  }
}

watch(
  () => [monthlyCloseData.value?.monthly_close.id, monthlyCloseData.value?.monthly_close.status],
  () => {
    void refreshPlanImpact();
  },
  { immediate: true },
);

type MonthlyCloseStepId = Parameters<typeof setActiveMonthlyCloseStep>[0];

onMounted(() => {
  const query = route.query ?? {};
  const year = Number(Array.isArray(query.year) ? query.year[0] : query.year);
  const month = Number(Array.isArray(query.month) ? query.month[0] : query.month);
  const step = Array.isArray(query.step) ? query.step[0] : query.step;
  if (Number.isInteger(year) && year >= 2000 && year <= 2200) fiscalYear.value = year;
  if (Number.isInteger(month) && month >= 1 && month <= 12) updateSelectedExecutionMonth(month);
  if (step === 'liq' || step === 'income' || step === 'expense' || step === 'result') {
    setActiveMonthlyCloseStep(step);
  }
});

const stepperSteps = computed(() => {
  const steps = monthlyCloseFlowSteps.value;
  const activeIdx = steps.findIndex((s) => s.id === activeMonthlyCloseStep.value);
  return steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    status: (index < activeIdx ? 'done' : index === activeIdx ? 'current' : 'pending') as
      'done' | 'current' | 'pending',
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

function prepareSettlementTransfer(
  recommendation: SettlementPage['recommendations'][number],
): void {
  if (recommendation.sourceAssetId == null || recommendation.destinationAssetId == null) return;
  const returnTo = router.resolve({
    name: 'monthly-close',
    query: {
      year: String(fiscalYear.value),
      month: String(selectedExecutionMonth.value),
      step: 'result',
    },
  }).fullPath;
  void router.push({
    name: 'accounting-movements',
    query: {
      create: 'transfer',
      from_asset_id: String(recommendation.sourceAssetId),
      to_asset_id: String(recommendation.destinationAssetId),
      amount: recommendation.amount,
      transfer_ownership_id: String(recommendation.ownership_id),
      booking_date: new Date().toISOString().slice(0, 10),
      description: `Liquidación ${selectedExecutionMonthLabel.value}: ${recommendation.sourceName} → ${recommendation.destinationName}`,
      return_to: returnTo,
    },
  });
}

function newIdempotencyKey(recommendationId: number): string {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `settlement-ui:${recommendationId}:${random}`;
}

async function manageSettlementRecommendation(
  recommendation: SettlementPage['recommendations'][number],
): Promise<void> {
  if (recommendation.id == null) return;
  selectedSettlementRecommendation.value = recommendation;
  settlementIdempotencyKey.value = newIdempotencyKey(recommendation.id);
  settlementExecutionError.value = null;
  settlementExecutionOpen.value = true;
  settlementCandidatesLoading.value = true;
  try {
    settlementCandidates.value = await getSettlementCandidates(
      monthlyCloseData.value!.monthly_close.id,
      recommendation.id,
    );
  } catch {
    settlementCandidates.value = [];
  } finally {
    settlementCandidatesLoading.value = false;
  }
}

async function runSettlementAction(action: () => Promise<unknown>, success: string): Promise<void> {
  settlementExecutionBusy.value = true;
  settlementExecutionError.value = null;
  try {
    await action();
    await refreshMonthlyCloseData();
    const recommendationId = selectedSettlementRecommendation.value?.id;
    if (recommendationId != null) {
      selectedSettlementRecommendation.value =
        settlementPage.value.recommendations.find((row) => row.id === recommendationId) ?? null;
    }
    settlementToast.value = success;
  } catch (error: unknown) {
    settlementExecutionError.value = toBudgetErrorMessage(error);
  } finally {
    settlementExecutionBusy.value = false;
  }
}

async function applyAllSettlements(): Promise<void> {
  const closeId = monthlyCloseData.value?.monthly_close.id;
  if (!closeId) return;
  settlementExecutionBusy.value = true;
  try {
    await applyAllSettlementRecommendations(closeId, settlementApplyAllDate.value);
    await refreshMonthlyCloseData();
    settlementApplyAllOpen.value = false;
    settlementToast.value = 'Transferencias contables registradas.';
  } catch (error: unknown) {
    settlementToast.value = null;
    monthlyCloseError.value = toBudgetErrorMessage(error);
  } finally {
    settlementExecutionBusy.value = false;
  }
}

function closeSettlementExecution(): void {
  if (settlementExecutionBusy.value) return;
  settlementExecutionOpen.value = false;
  selectedSettlementRecommendation.value = null;
}

function confirmAllSettlements(): void {
  settlementApplyAllDate.value = new Date().toISOString().slice(0, 10);
  settlementApplyAllOpen.value = true;
}

function openSettlementMovement(transactionId: number): void {
  void router.push({
    name: 'accounting-movements',
    query: { transaction_id: String(transactionId) },
  });
}

function selectedExecutionIds(): { closeId: number; recommendationId: number } | null {
  const closeId = monthlyCloseData.value?.monthly_close.id;
  const recommendationId = selectedSettlementRecommendation.value?.id;
  return closeId && recommendationId ? { closeId, recommendationId } : null;
}

function applySelectedSettlement(payload: { amount?: string; executionDate: string }): void {
  const ids = selectedExecutionIds();
  if (!ids) return;
  void runSettlementAction(
    () =>
      applySettlementRecommendation(ids.closeId, ids.recommendationId, {
        execution_date: payload.executionDate,
        ...(payload.amount ? { amount: payload.amount } : {}),
        idempotency_key: settlementIdempotencyKey.value,
      }),
    'Transferencia contable registrada.',
  );
}

function acceptSelectedSettlement(): void {
  const ids = selectedExecutionIds();
  if (!ids) return;
  void runSettlementAction(
    () => acceptSettlementRecommendation(ids.closeId, ids.recommendationId),
    'Recomendación aceptada.',
  );
}

function cancelSelectedSettlement(): void {
  const ids = selectedExecutionIds();
  if (!ids) return;
  void runSettlementAction(
    () => cancelSettlementRecommendation(ids.closeId, ids.recommendationId),
    'Recomendación cancelada.',
  );
}

function reverseSelectedSettlement(payload: { executionDate: string }): void {
  const ids = selectedExecutionIds();
  if (!ids) return;
  void runSettlementAction(
    () =>
      reverseSettlementRecommendation(ids.closeId, ids.recommendationId, {
        execution_date: payload.executionDate,
        idempotency_key: `${settlementIdempotencyKey.value}:reverse`,
      }),
    'Reverso contable registrado.',
  );
}

function reconcileSelectedSettlement(transactionId: number): void {
  const ids = selectedExecutionIds();
  if (!ids) return;
  void runSettlementAction(
    () => reconcileSettlementRecommendation(ids.closeId, ids.recommendationId, transactionId),
    'Movimiento conciliado con la recomendación.',
  );
}

async function closeSettlementConfiguration(): Promise<void> {
  settlementConfigurationOpen.value = false;
  await refreshMonthlyCloseData();
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
      <div class="context-rail">
        <label class="context-field mc-control-chip">
          <span class="sr-only">Mes</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Mes"
            :model-value="String(selectedExecutionMonth)"
            :options="monthSelectOptions"
            @update:model-value="(v) => updateSelectedExecutionMonth(Number(v))"
          />
        </label>

        <label class="context-field mc-control-chip">
          <span class="sr-only">Titularidad</span>
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
      :selected-liquidity-adjustment-total="selectedLiquidityAdjustmentTotal"
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
      :show-settlement-configuration="showSettlementConfiguration"
      :on-finalize-close="handleFinalizeClose"
      :on-reopen-close="handleReopenClose"
      :on-lock-close="handleLockClose"
      :on-apply-distribution="handleApplyDistribution"
      :on-configure-settlement="() => (settlementConfigurationOpen = true)"
      :settlement-has-history="settlementPage.hasSettlementHistory"
    />

    <MonthlyCloseSettlementSection
      v-if="activeMonthlyCloseStep === 'result'"
      :page="settlementPage"
      :format-money="formatMoney"
      :format-signed-money="formatSignedMoney"
      :busy="settlementExecutionBusy"
      :locked="isCloseLocked"
      @configure="settlementConfigurationOpen = true"
      @transfer="prepareSettlementTransfer"
      @manage="manageSettlementRecommendation"
      @apply-all="confirmAllSettlements"
      @movement="openSettlementMovement"
    />

    <section v-if="planImpact || planImpactLoading" class="sect mc-plan-impact">
      <ASectHead
        eyebrow="Impacto en Mi Plan"
        title="Lectura del cierre mensual"
        subtitle="Se muestra solo cuando existe un plan financiero y el cierre ya está finalizado."
      />
      <AState v-if="planImpactLoading" status="loading" layout="inline">
        Calculando impacto en el plan...
      </AState>
      <template v-else-if="planImpact">
        <div class="mc-plan-impact-grid">
          <article>
            <span>Capital productivo</span>
            <strong>{{ formatMoney(Number(planImpact.capital.productive_capital)) }} €</strong>
            <small v-if="planImpact.capital.productive_capital_delta">
              {{ formatSignedMoney(Number(planImpact.capital.productive_capital_delta)) }}
            </small>
          </article>
          <article>
            <span>Patrimonio</span>
            <strong>{{ formatMoney(Number(planImpact.capital.net_worth)) }} €</strong>
            <small v-if="planImpact.capital.net_worth_delta">
              {{ formatSignedMoney(Number(planImpact.capital.net_worth_delta)) }}
            </small>
          </article>
          <article>
            <span>Trayectoria</span>
            <strong>{{ planTrajectoryLabel }}</strong>
            <small v-if="planImpact.trajectory.sustainable_year_delta">
              Cambio material: {{ planImpact.trajectory.sustainable_year_delta > 0 ? '+' : ''
              }}{{ planImpact.trajectory.sustainable_year_delta }} año(s)
            </small>
          </article>
        </div>
        <div v-if="planImpact.findings.length" class="mc-plan-impact-list">
          <p class="eyebrow">Atención</p>
          <p v-for="finding in planImpact.findings" :key="finding.id">
            {{ finding.code.replace(/_/g, ' ') }}
          </p>
        </div>
        <div v-if="planImpact.recommended_action" class="mc-plan-impact-action">
          <p class="eyebrow">Acción propuesta</p>
          <h3>{{ planImpact.recommended_action.action_json.title ?? 'Siguiente acción' }}</h3>
          <p>{{ planImpact.recommended_action.action_json.summary }}</p>
        </div>
      </template>
    </section>

    <AState v-if="isLoading" status="loading" layout="inline">Cargando cierre mensual…</AState>

    <SettlementConfigurationSheet
      v-if="settlementConfigurationOpen"
      :open="settlementConfigurationOpen"
      :year="fiscalYear"
      :month="selectedExecutionMonth"
      @close="closeSettlementConfiguration"
    />

    <SettlementExecutionModal
      :open="settlementExecutionOpen"
      :recommendation="selectedSettlementRecommendation"
      :candidates="settlementCandidates"
      :loading-candidates="settlementCandidatesLoading"
      :busy="settlementExecutionBusy"
      :error="settlementExecutionError"
      @close="closeSettlementExecution"
      @apply="applySelectedSettlement"
      @accept="acceptSelectedSettlement"
      @cancel="cancelSelectedSettlement"
      @reverse="reverseSelectedSettlement"
      @reconcile="reconcileSelectedSettlement"
    >
      <template #transactions="{ transactions }">
        <AButton
          v-for="movement in transactions"
          :key="movement.id"
          variant="ghost"
          size="sm"
          @click="openSettlementMovement(movement.id)"
        >
          Ver movimiento #{{ movement.id }}
        </AButton>
      </template>
    </SettlementExecutionModal>

    <BaseModal
      :open="settlementApplyAllOpen"
      title="Registrar todas las transferencias"
      variant="sheet"
      panel-class="dir-a mc-settlement-execution-modal"
      @close="!settlementExecutionBusy && (settlementApplyAllOpen = false)"
    >
      <div class="mc-settlement-execution-body">
        <AState status="neutral" layout="inline">
          Se crearán movimientos contables, no órdenes bancarias. El cierre conservará este
          histórico y ya no podrá reabrirse.
        </AState>
        <div class="mc-settlement-apply-list">
          <article
            v-for="recommendation in settlementPage.recommendations.filter(
              (row) => row.status !== 'cancelled' && row.remainingAmountNumber > 0,
            )"
            :key="recommendation.id"
          >
            <span>{{ recommendation.sourceName }} → {{ recommendation.destinationName }}</span>
            <strong>
              {{ formatMoney(recommendation.remainingAmountNumber) }} {{ recommendation.currency }}
            </strong>
          </article>
        </div>
        <label class="mc-settlement-apply-date">
          <span>Fecha contable</span>
          <input
            v-model="settlementApplyAllDate"
            class="input"
            type="date"
            :disabled="settlementExecutionBusy"
          />
        </label>
        <AButton
          variant="primary"
          block
          :loading="settlementExecutionBusy"
          @click="applyAllSettlements"
        >
          Confirmar y registrar
        </AButton>
      </div>
    </BaseModal>

    <AToast
      :open="Boolean(settlementToast)"
      :message="settlementToast"
      @close="settlementToast = null"
    />
  </div>
</template>
