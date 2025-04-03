import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AptosSignatureService } from './aptos-signature.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { SIGNATURE_MESSAGE } from '../config/constants';

interface SignInParams {
  walletAddress: string;
  signature: string;
  publicKey?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private aptosSignatureService: AptosSignatureService,
  ) {}

  async signIn(signInParams: SignInParams) {
    const { walletAddress, signature, publicKey } = signInParams;

    // 验证签名 - 使用常量中的签名消息
    const isValidSignature = await this.aptosSignatureService.verifySignature({
      walletAddress,
      message: SIGNATURE_MESSAGE, // 使用全局常量
      signature,
      publicKey,
    });

    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // 查找或创建用户
    const user = await this.usersService.findOrCreateUser(walletAddress);

    // 生成JWT令牌
    return this.generateToken(user);
  }

  private generateToken(user: UserDocument) {
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
} 