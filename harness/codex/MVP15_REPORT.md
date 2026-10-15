# MVP-1.5 — Support network and historical audit

- Block: MVP-1.5 / ADR-008.
- Branch: `mvp1.5-support-audit`.
- Base commit: `04f6c8983b18881ba9d52899f70348bb1673d9f4` (`origin/main`, human merge PR #3).
- ADR-008 commit: `dc1acb1` (adoption only; normative content unchanged).
- Final commit: delivered branch `HEAD` (resolve with `git rev-parse HEAD`); final validated code/test commit `fa503c96cbd78147d11932213692e4f7a8f7ca23`. Subsequent handoff commits change documentation only.
- Status: READY_FOR_HUMAN_VALIDATION — local gates, dual-user smoke and both remote CI workflows PASS. Automatic PR creation is externally blocked by GitHub connector403; human acceptance is pending.

## Scope

ADR-008: persistent cancellation, CheckIn voiding, atomic append-only owner audit,
contextual support relationships, permissions, expiration, revoke/reactivate,
delegated read-only Flutter views. Preserve Auth, Analytics, Dashboard and AI Preview.
No real AI provider, global role, supporter writes, notifications or deployment.

## Baseline regression (before domain changes)

Executed on the accepted baseline plus the ADR-only commit:

| Gate | Result |
| --- | --- |
| Backend `npm run lint` | PASS |
| Backend `npm test` | PASS: 58 tests / 4 suites |
| Backend `npm run test:e2e` | PASS: 57 tests / 3 suites; real PostgreSQL 16, separate test DB |
| Backend `npm run build` | PASS |
| Flutter `flutter analyze` | PASS: no issues |
| Flutter `flutter test` | PASS: 15 tests |
| Flutter `flutter build web` | PASS: release web + Wasm dry run (157.7 s) |
| `docker compose up -d --build --wait` | PASS: PostgreSQL, backend, frontend healthy; both images built |
| `docker compose exec -T backend node seed-dist/seed.js` | PASS |
| Backend `npm run smoke:seed` | PASS: 3 goals / 15 CheckIns, trends and overview |
| `docker compose exec -T backend node scripts/smoke.cjs` | PASS: register/login/profile, Goals/lifecycle, CheckIns/snapshot/history, Analytics, AI Preview, two-user isolation |
| Swagger JSON / Flutter HTTP | Both HTTP 200 |

Baseline dependencies report existing npm audit findings (2 moderate / 3 high in
the production Docker install); no dependency upgrades made as part of adoption.
Migrations 001 and 002 applied; no pending baseline migrations.

## Database changes / migrations

Baseline migrations remain unchanged. Added:

- `20261015000100_support_audit_history`: CANCELLED enum, nullable UTC CheckIn.voidedAt, SupportRelationship and AuditEvent with UUID/FKs/indexes/JSONB, self/permission SQL constraints, audit UPDATE trigger.
- `20261015000200_audit_append_only`: reject direct audit DELETE; nested FK cascades remain available only for controlled internal synthetic cleanup. No public account-delete endpoint exists.

Upgrade was applied to the existing local DB without reset. `npm run smoke:migrations`
creates a unique new PostgreSQL `*_test` DB, applies all four migrations, runs seed
twice and drops only that newly created database. PASS: 3 users, 5 goals, 25 CheckIns,
2 relationships, 37 unchanged audit events after the second seed. Existing
development volume and pre-ADR records are preserved. No retroactive events invented.

## Goal CANCELLED / CheckIn voiding

Canonical POST `/goals/:goalId/cancel` and `/reactivate` retain history. State machine:
ACTIVE→PAUSED/COMPLETED/CANCELLED; PAUSED→ACTIVE/CANCELLED;
COMPLETED→ACTIVE; CANCELLED→ACTIVE. Only ACTIVE accepts CheckIns.
Deprecated DELETE aliases remain for the accepted previous API, but now only
cancel/void; Swagger documents this explicitly. Flutter calls canonical actions.

POST `/goals/:goalId/check-ins/:checkInId/void` sets voidedAt without altering the
original values. Normal history excludes voided rows; explicit owner-only detail
retains access. Effective latest snapshot is recalculated (or0), under the same
parent lock and transaction as CHECKIN_VOIDED. Tests cover40→70→void70→40 and
newest/older/final voids, concurrency, persistence and isolation.

## Analytics changes / AI Preview regression

All analytical queries filter voidedAt=null. Overview adds cancelledGoals;
completionRate denominator excludes CANCELLED (empty eligibility→0), totalGoals
counts all statuses. CANCELLED never becomes INACTIVE. Existing trend rules,
28-day frequency, charts, insufficient history and owner isolation remain intact.
AI context explicitly includes cancelledGoals/CANCELLED, uses the existing allowlist,
and the fixed prompt disallows interpreting cancellation as failure, symptoms,
emotion or diagnosis. providerConfigured=false; no provider SDK/network generation,
productive AISummary persistence or AI UI was added.

## AuditEvent design / audit actions / atomicity

Fields: UUID id/ownerId/actorId/entityId, action/entityType enums, minimized JSONB
payload, UTC occurredAt. Owner-only GET `/audit-events` supports page/limit (max100),
action/entityType/from/to and occurredAt DESC/id DESC. No update/delete API/service.
SQL rejects rewrite and direct deletion. Internal account FK cascade is exclusively
used for synthetic test cleanup, never product account deletion.

Implemented ACCOUNT_REGISTERED, PROFILE_UPDATED, GOAL_CREATED, GOAL_UPDATED,
GOAL_STATUS_CHANGED, GOAL_CANCELLED, GOAL_REACTIVATED, CHECKIN_CREATED,
CHECKIN_VOIDED, SUPPORT_RELATIONSHIP_CREATED, SUPPORT_PERMISSIONS_UPDATED,
SUPPORT_RELATIONSHIP_REVOKED, SUPPORT_RELATIONSHIP_REACTIVATED,
SUPPORT_EXPIRATION_UPDATED. Each effective business change appends its event in
the same transaction; combined permission/expiration edits audit both aspects.
Idempotent same-status/revoke calls do not invent new transitions. Reads and
login/logout are not audited. Actor is the authenticated owner; supporter cannot
mutate owner resources. Payload uses action-specific allowlists; no requests,
password/hash/JWT/Authorization/keys/URLs/tokens/SEED_PASSWORD/CheckIn.notes.

Real PostgreSQL failing-insert trigger tests prove rollback for registration,
profile, Goal create/update/cancel/reactivate, CheckIn create+snapshot/void+recompute,
support create/permissions/expiration/revoke/reactivate. Expected500 log entries in
that test are deliberate assertions, not unexplained runtime failures.

## SupportRelationship / permission model / expiration / revocation / reactivation

No User.role. Owner adds an existing account by exact normalized email; no directory,
search, invitation or pending account. One unique owner/supporter pair; self rejected.
VIEW_GOALS/VIEW_PROGRESS/VIEW_SUMMARIES are persisted as booleans. Progress/summaries
require goals; all-false is400, independently reinforced in SQL. Revoke sets UTC
revokedAt, retains row and denies the next request. Reactivate reuses id, updates
permissions/optional expiry, clears revokedAt and audits; expired dates must be
cleared or replaced to reactivate. Expiration is evaluated every delegated request:
revokedAt=null AND (expiresAt=null OR expiresAt>now). No worker/cache/Redis.

SupportAccessService centralizes access, checks PostgreSQL and holds a shared row
lock while reading the safe projection. Owner permission/revoke writes acquire
the corresponding exclusive row lock. This prevents permission changes midway
through a delegated read; the following request uses the new committed settings.

## Delegated routes

Owner: POST/GET `/support-network/relationships`, GET/PATCH
`/support-network/relationships/:relationshipId`, POST `/revoke` and `/reactivate`.
Supporter: GET `/support-network/owners` (deprecated `/supporting` alias),
GET `/support-network/owners/:ownerId/goals`, `.../goals/:goalId`,
`.../goals/:goalId/progress`, `.../summaries`.

Goals exposes only id/title/description/category/status/snapshot progress/targetDate,
including CANCELLED. Detailed progress requires VIEW_PROGRESS; effective timeline
includes date/progress/difficulty/completion and deterministic metrics, never notes
or voided rows. Summaries requires VIEW_SUMMARIES and returns[] honestly until
productive AI exists. Missing/foreign/expired/revoked/insufficient access→404.
Supporter has no owner mutation/audit/AI-generation route.

## Owner UI / supporter UI / audit UI

Perfil links to Mi red de apoyo, Personas a las que apoyo and Historial de actividad.
There is no role switch. Owner can add/list/edit permissions/expiry, revoke/reactivate.
Supporter sees active owners, explicit shared-owner banner and read-only Goal cards
including Cancelado. Progress controls require permission, and notes never arrive.
Refresh reloads relationship permissions plus Goals and removes stale projections
when access is lost. Typed repositories contain HTTP; providers depend on session.
Activity presents Spanish action descriptions and pagination, not raw JSON.
Own Goals retain cancelled history; cancellation/void confirmations explain retention.

## Seed

`demo@neuroconnect.local` is owner. `supporter@neuroconnect.local` gets goals+progress;
`supporter-goals@neuroconnect.local` gets goals only. All use local SEED_PASSWORD.
Five goals include three original analytic patterns plus COMPLETED/CANCELLED;
25 CheckIns on a clean seed. Additive reruns preserve existing Goal/history/relationship
state and audit; no reset/delete. Repeated seed updates only synthetic login hashes.

## E2E dual-user / security tests

A/B/C real PostgreSQL suite exercises create/check-ins/cancel persistent rows,
supporter goals-only visibility of ACTIVE and CANCELLED, grant/remove progress,
no notes/voided history, no delegated writes/audit, summaries permission, normalized
email/duplicate/self/mass assignment, invalid permission combinations400, C denied,
expiry every request, revoke next-request denial, same-id reactivation, audit
owner/actor/UTC/order/filters/pagination/privacy, SQL immutability and atomic rollback.
Previous Auth/core/Analytics/AI E2E suites remain and were adapted only where ADR-008
supersedes old deletion/lifecycle expectations; no tests skipped or requirements reduced.

## Tests executed / results / builds

- Backend lint: PASS. Unit:67 PASS /4 suites. E2E:72 PASS /4 suites (final continuation). Build:PASS.
- Flutter analyze:PASS; final complete suite25 PASS (including all previous15).
- Flutter release web:PASS including Wasm dry run; final continuation build138.2 s.
- Empty PostgreSQL migrations + seed twice:PASS. Existing DB upgrade:PASS.
- Live `npm run smoke:seed`:PASS (5 goals/25 CheckIns; cancelled/completed/eligible completion rate).
- Container HTTP smoke:PASS full core/analytics/AI/owner-supporter/expiry/revoke/reactivate/audit.
- `git diff --check`:PASS so far.

Corrected intermediate issues: readonly TypeScript JSON payload construction;
UTF-8 encoding of one edited Dart line; widget scroll visibility after layout growth;
legacy deletion wording; new DTO Swagger timeline includes difficulty/completion.
All corrected gates are rerun before delivery.

## Docker

Both Docker images built successfully; full Compose3 services healthy, migrations
automatic before backend startup, compiled seed and HTTP smoke run without host
Node/Flutter. PostgreSQL16 named volume retained. Production example unchanged:
separate frontend/backend images, external PostgreSQL via DATABASE_URL.
Final continuation source build/smoke:PASS; all3 services healthy. No paid services or deployment used.

## CI

Both workflow push triggers include mvp1.5-support-audit. Remote CI PASS on
`550e8acde141be05e942c634ed44294121685cea`, containing the final validated
code/test commit `fa503c96cbd78147d11932213692e4f7a8f7ca23`:

- [Backend CI — success](https://github.com/CarlosAM03/neuro-connect/actions/runs/38699155050): lint,67 unit,72 PostgreSQL E2E, build, Docker image.
- [Frontend CI — success](https://github.com/CarlosAM03/neuro-connect/actions/runs/38699154991): analyze,25 tests, web build, Docker image.

Following handoff edits are documentation only. Final branch-head workflows are
checked again after publication before final response, without changing product code
or weakening checks. Live final-head results: [Backend branch runs](https://github.com/CarlosAM03/neuro-connect/actions/workflows/backend-ci.yml?query=branch%3Amvp1.5-support-audit),
[Frontend branch runs](https://github.com/CarlosAM03/neuro-connect/actions/workflows/frontend-ci.yml?query=branch%3Amvp1.5-support-audit).
The exact delivered handoff SHA is `git rev-parse HEAD`; the report cannot embed its
own commit hash without changing that hash. All executable code/tests are identified
by the validated `fa503c9` ancestor above.

## Browser smoke

PASS, completed on2026-10-15 after resuming the interrupted execution. Old tabs
had closed, so two tabs were recreated and authenticated with the same existing
synthetic accounts; no domain fixtures were rebuilt or discarded.

- Owner sees the persisted Cancelado Goal and its earlier CheckIn. The final
  cancellation confirmation explicitly says history is retained and reactivation
  remains available (verified before interruption; final UI source and tests unchanged).
- Supporter with VIEW_GOALS only lists the owner and sees ACTIVE and CANCELLED
  snapshots; no detailed-progress control or private notes.
- Owner enables VIEW_PROGRESS. The next refresh exposes authorized detailed progress:
  active Goal40%, effective timeline/date/difficulty/completion, no notes or writes.
- Owner Activity displays readable GOAL_CREATED, CHECKIN_CREATED, GOAL_CANCELLED,
  SUPPORT_RELATIONSHIP_CREATED and SUPPORT_PERMISSIONS_UPDATED descriptions.
- Owner revokes; relation remains visibly Revocada. Supporter's next refresh removes
  all shared Goals and shows access unavailable. Owner Activity shows revocation.
- Owner reactivates with explicit goals=true/progress=true/summaries=false/no expiry.
  Supporter retries and recovers both Goals and progress, including the cancelled
  Goal's retained effective CheckIn. Activity shows reactivation followed by revoke
  and prior events in descending chronology.
- Direct PostgreSQL/API cross-check confirms one logical relationship, same id in
  create/revoke/reactivate events, retained cancelled row/CheckIn, and no notes in
  delegated progress. Supporter writes, permissions/revoke and owner audit return404.
- Final72 E2E include explicit VIEW_GOALS visibility of all four statuses
  ACTIVE/PAUSED/COMPLETED/CANCELLED, exact safe fields, and progress denied without
  VIEW_PROGRESS. API security is tested independently from button visibility.

Screenshots are local review artifacts outside Git in the task visualization
workspace (cancelled view, note-free progress, denied revoked access, Activity and
reactivated Activity). Synthetic browser history remains available locally; no
public product deletion was used. Container HTTP smoke cleans only its own random
synthetic fixtures internally. Temporary browser tabs are closed after verification.

## Implementation decisions / deviations / dependencies

Accepted ADR-008 unchanged as first commit. No ADR-001–007/plan/roadmap edits.
Retained deprecated non-destructive DELETE aliases for existing accepted contracts.
Atomic audit helper uses an explicit per-action allowlist; seed creates only real
synthetic creation events, never reconstructed prior events. No new dependencies.
Derived documentation only: root/backend/app README and architecture API/model/overview.
No architectural deviation; no productive AI represented as complete.

## Known limitations / known issues / technical debt / deferred work

- No reconstruction of records physically deleted before ADR-008 is possible.
- Audit begins at adoption; old baseline rows do not get fabricated creation events.
- Productive AI/provider/model, productive summary history/UI, notifications,
  invitations, exports, account deletion, retention and deployment remain deferred.
- Android/iOS projects retained; this block validates Web, not APK/iOS builds.
- Existing dependency audit findings remain: production2 moderate/3 high;
  full dev install6 moderate/32 high. No dependency upgrade or weakening of checks.
- Automatic PR creation is blocked by connector403; branch/compare/title/body are delivered for manual creation.
- Human acceptance remains pending; never inferred from tests/CI.

## Continuation after usage-limit interruption

Resumed2026-10-15 from existing `mvp1.5-support-audit` at `771aac5` without restarting,
resetting, cleaning, rebasing or rewriting the10 existing commits. Initially modified
files were inspected before changes:

- `backend/src/support-network/support-network.service.ts`: FOR SHARE parent Goal
  lock prevents snapshot/history reads observing different concurrent CheckIn writes.
- `backend/test/e2e/support-audit.e2e-spec.ts`: concurrent owner CheckIns/supporter
  reads assert snapshot equals last effective timeline point and no private notes.

Both preserved and committed as `d57764587c46bdfebb3f43bf9bb3ca838377228d`
(`fix(support): keep delegated progress snapshot and timeline consistent`).
Validation-only addition `fa503c96cbd78147d11932213692e4f7a8f7ca23` explicitly checks
all four Goal states with VIEW_GOALS, safe projection fields and lack of progress
permission. No new product capability or migration was introduced in continuation.

Final reruns: backend lint/unit67/E2E72/build PASS; Flutter analyze/tests25/web build
PASS; Compose image builds/health/seed/HTTP smoke PASS; clean PostgreSQL migration
chain and seed twice PASS; Swagger JSON/frontend health HTTP200; git diff --check PASS.
Rollback failures in E2E are injected PostgreSQL audit errors expected to return500.
No unexplained failure remains.

Temporary inspection: `tmp/`, `tmp-compose-final.log`, `tmp-docker-build.log` are
ignored/untracked, not part of any commit. Contents predate continuation (Avance1/
previous MVP validation); retained as prior evidence rather than deleting files with
uncertain ownership. No git clean/reset or destructive filesystem operation used.

## Pull request / delivery

Published only origin/mvp1.5-support-audit. Both main and origin/main remain
`04f6c8983b18881ba9d52899f70348bb1673d9f4`. All10 original commits preserved.
Attempted the authorized PR with the GitHub connector after both workflows passed;
GitHub returned403 `Resource not accessible by integration`. This is the only
external delivery blocker, not a technical validation failure. No local credentials
were extracted or reused. Full title/body is in `harness/codex/MVP15_PR.md`.

[Create/review the PR: main...mvp1.5-support-audit](https://github.com/CarlosAM03/neuro-connect/compare/main...mvp1.5-support-audit?expand=1).
PR number/URL: not created automatically (403). No merge or auto-merge performed.
The branch remains available for manual PR creation and review.
No merge, auto-merge, force-push or credential extraction is authorized/performed.

## Human validation commands

From repository root (existing .env is preserved; new clone can use setup-local):

```powershell
git switch mvp1.5-support-audit
if (-not (Test-Path .env) -and -not (Test-Path backend/.env)) { node infra/setup-local.cjs }
docker compose up -d --build --wait
docker compose exec -T backend node seed-dist/seed.js
docker compose exec -T backend node scripts/smoke.cjs
docker compose ps
```

Open http://127.0.0.1:5173 and http://127.0.0.1:3000/api/docs. For two simultaneous
sessions use independent tabs (Web token is sessionStorage); log in as demo owner
and either synthetic supporter with local SEED_PASSWORD. Verify all checklist items.
Do not reset/delete a development volume to reproduce seed; existing changes persist.

Optional host gates after `npm ci`/Prisma generate and `node infra/setup-test.cjs`:

```powershell
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
npm run smoke:migrations
npm run smoke:seed
cd ../app
flutter pub get --enforce-lockfile
flutter analyze
flutter test
flutter build web
cd ..
docker compose stop
```

## Human Validation Checklist

These checkboxes are reserved for manual human validation; automated evidence is above.

- [ ] ADR-008 está versionado
- [ ] branch nace de main integrado
- [ ] migration desde DB limpia funciona
- [ ] Goal CANCELLED persiste
- [ ] cancelar no elimina row
- [ ] Goal puede reactivarse
- [ ] CheckIn void persiste row
- [ ] void recalcula progress
- [ ] Analytics ignora voided
- [ ] CANCELLED no es INACTIVE
- [ ] cancelledGoals aparece en overview
- [ ] AuditEvent existe
- [ ] AuditEvent es append-only
- [ ] Audit payload no contiene secrets
- [ ] Activity UI funciona
- [ ] owner agrega supporter
- [ ] self relationship rechazada
- [ ] VIEW_GOALS funciona
- [ ] VIEW_PROGRESS dependency funciona
- [ ] VIEW_SUMMARIES dependency funciona
- [ ] all-false rechazado
- [ ] expiration funciona
- [ ] revoke funciona
- [ ] revoke conserva row
- [ ] reactivate funciona
- [ ] supporter lista owners
- [ ] supporter ve CANCELLED Goals
- [ ] supporter sin VIEW_PROGRESS no ve detalle
- [ ] supporter con VIEW_PROGRESS sí ve detalle
- [ ] supporter nunca ve notes
- [ ] supporter no puede mutar
- [ ] supporter no ve AuditEvents
- [ ] usuario sin relación no accede
- [ ] AI Preview sigue funcionando
- [ ] Auth regression pasa
- [ ] Goals regression pasa
- [ ] CheckIns regression pasa
- [ ] Analytics regression pasa
- [ ] Dashboard regression pasa
- [ ] backend lint pasa
- [ ] backend unit tests pasan
- [ ] backend E2E pasan
- [ ] backend build pasa
- [ ] Flutter analyze pasa
- [ ] Flutter tests pasan
- [ ] Flutter Web build pasa
- [ ] backend Docker build pasa
- [ ] frontend Docker build pasa
- [ ] Compose smoke pasa
- [ ] CI remoto pasa
