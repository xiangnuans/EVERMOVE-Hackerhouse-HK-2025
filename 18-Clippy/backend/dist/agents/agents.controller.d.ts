import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    create(createAgentDto: CreateAgentDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/agent.entity").Agent> & import("./entities/agent.entity").Agent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./entities/agent.entity").Agent> & import("./entities/agent.entity").Agent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/agent.entity").Agent> & import("./entities/agent.entity").Agent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateAgentDto: UpdateAgentDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/agent.entity").Agent> & import("./entities/agent.entity").Agent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string, req: any): Promise<void>;
}
