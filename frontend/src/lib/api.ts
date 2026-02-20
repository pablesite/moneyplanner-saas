import axios from 'axios';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '@/lib/authSession';

function getFallbackBaseURL() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8001';
  }
  return `${window.location.protocol}//${window.location.hostname}:8001`;
}

function getFallbackCoreBaseURL() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }
  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || getFallbackBaseURL();
const coreBaseURL = import.meta.env.VITE_CORE_API_BASE_URL || getFallbackCoreBaseURL();

export const api = axios.create({ baseURL });
export const coreApi = axios.create({ baseURL: coreBaseURL });
const refreshClient = axios.create({ baseURL });

type PendingCallback = (token: string | null) => void;
let isRefreshing = false;
let pending: PendingCallback[] = [];

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
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await refreshClient.post('/api/auth/refresh/', { refresh });
    const access = res.data?.access;
    if (access) {
      setAccessToken(access);
      return access;
    }
    return null;
  } catch {
    return null;
  }
}

function attachRequestInterceptor(client: typeof api) {
  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

attachRequestInterceptor(api);
attachRequestInterceptor(coreApi);

function attachResponseInterceptor(client: typeof api) {
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

      const refresh = getRefreshToken();
      if (!refresh) {
        clearAuthTokens();
        redirectToLoginWithSessionExpiredReason();
        return Promise.reject(error);
      }

      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (!newToken) {
          clearAuthTokens();
          notifyPending(null);
          redirectToLoginWithSessionExpiredReason();
          return Promise.reject(error);
        }

        notifyPending(newToken);
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

attachResponseInterceptor(api);
attachResponseInterceptor(coreApi);
