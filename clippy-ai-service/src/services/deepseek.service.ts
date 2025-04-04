import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DeepseekService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
    }
  }

  async analyzeContent(content: string): Promise<{ score: number; feedback: string }> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的AI助手评估专家。请根据以下内容的质量、完整性和专业性进行评分（0-100分），并给出具体的反馈意见。'
            },
            {
              role: 'user',
              content: `请评估以下内容：\n\n${content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = response.data.choices[0].message.content;
      
      // 解析评分和反馈
      const scoreMatch = analysis.match(/评分[：:]\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 75; // 默认分数
      
      // 提取反馈内容
      const feedbackMatch = analysis.match(/反馈[：:]\s*([^\n]+)/i);
      const feedback = feedbackMatch ? feedbackMatch[1] : '内容评估完成，但未提供具体反馈';

      return {
        score,
        feedback
      };
    } catch (error) {
      console.error('Deepseek API Error:', error);
      throw new Error('Failed to analyze content with Deepseek API');
    }
  }
} 