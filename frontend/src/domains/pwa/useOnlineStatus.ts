import { onBeforeUnmount, onMounted, readonly, ref } from 'vue';

/**
 * Estado de conectividad del navegador (eventos `online`/`offline`).
 *
 * `navigator.onLine` es indicativo, no garantiza conectividad real, así que el
 * consumidor debe tratarlo como una pista (mostrar un aviso) y no bloquear
 * acciones solo por este flag.
 */
export function useOnlineStatus() {
  const online = ref(typeof navigator === 'undefined' ? true : navigator.onLine);

  const setOnline = () => {
    online.value = true;
  };
  const setOffline = () => {
    online.value = false;
  };

  onMounted(() => {
    online.value = navigator.onLine;
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('online', setOnline);
    window.removeEventListener('offline', setOffline);
  });

  return { online: readonly(online) };
}
