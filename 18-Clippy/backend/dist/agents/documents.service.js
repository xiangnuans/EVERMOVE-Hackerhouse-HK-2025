"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fs = require("fs");
const path = require("path");
const document_entity_1 = require("./entities/document.entity");
const agents_service_1 = require("./agents.service");
let DocumentsService = class DocumentsService {
    documentModel;
    agentsService;
    constructor(documentModel, agentsService) {
        this.documentModel = documentModel;
        this.agentsService = agentsService;
        this.ensureUploadDirectoryExists();
    }
    ensureUploadDirectoryExists() {
        const uploadDir = path.join(process.cwd(), 'uploads');
        console.log(`检查上传目录: ${uploadDir}`);
        if (!fs.existsSync(uploadDir)) {
            console.log(`创建上传目录: ${uploadDir}`);
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
                console.log('上传目录创建成功');
            }
            catch (error) {
                console.error('创建上传目录失败:', error);
            }
        }
        else {
            console.log('上传目录已存在');
        }
    }
    async create(agentId, createDocumentDto, file, user) {
        this.ensureUploadDirectoryExists();
        const agent = await this.agentsService.findOne(agentId, user);
        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
        if (!Object.values(document_entity_1.DocumentType).includes(fileExtension)) {
            throw new common_1.BadRequestException(`不支持的文件类型: ${fileExtension}`);
        }
        const document = new this.documentModel({
            ...createDocumentDto,
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: fileExtension,
            agent: agent._id,
        });
        return document.save();
    }
    async findAll(agentId, user) {
        await this.agentsService.findOne(agentId, user);
        return this.documentModel.find({ agent: agentId }).exec();
    }
    async findOne(agentId, id, user) {
        await this.agentsService.findOne(agentId, user);
        const document = await this.documentModel.findOne({
            _id: id,
            agent: agentId
        }).exec();
        if (!document) {
            throw new common_1.NotFoundException(`文档ID ${id} 不存在`);
        }
        return document;
    }
    async update(agentId, id, updateDocumentDto, user) {
        const document = await this.findOne(agentId, id, user);
        Object.assign(document, updateDocumentDto);
        return document.save();
    }
    async remove(agentId, id, user) {
        const document = await this.findOne(agentId, id, user);
        try {
            fs.unlinkSync(document.filePath);
        }
        catch (error) {
            console.error(`Error deleting file ${document.filePath}:`, error);
        }
        await document.deleteOne();
    }
    async getFilePath(agentId, id, user) {
        const document = await this.findOne(agentId, id, user);
        return document.filePath;
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_entity_1.Document.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        agents_service_1.AgentsService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map