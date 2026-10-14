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

E2E requires `TEST_DATABASE_URL` pointing to a separate PostgreSQL database whose name ends in `_test`. The suite applies migrations and cleans up its own synthetic accounts. It never truncates the development database. Setup and verified results are recorded in `../harness/codex/MVP0_REPORT.md`.

API: `/api/v1`. Swagger: `/api/docs` when `SWAGGER_ENABLED=true`. Readiness: `/api/v1/health/ready`. Configuration is validated before startup. Never commit `.env`.
