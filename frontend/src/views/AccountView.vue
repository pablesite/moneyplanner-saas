<script setup lang="ts">
import { computed, onMounted, reactive, ref, type ComponentPublicInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/domains/admin/styles/admin.css';
import AdminUserCreateModal from '@/domains/admin/components/AdminUserCreateModal.vue';
import AdminUserDeleteDialog from '@/domains/admin/components/AdminUserDeleteDialog.vue';
import AdminUserDetailSheet from '@/domains/admin/components/AdminUserDetailSheet.vue';
import AdminUsersSection from '@/domains/admin/components/AdminUsersSection.vue';
import { roleLabel, useAdminUsersPage } from '@/domains/admin/useAdminUsersPage';
import { authApi, toAuthErrorMessage, type CurrentUser } from '@/domains/auth';
import { usePortableDataTransfer } from '@/domains/portable-data';
import {
  AButton,
  AMetaPill,
  APageHead,
  ASectHead,
  ASelect,
  AState,
  AToast,
  type ASelectItem,
} from '@/domains/ui';
import { updateAuthGuardSnapshot } from '@/domains/auth/guard';
import { setAccessToken } from '@/domains/auth/session';
import { coreApi } from '@/lib/api';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref<string | null>(null);
const currentUser = ref<CurrentUser | null>(null);
const baseCurrency = ref<string>('');
const inflationRegion = ref('ES');
const coreAccountError = ref<string | null>(null);
const baseCurrencySaveBusy = ref(false);
const baseCurrencySaveMessage = ref<string | null>(null);
const passwordChangeBusy = ref(false);
const passwordChangeError = ref<string | null>(null);
const passwordChangeSuccess = ref<string | null>(null);

const adminPage = useAdminUsersPage();

const passwordChangeForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
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
  clearDataTransferToast,
  triggerImportDialog,
  exportDataBundle,
  importDataFromFile,
} = usePortableDataTransfer({
  externalBusy: loading,
  onImportCompleted: load,
});

const permissionNotice = computed(() =>
  route.query.reason === 'permission_denied'
    ? 'No tienes permisos para acceder a esa sección.'
    : null,
);
const passwordChangeNotice = computed(() =>
  route.query.reason === 'password_change_required'
    ? 'Debes cambiar tu contraseña temporal antes de continuar.'
    : null,
);

const isAdmin = computed(() => currentUser.value?.role === 'saas_admin');
const isMember = computed(() => currentUser.value?.role === 'saas_member');
const mustChangePassword = computed(() => currentUser.value?.must_change_password === true);
const baseCurrencySelectOptions: ASelectItem[] = ['EUR', 'USD'].map((currency) => ({
  value: currency,
  label: currency,
}));

// Un solo toast para las confirmaciones de la página: antes había cuatro
// anclados al mismo punto, así que dos éxitos simultáneos se solapaban.
const feedbackMessage = computed(
  () => adminPage.successMessage ?? baseCurrencySaveMessage.value ?? passwordChangeSuccess.value,
);

function clearFeedback(): void {
  adminPage.successMessage = null;
  baseCurrencySaveMessage.value = null;
  passwordChangeSuccess.value = null;
}

function subscriptionLabel(status: CurrentUser['subscription_status']): string {
  if (status === 'active') return 'Activa';
  if (status === 'past_due') return 'Pendiente';
  if (status === 'canceled') return 'Cancelada';
  return 'Trial';
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
  if (!isAdmin.value) {
    adminPage.reset();
    return;
  }
  await adminPage.load();
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await authApi.validateSession();
    currentUser.value = res.data ?? null;
    if (currentUser.value) {
      updateAuthGuardSnapshot(currentUser.value);
    }
    if (mustChangePassword.value) {
      return;
    }
    await Promise.all([loadCoreAccountSummary(), loadAdminUsers()]);
  } catch (e: unknown) {
    error.value = toAuthErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

function resetPasswordChangeForm(): void {
  passwordChangeForm.current_password = '';
  passwordChangeForm.new_password = '';
  passwordChangeForm.confirm_password = '';
}

async function changePassword(): Promise<void> {
  passwordChangeBusy.value = true;
  passwordChangeError.value = null;
  passwordChangeSuccess.value = null;

  if (passwordChangeForm.new_password !== passwordChangeForm.confirm_password) {
    passwordChangeError.value = 'La confirmación de la nueva contraseña no coincide.';
    passwordChangeBusy.value = false;
    return;
  }

  try {
    const wasRequired = mustChangePassword.value;
    const response = await authApi.changePassword({
      current_password: passwordChangeForm.current_password,
      new_password: passwordChangeForm.new_password,
    });
    setAccessToken(response.data.access);
    currentUser.value = response.data;
    updateAuthGuardSnapshot(response.data);
    resetPasswordChangeForm();
    passwordChangeSuccess.value = wasRequired
      ? 'Contraseña actualizada. Ya puedes usar la aplicación con normalidad.'
      : 'Contraseña actualizada.';
    if (route.query.reason === 'password_change_required') {
      await router.replace({ path: '/account' });
    }
    await Promise.all([loadCoreAccountSummary(), loadAdminUsers()]);
  } catch (e: unknown) {
    passwordChangeError.value = toAuthErrorMessage(e);
  } finally {
    passwordChangeBusy.value = false;
  }
}

onMounted(load);

const setImportFileInputRef = (el: Element | ComponentPublicInstance | null): void => {
  importFileInputRef.value = el as HTMLInputElement | null;
};
</script>

<template>
  <div class="page a-adm-page">
    <APageHead :title="isAdmin ? 'Admin SaaS' : 'Perfil'">
      <template v-if="currentUser" #meta>
        <AMetaPill>{{ currentUser.username }}</AMetaPill>
        <AMetaPill>{{ roleLabel(currentUser.role) }}</AMetaPill>
      </template>
    </APageHead>

    <AToast :open="Boolean(feedbackMessage)" @close="clearFeedback">
      {{ feedbackMessage }}
    </AToast>
    <AToast
      :open="Boolean(dataTransferToastMessage)"
      :tone="dataTransferToastKind"
      :duration="5000"
      @close="clearDataTransferToast"
    >
      {{ dataTransferToastMessage }}
    </AToast>

    <AState v-if="error" status="error">{{ error }}</AState>
    <AState v-if="permissionNotice" status="error">{{ permissionNotice }}</AState>
    <AState v-if="passwordChangeNotice" status="neutral">{{ passwordChangeNotice }}</AState>

    <AState v-if="loading" status="loading">Cargando cuenta…</AState>

    <template v-else-if="currentUser">
      <!-- Para el admin, gestionar usuarios es la tarea de la pantalla: va
           primero y la seguridad de su propia cuenta queda debajo. -->
      <template v-if="isAdmin && !mustChangePassword">
        <AdminUsersSection :page="adminPage" />
      </template>

      <section v-if="!isAdmin" class="sect">
        <ASectHead
          title="Mi cuenta"
          subtitle="Tus datos de acceso y la moneda con la que lees tus totales."
        />

        <AState v-if="coreAccountError" status="error" layout="inline">
          {{ coreAccountError }}
        </AState>

        <dl class="a-adm-facts">
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Usuario</dt>
            <dd class="a-adm-fact-value">{{ currentUser.username }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Email</dt>
            <dd class="a-adm-fact-value">{{ currentUser.email || 'sin configurar' }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Suscripción</dt>
            <dd class="a-adm-fact-value">
              {{ subscriptionLabel(currentUser.subscription_status) }}
            </dd>
          </div>
          <div class="a-adm-fact a-adm-fact-control">
            <dt class="a-adm-fact-label">Moneda base</dt>
            <dd class="a-adm-fact-value">
              <ASelect
                class="select"
                :model-value="baseCurrency"
                :options="baseCurrencySelectOptions"
                :disabled="baseCurrencySaveBusy || mustChangePassword"
                :searchable="false"
                aria-label="Moneda base"
                @update:model-value="(v) => (baseCurrency = String(v))"
              />
              <AButton
                size="sm"
                :loading="baseCurrencySaveBusy"
                :disabled="baseCurrencySaveBusy || mustChangePassword"
                @click="saveBaseCurrency"
              >
                Guardar
              </AButton>
            </dd>
          </div>
        </dl>
      </section>

      <section class="sect">
        <ASectHead title="Seguridad">
          <template #subtitle>
            {{
              mustChangePassword
                ? 'Estás usando una contraseña temporal. Define una nueva antes de seguir.'
                : 'Puedes actualizar tu contraseña cuando quieras.'
            }}
          </template>
        </ASectHead>

        <AState v-if="passwordChangeError" status="error" layout="inline">
          {{ passwordChangeError }}
        </AState>

        <form class="a-adm-password-form" @submit.prevent="changePassword">
          <label class="a-adm-field">
            <span class="a-adm-field-label">Contraseña actual</span>
            <input
              v-model="passwordChangeForm.current_password"
              type="password"
              autocomplete="current-password"
              class="input"
            />
          </label>
          <label class="a-adm-field">
            <span class="a-adm-field-label">Nueva contraseña</span>
            <input
              v-model="passwordChangeForm.new_password"
              type="password"
              autocomplete="new-password"
              class="input"
            />
          </label>
          <label class="a-adm-field">
            <span class="a-adm-field-label">Confirmar nueva contraseña</span>
            <input
              v-model="passwordChangeForm.confirm_password"
              type="password"
              autocomplete="new-password"
              class="input"
            />
          </label>
          <div class="a-adm-password-actions">
            <AButton
              variant="primary"
              type="submit"
              :loading="passwordChangeBusy"
              :disabled="
                passwordChangeBusy ||
                !passwordChangeForm.current_password ||
                !passwordChangeForm.new_password ||
                !passwordChangeForm.confirm_password
              "
            >
              Cambiar contraseña
            </AButton>
          </div>
        </form>
      </section>

      <section v-if="!isAdmin" class="sect">
        <ASectHead
          title="Tus datos"
          subtitle="Exporta, importa o reemplaza tus datos para mover tu entorno entre instancias."
        />

        <AState v-if="dataTransferError" status="error" layout="inline">
          {{ dataTransferError }}
        </AState>

        <div class="a-adm-data-actions">
          <AButton variant="primary" :disabled="dataTransferUiBusy" @click="exportDataBundle">
            Exportar datos
          </AButton>
          <AButton :disabled="dataTransferUiBusy" @click="triggerImportDialog('append')">
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

        <p v-if="dataTransferStatus" class="a-adm-note">{{ dataTransferStatus }}</p>
      </section>
    </template>

    <div
      v-if="dataTransferBusy"
      class="a-adm-busy"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="a-adm-busy-panel">
        <span class="ui-import-spinner" aria-hidden="true" />
        <div class="a-adm-busy-copy">
          <p class="a-adm-busy-title">{{ dataTransferBusyLabel ?? 'Procesando datos…' }}</p>
          <p class="a-adm-busy-hint">No cierres la pestaña hasta que termine.</p>
        </div>
      </div>
    </div>
  </div>

  <AdminUserCreateModal :page="adminPage" />
  <AdminUserDetailSheet :page="adminPage" />
  <AdminUserDeleteDialog :page="adminPage" />
</template>
