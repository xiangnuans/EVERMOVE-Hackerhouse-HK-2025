import { Model } from 'mongoose';
import { Agent, AgentDocument } from './entities/agent.entity';
import { Document as FileDocument } from './entities/document.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentRatingDto } from './dto/update-agent-rating.dto';
import { UserDocument } from '../users/entities/user.entity';
import { AgentWithDocuments } from './interfaces/agent-with-documents.interface';
export declare class AgentsService {
    private agentModel;
    private documentModel;
    constructor(agentModel: Model<Agent>, documentModel: Model<FileDocument>);
    create(createAgentDto: CreateAgentDto, user: UserDocument): Promise<AgentDocument>;
    findAll(user: UserDocument): Promise<AgentDocument[]>;
    findAllWithDocumentUrls(): Promise<AgentWithDocuments[]>;
    findOne(id: string, user: UserDocument): Promise<AgentDocument>;
    findOneById(id: string): Promise<AgentDocument>;
    update(id: string, updateAgentDto: UpdateAgentDto, user: UserDocument): Promise<AgentDocument>;
    updateRating(id: string, updateRatingDto: UpdateAgentRatingDto): Promise<AgentDocument>;
    remove(id: string, user: UserDocument): Promise<void>;
}
