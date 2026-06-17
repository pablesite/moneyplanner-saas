<script setup lang="ts">
import { computed } from 'vue';

type MonthlyCloseStepId = 'liq' | 'income' | 'expense' | 'result';
type MonthlyCloseStatus = 'draft' | 'finalized' | 'locked';
type ResultTone = 'positive' | 'warning' | 'negative' | 'neutral';
type ResultSeverity = 'ok' | 'watch' | 'alert';

type ResultFlowRow = {
  id: string;
  label: string;
  meta?: string | null;
  amount: number;
  tone: ResultTone;
  isResult?: boolean;
};

type ResultCompositionRow = {
  id: string;
  label: string;
  amount: number;
  tone: ResultTone;
  shareOfVolume: number | null;
};

type ResultBreakdownRow = {
  key: string;
  subcategoryLabel: string;
  executedTotal: number;
  shareOfExecuted: number;
  deviation: number;
};

type ResultBreakdownGroup = {
  key: string;
  categoryLabel: string;
  lineCount: number;
  plannedTotal: number;
  executedTotal: number;
  deviation: number;
  completionRatio: number;
  shareOfExecuted: number;
  rows: ResultBreakdownRow[];
};

const props = defineProps<{
  isMonthlyCloseView: boolean;
  activeMonthlyCloseStep: MonthlyCloseStepId;
  selectedLiquidityStartBase: number;
  selectedMonthlyCloseExpected: number;
  selectedLiquidityMonthExecuted: number;
  selectedMonthlyCloseResidual: number;
  selectedIncomeMonthExecuted: number;
  selectedExpenseMonthExecuted: number;
  selectedMonthlyCloseCompletionRatio: number | null;
  selectedLiquidityMonthDeviation: number;
  selectedMonthlyExecutedVolume: number;
  selectedMonthlyResidualSeverity: ResultSeverity;
  selectedMonthlyResidualSeverityLabel: string;
  selectedMonthlyResidualVolumeRatio: number | null;
  selectedMonthlyResidualIncomeRatio: number | null;
  selectedMonthlyResidualExpenseRatio: number | null;
  selectedMonthlyResidualExpectedCloseRatio: number | null;
  selectedPerimeterInternalExpenseTotal: number;
  resultReconciliationFlowRows: ResultFlowRow[];
  resultReconciliationCompositionRows: ResultCompositionRow[];
  monthlyIncomeExecutionEntries: Array<{ entry: { id: number } }>;
  monthlyExpenseExecutionEntries: Array<{ entry: { id: number } }>;
  monthlyIncomeResultBreakdown: ResultBreakdownGroup[];
  monthlyExpenseResultBreakdown: ResultBreakdownGroup[];
  closeStatus?: MonthlyCloseStatus;
  isCloseLocked?: boolean;
  monthlyCloseActionBusy?: boolean;
  hasDistributionSuggestion?: boolean;
  formatMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
  goToPreviousMonthlyCloseStep: () => void;
  onFinalizeClose?: () => void | Promise<void>;
  onReopenClose?: () => void | Promise<void>;
  onLockClose?: () => void | Promise<void>;
  onApplyDistribution?: () => void | Promise<void>;
}>();

const residualReading = computed(() => {
  if (props.selectedMonthlyCloseResidual < 0) return 'Falta caja vs explicado';
  if (props.selectedMonthlyCloseResidual > 0) return 'Sobra caja vs explicado';
  return 'Sin diferencia';
});

const selectedMonthlyCloseDelta = computed(
  () => props.selectedLiquidityMonthExecuted - props.selectedMonthlyCloseExpected,
);

const resultBridgeMax = computed(() => {
  const values = [
    props.selectedLiquidityStartBase,
    props.selectedIncomeMonthExecuted,
    props.selectedExpenseMonthExecuted,
    props.selectedMonthlyCloseExpected,
    props.selectedLiquidityMonthExecuted,
    Math.abs(props.selectedMonthlyCloseResidual),
  ].map((value) => Math.abs(value));
  return Math.max(...values, 1);
});

const resultBridgeRows = computed(() =>
  props.resultReconciliationFlowRows
    .filter((row) => row.id !== 'internal-perimeter-expense')
    .map((row) => ({
      ...row,
      width: Math.max(3, Math.min(100, (Math.abs(row.amount) / resultBridgeMax.value) * 100)),
    })),
);
</script>

<template>
  <section v-if="isMonthlyCloseView && activeMonthlyCloseStep === 'result'" class="sect mc-step">
    <div class="sect-head">
      <div>
        <h2 class="sect-title">Paso 4 · Resultado</h2>
        <p class="sect-sub">
          Residual contable provisional a partir del perímetro real y de ingresos/gastos confirmados
          del mes.
        </p>
      </div>
      <div v-if="closeStatus" class="actions">
        <template v-if="closeStatus === 'locked'">
          <span class="mc-locked">Este mes está bloqueado.</span>
        </template>
        <template v-else-if="closeStatus === 'finalized'">
          <button
            type="button"
            class="btn"
            :disabled="monthlyCloseActionBusy"
            @click="onReopenClose && onReopenClose()"
          >
            Reabrir cierre
          </button>
          <button
            type="button"
            class="btn mc-danger-btn"
            :disabled="monthlyCloseActionBusy"
            @click="onLockClose && onLockClose()"
          >
            Bloquear
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="monthlyCloseActionBusy"
            @click="onFinalizeClose && onFinalizeClose()"
          >
            Finalizar cierre
          </button>
          <button
            v-if="hasDistributionSuggestion"
            type="button"
            class="btn"
            :disabled="monthlyCloseActionBusy"
            @click="onApplyDistribution && onApplyDistribution()"
          >
            Aplicar distribución
          </button>
        </template>
      </div>
    </div>

    <div class="mc-result-hero">
      <article
        class="mc-result-card mc-result-card-primary"
        :class="{
          'mc-result-card-danger': selectedMonthlyCloseResidual < 0,
          'mc-result-card-good': selectedMonthlyCloseResidual > 0,
        }"
      >
        <div class="mc-result-card-head">
          <span>Residual contable</span>
          <span class="mc-sev" :class="`mc-sev-${selectedMonthlyResidualSeverity}`">
            {{ selectedMonthlyResidualSeverityLabel }}
          </span>
        </div>
        <strong>{{ formatSignedMoney(selectedMonthlyCloseResidual) }} EUR</strong>
        <small>
          {{ residualReading }} · {{ formatPercent(selectedMonthlyResidualVolumeRatio, 1) }} del
          volumen ejecutado
        </small>
      </article>
      <article class="mc-result-card">
        <span>Cierre esperado</span>
        <strong>{{ formatMoney(selectedMonthlyCloseExpected) }} EUR</strong>
        <small>Perímetro inicial + ingresos − gastos externos</small>
      </article>
      <article class="mc-result-card">
        <span>Cierre real</span>
        <strong>{{ formatMoney(selectedLiquidityMonthExecuted) }} EUR</strong>
        <small>
          {{ formatSignedMoney(selectedMonthlyCloseDelta) }} EUR frente al cierre esperado
        </small>
      </article>
      <article class="mc-result-card">
        <span>Completitud cierre</span>
        <strong>{{ formatPercent(selectedMonthlyCloseCompletionRatio, 0) }}</strong>
        <small>
          {{ monthlyIncomeExecutionEntries.length + monthlyExpenseExecutionEntries.length }} líneas
          revisadas
        </small>
      </article>
    </div>

    <div class="mc-result-cols">
      <section class="mc-result-panel">
        <div class="mc-result-panel-head">
          <h3 class="mc-result-panel-title">Conciliación de cierre</h3>
          <div class="mc-result-panel-meta">
            Volumen ejecutado {{ formatMoney(selectedMonthlyExecutedVolume) }} EUR
          </div>
        </div>
        <div class="mc-bridge">
          <div
            v-for="row in resultBridgeRows"
            :key="row.id"
            class="mc-bridge-row"
            :class="{
              'mc-bridge-row-result': !!row.isResult,
              'mc-bridge-row-positive': row.tone === 'positive',
              'mc-bridge-row-warning': row.tone === 'warning',
              'mc-bridge-row-negative': row.tone === 'negative',
            }"
          >
            <div class="mc-bridge-label">
              <span>{{ row.label }}</span>
              <small v-if="row.meta">{{ row.meta }}</small>
            </div>
            <div class="mc-bridge-track" aria-hidden="true">
              <div class="mc-bridge-fill" :style="{ width: `${row.width}%` }" />
            </div>
            <strong>{{ formatSignedMoney(row.amount) }} EUR</strong>
          </div>
        </div>
      </section>

      <section class="mc-result-panel">
        <div class="mc-result-panel-head">
          <h3 class="mc-result-panel-title">Diagnóstico del residual</h3>
          <span class="mc-sev" :class="`mc-sev-${selectedMonthlyResidualSeverity}`">
            {{ selectedMonthlyResidualSeverityLabel }}
          </span>
        </div>
        <div class="mc-diag">
          <div class="mc-diag-head">
            <span>Impacto del residual</span>
            <strong>{{ formatPercent(selectedMonthlyResidualVolumeRatio, 1) }}</strong>
          </div>
          <div class="mc-diag-track">
            <div class="mc-diag-zone-ok" />
            <div class="mc-diag-zone-watch" />
            <div class="mc-diag-zone-alert" />
            <div
              class="mc-diag-marker"
              :style="{
                left: `${
                  selectedMonthlyResidualVolumeRatio == null
                    ? 0
                    : Math.min(100, (selectedMonthlyResidualVolumeRatio / 0.03) * 100)
                }%`,
              }"
            />
          </div>
          <div class="mc-diag-labels">
            <span>0 %</span>
            <span>1 %</span>
            <span>3 %+</span>
          </div>
        </div>
        <div class="mc-result-mini-kpis">
          <article class="mc-result-mini-kpi">
            <span>Sobre cierre esperado</span>
            <strong>{{ formatPercent(selectedMonthlyResidualExpectedCloseRatio, 1) }}</strong>
          </article>
          <article class="mc-result-mini-kpi">
            <span>Umbral OK</span>
            <strong>≤ 1,0 %</strong>
          </article>
          <article class="mc-result-mini-kpi">
            <span>Umbral revisión</span>
            <strong>≤ 3,0 %</strong>
          </article>
        </div>
        <div v-if="selectedPerimeterInternalExpenseTotal > 0" class="mc-result-footnote">
          {{ formatMoney(selectedPerimeterInternalExpenseTotal) }} EUR movidos dentro del perímetro
          no cuentan como gasto externo.
        </div>
      </section>
    </div>

    <div class="mc-result-cols mc-result-cols-detail">
      <section class="mc-result-panel">
        <div class="mc-result-panel-head">
          <h3 class="mc-result-panel-title">Ingresos ejecutados (detalle del mes)</h3>
          <div class="mc-result-panel-meta">{{ monthlyIncomeExecutionEntries.length }} líneas</div>
        </div>
        <p v-if="!monthlyIncomeResultBreakdown.length" class="mc-empty">
          No hay ingresos ejecutables para este mes.
        </p>
        <div v-else class="mc-breakdown-list">
          <article
            v-for="group in monthlyIncomeResultBreakdown"
            :key="`result-income-${group.key}`"
            class="mc-breakdown-group"
          >
            <div class="mc-breakdown-head">
              <div>
                <strong>{{ group.categoryLabel }}</strong>
                <div class="mc-breakdown-submeta">
                  {{ group.lineCount }} líneas · {{ formatPercent(group.completionRatio, 0) }}
                  completitud
                </div>
              </div>
              <div class="mc-breakdown-kpis">
                <span>E {{ formatMoney(group.executedTotal) }} EUR</span>
                <span>P {{ formatMoney(group.plannedTotal) }} EUR</span>
                <span :class="group.deviation > 0 ? 'mc-dev-neg' : 'mc-dev-pos'">
                  D {{ formatSignedMoney(group.deviation) }} EUR
                </span>
                <span>{{ formatPercent(group.shareOfExecuted, 0) }} del total</span>
              </div>
            </div>
            <div class="mc-breakdown-rows">
              <div v-for="row in group.rows.slice(0, 5)" :key="row.key" class="mc-breakdown-row">
                <span class="mc-breakdown-name">{{ row.subcategoryLabel }}</span>
                <span>{{ formatMoney(row.executedTotal) }} EUR</span>
                <span>{{ formatPercent(row.shareOfExecuted, 0) }}</span>
                <span :class="row.deviation > 0 ? 'mc-dev-neg' : 'mc-dev-pos'">
                  {{ formatSignedMoney(row.deviation) }} EUR
                </span>
              </div>
              <div v-if="group.rows.length > 5" class="mc-breakdown-more">
                + {{ group.rows.length - 5 }} subcategorías más
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="mc-result-panel">
        <div class="mc-result-panel-head">
          <h3 class="mc-result-panel-title">Gastos ejecutados (detalle del mes)</h3>
          <div class="mc-result-panel-meta">{{ monthlyExpenseExecutionEntries.length }} líneas</div>
        </div>
        <p v-if="!monthlyExpenseResultBreakdown.length" class="mc-empty">
          No hay gastos ejecutables para este mes.
        </p>
        <div v-else class="mc-breakdown-list">
          <article
            v-for="group in monthlyExpenseResultBreakdown"
            :key="`result-expense-${group.key}`"
            class="mc-breakdown-group"
          >
            <div class="mc-breakdown-head">
              <div>
                <strong>{{ group.categoryLabel }}</strong>
                <div class="mc-breakdown-submeta">
                  {{ group.lineCount }} líneas · {{ formatPercent(group.completionRatio, 0) }}
                  completitud
                </div>
              </div>
              <div class="mc-breakdown-kpis">
                <span>E {{ formatMoney(group.executedTotal) }} EUR</span>
                <span>P {{ formatMoney(group.plannedTotal) }} EUR</span>
                <span :class="group.deviation > 0 ? 'mc-dev-pos' : 'mc-dev-neg'">
                  D {{ formatSignedMoney(group.deviation) }} EUR
                </span>
                <span>{{ formatPercent(group.shareOfExecuted, 0) }} del total</span>
              </div>
            </div>
            <div class="mc-breakdown-rows">
              <div v-for="row in group.rows.slice(0, 5)" :key="row.key" class="mc-breakdown-row">
                <span class="mc-breakdown-name">{{ row.subcategoryLabel }}</span>
                <span>{{ formatMoney(row.executedTotal) }} EUR</span>
                <span>{{ formatPercent(row.shareOfExecuted, 0) }}</span>
                <span :class="row.deviation > 0 ? 'mc-dev-pos' : 'mc-dev-neg'">
                  {{ formatSignedMoney(row.deviation) }} EUR
                </span>
              </div>
              <div v-if="group.rows.length > 5" class="mc-breakdown-more">
                + {{ group.rows.length - 5 }} subcategorías más
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
