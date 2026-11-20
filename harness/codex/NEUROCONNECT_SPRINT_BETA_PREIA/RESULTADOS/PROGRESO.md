# PREIA-BETA-READINESS — progreso durable

- Base main/origin/main: `46b4304c563b0234102d79265a79f2292a6605e0` (fetch verificado).
- Rama: `sprint/pre-ia-beta`; fecha local: 2026-11-19, America/Tijuana.
- Cambios humanos preservados: doce reportes eliminados de su ruta anterior y carpeta `harness/codex/AVANCE_1/` sin seguimiento. No se incluyen en commits del sprint.
- Paquete de entrada versionado sin duplicados canónicos. ADR/anteproyecto/planes permanecen de solo lectura.

| Fase | Estado | Evidencia / gaps | Siguiente paso |
|---|---|---|---|
| 01 | DONE | Core, analytics, soporte y audit existentes. Baseline unit: 5 suites / 70 PASS. Docker inicialmente detenido; Flutter instalado en C:/src/flutter fuera de PATH. | 02 |
| 02 | DONE | Búsqueda título/categoría, cinco filtros y orden por título. Test widget PASS; confirmaciones y sesión existentes conservadas. | 03 |
| 03 | DONE | Métricas y tests temporales existentes conservados; tendencia histórica también en soporte. Flutter: 28 PASS antes del ajuste; suite soporte revalidada aparte. E2E PostgreSQL pendiente de terminación. | 04 |
| 04 | DONE | Owner list/detail; soporte COMPLETED list/detail bajo autorización actual; POST 503 sin persistencia; UI honesta con retry/disclaimer. Backend 78 E2E / 5 suites PASS, 70 unit PASS. | 05 |
| 05 | PARTIAL | Parches compatibles: audit 15→3 high, un advisory tooling residual; unit71 PASS. Analyze PASS y a11y 3 PASS tras corregir AppBar. APK exit1: Android SDK ausente; iOS estructural, sin Xcode. | 06 |
| 06 | IN_PROGRESS | Runbooks, workflow manual sin CD y backup/restore sintético PASS. Compose build y telemetría segura en validación. | Operación |
| 07 | NOT_STARTED | Smoke/regresión/matriz/handoff. | Cierre único |

## Diagnóstico

- MVP-0/MVP-1/MVP-3 core: ALREADY_DONE por inspección; revalidación en curso, sin reutilizar el 54.7% histórico como medición actual.
- MVP-2: GAP_TO_IMPLEMENT en lecturas/UI, DEFERRED_AI generación y proveedor/modelo. No hay generación pública ni debe añadirse mock visible.
- MVP-4: GAP_TO_IMPLEMENT runbooks, release-check y pruebas accesibilidad; EXTERNAL_HUMAN_ACTION infraestructura pública y aceptación.
- No cambios de esquema, contratos normativos, fórmulas ni arquitectura previstos.

## Validación inicial

- Fase 04 commits `b7c4826`, `ccb3fc6`; tests Flutter summaries 2 PASS tras corregir fixture de fecha inválida.
- Fase 05: `npm ci` y Prisma generate exit0, lint/build exit0, 71 unit PASS; auditorías final/runtime exit1 por 3 high residual. Web build host exit0 (204.9s). Android SDK no disponible (build exit1), no APK/dispositivo probado.
- Fase 06: `node infra/backup-restore-smoke.cjs` exit0; PostgreSQL16, filas completas de seis tablas + migration checksums idénticos. Origen/target de ensayo eliminados, volumen preservado.

- Fase 02 commit `5d92b82`; fase 03 `e96b514`. E2E baseline 73/4 PASS; Flutter baseline+filtros 28 PASS, soporte tras cambio 11 PASS.
- Fase 04: lint/build backend PASS; fixtures solo DB test, proyección exacta, tres identidades, estados PENDING/FAILED no delegados, revocación/expiry/deep links, generación 503. Correcciones locales de analyzer y fechas de fixture en revalidación Flutter.

- Fase 01 commit: `7e88cdf`. Fase 02: lint/build backend exit 0; test nuevo filtros exit 0. Suite Flutter/regresión E2E en ejecución.
- Docker Desktop 29.9.2 iniciado; PostgreSQL 16 saludable; `node infra/setup-test.cjs` exit 0. Flutter 3.47.5 / Dart 3.13.4 disponible con PATH corregido y ejecución fuera del sandbox del SDK.

- `npm test` (backend): exit 0, 70 tests / 5 suites.
- `git fetch origin`: primer intento restringido; reintento autorizado exit 0; main remoto idéntico a local.
- `docker info`: motor no iniciado, se intenta iniciar Docker Desktop sin tocar volúmenes.
- Flutter: PATH del host incompleto; diagnóstico en curso.

## Implementation Decisions

- Filtros/orden locales de presentación sobre datos API; no nuevas reglas de dominio.
- No versionar la reorganización humana de reportes para evitar mezclar autoría.
- Commits por unidad real, sin cuota artificial. SHAs definitivos en reporte final y `git log main..HEAD`.
