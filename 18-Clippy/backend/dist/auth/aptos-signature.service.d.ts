interface VerifySignatureParams {
    walletAddress: string;
    message: string;
    signature: string;
    publicKey?: string;
}
export declare class AptosSignatureService {
    private readonly logger;
    private aptosClient;
    constructor();
    verifySignature({ walletAddress, message, signature, publicKey, }: VerifySignatureParams): Promise<boolean>;
    private isValidAptosAddress;
    private isValidSignature;
    private isValidPublicKey;
    private hexToBytes;
}
export {};
