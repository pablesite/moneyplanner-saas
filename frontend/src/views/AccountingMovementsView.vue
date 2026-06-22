<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import '@/domains/accounting/styles/movements.css';
import '@/domains/accounting/styles/accounting-movements-view.css';
import { useAccountingMovementsPage } from '@/domains/accounting/useAccountingMovementsPage';
import AccountingAccountCatalog from '@/domains/accounting/components/AccountingAccountCatalog.vue';
import AccountingMovementsAllTransactions from '@/domains/accounting/components/AccountingMovementsAllTransactions.vue';
import AccountingBalances from '@/domains/accounting/components/AccountingBalances.vue';
import AccountingMovementsActivationModal from '@/domains/accounting/components/AccountingMovementsActivationModal.vue';
import AccountingMovementsEditTransactionModal from '@/domains/accounting/components/AccountingMovementsEditTransactionModal.vue';
import AccountingMovementsQuickEntryModal from '@/domains/accounting/components/AccountingMovementsQuickEntryModal.vue';
import { NetWorthDeltaChart, NetWorthTimelineChart } from '@/domains/net-worth';
import {
  AButton,
  AContextBar,
  AHero,
  APageHead,
  ASectHead,
  ASelect,
  AState,
  BaseModal,
} from '@/domains/ui';
import type { ASelectItem } from '@/domains/ui';

const route = useRoute();
const page = useAccountingMovementsPage();

const currentMonthSummary = computed(() => {
  const month = new Date().getMonth() + 1;
  return page.summaryRows.find((r) => r.month === month) ?? null;
});

const currentMonthLabel = computed(() =>
  new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date()),
);

const assetGroups = computed(() =>
  page.groupedCuentasAccounts.filter((g) => g.positionType === 'asset'),
);

const liabilityGroups = computed(() =>
  page.groupedCuentasAccounts.filter((g) => g.positionType === 'liability'),
);

const ownershipOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos' },
  ...page.ownershipFilterOptions.map((o) => ({ value: String(o.value), label: o.label })),
]);

onMounted(async () => {
  const { tab, date_from, date_to, kind, category_key, subcategory_key } = route.query;
  if (tab === 'todos') {
    page.activeTab = 'todos';
  }
  if (date_from || date_to) {
    page.todosDatePreset = 'custom';
    page.todosDateFrom = String(date_from ?? '');
    page.todosDateTo = String(date_to ?? '');
  }
  if (kind && kind !== 'all') {
    page.activityFilters.kind = String(kind) as typeof page.activityFilters.kind;
    await nextTick();
  }
  if (category_key) {
    page.activityFilters.categoryKey = String(category_key);
    await nextTick();
  }
  if (subcategory_key) {
    page.activityFilters.subcategoryKey = String(subcategory_key);
  }
});

onBeforeRouteLeave(() => {
  page.dailyTimelineExpanded = false;
});

onBeforeUnmount(() => {
  page.dailyTimelineExpanded = false;
});
</script>

<template>
  <div class="page a-mov-page">
    <APageHead title="Contabilidad">
      <template #meta>
        <span>{{ currentMonthLabel }}</span>
        <span class="dot" />
        <span>{{ page.accounts.length }} cuentas</span>
        <span class="dot" />
        <span>Partida doble</span>
      </template>
      <template #actions>
        <AButton variant="ghost" class="a-mov-compact-action" @click="page.activeTab = 'cuentas'">
          Catálogo de cuentas
        </AButton>
        <AButton
          variant="primary"
          :disabled="!page.liquidityAccounts.length"
          @click="page.showQuickEntryModal = true"
        >
          + Asiento rápido
        </AButton>
      </template>
    </APageHead>

    <AContextBar v-if="page.ownershipFilterOptions.length > 1">
      <label class="context-field">
        <span class="context-field-label">Titularidad</span>
        <ASelect
          class="filter-ctrl"
          :model-value="String(page.dailyBalanceOwnershipFilter)"
          :options="ownershipOptions"
          :searchable="false"
          @update:model-value="
            (v) => {
              page.dailyBalanceOwnershipFilter =
                v === 'all' ? 'all' : v === 'null' ? null : Number(v);
            }
          "
        />
      </label>
    </AContextBar>

    <!-- Hero: saldo neto + delta | breakdown activos / pasivos -->
    <section class="sect">
      <div class="hero">
        <div class="hero-top">
          <AHero
            class="hero-headline"
            eyebrow="Saldo neto contable"
            :value="page.formatMoney(page.accountingNetBalance)"
          >
            <template v-if="currentMonthSummary" #delta>
              <span>
                <span class="pos mono">
                  +{{ page.formatMoney(currentMonthSummary.incomeValue) }}
                </span>
                <span class="hero-delta-copy">ingresos del mes</span>
              </span>
              <span class="hero-delta-sep">·</span>
              <span>
                <span class="neg mono">
                  −{{ page.formatMoney(currentMonthSummary.expenseValue) }}
                </span>
                <span class="hero-delta-copy">gastos del mes</span>
              </span>
            </template>
          </AHero>

          <div class="hero-breakdown">
            <!-- Activos -->
            <div class="hero-comp-side">
              <div class="hero-comp-title">
                <span>Activos</span>
                <b>{{ page.formatMoney(page.accountingAssetsTotal) }}</b>
              </div>
              <div class="comp-list">
                <div v-for="group in assetGroups" :key="group.key" class="comp-row">
                  <span class="comp-dot a-mov-comp-dot-asset" />
                  <span class="comp-label">{{ group.label }}</span>
                  <span class="comp-val mono">{{ page.formatMoney(group.subtotal) }}</span>
                </div>
                <p v-if="!assetGroups.length" class="comp-empty">Sin activos contables.</p>
              </div>
            </div>

            <!-- Pasivos -->
            <div class="hero-comp-side">
              <div class="hero-comp-title">
                <span>Pasivos</span>
                <b>{{ page.formatMoney(page.accountingLiabilitiesTotal) }}</b>
              </div>
              <div class="comp-list">
                <div v-for="group in liabilityGroups" :key="group.key" class="comp-row">
                  <span class="comp-dot a-mov-comp-dot-liability" />
                  <span class="comp-label">{{ group.label }}</span>
                  <span class="comp-val mono">{{ page.formatMoney(group.subtotal) }}</span>
                </div>
                <p v-if="!liabilityGroups.length" class="comp-empty">Sin pasivos contables.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Evolución: gráfico a ancho completo, igual que patrimonio -->
    <section class="sect">
      <ASectHead title="Evolución">
        <template #actions>
          <div class="actions">
            <div class="seg" role="group" aria-label="Rango temporal">
              <AButton
                v-for="preset in page.dailyTimelinePresetOptions"
                :key="preset"
                :class="{
                  on:
                    page.dailyTimelineCustomWindow === null &&
                    page.selectedDailyTimelinePreset === preset,
                }"
                @click="page.setDailyTimelinePreset(preset)"
              >
                {{ preset }}
              </AButton>
            </div>
            <AButton
              v-if="page.dailyBalanceSeriesChartPoints.length > 1"
              variant="ghost"
              class="a-mov-compact-action"
              @click="page.dailyTimelineExpanded = true"
            >
              Ampliar
            </AButton>
          </div>
        </template>
      </ASectHead>

      <AState v-if="page.dailyBalanceSeriesLoading" status="loading">
        Cargando evolución diaria...
      </AState>
      <AState v-else-if="page.dailyBalanceSeriesError" status="error">
        {{ page.dailyBalanceSeriesError }}
      </AState>
      <AState v-else-if="!page.dailyBalanceSeriesRows.length" status="empty">
        No hay movimientos suficientes para construir la serie diaria.
      </AState>
      <div v-else class="a-nw-chart-stack">
        <div class="a-nw-chart-summary">
          <div>
            <span class="a-nw-chart-label">Saldo neto contable</span>
            <strong class="mono">{{
              page.formatMoney(page.dailyBalanceLatestChartPoint?.value ?? 0)
            }}</strong>
          </div>
          <span>{{ page.dailyBalanceSeriesRangeLabel }}</span>
        </div>
        <div class="a-nw-chart-shell">
          <NetWorthTimelineChart
            :points="page.dailyBalanceSeriesChartPoints"
            :unit="page.dailyBalanceSeriesUnit"
            series-label="Saldo neto contable"
            aria-label="Evolución diaria del saldo neto contable"
          />
          <NetWorthDeltaChart
            :rows="page.dailyBalanceSeriesMonthlyRows"
            :unit="page.dailyBalanceSeriesUnit"
          />
        </div>
      </div>
    </section>

    <!-- Modal: gráfico expandido -->
    <BaseModal
      :open="page.dailyTimelineExpanded"
      title="Evolución contable diaria"
      variant="sheet"
      panel-class="a-mov-modal-panel dir-a"
      :close-on-backdrop="true"
      @close="page.dailyTimelineExpanded = false"
    >
      <div class="a-nw-modal-stack">
        <div class="a-nw-chart-summary">
          <div>
            <span class="a-nw-chart-label">Saldo neto contable</span>
            <strong class="mono">{{
              page.formatMoney(page.dailyBalanceLatestChartPoint?.value ?? 0)
            }}</strong>
          </div>
          <span>{{ page.dailyBalanceSeriesRangeLabel }}</span>
        </div>

        <div class="a-nw-range-grid">
          <label class="a-nw-range-field">
            <span>Inicio</span>
            <input
              class="a-nw-range-input"
              type="range"
              min="0"
              :max="Math.max(0, page.dailyBalanceSeriesRows.length - 1)"
              :value="page.dailyTimelineWindow.start"
              @input="
                page.updateDailyTimelineWindowStart(($event.target as HTMLInputElement).value)
              "
            />
            <strong>{{ page.dailyBalanceSeriesChartPoints[0]?.fullLabel ?? '-' }}</strong>
          </label>
          <label class="a-nw-range-field">
            <span>Fin</span>
            <input
              class="a-nw-range-input"
              type="range"
              min="0"
              :max="Math.max(0, page.dailyBalanceSeriesRows.length - 1)"
              :value="page.dailyTimelineWindow.end"
              @input="page.updateDailyTimelineWindowEnd(($event.target as HTMLInputElement).value)"
            />
            <strong>{{ page.dailyBalanceLatestChartPoint?.fullLabel ?? '-' }}</strong>
          </label>
        </div>

        <div class="a-nw-chart-shell a-nw-chart-shell-expanded">
          <NetWorthTimelineChart
            :points="page.dailyBalanceSeriesChartPoints"
            :unit="page.dailyBalanceSeriesUnit"
            series-label="Saldo neto contable"
            aria-label="Evolución diaria del saldo neto contable expandida"
            expanded
          />
          <NetWorthDeltaChart
            :rows="page.dailyBalanceSeriesMonthlyRows"
            :unit="page.dailyBalanceSeriesUnit"
          />
        </div>
      </div>
    </BaseModal>

    <!-- Tabs + contenido -->
    <section class="sect">
      <div class="a-mov-tabs-bar">
        <div class="tabs">
          <button
            class="tab"
            :class="{ on: page.activeTab === 'cuentas' }"
            type="button"
            @click="page.activeTab = 'cuentas'"
          >
            Cuentas
          </button>
          <button
            class="tab"
            :class="{ on: page.activeTab === 'todos' }"
            type="button"
            @click="page.activeTab = 'todos'"
          >
            Todos los movimientos
          </button>
          <button
            class="tab"
            :class="{ on: page.activeTab === 'estadisticas' }"
            type="button"
            @click="page.activeTab = 'estadisticas'"
          >
            Estadísticas
          </button>
        </div>
        <div class="a-mov-tabs-actions">
          <AButton
            v-if="page.activeTab === 'cuentas' && page.hasAvailableManualPositions"
            @click="page.openActivationModal"
          >
            + Activar cuenta
          </AButton>
        </div>
      </div>

      <AccountingAccountCatalog v-if="page.activeTab === 'cuentas'" :page="page" />
      <AccountingMovementsAllTransactions v-else-if="page.activeTab === 'todos'" :page="page" />
      <AccountingBalances v-else-if="page.activeTab === 'estadisticas'" :page="page" />
    </section>

    <AccountingMovementsActivationModal :page="page" />
    <AccountingMovementsEditTransactionModal :page="page" />
    <AccountingMovementsQuickEntryModal :page="page" />
  </div>
</template>
