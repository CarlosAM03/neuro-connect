# MVP-1 — reporte operativo

## Block / Branch / Base commit / Final commit / Status

- Block: Bloque 2 — MVP-1 Analytics + Dashboard + Trends + Charts + Tests y containerización autorizada.
- Branch: `mvp1`, creada directamente desde `origin/main` después de fetch y de verificar remote, árbol limpio, historia y merge humano PR #1 MVP-0.
- Base commit: `fd371d0c1ac552d383ddd95465e5bc1093048cae`.
- Final commit: commit documental final que contiene este reporte, resoluble con `git log -1 --format=%H -- harness/codex/MVP1_REPORT.md`. Implementation commit validado: `7c11ec95b8d3ba18358e6fed8eb3e5d3f995107a`. Un hash de commit no puede incorporarse dentro de su propio contenido.
- Status técnico: `READY_FOR_HUMAN_VALIDATION`. Entrega GitHub: pendiente de push/PR al completar handoff. No merge ni auto-merge.
- Validación: 2026-10-14; Windows, Docker Desktop Linux containers, PostgreSQL16, Node22.16.0, Flutter3.47.5/Dart3.13.4.

## Scope / Implemented / Not implemented

Implementados AnalyticsModule/REST/OpenAPI, reglas puras, ownership, Dashboard Flutter/API real, tendencias, gráfica fl_chart, timeline accesible, estados UI, tests/regresión, Docker frontend/backend, Compose local completo y plantilla productiva con DB externa.

No implementados MVP-2/IA, AiModule, SummaryContextBuilder, LLM, SupportNetwork, permisos delegados, deployment público, monitoreo/backup productivo, hardening MVP-4 ni builds Android/iOS. ADRs/HARNESS/roadmap/plan intactos. Sin contradicción documental bloqueante. El refinamiento Docker fue explícitamente autorizado por el humano y es compatible con ADR-007.

## Regression status MVP-0

Pasaron las 35 pruebas E2E previas, 13 unitarias previas y 10 tests Flutter previos adaptados a la nueva ruta autenticada. Smoke HTTP mantiene register/login/profile/CRUD/lifecycle/CheckIns/progress/history/ownership con dos usuarios. Navegador verificó register/login, crear Goal, dos CheckIns, snapshots35→65, historial, perfil, restore al recargar y logout. PAUSED/COMPLETED y eliminación siguen cubiertos por E2E/smoke. Foundation no se reimplementó. MVP-0: regresión verificada.

## Analytics implementation / Backend changes

`backend/src/analytics/`: controller, response DTOs Swagger, servicio, módulo y reglas puras con tests; AppModule importa AnalyticsModule, que exporta AnalyticsService para compatibilidad futura sin consumidores IA.

Endpoints privados JWT: `GET /api/v1/analytics/overview` y `GET /api/v1/analytics/goals/:goalId`. UUID validado en backend. Queries filtran ownerId; ajeno/inexistente responde404. Proyección explícita de Goal.id/status/progress y CheckIn.progress/difficulty/createdAt, sin notes/email/passwordHash/JWT. Lecturas RepeatableRead mantienen snapshot/historial coherentes. Analytics no escribe datos ni persiste derivados.

Overview: totalGoals, activeGoals, pausedGoals, completedGoals, completionRate, averageProgress, checkInsLast28Days, checkInFrequencyPerWeek, inactiveGoals. Goal: goalId, currentProgress, previousProgress, progressDelta, averageDifficulty, totalCheckIns, checkInsLast28Days, daysSinceLastCheckIn, trend, insufficientHistory, timeline `{date,progress}`. Contratos disponibles en `/api/docs-json` y Swagger `/api/docs`.

## Analytics formulas/rules actually implemented

| Indicador | Fórmula/regla |
|---|---|
| completionRate | COMPLETED/todos los Goals×100; sin Goals:0 |
| averageProgress | Media de snapshot de todos los estados; sin Goals:0 |
| currentProgress | Goal.progress actualizado por dominio CheckIn |
| previousProgress | Penúltimo CheckIn; menos de dos:null |
| progressDelta | currentProgress−previousProgress; sin anterior:null |
| averageDifficulty | Media de TODO el historial; vacío:null |
| checkInsLast28Days | Conteo en intervalo cerrado [now−28×24h,now] |
| checkInFrequencyPerWeek | Conteo global de28d/4 |
| daysSinceLastCheckIn | floor de tiempo UTC transcurrido/24h; vacío:null |
| inactiveGoals | ACTIVE sin registros o último hace más de7×24h |
| trend | ACTIVE INACTIVE tiene precedencia; delta≥5 PROGRESSING; ≤−5 DECLINING; resto STABLE |
| insufficientHistory | Menos de dos registros, incluidos cero |
| timeline | Historial completo createdAt asc, empate estable por id en query, ISO UTC |

PAUSED/COMPLETED nunca cuentan como inactivos y conservan delta histórico, mostrado como «Tendencia histórica». Sin delta: STABLE+insuficiente; ACTIVE sin historial o con único registro antiguo puede ser INACTIVE+insuficiente. Medias/porcentajes redondeados a dos decimales en backend. Frontend formatea/traduce etiquetas; no recalcula tendencias. `now` explícito en reglas puras, un instante por cálculo del servicio.

## Frontend changes / Dashboard implementation / Chart implementation

Feature analytics: modelos tipados, repositorio Dio, providers Riverpod, DashboardPage, GoalAnalyticsPage, ProgressChart/TrendSummary. `/dashboard` es entrada autenticada; NavigationRail desktop y NavigationBar compacta integran seguimiento/objetivos/perfil. Detalle Goal enlaza análisis.

Dashboard muestra activos/completados/progreso promedio/check-ins recientes, total/pausados/cumplimiento/frecuencia/inactivos, selector de Goal para gráfica y tarjetas de tendencias con navegación. API real sin valores hardcoded. Loading/error/retry/vacío/insuficiente explícitos. Identidad controla providers privados; logout elimina contenido privado.

fl_chart: porcentaje0–100 vertical, tiempo real transcurrido horizontal con fechas, puntos y segmentos rectos. Vacío no fabrica puntos; un registro muestra punto+insuficiente. Timeline textual con fechas/horas/porcentajes como alternativa accesible. API/reglas usan UTC; fechas UI se presentan en horario local. Terminología descriptiva no clínica.

## Database changes / Migrations / Seed

Sin cambios de schema ni nuevas migrations. Preservada `20261014000100_mvp0_core`; aplicada a una base PostgreSQL recién creada y vacía `_test`, verificadas tablas User/Goal/CheckIn vacías y eliminada SOLO esa base temporal. E2E utiliza neuroconnect_test separada del desarrollo.

Seed académico preservado: demo@neuroconnect.local, tres Goals y15 CheckIns. Series [10,20,35,45,60], [45,46,45,46,47], [10,20,25,30,35], fechas relativas UTC originales: PROGRESSING/STABLE/INACTIVE. Ejecutado dos veces dentro del contenedor, comprobados3 Goals/15 registros, averageProgress47.33 y frecuencia según fechas efectivas. El registro de28d entra/sale al pasar mediodía UTC; seed-smoke calcula expectativa desde timestamps, sin alterar dataset.

Seed compilado separado a seed-dist/seed.js para runtime sin tsx. Mantiene bloqueo en NODE_ENV=production; no se ejecuta al iniciar. Setup local comparte SEED_PASSWORD entre raíz/backend ignorados y nunca imprime valores. Configuración existente preservada.

## Docker backend / Docker frontend / Compose topology

Backend multi-stage Node22.16.0 bookworm-slim, Prisma/OpenSSL, build TypeScript+seed, prune devDependencies, usuario node UID1000. Compose aplica migrations antes del arranque y exec transmite señales.

Frontend app/Dockerfile: SDK desde tag Git oficial Flutter3.47.5, lockfile enforced, release Web con assets locales sin CDN, runtime nginxinc/nginx-unprivileged:1.28-alpine, UID101/puerto8080. No SDK/tooling runtime. Nginx healthz200, fallback SPA try_files, index/bootstrap no-store y main.js no-cache. Dockerignore excluye caches/build/env y plataformas móviles del contexto Web.

Compose: PostgreSQL16 healthy → backend readiness healthy → frontend healthy; tres servicios por defecto sin profile. DB5434/API3000/frontend5173 expuestos en loopback, volumen PostgreSQL persistente. Secrets fuera del repositorio; .env.example vacío.

## Local one-command execution

En checkout nuevo: copiar .env.example a .env y configurar POSTGRES_PASSWORD, JWT_SECRET aleatorio≥32 caracteres y SEED_PASSWORD. Desde raíz con Docker/Compose:

```sh
docker compose up -d --build --wait
```

No requiere Node/Flutter locales para consumir stack. Migrations antes de readiness. Seed optativo: `docker compose exec backend node seed-dist/seed.js`. Frontend http://localhost:5173; API http://localhost:3000/api/v1; Swagger http://localhost:3000/api/docs. Primera build descarga SDK/dependencias y siguientes reutilizan caché.

## Production container strategy / DATABASE_URL strategy

Artefactos independientes. infra/compose/compose.prod.example.yml contiene frontend/backend, sin DB ni volumen DB. Backend localiza PostgreSQL externo exclusivamente mediante DATABASE_URL estándar+Prisma, sin lógica de proveedor. Plantilla productiva desactiva Swagger; recibe JWT_SECRET/CORS_ORIGINS/API_BASE_URL externos. API_BASE_URL HTTPS se incorpora en build, exige rebuild al cambiar; local apunta localhost3000 del navegador, nunca DNS backend. Ingress/TLS del hosting futuro. Plantilla validada con config --quiet/valores sintéticos; sin deployment ni conexión a DB productiva contratada.

## Dependencies added / Implementation Decisions

Sin dependencias npm/pub nuevas; fl_chart ya estaba fijado por Foundation. Añadidos artefacto Nginx, tsconfig seed y script smoke:seed. No se modificaron reglas dominio/ADR. Imagen Flutter precompilada y archivo SDK intentados no disponibles; resuelto con build del tag oficial, validado exitosamente. No se extraen/reutilizan credenciales GitHub: bloqueo del conector se limita a entrega PR conforme a activación.

## Tests executed / Test results / Build results

| Gate ejecutado | Resultado |
|---|---|
| backend npm run lint | PASS, también con nuevos smokes |
| backend npm test | PASS34 tests/3 suites:21 Analytics+13 previos |
| backend npm run test:e2e | PASS48 tests/2 suites PostgreSQL real:13 Analytics+35 previos |
| backend npm run build | PASS |
| flutter analyze --no-pub | PASS no issues, dependencias resueltas previamente |
| flutter test --no-pub | PASS15 tests:5 Analytics+10 previos |
| flutter build web --no-pub --dart-define=API_BASE_URL=http://localhost:3000/api/v1 | PASS |
| docker build -t neuroconnect-backend:mvp1 ./backend | PASS |
| docker build -t neuroconnect-frontend:mvp1 ./app | PASS |
| docker compose up -d --build --wait | PASS inicialmente y con imágenes finales |
| Migration PostgreSQL vacío | PASS1 migration/tablas vacías |
| Seed contenedor×2 | PASS dataset reproducible |
| npm --prefix backend run smoke | PASS dos usuarios/limpieza propia/stack final |
| npm --prefix backend run smoke:seed | PASS tres tendencias y métricas |
| Config prod/healthz/fallback/Swagger | PASS |
| git diff --check | PASS |

Casos cubiertos:0/1/múltiples registros,±5/estabilidad/inactividad y precedencia,7/28d límites, UTC/días completos, dificultad y métricas globales, ACTIVE/PAUSED/COMPLETED, timeline ordenada/no mutación, JWT/UUID/404/ownership. Flutter integra repository/provider/UI y cubre métricas/chart/navegación/loading/vacío/error-retry/insuficiente histórico/logout.

Fallos corregidos: expectativa E2E contaba7 en vez de8 (registro inactivo10d también entra en frecuencia28d); corregida expectativa preservando reglas. Tests Flutter adaptaron scroll del historial y sincronización de carga inicial; lints de llaves corregidos. Gates afectados reejecutados hasta verde, sin eliminar tests/requisitos.

CI mantiene gates anteriores, agrega trigger mvp1 y Docker frontend. Resultado remoto aún no reclamado antes de publicar; consultar Actions del commit publicado. Sin deployment CI.

## Docker validation / Smoke test results / Browser validation results

Tres servicios healthy; UID1000 backend/UID101 frontend comprobados. healthz, fallback /goals/example/analytics y Swagger respondieron200. Assets servidos por frontend container, API y DB también containerizados.

HTTP: register→login→profile→CRUD/lifecycle→CheckIns→snapshots/history→overview→goal analytics/timeline→PROGRESSING/DECLINING→aislamiento2usuarios→cleanup. Seed smoke comprobó PROGRESSING/STABLE/INACTIVE sin modificar significado.

Navegador IAB real en127.0.0.1:5173 contra APIcontainerlocalhost3000 y PGcontainer: cuenta sintética register/login→dashboard vacío→crear Goal→CheckIn35→punto/insuficiente→CheckIn65→overview65.00%/2registros/frecuencia0.50/gráfica creciente→reload/restore→navegación/análisis/perfil/logout. Se detuvo SOLO backend; Actualizar mostró error y Reintentar; comando completo restauró backend y Reintentar recuperó datos.

Fixtures adicionales del mismo usuario: copias de historias seed (original intacto) y Goal70→40. UI mostró DECLINING/current40/previous70/delta−30 y timeline; dashboard mostró STABLE/INACTIVE en historias copiadas. Desktop1280×900 NavigationRail; compacto NavigationBar; override restablecido. Cuenta temporal y cinco Goals/19 CheckIns limpiados por filtro exacto email/displayName; demo permanece. Smokes limpian solo sus propias cuentas. Base vacía temporal eliminada, volumen conservado.

Evidencias sin credenciales/datos reales: docs/evidence/mvp1/dashboard-browser.png (35→65) y declining-browser.png (70→40).

## Files changed

- backend/src/analytics/{analytics.module,analytics.controller,analytics.dto,analytics.service,analytics.rules,analytics.rules.spec}.ts; backend/src/app.module.ts.
- backend/test/e2e/analytics.e2e-spec.ts; backend/test/{smoke,seed-smoke}.cjs; backend/package.json.
- app/lib/features/analytics/{analytics_repository,analytics_providers,dashboard_page,goal_analytics_page,progress_chart}.dart; app/lib/app/app.dart; app/lib/core/widgets/page_frame.dart; app/lib/features/goals/goal_detail_page.dart; app/test/{analytics_test,widget_test}.dart.
- app/{Dockerfile,.dockerignore,nginx.conf}; backend/{Dockerfile,tsconfig.seed.json}; compose.yaml; .env.example; infra/setup-local.cjs; infra/compose/compose.prod.example.yml.
- .github/workflows/{backend-ci,frontend-ci}.yml; README raíz/backend/app; este reporte; harness/codex/MVP1_PR.md y dos evidencias PNG. Sin cambios de schema/seed académico/ADRs.

## Known limitations / Deviations / Technical debt / Known issues

Sin blocker técnico ni desviación funcional conocida del alcance autorizado. Analytics lee historial completo; dashboard consulta por Goal y refresca mediante navegación/manualmente, sin nuevos polling/paginación. Optimización de volumen futuro. Primera build necesita Internet. Tags/versiones fijados, sin pinning de digests: hardening posterior. Advertencia Prisma package.json config y advisories npm heredadas de MVP-0 siguen como deuda; no audit fix --force.

CI remoto pendiente de observación tras push; Android/iOS y deployment/TLS productivo no ejecutados. DB externa validada conceptualmente/sintácticamente, sin servicio contratado. JWT sin refresh/offline conserva baseline. No cambiar passwords locales con volumen inicializado sin mantener coherencia PostgreSQL. No aceptación humana declarada.

## Human Validation Checklist

Casillas para revisión humana; gates técnicos ya ejecutados arriba.

- [ ] clean checkout works
- [ ] branch based on current main
- [ ] docker compose full stack starts with one command
- [ ] PostgreSQL healthy
- [ ] backend healthy
- [ ] frontend available
- [ ] migrations apply
- [ ] seed works
- [ ] Swagger works
- [ ] MVP-0 register works
- [ ] MVP-0 login works
- [ ] session restore / logout / profile work
- [ ] MVP-0 Goal flow works
- [ ] Goal CRUD / lifecycle / PAUSED and COMPLETED restrictions work
- [ ] MVP-0 CheckIn flow works
- [ ] progress snapshot / history work
- [ ] analytics overview works
- [ ] goal analytics works
- [ ] completionRate correct
- [ ] averageProgress correct
- [ ] checkInFrequency correct
- [ ] PROGRESSING correct
- [ ] STABLE correct
- [ ] DECLINING correct
- [ ] INACTIVE correct
- [ ] insufficientHistory correct
- [ ] dashboard loads real API data
- [ ] chart renders timeline
- [ ] empty state works
- [ ] error/retry works
- [ ] cross-user analytics access denied
- [ ] backend tests pass
- [ ] frontend tests pass
- [ ] backend build passes
- [ ] Flutter Web build passes
- [ ] backend Docker build passes
- [ ] frontend Docker build passes
- [ ] full Compose smoke passes
- [ ] production backend uses DATABASE_URL for external DB
- [ ] production frontend/backend images are independent from DB container

## Exact human smoke commands

Desde checkout mvp1 con .env configurado según README:

```sh
docker compose up -d --build --wait
docker compose ps
docker compose exec backend node seed-dist/seed.js
curl.exe -fsS http://localhost:3000/api/v1/health/ready
curl.exe -fsS http://localhost:5173/healthz
```

Abrir http://localhost:5173 y http://localhost:3000/api/docs. Nuevo usuario: vacío→Goal→progresos35/65→dashboard/analytics/chart→reload/restore. Tercer registro40 demuestra DECLINING; un único registro insuficiente. Pausar/completar rechaza CheckIns. Logout/login demo con SEED_PASSWORD local verifica tres tendencias seed. Segundo usuario comprueba aislamiento. `docker compose stop` conserva datos.

Tests desarrollo: backend/.env coherente con raíz; desde raíz `node infra/setup-test.cjs`; desde backend lint/test/test:e2e/build/smoke/smoke:seed; desde app analyze/test/build web. Comandos completos en README. Node/Flutter locales necesarios para estos tests, no para consumir stack.
