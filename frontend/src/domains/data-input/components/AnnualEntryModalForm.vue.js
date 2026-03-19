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
var ui_1 = require('@/domains/ui');
var AmountPeriodCurrencyRow_vue_1 = require('./AmountPeriodCurrencyRow.vue');
var props = withDefaults(defineProps(), {
  loading: false,
  showOwnerField: false,
  showCashflowRoleField: true,
  showEventGroupField: true,
  showTermEndYearField: true,
  ownerOptions: function () {
    return [];
  },
  timeProfileFieldLabel: '',
  eventGroupPlaceholder: 'Grupo de evento (opcional, ej: vivienda_2026)',
  termEndYearPlaceholder: 'Ano fin compromiso (ej: 2027)',
  termEndMonthPlaceholder: 'Mes fin (1-12)',
  notesPlaceholder: 'Notas (opcional)',
  currencyOptions: function () {
    return ['EUR', 'USD'];
  },
  eventGroupOptions: function () {
    return [];
  },
  eventGroupDatalistId: 'annual-entry-event-groups',
});
var emit = defineEmits();
var __VLS_defaults = {
  loading: false,
  showOwnerField: false,
  showCashflowRoleField: true,
  showEventGroupField: true,
  showTermEndYearField: true,
  ownerOptions: function () {
    return [];
  },
  timeProfileFieldLabel: '',
  eventGroupPlaceholder: 'Grupo de evento (opcional, ej: vivienda_2026)',
  termEndYearPlaceholder: 'Ano fin compromiso (ej: 2027)',
  termEndMonthPlaceholder: 'Mes fin (1-12)',
  notesPlaceholder: 'Notas (opcional)',
  currencyOptions: function () {
    return ['EUR', 'USD'];
  },
  eventGroupOptions: function () {
    return [];
  },
  eventGroupDatalistId: 'annual-entry-event-groups',
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0(__assign({ onClose: {} }, { open: __VLS_ctx.open, title: __VLS_ctx.title })),
);
var __VLS_2 = __VLS_1.apply(
  void 0,
  __spreadArray(
    [__assign({ onClose: {} }, { open: __VLS_ctx.open, title: __VLS_ctx.title })],
    __VLS_functionalComponentArgsRest(__VLS_1),
    false,
  ),
);
var __VLS_5;
var __VLS_6 =
  ({ close: {} },
  {
    onClose: function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.emit('close');
      // @ts-ignore
      [open, title, emit];
    },
  });
var __VLS_7 = {};
var __VLS_8 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'grid gap-2.5 md:grid-cols-2' }));
/** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(
    __assign(
      {
        onChange: function () {
          var _a;
          var _b = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            _b[_i] = arguments[_i];
          }
          var $event = _b[0];
          __VLS_ctx.emit('patch', {
            category: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
          });
          // @ts-ignore
          [emit];
        },
      },
      { value: __VLS_ctx.form.category },
    ),
    { class: 'select ui-data-field' },
  ),
);
/** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
  var _i = 0, _a = __VLS_vFor(__VLS_ctx.categoryOptions);
  _i < _a.length;
  _i++
) {
  var category = _a[_i][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: category.value,
    value: category.value,
  });
  category.label;
  // @ts-ignore
  [form, categoryOptions];
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(
    __assign(
      {
        onChange: function () {
          var _a;
          var _b = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            _b[_i] = arguments[_i];
          }
          var $event = _b[0];
          __VLS_ctx.emit('patch', {
            subcategory: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
          });
          // @ts-ignore
          [emit];
        },
      },
      { value: __VLS_ctx.form.subcategory },
    ),
    { class: 'select ui-data-field' },
  ),
);
/** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
  var _b = 0, _c = __VLS_vFor(__VLS_ctx.subcategoryOptions);
  _b < _c.length;
  _b++
) {
  var subcategory = _c[_b][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: subcategory.value,
    value: subcategory.value,
  });
  subcategory.label;
  // @ts-ignore
  [form, subcategoryOptions];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(
    __assign(
      __assign(
        __assign(
          {
            onInput: function () {
              var _a;
              var _b = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _b[_i] = arguments[_i];
              }
              var $event = _b[0];
              __VLS_ctx.emit('patch', {
                name: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
              });
              // @ts-ignore
              [emit];
            },
          },
          { value: __VLS_ctx.form.name },
        ),
        { class: 'input ui-data-field' },
      ),
      { class: { 'md:col-span-2': !__VLS_ctx.showOwnerField } },
    ),
    { placeholder: __VLS_ctx.namePlaceholder },
  ),
);
/** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ if (
  __VLS_ctx.showOwnerField
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign(
        {
          onChange: function () {
            var _a;
            var _b = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _b[_i] = arguments[_i];
            }
            var $event = _b[0];
            if (!__VLS_ctx.showOwnerField) return;
            __VLS_ctx.emit('patch', {
              owner: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
            });
            // @ts-ignore
            [emit, form, showOwnerField, showOwnerField, namePlaceholder];
          },
        },
        { value: __VLS_ctx.form.owner },
      ),
      { class: 'select ui-data-field' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
  });
  for (var _d = 0, _e = __VLS_vFor(__VLS_ctx.ownerOptions); _d < _e.length; _d++) {
    var option = _e[_d][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.key,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [form, ownerOptions];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-item-form-field' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ if (__VLS_ctx.timeProfileFieldLabel) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.timeProfileFieldLabel;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(
    __assign(
      {
        onChange: function () {
          var _a;
          var _b = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            _b[_i] = arguments[_i];
          }
          var $event = _b[0];
          __VLS_ctx.emit('patch', {
            timeProfile: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
          });
          // @ts-ignore
          [emit, timeProfileFieldLabel, timeProfileFieldLabel];
        },
      },
      { value: __VLS_ctx.form.timeProfile },
    ),
    { class: 'select ui-data-field' },
  ),
);
/** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
  var _f = 0, _g = __VLS_vFor(__VLS_ctx.timeProfileOptions);
  _f < _g.length;
  _f++
) {
  var option = _g[_f][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: option.value,
    value: option.value,
  });
  option.label;
  // @ts-ignore
  [form, timeProfileOptions];
}
if (__VLS_ctx.showCashflowRoleField) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign(
        {
          onChange: function () {
            var _a;
            var _b = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _b[_i] = arguments[_i];
            }
            var $event = _b[0];
            if (!__VLS_ctx.showCashflowRoleField) return;
            __VLS_ctx.emit('patch', {
              cashflowRole: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
            });
            // @ts-ignore
            [emit, showCashflowRoleField];
          },
        },
        { value: __VLS_ctx.form.cashflowRole },
      ),
      { class: 'select ui-data-field' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _h = 0, _j = __VLS_vFor(__VLS_ctx.cashflowRoleOptions);
    _h < _j.length;
    _h++
  ) {
    var option = _j[_h][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [form, cashflowRoleOptions];
  }
}
if (__VLS_ctx.showEventGroupField) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        __assign(
          {
            onInput: function () {
              var _a;
              var _b = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _b[_i] = arguments[_i];
              }
              var $event = _b[0];
              if (!__VLS_ctx.showEventGroupField) return;
              __VLS_ctx.emit('patch', {
                eventGroup: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
              });
              // @ts-ignore
              [emit, showEventGroupField];
            },
          },
          { value: __VLS_ctx.form.eventGroup },
        ),
        { class: 'input ui-data-field' },
      ),
      {
        list: __VLS_ctx.eventGroupOptions.length ? __VLS_ctx.eventGroupDatalistId : undefined,
        placeholder: __VLS_ctx.eventGroupPlaceholder,
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showEventGroupField && __VLS_ctx.eventGroupOptions.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.datalist,
    __VLS_intrinsics.datalist,
  )({
    id: __VLS_ctx.eventGroupDatalistId,
  });
  for (var _k = 0, _l = __VLS_vFor(__VLS_ctx.eventGroupOptions); _k < _l.length; _k++) {
    var eventGroup = _l[_k][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: eventGroup,
      value: eventGroup,
    });
    eventGroup;
    // @ts-ignore
    [
      form,
      showEventGroupField,
      eventGroupOptions,
      eventGroupOptions,
      eventGroupOptions,
      eventGroupDatalistId,
      eventGroupDatalistId,
      eventGroupPlaceholder,
    ];
  }
}
if (__VLS_ctx.form.timeProfile === 'one_off') {
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        __assign(
          {
            onInput: function () {
              var _a;
              var _b = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _b[_i] = arguments[_i];
              }
              var $event = _b[0];
              if (!(__VLS_ctx.form.timeProfile === 'one_off')) return;
              __VLS_ctx.emit('patch', {
                targetMonth: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
              });
              // @ts-ignore
              [emit, form];
            },
          },
          { value: __VLS_ctx.form.targetMonth },
        ),
        { class: 'input ui-data-field' },
      ),
      { inputmode: 'numeric', placeholder: 'Mes objetivo (1-12)' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showTermEndYearField && __VLS_ctx.form.timeProfile === 'term_recurrent') {
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        __assign(
          {
            onInput: function () {
              var _a;
              var _b = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _b[_i] = arguments[_i];
              }
              var $event = _b[0];
              if (
                !(__VLS_ctx.showTermEndYearField && __VLS_ctx.form.timeProfile === 'term_recurrent')
              )
                return;
              __VLS_ctx.emit('patch', {
                termEndMonth: String(
                  (_a = $event.target.value) !== null && _a !== void 0 ? _a : '',
                ),
              });
              // @ts-ignore
              [emit, form, form, showTermEndYearField];
            },
          },
          { value: __VLS_ctx.form.termEndMonth },
        ),
        { class: 'input ui-data-field' },
      ),
      { inputmode: 'numeric', placeholder: __VLS_ctx.termEndMonthPlaceholder },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showTermEndYearField && __VLS_ctx.form.timeProfile === 'term_recurrent') {
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        __assign(
          {
            onInput: function () {
              var _a;
              var _b = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _b[_i] = arguments[_i];
              }
              var $event = _b[0];
              if (
                !(__VLS_ctx.showTermEndYearField && __VLS_ctx.form.timeProfile === 'term_recurrent')
              )
                return;
              __VLS_ctx.emit('patch', {
                termEndYear: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
              });
              // @ts-ignore
              [emit, form, form, showTermEndYearField, termEndMonthPlaceholder];
            },
          },
          { value: __VLS_ctx.form.termEndYear },
        ),
        { class: 'input ui-data-field' },
      ),
      { inputmode: 'numeric', placeholder: __VLS_ctx.termEndYearPlaceholder },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
var __VLS_9 = AmountPeriodCurrencyRow_vue_1.default;
// @ts-ignore
var __VLS_10 = __VLS_asFunctionalComponent1(
  __VLS_9,
  new __VLS_9(
    __assign(
      __assign(
        __assign(__assign({ 'onUpdate:amountValue': {} }, { 'onUpdate:period': {} }), {
          'onUpdate:currency': {},
        }),
        { class: 'md:col-span-2' },
      ),
      {
        amountValue: __VLS_ctx.form.amountAnnual,
        period: __VLS_ctx.form.amountInputPeriod,
        currency: __VLS_ctx.form.currency,
        placeholder: __VLS_ctx.amountPlaceholder,
        periodDisabled: __VLS_ctx.form.timeProfile === 'one_off',
        hidePeriodToggle: __VLS_ctx.form.timeProfile === 'one_off',
        currencyOptions: __VLS_ctx.currencyOptions,
      },
    ),
  ),
);
var __VLS_11 = __VLS_10.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        __assign(
          __assign(__assign({ 'onUpdate:amountValue': {} }, { 'onUpdate:period': {} }), {
            'onUpdate:currency': {},
          }),
          { class: 'md:col-span-2' },
        ),
        {
          amountValue: __VLS_ctx.form.amountAnnual,
          period: __VLS_ctx.form.amountInputPeriod,
          currency: __VLS_ctx.form.currency,
          placeholder: __VLS_ctx.amountPlaceholder,
          periodDisabled: __VLS_ctx.form.timeProfile === 'one_off',
          hidePeriodToggle: __VLS_ctx.form.timeProfile === 'one_off',
          currencyOptions: __VLS_ctx.currencyOptions,
        },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_10),
    false,
  ),
);
var __VLS_14;
var __VLS_15 =
  ({ 'update:amountValue': {} },
  {
    'onUpdate:amountValue': function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.emit('patch', { amountAnnual: $event });
      // @ts-ignore
      [
        emit,
        form,
        form,
        form,
        form,
        form,
        form,
        termEndYearPlaceholder,
        amountPlaceholder,
        currencyOptions,
      ];
    },
  });
var __VLS_16 =
  ({ 'update:period': {} },
  {
    'onUpdate:period': function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.emit('patch', { amountInputPeriod: $event });
      // @ts-ignore
      [emit];
    },
  });
var __VLS_17 =
  ({ 'update:currency': {} },
  {
    'onUpdate:currency': function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.emit('patch', { currency: $event });
      // @ts-ignore
      [emit];
    },
  });
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ var __VLS_12;
var __VLS_13;
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)(
  __assign(
    __assign(
      __assign(
        {
          onInput: function () {
            var _a;
            var _b = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _b[_i] = arguments[_i];
            }
            var $event = _b[0];
            __VLS_ctx.emit('patch', {
              notes: String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''),
            });
            // @ts-ignore
            [emit];
          },
        },
        { value: __VLS_ctx.form.notes },
      ),
      { class: 'textarea ui-data-field ui-notes-field md:col-span-2' },
    ),
    { rows: '2', placeholder: __VLS_ctx.notesPlaceholder },
  ),
);
/** @type {__VLS_StyleScopedClasses['textarea']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-notes-field']} */ /** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'actions md:col-span-2' }));
/** @type {__VLS_StyleScopedClasses['actions']} */ /** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.emit('close');
          // @ts-ignore
          [emit, form, notesPlaceholder];
        },
      },
      { class: 'btn btn-ghost' },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-ghost']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.emit('submit');
          // @ts-ignore
          [emit];
        },
      },
      { class: 'btn btn-primary' },
    ),
    { type: 'button', disabled: __VLS_ctx.loading },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_ctx.submitLabel;
// @ts-ignore
[loading, submitLabel];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeEmits: {},
  __defaults: __VLS_defaults,
  __typeProps: {},
});
exports.default = {};
