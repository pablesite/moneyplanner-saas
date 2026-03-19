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
var vue_router_1 = require('vue-router');
var people_1 = require('@/domains/people');
var router = (0, vue_router_1.useRouter)();
var tab = (0, vue_1.ref)('members');
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'container ui-pro-page' }));
/** @type {__VLS_StyleScopedClasses['container']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-page-header' }));
/** @type {__VLS_StyleScopedClasses['ui-page-header']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h1,
  __VLS_intrinsics.h1,
)(__assign({ class: 'h1 ui-page-title' }));
/** @type {__VLS_StyleScopedClasses['h1']} */ /** @type {__VLS_StyleScopedClasses['ui-page-title']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-page-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-page-actions']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.router.push('/account');
          // @ts-ignore
          [router];
        },
      },
      { class: 'btn' },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.router.push('/patrimonio');
          // @ts-ignore
          [router];
        },
      },
      { class: 'btn' },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'card ui-pro-panel mt-1' }));
/** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'mb-3.5 flex gap-2.5' }));
/** @type {__VLS_StyleScopedClasses['mb-3.5']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    __assign(
      __assign(
        {
          onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.tab = 'members';
            // @ts-ignore
            [tab];
          },
        },
        { class: 'btn opacity-60' },
      ),
      { type: 'button' },
    ),
    { class: { '!opacity-100': __VLS_ctx.tab === 'members' } },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['opacity-60']} */ /** @type {__VLS_StyleScopedClasses['!opacity-100']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    __assign(
      __assign(
        {
          onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.tab = 'ownerships';
            // @ts-ignore
            [tab, tab];
          },
        },
        { class: 'btn opacity-60' },
      ),
      { type: 'button' },
    ),
    { class: { '!opacity-100': __VLS_ctx.tab === 'ownerships' } },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['opacity-60']} */ /** @type {__VLS_StyleScopedClasses['!opacity-100']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'grid gap-3.5' }));
/** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['gap-3.5']} */ if (
  __VLS_ctx.tab === 'members'
) {
  var __VLS_0 = void 0;
  /** @ts-ignore @type {typeof __VLS_components.FamilyMemberManager} */
  people_1.FamilyMemberManager;
  // @ts-ignore
  var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
  var __VLS_2 = __VLS_1.apply(
    void 0,
    __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false),
  );
} else {
  var __VLS_5 = void 0;
  /** @ts-ignore @type {typeof __VLS_components.OwnershipManager} */
  people_1.OwnershipManager;
  // @ts-ignore
  var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
  var __VLS_7 = __VLS_6.apply(
    void 0,
    __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_6), false),
  );
}
// @ts-ignore
[tab, tab];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
