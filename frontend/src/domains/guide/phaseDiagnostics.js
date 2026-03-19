'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.computeGuidePhaseDiagnostics = computeGuidePhaseDiagnostics;
function toNumber(raw) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}
function hasTextValue(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '').trim() !== '';
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
function isPositiveTae(raw) {
  if (raw == null) return false;
  return toNumber(raw) > 0;
}
var ILLIQUID_INVESTMENT_SUBCATEGORIES = new Set([
  'pension_plans',
  'real_estate_crowd',
  'crowdlending',
  'other',
]);
var LIQUID_INVESTMENT_SUBCATEGORIES = new Set([
  'deposits',
  'funds',
  'etfs',
  'roboadvisor',
  'stocks',
  'cryptocurrencies',
]);
function sumAnnualByType(entries, key, expected) {
  return entries.reduce(function (acc, entry) {
    var _a;
    return entry[key] === expected
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
}
function expenseTimeProfile(entry) {
  var _a;
  return (_a = entry.timeProfile) !== null && _a !== void 0
    ? _a
    : entry.expenseType === 'one_off'
      ? 'one_off'
      : 'structural_recurrent';
}
function expenseCashflowRole(entry) {
  if (entry.cashflowRole) return entry.cashflowRole;
  if (entry.category === 'savings_allocation') return 'savings';
  if (entry.category === 'financial_investments') return 'investment';
  if (entry.category === 'real_estate_assets' || entry.category === 'tangible_assets') {
    return entry.subcategory === 'real_estate_fees_taxes' ? 'tax_fee' : 'asset_purchase';
  }
  return 'operating';
}
function computeAssetLiquidityMetrics(params) {
  var _a, _b;
  var summary = params.summary,
    activeAssets = params.activeAssets,
    assetsValue = params.assetsValue;
  var assetsByCategoryValues = Object.values(
    (_a = summary === null || summary === void 0 ? void 0 : summary.assets_by_category) !== null &&
      _a !== void 0
      ? _a
      : {},
  )
    .map(function (value) {
      return Math.max(0, toNumber(value));
    })
    .filter(function (value) {
      return value > 0;
    });
  var illiquidAssetsValue = activeAssets.reduce(function (acc, asset) {
    var amountBase = Math.max(0, toNumber(asset.amount_base));
    if (amountBase <= 0) return acc;
    var illiquidByCategory =
      asset.category === 'real_estate' ||
      asset.category === 'furnishings' ||
      asset.category === 'other';
    var illiquidByInvestmentSubcategory =
      asset.category === 'investments' &&
      ILLIQUID_INVESTMENT_SUBCATEGORIES.has(asset.subcategory || 'other');
    var illiquidByCashOtherDeposit =
      asset.category === 'cash' &&
      asset.subcategory === 'other' &&
      isPositiveTae(asset.annual_interest_tae);
    return illiquidByCategory || illiquidByInvestmentSubcategory || illiquidByCashOtherDeposit
      ? acc + amountBase
      : acc;
  }, 0);
  var emergencyLiquidAssetsValue = activeAssets.reduce(function (acc, asset) {
    var amountBase = Math.max(0, toNumber(asset.amount_base));
    if (amountBase <= 0) return acc;
    var isCashLiquidity = asset.category === 'cash';
    var isLiquidInvestment =
      asset.category === 'investments' &&
      LIQUID_INVESTMENT_SUBCATEGORIES.has(asset.subcategory || 'other');
    return isCashLiquidity || isLiquidInvestment ? acc + amountBase : acc;
  }, 0);
  var immediateLiquidityAssetsValue = activeAssets.reduce(function (acc, asset) {
    if (asset.category !== 'cash') return acc;
    var amountBase = Math.max(0, toNumber(asset.amount_base));
    return amountBase > 0 ? acc + amountBase : acc;
  }, 0);
  var topAssetShare =
    assetsValue > 0
      ? ((_b = assetsByCategoryValues.sort(function (a, b) {
          return b - a;
        })[0]) !== null && _b !== void 0
          ? _b
          : 0) / assetsValue
      : null;
  var diversificationIndex = (function () {
    if (assetsValue <= 0) return null;
    var shares = assetsByCategoryValues.map(function (value) {
      return value / assetsValue;
    });
    if (!shares.length) return null;
    var hhi = shares.reduce(function (acc, share) {
      return acc + share * share;
    }, 0);
    var minHhi = 1 / 5;
    var maxHhi = 1;
    return clamp((maxHhi - hhi) / (maxHhi - minHhi), 0, 1);
  })();
  return {
    illiquidAssetsValue: illiquidAssetsValue,
    illiquidAssetsShare: assetsValue > 0 ? illiquidAssetsValue / assetsValue : null,
    emergencyLiquidAssetsValue: emergencyLiquidAssetsValue,
    immediateLiquidityAssetsValue: immediateLiquidityAssetsValue,
    emergencyLiquidityToAssets: assetsValue > 0 ? emergencyLiquidAssetsValue / assetsValue : null,
    immediateLiquidityShareWithinEmergency:
      emergencyLiquidAssetsValue > 0
        ? immediateLiquidityAssetsValue / emergencyLiquidAssetsValue
        : null,
    topAssetShare: topAssetShare,
    diversificationIndex: diversificationIndex,
  };
}
function buildDebtRows(activeLiabilities) {
  return activeLiabilities
    .map(function (liability) {
      var amountBase = Math.max(0, toNumber(liability.amount_base));
      var taeRaw = liability.annual_interest_tae;
      var taePct = taeRaw == null || String(taeRaw).trim() === '' ? null : toNumber(taeRaw);
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
}
function computeDebtMetrics(params) {
  var _a;
  var debtRows = params.debtRows,
    liabilitiesValue = params.liabilitiesValue,
    annualIncomeEntries = params.annualIncomeEntries;
  var topLiabilityShare =
    liabilitiesValue > 0
      ? ((_a = debtRows
          .map(function (row) {
            return row.amountBase;
          })
          .sort(function (a, b) {
            return b - a;
          })[0]) !== null && _a !== void 0
          ? _a
          : 0) / liabilitiesValue
      : null;
  var taes = debtRows
    .map(function (row) {
      return row.taePct;
    })
    .filter(function (value) {
      return value != null && Number.isFinite(value);
    });
  var maxLiabilityTaePct = taes.length ? Math.max.apply(Math, taes) : null;
  var weightedLiabilityTaePct = (function () {
    var rows = debtRows.filter(function (row) {
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
  })();
  var liabilitiesWithAmountCount = debtRows.length;
  var liabilitiesWithPaymentInputCount = debtRows.filter(function (row) {
    return row.hasMonthlyPaymentInput;
  }).length;
  var hasNoDebtPaymentInputs =
    liabilitiesWithAmountCount > 0 && liabilitiesWithPaymentInputCount === 0;
  var totalMonthlyDebtPayment = debtRows.reduce(function (acc, row) {
    return acc + row.monthlyPaymentAmount;
  }, 0);
  var recurrentAnnualIncome = sumAnnualByType(annualIncomeEntries, 'incomeType', 'recurrent');
  var monthlyIncome =
    Number.isFinite(recurrentAnnualIncome) && recurrentAnnualIncome > 0
      ? recurrentAnnualIncome / 12
      : null;
  var debtPaymentToIncome =
    liabilitiesValue <= 0
      ? 0
      : monthlyIncome == null || monthlyIncome <= 0 || hasNoDebtPaymentInputs
        ? null
        : totalMonthlyDebtPayment / monthlyIncome;
  var highInterestDebtThresholdPct = 8;
  var highInterestDebtValue = debtRows.reduce(function (acc, row) {
    return row.taePct != null && row.taePct >= highInterestDebtThresholdPct
      ? acc + row.amountBase
      : acc;
  }, 0);
  return {
    topLiabilityShare: topLiabilityShare,
    maxLiabilityTaePct: maxLiabilityTaePct,
    weightedLiabilityTaePct: weightedLiabilityTaePct,
    hasNoDebtPaymentInputs: hasNoDebtPaymentInputs,
    debtPaymentToIncome: debtPaymentToIncome,
    highInterestDebtShare: liabilitiesValue > 0 ? highInterestDebtValue / liabilitiesValue : null,
  };
}
function computePhase3ExpenseCoverageMetrics(params) {
  var annualExpenseEntries = params.annualExpenseEntries,
    emergencyLiquidAssetsValue = params.emergencyLiquidAssetsValue;
  var structuralOperatingExpense = annualExpenseEntries.reduce(function (acc, entry) {
    var _a;
    if (expenseTimeProfile(entry) !== 'structural_recurrent') return acc;
    return expenseCashflowRole(entry) === 'operating'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
  var temporaryCommitmentExpense = annualExpenseEntries.reduce(function (acc, entry) {
    var _a;
    if (expenseTimeProfile(entry) !== 'term_recurrent') return acc;
    return expenseCashflowRole(entry) === 'temporary_commitment'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
  var structuralOperatingMonthlyExpense =
    structuralOperatingExpense > 0 ? structuralOperatingExpense / 12 : null;
  var currentCommittedMonthlyExpense =
    structuralOperatingExpense + temporaryCommitmentExpense > 0
      ? (structuralOperatingExpense + temporaryCommitmentExpense) / 12
      : null;
  return {
    emergencyCoverageMonthsBase:
      structuralOperatingMonthlyExpense != null && structuralOperatingMonthlyExpense > 0
        ? emergencyLiquidAssetsValue / structuralOperatingMonthlyExpense
        : null,
    emergencyCoverageMonthsCommitted:
      currentCommittedMonthlyExpense != null && currentCommittedMonthlyExpense > 0
        ? emergencyLiquidAssetsValue / currentCommittedMonthlyExpense
        : null,
  };
}
function computePhase2CashFlowAdjustedScore(input) {
  var incomeTimeProfile = function (entry) {
    var _a;
    return (_a = entry.timeProfile) !== null && _a !== void 0
      ? _a
      : entry.incomeType === 'one_off'
        ? 'one_off'
        : 'structural_recurrent';
  };
  var recurrentAnnualIncome = input.annualIncomeEntries.reduce(function (acc, entry) {
    var _a;
    var profile = incomeTimeProfile(entry);
    if (profile === 'one_off') return acc;
    return acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0);
  }, 0);
  var structuralOperatingExpense = input.annualExpenseEntries.reduce(function (acc, entry) {
    var _a;
    if (expenseTimeProfile(entry) !== 'structural_recurrent') return acc;
    return expenseCashflowRole(entry) === 'operating'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
  var temporaryCommitmentExpense = input.annualExpenseEntries.reduce(function (acc, entry) {
    var _a;
    if (expenseTimeProfile(entry) !== 'term_recurrent') return acc;
    return expenseCashflowRole(entry) === 'temporary_commitment'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
  var structuralOperatingRatio =
    recurrentAnnualIncome > 0 ? structuralOperatingExpense / recurrentAnnualIncome : null;
  var committedLoadRatio =
    recurrentAnnualIncome > 0
      ? (structuralOperatingExpense + temporaryCommitmentExpense) / recurrentAnnualIncome
      : null;
  var temporaryCommitmentRatio =
    recurrentAnnualIncome > 0 ? temporaryCommitmentExpense / recurrentAnnualIncome : null;
  var oneOffIncome = input.annualIncomeEntries.reduce(function (acc, entry) {
    var _a;
    return incomeTimeProfile(entry) === 'one_off'
      ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
      : acc;
  }, 0);
  var totalAnnualIncome = recurrentAnnualIncome + oneOffIncome;
  var totalAnnualExpense = input.annualExpenseEntries.reduce(function (acc, entry) {
    var _a;
    return acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0);
  }, 0);
  var totalAnnualCashFlowRatio =
    recurrentAnnualIncome > 0
      ? (totalAnnualIncome - totalAnnualExpense) / recurrentAnnualIncome
      : null;
  // Total annual flow (including patrimonial allocation and one-offs) is informative and should
  // modestly affect the score, especially when the year closes with a net deficit.
  var totalAnnualCashFlowScore = linearScoreIncreasing(totalAnnualCashFlowRatio, -0.2, 0.2);
  return weightedScore([
    { score: linearScoreDecreasing(structuralOperatingRatio, 0.5, 1.0), weight: 0.4 },
    { score: linearScoreDecreasing(committedLoadRatio, 0.65, 1.05), weight: 0.35 },
    { score: linearScoreDecreasing(temporaryCommitmentRatio, 0.05, 0.35), weight: 0.15 },
    { score: totalAnnualCashFlowScore, weight: 0.1 },
  ]);
}
function computeGuidePhaseDiagnostics(input) {
  var _a;
  var summary = input.summary,
    assets = input.assets,
    liabilities = input.liabilities,
    annualIncomeEntries = input.annualIncomeEntries;
  var annualExpenseEntries = (_a = input.annualExpenseEntries) !== null && _a !== void 0 ? _a : [];
  var activeAssets = assets.filter(function (asset) {
    return asset.is_active;
  });
  var activeLiabilities = liabilities.filter(function (liability) {
    return liability.is_active;
  });
  var assetsValue = Math.max(
    0,
    toNumber(summary === null || summary === void 0 ? void 0 : summary.total_assets),
  );
  var liabilitiesValue = Math.max(
    0,
    toNumber(summary === null || summary === void 0 ? void 0 : summary.total_liabilities),
  );
  var unbackedDebtValue = Math.max(
    0,
    toNumber(summary === null || summary === void 0 ? void 0 : summary.liabilities_unbacked),
  );
  var _b = computeAssetLiquidityMetrics({
      summary: summary,
      activeAssets: activeAssets,
      assetsValue: assetsValue,
    }),
    illiquidAssetsShare = _b.illiquidAssetsShare,
    emergencyLiquidAssetsValue = _b.emergencyLiquidAssetsValue,
    emergencyLiquidityToAssets = _b.emergencyLiquidityToAssets,
    immediateLiquidityShareWithinEmergency = _b.immediateLiquidityShareWithinEmergency,
    topAssetShare = _b.topAssetShare,
    diversificationIndex = _b.diversificationIndex;
  var unbackedDebtToAssets = assetsValue > 0 ? unbackedDebtValue / assetsValue : null;
  var unbackedDebtToLiabilities =
    liabilitiesValue > 0 ? unbackedDebtValue / liabilitiesValue : null;
  var debtRows = buildDebtRows(activeLiabilities);
  var _c = computeDebtMetrics({
      debtRows: debtRows,
      liabilitiesValue: liabilitiesValue,
      annualIncomeEntries: annualIncomeEntries,
    }),
    topLiabilityShare = _c.topLiabilityShare,
    maxLiabilityTaePct = _c.maxLiabilityTaePct,
    weightedLiabilityTaePct = _c.weightedLiabilityTaePct,
    hasNoDebtPaymentInputs = _c.hasNoDebtPaymentInputs,
    debtPaymentToIncome = _c.debtPaymentToIncome,
    highInterestDebtShare = _c.highInterestDebtShare;
  var phase4SupportScore = weightedScore([
    { score: linearScoreDecreasing(unbackedDebtToAssets, 0.05, 0.35), weight: 0.5 },
    { score: linearScoreDecreasing(illiquidAssetsShare, 0.25, 0.8), weight: 0.5 },
  ]);
  var phase4RiskDistributionScore = weightedScore([
    { score: linearScoreDecreasing(topAssetShare, 0.4, 0.9), weight: 0.5 },
    { score: linearScoreIncreasing(diversificationIndex, 0.2, 0.8), weight: 0.5 },
  ]);
  var phase4GlobalScore = weightedScore([
    { score: phase4SupportScore, weight: 0.5 },
    { score: phase4RiskDistributionScore, weight: 0.5 },
  ]);
  var phase1DebtCostScore = weightedScore([
    { score: linearScoreDecreasing(maxLiabilityTaePct, 0.5, 10), weight: 0.4 },
    { score: linearScoreDecreasing(weightedLiabilityTaePct, 0.5, 10), weight: 0.4 },
    {
      score: hasNoDebtPaymentInputs ? 100 : linearScoreDecreasing(debtPaymentToIncome, 0.15, 0.6),
      weight: 0.2,
    },
  ]);
  var phase1DebtRiskScore = weightedScore([
    { score: linearScoreDecreasing(unbackedDebtToLiabilities, 0.01, 0.5), weight: 0.4 },
    { score: linearScoreDecreasing(topLiabilityShare, 0.25, 0.95), weight: 0.3 },
    { score: linearScoreDecreasing(highInterestDebtShare, 0.05, 0.6), weight: 0.3 },
  ]);
  var phase1GlobalScore = weightedScore([
    { score: phase1DebtCostScore, weight: 0.5 },
    { score: phase1DebtRiskScore, weight: 0.5 },
  ]);
  var phase2GlobalScore = computePhase2CashFlowAdjustedScore({
    annualIncomeEntries: annualIncomeEntries,
    annualExpenseEntries: annualExpenseEntries,
  });
  var _d = computePhase3ExpenseCoverageMetrics({
      annualExpenseEntries: annualExpenseEntries,
      emergencyLiquidAssetsValue: emergencyLiquidAssetsValue,
    }),
    emergencyCoverageMonthsBase = _d.emergencyCoverageMonthsBase,
    emergencyCoverageMonthsCommitted = _d.emergencyCoverageMonthsCommitted;
  var phase3GlobalScore = weightedScore([
    { score: linearScoreIncreasing(emergencyCoverageMonthsBase, 3, 12), weight: 0.45 },
    { score: linearScoreIncreasing(emergencyCoverageMonthsCommitted, 3, 12), weight: 0.25 },
    { score: linearScoreIncreasing(emergencyLiquidityToAssets, 0.05, 0.3), weight: 0.15 },
    {
      score: linearScoreIncreasing(immediateLiquidityShareWithinEmergency, 0.4, 0.85),
      weight: 0.15,
    },
  ]);
  return {
    phase1GlobalScore: phase1GlobalScore,
    phase2GlobalScore: phase2GlobalScore,
    phase3GlobalScore: phase3GlobalScore,
    phase4GlobalScore: phase4GlobalScore,
  };
}
