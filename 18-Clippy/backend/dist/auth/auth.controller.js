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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const aptos_signature_service_1 = require("./aptos-signature.service");
const constants_1 = require("../config/constants");
let AuthController = AuthController_1 = class AuthController {
    authService;
    aptosSignatureService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, aptosSignatureService) {
        this.authService = authService;
        this.aptosSignatureService = aptosSignatureService;
    }
    async login(signInDto) {
        this.logger.log(`尝试登录: ${signInDto.walletAddress}`);
        if (!signInDto.publicKey) {
            this.logger.warn(`尝试登录时缺少公钥: ${signInDto.walletAddress}`);
        }
        this.logger.log(`登录详情 - 钱包地址: ${signInDto.walletAddress}`);
        this.logger.log(`签名: ${signInDto.signature}`);
        this.logger.log(`公钥: ${signInDto.publicKey}`);
        this.logger.debug(`登录详情 - 钱包地址: ${signInDto.walletAddress}, 签名长度: ${signInDto.signature?.length || 0}, 公钥存在: ${!!signInDto.publicKey}`);
        try {
            const result = await this.authService.signIn(signInDto);
            this.logger.log(`登录成功，用户ID: ${result.user.id}`);
            return result;
        }
        catch (error) {
            this.logger.error(`登录失败 - 钱包地址: ${signInDto.walletAddress}, 错误: ${error.message}`);
            throw error;
        }
    }
    getProfile(req) {
        this.logger.log(`获取用户资料: ${req.user?._id || '未知用户'}`);
        return req.user;
    }
    async verifySignature(data) {
        this.logger.log(`开始验证签名 - 钱包地址: ${data.walletAddress}`);
        this.logger.log(`签名: ${data.signature}`);
        this.logger.log(`公钥: ${data.publicKey}`);
        const messageBytes = new TextEncoder().encode(constants_1.SIGNATURE_MESSAGE);
        let signatureBytes;
        let publicKeyBytes;
        try {
            signatureBytes = data.signature.startsWith('0x')
                ? data.signature.substring(2)
                : data.signature;
            publicKeyBytes = data.publicKey && data.publicKey.startsWith('0x')
                ? data.publicKey.substring(2)
                : data.publicKey;
        }
        catch (error) {
            this.logger.error(`转换签名/公钥出错: ${error.message}`);
        }
        const result = await this.aptosSignatureService.verifySignature({
            walletAddress: data.walletAddress,
            message: constants_1.SIGNATURE_MESSAGE,
            signature: data.signature,
            publicKey: data.publicKey,
        });
        return {
            isValid: result,
            message: constants_1.SIGNATURE_MESSAGE,
            signatureLength: data.signature?.length || 0,
            publicKeyLength: data.publicKey?.length || 0,
            bytesInfo: {
                messageBytes: Array.from(messageBytes),
                signatureHex: signatureBytes,
                publicKeyHex: publicKeyBytes,
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('verify-signature'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifySignature", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        aptos_signature_service_1.AptosSignatureService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map