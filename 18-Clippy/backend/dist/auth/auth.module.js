"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const users_module_1 = require("../users/users.module");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./jwt.strategy");
const aptos_signature_service_1 = require("./aptos-signature.service");
const auth_controller_1 = require("./auth.controller");
const constants_1 = require("../config/constants");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'clippy-secret-key',
                signOptions: { expiresIn: constants_1.Constants.AUTH.JWT_EXPIRES_IN },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            aptos_signature_service_1.AptosSignatureService,
            {
                provide: jwt_auth_guard_1.JwtAuthGuard,
                useFactory: (jwtService, usersService, jwtStrategy) => {
                    return new jwt_auth_guard_1.JwtAuthGuard(jwtService, usersService, jwtStrategy);
                },
                inject: [jwt_1.JwtService, users_service_1.UsersService, jwt_strategy_1.JwtStrategy]
            }
        ],
        exports: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            passport_1.PassportModule,
            jwt_1.JwtModule,
            jwt_auth_guard_1.JwtAuthGuard
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map