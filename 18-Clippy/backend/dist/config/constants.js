"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_ALLOWED_IPS = exports.INTERNAL_API_KEY = exports.SIGNATURE_MESSAGE = exports.Constants = void 0;
exports.Constants = {
    AUTH: {
        SIGNATURE_MESSAGE: 'CLIPPY: INFUSE SOUL INTO HUMANOID ROBOTS',
        JWT_EXPIRES_IN: '30d',
    },
    APP: {
        NAME: 'Clippy',
        VERSION: '1.0.0',
        BASE_URL: process.env.BASE_URL || 'http://localhost:5471',
    },
    API: {
        PREFIX: 'api',
    },
    INTERNAL: {
        API_KEY: process.env.INTERNAL_API_KEY || 'clippy-internal-api-key-secure',
        ALLOWED_IPS: process.env.INTERNAL_ALLOWED_IPS
            ? process.env.INTERNAL_ALLOWED_IPS.split(',')
            : ['127.0.0.1', 'localhost', '::1', '192.168.0.0/16', '10.0.0.0/8'],
        FILE_PATH: '/api/files',
        get FILE_BASE_URL() {
            return `${exports.Constants.APP.BASE_URL}${this.FILE_PATH}`;
        },
    },
};
exports.SIGNATURE_MESSAGE = exports.Constants.AUTH.SIGNATURE_MESSAGE;
exports.INTERNAL_API_KEY = exports.Constants.INTERNAL.API_KEY;
exports.INTERNAL_ALLOWED_IPS = exports.Constants.INTERNAL.ALLOWED_IPS;
//# sourceMappingURL=constants.js.map