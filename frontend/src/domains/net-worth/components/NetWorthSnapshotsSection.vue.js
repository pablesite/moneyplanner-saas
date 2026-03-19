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
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'section card ui-pro-panel' }));
/** @type {__VLS_StyleScopedClasses['section']} */ /** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h2,
  __VLS_intrinsics.h2,
)(__assign({ class: 'mt-0 text-base' }));
/** @type {__VLS_StyleScopedClasses['mt-0']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ if (
  __VLS_ctx.snapshots.length
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.ul,
    __VLS_intrinsics.ul,
  )(__assign({ class: 'm-0 grid list-none gap-2 pl-0' }));
  /** @type {__VLS_StyleScopedClasses['m-0']} */ /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['list-none']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['pl-0']} */ var _loop_1 =
    function (snapshot) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.li,
        __VLS_intrinsics.li,
      )(__assign({ key: snapshot.id }, { class: 'ui-nw-snapshot-row' }));
      /** @type {__VLS_StyleScopedClasses['ui-nw-snapshot-row']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'min-w-0' }));
      /** @type {__VLS_StyleScopedClasses['min-w-0']} */ snapshot.snapshot_date;
      __VLS_ctx.formatMoney(snapshot.net_worth, 2);
      __VLS_ctx.displayCurrencyUnit(snapshot.base_currency);
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'subtle' }));
      /** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_ctx.formatMoney(
        snapshot.total_assets,
        2,
      );
      __VLS_ctx.displayCurrencyUnit(snapshot.base_currency);
      __VLS_ctx.formatMoney(snapshot.total_liabilities, 2);
      __VLS_ctx.displayCurrencyUnit(snapshot.base_currency);
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button,
      )(
        __assign(
          __assign(
            {
              onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!__VLS_ctx.snapshots.length) return;
                __VLS_ctx.confirmDeleteSnapshot(snapshot.id);
                // @ts-ignore
                [
                  snapshots,
                  snapshots,
                  formatMoney,
                  formatMoney,
                  formatMoney,
                  displayCurrencyUnit,
                  displayCurrencyUnit,
                  displayCurrencyUnit,
                  confirmDeleteSnapshot,
                ];
              },
            },
            { class: 'icon-btn disabled:cursor-not-allowed disabled:opacity-50' },
          ),
          {
            type: 'button',
            disabled: __VLS_ctx.loading,
            'aria-label': 'Eliminar snapshot',
            title: 'Eliminar snapshot',
          },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['icon-btn']} */ /** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ /** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
      /** @type {__VLS_StyleScopedClasses['icon']} */ // @ts-ignore
      [loading];
    };
  for (var _i = 0, _a = __VLS_vFor(__VLS_ctx.snapshots); _i < _a.length; _i++) {
    var snapshot = _a[_i][0];
    _loop_1(snapshot);
  }
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */
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
