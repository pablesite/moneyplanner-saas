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
var vue_1 = require("vue");
var props = withDefaults(defineProps(), {
    showRefresh: true,
    showSnapshot: true,
    iconOnly: false,
});
var emit = defineEmits();
var open = (0, vue_1.ref)(false);
var rootEl = (0, vue_1.ref)(null);
function toggle() {
    open.value = !open.value;
}
function close() {
    open.value = false;
}
function onDocClick(e) {
    if (!open.value)
        return;
    var t = e.target;
    if (!t)
        return;
    if (rootEl.value && !rootEl.value.contains(t))
        close();
}
function onKeydown(e) {
    if (!open.value)
        return;
    if (e.key === 'Escape')
        close();
}
(0, vue_1.onMounted)(function () {
    document.addEventListener('click', onDocClick);
    window.addEventListener('keydown', onKeydown);
});
(0, vue_1.onBeforeUnmount)(function () {
    document.removeEventListener('click', onDocClick);
    window.removeEventListener('keydown', onKeydown);
});
function onSelectBaseCurrency(e) {
    var v = e.target.value;
    emit('update:baseCurrency', v);
}
function onSelectMode(e) {
    var v = e.target.value;
    emit('update:valueMode', v);
}
function onSelectInflationRegion(e) {
    var v = e.target.value;
    emit('update:inflationRegion', v);
}
var __VLS_defaults = {
    showRefresh: true,
    showSnapshot: true,
    iconOnly: false,
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ ref: "rootEl" }, { class: "nw-settings-root" }));
/** @type {__VLS_StyleScopedClasses['nw-settings-root']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: (__VLS_ctx.toggle) }, { class: "btn" }), { class: ({ 'nw-settings-icon-only': __VLS_ctx.iconOnly }) }), { type: "button", disabled: (__VLS_ctx.loading), 'aria-label': "Ajustes" }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-settings-icon-only']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-settings-btn-icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['nw-settings-btn-icon']} */ ;
if (!__VLS_ctx.iconOnly) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
if (__VLS_ctx.open) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-panel" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-title" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-block" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-block']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-field" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-label" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ onChange: (__VLS_ctx.onSelectBaseCurrency) }, { class: "input nw-settings-select-currency" }), { value: (__VLS_ctx.baseCurrency), disabled: (__VLS_ctx.loading) }));
    /** @type {__VLS_StyleScopedClasses['input']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-settings-select-currency']} */ ;
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.currencies)); _i < _a.length; _i++) {
        var c = _a[_i][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (c.value),
            value: (c.value),
        });
        (c.label);
        // @ts-ignore
        [toggle, iconOnly, iconOnly, loading, loading, open, onSelectBaseCurrency, baseCurrency, currencies,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-hint" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-hint']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-block" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-block']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-field" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-label" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ onChange: (__VLS_ctx.onSelectMode) }, { class: "input nw-settings-select-mode" }), { value: (__VLS_ctx.valueMode), disabled: (__VLS_ctx.loading) }));
    /** @type {__VLS_StyleScopedClasses['input']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-settings-select-mode']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "nominal",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "real",
        disabled: (!__VLS_ctx.canShowReal),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-hint" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-hint']} */ ;
    (__VLS_ctx.modeHelp);
    if (__VLS_ctx.valueMode === 'real' && __VLS_ctx.realBaseLabel) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.realBaseLabel);
    }
    if (!__VLS_ctx.canShowReal) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-hint nw-settings-hint-error" }));
        /** @type {__VLS_StyleScopedClasses['nw-settings-hint']} */ ;
        /** @type {__VLS_StyleScopedClasses['nw-settings-hint-error']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-block" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-block']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-field" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-label" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ onChange: (__VLS_ctx.onSelectInflationRegion) }, { class: "input nw-settings-select-mode" }), { value: (__VLS_ctx.inflationRegion), disabled: (__VLS_ctx.loading || __VLS_ctx.baseCurrency !== 'EUR') }));
    /** @type {__VLS_StyleScopedClasses['input']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-settings-select-mode']} */ ;
    for (var _b = 0, _c = __VLS_vFor((__VLS_ctx.inflationRegions)); _b < _c.length; _b++) {
        var region = _c[_b][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (region.code),
            value: (region.code),
        });
        (region.label);
        // @ts-ignore
        [loading, loading, baseCurrency, onSelectMode, valueMode, valueMode, canShowReal, canShowReal, modeHelp, realBaseLabel, realBaseLabel, onSelectInflationRegion, inflationRegion, inflationRegions,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-hint" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-hint']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-settings-block nw-settings-actions" }));
    /** @type {__VLS_StyleScopedClasses['nw-settings-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-settings-actions']} */ ;
    if (__VLS_ctx.showSnapshot) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.open))
                    return;
                if (!(__VLS_ctx.showSnapshot))
                    return;
                __VLS_ctx.emit('snapshot');
                // @ts-ignore
                [showSnapshot, emit,];
            } }, { class: "btn btn-primary" }), { type: "button", disabled: (__VLS_ctx.loading) }));
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    }
    if (__VLS_ctx.showRefresh) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.open))
                    return;
                if (!(__VLS_ctx.showRefresh))
                    return;
                __VLS_ctx.emit('refresh');
                // @ts-ignore
                [loading, emit, showRefresh,];
            } }, { class: "btn" }), { type: "button", disabled: (__VLS_ctx.loading) }));
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.close) }, { class: "btn nw-settings-close" }), { type: "button" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-settings-close']} */ ;
}
// @ts-ignore
[loading, close,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
exports.default = {};
