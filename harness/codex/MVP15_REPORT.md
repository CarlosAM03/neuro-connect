# MVP-1.5 — Support network and historical audit

- Block: MVP-1.5 / ADR-008.
- Branch: `mvp1.5-support-audit`.
- Base commit: `04f6c8983b18881ba9d52899f70348bb1673d9f4` (`origin/main`, human merge PR #3).
- ADR-008 commit: `dc1acb1` (adoption only; normative content unchanged).
- Final commit: pending implementation and validation.
- Status: implementation in progress; no completion claim.

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

## Implementation / final validation

Pending. This report is updated as each vertical slice is verified.
