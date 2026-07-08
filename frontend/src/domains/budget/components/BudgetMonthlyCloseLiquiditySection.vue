<script setup lang="ts">
import { computed } from 'vue';
import { AInfoHint, AKpiBand, ASectHead, AState, type AKpiItem } from '@/domains/ui';

type MonthlyCloseStepId = 'liq' | 'income' | 'expense' | 'result';
type LiquidityResetMode = 'zero' | 'planned';

type LiquidityRow = {
  row_type?: 'asset' | 'liability';
  asset_id: number;
  asset_name: string;
  asset_category: string;
  asset_subcategory: string;
  annual_interest_tae?: string | null;
  liability_id?: number;
  liability_name?: string;
  liability_category?: string;
  planned: number;
  executed: number | null;
  currency: string;
  coverage_source?: 'ledger' | 'checkin' | 'liability' | 'none';
  ledger_available?: boolean;
  planned_closing_balance: string;
  executed_closing_balance: string | null;
  effective_closing_balance: string;
  deviation: string;
  planned_closing_balance_base: string;
  executed_closing_balance_base: string | null;
  effective_closing_balance_base: string;
  deviation_base: string;
  checkin: {
    id: number;
    status: 'confirmed' | 'adjusted';
    closing_balance_real: string;
    note: string;
    confirmed_at: string | null;
    updated_at: string | null;
  } | null;
};

type LiquidityCategoryBlock = {
  key: string;
  label: string;
  plannedTotal: number;
  executedTotal: number;
  deviation: number;
  completionRatio: number;
  reviewedCount: number;
  rows: LiquidityRow[];
};

const props = defineProps<{
  isMonthlyCloseView: boolean;
  activeMonthlyCloseStep: MonthlyCloseStepId;
  isCloseLocked?: boolean;
  monthLabels: string[];
  selectedExecutionMonth: number;
  liquidityMonthlySummary: { completion_ratio?: number | null } | null;
  liquidityExecutionLoading: boolean;
  liquidityExecutionBusyAssetId: number | null;
  monthlyLiquidityExecutionRows: LiquidityRow[];
  selectedLiquidityMonthPlanned: number;
  selectedLiquidityMonthExecuted: number;
  selectedLiquidityMonthDeviation: number;
  liquidityAdjustAmounts: Record<number, string>;
  setLiquidityAdjustAmount: (assetId: number, value: string) => void;
  isLiquidityLedgerRowUnlocked: (assetId: number) => boolean;
  formatMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
  checkinStatusLabel: (status: 'confirmed' | 'adjusted' | 'skipped') => string;
  liquidityCheckinRowSummary: (row: LiquidityRow) => string;
  updateSelectedExecutionMonth: (value: number) => void;
  resetLiquidityCheckinDraftValue: (
    row: LiquidityRow,
    mode: LiquidityResetMode,
  ) => void | Promise<void>;
  ensureLiquidityAdjustAmountPrefilled: (row: LiquidityRow) => void;
  onLiquidityAdjustAmountBlur: (row: LiquidityRow) => void | Promise<void>;
  saveLiquidityCheckinFromInput: (row: LiquidityRow) => void | Promise<void>;
  unlockLiquidityLedgerRow: (row: LiquidityRow) => void | Promise<void>;
  relockLiquidityLedgerRow: (row: LiquidityRow) => void | Promise<void>;
  onLiquidityCheckinCheckboxToggle: (row: LiquidityRow, checked: boolean) => void | Promise<void>;
}>();

const kpiItems = computed<AKpiItem[]>(() => [
  {
    label: 'Perímetro anterior',
    value: `${props.formatMoney(props.selectedLiquidityMonthPlanned)} €`,
  },
  {
    label: 'Perímetro real cierre',
    value: `${props.formatMoney(props.selectedLiquidityMonthExecuted)} €`,
  },
  {
    label: 'Variación perímetro',
    value: `${props.selectedLiquidityMonthDeviation > 0 ? '+' : ''}${props.formatMoney(props.selectedLiquidityMonthDeviation)} €`,
    cellClass: {
      'mc-kpi-dev-danger': props.selectedLiquidityMonthDeviation < 0,
      'mc-kpi-dev-good': props.selectedLiquidityMonthDeviation > 0,
    },
  },
  {
    label: 'Completitud',
    value: props.formatPercent(props.liquidityMonthlySummary?.completion_ratio ?? null, 0),
  },
]);

function liquidityBlockKey(row: LiquidityRow): string {
  const annualInterestTae = Number(String(row.annual_interest_tae ?? '0').replace(',', '.'));
  const hasExpectedInterest = Number.isFinite(annualInterestTae) && annualInterestTae > 0;
  if (row.row_type === 'liability' || row.liability_category === 'credit_card') {
    return 'credit_cards';
  }
  if (row.asset_subcategory === 'short_term_deposit') return 'liquid_deposits';
  if (
    row.asset_subcategory === 'crypto_spot_earn' ||
    (row.asset_category === 'cash' && hasExpectedInterest)
  ) {
    return 'yield_accounts';
  }
  if (row.asset_subcategory === 'bank_account' || row.asset_subcategory === 'wallet') {
    return 'cash_accounts';
  }
  return 'other_liquidity';
}

function liquidityBlockLabel(key: string): string {
  const labels: Record<string, string> = {
    cash_accounts: 'Cuentas y efectivo',
    yield_accounts: 'Cuentas remuneradas',
    liquid_deposits: 'Depositos liquidos',
    credit_cards: 'Tarjetas de crédito',
    other_liquidity: 'Otros liquidos',
  };
  return labels[key] ?? 'Otros liquidos';
}

function isLiquidityRowReviewed(row: LiquidityRow): boolean {
  return row.coverage_source === 'ledger' || !!row.checkin;
}

const liquidityCategoryBlocks = computed<LiquidityCategoryBlock[]>(() => {
  const order = [
    'cash_accounts',
    'yield_accounts',
    'liquid_deposits',
    'credit_cards',
    'other_liquidity',
  ];
  const blocks = new Map<string, LiquidityCategoryBlock>();

  for (const row of props.monthlyLiquidityExecutionRows) {
    const key = liquidityBlockKey(row);
    let block = blocks.get(key);
    if (!block) {
      block = {
        key,
        label: liquidityBlockLabel(key),
        plannedTotal: 0,
        executedTotal: 0,
        deviation: 0,
        completionRatio: 0,
        reviewedCount: 0,
        rows: [],
      };
      blocks.set(key, block);
    }

    block.rows.push(row);
    block.plannedTotal += row.planned;
    block.executedTotal += row.executed ?? 0;
    if (isLiquidityRowReviewed(row)) block.reviewedCount += 1;
  }

  return Array.from(blocks.values())
    .map((block) => ({
      ...block,
      deviation: block.executedTotal - block.plannedTotal,
      completionRatio: block.rows.length ? block.reviewedCount / block.rows.length : 1,
    }))
    .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
});
</script>

<template>
  <section v-if="isMonthlyCloseView && activeMonthlyCloseStep === 'liq'" class="sect mc-step">
    <ASectHead title="Cierre de liquidez">
      <template #hint>
        <AInfoHint label="Sobre este paso">
          Ajusta el perímetro de cierre: caja, activos incluidos y tarjetas de crédito.
        </AInfoHint>
      </template>
    </ASectHead>

    <AKpiBand v-if="liquidityMonthlySummary" class="mc-step-kpis" :items="kpiItems" />

    <div v-if="isCloseLocked" class="mc-locked">
      Este mes está finalizado. Reabre el cierre para editar.
    </div>

    <AState v-if="liquidityExecutionLoading" status="loading" layout="inline"
      >Cargando cierre de liquidez…</AState
    >
    <AState v-else-if="!monthlyLiquidityExecutionRows.length" status="empty" layout="inline">
      No hay activos o pasivos líquidos activos para este mes.
    </AState>
    <div v-else class="mc-blocks">
      <details
        v-for="block in liquidityCategoryBlocks"
        :key="`liquidity-checkin-category-${block.key}`"
        class="mc-block"
        :open="block.completionRatio < 1 || block.deviation !== 0"
      >
        <summary>
          <div class="mc-block-title-wrap">
            <strong class="mc-block-title">{{ block.label }}</strong>
            <span class="mc-block-meta">
              {{ block.rows.length }} posiciones · {{ Math.round(block.completionRatio * 100) }} %
              revisión
            </span>
          </div>
          <div class="mc-block-kpis">
            <span>P {{ formatMoney(block.plannedTotal) }} €</span>
            <span>E {{ formatMoney(block.executedTotal) }} €</span>
            <span
              :class="block.deviation > 0 ? 'mc-dev-neg' : block.deviation < 0 ? 'mc-dev-pos' : ''"
            >
              D {{ block.deviation > 0 ? '+' : '' }}{{ formatMoney(block.deviation) }} €
            </span>
          </div>
        </summary>

        <div class="mc-rows">
          <article
            v-for="row in block.rows"
            :key="`liquidity-checkin-${row.row_type ?? 'asset'}-${row.asset_id}`"
            class="mc-row"
          >
            <div class="mc-row-main">
              <div class="mc-row-title" :title="liquidityCheckinRowSummary(row)">
                {{ liquidityCheckinRowSummary(row) }}
                <span class="mc-row-ref">
                  (Ref. {{ formatMoney(row.planned) }}
                  {{ row.currency === 'EUR' ? '€' : row.currency }})
                </span>
              </div>
              <div
                v-if="
                  row.ledger_available &&
                  (row.coverage_source === 'ledger' ||
                    !row.checkin ||
                    isLiquidityLedgerRowUnlocked(row.asset_id))
                "
                class="mc-row-state"
              >
                <strong>Libro contable activo</strong>
                <span
                  v-if="row.executed != null && row.executed !== row.planned"
                  :class="row.executed > row.planned ? 'mc-dev-neg' : 'mc-dev-pos'"
                >
                  Desviación {{ row.executed > row.planned ? '+' : ''
                  }}{{ formatMoney(row.executed - row.planned) }}
                  {{ row.currency === 'EUR' ? '€' : row.currency }}
                </span>
                <span v-if="isLiquidityLedgerRowUnlocked(row.asset_id)" class="mc-row-note">
                  Ajuste manual abierto. Guarda el saldo o vuelve al libro contable.
                </span>
              </div>
              <div v-else-if="row.ledger_available && row.checkin" class="mc-row-state">
                <strong>Ajuste manual sobre libro contable:</strong>
                <template v-if="row.executed != null">
                  {{ formatMoney(row.executed) }}
                  {{ row.currency === 'EUR' ? '€' : row.currency }}
                </template>
              </div>
              <div v-else-if="row.checkin" class="mc-row-state">
                <strong>{{ checkinStatusLabel(row.checkin.status) }}</strong>
                <template v-if="row.executed != null">
                  ({{ formatMoney(row.executed) }}
                  {{ row.currency === 'EUR' ? '€' : row.currency }})
                </template>
              </div>
            </div>

            <div class="mc-row-actions">
              <div
                v-if="
                  (row.ledger_available || (!row.ledger_available && row.checkin)) &&
                  !isLiquidityLedgerRowUnlocked(row.asset_id)
                "
                class="mc-adjust"
              >
                <div v-if="row.executed != null" class="mc-ledger-readout">
                  <span>Saldo cierre</span>
                  <strong>
                    {{ formatMoney(row.executed) }}
                    {{ row.currency === 'EUR' ? '€' : row.currency }}
                  </strong>
                </div>
                <button
                  type="button"
                  class="mc-mini-btn"
                  :disabled="isCloseLocked || liquidityExecutionBusyAssetId === row.asset_id"
                  title="Abrir un ajuste manual sin modificar todavía el libro contable"
                  @click="unlockLiquidityLedgerRow(row)"
                >
                  Ajustar manualmente
                </button>
              </div>
              <div v-else class="mc-adjust">
                <input
                  :value="liquidityAdjustAmounts[row.asset_id] ?? ''"
                  inputmode="decimal"
                  class="mc-input"
                  :disabled="isCloseLocked"
                  placeholder="Saldo real"
                  @input="
                    setLiquidityAdjustAmount(
                      row.asset_id,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                  @focus="ensureLiquidityAdjustAmountPrefilled(row)"
                  @blur="onLiquidityAdjustAmountBlur(row)"
                  @keydown.enter.prevent="($event.target as HTMLInputElement).blur()"
                />
                <div class="mc-quick-actions">
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="isCloseLocked || liquidityExecutionBusyAssetId === row.asset_id"
                    title="Poner saldo real a 0"
                    @click="resetLiquidityCheckinDraftValue(row, 'zero')"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    class="mc-mini-btn"
                    :disabled="isCloseLocked || liquidityExecutionBusyAssetId === row.asset_id"
                    title="Restaurar saldo de referencia"
                    @click="resetLiquidityCheckinDraftValue(row, 'planned')"
                  >
                    Referencia
                  </button>
                  <button
                    v-if="row.ledger_available"
                    type="button"
                    class="mc-mini-btn"
                    :disabled="isCloseLocked || liquidityExecutionBusyAssetId === row.asset_id"
                    title="Volver a usar el saldo del libro contable"
                    @click="relockLiquidityLedgerRow(row)"
                  >
                    Usar libro
                  </button>
                </div>
              </div>
              <label
                v-if="
                  !(
                    row.ledger_available ||
                    (!row.ledger_available && row.checkin) ||
                    (row.coverage_source === 'ledger' &&
                      !isLiquidityLedgerRowUnlocked(row.asset_id))
                  )
                "
                class="mc-confirm"
                title="Confirmar cierre de liquidez"
              >
                <input
                  type="checkbox"
                  :checked="!!row.checkin"
                  :disabled="
                    isCloseLocked ||
                    (row.ledger_available &&
                      row.coverage_source === 'ledger' &&
                      !isLiquidityLedgerRowUnlocked(row.asset_id)) ||
                    liquidityExecutionBusyAssetId === row.asset_id
                  "
                  aria-label="Confirmar cierre de liquidez"
                  @change="
                    onLiquidityCheckinCheckboxToggle(
                      row,
                      Boolean(($event.target as HTMLInputElement).checked),
                    )
                  "
                />
              </label>
            </div>
          </article>
        </div>
      </details>
    </div>
  </section>
</template>
