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
var auth_1 = require('@/domains/auth');
var _a = (0, auth_1.useLoginForm)(),
  username = _a.username,
  password = _a.password,
  error = _a.error,
  loading = _a.loading,
  sessionNotice = _a.sessionNotice,
  login = _a.login;
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-auth-page' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-page']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-auth-shell' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-shell']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-auth-card' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-card']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h1,
  __VLS_intrinsics.h1,
)(__assign({ class: 'ui-auth-title' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-title']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-auth-subtitle' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-subtitle']} */ if (__VLS_ctx.sessionNotice) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-status-line ui-auth-alert' }));
  /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ /** @type {__VLS_StyleScopedClasses['ui-auth-alert']} */ __VLS_ctx.sessionNotice;
}
if (__VLS_ctx.error) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'alert ui-auth-alert' }));
  /** @type {__VLS_StyleScopedClasses['alert']} */ /** @type {__VLS_StyleScopedClasses['ui-auth-alert']} */ __VLS_ctx.error;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.form,
  __VLS_intrinsics.form,
)(__assign({ onSubmit: __VLS_ctx.login }, { class: 'ui-auth-form' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-form']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-auth-field' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-auth-label' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)(__assign({ autocomplete: 'username' }, { class: 'input' }));
__VLS_ctx.username;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-auth-field' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-auth-label' }));
/** @type {__VLS_StyleScopedClasses['ui-auth-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)(__assign({ type: 'password', autocomplete: 'current-password' }, { class: 'input' }));
__VLS_ctx.password;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    { disabled: __VLS_ctx.loading, type: 'submit' },
    { class: 'btn btn-primary ui-auth-submit' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['ui-auth-submit']} */ __VLS_ctx.loading
  ? 'Entrando...'
  : 'Entrar';
// @ts-ignore
[sessionNotice, sessionNotice, error, error, login, username, password, loading, loading];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
