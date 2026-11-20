# Infraestructura y despliegue: ADR-007 se conserva intacto

## Topologías aprobadas (NO NEGOCIABLE)

**Topología A preferida cuando exista capacidad:** Flutter Web en **Cloudflare Pages**; API NestJS en contenedor Docker sobre VM Linux **Oracle Cloud Infrastructure Always Free**; PostgreSQL 16 gestionado gratuito, candidato **Neon Free**. **Topología B alternativa:** Flutter Web en **Cloudflare Pages**, API NestJS Docker en **Render Free**, PostgreSQL 16 **Neon Free**. Usar subdominios gratuitos y TLS.

No insertar Vercel, AWS, Firebase, Azure ni otro proveedor como cambio silencioso. Si las opciones gratuitas han cambiado, **documentar riesgo externo sin migrar arquitectura**. Costo de infraestructura obligatorio: $0. Cualquier alta de servicio, credencial o aceptación de términos requiere acción humana.

## Entregables Codex

- Verificar Dockerfile backend y build Web existente sin cambiar la estrategia monolito modular. Mantener `Dockerfile` portable para OCI/Render.
- Preparar despliegue de estáticos `flutter build web --dart-define=API_BASE_URL=https://.../api/v1` para Cloudflare Pages; configuración documentada, con SPA deep-link fallback cuando aplique y rutas Flutter reales.
- Preparar backend Docker con env production y `prisma migrate deploy` controlado, política de red/CORS, health/ready, sin seed demo prod, sin Swagger ni AI Preview accidentalmente públicos.
- Preparar documentación `docs/operations/DEPLOYMENT-RUNBOOK.md`, `BACKUP-RESTORE-RUNBOOK.md`, `INCIDENT-RUNBOOK.md`, `RELEASE-RUNBOOK.md` si no existen; comandos verificables y rollback. Evitar instrucciones ficticias de CLI/provider.
- Preparar GitHub Actions release-check (sin auto deploy; sin secretos en YAML; no pago). Definir checks pre-deploy y matrices de estado.
- Preparar evidencia local de backup `pg_dump` y restore en **DB de ensayo**, si el ambiente permite. Nunca sobreescribir DB real con el restore.
- Documentar observabilidad mínima (logs seguros, health/status, esquema de alertas y dónde configurar un monitor gratuito). Configuración de monitors reales requiere cuentas humanas.
- Chequear que producción no dependa del equipo del usuario, del Compose local ni del mock IA.

## Fuera de alcance de ejecución Codex

- No desplegar Cloudflare, OCI, Render ni Neon; no crear cuentas, servicios, VM, facturación ni contraseñas; no consumir cuota.
- No afirmar HTTPS, uptime, backups offsite, alertas, ni CORS productivo **verificados** hasta que existan endpoints públicos reales.
- No eliminar recursos externos ni correr `prisma migrate reset`/`migrate dev` en producción.
- No decidir cambio de topología si un free tier resulta insuficiente: documentar la situación para decisión humana.

## Gates antes de despliegue humano

Build Web, build Docker backend, variables ejemplo sin secretos, migraciones de base vacía y runbooks completados; health y test local; formularios, navegación SPA y permisos; procedimiento para rollback. Después del primer deploy humano: HTTPS Web/API, DB persistente externa, checks de permiso con 2 usuarios, monitor/backup reales, smoke externo. La validación pública no es parte del READY local.
