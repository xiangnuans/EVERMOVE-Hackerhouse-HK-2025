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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const fs = require("fs");
const uuid_1 = require("uuid");
const documents_service_1 = require("./documents.service");
const create_document_dto_1 = require("./dto/create-document.dto");
const update_document_dto_1 = require("./dto/update-document.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const document_entity_1 = require("./entities/document.entity");
const MAX_FILE_SIZE = 50 * 1024 * 1024;
let DocumentsController = class DocumentsController {
    documentsService;
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    async create(agentId, createDocumentDto, file, req) {
        if (file.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`文件大小超过限制：最大 ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }
        const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
        if (!Object.values(document_entity_1.DocumentType).includes(fileExtension)) {
            throw new common_1.BadRequestException(`不支持的文件类型: ${fileExtension}。支持的类型: ${Object.values(document_entity_1.DocumentType).join(', ')}`);
        }
        return this.documentsService.create(agentId, createDocumentDto, file, req.user);
    }
    async findAll(agentId, req) {
        return this.documentsService.findAll(agentId, req.user);
    }
    async findOne(agentId, id, req) {
        return this.documentsService.findOne(agentId, id, req.user);
    }
    async download(agentId, id, req, res) {
        const document = await this.documentsService.findOne(agentId, id, req.user);
        if (!fs.existsSync(document.filePath)) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                message: '文件不存在或已被删除',
            });
        }
        return res.download(document.filePath, document.fileName);
    }
    async update(agentId, id, updateDocumentDto, req) {
        return this.documentsService.update(agentId, id, updateDocumentDto, req.user);
    }
    async remove(agentId, id, req) {
        await this.documentsService.remove(agentId, id, req.user);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)(':agentId/documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueFilename = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
                cb(null, uniqueFilename);
            },
        }),
        limits: {
            fileSize: MAX_FILE_SIZE,
        },
    })),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_document_dto_1.CreateDocumentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':agentId/documents'),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':agentId/documents/:id'),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':agentId/documents/:id/download'),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "download", null);
__decorate([
    (0, common_1.Put)(':agentId/documents/:id'),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_document_dto_1.UpdateDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':agentId/documents/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "remove", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)('agents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map