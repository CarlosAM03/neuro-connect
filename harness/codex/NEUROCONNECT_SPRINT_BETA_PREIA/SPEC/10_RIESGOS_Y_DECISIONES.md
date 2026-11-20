# Riesgos, decisiones reservadas y mecanismo de bloqueo diferido

## Riesgos conocidos (documentados en Avance 1)

1. **Dependencias:** advisories de Prisma/deepmerge-ts por reevaluar al cierre; no actualizaciones grandes sin análisis.
2. **Exposición de datos:** proyecciones Support deben impedir fugas de notes, auditoría, snapshots y payloads; verificar concurrencia y revocación.
3. **Semántica histórica:** invalidar check-ins y cancelación modifican cálculos sin perder registros; conservar atomicidad.
4. **Infraestructura gratuita:** OCI Always Free puede carecer de capacidad; Render/Neon/Cloudflare pueden cambiar límites; cero gasto obligatorio.
5. **Plataformas:** Android requiere SDK/dispositivo; iOS requiere entorno Apple para compilación real, no sustituible con una afirmación.
6. **IA ausente:** feature UI debe ser honesta, no se permite fake como producción.
7. **Scope creep:** funcionalidades no clínicas y nuevas entidades fuera de alcance.

## Qué hacer cuando falta decisión humana

Codex no debe parar TODO el sprint por una decisión focalizada. En `RESULTADOS/DECISIONES_PENDIENTES.md` crear ID `DEC-NNN`, detallar: requisito/archivo, fuente conflictiva, pregunta precisa, 2–3 alternativas, recomendación con ventajas/desventajas, riesgo, qué quedó sin implementar, alternativas no bloqueadas, impacto en gates/DoD, cómo retomar. Marcarla `OPEN`. Continuar con tareas independientes. No implementar la recomendación hasta recibir aprobación expresa.

**Interrupción obligatoria inmediata:** acción que exponga secretos, destruya datos reales, active gasto o despliegue sin permiso, o conflicto que impida continuar de manera segura. Registrar y entregar estado seguro.

## Lo que NO es decisión pendiente

- Elegir mensajes UX neutros, nombres internos, forma de un helper, librería menor compatible ya documentada, implementación de estado de carga, test fixtures locales. Resolver con criterio de ingeniería, documentar bajo `Implementation Decisions`.

## Lo que NO se debe maquillar

Fallo de tests, funcionalidad sin validar, upgrade inseguro, falta de SDK, servicio cloud no configurado, test E2E IA imposible. Distinguir incertidumbre de defecto y de trabajo diferido.

## Cierre post-smoke

El humano aportará sus observaciones y decisiones en `RESULTADOS/SMOKE_HUMANO.md` u otro texto. Se utiliza `PROMPTS/CIERRE_POST_SMOKE.md` para implementar únicamente correcciones/autorizaciones, con commits propios y regresión; no iniciar nuevo sprint IA por accidente.
