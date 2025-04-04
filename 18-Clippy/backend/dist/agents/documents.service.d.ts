import { Model } from 'mongoose';
import { Document, DocumentDocument } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UserDocument } from '../users/entities/user.entity';
import { AgentsService } from './agents.service';
interface UploadedFile {
    originalname: string;
    path: string;
    size: number;
    [key: string]: any;
}
export declare class DocumentsService {
    private documentModel;
    private agentsService;
    constructor(documentModel: Model<Document>, agentsService: AgentsService);
    private ensureUploadDirectoryExists;
    create(agentId: string, createDocumentDto: CreateDocumentDto, file: UploadedFile, user: UserDocument): Promise<DocumentDocument>;
    findAll(agentId: string, user: UserDocument): Promise<DocumentDocument[]>;
    findOne(agentId: string, id: string, user: UserDocument): Promise<DocumentDocument>;
    update(agentId: string, id: string, updateDocumentDto: UpdateDocumentDto, user: UserDocument): Promise<DocumentDocument>;
    remove(agentId: string, id: string, user: UserDocument): Promise<void>;
    getFilePath(agentId: string, id: string, user: UserDocument): Promise<string>;
}
export {};
