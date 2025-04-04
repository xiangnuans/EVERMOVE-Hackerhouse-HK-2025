import { Controller, Post, Body, UseGuards, Get, Request, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

interface SignInDto {
  walletAddress: string;
  signature: string;
  publicKey?: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    this.logger.log(`尝试登录: ${signInDto.walletAddress}`);
    
    // 确保publicKey存在，这是验证签名所必需的
    if (!signInDto.publicKey) {
      this.logger.warn(`尝试登录时缺少公钥: ${signInDto.walletAddress}`);
    }
    
    // 打印收到的签名信息，用于调试
    this.logger.debug(`登录详情 - 钱包地址: ${signInDto.walletAddress}, 签名长度: ${signInDto.signature?.length || 0}, 公钥存在: ${!!signInDto.publicKey}`);
    
    const result = await this.authService.signIn(signInDto);
    
    // 打印生成的令牌信息
    this.logger.log(`登录成功，用户ID: ${result.user.id}`);
    
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    this.logger.log(`获取用户资料: ${req.user?._id || '未知用户'}`);
    return req.user;
  }
} 