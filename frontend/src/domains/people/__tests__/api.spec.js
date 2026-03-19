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
var api_1 = require('@/domains/people/api');
var capabilities_1 = require('@/domains/capabilities');
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
    coreApi: mocks.api,
  };
});
(0, vitest_1.describe)('people api (saas)', function () {
  (0, vitest_1.beforeEach)(function () {
    vitest_1.vi.clearAllMocks();
  });
  (0, vitest_1.it)('exports premium adapter as active api in saas', function () {
    if (capabilities_1.capabilities.people) {
      (0, vitest_1.expect)(api_1.peopleApi).toBe(api_1.premiumPeopleApi);
      return;
    }
    (0, vitest_1.expect)(api_1.peopleApi).toBe(api_1.corePeopleApi);
  });
  (0, vitest_1.it)('maps premium endpoints and payload shape', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var memberPayload, patchPayload, splitsPayload;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            memberPayload = { name: 'Ada', role: 'adult', is_active: true };
            patchPayload = { name: 'Ada Lovelace' };
            splitsPayload = {
              splits: [
                { member_id: 1, percent: '60' },
                { member_id: 2, percent: '40' },
              ],
            };
            return [4 /*yield*/, api_1.premiumPeopleApi.getMembers()];
          case 1:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.createMember(memberPayload)];
          case 2:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.updateMember(1, patchPayload)];
          case 3:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.deleteMember(1)];
          case 4:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.getOwnerships()];
          case 5:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.createSharedOwnership(splitsPayload)];
          case 6:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.updateSharedOwnership(5, splitsPayload)];
          case 7:
            _a.sent();
            return [4 /*yield*/, api_1.premiumPeopleApi.deleteOwnership(5)];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(mocks.api.get).toHaveBeenCalledWith('/api/family-members/');
            (0, vitest_1.expect)(mocks.api.post).toHaveBeenCalledWith(
              '/api/family-members/',
              memberPayload,
            );
            (0, vitest_1.expect)(mocks.api.patch).toHaveBeenCalledWith(
              '/api/family-members/1/',
              patchPayload,
            );
            (0, vitest_1.expect)(mocks.api.delete).toHaveBeenCalledWith('/api/family-members/1/');
            (0, vitest_1.expect)(mocks.api.get).toHaveBeenCalledWith('/api/ownerships/');
            (0, vitest_1.expect)(mocks.api.post).toHaveBeenCalledWith('/api/ownerships/', {
              kind: 'shared',
              member: null,
              splits: splitsPayload.splits,
            });
            (0, vitest_1.expect)(mocks.api.patch).toHaveBeenCalledWith('/api/ownerships/5/', {
              kind: 'shared',
              member: null,
              splits: splitsPayload.splits,
            });
            (0, vitest_1.expect)(mocks.api.delete).toHaveBeenCalledWith('/api/ownerships/5/');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('keeps core adapter mapped to transitional premium contract', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, api_1.corePeopleApi.getMembers()];
          case 1:
            _a.sent();
            return [
              4 /*yield*/,
              api_1.corePeopleApi.createMember({ name: 'Ada', role: 'adult', is_active: true }),
            ];
          case 2:
            _a.sent();
            return [4 /*yield*/, api_1.corePeopleApi.updateMember(1, { name: 'Ada' })];
          case 3:
            _a.sent();
            return [4 /*yield*/, api_1.corePeopleApi.deleteMember(1)];
          case 4:
            _a.sent();
            return [4 /*yield*/, api_1.corePeopleApi.getOwnerships()];
          case 5:
            _a.sent();
            return [
              4 /*yield*/,
              api_1.corePeopleApi.createSharedOwnership({
                splits: [{ member_id: 1, percent: '100' }],
              }),
            ];
          case 6:
            _a.sent();
            return [
              4 /*yield*/,
              api_1.corePeopleApi.updateSharedOwnership(1, {
                splits: [{ member_id: 1, percent: '100' }],
              }),
            ];
          case 7:
            _a.sent();
            return [4 /*yield*/, api_1.corePeopleApi.deleteOwnership(1)];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(mocks.api.get).toHaveBeenCalledWith('/api/family-members/');
            (0, vitest_1.expect)(mocks.api.post).toHaveBeenCalledWith('/api/family-members/', {
              name: 'Ada',
              role: 'adult',
              is_active: true,
            });
            (0, vitest_1.expect)(mocks.api.patch).toHaveBeenCalledWith('/api/family-members/1/', {
              name: 'Ada',
            });
            (0, vitest_1.expect)(mocks.api.delete).toHaveBeenCalledWith('/api/family-members/1/');
            (0, vitest_1.expect)(mocks.api.get).toHaveBeenCalledWith('/api/ownerships/');
            (0, vitest_1.expect)(mocks.api.post).toHaveBeenCalledWith('/api/ownerships/', {
              kind: 'shared',
              member: null,
              splits: [{ member_id: 1, percent: '100' }],
            });
            (0, vitest_1.expect)(mocks.api.patch).toHaveBeenCalledWith('/api/ownerships/1/', {
              kind: 'shared',
              member: null,
              splits: [{ member_id: 1, percent: '100' }],
            });
            (0, vitest_1.expect)(mocks.api.delete).toHaveBeenCalledWith('/api/ownerships/1/');
            return [2 /*return*/];
        }
      });
    });
  });
});
