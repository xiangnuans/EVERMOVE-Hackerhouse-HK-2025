import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    create(agentId: string, createDocumentDto: CreateDocumentDto, file: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/document.entity").Document> & import("./entities/document.entity").Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(agentId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./entities/document.entity").Document> & import("./entities/document.entity").Document & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(agentId: string, id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/document.entity").Document> & import("./entities/document.entity").Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    download(agentId: string, id: string, req: any, res: Response): Promise<void | Response<any, Record<string, any>>>;
    update(agentId: string, id: string, updateDocumentDto: UpdateDocumentDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/document.entity").Document> & import("./entities/document.entity").Document & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(agentId: string, id: string, req: any): Promise<void>;
}
