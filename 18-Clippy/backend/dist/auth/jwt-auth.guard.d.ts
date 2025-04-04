import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private jwtService;
    private usersService;
    private jwtStrategy?;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UsersService, jwtStrategy?: JwtStrategy | undefined);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
