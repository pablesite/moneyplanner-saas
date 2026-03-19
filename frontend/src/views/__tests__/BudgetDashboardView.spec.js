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
/** @vitest-environment jsdom */
var vue_1 = require('vue');
var vitest_1 = require('vitest');
var test_utils_1 = require('@vue/test-utils');
var BudgetDashboardView_vue_1 = require('../BudgetDashboardView.vue');
var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth() + 1;
var mockUseRoute = vitest_1.vi.fn(function () {
  return { name: 'budget', path: '/presupuesto' };
});
var mockCoreApiGet = vitest_1.vi.hoisted(function () {
  return vitest_1.vi.fn();
});
var mockIncomeStore = vitest_1.vi.hoisted(function () {
  return {
    entries: { value: [] },
    totalAnnual: { value: 0 },
    loading: { value: false },
    error: { value: null },
    loadAll: vitest_1.vi.fn(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, undefined];
        });
      });
    }),
  };
});
var mockExpenseStore = vitest_1.vi.hoisted(function () {
  return {
    entries: { value: [] },
    totalAnnual: { value: 0 },
    loading: { value: false },
    error: { value: null },
    loadAll: vitest_1.vi.fn(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, undefined];
        });
      });
    }),
  };
});
var mockAccountingApi = vitest_1.vi.hoisted(function () {
  return {
    getMonthlySummary: vitest_1.vi.fn(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, { data: { fiscal_year: currentYear, months: [] } }];
        });
      });
    }),
    getTransactions: vitest_1.vi.fn(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, { data: [] }];
        });
      });
    }),
    getBudgetSuggestions: vitest_1.vi.fn(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            {
              data: {
                fiscal_year: currentYear,
                lookback_years: 2,
                window_months: 24,
                income: { series: [], categories: [], subcategories: [] },
                expense: { series: [], categories: [], subcategories: [] },
                method_note: '',
              },
            },
          ];
        });
      });
    }),
  };
});
vitest_1.vi.mock('vue-router', function () {
  return {
    useRoute: function () {
      return mockUseRoute();
    },
  };
});
vitest_1.vi.mock('@/lib/api', function () {
  return {
    coreApi: {
      get: mockCoreApiGet,
      post: vitest_1.vi.fn(),
      patch: vitest_1.vi.fn(),
      delete: vitest_1.vi.fn(),
    },
  };
});
vitest_1.vi.mock('@/domains/accounting', function () {
  return {
    coreAccountingApi: mockAccountingApi,
  };
});
vitest_1.vi.mock('@/domains/data-input', function () {
  return {
    incomeCategories: [{ value: 'salary', label: 'Salario' }],
    incomeSubcategories: [{ category: 'salary', value: 'employee_salary', label: 'Nomina' }],
    expenseCategories: [{ value: 'consumption_expenses', label: 'Gastos' }],
    expenseSubcategories: [
      { category: 'consumption_expenses', value: 'living_expenses', label: 'Alimentacion' },
    ],
    useAnnualIncomeStore: function () {
      return mockIncomeStore;
    },
    useAnnualExpenseStore: function () {
      return mockExpenseStore;
    },
  };
});
function makeMonthlySummary(executed) {
  if (executed === void 0) {
    executed = '0.00';
  }
  return {
    fiscal_year: currentYear,
    planned_total: '12000.00',
    executed_total: executed,
    pending_total: '0.00',
    variance_total: '0.00',
    completion_ratio: 0,
    months_with_checkins: 0,
    has_executed_data: executed !== '0.00',
    months: [
      {
        month: currentMonth,
        planned: '1000.00',
        executed: executed,
        pending: '0.00',
        completion_ratio: 0,
        checkins_confirmed: 0,
        checkins_expected: 1,
      },
    ],
  };
}
function makeLiquiditySummary() {
  return {
    fiscal_year: currentYear,
    month: currentMonth,
    base_currency: 'EUR',
    planned_total: '0.00',
    executed_total: '0.00',
    deviation_total: '0.00',
    completion_ratio: 0,
    checkins_confirmed: 0,
    checkins_expected: 0,
    rows: [],
  };
}
function configureCoreApi(overrides) {
  var _this = this;
  mockCoreApiGet.mockImplementation(function (url) {
    return __awaiter(_this, void 0, void 0, function () {
      var _a, _b;
      return __generator(this, function (_c) {
        if (url === '/api/budget/annual-income/monthly-summary/') {
          return [
            2 /*return*/,
            {
              data: makeMonthlySummary(
                overrides === null || overrides === void 0
                  ? void 0
                  : overrides.incomeSummaryExecuted,
              ),
            },
          ];
        }
        if (url === '/api/budget/annual-expense/monthly-summary/') {
          return [
            2 /*return*/,
            {
              data: makeMonthlySummary(
                overrides === null || overrides === void 0
                  ? void 0
                  : overrides.expenseSummaryExecuted,
              ),
            },
          ];
        }
        if (url === '/api/budget/annual-income-checkins/') {
          return [
            2 /*return*/,
            {
              data:
                (_a =
                  overrides === null || overrides === void 0
                    ? void 0
                    : overrides.incomeCheckins) !== null && _a !== void 0
                  ? _a
                  : [],
            },
          ];
        }
        if (url === '/api/budget/annual-expense-checkins/') {
          return [
            2 /*return*/,
            {
              data:
                (_b =
                  overrides === null || overrides === void 0
                    ? void 0
                    : overrides.expenseCheckins) !== null && _b !== void 0
                  ? _b
                  : [],
            },
          ];
        }
        if (url === '/api/net-worth/liquidity/monthly-summary/') {
          return [2 /*return*/, { data: makeLiquiditySummary() }];
        }
        throw new Error('Unexpected GET '.concat(url));
      });
    });
  });
}
function openMonthlyStep(wrapper, label) {
  return __awaiter(this, void 0, void 0, function () {
    var button;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          button = wrapper.findAll('button').find(function (candidate) {
            return candidate.text().includes(label);
          });
          return [
            4 /*yield*/,
            button === null || button === void 0 ? void 0 : button.trigger('click'),
          ];
        case 1:
          _a.sent();
          return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function mountMonthlyCloseView() {
  return (0, test_utils_1.mount)(BudgetDashboardView_vue_1.default, {
    props: { mode: 'monthly-close' },
    global: {
      stubs: {
        RouterLink: (0, vue_1.defineComponent)({
          name: 'RouterLink',
          template: '<a><slot /></a>',
        }),
      },
    },
  });
}
(0, vitest_1.describe)('BudgetDashboardView', function () {
  (0, vitest_1.beforeEach)(function () {
    mockCoreApiGet.mockReset();
    mockAccountingApi.getMonthlySummary.mockReset();
    mockAccountingApi.getTransactions.mockReset();
    mockAccountingApi.getBudgetSuggestions.mockReset();
    mockIncomeStore.entries.value = [];
    mockIncomeStore.totalAnnual.value = 0;
    mockExpenseStore.entries.value = [];
    mockExpenseStore.totalAnnual.value = 0;
    mockIncomeStore.loadAll.mockClear();
    mockExpenseStore.loadAll.mockClear();
    mockAccountingApi.getBudgetSuggestions.mockResolvedValue({
      data: {
        fiscal_year: currentYear,
        lookback_years: 2,
        window_months: 24,
        income: { series: [], categories: [], subcategories: [] },
        expense: { series: [], categories: [], subcategories: [] },
        method_note: '',
      },
    });
  });
  (0, vitest_1.it)(
    'uses ledger coverage for income rows and disables legacy check-in editing',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, input;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              mockIncomeStore.entries.value = [
                {
                  id: 1,
                  name: 'Nomina',
                  category: 'salary',
                  subcategory: 'employee_salary',
                  owner: '',
                  incomeType: 'recurrent',
                  timeProfile: 'structural_recurrent',
                  cashflowRole: 'operating',
                  eventGroup: '',
                  targetMonth: null,
                  termEndMonth: null,
                  termEndYear: null,
                  amountInputPeriod: 'annual',
                  amountAnnual: 12000,
                  fiscalYear: currentYear,
                  currency: 'EUR',
                  notes: '',
                  createdAt: '',
                },
              ];
              mockIncomeStore.totalAnnual.value = 12000;
              configureCoreApi();
              mockAccountingApi.getMonthlySummary.mockResolvedValue({
                data: {
                  fiscal_year: currentYear,
                  months: [
                    {
                      month: currentMonth,
                      income_total: '1000.00',
                      expense_total: '0.00',
                      uncategorized_total: '0.00',
                    },
                  ],
                },
              });
              mockAccountingApi.getTransactions.mockResolvedValue({
                data: [
                  {
                    id: 10,
                    booking_date: ''.concat(currentYear, '-03-15'),
                    value_date: ''.concat(currentYear, '-03-15'),
                    description: 'Nomina',
                    status: 'posted',
                    origin: 'manual',
                    notes: '',
                    created_at: '',
                    updated_at: '',
                    entries: [
                      {
                        id: 101,
                        account_id: 1,
                        account_name: 'Cuenta corriente',
                        side: 'credit',
                        amount: '1000.00',
                        currency: 'EUR',
                        flow_family: 'income',
                        category_key: 'salary',
                        subcategory_key: 'employee_salary',
                        annual_income_entry_id: null,
                        annual_expense_entry_id: null,
                        asset_id: null,
                        liability_id: null,
                        notes: '',
                        created_at: '',
                        updated_at: '',
                      },
                    ],
                  },
                ],
              });
              wrapper = mountMonthlyCloseView();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 1:
              _a.sent();
              return [4 /*yield*/, openMonthlyStep(wrapper, 'Ingresos')];
            case 2:
              _a.sent();
              (0, vitest_1.expect)(wrapper.text()).toContain('1 via ledger');
              (0, vitest_1.expect)(wrapper.text()).toContain('Ledger categorizado');
              input = wrapper.find('input[placeholder="Importe ejecutado"]');
              (0, vitest_1.expect)(input.attributes('disabled')).toBeDefined();
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)(
    'keeps legacy expense fallback editable when there is no ledger coverage',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, input;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              mockExpenseStore.entries.value = [
                {
                  id: 2,
                  sourceLiabilityId: null,
                  isSystemGenerated: false,
                  name: 'Supermercado',
                  category: 'consumption_expenses',
                  subcategory: 'living_expenses',
                  owner: '',
                  expenseType: 'recurrent',
                  timeProfile: 'structural_recurrent',
                  cashflowRole: 'operating',
                  eventGroup: '',
                  targetMonth: null,
                  termEndMonth: null,
                  termEndYear: null,
                  amountInputPeriod: 'annual',
                  amountAnnual: 6000,
                  fiscalYear: currentYear,
                  currency: 'EUR',
                  notes: '',
                  createdAt: '',
                },
              ];
              mockExpenseStore.totalAnnual.value = 6000;
              configureCoreApi({
                expenseCheckins: [
                  {
                    id: 7,
                    annual_expense_entry_id: 2,
                    fiscal_year: currentYear,
                    month: currentMonth,
                    status: 'confirmed',
                    executed_amount: '500.00',
                    note: '',
                    confirmed_at: null,
                    created_at: '',
                    updated_at: '',
                  },
                ],
                expenseSummaryExecuted: '500.00',
              });
              mockAccountingApi.getMonthlySummary.mockResolvedValue({
                data: { fiscal_year: currentYear, months: [] },
              });
              mockAccountingApi.getTransactions.mockResolvedValue({ data: [] });
              wrapper = mountMonthlyCloseView();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 1:
              _a.sent();
              return [4 /*yield*/, openMonthlyStep(wrapper, 'Gastos')];
            case 2:
              _a.sent();
              (0, vitest_1.expect)(wrapper.text()).toContain('1 via fallback legacy');
              input = wrapper.find('input[placeholder="Importe ejecutado"]');
              (0, vitest_1.expect)(input.attributes('disabled')).toBeUndefined();
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)(
    'surfaces pendiente clasificar when categorized ledger is ambiguous across multiple lines',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              mockIncomeStore.entries.value = [
                {
                  id: 1,
                  name: 'Nomina A',
                  category: 'salary',
                  subcategory: 'employee_salary',
                  owner: '',
                  incomeType: 'recurrent',
                  timeProfile: 'structural_recurrent',
                  cashflowRole: 'operating',
                  eventGroup: '',
                  targetMonth: null,
                  termEndMonth: null,
                  termEndYear: null,
                  amountInputPeriod: 'annual',
                  amountAnnual: 12000,
                  fiscalYear: currentYear,
                  currency: 'EUR',
                  notes: '',
                  createdAt: '',
                },
                {
                  id: 2,
                  name: 'Nomina B',
                  category: 'salary',
                  subcategory: 'employee_salary',
                  owner: '',
                  incomeType: 'recurrent',
                  timeProfile: 'structural_recurrent',
                  cashflowRole: 'operating',
                  eventGroup: '',
                  targetMonth: null,
                  termEndMonth: null,
                  termEndYear: null,
                  amountInputPeriod: 'annual',
                  amountAnnual: 6000,
                  fiscalYear: currentYear,
                  currency: 'EUR',
                  notes: '',
                  createdAt: '',
                },
              ];
              mockIncomeStore.totalAnnual.value = 18000;
              configureCoreApi();
              mockAccountingApi.getMonthlySummary.mockResolvedValue({
                data: {
                  fiscal_year: currentYear,
                  months: [
                    {
                      month: currentMonth,
                      income_total: '1500.00',
                      expense_total: '0.00',
                      uncategorized_total: '0.00',
                    },
                  ],
                },
              });
              mockAccountingApi.getTransactions.mockResolvedValue({
                data: [
                  {
                    id: 10,
                    booking_date: ''.concat(currentYear, '-03-15'),
                    value_date: ''.concat(currentYear, '-03-15'),
                    description: 'Nomina',
                    status: 'posted',
                    origin: 'manual',
                    notes: '',
                    created_at: '',
                    updated_at: '',
                    entries: [
                      {
                        id: 101,
                        account_id: 1,
                        account_name: 'Cuenta corriente',
                        side: 'credit',
                        amount: '1500.00',
                        currency: 'EUR',
                        flow_family: 'income',
                        category_key: 'salary',
                        subcategory_key: 'employee_salary',
                        annual_income_entry_id: null,
                        annual_expense_entry_id: null,
                        asset_id: null,
                        liability_id: null,
                        notes: '',
                        created_at: '',
                        updated_at: '',
                      },
                    ],
                  },
                ],
              });
              wrapper = mountMonthlyCloseView();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 1:
              _a.sent();
              return [4 /*yield*/, openMonthlyStep(wrapper, 'Ingresos')];
            case 2:
              _a.sent();
              (0, vitest_1.expect)(wrapper.text()).toContain('Pendiente clasificar');
              (0, vitest_1.expect)(wrapper.text()).toContain('Nomina A');
              (0, vitest_1.expect)(wrapper.text()).toContain('Nomina B');
              return [2 /*return*/];
          }
        });
      });
    },
  );
});
