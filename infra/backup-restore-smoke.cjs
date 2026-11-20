// Development-only recovery rehearsal. Never restores into an existing database.
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { PrismaClient } = require('../backend/node_modules/@prisma/client');
if (process.env.NODE_ENV === 'production') throw new Error('Development only');
process.loadEnvFile('backend/.env');
if (process.env.NODE_ENV === 'production') throw new Error('Development only');
const testUrl = new URL(process.env.TEST_DATABASE_URL || '');
if (!/^\/[a-zA-Z0-9_]+_test$/.test(testUrl.pathname) || !['localhost', '127.0.0.1'].includes(testUrl.hostname)) {
  throw new Error('Local separate TEST_DATABASE_URL ending in _test required');
}
const suffix = randomBytes(6).toString('hex');
const source = `backup_${suffix}_test`, target = `restore_${suffix}_test`;
const user = decodeURIComponent(testUrl.username);
const created = [];
const clients = [];
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { ...options, maxBuffer: 32 * 1024 * 1024, windowsHide: true });
  if (result.status !== 0) throw new Error(`${command} failed (exit ${result.status}); credentials redacted`);
  return result.stdout;
}
function pg(command, args, options) {
  return run('docker', ['compose', 'exec', '-T', 'postgres', command, '-U', user, ...args], options);
}
function urlFor(name) { const url = new URL(testUrl); url.pathname = `/${name}`; return url.toString(); }
async function snapshot(name) {
  const db = new PrismaClient({ datasources: { db: { url: urlFor(name) } } }); clients.push(db);
  const result = {};
  for (const model of ['user', 'goal', 'checkIn', 'supportRelationship', 'aISummary', 'auditEvent']) {
    result[model] = await db[model].findMany({ orderBy: { id: 'asc' } });
  }
  result.migrations = await db.$queryRaw`SELECT migration_name, checksum FROM "_prisma_migrations" ORDER BY migration_name`;
  return JSON.stringify(result);
}
(async () => {
  try {
    for (const name of [source, target]) { pg('createdb', [name]); created.push(name); }
    const env = { ...process.env, NODE_ENV: 'test', DATABASE_URL: urlFor(source), SEED_PASSWORD: randomBytes(24).toString('hex'), PRISMA_HIDE_UPDATE_MESSAGE: 'true' };
    run(process.execPath, ['backend/node_modules/prisma/build/index.js', 'migrate', 'deploy', '--schema', 'backend/prisma/schema.prisma'], { env });
    run(process.execPath, ['backend/node_modules/tsx/dist/cli.mjs', 'backend/prisma/seed.ts'], { env });
    const before = await snapshot(source);
    const dump = pg('pg_dump', ['--format=custom', '--no-owner', '--no-privileges', source]);
    pg('pg_restore', ['--no-owner', '--no-privileges', '--exit-on-error', '--dbname', target], { input: dump });
    if (before !== await snapshot(target)) throw new Error('Restored domain or migration rows differ');
    console.log('PASS: PostgreSQL 16 pg_dump/pg_restore; six domain tables and migration checksums identical. Synthetic databases only.');
  } finally {
    await Promise.all(clients.map(db => db.$disconnect()));
    for (const name of created.reverse()) {
      if (!/^(backup|restore)_[a-f0-9]{12}_test$/.test(name)) throw new Error('Unsafe cleanup target');
      pg('dropdb', [name]);
    }
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
