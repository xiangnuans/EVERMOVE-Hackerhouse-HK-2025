import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AgentsService } from './agents.service';
import { DocumentsService } from './documents.service';
import { AgentsController } from './agents.controller';
import { DocumentsController } from './documents.controller';
import { InternalApiController } from './internal-api.controller';
import { FilesController } from './files.controller';
import { Agent, AgentSchema } from './entities/agent.entity';
import { Document, DocumentSchema } from './entities/document.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Constants } from '../config/constants';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Agent.name, schema: AgentSchema },
      { name: Document.name, schema: DocumentSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [
    AgentsController, 
    DocumentsController,
    InternalApiController,
    FilesController
  ],
  providers: [
    AgentsService, 
    DocumentsService
  ],
  exports: [AgentsService, DocumentsService],
})
export class AgentsModule {} 