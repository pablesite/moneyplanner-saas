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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_worth_1 = require("@/domains/net-worth");
var ui_1 = require("@/domains/ui");
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showAssetModal), title: "Nuevo activo" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showAssetModal), title: "Nuevo activo" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ close: {} },
    { onClose: (__VLS_ctx.onCloseAssetModal) });
var __VLS_7 = __VLS_3.slots.default;
var __VLS_8;
/** @ts-ignore @type {typeof __VLS_components.ItemForm} */
net_worth_1.ItemForm;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign(__assign({ title: "Nuevo activo", categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories), initial: (__VLS_ctx.assetCreateInitial) }, (__VLS_ctx.itemFormProps)), { allowNegative: (true), onSubmit: (__VLS_ctx.submitAssetFromView), onCancel: (__VLS_ctx.onCloseAssetModal) })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign(__assign({ title: "Nuevo activo", categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories), initial: (__VLS_ctx.assetCreateInitial) }, (__VLS_ctx.itemFormProps)), { allowNegative: (true), onSubmit: (__VLS_ctx.submitAssetFromView), onCancel: (__VLS_ctx.onCloseAssetModal) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
// @ts-ignore
[showAssetModal, onCloseAssetModal, onCloseAssetModal, assetCategories, assetSubcategories, assetCreateInitial, itemFormProps, submitAssetFromView,];
var __VLS_3;
var __VLS_4;
var __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showLiabilityModal), title: "Nuevo pasivo" })));
var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showLiabilityModal), title: "Nuevo pasivo" })], __VLS_functionalComponentArgsRest(__VLS_14), false));
var __VLS_18;
var __VLS_19 = ({ close: {} },
    { onClose: (__VLS_ctx.onCloseLiabilityModal) });
var __VLS_20 = __VLS_16.slots.default;
var __VLS_21;
/** @ts-ignore @type {typeof __VLS_components.ItemForm} */
net_worth_1.ItemForm;
// @ts-ignore
var __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21(__assign(__assign({ title: "Nuevo pasivo", categories: (__VLS_ctx.liabilityCategories), initial: (__VLS_ctx.liabilityCreateInitial) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.activeAssets), showFinancedAsset: (true), onSubmit: (__VLS_ctx.submitLiabilityFromView), onCancel: (__VLS_ctx.onCloseLiabilityModal) })));
var __VLS_23 = __VLS_22.apply(void 0, __spreadArray([__assign(__assign({ title: "Nuevo pasivo", categories: (__VLS_ctx.liabilityCategories), initial: (__VLS_ctx.liabilityCreateInitial) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.activeAssets), showFinancedAsset: (true), onSubmit: (__VLS_ctx.submitLiabilityFromView), onCancel: (__VLS_ctx.onCloseLiabilityModal) })], __VLS_functionalComponentArgsRest(__VLS_22), false));
// @ts-ignore
[itemFormProps, showLiabilityModal, onCloseLiabilityModal, onCloseLiabilityModal, liabilityCategories, liabilityCreateInitial, activeAssets, submitLiabilityFromView,];
var __VLS_16;
var __VLS_17;
var __VLS_26;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showEditModal), title: (__VLS_ctx.editTitle) })));
var __VLS_28 = __VLS_27.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showEditModal), title: (__VLS_ctx.editTitle) })], __VLS_functionalComponentArgsRest(__VLS_27), false));
var __VLS_31;
var __VLS_32 = ({ close: {} },
    { onClose: (__VLS_ctx.closeEdit) });
var __VLS_33 = __VLS_29.slots.default;
if (__VLS_ctx.editInitial) {
    var __VLS_34 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.ItemForm} */
    net_worth_1.ItemForm;
    // @ts-ignore
    var __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34(__assign(__assign({ title: (__VLS_ctx.editTitle), categories: (__VLS_ctx.editCategories), subcategories: (__VLS_ctx.editKind === 'asset' ? __VLS_ctx.assetSubcategories : undefined) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.editKind === 'liability' ? __VLS_ctx.activeAssets : []), showFinancedAsset: (__VLS_ctx.editKind === 'liability'), allowNegative: (__VLS_ctx.editKind === 'asset'), mode: "edit", initial: (__VLS_ctx.editInitial), onSubmit: (__VLS_ctx.submitEdit), onCancel: (__VLS_ctx.closeEdit) })));
    var __VLS_36 = __VLS_35.apply(void 0, __spreadArray([__assign(__assign({ title: (__VLS_ctx.editTitle), categories: (__VLS_ctx.editCategories), subcategories: (__VLS_ctx.editKind === 'asset' ? __VLS_ctx.assetSubcategories : undefined) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.editKind === 'liability' ? __VLS_ctx.activeAssets : []), showFinancedAsset: (__VLS_ctx.editKind === 'liability'), allowNegative: (__VLS_ctx.editKind === 'asset'), mode: "edit", initial: (__VLS_ctx.editInitial), onSubmit: (__VLS_ctx.submitEdit), onCancel: (__VLS_ctx.closeEdit) })], __VLS_functionalComponentArgsRest(__VLS_35), false));
}
// @ts-ignore
[assetSubcategories, itemFormProps, activeAssets, showEditModal, editTitle, editTitle, closeEdit, closeEdit, editInitial, editInitial, editCategories, editKind, editKind, editKind, editKind, submitEdit,];
var __VLS_29;
var __VLS_30;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
