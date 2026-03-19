"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auxDataApi = exports.coreAuxDataApi = void 0;
var api_1 = require("@/lib/api");
exports.coreAuxDataApi = {
    getStatus: function () {
        return api_1.api.get('/api/core/market-data/status/');
    },
};
exports.auxDataApi = exports.coreAuxDataApi;
