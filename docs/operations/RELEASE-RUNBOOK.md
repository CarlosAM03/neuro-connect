# Gate manual de beta / release futura

Este bloque es una beta pre-IA; **no es v1.0.0**. El tag académico, documento final,
benchmark/proveedor real y aceptación completa permanecen diferidos.

1. Revisar `git log main..sprint/pre-ia-beta` y diff; preservar cambios humanos
   previos. Ejecutar HANDOFF_HUMANO, registrar resultados y resolver decisiones.
2. El humano crea/revisa PR y merge solo tras aceptación local. Codex no publica
   rama ni crea PR, merge, tag o despliegue en este bloque.
3. Ejecutar manualmente `release-check.yml` con URL HTTPS real de la API cuando
   exista. El workflow solo prueba/build; no tiene credenciales cloud ni CD.
4. Gates locales reproducibles: backend npm ci/Prisma/lint/unit/E2E PostgreSQL/build,
   Flutter analyze/test/Web, Android con SDK; imágenes Docker, migration/seed smoke,
   backup/restore de DB sintética, Compose health y smoke A/B.
5. Revisar audit residual y compatibilidad esquema/imagen anterior, backup antes
   de migración y planes gratuitos con costo obligatorio $0.
6. Primer despliegue humano según DEPLOYMENT-RUNBOOK; después HTTPS real, CORS,
   checks de notes/permissions, disponibilidad, alertas y recuperación documentados.
7. Para futura v1.0.0 faltan también: evaluación/selección formal ADR-005, generación
   real PENDING→COMPLETED/FAILED, fidelidad/privacidad con LLM, Android instalado
   con API pública y evidencia académica. No convertir fixtures de tests en DONE.

Rollback de beta: imagen anterior + artefacto Web anterior, sin borrar DB ni
historia. Si una migración futura impide volver, pausar y decidir recuperación
humana; este sprint no modifica el esquema ni introduce down migrations.
