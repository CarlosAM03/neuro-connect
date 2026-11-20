# Primer despliegue público beta — lista HUMANA (posterior al PR/merge)

**Norma:** ADR-007. Este archivo no autoriza a Codex a crear cuentas ni desplegar. Los siguientes son checkpoints; el procedimiento exacto se completa en `docs/operations/DEPLOYMENT-RUNBOOK.md` tras la implementación y revisión.

## Topología

- [ ] Seleccionar topología aprobada: **A** OCI Always Free host Linux, o **B** Render Free; confirmar disponibilidad y cero costo al momento de crear recursos. Nada de AWS/Vercel.
- [ ] Base PostgreSQL gestionada gratuita, candidato **Neon Free** (verificar límites, condiciones, disponibilidad/retención). No usar credenciales de demo en prod.
- [ ] Flutter Web se publica en **Cloudflare Pages**. Subdominio gratuito; HTTPS activo y URL real documentada.

## Preparación y seguridad

- [ ] Rama del sprint revisada, pruebas verdes, PR humano integrado a main. No desplegar ramas sin aceptación.
- [ ] Docker image reproducible; Node/Prisma compatibles; `migrate deploy` revisado; no seed en prod.
- [ ] Secrets y `DATABASE_URL` configurados exclusivamente en proveedor/servidor, nunca Git/Flutter/logs; rotación posible.
- [ ] CORS limitado al dominio Web real; `SWAGGER_ENABLED` y `AI_PREVIEW_ENABLED` desactivados si corresponde; modo IA sin provider genera indisponibilidad, jamás contenido mock.
- [ ] PostgreSQL protegido (TLS, usuario mínimo razonable, red no pública directa si no requerido, backup inicial). Definir política de datos demo; no subir información clínica/PII innecesaria.

## Validación externa

- [ ] URL pública Web HTTPS carga, deep links funcionan, se consumen assets estáticos correctos.
- [ ] API `/api/v1/health` y `/ready` accesibles según política; no exponen secretos.
- [ ] Registro/login y flujo Owner A → Goal → CheckIn → Analytics por HTTPS.
- [ ] User B/Supporter autorizado; read-only, revocación/expiración y notes/audit privados.
- [ ] Reinicio del backend no destruye PostgreSQL; logs sin datos sensibles.
- [ ] Monitoreo gratuito Web/API y alerta real configurados, sin gasto; usar proveedor aprobado/compatible.
- [ ] Backup real protegido y restore ensayado en base distinta; rollback de release documentado.
- [ ] Evidencias de público verificadas con fecha y entorno, nunca inventadas.

## Resultado

Marcar `DEPLOYED_BETA_PREIA` solo cuando la URL real, API, DB, HTTPS y smoke externo estén comprobados por el responsable. Si no hay capacidad OCI, evaluar B ya aprobada; si no existe alternativa gratuita, no realizar gasto: registrar `EXTERNAL_BLOCKER` para decisión humana.
