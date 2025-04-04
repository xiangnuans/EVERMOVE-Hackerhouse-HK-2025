import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class InternalApiGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
    private isIpAllowed;
}
