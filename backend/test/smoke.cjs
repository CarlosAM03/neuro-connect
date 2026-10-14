require('dotenv/config');
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
    'PASS: live HTTP register → login → profile → Goal CRUD/lifecycle → CheckIns → snapshot/history → isolation (2 users) → cleanup.',
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
