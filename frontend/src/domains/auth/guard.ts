import type { Router } from 'vue-router';
import { authApi } from '@/domains/auth/api';
import { getSaasMe } from '@/domains/auth/accountApi';
import { clearAuthTokens, getAccessToken } from '@/domains/auth/session';

let authChecked = false;
let authCheckPromise: Promise<boolean> | null = null;
let saasRole: string | null = null;
let saasRolePromise: Promise<string | null> | null = null;

async function ensureAuthValid(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  if (authChecked) return true;

  if (!authCheckPromise) {
    authCheckPromise = authApi
      .validateSession()
      .then(() => {
        authChecked = true;
        return true;
      })
      .catch(() => {
        clearAuthTokens();
        authChecked = false;
        return false;
      })
      .finally(() => {
        authCheckPromise = null;
      });
  }

  return authCheckPromise ?? false;
}

async function ensureSaasRole(): Promise<string | null> {
  if (saasRole) return saasRole;

  if (!saasRolePromise) {
    saasRolePromise = getSaasMe()
      .then((res) => {
        saasRole = res.data.role ?? null;
        return saasRole;
      })
      .catch(() => null)
      .finally(() => {
        saasRolePromise = null;
      });
  }

  return saasRolePromise;
}

export function registerAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const token = getAccessToken();

    if (!token && to.path !== '/login') {
      authChecked = false;
      saasRole = null;
      return { path: '/login' };
    }
    if (!token) {
      authChecked = false;
      saasRole = null;
    }

    if (token) {
      const ok = await ensureAuthValid();
      if (!ok && to.path !== '/login') {
        saasRole = null;
        return { path: '/login' };
      }
      if (ok && to.path === '/login') {
        return { path: '/' };
      }

      if (ok && to.meta.requiresSaasAdmin) {
        const role = await ensureSaasRole();
        if (role !== 'saas_admin') {
          return { path: '/account', query: { reason: 'permission_denied' } };
        }
      }
    }

    return true;
  });
}
