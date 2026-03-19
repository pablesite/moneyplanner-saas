"use strict";
// import { createApp } from 'vue'
Object.defineProperty(exports, "__esModule", { value: true });
// import App from './App.vue'
// createApp(App).mount('#app')
var vue_1 = require("vue");
require("./styles/tailwind.css");
var pinia_1 = require("pinia");
var router_1 = require("./router");
var App_vue_1 = require("./App.vue");
require("./styles/app.css");
require("./styles/guide-score.css");
require("./styles/guide-home.css");
require("./styles/data-input.css");
(0, vue_1.createApp)(App_vue_1.default).use((0, pinia_1.createPinia)()).use(router_1.router).mount('#app');
