<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import { AButton, ASelect, AState, AToast, type ASelectItem } from '@/domains/ui';
import { usePeopleOwnerships } from '@/domains/people/composables';
import OwnershipLabel from '@/domains/people/components/OwnershipLabel.vue';

const {
  store,
  showModal,
  editId,
  successMessage,
  allocationPreview,
  previewLoading,
  form,
  adults,
  canCreate,
  ownershipsSorted,
  ensureLoaded,
  refreshOwnerships,
  resetModal,
  openCreate,
  openEdit,
  toggleMember,
  setEqualSplit,
  setIncomeRule,
  setAllocationBasis,
  submit,
  removeOwnership,
} = usePeopleOwnerships();

const allocationBasisOptions: ASelectItem[] = [
  { value: 'recurring_income_12m', label: 'Proporcional a ingresos recurrentes (12 meses)' },
  { value: 'explicit_split', label: 'Reparto fijo' },
];
const incomeRuleOptions = [
  { category_key: 'salary', subcategory_key: '', label: 'Todos los salarios y nóminas' },
  { category_key: 'business', subcategory_key: '', label: 'Actividad profesional o negocio' },
  {
    category_key: 'public_benefits',
    subcategory_key: 'retirement_pension',
    label: 'Pensión de jubilación',
  },
];

function incomeRuleSelected(categoryKey: string, subcategoryKey: string): boolean {
  return form.incomeRules.some(
    (rule) => rule.category_key === categoryKey && rule.subcategory_key === subcategoryKey,
  );
}

function formatMoney(value: string): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
    Number(value),
  );
}

onMounted(async () => {
  await ensureLoaded();
});
</script>

<template>
  <div>
    <div v-if="store.error" class="alert ui-people-alert">
      {{ store.error }}
    </div>
    <AToast :open="!!successMessage" @close="successMessage = null">{{ successMessage }}</AToast>

    <section class="section card">
      <div class="card-header">
        <h2 class="card-header-title">Titularidades</h2>

        <div class="ui-people-header-actions">
          <AButton :disabled="store.loading" @click="refreshOwnerships()"> Refrescar </AButton>
          <AButton variant="primary" :disabled="store.loading" @click="openCreate">
            Nueva compartida
          </AButton>
        </div>
      </div>

      <table class="ui-data-table">
        <thead>
          <tr>
            <th>Titularidad</th>
            <th class="ui-data-table-actions">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in ownershipsSorted" :key="o.id">
            <td>
              <OwnershipLabel :kind="o.kind" :member="o.member" :splits="o.splits" />
              <span v-if="o.allocation_basis === 'recurring_income_12m'" class="subtle">
                · reparto dinámico por ingresos
              </span>
            </td>

            <td class="ui-data-table-actions">
              <div class="ui-people-row-actions">
                <button
                  class="icon-btn"
                  type="button"
                  title="Editar"
                  aria-label="Editar"
                  :disabled="store.loading"
                  @click="openEdit(o)"
                >
                  &#9998;&#65039;
                </button>

                <button
                  class="icon-btn"
                  type="button"
                  title="Eliminar"
                  aria-label="Eliminar"
                  :disabled="store.loading || o.is_in_use"
                  @click="removeOwnership(o.id)"
                >
                  &#128465;&#65039;
                </button>

                <span v-if="o.kind === 'shared' && o.is_in_use" class="subtle">En uso</span>
              </div>
            </td>
          </tr>

          <tr v-if="!ownershipsSorted.length">
            <td colspan="2" class="ui-table-empty">No hay titularidades compartidas todavía.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="store.loading" class="ui-status-line">Cargando titularidades...</div>

    <BaseModal
      :open="showModal"
      :title="editId != null ? 'Editar titularidad compartida' : 'Nueva titularidad compartida'"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="resetModal"
    >
      <div class="ui-item-form-grid">
        <p class="subtle m-0 pb-1 md:col-span-2">
          Elige quién participa y si el reparto es fijo o se recalcula con los ingresos recurrentes
          de los últimos 12 meses.
        </p>

        <label class="ui-item-form-field md:col-span-2">
          <span class="ui-item-form-label">Método de reparto</span>
          <ASelect
            class="select"
            :model-value="form.allocationBasis"
            :options="allocationBasisOptions"
            @update:model-value="
              (value) => setAllocationBasis(String(value) as typeof form.allocationBasis)
            "
          />
        </label>

        <div class="ui-item-form-field md:col-span-2">
          <span class="ui-item-form-label">Miembros</span>
          <div class="ui-people-member-list">
            <AButton
              v-for="m in adults"
              :key="m.id"
              :class="{ 'ui-people-member-inactive': !form.memberIds.includes(m.id) }"
              :disabled="editId != null && ownershipsSorted.find((o) => o.id === editId)?.is_in_use"
              @click="toggleMember(m.id)"
            >
              {{ m.name }}
            </AButton>
          </div>
        </div>

        <div
          v-if="form.memberIds.length && form.allocationBasis === 'explicit_split'"
          class="ui-item-form-field md:col-span-2"
        >
          <div class="ui-people-splits-header">
            <span class="ui-item-form-label">Porcentajes</span>
            <AButton @click="setEqualSplit">Reparto igual</AButton>
          </div>
          <div class="ui-people-splits">
            <div v-for="id in form.memberIds" :key="id" class="ui-people-split-row">
              <div class="ui-people-split-name">
                {{ adults.find((a) => a.id === id)?.name ?? 'ID ' + id }}
              </div>
              <input
                v-model="form.percents[id]"
                inputmode="decimal"
                placeholder="50.00"
                class="input ui-people-percent-input"
                :disabled="
                  editId != null && ownershipsSorted.find((o) => o.id === editId)?.is_in_use
                "
              />
              <span class="subtle">%</span>
            </div>
          </div>
        </div>

        <div
          v-if="form.allocationBasis === 'recurring_income_12m'"
          class="ui-item-form-field md:col-span-2"
        >
          <span class="ui-item-form-label">Ingresos que forman el reparto</span>
          <p class="subtle m-0 pb-1">
            Solo se cuentan movimientos recurrentes con titularidad individual dentro de estas
            fuentes. Los ingresos puntuales quedan excluidos.
          </p>
          <label
            v-for="rule in incomeRuleOptions"
            :key="`${rule.category_key}:${rule.subcategory_key}`"
            class="ui-check-row"
          >
            <input
              type="checkbox"
              :checked="incomeRuleSelected(rule.category_key, rule.subcategory_key)"
              @change="
                setIncomeRule(
                  { category_key: rule.category_key, subcategory_key: rule.subcategory_key },
                  ($event.target as HTMLInputElement).checked,
                )
              "
            />
            <span>{{ rule.label }}</span>
          </label>
        </div>

        <div
          v-if="form.allocationBasis === 'recurring_income_12m' && editId != null"
          class="ui-item-form-field md:col-span-2"
        >
          <div class="ui-people-splits-header">
            <span class="ui-item-form-label">Vista previa del reparto</span>
            <span class="subtle">Se actualiza al guardar</span>
          </div>
          <AState v-if="previewLoading" status="loading" layout="inline">
            Calculando últimos 12 meses…
          </AState>
          <template v-else-if="allocationPreview">
            <p class="subtle">
              {{ allocationPreview.window_start }} — {{ allocationPreview.window_end }} ·
              {{ allocationPreview.observed_months }} meses observados ·
              {{ allocationPreview.excluded_transaction_count }} movimientos excluidos
            </p>
            <div class="ui-people-splits">
              <div
                v-for="share in allocationPreview.shares"
                :key="share.member_id"
                class="ui-people-split-row"
              >
                <div class="ui-people-split-name">{{ share.member_name }}</div>
                <strong>{{ Number(share.percent).toFixed(2) }}%</strong>
                <span class="subtle">{{ formatMoney(share.qualifying_income) }}</span>
              </div>
            </div>
            <AState v-if="allocationPreview.status !== 'ready'" status="neutral" layout="inline">
              Reparto
              {{ allocationPreview.status === 'provisional' ? 'provisional' : 'bloqueado' }}:
              {{ allocationPreview.quality_reasons.join(', ') || 'faltan ingresos suficientes' }}.
            </AState>
          </template>
          <p v-else class="subtle">
            Guarda el método para calcular la vista previa con movimientos reales.
          </p>
        </div>
      </div>
      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="resetModal">Cancelar</AButton>
          <AButton
            class="ui-form-action-btn"
            :disabled="!canCreate || store.loading"
            @click="submit"
          >
            {{ editId != null ? 'Guardar' : 'Crear' }}
          </AButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
