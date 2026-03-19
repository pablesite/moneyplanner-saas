'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.peopleApi = exports.corePeopleApi = exports.premiumPeopleApi = void 0;
var api_1 = require('@/lib/api');
var capabilities_1 = require('@/domains/capabilities');
exports.premiumPeopleApi = {
  getMembers: function () {
    return api_1.coreApi.get('/api/family-members/');
  },
  createMember: function (payload) {
    return api_1.coreApi.post('/api/family-members/', payload);
  },
  updateMember: function (id, patch) {
    return api_1.coreApi.patch('/api/family-members/'.concat(id, '/'), patch);
  },
  deleteMember: function (id) {
    return api_1.coreApi.delete('/api/family-members/'.concat(id, '/'));
  },
  getOwnerships: function () {
    return api_1.coreApi.get('/api/ownerships/');
  },
  createSharedOwnership: function (payload) {
    return api_1.coreApi.post('/api/ownerships/', {
      kind: 'shared',
      member: null,
      splits: payload.splits,
    });
  },
  updateSharedOwnership: function (id, payload) {
    return api_1.coreApi.patch('/api/ownerships/'.concat(id, '/'), {
      kind: 'shared',
      member: null,
      splits: payload.splits,
    });
  },
  deleteOwnership: function (id) {
    return api_1.coreApi.delete('/api/ownerships/'.concat(id, '/'));
  },
};
// Transitional behavior for Core v0 consolidation:
// use the same endpoint contract as SaaS while the backend domain is ported into Core.
exports.corePeopleApi = exports.premiumPeopleApi;
exports.peopleApi = capabilities_1.capabilities.people
  ? exports.premiumPeopleApi
  : exports.corePeopleApi;
