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
var FilesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const document_entity_1 = require("./entities/document.entity");
let FilesController = FilesController_1 = class FilesController {
    documentModel;
    logger = new common_1.Logger(FilesController_1.name);
    constructor(documentModel) {
        this.documentModel = documentModel;
    }
    async downloadFile(id, res) {
        try {
            this.logger.debug(`请求下载文件: ${id}`);
            const document = await this.documentModel.findById(id).exec();
            if (!document) {
                this.logger.warn(`文件不存在: ${id}`);
                throw new common_1.NotFoundException(`文件ID: ${id} 不存在`);
            }
            if (!fs.existsSync(document.filePath)) {
                this.logger.warn(`文件路径不存在: ${document.filePath}`);
                throw new common_1.NotFoundException('文件不存在或已被删除');
            }
            const contentType = this.getContentType(document.fileType);
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.name)}"`);
            this.logger.log(`下载文件: ${document.name} (${id})`);
            return res.sendFile(path.resolve(document.filePath));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`文件下载出错: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('文件下载失败');
        }
    }
    getContentType(fileType) {
        const contentTypes = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'txt': 'text/plain',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        return contentTypes[fileType.toLowerCase()] || 'application/octet-stream';
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "downloadFile", null);
exports.FilesController = FilesController = FilesController_1 = __decorate([
    (0, common_1.Controller)('files'),
    __param(0, (0, mongoose_1.InjectModel)(document_entity_1.Document.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FilesController);
//# sourceMappingURL=files.controller.js.map