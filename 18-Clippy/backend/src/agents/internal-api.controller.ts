import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { UpdateAgentRatingDto } from './dto/update-agent-rating.dto';
import { InternalApiGuard } from './guards/internal-api.guard';
import { AgentWithDocuments } from './interfaces/agent-with-documents.interface';
import { AgentDocument } from './entities/agent.entity';

@Controller('internal/agents')
@UseGuards(InternalApiGuard)
export class InternalApiController {
  constructor(private readonly agentsService: AgentsService) {}

  /**
   * 获取所有代理及其关联文件的URL
   * 用于AI服务获取要处理的代理列表
   */
  @Get()
  async findAllWithDocumentUrls(): Promise<AgentWithDocuments[]> {
    return this.agentsService.findAllWithDocumentUrls();
  }

  /**
   * 更新代理评分
   * 用于AI服务对代理进行评分
   */
  @Post(':id/rating')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateAgentRatingDto,
  ): Promise<AgentDocument> {
    return this.agentsService.updateRating(id, updateRatingDto);
  }
} 