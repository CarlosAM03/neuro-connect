import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, GeneratedSummary } from './ai.provider';
import { SummaryContext } from './summary-context.dto';

/** Development mock only. No network, model SDK, sampling or real generation. */
@Injectable()
export class MockAiProvider implements AiProvider {
  constructor(private readonly config: ConfigService) {}
  generateSummary(context: SummaryContext): Promise<GeneratedSummary> {
    if (this.config.get<string>('NODE_ENV') === 'production')
      throw new ServiceUnavailableException('Development mock only');
    const details = context.goals
      .map(
        (goal) =>
          `${JSON.stringify(goal.title)}: progreso ${goal.progress}%, tendencia ${goal.trend}.${goal.insufficientHistory ? ' Historial insuficiente.' : ''}`,
      )
      .join('\n');
    return Promise.resolve({
      provider: 'mock',
      model: 'development-mock',
      content: `Development mock only — no es IA generativa real.\nObjetivos: ${context.totalGoals}; completados: ${context.completedGoals}; cumplimiento: ${context.completionRate}%; frecuencia: ${context.checkInFrequencyPerWeek} check-ins/semana en ${context.periodDays} días.\n${details || 'Sin objetivos; no hay historial para resumir.'}`,
    });
  }
}
