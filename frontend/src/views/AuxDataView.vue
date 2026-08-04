<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/domains/aux-data/styles/aux-data.css';
import { useAuxDataPage } from '@/domains/aux-data';
import {
  countIncidents,
  describeCoverage,
  latestSuccess,
  worstCoverage,
  type CoverageReading,
} from '@/domains/aux-data/marketHealth';
import type { MarketDataState } from '@/domains/aux-data/types';
import { FamilyMemberManager, OwnershipManager } from '@/domains/people';
import { AButton, AKpiBand, APageHead, ASectHead, AState, AToast } from '@/domains/ui';
import type { AKpiItem } from '@/domains/ui';

const route = useRoute();
const router = useRouter();

const {
  loading,
  error,
  syncError,
  syncSuccess,
  syncingInflation,
  syncingFx,
  fxRates,
  inflation,
  fxStates,
  inflationStates,
  supportedInflationRegions,
  formatInflationIndex,
  formatFxRate,
  syncInflationNow,
  syncFxHistoryNow,
} = useAuxDataPage();

type AuxTab = 'personas' | 'mercado';

function parseTab(value: unknown): AuxTab {
  return value === 'mercado' ? 'mercado' : 'personas';
}

const activeTab = ref<AuxTab>(parseTab(route.query.tab));

function setTab(tab: AuxTab): void {
  activeTab.value = tab;
  const query = { ...route.query };
  if (tab === 'personas') delete query.tab;
  else query.tab = tab;
  void router.replace({ query });
}

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = parseTab(tab);
  },
);

const regionLabelMap = computed(
  () => new Map(supportedInflationRegions.value.map((region) => [region.code, region.label])),
);

const inflationCoverage = computed(() => worstCoverage(inflationStates.value, 'inflation'));
const fxCoverage = computed(() => worstCoverage(fxStates.value, 'fx'));
const allStates = computed(() => [...inflationStates.value, ...fxStates.value]);
const incidentCount = computed(() => countIncidents(allStates.value));

// La cifra del KPI es la fecha cubierta (dato tabular, que es para lo que sirve
// la mono de `AKpiBand`) y el estado operativo va al meta, coloreado con las
// clases compartidas `.pos`/`.neg` del design system.
const marketKpis = computed<AKpiItem[]>(() => [
  {
    label: 'Cobertura IPC',
    value: inflationCoverage.value.coveredUntil ?? '—',
  },
  {
    label: 'Cobertura divisas',
    value: fxCoverage.value.coveredUntil ?? '—',
  },
  {
    label: 'Incidencias',
    value: String(incidentCount.value),
    meta: incidentCount.value
      ? 'series con error en el último intento'
      : `último éxito ${formatTimestamp(latestSuccess(allStates.value))}`,
  },
]);

function coverageToneClass(reading: CoverageReading): string {
  if (reading.status === 'ok') return 'pos';
  if (reading.status === 'stale') return 'neg';
  if (reading.status === 'warn') return 'a-aux-tone-warn';
  return '';
}

function coverageOf(state: MarketDataState, dataset: 'inflation' | 'fx'): CoverageReading {
  return describeCoverage(state, dataset);
}

function formatTimestamp(value: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('es-ES');
}
</script>

<template>
  <div class="page a-aux-page">
    <APageHead title="Datos auxiliares" />

    <nav class="a-aux-tabs-bar" aria-label="Secciones de datos auxiliares">
      <div class="tabs">
        <button
          class="tab"
          type="button"
          :class="{ on: activeTab === 'personas' }"
          @click="setTab('personas')"
        >
          Personas
        </button>
        <button
          class="tab"
          type="button"
          :class="{ on: activeTab === 'mercado' }"
          @click="setTab('mercado')"
        >
          Datos de mercado
        </button>
      </div>
    </nav>

    <AToast :open="Boolean(syncSuccess)" @close="syncSuccess = null">{{ syncSuccess }}</AToast>

    <AState v-if="error" status="error">{{ error }}</AState>

    <template v-if="activeTab === 'personas'">
      <FamilyMemberManager />
      <OwnershipManager />
    </template>

    <template v-else>
      <AState v-if="loading && !inflationStates.length && !fxStates.length" status="loading">
        Cargando datos de mercado…
      </AState>

      <template v-else>
        <AKpiBand :items="marketKpis">
          <template #meta-0>
            <span :class="coverageToneClass(inflationCoverage)">
              {{ inflationCoverage.label }}
            </span>
          </template>
          <template #meta-1>
            <span :class="coverageToneClass(fxCoverage)">{{ fxCoverage.label }}</span>
          </template>
        </AKpiBand>

        <AState v-if="syncError" status="error" layout="inline">{{ syncError }}</AState>

        <section class="sect">
          <ASectHead
            title="Índice de precios (IPC)"
            subtitle="Alimenta las proyecciones en términos reales de Mi Plan."
          >
            <template #actions>
              <AButton
                :loading="syncingInflation"
                :disabled="syncingInflation"
                @click="syncInflationNow"
              >
                Actualizar IPC
              </AButton>
            </template>
          </ASectHead>

          <div v-if="inflationStates.length" class="a-aux-status-grid">
            <article v-for="state in inflationStates" :key="state.scope" class="a-aux-status-card">
              <div class="a-aux-status-head">
                <span class="a-aux-status-scope">
                  {{ regionLabelMap.get(state.scope) ?? state.scope }}
                </span>
                <span class="chip" :class="`a-aux-cov-${coverageOf(state, 'inflation').status}`">{{
                  coverageOf(state, 'inflation').label
                }}</span>
              </div>
              <div class="a-aux-status-row">
                <span>Cubierto hasta</span><strong>{{ state.covered_until ?? '—' }}</strong>
              </div>
              <div class="a-aux-status-row">
                <span>Requerido desde</span><strong>{{ state.required_start_date ?? '—' }}</strong>
              </div>
              <div class="a-aux-status-row">
                <span>Último éxito</span
                ><strong>{{ formatTimestamp(state.last_success_at) }}</strong>
              </div>
              <p v-if="state.last_error" class="a-aux-status-error">{{ state.last_error }}</p>
            </article>
          </div>

          <table v-if="inflation.length" class="data-table a-aux-table">
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Región</th>
                <th class="num">Índice</th>
                <th>Sincronizado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in inflation" :key="row.id">
                <td class="a-aux-cell-primary">{{ row.period }}</td>
                <td data-label="Región">{{ regionLabelMap.get(row.region) ?? row.region }}</td>
                <td class="num mono" data-label="Índice">{{ formatInflationIndex(row.index) }}</td>
                <td data-label="Sincronizado">{{ formatTimestamp(row.last_synced_at ?? null) }}</td>
              </tr>
            </tbody>
          </table>
          <AState v-else status="empty" layout="inline">
            No hay índices IPC sincronizados todavía. Usa «Actualizar IPC» para traerlos.
          </AState>
          <p v-if="inflation.length" class="a-aux-table-note">
            Últimos {{ inflation.length }} registros sincronizados.
          </p>
        </section>

        <section class="sect">
          <ASectHead
            title="Tasas de cambio"
            subtitle="Convierten a moneda base las posiciones y movimientos en divisa."
          >
            <template #actions>
              <AButton :loading="syncingFx" :disabled="syncingFx" @click="syncFxHistoryNow">
                Actualizar histórico
              </AButton>
            </template>
          </ASectHead>

          <div v-if="fxStates.length" class="a-aux-status-grid">
            <article v-for="state in fxStates" :key="state.scope" class="a-aux-status-card">
              <div class="a-aux-status-head">
                <span class="a-aux-status-scope">{{ state.scope }}</span>
                <span class="chip" :class="`a-aux-cov-${coverageOf(state, 'fx').status}`">{{
                  coverageOf(state, 'fx').label
                }}</span>
              </div>
              <div class="a-aux-status-row">
                <span>Cubierto hasta</span><strong>{{ state.covered_until ?? '—' }}</strong>
              </div>
              <div class="a-aux-status-row">
                <span>Requerido desde</span><strong>{{ state.required_start_date ?? '—' }}</strong>
              </div>
              <div class="a-aux-status-row">
                <span>Último éxito</span
                ><strong>{{ formatTimestamp(state.last_success_at) }}</strong>
              </div>
              <p v-if="state.last_error" class="a-aux-status-error">{{ state.last_error }}</p>
            </article>
          </div>

          <table v-if="fxRates.length" class="data-table a-aux-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Par</th>
                <th class="num">Tasa</th>
                <th>Sincronizado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in fxRates" :key="row.id">
                <td class="a-aux-cell-primary">{{ row.rate_date }}</td>
                <td data-label="Par">{{ row.from_currency }} → {{ row.to_currency }}</td>
                <td class="num mono" data-label="Tasa">
                  {{ formatFxRate(row.rate, row.from_currency, row.to_currency) }}
                </td>
                <td data-label="Sincronizado">{{ formatTimestamp(row.last_synced_at ?? null) }}</td>
              </tr>
            </tbody>
          </table>
          <AState v-else status="empty" layout="inline">
            No hay tasas sincronizadas todavía. Usa «Actualizar histórico» para traerlas.
          </AState>
          <p v-if="fxRates.length" class="a-aux-table-note">
            Últimos {{ fxRates.length }} registros sincronizados.
          </p>
        </section>
      </template>
    </template>
  </div>
</template>
