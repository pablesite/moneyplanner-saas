import axios from 'axios';
import { clearAuthTokens, getAccessToken, setAccessToken } from '@/domains/auth/session';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001';
const coreBaseURL = import.meta.env.VITE_CORE_API_BASE_URL ?? 'http://localhost:8000';

export const api = axios.create({ baseURL, withCredentials: true });
export const coreApi = axios.create({ baseURL: coreBaseURL, withCredentials: true });
const refreshClient = axios.create({ baseURL, withCredentials: true });

type PendingCallback = (token: string | null) => void;
let isRefreshing = false;
let pending: PendingCallback[] = [];

function logAuthDebug(event: string, context: Record<string, unknown>) {
  if (typeof console === 'undefined') return;
  console.warn(`[auth] ${event}`, context);
}

function redirectToLoginWithSessionExpiredReason() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login?reason=session_expired';
  }
}

function notifyPending(token: string | null) {
  pending.forEach((cb) => cb(token));
  pending = [];
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await refreshClient.post('/api/auth/refresh/');
    const access = res.data?.access;
    if (access) {
      setAccessToken(access);
      return access;
    }
    logAuthDebug('refresh_missing_access', {
      url: '/api/auth/refresh/',
    });
    return null;
  } catch (error) {
    const status = (error as { response?: { status?: number } } | undefined)?.response?.status;
    logAuthDebug('refresh_failed', {
      url: '/api/auth/refresh/',
      status: status ?? null,
    });
    return null;
  }
}

export async function restoreAuthSession(): Promise<boolean> {
  if (getAccessToken()) return true;
  return (await refreshAccessToken()) !== null;
}

export async function logoutAuthSession(): Promise<void> {
  try {
    await api.post('/api/auth/logout/');
  } finally {
    clearAuthTokens();
  }
}

function installAuthInterceptors(client: typeof api) {
  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (r) => r,
    async (error) => {
      const status = error.response?.status;
      const original = error.config || {};
      const requestUrl = String(original.url ?? '');
      const isRefreshCall = requestUrl.includes('/api/auth/refresh/');
      const isTokenCall = requestUrl.includes('/api/auth/token/');

      if (status !== 401 || isRefreshCall || isTokenCall || original._retry) {
        return Promise.reject(error);
      }

      logAuthDebug('request_401', {
        source: 'core',
        url: requestUrl,
        method: String(original.method ?? 'get').toUpperCase(),
      });

      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (!newToken) {
          logAuthDebug('logout_refresh_failed', {
            source: 'core',
            url: requestUrl,
          });
          clearAuthTokens();
          notifyPending(null);
          redirectToLoginWithSessionExpiredReason();
          return Promise.reject(error);
        }

        notifyPending(newToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      }

      return new Promise((resolve, reject) => {
        pending.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${token}`;
          resolve(client(original));
        });
      });
    },
  );
}

installAuthInterceptors(api);
installAuthInterceptors(coreApi);
