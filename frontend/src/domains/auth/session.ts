import { computed, ref } from 'vue';

const accessToken = ref<string | null>(null);

// Remove tokens persisted by versions prior to the HttpOnly refresh-cookie migration.
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

export const hasAccessToken = computed(() => !!accessToken.value);

export function getAccessToken() {
  return accessToken.value;
}

export function setAccessToken(token: string) {
  accessToken.value = token;
}

export function clearAuthTokens() {
  accessToken.value = null;
}
