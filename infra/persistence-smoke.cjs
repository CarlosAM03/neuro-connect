// Local-only restart rehearsal; removes only this invocation's synthetic account.
const { randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');
if (process.env.NODE_ENV === 'production') throw new Error('Development only');
process.loadEnvFile('backend/.env');
if (process.env.NODE_ENV === 'production') throw new Error('Development only');
const url = new URL(process.env.DATABASE_URL);
if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Local DB required');
const db = new PrismaClient();
const email = `restart-${randomUUID()}@example.com`, password = randomUUID();
const base = 'http://localhost:3000/api/v1';
let stage = 'startup';
async function call(method, path, body, token, status = 200) {
  const r = await fetch(base + path, { method, headers: { 'Content-Type': 'application/json', Connection: 'close', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000) });
  if (r.status !== status) throw new Error(`Unexpected HTTP status ${r.status}`);
  return r.json();
}
function compose(args) {
  const r = spawnSync('docker', ['compose', ...args], { windowsHide: true, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`Compose restart/health failed (exit ${r.status})`);
}
(async () => {
  try {
    stage = 'create fixtures';
    const user = await call('POST', '/auth/register', { email, password, displayName: 'Synthetic persistence rehearsal' }, null, 201);
    const { accessToken } = await call('POST', '/auth/login', { email, password });
    const goal = await call('POST', '/goals', { title: 'Synthetic restart fixture' }, accessToken, 201);
    await call('POST', `/goals/${goal.id}/check-ins`, { progress: 40, difficulty: 2, completion: 'PARTIAL' }, accessToken, 201);
    const before = JSON.stringify(await db.auditEvent.findMany({ where: { ownerId: user.id }, orderBy: { id: 'asc' } }));
    stage = 'restart services';
    // Close the harness client's pool before terminating PostgreSQL connections.
    await db.$disconnect();
    compose(['restart', 'postgres', 'backend', 'frontend']);
    stage = 'wait for health';
    compose(['up', '-d', '--wait']);
    stage = 'verify persisted API';
    const restored = await call('GET', `/goals/${goal.id}`, undefined, accessToken);
    if (restored.progress !== 40 || restored.status !== 'ACTIVE') throw new Error('Goal state did not persist');
    if ((await call('GET', `/goals/${goal.id}/check-ins`, undefined, accessToken)).length !== 1) throw new Error('History did not persist');
    stage = 'verify audit';
    if (before !== JSON.stringify(await db.auditEvent.findMany({ where: { ownerId: user.id }, orderBy: { id: 'asc' } }))) throw new Error('Audit changed across restart');
    console.log('PASS: Goal, effective CheckIn, session and append-only audit preserved across three-service restart; no volume deleted.');
  } finally { await db.user.deleteMany({ where: { email } }); await db.$disconnect(); }
})().catch(error => { console.error(`Persistence rehearsal failed at ${stage}; error type ${error.name}, code ${error.code ?? 'none'}; credentials redacted.`); process.exitCode = 1; });
