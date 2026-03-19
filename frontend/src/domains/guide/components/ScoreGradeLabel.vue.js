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
var scoreVisuals_1 = require('@/domains/guide/scoreVisuals');
var props = withDefaults(defineProps(), {
  large: false,
});
var colorStyle = (0, vue_1.computed)(function () {
  return {
    color: (0, scoreVisuals_1.scoreColor)(props.score),
  };
});
var grade = (0, vue_1.computed)(function () {
  return (0, scoreVisuals_1.gradeFromScore)(props.score);
});
var __VLS_defaults = {
  large: false,
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(
  __assign(
    __assign(
      { class: 'ui-score-grade-label' },
      { class: { 'ui-score-grade-label-lg': __VLS_ctx.large } },
    ),
    { style: __VLS_ctx.colorStyle },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-score-grade-label']} */ /** @type {__VLS_StyleScopedClasses['ui-score-grade-label-lg']} */ __VLS_ctx.grade;
// @ts-ignore
[large, colorStyle, grade];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __defaults: __VLS_defaults,
  __typeProps: {},
});
exports.default = {};
