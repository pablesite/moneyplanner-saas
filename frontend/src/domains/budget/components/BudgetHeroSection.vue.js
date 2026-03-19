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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
if (__VLS_ctx.isMonthlyCloseView) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-hero" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-hero']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-hero-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-hero-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-pro-kicker" }));
    /** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "ui-budget-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-subtitle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-controls" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-controls']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ onChange: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isMonthlyCloseView))
                return;
            __VLS_ctx.updateSelectedExecutionMonth(Number($event.target.value));
            // @ts-ignore
            [isMonthlyCloseView, updateSelectedExecutionMonth,];
        } }, { value: (__VLS_ctx.selectedExecutionMonth) }), { class: "select ui-data-field" }));
    /** @type {__VLS_StyleScopedClasses['select']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
    for (var _i = 0, _c = __VLS_vFor((__VLS_ctx.monthLabels)); _i < _c.length; _i++) {
        var _d = _c[_i], label = _d[0], index = _d[1];
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: ("close-".concat(label)),
            value: (index + 1),
        });
        (label);
        // @ts-ignore
        [selectedExecutionMonth, monthLabels,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-monthly-close-flow" }));
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-flow']} */ ;
    var _loop_1 = function (step, index) {
        (step.id);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMonthlyCloseView))
                    return;
                __VLS_ctx.setActiveMonthlyCloseStep(step.id);
                // @ts-ignore
                [monthlyCloseFlowSteps, setActiveMonthlyCloseStep,];
            } }, { type: "button" }), { class: "ui-monthly-close-step-chip" }), { class: ({ 'ui-monthly-close-step-chip-active': __VLS_ctx.activeMonthlyCloseStep === step.id }) }), { 'aria-pressed': (__VLS_ctx.activeMonthlyCloseStep === step.id) }));
        /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-chip']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-chip-active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (index + 1);
        (step.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (step.subtitle);
        if (index < __VLS_ctx.monthlyCloseFlowSteps.length - 1) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-monthly-close-arrow" }));
            /** @type {__VLS_StyleScopedClasses['ui-monthly-close-arrow']} */ ;
        }
        // @ts-ignore
        [monthlyCloseFlowSteps, activeMonthlyCloseStep, activeMonthlyCloseStep,];
    };
    for (var _e = 0, _f = __VLS_vFor((__VLS_ctx.monthlyCloseFlowSteps)); _e < _f.length; _e++) {
        var _g = _f[_e], step = _g[0], index = _g[1];
        _loop_1(step, index);
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-hero" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-hero']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-hero-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-hero-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-pro-kicker" }));
    /** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "ui-budget-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-subtitle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-toolbar" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-toolbar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-budget-owner-picker" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-owner-picker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign({ class: "ui-select-popover" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign({ class: "ui-select-popover-trigger" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-trigger']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-text" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-text']} */ ;
    (__VLS_ctx.selectedOwnershipFilterLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-caret" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-caret']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-select-popover-menu" }, { role: "listbox", 'aria-label': "Titularidad" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-menu']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.isMonthlyCloseView))
                return;
            __VLS_ctx.selectOwnershipFilterOption('all', $event);
            // @ts-ignore
            [selectedOwnershipFilterLabel, selectOwnershipFilterOption,];
        } }, { type: "button" }), { class: "ui-select-popover-option" }), { class: ({ 'ui-select-popover-option-active': __VLS_ctx.ownershipFilter === 'all' }) }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
    var _loop_2 = function (ownerOption) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.isMonthlyCloseView))
                    return;
                __VLS_ctx.selectOwnershipFilterOption(ownerOption.value, $event);
                // @ts-ignore
                [selectOwnershipFilterOption, ownershipFilter, ownershipOptions,];
            } }, { key: (ownerOption.value), type: "button" }), { class: "ui-select-popover-option" }), { class: ({ 'ui-select-popover-option-active': __VLS_ctx.ownershipFilter === ownerOption.value }) }));
        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
        (ownerOption.label);
        // @ts-ignore
        [ownershipFilter,];
    };
    for (var _h = 0, _j = __VLS_vFor((__VLS_ctx.ownershipOptions)); _h < _j.length; _h++) {
        var ownerOption = _j[_h][0];
        _loop_2(ownerOption);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-budget-year-picker" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-year-picker']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign({ class: "ui-select-popover" }, { class: ({ 'opacity-60': __VLS_ctx.isLoading }) }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover']} */ ;
    /** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign({ class: "ui-select-popover-trigger" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-trigger']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-text" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-text']} */ ;
    (__VLS_ctx.selectedFiscalYearLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-caret" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-caret']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-select-popover-menu" }, { role: "listbox", 'aria-label': "Ejercicio" }));
    /** @type {__VLS_StyleScopedClasses['ui-select-popover-menu']} */ ;
    var _loop_3 = function (year) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.isMonthlyCloseView))
                    return;
                __VLS_ctx.selectFiscalYearOption(year, $event);
                // @ts-ignore
                [isLoading, selectedFiscalYearLabel, fiscalYearOptions, selectFiscalYearOption,];
            } }, { key: (year), type: "button" }), { class: "ui-select-popover-option" }), { class: ({ 'ui-select-popover-option-active': __VLS_ctx.fiscalYear === year }) }), { disabled: (__VLS_ctx.isLoading) }));
        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
        (year);
        // @ts-ignore
        [isLoading, fiscalYear,];
    };
    for (var _k = 0, _l = __VLS_vFor((__VLS_ctx.fiscalYearOptions)); _k < _l.length; _k++) {
        var year = _l[_k][0];
        _loop_3(year);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-suggestions" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-suggestions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-suggestions-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-pill" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-pill']} */ ;
    ((_b = (_a = __VLS_ctx.budgetSuggestions) === null || _a === void 0 ? void 0 : _a.window_months) !== null && _b !== void 0 ? _b : 0);
    if (__VLS_ctx.budgetSuggestionsLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else if (__VLS_ctx.budgetSuggestionsError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle text-red-400" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
        (__VLS_ctx.budgetSuggestionsError);
    }
    else if (!__VLS_ctx.incomeBudgetSuggestions.length && !__VLS_ctx.expenseBudgetSuggestions.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-suggestions-grid" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-grid']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-suggestions-col" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
        for (var _m = 0, _o = __VLS_vFor((__VLS_ctx.incomeBudgetSuggestions)); _m < _o.length; _m++) {
            var row = _o[_m][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: ("inc-".concat(row.key)),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (row.subcategoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(row.plannedAnnual));
            (__VLS_ctx.formatMoney(row.suggestedAnnual));
            (row.observedMonths);
            // @ts-ignore
            [budgetSuggestions, budgetSuggestionsLoading, budgetSuggestionsError, budgetSuggestionsError, incomeBudgetSuggestions, incomeBudgetSuggestions, expenseBudgetSuggestions, formatMoney, formatMoney,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-suggestions-col" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
        for (var _p = 0, _q = __VLS_vFor((__VLS_ctx.expenseBudgetSuggestions)); _p < _q.length; _p++) {
            var row = _q[_p][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: ("exp-".concat(row.key)),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (row.subcategoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(row.plannedAnnual));
            (__VLS_ctx.formatMoney(row.suggestedAnnual));
            (row.observedMonths);
            // @ts-ignore
            [expenseBudgetSuggestions, formatMoney, formatMoney,];
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-kpi ui-budget-kpi-income" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-income']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-label" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-value" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-value']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.plannedIncomeTotal));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-meta']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.plannedIncomeTotal / 12));
    (__VLS_ctx.viewModeLabel(__VLS_ctx.incomeViewMode));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-kpi ui-budget-kpi-expense" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-expense']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-label" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-value" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-value']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.plannedExpenseTotal));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-meta']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.plannedExpenseTotal / 12));
    (__VLS_ctx.viewModeLabel(__VLS_ctx.expenseViewMode));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-kpi" }, { class: (__VLS_ctx.plannedBalanceTotal >= 0 ? 'ui-budget-kpi-balance-good' : 'ui-budget-kpi-balance-bad') }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-label" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-value" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-value']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.plannedBalanceTotal));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-meta']} */ ;
    (__VLS_ctx.plannedIncomeTotal > 0
        ? "".concat(__VLS_ctx.formatPercent(__VLS_ctx.plannedBalanceTotal / __VLS_ctx.plannedIncomeTotal, 0), " sobre ingresos")
        : 'Sin base de ingresos');
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-kpi ui-budget-kpi-muted" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-muted']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-label" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-value ui-budget-kpi-value-sm" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-value']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-value-sm']} */ ;
    (__VLS_ctx.executionStatusLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-kpi-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-kpi-meta']} */ ;
    (__VLS_ctx.executionStatusDetail);
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    (__VLS_ctx.activeViewSummary);
}
// @ts-ignore
[formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, plannedIncomeTotal, plannedIncomeTotal, plannedIncomeTotal, plannedIncomeTotal, viewModeLabel, viewModeLabel, incomeViewMode, plannedExpenseTotal, plannedExpenseTotal, expenseViewMode, plannedBalanceTotal, plannedBalanceTotal, plannedBalanceTotal, formatPercent, executionStatusLabel, executionStatusDetail, activeViewSummary,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
