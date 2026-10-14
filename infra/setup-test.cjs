const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
process.loadEnvFile('backend/.env');
const url = new URL(process.env.DATABASE_URL);
url.pathname = '/neuroconnect_test';
const args = ['compose', 'exec', '-T', 'postgres', 'psql', '-U', decodeURIComponent(url.username), '-d', 'postgres', '-tAc', "SELECT 1 FROM pg_database WHERE datname='neuroconnect_test'"];
const exists = spawnSync('docker', args, { encoding: 'utf8' });
if (exists.status !== 0) { console.error('Start docker compose postgres first.'); process.exit(1); }
if (exists.stdout.trim() !== '1') {
  const result = spawnSync('docker', ['compose', 'exec', '-T', 'postgres', 'createdb', '-U', decodeURIComponent(url.username), 'neuroconnect_test'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(1);
}
let env = fs.readFileSync('backend/.env', 'utf8');
env = env.replace(/^TEST_DATABASE_URL=.*\r?\n?/m, '');
fs.writeFileSync('backend/.env', `${env.trimEnd()}\nTEST_DATABASE_URL=${url.toString()}\n`);
console.log('Disposable neuroconnect_test database configured; local credentials not printed.');
