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
var store_1 = require('@/domains/people/store');
var mocks = vitest_1.vi.hoisted(function () {
  return {
    peopleApi: {
      getMembers: vitest_1.vi.fn(),
      createMember: vitest_1.vi.fn(),
      updateMember: vitest_1.vi.fn(),
      deleteMember: vitest_1.vi.fn(),
      getOwnerships: vitest_1.vi.fn(),
      createSharedOwnership: vitest_1.vi.fn(),
      updateSharedOwnership: vitest_1.vi.fn(),
      deleteOwnership: vitest_1.vi.fn(),
    },
    toPeopleErrorMessage: vitest_1.vi.fn(function () {
      return 'people-error';
    }),
  };
});
vitest_1.vi.mock('@/domains/people/api', function () {
  return {
    peopleApi: mocks.peopleApi,
  };
});
vitest_1.vi.mock('@/domains/people/errors', function () {
  return {
    toPeopleErrorMessage: mocks.toPeopleErrorMessage,
  };
});
(0, vitest_1.describe)('people store (saas)', function () {
  (0, vitest_1.beforeEach)(function () {
    (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
    vitest_1.vi.clearAllMocks();
  });
  (0, vitest_1.it)('fetches members and computes active adults', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.peopleApi.getMembers.mockResolvedValue({
              data: [
                { id: 1, name: 'Ana', role: 'adult', is_active: true },
                { id: 2, name: 'Leo', role: 'child', is_active: true },
                { id: 3, name: 'Bob', role: 'adult', is_active: false },
              ],
            });
            store = (0, store_1.usePeopleStore)();
            return [4 /*yield*/, store.fetchMembers()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.members).toHaveLength(3);
            (0, vitest_1.expect)(store.activeAdults).toEqual([
              { id: 1, name: 'Ana', role: 'adult', is_active: true },
            ]);
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('maps fetch errors and clears explicit error state', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.peopleApi.getMembers.mockRejectedValue(new Error('boom'));
            store = (0, store_1.usePeopleStore)();
            store.error = 'existing';
            return [4 /*yield*/, store.fetchMembers()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('people-error');
            store.clearError();
            (0, vitest_1.expect)(store.error).toBeNull();
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('creates, updates and deletes members', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            mocks.peopleApi.createMember.mockResolvedValue({
              data: { id: 3, name: 'Ada', role: 'adult', is_active: true },
            });
            mocks.peopleApi.updateMember.mockResolvedValue({
              data: { id: 3, name: 'Ada Lovelace', role: 'adult', is_active: false },
            });
            mocks.peopleApi.deleteMember.mockResolvedValue({});
            store = (0, store_1.usePeopleStore)();
            store.members = [
              { id: 1, name: 'Zoe', role: 'adult', is_active: true },
              { id: 2, name: 'Pepe', role: 'child', is_active: true },
            ];
            return [4 /*yield*/, store.createMember({ name: 'Ada', role: 'adult' })];
          case 1:
            _c.sent();
            (0, vitest_1.expect)(mocks.peopleApi.createMember).toHaveBeenCalledWith({
              name: 'Ada',
              role: 'adult',
              is_active: true,
            });
            (0, vitest_1.expect)(
              store.members.map(function (m) {
                return m.name;
              }),
            ).toEqual(['Ada', 'Zoe', 'Pepe']);
            return [4 /*yield*/, store.updateMember(3, { name: 'Ada Lovelace', is_active: false })];
          case 2:
            _c.sent();
            (0, vitest_1.expect)(
              (_a = store.members.find(function (m) {
                return m.id === 3;
              })) === null || _a === void 0
                ? void 0
                : _a.name,
            ).toBe('Ada Lovelace');
            (0, vitest_1.expect)(
              (_b = store.members.find(function (m) {
                return m.id === 3;
              })) === null || _b === void 0
                ? void 0
                : _b.is_active,
            ).toBe(false);
            return [4 /*yield*/, store.deleteMember(2)];
          case 3:
            _c.sent();
            (0, vitest_1.expect)(mocks.peopleApi.deleteMember).toHaveBeenCalledWith(2);
            (0, vitest_1.expect)(
              store.members.some(function (m) {
                return m.id === 2;
              }),
            ).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('rethrows member write errors with mapped message', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.peopleApi.createMember.mockRejectedValue(new Error('boom'));
            store = (0, store_1.usePeopleStore)();
            return [
              4 /*yield*/,
              (0, vitest_1.expect)(
                store.createMember({ name: 'Ada', role: 'adult' }),
              ).rejects.toThrow('boom'),
            ];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.error).toBe('people-error');
            (0, vitest_1.expect)(store.loading).toBe(false);
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('handles ownership list/create/update/delete flows', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var store;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            mocks.peopleApi.getOwnerships.mockResolvedValue({
              data: [{ id: 5, kind: 'shared', member: null, splits: [], is_in_use: false }],
            });
            mocks.peopleApi.createSharedOwnership.mockResolvedValue({});
            mocks.peopleApi.updateSharedOwnership.mockResolvedValue({});
            mocks.peopleApi.deleteOwnership.mockResolvedValue({});
            store = (0, store_1.usePeopleStore)();
            store.ownerships = [
              {
                id: 1,
                kind: 'individual',
                member: { id: 1, name: 'Ana', role: 'adult' },
                splits: [],
                is_in_use: false,
              },
              { id: 5, kind: 'shared', member: null, splits: [], is_in_use: false },
            ];
            return [4 /*yield*/, store.fetchOwnerships()];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(store.ownerships).toHaveLength(1);
            return [
              4 /*yield*/,
              store.createSharedOwnership({ splits: [{ member_id: 1, percent: '100' }] }),
            ];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(mocks.peopleApi.createSharedOwnership).toHaveBeenCalled();
            (0, vitest_1.expect)(mocks.peopleApi.getOwnerships).toHaveBeenCalledTimes(2);
            return [
              4 /*yield*/,
              store.updateSharedOwnership(5, { splits: [{ member_id: 1, percent: '60' }] }),
            ];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(mocks.peopleApi.updateSharedOwnership).toHaveBeenCalledWith(5, {
              splits: [{ member_id: 1, percent: '60' }],
            });
            return [4 /*yield*/, store.deleteOwnership(5)];
          case 4:
            _a.sent();
            (0, vitest_1.expect)(store.ownerships).toEqual([]);
            return [2 /*return*/];
        }
      });
    });
  });
});
