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
var __VLS_props = defineProps();
var emit = defineEmits();
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-header" }));
/** @type {__VLS_StyleScopedClasses['nw-cat-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-left" }));
/** @type {__VLS_StyleScopedClasses['nw-cat-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-base" }));
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
(__VLS_ctx.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
(__VLS_ctx.count);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-right" }));
/** @type {__VLS_StyleScopedClasses['nw-cat-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total" }));
/** @type {__VLS_StyleScopedClasses['nw-cat-total']} */ ;
if (__VLS_ctx.showBaseTotal && __VLS_ctx.baseLabel) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total-primary" }));
    /** @type {__VLS_StyleScopedClasses['nw-cat-total-primary']} */ ;
    (__VLS_ctx.baseLabel);
    if (__VLS_ctx.percent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-cat-percent" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-percent']} */ ;
        (__VLS_ctx.percent);
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: (__VLS_ctx.showBaseTotal && __VLS_ctx.baseLabel ? 'nw-cat-total-details' : 'nw-cat-total-primary') }));
(__VLS_ctx.totalsLine);
if (!__VLS_ctx.showBaseTotal && __VLS_ctx.percent) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-cat-percent" }));
    /** @type {__VLS_StyleScopedClasses['nw-cat-percent']} */ ;
    (__VLS_ctx.percent);
}
if (__VLS_ctx.showToggle) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showToggle))
                return;
            __VLS_ctx.emit('toggle');
            // @ts-ignore
            [label, count, showBaseTotal, showBaseTotal, showBaseTotal, baseLabel, baseLabel, baseLabel, percent, percent, percent, percent, totalsLine, showToggle, emit,];
        } }, { class: "icon-btn nw-cat-toggle" }), { type: "button", 'aria-label': (__VLS_ctx.expanded ? 'Ocultar desglose' : 'Mostrar desglose'), title: (__VLS_ctx.expanded ? 'Ocultar desglose' : 'Mostrar desglose') }));
    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['nw-cat-toggle']} */ ;
    if (__VLS_ctx.expanded) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
        /** @type {__VLS_StyleScopedClasses['icon']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
        /** @type {__VLS_StyleScopedClasses['icon']} */ ;
    }
}
// @ts-ignore
[expanded, expanded, expanded,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
