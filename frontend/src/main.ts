// import { createApp } from 'vue'

// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from 'vue';
import './styles/fonts.css';
import './styles/tailwind.css';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';
import './styles/design-system.css';
import './styles/app.css';
import './styles/budget-annual-entries.css';

createApp(App).use(createPinia()).use(router).mount('#app');
