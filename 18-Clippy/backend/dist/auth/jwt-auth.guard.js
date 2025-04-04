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
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const jwt_strategy_1 = require("./jwt.strategy");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    jwtService;
    usersService;
    jwtStrategy;
    logger = new common_1.Logger(JwtAuthGuard_1.name);
    constructor(jwtService, usersService, jwtStrategy) {
        super();
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.jwtStrategy = jwtStrategy;
        console.log('JwtAuthGuard构造函数被调用，依赖注入情况：', {
            hasJwtService: !!jwtService,
            hasUsersService: !!usersService,
            hasJwtStrategy: !!jwtStrategy
        });
        this.logger.log('JwtAuthGuard已初始化');
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        this.logger.debug(`接收到请求: ${request.method} ${request.url}`);
        if (!authHeader) {
            this.logger.warn('Authorization头不存在，JWT验证失败');
            throw new common_1.UnauthorizedException('缺少Authorization头');
        }
        if (!authHeader.startsWith('Bearer ')) {
            this.logger.warn('Authorization头格式错误，应以"Bearer "开头');
            throw new common_1.UnauthorizedException('Authorization头格式不正确');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            this.logger.warn('未找到JWT令牌');
            throw new common_1.UnauthorizedException('未找到令牌');
        }
        const tokenLength = token.length;
        const maskedToken = tokenLength > 20
            ? `${token.slice(0, 10)}...${token.slice(tokenLength - 10)}`
            : token;
        this.logger.debug(`JWT令牌: ${maskedToken} (长度: ${tokenLength})`);
        try {
            let isAuthenticated = false;
            try {
                this.logger.debug('尝试使用标准Passport方式验证JWT');
                if (this.jwtStrategy) {
                    try {
                        const payload = this.jwtService.verify(token);
                        console.log('JwtAuthGuard验证 - 使用注入的JwtStrategy');
                        const user = await this.jwtStrategy.validate(payload);
                        if (user) {
                            request.user = user;
                            isAuthenticated = true;
                            this.logger.log(`使用注入的JwtStrategy验证成功，用户ID: ${user._id}`);
                        }
                    }
                    catch (strategyError) {
                        console.log(`使用注入的JwtStrategy验证失败: ${strategyError.message}`);
                        this.logger.warn(`使用注入的JwtStrategy验证失败: ${strategyError.message}`);
                    }
                }
                if (!isAuthenticated) {
                    isAuthenticated = await super.canActivate(context);
                    this.logger.log(`标准验证结果: ${isAuthenticated ? '成功' : '失败'}`);
                }
            }
            catch (passportError) {
            }
            if (isAuthenticated) {
                const user = request.user;
                this.logger.debug(`验证成功，用户: ${user?._id || '未知'}, 钱包: ${user?.walletAddress || '未知'}`);
            }
            else {
                this.logger.warn('身份验证失败但未抛出异常，拒绝访问');
                throw new common_1.UnauthorizedException('身份验证失败');
            }
            return isAuthenticated;
        }
        catch (error) {
            console.log(`JWT验证最终错误: ${error.message}`, error.stack);
            this.logger.error(`JWT验证出错: ${error.message}`, error.stack);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('令牌验证失败');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        jwt_strategy_1.JwtStrategy])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map