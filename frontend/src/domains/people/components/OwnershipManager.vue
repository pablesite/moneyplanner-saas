<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import { usePeopleOwnerships } from '@/domains/people/composables';
import OwnershipLabel from '@/domains/people/components/OwnershipLabel.vue';

const {
  store,
  showModal,
  editId,
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
    <div v-if="store.error" class="alert ownership-alert">
      {{ store.error }}
    </div>

    <section class="section card ownership-section">
      <div class="card-header">
        <h2 class="card-header-title">Titularidades</h2>

        <div class="ownership-actions">
          <button class="btn" type="button" :disabled="store.loading" @click="refreshOwnerships()">
            Refrescar
          </button>
          <button class="btn btn-primary" type="button" :disabled="store.loading" @click="openCreate">
            Nueva compartida
          </button>
        </div>
      </div>

      <table class="ownership-table">
        <thead>
          <tr>
            <th class="ownership-th">Titularidad</th>
            <th class="ownership-th ownership-th-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in ownershipsSorted" :key="o.id">
            <td class="ownership-td">
              <OwnershipLabel :kind="o.kind" :member="o.member" :splits="o.splits" />
            </td>

            <td class="ownership-td ownership-td-right">
              <div class="ownership-row-actions">
                <button
                  v-if="o.kind === 'shared'"
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
                  v-if="o.kind === 'shared'"
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

                <span v-if="o.kind !== 'shared'" class="subtle">&mdash;</span>
              </div>
            </td>
          </tr>

          <tr v-if="!ownershipsSorted.length">
            <td colspan="2" class="subtle ownership-empty">No hay titularidades todavia.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseModal
      :open="showModal"
      :title="editId != null ? 'Editar titularidad compartida' : 'Nueva titularidad compartida'"
      @close="resetModal"
    >
      <div class="ownership-modal-grid">
        <div class="subtle">Selecciona al menos 2 adultos y reparte los porcentajes (suma 100).</div>

        <div class="card ownership-splits-card">
          <div class="ownership-member-list">
            <button
              v-for="m in adults"
              :key="m.id"
              class="btn"
              type="button"
              :class="{ 'ownership-member-inactive': !form.memberIds.includes(m.id) }"
              @click="toggleMember(m.id)"
            >
              {{ m.name }}
            </button>
          </div>

          <div v-if="form.memberIds.length" class="ownership-splits">
            <div class="ownership-splits-header">
              <div class="subtle">Porcentajes</div>
              <button class="btn" type="button" @click="setEqualSplit">Reparto igual</button>
            </div>

            <div v-for="id in form.memberIds" :key="id" class="ownership-split-row">
              <div class="ownership-split-name">
                {{ adults.find((a) => a.id === id)?.name ?? 'ID ' + id }}
              </div>

              <input
                v-model="form.percents[id]"
                inputmode="decimal"
                placeholder="50.00"
                class="ownership-percent-input"
              />
              <span class="subtle">%</span>
            </div>
          </div>
        </div>

        <div class="ownership-modal-actions">
          <button class="btn" type="button" @click="resetModal">Cancelar</button>
          <button class="btn" type="button" :disabled="!canCreate || store.loading" @click="submit">
            {{ editId != null ? 'Guardar' : 'Crear' }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.ownership-alert {
  margin-bottom: 12px;
}

.ownership-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ownership-table {
  width: 100%;
  border-collapse: collapse;
}

.ownership-th {
  text-align: left;
  padding: 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ownership-th-right {
  text-align: right;
}

.ownership-td {
  padding: 8px 6px;
}

.ownership-td-right {
  text-align: right;
}

.ownership-row-actions {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.ownership-empty {
  padding: 10px 6px;
}

.ownership-modal-grid {
  display: grid;
  gap: 12px;
}

.ownership-splits-card {
  padding: 12px;
}

.ownership-member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ownership-member-inactive {
  opacity: 0.65;
}

.ownership-splits {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.ownership-splits-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ownership-split-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.ownership-split-name {
  min-width: 160px;
}

.ownership-percent-input {
  max-width: 140px;
}

.ownership-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
