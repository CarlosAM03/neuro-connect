# Bloque 3 — estabilidad e inicio MVP-2

- Block: cierre técnico Avance 1.
- Branch: mvp2-avance1, creada directamente de origin/main después de fetch y fast-forward local seguro.
- Base commit: dcc91e24fdf5ad338159e67cb72374eb805f2a78, merge humano PR #2; PR #1 también presente.
- Final commit: pendiente.
- Status: IN_PROGRESS.

## Stabilization performed

Baseline antes de IA: lint/backend34unitarias/build PASS; Flutter analyze/15tests PASS; Compose tres servicios healthy,48E2E PostgreSQL real,seed y smokes MVP-0/MVP-1/aislamiento2usuarios/seed PASS. Navegador register/login/vacío/Goal/CheckIn35/snapshot/history/Analytics/insuficiente/gráfica PASS. No cambios de aplicación previos a validar regresión horizontal. Sin defectos funcionales detectados en esta baseline.

Docker Desktop no iniciaba por engine.sock IPC obsoleto (cero bytes, reparse point). Diagnóstico corroborado con log local y https://github.com/docker/for-win/issues/15064. Docker detenido mediante CLI; directorio que contenía SOLO ese socket preservado como C:/Users/Carl0/AppData/Local/docker-secrets-engine.mvp2-avance1-backup-20261014, sin borrar ni leer secretos/volúmenes. Docker recreó el directorio y engine29.8.1 volvió a responder. No reset de fábrica ni actualización manual.

## Implementation Decisions (documentales, pendientes de implementación)

- AISummary scaffold requerido físicamente por PLAN §7.4 y ADR-001 §§27–33: schema/migration/índices/FK, sin generar/persistir resúmenes desde preview ni exponer CRUD productivo.
- AI Preview exclusivamente API/Swagger, sin nueva pantalla Flutter: ADR-004 §119 y plan §26.
- Preview requiere JWT, owner actual y AI_PREVIEW_ENABLED; providerConfigured=false. Sin proveedor real, API key ni benchmark.
- SummaryContextBuilder consume Analytics, proyecta whitelist de métricas/títulos/estado y flag insufficientHistory; no notes, email, IDs ni credenciales.
