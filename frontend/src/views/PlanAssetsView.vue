<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, APageHead, ASectHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import type { ClassifiedPlanAsset, PlanAssetFunction } from '@/domains/plan';
import { assetFunctionLabel, assetFunctionLabels } from '@/domains/plan/scenarioTemplates';
import { formatMoney, toNumber } from '@/lib/format';
import '@/domains/plan/plan.css';

const { store, error } = usePlan();

const classification = computed(() => store.assetFunctions);
const assets = computed(() => classification.value?.assets ?? []);

const search = ref('');
const activeFunction = ref<PlanAssetFunction | null>(null);
const reviewFilter = ref<'all' | 'review' | 'manual'>('all');
const savedAssetId = ref<number | null>(null);

// Sin clasificar primero: es lo único que bloquea la proyección.
const functionOrder: PlanAssetFunction[] = [
  'unknown',
  'productive',
  'security',
  'short_term_goal',
  'family_use',
];

// Todo plegado salvo "Sin clasificar" (lo único accionable de entrada): con
// decenas de posiciones, la página pasaba de las 9.000px en móvil.
const collapsedGroups = ref<Set<PlanAssetFunction>>(
  new Set(functionOrder.filter((fn) => fn !== 'unknown')),
);

const summary = computed(() => {
  if (!classification.value) return [];
  const capital: Record<PlanAssetFunction, string> = {
    productive: classification.value.productive_capital,
    security: classification.value.security_capital,
    short_term_goal: classification.value.short_term_goal_capital,
    family_use: classification.value.family_use_capital,
    unknown: classification.value.unknown_capital,
  };
  return (
    functionOrder
      .map((fn) => ({
        fn,
        label: assetFunctionLabels[fn],
        value: capital[fn],
        count: assets.value.filter((asset) => asset.function === fn).length,
      }))
      // "Sin clasificar 0" es la meta cumplida, no un dato: el tile vacío solo mete ruido.
      // Un "Productivo 0" sí se muestra: es una alerta real.
      .filter((item) => item.fn !== 'unknown' || item.count > 0)
  );
});

const filteredAssets = computed(() => {
  const query = search.value.trim().toLowerCase();
  return assets.value.filter(
    (asset) =>
      (!query || asset.name.toLowerCase().includes(query)) &&
      (!activeFunction.value || asset.function === activeFunction.value) &&
      (reviewFilter.value === 'all' ||
        (reviewFilter.value === 'review' && asset.function === 'unknown') ||
        (reviewFilter.value === 'manual' && Boolean(asset.override_function))),
  );
});

const groups = computed(() =>
  functionOrder
    .map((fn) => {
      const items = filteredAssets.value
        .filter((asset) => asset.function === fn)
        .sort((a, b) => toNumber(b.net_value) - toNumber(a.net_value));
      return {
        fn,
        label: assetFunctionLabels[fn],
        items,
        total: items.reduce((sum, asset) => sum + toNumber(asset.net_value), 0),
      };
    })
    .filter((group) => group.items.length),
);

const hasActiveFilter = computed(() =>
  Boolean(search.value.trim() || activeFunction.value || reviewFilter.value !== 'all'),
);

// Buscar o filtrar expande las coincidencias: un grupo plegado haría invisible el resultado.
function isGroupCollapsed(fn: PlanAssetFunction): boolean {
  return collapsedGroups.value.has(fn) && !hasActiveFilter.value;
}

const unknownCount = computed(
  () => assets.value.filter((asset) => asset.function === 'unknown').length,
);

function toggleFunction(fn: PlanAssetFunction): void {
  activeFunction.value = activeFunction.value === fn ? null : fn;
}

function clearFilters(): void {
  search.value = '';
  activeFunction.value = null;
  reviewFilter.value = 'all';
}

function toggleGroup(fn: PlanAssetFunction): void {
  const next = new Set(collapsedGroups.value);
  if (next.has(fn)) next.delete(fn);
  else next.add(fn);
  collapsedGroups.value = next;
}

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
  savedAssetId.value = asset.asset_id;
  window.setTimeout(() => {
    if (savedAssetId.value === asset.asset_id) savedAssetId.value = null;
  }, 1800);
}

function money(value: string): string {
  return formatMoney(toNumber(value));
}

onMounted(() => {
  document.title = 'Clasificar activos · The Arkenstone';
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

    <!-- Sin activos no hay nada que clasificar: fuera tiles a 0,00 € y buscador
         vacío; una sola acción clara hacia Patrimonio. -->
    <AState v-if="classification && !assets.length" status="empty" class="plan-onboarding">
      <div class="plan-empty">
        <p class="eyebrow">Sin activos</p>
        <h2>Aún no hay nada que clasificar</h2>
        <p>
          Registra tus activos y pasivos en Patrimonio. Después podrás asignar aquí la función de
          cada uno y la proyección tendrá una base real desde la que crecer.
        </p>
        <RouterLink class="btn btn-primary" to="/patrimonio">Registrar en Patrimonio</RouterLink>
      </div>
    </AState>

    <template v-else-if="classification">
      <section class="sect plan-assets-summary-sect">
        <ASectHead
          eyebrow="Capital por función"
          :title="`${money(classification.total_assets)} en activos`"
          subtitle="Cada activo aporta a una función. La proyección crece solo con lo clasificado como productivo. Pulsa una función para filtrar la lista."
        />
        <div class="plan-assets-summary">
          <button
            v-for="item in summary"
            :key="item.fn"
            type="button"
            class="plan-assets-summary-card"
            :class="{ active: activeFunction === item.fn }"
            :aria-pressed="activeFunction === item.fn"
            @click="toggleFunction(item.fn)"
          >
            <span>{{ item.label }}</span>
            <strong>{{ money(item.value) }}</strong>
            <small>{{ item.count }} activo{{ item.count === 1 ? '' : 's' }}</small>
          </button>
        </div>
      </section>

      <section class="sect plan-assets-list-sect">
        <ASectHead
          eyebrow="Activos"
          title="Función de cada activo"
          subtitle='La función automática se infiere de la categoría. Cámbiala si no encaja; "Automática" vuelve a la inferida.'
        />

        <div class="plan-assets-toolbar">
          <!-- La barra es sticky: la vuelta a Mi Plan viaja con el scroll en listas largas. -->
          <RouterLink class="btn btn-ghost btn-sm plan-assets-back" to="/plan">Mi Plan</RouterLink>
          <input
            v-model="search"
            class="input"
            type="search"
            placeholder="Buscar activo..."
            aria-label="Buscar activo"
          />
          <AButton
            variant="ghost"
            size="sm"
            :class="{ active: reviewFilter === 'review' }"
            @click="reviewFilter = reviewFilter === 'review' ? 'all' : 'review'"
          >
            Requieren revisión
          </AButton>
          <AButton
            variant="ghost"
            size="sm"
            :class="{ active: reviewFilter === 'manual' }"
            @click="reviewFilter = reviewFilter === 'manual' ? 'all' : 'manual'"
          >
            Modificados manualmente
          </AButton>
          <AButton v-if="hasActiveFilter" variant="ghost" size="sm" @click="clearFilters">
            Limpiar filtros
          </AButton>
        </div>

        <AState v-if="!groups.length" status="empty" layout="inline" class="plan-empty-inline">
          <p class="plan-muted">Ningún activo coincide con el filtro actual.</p>
          <AButton variant="ghost" size="sm" @click="clearFilters">Limpiar filtros</AButton>
        </AState>

        <template v-else>
          <div v-for="group in groups" :key="group.fn" class="plan-assets-group">
            <button
              type="button"
              class="plan-assets-group-head"
              :aria-expanded="!isGroupCollapsed(group.fn)"
              @click="toggleGroup(group.fn)"
            >
              <strong>{{ group.label }}</strong>
              <span>
                {{ group.items.length }} activo{{ group.items.length === 1 ? '' : 's' }} ·
                {{ formatMoney(group.total) }} ·
                {{ isGroupCollapsed(group.fn) ? 'Ver' : 'Ocultar' }}
              </span>
            </button>
            <ul v-if="!isGroupCollapsed(group.fn)" class="plan-assets-list">
              <li v-for="asset in group.items" :key="asset.asset_id" class="plan-asset-row">
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
                  <span v-if="savedAssetId === asset.asset_id" role="status">Guardado</span>
                  <span v-else-if="asset.override_function">Manual</span>
                  <span v-else>Inferida por su categoría</span>
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
          </div>
        </template>

        <p v-if="unknownCount && !hasActiveFilter" class="plan-quality-next">
          {{ unknownCount }} activo{{ unknownCount === 1 ? '' : 's' }} sin clasificar: no cuenta{{
            unknownCount === 1 ? '' : 'n'
          }}
          como capital productivo ni de seguridad.
        </p>
      </section>
    </template>
  </main>
</template>
