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
var annualIncomeStore_1 = require('../annualIncomeStore');
var mocks = vitest_1.vi.hoisted(function () {
  return {
    api: {
      get: vitest_1.vi.fn(),
      post: vitest_1.vi.fn(),
      patch: vitest_1.vi.fn(),
      delete: vitest_1.vi.fn(),
    },
  };
});
vitest_1.vi.mock('@/lib/api', function () {
  return {
    api: mocks.api,
  };
});
vitest_1.vi.mock('@/lib/errors', function () {
  return {
    toApiErrorMessage: function (error) {
      return error instanceof Error ? error.message : 'error';
    },
  };
});
(0, vitest_1.describe)('annual income store (core)', function () {
  (0, vitest_1.beforeEach)(function () {
    vitest_1.vi.clearAllMocks();
  });
  (0, vitest_1.it)('loads entries and totals from core api', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.api.get
              .mockResolvedValueOnce({
                data: [
                  {
                    id: 1,
                    name: 'CTN',
                    category: 'salary',
                    subcategory: 'employee_salary',
                    owner_name: 'Pablo',
                    income_type: 'recurrent',
                    amount_annual: '32460.00',
                    fiscal_year: 2026,
                    currency: 'EUR',
                    notes: '',
                    created_at: '2026-02-20T00:00:00Z',
                  },
                ],
              })
              .mockResolvedValueOnce({
                data: { total_annual: '32460.00', currency_hint: 'mixed' },
              });
            store = (0, annualIncomeStore_1.useAnnualIncomeStore)('core');
            return [4 /*yield*/, store.loadAll(2026)];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.entries.value).toHaveLength(1);
            (0, vitest_1.expect)(store.totalAnnual.value).toBe(32460);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('creates, updates and deletes entries via core api', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store, createResult, updateResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.api.post.mockResolvedValue({ data: { id: 1 } });
            mocks.api.patch.mockResolvedValue({ data: { id: 1 } });
            mocks.api.delete.mockResolvedValue({ data: {} });
            mocks.api.get.mockResolvedValue({ data: [] });
            store = (0, annualIncomeStore_1.useAnnualIncomeStore)('core');
            return [
              4 /*yield*/,
              store.addEntry(
                {
                  name: 'CTN',
                  category: 'salary',
                  subcategory: 'employee_salary',
                  incomeType: 'recurrent',
                  amountAnnual: '32460,00',
                  fiscalYear: 2026,
                  currency: 'EUR',
                  notes: '',
                },
                2026,
              ),
            ];
          case 1:
            createResult = _a.sent();
            (0, vitest_1.expect)(createResult.ok).toBe(true);
            (0, vitest_1.expect)(mocks.api.post).toHaveBeenCalledWith(
              '/api/budget/annual-income/',
              vitest_1.expect.objectContaining({
                name: 'CTN',
                category: 'salary',
                subcategory: 'employee_salary',
                amount_annual: '32460.00',
                fiscal_year: 2026,
              }),
            );
            return [
              4 /*yield*/,
              store.updateEntry(
                1,
                {
                  name: 'CTN actualizado',
                  category: 'salary',
                  subcategory: 'employee_salary',
                  incomeType: 'recurrent',
                  amountAnnual: '33000,00',
                  fiscalYear: 2026,
                  currency: 'EUR',
                  notes: 'update',
                },
                2026,
              ),
            ];
          case 2:
            updateResult = _a.sent();
            (0, vitest_1.expect)(updateResult.ok).toBe(true);
            (0, vitest_1.expect)(mocks.api.patch).toHaveBeenCalledWith(
              '/api/budget/annual-income/1/',
              vitest_1.expect.objectContaining({
                name: 'CTN actualizado',
                category: 'salary',
                subcategory: 'employee_salary',
                amount_annual: '33000.00',
                fiscal_year: 2026,
              }),
            );
            return [4 /*yield*/, store.deleteEntry(10, 2026)];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(mocks.api.delete).toHaveBeenCalledWith(
              '/api/budget/annual-income/10/',
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('rejects invalid subcategory before calling api', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store, result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            store = (0, annualIncomeStore_1.useAnnualIncomeStore)('core');
            return [
              4 /*yield*/,
              store.addEntry(
                {
                  name: 'Linea invalida',
                  category: 'salary',
                  subcategory: 'inheritance',
                  incomeType: 'one_off',
                  amountAnnual: '1000',
                  fiscalYear: 2026,
                  currency: 'EUR',
                  notes: '',
                },
                2026,
              ),
            ];
          case 1:
            result = _a.sent();
            (0, vitest_1.expect)(result.ok).toBe(false);
            (0, vitest_1.expect)(mocks.api.post).not.toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
});
