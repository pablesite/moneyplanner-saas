import type { Router } from 'vue-router';
import axios from 'axios';
import { authApi, type CurrentUser } from '@/domains/auth/api';
import { clearAuthTokens, getAccessToken } from '@/domains/auth/session';
import { restoreAuthSession } from '@/lib/api';

let authChecked = false;
let authCheckPromise: Promise<boolean> | null = null;
let currentRole: 'saas_admin' | 'saas_member' | null = null;
let mustChangePassword = false;
let validatedToken: string | null = null;

function requiredPasswordChangeRoute() {
  return {
    path: '/account',
    query: { reason: 'password_change_required' },
  };
}

export function updateAuthGuardSnapshot(user: Pick<CurrentUser, 'role' | 'must_change_password'>) {
  currentRole = user.role;
  mustChangePassword = user.must_change_password;
  validatedToken = getAccessToken();
  authChecked = true;
}

async function ensureAuthValid(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  if (validatedToken !== token) {
    authChecked = false;
    currentRole = null;
    mustChangePassword = false;
    validatedToken = token;
  }
  if (authChecked) return true;

  if (!authCheckPromise) {
    authCheckPromise = authApi
      .validateSession()
      .then((response) => {
        updateAuthGuardSnapshot(response.data);
        validatedToken = token;
        return true;
      })
      .catch((error: unknown) => {
        authChecked = false;
        currentRole = null;
        mustChangePassword = false;
        validatedToken = null;
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        if (status === 401 || status === 403) {
          clearAuthTokens();
          return false;
        }
        return true;
      })
      .finally(() => {
        authCheckPromise = null;
      });
  }

  return authCheckPromise ?? false;
}

export function registerAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    let token = getAccessToken();

    if (!token) {
      const restored = await restoreAuthSession();
      token = getAccessToken();
      if (!restored || !token) {
        return to.path === '/login' ? true : { path: '/login' };
      }
    }

    if (token) {
      const ok = await ensureAuthValid();
      if (!ok && to.path !== '/login') {
        return { path: '/login' };
      }
      if (ok && mustChangePassword && to.path !== '/account') {
        return requiredPasswordChangeRoute();
      }
      if (ok && currentRole === 'saas_admin' && to.path !== '/account') {
        return { path: '/account' };
      }
      if (ok && to.path === '/login') {
        if (mustChangePassword) {
          return requiredPasswordChangeRoute();
        }
        return { path: currentRole === 'saas_admin' ? '/account' : '/' };
      }
    }

    return true;
  });
}
