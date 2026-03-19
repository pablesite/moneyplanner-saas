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
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-header" }));
/** @type {__VLS_StyleScopedClasses['nw-subcat-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-title" }));
/** @type {__VLS_StyleScopedClasses['nw-subcat-title']} */ ;
(__VLS_ctx.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total" }));
/** @type {__VLS_StyleScopedClasses['nw-subcat-total']} */ ;
if (__VLS_ctx.showBaseTotal && __VLS_ctx.baseLabel) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total-primary" }));
    /** @type {__VLS_StyleScopedClasses['nw-subcat-total-primary']} */ ;
    (__VLS_ctx.baseLabel);
    if (__VLS_ctx.percent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-subcat-percent" }));
        /** @type {__VLS_StyleScopedClasses['nw-subcat-percent']} */ ;
        (__VLS_ctx.percent);
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: (__VLS_ctx.showBaseTotal && __VLS_ctx.baseLabel ? 'nw-subcat-total-details' : 'nw-subcat-total-primary') }));
(__VLS_ctx.totalsLine);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-actions-spacer" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['nw-subcat-actions-spacer']} */ ;
// @ts-ignore
[label, showBaseTotal, showBaseTotal, baseLabel, baseLabel, baseLabel, percent, percent, totalsLine,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
