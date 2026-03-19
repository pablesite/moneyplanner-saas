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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var accounting_1 = require('@/domains/accounting');
var BaseModal_vue_1 = require('@/domains/ui/components/BaseModal.vue');
var _h = (0, accounting_1.useAccountingPage)(),
  loading = _h.loading,
  accountCreationLoading = _h.accountCreationLoading,
  accountActivationLoading = _h.accountActivationLoading,
  transactionCreationLoading = _h.transactionCreationLoading,
  importPreviewLoading = _h.importPreviewLoading,
  importCommitLoading = _h.importCommitLoading,
  error = _h.error,
  successMessage = _h.successMessage,
  accounts = _h.accounts,
  transactions = _h.transactions,
  moneyWizImportPreview = _h.moneyWizImportPreview,
  selectedYear = _h.selectedYear,
  yearOptions = _h.yearOptions,
  monthOptions = _h.monthOptions,
  accountTypeOptions = _h.accountTypeOptions,
  manualPositionTypeOptions = _h.manualPositionTypeOptions,
  quickMovementTypeOptions = _h.quickMovementTypeOptions,
  editMovementTypeOptions = _h.editMovementTypeOptions,
  editAccountOptions = _h.editAccountOptions,
  editCounterpartyOptions = _h.editCounterpartyOptions,
  editCounterpartyMissingHint = _h.editCounterpartyMissingHint,
  editKindNeedsCounterparty = _h.editKindNeedsCounterparty,
  editKindNeedsClassification = _h.editKindNeedsClassification,
  editCounterpartyLabel = _h.editCounterpartyLabel,
  editSelectedAccountCurrentBalance = _h.editSelectedAccountCurrentBalance,
  editCategoryOptions = _h.editCategoryOptions,
  editSubcategoryOptions = _h.editSubcategoryOptions,
  activationForm = _h.activationForm,
  moneyWizImportFile = _h.moneyWizImportFile,
  quickEntryForm = _h.quickEntryForm,
  editTransactionForm = _h.editTransactionForm,
  activityFilters = _h.activityFilters,
  liquidityAccounts = _h.liquidityAccounts,
  availableManualPositionOptions = _h.availableManualPositionOptions,
  accountDisplayName = _h.accountDisplayName,
  hasAvailableManualPositions = _h.hasAvailableManualPositions,
  annualIncomeOptionsCompatible = _h.annualIncomeOptionsCompatible,
  annualExpenseOptionsCompatible = _h.annualExpenseOptionsCompatible,
  quickEntryNeedsClassification = _h.quickEntryNeedsClassification,
  quickCategoryOptions = _h.quickCategoryOptions,
  quickSubcategoryOptions = _h.quickSubcategoryOptions,
  transferCounterpartyOptions = _h.transferCounterpartyOptions,
  investmentCounterpartyOptions = _h.investmentCounterpartyOptions,
  liabilityCounterpartyOptions = _h.liabilityCounterpartyOptions,
  debtInterestOptions = _h.debtInterestOptions,
  quickEntryReady = _h.quickEntryReady,
  editEntryReady = _h.editEntryReady,
  summaryRows = _h.summaryRows,
  activeTab = _h.activeTab,
  cuentasSelectedAccountId = _h.cuentasSelectedAccountId,
  cuentasSelectedAccount = _h.cuentasSelectedAccount,
  cuentasDateFrom = _h.cuentasDateFrom,
  cuentasDateTo = _h.cuentasDateTo,
  cuentasRawTransactions = _h.cuentasRawTransactions,
  cuentasVisibleTransactions = _h.cuentasVisibleTransactions,
  cuentasHasMore = _h.cuentasHasMore,
  loadMoreCuentas = _h.loadMoreCuentas,
  todosDateFrom = _h.todosDateFrom,
  todosDateTo = _h.todosDateTo,
  todosRawTransactions = _h.todosRawTransactions,
  todosVisibleTransactions = _h.todosVisibleTransactions,
  todosHasMore = _h.todosHasMore,
  loadMoreTodos = _h.loadMoreTodos,
  transactionMainAmount = _h.transactionMainAmount,
  activityKindLabel = _h.activityKindLabel,
  reloadPeriod = _h.reloadPeriod,
  activateNetWorthPositions = _h.activateNetWorthPositions,
  removeNetWorthTracking = _h.removeNetWorthTracking,
  deleteAccount = _h.deleteAccount,
  deleteTransaction = _h.deleteTransaction,
  openTransactionForEditing = _h.openTransactionForEditing,
  setMoneyWizImportFile = _h.setMoneyWizImportFile,
  previewMoneyWizImport = _h.previewMoneyWizImport,
  commitMoneyWizImport = _h.commitMoneyWizImport,
  submitQuickEntry = _h.submitQuickEntry,
  submitEditedTransaction = _h.submitEditedTransaction;
function toNumber(raw) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(',', '.');
  var parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
function formatDate(isoDate) {
  var d = new Date(isoDate + 'T00:00:00');
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(d);
}
function formatMoney(value, currency) {
  if (currency === void 0) {
    currency = 'EUR';
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'EUR' ? 2 : undefined,
    maximumFractionDigits: 2,
  }).format(value);
}
function formatCompact(raw, currency) {
  if (currency === void 0) {
    currency = 'EUR';
  }
  return formatMoney(toNumber(raw), currency);
}
function monthLabel(month) {
  var _a, _b;
  return (_b =
    (_a = monthOptions.find(function (option) {
      return option.value === month;
    })) === null || _a === void 0
      ? void 0
      : _a.label.slice(0, 3)) !== null && _b !== void 0
    ? _b
    : String(month).padStart(2, '0');
}
var accountsByType = (0, vue_1.computed)(function () {
  var groups = new Map();
  accounts.value.forEach(function (account) {
    var _a;
    var existing = (_a = groups.get(account.account_type)) !== null && _a !== void 0 ? _a : [];
    existing.push(account);
    groups.set(account.account_type, existing);
  });
  return groups;
});
var accountingAssetsTotal = (0, vue_1.computed)(function () {
  var _a;
  return ((_a = accountsByType.value.get('asset')) !== null && _a !== void 0 ? _a : []).reduce(
    function (total, account) {
      return total + toNumber(account.current_balance);
    },
    0,
  );
});
var accountingLiabilitiesTotal = (0, vue_1.computed)(function () {
  var _a;
  return ((_a = accountsByType.value.get('liability')) !== null && _a !== void 0 ? _a : []).reduce(
    function (total, account) {
      return total + toNumber(account.current_balance);
    },
    0,
  );
});
var accountingNetBalance = (0, vue_1.computed)(function () {
  return accountingAssetsTotal.value - accountingLiabilitiesTotal.value;
});
var operationalAccountTypeOptions = (0, vue_1.computed)(function () {
  return accountTypeOptions.filter(function (type) {
    return type.value === 'asset' || type.value === 'liability';
  });
});
var operationalAccounts = (0, vue_1.computed)(function () {
  return operationalAccountTypeOptions.value.flatMap(function (type) {
    var _a;
    return (_a = accountsByType.value.get(type.value)) !== null && _a !== void 0 ? _a : [];
  });
});
var technicalAccountTypeOptions = (0, vue_1.computed)(function () {
  return accountTypeOptions.filter(function (type) {
    return type.value !== 'asset' && type.value !== 'liability';
  });
});
var hasTechnicalAccounts = (0, vue_1.computed)(function () {
  return technicalAccountTypeOptions.value.some(function (type) {
    var _a, _b;
    return (
      ((_b =
        (_a = accountsByType.value.get(type.value)) === null || _a === void 0
          ? void 0
          : _a.length) !== null && _b !== void 0
        ? _b
        : 0) > 0
    );
  });
});
var hasCompatibleAnnualPlanOptions = (0, vue_1.computed)(function () {
  if (quickEntryForm.movement_type === 'income') {
    return annualIncomeOptionsCompatible.value.length > 0;
  }
  if (
    quickEntryForm.movement_type === 'expense' ||
    quickEntryForm.movement_type === 'debt_payment'
  ) {
    return annualExpenseOptionsCompatible.value.length > 0;
  }
  return false;
});
function formatSignedMoney(value, currency) {
  if (currency === void 0) {
    currency = 'EUR';
  }
  if (value > 0) return '+'.concat(formatMoney(value, currency));
  if (value < 0) return '-'.concat(formatMoney(Math.abs(value), currency));
  return formatMoney(0, currency);
}
var showActivationModal = (0, vue_1.ref)(false);
var showEditTransactionModal = (0, vue_1.ref)(false);
var showMoneyWizImportModal = (0, vue_1.ref)(false);
var showQuickEntryModal = (0, vue_1.ref)(false);
var activationQuery = (0, vue_1.ref)('');
var activationOperationalOnly = (0, vue_1.ref)(true);
var selectedActivationIds = (0, vue_1.ref)([]);
var assetActivationCategoryOrder = ['cash', 'investments', 'real_estate', 'furnishings', 'other'];
var assetActivationCategoryLabels = {
  cash: 'Liquidez',
  investments: 'Inversiones',
  real_estate: 'Inmuebles',
  furnishings: 'Mobiliario',
  other: 'Otros',
};
var liabilityActivationCategoryOrder = ['mortgage', 'personal_loan', 'credit_card', 'other'];
var liabilityActivationCategoryLabels = {
  mortgage: 'Hipoteca',
  personal_loan: 'Prestamo personal',
  credit_card: 'Tarjeta',
  other: 'Otros',
};
var activationOperationalCategories = new Set(['cash', 'investments']);
var filteredManualPositionOptions = (0, vue_1.computed)(function () {
  var base =
    activationForm.position_type === 'liability'
      ? availableManualPositionOptions.value
      : activationOperationalOnly.value
        ? availableManualPositionOptions.value.filter(function (position) {
            var _a;
            return activationOperationalCategories.has(
              String((_a = position.category) !== null && _a !== void 0 ? _a : '').trim(),
            );
          })
        : availableManualPositionOptions.value;
  var query = activationQuery.value.trim().toLowerCase();
  if (!query) return base;
  return base.filter(function (position) {
    return ''.concat(position.name, ' ').concat(position.currency).toLowerCase().includes(query);
  });
});
var activationExcludedByOperationalFilter = (0, vue_1.computed)(function () {
  if (activationForm.position_type === 'liability') return 0;
  if (!activationOperationalOnly.value) return 0;
  return Math.max(
    availableManualPositionOptions.value.length - filteredManualPositionOptions.value.length,
    0,
  );
});
var groupedManualPositionOptions = (0, vue_1.computed)(function () {
  var groups = new Map();
  filteredManualPositionOptions.value.forEach(function (position) {
    var _a, _b;
    var key =
      String((_a = position.category) !== null && _a !== void 0 ? _a : 'other').trim() || 'other';
    var existing = (_b = groups.get(key)) !== null && _b !== void 0 ? _b : [];
    existing.push(position);
    groups.set(key, existing);
  });
  var order =
    activationForm.position_type === 'asset'
      ? assetActivationCategoryOrder
      : liabilityActivationCategoryOrder;
  var labels =
    activationForm.position_type === 'asset'
      ? assetActivationCategoryLabels
      : liabilityActivationCategoryLabels;
  var orderedKeys = __spreadArray(
    __spreadArray(
      [],
      order.filter(function (key) {
        return groups.has(key);
      }),
      true,
    ),
    Array.from(groups.keys()).filter(function (key) {
      return !order.includes(key);
    }),
    true,
  );
  return orderedKeys.map(function (key) {
    var _a, _b;
    return {
      key: key,
      label: (_a = labels[key]) !== null && _a !== void 0 ? _a : key,
      positions: ((_b = groups.get(key)) !== null && _b !== void 0 ? _b : [])
        .slice()
        .sort(function (a, b) {
          return a.name.localeCompare(b.name, 'es');
        }),
    };
  });
});
var allFilteredSelected = (0, vue_1.computed)(function () {
  return (
    filteredManualPositionOptions.value.length > 0 &&
    filteredManualPositionOptions.value.every(function (position) {
      return selectedActivationIds.value.includes(position.id);
    })
  );
});
function openActivationModal() {
  selectedActivationIds.value = [];
  activationQuery.value = '';
  activationOperationalOnly.value = true;
  showActivationModal.value = true;
}
function toggleSelectAllFiltered() {
  if (allFilteredSelected.value) {
    var filteredIds_1 = new Set(
      filteredManualPositionOptions.value.map(function (position) {
        return position.id;
      }),
    );
    selectedActivationIds.value = selectedActivationIds.value.filter(function (id) {
      return !filteredIds_1.has(id);
    });
    return;
  }
  var merged = new Set(selectedActivationIds.value);
  filteredManualPositionOptions.value.forEach(function (position) {
    return merged.add(position.id);
  });
  selectedActivationIds.value = Array.from(merged);
}
function activatePositionFromModal() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!selectedActivationIds.value.length) return [2 /*return*/];
          return [
            4 /*yield*/,
            activateNetWorthPositions(
              activationForm.position_type,
              selectedActivationIds.value.map(function (id) {
                return Number(id);
              }),
            ),
          ];
        case 1:
          _a.sent();
          selectedActivationIds.value = [];
          activationQuery.value = '';
          showActivationModal.value = false;
          return [2 /*return*/];
      }
    });
  });
}
function submitQuickEntryFromModal() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, submitQuickEntry()];
        case 1:
          _a.sent();
          showQuickEntryModal.value = false;
          return [2 /*return*/];
      }
    });
  });
}
function handleMoneyWizFileChange(event) {
  var _a, _b;
  var input = event.target;
  var file =
    (_b =
      (_a = input === null || input === void 0 ? void 0 : input.files) === null || _a === void 0
        ? void 0
        : _a[0]) !== null && _b !== void 0
      ? _b
      : null;
  setMoneyWizImportFile(file);
}
var moneyWizPreviewRows = (0, vue_1.computed)(function () {
  var _a, _b;
  return (_b =
    (_a = moneyWizImportPreview.value) === null || _a === void 0 ? void 0 : _a.rows.slice(0, 6)) !==
    null && _b !== void 0
    ? _b
    : [];
});
var moneyWizPreviewWarnings = (0, vue_1.computed)(function () {
  var _a, _b;
  return (_b =
    (_a = moneyWizImportPreview.value) === null || _a === void 0 ? void 0 : _a.warnings) !== null &&
    _b !== void 0
    ? _b
    : [];
});
var moneyWizCanCommit = (0, vue_1.computed)(function () {
  return (
    moneyWizImportFile.value != null &&
    moneyWizImportPreview.value != null &&
    moneyWizImportPreview.value.error_row_count === 0
  );
});
function previewMoneyWizImportFromModal() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, previewMoneyWizImport()];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function commitMoneyWizImportFromModal() {
  return __awaiter(this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, commitMoneyWizImport()];
        case 1:
          result = _a.sent();
          if (result) {
            showMoneyWizImportModal.value = false;
          }
          return [2 /*return*/];
      }
    });
  });
}
function openEditTransactionModal(transactionId) {
  if (openTransactionForEditing(transactionId)) {
    showEditTransactionModal.value = true;
  }
}
function submitEditedTransactionFromModal() {
  return __awaiter(this, void 0, void 0, function () {
    var saved;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, submitEditedTransaction()];
        case 1:
          saved = _a.sent();
          if (saved) {
            showEditTransactionModal.value = false;
          }
          return [2 /*return*/];
      }
    });
  });
}
function deleteTransactionFromTimeline(transactionId, description) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, deleteTransaction(transactionId, description)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
(0, vue_1.watch)(availableManualPositionOptions, function (options) {
  var optionIds = new Set(
    options.map(function (option) {
      return option.id;
    }),
  );
  selectedActivationIds.value = selectedActivationIds.value.filter(function (id) {
    return optionIds.has(id);
  });
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ui-accounting-hero-right']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-hero-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-kpi-card-primary']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-hero-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-cashflow-strip']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-category-summary']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-account-summary']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-technical']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-head']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-readonly']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-readonly']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-copy']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-copy']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-amount-wrap']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-amount-wrap']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-annual-link']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-annual-link']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-annual-link']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-annual-link']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-dropzone']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-card']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpis']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-option']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-option']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-meta']} */ /** @type {__VLS_StyleScopedClasses['ui-period-bar']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-hero-right']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-hero-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-cashflow-strip']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-actions']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-edit-simple']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-dates']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-entry-editor-row']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-readonly']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpis']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-import-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-advanced-summary']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'container ui-page-shell' }));
/** @type {__VLS_StyleScopedClasses['container']} */ /** @type {__VLS_StyleScopedClasses['ui-page-shell']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.section,
  __VLS_intrinsics.section,
)(__assign({ class: 'ui-section-card ui-accounting-hero-panel' }));
/** @type {__VLS_StyleScopedClasses['ui-section-card']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-hero-panel']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-page-head' }));
/** @type {__VLS_StyleScopedClasses['ui-page-head']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)({});
__VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-page-eyebrow' }));
/** @type {__VLS_StyleScopedClasses['ui-page-eyebrow']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h1,
  __VLS_intrinsics.h1,
)(__assign({ class: 'ui-accounting-hero-title' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-hero-title']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-hero-right' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-hero-right']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-page-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-page-actions']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(__assign({ onClick: __VLS_ctx.openActivationModal }, { class: 'btn' }), {
    type: 'button',
    'aria-label': 'Activar tracking contable',
    title: 'Activar tracking contable',
    disabled: !__VLS_ctx.hasAvailableManualPositions,
  }),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.showMoneyWizImportModal = true;
          // @ts-ignore
          [openActivationModal, hasAvailableManualPositions, showMoneyWizImportModal];
        },
      },
      { class: 'btn' },
    ),
    { type: 'button', 'aria-label': 'Importar CSV MoneyWiz', title: 'Importar CSV MoneyWiz' },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_asFunctionalElement1(
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
          __VLS_ctx.showQuickEntryModal = true;
          // @ts-ignore
          [showQuickEntryModal];
        },
      },
      { class: 'btn btn-primary ui-accounting-cta' },
    ),
    {
      type: 'button',
      'aria-label': 'Registrar movimiento diario',
      title: 'Registrar movimiento diario',
      disabled: !__VLS_ctx.liquidityAccounts.length,
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-cta']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-net-kpi' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-net-kpi']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-kpi-card ui-kpi-card-primary' }));
/** @type {__VLS_StyleScopedClasses['ui-kpi-card']} */ /** @type {__VLS_StyleScopedClasses['ui-kpi-card-primary']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-kpi-label' }));
/** @type {__VLS_StyleScopedClasses['ui-kpi-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.strong,
  __VLS_intrinsics.strong,
)(__assign({ class: 'ui-kpi-value' }));
/** @type {__VLS_StyleScopedClasses['ui-kpi-value']} */ __VLS_ctx.formatMoney(
  __VLS_ctx.accountingNetBalance,
);
__VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-kpi-meta' }));
/** @type {__VLS_StyleScopedClasses['ui-kpi-meta']} */ if (__VLS_ctx.error) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-state-block ui-state-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ /** @type {__VLS_StyleScopedClasses['ui-state-error']} */ __VLS_ctx.error;
}
if (__VLS_ctx.successMessage) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-state-block ui-state-success' }));
  /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ /** @type {__VLS_StyleScopedClasses['ui-state-success']} */ __VLS_ctx.successMessage;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-view-tabs' }));
/** @type {__VLS_StyleScopedClasses['ui-view-tabs']} */ __VLS_asFunctionalElement1(
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
            __VLS_ctx.activeTab = 'cuentas';
            // @ts-ignore
            [
              liquidityAccounts,
              formatMoney,
              accountingNetBalance,
              error,
              error,
              successMessage,
              successMessage,
              activeTab,
            ];
          },
        },
        { class: 'ui-view-tab' },
      ),
      { class: { 'ui-view-tab-active': __VLS_ctx.activeTab === 'cuentas' } },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-view-tab']} */ /** @type {__VLS_StyleScopedClasses['ui-view-tab-active']} */ __VLS_asFunctionalElement1(
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
            __VLS_ctx.activeTab = 'todos';
            // @ts-ignore
            [activeTab, activeTab];
          },
        },
        { class: 'ui-view-tab' },
      ),
      { class: { 'ui-view-tab-active': __VLS_ctx.activeTab === 'todos' } },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-view-tab']} */ /** @type {__VLS_StyleScopedClasses['ui-view-tab-active']} */ __VLS_asFunctionalElement1(
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
            __VLS_ctx.activeTab = 'estadisticas';
            // @ts-ignore
            [activeTab, activeTab];
          },
        },
        { class: 'ui-view-tab' },
      ),
      { class: { 'ui-view-tab-active': __VLS_ctx.activeTab === 'estadisticas' } },
    ),
    { type: 'button' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-view-tab']} */ /** @type {__VLS_StyleScopedClasses['ui-view-tab-active']} */ if (
  __VLS_ctx.activeTab === 'cuentas'
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.section,
    __VLS_intrinsics.section,
  )(__assign({ class: 'ui-section-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-copy' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-copy']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h2,
    __VLS_intrinsics.h2,
  )(__assign({ class: 'ui-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-title']} */ if (
    __VLS_ctx.cuentasSelectedAccount
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-section-subtitle' }));
    /** @type {__VLS_StyleScopedClasses['ui-section-subtitle']} */ __VLS_ctx
      .cuentasVisibleTransactions.length;
    __VLS_ctx.cuentasRawTransactions.length;
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-section-subtitle' }));
    /** @type {__VLS_StyleScopedClasses['ui-section-subtitle']} */
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-action-bar' }));
  /** @type {__VLS_StyleScopedClasses['ui-action-bar']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.cuentasSelectedAccountId },
      { class: 'select ui-accounting-filter-select' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-filter-select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  for (var _i = 0, _j = __VLS_vFor(__VLS_ctx.operationalAccounts); _i < _j.length; _i++) {
    var account = _j[_i][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    __VLS_ctx.accountDisplayName(account);
    __VLS_ctx.formatCompact(account.current_balance, account.currency);
    // @ts-ignore
    [
      activeTab,
      activeTab,
      cuentasSelectedAccount,
      cuentasVisibleTransactions,
      cuentasRawTransactions,
      cuentasSelectedAccountId,
      operationalAccounts,
      accountDisplayName,
      formatCompact,
    ];
  }
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(__assign({ type: 'date' }, { class: 'input ui-accounting-date-filter' }), {
      title: 'Desde',
    }),
  );
  __VLS_ctx.cuentasDateFrom;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-date-filter']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(__assign({ type: 'date' }, { class: 'input ui-accounting-date-filter' }), {
      title: 'Hasta',
    }),
  );
  __VLS_ctx.cuentasDateTo;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-date-filter']} */ if (
    __VLS_ctx.loading &&
    !__VLS_ctx.transactions.length
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-loading' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */
    /** @type {__VLS_StyleScopedClasses['ui-state-loading']} */
  } else if (!__VLS_ctx.cuentasSelectedAccountId) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-empty' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */
    /** @type {__VLS_StyleScopedClasses['ui-state-empty']} */
  } else if (!__VLS_ctx.cuentasRawTransactions.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-empty' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */
    /** @type {__VLS_StyleScopedClasses['ui-state-empty']} */
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.ul,
      __VLS_intrinsics.ul,
    )(__assign({ class: 'ui-entry-list' }));
    /** @type {__VLS_StyleScopedClasses['ui-entry-list']} */ var _loop_1 = function (movement) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.li,
        __VLS_intrinsics.li,
      )(__assign({ key: movement.id }, { class: 'ui-entry-row' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-entry-date' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-date']} */ __VLS_ctx.formatDate(
        movement.booking_date,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-entry-body' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-body']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.strong,
        __VLS_intrinsics.strong,
      )(__assign({ class: 'ui-entry-desc' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-desc']} */ movement.description;
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-action-bar ui-entry-tags' }));
      /** @type {__VLS_StyleScopedClasses['ui-action-bar']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-tags']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-type-badge ui-type-badge-'.concat(movement.tone) }));
      __VLS_ctx.activityKindLabel(movement);
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-entry-status' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-status']} */ movement.status === 'posted'
        ? '●'
        : '○';
      movement.origin !== 'system' ? movement.origin : '';
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(
        __assign(
          { class: 'ui-accounting-balance-delta' },
          { class: 'ui-accounting-balance-delta-'.concat(movement.tone) },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['ui-accounting-balance-delta']} */ __VLS_ctx.formatSignedMoney(
        movement.impactValue,
        (_a = __VLS_ctx.cuentasSelectedAccount) === null || _a === void 0 ? void 0 : _a.currency,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-entry-actions' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-actions']} */ if (
        movement.origin !== 'system'
      ) {
        __VLS_asFunctionalElement1(
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
                  if (!(__VLS_ctx.activeTab === 'cuentas')) return;
                  if (!!(__VLS_ctx.loading && !__VLS_ctx.transactions.length)) return;
                  if (!!!__VLS_ctx.cuentasSelectedAccountId) return;
                  if (!!!__VLS_ctx.cuentasRawTransactions.length) return;
                  if (!(movement.origin !== 'system')) return;
                  __VLS_ctx.openEditTransactionModal(movement.id);
                  // @ts-ignore
                  [
                    cuentasSelectedAccount,
                    cuentasVisibleTransactions,
                    cuentasRawTransactions,
                    cuentasSelectedAccountId,
                    cuentasDateFrom,
                    cuentasDateTo,
                    loading,
                    transactions,
                    formatDate,
                    activityKindLabel,
                    formatSignedMoney,
                    openEditTransactionModal,
                  ];
                },
              },
              { class: 'icon-btn ui-accounting-entry-action-btn' },
            ),
            {
              type: 'button',
              title: 'Editar movimiento',
              'aria-label': 'Editar movimiento',
              disabled: __VLS_ctx.transactionCreationLoading,
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */
        /** @type {__VLS_StyleScopedClasses['ui-accounting-entry-action-btn']} */
      }
      if (movement.origin !== 'system') {
        __VLS_asFunctionalElement1(
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
                  if (!(__VLS_ctx.activeTab === 'cuentas')) return;
                  if (!!(__VLS_ctx.loading && !__VLS_ctx.transactions.length)) return;
                  if (!!!__VLS_ctx.cuentasSelectedAccountId) return;
                  if (!!!__VLS_ctx.cuentasRawTransactions.length) return;
                  if (!(movement.origin !== 'system')) return;
                  __VLS_ctx.deleteTransactionFromTimeline(movement.id, movement.description);
                  // @ts-ignore
                  [transactionCreationLoading, deleteTransactionFromTimeline];
                },
              },
              { class: 'icon-btn ui-accounting-entry-action-btn' },
            ),
            {
              type: 'button',
              title: 'Eliminar movimiento',
              'aria-label': 'Eliminar movimiento',
              disabled: __VLS_ctx.transactionCreationLoading,
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */
        /** @type {__VLS_StyleScopedClasses['ui-accounting-entry-action-btn']} */
      }
      // @ts-ignore
      [transactionCreationLoading];
    };
    for (var _k = 0, _l = __VLS_vFor(__VLS_ctx.cuentasVisibleTransactions); _k < _l.length; _k++) {
      var movement = _l[_k][0];
      _loop_1(movement);
    }
  }
  if (__VLS_ctx.cuentasHasMore) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-load-more' }));
    /** @type {__VLS_StyleScopedClasses['ui-load-more']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button,
    )(
      __assign(__assign({ onClick: __VLS_ctx.loadMoreCuentas }, { class: 'btn' }), {
        type: 'button',
      }),
    );
    /** @type {__VLS_StyleScopedClasses['btn']} */
  } else if (__VLS_ctx.cuentasSelectedAccountId && __VLS_ctx.cuentasRawTransactions.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-load-more-hint' }));
    /** @type {__VLS_StyleScopedClasses['ui-load-more-hint']} */
  }
} else if (__VLS_ctx.activeTab === 'todos') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.section,
    __VLS_intrinsics.section,
  )(__assign({ class: 'ui-section-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-copy' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-copy']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h2,
    __VLS_intrinsics.h2,
  )(__assign({ class: 'ui-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-section-subtitle' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-subtitle']} */ __VLS_ctx.todosVisibleTransactions
    .length;
  __VLS_ctx.todosRawTransactions.length;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-action-bar' }));
  /** @type {__VLS_StyleScopedClasses['ui-action-bar']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ class: 'input ui-accounting-filter-input' }, { placeholder: 'Filtrar por texto' }));
  __VLS_ctx.activityFilters.query;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-filter-input']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.activityFilters.kind },
      { class: 'select ui-accounting-filter-select' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-filter-select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'all',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'income',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'expense',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'transfer',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'investment_purchase',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'debt_payment',
  });
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(__assign({ type: 'date' }, { class: 'input ui-accounting-date-filter' }), {
      title: 'Desde',
    }),
  );
  __VLS_ctx.todosDateFrom;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-date-filter']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(__assign({ type: 'date' }, { class: 'input ui-accounting-date-filter' }), {
      title: 'Hasta',
    }),
  );
  __VLS_ctx.todosDateTo;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-date-filter']} */ if (
    __VLS_ctx.loading &&
    !__VLS_ctx.transactions.length
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-loading' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */
    /** @type {__VLS_StyleScopedClasses['ui-state-loading']} */
  } else if (!__VLS_ctx.todosRawTransactions.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-empty' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */
    /** @type {__VLS_StyleScopedClasses['ui-state-empty']} */
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.ul,
      __VLS_intrinsics.ul,
    )(__assign({ class: 'ui-entry-list' }));
    /** @type {__VLS_StyleScopedClasses['ui-entry-list']} */ var _loop_2 = function (transaction) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.li,
        __VLS_intrinsics.li,
      )(__assign({ key: transaction.id }, { class: 'ui-entry-row' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-entry-date' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-date']} */ __VLS_ctx.formatDate(
        transaction.booking_date,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-entry-body' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-body']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.strong,
        __VLS_intrinsics.strong,
      )(__assign({ class: 'ui-entry-desc' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-desc']} */ transaction.description;
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-action-bar ui-entry-tags' }));
      /** @type {__VLS_StyleScopedClasses['ui-action-bar']} */ /** @type {__VLS_StyleScopedClasses['ui-entry-tags']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-type-badge' }));
      /** @type {__VLS_StyleScopedClasses['ui-type-badge']} */ __VLS_ctx.activityKindLabel(
        transaction,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-entry-status' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-status']} */ transaction.status === 'posted'
        ? '●'
        : '○';
      transaction.origin !== 'system' ? transaction.origin : '';
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-entry-accounts' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-accounts']} */ transaction.entries
        .map(function (e) {
          return e.account_name;
        })
        .join(' · ');
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-accounting-balance-delta ui-accounting-balance-delta-neutral' }));
      /** @type {__VLS_StyleScopedClasses['ui-accounting-balance-delta']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-balance-delta-neutral']} */ __VLS_ctx.formatMoney(
        __VLS_ctx.transactionMainAmount(transaction),
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-entry-actions' }));
      /** @type {__VLS_StyleScopedClasses['ui-entry-actions']} */ if (
        transaction.origin !== 'system'
      ) {
        __VLS_asFunctionalElement1(
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
                  if (!!(__VLS_ctx.activeTab === 'cuentas')) return;
                  if (!(__VLS_ctx.activeTab === 'todos')) return;
                  if (!!(__VLS_ctx.loading && !__VLS_ctx.transactions.length)) return;
                  if (!!!__VLS_ctx.todosRawTransactions.length) return;
                  if (!(transaction.origin !== 'system')) return;
                  __VLS_ctx.openEditTransactionModal(transaction.id);
                  // @ts-ignore
                  [
                    formatMoney,
                    activeTab,
                    cuentasRawTransactions,
                    cuentasSelectedAccountId,
                    loading,
                    transactions,
                    formatDate,
                    activityKindLabel,
                    openEditTransactionModal,
                    cuentasHasMore,
                    loadMoreCuentas,
                    todosVisibleTransactions,
                    todosVisibleTransactions,
                    todosRawTransactions,
                    todosRawTransactions,
                    activityFilters,
                    activityFilters,
                    todosDateFrom,
                    todosDateTo,
                    transactionMainAmount,
                  ];
                },
              },
              { class: 'icon-btn ui-accounting-entry-action-btn' },
            ),
            {
              type: 'button',
              title: 'Editar movimiento',
              'aria-label': 'Editar movimiento',
              disabled: __VLS_ctx.transactionCreationLoading,
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */
        /** @type {__VLS_StyleScopedClasses['ui-accounting-entry-action-btn']} */
      }
      if (transaction.origin !== 'system') {
        __VLS_asFunctionalElement1(
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
                  if (!!(__VLS_ctx.activeTab === 'cuentas')) return;
                  if (!(__VLS_ctx.activeTab === 'todos')) return;
                  if (!!(__VLS_ctx.loading && !__VLS_ctx.transactions.length)) return;
                  if (!!!__VLS_ctx.todosRawTransactions.length) return;
                  if (!(transaction.origin !== 'system')) return;
                  __VLS_ctx.deleteTransactionFromTimeline(transaction.id, transaction.description);
                  // @ts-ignore
                  [transactionCreationLoading, deleteTransactionFromTimeline];
                },
              },
              { class: 'icon-btn ui-accounting-entry-action-btn' },
            ),
            {
              type: 'button',
              title: 'Eliminar movimiento',
              'aria-label': 'Eliminar movimiento',
              disabled: __VLS_ctx.transactionCreationLoading,
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */
        /** @type {__VLS_StyleScopedClasses['ui-accounting-entry-action-btn']} */
      }
      // @ts-ignore
      [transactionCreationLoading];
    };
    for (var _m = 0, _o = __VLS_vFor(__VLS_ctx.todosVisibleTransactions); _m < _o.length; _m++) {
      var transaction = _o[_m][0];
      _loop_2(transaction);
    }
  }
  if (__VLS_ctx.todosHasMore) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-load-more' }));
    /** @type {__VLS_StyleScopedClasses['ui-load-more']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button,
    )(
      __assign(__assign({ onClick: __VLS_ctx.loadMoreTodos }, { class: 'btn' }), {
        type: 'button',
      }),
    );
    /** @type {__VLS_StyleScopedClasses['btn']} */
  } else if (__VLS_ctx.todosRawTransactions.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-load-more-hint' }));
    /** @type {__VLS_StyleScopedClasses['ui-load-more-hint']} */
  }
} else if (__VLS_ctx.activeTab === 'estadisticas') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.section,
    __VLS_intrinsics.section,
  )(__assign({ class: 'ui-section-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-section-copy' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-copy']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h2,
    __VLS_intrinsics.h2,
  )(__assign({ class: 'ui-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-section-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-period-bar' }));
  /** @type {__VLS_StyleScopedClasses['ui-period-bar']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-period-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-period-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(__assign({ onChange: __VLS_ctx.reloadPeriod }, { value: __VLS_ctx.selectedYear }), {
      class: 'select ui-period-select',
    }),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-period-select']} */ for (
    var _p = 0, _q = __VLS_vFor(__VLS_ctx.yearOptions);
    _p < _q.length;
    _p++
  ) {
    var year = _q[_p][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: year,
      value: year,
    });
    year;
    // @ts-ignore
    [
      activeTab,
      todosRawTransactions,
      todosHasMore,
      loadMoreTodos,
      reloadPeriod,
      selectedYear,
      yearOptions,
    ];
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-kpi-strip ui-kpi-strip-2col' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-strip']} */ /** @type {__VLS_StyleScopedClasses['ui-kpi-strip-2col']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-kpi-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-kpi-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.strong,
    __VLS_intrinsics.strong,
  )(__assign({ class: 'ui-kpi-value' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-value']} */ __VLS_ctx.formatMoney(
    __VLS_ctx.accountingAssetsTotal,
  );
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-kpi-meta' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-meta']} */ (
    (_b = __VLS_ctx.accountsByType.get('asset')) !== null && _b !== void 0 ? _b : []
  ).length;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-kpi-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-kpi-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.strong,
    __VLS_intrinsics.strong,
  )(__assign({ class: 'ui-kpi-value' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-value']} */ __VLS_ctx.formatMoney(
    __VLS_ctx.accountingLiabilitiesTotal,
  );
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-kpi-meta' }));
  /** @type {__VLS_StyleScopedClasses['ui-kpi-meta']} */ (
    (_c = __VLS_ctx.accountsByType.get('liability')) !== null && _c !== void 0 ? _c : []
  ).length;
  if (__VLS_ctx.summaryRows.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-cashflow-strip' }));
    /** @type {__VLS_StyleScopedClasses['ui-cashflow-strip']} */ for (
      var _r = 0, _s = __VLS_vFor(__VLS_ctx.summaryRows);
      _r < _s.length;
      _r++
    ) {
      var row = _s[_r][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ key: row.month }, { class: 'ui-cashflow-month' }));
      /** @type {__VLS_StyleScopedClasses['ui-cashflow-month']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-cashflow-month-label' }));
      /** @type {__VLS_StyleScopedClasses['ui-cashflow-month-label']} */ __VLS_ctx.monthLabel(
        row.month,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.strong,
        __VLS_intrinsics.strong,
      )(
        __assign(
          { class: 'ui-cashflow-month-value' },
          {
            class:
              row.incomeValue - row.expenseValue >= 0
                ? 'ui-cashflow-positive'
                : 'ui-cashflow-negative',
          },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['ui-cashflow-month-value']} */ __VLS_ctx.formatMoney(
        row.incomeValue - row.expenseValue,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.small,
        __VLS_intrinsics.small,
      )(__assign({ class: 'ui-cashflow-month-meta' }));
      /** @type {__VLS_StyleScopedClasses['ui-cashflow-month-meta']} */ __VLS_ctx.formatMoney(
        row.incomeValue,
      );
      __VLS_ctx.formatMoney(row.expenseValue);
      // @ts-ignore
      [
        formatMoney,
        formatMoney,
        formatMoney,
        formatMoney,
        formatMoney,
        accountingAssetsTotal,
        accountsByType,
        accountsByType,
        accountingLiabilitiesTotal,
        summaryRows,
        summaryRows,
        monthLabel,
      ];
    }
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-page-lead' }));
  /** @type {__VLS_StyleScopedClasses['ui-page-lead']} */ if (__VLS_ctx.hasTechnicalAccounts) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.details,
      __VLS_intrinsics.details,
    )(__assign({ class: 'ui-ledger-technical' }));
    /** @type {__VLS_StyleScopedClasses['ui-ledger-technical']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.summary,
      __VLS_intrinsics.summary,
    )({});
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-page-lead' }));
    /** @type {__VLS_StyleScopedClasses['ui-page-lead']} */ var _loop_3 = function (type) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.section,
        __VLS_intrinsics.section,
      )(__assign({ key: type.value }, { class: 'ui-ledger-technical-group' }));
      /** @type {__VLS_StyleScopedClasses['ui-ledger-technical-group']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-section-head ui-ledger-technical-head' }));
      /** @type {__VLS_StyleScopedClasses['ui-section-head']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-technical-head']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.strong,
        __VLS_intrinsics.strong,
      )({});
      type.label;
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-pro-chip' }));
      /** @type {__VLS_StyleScopedClasses['ui-pro-chip']} */ (
        _e =
          (_d = __VLS_ctx.accountsByType.get(type.value)) === null || _d === void 0
            ? void 0
            : _d.length
      ) !== null && _e !== void 0
        ? _e
        : 0;
      if (
        ((_g =
          (_f = __VLS_ctx.accountsByType.get(type.value)) === null || _f === void 0
            ? void 0
            : _f.length) !== null && _g !== void 0
          ? _g
          : 0) > 0
      ) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.ul,
          __VLS_intrinsics.ul,
        )(__assign({ class: 'ui-entry-list' }));
        /** @type {__VLS_StyleScopedClasses['ui-entry-list']} */ var _loop_6 = function (account) {
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.li,
            __VLS_intrinsics.li,
          )(__assign({ key: account.id }, { class: 'ui-entry-row' }));
          /** @type {__VLS_StyleScopedClasses['ui-entry-row']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.div,
            __VLS_intrinsics.div,
          )(__assign({ class: 'ui-ledger-account-meta ui-ledger-account-meta-stretch' }));
          /** @type {__VLS_StyleScopedClasses['ui-ledger-account-meta']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-account-meta-stretch']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.strong,
            __VLS_intrinsics.strong,
          )({});
          account.name;
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.div,
            __VLS_intrinsics.div,
          )(__assign({ class: 'ui-action-bar ui-ledger-account-chips' }));
          /** @type {__VLS_StyleScopedClasses['ui-action-bar']} */ /** @type {__VLS_StyleScopedClasses['ui-ledger-account-chips']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.span,
            __VLS_intrinsics.span,
          )(__assign({ class: 'ui-pro-chip' }));
          /** @type {__VLS_StyleScopedClasses['ui-pro-chip']} */ account.currency;
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.span,
            __VLS_intrinsics.span,
          )(__assign({ class: 'ui-pro-chip' }));
          /** @type {__VLS_StyleScopedClasses['ui-pro-chip']} */ account.origin;
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.div,
            __VLS_intrinsics.div,
          )(__assign({ class: 'ui-ledger-account-info' }));
          /** @type {__VLS_StyleScopedClasses['ui-ledger-account-info']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.span,
            __VLS_intrinsics.span,
          )({});
          __VLS_ctx.formatCompact(account.current_balance, account.currency);
          if (account.asset_id != null || account.liability_id != null) {
            __VLS_asFunctionalElement1(
              __VLS_intrinsics.button,
              __VLS_intrinsics.button,
            )(
              __assign(
                __assign(
                  {
                    onClick: function () {
                      var _a, _b;
                      var _c = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _c[_i] = arguments[_i];
                      }
                      var $event = _c[0];
                      if (!!(__VLS_ctx.activeTab === 'cuentas')) return;
                      if (!!(__VLS_ctx.activeTab === 'todos')) return;
                      if (!(__VLS_ctx.activeTab === 'estadisticas')) return;
                      if (!__VLS_ctx.hasTechnicalAccounts) return;
                      if (
                        !(
                          ((_b =
                            (_a = __VLS_ctx.accountsByType.get(type.value)) === null ||
                            _a === void 0
                              ? void 0
                              : _a.length) !== null && _b !== void 0
                            ? _b
                            : 0) > 0
                        )
                      )
                        return;
                      if (!(account.asset_id != null || account.liability_id != null)) return;
                      __VLS_ctx.removeNetWorthTracking(account);
                      // @ts-ignore
                      [
                        formatCompact,
                        accountsByType,
                        accountsByType,
                        accountsByType,
                        hasTechnicalAccounts,
                        technicalAccountTypeOptions,
                        removeNetWorthTracking,
                      ];
                    },
                  },
                  { class: 'icon-btn' },
                ),
                {
                  type: 'button',
                  title: 'Quitar tracking',
                  disabled: __VLS_ctx.accountActivationLoading || __VLS_ctx.accountCreationLoading,
                },
              ),
            );
            /** @type {__VLS_StyleScopedClasses['icon-btn']} */
          }
          if (account.origin === 'user') {
            __VLS_asFunctionalElement1(
              __VLS_intrinsics.button,
              __VLS_intrinsics.button,
            )(
              __assign(
                __assign(
                  {
                    onClick: function () {
                      var _a, _b;
                      var _c = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _c[_i] = arguments[_i];
                      }
                      var $event = _c[0];
                      if (!!(__VLS_ctx.activeTab === 'cuentas')) return;
                      if (!!(__VLS_ctx.activeTab === 'todos')) return;
                      if (!(__VLS_ctx.activeTab === 'estadisticas')) return;
                      if (!__VLS_ctx.hasTechnicalAccounts) return;
                      if (
                        !(
                          ((_b =
                            (_a = __VLS_ctx.accountsByType.get(type.value)) === null ||
                            _a === void 0
                              ? void 0
                              : _a.length) !== null && _b !== void 0
                            ? _b
                            : 0) > 0
                        )
                      )
                        return;
                      if (!(account.origin === 'user')) return;
                      __VLS_ctx.deleteAccount(account.id, account.name);
                      // @ts-ignore
                      [accountActivationLoading, accountCreationLoading, deleteAccount];
                    },
                  },
                  { class: 'icon-btn' },
                ),
                {
                  type: 'button',
                  title: 'Eliminar cuenta',
                  disabled: __VLS_ctx.accountCreationLoading,
                },
              ),
            );
            /** @type {__VLS_StyleScopedClasses['icon-btn']} */
          }
          // @ts-ignore
          [accountCreationLoading];
        };
        for (
          var _37 = 0, _38 = __VLS_vFor(__VLS_ctx.accountsByType.get(type.value));
          _37 < _38.length;
          _37++
        ) {
          var account = _38[_37][0];
          _loop_6(account);
        }
      }
      // @ts-ignore
      [];
    };
    for (var _t = 0, _u = __VLS_vFor(__VLS_ctx.technicalAccountTypeOptions); _t < _u.length; _t++) {
      var type = _u[_t][0];
      _loop_3(type);
    }
  }
}
var __VLS_0 = BaseModal_vue_1.default || BaseModal_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0(
    __assign(
      { onClose: {} },
      { open: __VLS_ctx.showActivationModal, title: 'Activar tracking contable' },
    ),
  ),
);
var __VLS_2 = __VLS_1.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { onClose: {} },
        { open: __VLS_ctx.showActivationModal, title: 'Activar tracking contable' },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_1),
    false,
  ),
);
var __VLS_5;
var __VLS_6 =
  ({ close: {} },
  {
    onClose: function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.showActivationModal = false;
      // @ts-ignore
      [showActivationModal, showActivationModal];
    },
  });
var __VLS_7 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.form,
  __VLS_intrinsics.form,
)(
  __assign(
    { onSubmit: __VLS_ctx.activatePositionFromModal },
    { class: 'ui-accounting-form ui-accounting-modal-form' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-form']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-form-grid' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(__assign({ value: __VLS_ctx.activationForm.position_type }, { class: 'select' }));
/** @type {__VLS_StyleScopedClasses['select']} */ for (
  var _v = 0, _w = __VLS_vFor(__VLS_ctx.manualPositionTypeOptions);
  _v < _w.length;
  _v++
) {
  var type = _w[_v][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: type.value,
    value: type.value,
  });
  type.label;
  // @ts-ignore
  [activatePositionFromModal, activationForm, manualPositionTypeOptions];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(
    { class: 'input' },
    {
      type: 'search',
      placeholder: 'Buscar posicion por nombre o divisa',
      disabled: !__VLS_ctx.availableManualPositionOptions.length,
    },
  ),
);
__VLS_ctx.activationQuery;
/** @type {__VLS_StyleScopedClasses['input']} */ if (
  __VLS_ctx.activationForm.position_type === 'asset'
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )({
    type: 'checkbox',
  });
  __VLS_ctx.activationOperationalOnly;
}
if (
  __VLS_ctx.activationExcludedByOperationalFilter > 0 &&
  __VLS_ctx.activationForm.position_type === 'asset'
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_ctx.activationExcludedByOperationalFilter;
}
if (__VLS_ctx.availableManualPositionOptions.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-inline-actions' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-actions']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_ctx
    .selectedActivationIds.length;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(__assign({ onClick: __VLS_ctx.toggleSelectAllFiltered }, { class: 'btn' }), {
      type: 'button',
    }),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_ctx.allFilteredSelected
    ? 'Quitar seleccion visible'
    : 'Seleccionar visibles';
}
if (__VLS_ctx.groupedManualPositionOptions.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-activation-list' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-list']} */ for (
    var _x = 0, _y = __VLS_vFor(__VLS_ctx.groupedManualPositionOptions);
    _x < _y.length;
    _x++
  ) {
    var group = _y[_x][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )({
      key: group.key,
    });
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'ui-accounting-inline-note' }));
    /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.strong,
      __VLS_intrinsics.strong,
    )({});
    group.label;
    for (var _z = 0, _0 = __VLS_vFor(group.positions); _z < _0.length; _z++) {
      var position = _0[_z][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.label,
        __VLS_intrinsics.label,
      )(__assign({ key: position.id }, { class: 'ui-accounting-activation-option' }));
      /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-option']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.input,
      )(
        __assign(
          { class: 'ui-accounting-activation-checkbox' },
          { type: 'checkbox', value: position.id },
        ),
      );
      __VLS_ctx.selectedActivationIds;
      /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-checkbox']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'ui-accounting-activation-meta' }));
      /** @type {__VLS_StyleScopedClasses['ui-accounting-activation-meta']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.strong,
        __VLS_intrinsics.strong,
      )({});
      position.name;
      __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
      position.currency;
      // @ts-ignore
      [
        activationForm,
        activationForm,
        availableManualPositionOptions,
        availableManualPositionOptions,
        activationQuery,
        activationOperationalOnly,
        activationExcludedByOperationalFilter,
        activationExcludedByOperationalFilter,
        selectedActivationIds,
        selectedActivationIds,
        toggleSelectAllFiltered,
        allFilteredSelected,
        groupedManualPositionOptions,
        groupedManualPositionOptions,
      ];
    }
    // @ts-ignore
    [];
  }
} else if (__VLS_ctx.availableManualPositionOptions.length && __VLS_ctx.activationQuery.trim()) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-empty' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-empty']} */
}
if (!__VLS_ctx.hasAvailableManualPositions) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-empty' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-empty']} */
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-submit-row' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-submit-row']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-accounting-inline-note' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    { class: 'btn btn-primary' },
    {
      type: 'submit',
      disabled: __VLS_ctx.accountActivationLoading || !__VLS_ctx.selectedActivationIds.length,
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_ctx.accountActivationLoading
  ? 'Activando...'
  : 'Activar tracking ('.concat(__VLS_ctx.selectedActivationIds.length, ')');
// @ts-ignore
[
  hasAvailableManualPositions,
  accountActivationLoading,
  accountActivationLoading,
  availableManualPositionOptions,
  activationQuery,
  selectedActivationIds,
  selectedActivationIds,
];
var __VLS_3;
var __VLS_4;
var __VLS_8 = BaseModal_vue_1.default || BaseModal_vue_1.default;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent1(
  __VLS_8,
  new __VLS_8(
    __assign(
      { onClose: {} },
      {
        open: __VLS_ctx.showEditTransactionModal,
        title: 'Editar movimiento',
        panelClass: 'max-w-[760px]',
      },
    ),
  ),
);
var __VLS_10 = __VLS_9.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { onClose: {} },
        {
          open: __VLS_ctx.showEditTransactionModal,
          title: 'Editar movimiento',
          panelClass: 'max-w-[760px]',
        },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_9),
    false,
  ),
);
var __VLS_13;
var __VLS_14 =
  ({ close: {} },
  {
    onClose: function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.showEditTransactionModal = false;
      // @ts-ignore
      [showEditTransactionModal, showEditTransactionModal];
    },
  });
var __VLS_15 = __VLS_11.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-modal-copy' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-modal-copy']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-page-eyebrow' }));
/** @type {__VLS_StyleScopedClasses['ui-page-eyebrow']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.form,
  __VLS_intrinsics.form,
)(
  __assign(
    { onSubmit: __VLS_ctx.submitEditedTransactionFromModal },
    {
      class:
        'ui-accounting-form ui-accounting-transaction-form ui-accounting-modal-form ui-accounting-edit-form',
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-transaction-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-edit-form']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-segmented' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ var _loop_4 = function (option) {
  __VLS_asFunctionalElement1(
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
              __VLS_ctx.editTransactionForm.kind = option.value;
              // @ts-ignore
              [submitEditedTransactionFromModal, editMovementTypeOptions, editTransactionForm];
            },
          },
          { key: option.value, type: 'button' },
        ),
        { class: 'btn ui-accounting-segmented-btn' },
      ),
      {
        class: {
          'ui-accounting-segmented-btn-active': __VLS_ctx.editTransactionForm.kind === option.value,
        },
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn-active']} */ option.label;
  // @ts-ignore
  [editTransactionForm];
};
for (var _1 = 0, _2 = __VLS_vFor(__VLS_ctx.editMovementTypeOptions); _1 < _2.length; _1++) {
  var option = _2[_1][0];
  _loop_4(option);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(
    { class: 'input' },
    { placeholder: 'Nomina marzo, compra semanal, mover a ahorro...', required: true },
  ),
);
__VLS_ctx.editTransactionForm.description;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-form-grid ui-accounting-form-grid-dates' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-dates']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(__assign({ type: 'date' }, { class: 'input' }), { required: true }),
);
__VLS_ctx.editTransactionForm.booking_date;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(__assign({ type: 'date' }, { class: 'input' }), { required: true }),
);
__VLS_ctx.editTransactionForm.value_date;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: 'time' }, { class: 'input' }));
__VLS_ctx.editTransactionForm.booking_time;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-accounting-form-grid' },
    {
      class: __VLS_ctx.editKindNeedsCounterparty
        ? 'ui-accounting-form-grid-wide'
        : 'ui-accounting-form-grid-edit-simple',
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(__assign({ value: __VLS_ctx.editTransactionForm.account_id }, { class: 'select' }), {
    required: true,
  }),
);
/** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.option,
  __VLS_intrinsics.option,
)({
  value: null,
  disabled: true,
});
for (var _3 = 0, _4 = __VLS_vFor(__VLS_ctx.editAccountOptions); _3 < _4.length; _3++) {
  var account = _4[_3][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: account.id,
    value: account.id,
  });
  account.name;
  account.currency;
  // @ts-ignore
  [
    editTransactionForm,
    editTransactionForm,
    editTransactionForm,
    editTransactionForm,
    editTransactionForm,
    editKindNeedsCounterparty,
    editAccountOptions,
  ];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(
    { class: 'input' },
    {
      inputmode: 'decimal',
      placeholder:
        __VLS_ctx.editTransactionForm.kind === 'balance_adjustment' ? 'Saldo objetivo' : '0.00',
      required: true,
    },
  ),
);
__VLS_ctx.editTransactionForm.amount;
/** @type {__VLS_StyleScopedClasses['input']} */ if (__VLS_ctx.editKindNeedsCounterparty) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign(
        { value: __VLS_ctx.editTransactionForm.counterparty_account_id },
        { class: 'select' },
      ),
      { required: true },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  __VLS_ctx.editCounterpartyLabel;
  for (var _5 = 0, _6 = __VLS_vFor(__VLS_ctx.editCounterpartyOptions); _5 < _6.length; _5++) {
    var account = _6[_5][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    account.name;
    account.currency;
    // @ts-ignore
    [
      editTransactionForm,
      editTransactionForm,
      editTransactionForm,
      editKindNeedsCounterparty,
      editCounterpartyLabel,
      editCounterpartyOptions,
    ];
  }
}
if (__VLS_ctx.editKindNeedsCounterparty && !__VLS_ctx.editCounterpartyOptions.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_ctx.editCounterpartyMissingHint;
} else if (__VLS_ctx.editKindNeedsClassification) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
} else if (__VLS_ctx.editTransactionForm.kind !== 'balance_adjustment') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
}
if (__VLS_ctx.editKindNeedsClassification) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-form-grid ui-accounting-form-grid-wide' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(__assign({ value: __VLS_ctx.editTransactionForm.category_key }, { class: 'select' }), {
      required: true,
    }),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
  });
  for (var _7 = 0, _8 = __VLS_vFor(__VLS_ctx.editCategoryOptions); _7 < _8.length; _7++) {
    var option = _8[_7][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [
      editTransactionForm,
      editTransactionForm,
      editKindNeedsCounterparty,
      editCounterpartyOptions,
      editCounterpartyMissingHint,
      editKindNeedsClassification,
      editKindNeedsClassification,
      editCategoryOptions,
    ];
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign({ value: __VLS_ctx.editTransactionForm.subcategory_key }, { class: 'select' }),
      { required: true },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
  });
  for (var _9 = 0, _10 = __VLS_vFor(__VLS_ctx.editSubcategoryOptions); _9 < _10.length; _9++) {
    var option = _10[_9][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [editTransactionForm, editSubcategoryOptions];
  }
}
if (__VLS_ctx.editTransactionForm.kind === 'balance_adjustment') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.strong,
    __VLS_intrinsics.strong,
  )({});
  __VLS_ctx.editSelectedAccountCurrentBalance != null
    ? __VLS_ctx.formatCompact(
        __VLS_ctx.editSelectedAccountCurrentBalance,
        __VLS_ctx.editTransactionForm.currency,
      )
    : '-';
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)(
  __assign(__assign({ value: __VLS_ctx.editTransactionForm.notes }, { class: 'textarea' }), {
    rows: '2',
    placeholder: 'Nota opcional para el movimiento',
  }),
);
/** @type {__VLS_StyleScopedClasses['textarea']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-submit-row' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-submit-row']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_ctx.editTransactionForm.kind ===
'balance_adjustment'
  ? 'Ajuste: fija el saldo actual de la cuenta al valor objetivo sin tocar otros movimientos.'
  : 'Se mantiene el asiento balanceado y se actualizan tipo, cuenta, clasificacion e importe.';
__VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    { class: 'btn btn-primary' },
    { type: 'submit', disabled: __VLS_ctx.transactionCreationLoading || !__VLS_ctx.editEntryReady },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_ctx.transactionCreationLoading
  ? 'Guardando...'
  : 'Guardar cambios';
if (!__VLS_ctx.editEntryReady && !__VLS_ctx.transactionCreationLoading) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
}
// @ts-ignore
[
  formatCompact,
  transactionCreationLoading,
  transactionCreationLoading,
  transactionCreationLoading,
  editTransactionForm,
  editTransactionForm,
  editTransactionForm,
  editTransactionForm,
  editSelectedAccountCurrentBalance,
  editSelectedAccountCurrentBalance,
  editEntryReady,
  editEntryReady,
];
var __VLS_11;
var __VLS_12;
var __VLS_16 = BaseModal_vue_1.default || BaseModal_vue_1.default;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent1(
  __VLS_16,
  new __VLS_16(
    __assign(
      { onClose: {} },
      {
        open: __VLS_ctx.showMoneyWizImportModal,
        title: 'Importar CSV MoneyWiz',
        panelClass: 'max-w-[920px]',
      },
    ),
  ),
);
var __VLS_18 = __VLS_17.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { onClose: {} },
        {
          open: __VLS_ctx.showMoneyWizImportModal,
          title: 'Importar CSV MoneyWiz',
          panelClass: 'max-w-[920px]',
        },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_17),
    false,
  ),
);
var __VLS_21;
var __VLS_22 =
  ({ close: {} },
  {
    onClose: function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.showMoneyWizImportModal = false;
      // @ts-ignore
      [showMoneyWizImportModal, showMoneyWizImportModal];
    },
  });
var __VLS_23 = __VLS_19.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-modal-copy' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-modal-copy']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-page-eyebrow' }));
/** @type {__VLS_StyleScopedClasses['ui-page-eyebrow']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.form,
  __VLS_intrinsics.form,
)(
  __assign(
    { onSubmit: __VLS_ctx.previewMoneyWizImportFromModal },
    { class: 'ui-accounting-form ui-accounting-modal-form' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-form']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-import-dropzone' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-import-dropzone']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(
    __assign(
      { onChange: __VLS_ctx.handleMoneyWizFileChange },
      { type: 'file', accept: '.csv,text/csv' },
    ),
    { class: 'input' },
  ),
);
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-accounting-inline-note' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_ctx.moneyWizImportFile
  ? 'Archivo listo: '.concat(__VLS_ctx.moneyWizImportFile.name)
  : 'Acepta el CSV exportado desde MoneyWiz con cabeceras en ingles.';
if (__VLS_ctx.moneyWizImportPreview) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-summary' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-summary']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-kpis' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpis']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-kpi' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )({});
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.moneyWizImportPreview.row_count;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-kpi' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )({});
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.moneyWizImportPreview.valid_row_count;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-kpi' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )({});
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.moneyWizImportPreview.error_row_count;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-kpi' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-kpi']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )({});
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_ctx.moneyWizImportPreview.existing_row_count;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-grid' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-grid']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3,
  )({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.ul,
    __VLS_intrinsics.ul,
  )(__assign({ class: 'ui-accounting-import-list' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-list']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.li,
    __VLS_intrinsics.li,
  )({});
  __VLS_ctx.moneyWizImportPreview.stats.income;
  __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
  __VLS_ctx.moneyWizImportPreview.stats.expense;
  __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
  __VLS_ctx.moneyWizImportPreview.stats.transfer;
  __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
  __VLS_ctx.moneyWizImportPreview.stats.investment_purchase;
  __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
  __VLS_ctx.moneyWizImportPreview.stats.debt_payment;
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3,
  )({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.ul,
    __VLS_intrinsics.ul,
  )(__assign({ class: 'ui-accounting-import-list' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-list']} */ for (
    var _11 = 0, _12 = __VLS_vFor(__VLS_ctx.moneyWizImportPreview.detected_accounts.slice(0, 6));
    _11 < _12.length;
    _11++
  ) {
    var account = _12[_11][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.li,
      __VLS_intrinsics.li,
    )({
      key: ''.concat(account.role, '-').concat(account.account_type, '-').concat(account.name),
    });
    account.name;
    account.account_type;
    // @ts-ignore
    [
      previewMoneyWizImportFromModal,
      handleMoneyWizFileChange,
      moneyWizImportFile,
      moneyWizImportFile,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
      moneyWizImportPreview,
    ];
  }
  if (__VLS_ctx.moneyWizPreviewWarnings.length) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-state-block ui-state-empty' }));
    /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ /** @type {__VLS_StyleScopedClasses['ui-state-empty']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.strong,
      __VLS_intrinsics.strong,
    )({});
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.ul,
      __VLS_intrinsics.ul,
    )(__assign({ class: 'ui-accounting-import-list' }));
    /** @type {__VLS_StyleScopedClasses['ui-accounting-import-list']} */ for (
      var _13 = 0, _14 = __VLS_vFor(__VLS_ctx.moneyWizPreviewWarnings.slice(0, 5));
      _13 < _14.length;
      _13++
    ) {
      var warning = _14[_13][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.li,
        __VLS_intrinsics.li,
      )({
        key: warning,
      });
      warning;
      // @ts-ignore
      [moneyWizPreviewWarnings, moneyWizPreviewWarnings];
    }
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-card' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-card']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3,
  )({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-import-rows' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-import-rows']} */ for (
    var _15 = 0, _16 = __VLS_vFor(__VLS_ctx.moneyWizPreviewRows);
    _15 < _16.length;
    _15++
  ) {
    var row = _16[_15][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.article,
      __VLS_intrinsics.article,
    )(__assign({ key: row.fingerprint }, { class: 'ui-accounting-import-row' }));
    /** @type {__VLS_StyleScopedClasses['ui-accounting-import-row']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-accounting-import-row-head' }));
    /** @type {__VLS_StyleScopedClasses['ui-accounting-import-row-head']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.strong,
      __VLS_intrinsics.strong,
    )({});
    row.row_number;
    row.description;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    row.movement_type;
    row.amount;
    row.currency;
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.p,
      __VLS_intrinsics.p,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ row.account_name;
    if (row.counterparty_name) {
      row.counterparty_name;
    }
    if (row.category) {
      row.category;
    }
    if (row.warnings.length) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.p,
        __VLS_intrinsics.p,
      )(__assign({ class: 'ui-accounting-inline-note' }));
      /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ row.warnings[0];
    }
    if (row.errors.length) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.p,
        __VLS_intrinsics.p,
      )(__assign({ class: 'ui-state-block ui-state-error' }));
      /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ /** @type {__VLS_StyleScopedClasses['ui-state-error']} */ row
        .errors[0];
    }
    // @ts-ignore
    [moneyWizPreviewRows];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-submit-row' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-submit-row']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_ctx.moneyWizImportPreview
  ? __VLS_ctx.moneyWizCanCommit
    ? 'La preview esta lista. Al confirmar se refrescaran movimientos, saldos y resumen mensual.'
    : 'La preview necesita revision: si hay filas con errores no se habilita el commit.'
  : 'Empieza generando la preview para revisar warnings, duplicados y cuentas detectadas.';
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-inline-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-inline-actions']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    { class: 'btn' },
    { type: 'submit', disabled: __VLS_ctx.importPreviewLoading || __VLS_ctx.importCommitLoading },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_ctx.importPreviewLoading
  ? 'Preparando preview...'
  : 'Generar preview';
__VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    __assign({ onClick: __VLS_ctx.commitMoneyWizImportFromModal }, { class: 'btn btn-primary' }),
    {
      type: 'button',
      disabled:
        __VLS_ctx.importCommitLoading ||
        __VLS_ctx.importPreviewLoading ||
        !__VLS_ctx.moneyWizCanCommit,
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_ctx.importCommitLoading
  ? 'Importando...'
  : 'Confirmar importacion';
// @ts-ignore
[
  moneyWizImportPreview,
  moneyWizCanCommit,
  moneyWizCanCommit,
  importPreviewLoading,
  importPreviewLoading,
  importPreviewLoading,
  importCommitLoading,
  importCommitLoading,
  importCommitLoading,
  commitMoneyWizImportFromModal,
];
var __VLS_19;
var __VLS_20;
var __VLS_24 = BaseModal_vue_1.default || BaseModal_vue_1.default;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(
  __VLS_24,
  new __VLS_24(
    __assign(
      { onClose: {} },
      {
        open: __VLS_ctx.showQuickEntryModal,
        title: 'Registrar movimiento diario',
        panelClass: 'max-w-[920px]',
      },
    ),
  ),
);
var __VLS_26 = __VLS_25.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { onClose: {} },
        {
          open: __VLS_ctx.showQuickEntryModal,
          title: 'Registrar movimiento diario',
          panelClass: 'max-w-[920px]',
        },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_25),
    false,
  ),
);
var __VLS_29;
var __VLS_30 =
  ({ close: {} },
  {
    onClose: function () {
      var _a = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        _a[_i] = arguments[_i];
      }
      var $event = _a[0];
      __VLS_ctx.showQuickEntryModal = false;
      // @ts-ignore
      [showQuickEntryModal, showQuickEntryModal];
    },
  });
var __VLS_31 = __VLS_27.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-modal-copy' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-modal-copy']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-page-eyebrow' }));
/** @type {__VLS_StyleScopedClasses['ui-page-eyebrow']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ if (!__VLS_ctx.liquidityAccounts.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.form,
  __VLS_intrinsics.form,
)(
  __assign(
    { onSubmit: __VLS_ctx.submitQuickEntryFromModal },
    { class: 'ui-accounting-form ui-accounting-transaction-form ui-accounting-modal-form' },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-transaction-form']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-modal-form']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-segmented' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-segmented']} */ var _loop_5 = function (option) {
  __VLS_asFunctionalElement1(
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
              __VLS_ctx.quickEntryForm.movement_type = option.value;
              // @ts-ignore
              [
                liquidityAccounts,
                submitQuickEntryFromModal,
                quickMovementTypeOptions,
                quickEntryForm,
              ];
            },
          },
          { key: option.value, type: 'button' },
        ),
        { class: 'btn ui-accounting-segmented-btn' },
      ),
      {
        class: {
          'ui-accounting-segmented-btn-active':
            __VLS_ctx.quickEntryForm.movement_type === option.value,
        },
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-segmented-btn-active']} */ option.label;
  // @ts-ignore
  [quickEntryForm];
};
for (var _17 = 0, _18 = __VLS_vFor(__VLS_ctx.quickMovementTypeOptions); _17 < _18.length; _17++) {
  var option = _18[_17][0];
  _loop_5(option);
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-form-grid ui-accounting-form-grid-wide' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)(
  __assign(
    { class: 'input' },
    { placeholder: 'Nomina marzo, compra semanal, mover a ahorro...', required: true },
  ),
);
__VLS_ctx.quickEntryForm.description;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(__assign({ type: 'date' }, { class: 'input' }), { required: true }),
);
__VLS_ctx.quickEntryForm.booking_date;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-accounting-field' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign(__assign({ type: 'date' }, { class: 'input' }), { required: true }),
);
__VLS_ctx.quickEntryForm.value_date;
/** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'ui-accounting-inline-note' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-accounting-form-grid' },
    {
      class:
        __VLS_ctx.quickEntryForm.movement_type === 'transfer' ||
        __VLS_ctx.quickEntryForm.movement_type === 'investment_purchase' ||
        __VLS_ctx.quickEntryForm.movement_type === 'debt_payment'
          ? 'ui-accounting-form-grid-wide'
          : 'ui-accounting-form-grid-edit-simple',
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(__assign({ value: __VLS_ctx.quickEntryForm.account_id }, { class: 'select' }), {
    required: true,
  }),
);
/** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.option,
  __VLS_intrinsics.option,
)({
  value: null,
});
for (var _19 = 0, _20 = __VLS_vFor(__VLS_ctx.liquidityAccounts); _19 < _20.length; _19++) {
  var account = _20[_19][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: account.id,
    value: account.id,
  });
  account.name;
  account.currency;
  // @ts-ignore
  [
    liquidityAccounts,
    quickEntryForm,
    quickEntryForm,
    quickEntryForm,
    quickEntryForm,
    quickEntryForm,
    quickEntryForm,
    quickEntryForm,
  ];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(
  __assign({ class: 'input' }, { inputmode: 'decimal', placeholder: '0.00', required: true }),
);
__VLS_ctx.quickEntryForm.amount;
/** @type {__VLS_StyleScopedClasses['input']} */ if (
  __VLS_ctx.quickEntryForm.movement_type === 'transfer'
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign({ value: __VLS_ctx.quickEntryForm.counterparty_account_id }, { class: 'select' }),
      { required: true },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  for (
    var _21 = 0, _22 = __VLS_vFor(__VLS_ctx.transferCounterpartyOptions);
    _21 < _22.length;
    _21++
  ) {
    var account = _22[_21][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    account.name;
    account.currency;
    // @ts-ignore
    [quickEntryForm, quickEntryForm, quickEntryForm, transferCounterpartyOptions];
  }
} else if (__VLS_ctx.quickEntryForm.movement_type === 'investment_purchase') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign({ value: __VLS_ctx.quickEntryForm.counterparty_account_id }, { class: 'select' }),
      { required: true },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  for (
    var _23 = 0, _24 = __VLS_vFor(__VLS_ctx.investmentCounterpartyOptions);
    _23 < _24.length;
    _23++
  ) {
    var account = _24[_23][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    account.name;
    account.currency;
    // @ts-ignore
    [quickEntryForm, quickEntryForm, investmentCounterpartyOptions];
  }
} else if (__VLS_ctx.quickEntryForm.movement_type === 'debt_payment') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign({ value: __VLS_ctx.quickEntryForm.liability_account_id }, { class: 'select' }),
      { required: true },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  for (
    var _25 = 0, _26 = __VLS_vFor(__VLS_ctx.liabilityCounterpartyOptions);
    _25 < _26.length;
    _25++
  ) {
    var account = _26[_25][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    account.name;
    account.currency;
    // @ts-ignore
    [quickEntryForm, quickEntryForm, liabilityCounterpartyOptions];
  }
}
if (__VLS_ctx.quickEntryNeedsClassification) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-form-grid ui-accounting-form-grid-wide' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(__assign({ value: __VLS_ctx.quickEntryForm.category_key }, { class: 'select' }), {
      required: true,
    }),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
  });
  for (var _27 = 0, _28 = __VLS_vFor(__VLS_ctx.quickCategoryOptions); _27 < _28.length; _27++) {
    var category = _28[_27][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: category.value,
      value: category.value,
    });
    category.label;
    // @ts-ignore
    [quickEntryForm, quickEntryNeedsClassification, quickCategoryOptions];
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(__assign({ value: __VLS_ctx.quickEntryForm.subcategory_key }, { class: 'select' }), {
      required: true,
    }),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
  });
  for (var _29 = 0, _30 = __VLS_vFor(__VLS_ctx.quickSubcategoryOptions); _29 < _30.length; _29++) {
    var subcategory = _30[_29][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: subcategory.value,
      value: subcategory.value,
    });
    subcategory.label;
    // @ts-ignore
    [quickEntryForm, quickSubcategoryOptions];
  }
}
if (__VLS_ctx.quickEntryNeedsClassification) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.details,
    __VLS_intrinsics.details,
  )(
    __assign(
      { class: 'ui-accounting-annual-link' },
      {
        open:
          __VLS_ctx.quickEntryForm.annual_income_entry_id != null ||
          __VLS_ctx.quickEntryForm.annual_expense_entry_id != null,
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['ui-accounting-annual-link']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.summary,
    __VLS_intrinsics.summary,
  )({});
  __VLS_ctx.hasCompatibleAnnualPlanOptions
    ? 'Alinear con una linea del plan (opcional)'
    : 'Sin lineas anuales compatibles para esta clasificacion';
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */ if (
    __VLS_ctx.quickEntryForm.movement_type === 'income'
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.select,
      __VLS_intrinsics.select,
    )(
      __assign(
        __assign({ value: __VLS_ctx.quickEntryForm.annual_income_entry_id }, { class: 'select' }),
        { disabled: !__VLS_ctx.annualIncomeOptionsCompatible.length },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      value: null,
    });
    for (
      var _31 = 0, _32 = __VLS_vFor(__VLS_ctx.annualIncomeOptionsCompatible);
      _31 < _32.length;
      _31++
    ) {
      var entry = _32[_31][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.option,
        __VLS_intrinsics.option,
      )({
        key: entry.id,
        value: entry.id,
      });
      entry.name;
      // @ts-ignore
      [
        quickEntryForm,
        quickEntryForm,
        quickEntryForm,
        quickEntryForm,
        quickEntryNeedsClassification,
        hasCompatibleAnnualPlanOptions,
        annualIncomeOptionsCompatible,
        annualIncomeOptionsCompatible,
      ];
    }
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.select,
      __VLS_intrinsics.select,
    )(
      __assign(
        __assign({ value: __VLS_ctx.quickEntryForm.annual_expense_entry_id }, { class: 'select' }),
        { disabled: !__VLS_ctx.annualExpenseOptionsCompatible.length },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      value: null,
    });
    for (
      var _33 = 0, _34 = __VLS_vFor(__VLS_ctx.annualExpenseOptionsCompatible);
      _33 < _34.length;
      _33++
    ) {
      var entry = _34[_33][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.option,
        __VLS_intrinsics.option,
      )({
        key: entry.id,
        value: entry.id,
      });
      entry.name;
      // @ts-ignore
      [quickEntryForm, annualExpenseOptionsCompatible, annualExpenseOptionsCompatible];
    }
  }
}
if (__VLS_ctx.quickEntryForm.movement_type === 'debt_payment') {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-accounting-form-grid ui-accounting-form-grid-wide' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-accounting-form-grid-wide']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(
      { class: 'input' },
      { inputmode: 'decimal', placeholder: 'Principal (ej: 300.00)', required: true },
    ),
  );
  __VLS_ctx.quickEntryForm.principal_amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(
      { class: 'input' },
      { inputmode: 'decimal', placeholder: 'Interes (ej: 30.00, 0 si no aplica)', required: true },
    ),
  );
  __VLS_ctx.quickEntryForm.interest_amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.quickEntryForm.interest_account_id }, { class: 'select' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: null,
  });
  for (var _35 = 0, _36 = __VLS_vFor(__VLS_ctx.debtInterestOptions); _35 < _36.length; _35++) {
    var account = _36[_35][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: account.id,
      value: account.id,
    });
    account.name;
    account.currency;
    // @ts-ignore
    [quickEntryForm, quickEntryForm, quickEntryForm, quickEntryForm, debtInterestOptions];
  }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.textarea)(
  __assign(__assign({ value: __VLS_ctx.quickEntryForm.notes }, { class: 'textarea' }), {
    rows: '2',
    placeholder: 'Nota opcional para el movimiento',
  }),
);
/** @type {__VLS_StyleScopedClasses['textarea']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-accounting-submit-row' }));
/** @type {__VLS_StyleScopedClasses['ui-accounting-submit-row']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.p,
  __VLS_intrinsics.p,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_ctx.quickEntryForm.movement_type ===
'transfer'
  ? 'La transferencia crea un asiento balanceado entre dos cuentas de liquidez.'
  : __VLS_ctx.quickEntryForm.movement_type === 'investment_purchase'
    ? 'La compra registra salida de liquidez y alta en la cuenta de inversion.'
    : __VLS_ctx.quickEntryForm.movement_type === 'debt_payment'
      ? 'El pago separa principal e intereses; total = principal + interes.'
      : 'El backend genera la contrapartida contable y registra categoria/subcategoria como clasificacion primaria.';
__VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    { class: 'btn btn-primary' },
    {
      type: 'submit',
      disabled: __VLS_ctx.transactionCreationLoading || !__VLS_ctx.quickEntryReady,
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_ctx.transactionCreationLoading
  ? 'Guardando...'
  : 'Registrar movimiento rapido';
if (!__VLS_ctx.quickEntryReady && !__VLS_ctx.transactionCreationLoading) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-accounting-inline-note' }));
  /** @type {__VLS_StyleScopedClasses['ui-accounting-inline-note']} */
}
// @ts-ignore
[
  transactionCreationLoading,
  transactionCreationLoading,
  transactionCreationLoading,
  quickEntryForm,
  quickEntryForm,
  quickEntryForm,
  quickEntryForm,
  quickEntryReady,
  quickEntryReady,
];
var __VLS_27;
var __VLS_28;
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
