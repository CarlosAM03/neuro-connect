# FASE 02 — Consolidación del núcleo Flutter y backend

Objetivo: cierre real de experiencia Owner sin cambiar dominio.

1. Corroborar en código y pruebas Auth, Profile, Goals, CheckIns, snapshots, estados y validaciones. Preservar `CANCELLED`/reactivate/void/auditoría del ADR-008; no reimplementar módulos completos si funcionan.
2. Completar errores funcionales demostrables y UX: filtros `Todos/Activos/Pausados/Completados/Cancelados`, ordenamientos con datos disponibles, mensajes de errores comprensibles, empty/loading/retry, confirmaciones antes de operaciones reversibles o sensibles y sync UI↔API tras writes.
3. Validar deep links/session restore/logout, URL de API por configuración, comportamiento de cookies/token ya decidido; no rediseñar autenticación.
4. Ajustar tests backend y Flutter por cada slice. Casos: progreso inicial siempre 0, check-in solo ACTIVE, 100% ≠ completed, delete físico prohibido, void recalcula snapshot, cancel reactiva sin pérdida, ownership A≠B, no false success UI.
5. Documentar cambios y limitaciones sin cambiar textos normativos. Tests y builds razonables antes de commits.

**No incorporar:** metas recurrentes, recordatorios, nuevas tablas, reglas de prioridad/comportamiento que no estén en ADR, notificaciones. **Commits sugeridos:** `fix(core): ...`, `feat(ui): add goal status filters`, `fix(check-ins): ...`, `test(core): ...`. No cuota artificial.

**Gate de fase:** un usuario puede completar todo el flujo core de manera local; las reglas de dominio se mantienen; pruebas pasan o sus fallos quedan claramente clasificados. Registrar en `RESULTADOS/PROGRESO.md` y avanzar a FASE 03.
