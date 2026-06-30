<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuxDataPage } from '@/domains/aux-data';
import { FamilyMemberManager, OwnershipManager } from '@/domains/people';
import { AButton, AChevron, APageHead, AToast } from '@/domains/ui';
import { useCollapsibleGroups } from '@/lib/useCollapsibleGroups';

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

const regionLabelMap = computed(
  () => new Map(supportedInflationRegions.value.map((region) => [region.code, region.label])),
);

const { isCollapsed: isSectionCollapsed, toggle: toggleSection } = useCollapsibleGroups();
const isSectionExpanded = (section: string): boolean => !isSectionCollapsed(section);
type FamilyTab = 'members' | 'ownerships';
const familyTab = ref<FamilyTab>('members');

function formatTimestamp(value: string | null): string {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('es-ES');
}
</script>

<template>
  <div class="container ui-page-shell">
    <APageHead title="Datos auxiliares" />

    <AToast :open="!!syncSuccess" @close="syncSuccess = null">{{ syncSuccess }}</AToast>

    <div v-if="error" class="alert mt-3">{{ error }}</div>

    <section class="card ui-section-card ui-settings-accordion-item">
      <button
        class="ui-settings-toggle"
        type="button"
        :aria-expanded="isSectionExpanded('family')"
        @click="toggleSection('family')"
      >
        <span class="ui-settings-toggle-title">Miembros de la familia</span>
        <span class="ui-settings-toggle-icon" aria-hidden="true">
          <AChevron :expanded="isSectionExpanded('family')" />
        </span>
      </button>
      <div v-if="isSectionExpanded('family')" class="ui-settings-content">
        <div class="ui-settings-family-tabs">
          <AButton
            class="opacity-60"
            :class="{ '!opacity-100': familyTab === 'members' }"
            @click="familyTab = 'members'"
          >
            Miembros
          </AButton>
          <AButton
            class="opacity-60"
            :class="{ '!opacity-100': familyTab === 'ownerships' }"
            @click="familyTab = 'ownerships'"
          >
            Titularidades
          </AButton>
        </div>

        <FamilyMemberManager v-if="familyTab === 'members'" />
        <OwnershipManager v-else />
      </div>
    </section>

    <section class="card ui-section-card ui-settings-accordion-item">
      <button
        class="ui-settings-toggle"
        type="button"
        :aria-expanded="isSectionExpanded('ipc')"
        @click="toggleSection('ipc')"
      >
        <span class="ui-settings-toggle-title">Datos IPC</span>
        <span class="ui-settings-toggle-icon" aria-hidden="true">
          <AChevron :expanded="isSectionExpanded('ipc')" />
        </span>
      </button>
      <div v-if="isSectionExpanded('ipc')" class="ui-settings-content">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <AButton :disabled="syncingInflation" @click="syncInflationNow">
            {{ syncingInflation ? 'Sincronizando IPC...' : 'Actualizar IPC ahora' }}
          </AButton>
          <span v-if="syncError" class="ui-form-help ui-form-help-error">{{ syncError }}</span>
        </div>

        <div class="ui-data-status-grid">
          <article v-for="state in inflationStates" :key="state.scope" class="ui-data-status-card">
            <div class="ui-data-status-card-head">
              <strong>{{ regionLabelMap.get(state.scope) ?? state.scope }}</strong>
              <span>{{ state.scope }}</span>
            </div>
            <div>Requerido desde: {{ state.required_start_date ?? '-' }}</div>
            <div>Cubierto hasta: {{ state.covered_until ?? '-' }}</div>
            <div>Ultimo exito: {{ formatTimestamp(state.last_success_at) }}</div>
            <div v-if="state.last_error" class="ui-form-help ui-form-help-error">
              {{ state.last_error }}
            </div>
          </article>
        </div>

        <table class="ui-data-table">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Region</th>
              <th>Indice</th>
              <th>Sync</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in inflation" :key="r.id">
              <td>{{ r.period }}</td>
              <td>{{ regionLabelMap.get(r.region) ?? r.region }}</td>
              <td>{{ formatInflationIndex(r.index) }}</td>
              <td>{{ r.last_synced_at ? formatTimestamp(r.last_synced_at) : '-' }}</td>
            </tr>
            <tr v-if="!inflation.length && !loading">
              <td colspan="4" class="ui-table-empty">No hay indices IPC sincronizados todavia.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card ui-section-card ui-settings-accordion-item">
      <button
        class="ui-settings-toggle"
        type="button"
        :aria-expanded="isSectionExpanded('fx')"
        @click="toggleSection('fx')"
      >
        <span class="ui-settings-toggle-title">Tasas de conversion</span>
        <span class="ui-settings-toggle-icon" aria-hidden="true">
          <AChevron :expanded="isSectionExpanded('fx')" />
        </span>
      </button>
      <div v-if="isSectionExpanded('fx')" class="ui-settings-content">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <AButton :disabled="syncingFx" @click="syncFxHistoryNow">
            {{ syncingFx ? 'Sincronizando FX...' : 'Actualizar FX histórico' }}
          </AButton>
        </div>

        <div class="ui-data-status-grid">
          <article v-for="state in fxStates" :key="state.scope" class="ui-data-status-card">
            <div class="ui-data-status-card-head">
              <strong>{{ state.scope }}</strong>
              <span>FX</span>
            </div>
            <div>Requerido desde: {{ state.required_start_date ?? '-' }}</div>
            <div>Cubierto hasta: {{ state.covered_until ?? '-' }}</div>
            <div>Ultimo exito: {{ formatTimestamp(state.last_success_at) }}</div>
            <div v-if="state.last_error" class="ui-form-help ui-form-help-error">
              {{ state.last_error }}
            </div>
          </article>
        </div>

        <table class="ui-data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Par</th>
              <th>Rate</th>
              <th>Sync</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in fxRates" :key="r.id">
              <td>{{ r.rate_date }}</td>
              <td>{{ r.from_currency }} -> {{ r.to_currency }}</td>
              <td>{{ formatFxRate(r.rate, r.from_currency, r.to_currency) }}</td>
              <td>{{ r.last_synced_at ? formatTimestamp(r.last_synced_at) : '-' }}</td>
            </tr>
            <tr v-if="!fxRates.length && !loading">
              <td colspan="4" class="ui-table-empty">No hay FX rates sincronizados todavia.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="loading" class="ui-status-line">Cargando datos auxiliares...</div>
  </div>
</template>
