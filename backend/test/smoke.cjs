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
  await call('DELETE', `${path}/check-ins/${declining.id}`, undefined, a, 204);
  for (const status of ['PAUSED', 'COMPLETED']) {
    await call('PATCH', path, { status }, a);
    await call('POST', `${path}/check-ins`, check, a, 409);
  }
  await call('PATCH', path, { status: 'ACTIVE' }, a);
  await call('DELETE', `${path}/check-ins/${latest.id}`, undefined, a, 204);
  assert.equal((await call('GET', path, undefined, a)).progress, 35);
  await call('GET', '/goals', undefined, a);
  await call('DELETE', path, undefined, a, 204);
  await call('GET', path, undefined, a, 404);
  await call('GET', '/goals', undefined, undefined, 401);
  console.log(
    'PASS: live HTTP register → login → profile → Goal CRUD/lifecycle → CheckIns → snapshot/history → Analytics overview/timeline/PROGRESSING/DECLINING → AI context/prompt preview (no provider, no persistence) → isolation (2 users) → cleanup.',
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
