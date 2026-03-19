"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAnnualAmount = parseAnnualAmount;
exports.normalizeOwnerName = normalizeOwnerName;
function parseAnnualAmount(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '');
    var hasComma = normalized.includes(',');
    var hasDot = normalized.includes('.');
    if (hasComma && hasDot) {
        var lastComma = normalized.lastIndexOf(',');
        var lastDot = normalized.lastIndexOf('.');
        if (lastComma > lastDot) {
            normalized = normalized.replace(/\./g, '').replace(',', '.');
        }
        else {
            normalized = normalized.replace(/,/g, '');
        }
    }
    else if (hasComma) {
        normalized = normalized.replace(',', '.');
    }
    var value = Number(normalized);
    if (!Number.isFinite(value) || value <= 0)
        return 0;
    return value;
}
function normalizeOwnerName(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 120);
}
