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
var AptosSignatureService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosSignatureService = void 0;
const common_1 = require("@nestjs/common");
const aptos_1 = require("aptos");
const constants_1 = require("../config/constants");
const nacl = require("tweetnacl");
let AptosSignatureService = AptosSignatureService_1 = class AptosSignatureService {
    logger = new common_1.Logger(AptosSignatureService_1.name);
    aptosClient;
    constructor() {
        this.aptosClient = new aptos_1.AptosClient(process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com');
    }
    async verifySignature({ walletAddress, message, signature, publicKey, }) {
        try {
            this.logger.debug(`开始验证签名 - 钱包地址: ${walletAddress}`);
            this.logger.debug(`消息: "${message}"`);
            this.logger.debug(`签名: ${signature}`);
            this.logger.debug(`公钥: ${publicKey}`);
            if (message !== constants_1.SIGNATURE_MESSAGE) {
                this.logger.warn(`预期签名消息不匹配: ${message} !== ${constants_1.SIGNATURE_MESSAGE}`);
                return false;
            }
            if (!this.isValidAptosAddress(walletAddress)) {
                this.logger.warn(`无效的Aptos钱包地址: ${walletAddress}`);
                return false;
            }
            if (!this.isValidSignature(signature)) {
                this.logger.warn(`无效的签名格式: ${signature}`);
                return false;
            }
            if (!publicKey) {
                this.logger.warn('缺少公钥，无法验证签名');
                return false;
            }
            if (!this.isValidPublicKey(publicKey)) {
                this.logger.warn(`无效的公钥格式: ${publicKey}`);
                return false;
            }
            try {
                const messageBytes = new TextEncoder().encode(message);
                this.logger.debug(`消息字节: [${Array.from(messageBytes).join(', ')}]`);
                let signatureBytes;
                try {
                    const signatureHex = signature.startsWith('0x') ? signature.substring(2) : signature;
                    signatureBytes = aptos_1.HexString.ensure(signature).toUint8Array();
                    this.logger.debug(`签名字节长度: ${signatureBytes.length}`);
                    this.logger.debug(`签名字节: [${Array.from(signatureBytes).slice(0, 10).join(', ')}...]`);
                }
                catch (signatureError) {
                    this.logger.error(`签名转换出错: ${signatureError.message}`);
                    return false;
                }
                let publicKeyBytes;
                try {
                    publicKeyBytes = aptos_1.HexString.ensure(publicKey).toUint8Array();
                    this.logger.debug(`公钥字节长度: ${publicKeyBytes.length}`);
                    this.logger.debug(`公钥字节: [${Array.from(publicKeyBytes).join(', ')}]`);
                }
                catch (publicKeyError) {
                    this.logger.error(`公钥转换出错: ${publicKeyError.message}`);
                    return false;
                }
                this.logger.debug(`验证方法1: 直接验证`);
                const isValidDirect = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
                this.logger.debug(`直接验证结果: ${isValidDirect}`);
                if (isValidDirect) {
                    return true;
                }
                try {
                    this.logger.debug(`验证方法2: 带前缀哈希`);
                    const prefixedMessage = `APTOS\nmessage: ${message}`;
                    const prefixedMessageBytes = new TextEncoder().encode(prefixedMessage);
                    this.logger.debug(`前缀消息: "${prefixedMessage}"`);
                    const crypto = require('crypto');
                    const hash = crypto.createHash('sha3-256').update(prefixedMessageBytes).digest();
                    const isValidPrefixed = nacl.sign.detached.verify(hash, signatureBytes, publicKeyBytes);
                    this.logger.debug(`前缀哈希验证结果: ${isValidPrefixed}`);
                    if (isValidPrefixed) {
                        return true;
                    }
                }
                catch (prefixError) {
                    this.logger.error(`前缀哈希验证出错: ${prefixError.message}`);
                }
                try {
                    this.logger.debug(`验证方法3: BCS序列化`);
                    const { BCS } = require('aptos');
                    const serializer = new BCS.Serializer();
                    serializer.serializeStr(message);
                    const serializedBytes = serializer.getBytes();
                    const isValidBCS = nacl.sign.detached.verify(serializedBytes, signatureBytes, publicKeyBytes);
                    this.logger.debug(`BCS序列化验证结果: ${isValidBCS}`);
                    if (isValidBCS) {
                        return true;
                    }
                }
                catch (bcsError) {
                    this.logger.error(`BCS序列化验证出错: ${bcsError.message}`);
                }
                this.logger.warn(`签名验证失败，签名可能不是由提供的公钥创建的`);
                return false;
            }
            catch (verifyError) {
                this.logger.error(`签名验证过程中发生错误:`, verifyError);
                return false;
            }
        }
        catch (error) {
            this.logger.error('签名验证错误:', error);
            return false;
        }
    }
    isValidAptosAddress(address) {
        const addressRegex = /^0x[a-fA-F0-9]{1,64}$/;
        return addressRegex.test(address);
    }
    isValidSignature(signature) {
        const signatureRegex = /^0x[a-fA-F0-9]{128,130}$/;
        return signatureRegex.test(signature);
    }
    isValidPublicKey(publicKey) {
        const publicKeyRegex = /^0x[a-fA-F0-9]{64}$/;
        return publicKeyRegex.test(publicKey);
    }
    hexToBytes(hex) {
        hex = hex.startsWith('0x') ? hex.substring(2) : hex;
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return bytes;
    }
};
exports.AptosSignatureService = AptosSignatureService;
exports.AptosSignatureService = AptosSignatureService = AptosSignatureService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AptosSignatureService);
//# sourceMappingURL=aptos-signature.service.js.map