'use strict';
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var _a, _b, _c;
Object.defineProperty(exports, '__esModule', { value: true });
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
if (__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.section,
    __VLS_intrinsics.section,
  )(__assign({ class: 'card ui-pro-panel ui-budget-checkin mt-3' }));
  /** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin']} */ /** @type {__VLS_StyleScopedClasses['mt-3']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-budget-checkin-header' }));
  /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-header']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )({});
  if (__VLS_ctx.isMonthlyCloseView) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-monthly-close-step-headline' }));
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-headline']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button,
    )(
      __assign(
        __assign(
          __assign(
            {
              onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                  return;
                if (!__VLS_ctx.isMonthlyCloseView) return;
                __VLS_ctx.goToPreviousMonthlyCloseStep();
                // @ts-ignore
                [
                  isMonthlyCloseView,
                  isMonthlyCloseView,
                  activeMonthlyCloseStep,
                  goToPreviousMonthlyCloseStep,
                ];
              },
            },
            { type: 'button' },
          ),
          { class: 'btn ui-monthly-close-step-nav-btn' },
        ),
        { disabled: !__VLS_ctx.previousMonthlyCloseStep },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.h2,
      __VLS_intrinsics.h2,
    )(__assign({ class: 'ui-budget-checkin-title' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button,
    )(
      __assign(
        __assign(
          {
            onClick: function () {
              var _a = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
              }
              var $event = _a[0];
              if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                return;
              if (!__VLS_ctx.isMonthlyCloseView) return;
              __VLS_ctx.goToNextMonthlyCloseStep();
              // @ts-ignore
              [previousMonthlyCloseStep, goToNextMonthlyCloseStep];
            },
          },
          { type: 'button' },
        ),
        { class: 'btn ui-monthly-close-step-nav-btn' },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['btn']} */
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.h2,
      __VLS_intrinsics.h2,
    )(__assign({ class: 'ui-budget-checkin-title' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-budget-checkin-subtitle' }));
  /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ if (
    !__VLS_ctx.isMonthlyCloseView
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-controls' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-controls']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.select,
      __VLS_intrinsics.select,
    )(
      __assign(
        __assign(
          __assign(
            {
              onChange: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                  return;
                if (!!__VLS_ctx.isMonthlyCloseView) return;
                __VLS_ctx.updateSelectedExecutionMonth(Number($event.target.value));
                // @ts-ignore
                [isMonthlyCloseView, updateSelectedExecutionMonth];
              },
            },
            { value: __VLS_ctx.selectedExecutionMonth },
          ),
          { class: 'select ui-data-field' },
        ),
        { disabled: __VLS_ctx.liquidityExecutionLoading },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
      var _i = 0, _d = __VLS_vFor(__VLS_ctx.monthLabels);
      _i < _d.length;
      _i++
    ) {
      var _e = _d[_i],
        label = _e[0],
        index = _e[1];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.option,
        __VLS_intrinsics.option,
      )({
        key: 'liq-'.concat(label),
        value: index + 1,
      });
      label;
      // @ts-ignore
      [selectedExecutionMonth, liquidityExecutionLoading, monthLabels];
    }
  }
  if (__VLS_ctx.liquidityMonthlySummary) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-summary-grid' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-summary-grid']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.article,
      __VLS_intrinsics.article,
    )(__assign({ class: 'ui-budget-checkin-kpi' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthPlanned);
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.article,
      __VLS_intrinsics.article,
    )(__assign({ class: 'ui-budget-checkin-kpi' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthExecuted);
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.article,
      __VLS_intrinsics.article,
    )(
      __assign(
        { class: 'ui-budget-checkin-kpi' },
        {
          class: {
            'ui-budget-checkin-kpi-danger': __VLS_ctx.selectedLiquidityMonthDeviation < 0,
            'ui-budget-checkin-kpi-good': __VLS_ctx.selectedLiquidityMonthDeviation > 0,
          },
        },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_ctx.selectedLiquidityMonthDeviation > 0 ? '+' : '';
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthDeviation);
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.article,
      __VLS_intrinsics.article,
    )(__assign({ class: 'ui-budget-checkin-kpi' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_ctx.formatPercent(
      (_a = __VLS_ctx.liquidityMonthlySummary.completion_ratio) !== null && _a !== void 0
        ? _a
        : null,
      0,
    );
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-budget-checkin-list' }));
  /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-list']} */ if (
    __VLS_ctx.liquidityExecutionLoading
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */
  } else if (!__VLS_ctx.monthlyLiquidityExecutionRows.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-groups-box' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-groups-box']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-group' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-group-summary' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-summary']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-group-title-wrap' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title-wrap']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.strong,
      __VLS_intrinsics.strong,
    )(__assign({ class: 'ui-budget-checkin-group-title' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-budget-checkin-group-meta' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-meta']} */ __VLS_ctx
      .monthlyLiquidityExecutionRows.length;
    __VLS_ctx.formatPercent(
      (_c =
        (_b = __VLS_ctx.liquidityMonthlySummary) === null || _b === void 0
          ? void 0
          : _b.completion_ratio) !== null && _c !== void 0
        ? _c
        : null,
      0,
    );
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-group-kpis' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-kpis']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )({});
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthPlanned);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthExecuted);
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(
      __assign({
        class: {
          'ui-budget-checkin-group-dev-pos': __VLS_ctx.selectedLiquidityMonthDeviation > 0,
          'ui-budget-checkin-group-dev-neg': __VLS_ctx.selectedLiquidityMonthDeviation < 0,
        },
      }),
    );
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ __VLS_ctx.selectedLiquidityMonthDeviation >
    0
      ? '+'
      : '';
    __VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthDeviation);
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-budget-checkin-group-rows' }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-rows']} */ var _loop_1 = function (
      row,
    ) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.article,
        __VLS_intrinsics.article,
      )(
        __assign(
          { key: 'liquidity-checkin-'.concat(row.asset_id) },
          { class: 'ui-budget-checkin-row' },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-budget-checkin-row-main' }));
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-main']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(
        __assign(
          { class: 'ui-budget-checkin-row-title' },
          { title: __VLS_ctx.liquidityCheckinRowSummary(row) },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-title']} */ __VLS_ctx.liquidityCheckinRowSummary(
        row,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-budget-checkin-row-planned' }));
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-planned']} */ __VLS_ctx.formatMoney(
        row.planned,
      );
      row.currency === 'EUR' ? '€' : row.currency;
      if (row.checkin) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-budget-checkin-row-state' }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.strong,
          __VLS_intrinsics.strong,
        )({});
        __VLS_ctx.checkinStatusLabel(row.checkin.status);
        if (row.executed != null) {
          __VLS_ctx.formatMoney(row.executed);
          row.currency === 'EUR' ? '€' : row.currency;
        }
      }
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-budget-checkin-row-actions' }));
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-actions']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-budget-checkin-adjust' }));
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-adjust']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-budget-checkin-quick-actions' }));
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-quick-actions']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button,
      )(
        __assign(
          __assign(
            __assign(
              {
                onClick: function () {
                  var _a = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                  }
                  var $event = _a[0];
                  if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                    return;
                  if (!!__VLS_ctx.liquidityExecutionLoading) return;
                  if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
                  __VLS_ctx.resetLiquidityCheckinDraftValue(row, 'zero');
                  // @ts-ignore
                  [
                    liquidityExecutionLoading,
                    liquidityMonthlySummary,
                    liquidityMonthlySummary,
                    liquidityMonthlySummary,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    formatMoney,
                    selectedLiquidityMonthPlanned,
                    selectedLiquidityMonthPlanned,
                    selectedLiquidityMonthExecuted,
                    selectedLiquidityMonthExecuted,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    selectedLiquidityMonthDeviation,
                    formatPercent,
                    formatPercent,
                    monthlyLiquidityExecutionRows,
                    monthlyLiquidityExecutionRows,
                    monthlyLiquidityExecutionRows,
                    liquidityCheckinRowSummary,
                    liquidityCheckinRowSummary,
                    checkinStatusLabel,
                    resetLiquidityCheckinDraftValue,
                  ];
                },
              },
              { type: 'button' },
            ),
            { class: 'btn ui-budget-checkin-mini-btn' },
          ),
          {
            disabled: __VLS_ctx.liquidityExecutionBusyAssetId === row.asset_id,
            title: 'Poner saldo real a 0',
          },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button,
      )(
        __assign(
          __assign(
            __assign(
              {
                onClick: function () {
                  var _a = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                  }
                  var $event = _a[0];
                  if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                    return;
                  if (!!__VLS_ctx.liquidityExecutionLoading) return;
                  if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
                  __VLS_ctx.resetLiquidityCheckinDraftValue(row, 'planned');
                  // @ts-ignore
                  [resetLiquidityCheckinDraftValue, liquidityExecutionBusyAssetId];
                },
              },
              { type: 'button' },
            ),
            { class: 'btn ui-budget-checkin-mini-btn' },
          ),
          {
            disabled: __VLS_ctx.liquidityExecutionBusyAssetId === row.asset_id,
            title: 'Restaurar saldo de referencia',
          },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.input,
      )(
        __assign(
          __assign(
            __assign(
              __assign(
                __assign(
                  {
                    onFocus: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (
                        !(
                          __VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'
                        )
                      )
                        return;
                      if (!!__VLS_ctx.liquidityExecutionLoading) return;
                      if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
                      __VLS_ctx.ensureLiquidityAdjustAmountPrefilled(row);
                      // @ts-ignore
                      [liquidityExecutionBusyAssetId, ensureLiquidityAdjustAmountPrefilled];
                    },
                  },
                  {
                    onBlur: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (
                        !(
                          __VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'
                        )
                      )
                        return;
                      if (!!__VLS_ctx.liquidityExecutionLoading) return;
                      if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
                      __VLS_ctx.onLiquidityAdjustAmountBlur(row);
                      // @ts-ignore
                      [onLiquidityAdjustAmountBlur];
                    },
                  },
                ),
                {
                  onKeydown: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                      _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (
                      !(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq')
                    )
                      return;
                    if (!!__VLS_ctx.liquidityExecutionLoading) return;
                    if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
                    __VLS_ctx.saveLiquidityCheckinFromInput(row);
                    // @ts-ignore
                    [saveLiquidityCheckinFromInput];
                  },
                },
              ),
              { inputmode: 'decimal' },
            ),
            { class: 'input ui-data-field' },
          ),
          { placeholder: 'Saldo real' },
        ),
      );
      __VLS_ctx.liquidityAdjustAmounts[row.asset_id];
      /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.label,
        __VLS_intrinsics.label,
      )(
        __assign({ class: 'ui-budget-checkin-confirm' }, { title: 'Confirmar cierre de liquidez' }),
      );
      /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-confirm']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.input,
      )(
        __assign(
          {
            onChange: function () {
              var _a = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
              }
              var $event = _a[0];
              if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'liq'))
                return;
              if (!!__VLS_ctx.liquidityExecutionLoading) return;
              if (!!!__VLS_ctx.monthlyLiquidityExecutionRows.length) return;
              __VLS_ctx.onLiquidityCheckinCheckboxToggle(row, Boolean($event.target.checked));
              // @ts-ignore
              [liquidityAdjustAmounts, onLiquidityCheckinCheckboxToggle];
            },
          },
          {
            type: 'checkbox',
            checked: !!row.checkin,
            disabled: __VLS_ctx.liquidityExecutionBusyAssetId === row.asset_id,
            'aria-label': 'Confirmar cierre de liquidez',
          },
        ),
      );
      // @ts-ignore
      [liquidityExecutionBusyAssetId];
    };
    for (
      var _f = 0, _g = __VLS_vFor(__VLS_ctx.monthlyLiquidityExecutionRows);
      _f < _g.length;
      _f++
    ) {
      var row = _g[_f][0];
      _loop_1(row);
    }
  }
}
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeProps: {},
});
exports.default = {};
