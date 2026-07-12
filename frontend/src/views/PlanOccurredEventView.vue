<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import { scenarioTemplates } from '@/domains/plan/scenarioTemplates';
import type { PlanScenarioTemplate } from '@/domains/plan';
import { useAnnualExpenseStore } from '@/domains/budget/annual-entries/annualExpenseStore';
import { useAnnualIncomeStore } from '@/domains/budget/annual-entries/annualIncomeStore';
import { coreNetWorthApi } from '@/domains/net-worth/api';
import type { Asset } from '@/domains/net-worth/models';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

/** Una línea del presupuesto candidata a ser adoptada por la decisión. */
type AdoptableLine = {
  kind: 'expense' | 'income';
  id: number;
  name: string;
  fiscalYear: number;
  amountAnnual: number;
  eventGroup: string;
  isPlanManaged: boolean;
  planEventName: string | null;
  /** Derivada de un activo o pasivo: su linaje ya es ese, no puede adoptarse. */
  isSourceOwned: boolean;
};

const router = useRouter();
const { store } = usePlan();
const expenseStore = useAnnualExpenseStore('saas');
const incomeStore = useAnnualIncomeStore('saas');

const form = reactive({
  name: '',
  event_type: 'generic' as PlanScenarioTemplate,
  decision_date: '',
  note: '',
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

const today = new Date().toISOString().slice(0, 10);

const templateOptions: ASelectItem[] = scenarioTemplates.map((template) => ({
  value: template.value,
  label: template.label,
}));

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

const visibleLines = computed(() => {
  const term = search.value.trim().toLowerCase();
  return lines.value
    .filter((line) => !term || line.name.toLowerCase().includes(term))
    .sort((a, b) => a.fiscalYear - b.fiscalYear || a.name.localeCompare(b.name));
});

const groupedLines = computed(() => {
  const groups = new Map<number, AdoptableLine[]>();
  for (const line of visibleLines.value) {
    const bucket = groups.get(line.fiscalYear) ?? [];
    bucket.push(line);
    groups.set(line.fiscalYear, bucket);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]);
});

const selectedLines = computed(() => lines.value.filter((line) => selected.has(key(line))));
const selectedTotal = computed(() =>
  selectedLines.value.reduce((total, line) => total + line.amountAnnual, 0),
);
const canSubmit = computed(
  () => Boolean(form.name.trim() && form.decision_date) && !submitting.value,
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

/** Grupos manuales ya existentes (p. ej. `compra_atrio`): atajo para adoptarlos de una vez. */
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

async function submit(): Promise<void> {
  if (!canSubmit.value) return;
  submitting.value = true;
  store.clearError();
  try {
    await store.registerOccurredEvent({
      name: form.name.trim(),
      event_type: form.event_type,
      decision_date: form.decision_date,
      expense_entry_ids: selectedLines.value
        .filter((line) => line.kind === 'expense')
        .map((line) => line.id),
      income_entry_ids: selectedLines.value
        .filter((line) => line.kind === 'income')
        .map((line) => line.id),
      asset_ids: [...selectedAssets],
      liability_ids: [...selectedLiabilities],
      note: form.note.trim(),
    });
    await router.push('/plan?tab=decisions');
  } catch {
    if (!store.error) store.error = 'No se pudo registrar la decisión.';
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
    <APageHead title="Registrar una decisión ya tomada" eyebrow="Mi Plan">
      <template #meta>
        <span>No crea presupuesto</span><span class="dot"></span
        ><span>Adopta las partidas que ya tienes</span>
      </template>
    </APageHead>

    <AState v-if="store.error" status="error">{{ store.error }}</AState>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 1</p>
          <h2 class="sect-title">¿Qué decidiste y cuándo?</h2>
          <p class="sect-sub">
            La fecha es la de la decisión, no la del pago. Queda registrada como ocurrida: sus
            efectos ya están en tu patrimonio y en tu presupuesto, así que no se vuelven a
            proyectar.
          </p>
        </div>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>Nombre de la decisión</span>
          <input v-model="form.name" class="input" type="text" placeholder="Compra de Atrio" />
        </label>
        <label>
          <span>Tipo</span>
          <ASelect
            v-model="form.event_type"
            :options="templateOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <label>
          <span>Fecha de la decisión</span>
          <input v-model="form.decision_date" class="input" type="date" :max="today" />
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
          <h2 class="sect-title">¿Qué partidas de tu presupuesto salieron de esta decisión?</h2>
          <p class="sect-sub">
            Al vincularlas, pasan a estar gestionadas por el plan: dejarán de ser editables desde
            Presupuesto y se retirarán si algún día das de baja la decisión. Puedes deshacerlo.
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
          <input v-model="search" class="input" type="search" placeholder="Atrio, IVI..." />
        </label>
      </div>

      <AState v-if="loadingLines" status="loading" layout="inline">Cargando partidas...</AState>
      <AState v-else-if="!visibleLines.length" status="empty" layout="inline">
        No hay partidas que coincidan con la búsqueda.
      </AState>

      <div v-for="[year, group] in groupedLines" :key="year" class="plan-adopt-year">
        <p class="eyebrow">{{ year }}</p>
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
            <small v-else-if="line.isSourceOwned">La genera un activo o pasivo de Patrimonio</small>
            <small v-else-if="line.eventGroup">{{ line.eventGroup }}</small>
          </span>
          <span class="plan-adopt-amount mono" :class="{ pos: line.kind === 'income' }">
            {{ formatMoney(line.amountAnnual) }}
          </span>
        </button>
      </div>
    </section>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Paso 3</p>
          <h2 class="sect-title">¿Qué activos o pasivos trajo esta decisión?</h2>
          <p class="sect-sub">
            Aquí no se adopta nada: la decisión solo apunta a ellos. Patrimonio sigue siendo su
            dueño y quien genera sus cuotas. Enlazarlos es lo que permite ver el impacto completo de
            la decisión, no solo el de las partidas que escribiste a mano.
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
            placeholder="Préstamo, vivienda..."
          />
        </label>
      </div>

      <div v-if="visiblePositions.liabilities.length" class="plan-adopt-year">
        <p class="eyebrow">Pasivos</p>
        <button
          v-for="liability in visiblePositions.liabilities"
          :key="`liability:${liability.id}`"
          type="button"
          class="plan-adopt-line"
          :class="{ 'is-on': selectedLiabilities.has(liability.id) }"
          :aria-pressed="selectedLiabilities.has(liability.id)"
          @click="toggleLiability(liability.id)"
        >
          <span class="plan-adopt-name">
            <strong>{{ liability.name }}</strong>
          </span>
          <span class="plan-adopt-amount mono">{{ formatMoney(liability.amount) }}</span>
        </button>
      </div>

      <div v-if="visiblePositions.assets.length" class="plan-adopt-year">
        <p class="eyebrow">Activos</p>
        <button
          v-for="asset in visiblePositions.assets"
          :key="`asset:${asset.id}`"
          type="button"
          class="plan-adopt-line"
          :class="{ 'is-on': selectedAssets.has(asset.id) }"
          :aria-pressed="selectedAssets.has(asset.id)"
          @click="toggleAsset(asset.id)"
        >
          <span class="plan-adopt-name">
            <strong>{{ asset.name }}</strong>
          </span>
          <span class="plan-adopt-amount mono">{{ formatMoney(asset.amount) }}</span>
        </button>
      </div>
    </section>

    <section
      v-if="selectedLines.length || selectedAssets.size || selectedLiabilities.size"
      class="sect plan-form-section"
    >
      <div class="sect-head">
        <div>
          <p class="eyebrow">Resumen</p>
          <h2 class="sect-title">
            {{ selectedLines.length }} partida{{ selectedLines.length === 1 ? '' : 's' }} ·
            {{ formatMoney(selectedTotal) }}
          </h2>
          <p class="sect-sub">
            Las partidas pasan a colgar de «{{ form.name.trim() || 'esta decisión' }}»; sus importes
            y fechas no cambian.
            <template v-if="selectedLiabilities.size || selectedAssets.size">
              Además queda enlazada a
              <template v-if="selectedLiabilities.size">
                {{ selectedLiabilities.size }} pasivo{{ selectedLiabilities.size === 1 ? '' : 's' }}
              </template>
              <template v-if="selectedLiabilities.size && selectedAssets.size"> y </template>
              <template v-if="selectedAssets.size">
                {{ selectedAssets.size }} activo{{ selectedAssets.size === 1 ? '' : 's' }}
              </template>
              de Patrimonio, que siguen gestionándose allí.
            </template>
          </p>
        </div>
      </div>
    </section>

    <div class="plan-setup-actions">
      <RouterLink class="btn btn-ghost" to="/plan?tab=decisions">Cancelar</RouterLink>
      <AButton variant="primary" :loading="submitting" :disabled="!canSubmit" @click="submit">
        Registrar decisión
      </AButton>
    </div>
  </main>
</template>
