# Implemented API — MVP-1.5

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
| POST | /goals/:goalId/cancel | Persistent cancellation, 200; ACTIVE/PAUSED only |
| POST | /goals/:goalId/reactivate | Return to ACTIVE preserving history, 200 |
| DELETE | /goals/:goalId | Deprecated compatibility alias for cancellation, 204; never deletes |
| POST | /goals/:goalId/check-ins | `{progress,difficulty,completion,notes?}` → CheckIn, 201 |
| GET | /goals/:goalId/check-ins | Effective own history only, latest first |
| GET | /goals/:goalId/check-ins/:checkInId | Own historical record |
| POST | /goals/:goalId/check-ins/:checkInId/void | Retain record, set voidedAt, restore effective snapshot, 204 |
| DELETE | /goals/:goalId/check-ins/:checkInId | Deprecated void alias, 204; never deletes |
| GET | /health | Public liveness |
| GET | /health/ready | Public DB readiness |
| GET | /analytics/overview | Own counts, completionRate, averageProgress, 28-day frequency and inactive Goals |
| GET | /analytics/goals/:goalId | Own deterministic trend, metrics and ascending timeline |
| GET | /ai/summary/context | Development preview `{context,prompt,providerConfigured:false}`; JWT + AI_PREVIEW_ENABLED required |

Password minimum: 8 characters. Progress: integer 0..100; difficulty: integer 1..5; completion: NOT_MET, PARTIAL, MET. Optional description/category/targetDate/notes can be cleared with null. Required fields cannot be null or blank. Unexpected properties are rejected, including ownerId, client timestamps and direct Goal.progress.

Lifecycle (ADR-008): ACTIVE→PAUSED/COMPLETED/CANCELLED; PAUSED→ACTIVE/CANCELLED; COMPLETED→ACTIVE; CANCELLED→ACTIVE. Same status is an idempotent update. Completion is explicit, independent of percentage. Only ACTIVE accepts CheckIns. CheckIns cannot be edited; voided records remain accessible by explicit owner-only detail but are excluded from normal history and Analytics.

| Method | Support / audit path | Contract |
| --- | --- | --- |
| GET | /audit-events | Owner-only `{items,total,page,limit}`; page=1, limit=30 (max100), occurredAt DESC/id DESC. Filters: action, entityType, from/to ISO dates |
| POST | /support-network/relationships | `{supporterEmail,canViewGoals,canViewProgress,canViewSummaries,expiresAt?}`; exact existing email, normalized; 201 |
| GET | /support-network/relationships | Own relationships, including revoked/expired |
| GET | /support-network/relationships/:relationshipId | Owner-only relationship detail |
| PATCH | /support-network/relationships/:relationshipId | Partial permissions/nullable expiresAt; 200 |
| POST | /support-network/relationships/:relationshipId/revoke | Persistent revokedAt, 200; idempotent |
| POST | /support-network/relationships/:relationshipId/reactivate | All three permission booleans + optional expiresAt; same id, 200 |
| GET | /support-network/owners | Active relationships: owner{id,displayName}, permissions, relationship id, expiresAt |
| GET | /support-network/supporting | Deprecated alias for /owners |
| GET | /support-network/owners/:ownerId/goals | VIEW_GOALS: id/title/description/category/status/progress/targetDate, including CANCELLED |
| GET | /support-network/owners/:ownerId/goals/:goalId | Same safe projection |
| GET | /support-network/owners/:ownerId/goals/:goalId/progress | VIEW_PROGRESS: deterministic analytics plus effective timeline{date,progress,difficulty,completion}; never notes |
| GET | /support-network/owners/:ownerId/summaries | VIEW_SUMMARIES checked; returns [] until productive summaries exist |

VIEW_PROGRESS and VIEW_SUMMARIES require VIEW_GOALS; all-false/self relationships return400, duplicate pair409. Expiration is evaluated per request (`revokedAt=null AND (expiresAt=null OR expiresAt>now)`). Missing, expired, revoked or insufficient delegated access returns404. A relationship can be reactivated when revoked/expired; a retained expired date must be cleared or replaced with a future date. No supporter writes or owner audit projection exist.

Every effective business mutation writes minimized owner/actor audit in the same PostgreSQL transaction. Permission and expiration changes are distinct audited aspects if one PATCH changes both. No PATCH/DELETE audit API exists. GET/login/logout are not functional audit actions. Overview adds cancelledGoals; completionRate excludes cancelled goals from its denominator (0 when no eligible goals). AI Context includes cancelledGoals and explicit CANCELLED, with no clinical/emotional inference.

Errors contain `statusCode`, `code`, `message`, `path`, `timestamp`. Invalid DTOs return 400; missing/expired credentials return 401; unknown/foreign resources return 404; duplicate email and invalid lifecycle return 409; auth rate limits return 429. Internal errors never expose stack traces or database details. Safe User responses contain id, email, displayName and timestamps, never passwordHash. Goal and CheckIn ownership always comes from the authenticated identity and parent relation, never request body.

AI Preview is API/Swagger evidence only, with no Flutter screen. Disabled preview returns404 to an authenticated caller. Context includes periodDays28, overview metrics and per-Goal title/status/progress/trend/averageDifficulty/daysSinceLastCheckIn/insufficientHistory. It excludes IDs, identity/email, notes/description, tokens, permissions and environment secrets. Prompt is a string with fixed SYSTEM restrictions and JSON USER data; providerConfigured is always false. No network generation or summary persistence occurs. Mock is internal, development-only, not a public generation API; real provider/model evaluation remains pending.
