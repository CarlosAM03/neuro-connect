# FASE 06 — Preparación verificable del despliegue ADR-007 sin ejecutar proveedores

1. Inspeccionar Dockerfiles/Compose/CI. Preservar Cloudflare Pages para Flutter Web; backend NestJS portable Docker en OCI Always Free como preferencia y Render Free alternativa; Neon PostgreSQL gratuito. Costo obligatorio $0. No reemplazar proveedor ni arquitectura.
2. Validar build Web y backend Docker. Preparar configuración/guía de Flutter Web para Cloudflare Pages y SPA fallback; NestJS health/ready, `prisma migrate deploy`, env production/CORS/Swagger/AI Preview desactivado, no seed demo productivo. Nunca incorporar secretos al código.
3. Crear/actualizar en `docs/operations/`: `DEPLOYMENT-RUNBOOK.md`, `BACKUP-RESTORE-RUNBOOK.md`, `INCIDENT-RUNBOOK.md`, `RELEASE-RUNBOOK.md`, con procedimientos y rollback. No inventar comandos específicos de cuentas no verificadas; incluir verificación humana.
4. Añadir release-check CI sin CD automático y sin costos adicionales. Comprobar no dispara deploy desde PR.
5. Probar backup/restore únicamente en DB local desechable o DB separada; conservar el volumen original. Preparar ejemplo de control de disponibilidad Web/API y logs seguros; no afirmar monitoreo cloud activo.
6. Preparar `OPERACION/DEPLOY_PRIMERA_BETA_CHECKLIST.md` si es necesario, y `RESULTADOS/ACCIONES_EXTERNAS.md`: provisión gratuita, DNS, secretos, CORS, migración, smoke HTTPS, monitoreo, backup, rollback, todo como acciones del responsable tras aceptación.

**No Cloud calls/autodeploy/creación de credenciales.** **Commits:** `build(docker)`, `ci(release)`, `docs(operations)` en unidades revisables. Gate: readiness local más runbooks exactos, con cloud aún NO_VERIFIED. Fase 07.
