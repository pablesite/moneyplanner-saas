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
var _a, _b;
Object.defineProperty(exports, '__esModule', { value: true });
var props = defineProps();
function fmtPercent(p) {
  var n = Number(String(p).replace(',', '.'));
  if (Number.isNaN(n)) return p;
  return (
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(
      n,
    ) + '%'
  );
}
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (props.kind === 'individual') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-inline-offset-sm' }));
  /** @type {__VLS_StyleScopedClasses['ui-inline-offset-sm']} */ (
    _b = (_a = props.member) === null || _a === void 0 ? void 0 : _a.name
  ) !== null && _b !== void 0
    ? _b
    : '-';
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-inline-offset-sm' }));
  /** @type {__VLS_StyleScopedClasses['ui-inline-offset-sm']} */ for (
    var _i = 0, _c = __VLS_vFor(props.splits);
    _i < _c.length;
    _i++
  ) {
    var _d = _c[_i],
      s = _d[0],
      i = _d[1];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({
      key: s.member.id,
    });
    s.member.name;
    __VLS_ctx.fmtPercent(s.percent);
    if (i < props.splits.length - 1) {
      __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [fmtPercent];
  }
}
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeProps: {},
});
exports.default = {};
