import { AuthService } from './auth.service';
import { AptosSignatureService } from './aptos-signature.service';
interface SignInDto {
    walletAddress: string;
    signature: string;
    publicKey?: string;
}
export declare class AuthController {
    private authService;
    private aptosSignatureService;
    private readonly logger;
    constructor(authService: AuthService, aptosSignatureService: AptosSignatureService);
    login(signInDto: SignInDto): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            walletAddress: string;
            username: string;
            email: string;
            avatar: string;
        };
    }>;
    getProfile(req: any): any;
    verifySignature(data: SignInDto): Promise<{
        isValid: boolean;
        message: string;
        signatureLength: number;
        publicKeyLength: number;
        bytesInfo: {
            messageBytes: number[];
            signatureHex: any;
            publicKeyHex: any;
        };
        timestamp: string;
    }>;
}
export {};
