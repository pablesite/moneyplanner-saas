"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetWorthViewExtensions = useNetWorthViewExtensions;
var vue_1 = require("vue");
var capabilities_1 = require("@/domains/capabilities");
function useNetWorthViewExtensions(store) {
    var ownershipProps = (0, vue_1.computed)(function () {
        var _a, _b, _c;
        var baseCurrency = store && typeof store === 'object'
            ? ((_a = ('baseCurrency' in store &&
                typeof store.baseCurrency === 'string'
                ? store.baseCurrency
                : null)) !== null && _a !== void 0 ? _a : ('summary' in store &&
                typeof ((_b = store.summary) === null || _b === void 0 ? void 0 : _b.base_currency) === 'string'
                ? String((_c = store.summary) === null || _c === void 0 ? void 0 : _c.base_currency)
                : null))
            : null;
        var baseProps = baseCurrency ? { defaultCurrency: baseCurrency } : {};
        if (!capabilities_1.capabilities.people || !store || typeof store !== 'object') {
            return baseProps;
        }
        if (!('ownerships' in store)) {
            return baseProps;
        }
        var ownerships = store.ownerships;
        if (!Array.isArray(ownerships)) {
            return baseProps;
        }
        return __assign(__assign({}, baseProps), { ownerships: ownerships });
    });
    return {
        HeaderActions: null,
        itemFormProps: ownershipProps,
        itemListProps: ownershipProps,
    };
}
