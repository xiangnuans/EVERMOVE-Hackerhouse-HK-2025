"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DevelopmentApiGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentApiGuard = void 0;
const common_1 = require("@nestjs/common");
let DevelopmentApiGuard = DevelopmentApiGuard_1 = class DevelopmentApiGuard {
    logger = new common_1.Logger(DevelopmentApiGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let clientIp = request.ip ||
            request.connection.remoteAddress ||
            request.headers['x-forwarded-for'];
        if (clientIp && clientIp.includes('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }
        this.logger.debug(`API请求(开发模式): ${request.method} ${request.url} 来自IP: ${clientIp}`);
        this.logger.log(`API请求验证通过(开发模式): ${request.method} ${request.url}`);
        return true;
    }
};
exports.DevelopmentApiGuard = DevelopmentApiGuard;
exports.DevelopmentApiGuard = DevelopmentApiGuard = DevelopmentApiGuard_1 = __decorate([
    (0, common_1.Injectable)()
], DevelopmentApiGuard);
//# sourceMappingURL=development-api.guard.js.map