import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
export type AgentDocument = HydratedDocument<Agent>;
export declare class Agent {
    name: string;
    industry: string;
    description: string;
    owner: User;
    isActive: boolean;
    score: number;
    feedback: string;
    ratedAt: Date;
}
export declare const AgentSchema: MongooseSchema<Agent, import("mongoose").Model<Agent, any, any, any, import("mongoose").Document<unknown, any, Agent> & Agent & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Agent>> & import("mongoose").FlatRecord<Agent> & {
    _id: import("mongoose").Types.ObjectId;
}>;
