<script setup lang="ts">
import { computed, onMounted, reactive, ref, type ComponentPublicInstance } from 'vue';
import { useRoute } from 'vue-router';
import {
  saasAdminApi,
  type CoreAdminUser,
  type SaasAdminRole,
  type SaasAdminUser,
} from '@/domains/admin';
import { authApi, toAuthErrorMessage, type CurrentUser } from '@/domains/auth';
import { usePortableDataTransfer } from '@/domains/portable-data';
import { AButton, APageHead, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { coreApi } from '@/lib/api';

const route = useRoute();

const loading = ref(true);
const error = ref<string | null>(null);
const currentUser = ref<CurrentUser | null>(null);
const baseCurrency = ref<string>('');
const inflationRegion = ref('ES');
const coreAccountError = ref<string | null>(null);
const baseCurrencySaveBusy = ref(false);
const baseCurrencySaveMessage = ref<string | null>(null);
const adminUsers = ref<SaasAdminUser[]>([]);
const coreUsers = ref<CoreAdminUser[]>([]);
const adminUsersLoading = ref(false);
const adminUsersError = ref<string | null>(null);
const adminUsersSuccess = ref<string | null>(null);
const adminActionBusy = ref(false);
const showCreateUserModal = ref(false);

const createUserForm = reactive({
  username: '',
  password: '',
  email: '',
  role: 'saas_member' as SaasAdminRole,
  is_active: true,
});

const {
  dataTransferUiBusy,
  dataTransferBusy,
  dataTransferBusyLabel,
  dataTransferStatus,
  dataTransferError,
  dataTransferToastKind,
  dataTransferToastMessage,
  importFileInputRef,
  triggerImportDialog,
  exportDataBundle,
  importDataFromFile,
} = usePortableDataTransfer({
  externalBusy: loading,
  onImportCompleted: load,
});

const permissionNotice =
  route.query.reason === 'permission_denied'
    ? 'No tienes permisos para acceder a esa seccion.'
    : null;

const isAdmin = computed(() => currentUser.value?.role === 'saas_admin');
const isMember = computed(() => currentUser.value?.role === 'saas_member');
const baseCurrencyOptions = ['EUR', 'USD'];
const baseCurrencySelectOptions: ASelectItem[] = baseCurrencyOptions.map((currency) => ({
  value: currency,
  label: currency,
}));
const createUserRoleOptions: ASelectItem[] = [
  { value: 'saas_member', label: 'Miembro SaaS' },
  { value: 'saas_admin', label: 'Admin SaaS' },
];

type AdminIdentityRow = {
  key: string;
  displayName: string;
  displayEmail: string;
  saasUser: SaasAdminUser | null;
  coreUser: CoreAdminUser | null;
};

const portableDataToastClass = computed(() =>
  dataTransferToastKind.value === 'error'
    ? 'border border-rose-300/30 bg-rose-950/90 text-rose-100'
    : 'border border-emerald-300/30 bg-emerald-950/90 text-emerald-100',
);
const portableDataToastDotClass = computed(() =>
  dataTransferToastKind.value === 'error' ? 'bg-rose-300' : 'bg-emerald-300',
);

function roleLabel(role: CurrentUser['role'] | SaasAdminRole): string {
  return role === 'saas_admin' ? 'Admin SaaS' : 'Miembro SaaS';
}

function subscriptionLabel(status: CurrentUser['subscription_status']): string {
  if (status === 'active') return 'Activa';
  if (status === 'past_due') return 'Pendiente';
  if (status === 'canceled') return 'Cancelada';
  return 'Trial';
}

function statusLabel(isActive: boolean): string {
  return isActive ? 'Activa' : 'Desactivada';
}

function coreUserOriginLabel(user: CoreAdminUser): string {
  return user.origin === 'core_native' ? 'Creado en Core' : 'Provisionado desde SaaS';
}

function coreUserConnectionLabel(user: CoreAdminUser): string {
  if (user.connection_kind === 'manual_link') return 'Vinculo manual con SaaS';
  if (user.connection_kind === 'bootstrap') return 'Conectado con usuario SaaS';
  return 'Sin usuario SaaS';
}

const adminIdentityRows = computed<AdminIdentityRow[]>(() => {
  const rows: AdminIdentityRow[] = [];
  const linkedCoreBySaasId = new Map<number, CoreAdminUser>();

  for (const coreUser of coreUsers.value) {
    if (coreUser.linked_saas_user) {
      linkedCoreBySaasId.set(coreUser.linked_saas_user.id, coreUser);
    }
  }

  for (const saasUser of adminUsers.value) {
    rows.push({
      key: `saas-${saasUser.id}`,
      displayName:
        saasUser.username ||
        linkedCoreBySaasId.get(saasUser.id)?.username ||
        `Usuario ${saasUser.id}`,
      displayEmail: saasUser.email || linkedCoreBySaasId.get(saasUser.id)?.email || 'sin email',
      saasUser,
      coreUser: linkedCoreBySaasId.get(saasUser.id) ?? null,
    });
  }

  for (const coreUser of coreUsers.value) {
    if (coreUser.linked_saas_user) continue;
    rows.push({
      key: `core-${coreUser.id}`,
      displayName: coreUser.username || `Core ${coreUser.id}`,
      displayEmail: coreUser.email || 'sin email',
      saasUser: null,
      coreUser,
    });
  }

  return rows.sort((left, right) => left.displayName.localeCompare(right.displayName, 'es'));
});

function openCreateUserModal(): void {
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  showCreateUserModal.value = true;
}

function closeCreateUserModal(): void {
  showCreateUserModal.value = false;
  resetCreateUserForm();
}

function resetCreateUserForm(): void {
  createUserForm.username = '';
  createUserForm.password = '';
  createUserForm.email = '';
  createUserForm.role = 'saas_member';
  createUserForm.is_active = true;
}

async function loadCoreAccountSummary(): Promise<void> {
  baseCurrency.value = '';
  inflationRegion.value = 'ES';
  coreAccountError.value = null;
  baseCurrencySaveMessage.value = null;
  if (!isMember.value) return;
  try {
    const response = await coreApi.get<{ base_currency?: string; inflation_region?: string }>(
      '/api/auth/settings/',
    );
    baseCurrency.value = response.data?.base_currency ?? '';
    inflationRegion.value = response.data?.inflation_region ?? 'ES';
  } catch (e: unknown) {
    coreAccountError.value = toAuthErrorMessage(e);
  }
}

async function saveBaseCurrency(): Promise<void> {
  if (!isMember.value || !baseCurrency.value) return;
  baseCurrencySaveBusy.value = true;
  coreAccountError.value = null;
  baseCurrencySaveMessage.value = null;
  try {
    await coreApi.put('/api/auth/settings/', {
      base_currency: baseCurrency.value,
      inflation_region: inflationRegion.value,
    });
    baseCurrencySaveMessage.value = `Moneda base actualizada a ${baseCurrency.value}.`;
  } catch (e: unknown) {
    coreAccountError.value = toAuthErrorMessage(e);
  } finally {
    baseCurrencySaveBusy.value = false;
  }
}

async function loadAdminUsers(): Promise<void> {
  adminUsers.value = [];
  coreUsers.value = [];
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  if (!isAdmin.value) return;
  adminUsersLoading.value = true;
  try {
    const response = await saasAdminApi.listUsers();
    adminUsers.value = response.data?.saas_users ?? [];
    coreUsers.value = response.data?.core_users ?? [];
  } catch (e: unknown) {
    adminUsersError.value = toAuthErrorMessage(e);
  } finally {
    adminUsersLoading.value = false;
  }
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await authApi.validateSession();
    currentUser.value = res.data ?? null;
    await Promise.all([loadCoreAccountSummary(), loadAdminUsers()]);
  } catch (e: unknown) {
    error.value = toAuthErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

async function createAdminUser(): Promise<void> {
  adminActionBusy.value = true;
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  try {
    const response = await saasAdminApi.createUser({
      username: createUserForm.username.trim(),
      password: createUserForm.password,
      email: createUserForm.email.trim(),
      role: createUserForm.role,
      is_active: createUserForm.is_active,
    });
    await loadAdminUsers();
    adminUsersSuccess.value = `Usuario ${response.data.username} creado.`;
    showCreateUserModal.value = false;
    resetCreateUserForm();
  } catch (e: unknown) {
    adminUsersError.value = toAuthErrorMessage(e);
  } finally {
    adminActionBusy.value = false;
  }
}

async function switchUserRole(user: SaasAdminUser): Promise<void> {
  adminActionBusy.value = true;
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  const nextRole: SaasAdminRole = user.role === 'saas_admin' ? 'saas_member' : 'saas_admin';
  try {
    const response = await saasAdminApi.updateUserRole(user.id, nextRole);
    await loadAdminUsers();
    adminUsersSuccess.value = `Rol actualizado para ${response.data.username}.`;
  } catch (e: unknown) {
    adminUsersError.value = toAuthErrorMessage(e);
  } finally {
    adminActionBusy.value = false;
  }
}

async function toggleUserStatus(user: SaasAdminUser): Promise<void> {
  adminActionBusy.value = true;
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  try {
    const response = await saasAdminApi.updateUserStatus(user.id, !user.is_active);
    await loadAdminUsers();
    adminUsersSuccess.value = `Estado actualizado para ${response.data.username}.`;
  } catch (e: unknown) {
    adminUsersError.value = toAuthErrorMessage(e);
  } finally {
    adminActionBusy.value = false;
  }
}

async function deleteUser(user: SaasAdminUser): Promise<void> {
  if (typeof window !== 'undefined') {
    const confirmed = window.confirm(`Eliminar al usuario ${user.username}?`);
    if (!confirmed) return;
  }
  adminActionBusy.value = true;
  adminUsersError.value = null;
  adminUsersSuccess.value = null;
  try {
    await saasAdminApi.deleteUser(user.id);
    await loadAdminUsers();
    adminUsersSuccess.value = `Usuario ${user.username} eliminado.`;
  } catch (e: unknown) {
    adminUsersError.value = toAuthErrorMessage(e);
  } finally {
    adminActionBusy.value = false;
  }
}

onMounted(load);

const setImportFileInputRef = (el: Element | ComponentPublicInstance | null): void => {
  importFileInputRef.value = el as HTMLInputElement | null;
};
</script>

<template>
  <div class="container ui-page-shell">
    <APageHead :title="isAdmin ? 'Admin SaaS' : 'Perfil'" />

    <div v-if="error" class="alert mt-3">
      {{ error }}
    </div>

    <div v-if="permissionNotice" class="alert mt-3">
      {{ permissionNotice }}
    </div>

    <div v-if="loading" class="ui-status-line mt-3">Cargando cuenta...</div>

    <div v-else-if="currentUser" class="grid gap-3.5">
      <section class="card ui-section-card ui-profile-panel">
        <div class="ui-profile-head">
          <h2 class="ui-profile-head-title">{{ isAdmin ? 'Cuenta SaaS' : 'Mi cuenta' }}</h2>
        </div>

        <div class="ui-profile-layout">
          <div class="ui-profile-list">
            <div class="ui-profile-row">
              <span class="ui-profile-label">Usuario</span>
              <strong class="ui-profile-value">{{ currentUser.username }}</strong>
            </div>
            <div class="ui-profile-row">
              <span class="ui-profile-label">Rol</span>
              <strong class="ui-profile-value">{{ roleLabel(currentUser.role) }}</strong>
            </div>
            <div v-if="!isAdmin" class="ui-profile-row">
              <span class="ui-profile-label">Email</span>
              <strong class="ui-profile-value">{{ currentUser.email || 'sin configurar' }}</strong>
            </div>
            <div v-if="!isAdmin" class="ui-profile-row">
              <span class="ui-profile-label">Suscripcion</span>
              <strong class="ui-profile-value">{{
                subscriptionLabel(currentUser.subscription_status)
              }}</strong>
            </div>
            <div v-if="!isAdmin" class="ui-profile-row">
              <span class="ui-profile-label">Moneda base</span>
              <div class="flex items-center gap-2">
                <ASelect
                  class="select"
                  :model-value="baseCurrency"
                  :options="baseCurrencySelectOptions"
                  :disabled="baseCurrencySaveBusy || loading"
                  :searchable="false"
                  @update:model-value="(v) => (baseCurrency = String(v))"
                />
                <AButton
                  variant="ghost"
                  size="sm"
                  :disabled="baseCurrencySaveBusy || loading"
                  @click="saveBaseCurrency"
                >
                  {{ baseCurrencySaveBusy ? 'Guardando...' : 'Guardar' }}
                </AButton>
              </div>
            </div>
          </div>

          <aside v-if="!isAdmin" class="ui-profile-aside">
            <span class="ui-profile-aside-label">Preferencias</span>
            <span class="badge ui-profile-badge-on">Cuenta activa</span>
            <span class="subtle">
              Ajusta la moneda base para ver tus totales con la referencia que uses a diario.
            </span>
          </aside>

          <aside v-else class="ui-profile-aside">
            <span class="ui-profile-aside-label">Modo de acceso</span>
            <span class="badge ui-profile-badge-on">Administracion SaaS</span>
            <span class="subtle">
              Este perfil admin se centra en la gestion de usuarios y accesos del SaaS.
            </span>
          </aside>
        </div>
      </section>

      <section v-if="isAdmin" id="users" class="card ui-section-card ui-profile-panel">
        <div class="ui-profile-head">
          <h2 class="ui-profile-head-title">Usuarios</h2>
          <div class="actions">
            <AButton
              variant="primary"
              size="sm"
              :disabled="adminActionBusy"
              @click="openCreateUserModal"
            >
              +
            </AButton>
            <AButton variant="ghost" size="sm" :disabled="adminActionBusy" @click="loadAdminUsers">
              Recargar lista
            </AButton>
          </div>
        </div>
        <p class="subtle m-0">
          Vista unificada de identidades: cada fila muestra si la cuenta existe en SaaS, en Core o
          en ambos lados.
        </p>

        <div class="grid gap-3.5 mt-3">
          <p v-if="adminUsersSuccess" class="subtle m-0">{{ adminUsersSuccess }}</p>
          <p v-if="adminUsersError" class="alert m-0">{{ adminUsersError }}</p>
          <p v-if="adminUsersLoading" class="ui-status-line m-0">Cargando usuarios...</p>

          <div v-if="!adminUsersLoading" class="grid gap-2.5">
            <article v-for="row in adminIdentityRows" :key="row.key" class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-header-title">{{ row.displayName }}</h3>
                  <p class="subtle m-0">{{ row.displayEmail }}</p>
                </div>
                <div class="actions">
                  <span
                    class="badge"
                    :class="row.saasUser ? 'ui-profile-badge-on' : 'ui-profile-badge-off'"
                  >
                    {{ row.saasUser ? 'En SaaS' : 'Solo Core' }}
                  </span>
                  <span
                    class="badge"
                    :class="row.coreUser ? 'ui-profile-badge-on' : 'ui-profile-badge-off'"
                  >
                    {{ row.coreUser ? 'En Core' : 'Solo SaaS' }}
                  </span>
                  <span
                    class="badge"
                    :class="
                      row.saasUser?.is_active || row.coreUser?.is_active
                        ? 'ui-profile-badge-on'
                        : 'ui-profile-badge-off'
                    "
                  >
                    {{ statusLabel(Boolean(row.saasUser?.is_active || row.coreUser?.is_active)) }}
                  </span>
                </div>
              </div>

              <div class="grid gap-2 md:grid-cols-2">
                <div class="rounded-lg border border-white/8 p-3">
                  <p class="subtle m-0">SaaS</p>
                  <template v-if="row.saasUser">
                    <p class="m-0"><strong>Rol:</strong> {{ roleLabel(row.saasUser.role) }}</p>
                    <p class="m-0">
                      <strong>Estado:</strong> {{ statusLabel(row.saasUser.is_active) }}
                    </p>
                    <p class="m-0">
                      <strong>Email:</strong> {{ row.saasUser.email || 'sin email' }}
                    </p>
                  </template>
                  <p v-else class="m-0">Sin cuenta SaaS asociada.</p>
                </div>
                <div class="rounded-lg border border-white/8 p-3">
                  <p class="subtle m-0">Core</p>
                  <template v-if="row.coreUser">
                    <p class="m-0">
                      <strong>Origen:</strong> {{ coreUserOriginLabel(row.coreUser) }}
                    </p>
                    <p class="m-0">
                      <strong>Usuario:</strong>
                      {{ row.coreUser.username || 'sin username' }}
                    </p>
                    <p class="m-0">
                      <strong>Conexion:</strong> {{ coreUserConnectionLabel(row.coreUser) }}
                    </p>
                    <p class="m-0">
                      <strong>Identidades:</strong>
                      {{
                        row.coreUser.external_identities.length
                          ? row.coreUser.external_identities
                              .map(
                                (identity) => `${identity.provider}:${identity.external_user_id}`,
                              )
                              .join(', ')
                          : 'ninguna'
                      }}
                    </p>
                  </template>
                  <p v-else class="m-0">Sin cuenta Core asociada.</p>
                </div>
              </div>

              <div v-if="row.saasUser" class="actions">
                <AButton
                  variant="ghost"
                  size="sm"
                  :disabled="adminActionBusy"
                  @click="switchUserRole(row.saasUser)"
                >
                  {{ row.saasUser.role === 'saas_admin' ? 'Pasar a miembro' : 'Dar rol admin' }}
                </AButton>
                <AButton
                  variant="ghost"
                  size="sm"
                  :disabled="adminActionBusy"
                  @click="toggleUserStatus(row.saasUser)"
                >
                  {{ row.saasUser.is_active ? 'Desactivar' : 'Activar' }}
                </AButton>
                <AButton
                  variant="ghost"
                  size="sm"
                  :disabled="adminActionBusy"
                  @click="deleteUser(row.saasUser)"
                >
                  Eliminar
                </AButton>
              </div>
            </article>

            <AState v-if="!adminIdentityRows.length" status="empty">
              No hay usuarios cargados. Prueba a recargar la lista o crear el primer usuario.
            </AState>
          </div>
        </div>
      </section>

      <template v-else>
        <p v-if="baseCurrencySaveMessage" class="subtle m-0">{{ baseCurrencySaveMessage }}</p>
        <p v-if="coreAccountError" class="alert m-0">{{ coreAccountError }}</p>

        <section class="card ui-section-card grid gap-2.5">
          <div class="ui-profile-head">
            <h2 class="ui-profile-head-title">Portable data</h2>
          </div>
          <p class="subtle m-0">
            Exporta, importa o reemplaza tus datos para mover tu entorno entre instancias.
          </p>
          <div class="actions m-0">
            <AButton variant="ghost" :disabled="dataTransferUiBusy" @click="exportDataBundle">
              Exportar datos
            </AButton>
            <AButton
              variant="primary"
              :disabled="dataTransferUiBusy"
              @click="triggerImportDialog('append')"
            >
              Importar datos
            </AButton>
            <AButton
              variant="ghost"
              :disabled="dataTransferUiBusy"
              @click="triggerImportDialog('replace')"
            >
              Reemplazar datos
            </AButton>
            <input
              :ref="setImportFileInputRef"
              type="file"
              accept="application/json,.json"
              class="sr-only"
              @change="importDataFromFile"
            />
          </div>
          <p v-if="dataTransferStatus" class="subtle m-0">{{ dataTransferStatus }}</p>
          <p v-if="dataTransferError" class="alert m-0">{{ dataTransferError }}</p>
        </section>
      </template>
    </div>
  </div>

  <BaseModal
    :open="showCreateUserModal"
    title="Crear usuario SaaS"
    variant="sheet"
    panel-class="dir-a dir-a-sheet"
    @close="closeCreateUserModal"
  >
    <form class="ui-item-form-grid" @submit.prevent="createAdminUser">
      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Username</span>
        <input v-model="createUserForm.username" class="input" type="text" required />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Email</span>
        <input v-model="createUserForm.email" class="input" type="email" />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Password</span>
        <input
          v-model="createUserForm.password"
          class="input"
          type="password"
          minlength="8"
          required
        />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Rol inicial</span>
        <ASelect
          class="select"
          :model-value="createUserForm.role"
          :options="createUserRoleOptions"
          :searchable="false"
          @update:model-value="(v) => (createUserForm.role = v as SaasAdminRole)"
        />
      </label>

      <label class="checkbox-row md:col-span-2">
        <input v-model="createUserForm.is_active" type="checkbox" />
        <span>Crear usuario activo</span>
      </label>

      <div class="actions md:col-span-2">
        <AButton variant="primary" type="submit" :disabled="adminActionBusy">
          {{ adminActionBusy ? 'Guardando...' : 'Crear usuario' }}
        </AButton>
      </div>
    </form>
  </BaseModal>

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="dataTransferToastMessage"
      class="fixed right-4 top-4 z-[80] max-w-[min(92vw,560px)] rounded-xl px-4 py-3 text-sm shadow-2xl backdrop-blur"
      :class="portableDataToastClass"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-2.5">
        <span
          class="mt-0.5 inline-block h-2.5 w-2.5 rounded-full"
          :class="portableDataToastDotClass"
        />
        <span>{{ dataTransferToastMessage }}</span>
      </div>
    </div>
  </Transition>

  <div
    v-if="dataTransferBusy"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="w-full max-w-md rounded-2xl border border-white/15 bg-[#111827f2] p-4 shadow-2xl">
      <div class="flex items-center gap-3">
        <span
          class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-teal-300"
          aria-hidden="true"
        />
        <div>
          <p class="m-0 text-sm font-medium text-white">
            {{ dataTransferBusyLabel ?? 'Procesando datos...' }}
          </p>
          <p class="m-0 text-xs text-white/65">No cierres la pestaña hasta que termine.</p>
        </div>
      </div>
    </div>
  </div>
</template>
