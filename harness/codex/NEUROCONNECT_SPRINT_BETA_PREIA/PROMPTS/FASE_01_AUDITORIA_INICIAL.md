# FASE 01 — Auditoría de baseline y preparación segura del bloque

**Entrada:** repositorio completo, HARNESS, fuentes oficiales, SPEC. **Salida:** inventario de gaps y primera traza durable, rama lista para desarrollo.

1. Leer documentación canónica y `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md`; registrar diferencias de prioridades si los ADR actuales contradicen el plan. Inspeccionar `git status`, SHAs, branches, estructura de código y tests; no perder cambios locales del humano.
2. Crear/reutilizar de forma segura `sprint/pre-ia-beta` desde main; NO editar main, no rebase destructivo. Versionar specs/prompts del paquete si procede (fuentes duplicadas en `contexto/fuentes-originales` están ignoradas).
3. Auditar módulos/rutas/Flutter widgets/schemas/migrations/CI/Compose/runbooks existentes, y test baseline. No hacer refactor por gusto. Inspeccionar `backend/package.json`, `app/pubspec.yaml`, `compose.yaml` antes de dictar comandos; usar versiones reales.
4. Registrar en `RESULTADOS/PROGRESO.md` diagnóstico por MVP y por componente, con `ALREADY_DONE`, `GAP_TO_IMPLEMENT`, `DEFERRED_AI`, `EXTERNAL_HUMAN_ACTION`, `DECISION_REQUIRED`, problemas de CI y limitaciones; mapear a la matriz `SPEC/03_ALCANCE_Y_TRAZABILIDAD.md`.
5. Definir secuencia incremental de cambios según dependencias reales; documentar contradicciones o decisiones bloqueantes sin inventar. Preparar los reportes desde plantillas.

**Gates:** se entiende qué existe y qué falta; ningún dato/branch original alterado; tests iniciales ejecutados o limitación clara; siguiente fase puede comenzar. **Commits sugeridos:** `docs(preia): add autonomous beta sprint specification`; `docs(preia): record initial code and test audit`. No commits vacíos.

Si vienes de ACTIVAR SPRINT COMPLETO, al terminar continúa directamente con FASE 02.
