# Gates de aceptación y Definition of Done sin IA

## G0 — Entrada segura

- Rama `sprint/pre-ia-beta` desde main sin modificaciones ocultas; SHA de partida, cambios locales y path del paquete identificados.
- Fuente canónica y baseline freeze disponibles; contradicciones documentadas.
- Plan por fases y reporte de estado creados. Cambios previos no se descartan.

## G1 — Núcleo y experiencia

- Auth, perfil, Goals, CheckIns y Activity funcionan sobre datos reales.
- Listas con estados ACTIVE/PAUSED/COMPLETED/CANCELLED y búsqueda/ordenamiento/filtro ligeros donde aporten valor y no cambien reglas.
- Confirmaciones y feedback de operaciones; loading/error/empty/retry.
- Reapertura/cancelación/void no destruyen historia; progreso histórico y actual consistentes.

## G2 — Analítica, privacidad y soporte

- Analytics 28d y tendencias iguales al backend; no fórmulas duplicadas en Flutter.
- Pruebas owner A, supporter B, tercero C con combinaciones de permisos, revocación y expiración. Notes/audit privadas y no writable.
- Respuestas API mínimas; todas las lecturas son sensibles a relación actual, no al estado pasado cacheado.

## G3 — Seam IA

- Frontend preparado para list/detail/error con feature no disponible sin proveedor; sin falsos textos generativos.
- `AiProvider` / `SummaryContextBuilder` sin filtraciones; mock solo test/development aislado.
- `VIEW_SUMMARIES` proyección testeable con summaries COMPLETED fixture, sin Snapshot ni notes; DoD final del modelo no se simula.

## G4 — Calidad y seguridad

- Backend lint/test/e2e/build y Flutter analyze/test/Web build verdes o límites de entorno demostrados.
- E2E de core/analytics/support/audit y casos negativos.
- Accesibilidad contrast/text scale/focus/touch/semantics; responsive.
- Dependencias auditadas sin upgrade incompatible ni hallazgos críticos ignorados.
- APK Android e instalación/ejecución cuando existan SDK y dispositivo; si no, registrar no verificable.

## G5 — DevOps/operación

- Compose local real sin depender de LLM ni internet; migraciones/seed controlados y persistencia.
- Dockerfile y Web build aptos para topologías A/B ADR-007; Cloudflare Pages, OCI/Render y Neon únicamente en runbook, no provisión.
- `docs/operations` con runbooks; release-check sin despliegue automático; variables de producción enumeradas sin secretos; backup/restore ensayado sobre DB de prueba.

## G6 — Handoff humano

- Reporte final, pendientes, enlaces de commits (si existen), decisiones menores, comandos exactos, resultados/gates, evidencia de smoke Codex y checklist humano.
- Rama y working tree controlados; no merge, no PR ni tag ni release sin aprobación; no declarar deploy público verificado.
- Estado HARNESS explícito y honesto. Si hay pendientes humanos, se consignan como `EXTERNAL_HUMAN_ACTION`, no se esconden.

## Cierre no equivale a release

Este sprint puede quedar `READY_FOR_HUMAN_VALIDATION` aunque `M2-11..40` siga pendiente de IA y el primer despliegue público todavía requiera operación humana. El proyecto académico v1.0.0 seguirá formalmente incompleto.
