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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var aux_data_1 = require("@/domains/aux-data");
var people_1 = require("@/domains/people");
var _g = (0, aux_data_1.useAuxDataPage)(), loading = _g.loading, error = _g.error, fxRates = _g.fxRates, inflation = _g.inflation, fxStates = _g.fxStates, inflationStates = _g.inflationStates, supportedInflationRegions = _g.supportedInflationRegions, formatInflationIndex = _g.formatInflationIndex, formatFxRate = _g.formatFxRate;
var regionLabelMap = (0, vue_1.computed)(function () { return new Map(supportedInflationRegions.value.map(function (region) { return [region.code, region.label]; })); });
var sections = (0, vue_1.reactive)({
    family: true,
    ipc: true,
    fx: true,
});
var familyTab = (0, vue_1.ref)('members');
function toggleSection(section) {
    sections[section] = !sections[section];
}
function formatTimestamp(value) {
    if (!value)
        return '-';
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('es-ES');
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container ui-pro-page" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "h1 ui-settings-page-title" }));
/** @type {__VLS_StyleScopedClasses['h1']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-settings-page-title']} */ ;
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.error);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-settings-accordion-item" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-settings-accordion-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.toggleSection('family');
        // @ts-ignore
        [error, error, toggleSection,];
    } }, { class: "ui-settings-toggle" }), { type: "button", 'aria-expanded': (__VLS_ctx.sections.family) }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-title" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-icon']} */ ;
(__VLS_ctx.sections.family ? '-' : '+');
if (__VLS_ctx.sections.family) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-settings-content" }));
    /** @type {__VLS_StyleScopedClasses['ui-settings-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-settings-family-tabs" }));
    /** @type {__VLS_StyleScopedClasses['ui-settings-family-tabs']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.sections.family))
                return;
            __VLS_ctx.familyTab = 'members';
            // @ts-ignore
            [sections, sections, sections, familyTab,];
        } }, { class: "btn opacity-60" }), { type: "button" }), { class: ({ '!opacity-100': __VLS_ctx.familyTab === 'members' }) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
    /** @type {__VLS_StyleScopedClasses['!opacity-100']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.sections.family))
                return;
            __VLS_ctx.familyTab = 'ownerships';
            // @ts-ignore
            [familyTab, familyTab,];
        } }, { class: "btn opacity-60" }), { type: "button" }), { class: ({ '!opacity-100': __VLS_ctx.familyTab === 'ownerships' }) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
    /** @type {__VLS_StyleScopedClasses['!opacity-100']} */ ;
    if (__VLS_ctx.familyTab === 'members') {
        var __VLS_0 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.FamilyMemberManager} */
        people_1.FamilyMemberManager;
        // @ts-ignore
        var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
        var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false));
    }
    else {
        var __VLS_5 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.OwnershipManager} */
        people_1.OwnershipManager;
        // @ts-ignore
        var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
        var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_6), false));
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-settings-accordion-item" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-settings-accordion-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.toggleSection('ipc');
        // @ts-ignore
        [toggleSection, familyTab, familyTab,];
    } }, { class: "ui-settings-toggle" }), { type: "button", 'aria-expanded': (__VLS_ctx.sections.ipc) }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-title" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-icon']} */ ;
(__VLS_ctx.sections.ipc ? '-' : '+');
if (__VLS_ctx.sections.ipc) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-settings-content" }));
    /** @type {__VLS_StyleScopedClasses['ui-settings-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-data-status-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-data-status-grid']} */ ;
    for (var _i = 0, _h = __VLS_vFor((__VLS_ctx.inflationStates)); _i < _h.length; _i++) {
        var state = _h[_i][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (state.scope) }, { class: "ui-data-status-card" }));
        /** @type {__VLS_StyleScopedClasses['ui-data-status-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-data-status-card-head" }));
        /** @type {__VLS_StyleScopedClasses['ui-data-status-card-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        ((_a = __VLS_ctx.regionLabelMap.get(state.scope)) !== null && _a !== void 0 ? _a : state.scope);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (state.scope);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        ((_b = state.required_start_date) !== null && _b !== void 0 ? _b : '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        ((_c = state.covered_until) !== null && _c !== void 0 ? _c : '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.formatTimestamp(state.last_success_at));
        if (state.last_error) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-form-help ui-form-help-error" }));
            /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ ;
            (state.last_error);
        }
        // @ts-ignore
        [sections, sections, sections, inflationStates, regionLabelMap, formatTimestamp,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)(__assign({ class: "ui-data-table" }));
    /** @type {__VLS_StyleScopedClasses['ui-data-table']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (var _j = 0, _k = __VLS_vFor((__VLS_ctx.inflation)); _j < _k.length; _j++) {
        var r = _k[_j][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (r.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (r.period);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        ((_d = __VLS_ctx.regionLabelMap.get(r.region)) !== null && _d !== void 0 ? _d : r.region);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (__VLS_ctx.formatInflationIndex(r.index));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (r.last_synced_at ? __VLS_ctx.formatTimestamp(r.last_synced_at) : '-');
        // @ts-ignore
        [regionLabelMap, formatTimestamp, inflation, formatInflationIndex,];
    }
    if (!__VLS_ctx.inflation.length && !__VLS_ctx.loading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)(__assign({ colspan: "4" }, { class: "ui-table-empty" }));
        /** @type {__VLS_StyleScopedClasses['ui-table-empty']} */ ;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-settings-accordion-item" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-settings-accordion-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.toggleSection('fx');
        // @ts-ignore
        [toggleSection, inflation, loading,];
    } }, { class: "ui-settings-toggle" }), { type: "button", 'aria-expanded': (__VLS_ctx.sections.fx) }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-title" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-settings-toggle-icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['ui-settings-toggle-icon']} */ ;
(__VLS_ctx.sections.fx ? '-' : '+');
if (__VLS_ctx.sections.fx) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-settings-content" }));
    /** @type {__VLS_StyleScopedClasses['ui-settings-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-data-status-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-data-status-grid']} */ ;
    for (var _l = 0, _m = __VLS_vFor((__VLS_ctx.fxStates)); _l < _m.length; _l++) {
        var state = _m[_l][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (state.scope) }, { class: "ui-data-status-card" }));
        /** @type {__VLS_StyleScopedClasses['ui-data-status-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-data-status-card-head" }));
        /** @type {__VLS_StyleScopedClasses['ui-data-status-card-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (state.scope);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        ((_e = state.required_start_date) !== null && _e !== void 0 ? _e : '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        ((_f = state.covered_until) !== null && _f !== void 0 ? _f : '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.formatTimestamp(state.last_success_at));
        if (state.last_error) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-form-help ui-form-help-error" }));
            /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ ;
            (state.last_error);
        }
        // @ts-ignore
        [sections, sections, sections, formatTimestamp, fxStates,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.table, __VLS_intrinsics.table)(__assign({ class: "ui-data-table" }));
    /** @type {__VLS_StyleScopedClasses['ui-data-table']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.thead, __VLS_intrinsics.thead)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.tbody, __VLS_intrinsics.tbody)({});
    for (var _o = 0, _p = __VLS_vFor((__VLS_ctx.fxRates)); _o < _p.length; _o++) {
        var r = _p[_o][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({
            key: (r.id),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (r.rate_date);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (r.from_currency);
        (r.to_currency);
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (__VLS_ctx.formatFxRate(r.rate, r.from_currency, r.to_currency));
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
        (r.last_synced_at ? __VLS_ctx.formatTimestamp(r.last_synced_at) : '-');
        // @ts-ignore
        [formatTimestamp, fxRates, formatFxRate,];
    }
    if (!__VLS_ctx.fxRates.length && !__VLS_ctx.loading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)(__assign({ colspan: "4" }, { class: "ui-table-empty" }));
        /** @type {__VLS_StyleScopedClasses['ui-table-empty']} */ ;
    }
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
}
// @ts-ignore
[loading, loading, fxRates,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
