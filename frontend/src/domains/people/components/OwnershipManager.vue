<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import { AButton } from '@/domains/ui';
import { usePeopleOwnerships } from '@/domains/people/composables';
import OwnershipLabel from '@/domains/people/components/OwnershipLabel.vue';

const {
  store,
  showModal,
  editId,
  successMessage,
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
  submit,
  removeOwnership,
} = usePeopleOwnerships();

onMounted(async () => {
  await ensureLoaded();
});
</script>

<template>
  <div>
    <div v-if="store.error" class="alert ui-people-alert">
      {{ store.error }}
    </div>
    <div v-if="successMessage" class="ui-alert-success">
      {{ successMessage }}
    </div>

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
          Selecciona al menos 2 adultos y reparte los porcentajes (suma 100).
        </p>

        <div class="ui-item-form-field md:col-span-2">
          <span class="ui-item-form-label">Miembros</span>
          <div class="ui-people-member-list">
            <AButton
              v-for="m in adults"
              :key="m.id"
              :class="{ 'ui-people-member-inactive': !form.memberIds.includes(m.id) }"
              @click="toggleMember(m.id)"
            >
              {{ m.name }}
            </AButton>
          </div>
        </div>

        <div v-if="form.memberIds.length" class="ui-item-form-field md:col-span-2">
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
              />
              <span class="subtle">%</span>
            </div>
          </div>
        </div>

        <div class="ui-form-actions md:col-span-2">
          <AButton class="ui-form-action-btn" @click="resetModal">Cancelar</AButton>
          <AButton
            class="ui-form-action-btn"
            :disabled="!canCreate || store.loading"
            @click="submit"
          >
            {{ editId != null ? 'Guardar' : 'Crear' }}
          </AButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
