import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeepseekService } from './services/deepseek.service';
import { AnalysisController } from './controllers/analysis.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AnalysisController],
  providers: [DeepseekService],
})
export class AppModule {} 