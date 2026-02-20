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

const annualIncomeForm = reactive({
  name: '',
  category: 'salary' as IncomeCategoryKey,
  subcategory: 'employee_salary',
  owner: '',
  incomeType: 'recurrent' as 'recurrent' | 'one_off',
  amountAnnual: '',
  currency: 'EUR',
  notes: '',
});

const annualSubcategoryOptions = computed(() =>
  incomeSubcategories.filter((row) => row.category === annualIncomeForm.category),
);

watch(
  () => annualIncomeForm.category,
  () => {
    const first = annualSubcategoryOptions.value[0];
    if (!first) return;
    annualIncomeForm.subcategory = first.value;
  },
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
  annualIncomeForm.name = '';
  annualIncomeForm.category = 'salary';
  annualIncomeForm.subcategory = 'employee_salary';
  annualIncomeForm.owner = '';
  annualIncomeForm.incomeType = 'recurrent';
  annualIncomeForm.amountAnnual = '';
  annualIncomeForm.currency = 'EUR';
  annualIncomeForm.notes = '';
}

async function submitAnnualIncome(): Promise<void> {
  const result = await addEntry({
    name: annualIncomeForm.name,
    category: annualIncomeForm.category,
    subcategory: annualIncomeForm.subcategory,
    owner: annualIncomeForm.owner,
    incomeType: annualIncomeForm.incomeType,
    amountAnnual: annualIncomeForm.amountAnnual,
    currency: annualIncomeForm.currency,
    notes: annualIncomeForm.notes,
  });
  if (!result.ok) {
    annualIncomeError.value = result.error;
    return;
  }
  annualIncomeError.value = null;
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

    <article class="card ui-pro-panel">
      <h2 class="h2">Ingresos anuales</h2>
      <div class="ui-data-form-grid">
        <input
          v-model="annualIncomeForm.name"
          class="input ui-data-field"
          placeholder="Concepto (ej: CTN, Regalos Pablo)"
        />
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
          v-model="annualIncomeForm.owner"
          class="input ui-data-field"
          placeholder="Titular (opcional)"
        />
        <select v-model="annualIncomeForm.incomeType" class="select ui-data-field">
          <option value="recurrent">Recurrente</option>
          <option value="one_off">Puntual</option>
        </select>
        <input
          v-model="annualIncomeForm.amountAnnual"
          class="input ui-data-field"
          inputmode="decimal"
          placeholder="Importe anual"
        />
        <select v-model="annualIncomeForm.currency" class="select ui-data-field">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
        <button
          class="btn btn-primary ui-data-field px-[14px]"
          type="button"
          :disabled="annualIncomeLoading"
          @click="submitAnnualIncome"
        >
          Anadir ingreso
        </button>
      </div>

      <textarea
        v-model="annualIncomeForm.notes"
        class="textarea mt-2"
        rows="2"
        placeholder="Notas (opcional)"
      />

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

      <div v-if="annualIncomeLoading" class="ui-status-line mt-2">Cargando ingresos anuales...</div>

      <div class="mt-3 text-right">
        <strong>Total anual:</strong> {{ formatMoneyAmount(totalAnnual, 'EUR') }}
      </div>
    </article>

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
  </div>
</template>
