# Incidentes y observabilidad mínima

El responsable opera la beta. Antes de hacer público el sistema configurar monitor
gratuito para Web HTTPS y `/api/v1/health` de API, más comprobación de readiness.
Elegir intervalo conforme cuotas/políticas del proveedor, canal de alerta humano y
probar una alerta. No usar pings para evadir suspensión de Render Free. No hay
monitores o alertas públicos configurados por este sprint.

1. Registrar hora UTC, URL, SHA desplegado, status HTTP y alcance; no headers de
   autorización, bodies, passwords, notas ni DATABASE_URL.
2. Web caída: comprobar Pages/deployment y assets; API caída: health/readiness,
   estado del contenedor, último cambio y conectividad Neon. Readiness 503 con
   health 200 orienta a DB; no elimina datos ni reinicia PostgreSQL arbitrariamente.
3. En VM usar `docker logs --tail 100 neuroconnect-api` y `docker inspect
   --format '{{.State.Status}}' neuroconnect-api`; en Render usar logs del deployment.
   La app escribe errores/status sanitizados a stdout/stderr. Nunca habilitar
   logging de bodies/tokens para diagnosticar. Correlacionar `X-Request-Id` generado
   por servidor con JSON stdout (timestamp/level/requestId/method/path/status/duration).
   path usa la plantilla del router, sin parámetros/query. Un request sin ruta se
   registra como `<unmatched>`. El body de errores conserva su contrato anterior.
4. Si coincide con deploy, aplicar rollback de imagen/estáticos del runbook.
   Si DB comprometida o pérdida: detener escrituras, preservar evidencia privada y
   restaurar a DB nueva según BACKUP-RESTORE-RUNBOOK; no borrar auditoría.
5. Si secreto expuesto: responsable revoca/rota en proveedor, reemplaza env y
   reinicia instancias; JWT rotado invalida sesiones. No pegar el secreto al issue.
6. Validar health + readiness + flujo A/B + revocación; documentar causa, impacto,
   tiempos y corrección sin datos personales. Solo el humano confirma recuperación.

No incluir backups, .env ni logs de acceso con tokens en evidencia pública. Sin
telemetría de terceros añadida y sin almacenamiento nuevo de datos de usuario.
