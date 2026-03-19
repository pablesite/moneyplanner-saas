"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPeopleErrorMessage = toPeopleErrorMessage;
var axios_1 = require("axios");
var errors_1 = require("@/lib/errors");
function toPeopleErrorMessage(err) {
    var _a, _b;
    if (!axios_1.default.isAxiosError(err))
        return String(err);
    var data = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data;
    if (!data) {
        var mapped_1 = (0, errors_1.toApiErrorMessage)(err);
        return mapped_1 && mapped_1 !== 'Error' ? mapped_1 : err.message;
    }
    if (typeof data === 'string')
        return data;
    if (typeof data === 'object' && data !== null) {
        var map = data;
        var maybeError = map.error;
        if (typeof maybeError === 'object' && maybeError !== null) {
            var code = maybeError.code;
            if (code === 'permission_denied') {
                return 'No tienes permisos para esta accion.';
            }
        }
        if (typeof map.detail === 'string')
            return map.detail;
        var firstKey = Object.keys(map)[0];
        if (!firstKey)
            return err.message;
        var value = map[firstKey];
        if (Array.isArray(value))
            return "".concat(firstKey, ": ").concat(String((_b = value[0]) !== null && _b !== void 0 ? _b : err.message));
        if (typeof value === 'string')
            return value;
    }
    var mapped = (0, errors_1.toApiErrorMessage)(err);
    if (mapped && mapped !== 'Error')
        return mapped;
    return err.message;
}
