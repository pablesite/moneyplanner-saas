<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { AButton } from '@/domains/ui';

// Banner proactivo para reducir la fricción de instalación:
// - Android/escritorio (Chrome/Edge): captura `beforeinstallprompt` y ofrece el
//   prompt nativo desde un botón propio.
// - iOS Safari: no existe evento programático, así que mostramos la mini-guía
//   "Compartir → Añadir a pantalla de inicio".
// No aparece si la app ya está instalada (standalone) o si se descartó hace poco.

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'ark-pwa-install-dismissed-at';
const DISMISS_DAYS = 30;

const visible = ref(false);
const mode = ref<'prompt' | 'ios'>('prompt');
let deferred: BeforeInstallPromptEvent | null = null;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

const recentlyDismissed = () => {
  try {
    const at = window.localStorage.getItem(DISMISS_KEY);
    if (!at) return false;
    return Date.now() - Number(at) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const remember = () => {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // localStorage no disponible (modo privado, etc.): degradar sin romper.
  }
};

const isIosSafari = () => {
  const ua = window.navigator.userAgent || '';
  const iOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const safari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
  return iOS && safari;
};

const onBeforeInstallPrompt = (event: Event) => {
  event.preventDefault();
  deferred = event as BeforeInstallPromptEvent;
  if (!isStandalone() && !recentlyDismissed()) {
    mode.value = 'prompt';
    visible.value = true;
  }
};

const onAppInstalled = () => {
  visible.value = false;
  deferred = null;
  remember();
};

const install = async () => {
  if (!deferred) return;
  await deferred.prompt();
  await deferred.userChoice;
  deferred = null;
  visible.value = false;
  remember();
};

const dismiss = () => {
  visible.value = false;
  remember();
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.addEventListener('appinstalled', onAppInstalled);
  // iOS no dispara `beforeinstallprompt`: se decide en el montaje.
  if (!isStandalone() && !recentlyDismissed() && isIosSafari()) {
    mode.value = 'ios';
    visible.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  window.removeEventListener('appinstalled', onAppInstalled);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="visible"
      class="dir-a fixed inset-x-0 bottom-4 z-[90] mx-auto flex w-[min(92vw,460px)] items-start gap-3 rounded-xl border border-[var(--line-strong)] bg-[var(--bg)]/95 px-4 py-3 text-sm text-[var(--text)] shadow-2xl backdrop-blur"
      role="dialog"
      aria-label="Instalar The Arkenstone"
    >
      <span
        class="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)]"
        aria-hidden="true"
      />

      <div v-if="mode === 'prompt'" class="flex flex-1 flex-col gap-2">
        <span
          >Instala <strong>The Arkenstone</strong> en tu dispositivo para abrirla como una
          app.</span
        >
        <div class="flex items-center gap-2">
          <AButton variant="primary" size="sm" @click="install">Instalar</AButton>
          <AButton variant="ghost" size="sm" @click="dismiss">Ahora no</AButton>
        </div>
      </div>

      <div v-else class="flex flex-1 flex-col gap-2">
        <span class="inline-flex flex-wrap items-center gap-1">
          Para instalar: pulsa
          <svg
            class="inline-block h-4 w-4 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V4" />
            <path d="M8 8l4-4 4 4" />
            <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
          <span
            ><strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>.</span
          >
        </span>
        <div>
          <AButton variant="ghost" size="sm" @click="dismiss">Entendido</AButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
