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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentSchema = exports.Agent = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_entity_1 = require("../../users/entities/user.entity");
let Agent = class Agent {
    name;
    industry;
    description;
    owner;
    isActive;
    score;
    feedback;
    ratedAt;
};
exports.Agent = Agent;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Agent.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Agent.prototype, "industry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Agent.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_entity_1.User)
], Agent.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Agent.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, max: 100, default: null }),
    __metadata("design:type", Number)
], Agent.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Agent.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Agent.prototype, "ratedAt", void 0);
exports.Agent = Agent = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Agent);
exports.AgentSchema = mongoose_1.SchemaFactory.createForClass(Agent);
//# sourceMappingURL=agent.entity.js.map