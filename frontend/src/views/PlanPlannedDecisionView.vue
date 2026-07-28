<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import { scenarioTemplates } from '@/domains/plan/scenarioTemplates';
import type { PlanScenarioTemplate, PlannedDecisionImpact } from '@/domains/plan/types';
import { useAnnualExpenseStore } from '@/domains/budget/annual-entries/annualExpenseStore';
import { useAnnualIncomeStore } from '@/domains/budget/annual-entries/annualIncomeStore';
import { parseAnnualAmount } from '@/domains/budget/annual-entries/annualEntryUtils';
import { coreNetWorthApi } from '@/domains/net-worth/api';
import type { Asset } from '@/domains/net-worth/models';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

/** Una línea del presupuesto candidata a ser agrupada en la decisión. */
type AdoptableLine = {
  kind: 'expense' | 'income';
  id: number;
  name: string;
  fiscalYear: number;
  amountAnnual: number;
  eventGroup: string;
  isPlanManaged: boolean;
  planEventName: string | null;
  isSourceOwned: boolean;
};

type DecisionKind = 'sale' | 'purchase';

const router = useRouter();
const { store } = usePlan();
const expenseStore = useAnnualExpenseStore('saas');
const incomeStore = useAnnualIncomeStore('saas');

const currentYear = new Date().getFullYear();
const today = new Date().toISOString().slice(0, 10);

const form = reactive({
  name: '',
  event_type: 'housing' as PlanScenarioTemplate,
  kind: 'sale' as DecisionKind,
  decision_date: today,
  transaction_year: currentYear,
  note: '',
});

// Campos de impacto (cadenas, como el backend). Se prellenan con pistas al seleccionar.
const impact = reactive({
  proceeds: '',
  disposed_asset_value: '',
  disposed_asset_type: 'family_use' as NonNullable<PlannedDecisionImpact['disposed_asset_type']>,
  disposed_liability_value: '',
  new_asset_value: '',
  new_asset_type: 'family_use' as NonNullable<PlannedDecisionImpact['new_asset_type']>,
  new_debt_principal: '',
  new_debt_interest_rate: '',
  new_debt_term_years: '',
  initial_outflow: '',
});

const selected = reactive(new Set<string>());
const selectedAssets = reactive(new Set<number>());
const selectedLiabilities = reactive(new Set<number>());
const assets = ref<Asset[]>([]);
const liabilities = ref<Asset[]>([]);
const search = ref('');
const positionSearch = ref('');
const submitting = ref(false);
const loadingLines = ref(false);
const showLocked = ref(false);
const expandedYears = ref<Set<number>>(new Set());
const expandedPositionGroups = ref<Set<'liabilities' | 'assets'>>(new Set());

const kindOptions: ASelectItem[] = [
  { value: 'sale', label: 'Venta de activo' },
  { value: 'purchase', label: 'Compra de activo' },
];
const templateOptions: ASelectItem[] = scenarioTemplates.map((template) => ({
  value: template.value,
  label: template.label,
}));
const assetTypeOptions: ASelectItem[] = [
  { value: 'productive', label: 'Productivo' },
  { value: 'security', label: 'Seguridad' },
  { value: 'family_use', label: 'Uso familiar' },
  { value: 'short_term_goal', label: 'Objetivo a corto' },
  { value: 'unknown', label: 'Sin clasificar' },
];
const yearOptions: ASelectItem[] = Array.from({ length: 41 }, (_, index) => {
  const year = currentYear - 5 + index;
  return { value: year, label: String(year) };
});

const isSale = computed(() => form.kind === 'sale');

// Una compra conserva el patrimonio (caja + deuda → activo). Si el valor del activo
// supera con holgura a deuda + desembolso, aparecería patrimonio "de la nada":
// normalmente porque el activo ya está en parte en Patrimonio (doble conteo) o porque
// falta el desembolso (la caja que gastas). Avisamos con el importe implicado.
const purchaseNetWorthGain = computed(() => {
  if (isSale.value) return 0;
  return (
    parseAnnualAmount(impact.new_asset_value) -
    parseAnnualAmount(impact.new_debt_principal) -
    parseAnnualAmount(impact.initial_outflow)
  );
});
const purchaseDoubleCountWarning = computed(
  () => !isSale.value && purchaseNetWorthGain.value > 1000,
);

const lines = computed<AdoptableLine[]>(() => [
  ...expenseStore.entries.value.map((entry) => ({
    kind: 'expense' as const,
    id: entry.id,
    name: entry.name,
    fiscalYear: entry.fiscalYear,
    amountAnnual: entry.amountAnnual,
    eventGroup: entry.eventGroup,
    isPlanManaged: entry.isPlanManaged,
    planEventName: entry.planEventName,
    isSourceOwned: entry.sourceLiabilityId != null || entry.sourceAssetId != null,
  })),
  ...incomeStore.entries.value.map((entry) => ({
    kind: 'income' as const,
    id: entry.id,
    name: entry.name,
    fiscalYear: entry.fiscalYear,
    amountAnnual: entry.amountAnnual,
    eventGroup: entry.eventGroup,
    isPlanManaged: entry.isPlanManaged,
    planEventName: entry.planEventName,
    isSourceOwned: false,
  })),
]);

const searchTerm = computed(() => search.value.trim().toLowerCase());
const matchingLines = computed(() =>
  lines.value.filter(
    (line) => !searchTerm.value || line.name.toLowerCase().includes(searchTerm.value),
  ),
);
const lockedMatchCount = computed(() => matchingLines.value.filter(isLocked).length);
const visibleLines = computed(() =>
  matchingLines.value
    .filter((line) => showLocked.value || !isLocked(line))
    .sort((a, b) => a.fiscalYear - b.fiscalYear || a.name.localeCompare(b.name)),
);
const groupedLines = computed(() => {
  const groups = new Map<number, AdoptableLine[]>();
  for (const line of visibleLines.value) {
    const bucket = groups.get(line.fiscalYear) ?? [];
    bucket.push(line);
    groups.set(line.fiscalYear, bucket);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]);
});

function isYearOpen(year: number): boolean {
  return Boolean(searchTerm.value) || expandedYears.value.has(year);
}
function toggleYear(year: number): void {
  const next = new Set(expandedYears.value);
  if (next.has(year)) next.delete(year);
  else next.add(year);
  expandedYears.value = next;
}
function isPositionGroupOpen(kind: 'liabilities' | 'assets'): boolean {
  return Boolean(positionSearch.value.trim()) || expandedPositionGroups.value.has(kind);
}
function togglePositionGroup(kind: 'liabilities' | 'assets'): void {
  const next = new Set(expandedPositionGroups.value);
  if (next.has(kind)) next.delete(kind);
  else next.add(kind);
  expandedPositionGroups.value = next;
}

const selectedLines = computed(() => lines.value.filter((line) => selected.has(key(line))));
const selectedIncomeTotal = computed(() =>
  selectedLines.value
    .filter((line) => line.kind === 'income')
    .reduce((total, line) => total + line.amountAnnual, 0),
);
const selectedExpenseTotal = computed(() =>
  selectedLines.value
    .filter((line) => line.kind === 'expense')
    .reduce((total, line) => total + line.amountAnnual, 0),
);
const selectedLiabilityTotal = computed(() =>
  liabilities.value
    .filter((liability) => selectedLiabilities.has(liability.id))
    .reduce((total, liability) => total + Number(liability.amount), 0),
);
const selectedAssetTotal = computed(() =>
  assets.value
    .filter((asset) => selectedAssets.has(asset.id))
    .reduce((total, asset) => total + Number(asset.amount), 0),
);

const canSubmit = computed(
  () =>
    Boolean(form.name.trim() && form.decision_date && form.transaction_year) && !submitting.value,
);

function key(line: AdoptableLine): string {
  return `${line.kind}:${line.id}`;
}
function isLocked(line: AdoptableLine): boolean {
  return line.isPlanManaged || line.isSourceOwned;
}
function toggle(line: AdoptableLine): void {
  if (isLocked(line)) return;
  const id = key(line);
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
}
function selectGroup(group: string): void {
  for (const line of lines.value) {
    if (!isLocked(line) && line.eventGroup === group) selected.add(key(line));
  }
}
const existingGroups = computed(() => {
  const groups = new Map<string, number>();
  for (const line of lines.value) {
    if (!line.eventGroup || isLocked(line)) continue;
    groups.set(line.eventGroup, (groups.get(line.eventGroup) ?? 0) + 1);
  }
  return [...groups.entries()].sort((a, b) => b[1] - a[1]);
});

const visiblePositions = computed(() => {
  const term = positionSearch.value.trim().toLowerCase();
  const match = (item: Asset) => !term || item.name.toLowerCase().includes(term);
  return {
    liabilities: liabilities.value.filter(match),
    assets: assets.value.filter(match),
  };
});
function toggleAsset(id: number): void {
  if (selectedAssets.has(id)) selectedAssets.delete(id);
  else selectedAssets.add(id);
}
function toggleLiability(id: number): void {
  if (selectedLiabilities.has(id)) selectedLiabilities.delete(id);
  else selectedLiabilities.add(id);
}

// Prellenado de pistas: los ingresos seleccionados son los ingresos netos de la venta;
// los gastos seleccionados, el desembolso de la compra; el activo/pasivo enlazado, los
// valores a dar de baja o adquirir. El usuario ajusta el valor neto si procede.
watch(selectedIncomeTotal, (total) => {
  if (isSale.value && !impact.proceeds && total > 0) impact.proceeds = String(total);
});
watch(selectedExpenseTotal, (total) => {
  if (!isSale.value && !impact.initial_outflow && total > 0) impact.initial_outflow = String(total);
});
watch(selectedAssetTotal, (total) => {
  if (total <= 0) return;
  if (isSale.value && !impact.disposed_asset_value) impact.disposed_asset_value = String(total);
  if (!isSale.value && !impact.new_asset_value) impact.new_asset_value = String(total);
});
watch(selectedLiabilityTotal, (total) => {
  if (total <= 0) return;
  if (isSale.value && !impact.disposed_liability_value)
    impact.disposed_liability_value = String(total);
  if (!isSale.value && !impact.new_debt_principal) impact.new_debt_principal = String(total);
});

// Los importes se escriben libres (formato español, decimales…); se normalizan a un
// decimal limpio que el backend (DecimalField) acepta. `parseAnnualAmount` resuelve
// coma/punto igual que el resto de la app.
function money(raw: string): string {
  return parseAnnualAmount(raw).toFixed(2);
}
function rate(raw: string): string {
  return parseAnnualAmount(raw).toFixed(4);
}
// Preview del importe tal y como se interpretará (evita la trampa del punto de miles:
// "282.176" → 282,18 €). Solo se muestra si difiere de lo tecleado o hay ambigüedad.
function preview(raw: string): string {
  const value = parseAnnualAmount(raw);
  return value > 0 ? `${formatMoney(value)} €` : '';
}

function buildImpact(): PlannedDecisionImpact {
  if (isSale.value) {
    return {
      proceeds: money(impact.proceeds),
      disposed_asset_value: money(impact.disposed_asset_value),
      disposed_asset_type: impact.disposed_asset_type,
      disposed_liability_value: money(impact.disposed_liability_value),
    };
  }
  return {
    initial_outflow: money(impact.initial_outflow),
    new_asset_value: money(impact.new_asset_value),
    new_asset_type: impact.new_asset_type,
    new_debt_principal: money(impact.new_debt_principal),
    new_debt_interest_rate: rate(impact.new_debt_interest_rate),
    new_debt_term_years: impact.new_debt_term_years ? Number(impact.new_debt_term_years) : null,
  };
}

async function submit(): Promise<void> {
  if (!canSubmit.value) return;
  submitting.value = true;
  store.clearError();
  try {
    await store.registerPlannedDecision({
      name: form.name.trim(),
      event_type: form.event_type,
      decision_date: form.decision_date,
      transaction_year: Number(form.transaction_year),
      expense_entry_ids: selectedLines.value
        .filter((line) => line.kind === 'expense')
        .map((line) => line.id),
      income_entry_ids: selectedLines.value
        .filter((line) => line.kind === 'income')
        .map((line) => line.id),
      asset_ids: [...selectedAssets],
      liability_ids: [...selectedLiabilities],
      impact: buildImpact(),
      note: form.note.trim(),
    });
    await store.loadDashboard();
    await router.push('/plan');
  } catch {
    if (!store.error) store.error = 'No se pudo crear la decisión.';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  loadingLines.value = true;
  try {
    const [, , assetsRes, liabilitiesRes] = await Promise.all([
      expenseStore.loadAll(),
      incomeStore.loadAll(),
      coreNetWorthApi.getAssets(),
      coreNetWorthApi.getLiabilities(),
    ]);
    assets.value = assetsRes.data ?? [];
    liabilities.value = liabilitiesRes.data ?? [];
  } finally {
    loadingLines.value = false;
  }
});
</script>

<template>
  <main class="page plan-page plan-setup-page">
    <APageHead title="Agrupar en una decisión" eyebrow="Mi Plan">
      <template #meta>
        <span>Compra o venta de activo</span><span class="dot"></span
        ><span>Cuenta en la proyección, sin doble conteo</span>
      </template>
    </APageHead>

    <AState v-if="store.error" status="error">{{ store.error }}</AState>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 1</p>
          <h2 class="sect-title">¿Qué decisión es y cuándo impacta?</h2>
          <p class="sect-sub">
            La fecha es cuándo la decidiste; el año de transacción es cuándo la compra o venta pega
            en tu patrimonio (pueden diferir). En una venta, el activo se da de baja ese año; en una
            compra, aparece con su deuda.
          </p>
        </div>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>Nombre de la decisión</span>
          <input v-model="form.name" class="input" type="text" placeholder="Venta de Palmito" />
        </label>
        <label>
          <span>Tipo de decisión</span>
          <ASelect
            v-model="form.kind"
            :options="kindOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Categoría</span>
          <ASelect
            v-model="form.event_type"
            :options="templateOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Fecha de la decisión</span>
          <input v-model="form.decision_date" class="input" type="date" />
        </label>
        <label>
          <span>Año de la transacción</span>
          <ASelect
            v-model="form.transaction_year"
            :options="yearOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Nota (opcional)</span>
          <input v-model="form.note" class="input" type="text" />
        </label>
      </div>
    </section>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 2</p>
          <h2 class="sect-title">¿Qué partidas puntuales agrupas en esta decisión?</h2>
          <p class="sect-sub">
            Salen de los movimientos puntuales sueltos y pasan a gobernarse por la decisión (para no
            contarlas dos veces). Sus importes y fechas no cambian.
          </p>
        </div>
      </div>

      <div v-if="existingGroups.length" class="plan-choice-grid">
        <button
          v-for="[group, count] in existingGroups"
          :key="group"
          type="button"
          class="plan-choice plan-choice-sm"
          @click="selectGroup(group)"
        >
          <strong>{{ group }}</strong>
          <small>{{ count }} partida{{ count === 1 ? '' : 's' }}</small>
        </button>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>Buscar partida</span>
          <input v-model="search" class="input" type="search" placeholder="Palmito, Atrio..." />
        </label>
      </div>

      <AState v-if="loadingLines" status="loading" layout="inline">Cargando partidas...</AState>
      <AState v-else-if="!visibleLines.length" status="empty" layout="inline">
        No hay partidas puntuales que agrupar con la búsqueda actual.
      </AState>

      <button
        v-if="lockedMatchCount"
        type="button"
        class="plan-details-toggle"
        @click="showLocked = !showLocked"
      >
        {{ showLocked ? 'Ocultar' : 'Mostrar' }} {{ lockedMatchCount }} no agrupable{{
          lockedMatchCount === 1 ? '' : 's'
        }}
      </button>

      <div v-for="[year, group] in groupedLines" :key="year" class="plan-adopt-year">
        <button
          type="button"
          class="plan-assets-group-head"
          :aria-expanded="isYearOpen(year)"
          @click="toggleYear(year)"
        >
          <strong>{{ year }}</strong>
          <span>
            {{ group.length }} partida{{ group.length === 1 ? '' : 's' }} ·
            {{ isYearOpen(year) ? 'Ocultar' : 'Ver' }}
          </span>
        </button>
        <template v-if="isYearOpen(year)">
          <button
            v-for="line in group"
            :key="`${line.kind}:${line.id}`"
            type="button"
            class="plan-adopt-line"
            :class="{
              'is-on': selected.has(`${line.kind}:${line.id}`),
              'is-locked': isLocked(line),
            }"
            :aria-pressed="selected.has(`${line.kind}:${line.id}`)"
            :disabled="isLocked(line)"
            @click="toggle(line)"
          >
            <span class="plan-adopt-name">
              <strong>{{ line.name }}</strong>
              <small v-if="line.isPlanManaged">Ya gestionada por «{{ line.planEventName }}»</small>
              <small v-else-if="line.isSourceOwned">La genera Patrimonio</small>
            </span>
            <span class="plan-adopt-amount mono" :class="{ pos: line.kind === 'income' }">
              {{ formatMoney(line.amountAnnual) }}
            </span>
          </button>
        </template>
      </div>
    </section>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 3</p>
          <h2 class="sect-title">¿Qué activo y deuda mueve?</h2>
          <p class="sect-sub">
            Enlaza el activo real (y su hipoteca) de Patrimonio.
            {{
              isSale
                ? 'En la venta se da de baja del patrimonio proyectado en su año.'
                : 'En la compra aparece como activo, con su deuda, en su año.'
            }}
            Patrimonio sigue siendo su dueño.
          </p>
        </div>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>Buscar en Patrimonio</span>
          <input
            v-model="positionSearch"
            class="input"
            type="search"
            placeholder="Vivienda, hipoteca..."
          />
        </label>
      </div>

      <div v-if="visiblePositions.assets.length" class="plan-adopt-year">
        <button
          type="button"
          class="plan-assets-group-head"
          :aria-expanded="isPositionGroupOpen('assets')"
          @click="togglePositionGroup('assets')"
        >
          <strong>Activos</strong>
          <span>
            {{ visiblePositions.assets.length }}
            {{ visiblePositions.assets.length === 1 ? 'posición' : 'posiciones' }}
            · {{ isPositionGroupOpen('assets') ? 'Ocultar' : 'Ver' }}
          </span>
        </button>
        <template v-if="isPositionGroupOpen('assets')">
          <button
            v-for="asset in visiblePositions.assets"
            :key="`asset:${asset.id}`"
            type="button"
            class="plan-adopt-line"
            :class="{ 'is-on': selectedAssets.has(asset.id) }"
            :aria-pressed="selectedAssets.has(asset.id)"
            @click="toggleAsset(asset.id)"
          >
            <span class="plan-adopt-name"
              ><strong>{{ asset.name }}</strong></span
            >
            <span class="plan-adopt-amount mono">{{ formatMoney(asset.amount) }}</span>
          </button>
        </template>
      </div>

      <div v-if="visiblePositions.liabilities.length" class="plan-adopt-year">
        <button
          type="button"
          class="plan-assets-group-head"
          :aria-expanded="isPositionGroupOpen('liabilities')"
          @click="togglePositionGroup('liabilities')"
        >
          <strong>Pasivos</strong>
          <span>
            {{ visiblePositions.liabilities.length }}
            {{ visiblePositions.liabilities.length === 1 ? 'posición' : 'posiciones' }}
            · {{ isPositionGroupOpen('liabilities') ? 'Ocultar' : 'Ver' }}
          </span>
        </button>
        <template v-if="isPositionGroupOpen('liabilities')">
          <button
            v-for="liability in visiblePositions.liabilities"
            :key="`liability:${liability.id}`"
            type="button"
            class="plan-adopt-line"
            :class="{ 'is-on': selectedLiabilities.has(liability.id) }"
            :aria-pressed="selectedLiabilities.has(liability.id)"
            @click="toggleLiability(liability.id)"
          >
            <span class="plan-adopt-name"
              ><strong>{{ liability.name }}</strong></span
            >
            <span class="plan-adopt-amount mono">{{ formatMoney(liability.amount) }}</span>
          </button>
        </template>
      </div>
    </section>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 4</p>
          <h2 class="sect-title">Impacto en la proyección</h2>
          <p class="sect-sub">
            Cifras prellenadas con lo seleccionado; ajústalas si procede (p. ej. el valor
            <em>neto</em> del activo = valor − hipoteca).
          </p>
        </div>
      </div>

      <p v-if="purchaseDoubleCountWarning" class="plan-decision-warn">
        <strong>Revisa los importes.</strong> Con estos números esta compra sumaría
        {{ formatMoney(purchaseNetWorthGain) }} € a tu patrimonio de la nada, y una compra lo
        conserva (cambias caja + deuda por un activo). Suele fallar por: «Valor del activo» debe ser
        solo lo que aún <em>no</em> está en tu Patrimonio (si ya tienes una parte —una reserva, p.
        ej.— réstala); y «Desembolso» ≈ valor − deuda (la caja que pones de tu bolsillo; los gastos
        que agrupaste ya no cuentan por su cuenta). Lo ya pagado y en Patrimonio no se vuelve a
        meter. Si toda la compra ya está reflejada, regístrala como
        <RouterLink class="plan-blocker-link" to="/plan/decisiones/registrar"
          >decisión ocurrida</RouterLink
        >.
      </p>

      <div v-if="isSale" class="plan-form-grid">
        <label>
          <span>Ingresos netos de la venta</span>
          <input v-model="impact.proceeds" class="input" inputmode="decimal" placeholder="0" />
        </label>
        <label>
          <span>Valor neto del activo (se da de baja)</span>
          <input
            v-model="impact.disposed_asset_value"
            class="input"
            inputmode="decimal"
            placeholder="0"
          />
        </label>
        <label>
          <span>Función del activo</span>
          <ASelect
            v-model="impact.disposed_asset_type"
            :options="assetTypeOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Deuda cancelada (hipoteca)</span>
          <input
            v-model="impact.disposed_liability_value"
            class="input"
            inputmode="decimal"
            placeholder="0"
          />
        </label>
      </div>

      <div v-else class="plan-form-grid">
        <label>
          <span>Desembolso (caja)</span>
          <input
            v-model="impact.initial_outflow"
            class="input"
            inputmode="decimal"
            placeholder="0"
          />
        </label>
        <label>
          <span>Valor del activo adquirido</span>
          <input
            v-model="impact.new_asset_value"
            class="input"
            inputmode="decimal"
            placeholder="0"
          />
        </label>
        <label>
          <span>Función del activo</span>
          <ASelect
            v-model="impact.new_asset_type"
            :options="assetTypeOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Nueva deuda (principal)</span>
          <input
            v-model="impact.new_debt_principal"
            class="input"
            inputmode="decimal"
            placeholder="0"
          />
        </label>
        <label>
          <span>Interés anual (0-1)</span>
          <input
            v-model="impact.new_debt_interest_rate"
            class="input"
            inputmode="decimal"
            placeholder="0.03"
          />
        </label>
        <label>
          <span>Plazo (años)</span>
          <input
            v-model="impact.new_debt_term_years"
            class="input"
            inputmode="numeric"
            placeholder="25"
          />
        </label>
      </div>

      <p class="plan-decision-preview">
        Se interpretará como
        <template v-if="isSale">
          — ingresos <strong>{{ preview(impact.proceeds) || '0 €' }}</strong> · activo
          <strong>{{ preview(impact.disposed_asset_value) || '0 €' }}</strong> · deuda cancelada
          <strong>{{ preview(impact.disposed_liability_value) || '0 €' }}</strong>
        </template>
        <template v-else>
          — desembolso <strong>{{ preview(impact.initial_outflow) || '0 €' }}</strong> · valor del
          activo <strong>{{ preview(impact.new_asset_value) || '0 €' }}</strong> · nueva deuda
          <strong>{{ preview(impact.new_debt_principal) || '0 €' }}</strong>
        </template>
        . Usa el punto solo como decimal (para miles, escribe sin separador: <code>282176</code>).
      </p>
    </section>

    <div class="plan-setup-actions">
      <RouterLink class="btn btn-ghost" to="/plan">Cancelar</RouterLink>
      <AButton variant="primary" :loading="submitting" :disabled="!canSubmit" @click="submit">
        Crear decisión
      </AButton>
    </div>
  </main>
</template>
