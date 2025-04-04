"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const users_service_1 = require("../users/users.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    usersService;
    logger = new common_1.Logger(JwtStrategy_1.name);
    constructor(usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'clippy-secret-key',
        });
        this.usersService = usersService;
    }
    async validate(payload) {
        console.log('JwtStrategy.validate方法被调用，payload:', JSON.stringify(payload));
        try {
            if (!payload) {
                this.logger.error('JWT payload为空');
                throw new common_1.UnauthorizedException('无效的令牌');
            }
            if (!payload.walletAddress) {
                this.logger.error('JWT payload中缺少walletAddress字段');
                throw new common_1.UnauthorizedException('令牌中缺少钱包地址');
            }
            const user = await this.usersService.findByWalletAddress(payload.walletAddress);
            if (!user) {
                console.log(`未找到钱包地址为 ${payload.walletAddress} 的用户`);
                this.logger.warn(`未找到钱包地址为 ${payload.walletAddress} 的用户`);
                throw new common_1.UnauthorizedException('用户不存在');
            }
            return user;
        }
        catch (error) {
            console.log(`JWT验证错误: ${error.message}`, error.stack);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error(`JWT验证过程中出错: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('令牌验证失败');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map