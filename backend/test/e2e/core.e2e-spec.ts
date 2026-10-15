import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/bootstrap';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('MVP-0 / real PostgreSQL', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tokenA: string;
  let tokenB: string;
  let goalId: string;
  let otherGoalId: string;
  let firstId: string;
  let secondId: string;
  const suffix = randomUUID();
  const emailA = `e2e-a-${suffix}@example.com`;
  const emailB = `e2e-b-${suffix}@example.com`;
  const password = 'test-only-password-82';
  const checkIn = {
    progress: 25,
    difficulty: 2,
    completion: 'PARTIAL',
    notes: 'Private owner note',
  };
  const api = '/api/v1';
  const asA = () => ({ Authorization: `Bearer ${tokenA}` });
  const asB = () => ({ Authorization: `Bearer ${tokenB}` });

  beforeAll(async () => {
    if (
      !process.env.TEST_DATABASE_URL ||
      process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL
    )
      throw new Error('Use npm run test:e2e with a separate *_test database');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });
  afterAll(async () => {
    if (prisma)
      await prisma.user.deleteMany({
        where: { email: { in: [emailA, emailB] } },
      });
    if (app) await app.close();
  });
  it('health and database readiness are public', async () => {
    await request(app.getHttpServer())
      .get(`${api}/health`)
      .expect(200, { status: 'ok' });
    await request(app.getHttpServer())
      .get(`${api}/health/ready`)
      .expect(200, { status: 'ok', database: 'reachable' });
  });
  it('documents actual routes and DTOs in OpenAPI', async () => {
    const result = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);
    expect(result.body.paths[`${api}/goals/{goalId}/check-ins`]).toBeDefined();
    expect(
      result.body.components.schemas.CreateCheckInDto.properties.progress
        .maximum,
    ).toBe(100);
  });
  it('protects business endpoints and rejects malformed tokens', async () => {
    await request(app.getHttpServer()).get(`${api}/goals`).expect(401);
    await request(app.getHttpServer())
      .get(`${api}/users/me`)
      .set('Authorization', 'Bearer bad-token')
      .expect(401);
  });
  it('registers normalized safe users with Argon2id hashes', async () => {
    const a = await request(app.getHttpServer())
      .post(`${api}/auth/register`)
      .send({
        email: ` ${emailA.toUpperCase()} `,
        password,
        displayName: ' Persona A ',
      })
      .expect(201);
    expect(a.body).toMatchObject({ email: emailA, displayName: 'Persona A' });
    expect(a.body.passwordHash).toBeUndefined();
    const stored = await prisma.user.findUniqueOrThrow({
      where: { email: emailA },
    });
    expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    await request(app.getHttpServer())
      .post(`${api}/auth/register`)
      .send({ email: emailB, password, displayName: 'Persona B' })
      .expect(201);
  });
  it('rejects duplicate email and invalid registration', async () => {
    await request(app.getHttpServer())
      .post(`${api}/auth/register`)
      .send({ email: emailA.toUpperCase(), password, displayName: 'Duplicate' })
      .expect(409);
    const error = await request(app.getHttpServer())
      .post(`${api}/auth/register`)
      .send({ email: 'bad', password: 'short', displayName: ' ' })
      .expect(400);
    expect(error.body).toMatchObject({
      code: 'VALIDATION_ERROR',
      path: `${api}/auth/register`,
    });
    expect(error.body.timestamp).toBeDefined();
  });
  it('rejects invalid login without disclosing which credential failed', async () => {
    const a = await request(app.getHttpServer())
      .post(`${api}/auth/login`)
      .send({ email: emailA, password: 'incorrect-password' })
      .expect(401);
    const b = await request(app.getHttpServer())
      .post(`${api}/auth/login`)
      .send({ email: `absent-${suffix}@example.com`, password })
      .expect(401);
    expect(a.body.message).toEqual(b.body.message);
  });
  it('logs in both users and restores identity', async () => {
    const a = await request(app.getHttpServer())
      .post(`${api}/auth/login`)
      .send({ email: ` ${emailA.toUpperCase()} `, password })
      .expect(200);
    const b = await request(app.getHttpServer())
      .post(`${api}/auth/login`)
      .send({ email: emailB, password })
      .expect(200);
    tokenA = a.body.accessToken;
    tokenB = b.body.accessToken;
    const me = await request(app.getHttpServer())
      .get(`${api}/auth/me`)
      .set(asA())
      .expect(200);
    expect(me.body.email).toBe(emailA);
    expect(me.body.passwordHash).toBeUndefined();
    const payload = app.get(JwtService).decode(tokenA);
    expect(Object.keys(payload).sort()).toEqual(['exp', 'iat', 'sub']);
    const expired = await new JwtService({
      secret: app.get(ConfigService).getOrThrow('JWT_SECRET'),
    }).signAsync({ sub: me.body.id }, { expiresIn: -1 });
    await request(app.getHttpServer())
      .get(`${api}/auth/me`)
      .set('Authorization', `Bearer ${expired}`)
      .expect(401);
  });
  it('reads/updates profile and prevents mass assignment', async () => {
    await request(app.getHttpServer())
      .get(`${api}/users/me`)
      .set(asA())
      .expect(200);
    const result = await request(app.getHttpServer())
      .patch(`${api}/users/me`)
      .set(asA())
      .send({ displayName: 'Nuevo nombre' })
      .expect(200);
    expect(result.body.displayName).toBe('Nuevo nombre');
    expect(result.body.passwordHash).toBeUndefined();
    await request(app.getHttpServer())
      .patch(`${api}/users/me`)
      .set(asA())
      .send({ email: emailB })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`${api}/users/me`)
      .set(asA())
      .send({ displayName: null })
      .expect(400);
  });
  it('creates goals with backend defaults and all optional metadata', async () => {
    const a = await request(app.getHttpServer())
      .post(`${api}/goals`)
      .set(asA())
      .send({
        title: 'Objetivo A',
        description: 'Descripción',
        category: 'Personal',
        targetDate: '2026-11-01T00:00:00.000Z',
      })
      .expect(201);
    goalId = a.body.id;
    expect(a.body).toMatchObject({
      status: 'ACTIVE',
      progress: 0,
      title: 'Objetivo A',
    });
    const b = await request(app.getHttpServer())
      .post(`${api}/goals`)
      .set(asB())
      .send({ title: 'Objetivo B' })
      .expect(201);
    otherGoalId = b.body.id;
  });
  it.each([
    { progress: 50 },
    { ownerId: randomUUID() },
    { status: 'COMPLETED' },
  ])('rejects protected create fields %j', async (fields) => {
    await request(app.getHttpServer())
      .post(`${api}/goals`)
      .set(asA())
      .send({ title: 'Invalid', ...fields })
      .expect(400);
  });
  it('lists only owned goals', async () => {
    const result = await request(app.getHttpServer())
      .get(`${api}/goals`)
      .set(asB())
      .expect(200);
    expect(result.body.map((goal: { id: string }) => goal.id)).toEqual([
      otherGoalId,
    ]);
  });
  it('isolates all goal operations with 404', async () => {
    await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asB())
      .send({ title: 'Intrusion' })
      .expect(404);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .post(`${api}/goals/${goalId}/check-ins`)
      .set(asB())
      .send(checkIn)
      .expect(404);
    await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}/check-ins`)
      .set(asB())
      .expect(404);
  });
  it.each([-1, 101, 50])(
    'rejects direct snapshot patch (%s)',
    async (progress) => {
      await request(app.getHttpServer())
        .patch(`${api}/goals/${goalId}`)
        .set(asA())
        .send({ progress })
        .expect(400);
    },
  );
  it('updates metadata and clears nullable fields', async () => {
    const result = await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({
        title: 'Objetivo actualizado',
        description: null,
        category: null,
        targetDate: null,
      })
      .expect(200);
    expect(result.body).toMatchObject({
      title: 'Objetivo actualizado',
      description: null,
      category: null,
      targetDate: null,
    });
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ title: null })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ status: null })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ targetDate: '2026-02-30' })
      .expect(400);
  });
  it.each([
    { progress: -1 },
    { progress: 101 },
    { progress: 1.2 },
    { difficulty: 0 },
    { difficulty: 6 },
    { difficulty: 2.5 },
    { completion: 'INVALID' },
    { createdAt: new Date().toISOString() },
    { ownerId: randomUUID() },
    { goalId: randomUUID() },
  ])('rejects invalid CheckIn %j', async (fields) => {
    await request(app.getHttpServer())
      .post(`${api}/goals/${goalId}/check-ins`)
      .set(asA())
      .send({ ...checkIn, ...fields })
      .expect(400);
  });
  it('creates multiple records per day and atomically updates snapshot', async () => {
    const a = await request(app.getHttpServer())
      .post(`${api}/goals/${goalId}/check-ins`)
      .set(asA())
      .send(checkIn)
      .expect(201);
    firstId = a.body.id;
    const b = await request(app.getHttpServer())
      .post(`${api}/goals/${goalId}/check-ins`)
      .set(asA())
      .send({ ...checkIn, progress: 100, difficulty: 5, completion: 'MET' })
      .expect(201);
    secondId = b.body.id;
    const goal = await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}`)
      .set(asA())
      .expect(200);
    expect(goal.body).toMatchObject({ progress: 100, status: 'ACTIVE' });
    const history = await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}/check-ins`)
      .set(asA())
      .expect(200);
    expect(history.body.map((item: { id: string }) => item.id)).toEqual([
      secondId,
      firstId,
    ]);
    expect(history.body[0].notes).toBe(checkIn.notes);
  });
  it('binds historical detail/deletion to owner AND goal', async () => {
    await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}/check-ins/${firstId}`)
      .set(asA())
      .expect(200);
    await request(app.getHttpServer())
      .get(`${api}/goals/${goalId}/check-ins/${firstId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}/check-ins/${firstId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .get(`${api}/goals/${otherGoalId}/check-ins/${firstId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${otherGoalId}/check-ins/${firstId}`)
      .set(asB())
      .expect(404);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}/check-ins/${firstId}`)
      .set(asA())
      .send({ progress: 50 })
      .expect(404);
  });
  it('enforces lifecycle and retains progress when completed below 100', async () => {
    for (const status of ['PAUSED', 'COMPLETED']) {
      if (status === 'COMPLETED') {
        await request(app.getHttpServer())
          .patch(`${api}/goals/${goalId}`)
          .set(asA())
          .send({ status: 'COMPLETED' })
          .expect(409);
        await request(app.getHttpServer())
          .post(`${api}/goals/${goalId}/reactivate`)
          .set(asA())
          .expect(200);
      }
      await request(app.getHttpServer())
        .patch(`${api}/goals/${goalId}`)
        .set(asA())
        .send({ status })
        .expect(200);
      await request(app.getHttpServer())
        .post(`${api}/goals/${goalId}/check-ins`)
        .set(asA())
        .send(checkIn)
        .expect(409);
    }
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ status: 'PAUSED' })
      .expect(409);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ status: 'ACTIVE' })
      .expect(200);
    await request(app.getHttpServer())
      .post(`${api}/goals/${goalId}/check-ins`)
      .set(asA())
      .send({ ...checkIn, progress: 70 })
      .expect(201);
    const completed = await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ status: 'COMPLETED' })
      .expect(200);
    expect(completed.body.progress).toBe(70);
    await request(app.getHttpServer())
      .patch(`${api}/goals/${goalId}`)
      .set(asA())
      .send({ status: 'ACTIVE' })
      .expect(200);
  });
  it('restores snapshot after voiding newest, older and final records', async () => {
    let history = await prisma.checkIn.findMany({
      where: { goalId, voidedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}/check-ins/${history[0].id}`)
      .set(asA())
      .expect(204);
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).progress,
    ).toBe(100);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}/check-ins/${firstId}`)
      .set(asA())
      .expect(204);
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).progress,
    ).toBe(100);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}/check-ins/${secondId}`)
      .set(asA())
      .expect(204);
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).progress,
    ).toBe(0);
    history = await prisma.checkIn.findMany({
      where: { goalId, voidedAt: null },
    });
    for (const item of history)
      await request(app.getHttpServer())
        .post(`${api}/goals/${goalId}/check-ins/${item.id}/void`)
        .set(asA())
        .expect(204);
    expect(
      await prisma.checkIn.count({ where: { goalId, voidedAt: null } }),
    ).toBe(0);
    expect(await prisma.checkIn.count({ where: { goalId } })).toBeGreaterThan(
      0,
    );
  });
  it('serializes concurrent CheckIns and lifecycle changes', async () => {
    await Promise.all(
      [10, 30, 20, 45, 15].map((progress) =>
        request(app.getHttpServer())
          .post(`${api}/goals/${goalId}/check-ins`)
          .set(asA())
          .send({ ...checkIn, progress })
          .expect(201),
      ),
    );
    const history = await prisma.checkIn.findMany({
      where: { goalId, voidedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(new Set(history.map((item) => item.createdAt.getTime())).size).toBe(
      5,
    );
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).progress,
    ).toBe(history[0].progress);
    const results = await Promise.all([
      request(app.getHttpServer())
        .patch(`${api}/goals/${goalId}`)
        .set(asA())
        .send({ status: 'PAUSED' }),
      request(app.getHttpServer())
        .post(`${api}/goals/${goalId}/check-ins`)
        .set(asA())
        .send({ ...checkIn, progress: 99 }),
    ]);
    expect(results[0].status).toBe(200);
    expect([201, 409]).toContain(results[1].status);
    const latest = await prisma.checkIn.findFirstOrThrow({
      where: { goalId, voidedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).progress,
    ).toBe(latest.progress);
  });
  it('enforces SQL constraints independently of DTOs', async () => {
    await expect(
      prisma.goal.update({ where: { id: goalId }, data: { progress: -1 } }),
    ).rejects.toThrow();
    await expect(
      prisma.checkIn.create({
        data: { goalId, progress: 101, difficulty: 2, completion: 'MET' },
      }),
    ).rejects.toThrow();
    await expect(
      prisma.checkIn.create({
        data: { goalId, progress: 50, difficulty: 0, completion: 'MET' },
      }),
    ).rejects.toThrow();
  });
  it('validates IDs and preserves cancelled history without affecting the other owner', async () => {
    await request(app.getHttpServer())
      .get(`${api}/goals/not-a-uuid`)
      .set(asA())
      .expect(400);
    await request(app.getHttpServer())
      .get(`${api}/goals/${randomUUID()}`)
      .set(asA())
      .expect(404);
    await request(app.getHttpServer())
      .delete(`${api}/goals/${goalId}`)
      .set(asA())
      .expect(204);
    expect(await prisma.checkIn.count({ where: { goalId } })).toBeGreaterThan(
      0,
    );
    expect(
      (await prisma.goal.findUniqueOrThrow({ where: { id: goalId } })).status,
    ).toBe('CANCELLED');
    await request(app.getHttpServer())
      .get(`${api}/goals/${otherGoalId}`)
      .set(asB())
      .expect(200);
  });
});
