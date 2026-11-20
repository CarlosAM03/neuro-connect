# PREIA-BETA-READINESS — progreso durable

- Base main/origin/main: `46b4304c563b0234102d79265a79f2292a6605e0` (fetch verificado).
- Rama: `sprint/pre-ia-beta`; fecha local: 2026-11-19, America/Tijuana.
- Cambios humanos preservados: doce reportes eliminados de su ruta anterior y carpeta `harness/codex/AVANCE_1/` sin seguimiento. No se incluyen en commits del sprint.
- Paquete de entrada versionado sin duplicados canónicos. ADR/anteproyecto/planes permanecen de solo lectura.

| Fase | Estado | Evidencia / gaps | Siguiente paso |
|---|---|---|---|
| 01 | DONE | Core, analytics, soporte y audit existentes. Baseline unit: 5 suites / 70 PASS. Docker inicialmente detenido; Flutter instalado en C:/src/flutter fuera de PATH. | 02 |
| 02 | IN_PROGRESS | Faltan filtros/orden de objetivos. Revisar sesión y confirmaciones existentes. | Core/UX |
| 03 | NOT_STARTED | Preservar fórmulas 28 días; regresión PostgreSQL/privacidad. | Soporte/audit |
| 04 | NOT_STARTED | Lectura summaries delegada devuelve [] fijo; no UI owner. | Contratos seguros/UI sin LLM |
| 05 | NOT_STARTED | a11y, dependencia audit, Android, iOS. | Calidad |
| 06 | NOT_STARTED | Faltan runbooks y release-check. | Operación |
| 07 | NOT_STARTED | Smoke/regresión/matriz/handoff. | Cierre único |

## Diagnóstico

- MVP-0/MVP-1/MVP-3 core: ALREADY_DONE por inspección; revalidación en curso, sin reutilizar el 54.7% histórico como medición actual.
- MVP-2: GAP_TO_IMPLEMENT en lecturas/UI, DEFERRED_AI generación y proveedor/modelo. No hay generación pública ni debe añadirse mock visible.
- MVP-4: GAP_TO_IMPLEMENT runbooks, release-check y pruebas accesibilidad; EXTERNAL_HUMAN_ACTION infraestructura pública y aceptación.
- No cambios de esquema, contratos normativos, fórmulas ni arquitectura previstos.

## Validación inicial

- `npm test` (backend): exit 0, 70 tests / 5 suites.
- `git fetch origin`: primer intento restringido; reintento autorizado exit 0; main remoto idéntico a local.
- `docker info`: motor no iniciado, se intenta iniciar Docker Desktop sin tocar volúmenes.
- Flutter: PATH del host incompleto; diagnóstico en curso.

## Implementation Decisions

- Filtros/orden locales de presentación sobre datos API; no nuevas reglas de dominio.
- No versionar la reorganización humana de reportes para evitar mezclar autoría.
- Commits por unidad real, sin cuota artificial. SHAs definitivos en reporte final y `git log main..HEAD`.
