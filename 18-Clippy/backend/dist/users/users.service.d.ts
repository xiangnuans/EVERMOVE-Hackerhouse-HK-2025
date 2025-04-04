import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findByWalletAddress(walletAddress: string): Promise<UserDocument | null>;
    createUser(walletAddress: string): Promise<UserDocument>;
    findOrCreateUser(walletAddress: string): Promise<UserDocument>;
    updateUser(id: string, updateData: Partial<User>): Promise<UserDocument>;
}
