import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_PROVIDER, AiProvider } from './ai.provider';
import { PromptBuilder } from './prompt.builder';
import { SummaryContextBuilder } from './summary-context.builder';
import { AiPreviewResponse } from './summary-context.dto';
import { PrismaService } from '../prisma/prisma.service';
import { summaryReadSelect } from './summary-read.dto';

@Injectable()
export class AiSummaryService {
  constructor(
    private readonly contexts: SummaryContextBuilder,
    private readonly prompts: PromptBuilder,
    private readonly config: ConfigService,
    @Inject(AI_PROVIDER) private readonly provider: AiProvider,
    private readonly prisma: PrismaService,
  ) {}
  list(userId: string) {
    return this.prisma.aISummary.findMany({
      where: { userId },
      select: summaryReadSelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
  async detail(userId: string, id: string) {
    const summary = await this.prisma.aISummary.findFirst({
      where: { userId, id },
      select: summaryReadSelect,
    });
    if (!summary) throw new NotFoundException('Resumen no encontrado');
    return summary;
  }
  async preview(ownerId: string): Promise<AiPreviewResponse> {
    if (!this.config.get<boolean>('AI_PREVIEW_ENABLED'))
      throw new NotFoundException('Vista previa técnica deshabilitada');
    const context = await this.contexts.build(ownerId);
    return {
      context,
      prompt: this.prompts.build(context),
      providerConfigured: false,
    };
  }
  // Internal development seam only: deliberately no public generation endpoint.
  async generateDevelopmentSummary(ownerId: string) {
    return this.provider.generateSummary(await this.contexts.build(ownerId));
  }
}
