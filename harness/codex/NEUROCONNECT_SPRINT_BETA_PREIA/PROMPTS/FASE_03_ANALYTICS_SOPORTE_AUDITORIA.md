# FASE 03 — Analítica determinística, auditoría y red de apoyo

1. Ejecutar regresión de Analytics overview/por Goal; 28 días, tendencias, `eligibleGoals`, `CANCELLED`, `voidedAt`, sin duplicar cálculos en Flutter. Cubrir días sin historial, timestamps UTC, valores límite y timeline.
2. Mejorar UX de dashboard/gráfica/historial/Activity sin añadir nuevas fórmulas ni métricas de negocio no autorizadas. Estado empty, loading, retry, fecha/timezone presentada adecuadamente.
3. Verificar y corregir soporte con tres cuentas A/B/C: relación por email existente, dependencia de permisos, expiración/revocación/reactivación, cuatro estados Goal, deny de progress si no autorizado, notes y AuditEvent owner-only y todas las mutaciones de supporter prohibidas.
4. Verificar consistencia bajo concurrencia o refresh; la API autoriza cada request, no confía en flags Flutter ni conserva vista delegada tras pérdida de acceso. Asegurar auditoría append-only y transacciones mutación/evento.
5. Agregar tests de regresión y E2E con PostgreSQL real. No ampliar modelo de permisos ni interpretar supporter como rol global.

**Commits:** slices por analytics/Activity/support/privacy/tests; no generar mega commit. **Gate:** Owner↔Supporter read-only demostrable con backend real y pruebas negativas. Registrar evidencia; avanzar FASE 04.
