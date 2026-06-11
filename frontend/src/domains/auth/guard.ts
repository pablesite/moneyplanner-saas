import type { Router } from 'vue-router';
import axios from 'axios';
import { authApi } from '@/domains/auth/api';
import { clearAuthTokens, getAccessToken } from '@/domains/auth/session';

let authChecked = false;
let authCheckPromise: Promise<boolean> | null = null;
let currentRole: 'saas_admin' | 'saas_member' | null = null;
let validatedToken: string | null = null;

async function ensureAuthValid(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  if (validatedToken !== token) {
    authChecked = false;
    currentRole = null;
    validatedToken = token;
  }
  if (authChecked) return true;

  if (!authCheckPromise) {
    authCheckPromise = authApi
      .validateSession()
      .then((response) => {
        authChecked = true;
        currentRole = response.data?.role ?? null;
        validatedToken = token;
        return true;
      })
      .catch((error: unknown) => {
        authChecked = false;
        currentRole = null;
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
    const token = getAccessToken();

    if (!token && to.path !== '/login') {
      return { path: '/login' };
    }

    if (token) {
      const ok = await ensureAuthValid();
      if (!ok && to.path !== '/login') {
        return { path: '/login' };
      }
      if (ok && currentRole === 'saas_admin' && to.path !== '/account') {
        return { path: '/account' };
      }
      if (ok && to.path === '/login') {
        return { path: currentRole === 'saas_admin' ? '/account' : '/' };
      }
    }

    return true;
  });
}
