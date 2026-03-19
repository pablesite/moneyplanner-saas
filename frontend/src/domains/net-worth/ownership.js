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
exports.buildOwnershipMaps = buildOwnershipMaps;
exports.attachOwnershipRef = attachOwnershipRef;
function buildOwnershipMaps(links) {
  var assetOwnership = new Map(
    links
      .filter(function (link) {
        return link.target_type === 'asset';
      })
      .map(function (link) {
        return [link.target_id, link.ownership_id];
      }),
  );
  var liabilityOwnership = new Map(
    links
      .filter(function (link) {
        return link.target_type === 'liability';
      })
      .map(function (link) {
        return [link.target_id, link.ownership_id];
      }),
  );
  return { assetOwnership: assetOwnership, liabilityOwnership: liabilityOwnership };
}
function attachOwnershipRef(items, ownershipMap) {
  return items.map(function (item) {
    var _a;
    return __assign(__assign({}, item), {
      ownership_ref: (_a = ownershipMap.get(item.id)) !== null && _a !== void 0 ? _a : null,
    });
  });
}
