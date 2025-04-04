import { AgentsService } from './agents.service';
import { UpdateAgentRatingDto } from './dto/update-agent-rating.dto';
import { AgentWithDocuments } from './interfaces/agent-with-documents.interface';
import { AgentDocument } from './entities/agent.entity';
export declare class InternalApiController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    findAllWithDocumentUrls(): Promise<{
        baseUrl: string;
        agents: AgentWithDocuments[];
    }>;
    updateRating(id: string, updateRatingDto: UpdateAgentRatingDto): Promise<AgentDocument>;
}
