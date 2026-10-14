require('dotenv/config');
const { spawnSync } = require('node:child_process');
const url = process.env.TEST_DATABASE_URL;
if (!url || !/^\/[a-zA-Z0-9_]*_test$/.test(new URL(url).pathname)) {
  console.error(
    'TEST_DATABASE_URL must target a separate PostgreSQL database named *_test.',
  );
  process.exit(1);
}
process.env.DATABASE_URL = url;
process.env.NODE_ENV = 'test';
const run = (file, args) => {
  const result = spawnSync(process.execPath, [require.resolve(file), ...args], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run('prisma/build/index.js', ['migrate', 'deploy']);
run('jest/bin/jest', ['--config', 'test/jest-e2e.json', '--runInBand']);
