# Avance 1 API

Base: `/api/v1`. All business endpoints require `Authorization: Bearer <accessToken>` except registration and login. Swagger is available at `/api/docs` and JSON at `/api/docs-json` when enabled. Dates use ISO 8601 UTC. UUID path parameters are validated.

| Method | Path | Input / result |
| --- | --- | --- |
| POST | /auth/register | `{email,password,displayName}` → safe user, 201 |
| POST | /auth/login | `{email,password}` → `{accessToken}`, 200 |
| GET | /auth/me | Safe authenticated identity |
| GET | /users/me | Own profile |
| PATCH | /users/me | `{displayName}` → updated safe profile |
| POST | /goals | `{title,description?,category?,targetDate?}` → ACTIVE goal at 0%, 201 |
| GET | /goals | Own goals |
| GET | /goals/:goalId | Own goal detail |
| PATCH | /goals/:goalId | `{title?,description?,category?,targetDate?,status?}` |
| DELETE | /goals/:goalId | Cascade delete including CheckIns, 204 |
| POST | /goals/:goalId/check-ins | `{progress,difficulty,completion,notes?}` → CheckIn, 201 |
| GET | /goals/:goalId/check-ins | Own history, latest first |
| GET | /goals/:goalId/check-ins/:checkInId | Own historical record |
| DELETE | /goals/:goalId/check-ins/:checkInId | Delete erroneous record and restore snapshot, 204 |
| GET | /health | Public liveness |
| GET | /health/ready | Public DB readiness |
| GET | /analytics/overview | Own counts, completionRate, averageProgress, 28-day frequency and inactive Goals |
| GET | /analytics/goals/:goalId | Own deterministic trend, metrics and ascending timeline |
| GET | /ai/summary/context | Development preview `{context,prompt,providerConfigured:false}`; JWT + AI_PREVIEW_ENABLED required |

Password minimum: 8 characters. Progress: integer 0..100; difficulty: integer 1..5; completion: NOT_MET, PARTIAL, MET. Optional description/category/targetDate/notes can be cleared with null. Required fields cannot be null or blank. Unexpected properties are rejected, including ownerId, client timestamps and direct Goal.progress.

Lifecycle: ACTIVE→PAUSED/COMPLETED; PAUSED→ACTIVE/COMPLETED; COMPLETED→ACTIVE. Same status is an idempotent update. Completion is explicit, independent of percentage. Only ACTIVE accepts CheckIns. CheckIns cannot be edited.

Errors contain `statusCode`, `code`, `message`, `path`, `timestamp`. Invalid DTOs return 400; missing/expired credentials return 401; unknown/foreign resources return 404; duplicate email and invalid lifecycle return 409; auth rate limits return 429. Internal errors never expose stack traces or database details. Safe User responses contain id, email, displayName and timestamps, never passwordHash. Goal and CheckIn ownership always comes from the authenticated identity and parent relation, never request body.

AI Preview is API/Swagger evidence only, with no Flutter screen. Disabled preview returns404 to an authenticated caller. Context includes periodDays28, overview metrics and per-Goal title/status/progress/trend/averageDifficulty/daysSinceLastCheckIn/insufficientHistory. It excludes IDs, identity/email, notes/description, tokens, permissions and environment secrets. Prompt is a string with fixed SYSTEM restrictions and JSON USER data; providerConfigured is always false. No network generation or summary persistence occurs. Mock is internal, development-only, not a public generation API; real provider/model evaluation remains pending.
