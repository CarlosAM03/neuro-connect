# NeuroConnect API

Node 22.16.0, NestJS, Prisma 6, PostgreSQL 16. Run commands here unless specified.

```sh
npm ci
npm run prisma:generate
npm run migrate:deploy
npm run seed
npm run start:dev
```

First run `node infra/setup-local.cjs` from the repository root to create ignored local environment files, then `docker compose up -d --wait postgres`. Existing environment files are preserved. Environment keys are documented in `.env.example`; `SEED_PASSWORD` supplies the demo account password. No seed runs automatically at application startup.

```sh
npm run lint
npm test
npm run test:e2e
npm run build
```

E2E requires `TEST_DATABASE_URL` pointing to a separate PostgreSQL database whose name ends in `_test`. The suite applies migrations and cleans up its own synthetic accounts. It never truncates the development database. Setup and verified results are recorded in `../harness/codex/MVP1_REPORT.md`.

Analytics exposes authenticated `GET /api/v1/analytics/overview` and `GET /api/v1/analytics/goals/:goalId`. Ownership is applied in database queries (foreign/missing goal: 404). Read-only repeatable-read transactions return explicit projections without notes or identity fields. Pure rules use UTC elapsed days, a 28-day window, ACTIVE inactivity after 7 days, delta thresholds ±5 and explicit insufficient history. No derived analytics are persisted. Swagger documents the response contracts.

From the root, `docker compose up -d --build --wait` starts the complete local stack. Backend runtime has no devDependencies; the seed is compiled separately and can be run with `docker compose exec backend node seed-dist/seed.js` using root `.env` SEED_PASSWORD. It is disabled in production. Production connects to external PostgreSQL solely through DATABASE_URL; see `infra/compose/compose.prod.example.yml`. No provider-specific database code exists.

With the stack running and backend `.env` configured, `npm run smoke` checks MVP-0 plus analytics and cross-user isolation; `npm run smoke:seed` validates demo trend patterns and numeric metrics without altering the seed.

Avance 1 adds AiModule/AiSummaryService, SummaryContextBuilder, vendor-neutral PromptBuilder, AiProvider and deterministic MockAiProvider. The only public AI route is authenticated `GET /api/v1/ai/summary/context`. It returns `{context,prompt,providerConfigured:false}`, performs no generation and writes no summaries. Owner filtering and calculations stay in AnalyticsModule using one RepeatableRead source snapshot; the context builder explicitly allowlists fields and excludes IDs, notes, identity and secrets. `insufficientHistory` is retained so prompts acknowledge limited data. Titles are JSON data, never instructions.

Set `AI_PREVIEW_ENABLED=true` to enable the technical endpoint; default is false outside local Compose. The production template disables it. `AI_PROVIDER=mock` is the only supported adapter; AI_MODEL/AI_API_KEY remain empty and are not consumed. Mock generation is an internal development seam (no public endpoint), labelled **Development mock only**, and rejects NODE_ENV=production. Preview never invokes it. No provider SDK/API or model selection exists yet.

`AISummary` is a physical scaffold required by PLAN §7.4/ADR-001, with PENDING/COMPLETED/FAILED enum, JSONB snapshot, nullable output/provider/model, UTC period/createdAt, owner FK/cascade and indexes. A CHECK enforces periodStart≤periodEnd. No summary generation lifecycle, persistence service or CRUD API is exposed in Avance 1.

From root, `docker compose exec backend node scripts/smoke.cjs` validates the full HTTP flow including preview and two-user isolation using the container runtime only; synthetic accounts are cleaned up. NODE_ENV=production refuses this script before DB access. Final evidence/checklist: `../harness/codex/MVP2_AVANCE1_REPORT.md`.

API: `/api/v1`. Swagger: `/api/docs` when `SWAGGER_ENABLED=true`. Readiness: `/api/v1/health/ready`. Configuration is validated before startup. Never commit `.env`.
