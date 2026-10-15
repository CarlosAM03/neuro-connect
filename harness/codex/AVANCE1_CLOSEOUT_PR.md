# chore: close Avance 1 stabilization baseline

## Objetivo y alcance

Cerrar los hallazgos semánticos, de dependencias, CI y documentación posteriores a
MVP-1.5. Base: merge humano PR #4, `d3920d955956263b3baac72d0dd4a350e697df9e`.
Se conserva NestJS/Prisma/PostgreSQL16/Flutter y monolito modular, sin nuevas
funcionalidades, arquitectura o integración de IA real.

## Correcciones

- CHECKIN_VOIDED lee el CheckIn efectivo antes del void y audita voidedProgress y
  resultingGoalProgress, con snapshot y audit en una transacción.40→70→void70
  conserva70 en historial físico y deja Goal40. Activity muestra ambos porcentajes;
  eventos anteriores se leen con mensaje genérico, sin reescribir auditoría.
- averageProgress excluye CANCELLED: ACTIVE80/PAUSED40/COMPLETED100/CANCELLED10
  devuelve73.33; solo cancelados devuelve0. totalGoals incluye todos, completionRate
  conserva elegibilidad. Dashboard y AI Preview consumen Analytics sin recalcular.
- js-yaml de Swagger5.3.0→5.4.3 mediante override menor y acotado. Auditoría por
  advisory y cadena en `docs/security/DEPENDENCY_AUDIT_AVANCE1.md`. Runtime queda
  0moderate/3high: un advisory deepmerge-ts en configuración Prisma, sin ruta HTTP
  en esta implementación, con riesgo residual/mitigación/reevaluación documentados.
  Braces/sprintf de tooling dev sin fix compatible; no major/force/downgrade.
- CI backend/frontend corre en todo push y PR, sin enumerar ramas ni reducir gates.
- Flutter metadata refleja NeuroConnect, conservando versión0.1.0+1.
- README referencia ADR008; ROADMAP distingue plan original/ejecución real y Avance2;
  MVP15_REPORT añade aceptación humana post-merge del bloque anterior; AVANCE-1
  documenta el adelanto explícito MVP1.5 y el cierre técnico sin afirmar IA completa.

## Regresión y reproducibilidad

Baseline antes de código:67 unit,72 E2E,25 Flutter; lint/analyze/builds/migrations/
seed/Docker/Compose/full smoke PASS.

Regresión final y CI: resultados exactos y enlaces en
`harness/codex/AVANCE1_CLOSEOUT_REPORT.md`. Nuevos casos comprueban70/40,73.33,
cancelados-only0, privacidad, no llamada a proveedor/persistencia AISummary,
Activity histórica y Dashboard sin cálculo alternativo. Se conservan pruebas de
append-only SQL, rollback audit, aislamiento, permisos, expiración y revoke/reactivate.
Sin schema/migrations nuevas;4 migrations desde DB vacía y seed doble no destructivo.
Compose construye backend y frontend y valida PostgreSQL/backend/frontend healthy;
smoke ejecutable dentro del container, sin SDK host obligatorio.

## Decisiones y diferidos

actorId==ownerId: DECISION ACCEPTED FOR V1 mientras todas las mutaciones sean
owner-only; trigger de refactor: cualquier mutación con actorId!=ownerId.
release-check.yml DEFERRED→MVP4 por release readiness, incluyendo Android, seguridad,
migrations, artefactos Docker, backup/restore y metadata. Sin tags/releases.
Investigación de modelos, benchmark, matriz, spike, selección, proveedor real,
AISummary productivo/UI IA pertenecen a Avance2. Deployment/Android final/hardening
permanecen pendientes. Audit no queda en cero; excepciones explícitas para revisión.

## Validación humana

Desde raíz, PowerShell:

```powershell
git switch sprint/avance1-closeout
if (-not (Test-Path .env) -and -not (Test-Path backend/.env)) { node infra/setup-local.cjs }
docker compose up -d --build --wait
docker compose exec -T backend node seed-dist/seed.js
docker compose exec -T backend node scripts/smoke.cjs
docker compose ps
```

Abrir http://127.0.0.1:5173 y http://127.0.0.1:3000/api/docs. Revisar Dashboard,
Activity nueva y antigua, flujo privado Owner/Supporter y auditoría de dependencias.
Usar credenciales sintéticas configuradas localmente, sin publicarlas en el PR.
Revisar reporte/CI y mergear solo tras aceptación humana. No auto-merge.

Compare manual:
https://github.com/CarlosAM03/neuro-connect/compare/main...sprint/avance1-closeout?expand=1

El agente no intenta crear este PR, conforme activación del sprint.
