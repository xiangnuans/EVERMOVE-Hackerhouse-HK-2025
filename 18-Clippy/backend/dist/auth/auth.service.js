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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const aptos_signature_service_1 = require("./aptos-signature.service");
const constants_1 = require("../config/constants");
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    aptosSignatureService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usersService, jwtService, aptosSignatureService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.aptosSignatureService = aptosSignatureService;
    }
    async signIn(signInParams) {
        const { walletAddress, signature, publicKey } = signInParams;
        this.logger.debug(`开始处理登录请求 - 钱包地址: ${walletAddress}`);
        this.logger.log(`正在验证签名，使用消息: "${constants_1.SIGNATURE_MESSAGE}"`);
        const isValidSignature = await this.aptosSignatureService.verifySignature({
            walletAddress,
            message: constants_1.SIGNATURE_MESSAGE,
            signature,
            publicKey,
        });
        if (!isValidSignature) {
            this.logger.warn(`签名验证失败 - 钱包地址: ${walletAddress}`);
            throw new common_1.UnauthorizedException('签名验证失败，请确保您使用正确的钱包和签名方法');
        }
        this.logger.log(`签名验证成功，正在查找或创建用户: ${walletAddress}`);
        const user = await this.usersService.findOrCreateUser(walletAddress);
        this.logger.log(`生成JWT令牌，用户ID: ${user._id}`);
        return this.generateToken(user);
    }
    generateToken(user) {
        const payload = {
            sub: user._id,
            walletAddress: user.walletAddress,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        aptos_signature_service_1.AptosSignatureService])
], AuthService);
//# sourceMappingURL=auth.service.js.map