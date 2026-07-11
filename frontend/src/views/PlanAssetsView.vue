<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import type { ClassifiedPlanAsset, PlanAssetFunction } from '@/domains/plan';
import { assetFunctionLabel, assetFunctionLabels } from '@/domains/plan/scenarioTemplates';
import { formatMoney, toNumber } from '@/lib/format';
import '@/domains/plan/plan.css';

const { store, error } = usePlan();

const classification = computed(() => store.assetFunctions);
const assets = computed(() => classification.value?.assets ?? []);

const summary = computed(() => {
  if (!classification.value) return [];
  return [
    { label: assetFunctionLabels.productive, value: classification.value.productive_capital },
    { label: assetFunctionLabels.security, value: classification.value.security_capital },
    {
      label: assetFunctionLabels.short_term_goal,
      value: classification.value.short_term_goal_capital,
    },
    { label: assetFunctionLabels.family_use, value: classification.value.family_use_capital },
    { label: assetFunctionLabels.unknown, value: classification.value.unknown_capital },
  ];
});

const unknownCount = computed(
  () => assets.value.filter((asset) => asset.function === 'unknown').length,
);

function functionOptions(asset: ClassifiedPlanAsset): ASelectItem[] {
  return [
    { value: 'auto', label: `Automática (${assetFunctionLabel(asset.inferred_function)})` },
    ...Object.entries(assetFunctionLabels).map(([value, label]) => ({ value, label })),
  ];
}

function currentValue(asset: ClassifiedPlanAsset): string {
  return asset.override_function ?? 'auto';
}

async function onFunctionChange(
  asset: ClassifiedPlanAsset,
  value: string | number | null,
): Promise<void> {
  const fn = value === 'auto' ? null : (value as PlanAssetFunction);
  if (fn === asset.override_function) return;
  await store.updateAssetFunction(asset.asset_id, fn);
}

function money(value: string): string {
  return formatMoney(toNumber(value));
}

onMounted(() => {
  void store.fetchAssetFunctions();
});
</script>

<template>
  <main class="page plan-page plan-assets-page">
    <APageHead title="Clasificar activos" eyebrow="Mi Plan">
      <template #meta>
        <span>Solo el capital productivo cuenta para la fecha proyectada</span>
      </template>
      <template #actions>
        <RouterLink class="btn btn-ghost" to="/plan">Volver a Mi Plan</RouterLink>
      </template>
    </APageHead>

    <AState v-if="store.assetFunctionsLoading && !classification" status="loading">
      Cargando activos...
    </AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <template v-if="classification">
      <section class="sect plan-assets-summary-sect">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Capital por función</p>
            <h2 class="sect-title">{{ money(classification.total_assets) }} en activos</h2>
            <p class="sect-sub">
              Cada activo aporta a una función. La proyección crece solo con lo clasificado como
              productivo.
            </p>
          </div>
        </div>
        <div class="plan-assets-summary">
          <article v-for="item in summary" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ money(item.value) }}</strong>
          </article>
        </div>
      </section>

      <section class="sect plan-assets-list-sect">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Activos</p>
            <h2 class="sect-title">Función de cada activo</h2>
            <p class="sect-sub">
              La función automática se infiere de la categoría. Cámbiala si no encaja; "Automática"
              vuelve a la inferida.
            </p>
          </div>
        </div>

        <div v-if="!assets.length" class="plan-empty-inline">
          <p class="plan-muted">No hay activos registrados todavía.</p>
          <RouterLink class="btn btn-ghost btn-sm" to="/patrimonio"
            >Registrar en Patrimonio</RouterLink
          >
        </div>

        <ul v-else class="plan-assets-list">
          <li v-for="asset in assets" :key="asset.asset_id" class="plan-asset-row">
            <div class="plan-asset-info">
              <strong>{{ asset.name }}</strong>
              <span>
                Neto {{ money(asset.net_value) }}
                <template v-if="toNumber(asset.associated_liabilities) > 0">
                  · Deuda asociada {{ money(asset.associated_liabilities) }}
                </template>
              </span>
            </div>
            <label class="plan-asset-fn">
              <span v-if="asset.override_function">Manual</span>
              <span v-else>Automática</span>
              <ASelect
                :model-value="currentValue(asset)"
                :options="functionOptions(asset)"
                class="filter-ctrl"
                :searchable="false"
                :disabled="store.saving"
                @update:model-value="(value) => onFunctionChange(asset, value)"
              />
            </label>
          </li>
        </ul>

        <p v-if="unknownCount" class="plan-quality-next">
          {{ unknownCount }} activo{{ unknownCount === 1 ? '' : 's' }} sin clasificar: no cuenta{{
            unknownCount === 1 ? '' : 'n'
          }}
          como capital productivo ni de seguridad.
        </p>
      </section>
    </template>
  </main>
</template>
