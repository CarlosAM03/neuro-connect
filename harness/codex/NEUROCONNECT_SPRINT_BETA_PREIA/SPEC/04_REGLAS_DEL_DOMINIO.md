# Reglas funcionales intocables y detalles de UX

## Propiedad y autenticación

- Todas las cuentas son `User`. No roles globales `PATIENT`, `SUPPORTER`, `ADMIN` ni datos clínicos de registro.
- Email normalizado a minúsculas; password no disponible en respuestas/logs; Argon2id; JWT Bearer; aislamiento por usuario.
- Restauración de sesión y logout seguros; navegación protegida, estados unknown/unauthenticated/authenticated.

## Goal y CheckIn

- Crear Goal con `ACTIVE`, progreso `0`; metadatos editables según ADR-002; progreso nunca editable directamente por PATCH.
- Estados `ACTIVE`, `PAUSED`, `COMPLETED`, `CANCELLED`; transiciones oficiales ADR-008; `progress=100` no equivale a finalización.
- Solo `ACTIVE` recibe CheckIns. CheckIn: `progress` 0–100; `difficulty` 1–5; `completion` enum y `notes` opcionales, privados.
- CheckIn efectivo cuando `voidedAt == null`; invalidar no elimina la fila; el último efectivo determina snapshot `Goal.progress`; todas las mutaciones + AuditEvent que correspondan transaccionales.
- No borrar físicamente Goal, CheckIn, SupportRelationship ni AuditEvent durante uso normal. No endpoints funcionales destructivos nuevos.

## Analítica

- Backend NestJS es autoridad de métricas. No recalcular indicadores desde Flutter, no inferir diagnóstico, no cambiar umbrales establecidos.
- Considerar `CANCELLED` en conteo total; excluirlo de eligibleGoals para completionRate y averageProgress operativo; no contarlo como INACTIVE. Ignorar CheckIns voided.
- Continuar semántica de `PROGRESSING/STABLE/DECLINING/INACTIVE`, ventana 28 días y casos de historial insuficiente. Probar bordes temporales y fixture determinístico.

## Red de apoyo

- Una misma cuenta puede ser owner y supporter de distintas personas.
- Se invita/autoriza cuenta existente por email exacto, sin directorio de búsqueda, relaciones propias prohibidas, unicidad owner/supporter.
- Permisos `VIEW_GOALS`, `VIEW_PROGRESS`, `VIEW_SUMMARIES`; respetar dependencias y reglas de combinaciones definidas en ADR-008.
- Autorización se valida **en cada request**, según vigencia, revocación, reactivación y permisos. Revocación y expiración niegan acceso inmediatamente, incluyendo deep links y cachés de cliente.
- Vista supporter estrictamente read-only; `CheckIn.notes` y `AuditEvent` owner no se comparten; objetivos `CANCELLED` siguen visibles al soporte que tiene permiso correspondiente.
- `VIEW_SUMMARIES` puede tener UI/API/guard preparados con fixtures aislados; no marcar DONE su E2E con resúmenes reales hasta conectar IA.

## Auditoría

- `AuditEvent` append-only y owner-only; cargas JSON minimizadas, sin secretos ni notes, acción y mutación atómicas. El historial visible debe ser legible, cronológico, paginado; nada de exponer JSON crudo como experiencia normal.

## Mejoras UX aprobables sin ampliar dominio

Sí: filtros de estados, ordenamientos de objetivos por campos ya existentes, loading/error/retry/empty, validación de formularios, accesibilidad, confirmaciones para operaciones críticas, indicadores de actualización derivados de timestamps existentes, navegación y diseño responsive. No crear nuevos catálogos, notificaciones, gamificación, tareas, horarios, historial clínico, mensajes o cambios en permisos sin aprobación.

## Escenarios obligatorios

Owner A crea metas y check-ins, cancela otra; B sin relación no ve A; A autoriza B VIEW_GOALS, B ve cuatro estados sin progreso restringido; A concede VIEW_PROGRESS, B ve lo autorizado sin notes; A revoca y B pierde acceso; nueva autorización o expiración se valida; A ve historial de auditoría; invalidación restaura progress correcto sin borrar historia.
