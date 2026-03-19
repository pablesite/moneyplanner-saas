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
Object.defineProperty(exports, '__esModule', { value: true });
exports.premiumOwnershipApi = exports.coreNetWorthApi = void 0;
var api_1 = require('@/lib/api');
exports.coreNetWorthApi = {
  getSummary: function () {
    return api_1.coreApi.get('/api/net-worth/summary/');
  },
  getAssets: function () {
    return api_1.coreApi.get('/api/net-worth/assets/');
  },
  getLiabilities: function () {
    return api_1.coreApi.get('/api/net-worth/liabilities/');
  },
  getSnapshots: function () {
    return api_1.coreApi.get('/api/net-worth/snapshots/');
  },
  getTimeline: function (params) {
    return api_1.coreApi.get('/api/net-worth/timeline/', {
      params:
        (params === null || params === void 0 ? void 0 : params.asset_category) ||
        (params === null || params === void 0 ? void 0 : params.liability_category)
          ? __assign(
              __assign(
                {},
                (params === null || params === void 0 ? void 0 : params.asset_category)
                  ? { asset_category: params.asset_category }
                  : {},
              ),
              (params === null || params === void 0 ? void 0 : params.liability_category)
                ? { liability_category: params.liability_category }
                : {},
            )
          : undefined,
    });
  },
  getAssetTimeline: function (id) {
    return api_1.coreApi.get('/api/net-worth/assets/'.concat(id, '/timeline/'));
  },
  getLiabilityTimeline: function (id) {
    return api_1.coreApi.get('/api/net-worth/liabilities/'.concat(id, '/timeline/'));
  },
  getAssetValuations: function () {
    return api_1.coreApi.get('/api/net-worth/asset-valuations/');
  },
  getLiabilityValuations: function () {
    return api_1.coreApi.get('/api/net-worth/liability-valuations/');
  },
  getInvestmentEvents: function () {
    return api_1.coreApi.get('/api/net-worth/investment-events/');
  },
  getLiquidityEvents: function () {
    return api_1.coreApi.get('/api/net-worth/liquidity-events/');
  },
  getLiabilityEvents: function () {
    return api_1.coreApi.get('/api/net-worth/liability-events/');
  },
  createSnapshotFromCurrent: function () {
    return api_1.coreApi.post('/api/net-worth/snapshots/from-current/');
  },
  deleteSnapshot: function (id) {
    return api_1.coreApi.delete('/api/net-worth/snapshots/'.concat(id, '/'));
  },
  createAsset: function (payload) {
    return api_1.coreApi.post('/api/net-worth/assets/', payload);
  },
  updateAsset: function (id, payload) {
    return api_1.coreApi.patch('/api/net-worth/assets/'.concat(id, '/'), payload);
  },
  deleteAsset: function (id) {
    return api_1.coreApi.delete('/api/net-worth/assets/'.concat(id, '/'));
  },
  createLiability: function (payload) {
    return api_1.coreApi.post('/api/net-worth/liabilities/', payload);
  },
  updateLiability: function (id, payload) {
    return api_1.coreApi.patch('/api/net-worth/liabilities/'.concat(id, '/'), payload);
  },
  deleteLiability: function (id) {
    return api_1.coreApi.delete('/api/net-worth/liabilities/'.concat(id, '/'));
  },
  getSettings: function () {
    return api_1.coreApi.get('/api/auth/settings/');
  },
  updateSettings: function (payload) {
    return api_1.coreApi.put('/api/auth/settings/', payload);
  },
};
exports.premiumOwnershipApi = {
  getOwnerships: function () {
    return api_1.coreApi.get('/api/ownerships/');
  },
  getOwnershipLinks: function () {
    return api_1.coreApi.get('/api/ownership-links/');
  },
  syncOwnershipLink: function (payload) {
    return api_1.coreApi.post('/api/ownership-links/sync/', payload);
  },
};
