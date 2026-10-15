import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/bootstrap';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ADR-008 / real PostgreSQL owner-supporter history', () => {
  let app: INestApplication, db: PrismaService;
  const suffix = randomUUID();
  const emails = ['a', 'b', 'c'].map(
    (x) => `support-${x}-${suffix}@example.com`,
  );
  const tokens: string[] = [],
    users: string[] = [];
  let goal: string,
    cancelled: string,
    first: string,
    last: string,
    relation: string;
  const permissions = {
    canViewGoals: true,
    canViewProgress: false,
    canViewSummaries: false,
  };
  const check = {
    progress: 40,
    difficulty: 2,
    completion: 'PARTIAL',
    notes: 'OWNER-ONLY-NOTE-PRIVATE',
  };
  const header = (i = 0) => ({ Authorization: `Bearer ${tokens[i]}` });
  const http = () => request(app.getHttpServer());
  const api = '/api/v1';
  const shared = () => `${api}/support-network/owners/${users[0]}`;
  const relationship = () => `${api}/support-network/relationships/${relation}`;
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
      const u = await http()
        .post(`${api}/auth/register`)
        .send({
          email,
          displayName: 'Synthetic test person',
          password: 'Support-only-test-827!',
        })
        .expect(201);
      users.push(u.body.id);
      const login = await http()
        .post(`${api}/auth/login`)
        .send({ email, password: 'Support-only-test-827!' })
        .expect(200);
      tokens.push(login.body.accessToken);
    }
  });
  afterAll(async () => {
    if (db) await db.user.deleteMany({ where: { email: { in: emails } } });
    if (app) await app.close();
  });
  it('creates goals, effective CheckIns and persistent cancellation', async () => {
    goal = (
      await http()
        .post(`${api}/goals`)
        .set(header())
        .send({ title: 'Active owner goal' })
        .expect(201)
    ).body.id;
    cancelled = (
      await http()
        .post(`${api}/goals`)
        .set(header())
        .send({ title: 'Historical cancelled goal' })
        .expect(201)
    ).body.id;
    first = (
      await http()
        .post(`${api}/goals/${goal}/check-ins`)
        .set(header())
        .send(check)
        .expect(201)
    ).body.id;
    last = (
      await http()
        .post(`${api}/goals/${goal}/check-ins`)
        .set(header())
        .send({ ...check, progress: 70 })
        .expect(201)
    ).body.id;
    await http()
      .post(`${api}/goals/${cancelled}/check-ins`)
      .set(header())
      .send(check)
      .expect(201);
    await http()
      .post(`${api}/goals/${cancelled}/cancel`)
      .set(header())
      .expect(200);
    expect(
      await db.goal.findUnique({ where: { id: cancelled } }),
    ).toMatchObject({ status: 'CANCELLED', progress: 40 });
    expect(await db.checkIn.count({ where: { goalId: cancelled } })).toBe(1);
    await http()
      .post(`${api}/goals/${cancelled}/check-ins`)
      .set(header())
      .send(check)
      .expect(409);
    const overview = (
      await http().get(`${api}/analytics/overview`).set(header()).expect(200)
    ).body;
    expect(overview).toMatchObject({
      totalGoals: 2,
      cancelledGoals: 1,
      inactiveGoals: 0,
      completionRate: 0,
    });
    await http()
      .post(`${api}/goals/${cancelled}/reactivate`)
      .set(header())
      .expect(200);
    await http()
      .post(`${api}/goals/${cancelled}/cancel`)
      .set(header())
      .expect(200);
  });
  it('voids 70 without deleting history, restores 40 and excludes voided from analytics/history', async () => {
    await http()
      .post(`${api}/goals/${goal}/check-ins/${last}/void`)
      .set(header())
      .expect(204);
    expect(await db.checkIn.findUnique({ where: { id: last } })).toMatchObject({
      progress: 70,
      notes: check.notes,
      voidedAt: expect.any(Date),
    });
    expect(
      (await db.goal.findUniqueOrThrow({ where: { id: goal } })).progress,
    ).toBe(40);
    const voidEvent = await db.auditEvent.findFirstOrThrow({
      where: { entityId: last, action: 'CHECKIN_VOIDED' },
    });
    expect(voidEvent.payload).toEqual({
      goalId: goal,
      goalTitle: 'Active owner goal',
      voidedProgress: 70,
      resultingGoalProgress: 40,
    });
    const analytics = (
      await http()
        .get(`${api}/analytics/goals/${goal}`)
        .set(header())
        .expect(200)
    ).body;
    expect(analytics).toMatchObject({
      currentProgress: 40,
      totalCheckIns: 1,
      previousProgress: null,
    });
    expect(
      analytics.timeline.map((x: { progress: number }) => x.progress),
    ).toEqual([40]);
    expect(
      (
        await http()
          .get(`${api}/goals/${goal}/check-ins`)
          .set(header())
          .expect(200)
      ).body.map((x: { id: string }) => x.id),
    ).toEqual([first]);
    await http()
      .post(`${api}/goals/${goal}/check-ins/${last}/void`)
      .set(header())
      .expect(404);
    expect(
      await db.auditEvent.count({
        where: { entityId: last, action: 'CHECKIN_VOIDED' },
      }),
    ).toBe(1);
  });
  it.each([
    { canViewGoals: false, canViewProgress: true, canViewSummaries: false },
    { canViewGoals: false, canViewProgress: false, canViewSummaries: true },
    { canViewGoals: false, canViewProgress: false, canViewSummaries: false },
  ])('rejects invalid permission combination %j', async (p) => {
    await http()
      .post(`${api}/support-network/relationships`)
      .set(header())
      .send({ supporterEmail: emails[1], ...p })
      .expect(400);
  });
  it('rejects self, unknown account and mass assignment; creates unique relationship by exact normalized email', async () => {
    await http()
      .post(`${api}/support-network/relationships`)
      .set(header())
      .send({ supporterEmail: emails[0], ...permissions })
      .expect(400);
    await http()
      .post(`${api}/support-network/relationships`)
      .set(header())
      .send({ supporterEmail: `absent-${suffix}@example.com`, ...permissions })
      .expect(404);
    await http()
      .post(`${api}/support-network/relationships`)
      .set(header())
      .send({ supporterEmail: emails[1], ...permissions, ownerId: users[2] })
      .expect(400);
    relation = (
      await http()
        .post(`${api}/support-network/relationships`)
        .set(header())
        .send({
          supporterEmail: ` ${emails[1].toUpperCase()} `,
          ...permissions,
        })
        .expect(201)
    ).body.id;
    await http()
      .post(`${api}/support-network/relationships`)
      .set(header())
      .send({ supporterEmail: emails[1], ...permissions })
      .expect(409);
    expect(
      (
        await http()
          .get(`${api}/support-network/relationships`)
          .set(header())
          .expect(200)
      ).body,
    ).toHaveLength(1);
    await http().get(relationship()).set(header(1)).expect(404);
    const owners = (
      await http()
        .get(`${api}/support-network/owners`)
        .set(header(1))
        .expect(200)
    ).body;
    expect(owners).toHaveLength(1);
    expect(owners[0].owner.id).toBe(users[0]);
    expect(JSON.stringify(owners)).not.toMatch(/passwordHash|email|notes/);
  });
  it('B sees active and cancelled snapshot goals, no detail progress or summaries; C sees nothing', async () => {
    const list = (
      await http().get(`${shared()}/goals`).set(header(1)).expect(200)
    ).body;
    expect(list.map((x: { status: string }) => x.status).sort()).toEqual([
      'ACTIVE',
      'CANCELLED',
    ]);
    expect(list.find((x: { id: string }) => x.id === goal).progress).toBe(40);
    expect(JSON.stringify(list)).not.toMatch(
      /notes|OWNER-ONLY|passwordHash|checkIns/,
    );
    await http()
      .get(`${shared()}/goals/${cancelled}`)
      .set(header(1))
      .expect(200);
    await http()
      .get(`${shared()}/goals/${goal}/progress`)
      .set(header(1))
      .expect(404);
    await http().get(`${shared()}/summaries`).set(header(1)).expect(404);
    for (const path of [
      `${shared()}/goals`,
      `${shared()}/goals/${goal}`,
      `${shared()}/goals/${goal}/progress`,
      `${shared()}/summaries`,
    ])
      await http().get(path).set(header(2)).expect(404);
  });
  it('VIEW_GOALS exposes all four lifecycle states without detailed progress', async () => {
    for (const status of ['PAUSED', 'COMPLETED']) {
      const created = await http()
        .post(`${api}/goals`)
        .set(header())
        .send({ title: `Shared ${status} fixture` })
        .expect(201);
      await http()
        .patch(`${api}/goals/${created.body.id}`)
        .set(header())
        .send({ status })
        .expect(200);
      const detail = await http()
        .get(`${shared()}/goals/${created.body.id}`)
        .set(header(1))
        .expect(200);
      expect(detail.body.status).toBe(status);
      expect(Object.keys(detail.body).sort()).toEqual(
        [
          'id',
          'title',
          'description',
          'category',
          'status',
          'progress',
          'targetDate',
        ].sort(),
      );
      await http()
        .get(`${shared()}/goals/${created.body.id}/progress`)
        .set(header(1))
        .expect(404);
    }
    const list = (
      await http().get(`${shared()}/goals`).set(header(1)).expect(200)
    ).body;
    expect(list.map((g: { status: string }) => g.status).sort()).toEqual([
      'ACTIVE',
      'CANCELLED',
      'COMPLETED',
      'PAUSED',
    ]);
  });
  it('updates permission dependencies and grants real effective timeline without notes', async () => {
    await http()
      .patch(relationship())
      .set(header())
      .send({ canViewGoals: false })
      .expect(400);
    await http()
      .patch(relationship())
      .set(header())
      .send({ canViewProgress: null })
      .expect(400);
    await http()
      .patch(relationship())
      .set(header())
      .send({ canViewProgress: true, canViewSummaries: true })
      .expect(200);
    const progress = (
      await http()
        .get(`${shared()}/goals/${goal}/progress`)
        .set(header(1))
        .expect(200)
    ).body;
    expect(progress.timeline).toEqual([
      {
        date: expect.any(String),
        progress: 40,
        difficulty: 2,
        completion: 'PARTIAL',
      },
    ]);
    expect(JSON.stringify(progress)).not.toMatch(
      /notes|OWNER-ONLY|voided|passwordHash/,
    );
    await http()
      .get(`${shared()}/goals/${randomUUID()}/progress`)
      .set(header(1))
      .expect(404);
    expect(
      (await http().get(`${shared()}/summaries`).set(header(1)).expect(200))
        .body,
    ).toEqual([]);
    await http()
      .patch(relationship())
      .set(header())
      .send({ canViewProgress: false })
      .expect(200);
    await http()
      .get(`${shared()}/goals/${goal}/progress`)
      .set(header(1))
      .expect(404);
    await http()
      .patch(relationship())
      .set(header())
      .send({ canViewProgress: true })
      .expect(200);
  });
  it('keeps delegated snapshot and effective timeline consistent during concurrent CheckIns', async () => {
    const id = (
      await http()
        .post(`${api}/goals`)
        .set(header())
        .send({ title: 'Concurrent shared goal' })
        .expect(201)
    ).body.id as string;
    await http()
      .post(`${api}/goals/${id}/check-ins`)
      .set(header())
      .send({ ...check, progress: 10 })
      .expect(201);
    for (const progress of [30, 50, 60]) {
      const [, read] = await Promise.all([
        http()
          .post(`${api}/goals/${id}/check-ins`)
          .set(header())
          .send({ ...check, progress })
          .expect(201),
        http()
          .get(`${shared()}/goals/${id}/progress`)
          .set(header(1))
          .expect(200),
      ]);
      expect(read.body.currentProgress).toBe(
        read.body.timeline.at(-1).progress,
      );
      expect(JSON.stringify(read.body)).not.toContain(check.notes);
    }
  });
  it('B cannot write through owner or delegated routes and cannot read owner audit', async () => {
    for (const action of ['cancel', 'reactivate'])
      await http()
        .post(`${api}/goals/${goal}/${action}`)
        .set(header(1))
        .expect(404);
    await http()
      .patch(`${api}/goals/${goal}`)
      .set(header(1))
      .send({ title: 'attack' })
      .expect(404);
    await http()
      .post(`${api}/goals/${goal}/check-ins`)
      .set(header(1))
      .send(check)
      .expect(404);
    await http()
      .post(`${api}/goals/${goal}/check-ins/${first}/void`)
      .set(header(1))
      .expect(404);
    await http().post(`${relationship()}/revoke`).set(header(1)).expect(404);
    await http()
      .patch(relationship())
      .set(header(1))
      .send({ canViewProgress: false })
      .expect(404);
    await http()
      .post(`${shared()}/goals`)
      .set(header(1))
      .send({ title: 'attack' })
      .expect(404);
    await http().get(`${shared()}/audit-events`).set(header(1)).expect(404);
    await http()
      .get(`${api}/audit-events?ownerId=${users[0]}`)
      .set(header(1))
      .expect(400);
    const audit = (
      await http().get(`${api}/audit-events`).set(header(1)).expect(200)
    ).body;
    expect(
      audit.items.every((x: { ownerId: string }) => x.ownerId === users[1]),
    ).toBe(true);
    expect(audit.items).toHaveLength(1); // B's own registration only.
  });
  it('expires per request, revokes persistently and reactivates the same logical row', async () => {
    await http()
      .patch(relationship())
      .set(header())
      .send({ expiresAt: '2000-01-01T00:00:00Z' })
      .expect(200);
    for (const route of [
      '/goals',
      `/goals/${goal}`,
      `/goals/${goal}/progress`,
      '/summaries',
    ])
      await http()
        .get(shared() + route)
        .set(header(1))
        .expect(404);
    expect(
      (
        await http()
          .get(`${api}/support-network/owners`)
          .set(header(1))
          .expect(200)
      ).body,
    ).toEqual([]);
    await http()
      .post(`${relationship()}/reactivate`)
      .set(header())
      .send({ ...permissions, canViewProgress: true, expiresAt: null })
      .expect(200);
    await http().get(`${shared()}/goals`).set(header(1)).expect(200);
    await http().post(`${relationship()}/revoke`).set(header()).expect(200);
    expect(
      (
        await db.supportRelationship.findUniqueOrThrow({
          where: { id: relation },
        })
      ).revokedAt,
    ).toBeInstanceOf(Date);
    await http().get(`${shared()}/goals`).set(header(1)).expect(404);
    await http()
      .post(`${relationship()}/reactivate`)
      .set(header())
      .send({ ...permissions, expiresAt: null })
      .expect(200);
    expect(
      await db.supportRelationship.count({
        where: { ownerId: users[0], supporterId: users[1] },
      }),
    ).toBe(1);
    await http().get(`${shared()}/goals`).set(header(1)).expect(200);
    await http()
      .get(`${shared()}/goals/${goal}/progress`)
      .set(header(1))
      .expect(404);
    await http().get(`${shared()}/summaries`).set(header(1)).expect(404);
  });
  it('keeps AI Preview private, explicit CANCELLED and providerConfigured=false', async () => {
    const preview = (
      await http().get(`${api}/ai/summary/context`).set(header()).expect(200)
    ).body;
    expect(preview.providerConfigured).toBe(false);
    expect(preview.context.cancelledGoals).toBe(1);
    expect(
      preview.context.goals.some(
        (g: { status: string }) => g.status === 'CANCELLED',
      ),
    ).toBe(true);
    expect(preview.prompt).toContain('Cancelar no implica fracaso');
    expect(JSON.stringify(preview.context)).not.toMatch(
      /notes|OWNER-ONLY|password|supporter|email/,
    );
  });
  it('audits critical actions exactly once per transition, owner/actor/UTC, pagination and no secrets', async () => {
    await http()
      .patch(`${api}/users/me`)
      .set(header())
      .send({ displayName: 'Updated owner' })
      .expect(200);
    await http()
      .patch(`${api}/goals/${goal}`)
      .set(header())
      .send({ title: 'Updated title' })
      .expect(200);
    await http()
      .patch(`${api}/goals/${goal}`)
      .set(header())
      .send({ status: 'PAUSED' })
      .expect(200);
    await http()
      .patch(`${api}/goals/${goal}`)
      .set(header())
      .send({ status: 'COMPLETED' })
      .expect(409);
    const result = (
      await http()
        .get(`${api}/audit-events?limit=100`)
        .set(header())
        .expect(200)
    ).body;
    const actions = result.items.map((e: { action: string }) => e.action);
    for (const action of [
      'ACCOUNT_REGISTERED',
      'PROFILE_UPDATED',
      'GOAL_CREATED',
      'GOAL_UPDATED',
      'GOAL_STATUS_CHANGED',
      'GOAL_CANCELLED',
      'GOAL_REACTIVATED',
      'CHECKIN_CREATED',
      'CHECKIN_VOIDED',
      'SUPPORT_RELATIONSHIP_CREATED',
      'SUPPORT_PERMISSIONS_UPDATED',
      'SUPPORT_EXPIRATION_UPDATED',
      'SUPPORT_RELATIONSHIP_REVOKED',
      'SUPPORT_RELATIONSHIP_REACTIVATED',
    ])
      expect(actions).toContain(action);
    expect(
      actions.filter((a: string) => a === 'SUPPORT_RELATIONSHIP_CREATED'),
    ).toHaveLength(1);
    expect(
      actions.filter((a: string) => a === 'SUPPORT_RELATIONSHIP_REVOKED'),
    ).toHaveLength(1);
    const times = result.items.map(
      (x: { occurredAt: string; ownerId: string; actorId: string }) => {
        expect(x.ownerId).toBe(users[0]);
        expect(x.actorId).toBe(users[0]);
        expect(x.occurredAt).toMatch(/Z$/);
        return x.occurredAt;
      },
    );
    expect(times).toEqual([...times].sort().reverse());
    expect(JSON.stringify(result)).not.toMatch(
      /password|passwordHash|JWT|Authorization|API.key|DATABASE_URL|token|SEED_PASSWORD|notes|OWNER-ONLY/i,
    );
    const filtered = (
      await http()
        .get(`${api}/audit-events?action=CHECKIN_VOIDED&limit=1&page=1`)
        .set(header())
        .expect(200)
    ).body;
    expect(filtered.total).toBe(1);
    expect(filtered.items[0].entityId).toBe(last);
    await http().get(`${api}/audit-events?limit=101`).set(header()).expect(400);
    await http().get(`${api}/audit-events?from=bad`).set(header()).expect(400);
    const auditId = result.items[0].id;
    await http()
      .patch(`${api}/audit-events/${auditId}`)
      .set(header())
      .send({ payload: {} })
      .expect(404);
    await http()
      .delete(`${api}/audit-events/${auditId}`)
      .set(header())
      .expect(404);
    await expect(
      db.auditEvent.update({ where: { id: auditId }, data: { payload: {} } }),
    ).rejects.toThrow();
    await expect(
      db.auditEvent.delete({ where: { id: auditId } }),
    ).rejects.toThrow();
  });
  it('rolls back domain writes/snapshot/permissions when audit insertion fails', async () => {
    // Test DB only: force the actual PostgreSQL audit insert to fail, without mocks.
    await db.$executeRawUnsafe(
      `CREATE FUNCTION fail_test_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test audit failure'; END; $$`,
    );
    await db.$executeRawUnsafe(
      `CREATE TRIGGER fail_test_audit_insert BEFORE INSERT ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION fail_test_audit()`,
    );
    try {
      const before = await db.goal.findUniqueOrThrow({ where: { id: goal } });
      const failedEmail = `rollback-${suffix}@example.com`;
      await http()
        .post(`${api}/auth/register`)
        .send({
          email: failedEmail,
          password: 'Test-only-register-827!',
          displayName: 'Rollback account',
        })
        .expect(500);
      expect(await db.user.count({ where: { email: failedEmail } })).toBe(0);
      await http()
        .patch(`${api}/goals/${goal}`)
        .set(header())
        .send({ title: 'Rollback title' })
        .expect(500);
      expect(
        (await db.goal.findUniqueOrThrow({ where: { id: goal } })).title,
      ).toBe(before.title);
      await http()
        .post(`${api}/support-network/relationships`)
        .set(header())
        .send({ supporterEmail: emails[2], ...permissions })
        .expect(500);
      expect(
        await db.supportRelationship.count({
          where: { ownerId: users[0], supporterId: users[2] },
        }),
      ).toBe(0);
      await http()
        .patch(relationship())
        .set(header())
        .send({ expiresAt: '2000-01-01T00:00:00Z' })
        .expect(500);
      expect(
        (
          await db.supportRelationship.findUniqueOrThrow({
            where: { id: relation },
          })
        ).expiresAt,
      ).toBeNull();
      await db.supportRelationship.update({
        where: { id: relation },
        data: { revokedAt: new Date() },
      });
      await http()
        .post(`${relationship()}/reactivate`)
        .set(header())
        .send({ ...permissions, canViewProgress: true, expiresAt: null })
        .expect(500);
      expect(
        (
          await db.supportRelationship.findUniqueOrThrow({
            where: { id: relation },
          })
        ).revokedAt,
      ).not.toBeNull();
      await db.supportRelationship.update({
        where: { id: relation },
        data: { revokedAt: null },
      });
      await http()
        .post(`${api}/goals/${goal}/cancel`)
        .set(header())
        .expect(500);
      expect(
        (await db.goal.findUniqueOrThrow({ where: { id: goal } })).status,
      ).toBe(before.status);
      await http()
        .post(`${api}/goals/${cancelled}/reactivate`)
        .set(header())
        .expect(500);
      expect(
        (await db.goal.findUniqueOrThrow({ where: { id: cancelled } })).status,
      ).toBe('CANCELLED');
      await http()
        .post(`${api}/goals/${goal}/check-ins/${first}/void`)
        .set(header())
        .expect(500);
      expect(
        (await db.checkIn.findUniqueOrThrow({ where: { id: first } })).voidedAt,
      ).toBeNull();
      expect(
        (await db.goal.findUniqueOrThrow({ where: { id: goal } })).progress,
      ).toBe(40);
      await http().post(`${relationship()}/revoke`).set(header()).expect(500);
      expect(
        (
          await db.supportRelationship.findUniqueOrThrow({
            where: { id: relation },
          })
        ).revokedAt,
      ).toBeNull();
      await http()
        .patch(relationship())
        .set(header())
        .send({ canViewProgress: true })
        .expect(500);
      expect(
        (
          await db.supportRelationship.findUniqueOrThrow({
            where: { id: relation },
          })
        ).canViewProgress,
      ).toBe(false);
      await http()
        .post(`${api}/goals/${goal}/reactivate`)
        .set(header())
        .expect(500);
      await http()
        .post(`${api}/goals/${cancelled}/check-ins`)
        .set(header())
        .send(check)
        .expect(409);
      // Separate active goal exercises create + snapshot rollback.
      const active = await db.goal.create({
        data: { ownerId: users[0], title: 'Rollback fixture' },
      });
      await http()
        .post(`${api}/goals/${active.id}/check-ins`)
        .set(header())
        .send(check)
        .expect(500);
      expect(await db.checkIn.count({ where: { goalId: active.id } })).toBe(0);
      expect(
        (await db.goal.findUniqueOrThrow({ where: { id: active.id } }))
          .progress,
      ).toBe(0);
      const count = await db.goal.count({ where: { ownerId: users[0] } });
      await http()
        .post(`${api}/goals`)
        .set(header())
        .send({ title: 'Must roll back' })
        .expect(500);
      expect(await db.goal.count({ where: { ownerId: users[0] } })).toBe(count);
      await http()
        .patch(`${api}/users/me`)
        .set(header())
        .send({ displayName: 'Must roll back' })
        .expect(500);
      expect(
        (await db.user.findUniqueOrThrow({ where: { id: users[0] } }))
          .displayName,
      ).toBe('Updated owner');
    } finally {
      await db.$executeRawUnsafe(
        'DROP TRIGGER fail_test_audit_insert ON "AuditEvent"',
      );
      await db.$executeRawUnsafe('DROP FUNCTION fail_test_audit()');
    }
  });
});
