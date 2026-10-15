import { GoalStatus } from '@prisma/client';

export type Trend = 'PROGRESSING' | 'STABLE' | 'DECLINING' | 'INACTIVE';
export interface AnalyticsCheckIn {
  progress: number;
  difficulty: number;
  createdAt: Date;
}
export interface AnalyticsGoal {
  id: string;
  status: GoalStatus;
  progress: number;
  checkIns: AnalyticsCheckIn[];
}
export const DAY_MS = 86400000;
export const roundMetric = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export function goalAnalytics(goal: AnalyticsGoal, now: Date) {
  // Copy before sorting: pure calculation never mutates a caller's history.
  const history = [...goal.checkIns].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  const last = history.at(-1);
  const previousProgress = history.at(-2)?.progress ?? null;
  const progressDelta =
    previousProgress === null ? null : goal.progress - previousProgress;
  const elapsed = last
    ? Math.max(0, now.getTime() - last.createdAt.getTime())
    : null;
  let trend: Trend =
    progressDelta === null
      ? 'STABLE'
      : progressDelta >= 5
        ? 'PROGRESSING'
        : progressDelta <= -5
          ? 'DECLINING'
          : 'STABLE';
  // Activity takes precedence over delta for ACTIVE goals; non-active goals
  // retain their historical delta classification, never current inactivity.
  if (goal.status === 'ACTIVE' && (elapsed === null || elapsed > 7 * DAY_MS))
    trend = 'INACTIVE';
  const recent = history.filter(
    (item) =>
      item.createdAt.getTime() >= now.getTime() - 28 * DAY_MS &&
      item.createdAt.getTime() <= now.getTime(),
  );
  return {
    goalId: goal.id,
    currentProgress: goal.progress,
    previousProgress,
    progressDelta,
    averageDifficulty: history.length
      ? roundMetric(
          history.reduce((n, item) => n + item.difficulty, 0) / history.length,
        )
      : null,
    totalCheckIns: history.length,
    checkInsLast28Days: recent.length,
    daysSinceLastCheckIn:
      elapsed === null ? null : Math.floor(elapsed / DAY_MS),
    trend,
    insufficientHistory: history.length < 2,
    timeline: history.map((item) => ({
      date: item.createdAt.toISOString(),
      progress: item.progress,
    })),
  };
}

export function overviewAnalytics(goals: AnalyticsGoal[], now: Date) {
  const eligibleGoals = goals.filter((goal) => goal.status !== 'CANCELLED');
  const eligible = eligibleGoals.length;
  const completedGoals = goals.filter(
    (goal) => goal.status === 'COMPLETED',
  ).length;
  const calculated = goals.map((goal) => goalAnalytics(goal, now));
  const checkInsLast28Days = calculated.reduce(
    (n, goal) => n + goal.checkInsLast28Days,
    0,
  );
  return {
    totalGoals: goals.length,
    activeGoals: goals.filter((goal) => goal.status === 'ACTIVE').length,
    pausedGoals: goals.filter((goal) => goal.status === 'PAUSED').length,
    completedGoals,
    cancelledGoals: goals.filter((goal) => goal.status === 'CANCELLED').length,
    completionRate: eligible
      ? roundMetric((completedGoals / eligible) * 100)
      : 0,
    averageProgress: eligible
      ? roundMetric(
          eligibleGoals.reduce((n, goal) => n + goal.progress, 0) / eligible,
        )
      : 0,
    checkInsLast28Days,
    checkInFrequencyPerWeek: checkInsLast28Days / 4,
    inactiveGoals: calculated.filter((goal) => goal.trend === 'INACTIVE')
      .length,
  };
}
