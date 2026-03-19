'use strict';
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var vue_router_1 = require('vue-router');
var session_1 = require('@/domains/auth/session');
var router = (0, vue_router_1.useRouter)();
var hasToken = (0, vue_1.computed)(function () {
  return !!(0, session_1.getAccessToken)();
});
function logout() {
  (0, session_1.clearAuthTokens)();
  router.push('/login');
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.header,
  __VLS_intrinsics.header,
)(__assign({ class: 'app-header' }));
/** @type {__VLS_StyleScopedClasses['app-header']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'container ui-app-header-inner' }));
/** @type {__VLS_StyleScopedClasses['container']} */ /** @type {__VLS_StyleScopedClasses['ui-app-header-inner']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-app-header-title' }));
/** @type {__VLS_StyleScopedClasses['ui-app-header-title']} */ if (__VLS_ctx.hasToken) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-app-header-actions' }));
  /** @type {__VLS_StyleScopedClasses['ui-app-header-actions']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(__assign(__assign({ onClick: __VLS_ctx.logout }, { class: 'btn' }), { type: 'button' }));
  /** @type {__VLS_StyleScopedClasses['btn']} */
}
// @ts-ignore
[hasToken, logout];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
