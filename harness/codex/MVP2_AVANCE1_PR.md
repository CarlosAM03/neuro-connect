# feat: close Avance 1 with AI pipeline foundation

Cierra técnicamente el alcance de Avance1 sobre main dcc91e24fdf5ad338159e67cb72374eb805f2a78 (PR#1/#2 integrados): MVP-0/MVP-1 conservados y MVP-2 iniciado, sin proveedor generativo real ni modelo seleccionado.

- Estabilidad: validada la baseline antes de IA (34 unitarias/48E2E/15Flutter + Compose/seed/smokes/navegador). Recuperado Docker Desktop de un socket IPC obsoleto sin reset de datos; sin refactor amplio ni regresiones funcionales detectadas.
- AiModule/AiSummaryService, SummaryContextBuilder sobre Analytics real/snapshot de owner, whitelist sin identidad/IDs/notas/credenciales y flag insufficientHistory.
- PromptBuilder SYSTEM/USER con JSON, reglas no clínicas, no invención/recalcular métricas y títulos tratados como datos; AiProvider vendor-neutral y MockAiProvider determinístico **Development mock only**, sin red y bloqueado en producción.
- Único endpoint IA: GET /api/v1/ai/summary/context, JWT+feature flag, contexto/prompt y providerConfigured=false; no invoca proveedor ni persiste. Solo API/Swagger conforme ADR-004, sin pantalla final IA.
- AISummary scaffold físico requerido por PLAN§7.4/ADR-001: migration, enum, JSONB, UTC, nullable output/metadata, owner FK/índices y periodo válido. Sin lifecycle/CRUD productivo.
- Validación final local: backend lint/build,58 unitarias/57E2E PostgreSQL real; Flutter analyze/15tests/build Web; Docker backend/frontend, Compose healthy, cadena2migrations desde DB vacía, seed y smoke containerizado completo/aislamiento. Navegador gráfico35→65, restore/logout, Swagger401 y preview autenticado minimizado.
- Docker mantiene un comando local, artefactos independientes y DATABASE_URL externa en plantilla productiva; smoke dentro de backend sin Node/Flutter en host. CI conserva gates y habilita rama mvp2-avance1 sin claves AI.
- Documentación: docs/AVANCE-1.md con seis secciones académicas/validación del autor pendiente; reporte/evidencia reproducible en harness/codex/MVP2_AVANCE1_REPORT.md y docs/evidence/avance1/.
- Diferido: evaluación ADR-005, proveedor/modelo/benchmark real, lifecycle/persistencia/historial/UX final IA, red de apoyo y hardening/deployment. No MVP-2 DONE ni aceptación humana declarada.

Validación humana: configurar .env desde ejemplo; `docker compose up -d --build --wait`; seed `docker compose exec backend node seed-dist/seed.js`; smoke `docker compose exec backend node scripts/smoke.cjs`. Abrir http://localhost:5173 y Swagger http://localhost:3000/api/docs, revisar Goal/CheckIns/Analytics/dashboard y GET/ai/summary/context con JWT propio. `docker compose stop` conserva volumen. Checklist y resultados CI en el reporte.

PR para revisión/merge manual; sin auto-merge.
