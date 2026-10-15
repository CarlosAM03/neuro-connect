import { Injectable } from '@nestjs/common';
import { AnalyticsService } from '../analytics/analytics.service';
import { SummaryContext } from './summary-context.dto';

@Injectable()
export class SummaryContextBuilder {
  constructor(private readonly analytics: AnalyticsService) {}
  async build(ownerId: string): Promise<SummaryContext> {
    const { overview: metrics, goals } =
      await this.analytics.summarySource(ownerId);
    // Explicit allowlist: never spread upstream objects into an AI context.
    return {
      periodDays: 28,
      totalGoals: metrics.totalGoals,
      activeGoals: metrics.activeGoals,
      pausedGoals: metrics.pausedGoals,
      completedGoals: metrics.completedGoals,
      cancelledGoals: metrics.cancelledGoals,
      completionRate: metrics.completionRate,
      averageProgress: metrics.averageProgress,
      checkInsLast28Days: metrics.checkInsLast28Days,
      checkInFrequencyPerWeek: metrics.checkInFrequencyPerWeek,
      inactiveGoals: metrics.inactiveGoals,
      goals: goals.map(({ title, status, analytics }) => ({
        title,
        status,
        progress: analytics.currentProgress,
        trend: analytics.trend,
        averageDifficulty: analytics.averageDifficulty,
        daysSinceLastCheckIn: analytics.daysSinceLastCheckIn,
        insufficientHistory: analytics.insufficientHistory,
      })),
    };
  }
}
