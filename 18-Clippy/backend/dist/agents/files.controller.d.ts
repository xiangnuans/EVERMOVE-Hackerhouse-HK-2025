import { Response } from 'express';
import { Model } from 'mongoose';
import { Document } from './entities/document.entity';
export declare class FilesController {
    private documentModel;
    private readonly logger;
    constructor(documentModel: Model<Document>);
    downloadFile(id: string, res: Response): Promise<void>;
    private getContentType;
}
