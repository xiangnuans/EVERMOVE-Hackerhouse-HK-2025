"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const constants_1 = require("./config/constants");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
dotenv.config();
const globalLogger = new common_1.Logger('Bootstrap');
function getLogLevels() {
    const env = process.env.NODE_ENV || 'development';
    if (['development', 'test'].includes(env)) {
        return ['error', 'warn', 'log', 'debug', 'verbose'];
    }
    return ['error', 'warn', 'log'];
}
function logEnvironmentInfo() {
    globalLogger.log('环境变量信息:');
    globalLogger.log(`- NODE_ENV: ${process.env.NODE_ENV || '未设置 (默认为development)'}`);
    globalLogger.log(`- PORT: ${process.env.PORT || '3000 (默认)'}`);
    globalLogger.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '已设置' : '未设置，使用默认值'}`);
    globalLogger.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '已设置' : '未设置，使用默认值'}`);
    globalLogger.log(`- APTOS_NODE_URL: ${process.env.APTOS_NODE_URL ? '已设置' : '未设置，使用默认值'}`);
    globalLogger.log(`- BASE_URL: ${process.env.BASE_URL || 'http://localhost:5471 (默认)'}`);
    globalLogger.log(`- 日志级别: ${getLogLevels().join(', ')}`);
}
function ensureUploadDirectoryExists() {
    const uploadDir = path.join(process.cwd(), 'uploads');
    globalLogger.log(`在应用启动前检查上传目录: ${uploadDir}`);
    if (!fs.existsSync(uploadDir)) {
        globalLogger.log(`创建上传目录: ${uploadDir}`);
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
            globalLogger.log('上传目录创建成功');
        }
        catch (error) {
            globalLogger.error('创建上传目录失败:', error);
        }
    }
    else {
        globalLogger.log('上传目录已存在');
    }
}
async function bootstrap() {
    logEnvironmentInfo();
    ensureUploadDirectoryExists();
    try {
        const logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
        globalLogger.log(`启动应用程序，启用的日志级别: ${logLevels.join(', ')}`);
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: logLevels,
            abortOnError: false,
        });
        globalLogger.log(`应用已创建，开始配置...`);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
            allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,X-Auth-Token',
        });
        globalLogger.log(`CORS已配置，允许所有来源`);
        app.setGlobalPrefix(constants_1.Constants.API.PREFIX);
        globalLogger.log(`API前缀已设置为: ${constants_1.Constants.API.PREFIX}`);
        const port = process.env.PORT || 3000;
        await app.listen(port);
        globalLogger.log(`${constants_1.Constants.APP.NAME} 应用程序正在运行，端口: ${port}`);
        globalLogger.log(`对外API访问地址: http://localhost:${port}/${constants_1.Constants.API.PREFIX}`);
    }
    catch (error) {
        globalLogger.error('启动应用时出错:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map