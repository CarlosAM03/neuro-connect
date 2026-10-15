require('dotenv/config');
if (process.env.NODE_ENV === 'production') {
  console.error('Synthetic smoke is development-only');
  process.exit(1);
}
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const base = process.env.SMOKE_API_URL || 'http://localhost:3000/api/v1';
const emails = [
  `smoke-a-${randomUUID()}@example.com`,
  `smoke-b-${randomUUID()}@example.com`,
];
const password = randomUUID();
async function call(method, path, body, token, expected = 200) {
  const result = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(result.status, expected, `${method} ${path}`);
  return expected === 204 ? null : result.json();
}
async function smoke() {
  await call('GET', '/health/ready');
  for (const [i, email] of emails.entries()) {
    const user = await call(
      'POST',
      '/auth/register',
      { email, password, displayName: `Smoke ${i}` },
      null,
      201,
    );
    assert.equal(user.passwordHash, undefined);
  }
  const { accessToken: a } = await call('POST', '/auth/login', {
    email: emails[0],
    password,
  });
  const { accessToken: b } = await call('POST', '/auth/login', {
    email: emails[1],
    password,
  });
  assert.equal((await call('GET', '/auth/me', undefined, a)).email, emails[0]);
  await call('GET', '/users/me', undefined, a);
  await call('PATCH', '/users/me', { displayName: 'Smoke profile' }, a);
  const goal = await call(
    'POST',
    '/goals',
    { title: 'Smoke: registrar seguimiento' },
    a,
    201,
  );
  const path = `/goals/${goal.id}`;
  await call('GET', path, undefined, b, 404);
  await call('PATCH', path, { title: 'Smoke actualizado' }, a);
  const check = {
    progress: 35,
    difficulty: 3,
    completion: 'PARTIAL',
    notes: 'Synthetic smoke record',
  };
  await call('POST', `${path}/check-ins`, check, a, 201);
  assert.equal((await call('GET', path, undefined, a)).progress, 35);
  const latest = await call(
    'POST',
    `${path}/check-ins`,
    { ...check, progress: 65 },
    a,
    201,
  );
  assert.equal(
    (await call('GET', `${path}/check-ins`, undefined, a)).length,
    2,
  );
  await call('GET', `${path}/check-ins/${latest.id}`, undefined, b, 404);
  const analyticsPath = `/analytics/goals/${goal.id}`;
  await call('GET', analyticsPath, undefined, b, 404);
  const growing = await call('GET', analyticsPath, undefined, a);
  assert.equal(growing.trend, 'PROGRESSING');
  assert.equal(growing.progressDelta, 30);
  assert.deepEqual(
    growing.timeline.map((point) => point.progress),
    [35, 65],
  );
  assert.equal(growing.averageDifficulty, 3);
  assert.equal(
    JSON.stringify(growing).includes('Synthetic smoke record'),
    false,
  );
  const overview = await call('GET', '/analytics/overview', undefined, a);
  assert.equal(overview.totalGoals, 1);
  assert.equal(overview.averageProgress, 65);
  assert.equal(overview.checkInFrequencyPerWeek, 0.5);
  assert.equal(
    (await call('GET', '/analytics/overview', undefined, b)).totalGoals,
    0,
  );
  const previewPath = '/ai/summary/context';
  await call('GET', previewPath, undefined, undefined, 401);
  const summariesBefore = await prisma.aISummary.count({
    where: { user: { email: { in: emails } } },
  });
  const preview = await call('GET', previewPath, undefined, a);
  assert.equal(preview.providerConfigured, false);
  assert.equal(preview.context.periodDays, 28);
  assert.equal(preview.context.totalGoals, overview.totalGoals);
  assert.equal(preview.context.averageProgress, overview.averageProgress);
  assert.equal(preview.context.goals[0].trend, 'PROGRESSING');
  assert.equal(preview.context.goals[0].insufficientHistory, false);
  assert.deepEqual(
    JSON.parse(preview.prompt.split('\n\nUSER\n')[1]),
    preview.context,
  );
  assert.ok(preview.prompt.includes('No diagnostiques'));
  const serialized = JSON.stringify(preview);
  for (const sensitive of [a, b, ...emails, password, goal.id, check.notes])
    assert.equal(
      serialized.includes(sensitive),
      false,
      'Preview leaked excluded data',
    );
  const emptyPreview = await call('GET', previewPath, undefined, b);
  assert.equal(emptyPreview.context.totalGoals, 0);
  assert.deepEqual(emptyPreview.context.goals, []);
  assert.equal(
    await prisma.aISummary.count({
      where: { user: { email: { in: emails } } },
    }),
    summariesBefore,
  );
  const declining = await call(
    'POST',
    `${path}/check-ins`,
    { ...check, progress: 40 },
    a,
    201,
  );
  assert.equal(
    (await call('GET', analyticsPath, undefined, a)).trend,
    'DECLINING',
  );
  await call(
    'POST',
    `${path}/check-ins/${declining.id}/void`,
    undefined,
    a,
    204,
  );
  for (const status of ['PAUSED', 'COMPLETED']) {
    if (status === 'COMPLETED') {
      await call('PATCH', path, { status }, a, 409);
      await call('POST', `${path}/reactivate`, undefined, a);
    }
    await call('PATCH', path, { status }, a);
    await call('POST', `${path}/check-ins`, check, a, 409);
  }
  await call('PATCH', path, { status: 'ACTIVE' }, a);
  await call('POST', `${path}/check-ins/${latest.id}/void`, undefined, a, 204);
  assert.equal((await call('GET', path, undefined, a)).progress, 35);
  await call('GET', '/goals', undefined, a);
  await call('POST', `${path}/cancel`, undefined, a);
  assert.equal((await call('GET', path, undefined, a)).status, 'CANCELLED');
  assert.ok((await prisma.checkIn.count({ where: { goalId: goal.id } })) > 0);
  const activeGoal = await call(
    'POST',
    '/goals',
    { title: 'Smoke: objetivo activo compartido' },
    a,
    201,
  );
  const permissions = {
    canViewGoals: true,
    canViewProgress: false,
    canViewSummaries: false,
  };
  const relation = await call(
    'POST',
    '/support-network/relationships',
    { supporterEmail: emails[1], ...permissions },
    a,
    201,
  );
  const owner = await call('GET', '/auth/me', undefined, a);
  const delegated = `/support-network/owners/${owner.id}`;
  const relPath = `/support-network/relationships/${relation.id}`;
  assert.equal(
    (await call('GET', '/support-network/owners', undefined, b)).length,
    1,
  );
  const shared = await call('GET', `${delegated}/goals`, undefined, b);
  assert.ok(shared.some((g) => g.id === goal.id && g.status === 'CANCELLED'));
  assert.ok(
    shared.some((g) => g.id === activeGoal.id && g.status === 'ACTIVE'),
  );
  await call(
    'GET',
    `${delegated}/goals/${goal.id}/progress`,
    undefined,
    b,
    404,
  );
  await call('PATCH', relPath, { canViewProgress: true }, a);
  const progress = await call(
    'GET',
    `${delegated}/goals/${goal.id}/progress`,
    undefined,
    b,
  );
  assert.equal(progress.currentProgress, 35);
  assert.equal(progress.totalCheckIns, 1);
  assert.equal(JSON.stringify(progress).includes(check.notes), false);
  assert.equal(JSON.stringify(progress).includes('notes'), false);
  await call('POST', `${path}/reactivate`, undefined, b, 404);
  await call('POST', `${relPath}/revoke`, undefined, a);
  await call('GET', `${delegated}/goals`, undefined, b, 404);
  assert.ok(
    (
      await prisma.supportRelationship.findUnique({
        where: { id: relation.id },
      })
    ).revokedAt,
  );
  await call(
    'POST',
    `${relPath}/reactivate`,
    { ...permissions, expiresAt: null },
    a,
  );
  await call('GET', `${delegated}/goals`, undefined, b);
  await call('PATCH', relPath, { expiresAt: '2000-01-01T00:00:00Z' }, a);
  await call('GET', `${delegated}/goals`, undefined, b, 404);
  const audit = await call('GET', '/audit-events?limit=100', undefined, a);
  for (const action of [
    'GOAL_CREATED',
    'CHECKIN_CREATED',
    'CHECKIN_VOIDED',
    'GOAL_CANCELLED',
    'SUPPORT_RELATIONSHIP_CREATED',
    'SUPPORT_PERMISSIONS_UPDATED',
    'SUPPORT_RELATIONSHIP_REVOKED',
    'SUPPORT_RELATIONSHIP_REACTIVATED',
    'SUPPORT_EXPIRATION_UPDATED',
  ])
    assert.ok(audit.items.some((e) => e.action === action));
  assert.equal(JSON.stringify(audit).includes(check.notes), false);
  assert.ok(
    audit.items.every((e) => e.ownerId === owner.id && e.actorId === owner.id),
  );
  // Independent owner fixture: prove the exact closeout contract over live HTTP.
  for (const [status, value] of [
    ['ACTIVE', 80],
    ['PAUSED', 40],
    ['COMPLETED', 100],
    ['CANCELLED', 10],
  ]) {
    const fixture = await call(
      'POST',
      '/goals',
      { title: `Closeout ${status}` },
      b,
      201,
    );
    const fixturePath = `/goals/${fixture.id}`;
    if (status === 'ACTIVE') {
      await call(
        'POST',
        `${fixturePath}/check-ins`,
        { ...check, progress: 40 },
        b,
        201,
      );
      const invalidated = await call(
        'POST',
        `${fixturePath}/check-ins`,
        { ...check, progress: 70 },
        b,
        201,
      );
      await call(
        'POST',
        `${fixturePath}/check-ins/${invalidated.id}/void`,
        undefined,
        b,
        204,
      );
      assert.equal((await call('GET', fixturePath, undefined, b)).progress, 40);
      const activity = await call(
        'GET',
        '/audit-events?action=CHECKIN_VOIDED',
        undefined,
        b,
      );
      assert.deepEqual(
        activity.items.find((e) => e.entityId === invalidated.id).payload,
        {
          goalId: fixture.id,
          goalTitle: 'Closeout ACTIVE',
          voidedProgress: 70,
          resultingGoalProgress: 40,
        },
      );
    }
    await call(
      'POST',
      `${fixturePath}/check-ins`,
      { ...check, progress: value },
      b,
      201,
    );
    if (status !== 'ACTIVE') await call('PATCH', fixturePath, { status }, b);
  }
  const eligible = await call('GET', '/analytics/overview', undefined, b);
  assert.equal(eligible.totalGoals, 4);
  assert.equal(eligible.cancelledGoals, 1);
  assert.equal(eligible.averageProgress, 73.33);
  assert.equal(eligible.completionRate, 33.33);
  const eligiblePreview = await call('GET', previewPath, undefined, b);
  assert.equal(eligiblePreview.context.averageProgress, 73.33);
  assert.equal(eligiblePreview.providerConfigured, false);
  assert.equal(JSON.stringify(eligiblePreview).includes(check.notes), false);
  assert.equal(
    await prisma.aISummary.count({
      where: { user: { email: { in: emails } } },
    }),
    summariesBefore,
  );
  console.log(
    'PASS: CHECKIN_VOIDED 70 / resultingGoalProgress 40; eligible average 73.33 in Analytics and AI Preview; no notes/provider/summary persistence.',
  );
  await call('GET', '/goals', undefined, undefined, 401);
  console.log(
    'PASS: live HTTP Auth/profile → Goals/lifecycle/CANCELLED → CheckIns/void/snapshot/history → Analytics → AI Preview → Owner/Supporter permissions/no notes/read-only/expiry/revoke/reactivate → private audit → controlled synthetic cleanup.',
  );
}
smoke()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
    await prisma.$disconnect();
  });
