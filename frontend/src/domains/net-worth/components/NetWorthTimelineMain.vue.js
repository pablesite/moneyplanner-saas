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
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-pro-panel ui-nw-balance-panel ui-nw-balance-panel-integrated" }));
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-balance-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-balance-panel-integrated']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.NetWorthDonut} */
net_worth_1.NetWorthDonut;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign({ 'onSelectCategory': {} }, { 'onAddType': {} }), { totalAssets: (__VLS_ctx.analysis.assets), totalLiabilities: (__VLS_ctx.analysis.liabilities), assetBackedLiabilities: (__VLS_ctx.analysis.backedDebt), unbackedLiabilities: (__VLS_ctx.analysis.unbackedDebt), netWorth: (__VLS_ctx.analysis.netWorth), unit: (__VLS_ctx.heroUnitLabel), categoryKeys: (__VLS_ctx.effectiveCategoryKeys), categoryLabels: (__VLS_ctx.effectiveCategoryLabels), categoryAssets: (__VLS_ctx.effectiveCategoryAssets), categoryLiabilities: (__VLS_ctx.effectiveCategoryLiabilities), categoryAssetCounts: (__VLS_ctx.effectiveCategoryAssetCounts), categoryLiabilityCounts: (__VLS_ctx.effectiveCategoryLiabilityCounts), selectedCategoryKey: (__VLS_ctx.selectedTimelineCategory), selectedCategoryType: (__VLS_ctx.selectedTimelineCategoryType), showChart: (false) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ 'onSelectCategory': {} }, { 'onAddType': {} }), { totalAssets: (__VLS_ctx.analysis.assets), totalLiabilities: (__VLS_ctx.analysis.liabilities), assetBackedLiabilities: (__VLS_ctx.analysis.backedDebt), unbackedLiabilities: (__VLS_ctx.analysis.unbackedDebt), netWorth: (__VLS_ctx.analysis.netWorth), unit: (__VLS_ctx.heroUnitLabel), categoryKeys: (__VLS_ctx.effectiveCategoryKeys), categoryLabels: (__VLS_ctx.effectiveCategoryLabels), categoryAssets: (__VLS_ctx.effectiveCategoryAssets), categoryLiabilities: (__VLS_ctx.effectiveCategoryLiabilities), categoryAssetCounts: (__VLS_ctx.effectiveCategoryAssetCounts), categoryLiabilityCounts: (__VLS_ctx.effectiveCategoryLiabilityCounts), selectedCategoryKey: (__VLS_ctx.selectedTimelineCategory), selectedCategoryType: (__VLS_ctx.selectedTimelineCategoryType), showChart: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ selectCategory: {} },
    { onSelectCategory: (__VLS_ctx.applyCompositionCategoryFilter) });
var __VLS_7 = ({ addType: {} },
    { onAddType: (__VLS_ctx.handleCompositionAddType) });
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.displayedTimelineLoading && __VLS_ctx.visibleTimelineRows.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
}
else if (__VLS_ctx.visibleTimelineRows.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    (__VLS_ctx.selectedPosition
        ? 'Esta posicion aun no tiene suficientes puntos para construir una serie mensual.'
        : 'Aun no hay datos suficientes para construir la serie temporal.');
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-main" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-body" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-body']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-toolbar" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-toolbar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-range-group" }, { role: "group", 'aria-label': "Rango temporal" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-range-group']} */ ;
    var _loop_1 = function (preset) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.displayedTimelineLoading && __VLS_ctx.visibleTimelineRows.length === 0))
                    return;
                if (!!(__VLS_ctx.visibleTimelineRows.length === 0))
                    return;
                __VLS_ctx.setTimelinePreset(preset);
                // @ts-ignore
                [analysis, analysis, analysis, analysis, analysis, heroUnitLabel, effectiveCategoryKeys, effectiveCategoryLabels, effectiveCategoryAssets, effectiveCategoryLiabilities, effectiveCategoryAssetCounts, effectiveCategoryLiabilityCounts, selectedTimelineCategory, selectedTimelineCategoryType, applyCompositionCategoryFilter, handleCompositionAddType, displayedTimelineLoading, visibleTimelineRows, visibleTimelineRows, selectedPosition, timelinePresetOptions, setTimelinePreset,];
            } }, { key: (preset) }), { class: "ui-nw-timeline-range-button" }), { class: ({
                'ui-nw-timeline-range-button-active': __VLS_ctx.customTimelineWindow === null && __VLS_ctx.selectedTimelinePreset === preset,
            }) }), { type: "button" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-range-button']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-range-button-active']} */ ;
        (preset);
        // @ts-ignore
        [customTimelineWindow, selectedTimelinePreset,];
    };
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.timelinePresetOptions)); _i < _a.length; _i++) {
        var preset = _a[_i][0];
        _loop_1(preset);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-toolbar-actions" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-toolbar-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-timeline-range-caption" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-range-caption']} */ ;
    (__VLS_ctx.timelineRangeCaption);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.displayedTimelineLoading && __VLS_ctx.visibleTimelineRows.length === 0))
                return;
            if (!!(__VLS_ctx.visibleTimelineRows.length === 0))
                return;
            __VLS_ctx.setTimelineExpanded(true);
            // @ts-ignore
            [timelineRangeCaption, setTimelineExpanded,];
        } }, { class: "ui-nw-timeline-expand-button" }), { type: "button" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-expand-button']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-chart-shell" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-chart-shell']} */ ;
    if (__VLS_ctx.displayedTimelineLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-loading-overlay" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-loading-overlay']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-nw-timeline-loading-pill" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-loading-pill']} */ ;
    }
    var __VLS_8 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.NetWorthTimelineChart} */
    net_worth_1.NetWorthTimelineChart;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        points: (__VLS_ctx.timelineChartPoints),
        unit: (__VLS_ctx.displayedTimelineUnit),
        seriesLabel: (__VLS_ctx.timelineSummaryLabel),
        seriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            points: (__VLS_ctx.timelineChartPoints),
            unit: (__VLS_ctx.displayedTimelineUnit),
            seriesLabel: (__VLS_ctx.timelineSummaryLabel),
            seriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-points" }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-points']} */ ;
    for (var _b = 0, _c = __VLS_vFor((__VLS_ctx.timelineChartRows.slice(-6))); _b < _c.length; _b++) {
        var row = _c[_b][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (row.date) }, { class: "ui-nw-timeline-point" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-point']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.formatNumber(row.value, 0));
        // @ts-ignore
        [displayedTimelineLoading, timelineChartPoints, displayedTimelineUnit, timelineSummaryLabel, displayedTimelineSeriesColor, timelineChartRows, formatNumber,];
    }
    if (__VLS_ctx.selectedPosition) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity']} */ ;
        if (__VLS_ctx.showAccountingActivityBlock) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity ui-nw-position-activity-accounting" }));
            /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-accounting']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-head" }));
            /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-head']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-nw-position-activity-title" }));
            /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-title']} */ ;
            if (__VLS_ctx.accountingActivityLoading) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
                (__VLS_ctx.accountingActivityYear);
            }
            if (__VLS_ctx.showAccountingActivityNeedsReview) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
            }
            else if (__VLS_ctx.showAccountingActivitySetupGap) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
            }
            else if (__VLS_ctx.accountingActivityError) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
                (__VLS_ctx.accountingActivityError);
            }
            else if (__VLS_ctx.accountingActivityRows.length === 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
                /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-list" }));
                /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-list']} */ ;
                for (var _d = 0, _e = __VLS_vFor((__VLS_ctx.accountingActivityRows)); _d < _e.length; _d++) {
                    var row = _e[_d][0];
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (row.id) }, { class: "ui-nw-position-activity-row ui-nw-position-activity-row-accounting" }));
                    /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-row']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-row-accounting']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-main" }));
                    /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-main']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                    (row.date);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (row.description);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (row.sideLabel);
                    (row.counterpartLabel);
                    if (row.note) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                        (row.note);
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-amount" }));
                    /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-amount']} */ ;
                    (__VLS_ctx.formatNumber(row.amount, 2));
                    (row.currency);
                    // @ts-ignore
                    [selectedPosition, formatNumber, showAccountingActivityBlock, accountingActivityLoading, accountingActivityYear, showAccountingActivityNeedsReview, showAccountingActivitySetupGap, accountingActivityError, accountingActivityError, accountingActivityRows, accountingActivityRows,];
                }
            }
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-head" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-nw-position-activity-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-title']} */ ;
        if (__VLS_ctx.positionActivityLoading) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "subtle" }));
            /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
        }
        if (__VLS_ctx.positionActivityRows.length === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
            /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-list" }));
            /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-list']} */ ;
            for (var _f = 0, _g = __VLS_vFor((__VLS_ctx.positionActivityRows)); _f < _g.length; _f++) {
                var row = _g[_f][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (row.id) }, { class: "ui-nw-position-activity-row" }), { class: ({ 'ui-nw-position-activity-row-valuation': row.kind === 'valuation' }) }));
                /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-row']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-row-valuation']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-main" }));
                /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-main']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (row.date);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (row.label);
                (row.meta);
                if (row.note) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (row.note);
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-position-activity-amount" }));
                /** @type {__VLS_StyleScopedClasses['ui-nw-position-activity-amount']} */ ;
                (__VLS_ctx.formatNumber(row.amount, 2));
                // @ts-ignore
                [formatNumber, positionActivityLoading, positionActivityRows, positionActivityRows,];
            }
        }
    }
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
