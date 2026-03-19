"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetWorthPositionActivity = useNetWorthPositionActivity;
var vue_1 = require("vue");
function useNetWorthPositionActivity(params) {
    var positionActivityRows = (0, vue_1.computed)(function () {
        if (params.selectedPositionType.value === 'asset') {
            var valuations_1 = params.assetValuations.value.map(function (row) {
                var _a;
                return ({
                    id: "valuation-".concat(row.id),
                    date: row.valuation_date,
                    label: 'Checkpoint',
                    kind: 'valuation',
                    amount: params.toNumber(row.value),
                    meta: row.source,
                    note: (_a = row.note) !== null && _a !== void 0 ? _a : '',
                });
            });
            var investmentEvents = params.investmentEvents.value.map(function (row) {
                var _a;
                return ({
                    id: "investment-".concat(row.id),
                    date: row.event_date,
                    label: row.event_type,
                    kind: 'event',
                    amount: params.toNumber(row.amount),
                    meta: row.event_type === 'passive_income' && row.is_reinvested === false
                        ? 'passive_income · no reinvertido'
                        : row.event_type,
                    note: (_a = row.note) !== null && _a !== void 0 ? _a : '',
                });
            });
            var liquidityEvents = params.liquidityEvents.value.map(function (row) {
                var _a;
                return ({
                    id: "liquidity-".concat(row.id),
                    date: row.event_date,
                    label: row.event_type,
                    kind: 'event',
                    amount: params.toNumber(row.amount),
                    meta: row.event_type,
                    note: (_a = row.note) !== null && _a !== void 0 ? _a : '',
                });
            });
            return __spreadArray(__spreadArray(__spreadArray([], valuations_1, true), investmentEvents, true), liquidityEvents, true).sort(function (a, b) {
                return b.date.localeCompare(a.date);
            });
        }
        var valuations = params.liabilityValuations.value.map(function (row) {
            var _a;
            return ({
                id: "valuation-".concat(row.id),
                date: row.valuation_date,
                label: 'Checkpoint',
                kind: 'valuation',
                amount: params.toNumber(row.value),
                meta: row.source,
                note: (_a = row.note) !== null && _a !== void 0 ? _a : '',
            });
        });
        var events = params.liabilityEvents.value.map(function (row) {
            var _a;
            return ({
                id: "liability-event-".concat(row.id),
                date: row.event_date,
                label: row.event_type,
                kind: 'event',
                amount: params.toNumber(row.amount),
                meta: row.event_type,
                note: (_a = row.note) !== null && _a !== void 0 ? _a : '',
            });
        });
        return __spreadArray(__spreadArray([], valuations, true), events, true).sort(function (a, b) { return b.date.localeCompare(a.date); });
    });
    return {
        positionActivityRows: positionActivityRows,
    };
}
