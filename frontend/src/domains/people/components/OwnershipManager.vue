<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import {
  AButton,
  ARowMenu,
  ASectHead,
  ASelect,
  AState,
  AToast,
  type ASelectItem,
} from '@/domains/ui';
import { usePeopleOwnerships } from '@/domains/people/composables';
import { ownershipDisplayLabel } from '@/domains/people/ownershipPresentation';
import type { OwnershipRead } from '@/domains/people/types';
import { formatMoney } from '@/lib/format';

const {
  store,
  showModal,
  editId,
  successMessage,
  allocationPreview,
  previewLoading,
  ownershipPendingDelete,
  form,
  adults,
  canCreate,
  ownershipsSorted,
  ensureLoaded,
  resetModal,
  openCreate,
  openEdit,
  toggleMember,
  setEqualSplit,
  setIncomeRule,
  setAllocationBasis,
  submit,
  askRemoveOwnership,
  cancelRemoveOwnership,
  confirmRemoveOwnership,
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

function formatPercent(value: string | null | undefined): string {
  if (value == null) return 'Sin datos';
  return `${Number(value).toFixed(2)}%`;
}

function basisLabel(ownership: OwnershipRead): string {
  return ownership.allocation_basis === 'recurring_income_12m'
    ? 'Se recalcula cada mes'
    : 'Reparto fijo';
}

function rowMenuItems(ownership: OwnershipRead) {
  return [
    { id: 'edit', label: 'Editar titularidad', disabled: store.loading },
    {
      id: 'delete',
      label: 'Eliminar titularidad',
      danger: true,
      disabled: store.loading || ownership.is_in_use,
    },
  ];
}

function onRowAction(ownership: OwnershipRead, action: string): void {
  if (action === 'edit') openEdit(ownership);
  else if (action === 'delete') askRemoveOwnership(ownership);
}

const isEditingInUse = () =>
  editId.value != null && ownershipsSorted.value.find((o) => o.id === editId.value)?.is_in_use;

onMounted(async () => {
  await ensureLoaded();
});
</script>

<template>
  <section class="sect">
    <ASectHead
      title="Titularidades compartidas"
      subtitle="Cómo se reparte entre adultos lo que no es de una sola persona."
    >
      <template #actions>
        <AButton variant="primary" :disabled="store.loading" @click="openCreate">
          Nueva compartida
        </AButton>
      </template>
    </ASectHead>

    <AToast :open="!!successMessage" @close="successMessage = null">{{ successMessage }}</AToast>

    <AState v-if="store.error" status="error">{{ store.error }}</AState>

    <AState v-else-if="store.loading && !ownershipsSorted.length" status="loading">
      Cargando titularidades…
    </AState>

    <AState v-else-if="!ownershipsSorted.length" status="empty">
      No hay titularidades compartidas. Crea una cuando un bien o un gasto sea de más de un adulto.
    </AState>

    <table v-else class="data-table a-aux-table">
      <thead>
        <tr>
          <th>Titularidad</th>
          <th>Reparto</th>
          <th>Uso</th>
          <th class="a-aux-menu-head"><span class="sr-only">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in ownershipsSorted" :key="o.id">
          <td class="a-aux-cell-primary a-aux-name">{{ ownershipDisplayLabel(o) }}</td>
          <td class="a-aux-muted" data-label="Reparto">{{ basisLabel(o) }}</td>
          <td data-label="Uso">
            <span class="a-aux-muted">{{ o.is_in_use ? 'En uso' : 'Sin usar' }}</span>
          </td>
          <td class="a-aux-cell-menu">
            <ARowMenu
              :items="rowMenuItems(o)"
              :label="`Acciones de ${ownershipDisplayLabel(o)}`"
              @select="(action) => onRowAction(o, action)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <BaseModal
      :open="showModal"
      :title="editId != null ? 'Editar titularidad compartida' : 'Nueva titularidad compartida'"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="resetModal"
    >
      <div class="ui-item-form-grid">
        <p class="a-aux-hint md:col-span-2">
          Elige quién participa y si el reparto es fijo o se recalcula con los ingresos recurrentes
          de los últimos 12 meses.
        </p>

        <label class="ui-item-form-field md:col-span-2">
          <span class="ui-item-form-label">Método de reparto</span>
          <ASelect
            class="select"
            :model-value="form.allocationBasis"
            :options="allocationBasisOptions"
            :searchable="false"
            @update:model-value="
              (value) => setAllocationBasis(String(value) as typeof form.allocationBasis)
            "
          />
        </label>

        <div class="ui-item-form-field md:col-span-2">
          <span class="ui-item-form-label">Miembros</span>
          <div class="a-aux-member-list">
            <AButton
              v-for="m in adults"
              :key="m.id"
              :class="{ 'a-aux-member-inactive': !form.memberIds.includes(m.id) }"
              :aria-pressed="form.memberIds.includes(m.id)"
              :disabled="isEditingInUse()"
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
          <div class="a-aux-splits-header">
            <span class="ui-item-form-label">Porcentajes</span>
            <AButton size="sm" @click="setEqualSplit">Reparto igual</AButton>
          </div>
          <div class="a-aux-splits">
            <div v-for="id in form.memberIds" :key="id" class="a-aux-split-row">
              <div class="a-aux-split-name">
                {{ adults.find((a) => a.id === id)?.name ?? 'ID ' + id }}
              </div>
              <input
                v-model="form.percents[id]"
                inputmode="decimal"
                placeholder="50.00"
                class="input a-aux-percent-input"
                :disabled="isEditingInUse()"
              />
              <span class="a-aux-muted">%</span>
            </div>
          </div>
        </div>

        <div
          v-if="form.allocationBasis === 'recurring_income_12m'"
          class="ui-item-form-field md:col-span-2"
        >
          <span class="ui-item-form-label">Ingresos que forman el reparto</span>
          <p class="a-aux-hint">
            Solo se cuentan movimientos recurrentes con titularidad individual dentro de estas
            fuentes. Los ingresos puntuales quedan excluidos.
          </p>
          <label
            v-for="rule in incomeRuleOptions"
            :key="`${rule.category_key}:${rule.subcategory_key}`"
            class="a-aux-check-row"
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
          <div class="a-aux-splits-header">
            <span class="ui-item-form-label">Vista previa del reparto</span>
            <span class="a-aux-muted">Se actualiza al guardar</span>
          </div>
          <AState v-if="previewLoading" status="loading" layout="inline">
            Calculando últimos 12 meses…
          </AState>
          <template v-else-if="allocationPreview">
            <p class="a-aux-hint">
              {{ allocationPreview.window_start }} — {{ allocationPreview.window_end }} ·
              {{ allocationPreview.observed_months }} meses observados ·
              {{ allocationPreview.excluded_transaction_count }} movimientos excluidos
            </p>
            <div class="a-aux-splits">
              <div
                v-for="share in allocationPreview.shares"
                :key="share.member_id"
                class="a-aux-split-row"
              >
                <div class="a-aux-split-name">{{ share.member_name }}</div>
                <strong>{{ formatPercent(share.percent) }}</strong>
                <span class="a-aux-muted">{{ formatMoney(share.qualifying_income, 'EUR') }}</span>
              </div>
            </div>
            <AState v-if="allocationPreview.status !== 'ready'" status="neutral" layout="inline">
              Reparto
              {{ allocationPreview.status === 'provisional' ? 'provisional' : 'bloqueado' }}:
              {{ allocationPreview.quality_reasons.join(', ') || 'faltan ingresos suficientes' }}.
            </AState>
          </template>
          <p v-else class="a-aux-hint">
            Guarda el método para calcular la vista previa con movimientos reales.
          </p>
        </div>
      </div>
      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="resetModal">Cancelar</AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn"
            :disabled="!canCreate || store.loading"
            @click="submit"
          >
            {{ editId != null ? 'Guardar' : 'Crear' }}
          </AButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="Boolean(ownershipPendingDelete)"
      title="Eliminar titularidad"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="cancelRemoveOwnership"
    >
      <div v-if="ownershipPendingDelete" class="a-aux-confirm">
        <p class="a-aux-confirm-lead">
          Vas a eliminar <strong>{{ ownershipDisplayLabel(ownershipPendingDelete) }}</strong>
        </p>
        <p class="a-aux-confirm-copy">
          Solo se puede eliminar mientras no la use ninguna posición ni movimiento. Los miembros no
          se ven afectados.
        </p>
      </div>

      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="cancelRemoveOwnership">Cancelar</AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn a-aux-danger"
            :disabled="store.loading"
            @click="confirmRemoveOwnership"
          >
            Eliminar
          </AButton>
        </div>
      </template>
    </BaseModal>
  </section>
</template>
