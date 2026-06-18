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
import { AContextBar, APageHead, BaseModal } from '@/domains/ui';

const route = useRoute();
const page = useAccountingMovementsPage();

const currentMonthLabel = computed(() =>
  new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date()),
);

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
    <APageHead title="Movimientos">
      <template #meta>
        <span>{{ currentMonthLabel }}</span>
        <span class="dot" />
        <span>{{ page.accounts.length }} cuentas</span>
        <span class="dot" />
        <span>Partida doble</span>
      </template>
      <template #actions>
        <button
          class="btn btn-primary"
          type="button"
          :disabled="!page.liquidityAccounts.length"
          @click="page.showQuickEntryModal = true"
        >
          + Asiento rápido
        </button>
      </template>
    </APageHead>

    <AContextBar v-if="page.ownershipFilterOptions.length > 1">
      <label class="context-field">
        <span class="context-field-label">Titularidad</span>
        <select
          class="filter-ctrl"
          :value="String(page.dailyBalanceOwnershipFilter)"
          @change="
            const v = ($event.target as HTMLSelectElement).value;
            page.dailyBalanceOwnershipFilter =
              v === 'all' ? 'all' : v === 'null' ? null : Number(v);
          "
        >
          <option value="all">Todos</option>
          <option
            v-for="opt in page.ownershipFilterOptions"
            :key="String(opt.value)"
            :value="String(opt.value)"
          >
            {{ opt.label }}
          </option>
        </select>
      </label>
    </AContextBar>

    <!-- Hero: saldo neto + KPIs izquierda · gráfico diario derecha -->
    <section class="sect">
      <div class="a-mov-hero">
        <div class="hero-headline">
          <p class="eyebrow hero-eyebrow">Saldo neto contable</p>
          <div class="hero-value mono">{{ page.formatMoney(page.accountingNetBalance) }}</div>
          <div class="kpis">
            <div class="kpi">
              <p class="kpi-label">Activos contables</p>
              <div class="kpi-value a-mov-kpi-pos">
                {{ page.formatMoney(page.accountingAssetsTotal) }}
              </div>
            </div>
            <div class="kpi">
              <p class="kpi-label">Pasivos contables</p>
              <div class="kpi-value a-mov-kpi-neg">
                {{ page.formatMoney(page.accountingLiabilitiesTotal) }}
              </div>
            </div>
          </div>
        </div>

        <div class="a-mov-chart-side">
          <div v-if="page.dailyBalanceSeriesLoading" class="a-mov-state a-mov-state-loading">
            Cargando evolución diaria...
          </div>
          <div v-else-if="page.dailyBalanceSeriesError" class="a-mov-state a-mov-state-error">
            {{ page.dailyBalanceSeriesError }}
          </div>
          <div v-else-if="!page.dailyBalanceSeriesRows.length" class="a-mov-state">
            No hay movimientos suficientes para construir la serie diaria.
          </div>
          <template v-else>
            <div class="a-mov-chart-toolbar">
              <div class="seg" role="group" aria-label="Rango temporal">
                <button
                  v-for="preset in page.dailyTimelinePresetOptions"
                  :key="preset"
                  :class="{
                    on:
                      page.dailyTimelineCustomWindow === null &&
                      page.selectedDailyTimelinePreset === preset,
                  }"
                  type="button"
                  @click="page.setDailyTimelinePreset(preset)"
                >
                  {{ preset }}
                </button>
              </div>
              <span class="a-mov-range-caption">{{ page.dailyBalanceSeriesRangeLabel }}</span>
              <button
                class="btn btn-ghost a-mov-expand-btn"
                type="button"
                @click="page.dailyTimelineExpanded = true"
              >
                Expandir
              </button>
            </div>
            <div class="a-mov-chart-shell">
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
          </template>
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
      <div class="a-mov-modal-inner">
        <div class="a-mov-modal-head">
          <div>
            <div class="a-mov-modal-title">Saldo neto contable</div>
            <div class="a-mov-modal-copy">{{ page.dailyBalanceSeriesRangeLabel }}</div>
          </div>
          <div class="a-mov-modal-value">
            {{ page.formatMoney(page.dailyBalanceLatestChartPoint?.value ?? 0) }}
          </div>
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

        <div class="a-mov-chart-shell">
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
          <button
            v-if="page.activeTab === 'cuentas' && page.hasAvailableManualPositions"
            class="btn"
            type="button"
            @click="page.openActivationModal"
          >
            + Activar cuenta
          </button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="!page.liquidityAccounts.length"
            @click="page.showQuickEntryModal = true"
          >
            + Asiento rápido
          </button>
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
