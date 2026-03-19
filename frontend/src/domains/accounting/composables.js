'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.useAccountingPage = useAccountingPage;
var vue_1 = require('vue');
var pinia_1 = require('pinia');
var store_1 = require('@/domains/accounting/store');
var api_1 = require('@/domains/accounting/api');
var api_2 = require('@/domains/net-worth/api');
var data_input_1 = require('@/domains/data-input');
var errors_1 = require('@/lib/errors');
function formatDecimalInput(raw) {
  return raw.replace(',', '.').trim();
}
function toNumber(raw) {
  var parsed = Number(formatDecimalInput(raw));
  return Number.isFinite(parsed) ? parsed : 0;
}
function round2(value) {
  return Math.round(value * 100) / 100;
}
function useAccountingPage() {
  var store = (0, store_1.useAccountingStore)();
  var incomeStore = (0, data_input_1.useAnnualIncomeStore)('core');
  var expenseStore = (0, data_input_1.useAnnualExpenseStore)('core');
  var _a = (0, pinia_1.storeToRefs)(store),
    loading = _a.loading,
    accountCreationLoading = _a.accountCreationLoading,
    transactionCreationLoading = _a.transactionCreationLoading,
    importPreviewLoading = _a.importPreviewLoading,
    importCommitLoading = _a.importCommitLoading,
    error = _a.error;
  var _b = (0, pinia_1.storeToRefs)(store),
    accounts = _b.accounts,
    transactions = _b.transactions,
    monthlySummary = _b.monthlySummary,
    accountBalancesSummary = _b.accountBalancesSummary,
    moneyWizImportPreview = _b.moneyWizImportPreview,
    moneyWizImportCommitResult = _b.moneyWizImportCommitResult;
  var successMessage = (0, vue_1.ref)(null);
  var accountActivationLoading = (0, vue_1.ref)(false);
  var manualAssets = (0, vue_1.ref)([]);
  var manualLiabilities = (0, vue_1.ref)([]);
  var moneyWizImportFile = (0, vue_1.ref)(null);
  var accountForm = (0, vue_1.reactive)({
    name: '',
    account_type: 'asset',
    currency: 'EUR',
    origin: 'user',
    notes: '',
  });
  var activationForm = (0, vue_1.reactive)({
    position_type: 'asset',
    position_id: null,
  });
  var quickEntryForm = (0, vue_1.reactive)({
    movement_type: 'expense',
    booking_date: new Date().toISOString().slice(0, 10),
    value_date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
    account_id: null,
    counterparty_account_id: null,
    liability_account_id: null,
    interest_account_id: null,
    principal_amount: '',
    interest_amount: '',
    flow_family: '',
    category_key: '',
    subcategory_key: '',
    annual_income_entry_id: null,
    annual_expense_entry_id: null,
    notes: '',
  });
  var lastQuickClassification = (0, vue_1.reactive)({
    income: { category_key: '', subcategory_key: '' },
    expense: { category_key: '', subcategory_key: '' },
    debt_payment: { category_key: '', subcategory_key: '' },
  });
  var activityFilters = (0, vue_1.reactive)({
    query: '',
    accountId: 'all',
    kind: 'all',
  });
  var rowId = 0;
  var transactionForm = (0, vue_1.reactive)({
    booking_date: new Date().toISOString().slice(0, 10),
    value_date: new Date().toISOString().slice(0, 10),
    description: '',
    status: 'posted',
    origin: 'manual',
    notes: '',
    entries: [
      {
        key: ++rowId,
        account_id: null,
        side: 'debit',
        amount: '',
        currency: 'EUR',
        notes: '',
      },
      {
        key: ++rowId,
        account_id: null,
        side: 'credit',
        amount: '',
        currency: 'EUR',
        notes: '',
      },
    ],
  });
  var editTransactionId = (0, vue_1.ref)(null);
  var editTransactionForm = (0, vue_1.reactive)({
    booking_date: new Date().toISOString().slice(0, 10),
    value_date: new Date().toISOString().slice(0, 10),
    booking_time: '12:00',
    description: '',
    notes: '',
    account_id: null,
    counterparty_account_id: null,
    amount: '',
    currency: 'EUR',
    kind: 'transfer',
    initial_kind: 'transfer',
    category_key: '',
    subcategory_key: '',
    kind_label: '',
  });
  var editTransactionPersistedEntries = (0, vue_1.ref)([]);
  var selectedYear = (0, vue_1.computed)({
    get: function () {
      return store.selectedYear;
    },
    set: function (value) {
      store.selectedYear = value;
    },
  });
  var selectedMonth = (0, vue_1.computed)({
    get: function () {
      return store.selectedMonth;
    },
    set: function (value) {
      store.selectedMonth = value;
    },
  });
  var accountTypeOptions = [
    { value: 'asset', label: 'Activo' },
    { value: 'liability', label: 'Pasivo' },
    { value: 'equity', label: 'Patrimonio neto contable' },
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Gasto' },
  ];
  var monthOptions = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];
  var yearOptions = (0, vue_1.computed)(function () {
    var currentYear = new Date().getFullYear();
    var values = new Set([currentYear - 1, currentYear, currentYear + 1, selectedYear.value]);
    return Array.from(values).sort(function (a, b) {
      return b - a;
    });
  });
  var accountMap = (0, vue_1.computed)(function () {
    return new Map(
      accounts.value.map(function (account) {
        return [account.id, account];
      }),
    );
  });
  var liquidityAccounts = (0, vue_1.computed)(function () {
    return accounts.value.filter(function (account) {
      return account.account_type === 'asset';
    });
  });
  var manualPositionTypeOptions = [
    { value: 'asset', label: 'Activo manual' },
    { value: 'liability', label: 'Pasivo manual' },
  ];
  var availableManualAssetOptions = (0, vue_1.computed)(function () {
    return manualAssets.value.filter(function (asset) {
      return asset.is_active && asset.tracking_mode === 'manual';
    });
  });
  var availableManualLiabilityOptions = (0, vue_1.computed)(function () {
    return manualLiabilities.value.filter(function (liability) {
      return liability.is_active && liability.tracking_mode === 'manual';
    });
  });
  var availableManualPositionOptions = (0, vue_1.computed)(function () {
    return activationForm.position_type === 'asset'
      ? availableManualAssetOptions.value
      : availableManualLiabilityOptions.value;
  });
  var assetNameById = (0, vue_1.computed)(function () {
    return new Map(
      manualAssets.value.map(function (asset) {
        var _a;
        return [asset.id, String((_a = asset.name) !== null && _a !== void 0 ? _a : '').trim()];
      }),
    );
  });
  var liabilityNameById = (0, vue_1.computed)(function () {
    return new Map(
      manualLiabilities.value.map(function (liability) {
        var _a;
        return [
          liability.id,
          String((_a = liability.name) !== null && _a !== void 0 ? _a : '').trim(),
        ];
      }),
    );
  });
  function accountDisplayName(account) {
    if (account.asset_id != null) {
      return assetNameById.value.get(account.asset_id) || account.name;
    }
    if (account.liability_id != null) {
      return liabilityNameById.value.get(account.liability_id) || account.name;
    }
    return account.name;
  }
  var accountPositionMetaByAccountId = (0, vue_1.computed)(function () {
    var map = new Map();
    accounts.value.forEach(function (account) {
      var _a, _b, _c, _d;
      if (account.asset_id != null) {
        var asset = manualAssets.value.find(function (row) {
          return row.id === account.asset_id;
        });
        if (asset) {
          map.set(account.id, {
            position_type: 'asset',
            category:
              String((_a = asset.category) !== null && _a !== void 0 ? _a : '').trim() || 'other',
            subcategory:
              String((_b = asset.subcategory) !== null && _b !== void 0 ? _b : '').trim() ||
              'other',
          });
          return;
        }
      }
      if (account.liability_id != null) {
        var liability = manualLiabilities.value.find(function (row) {
          return row.id === account.liability_id;
        });
        if (liability) {
          map.set(account.id, {
            position_type: 'liability',
            category:
              String((_c = liability.category) !== null && _c !== void 0 ? _c : '').trim() ||
              'other',
            subcategory:
              String((_d = liability.subcategory) !== null && _d !== void 0 ? _d : '').trim() ||
              'other',
          });
        }
      }
    });
    return map;
  });
  var hasAvailableManualPositions = (0, vue_1.computed)(function () {
    return (
      availableManualAssetOptions.value.length > 0 ||
      availableManualLiabilityOptions.value.length > 0
    );
  });
  var incomeOptions = (0, vue_1.computed)(function () {
    return incomeStore.entries.value
      .filter(function (entry) {
        return entry.fiscalYear === selectedYear.value;
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name, 'es');
      });
  });
  var expenseOptions = (0, vue_1.computed)(function () {
    return expenseStore.entries.value
      .filter(function (entry) {
        return entry.fiscalYear === selectedYear.value;
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name, 'es');
      });
  });
  var transferCounterpartyOptions = (0, vue_1.computed)(function () {
    return liquidityAccounts.value.filter(function (account) {
      return account.id !== quickEntryForm.account_id;
    });
  });
  var investmentCounterpartyOptions = (0, vue_1.computed)(function () {
    return accounts.value.filter(function (account) {
      return (
        account.account_type === 'asset' &&
        account.id !== quickEntryForm.account_id &&
        account.asset_id != null
      );
    });
  });
  var liabilityCounterpartyOptions = (0, vue_1.computed)(function () {
    return accounts.value.filter(function (account) {
      return account.account_type === 'liability' && account.liability_id != null;
    });
  });
  var debtInterestOptions = (0, vue_1.computed)(function () {
    return accounts.value.filter(function (account) {
      return account.account_type === 'expense';
    });
  });
  function hasQuickClassification() {
    return Boolean(quickEntryForm.category_key && quickEntryForm.subcategory_key);
  }
  function debtPaymentBreakdownReady(amountValue) {
    var principalValue = toNumber(quickEntryForm.principal_amount);
    var interestValue = toNumber(quickEntryForm.interest_amount);
    if (quickEntryForm.liability_account_id == null) return false;
    if (principalValue <= 0 || interestValue < 0) return false;
    if (interestValue > 0 && quickEntryForm.interest_account_id == null) return false;
    if (interestValue > 0 && !hasQuickClassification()) return false;
    return Math.abs(principalValue + interestValue - amountValue) < 0.000001;
  }
  var quickEntryReady = (0, vue_1.computed)(function () {
    if (!quickEntryForm.description.trim()) return false;
    if (!quickEntryForm.booking_date || !quickEntryForm.value_date) return false;
    var amountValue = toNumber(quickEntryForm.amount);
    if (amountValue <= 0) return false;
    if (quickEntryForm.account_id == null) return false;
    if (quickEntryForm.movement_type === 'transfer') {
      return quickEntryForm.counterparty_account_id != null;
    }
    if (quickEntryForm.movement_type === 'investment_purchase') {
      return quickEntryForm.counterparty_account_id != null;
    }
    if (quickEntryForm.movement_type === 'debt_payment') {
      return debtPaymentBreakdownReady(amountValue);
    }
    if (
      (quickEntryForm.movement_type === 'income' || quickEntryForm.movement_type === 'expense') &&
      !hasQuickClassification()
    ) {
      return false;
    }
    return true;
  });
  var quickEntryNeedsClassification = (0, vue_1.computed)(function () {
    if (quickEntryForm.movement_type === 'income') return true;
    if (quickEntryForm.movement_type === 'expense') return true;
    if (quickEntryForm.movement_type !== 'debt_payment') return false;
    return toNumber(quickEntryForm.interest_amount) > 0;
  });
  var quickCategoryOptions = (0, vue_1.computed)(function () {
    if (quickEntryForm.movement_type === 'income') return data_input_1.incomeCategories;
    if (quickEntryForm.movement_type === 'expense') return data_input_1.expenseCategories;
    if (
      quickEntryForm.movement_type === 'debt_payment' &&
      toNumber(quickEntryForm.interest_amount) > 0
    ) {
      return data_input_1.expenseCategories;
    }
    return [];
  });
  var quickSubcategoryOptions = (0, vue_1.computed)(function () {
    if (!quickEntryForm.category_key) return [];
    if (quickEntryForm.movement_type === 'income') {
      return data_input_1.incomeSubcategories.filter(function (row) {
        return row.category === quickEntryForm.category_key;
      });
    }
    if (
      quickEntryForm.movement_type === 'expense' ||
      (quickEntryForm.movement_type === 'debt_payment' &&
        toNumber(quickEntryForm.interest_amount) > 0)
    ) {
      return data_input_1.expenseSubcategories.filter(function (row) {
        return row.category === quickEntryForm.category_key;
      });
    }
    return [];
  });
  var annualIncomeOptionsCompatible = (0, vue_1.computed)(function () {
    if (quickEntryForm.movement_type !== 'income') return [];
    if (!quickEntryForm.category_key || !quickEntryForm.subcategory_key) return [];
    return incomeOptions.value.filter(function (entry) {
      return (
        entry.category === quickEntryForm.category_key &&
        entry.subcategory === quickEntryForm.subcategory_key
      );
    });
  });
  var annualExpenseOptionsCompatible = (0, vue_1.computed)(function () {
    if (
      quickEntryForm.movement_type !== 'expense' &&
      quickEntryForm.movement_type !== 'debt_payment'
    ) {
      return [];
    }
    if (!quickEntryForm.category_key || !quickEntryForm.subcategory_key) return [];
    return expenseOptions.value.filter(function (entry) {
      return (
        entry.category === quickEntryForm.category_key &&
        entry.subcategory === quickEntryForm.subcategory_key
      );
    });
  });
  var quickMovementTypeOptions = [
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Gasto' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'investment_purchase', label: 'Compra inversion' },
    { value: 'debt_payment', label: 'Pago deuda' },
  ];
  var editMovementTypeOptions = [
    { value: 'income', label: 'Ingreso' },
    { value: 'expense', label: 'Gasto' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'investment_purchase', label: 'Inversion' },
    { value: 'debt_payment', label: 'Deuda' },
    { value: 'balance_adjustment', label: 'Ajuste' },
  ];
  var editAccountOptions = (0, vue_1.computed)(function () {
    return accounts.value
      .filter(function (account) {
        return account.account_type === 'asset' || account.account_type === 'liability';
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name, 'es');
      });
  });
  function isClassificationKind(kind) {
    return kind === 'income' || kind === 'expense';
  }
  function isCounterpartyKind(kind) {
    return kind === 'transfer' || kind === 'investment_purchase' || kind === 'debt_payment';
  }
  var editKindNeedsClassification = (0, vue_1.computed)(function () {
    return isClassificationKind(editTransactionForm.kind);
  });
  var editKindNeedsCounterparty = (0, vue_1.computed)(function () {
    return isCounterpartyKind(editTransactionForm.kind);
  });
  var editCounterpartyLabel = (0, vue_1.computed)(function () {
    if (editTransactionForm.kind === 'investment_purchase') return 'Cuenta de inversion';
    if (editTransactionForm.kind === 'debt_payment') return 'Cuenta de pasivo';
    return 'Contracuenta';
  });
  var editSelectedAccountCurrentBalance = (0, vue_1.computed)(function () {
    if (editTransactionForm.account_id == null) return null;
    var account = accountMap.value.get(editTransactionForm.account_id);
    if (!account) return null;
    return toNumber(account.current_balance).toFixed(2);
  });
  var editCounterpartyOptions = (0, vue_1.computed)(function () {
    var baseOptions = editAccountOptions.value.filter(function (account) {
      return account.id !== editTransactionForm.account_id;
    });
    if (editTransactionForm.kind === 'investment_purchase') {
      return baseOptions.filter(function (account) {
        return account.account_type === 'asset' && account.asset_id != null;
      });
    }
    if (editTransactionForm.kind === 'debt_payment') {
      return baseOptions.filter(function (account) {
        return account.account_type === 'liability' && account.liability_id != null;
      });
    }
    return baseOptions;
  });
  var editCounterpartyMissingHint = (0, vue_1.computed)(function () {
    if (!editKindNeedsCounterparty.value) return '';
    if (editCounterpartyOptions.value.length > 0) return '';
    if (editTransactionForm.kind === 'investment_purchase') {
      return 'No hay cuentas de inversion contables activas. Activa tracking contable en la posicion manual para poder usarla aqui.';
    }
    if (editTransactionForm.kind === 'debt_payment') {
      return 'No hay cuentas de pasivo contables activas. Activa tracking contable en el pasivo manual para poder usarlo aqui.';
    }
    return 'No hay contracuentas disponibles para el tipo seleccionado.';
  });
  var editCategoryOptions = (0, vue_1.computed)(function () {
    if (editTransactionForm.kind === 'income') return data_input_1.incomeCategories;
    if (editTransactionForm.kind === 'expense') return data_input_1.expenseCategories;
    return [];
  });
  var editSubcategoryOptions = (0, vue_1.computed)(function () {
    if (!editTransactionForm.category_key) return [];
    if (editTransactionForm.kind === 'income') {
      return data_input_1.incomeSubcategories.filter(function (row) {
        return row.category === editTransactionForm.category_key;
      });
    }
    if (editTransactionForm.kind === 'expense') {
      return data_input_1.expenseSubcategories.filter(function (row) {
        return row.category === editTransactionForm.category_key;
      });
    }
    return [];
  });
  var editEntryReady = (0, vue_1.computed)(function () {
    if (!editTransactionForm.description.trim()) return false;
    if (!editTransactionForm.booking_date || !editTransactionForm.value_date) return false;
    if (editTransactionForm.account_id == null) return false;
    var parsedAmount = Number(formatDecimalInput(editTransactionForm.amount));
    if (!Number.isFinite(parsedAmount)) return false;
    if (editTransactionForm.kind !== 'balance_adjustment' && parsedAmount <= 0) return false;
    if (
      editKindNeedsCounterparty.value &&
      (editTransactionForm.counterparty_account_id == null ||
        editTransactionForm.counterparty_account_id === editTransactionForm.account_id)
    ) {
      return false;
    }
    if (editKindNeedsClassification.value) {
      return Boolean(editTransactionForm.category_key && editTransactionForm.subcategory_key);
    }
    return true;
  });
  (0, vue_1.watch)(
    function () {
      return transactionForm.entries.map(function (entry) {
        return entry.account_id;
      });
    },
    function (accountIds) {
      accountIds.forEach(function (accountId, index) {
        if (accountId == null) return;
        var account = accountMap.value.get(accountId);
        if (!account) return;
        transactionForm.entries[index].currency = account.currency;
      });
    },
    { deep: true },
  );
  (0, vue_1.watch)(
    function () {
      return quickEntryForm.movement_type;
    },
    function (movementType) {
      quickEntryForm.counterparty_account_id = null;
      quickEntryForm.liability_account_id = null;
      quickEntryForm.interest_account_id = null;
      quickEntryForm.principal_amount = '';
      quickEntryForm.interest_amount = '';
      quickEntryForm.flow_family = '';
      if (movementType !== 'income') quickEntryForm.annual_income_entry_id = null;
      if (movementType !== 'expense' && movementType !== 'debt_payment') {
        quickEntryForm.annual_expense_entry_id = null;
      }
      var remembered =
        movementType === 'income' || movementType === 'expense' || movementType === 'debt_payment'
          ? lastQuickClassification[movementType]
          : null;
      if (remembered) {
        quickEntryForm.category_key = remembered.category_key;
        quickEntryForm.subcategory_key = remembered.subcategory_key;
      } else {
        quickEntryForm.category_key = '';
        quickEntryForm.subcategory_key = '';
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return quickEntryForm.category_key;
    },
    function () {
      if (
        quickEntryForm.subcategory_key &&
        !quickSubcategoryOptions.value.some(function (row) {
          return row.value === quickEntryForm.subcategory_key;
        })
      ) {
        quickEntryForm.subcategory_key = '';
        quickEntryForm.annual_income_entry_id = null;
        quickEntryForm.annual_expense_entry_id = null;
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return quickEntryForm.subcategory_key;
    },
    function (value) {
      if (!value) return;
      if (quickEntryForm.movement_type === 'income') {
        lastQuickClassification.income = {
          category_key: quickEntryForm.category_key,
          subcategory_key: value,
        };
      } else if (quickEntryForm.movement_type === 'expense') {
        lastQuickClassification.expense = {
          category_key: quickEntryForm.category_key,
          subcategory_key: value,
        };
      } else if (quickEntryForm.movement_type === 'debt_payment') {
        lastQuickClassification.debt_payment = {
          category_key: quickEntryForm.category_key,
          subcategory_key: value,
        };
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return editTransactionForm.kind;
    },
    function (kind) {
      if (editTransactionForm.account_id == null && editAccountOptions.value.length) {
        editTransactionForm.account_id = editAccountOptions.value[0].id;
      }
      if (!isClassificationKind(kind)) {
        editTransactionForm.category_key = '';
        editTransactionForm.subcategory_key = '';
      }
      if (isCounterpartyKind(kind)) {
        if (
          editTransactionForm.counterparty_account_id == null &&
          editCounterpartyOptions.value.length
        ) {
          editTransactionForm.counterparty_account_id = editCounterpartyOptions.value[0].id;
        }
        return;
      }
      editTransactionForm.counterparty_account_id = null;
      if (kind === 'balance_adjustment' && editTransactionForm.account_id != null) {
        var selectedAccount = accountMap.value.get(editTransactionForm.account_id);
        if (selectedAccount) {
          editTransactionForm.amount = toNumber(selectedAccount.current_balance).toFixed(2);
        }
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return editTransactionForm.account_id;
    },
    function (accountId) {
      var _a, _b;
      if (accountId == null) {
        editTransactionForm.currency = 'EUR';
        return;
      }
      var account = accountMap.value.get(accountId);
      if (!account) return;
      editTransactionForm.currency = account.currency;
      if (editTransactionForm.kind === 'balance_adjustment') {
        editTransactionForm.amount = toNumber(account.current_balance).toFixed(2);
      }
      if (!isCounterpartyKind(editTransactionForm.kind)) return;
      if (editTransactionForm.counterparty_account_id === accountId) {
        editTransactionForm.counterparty_account_id =
          (_b =
            (_a = editCounterpartyOptions.value[0]) === null || _a === void 0 ? void 0 : _a.id) !==
            null && _b !== void 0
            ? _b
            : null;
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return editTransactionForm.category_key;
    },
    function () {
      if (
        editTransactionForm.subcategory_key &&
        !editSubcategoryOptions.value.some(function (row) {
          return row.value === editTransactionForm.subcategory_key;
        })
      ) {
        editTransactionForm.subcategory_key = '';
      }
    },
  );
  (0, vue_1.watch)(
    function () {
      return activationForm.position_type;
    },
    function () {
      activationForm.position_id = null;
    },
  );
  var debitTotal = (0, vue_1.computed)(function () {
    return transactionForm.entries
      .filter(function (entry) {
        return entry.side === 'debit';
      })
      .reduce(function (sum, entry) {
        return sum + toNumber(entry.amount);
      }, 0);
  });
  var creditTotal = (0, vue_1.computed)(function () {
    return transactionForm.entries
      .filter(function (entry) {
        return entry.side === 'credit';
      })
      .reduce(function (sum, entry) {
        return sum + toNumber(entry.amount);
      }, 0);
  });
  var transactionBalanced = (0, vue_1.computed)(function () {
    return (
      transactionForm.entries.length >= 2 &&
      debitTotal.value > 0 &&
      debitTotal.value === creditTotal.value
    );
  });
  var summaryRows = (0, vue_1.computed)(function () {
    var _a, _b;
    return (
      (_b = (_a = monthlySummary.value) === null || _a === void 0 ? void 0 : _a.months) !== null &&
      _b !== void 0
        ? _b
        : []
    ).map(function (row) {
      return __assign(__assign({}, row), {
        incomeValue: toNumber(row.income_total),
        expenseValue: toNumber(row.expense_total),
        uncategorizedValue: toNumber(row.uncategorized_total),
      });
    });
  });
  var liquidityBalanceRows = (0, vue_1.computed)(function () {
    var _a, _b;
    return (
      (_b =
        (_a = accountBalancesSummary.value) === null || _a === void 0 ? void 0 : _a.accounts) !==
        null && _b !== void 0
        ? _b
        : []
    ).map(function (row) {
      return __assign(__assign({}, row), {
        currentBalanceValue: toNumber(row.current_balance),
        periodDebitValue: toNumber(row.period_debit_total),
        periodCreditValue: toNumber(row.period_credit_total),
        periodNetChangeValue: toNumber(row.period_net_change),
      });
    });
  });
  var liquidityBalanceTotal = (0, vue_1.computed)(function () {
    var _a, _b;
    return toNumber(
      (_b =
        (_a = accountBalancesSummary.value) === null || _a === void 0
          ? void 0
          : _a.totals_by_account_type.asset) !== null && _b !== void 0
        ? _b
        : '0',
    );
  });
  var filteredTransactions = (0, vue_1.computed)(function () {
    return transactions.value.filter(function (transaction) {
      var normalizedQuery = activityFilters.query.trim().toLocaleLowerCase('es');
      if (normalizedQuery) {
        var haystack = __spreadArray(
          [transaction.description, transaction.notes],
          transaction.entries.map(function (entry) {
            return ''.concat(entry.account_name, ' ').concat(entry.notes);
          }),
          true,
        )
          .join(' ')
          .toLocaleLowerCase('es');
        if (!haystack.includes(normalizedQuery)) return false;
      }
      if (activityFilters.accountId !== 'all') {
        var expectedAccountId_1 = Number(activityFilters.accountId);
        if (
          !transaction.entries.some(function (entry) {
            return entry.account_id === expectedAccountId_1;
          })
        )
          return false;
      }
      if (activityFilters.kind !== 'all') {
        if (getTransactionActivityKind(transaction) !== activityFilters.kind) return false;
      }
      return true;
    });
  });
  var activeTab = (0, vue_1.ref)('cuentas');
  var MOVEMENTS_PAGE_SIZE = 50;
  var cuentasSelectedAccountId = (0, vue_1.ref)(null);
  var cuentasDateFrom = (0, vue_1.ref)('');
  var cuentasDateTo = (0, vue_1.ref)('');
  var cuentasVisibleCount = (0, vue_1.ref)(MOVEMENTS_PAGE_SIZE);
  var todosDateFrom = (0, vue_1.ref)('');
  var todosDateTo = (0, vue_1.ref)('');
  var todosVisibleCount = (0, vue_1.ref)(MOVEMENTS_PAGE_SIZE);
  function signedImpact(accountType, side, amount) {
    var value = toNumber(amount);
    if (value === 0) return 0;
    var increasesOnDebit = accountType === 'asset' || accountType === 'expense';
    return (increasesOnDebit ? side === 'debit' : side === 'credit') ? value : -value;
  }
  function impactTone(value) {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }
  var cuentasSelectedAccount = (0, vue_1.computed)(function () {
    var _a;
    return cuentasSelectedAccountId.value != null
      ? (_a = accounts.value.find(function (a) {
          return a.id === cuentasSelectedAccountId.value;
        })) !== null && _a !== void 0
        ? _a
        : null
      : null;
  });
  var cuentasRawTransactions = (0, vue_1.computed)(function () {
    if (cuentasSelectedAccountId.value === null) return [];
    var accountId = cuentasSelectedAccountId.value;
    var account = cuentasSelectedAccount.value;
    if (!account) return [];
    return transactions.value
      .filter(function (t) {
        return (
          t.entries.some(function (e) {
            return e.account_id === accountId;
          }) &&
          (!cuentasDateFrom.value || t.booking_date >= cuentasDateFrom.value) &&
          (!cuentasDateTo.value || t.booking_date <= cuentasDateTo.value)
        );
      })
      .map(function (t) {
        var impactValue = t.entries
          .filter(function (e) {
            return e.account_id === accountId;
          })
          .reduce(function (sum, e) {
            return sum + signedImpact(account.account_type, e.side, e.amount);
          }, 0);
        return __assign(__assign({}, t), {
          impactValue: impactValue,
          tone: impactTone(impactValue),
        });
      });
  });
  var cuentasVisibleTransactions = (0, vue_1.computed)(function () {
    return cuentasRawTransactions.value.slice(0, cuentasVisibleCount.value);
  });
  var cuentasHasMore = (0, vue_1.computed)(function () {
    return cuentasVisibleCount.value < cuentasRawTransactions.value.length;
  });
  function loadMoreCuentas() {
    cuentasVisibleCount.value += MOVEMENTS_PAGE_SIZE;
  }
  (0, vue_1.watch)(cuentasSelectedAccountId, function () {
    cuentasVisibleCount.value = MOVEMENTS_PAGE_SIZE;
  });
  (0, vue_1.watch)([cuentasDateFrom, cuentasDateTo], function () {
    cuentasVisibleCount.value = MOVEMENTS_PAGE_SIZE;
  });
  var todosRawTransactions = (0, vue_1.computed)(function () {
    return filteredTransactions.value.filter(function (t) {
      return (
        (!todosDateFrom.value || t.booking_date >= todosDateFrom.value) &&
        (!todosDateTo.value || t.booking_date <= todosDateTo.value)
      );
    });
  });
  var todosVisibleTransactions = (0, vue_1.computed)(function () {
    return todosRawTransactions.value.slice(0, todosVisibleCount.value);
  });
  var todosHasMore = (0, vue_1.computed)(function () {
    return todosVisibleCount.value < todosRawTransactions.value.length;
  });
  function loadMoreTodos() {
    todosVisibleCount.value += MOVEMENTS_PAGE_SIZE;
  }
  (0, vue_1.watch)([activityFilters, todosDateFrom, todosDateTo], function () {
    todosVisibleCount.value = MOVEMENTS_PAGE_SIZE;
  });
  function transactionMainAmount(t) {
    var debitTotal = t.entries
      .filter(function (e) {
        return e.side === 'debit';
      })
      .reduce(function (sum, e) {
        return sum + toNumber(e.amount);
      }, 0);
    return debitTotal;
  }
  function resetAccountForm() {
    accountForm.name = '';
    accountForm.account_type = 'asset';
    accountForm.currency = 'EUR';
    accountForm.origin = 'user';
    accountForm.notes = '';
  }
  function resetTransactionForm() {
    transactionForm.booking_date = new Date().toISOString().slice(0, 10);
    transactionForm.value_date = transactionForm.booking_date;
    transactionForm.description = '';
    transactionForm.status = 'posted';
    transactionForm.origin = 'manual';
    transactionForm.notes = '';
    transactionForm.entries = [
      {
        key: ++rowId,
        account_id: null,
        side: 'debit',
        amount: '',
        currency: 'EUR',
        notes: '',
      },
      {
        key: ++rowId,
        account_id: null,
        side: 'credit',
        amount: '',
        currency: 'EUR',
        notes: '',
      },
    ];
  }
  function resetQuickEntryForm() {
    quickEntryForm.movement_type = 'expense';
    quickEntryForm.booking_date = new Date().toISOString().slice(0, 10);
    quickEntryForm.value_date = quickEntryForm.booking_date;
    quickEntryForm.description = '';
    quickEntryForm.amount = '';
    quickEntryForm.account_id = null;
    quickEntryForm.counterparty_account_id = null;
    quickEntryForm.liability_account_id = null;
    quickEntryForm.interest_account_id = null;
    quickEntryForm.principal_amount = '';
    quickEntryForm.interest_amount = '';
    quickEntryForm.flow_family = '';
    quickEntryForm.category_key = '';
    quickEntryForm.subcategory_key = '';
    quickEntryForm.annual_income_entry_id = null;
    quickEntryForm.annual_expense_entry_id = null;
    quickEntryForm.notes = '';
  }
  function resetEditTransactionForm() {
    editTransactionId.value = null;
    editTransactionPersistedEntries.value = [];
    editTransactionForm.booking_date = new Date().toISOString().slice(0, 10);
    editTransactionForm.value_date = editTransactionForm.booking_date;
    editTransactionForm.booking_time = '12:00';
    editTransactionForm.description = '';
    editTransactionForm.notes = '';
    editTransactionForm.account_id = null;
    editTransactionForm.counterparty_account_id = null;
    editTransactionForm.amount = '';
    editTransactionForm.currency = 'EUR';
    editTransactionForm.kind = 'transfer';
    editTransactionForm.initial_kind = 'transfer';
    editTransactionForm.category_key = '';
    editTransactionForm.subcategory_key = '';
    editTransactionForm.kind_label = '';
  }
  function toEditableKind(transaction) {
    var detected = getTransactionActivityKind(transaction);
    if (detected === 'income') return 'income';
    if (detected === 'expense') return 'expense';
    if (detected === 'investment_purchase') return 'investment_purchase';
    if (detected === 'debt_payment') return 'debt_payment';
    return 'transfer';
  }
  function activityKindDisplay(kind) {
    if (kind === 'income') return 'Ingreso';
    if (kind === 'expense') return 'Gasto';
    if (kind === 'transfer') return 'Transferencia';
    if (kind === 'investment_purchase') return 'Inversion';
    if (kind === 'debt_payment') return 'Deuda';
    return 'Ajuste';
  }
  function getTransactionEditAmount(transaction) {
    var debitTotalValue = transaction.entries
      .filter(function (entry) {
        return entry.side === 'debit';
      })
      .reduce(function (sum, entry) {
        return sum + toNumber(entry.amount);
      }, 0);
    return debitTotalValue.toFixed(2);
  }
  function resolveEditAccountsForKind(transaction, kind, debitEntry, creditEntry) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (kind === 'income') {
      return {
        accountId:
          (_a = debitEntry === null || debitEntry === void 0 ? void 0 : debitEntry.account_id) !==
            null && _a !== void 0
            ? _a
            : null,
        counterpartyAccountId: null,
      };
    }
    if (kind === 'expense') {
      return {
        accountId:
          (_b =
            creditEntry === null || creditEntry === void 0 ? void 0 : creditEntry.account_id) !==
            null && _b !== void 0
            ? _b
            : null,
        counterpartyAccountId: null,
      };
    }
    if (kind === 'debt_payment') {
      var liabilityEntry =
        (_d =
          (_c = transaction.entries.find(function (entry) {
            var _a;
            return (
              ((_a = accountMap.value.get(entry.account_id)) === null || _a === void 0
                ? void 0
                : _a.account_type) === 'liability'
            );
          })) !== null && _c !== void 0
            ? _c
            : transaction.entries.find(function (entry) {
                return entry.side === 'debit';
              })) !== null && _d !== void 0
          ? _d
          : debitEntry;
      return {
        accountId:
          (_e =
            creditEntry === null || creditEntry === void 0 ? void 0 : creditEntry.account_id) !==
            null && _e !== void 0
            ? _e
            : null,
        counterpartyAccountId:
          (_f =
            liabilityEntry === null || liabilityEntry === void 0
              ? void 0
              : liabilityEntry.account_id) !== null && _f !== void 0
            ? _f
            : null,
      };
    }
    return {
      accountId:
        (_g = creditEntry === null || creditEntry === void 0 ? void 0 : creditEntry.account_id) !==
          null && _g !== void 0
          ? _g
          : null,
      counterpartyAccountId:
        (_h = debitEntry === null || debitEntry === void 0 ? void 0 : debitEntry.account_id) !==
          null && _h !== void 0
          ? _h
          : null,
    };
  }
  function fillEditTransactionForm(transaction) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var primaryClassifiedEntry =
      (_a = transaction.entries.find(function (entry) {
        return (
          Boolean(entry.flow_family) &&
          Boolean(entry.category_key) &&
          Boolean(entry.subcategory_key)
        );
      })) !== null && _a !== void 0
        ? _a
        : null;
    editTransactionId.value = transaction.id;
    editTransactionPersistedEntries.value = transaction.entries.map(function (entry) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return {
        account_id: entry.account_id,
        side: entry.side,
        amount: String(entry.amount),
        currency: entry.currency,
        flow_family: (_a = entry.flow_family) !== null && _a !== void 0 ? _a : '',
        category_key: (_b = entry.category_key) !== null && _b !== void 0 ? _b : '',
        subcategory_key: (_c = entry.subcategory_key) !== null && _c !== void 0 ? _c : '',
        annual_income_entry_id:
          (_d = entry.annual_income_entry_id) !== null && _d !== void 0 ? _d : null,
        annual_expense_entry_id:
          (_e = entry.annual_expense_entry_id) !== null && _e !== void 0 ? _e : null,
        asset_id: (_f = entry.asset_id) !== null && _f !== void 0 ? _f : null,
        liability_id: (_g = entry.liability_id) !== null && _g !== void 0 ? _g : null,
        notes: (_h = entry.notes) !== null && _h !== void 0 ? _h : '',
      };
    });
    editTransactionForm.booking_date = transaction.booking_date;
    editTransactionForm.value_date = transaction.value_date;
    editTransactionForm.booking_time = '12:00';
    editTransactionForm.description = transaction.description;
    editTransactionForm.notes = (_b = transaction.notes) !== null && _b !== void 0 ? _b : '';
    editTransactionForm.currency =
      (_d = (_c = transaction.entries[0]) === null || _c === void 0 ? void 0 : _c.currency) !==
        null && _d !== void 0
        ? _d
        : 'EUR';
    editTransactionForm.amount = getTransactionEditAmount(transaction);
    var kind = toEditableKind(transaction);
    editTransactionForm.kind = kind;
    editTransactionForm.initial_kind = kind;
    var debitEntry =
      (_f =
        (_e = transaction.entries.find(function (entry) {
          return entry.side === 'debit';
        })) !== null && _e !== void 0
          ? _e
          : transaction.entries[0]) !== null && _f !== void 0
        ? _f
        : null;
    var creditEntry =
      (_h =
        (_g = transaction.entries.find(function (entry) {
          return entry.side === 'credit';
        })) !== null && _g !== void 0
          ? _g
          : transaction.entries[1]) !== null && _h !== void 0
        ? _h
        : null;
    var _l = resolveEditAccountsForKind(transaction, kind, debitEntry, creditEntry),
      accountId = _l.accountId,
      counterpartyAccountId = _l.counterpartyAccountId;
    editTransactionForm.account_id = accountId;
    editTransactionForm.counterparty_account_id = counterpartyAccountId;
    editTransactionForm.category_key =
      (_j =
        primaryClassifiedEntry === null || primaryClassifiedEntry === void 0
          ? void 0
          : primaryClassifiedEntry.category_key) !== null && _j !== void 0
        ? _j
        : '';
    editTransactionForm.subcategory_key =
      (_k =
        primaryClassifiedEntry === null || primaryClassifiedEntry === void 0
          ? void 0
          : primaryClassifiedEntry.subcategory_key) !== null && _k !== void 0
        ? _k
        : '';
    editTransactionForm.kind_label = activityKindDisplay(kind);
  }
  function scaleEntriesToAmount(entries, targetAmount) {
    var scaled = entries.map(function (entry) {
      return __assign({}, entry);
    });
    var debitIndexes = scaled
      .map(function (entry, index) {
        return entry.side === 'debit' ? index : -1;
      })
      .filter(function (index) {
        return index >= 0;
      });
    var creditIndexes = scaled
      .map(function (entry, index) {
        return entry.side === 'credit' ? index : -1;
      })
      .filter(function (index) {
        return index >= 0;
      });
    var currentDebitTotal = debitIndexes.reduce(function (sum, index) {
      return sum + toNumber(scaled[index].amount);
    }, 0);
    if (currentDebitTotal <= 0) return scaled;
    var factor = targetAmount / currentDebitTotal;
    var round2 = function (value) {
      return Math.round(value * 100) / 100;
    };
    var applySide = function (indexes) {
      if (!indexes.length) return;
      var allocated = 0;
      indexes.forEach(function (index, position) {
        var currentValue = toNumber(scaled[index].amount);
        var isLast = position === indexes.length - 1;
        var nextValue = isLast ? round2(targetAmount - allocated) : round2(currentValue * factor);
        allocated = round2(allocated + nextValue);
        scaled[index].amount = nextValue.toFixed(2);
      });
    };
    applySide(debitIndexes);
    applySide(creditIndexes);
    return scaled;
  }
  function setEditedKindOnEntries(entries, kind, categoryKey, subcategoryKey) {
    var _a, _b;
    var nextEntries = entries.map(function (entry) {
      return __assign(__assign({}, entry), {
        flow_family: '',
        category_key: '',
        subcategory_key: '',
        annual_income_entry_id: null,
        annual_expense_entry_id: null,
        asset_id: null,
        liability_id: null,
      });
    });
    if (!isClassificationKind(kind)) return nextEntries;
    var preferredSide = kind === 'income' ? 'credit' : 'debit';
    var preferredEntry =
      (_b =
        (_a = nextEntries.find(function (entry) {
          return entry.side === preferredSide;
        })) !== null && _a !== void 0
          ? _a
          : nextEntries[0]) !== null && _b !== void 0
        ? _b
        : null;
    if (!preferredEntry) return nextEntries;
    preferredEntry.flow_family = kind;
    preferredEntry.category_key = categoryKey;
    preferredEntry.subcategory_key = subcategoryKey;
    return nextEntries;
  }
  function setEditedAccountsOnEntries(entries, kind, accountId, counterpartyAccountId) {
    var _a, _b, _c, _d;
    var nextEntries = entries.map(function (entry) {
      return __assign({}, entry);
    });
    var debitEntry =
      (_b =
        (_a = nextEntries.find(function (entry) {
          return entry.side === 'debit';
        })) !== null && _a !== void 0
          ? _a
          : nextEntries[0]) !== null && _b !== void 0
        ? _b
        : null;
    var creditEntry =
      (_d =
        (_c = nextEntries.find(function (entry) {
          return entry.side === 'credit';
        })) !== null && _c !== void 0
          ? _c
          : nextEntries[1]) !== null && _d !== void 0
        ? _d
        : null;
    var setAccount = function (entry, targetId) {
      if (!entry || targetId == null) return;
      var targetAccount = accountMap.value.get(targetId);
      if (!targetAccount) return;
      entry.account_id = targetId;
      entry.currency = targetAccount.currency;
    };
    if (kind === 'income') {
      setAccount(debitEntry, accountId);
      setAccount(creditEntry, counterpartyAccountId);
      return nextEntries;
    }
    if (kind === 'expense') {
      setAccount(creditEntry, accountId);
      setAccount(debitEntry, counterpartyAccountId);
      return nextEntries;
    }
    if (kind === 'balance_adjustment') {
      return nextEntries;
    }
    setAccount(creditEntry, accountId);
    setAccount(debitEntry, counterpartyAccountId);
    return nextEntries;
  }
  function resolveClassificationCounterpartyAccountId(kind, currency) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var expectedType = kind === 'income' ? 'income' : 'expense';
    var candidates = accounts.value.filter(function (account) {
      return account.account_type === expectedType;
    });
    if (!candidates.length) return null;
    return (_h =
      (_f =
        (_d =
          (_b =
            (_a = candidates.find(function (account) {
              return account.currency === currency && account.origin === 'system';
            })) === null || _a === void 0
              ? void 0
              : _a.id) !== null && _b !== void 0
            ? _b
            : (_c = candidates.find(function (account) {
                  return account.currency === currency;
                })) === null || _c === void 0
              ? void 0
              : _c.id) !== null && _d !== void 0
          ? _d
          : (_e = candidates.find(function (account) {
                return account.origin === 'system';
              })) === null || _e === void 0
            ? void 0
            : _e.id) !== null && _f !== void 0
        ? _f
        : (_g = candidates[0]) === null || _g === void 0
          ? void 0
          : _g.id) !== null && _h !== void 0
      ? _h
      : null;
  }
  function ensureClassificationCounterpartyAccountId(kind, currency) {
    return __awaiter(this, void 0, void 0, function () {
      var existingId, normalizedCurrency, accountType, defaultName, created, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            existingId = resolveClassificationCounterpartyAccountId(kind, currency);
            if (existingId != null) return [2 /*return*/, existingId];
            normalizedCurrency = currency.trim().toUpperCase();
            accountType = kind === 'income' ? 'income' : 'expense';
            defaultName = kind === 'income' ? 'Ingresos sin categoria' : 'Gastos sin categoria';
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [
              4 /*yield*/,
              api_1.coreAccountingApi.createAccount({
                name: defaultName,
                account_type: accountType,
                currency: normalizedCurrency,
                origin: 'system',
                notes: 'Autogenerada al reclasificar movimiento desde edicion.',
              }),
            ];
          case 2:
            created = _a.sent();
            return [4 /*yield*/, store.refreshAll()];
          case 3:
            _a.sent();
            return [2 /*return*/, created.data.id];
          case 4:
            error_1 = _a.sent();
            store.error = (0, errors_1.toApiErrorMessage)(error_1);
            return [2 /*return*/, null];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  }
  function resolveAdjustmentCounterpartyAccountId(currency) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var candidates = accounts.value.filter(function (account) {
      return account.account_type === 'equity';
    });
    if (!candidates.length) return null;
    return (_h =
      (_f =
        (_d =
          (_b =
            (_a = candidates.find(function (account) {
              return account.currency === currency && account.origin === 'system';
            })) === null || _a === void 0
              ? void 0
              : _a.id) !== null && _b !== void 0
            ? _b
            : (_c = candidates.find(function (account) {
                  return account.currency === currency;
                })) === null || _c === void 0
              ? void 0
              : _c.id) !== null && _d !== void 0
          ? _d
          : (_e = candidates.find(function (account) {
                return account.origin === 'system';
              })) === null || _e === void 0
            ? void 0
            : _e.id) !== null && _f !== void 0
        ? _f
        : (_g = candidates[0]) === null || _g === void 0
          ? void 0
          : _g.id) !== null && _h !== void 0
      ? _h
      : null;
  }
  function ensureAdjustmentCounterpartyAccountId(currency) {
    return __awaiter(this, void 0, void 0, function () {
      var existingId, normalizedCurrency, created, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            existingId = resolveAdjustmentCounterpartyAccountId(currency);
            if (existingId != null) return [2 /*return*/, existingId];
            normalizedCurrency = currency.trim().toUpperCase();
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [
              4 /*yield*/,
              api_1.coreAccountingApi.createAccount({
                name: 'Ajustes de saldo',
                account_type: 'equity',
                currency: normalizedCurrency,
                origin: 'system',
                notes: 'Autogenerada al ajustar saldos desde edicion de movimientos.',
              }),
            ];
          case 2:
            created = _a.sent();
            return [4 /*yield*/, store.refreshAll()];
          case 3:
            _a.sent();
            return [2 /*return*/, created.data.id];
          case 4:
            error_2 = _a.sent();
            store.error = (0, errors_1.toApiErrorMessage)(error_2);
            return [2 /*return*/, null];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  }
  function accountDeltaSide(accountType, delta) {
    var debitIncreases = accountType === 'asset' || accountType === 'expense';
    if (delta >= 0) return debitIncreases ? 'debit' : 'credit';
    return debitIncreases ? 'credit' : 'debit';
  }
  function buildBalanceAdjustmentEntries(amount, targetAccount, counterpartyAccount) {
    var targetSide = accountDeltaSide(targetAccount.account_type, amount);
    var counterpartySide = targetSide === 'debit' ? 'credit' : 'debit';
    var absoluteAmount = Math.abs(round2(amount)).toFixed(2);
    var makeEntry = function (account, side) {
      return {
        account_id: account.id,
        side: side,
        amount: absoluteAmount,
        currency: account.currency,
        flow_family: '',
        category_key: '',
        subcategory_key: '',
        annual_income_entry_id: null,
        annual_expense_entry_id: null,
        asset_id: null,
        liability_id: null,
        notes: '',
      };
    };
    return [makeEntry(targetAccount, targetSide), makeEntry(counterpartyAccount, counterpartySide)];
  }
  function validateEditedTransactionInput() {
    var parsedAmount = Number(formatDecimalInput(editTransactionForm.amount));
    if (!Number.isFinite(parsedAmount)) {
      store.error = 'Introduce un importe valido.';
      return null;
    }
    if (editTransactionForm.kind !== 'balance_adjustment' && parsedAmount <= 0) {
      store.error = 'El importe debe ser mayor que 0.';
      return null;
    }
    if (editKindNeedsClassification.value) {
      if (!editTransactionForm.category_key || !editTransactionForm.subcategory_key) {
        store.error = 'Selecciona categoria y subcategoria para el tipo elegido.';
        return null;
      }
    }
    if (editTransactionForm.account_id == null) {
      store.error = 'Selecciona una cuenta.';
      return null;
    }
    if (
      editKindNeedsCounterparty.value &&
      (editTransactionForm.counterparty_account_id == null ||
        editTransactionForm.counterparty_account_id === editTransactionForm.account_id)
    ) {
      store.error =
        editTransactionForm.kind === 'debt_payment'
          ? 'Selecciona una cuenta de pasivo distinta para la deuda.'
          : 'Selecciona una contracuenta distinta.';
      return null;
    }
    var selectedAccount = accountMap.value.get(editTransactionForm.account_id);
    if (!selectedAccount) {
      store.error = 'La cuenta seleccionada no existe o no esta activa.';
      return null;
    }
    return { parsedAmount: parsedAmount, selectedAccount: selectedAccount };
  }
  function resolveEditedTransactionEntries(parsedAmount, selectedAccount) {
    return __awaiter(this, void 0, void 0, function () {
      var targetBalance,
        currentBalance,
        delta,
        counterpartyId,
        counterpartyAccount,
        editedAmount,
        classificationCounterpartyAccountId,
        _a,
        scaledEntries,
        kindAdjustedEntries;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!(editTransactionForm.kind === 'balance_adjustment')) return [3 /*break*/, 2];
            targetBalance = round2(parsedAmount);
            currentBalance = round2(toNumber(selectedAccount.current_balance));
            delta = round2(targetBalance - currentBalance);
            if (Math.abs(delta) < 0.005) {
              store.error = 'El saldo de la cuenta ya coincide con el objetivo.';
              return [2 /*return*/, null];
            }
            return [4 /*yield*/, ensureAdjustmentCounterpartyAccountId(selectedAccount.currency)];
          case 1:
            counterpartyId = _b.sent();
            if (counterpartyId == null) {
              store.error = 'No hay cuenta de contrapartida para registrar el ajuste.';
              return [2 /*return*/, null];
            }
            counterpartyAccount = accountMap.value.get(counterpartyId);
            if (!counterpartyAccount) {
              store.error = 'No se pudo resolver la cuenta de contrapartida del ajuste.';
              return [2 /*return*/, null];
            }
            return [
              2 /*return*/,
              buildBalanceAdjustmentEntries(delta, selectedAccount, counterpartyAccount),
            ];
          case 2:
            editedAmount = round2(parsedAmount);
            if (!editKindNeedsCounterparty.value) return [3 /*break*/, 3];
            _a = editTransactionForm.counterparty_account_id;
            return [3 /*break*/, 5];
          case 3:
            return [
              4 /*yield*/,
              ensureClassificationCounterpartyAccountId(
                editTransactionForm.kind,
                selectedAccount.currency,
              ),
            ];
          case 4:
            _a = _b.sent();
            _b.label = 5;
          case 5:
            classificationCounterpartyAccountId = _a;
            if (!editKindNeedsCounterparty.value && classificationCounterpartyAccountId == null) {
              store.error = 'No hay cuenta contable de contrapartida para ese tipo y moneda.';
              return [2 /*return*/, null];
            }
            scaledEntries = scaleEntriesToAmount(
              editTransactionPersistedEntries.value,
              editedAmount,
            );
            kindAdjustedEntries =
              editTransactionForm.kind === editTransactionForm.initial_kind
                ? scaledEntries
                : setEditedKindOnEntries(
                    scaledEntries,
                    editTransactionForm.kind,
                    editTransactionForm.category_key,
                    editTransactionForm.subcategory_key,
                  );
            return [
              2 /*return*/,
              setEditedAccountsOnEntries(
                kindAdjustedEntries,
                editTransactionForm.kind,
                editTransactionForm.account_id,
                classificationCounterpartyAccountId,
              ),
            ];
        }
      });
    });
  }
  function getTransactionActivityKind(transaction) {
    var hasIncomeClassified = transaction.entries.some(function (entry) {
      return entry.flow_family === 'income';
    });
    if (hasIncomeClassified) return 'income';
    var hasExpenseClassified = transaction.entries.some(function (entry) {
      return entry.flow_family === 'expense';
    });
    var hasIncomeLink = transaction.entries.some(function (entry) {
      return entry.annual_income_entry_id != null;
    });
    if (hasIncomeLink) return 'income';
    var hasExpenseLink = transaction.entries.some(function (entry) {
      return entry.annual_expense_entry_id != null;
    });
    var hasLiabilityLink = transaction.entries.some(function (entry) {
      return entry.liability_id != null;
    });
    if (hasLiabilityLink) return 'debt_payment';
    if (hasExpenseClassified) return 'expense';
    if (hasExpenseLink) return 'expense';
    var assetEntries = transaction.entries.filter(function (entry) {
      var _a;
      return (
        ((_a = accountMap.value.get(entry.account_id)) === null || _a === void 0
          ? void 0
          : _a.account_type) === 'asset'
      );
    });
    var hasAssetPositionLink = transaction.entries.some(function (entry) {
      return entry.asset_id != null;
    });
    if (hasAssetPositionLink) return 'investment_purchase';
    if (assetEntries.length >= 2) return 'transfer';
    return 'other';
  }
  function activityKindLabel(transaction) {
    var kind = getTransactionActivityKind(transaction);
    if (kind === 'income') return 'Ingreso';
    if (kind === 'expense') return 'Gasto';
    if (kind === 'transfer') return 'Transferencia';
    if (kind === 'investment_purchase') return 'Compra inversion';
    if (kind === 'debt_payment') return 'Pago deuda';
    return 'Asiento';
  }
  function liquidityBalanceDeltaTone(row) {
    var value = toNumber(row.period_net_change);
    if (value === 0) return 'neutral';
    if (row.account_type === 'asset' || row.account_type === 'expense') {
      return value > 0 ? 'positive' : 'negative';
    }
    return value > 0 ? 'negative' : 'positive';
  }
  function addEntry(side) {
    transactionForm.entries.push({
      key: ++rowId,
      account_id: null,
      side: side,
      amount: '',
      currency: 'EUR',
      notes: '',
    });
  }
  function removeEntry(key) {
    if (transactionForm.entries.length <= 2) return;
    transactionForm.entries = transactionForm.entries.filter(function (entry) {
      return entry.key !== key;
    });
  }
  function reloadPeriod() {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            successMessage.value = null;
            return [
              4 /*yield*/,
              Promise.all([
                incomeStore.loadAll(selectedYear.value),
                expenseStore.loadAll(selectedYear.value),
              ]),
            ];
          case 1:
            _a.sent();
            return [4 /*yield*/, store.setStatsYear(selectedYear.value)];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }
  function refreshManualPositionOptions() {
    return __awaiter(this, void 0, void 0, function () {
      var _a, assetsRes, liabilitiesRes, error_3;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            return [
              4 /*yield*/,
              Promise.all([
                api_2.coreNetWorthApi.getAssets(),
                api_2.coreNetWorthApi.getLiabilities(),
              ]),
            ];
          case 1:
            ((_a = _b.sent()), (assetsRes = _a[0]), (liabilitiesRes = _a[1]));
            manualAssets.value = assetsRes.data;
            manualLiabilities.value = liabilitiesRes.data;
            if (
              activationForm.position_id != null &&
              !availableManualPositionOptions.value.some(function (row) {
                return row.id === activationForm.position_id;
              })
            ) {
              activationForm.position_id = null;
            }
            return [3 /*break*/, 3];
          case 2:
            error_3 = _b.sent();
            store.error = (0, errors_1.toApiErrorMessage)(error_3);
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  }
  function submitAccount() {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            successMessage.value = null;
            return [
              4 /*yield*/,
              store.createAccount({
                name: accountForm.name.trim(),
                account_type: accountForm.account_type,
                currency: accountForm.currency.trim().toUpperCase(),
                origin: accountForm.origin,
                notes: accountForm.notes.trim(),
              }),
            ];
          case 1:
            _a.sent();
            resetAccountForm();
            successMessage.value = 'Cuenta contable creada.';
            return [2 /*return*/];
        }
      });
    });
  }
  function activateNetWorthPosition() {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (activationForm.position_id == null) return [2 /*return*/];
            return [
              4 /*yield*/,
              activateNetWorthPositions(activationForm.position_type, [activationForm.position_id]),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }
  function activateNetWorthPositions(positionType, positionIds) {
    return __awaiter(this, void 0, void 0, function () {
      var error_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!positionIds.length) return [2 /*return*/];
            accountActivationLoading.value = true;
            successMessage.value = null;
            store.error = null;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 7, 8, 9]);
            if (!(positionType === 'asset')) return [3 /*break*/, 3];
            return [
              4 /*yield*/,
              Promise.all(
                positionIds.map(function (positionId) {
                  return api_2.coreNetWorthApi.updateAsset(positionId, {
                    tracking_mode: 'accounting',
                  });
                }),
              ),
            ];
          case 2:
            _a.sent();
            return [3 /*break*/, 5];
          case 3:
            return [
              4 /*yield*/,
              Promise.all(
                positionIds.map(function (positionId) {
                  return api_2.coreNetWorthApi.updateLiability(positionId, {
                    tracking_mode: 'accounting',
                  });
                }),
              ),
            ];
          case 4:
            _a.sent();
            _a.label = 5;
          case 5:
            activationForm.position_id = null;
            return [4 /*yield*/, Promise.all([store.refreshAll(), refreshManualPositionOptions()])];
          case 6:
            _a.sent();
            successMessage.value =
              positionIds.length === 1
                ? 'Tracking contable activado para la posicion seleccionada.'
                : 'Tracking contable activado para '.concat(
                    positionIds.length,
                    ' posiciones seleccionadas.',
                  );
            return [3 /*break*/, 9];
          case 7:
            error_4 = _a.sent();
            store.error = (0, errors_1.toApiErrorMessage)(error_4);
            throw error_4;
          case 8:
            accountActivationLoading.value = false;
            return [7 /*endfinally*/];
          case 9:
            return [2 /*return*/];
        }
      });
    });
  }
  function removeNetWorthTracking(account) {
    return __awaiter(this, void 0, void 0, function () {
      var targetType, targetId, error_5;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            targetType =
              account.asset_id != null
                ? 'asset'
                : account.liability_id != null
                  ? 'liability'
                  : null;
            targetId =
              (_a = account.asset_id) !== null && _a !== void 0 ? _a : account.liability_id;
            if (!targetType || targetId == null) return [2 /*return*/];
            successMessage.value = null;
            if (
              !confirm(
                'Quitar tracking contable de "'.concat(account.name, '"?\n\n') +
                  'La posicion volvera a tracking manual y dejara de formar parte del resumen contable.',
              )
            )
              return [2 /*return*/];
            accountActivationLoading.value = true;
            store.error = null;
            _b.label = 1;
          case 1:
            _b.trys.push([1, 8, 9, 10]);
            if (!(targetType === 'asset')) return [3 /*break*/, 3];
            return [
              4 /*yield*/,
              api_2.coreNetWorthApi.updateAsset(targetId, { tracking_mode: 'manual' }),
            ];
          case 2:
            _b.sent();
            return [3 /*break*/, 5];
          case 3:
            return [
              4 /*yield*/,
              api_2.coreNetWorthApi.updateLiability(targetId, { tracking_mode: 'manual' }),
            ];
          case 4:
            _b.sent();
            _b.label = 5;
          case 5:
            return [
              4 /*yield*/,
              api_1.coreAccountingApi.updateAccount(account.id, {
                is_active: false,
                asset_id: null,
                liability_id: null,
              }),
            ];
          case 6:
            _b.sent();
            return [4 /*yield*/, Promise.all([store.refreshAll(), refreshManualPositionOptions()])];
          case 7:
            _b.sent();
            successMessage.value = 'Tracking contable desactivado para la cuenta seleccionada.';
            return [3 /*break*/, 10];
          case 8:
            error_5 = _b.sent();
            store.error = (0, errors_1.toApiErrorMessage)(error_5);
            throw error_5;
          case 9:
            accountActivationLoading.value = false;
            return [7 /*endfinally*/];
          case 10:
            return [2 /*return*/];
        }
      });
    });
  }
  function deleteAccount(accountId, accountName) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            successMessage.value = null;
            if (
              !confirm(
                'Eliminar cuenta "'.concat(accountName, '"?\n\n') +
                  'Esto borrara tambien todos sus asientos y transacciones relacionadas. ' +
                  'La accion es irreversible y puede afectar saldos e historico.',
              )
            )
              return [2 /*return*/];
            return [4 /*yield*/, store.deleteAccount(accountId)];
          case 1:
            _a.sent();
            successMessage.value = 'Cuenta contable eliminada.';
            return [2 /*return*/];
        }
      });
    });
  }
  function submitTransaction() {
    return __awaiter(this, void 0, void 0, function () {
      var payload;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            successMessage.value = null;
            payload = {
              booking_date: transactionForm.booking_date,
              value_date: transactionForm.value_date,
              description: transactionForm.description.trim(),
              status: transactionForm.status,
              origin: transactionForm.origin,
              notes: transactionForm.notes.trim(),
              entries: transactionForm.entries.map(function (entry) {
                var _a;
                return {
                  account_id: (_a = entry.account_id) !== null && _a !== void 0 ? _a : 0,
                  side: entry.side,
                  amount: formatDecimalInput(entry.amount),
                  currency: entry.currency.trim().toUpperCase(),
                  notes: entry.notes.trim(),
                };
              }),
            };
            return [4 /*yield*/, store.createTransaction(payload)];
          case 1:
            _a.sent();
            resetTransactionForm();
            successMessage.value = 'Movimiento contable registrado.';
            return [2 /*return*/];
        }
      });
    });
  }
  function openTransactionForEditing(transactionId) {
    var transaction = transactions.value.find(function (row) {
      return row.id === transactionId;
    });
    if (!transaction) return false;
    if (transaction.origin === 'system') {
      store.error = 'Los asientos de origen system no se pueden editar desde esta vista.';
      return false;
    }
    fillEditTransactionForm(transaction);
    return true;
  }
  function submitEditedTransaction() {
    return __awaiter(this, void 0, void 0, function () {
      var validated, payloadEntries, payload, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (editTransactionId.value == null) return [2 /*return*/, false];
            if (!editTransactionPersistedEntries.value.length) return [2 /*return*/, false];
            validated = validateEditedTransactionInput();
            if (!validated) return [2 /*return*/, false];
            return [
              4 /*yield*/,
              resolveEditedTransactionEntries(validated.parsedAmount, validated.selectedAccount),
            ];
          case 1:
            payloadEntries = _b.sent();
            if (
              !(payloadEntries === null || payloadEntries === void 0
                ? void 0
                : payloadEntries.length)
            ) {
              store.error = 'No se pudo construir el asiento actualizado.';
              return [2 /*return*/, false];
            }
            successMessage.value = null;
            store.error = null;
            payload = {
              booking_date: editTransactionForm.booking_date,
              value_date: editTransactionForm.value_date,
              description: editTransactionForm.description.trim(),
              status: 'posted',
              origin: 'manual',
              notes: editTransactionForm.notes.trim(),
              entries: payloadEntries.map(function (entry) {
                return {
                  account_id: entry.account_id,
                  side: entry.side,
                  amount: formatDecimalInput(entry.amount),
                  currency: entry.currency.trim().toUpperCase(),
                  flow_family: entry.flow_family,
                  category_key: entry.category_key,
                  subcategory_key: entry.subcategory_key,
                  annual_income_entry_id: entry.annual_income_entry_id,
                  annual_expense_entry_id: entry.annual_expense_entry_id,
                  asset_id: entry.asset_id,
                  liability_id: entry.liability_id,
                  notes: entry.notes.trim(),
                };
              }),
            };
            _b.label = 2;
          case 2:
            _b.trys.push([2, 4, , 5]);
            return [4 /*yield*/, store.updateTransaction(editTransactionId.value, payload)];
          case 3:
            _b.sent();
            resetEditTransactionForm();
            successMessage.value = 'Movimiento contable actualizado.';
            return [2 /*return*/, true];
          case 4:
            _a = _b.sent();
            return [2 /*return*/, false];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  }
  function deleteTransaction(transactionId, transactionDescription) {
    return __awaiter(this, void 0, void 0, function () {
      var transaction;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            transaction = transactions.value.find(function (row) {
              return row.id === transactionId;
            });
            if (
              (transaction === null || transaction === void 0 ? void 0 : transaction.origin) ===
              'system'
            ) {
              store.error = 'Los asientos de origen system no se pueden eliminar desde esta vista.';
              return [2 /*return*/];
            }
            successMessage.value = null;
            if (
              !confirm(
                'Eliminar movimiento "'.concat(transactionDescription, '"?\n\n') +
                  'La accion es irreversible y puede afectar saldos e historico.',
              )
            ) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, store.deleteTransaction(transactionId)];
          case 1:
            _a.sent();
            successMessage.value = 'Movimiento contable eliminado.';
            return [2 /*return*/];
        }
      });
    });
  }
  function submitQuickEntry() {
    return __awaiter(this, void 0, void 0, function () {
      var payload;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            successMessage.value = null;
            payload = __assign(
              __assign(
                __assign(
                  __assign(
                    __assign(
                      __assign(
                        {
                          movement_type: quickEntryForm.movement_type,
                          booking_date: quickEntryForm.booking_date,
                          value_date: quickEntryForm.value_date,
                          description: quickEntryForm.description.trim(),
                          amount: formatDecimalInput(quickEntryForm.amount),
                          account_id:
                            (_a = quickEntryForm.account_id) !== null && _a !== void 0 ? _a : 0,
                          notes: quickEntryForm.notes.trim(),
                          status: 'posted',
                          origin: 'manual',
                        },
                        quickEntryNeedsClassification.value
                          ? {
                              flow_family:
                                quickEntryForm.movement_type === 'income' ? 'income' : 'expense',
                              category_key: quickEntryForm.category_key,
                              subcategory_key: quickEntryForm.subcategory_key,
                            }
                          : {},
                      ),
                      quickEntryForm.movement_type === 'transfer'
                        ? { counterparty_account_id: quickEntryForm.counterparty_account_id }
                        : {},
                    ),
                    quickEntryForm.movement_type === 'income'
                      ? quickEntryForm.annual_income_entry_id != null
                        ? { annual_income_entry_id: quickEntryForm.annual_income_entry_id }
                        : {}
                      : {},
                  ),
                  quickEntryForm.movement_type === 'expense'
                    ? quickEntryForm.annual_expense_entry_id != null
                      ? { annual_expense_entry_id: quickEntryForm.annual_expense_entry_id }
                      : {}
                    : {},
                ),
                quickEntryForm.movement_type === 'investment_purchase'
                  ? { counterparty_account_id: quickEntryForm.counterparty_account_id }
                  : {},
              ),
              quickEntryForm.movement_type === 'debt_payment'
                ? __assign(
                    __assign(
                      {
                        liability_account_id: quickEntryForm.liability_account_id,
                        principal_amount: formatDecimalInput(quickEntryForm.principal_amount),
                        interest_amount: formatDecimalInput(quickEntryForm.interest_amount || '0'),
                      },
                      quickEntryForm.annual_expense_entry_id != null
                        ? { annual_expense_entry_id: quickEntryForm.annual_expense_entry_id }
                        : {},
                    ),
                    toNumber(quickEntryForm.interest_amount) > 0
                      ? { interest_account_id: quickEntryForm.interest_account_id }
                      : {},
                  )
                : {},
            );
            return [4 /*yield*/, store.createQuickEntry(payload)];
          case 1:
            _b.sent();
            resetQuickEntryForm();
            successMessage.value = 'Movimiento rapido registrado.';
            return [2 /*return*/];
        }
      });
    });
  }
  function setMoneyWizImportFile(file) {
    moneyWizImportFile.value = file;
    store.clearMoneyWizImportState();
  }
  function previewMoneyWizImport() {
    return __awaiter(this, void 0, void 0, function () {
      var preview;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!moneyWizImportFile.value) {
              store.error = 'Selecciona antes un CSV exportado desde MoneyWiz.';
              return [2 /*return*/, null];
            }
            successMessage.value = null;
            return [4 /*yield*/, store.previewMoneyWizImport(moneyWizImportFile.value)];
          case 1:
            preview = _a.sent();
            successMessage.value =
              preview.error_row_count > 0
                ? 'Preview generada con filas que necesitan revision antes de importar.'
                : 'Preview MoneyWiz lista para confirmar la importacion.';
            return [2 /*return*/, preview];
        }
      });
    });
  }
  function commitMoneyWizImport() {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!moneyWizImportFile.value) {
              store.error = 'Selecciona antes un CSV exportado desde MoneyWiz.';
              return [2 /*return*/, null];
            }
            if (!moneyWizImportPreview.value) {
              store.error = 'Genera primero la preview del CSV antes de confirmar.';
              return [2 /*return*/, null];
            }
            if (moneyWizImportPreview.value.error_row_count > 0) {
              store.error =
                'Corrige o elimina las filas con errores antes de confirmar la importacion.';
              return [2 /*return*/, null];
            }
            successMessage.value = null;
            return [4 /*yield*/, store.commitMoneyWizImport(moneyWizImportFile.value)];
          case 1:
            result = _a.sent();
            successMessage.value =
              result.created_count > 0
                ? 'Importacion MoneyWiz completada: '.concat(
                    result.created_count,
                    ' movimientos nuevos.',
                  )
                : 'Importacion MoneyWiz completada sin crear movimientos nuevos.';
            return [2 /*return*/, result];
        }
      });
    });
  }
  (0, vue_1.onMounted)(function () {
    void Promise.all([
      store.refreshAll(),
      incomeStore.loadAll(selectedYear.value),
      expenseStore.loadAll(selectedYear.value),
      refreshManualPositionOptions(),
    ]);
  });
  return {
    loading: loading,
    accountCreationLoading: accountCreationLoading,
    accountActivationLoading: accountActivationLoading,
    transactionCreationLoading: transactionCreationLoading,
    importPreviewLoading: importPreviewLoading,
    importCommitLoading: importCommitLoading,
    error: error,
    successMessage: successMessage,
    accounts: accounts,
    transactions: transactions,
    monthlySummary: monthlySummary,
    accountBalancesSummary: accountBalancesSummary,
    moneyWizImportPreview: moneyWizImportPreview,
    moneyWizImportCommitResult: moneyWizImportCommitResult,
    selectedYear: selectedYear,
    selectedMonth: selectedMonth,
    yearOptions: yearOptions,
    monthOptions: monthOptions,
    accountTypeOptions: accountTypeOptions,
    manualPositionTypeOptions: manualPositionTypeOptions,
    quickMovementTypeOptions: quickMovementTypeOptions,
    editMovementTypeOptions: editMovementTypeOptions,
    editAccountOptions: editAccountOptions,
    editCounterpartyOptions: editCounterpartyOptions,
    editCounterpartyMissingHint: editCounterpartyMissingHint,
    editKindNeedsCounterparty: editKindNeedsCounterparty,
    editKindNeedsClassification: editKindNeedsClassification,
    editCounterpartyLabel: editCounterpartyLabel,
    editSelectedAccountCurrentBalance: editSelectedAccountCurrentBalance,
    editCategoryOptions: editCategoryOptions,
    editSubcategoryOptions: editSubcategoryOptions,
    accountForm: accountForm,
    activationForm: activationForm,
    quickEntryForm: quickEntryForm,
    transactionForm: transactionForm,
    editTransactionId: editTransactionId,
    editTransactionForm: editTransactionForm,
    activityFilters: activityFilters,
    moneyWizImportFile: moneyWizImportFile,
    liquidityAccounts: liquidityAccounts,
    availableManualPositionOptions: availableManualPositionOptions,
    accountPositionMetaByAccountId: accountPositionMetaByAccountId,
    accountDisplayName: accountDisplayName,
    hasAvailableManualPositions: hasAvailableManualPositions,
    liquidityBalanceRows: liquidityBalanceRows,
    liquidityBalanceTotal: liquidityBalanceTotal,
    incomeOptions: incomeOptions,
    expenseOptions: expenseOptions,
    annualIncomeOptionsCompatible: annualIncomeOptionsCompatible,
    annualExpenseOptionsCompatible: annualExpenseOptionsCompatible,
    quickEntryNeedsClassification: quickEntryNeedsClassification,
    quickCategoryOptions: quickCategoryOptions,
    quickSubcategoryOptions: quickSubcategoryOptions,
    transferCounterpartyOptions: transferCounterpartyOptions,
    investmentCounterpartyOptions: investmentCounterpartyOptions,
    liabilityCounterpartyOptions: liabilityCounterpartyOptions,
    debtInterestOptions: debtInterestOptions,
    quickEntryReady: quickEntryReady,
    editEntryReady: editEntryReady,
    debitTotal: debitTotal,
    creditTotal: creditTotal,
    transactionBalanced: transactionBalanced,
    summaryRows: summaryRows,
    filteredTransactions: filteredTransactions,
    activeTab: activeTab,
    cuentasSelectedAccountId: cuentasSelectedAccountId,
    cuentasSelectedAccount: cuentasSelectedAccount,
    cuentasDateFrom: cuentasDateFrom,
    cuentasDateTo: cuentasDateTo,
    cuentasRawTransactions: cuentasRawTransactions,
    cuentasVisibleTransactions: cuentasVisibleTransactions,
    cuentasHasMore: cuentasHasMore,
    loadMoreCuentas: loadMoreCuentas,
    todosDateFrom: todosDateFrom,
    todosDateTo: todosDateTo,
    todosRawTransactions: todosRawTransactions,
    todosVisibleTransactions: todosVisibleTransactions,
    todosHasMore: todosHasMore,
    loadMoreTodos: loadMoreTodos,
    transactionMainAmount: transactionMainAmount,
    addEntry: addEntry,
    activityKindLabel: activityKindLabel,
    liquidityBalanceDeltaTone: liquidityBalanceDeltaTone,
    removeEntry: removeEntry,
    reloadPeriod: reloadPeriod,
    activateNetWorthPosition: activateNetWorthPosition,
    activateNetWorthPositions: activateNetWorthPositions,
    removeNetWorthTracking: removeNetWorthTracking,
    refreshManualPositionOptions: refreshManualPositionOptions,
    submitAccount: submitAccount,
    setMoneyWizImportFile: setMoneyWizImportFile,
    previewMoneyWizImport: previewMoneyWizImport,
    commitMoneyWizImport: commitMoneyWizImport,
    deleteAccount: deleteAccount,
    submitQuickEntry: submitQuickEntry,
    submitTransaction: submitTransaction,
    openTransactionForEditing: openTransactionForEditing,
    submitEditedTransaction: submitEditedTransaction,
    resetEditTransactionForm: resetEditTransactionForm,
    deleteTransaction: deleteTransaction,
  };
}
