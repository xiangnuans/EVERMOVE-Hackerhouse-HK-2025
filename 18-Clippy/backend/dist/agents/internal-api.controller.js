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
exports.InternalApiController = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("./agents.service");
const update_agent_rating_dto_1 = require("./dto/update-agent-rating.dto");
const development_api_guard_1 = require("./guards/development-api.guard");
const constants_1 = require("../config/constants");
let InternalApiController = class InternalApiController {
    agentsService;
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAllWithDocumentUrls() {
        const agents = await this.agentsService.findAllWithDocumentUrls();
        return {
            baseUrl: constants_1.Constants.APP.BASE_URL,
            agents: agents,
        };
    }
    async updateRating(id, updateRatingDto) {
        return this.agentsService.updateRating(id, updateRatingDto);
    }
};
exports.InternalApiController = InternalApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InternalApiController.prototype, "findAllWithDocumentUrls", null);
__decorate([
    (0, common_1.Post)(':id/rating'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_agent_rating_dto_1.UpdateAgentRatingDto]),
    __metadata("design:returntype", Promise)
], InternalApiController.prototype, "updateRating", null);
exports.InternalApiController = InternalApiController = __decorate([
    (0, common_1.Controller)('internal/agents'),
    (0, common_1.UseGuards)(development_api_guard_1.DevelopmentApiGuard),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], InternalApiController);
//# sourceMappingURL=internal-api.controller.js.map