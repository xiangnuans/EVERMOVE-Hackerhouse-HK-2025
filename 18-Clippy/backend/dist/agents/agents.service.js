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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agent_entity_1 = require("./entities/agent.entity");
const document_entity_1 = require("./entities/document.entity");
const constants_1 = require("../config/constants");
let AgentsService = class AgentsService {
    agentModel;
    documentModel;
    constructor(agentModel, documentModel) {
        this.agentModel = agentModel;
        this.documentModel = documentModel;
    }
    async create(createAgentDto, user) {
        const agent = new this.agentModel({
            ...createAgentDto,
            owner: user._id,
        });
        return agent.save();
    }
    async findAll(user) {
        return this.agentModel.find({ owner: user._id }).exec();
    }
    async findAllWithDocumentUrls() {
        const agents = await this.agentModel.find({ isActive: true }).exec();
        const result = [];
        for (const agent of agents) {
            const documents = await this.documentModel.find({ agent: agent._id }).exec();
            const documentUrls = documents.map(doc => ({
                id: doc._id.toString(),
                name: doc.name,
                fileType: doc.fileType,
                downloadUrl: `${constants_1.Constants.INTERNAL.FILE_PATH}/${doc._id}/download`,
            }));
            result.push({
                id: agent._id.toString(),
                name: agent.name,
                industry: agent.industry,
                description: agent.description,
                score: agent.score,
                feedback: agent.feedback,
                documents: documentUrls
            });
        }
        return result;
    }
    async findOne(id, user) {
        const agent = await this.agentModel.findById(id).exec();
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        if (agent.owner.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException('You do not have permission to access this agent');
        }
        return agent;
    }
    async findOneById(id) {
        const agent = await this.agentModel.findById(id).exec();
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }
    async update(id, updateAgentDto, user) {
        const agent = await this.findOne(id, user);
        Object.assign(agent, updateAgentDto);
        return agent.save();
    }
    async updateRating(id, updateRatingDto) {
        const agent = await this.findOneById(id);
        agent.score = updateRatingDto.score;
        if (updateRatingDto.feedback) {
            agent.feedback = updateRatingDto.feedback;
        }
        agent.ratedAt = new Date();
        return agent.save();
    }
    async remove(id, user) {
        const agent = await this.findOne(id, user);
        await agent.deleteOne();
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agent_entity_1.Agent.name)),
    __param(1, (0, mongoose_1.InjectModel)(document_entity_1.Document.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AgentsService);
//# sourceMappingURL=agents.service.js.map