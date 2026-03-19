'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OwnershipManager = exports.OwnershipLabel = exports.FamilyMemberManager = void 0;
__exportStar(require('./api'), exports);
__exportStar(require('./composables'), exports);
__exportStar(require('./errors'), exports);
__exportStar(require('./store'), exports);
__exportStar(require('./types'), exports);
var FamilyMemberManager_vue_1 = require('./components/FamilyMemberManager.vue');
Object.defineProperty(exports, 'FamilyMemberManager', {
  enumerable: true,
  get: function () {
    return FamilyMemberManager_vue_1.default;
  },
});
var OwnershipLabel_vue_1 = require('./components/OwnershipLabel.vue');
Object.defineProperty(exports, 'OwnershipLabel', {
  enumerable: true,
  get: function () {
    return OwnershipLabel_vue_1.default;
  },
});
var OwnershipManager_vue_1 = require('./components/OwnershipManager.vue');
Object.defineProperty(exports, 'OwnershipManager', {
  enumerable: true,
  get: function () {
    return OwnershipManager_vue_1.default;
  },
});
