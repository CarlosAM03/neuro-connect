# PROMPT — CIERRE POST-SMOKE CON DECISIONES HUMANAS

Activa la **pasada de correcciones** del bloque `PREIA-BETA-READINESS`. El humano ya ejecutó una validación local Docker y proporcionará `RESULTADOS/SMOKE_HUMANO.md` o la lista de hallazgos y las decisiones explícitas en el mensaje. Lee esa evidencia, `RESULTADOS/REPORTE_FINAL_SPRINT.md`, `RESULTADOS/DECISIONES_PENDIENTES.md`, SPEC, HARNESS y el Git actual.

1. Identifica qué decisiones fueron **autorizadas explícitamente** y cuáles continúan OPEN; no supongas aprobación por silencio.
2. Reproduce los defectos y corrígelos con tests; no iniciar integración de un LLM ni rediseñar arquitectura. Para un cambio que altere ADR, no implementes hasta que exista autorización/documentación coherente con jerarquía.
3. Haz commits pequeños de correcciones, reejecuta regresión relevante, actualiza reportes y decisión ID con evidencia.
4. Trabaja en la misma rama del bloque si el PR aún no se ha creado/integrado; si ya se fusionó, no escribir main: prepara nueva rama de corrección desde main sin force/rebase destructivo.
5. Produce handoff de aceptación actualizado y pasos para repetir smoke, sin autoaprobar ni crear PR/merge/deploy/tag.

Observaciones y decisiones del humano:

[PEGAR AQUÍ EL RESULTADO DEL SMOKE Y LAS DECISIONES QUE AUTORIZO]
