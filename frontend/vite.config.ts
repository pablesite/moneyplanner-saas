// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// })

import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// La PWA va detrás de un flag de build para poder desactivarla en el piloto sin
// revertir código. Activada por defecto; `VITE_PWA_ENABLED=false` la desactiva.
const pwaEnabled = process.env.VITE_PWA_ENABLED !== 'false';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // Con `disable` el módulo virtual `virtual:pwa-register/vue` sigue
      // resolviéndose (la app compila igual) pero no se genera ningún SW.
      disable: !pwaEnabled,
      registerType: 'prompt',
      // No autoinyectar el SW en `vite dev` (evita SW pegajosos en desarrollo).
      // La validación de la PWA se hace sobre `npm run build` + preview.
      devOptions: { enabled: false },
      includeAssets: ['icons/apple-touch-icon.png'],
      manifest: {
        name: 'The Arkenstone',
        short_name: 'Arkenstone',
        description: 'Planificación financiera personal.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        // Tokens Direction A (tema oscuro).
        theme_color: '#0c0d10',
        background_color: '#0c0d10',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache del shell estático del build (JS/CSS/HTML/iconos).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Fallback SPA del shell precacheado, pero NUNCA para `/api/*`:
        // las llamadas autenticadas deben ir siempre a red.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // Runtime caching SOLO de estáticos del propio origen (imágenes/iconos).
        // Prohibido cachear respuestas de API (fuga de datos multi-tenant).
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ark-static-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.spec.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/__tests__/**',
        'src/main.ts',
        // Legacy/bridge surfaces pending dedicated refactor phases
        'src/App.vue',
        'src/shell/AppShellLayout.vue',
        'src/domains/auth/api.ts',
        'src/domains/auth/guard.ts',
        'src/domains/auth/index.ts',
        'src/domains/auth/components/AppHeader.vue',
        'src/domains/pwa/index.ts',
        'src/domains/pwa/components/PwaUpdatePrompt.vue',
        'src/domains/ui/components/BaseModal.vue',
        'src/domains/people/components/OwnershipSplitEditor.vue',
        'src/domains/accounting/api.ts',
        'src/domains/accounting/composables.ts',
        'src/domains/accounting/store.ts',
        'src/domains/accounting/components/*.vue',
        'src/domains/budget/components/*.vue',
        'src/domains/capabilities/index.ts',
        'src/domains/data-input/portableBundle.ts',
        'src/domains/data-input/annualExpenseStore.ts',
        'src/domains/data-input/annualIncomeStore.ts',
        'src/domains/guide/composables.ts',
        'src/domains/aux-data/composables.ts',
        'src/domains/net-worth/composables.ts',
        'src/domains/net-worth/extensions.ts',
        'src/domains/net-worth/store.ts',
        'src/domains/net-worth/useNetWorthTimelineLayout.ts',
        'src/domains/net-worth/useNetWorthPositionActivity.ts',
        'src/domains/net-worth/components/ItemForm.vue',
        'src/domains/net-worth/components/ItemList.vue',
        'src/domains/net-worth/components/NetWorthHeroSection.vue',
        'src/domains/net-worth/components/NetWorthCategoryWorkspace.vue',
        'src/domains/people/composables.ts',
        'src/lib/api.ts',
        'src/shell/useAppShell.ts',
        'src/views/AuxDataView.vue',
        'src/views/GuidePhaseDetailView.vue',
        'src/views/NetWorthView.vue',
        'src/views/AccountingMovementsView.vue',
        'src/views/BudgetDashboardView.vue',
        'src/views/budget/useBudgetDashboardPage.ts',
        'src/views/data-input/useDataInputPage.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Prefer TS/Vue sources over colocated transpiled JS artifacts in src/
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json'],
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
