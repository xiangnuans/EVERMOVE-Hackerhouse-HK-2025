"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InternalApiGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalApiGuard = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../config/constants");
let InternalApiGuard = InternalApiGuard_1 = class InternalApiGuard {
    logger = new common_1.Logger(InternalApiGuard_1.name);
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        let clientIp = request.ip ||
            request.connection.remoteAddress ||
            request.headers['x-forwarded-for'];
        if (clientIp && clientIp.includes('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }
        this.logger.debug(`内部API请求: ${request.method} ${request.url} 来自IP: ${clientIp}`);
        if (!apiKey || apiKey !== constants_1.INTERNAL_API_KEY) {
            this.logger.warn(`内部API请求API密钥验证失败: ${request.url}`);
            throw new common_1.UnauthorizedException('无效的API密钥');
        }
        if (!this.isIpAllowed(clientIp)) {
            this.logger.warn(`内部API请求IP地址不在允许列表中: ${clientIp}`);
            throw new common_1.ForbiddenException('IP地址不在允许列表中');
        }
        this.logger.log(`内部API请求验证通过: ${request.method} ${request.url}`);
        return true;
    }
    isIpAllowed(ip) {
        if (!ip)
            return false;
        if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
            return true;
        }
        return constants_1.INTERNAL_ALLOWED_IPS.some(allowedIp => {
            if (allowedIp === ip) {
                return true;
            }
            if (allowedIp.includes('/')) {
                const [subnet] = allowedIp.split('/');
                if (ip.startsWith(subnet.substring(0, subnet.lastIndexOf('.')))) {
                    return true;
                }
            }
            return false;
        });
    }
};
exports.InternalApiGuard = InternalApiGuard;
exports.InternalApiGuard = InternalApiGuard = InternalApiGuard_1 = __decorate([
    (0, common_1.Injectable)()
], InternalApiGuard);
//# sourceMappingURL=internal-api.guard.js.map