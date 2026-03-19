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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var net_worth_1 = require("@/domains/net-worth");
var props = defineProps();
function closePopoverFromClick(event) {
    var target = event.currentTarget;
    var details = target === null || target === void 0 ? void 0 : target.closest('details');
    if (details)
        details.open = false;
}
function selectOwnershipFilterOption(value, event) {
    props.setOwnershipFilter(value);
    closePopoverFromClick(event);
}
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-nw-hero-shell grid gap-2.5 mb-2" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-pro-kicker" }));
/** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-topbar mt-1" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-topbar-actions" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-topbar-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.store.refreshAll();
        // @ts-ignore
        [store,];
    } }, { class: "icon-btn ui-nw-topbar-action disabled:cursor-not-allowed disabled:opacity-50" }), { type: "button", disabled: (__VLS_ctx.store.loading), 'aria-label': "Refrescar" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-topbar-action']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.store.createTodaySnapshot();
        // @ts-ignore
        [store, store,];
    } }, { class: "icon-btn ui-nw-topbar-action disabled:cursor-not-allowed disabled:opacity-50" }), { type: "button", disabled: (__VLS_ctx.store.loading), 'aria-label': "Guardar snapshot", title: "Guardar snapshot" }));
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-topbar-action']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-pro-toolbar ui-nw-toolbar" }));
/** @type {__VLS_StyleScopedClasses['ui-pro-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-toolbar']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.SettingsPopover} */
net_worth_1.SettingsPopover;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign(__assign(__assign({ 'onUpdate:baseCurrency': {} }, { 'onUpdate:inflationRegion': {} }), { 'onUpdate:valueMode': {} }), { 'onSnapshot': {} }), { 'onRefresh': {} }), { loading: (__VLS_ctx.store.loading), baseCurrency: ((_a = __VLS_ctx.store.baseCurrency) !== null && _a !== void 0 ? _a : 'EUR'), currencies: (__VLS_ctx.currencies), inflationRegion: ((_b = __VLS_ctx.store.inflationRegion) !== null && _b !== void 0 ? _b : 'ES'), inflationRegions: (__VLS_ctx.inflationRegions), valueMode: (__VLS_ctx.valueMode), canShowReal: (__VLS_ctx.canShowReal), modeHelp: (__VLS_ctx.modeLabel), realBaseLabel: (__VLS_ctx.realBaseLabel), showRefresh: (false), showSnapshot: (false), iconOnly: (true) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign(__assign({ 'onUpdate:baseCurrency': {} }, { 'onUpdate:inflationRegion': {} }), { 'onUpdate:valueMode': {} }), { 'onSnapshot': {} }), { 'onRefresh': {} }), { loading: (__VLS_ctx.store.loading), baseCurrency: ((_c = __VLS_ctx.store.baseCurrency) !== null && _c !== void 0 ? _c : 'EUR'), currencies: (__VLS_ctx.currencies), inflationRegion: ((_d = __VLS_ctx.store.inflationRegion) !== null && _d !== void 0 ? _d : 'ES'), inflationRegions: (__VLS_ctx.inflationRegions), valueMode: (__VLS_ctx.valueMode), canShowReal: (__VLS_ctx.canShowReal), modeHelp: (__VLS_ctx.modeLabel), realBaseLabel: (__VLS_ctx.realBaseLabel), showRefresh: (false), showSnapshot: (false), iconOnly: (true) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ 'update:baseCurrency': {} },
    { 'onUpdate:baseCurrency': (__VLS_ctx.store.updateBaseCurrency) });
var __VLS_7 = ({ 'update:inflationRegion': {} },
    { 'onUpdate:inflationRegion': (__VLS_ctx.store.updateInflationRegion) });
var __VLS_8 = ({ 'update:valueMode': {} },
    { 'onUpdate:valueMode': (__VLS_ctx.setValueMode) });
var __VLS_9 = ({ snapshot: {} },
    { onSnapshot: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.store.createTodaySnapshot();
            // @ts-ignore
            [store, store, store, store, store, store, store, currencies, inflationRegions, valueMode, canShowReal, modeLabel, realBaseLabel, setValueMode,];
        } });
var __VLS_10 = ({ refresh: {} },
    { onRefresh: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.store.refreshAll();
            // @ts-ignore
            [store,];
        } });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero mt-2" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-main" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-donut" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-donut']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-donut-frame" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-donut-frame']} */ ;
var __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.NetWorthDonut} */
net_worth_1.NetWorthDonut;
// @ts-ignore
var __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    totalAssets: (__VLS_ctx.analysis.assets),
    totalLiabilities: (__VLS_ctx.analysis.liabilities),
    assetBackedLiabilities: (__VLS_ctx.analysis.backedDebt),
    unbackedLiabilities: (__VLS_ctx.analysis.unbackedDebt),
    netWorth: (__VLS_ctx.analysis.netWorth),
    unit: (__VLS_ctx.heroUnitLabel),
    showComposition: (false),
}));
var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([{
        totalAssets: (__VLS_ctx.analysis.assets),
        totalLiabilities: (__VLS_ctx.analysis.liabilities),
        assetBackedLiabilities: (__VLS_ctx.analysis.backedDebt),
        unbackedLiabilities: (__VLS_ctx.analysis.unbackedDebt),
        netWorth: (__VLS_ctx.analysis.netWorth),
        unit: (__VLS_ctx.heroUnitLabel),
        showComposition: (false),
    }], __VLS_functionalComponentArgsRest(__VLS_12), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-nw-hero-summary" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-summary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-summary-head" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-summary-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-badge" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-nw-hero-context" }, { 'data-test': "ownership-filter" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-context']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-hero-context-label" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-context-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign({ class: "ui-select-popover ui-nw-hero-context-popover" }, { class: ({ 'opacity-60': __VLS_ctx.ownershipFilterDisabled }) }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-context-popover']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.ownershipFilterDisabled ? $event.preventDefault() : undefined;
        // @ts-ignore
        [analysis, analysis, analysis, analysis, analysis, heroUnitLabel, ownershipFilterDisabled, ownershipFilterDisabled,];
    } }, { class: "ui-select-popover-trigger ui-nw-hero-context-trigger" }), { 'aria-disabled': (__VLS_ctx.ownershipFilterDisabled) }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-context-trigger']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-text" }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover-text']} */ ;
(__VLS_ctx.selectedOwnershipFilterLabel);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-caret" }, { 'aria-hidden': "true" }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover-caret']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-select-popover-menu" }, { role: "listbox", 'aria-label': "Titularidad" }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover-menu']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.selectOwnershipFilterOption('all', $event);
        // @ts-ignore
        [ownershipFilterDisabled, selectedOwnershipFilterLabel, selectOwnershipFilterOption,];
    } }, { type: "button" }), { class: "ui-select-popover-option" }), { class: ({ 'ui-select-popover-option-active': __VLS_ctx.ownershipFilter === 'all' }) }), { 'data-test': "ownership-filter-option-all", disabled: (__VLS_ctx.ownershipFilterDisabled) }));
/** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
var _loop_1 = function (option) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.selectOwnershipFilterOption(option.value, $event);
            // @ts-ignore
            [ownershipFilterDisabled, selectOwnershipFilterOption, ownershipFilter, ownershipOptions,];
        } }, { key: (String(option.value)), type: "button" }), { class: "ui-select-popover-option" }), { class: ({ 'ui-select-popover-option-active': __VLS_ctx.ownershipFilter === option.value }) }), { 'data-test': ("ownership-filter-option-".concat(String(option.value))), disabled: (__VLS_ctx.ownershipFilterDisabled) }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
    (option.label);
    // @ts-ignore
    [ownershipFilterDisabled, ownershipFilter,];
};
for (var _i = 0, _e = __VLS_vFor((__VLS_ctx.ownershipOptions)); _i < _e.length; _i++) {
    var option = _e[_i][0];
    _loop_1(option);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-summary-body" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-summary-body']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-primary" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-title" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.resetTimelineSelection) }, { class: "ui-nw-hero-value-button" }), { type: "button" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-value-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-value']} */ ;
(__VLS_ctx.formatNumber(__VLS_ctx.analysis.netWorth, 2));
(__VLS_ctx.heroUnitLabel);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-metrics" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metrics']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-metric" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-hero-metric-label" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-nw-hero-metric-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric-value']} */ ;
(__VLS_ctx.formatPct(__VLS_ctx.analysis.liquidityToDebtRatio, 0));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-metric" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-hero-metric-label" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-nw-hero-metric-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-metric-value']} */ ;
(__VLS_ctx.formatPct(__VLS_ctx.analysis.equityRatio, 0));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-side" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-side']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-stats" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stats']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-stat ui-nw-hero-stat-assets" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-assets']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-hero-stat-label" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-nw-hero-stat-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-value']} */ ;
(__VLS_ctx.formatNumber(__VLS_ctx.analysis.assets, 2));
(__VLS_ctx.heroUnitLabel);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-stat ui-nw-hero-stat-liabilities" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-liabilities']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-hero-stat-label" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-nw-hero-stat-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-stat-value']} */ ;
(__VLS_ctx.formatNumber(__VLS_ctx.analysis.liabilities, 2));
(__VLS_ctx.heroUnitLabel);
// @ts-ignore
[analysis, analysis, analysis, analysis, analysis, heroUnitLabel, heroUnitLabel, heroUnitLabel, resetTimelineSelection, formatNumber, formatNumber, formatNumber, formatPct, formatPct,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
