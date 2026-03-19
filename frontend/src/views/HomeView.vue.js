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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var vue_router_1 = require('vue-router');
var data_input_1 = require('@/domains/data-input');
var ScoreGradeBadge_vue_1 = require('@/domains/guide/components/ScoreGradeBadge.vue');
var phaseDiagnostics_1 = require('@/domains/guide/phaseDiagnostics');
var phases_1 = require('@/domains/guide/phases');
var scoreVisuals_1 = require('@/domains/guide/scoreVisuals');
var net_worth_1 = require('@/domains/net-worth');
var phases = phases_1.guidePhases;
var store = (0, net_worth_1.useNetWorthStore)();
var annualIncomeStore = (0, data_input_1.useAnnualIncomeStore)('core');
var annualExpenseStore = (0, data_input_1.useAnnualExpenseStore)('core');
var sharedPhaseDiagnostics = (0, vue_1.computed)(function () {
  return (0, phaseDiagnostics_1.computeGuidePhaseDiagnostics)({
    summary: store.summary,
    assets: store.assets,
    liabilities: store.liabilities,
    annualIncomeEntries: annualIncomeStore.entries.value,
    annualExpenseEntries: annualExpenseStore.entries.value,
  });
});
var activePhase = (0, vue_1.computed)(function () {
  return (0, phases_1.getActiveGuidePhase)();
});
function phaseState(phase) {
  if (phase.progress >= 100) return 'done';
  if (phase.id === activePhase.value.id) return 'active';
  return 'next';
}
function phaseDetailTo(phaseId) {
  return '/guia/fases/'.concat(phaseId);
}
function toNumber(raw) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function linearScoreIncreasing(value, min, max) {
  if (value == null || !Number.isFinite(value) || max <= min) return 0;
  var normalized = (value - min) / (max - min);
  return clamp(normalized * 100, 0, 100);
}
function linearScoreDecreasing(value, min, max) {
  if (value == null || !Number.isFinite(value) || max <= min) return 0;
  var normalized = (max - value) / (max - min);
  return clamp(normalized * 100, 0, 100);
}
function weightedScore(items) {
  var totalWeight = items.reduce(function (acc, item) {
    return acc + item.weight;
  }, 0);
  if (totalWeight <= 0) return 0;
  var sum = items.reduce(function (acc, item) {
    return acc + item.score * item.weight;
  }, 0);
  return clamp(sum / totalWeight, 0, 100);
}
var summaryExtended = (0, vue_1.computed)(function () {
  return store.summary;
});
var assetsValue = (0, vue_1.computed)(function () {
  var _a;
  return Math.max(
    0,
    toNumber((_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_assets),
  );
});
var unbackedDebtValue = (0, vue_1.computed)(function () {
  var _a;
  return Math.max(
    0,
    toNumber(
      (_a = summaryExtended.value) === null || _a === void 0 ? void 0 : _a.liabilities_unbacked,
    ),
  );
});
var chartRows = (0, vue_1.computed)(function () {
  var chart = store.byCategoryChart;
  return chart.keys.map(function (key, index) {
    var _a;
    return {
      key: key,
      assets: Math.max(0, (_a = chart.assets[index]) !== null && _a !== void 0 ? _a : 0),
    };
  });
});
var assetRows = (0, vue_1.computed)(function () {
  return chartRows.value.filter(function (row) {
    return row.assets > 0;
  });
});
var activeAssets = (0, vue_1.computed)(function () {
  return store.assets.filter(function (asset) {
    return asset.is_active;
  });
});
var activeLiabilities = (0, vue_1.computed)(function () {
  return store.liabilities.filter(function (liability) {
    return liability.is_active;
  });
});
var liabilitiesValue = (0, vue_1.computed)(function () {
  var _a;
  return Math.max(
    0,
    toNumber((_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_liabilities),
  );
});
var illiquidInvestmentSubcategories = new Set([
  'pension_plans',
  'real_estate_crowd',
  'crowdlending',
  'other',
]);
function isPositiveTae(raw) {
  if (raw == null) return false;
  return toNumber(raw) > 0;
}
function hasTextValue(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '').trim() !== '';
}
var illiquidAssetsValue = (0, vue_1.computed)(function () {
  return activeAssets.value.reduce(function (acc, asset) {
    var amountBase = Math.max(0, toNumber(asset.amount_base));
    if (amountBase <= 0) return acc;
    var illiquidByCategory =
      asset.category === 'real_estate' ||
      asset.category === 'furnishings' ||
      asset.category === 'other';
    var illiquidByInvestmentSubcategory =
      asset.category === 'investments' &&
      illiquidInvestmentSubcategories.has(asset.subcategory || 'other');
    var illiquidByCashOtherDeposit =
      asset.category === 'cash' &&
      asset.subcategory === 'other' &&
      isPositiveTae(asset.annual_interest_tae);
    return illiquidByCategory || illiquidByInvestmentSubcategory || illiquidByCashOtherDeposit
      ? acc + amountBase
      : acc;
  }, 0);
});
var illiquidAssetsShareValue = (0, vue_1.computed)(function () {
  return assetsValue.value > 0 ? illiquidAssetsValue.value / assetsValue.value : null;
});
var unbackedDebtToAssetsValue = (0, vue_1.computed)(function () {
  return assetsValue.value > 0 ? unbackedDebtValue.value / assetsValue.value : null;
});
var debtRows = (0, vue_1.computed)(function () {
  return activeLiabilities.value
    .map(function (liability) {
      var amountBase = Math.max(0, toNumber(liability.amount_base));
      var tae = liability.annual_interest_tae;
      var taePct = tae == null || String(tae).trim() === '' ? null : toNumber(tae);
      var hasKnownTae = taePct != null && Number.isFinite(taePct) && taePct >= 0;
      var paymentRaw = liability.estimated_monthly_payment_amount;
      var hasMonthlyPaymentInput = hasTextValue(paymentRaw);
      var monthlyPaymentAmount = hasMonthlyPaymentInput ? Math.max(0, toNumber(paymentRaw)) : 0;
      return {
        amountBase: amountBase,
        taePct: hasKnownTae ? taePct : null,
        hasMonthlyPaymentInput: hasMonthlyPaymentInput,
        monthlyPaymentAmount: monthlyPaymentAmount,
      };
    })
    .filter(function (row) {
      return row.amountBase > 0;
    });
});
var unbackedDebtToLiabilitiesValue = (0, vue_1.computed)(function () {
  return liabilitiesValue.value > 0 ? unbackedDebtValue.value / liabilitiesValue.value : null;
});
var topLiabilityShareValue = (0, vue_1.computed)(function () {
  var _a;
  if (liabilitiesValue.value <= 0) return null;
  var topLiability =
    (_a = debtRows.value
      .map(function (row) {
        return row.amountBase;
      })
      .sort(function (a, b) {
        return b - a;
      })[0]) !== null && _a !== void 0
      ? _a
      : 0;
  return topLiability / liabilitiesValue.value;
});
var maxLiabilityTaePctValue = (0, vue_1.computed)(function () {
  var taes = debtRows.value
    .map(function (row) {
      return row.taePct;
    })
    .filter(function (value) {
      return value != null && Number.isFinite(value);
    });
  if (!taes.length) return null;
  return Math.max.apply(Math, taes);
});
var weightedLiabilityTaePctValue = (0, vue_1.computed)(function () {
  var rows = debtRows.value.filter(function (row) {
    return row.taePct != null;
  });
  var denominator = rows.reduce(function (acc, row) {
    return acc + row.amountBase;
  }, 0);
  if (denominator <= 0) return null;
  var numerator = rows.reduce(function (acc, row) {
    var _a;
    return acc + row.amountBase * ((_a = row.taePct) !== null && _a !== void 0 ? _a : 0);
  }, 0);
  return numerator / denominator;
});
var liabilitiesWithAmountCountValue = (0, vue_1.computed)(function () {
  return debtRows.value.filter(function (row) {
    return row.amountBase > 0;
  }).length;
});
var liabilitiesWithPaymentInputCountValue = (0, vue_1.computed)(function () {
  return debtRows.value.filter(function (row) {
    return row.hasMonthlyPaymentInput;
  }).length;
});
var hasNoDebtPaymentInputsValue = (0, vue_1.computed)(function () {
  return (
    liabilitiesWithAmountCountValue.value > 0 && liabilitiesWithPaymentInputCountValue.value === 0
  );
});
var totalMonthlyDebtPaymentValue = (0, vue_1.computed)(function () {
  return debtRows.value.reduce(function (acc, row) {
    return acc + row.monthlyPaymentAmount;
  }, 0);
});
var recurrentAnnualIncomeValue = (0, vue_1.computed)(function () {
  return annualIncomeStore.entries.value.reduce(function (acc, entry) {
    var _a;
    return entry.incomeType === 'recurrent'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
});
var monthlyIncomeValue = (0, vue_1.computed)(function () {
  var _a;
  var annual = Number((_a = recurrentAnnualIncomeValue.value) !== null && _a !== void 0 ? _a : 0);
  if (!Number.isFinite(annual) || annual <= 0) return null;
  return annual / 12;
});
var debtPaymentToIncomeValue = (0, vue_1.computed)(function () {
  if (liabilitiesValue.value <= 0) return 0;
  if (monthlyIncomeValue.value == null || monthlyIncomeValue.value <= 0) return null;
  if (hasNoDebtPaymentInputsValue.value) return null;
  return totalMonthlyDebtPaymentValue.value / monthlyIncomeValue.value;
});
var highInterestDebtThresholdPct = 8;
var highInterestDebtValue = (0, vue_1.computed)(function () {
  return debtRows.value.reduce(function (acc, row) {
    return row.taePct != null && row.taePct >= highInterestDebtThresholdPct
      ? acc + row.amountBase
      : acc;
  }, 0);
});
var highInterestDebtShareValue = (0, vue_1.computed)(function () {
  return liabilitiesValue.value > 0 ? highInterestDebtValue.value / liabilitiesValue.value : null;
});
var topAssetShareValue = (0, vue_1.computed)(function () {
  var _a;
  if (assetsValue.value <= 0) return null;
  var topAssets =
    (_a = assetRows.value
      .map(function (row) {
        return row.assets;
      })
      .sort(function (a, b) {
        return b - a;
      })[0]) !== null && _a !== void 0
      ? _a
      : 0;
  return topAssets / assetsValue.value;
});
var diversificationIndexValue = (0, vue_1.computed)(function () {
  if (assetsValue.value <= 0) return null;
  var shares = assetRows.value.map(function (row) {
    return row.assets / assetsValue.value;
  });
  if (!shares.length) return null;
  var hhi = shares.reduce(function (acc, share) {
    return acc + share * share;
  }, 0);
  var minHhi = 1 / 5;
  var maxHhi = 1;
  return clamp((maxHhi - hhi) / (maxHhi - minHhi), 0, 1);
});
var supportScoreValue = (0, vue_1.computed)(function () {
  return weightedScore([
    { score: linearScoreDecreasing(unbackedDebtToAssetsValue.value, 0.05, 0.35), weight: 0.5 },
    { score: linearScoreDecreasing(illiquidAssetsShareValue.value, 0.25, 0.8), weight: 0.5 },
  ]);
});
var riskDistributionScoreValue = (0, vue_1.computed)(function () {
  return weightedScore([
    { score: linearScoreDecreasing(topAssetShareValue.value, 0.4, 0.9), weight: 0.5 },
    { score: linearScoreIncreasing(diversificationIndexValue.value, 0.2, 0.8), weight: 0.5 },
  ]);
});
var phase4HealthScoreValue = (0, vue_1.computed)(function () {
  return weightedScore([
    { score: supportScoreValue.value, weight: 0.5 },
    { score: riskDistributionScoreValue.value, weight: 0.5 },
  ]);
});
var debtMaxTaeScoreValue = (0, vue_1.computed)(function () {
  return linearScoreDecreasing(maxLiabilityTaePctValue.value, 0.5, 10);
});
var debtWeightedTaeScoreValue = (0, vue_1.computed)(function () {
  return linearScoreDecreasing(weightedLiabilityTaePctValue.value, 0.5, 10);
});
var debtPaymentToIncomeScoreValue = (0, vue_1.computed)(function () {
  return hasNoDebtPaymentInputsValue.value
    ? 100
    : linearScoreDecreasing(debtPaymentToIncomeValue.value, 0.15, 0.6);
});
var debtUnbackedScoreValue = (0, vue_1.computed)(function () {
  return linearScoreDecreasing(unbackedDebtToLiabilitiesValue.value, 0.01, 0.5);
});
var debtConcentrationScoreValue = (0, vue_1.computed)(function () {
  return linearScoreDecreasing(topLiabilityShareValue.value, 0.25, 0.95);
});
var debtHighInterestShareScoreValue = (0, vue_1.computed)(function () {
  return linearScoreDecreasing(highInterestDebtShareValue.value, 0.05, 0.6);
});
var phase1HealthScoreValue = (0, vue_1.computed)(function () {
  return weightedScore([
    {
      score: weightedScore([
        { score: debtMaxTaeScoreValue.value, weight: 0.4 },
        { score: debtWeightedTaeScoreValue.value, weight: 0.4 },
        { score: debtPaymentToIncomeScoreValue.value, weight: 0.2 },
      ]),
      weight: 0.5,
    },
    {
      score: weightedScore([
        { score: debtUnbackedScoreValue.value, weight: 0.4 },
        { score: debtConcentrationScoreValue.value, weight: 0.3 },
        { score: debtHighInterestShareScoreValue.value, weight: 0.3 },
      ]),
      weight: 0.5,
    },
  ]);
});
function phaseDisplayProgress(phase) {
  if (!store.summary) return phase.progress;
  if (phase.id === 1) {
    var localScore = Math.round(phase1HealthScoreValue.value);
    var sharedScore = Math.round(sharedPhaseDiagnostics.value.phase1GlobalScore);
    return Number.isFinite(sharedScore) ? sharedScore : localScore;
  }
  if (phase.id === 4) {
    var localScore = Math.round(phase4HealthScoreValue.value);
    var sharedScore = Math.round(sharedPhaseDiagnostics.value.phase4GlobalScore);
    return Number.isFinite(sharedScore) ? sharedScore : localScore;
  }
  if (phase.id === 2) {
    var sharedScore = Math.round(sharedPhaseDiagnostics.value.phase2GlobalScore);
    return Number.isFinite(sharedScore) ? sharedScore : phase.progress;
  }
  if (phase.id === 3) {
    var sharedScore = Math.round(sharedPhaseDiagnostics.value.phase3GlobalScore);
    return Number.isFinite(sharedScore) ? sharedScore : phase.progress;
  }
  return phase.progress;
}
function phaseDonutStyle(phase) {
  var progress = phaseDisplayProgress(phase);
  return {
    '--phase-progress': ''.concat(progress, '%'),
    '--phase-progress-color': (0, scoreVisuals_1.scoreColor)(progress),
  };
}
var phaseSnapshots = (0, vue_1.computed)(function () {
  return phases.map(function (phase) {
    var score = phaseDisplayProgress(phase);
    return {
      phase: phase,
      score: score,
      grade: (0, scoreVisuals_1.gradeFromScore)(score),
    };
  });
});
var mostTensePhase = (0, vue_1.computed)(function () {
  var _a;
  return (_a = phaseSnapshots.value.slice().sort(function (a, b) {
    return a.score - b.score;
  })[0]) !== null && _a !== void 0
    ? _a
    : null;
});
var strongestPhase = (0, vue_1.computed)(function () {
  var _a;
  return (_a = phaseSnapshots.value.slice().sort(function (a, b) {
    return b.score - a.score;
  })[0]) !== null && _a !== void 0
    ? _a
    : null;
});
function phaseSummaryStyle(snapshot) {
  if (!snapshot) return {};
  var color = (0, scoreVisuals_1.scoreColor)(snapshot.score);
  return {
    borderColor: color.replace(')', ' / 0.28)'),
  };
}
function phaseCardStyle(phase) {
  var score = phaseDisplayProgress(phase);
  var grade = (0, scoreVisuals_1.gradeFromScore)(score);
  var tintColor =
    grade === 'A' || grade === 'B'
      ? (0, scoreVisuals_1.scoreColor)(score).replace(')', ' / 0.08)')
      : 'transparent';
  return {
    '--ui-home-phase-border-color': (0, scoreVisuals_1.scoreColor)(score),
    '--ui-home-phase-tint': tintColor,
  };
}
(0, vue_1.onMounted)(function () {
  void store.fetchSettings();
  void store.refreshAll();
  void annualIncomeStore.loadAll();
  void annualExpenseStore.loadAll();
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'container ui-pro-page' }));
/** @type {__VLS_StyleScopedClasses['container']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.section,
  __VLS_intrinsics.section,
)(__assign({ class: 'card ui-pro-panel ui-home-intro' }));
/** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-home-intro']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-home-intro-text' }));
/** @type {__VLS_StyleScopedClasses['ui-home-intro-text']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-pro-kicker' }));
/** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h1,
  __VLS_intrinsics.h1,
)(__assign({ class: 'h1 ui-home-title' }));
/** @type {__VLS_StyleScopedClasses['h1']} */ /** @type {__VLS_StyleScopedClasses['ui-home-title']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle ui-home-copy' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ /** @type {__VLS_StyleScopedClasses['ui-home-copy']} */ if (
  __VLS_ctx.mostTensePhase
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-home-focus-line' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-focus-line']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-home-focus-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-focus-label']} */ __VLS_ctx.mostTensePhase.phase.id;
  __VLS_ctx.mostTensePhase.phase.title;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-home-focus-meta' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-focus-meta']} */ __VLS_ctx.mostTensePhase.grade;
  __VLS_ctx.mostTensePhase.score;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-home-intro-kpis' }));
/** @type {__VLS_StyleScopedClasses['ui-home-intro-kpis']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-home-intro-kpi' },
    { style: __VLS_ctx.phaseSummaryStyle(__VLS_ctx.mostTensePhase) },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-home-intro-kpi']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
if (__VLS_ctx.mostTensePhase) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.mostTensePhase.phase.id;
  __VLS_ctx.mostTensePhase.grade;
  __VLS_ctx.mostTensePhase.score;
} else {
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-home-intro-kpi' },
    { style: __VLS_ctx.phaseSummaryStyle(__VLS_ctx.strongestPhase) },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-home-intro-kpi']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
if (__VLS_ctx.strongestPhase) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.strongestPhase.phase.id;
  __VLS_ctx.strongestPhase.grade;
  __VLS_ctx.strongestPhase.score;
} else {
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.article,
  __VLS_intrinsics.article,
)(__assign({ class: 'section card ui-pro-panel' }));
/** @type {__VLS_StyleScopedClasses['section']} */ /** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h2,
  __VLS_intrinsics.h2,
)(__assign({ class: 'h2' }));
/** @type {__VLS_StyleScopedClasses['h2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle ui-home-block-copy' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ /** @type {__VLS_StyleScopedClasses['ui-home-block-copy']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.ol,
  __VLS_intrinsics.ol,
)(__assign({ class: 'ui-home-phase-row' }));
/** @type {__VLS_StyleScopedClasses['ui-home-phase-row']} */ for (
  var _i = 0, _a = __VLS_vFor(__VLS_ctx.phases);
  _i < _a.length;
  _i++
) {
  var phase = _a[_i][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.li,
    __VLS_intrinsics.li,
  )(
    __assign(
      __assign(__assign({ key: phase.id }, { class: 'ui-home-phase-card' }), {
        style: __VLS_ctx.phaseCardStyle(phase),
      }),
      {
        class: {
          'ui-home-phase-done': __VLS_ctx.phaseState(phase) === 'done',
          'ui-home-phase-active': __VLS_ctx.phaseState(phase) === 'active',
        },
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-card']} */ /** @type {__VLS_StyleScopedClasses['ui-home-phase-done']} */ /** @type {__VLS_StyleScopedClasses['ui-home-phase-active']} */ var __VLS_0 =
    void 0;
  /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
  vue_router_1.RouterLink;
  // @ts-ignore
  var __VLS_1 = __VLS_asFunctionalComponent1(
    __VLS_0,
    new __VLS_0(
      __assign({ class: 'ui-home-phase-link' }, { to: __VLS_ctx.phaseDetailTo(phase.id) }),
    ),
  );
  var __VLS_2 = __VLS_1.apply(
    void 0,
    __spreadArray(
      [__assign({ class: 'ui-home-phase-link' }, { to: __VLS_ctx.phaseDetailTo(phase.id) })],
      __VLS_functionalComponentArgsRest(__VLS_1),
      false,
    ),
  );
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-link']} */ var __VLS_5 = __VLS_3.slots.default;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-home-phase-id' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-id']} */ phase.id;
  var __VLS_6 = ScoreGradeBadge_vue_1.default;
  // @ts-ignore
  var __VLS_7 = __VLS_asFunctionalComponent1(
    __VLS_6,
    new __VLS_6({
      score: __VLS_ctx.phaseDisplayProgress(phase),
    }),
  );
  var __VLS_8 = __VLS_7.apply(
    void 0,
    __spreadArray(
      [
        {
          score: __VLS_ctx.phaseDisplayProgress(phase),
        },
      ],
      __VLS_functionalComponentArgsRest(__VLS_7),
      false,
    ),
  );
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-title']} */ phase.title;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-focus' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-focus']} */ phase.focus;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-donut' }, { style: __VLS_ctx.phaseDonutStyle(phase) }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-donut']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-donut-inner' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-donut-inner']} */ __VLS_ctx.phaseDisplayProgress(
    phase,
  );
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-home-phase-cta' }));
  /** @type {__VLS_StyleScopedClasses['ui-home-phase-cta']} */ // @ts-ignore
  [
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    mostTensePhase,
    phaseSummaryStyle,
    phaseSummaryStyle,
    strongestPhase,
    strongestPhase,
    strongestPhase,
    strongestPhase,
    strongestPhase,
    phases,
    phaseCardStyle,
    phaseState,
    phaseState,
    phaseDetailTo,
    phaseDisplayProgress,
    phaseDisplayProgress,
    phaseDonutStyle,
  ];
  var __VLS_3;
  // @ts-ignore
  [];
}
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
