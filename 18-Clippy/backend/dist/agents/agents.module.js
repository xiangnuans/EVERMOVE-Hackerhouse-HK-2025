"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const agents_service_1 = require("./agents.service");
const documents_service_1 = require("./documents.service");
const agents_controller_1 = require("./agents.controller");
const documents_controller_1 = require("./documents.controller");
const internal_api_controller_1 = require("./internal-api.controller");
const files_controller_1 = require("./files.controller");
const agent_entity_1 = require("./entities/agent.entity");
const document_entity_1 = require("./entities/document.entity");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
const development_api_guard_1 = require("./guards/development-api.guard");
let AgentsModule = class AgentsModule {
};
exports.AgentsModule = AgentsModule;
exports.AgentsModule = AgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: agent_entity_1.Agent.name, schema: agent_entity_1.AgentSchema },
                { name: document_entity_1.Document.name, schema: document_entity_1.DocumentSchema },
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [
            agents_controller_1.AgentsController,
            documents_controller_1.DocumentsController,
            internal_api_controller_1.InternalApiController,
            files_controller_1.FilesController
        ],
        providers: [
            agents_service_1.AgentsService,
            documents_service_1.DocumentsService,
            development_api_guard_1.DevelopmentApiGuard,
        ],
        exports: [agents_service_1.AgentsService, documents_service_1.DocumentsService],
    })
], AgentsModule);
//# sourceMappingURL=agents.module.js.map