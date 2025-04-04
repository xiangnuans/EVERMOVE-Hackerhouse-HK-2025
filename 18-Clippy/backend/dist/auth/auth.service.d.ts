import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AptosSignatureService } from './aptos-signature.service';
interface SignInParams {
    walletAddress: string;
    signature: string;
    publicKey?: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private aptosSignatureService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, aptosSignatureService: AptosSignatureService);
    signIn(signInParams: SignInParams): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            walletAddress: string;
            username: string;
            email: string;
            avatar: string;
        };
    }>;
    private generateToken;
}
export {};
