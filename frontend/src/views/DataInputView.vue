<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  ItemForm,
  ItemList,
  useNetWorthViewExtensions,
  useNetWorthViewState,
} from '@/domains/net-worth';
import { BaseModal } from '@/domains/ui';
import { useAnnualIncomeStore } from '@/domains/data-input/annualIncomeStore';
import {
  incomeCategories,
  incomeSubcategories,
  type IncomeCategoryKey,
} from '@/domains/data-input/incomeTaxonomy';

const {
  store,
  assetCategories,
  assetSubcategories,
  liabilityCategories,
  prettyError,
  showAssetModal,
  showLiabilityModal,
  showEditModal,
  editKind,
  submitAsset,
  submitLiability,
  openEdit,
  closeEdit,
  editTitle,
  editCategories,
  editInitial,
  submitEdit,
} = useNetWorthViewState();

const { itemFormProps, itemListProps } = useNetWorthViewExtensions(store);

const {
  entries: annualIncomeEntries,
  totalAnnual,
  loading: annualIncomeLoading,
  error: annualIncomeApiError,
  loadAll: loadAnnualIncome,
  addEntry,
  deleteEntry,
} = useAnnualIncomeStore('saas');
const annualIncomeError = ref<string | null>(null);
const showIncomeModal = ref(false);

const annualIncomeForm = reactive({
  category: 'salary' as IncomeCategoryKey,
  subcategory: 'employee_salary',
  name: '',
  owner: '',
  isRecurrent: true,
  amountInputPeriod: 'annual' as 'annual' | 'monthly',
  amountAnnual: '',
  currency: 'EUR',
  notes: '',
});

const annualSubcategoryOptions = computed(() =>
  incomeSubcategories.filter((row) => row.category === annualIncomeForm.category),
);
type OwnerOption = { key: string; value: string; label: string };

function sharedOwnershipLabel(
  splits: { member: { id: number; name: string; role: 'adult' | 'child' }; percent: string }[],
): string {
  if (!splits.length) return 'Compartido';
  const names = splits.map((split) => split.member.name);
  return `Compartido (${names.join(' + ')})`;
}

const ownerOptions = computed(() => {
  const options = new Map<string, OwnerOption>();
  for (const ownership of store.ownerships ?? []) {
    if (ownership.kind === 'individual' && ownership.member) {
      const value = ownership.member.name;
      options.set(`individual:${ownership.member.id}`, {
        key: `individual:${ownership.member.id}`,
        value,
        label: value,
      });
    }
    if (ownership.kind === 'shared') {
      const label = sharedOwnershipLabel(ownership.splits ?? []);
      options.set(`shared:${ownership.id}`, {
        key: `shared:${ownership.id}`,
        value: label,
        label,
      });
    }
  }
  return Array.from(options.values()).sort((a, b) => a.label.localeCompare(b.label));
});
const showOwnerField = computed(() => ownerOptions.value.length > 1);

watch(
  () => annualIncomeForm.category,
  () => {
    const first = annualSubcategoryOptions.value[0];
    if (!first) return;
    annualIncomeForm.subcategory = first.value;
  },
);
watch(
  ownerOptions,
  (options) => {
    const singleOwner = options[0];
    if (options.length === 1) {
      annualIncomeForm.owner = singleOwner?.value ?? '';
      return;
    }
    if (options.length === 0) {
      annualIncomeForm.owner = '';
      return;
    }
    if (
      annualIncomeForm.owner &&
      !options.some((option) => option.value === annualIncomeForm.owner)
    ) {
      annualIncomeForm.owner = '';
    }
  },
  { immediate: true },
);

function formatMoneyAmount(value: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function resetIncomeForm(): void {
  const singleOwner = ownerOptions.value[0];
  annualIncomeForm.category = 'salary';
  annualIncomeForm.subcategory = 'employee_salary';
  annualIncomeForm.name = '';
  annualIncomeForm.owner = ownerOptions.value.length === 1 ? (singleOwner?.value ?? '') : '';
  annualIncomeForm.isRecurrent = true;
  annualIncomeForm.amountInputPeriod = 'annual';
  annualIncomeForm.amountAnnual = '';
  annualIncomeForm.currency = 'EUR';
  annualIncomeForm.notes = '';
}

function openIncomeModal(): void {
  annualIncomeError.value = null;
  showIncomeModal.value = true;
}

function closeIncomeModal(): void {
  showIncomeModal.value = false;
}

const amountInputPlaceholder = computed(() =>
  annualIncomeForm.amountInputPeriod === 'monthly' ? 'Importe mensual' : 'Importe anual',
);

watch(
  () => annualIncomeForm.isRecurrent,
  (isRecurrent) => {
    if (!isRecurrent) annualIncomeForm.amountInputPeriod = 'annual';
  },
);

async function submitAnnualIncome(): Promise<void> {
  const rawAmount = Number(String(annualIncomeForm.amountAnnual).replace(',', '.'));
  const normalizedAmount = Number.isFinite(rawAmount)
    ? annualIncomeForm.amountInputPeriod === 'monthly'
      ? rawAmount * 12
      : rawAmount
    : annualIncomeForm.amountAnnual;

  const result = await addEntry({
    name: annualIncomeForm.name,
    category: annualIncomeForm.category,
    subcategory: annualIncomeForm.subcategory,
    owner: annualIncomeForm.owner,
    incomeType: annualIncomeForm.isRecurrent ? 'recurrent' : 'one_off',
    amountAnnual: String(normalizedAmount),
    currency: annualIncomeForm.currency,
    notes: annualIncomeForm.notes,
  });
  if (!result.ok) {
    annualIncomeError.value = result.error;
    return;
  }
  annualIncomeError.value = null;
  closeIncomeModal();
  resetIncomeForm();
}

async function removeAnnualIncome(id: number): Promise<void> {
  await deleteEntry(id);
}

onMounted(loadAnnualIncome);
</script>

<template>
  <div class="container ui-pro-page">
    <section class="card ui-pro-panel grid gap-2.5">
      <p class="ui-pro-kicker">Milestone 08</p>
      <h1 class="h1 m-0">Introduccion de datos</h1>
      <p class="subtle m-0">
        Esta vista centraliza la carga de datos base: ingresos anuales, gastos anuales, activos y
        pasivos con interes.
      </p>
    </section>

    <div class="grid-2">
      <article class="card ui-pro-panel">
        <div class="nw-list-header">
          <div class="nw-list-header-left">
            <h2 class="card-header-title mt-0">Ingresos anuales</h2>
          </div>
          <div class="nw-list-header-right">
            <div class="nw-list-total-inline">{{ formatMoneyAmount(totalAnnual, 'EUR') }}</div>
            <button
              class="btn btn-primary btn-sm nw-list-add-icon-only"
              type="button"
              aria-label="Anadir ingreso"
              :disabled="annualIncomeLoading"
              @click="openIncomeModal"
            >
              <span class="btn-icon">+</span>
            </button>
          </div>
        </div>

        <div class="nw-list-header-totals">
          <div class="nw-list-total-details">Total anual</div>
        </div>

        <div v-if="annualIncomeError" class="alert mt-3">{{ annualIncomeError }}</div>
        <div v-else-if="annualIncomeApiError" class="alert mt-3">{{ annualIncomeApiError }}</div>

        <table class="ui-data-table mt-3">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Categoria</th>
              <th>Titular</th>
              <th>Tipo</th>
              <th>Importe anual</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in annualIncomeEntries" :key="entry.id">
              <td>
                <strong>{{ entry.name }}</strong>
                <div class="subtle">{{ entry.subcategory }}</div>
              </td>
              <td>
                {{
                  incomeCategories.find((category) => category.value === entry.category)?.label ??
                  entry.category
                }}
              </td>
              <td>{{ entry.owner || '-' }}</td>
              <td>{{ entry.incomeType === 'recurrent' ? 'Recurrente' : 'Puntual' }}</td>
              <td>{{ formatMoneyAmount(entry.amountAnnual, entry.currency) }}</td>
              <td class="ui-data-table-actions">
                <button
                  class="icon-btn"
                  title="Eliminar"
                  :disabled="annualIncomeLoading"
                  @click="removeAnnualIncome(entry.id)"
                >
                  &#128465;
                </button>
              </td>
            </tr>
            <tr v-if="!annualIncomeEntries.length && !annualIncomeLoading">
              <td colspan="6" class="ui-table-empty">No hay ingresos anuales todavia.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="annualIncomeLoading" class="ui-status-line mt-2">
          Cargando ingresos anuales...
        </div>
      </article>

      <article class="card ui-pro-panel">
        <div class="nw-list-header">
          <div class="nw-list-header-left">
            <h2 class="card-header-title mt-0">Gastos anuales</h2>
          </div>
        </div>
        <p class="subtle m-0">Proximamente en Milestone 08.</p>
      </article>
    </div>

    <div v-if="store.error" class="alert mt-3">
      {{ prettyError() }}
    </div>

    <div class="grid-2 section">
      <ItemList
        title="Activos"
        :items="store.assets"
        :categories="assetCategories"
        :subcategories="assetSubcategories"
        :base-currency="store.baseCurrency ?? store.summary?.base_currency ?? 'EUR'"
        :category-totals-base="store.summary?.assets_by_category ?? {}"
        :subcategory-totals-base="store.summary?.assets_by_subcategory ?? {}"
        :total-base="store.summary?.total_assets ?? '0'"
        v-bind="itemListProps"
        :on-update="store.updateAsset"
        :on-archive="store.archiveAsset"
        :on-add="() => (showAssetModal = true)"
        :on-edit="(it) => openEdit(it, 'asset')"
      />

      <ItemList
        title="Pasivos"
        :items="store.liabilities"
        :categories="liabilityCategories"
        :base-currency="store.baseCurrency ?? store.summary?.base_currency ?? 'EUR'"
        :category-totals-base="store.summary?.liabilities_by_category ?? {}"
        :total-base="store.summary?.total_liabilities ?? '0'"
        v-bind="itemListProps"
        :assets="store.assets"
        :on-update="store.updateLiability"
        :on-archive="store.archiveLiability"
        :on-add="() => (showLiabilityModal = true)"
        :on-edit="(it) => openEdit(it, 'liability')"
      />
    </div>

    <div v-if="store.loading" class="ui-status-line">Cargando...</div>

    <BaseModal :open="showAssetModal" title="Nuevo activo" @close="showAssetModal = false">
      <ItemForm
        title="Nuevo activo"
        :categories="assetCategories"
        :subcategories="assetSubcategories"
        v-bind="itemFormProps"
        :allow-negative="true"
        :on-submit="submitAsset"
        :on-cancel="() => (showAssetModal = false)"
      />
    </BaseModal>

    <BaseModal :open="showLiabilityModal" title="Nuevo pasivo" @close="showLiabilityModal = false">
      <ItemForm
        title="Nuevo pasivo"
        :categories="liabilityCategories"
        v-bind="itemFormProps"
        :assets="store.assets"
        :show-financed-asset="true"
        :on-submit="submitLiability"
        :on-cancel="() => (showLiabilityModal = false)"
      />
    </BaseModal>

    <BaseModal :open="showEditModal" :title="editTitle" @close="closeEdit">
      <ItemForm
        v-if="editInitial"
        :title="editTitle"
        :categories="editCategories"
        :subcategories="editKind === 'asset' ? assetSubcategories : undefined"
        v-bind="itemFormProps"
        :assets="editKind === 'liability' ? store.assets : []"
        :show-financed-asset="editKind === 'liability'"
        :allow-negative="editKind === 'asset'"
        mode="edit"
        :initial="editInitial"
        :on-submit="submitEdit"
        :on-cancel="closeEdit"
      />
    </BaseModal>

    <BaseModal :open="showIncomeModal" title="Nuevo ingreso anual" @close="closeIncomeModal">
      <div class="grid gap-2.5 md:grid-cols-2">
        <select v-model="annualIncomeForm.category" class="select ui-data-field">
          <option
            v-for="category in incomeCategories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </option>
        </select>
        <select v-model="annualIncomeForm.subcategory" class="select ui-data-field">
          <option
            v-for="subcategory in annualSubcategoryOptions"
            :key="subcategory.value"
            :value="subcategory.value"
          >
            {{ subcategory.label }}
          </option>
        </select>
        <input
          v-model="annualIncomeForm.name"
          class="input ui-data-field"
          :class="{ 'md:col-span-2': !showOwnerField }"
          placeholder="Concepto (ej: CTN, Regalos Pablo)"
        />
        <select v-if="showOwnerField" v-model="annualIncomeForm.owner" class="select ui-data-field">
          <option value="">Titular (opcional)</option>
          <option v-for="option in ownerOptions" :key="option.key" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <div
          class="grid items-center gap-2.5 md:col-span-2 md:grid-cols-[minmax(0,1fr)_auto_auto_120px]"
        >
          <input
            v-model="annualIncomeForm.amountAnnual"
            class="input ui-data-field"
            inputmode="decimal"
            :placeholder="amountInputPlaceholder"
          />
          <label class="checkbox-row whitespace-nowrap">
            <input v-model="annualIncomeForm.isRecurrent" type="checkbox" />
            Recurrente
          </label>
          <div class="grid justify-items-center gap-1">
            <button
              type="button"
              class="relative inline-flex h-[34px] w-[58px] items-center rounded-full border transition"
              :class="
                annualIncomeForm.amountInputPeriod === 'monthly'
                  ? 'border-teal-300/60 bg-teal-400/20'
                  : 'border-white/20 bg-white/5'
              "
              :disabled="!annualIncomeForm.isRecurrent"
              aria-label="Cambiar periodicidad mensual/anual"
              @click="
                annualIncomeForm.amountInputPeriod =
                  annualIncomeForm.amountInputPeriod === 'annual' ? 'monthly' : 'annual'
              "
            >
              <span
                class="inline-block h-6 w-6 rounded-full bg-white/90 transition-transform"
                :class="
                  annualIncomeForm.amountInputPeriod === 'monthly'
                    ? 'translate-x-7'
                    : 'translate-x-1'
                "
              />
            </button>
            <span class="subtle text-[11px]">
              <span :class="annualIncomeForm.amountInputPeriod === 'annual' ? 'text-white/90' : ''">
                Anual
              </span>
              /
              <span
                :class="annualIncomeForm.amountInputPeriod === 'monthly' ? 'text-white/90' : ''"
              >
                Mensual
              </span>
            </span>
          </div>
          <select v-model="annualIncomeForm.currency" class="select ui-data-field">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <textarea
          v-model="annualIncomeForm.notes"
          class="textarea md:col-span-2"
          rows="2"
          placeholder="Notas (opcional)"
        />
        <div class="actions md:col-span-2">
          <button class="btn btn-ghost" type="button" @click="closeIncomeModal">Cancelar</button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="annualIncomeLoading"
            @click="submitAnnualIncome"
          >
            Guardar ingreso
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
