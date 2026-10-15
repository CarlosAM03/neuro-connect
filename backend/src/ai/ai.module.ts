import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AI_PROVIDER } from './ai.provider';
import { AiController } from './ai.controller';
import { AiSummaryService } from './ai-summary.service';
import { MockAiProvider } from './mock-ai.provider';
import { PromptBuilder } from './prompt.builder';
import { SummaryContextBuilder } from './summary-context.builder';

@Module({
  imports: [AnalyticsModule],
  controllers: [AiController],
  providers: [
    SummaryContextBuilder,
    PromptBuilder,
    MockAiProvider,
    { provide: AI_PROVIDER, useExisting: MockAiProvider },
    AiSummaryService,
  ],
  exports: [AiSummaryService],
})
export class AiModule {}
