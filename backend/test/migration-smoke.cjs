require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
// New, uniquely named test-only database. Never resets or drops the local app DB.
if (process.env.NODE_ENV === 'production')
  throw new Error('Test migration smoke disabled in production');
const source = new URL(process.env.TEST_DATABASE_URL || '');
if (!source.pathname.endsWith('_test'))
  throw new Error('Separate *_test database URL required');
const name = `neuroconnect_migration_${Date.now()}_test`;
const admin = new PrismaClient({ datasourceUrl: source.toString() });
async function run() {
  await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
  source.pathname = `/${name}`;
  const clean = new PrismaClient({ datasourceUrl: source.toString() });
  try {
    const result = spawnSync(
      process.execPath,
      [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'],
      {
        env: { ...process.env, DATABASE_URL: source.toString() },
        stdio: 'inherit',
      },
    );
    assert.equal(result.status, 0);
    assert.equal(await clean.user.count(), 0);
    assert.equal(await clean.auditEvent.count(), 0);
    assert.equal(await clean.supportRelationship.count(), 0);
    const cols =
      await clean.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'CheckIn' AND column_name = 'voidedAt'`;
    assert.equal(cols.length, 1);
    const applied =
      await clean.$queryRaw`SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL`;
    assert.equal(applied.length, 4);
    const seed = () =>
      spawnSync(process.execPath, ['--import', 'tsx', 'prisma/seed.ts'], {
        env: {
          ...process.env,
          NODE_ENV: 'test',
          DATABASE_URL: source.toString(),
        },
        stdio: 'inherit',
      });
    assert.equal(seed().status, 0);
    assert.equal(await clean.user.count(), 3);
    assert.equal(await clean.goal.count(), 5);
    assert.equal(await clean.checkIn.count(), 25);
    assert.equal(await clean.supportRelationship.count(), 2);
    const before = await clean.auditEvent.findMany({ orderBy: { id: 'asc' } });
    assert.equal(before.length, 37);
    assert.equal(seed().status, 0);
    assert.deepEqual(
      await clean.auditEvent.findMany({ orderBy: { id: 'asc' } }),
      before,
    );
    assert.equal(await clean.checkIn.count(), 25);
    console.log(
      'PASS: 4 migrations on empty PostgreSQL, seed twice (3 users/5 goals/25 CheckIns/2 relationships/37 stable audit events); additive baseline upgrade verified separately.',
    );
  } finally {
    await clean.$disconnect();
    // The database was created by this invocation, has a fixed prefix and *_test suffix.
    await admin.$executeRawUnsafe(`DROP DATABASE "${name}"`);
  }
}
run()
  .catch(() => {
    console.error(
      'Migration smoke failed; inspect migration diagnostics above.',
    );
    process.exitCode = 1;
  })
  .finally(() => admin.$disconnect());
