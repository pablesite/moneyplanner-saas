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
var store_1 = require('@/domains/net-worth/store');
var mocks = vitest_1.vi.hoisted(function () {
  return {
    coreNetWorthApi: {
      getSummary: vitest_1.vi.fn(),
      getAssets: vitest_1.vi.fn(),
      getLiabilities: vitest_1.vi.fn(),
      getSnapshots: vitest_1.vi.fn(),
      getTimeline: vitest_1.vi.fn(),
      getAssetTimeline: vitest_1.vi.fn(),
      getLiabilityTimeline: vitest_1.vi.fn(),
      getAssetValuations: vitest_1.vi.fn(),
      getLiabilityValuations: vitest_1.vi.fn(),
      getInvestmentEvents: vitest_1.vi.fn(),
      getLiquidityEvents: vitest_1.vi.fn(),
      getLiabilityEvents: vitest_1.vi.fn(),
      createSnapshotFromCurrent: vitest_1.vi.fn(),
      deleteSnapshot: vitest_1.vi.fn(),
      createAsset: vitest_1.vi.fn(),
      updateAsset: vitest_1.vi.fn(),
      deleteAsset: vitest_1.vi.fn(),
      createLiability: vitest_1.vi.fn(),
      updateLiability: vitest_1.vi.fn(),
      deleteLiability: vitest_1.vi.fn(),
      getSettings: vitest_1.vi.fn(),
      updateSettings: vitest_1.vi.fn(),
    },
    premiumOwnershipApi: {
      getOwnerships: vitest_1.vi.fn(),
      getOwnershipLinks: vitest_1.vi.fn(),
      syncOwnershipLink: vitest_1.vi.fn(),
    },
    buildByCategoryChart: vitest_1.vi.fn(function () {
      return { labels: [], assets: [], liabilities: [] };
    }),
    toApiErrorMessage: vitest_1.vi.fn(function () {
      return 'mapped-error';
    }),
  };
});
vitest_1.vi.mock('@/domains/net-worth/api', function () {
  return {
    coreNetWorthApi: mocks.coreNetWorthApi,
    premiumOwnershipApi: mocks.premiumOwnershipApi,
  };
});
vitest_1.vi.mock('@/domains/net-worth/charts', function () {
  return {
    buildByCategoryChart: mocks.buildByCategoryChart,
  };
});
vitest_1.vi.mock('@/lib/errors', function () {
  return {
    toApiErrorMessage: mocks.toApiErrorMessage,
  };
});
(0, vitest_1.describe)('net worth store (core)', function () {
  (0, vitest_1.beforeEach)(function () {
    (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
    vitest_1.vi.clearAllMocks();
    mocks.premiumOwnershipApi.getOwnerships.mockResolvedValue({ data: [] });
    mocks.premiumOwnershipApi.getOwnershipLinks.mockResolvedValue({ data: [] });
  });
  (0, vitest_1.it)('refreshes summary datasets', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
            mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [{ id: 1 }] });
            mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [{ id: 2 }] });
            mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [{ id: 3 }] });
            mocks.coreNetWorthApi.getTimeline.mockResolvedValue({
              data: { rows: [], base_currency: 'EUR' },
            });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.refreshAll()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.baseCurrency).toBe('EUR');
            (0, vitest_1.expect)(store.assets).toEqual([{ id: 1, ownership_ref: null }]);
            (0, vitest_1.expect)(store.liabilities).toEqual([{ id: 2, ownership_ref: null }]);
            (0, vitest_1.expect)(store.snapshots).toEqual([{ id: 3 }]);
            (0, vitest_1.expect)(store.timeline).toEqual({ rows: [], base_currency: 'EUR' });
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('handles snapshot creation errors and resets loading', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.createSnapshotFromCurrent.mockRejectedValue(new Error('boom'));
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.createTodaySnapshot()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('mapped-error');
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('maps refresh errors', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.getSummary.mockRejectedValue(new Error('boom'));
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.refreshAll()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('mapped-error');
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('creates and updates assets and liabilities', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.createAsset.mockResolvedValue({});
            mocks.coreNetWorthApi.updateAsset.mockResolvedValue({});
            mocks.coreNetWorthApi.createLiability.mockResolvedValue({});
            mocks.coreNetWorthApi.updateLiability.mockResolvedValue({});
            mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
            mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getTimeline.mockResolvedValue({ data: { rows: [] } });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.createAsset({ name: 'Cash' })];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.createAsset).toHaveBeenCalledWith({
              name: 'Cash',
            });
            return [4 /*yield*/, store.updateAsset(11, { name: 'Cash 2' })];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateAsset).toHaveBeenCalledWith(11, {
              name: 'Cash 2',
            });
            return [4 /*yield*/, store.archiveAsset(11)];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateAsset).toHaveBeenCalledWith(11, {
              is_active: false,
            });
            return [4 /*yield*/, store.deleteAsset(11)];
          case 4:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.deleteAsset).toHaveBeenCalledWith(11);
            return [4 /*yield*/, store.createLiability({ name: 'Debt' })];
          case 5:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.createLiability).toHaveBeenCalledWith({
              name: 'Debt',
            });
            return [4 /*yield*/, store.updateLiability(22, { name: 'Debt 2' })];
          case 6:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateLiability).toHaveBeenCalledWith(22, {
              name: 'Debt 2',
            });
            return [4 /*yield*/, store.archiveLiability(22)];
          case 7:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateLiability).toHaveBeenCalledWith(22, {
              is_active: false,
            });
            return [4 /*yield*/, store.deleteLiability(22)];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.deleteLiability).toHaveBeenCalledWith(22);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('deletes snapshots and maps delete errors', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.deleteSnapshot.mockResolvedValue({});
            mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
            mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getTimeline.mockResolvedValue({ data: { rows: [] } });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.deleteSnapshot(5)];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.deleteSnapshot).toHaveBeenCalledWith(5);
            (0, vitest_1.expect)(store.loading).toBe(false);
            mocks.coreNetWorthApi.deleteSnapshot.mockRejectedValueOnce(new Error('boom'));
            return [4 /*yield*/, store.deleteSnapshot(6)];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('mapped-error');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('fetches settings and updates base currency', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.getSettings.mockResolvedValue({
              data: { base_currency: 'USD', inflation_region: 'ES' },
            });
            mocks.coreNetWorthApi.updateSettings.mockResolvedValue({
              data: { base_currency: 'EUR', inflation_region: 'ES-MD' },
            });
            mocks.coreNetWorthApi.getSummary.mockResolvedValue({ data: { base_currency: 'EUR' } });
            mocks.coreNetWorthApi.getAssets.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getLiabilities.mockResolvedValue({ data: [] });
            mocks.coreNetWorthApi.getSnapshots.mockResolvedValue({ data: [] });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.fetchSettings()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.baseCurrency).toBe('USD');
            (0, vitest_1.expect)(store.inflationRegion).toBe('ES');
            return [4 /*yield*/, store.updateBaseCurrency('EUR')];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateSettings).toHaveBeenCalledWith({
              base_currency: 'EUR',
              inflation_region: 'ES',
            });
            (0, vitest_1.expect)(store.baseCurrency).toBe('EUR');
            return [4 /*yield*/, store.updateInflationRegion('ES-MD')];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.updateSettings).toHaveBeenLastCalledWith({
              base_currency: 'EUR',
              inflation_region: 'ES-MD',
            });
            (0, vitest_1.expect)(store.inflationRegion).toBe('ES-MD');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('fetches timeline with category filter', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            mocks.coreNetWorthApi.getTimeline.mockResolvedValue({
              data: {
                rows: [{ date: '2026-01-31', net_worth: '100.00' }],
                base_currency: 'EUR',
                filters: { asset_category: 'investments', liability_category: null },
              },
            });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.fetchTimeline('investments')];
          case 1:
            _b.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.getTimeline).toHaveBeenCalledWith({
              asset_category: 'investments',
              liability_category: null,
            });
            (0, vitest_1.expect)(store.timelineCategoryFilter).toBe('investments');
            (0, vitest_1.expect)(store.timelineCategoryFilterType).toBe('asset');
            (0, vitest_1.expect)(
              (_a = store.timeline) === null || _a === void 0 ? void 0 : _a.filters.asset_category,
            ).toBe('investments');
            (0, vitest_1.expect)(store.timelineLoading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('fetches position timeline for assets and liabilities', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            mocks.coreNetWorthApi.getAssetTimeline.mockResolvedValue({
              data: {
                position_type: 'asset',
                position_id: 4,
                rows: [{ date: '2026-03-31', value: '100' }],
              },
            });
            mocks.coreNetWorthApi.getLiabilityTimeline.mockResolvedValue({
              data: {
                position_type: 'liability',
                position_id: 7,
                rows: [{ date: '2026-03-31', value: '50' }],
              },
            });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.fetchPositionTimeline('asset', 4)];
          case 1:
            _c.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.getAssetTimeline).toHaveBeenCalledWith(4);
            (0, vitest_1.expect)(
              (_a = store.positionTimeline) === null || _a === void 0 ? void 0 : _a.position_id,
            ).toBe(4);
            return [4 /*yield*/, store.fetchPositionTimeline('liability', 7)];
          case 2:
            _c.sent();
            (0, vitest_1.expect)(mocks.coreNetWorthApi.getLiabilityTimeline).toHaveBeenCalledWith(
              7,
            );
            (0, vitest_1.expect)(
              (_b = store.positionTimeline) === null || _b === void 0 ? void 0 : _b.position_type,
            ).toBe('liability');
            (0, vitest_1.expect)(store.positionTimelineLoading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('fetches position activity for asset and liability modes', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.getAssetValuations.mockResolvedValue({
              data: [
                {
                  id: 1,
                  asset_ref: 4,
                  value: '100',
                  valuation_date: '2026-03-31',
                  source: 'manual',
                },
              ],
            });
            mocks.coreNetWorthApi.getInvestmentEvents.mockResolvedValue({
              data: [
                {
                  id: 2,
                  asset_ref: 4,
                  amount: '20',
                  event_date: '2026-03-15',
                  event_type: 'contribution',
                },
              ],
            });
            mocks.coreNetWorthApi.getLiabilityValuations.mockResolvedValue({
              data: [
                {
                  id: 3,
                  liability_ref: 7,
                  value: '50',
                  valuation_date: '2026-03-31',
                  source: 'manual',
                },
              ],
            });
            mocks.coreNetWorthApi.getLiabilityEvents.mockResolvedValue({
              data: [
                {
                  id: 4,
                  liability_ref: 7,
                  amount: '10',
                  event_date: '2026-03-18',
                  event_type: 'payment',
                },
              ],
            });
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.fetchPositionActivity('asset', 4, 'investments')];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.assetValuations).toHaveLength(1);
            (0, vitest_1.expect)(store.investmentEvents).toHaveLength(1);
            return [4 /*yield*/, store.fetchPositionActivity('liability', 7)];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(store.liabilityValuations).toHaveLength(1);
            (0, vitest_1.expect)(store.liabilityEvents).toHaveLength(1);
            (0, vitest_1.expect)(store.positionActivityLoading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('maps settings and update errors', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.coreNetWorthApi.getSettings.mockRejectedValueOnce(new Error('boom'));
            mocks.coreNetWorthApi.updateSettings.mockRejectedValueOnce(new Error('boom'));
            store = (0, store_1.useNetWorthStore)();
            return [4 /*yield*/, store.fetchSettings()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('mapped-error');
            return [4 /*yield*/, store.updateBaseCurrency('USD')];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('mapped-error');
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
});
