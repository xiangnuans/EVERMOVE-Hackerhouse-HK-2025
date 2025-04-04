import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Agent } from './agent.entity';
export type DocumentDocument = HydratedDocument<Document>;
export declare enum DocumentType {
    PDF = "pdf",
    JPG = "jpg",
    PNG = "png",
    GIF = "gif",
    MOV = "mov",
    MP4 = "mp4"
}
export declare class Document {
    name: string;
    description: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: DocumentType;
    agent: Agent;
}
export declare const DocumentSchema: MongooseSchema<Document, import("mongoose").Model<Document, any, any, any, import("mongoose").Document<unknown, any, Document> & Document & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Document, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Document>> & import("mongoose").FlatRecord<Document> & {
    _id: import("mongoose").Types.ObjectId;
}>;
