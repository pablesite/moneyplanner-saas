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
var vue_1 = require("vue");
var vue_chartjs_1 = require("vue-chartjs");
var chart_js_1 = require("chart.js");
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend);
var props = withDefaults(defineProps(), {
    showChart: true,
    showComposition: true,
});
var slots = (0, vue_1.useSlots)();
var emit = defineEmits();
var hasChart = (0, vue_1.computed)(function () { return props.showChart !== false; });
var hasSide = (0, vue_1.computed)(function () { return props.showComposition !== false || !!slots['side-top']; });
var displayUnit = (0, vue_1.computed)(function () { return (props.unit === 'EUR' ? '€' : props.unit); });
function normalizeNumberInput(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(/,/g, '.');
}
function toNumber(v) {
    var n = Number(normalizeNumberInput(v));
    return Number.isFinite(n) ? n : 0;
}
function formatMoney(n, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return new Intl.NumberFormat('es-ES', {
        useGrouping: true,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n);
}
function formatPercent(n, decimals) {
    if (decimals === void 0) { decimals = 0; }
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n);
}
var assets = (0, vue_1.computed)(function () { return Math.max(0, toNumber(props.totalAssets)); });
var liabilities = (0, vue_1.computed)(function () { return Math.max(0, toNumber(props.totalLiabilities)); });
var net = (0, vue_1.computed)(function () { return toNumber(props.netWorth); });
var backedRaw = (0, vue_1.computed)(function () { return Math.max(0, toNumber(props.assetBackedLiabilities)); });
var unbackedRaw = (0, vue_1.computed)(function () { return Math.max(0, toNumber(props.unbackedLiabilities)); });
var backedSlice = (0, vue_1.computed)(function () { return Math.min(backedRaw.value, assets.value); });
var unbackedSlice = (0, vue_1.computed)(function () {
    var room = Math.max(assets.value - backedSlice.value, 0);
    return Math.min(unbackedRaw.value, room);
});
var equitySlice = (0, vue_1.computed)(function () {
    return Math.max(assets.value - backedSlice.value - unbackedSlice.value, 0);
});
function buildCategoryShares(keys, labels, values, counts, total) {
    if (!(keys === null || keys === void 0 ? void 0 : keys.length) || !(labels === null || labels === void 0 ? void 0 : labels.length) || !(values === null || values === void 0 ? void 0 : values.length) || total <= 0)
        return [];
    return labels
        .map(function (label, index) {
        var _a, _b, _c;
        var value = Math.max(0, (_a = values[index]) !== null && _a !== void 0 ? _a : 0);
        return {
            key: (_b = keys[index]) !== null && _b !== void 0 ? _b : label,
            label: label,
            value: value,
            share: total > 0 ? value / total : 0,
            count: Math.max(0, (_c = counts === null || counts === void 0 ? void 0 : counts[index]) !== null && _c !== void 0 ? _c : 0),
        };
    })
        .filter(function (item) { return item.value > 0; })
        .sort(function (a, b) { return b.value - a.value; })
        .slice(0, 5);
}
var assetComposition = (0, vue_1.computed)(function () {
    return buildCategoryShares(props.categoryKeys, props.categoryLabels, props.categoryAssets, props.categoryAssetCounts, assets.value);
});
var liabilityComposition = (0, vue_1.computed)(function () {
    return buildCategoryShares(props.categoryKeys, props.categoryLabels, props.categoryLiabilities, props.categoryLiabilityCounts, liabilities.value);
});
var data = (0, vue_1.computed)(function () { return ({
    labels: ['Capital propio (neto)', 'Activos financiados con deuda', 'Deuda sin activo'],
    datasets: [
        {
            data: [equitySlice.value, backedSlice.value, unbackedSlice.value],
            backgroundColor: [
                'rgba(92, 192, 255, 0.9)',
                'rgba(255, 99, 132, 0.85)',
                'rgba(255, 140, 110, 0.85)',
            ],
            borderColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
            borderWidth: 0,
            hoverOffset: 6,
            spacing: 2,
            cutout: '72%',
        },
    ],
}); });
var options = (0, vue_1.computed)(function () { return ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: function (ctx) {
                    var _a;
                    var label = (_a = ctx.label) !== null && _a !== void 0 ? _a : '';
                    var v = typeof ctx.raw === 'number' ? ctx.raw : 0;
                    var pct = assets.value > 0 ? " (".concat(formatPercent(v / assets.value, 0), ")") : '';
                    return "".concat(label, ": ").concat(formatMoney(v, 2), " ").concat(displayUnit.value).concat(pct);
                },
            },
        },
    },
}); });
var centerTextPlugin = (0, vue_1.computed)(function () { return ({
    id: 'centerText',
    afterDraw: function (chart) {
        var ctx = chart.ctx, chartArea = chart.chartArea;
        if (!chartArea)
            return;
        var cx = (chartArea.left + chartArea.right) / 2;
        var cy = (chartArea.top + chartArea.bottom) / 2;
        var netStr = formatMoney(net.value, 2);
        var isNeg = net.value < 0;
        var netColor = isNeg ? 'rgba(255, 120, 140, 0.95)' : 'rgba(140, 240, 180, 0.95)';
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 16px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle = netColor;
        ctx.fillText(netStr, cx, cy - 10);
        ctx.font = '12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.70)';
        ctx.fillText('Patrimonio neto', cx, cy + 8);
        ctx.font = '12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.60)';
        ctx.fillText(displayUnit.value, cx, cy + 26);
        ctx.restore();
    },
}); });
var __VLS_defaults = {
    showChart: true,
    showComposition: true,
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-chart-only']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-chart-only']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-side-only']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-chart-only']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-chart']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-wrap" }, { class: ({
        'nw-donut-wrap-chart-only': __VLS_ctx.hasChart && !__VLS_ctx.hasSide,
        'nw-donut-wrap-side-only': !__VLS_ctx.hasChart && __VLS_ctx.hasSide,
    }) }));
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-chart-only']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-donut-wrap-side-only']} */ ;
if (__VLS_ctx.hasChart) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-chart" }));
    /** @type {__VLS_StyleScopedClasses['nw-donut-chart']} */ ;
    var __VLS_0 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.Doughnut} */
    vue_chartjs_1.Doughnut;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        data: (__VLS_ctx.data),
        options: (__VLS_ctx.options),
        plugins: ([__VLS_ctx.centerTextPlugin]),
    }));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
            data: (__VLS_ctx.data),
            options: (__VLS_ctx.options),
            plugins: ([__VLS_ctx.centerTextPlugin]),
        }], __VLS_functionalComponentArgsRest(__VLS_1), false));
}
if (__VLS_ctx.hasSide) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-side" }));
    /** @type {__VLS_StyleScopedClasses['nw-donut-side']} */ ;
    if (__VLS_ctx.$slots['side-top']) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-side-top" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-side-top']} */ ;
        var __VLS_5 = {};
    }
    if (props.showComposition !== false) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-composition" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-composition']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-block" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-block']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-block-head" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-block-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-title" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.hasSide))
                    return;
                if (!(props.showComposition !== false))
                    return;
                __VLS_ctx.emit('add-type', { type: 'asset' });
                // @ts-ignore
                [hasChart, hasChart, hasChart, hasSide, hasSide, hasSide, data, options, centerTextPlugin, $slots, emit,];
            } }, { class: "nw-donut-comp-action" }), { type: "button", 'aria-label': "Nuevo activo" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-action']} */ ;
        if (__VLS_ctx.assetComposition.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-list" }));
            /** @type {__VLS_StyleScopedClasses['nw-donut-comp-list']} */ ;
            var _loop_1 = function (row) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: ("asset-".concat(row.key)) }, { class: "nw-donut-comp-row" }), { class: ({
                        'nw-donut-comp-row-active': props.selectedCategoryType === 'asset' && props.selectedCategoryKey === row.key,
                    }) }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-row']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-row-active']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.hasSide))
                            return;
                        if (!(props.showComposition !== false))
                            return;
                        if (!(__VLS_ctx.assetComposition.length))
                            return;
                        __VLS_ctx.emit('select-category', { key: row.key, type: 'asset' });
                        // @ts-ignore
                        [emit, assetComposition, assetComposition,];
                    } }, { class: "nw-donut-comp-main" }), { type: "button" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-main']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-head" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-head']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (row.label);
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (__VLS_ctx.formatPercent(row.share, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-meta" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-meta']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatMoney(row.value, 2));
                (__VLS_ctx.displayUnit);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (row.count);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-bar" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-bar']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-donut-comp-fill nw-donut-comp-fill-asset" }, { style: ({ width: "".concat(row.share * 100, "%") }) }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-fill']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-fill-asset']} */ ;
                // @ts-ignore
                [formatPercent, formatMoney, displayUnit,];
            };
            for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.assetComposition)); _i < _a.length; _i++) {
                var row = _a[_i][0];
                _loop_1(row);
            }
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-empty" }));
            /** @type {__VLS_StyleScopedClasses['nw-donut-comp-empty']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-block" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-block']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-block-head" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-block-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-title" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.hasSide))
                    return;
                if (!(props.showComposition !== false))
                    return;
                __VLS_ctx.emit('add-type', { type: 'liability' });
                // @ts-ignore
                [emit,];
            } }, { class: "nw-donut-comp-action" }), { type: "button", 'aria-label': "Nuevo pasivo" }));
        /** @type {__VLS_StyleScopedClasses['nw-donut-comp-action']} */ ;
        if (__VLS_ctx.liabilityComposition.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-list" }));
            /** @type {__VLS_StyleScopedClasses['nw-donut-comp-list']} */ ;
            var _loop_2 = function (row) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: ("liability-".concat(row.key)) }, { class: "nw-donut-comp-row" }), { class: ({
                        'nw-donut-comp-row-active': props.selectedCategoryType === 'liability' &&
                            props.selectedCategoryKey === row.key,
                    }) }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-row']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-row-active']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.hasSide))
                            return;
                        if (!(props.showComposition !== false))
                            return;
                        if (!(__VLS_ctx.liabilityComposition.length))
                            return;
                        __VLS_ctx.emit('select-category', { key: row.key, type: 'liability' });
                        // @ts-ignore
                        [emit, liabilityComposition, liabilityComposition,];
                    } }, { class: "nw-donut-comp-main" }), { type: "button" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-main']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-head" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-head']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (row.label);
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (__VLS_ctx.formatPercent(row.share, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-meta" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-meta']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatMoney(row.value, 2));
                (__VLS_ctx.displayUnit);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (row.count);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-bar" }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-bar']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-donut-comp-fill nw-donut-comp-fill-liability" }, { style: ({ width: "".concat(row.share * 100, "%") }) }));
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-fill']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-donut-comp-fill-liability']} */ ;
                // @ts-ignore
                [formatPercent, formatMoney, displayUnit,];
            };
            for (var _b = 0, _c = __VLS_vFor((__VLS_ctx.liabilityComposition)); _b < _c.length; _b++) {
                var row = _c[_b][0];
                _loop_2(row);
            }
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-donut-comp-empty" }));
            /** @type {__VLS_StyleScopedClasses['nw-donut-comp-empty']} */ ;
        }
    }
}
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
var __VLS_export = {};
exports.default = {};
