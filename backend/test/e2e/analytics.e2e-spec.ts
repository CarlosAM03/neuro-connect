import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { GoalStatus } from '@prisma/client';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/bootstrap';
import { PrismaService } from '../../src/prisma/prisma.service';
import { DAY_MS } from '../../src/analytics/analytics.rules';

describe('MVP-1 Analytics / PostgreSQL', () => {
  let app: INestApplication, prisma: PrismaService;
  let ownerId: string, token: string, stranger: string;
  const emails = [
    `analytics-${randomUUID()}@example.com`,
    `analytics-${randomUUID()}@example.com`,
  ];
  const ids: Record<string, string> = {};
  const api = '/api/v1/analytics';
  const auth = () => ({ Authorization: `Bearer ${token}` });
  beforeAll(async () => {
    if (process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)
      throw new Error('Separate test DB required');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
    for (const [i, email] of emails.entries()) {
      const user = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'analytics-test-only-82',
          displayName: 'Analytics test',
        })
        .expect(201);
      const login = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'analytics-test-only-82' })
        .expect(200);
      if (i === 0) {
        ownerId = user.body.id;
        token = login.body.accessToken;
      } else stranger = login.body.accessToken;
    }
    const fixtures: {
      key: string;
      values: number[];
      ages: number[];
      status: GoalStatus;
    }[] = [
      { key: 'growing', values: [10, 35], ages: [20, 1], status: 'ACTIVE' },
      { key: 'stable', values: [40, 41], ages: [2, 1], status: 'ACTIVE' },
      { key: 'declining', values: [70, 40], ages: [2, 1], status: 'ACTIVE' },
      { key: 'inactive', values: [30, 40], ages: [40, 10], status: 'ACTIVE' },
      { key: 'paused', values: [30, 35], ages: [40, 30], status: 'PAUSED' },
      {
        key: 'completed',
        values: [70, 60],
        ages: [40, 30],
        status: 'COMPLETED',
      },
      { key: 'empty', values: [], ages: [], status: 'ACTIVE' },
      { key: 'single', values: [50], ages: [1], status: 'ACTIVE' },
    ];
    for (const fixture of fixtures) {
      const goal = await prisma.goal.create({
        data: {
          ownerId,
          title: fixture.key,
          progress: fixture.values.at(-1) ?? 0,
          status: fixture.status,
        },
      });
      ids[fixture.key] = goal.id;
      for (const [index, progress] of fixture.values.entries())
        await prisma.checkIn.create({
          data: {
            goalId: goal.id,
            progress,
            difficulty: index === 0 ? 1 : 5,
            completion: 'PARTIAL',
            notes: 'PRIVATE_NOT_IN_ANALYTICS',
            createdAt: new Date(Date.now() - fixture.ages[index] * DAY_MS),
          },
        });
    }
  });
  afterAll(async () => {
    if (prisma)
      await prisma.user.deleteMany({ where: { email: { in: emails } } });
    if (app) await app.close();
  });
  it('requires JWT and validates UUID', async () => {
    await request(app.getHttpServer()).get(`${api}/overview`).expect(401);
    await request(app.getHttpServer())
      .get(`${api}/goals/not-uuid`)
      .set(auth())
      .expect(400);
  });
  it('returns all overview metrics, isolating another empty owner', async () => {
    const result = await request(app.getHttpServer())
      .get(`${api}/overview`)
      .set(auth())
      .expect(200);
    expect(result.body).toEqual({
      totalGoals: 8,
      activeGoals: 6,
      pausedGoals: 1,
      completedGoals: 1,
      completionRate: 12.5,
      averageProgress: 37.63,
      checkInsLast28Days: 8,
      checkInFrequencyPerWeek: 2,
      inactiveGoals: 2,
    });
    const empty = await request(app.getHttpServer())
      .get(`${api}/overview`)
      .set('Authorization', `Bearer ${stranger}`)
      .expect(200);
    expect(Object.values(empty.body).every((value) => value === 0)).toBe(true);
  });
  it.each([
    ['growing', 'PROGRESSING'],
    ['stable', 'STABLE'],
    ['declining', 'DECLINING'],
    ['inactive', 'INACTIVE'],
    ['paused', 'PROGRESSING'],
    ['completed', 'DECLINING'],
  ])('%s has %s trend', async (key, trend) => {
    const result = await request(app.getHttpServer())
      .get(`${api}/goals/${ids[key]}`)
      .set(auth())
      .expect(200);
    expect(result.body.trend).toBe(trend);
    expect(result.body.insufficientHistory).toBe(false);
  });
  it('returns ordered UTC timeline, all-history difficulty and delta without private fields', async () => {
    const result = await request(app.getHttpServer())
      .get(`${api}/goals/${ids.growing}`)
      .set(auth())
      .expect(200);
    expect(result.body).toMatchObject({
      goalId: ids.growing,
      currentProgress: 35,
      previousProgress: 10,
      progressDelta: 25,
      averageDifficulty: 3,
      totalCheckIns: 2,
      checkInsLast28Days: 2,
      daysSinceLastCheckIn: 1,
    });
    expect(
      result.body.timeline.map((point: { progress: number }) => point.progress),
    ).toEqual([10, 35]);
    for (const point of result.body.timeline) {
      expect(Object.keys(point).sort()).toEqual(['date', 'progress']);
      expect(point.date).toMatch(/Z$/);
    }
    expect(JSON.stringify(result.body)).not.toMatch(
      /notes|PRIVATE_NOT_IN_ANALYTICS|password|email|token/i,
    );
  });
  it('handles zero and one historical observations explicitly', async () => {
    const empty = await request(app.getHttpServer())
      .get(`${api}/goals/${ids.empty}`)
      .set(auth())
      .expect(200);
    expect(empty.body).toMatchObject({
      trend: 'INACTIVE',
      insufficientHistory: true,
      previousProgress: null,
      progressDelta: null,
      averageDifficulty: null,
      daysSinceLastCheckIn: null,
      timeline: [],
    });
    const single = await request(app.getHttpServer())
      .get(`${api}/goals/${ids.single}`)
      .set(auth())
      .expect(200);
    expect(single.body).toMatchObject({
      trend: 'STABLE',
      insufficientHistory: true,
      previousProgress: null,
      progressDelta: null,
    });
  });
  it('returns indistinguishable 404 for foreign and missing goals', async () => {
    await request(app.getHttpServer())
      .get(`${api}/goals/${ids.growing}`)
      .set('Authorization', `Bearer ${stranger}`)
      .expect(404);
    await request(app.getHttpServer())
      .get(`${api}/goals/${randomUUID()}`)
      .set(auth())
      .expect(404);
  });
  it('does not mutate source records or persist derived results', async () => {
    const before = await prisma.goal.findMany({
      where: { ownerId },
      include: { checkIns: true },
      orderBy: { id: 'asc' },
    });
    await request(app.getHttpServer())
      .get(`${api}/overview`)
      .set(auth())
      .expect(200);
    await request(app.getHttpServer())
      .get(`${api}/goals/${ids.growing}`)
      .set(auth())
      .expect(200);
    expect(
      await prisma.goal.findMany({
        where: { ownerId },
        include: { checkIns: true },
        orderBy: { id: 'asc' },
      }),
    ).toEqual(before);
  });
  it('publishes OpenAPI contracts', async () => {
    const result = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);
    expect(
      result.body.paths[`${api}/overview`].get.responses['200'].content[
        'application/json'
      ].schema.$ref,
    ).toContain('OverviewResponse');
    expect(
      result.body.components.schemas.GoalAnalyticsResponse.properties.timeline,
    ).toBeDefined();
  });
});
