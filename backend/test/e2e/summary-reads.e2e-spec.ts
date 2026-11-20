import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/bootstrap';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Pre-IA summary read seam / synthetic PostgreSQL fixtures only', () => {
  let app: INestApplication, db: PrismaService, relation: string;
  const users: string[] = [],
    tokens: string[] = [],
    summaries: string[] = [];
  const emails = ['a', 'b', 'c'].map(
    (x) => `summary-${x}-${randomUUID()}@example.com`,
  );
  const http = () => request(app.getHttpServer());
  const header = (i = 0) => ({ Authorization: `Bearer ${tokens[i]}` });
  const ownerPath = '/api/v1/ai/summaries';
  const shared = () => `/api/v1/support-network/owners/${users[0]}/summaries`;
  beforeAll(async () => {
    if (process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL)
      throw new Error('Separate test DB required');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    configureApp(app);
    await app.init();
    db = app.get(PrismaService);
    for (const email of emails) {
      const user = await http()
        .post('/api/v1/auth/register')
        .send({
          email,
          displayName: 'Synthetic fixture',
          password: 'synthetic-test-only-2026',
        })
        .expect(201);
      users.push(user.body.id);
      const login = await http()
        .post('/api/v1/auth/login')
        .send({ email, password: 'synthetic-test-only-2026' })
        .expect(200);
      tokens.push(login.body.accessToken);
    }
    for (const status of ['COMPLETED', 'PENDING', 'FAILED'] as const) {
      const row = await db.aISummary.create({
        data: {
          userId: users[0],
          periodStart: new Date('2026-10-01Z'),
          periodEnd: new Date('2026-10-29Z'),
          inputSnapshot: { notes: 'PRIVATE_SNAPSHOT' },
          provider: 'TEST_PROVIDER',
          model: 'TEST_MODEL',
          status,
          content:
            status === 'COMPLETED'
              ? 'SYNTHETIC TEST FIXTURE — not real AI'
              : null,
        },
      });
      summaries.push(row.id);
    }
    relation = (
      await http()
        .post('/api/v1/support-network/relationships')
        .set(header())
        .send({
          supporterEmail: emails[1],
          canViewGoals: true,
          canViewProgress: false,
          canViewSummaries: true,
        })
        .expect(201)
    ).body.id;
  });
  afterAll(async () => {
    if (db) await db.user.deleteMany({ where: { email: { in: emails } } });
    if (app) await app.close();
  });
  it('requires JWT for owner, delegated reads and unavailable generation', async () => {
    await http().get(ownerPath).expect(401);
    await http().get(shared()).expect(401);
    await http().post(ownerPath).send({}).expect(401);
  });
  it('owner sees their lifecycle history with a strict projection and isolated detail', async () => {
    const list = (await http().get(ownerPath).set(header()).expect(200)).body;
    expect(list).toHaveLength(3);
    for (const row of list)
      expect(Object.keys(row).sort()).toEqual(
        [
          'id',
          'periodStart',
          'periodEnd',
          'content',
          'status',
          'createdAt',
        ].sort(),
      );
    expect(JSON.stringify(list)).not.toMatch(
      /PRIVATE_SNAPSHOT|TEST_PROVIDER|TEST_MODEL|userId|inputSnapshot/,
    );
    await http().get(`${ownerPath}/${summaries[0]}`).set(header()).expect(200);
    await http().get(`${ownerPath}/${summaries[0]}`).set(header(1)).expect(404);
    expect(
      (
        await http()
          .get(`${ownerPath}?userId=${users[0]}`)
          .set(header(2))
          .expect(200)
      ).body,
    ).toEqual([]);
  });
  it('delegates only COMPLETED and hides pending/failed, snapshots and strangers', async () => {
    const list = (await http().get(shared()).set(header(1)).expect(200)).body;
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(summaries[0]);
    expect(JSON.stringify(list)).not.toMatch(
      /PRIVATE_SNAPSHOT|TEST_PROVIDER|TEST_MODEL|inputSnapshot|userId/,
    );
    await http().get(`${shared()}/${summaries[0]}`).set(header(1)).expect(200);
    for (const id of summaries.slice(1))
      await http().get(`${shared()}/${id}`).set(header(1)).expect(404);
    await http().get(shared()).set(header(2)).expect(404);
    await http().get(`${shared()}/${summaries[0]}`).set(header(2)).expect(404);
  });
  it('permission removal, expiry and revocation deny list and deep link on the next request', async () => {
    for (const data of [
      { canViewSummaries: false },
      { canViewSummaries: true, expiresAt: new Date(0) },
      { expiresAt: null, revokedAt: new Date() },
    ]) {
      await db.supportRelationship.update({ where: { id: relation }, data });
      await http().get(shared()).set(header(1)).expect(404);
      await http()
        .get(`${shared()}/${summaries[0]}`)
        .set(header(1))
        .expect(404);
    }
    await http()
      .post(`/api/v1/support-network/relationships/${relation}/reactivate`)
      .set(header())
      .send({
        canViewGoals: true,
        canViewProgress: false,
        canViewSummaries: true,
        expiresAt: null,
      })
      .expect(200);
    expect(
      (await http().get(shared()).set(header(1)).expect(200)).body,
    ).toHaveLength(1);
  });
  it('generation is unavailable without inserting a pending row', async () => {
    const before = await db.aISummary.count({ where: { userId: users[0] } });
    await http().post(ownerPath).set(header()).send({}).expect(503);
    expect(await db.aISummary.count({ where: { userId: users[0] } })).toBe(
      before,
    );
  });
});
