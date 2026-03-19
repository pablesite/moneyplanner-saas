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
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
var __VLS_props = defineProps();
var draft = defineModel('draft', { required: true });
var emit = defineEmits();
var __VLS_modelEmit;
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'form-grid nw-edit-grid' }));
/** @type {__VLS_StyleScopedClasses['form-grid']} */ /** @type {__VLS_StyleScopedClasses['nw-edit-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)(__assign({ class: 'input' }));
__VLS_ctx.draft.name;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(__assign({ value: __VLS_ctx.draft.category }, { class: 'select' }));
/** @type {__VLS_StyleScopedClasses['select']} */ for (
  var _i = 0, _b = __VLS_vFor(__VLS_ctx.categories);
  _i < _b.length;
  _i++
) {
  var c = _b[_i][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: c.value,
    value: c.value,
  });
  c.label;
  // @ts-ignore
  [draft, draft, categories];
}
if (__VLS_ctx.subcategories) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.draft.subcategory }, { class: 'select' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ for (
    var _c = 0,
      _d = __VLS_vFor(
        __VLS_ctx.subcategories.filter(function (sc) {
          return sc.category === __VLS_ctx.draft.category;
        }),
      );
    _c < _d.length;
    _c++
  ) {
    var s = _d[_c][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: s.value,
      value: s.value,
    });
    s.label;
    // @ts-ignore
    [draft, draft, subcategories, subcategories];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(__assign({ value: __VLS_ctx.draft.currency }, { class: 'select' }));
/** @type {__VLS_StyleScopedClasses['select']} */ for (
  var _e = 0, _f = __VLS_vFor(__VLS_ctx.currencies);
  _e < _f.length;
  _e++
) {
  var c = _f[_e][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: c.value,
    value: c.value,
  });
  c.label;
  // @ts-ignore
  [draft, currencies];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign({ inputmode: 'decimal' }, { class: 'input' }),
);
__VLS_ctx.draft.amount;
/** @type {__VLS_StyleScopedClasses['input']} */ if (
  (_a = __VLS_ctx.ownershipOptions) === null || _a === void 0 ? void 0 : _a.length
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.draft.ownership_id }, { class: 'select' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ for (
    var _g = 0, _h = __VLS_vFor(__VLS_ctx.ownershipOptions);
    _g < _h.length;
    _g++
  ) {
    var o = _h[_g][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: String(o.value),
      value: o.value,
    });
    o.label;
    // @ts-ignore
    [draft, draft, ownershipOptions, ownershipOptions];
  }
}
if (__VLS_ctx.showFinancedAsset) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.draft.financed_asset_id }, { class: 'select' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ for (
    var _j = 0, _k = __VLS_vFor(__VLS_ctx.financedAssetOptions);
    _j < _k.length;
    _j++
  ) {
    var a = _k[_j][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: String(a.value),
      value: a.value,
    });
    a.label;
    // @ts-ignore
    [draft, showFinancedAsset, financedAssetOptions];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.textarea,
  __VLS_intrinsics.textarea,
)(__assign({ value: __VLS_ctx.draft.notes, rows: '2' }, { class: 'textarea' }));
/** @type {__VLS_StyleScopedClasses['textarea']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'checkbox-row' }));
/** @type {__VLS_StyleScopedClasses['checkbox-row']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)({
  type: 'checkbox',
});
__VLS_ctx.draft.is_active;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-form-help' }));
/** @type {__VLS_StyleScopedClasses['ui-form-help']} */ __VLS_ctx.amountHint;
if (__VLS_ctx.amountError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.amountError;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-form-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-form-actions']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.emit('save');
          // @ts-ignore
          [draft, draft, amountHint, amountError, amountError, emit];
        },
      },
      { class: 'btn btn-primary ui-form-action-btn' },
    ),
    { disabled: !!__VLS_ctx.amountError },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    {
      onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('cancel');
        // @ts-ignore
        [amountError, emit];
      },
    },
    { class: 'btn ui-form-action-btn' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */ // @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeEmits: {},
  __typeProps: {},
});
exports.default = {};
