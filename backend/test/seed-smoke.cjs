require('dotenv/config');
const assert = require('node:assert/strict');
const base = process.env.SMOKE_API_URL || 'http://localhost:3000/api/v1';
async function run() {
  assert.ok(
    process.env.SEED_PASSWORD,
    'Configure SEED_PASSWORD and run the seed first',
  );
  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@neuroconnect.local',
      password: process.env.SEED_PASSWORD,
    }),
  });
  assert.equal(login.status, 200);
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  async function get(path) {
    const result = await fetch(base + path, { headers });
    assert.equal(result.status, 200);
    return result.json();
  }
  const goals = await get('/goals');
  const expected = new Map([
    ['00000000-0000-4000-8000-000000000001', 'PROGRESSING'],
    ['00000000-0000-4000-8000-000000000002', 'STABLE'],
    ['00000000-0000-4000-8000-000000000003', 'INACTIVE'],
    ['00000000-0000-4000-8000-000000000004', 'PROGRESSING'],
    ['00000000-0000-4000-8000-000000000005', 'PROGRESSING'],
  ]);
  let recent = 0;
  const now = Date.now();
  for (const [id, trend] of expected) {
    assert.ok(goals.some((goal) => goal.id === id));
    const analytics = await get(`/analytics/goals/${id}`);
    assert.equal(analytics.trend, trend);
    assert.equal(analytics.totalCheckIns, 5);
    assert.equal(analytics.timeline.length, 5);
    assert.equal(analytics.insufficientHistory, false);
    recent += analytics.timeline.filter(
      (point) =>
        Date.parse(point.date) >= now - 28 * 86400000 &&
        Date.parse(point.date) <= now,
    ).length;
  }
  const overview = await get('/analytics/overview');
  assert.equal(overview.totalGoals, 5);
  assert.equal(overview.averageProgress, 55.4);
  assert.equal(overview.cancelledGoals, 1);
  assert.equal(overview.completedGoals, 1);
  assert.equal(overview.completionRate, 25);
  assert.equal(overview.checkInsLast28Days, recent);
  assert.equal(overview.checkInFrequencyPerWeek, recent / 4);
  assert.equal(overview.inactiveGoals, 1);
  console.log(
    'PASS: seed live API trends, timelines, CANCELLED / COMPLETED and eligible completion rate (5 goals, 25 CheckIns).',
  );
}
run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
