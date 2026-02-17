import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authApi } from '@/domains/auth/api';
import {
  createSaasAdminUser,
  listSaasAdminUsers,
  patchSaasAdminUserRole,
  patchSaasAdminUserStatus,
  type SaasAdminUser,
  type SaasRole,
} from '@/domains/auth/adminApi';
import {
  deleteCoreLink,
  getAuthMode,
  getSaasMe,
  getSaasSubscription,
  upsertCoreLink,
} from '@/domains/auth/accountApi';
import { setAccessToken, setRefreshToken } from '@/domains/auth/session';
import { toApiErrorMessage } from '@/lib/errors';

export function useLoginForm() {
  const router = useRouter();
  const route = useRoute();
  const username = ref('');
  const password = ref('');
  const error = ref<string | null>(null);
  const loading = ref(false);
  const sessionNotice = ref<string | null>(null);

  if (route.query.reason === 'session_expired') {
    sessionNotice.value = 'Tu sesion expiro. Inicia sesion nuevamente.';
  }

  async function login() {
    loading.value = true;
    error.value = null;
    try {
      const res = await authApi.login({ username: username.value, password: password.value });

      setAccessToken(res.data.access);
      if (res.data.refresh) setRefreshToken(res.data.refresh);

      await router.push('/');
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      loading.value = false;
    }
  }

  return {
    username,
    password,
    error,
    loading,
    sessionNotice,
    login,
  };
}

export function useSaasAccountPage() {
  const router = useRouter();

  const loading = ref(true);
  const saving = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const username = ref('');
  const email = ref('');
  const role = ref<'saas_admin' | 'saas_member'>('saas_member');
  const subscriptionStatus = ref('');
  const premiumEnabled = ref(false);
  const accountLinkingEnabled = ref(false);

  const linkedCoreUserRef = ref<string | null>(null);
  const linkedCoreUsername = ref<string | null>(null);
  const linkedCoreEmail = ref<string | null>(null);

  const coreUserRef = ref('');
  const coreUsername = ref('');
  const coreEmail = ref('');

  async function load() {
    loading.value = true;
    error.value = null;

    try {
      const [modeRes, meRes, subRes] = await Promise.all([
        getAuthMode(),
        getSaasMe(),
        getSaasSubscription(),
      ]);

      accountLinkingEnabled.value = !!modeRes.data.account_linking_enabled;

      username.value = meRes.data.username;
      email.value = meRes.data.email;
      role.value = meRes.data.role;
      subscriptionStatus.value = meRes.data.subscription_status || subRes.data.status;
      premiumEnabled.value = !!meRes.data.premium_enabled;

      linkedCoreUserRef.value = meRes.data.account_link?.core_user_ref ?? null;
      linkedCoreUsername.value = meRes.data.account_link?.core_username ?? null;
      linkedCoreEmail.value = meRes.data.account_link?.core_email ?? null;

      coreUserRef.value = linkedCoreUserRef.value ?? '';
      coreUsername.value = linkedCoreUsername.value ?? '';
      coreEmail.value = linkedCoreEmail.value ?? '';
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      loading.value = false;
    }
  }

  async function saveCoreLink() {
    if (!accountLinkingEnabled.value) return;
    saving.value = true;
    error.value = null;
    success.value = null;

    try {
      await upsertCoreLink({
        core_user_ref: coreUserRef.value,
        core_username: coreUsername.value,
        core_email: coreEmail.value,
      });
      success.value = 'Cuenta core vinculada correctamente.';
      await load();
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      saving.value = false;
    }
  }

  async function removeCoreLink() {
    if (!accountLinkingEnabled.value) return;
    saving.value = true;
    error.value = null;
    success.value = null;

    try {
      await deleteCoreLink();
      success.value = 'Vinculo con core eliminado.';
      await load();
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      saving.value = false;
    }
  }

  function goBack() {
    router.push('/');
  }

  load();

  return {
    loading,
    saving,
    error,
    success,
    username,
    email,
    role,
    subscriptionStatus,
    premiumEnabled,
    accountLinkingEnabled,
    linkedCoreUserRef,
    linkedCoreUsername,
    linkedCoreEmail,
    coreUserRef,
    coreUsername,
    coreEmail,
    saveCoreLink,
    removeCoreLink,
    goBack,
    reload: load,
  };
}

export function useSaasAdminUsersPage() {
  const router = useRouter();

  const loading = ref(true);
  const saving = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const users = ref<SaasAdminUser[]>([]);

  const createUsername = ref('');
  const createPassword = ref('');
  const createEmail = ref('');
  const createRole = ref<SaasRole>('saas_member');
  const createIsActive = ref(true);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      const response = await listSaasAdminUsers();
      users.value = response.data;
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      loading.value = false;
    }
  }

  async function createUser() {
    saving.value = true;
    error.value = null;
    success.value = null;
    try {
      await createSaasAdminUser({
        username: createUsername.value,
        password: createPassword.value,
        email: createEmail.value,
        role: createRole.value,
        is_active: createIsActive.value,
      });
      success.value = 'Usuario creado correctamente.';
      createUsername.value = '';
      createPassword.value = '';
      createEmail.value = '';
      createRole.value = 'saas_member';
      createIsActive.value = true;
      await load();
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      saving.value = false;
    }
  }

  async function updateRole(userId: number, role: SaasRole) {
    saving.value = true;
    error.value = null;
    success.value = null;
    try {
      await patchSaasAdminUserRole(userId, role);
      success.value = 'Rol actualizado.';
      await load();
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      saving.value = false;
    }
  }

  async function toggleStatus(user: SaasAdminUser) {
    saving.value = true;
    error.value = null;
    success.value = null;
    try {
      await patchSaasAdminUserStatus(user.id, !user.is_active);
      success.value = user.is_active ? 'Usuario desactivado.' : 'Usuario activado.';
      await load();
    } catch (e: unknown) {
      error.value = toApiErrorMessage(e);
    } finally {
      saving.value = false;
    }
  }

  function goBack() {
    router.push('/account');
  }

  load();

  return {
    loading,
    saving,
    error,
    success,
    users,
    createUsername,
    createPassword,
    createEmail,
    createRole,
    createIsActive,
    createUser,
    updateRole,
    toggleStatus,
    goBack,
    reload: load,
  };
}
