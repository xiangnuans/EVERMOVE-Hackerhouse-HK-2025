# Clippy AI Service

这是Clippy项目的AI服务组件，主要负责与Deepseek API交互，提供AI分析和评分功能。该服务可以处理任何类型的AI助手评估，不限于特定领域。

## 技术栈

- NestJS 框架
- TypeScript
- Deepseek API 集成
- 环境变量配置

## 项目结构

```
clippy-ai-service/
├── src/
│   ├── services/
│   │   └── deepseek.service.ts    # Deepseek API 服务
│   ├── controllers/
│   │   └── analysis.controller.ts # API 控制器
│   ├── guards/
│   │   └── api-key.guard.ts       # API 密钥验证
│   ├── app.module.ts              # 应用模块
│   └── main.ts                    # 应用入口
├── .env                           # 环境变量（不提交到git）
├── .env.example                   # 环境变量模板
└── package.json                   # 项目配置
```

## 环境变量配置

复制 `.env.example` 到 `.env` 并配置以下变量：

```bash
# API Keys
DEEPSEEK_API_KEY=your-deepseek-api-key    # Deepseek API密钥
INTERNAL_API_KEY=your-internal-api-key     # 内部API密钥

# Server Configuration
PORT=5471                                  # 服务端口
NODE_ENV=development                       # 运行环境

# Security
INTERNAL_ALLOWED_IPS=127.0.0.1,...         # 允许访问的IP地址
```

## API 端点

### 1. 获取所有Agent

```http
GET /api/internal/agents
Headers:
  x-api-key: your-internal-api-key

Response 200:
[
  {
    "id": "6087e35f3e5a2b1234567890",
    "name": "AI助手名称",
    "industry": "行业/领域",
    "description": "AI助手的描述",
    "score": 85,
    "feedback": "评估反馈",
    "documents": [
      {
        "id": "6087e35f3e5a2b1234567891",
        "name": "文档名称",
        "fileType": "pdf",
        "downloadUrl": "http://localhost:5471/api/files/6087e35f3e5a2b1234567891/download"
      }
    ]
  }
]
```

### 2. 更新Agent评分

```http
POST /api/internal/agents/:id/rating
Headers:
  x-api-key: your-internal-api-key
  Content-Type: application/json

Body:
{
  "score": 85,
  "feedback": "评估反馈内容"
}

Response 200:
{
  "_id": "6087e35f3e5a2b1234567890",
  "name": "AI助手名称",
  "industry": "行业/领域",
  "description": "AI助手的描述",
  "owner": "6087e35f3e5a2b0987654321",
  "isActive": true,
  "score": 85,
  "feedback": "评估反馈内容",
  "ratedAt": "2024-03-21T10:00:00.000Z",
  "createdAt": "2023-04-27T10:00:00.000Z",
  "updatedAt": "2024-03-21T10:00:00.000Z"
}
```

### 3. 文件下载

```http
GET /api/files/:id/download
Headers:
  x-api-key: your-internal-api-key

Response: 文件流
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填入实际的API密钥和配置
```

3. 开发模式运行：
```bash
npm run start:dev
```

4. 生产模式构建：
```bash
npm run build
npm run start:prod
```

## 安全说明

1. API密钥保护：
   - 所有内部API都需要在请求头中提供有效的`x-api-key`
   - API密钥通过环境变量配置，不在代码中硬编码

2. IP限制：
   - 可以通过`INTERNAL_ALLOWED_IPS`环境变量限制允许访问的IP地址
   - 支持单个IP和CIDR格式的IP范围

3. 环境变量：
   - `.env`文件包含敏感信息，已添加到`.gitignore`
   - 新环境部署时需要手动配置`.env`文件

## 错误处理

服务会返回标准的HTTP状态码：

- 200: 请求成功
- 400: 请求参数错误
- 401: 未授权（API密钥无效）
- 403: 禁止访问（IP不在允许列表中）
- 404: 资源不存在
- 500: 服务器内部错误

错误响应格式：
```json
{
  "statusCode": 400,
  "message": "错误信息",
  "error": "Bad Request"
}
```

## 与主后端集成

1. 配置：
   - 在主后端的环境变量中设置`AI_SERVICE_URL`指向本服务
   - 确保主后端有正确的内部API密钥

2. 调用示例：
```typescript
// 在主后端中调用AI服务
const response = await axios.post(
  `${process.env.AI_SERVICE_URL}/api/internal/agents/${agentId}/rating`,
  {
    score: 85,
    feedback: "分析结果"
  },
  {
    headers: {
      'x-api-key': process.env.INTERNAL_API_KEY
    }
  }
);
```

## 开发注意事项

1. 代码规范：
   - 使用TypeScript严格模式
   - 遵循NestJS最佳实践
   - 保持代码注释完整

2. 测试：
   - 运行测试：`npm test`
   - 测试覆盖率：`npm run test:cov`

3. 部署：
   - 确保生产环境的`.env`配置正确
   - 使用`npm run build`构建生产版本
   - 使用`npm run start:prod`运行生产版本

## 故障排除

1. API调用失败：
   - 检查Deepseek API密钥是否正确
   - 确认网络连接正常
   - 查看服务日志

2. 内部API访问失败：
   - 验证API密钥是否正确
   - 检查IP是否在允许列表中
   - 确认服务端口是否正确

3. 环境变量问题：
   - 确保所有必需的环境变量都已设置
   - 检查环境变量格式是否正确
   - 重启服务使新的环境变量生效 