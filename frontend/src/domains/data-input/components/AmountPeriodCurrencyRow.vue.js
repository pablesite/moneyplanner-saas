"use strict";
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var props = withDefaults(defineProps(), {
    periodDisabled: false,
    hidePeriodToggle: false,
    currencyOptions: function () { return ['EUR', 'USD']; },
});
var emit = defineEmits();
var __VLS_defaults = {
    periodDisabled: false,
    hidePeriodToggle: false,
    currencyOptions: function () { return ['EUR', 'USD']; },
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-amount-period-row" }));
/** @type {__VLS_StyleScopedClasses['ui-amount-period-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign(__assign({ onInput: function () {
        var _a;
        var _b = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _b[_i] = arguments[_i];
        }
        var $event = _b[0];
        __VLS_ctx.emit('update:amountValue', String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''));
        // @ts-ignore
        [emit,];
    } }, { value: (__VLS_ctx.amountValue) }), { class: "input ui-data-field" }), { inputmode: "decimal", placeholder: (__VLS_ctx.placeholder) }));
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
if (!__VLS_ctx.hidePeriodToggle) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-amount-period-toggle-wrap" }));
    /** @type {__VLS_StyleScopedClasses['ui-amount-period-toggle-wrap']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.hidePeriodToggle))
                return;
            __VLS_ctx.emit('update:period', __VLS_ctx.period === 'monthly' ? 'annual' : 'monthly');
            // @ts-ignore
            [emit, amountValue, placeholder, hidePeriodToggle, period,];
        } }, { type: "button" }), { class: "ui-amount-period-toggle" }), { class: (__VLS_ctx.period === 'monthly' ? 'ui-amount-period-toggle-on' : 'ui-amount-period-toggle-off') }), { disabled: (__VLS_ctx.periodDisabled), 'aria-pressed': (__VLS_ctx.period === 'monthly'), title: (__VLS_ctx.period === 'monthly' ? 'Mensual' : 'Anual') }));
    /** @type {__VLS_StyleScopedClasses['ui-amount-period-toggle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-amount-period-toggle-thumb" }, { class: (__VLS_ctx.period === 'monthly'
            ? 'ui-amount-period-toggle-thumb-on'
            : 'ui-amount-period-toggle-thumb-off') }));
    /** @type {__VLS_StyleScopedClasses['ui-amount-period-toggle-thumb']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-amount-period-toggle-label" }, { class: ({ 'ui-amount-period-toggle-label-active': __VLS_ctx.period === 'monthly' }) }));
    /** @type {__VLS_StyleScopedClasses['ui-amount-period-toggle-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-amount-period-toggle-label-active']} */ ;
    (__VLS_ctx.period === 'monthly' ? 'Mensual' : 'Anual');
}
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ onChange: function () {
        var _a;
        var _b = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _b[_i] = arguments[_i];
        }
        var $event = _b[0];
        __VLS_ctx.emit('update:currency', String((_a = $event.target.value) !== null && _a !== void 0 ? _a : ''));
        // @ts-ignore
        [emit, period, period, period, period, period, period, periodDisabled,];
    } }, { value: (__VLS_ctx.currency) }), { class: "select ui-data-field" }));
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.currencyOptions)); _i < _a.length; _i++) {
    var option = _a[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (option),
        value: (option),
    });
    (option);
    // @ts-ignore
    [currency, currencyOptions,];
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
exports.default = {};
