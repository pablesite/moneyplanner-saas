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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-row" }));
/** @type {__VLS_StyleScopedClasses['nw-item-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-main" }));
/** @type {__VLS_StyleScopedClasses['nw-item-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-name" }));
/** @type {__VLS_StyleScopedClasses['nw-item-name']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "item-name-text" }));
/** @type {__VLS_StyleScopedClasses['item-name-text']} */ ;
(__VLS_ctx.item.name);
if (!__VLS_ctx.item.is_active) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
    /** @type {__VLS_StyleScopedClasses['badge']} */ ;
}
if (__VLS_ctx.ownershipLabel) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
    /** @type {__VLS_StyleScopedClasses['badge']} */ ;
    (__VLS_ctx.ownershipLabel);
}
if (__VLS_ctx.sharePercent && __VLS_ctx.sharePercent < 100) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
    /** @type {__VLS_StyleScopedClasses['badge']} */ ;
    (__VLS_ctx.sharePercent);
}
if (__VLS_ctx.isLiabilitiesList && __VLS_ctx.financedAssetName) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-submeta" }));
    /** @type {__VLS_StyleScopedClasses['nw-item-submeta']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.financedAssetName);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-amount" }));
/** @type {__VLS_StyleScopedClasses['nw-item-amount']} */ ;
(__VLS_ctx.formattedAmount);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-actions" }));
/** @type {__VLS_StyleScopedClasses['nw-item-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('edit', __VLS_ctx.item.id);
        // @ts-ignore
        [item, item, item, ownershipLabel, ownershipLabel, sharePercent, sharePercent, sharePercent, isLiabilitiesList, financedAssetName, financedAssetName, formattedAmount, emit,];
    } }, { class: "icon-btn" }), { title: "Editar", 'aria-label': "Editar" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('archive', __VLS_ctx.item.id);
        // @ts-ignore
        [item, emit,];
    } }, { class: "icon-btn" }), { title: "Archivar", 'aria-label': "Archivar" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('delete', __VLS_ctx.item.id);
        // @ts-ignore
        [item, emit,];
    } }, { class: "icon-btn" }), { title: "Eliminar", 'aria-label': "Eliminar" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
