# feat: implement NeuroConnect MVP-1 analytics and dashboard

Implementa Goal/CheckIns → Analytics determinístico → dashboard/gráfica temporal, preservando MVP-0 y aislamiento entre usuarios. Rama mvp1 basada en main fd371d0c1ac552d383ddd95465e5bc1093048cae (PR #1 integrado).

- Backend: AnalyticsModule read-only con overview/análisis por Goal, ventana28d, inactividad7d, cuatro tendencias, historial insuficiente, timeline UTC y Swagger. Ownership/404, proyección sin notes/identidad, sin persistencia analítica ni IA.
- Flutter: seguimiento con API real, selección de gráfica fl_chart, tendencias, análisis/timeline, navegación responsive y estados loading/vacío/error/retry/insuficiente.
- Docker: artefactos independientes, Nginx sin root/SPA fallback, seed compilado. Compose levanta PostgreSQL16/backend/frontend y aplica migrations con `docker compose up -d --build --wait`.
- Producción: plantilla sin DB container; DATABASE_URL estándar hacia PostgreSQL externo; API_BASE_URL pública configurable en build. Sin deployment público/servicios pagados.
- Validación local: lint/build backend,34 unit tests/48 E2E PostgreSQL real; Flutter analyze/15 tests/build Web; ambos Docker builds; Compose healthy; migration DB vacía; seed×2; HTTP/seed smoke y navegador con gráfica35→65/fixture70→40/vacío/insuficiente/error-retry/restore/logout/regresión Goals-CheckIns. CI conserva gates y añade mvp1/frontend Docker build.
- Límites: Android/iOS/deployment productivo no ejecutados; Analytics recorre historial completo/dashboard consulta por Goal; IA/red de apoyo/hardening fuera.

Reporte, reglas, evidencias y checklist: `harness/codex/MVP1_REPORT.md`.

Validación humana: configurar .env desde ejemplo, ejecutar comando Compose y abrir http://localhost:5173 / Swagger http://localhost:3000/api/docs. Seed opcional `docker compose exec backend node seed-dist/seed.js`; demo usa SEED_PASSWORD local. Nueva cuenta→Goal→CheckIns35/65/40→dashboard/chart/tendencias/lifecycle/reload/logout; comprobar aislamiento con segundo usuario. `docker compose stop` conserva volumen.

Destinado a revisión y merge manual; sin auto-merge.
