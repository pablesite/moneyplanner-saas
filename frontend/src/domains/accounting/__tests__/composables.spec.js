'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var vitest_1 = require('vitest');
var pinia_1 = require('pinia');
var vue_1 = require('vue');
var test_utils_1 = require('@vue/test-utils');
var composables_1 = require('../composables');
var store_1 = require('../store');
var api_1 = require('../api');
var loadAnnualIncome = vitest_1.vi.fn();
var loadAnnualExpense = vitest_1.vi.fn();
vitest_1.vi.mock('../api', function () {
  return {
    coreAccountingApi: {
      getAccounts: vitest_1.vi.fn(),
      getTransactions: vitest_1.vi.fn(),
      getMonthlySummary: vitest_1.vi.fn(),
      getAccountBalances: vitest_1.vi.fn(),
      createAccount: vitest_1.vi.fn(),
      deleteAccount: vitest_1.vi.fn(),
      createTransaction: vitest_1.vi.fn(),
      createQuickEntry: vitest_1.vi.fn(),
      previewMoneyWizImport: vitest_1.vi.fn(),
      commitMoneyWizImport: vitest_1.vi.fn(),
    },
  };
});
vitest_1.vi.mock('@/domains/data-input', function () {
  return {
    incomeCategories: [{ value: 'salary', label: 'Salarios y trabajo' }],
    incomeSubcategories: [{ category: 'salary', value: 'employee_salary', label: 'Nomina' }],
    expenseCategories: [{ value: 'consumption_expenses', label: 'Gastos de consumo' }],
    expenseSubcategories: [
      { category: 'consumption_expenses', value: 'living_expenses', label: 'Alimentacion' },
    ],
    useAnnualIncomeStore: function () {
      return {
        entries: { value: [] },
        loadAll: loadAnnualIncome,
      };
    },
    useAnnualExpenseStore: function () {
      return {
        entries: { value: [] },
        loadAll: loadAnnualExpense,
      };
    },
  };
});
function seedRefreshResponses() {
  vitest_1.vi.mocked(api_1.coreAccountingApi.getAccounts).mockResolvedValue({
    data: [
      {
        id: 1,
        name: 'Cuenta corriente',
        account_type: 'asset',
        currency: 'EUR',
        origin: 'user',
        asset_id: null,
        liability_id: null,
        is_active: true,
        notes: '',
        current_balance: '1000.00',
        created_at: '',
        updated_at: '',
      },
    ],
  });
  vitest_1.vi.mocked(api_1.coreAccountingApi.getTransactions).mockResolvedValue({ data: [] });
  vitest_1.vi.mocked(api_1.coreAccountingApi.getMonthlySummary).mockResolvedValue({
    data: { fiscal_year: 2026, months: [] },
  });
  vitest_1.vi.mocked(api_1.coreAccountingApi.getAccountBalances).mockResolvedValue({
    data: {
      filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
      totals_by_account_type: { asset: '1000.00' },
      accounts: [],
    },
  });
}
(0, vitest_1.describe)('useAccountingPage', function () {
  (0, vitest_1.beforeEach)(function () {
    (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
    vitest_1.vi.clearAllMocks();
    seedRefreshResponses();
  });
  (0, vitest_1.it)(
    'omits annual plan ids from quick-entry payload when the movement is not linked',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var store, Harness, wrapper;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              store = (0, store_1.useAccountingStore)();
              Harness = (0, vue_1.defineComponent)({
                setup: function () {
                  return (0, composables_1.useAccountingPage)();
                },
                template: '<div />',
              });
              wrapper = (0, test_utils_1.mount)(Harness);
              return [4 /*yield*/, wrapper.vm.$nextTick()];
            case 1:
              _a.sent();
              wrapper.vm.quickEntryForm.movement_type = 'income';
              wrapper.vm.quickEntryForm.booking_date = '2026-03-15';
              wrapper.vm.quickEntryForm.value_date = '2026-03-15';
              wrapper.vm.quickEntryForm.description = 'Nomina marzo';
              wrapper.vm.quickEntryForm.amount = '500.00';
              wrapper.vm.quickEntryForm.account_id = 1;
              wrapper.vm.quickEntryForm.category_key = 'salary';
              wrapper.vm.quickEntryForm.subcategory_key = 'employee_salary';
              wrapper.vm.quickEntryForm.annual_income_entry_id = null;
              vitest_1.vi
                .mocked(api_1.coreAccountingApi.createQuickEntry)
                .mockResolvedValue({ data: {} });
              return [4 /*yield*/, wrapper.vm.submitQuickEntry()];
            case 2:
              _a.sent();
              (0, vitest_1.expect)(api_1.coreAccountingApi.createQuickEntry).toHaveBeenCalledWith(
                vitest_1.expect.not.objectContaining({
                  annual_income_entry_id: vitest_1.expect.anything(),
                  annual_expense_entry_id: vitest_1.expect.anything(),
                }),
              );
              (0, vitest_1.expect)(store.transactionCreationLoading).toBe(false);
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('requires a file before generating MoneyWiz preview', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var Harness, wrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            Harness = (0, vue_1.defineComponent)({
              setup: function () {
                return (0, composables_1.useAccountingPage)();
              },
              template: '<div />',
            });
            wrapper = (0, test_utils_1.mount)(Harness);
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 1:
            _a.sent();
            return [4 /*yield*/, wrapper.vm.previewMoneyWizImport()];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(wrapper.vm.error).toBe(
              'Selecciona antes un CSV exportado desde MoneyWiz.',
            );
            return [2 /*return*/];
        }
      });
    });
  });
});
