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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var scoreVisuals_1 = require('@/domains/guide/scoreVisuals');
var ScoreGradeLabel_vue_1 = require('./ScoreGradeLabel.vue');
var props = withDefaults(defineProps(), {
  largeGrade: false,
  rowClass: '',
  trackClass: '',
  fillClass: '',
  gradeClass: '',
});
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
var fillStyle = (0, vue_1.computed)(function () {
  return {
    width: ''.concat(clamp(props.score, 0, 100), '%'),
    backgroundColor: (0, scoreVisuals_1.scoreColor)(props.score),
  };
});
var __VLS_defaults = {
  largeGrade: false,
  rowClass: '',
  trackClass: '',
  fillClass: '',
  gradeClass: '',
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-score-meter-row' }, { class: __VLS_ctx.rowClass }));
/** @type {__VLS_StyleScopedClasses['ui-score-meter-row']} */ var __VLS_0 =
  ScoreGradeLabel_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0(
    __assign(
      { score: __VLS_ctx.score, large: __VLS_ctx.largeGrade },
      { class: __VLS_ctx.gradeClass },
    ),
  ),
);
var __VLS_2 = __VLS_1.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { score: __VLS_ctx.score, large: __VLS_ctx.largeGrade },
        { class: __VLS_ctx.gradeClass },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_1),
    false,
  ),
);
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-score-meter-track' }, { class: __VLS_ctx.trackClass }));
/** @type {__VLS_StyleScopedClasses['ui-score-meter-track']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(
  __assign(__assign({ class: 'ui-score-meter-fill' }, { class: __VLS_ctx.fillClass }), {
    style: __VLS_ctx.fillStyle,
  }),
);
/** @type {__VLS_StyleScopedClasses['ui-score-meter-fill']} */ // @ts-ignore
[rowClass, score, largeGrade, gradeClass, trackClass, fillClass, fillStyle];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __defaults: __VLS_defaults,
  __typeProps: {},
});
exports.default = {};
