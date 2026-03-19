"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApi = exports.coreAuthApi = void 0;
var api_1 = require("@/lib/api");
exports.coreAuthApi = {
    login: function (payload) {
        return api_1.api.post('/api/auth/token/', payload);
    },
    validateSession: function () {
        return api_1.api.get('/api/auth/me/');
    },
};
exports.authApi = exports.coreAuthApi;
