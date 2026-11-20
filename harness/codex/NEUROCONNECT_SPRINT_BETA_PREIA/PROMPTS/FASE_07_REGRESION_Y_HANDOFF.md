# FASE 07 — Regresión integral, evidencias y entrega del único bloque

1. Revisar cambios Git desde base, matriz del SPEC y criterios G0..G6; corregir problemas encontrados que no exijan decisión nueva. No marcar DONE por intención.
2. Ejecutar paquete de validación: backend lint/unit/e2e/build/seed/migrations/smoke cuando aplique; Flutter analyze/test/Web build; Docker Compose up/healthy, flujo auth → goal → checkin → analytics → support → revoke, restart/recovery, sin LLM. Ejecutar Android si está disponible.
3. Asegurar working tree controlado y commits pequeños documentados por fase; recoger SHA inicial y final, resultados de pipelines si accesibles, evidencias redactadas sin secretos.
4. Crear `RESULTADOS/REPORTE_FINAL_SPRINT.md` siguiendo plantilla: resumen, mapa de lo que ya estaba hecho, lo nuevo, estado por IDs M2/M3/M4, tests con comandos/exit codes, builds, matriz G0–G6, seguridad, limitaciones, riesgo, decisiones de implementación, deudas y release readiness.
5. Crear `RESULTADOS/DECISIONES_PENDIENTES.md`, aun si está vacío (escribir `Sin decisiones humanas adicionales identificadas`), separando decisores de `EXTERNAL_HUMAN_ACTION`, `DEFERRED_AI` y `ENVIRONMENT_LIMITATION`.
6. Crear `RESULTADOS/HANDOFF_HUMANO.md` con secuencia mínima de `docker compose`, URLs y flujo de dos cuentas, credenciales demo obtenidas del .env local sin ponerlas en reporte; instrucciones Android; cómo retroalimentar con `PROMPTS/CIERRE_POST_SMOKE.md`.
7. Detener trabajo de código; NO iniciar sprint IA real, NO PR/merge/push/tag/release/cloud deploy. Emitir estado HARNESS entre `READY_FOR_HUMAN_VALIDATION`, `PARTIALLY_COMPLETE`, `BLOCKED`, `FAILED_VALIDATION`; jamás HUMAN_ACCEPTED.

**Commit final:** `docs(preia): close beta readiness handoff` solo después de finalizar el reporte. El humano realizará smoke y PR posterior. Si fallos significativos continúan, estado parcial/fallido y comandos precisos, sin declaración falsa de cierre.
