import { Injectable, Logger } from '@nestjs/common';
import { AptosClient, HexString } from 'aptos';
import { SIGNATURE_MESSAGE } from '../config/constants';
import * as nacl from 'tweetnacl';

interface VerifySignatureParams {
  walletAddress: string;
  message: string;
  signature: string;
  publicKey?: string;
}

@Injectable()
export class AptosSignatureService {
  private readonly logger = new Logger(AptosSignatureService.name);
  private aptosClient: AptosClient;

  constructor() {
    // 初始化Aptos客户端，连接到测试网或主网
    this.aptosClient = new AptosClient(process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com');
  }

  async verifySignature({
    walletAddress,
    message,
    signature,
    publicKey,
  }: VerifySignatureParams): Promise<boolean> {
    try {
      // 验证消息是否正确
      if (message !== SIGNATURE_MESSAGE) {
        this.logger.warn(`预期签名消息不匹配: ${message}`);
        return false;
      }

      // 验证钱包地址格式
      if (!this.isValidAptosAddress(walletAddress)) {
        this.logger.warn(`无效的Aptos钱包地址: ${walletAddress}`);
        return false;
      }

      // 验证签名格式
      if (!this.isValidSignature(signature)) {
        this.logger.warn(`无效的签名格式: ${signature}`);
        return false;
      }

      // 必须提供公钥才能验证签名
      if (!publicKey) {
        this.logger.warn('缺少公钥，无法验证签名');
        return false;
      }

      // 验证公钥格式
      if (!this.isValidPublicKey(publicKey)) {
        this.logger.warn(`无效的公钥格式: ${publicKey}`);
        return false;
      }

      try {
        // 将消息转换为字节数组
        const messageBytes = new TextEncoder().encode(message);
        
        // 将签名和公钥转换为Uint8Array
        const signatureBytes = HexString.ensure(signature).toUint8Array();
        const publicKeyBytes = HexString.ensure(publicKey).toUint8Array();
        
        // 使用nacl进行密码学验证签名
        const isValid = nacl.sign.detached.verify(
          messageBytes,
          signatureBytes,
          publicKeyBytes
        );

        if (!isValid) {
          this.logger.warn(`签名验证失败，签名可能不是由提供的公钥创建的`);
        }
        
        return isValid;
      } catch (verifyError) {
        this.logger.error(`签名验证过程中发生错误:`, verifyError);
        return false;
      }
    } catch (error) {
      this.logger.error('签名验证错误:', error);
      return false;
    }
  }

  private isValidAptosAddress(address: string): boolean {
    // Aptos地址验证: 0x开头，后跟64个十六进制字符
    const addressRegex = /^0x[a-fA-F0-9]{1,64}$/;
    return addressRegex.test(address);
  }

  private isValidSignature(signature: string): boolean {
    // 签名格式验证: 0x开头，后跟128-130个十六进制字符(Ed25519签名通常为64字节)
    const signatureRegex = /^0x[a-fA-F0-9]{128,130}$/;
    return signatureRegex.test(signature);
  }

  private isValidPublicKey(publicKey: string): boolean {
    // 公钥格式验证: 0x开头，后跟64个十六进制字符(Ed25519公钥为32字节)
    const publicKeyRegex = /^0x[a-fA-F0-9]{64}$/;
    return publicKeyRegex.test(publicKey);
  }

  private hexToBytes(hex: string): Uint8Array {
    // 如果有0x前缀，去掉
    hex = hex.startsWith('0x') ? hex.substring(2) : hex;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }
} 