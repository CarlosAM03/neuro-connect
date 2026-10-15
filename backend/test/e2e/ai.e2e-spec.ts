import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/bootstrap';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AiSummaryService } from '../../src/ai/ai-summary.service';
import { MockAiProvider } from '../../src/ai/mock-ai.provider';

describe('Avance 1 AI Preview / real PostgreSQL', () => {
  let app: INestApplication,
    prisma: PrismaService,
    ownerId: string,
    token: string,
    stranger: string,
    goalId: string;
  const emails = [
    `preview-${randomUUID()}@example.com`,
    `preview-${randomUUID()}@example.com`,
  ];
  const path = '/api/v1/ai/summary/context';
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
    for (const [index, email] of emails.entries()) {
      const user = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'preview-test-only-2026',
          displayName: 'PRIVATE_DISPLAY_NAME',
        })
        .expect(201);
      const login = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password: 'preview-test-only-2026' })
        .expect(200);
      if (index === 0) {
        ownerId = user.body.id;
        token = login.body.accessToken;
      } else stranger = login.body.accessToken;
    }
    const goal = await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Organizar mis actividades',
        description: 'PRIVATE_DESCRIPTION',
      })
      .expect(201);
    goalId = goal.body.id;
    for (const progress of [30, 70])
      await request(app.getHttpServer())
        .post(`/api/v1/goals/${goalId}/check-ins`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          progress,
          difficulty: 3,
          completion: 'PARTIAL',
          notes: 'PRIVATE_CHECKIN_NOTES',
        })
        .expect(201);
    await request(app.getHttpServer())
      .post('/api/v1/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sin historial' })
      .expect(201);
  });
  afterAll(async () => {
    if (prisma)
      await prisma.user.deleteMany({ where: { email: { in: emails } } });
    if (app) await app.close();
  });
  const preview = (credential = token) =>
    request(app.getHttpServer())
      .get(path)
      .set('Authorization', `Bearer ${credential}`);
  it('requires JWT and rejects invalid credentials', async () => {
    await request(app.getHttpServer()).get(path).expect(401);
    await preview('invalid-token').expect(401);
  });
  it('uses real Analytics metrics, retains insufficient history and builds exact structured prompt', async () => {
    const result = await preview().expect(200);
    const overview = await request(app.getHttpServer())
      .get('/api/v1/analytics/overview')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const analytics = await request(app.getHttpServer())
      .get(`/api/v1/analytics/goals/${goalId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(result.body.providerConfigured).toBe(false);
    expect(result.body.context).toMatchObject({
      ...overview.body,
      periodDays: 28,
    });
    expect(
      result.body.context.goals.find(
        (g: { title: string }) => g.title === 'Organizar mis actividades',
      ),
    ).toMatchObject({
      progress: analytics.body.currentProgress,
      trend: analytics.body.trend,
      averageDifficulty: analytics.body.averageDifficulty,
      insufficientHistory: false,
    });
    expect(
      result.body.context.goals.find(
        (g: { title: string }) => g.title === 'Sin historial',
      ),
    ).toMatchObject({
      progress: 0,
      trend: 'INACTIVE',
      averageDifficulty: null,
      daysSinceLastCheckIn: null,
      insufficientHistory: true,
    });
    expect(JSON.parse(result.body.prompt.split('\n\nUSER\n')[1])).toEqual(
      result.body.context,
    );
    expect((await preview().expect(200)).body).toEqual(result.body);
  });
  it('does not leak notes, description, identity, IDs, passwords, JWT or environment', async () => {
    const result = await preview().expect(200);
    const serialized = JSON.stringify(result.body);
    for (const secret of [
      'PRIVATE_',
      emails[0],
      emails[1],
      ownerId,
      goalId,
      token,
      'preview-test-only-2026',
      process.env.JWT_SECRET!,
      process.env.DATABASE_URL!,
    ])
      expect(serialized).not.toContain(secret);
    expect(Object.keys(result.body).sort()).toEqual([
      'context',
      'prompt',
      'providerConfigured',
    ]);
    for (const goal of result.body.context.goals)
      expect(Object.keys(goal).sort()).toEqual(
        [
          'title',
          'status',
          'progress',
          'trend',
          'averageDifficulty',
          'daysSinceLastCheckIn',
          'insufficientHistory',
        ].sort(),
      );
  });
  it('isolates another owner even if the caller supplies forged owner/user query parameters', async () => {
    const result = await request(app.getHttpServer())
      .get(`${path}?ownerId=${ownerId}&userId=${ownerId}`)
      .set('Authorization', `Bearer ${stranger}`)
      .expect(200);
    expect(result.body.context).toMatchObject({
      totalGoals: 0,
      completedGoals: 0,
      completionRate: 0,
      averageProgress: 0,
      checkInFrequencyPerWeek: 0,
      goals: [],
    });
    expect(JSON.stringify(result.body)).not.toContain(
      'Organizar mis actividades',
    );
    await request(app.getHttpServer())
      .get(`/api/v1/analytics/goals/${goalId}`)
      .set('Authorization', `Bearer ${stranger}`)
      .expect(404);
  });
  it('can disable preview via configuration without disabling Analytics', async () => {
    const config = app.get(ConfigService);
    config.set('AI_PREVIEW_ENABLED', false);
    try {
      await preview().expect(404);
      await request(app.getHttpServer())
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    } finally {
      config.set('AI_PREVIEW_ENABLED', true);
    }
  });
  it('does not call provider or persist summary/domain changes during preview', async () => {
    const provider = jest.spyOn(app.get(MockAiProvider), 'generateSummary');
    const before = await prisma.aISummary.count({ where: { userId: ownerId } });
    const goals = await prisma.goal.findMany({
      where: { ownerId },
      include: { checkIns: true },
      orderBy: { id: 'asc' },
    });
    try {
      await preview().expect(200);
      expect(provider).not.toHaveBeenCalled();
      expect(await prisma.aISummary.count({ where: { userId: ownerId } })).toBe(
        before,
      );
      expect(
        await prisma.goal.findMany({
          where: { ownerId },
          include: { checkIns: true },
          orderBy: { id: 'asc' },
        }),
      ).toEqual(goals);
    } finally {
      provider.mockRestore();
    }
  });
  it('exports a working development mock through the provider seam without persistence', async () => {
    const service = app.get(AiSummaryService);
    const before = await prisma.aISummary.count({ where: { userId: ownerId } });
    const result = await service.generateDevelopmentSummary(ownerId);
    expect(result).toMatchObject({
      provider: 'mock',
      model: 'development-mock',
    });
    expect(result.content).toContain('Development mock only');
    expect(result.content).toContain('70%');
    expect(result.content).not.toContain('PRIVATE_');
    expect(result).toEqual(await service.generateDevelopmentSummary(ownerId));
    expect(await prisma.aISummary.count({ where: { userId: ownerId } })).toBe(
      before,
    );
  });
  it('migrates AISummary scaffold with defaults, enum, JSONB, UTC and owner FK', async () => {
    const context = (await preview().expect(200)).body
      .context as Prisma.InputJsonObject;
    const data = {
      userId: ownerId,
      periodStart: new Date('2026-09-16T12:00:00Z'),
      periodEnd: new Date('2026-10-14T12:00:00Z'),
      inputSnapshot: context,
    };
    const row = await prisma.aISummary.create({ data });
    expect(row.status).toBe('PENDING');
    expect(row.content).toBeNull();
    expect(row.provider).toBeNull();
    expect(row.model).toBeNull();
    expect(row.inputSnapshot).toEqual(context);
    expect(row.periodEnd.toISOString()).toBe('2026-10-14T12:00:00.000Z');
    await expect(
      prisma.aISummary.create({ data: { ...data, userId: randomUUID() } }),
    ).rejects.toThrow();
    await expect(
      prisma.aISummary.create({
        data: { ...data, periodStart: new Date('2026-10-15T12:00:00Z') },
      }),
    ).rejects.toThrow();
    const indexes = await prisma.$queryRaw<
      { indexname: string }[]
    >`SELECT indexname FROM pg_indexes WHERE tablename='AISummary'`;
    expect(indexes.map((index) => index.indexname)).toEqual(
      expect.arrayContaining([
        'AISummary_userId_idx',
        'AISummary_userId_createdAt_idx',
      ]),
    );
    await prisma.aISummary.delete({ where: { id: row.id } });
  });
  it('publishes only technical preview API with Swagger shape and security, no generation endpoint', async () => {
    const document = (
      await request(app.getHttpServer()).get('/api/docs-json').expect(200)
    ).body;
    expect(
      Object.keys(document.paths).filter((p) => p.startsWith('/api/v1/ai/')),
    ).toEqual([path]);
    expect(document.paths[path].get.security).toEqual([{ bearer: [] }]);
    expect(
      document.components.schemas.AiPreviewResponse.properties
        .providerConfigured.enum,
    ).toEqual([false]);
    expect(document.paths[path].get.summary).toContain('sin IA real');
    await request(app.getHttpServer())
      .post('/api/v1/ai/summary')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(404);
  });
});
