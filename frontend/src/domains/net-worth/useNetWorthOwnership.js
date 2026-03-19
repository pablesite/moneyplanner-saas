'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.useNetWorthOwnership = useNetWorthOwnership;
var vue_1 = require('vue');
function toNumber(raw) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}
function normalizeOwnershipSharePercent(raw) {
  var value = toNumber(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value <= 1 ? value * 100 : value;
}
function useNetWorthOwnership(params) {
  var ownershipFilter = (0, vue_1.ref)('all');
  var ownershipById = (0, vue_1.computed)(function () {
    var _a;
    var map = new Map();
    for (
      var _i = 0, _b = (_a = params.ownerships.value) !== null && _a !== void 0 ? _a : [];
      _i < _b.length;
      _i++
    ) {
      var ownership = _b[_i];
      map.set(ownership.id, ownership);
    }
    return map;
  });
  function allocationFractionForNetWorthOwner(ownershipRef, selectedOwner) {
    var _a, _b;
    if (selectedOwner === 'all') return 1;
    if (ownershipRef == null) return 0;
    var ownership = ownershipById.value.get(ownershipRef);
    if (!ownership) return 0;
    if (ownership.kind === 'individual') {
      return ((_a = ownership.member) === null || _a === void 0 ? void 0 : _a.id) === selectedOwner
        ? 1
        : 0;
    }
    var split = ((_b = ownership.splits) !== null && _b !== void 0 ? _b : []).find(function (row) {
      var _a;
      return ((_a = row.member) === null || _a === void 0 ? void 0 : _a.id) === selectedOwner;
    });
    if (!split) return 0;
    return normalizeOwnershipSharePercent(split.percent) / 100;
  }
  var ownershipOptions = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d, _e, _f;
    var options = new Map();
    for (
      var _i = 0, _g = (_a = params.ownerships.value) !== null && _a !== void 0 ? _a : [];
      _i < _g.length;
      _i++
    ) {
      var ownership = _g[_i];
      if (
        ownership.kind === 'individual' &&
        ((_b = ownership.member) === null || _b === void 0 ? void 0 : _b.id) &&
        ((_c = ownership.member.name) === null || _c === void 0 ? void 0 : _c.trim())
      ) {
        options.set(ownership.member.id, {
          value: ownership.member.id,
          label: ownership.member.name.trim(),
        });
        continue;
      }
      for (
        var _h = 0, _j = (_d = ownership.splits) !== null && _d !== void 0 ? _d : [];
        _h < _j.length;
        _h++
      ) {
        var split = _j[_h];
        if (
          !((_e = split.member) === null || _e === void 0 ? void 0 : _e.id) ||
          !((_f = split.member.name) === null || _f === void 0 ? void 0 : _f.trim())
        )
          continue;
        options.set(split.member.id, {
          value: split.member.id,
          label: split.member.name.trim(),
        });
      }
    }
    return Array.from(options.values()).sort(function (a, b) {
      return a.label.localeCompare(b.label, 'es');
    });
  });
  var selectedOwnershipFilterLabel = (0, vue_1.computed)(function () {
    var _a, _b;
    if (ownershipFilter.value === 'all') return 'Todos';
    return (_b =
      (_a = ownershipOptions.value.find(function (option) {
        return option.value === ownershipFilter.value;
      })) === null || _a === void 0
        ? void 0
        : _a.label) !== null && _b !== void 0
      ? _b
      : 'Todos';
  });
  var ownershipFilterDisabled = (0, vue_1.computed)(function () {
    return params.valueMode.value !== 'nominal';
  });
  (0, vue_1.watch)(ownershipOptions, function (options) {
    if (ownershipFilter.value === 'all') return;
    if (
      !options.some(function (option) {
        return option.value === ownershipFilter.value;
      })
    ) {
      ownershipFilter.value = 'all';
    }
  });
  (0, vue_1.watch)(params.valueMode, function (mode) {
    if (mode !== 'nominal') ownershipFilter.value = 'all';
  });
  function matchesOwnershipFilter(ownershipRef) {
    return allocationFractionForNetWorthOwner(ownershipRef, ownershipFilter.value) > 0;
  }
  function ownershipBadge(ownershipRef) {
    var _a, _b, _c, _d;
    if (ownershipRef == null) return null;
    var ownership = ownershipById.value.get(ownershipRef);
    if (!ownership) return null;
    if (ownership.kind === 'individual')
      return (_c =
        (_b = (_a = ownership.member) === null || _a === void 0 ? void 0 : _a.name) === null ||
        _b === void 0
          ? void 0
          : _b.trim()) !== null && _c !== void 0
        ? _c
        : null;
    var names = ((_d = ownership.splits) !== null && _d !== void 0 ? _d : [])
      .map(function (split) {
        var _a, _b;
        return (_b = (_a = split.member) === null || _a === void 0 ? void 0 : _a.name) === null ||
          _b === void 0
          ? void 0
          : _b.trim();
      })
      .filter(function (name) {
        return !!name;
      });
    return names.length ? names.join(' + ') : 'Compartido';
  }
  function setOwnershipFilter(value) {
    ownershipFilter.value = value;
  }
  function setValueMode(value) {
    params.valueMode.value = value;
  }
  return {
    ownershipFilter: ownershipFilter,
    ownershipOptions: ownershipOptions,
    selectedOwnershipFilterLabel: selectedOwnershipFilterLabel,
    ownershipFilterDisabled: ownershipFilterDisabled,
    allocationFractionForNetWorthOwner: allocationFractionForNetWorthOwner,
    matchesOwnershipFilter: matchesOwnershipFilter,
    ownershipBadge: ownershipBadge,
    setOwnershipFilter: setOwnershipFilter,
    setValueMode: setValueMode,
  };
}
