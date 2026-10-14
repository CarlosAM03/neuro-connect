import {
  AnalyticsGoal,
  DAY_MS,
  goalAnalytics,
  overviewAnalytics,
} from './analytics.rules';
const now = new Date('2026-10-14T12:00:00.000Z');
const check = (progress: number, age: number, difficulty = 3) => ({
  progress,
  difficulty,
  createdAt: new Date(now.getTime() - age * DAY_MS),
});
const goal = (data: Partial<AnalyticsGoal> = {}): AnalyticsGoal => ({
  id: 'test',
  status: 'ACTIVE',
  progress: 0,
  checkIns: [],
  ...data,
});
describe('deterministic analytics / ADR-002', () => {
  it('empty owner has finite zero metrics', () =>
    expect(overviewAnalytics([], now)).toEqual({
      totalGoals: 0,
      activeGoals: 0,
      pausedGoals: 0,
      completedGoals: 0,
      completionRate: 0,
      averageProgress: 0,
      checkInsLast28Days: 0,
      checkInFrequencyPerWeek: 0,
      inactiveGoals: 0,
    }));
  it('no history is inactive with explicit nulls', () =>
    expect(goalAnalytics(goal(), now)).toMatchObject({
      trend: 'INACTIVE',
      insufficientHistory: true,
      previousProgress: null,
      progressDelta: null,
      averageDifficulty: null,
      daysSinceLastCheckIn: null,
      timeline: [],
    }));
  it('one recent record is stable, insufficient and has no delta', () =>
    expect(
      goalAnalytics(goal({ progress: 40, checkIns: [check(40, 1)] }), now),
    ).toMatchObject({
      trend: 'STABLE',
      insufficientHistory: true,
      progressDelta: null,
      previousProgress: null,
    }));
  it.each([
    [5, 'PROGRESSING'],
    [10, 'PROGRESSING'],
    [-5, 'DECLINING'],
    [-10, 'DECLINING'],
    [4, 'STABLE'],
    [-4, 'STABLE'],
    [0, 'STABLE'],
  ])('delta %s → %s', (delta, trend) =>
    expect(
      goalAnalytics(
        goal({
          progress: 50 + Number(delta),
          checkIns: [check(50, 2), check(50 + Number(delta), 1)],
        }),
        now,
      ),
    ).toMatchObject({
      trend,
      insufficientHistory: false,
      previousProgress: 50,
      progressDelta: delta,
    }),
  );
  it.each([7.00001, 8, 40])(
    'ACTIVE inactivity precedes delta after %s days',
    (age) =>
      expect(
        goalAnalytics(
          goal({ progress: 70, checkIns: [check(10, 50), check(70, age)] }),
          now,
        ).trend,
      ).toBe('INACTIVE'),
  );
  it('exactly seven days is still active', () =>
    expect(
      goalAnalytics(
        goal({ progress: 50, checkIns: [check(40, 8), check(50, 7)] }),
        now,
      ).trend,
    ).toBe('PROGRESSING'));
  it('old single record remains insufficient but ACTIVE is inactive', () =>
    expect(
      goalAnalytics(goal({ progress: 40, checkIns: [check(40, 10)] }), now),
    ).toMatchObject({ trend: 'INACTIVE', insufficientHistory: true }));
  it.each(['PAUSED', 'COMPLETED'] as const)(
    '%s has historical trend, never inactivity',
    (status) => {
      expect(
        goalAnalytics(
          goal({
            status,
            progress: 30,
            checkIns: [check(40, 60), check(30, 50)],
          }),
          now,
        ).trend,
      ).toBe('DECLINING');
      expect(goalAnalytics(goal({ status }), now)).toMatchObject({
        trend: 'STABLE',
        insufficientHistory: true,
      });
      expect(overviewAnalytics([goal({ status })], now).inactiveGoals).toBe(0);
    },
  );
  it('window includes exactly 28 days and now, excludes older and future', () => {
    const result = goalAnalytics(
      goal({
        checkIns: [
          check(10, 28.00001),
          check(20, 28),
          check(30, 0),
          check(40, -1),
        ],
      }),
      now,
    );
    expect(result.checkInsLast28Days).toBe(2);
    expect(result.totalCheckIns).toBe(4);
  });
  it('difficulty uses ALL history, and days are complete UTC durations', () =>
    expect(
      goalAnalytics(
        goal({
          progress: 50,
          checkIns: [check(10, 40, 1), check(40, 20, 5), check(50, 2.9, 2)],
        }),
        now,
      ),
    ).toMatchObject({
      averageDifficulty: 2.67,
      daysSinceLastCheckIn: 2,
      checkInsLast28Days: 2,
    }));
  it('overview includes all statuses and counts only ACTIVE inactive', () =>
    expect(
      overviewAnalytics(
        [
          goal({ progress: 10 }),
          goal({ status: 'PAUSED', progress: 40, checkIns: [check(40, 1)] }),
          goal({ status: 'COMPLETED', progress: 80, checkIns: [check(80, 2)] }),
        ],
        now,
      ),
    ).toMatchObject({
      totalGoals: 3,
      activeGoals: 1,
      pausedGoals: 1,
      completedGoals: 1,
      completionRate: 33.33,
      averageProgress: 43.33,
      inactiveGoals: 1,
      checkInsLast28Days: 2,
      checkInFrequencyPerWeek: 0.5,
    }));
  it('timeline is chronological ISO UTC and inputs are not mutated', () => {
    const input = goal({ checkIns: [check(50, 0), check(20, 2)] });
    const before = JSON.stringify(input);
    const result = goalAnalytics(input, now);
    expect(result.timeline).toEqual([
      { date: '2026-10-12T12:00:00.000Z', progress: 20 },
      { date: '2026-10-14T12:00:00.000Z', progress: 50 },
    ]);
    expect(JSON.stringify(input)).toBe(before);
    expect(goalAnalytics(input, now)).toEqual(result);
  });
});
