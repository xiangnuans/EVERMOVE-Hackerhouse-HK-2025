import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { DeepseekService } from '../services/deepseek.service';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('api/internal')
@UseGuards(ApiKeyGuard)
export class AnalysisController {
  constructor(private readonly deepseekService: DeepseekService) {}

  @Get('agents')
  async getAllAgents() {
    // TODO: 实现从数据库获取所有活跃Agent的逻辑
    return [
      {
        id: "6087e35f3e5a2b1234567890",
        name: "市场分析助手",
        industry: "金融",
        description: "专注于金融市场分析的AI助手",
        score: 85,
        feedback: "这是一个不错的Agent，但还有提升空间",
        documents: [
          {
            id: "6087e35f3e5a2b1234567891",
            name: "市场报告",
            fileType: "pdf",
            downloadUrl: "http://localhost:5471/api/files/6087e35f3e5a2b1234567891/download"
          }
        ]
      }
    ];
  }

  @Post('agents/:id/rating')
  async updateAgentRating(
    @Param('id') id: string,
    @Body() body: { score: number; feedback: string }
  ) {
    // TODO: 实现更新Agent评分的逻辑
    return {
      _id: id,
      name: "市场分析助手",
      industry: "金融",
      description: "专注于金融市场分析的AI助手",
      owner: "6087e35f3e5a2b0987654321",
      isActive: true,
      score: body.score,
      feedback: body.feedback,
      ratedAt: new Date().toISOString(),
      createdAt: "2023-04-27T10:00:00.000Z",
      updatedAt: new Date().toISOString()
    };
  }

  @Get('files/:id/download')
  async downloadFile(@Param('id') id: string) {
    // TODO: 实现文件下载逻辑
    throw new Error('File not found or has been deleted');
  }
} 