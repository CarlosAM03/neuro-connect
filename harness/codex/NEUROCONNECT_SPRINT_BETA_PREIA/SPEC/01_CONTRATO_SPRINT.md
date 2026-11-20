# SPEC-NEUROCONNECT-PREIA-BETA-001 — Desarrollo integral sin proveedor generativo

**Estado:** especificación operativa propuesta para ejecución, sujeta siempre a las fuentes canónicas.  
**Bloque HARNESS:** `PREIA-BETA-READINESS` · **Rama sugerida:** `sprint/pre-ia-beta` · **Objetivo humano:** un solo handoff de implementación para smoke Docker local.  
**Versión objetivo futura de producto:** `v1.0.0` académica; **este sprint NO es la release v1.0.0**.

## 1. Intención de producto

Completar todo el desarrollo técnico y funcional que pueda construirse y validarse sin conectar un LLM. Entregar una beta operable, visualmente coherente, con pruebas verificables, seguridad y documentación de despliegue conforme a ADR-007. El último sprint futuro integrará el proveedor generativo real y acreditará los criterios que dependen de sus respuestas. Esta división **NO significa que la IA equivalga matemáticamente al 10 % del esfuerzo o del inventario**.

## 2. Resultado mínimo global

Una persona puede registrarse, iniciar y restaurar sesión, gestionar perfil, crear/actualizar/pausar/completar/cancelar/reactivar objetivos, registrar e invalidar check-ins preservando historia, revisar dashboard y tendencias, consultar su actividad; otorgar permisos a una segunda cuenta, cambiar vigencia, revocar/reactivar y verificar que la segunda cuenta solo ve datos autorizados y nunca escribe. El cliente Flutter Web funciona con backend NestJS y PostgreSQL reales, sin necesidad de proveedor LLM. El proyecto incluye camino de ejecución Android reproducible. La UX de futuros resúmenes está técnicamente preparada pero no simula IA real.

## 3. Módulos de trabajo permitidos

- **Core** (`AuthModule`, `UsersModule`, `GoalsModule`, `CheckInsModule`, Flutter auth/profile/goals/check_ins): corrección funcional y UX, no reimplementación.
- **Analytics**: conservación de fórmulas/ventana 28 días y clasificación determinística; mejora de visualización y estados sin nuevas métricas de negocio no aprobadas.
- **Support/Audit**: controles read-only, fechas, permisos, consistencia de proyecciones, actividad y pruebas de aislamiento.
- **AI Foundation, sin proveedor externo**: construir rutas, repositorios, UI y contratos de resumen en modo pendiente/indisponible; fixtures únicamente en test. **No habilitar generación con mock en la interfaz pública**.
- **Quality/Delivery**: a11y, Web responsive, Android demostrable según entorno, pruebas E2E, CI, dependencias, Docker, guías y runbooks, preparación Cloudflare/OCI/Render/Neon con cero gasto.

## 4. Exclusiones estrictas

- Selección o consumo de proveedor real LLM, llaves, créditos, benchmarking entre modelos, adaptadores de pago, generación real, recomendaciones clínicas.
- Modificar arquitectura Flutter/NestJS/Prisma/PostgreSQL o abandonar monolito modular; desplegar backend serverless en Vercel/AWS; trasladar frontend desde Cloudflare Pages; introducir bases de datos o colas adicionales.
- Chat, notificaciones push, wearables, biometría, registro clínico, recuperación de contraseñas vía email, nuevos roles globales, panel admin, RAG, agentes, fine-tuning, microservicios, Kubernetes, offline-first, publicación App Store/Play Store.
- Crear cuentas, dominios, servicios, instancias o facturación reales; despliegue en infraestructura ajena sin consentimiento explícito del usuario. **Preparar sí; desplegar de verdad no**.
- Retocar porcentajes históricos, inventar pruebas, marcar una v1.0.0 final, crear PR/merge/tag sin autorización.

## 5. Definición específica de COMPLETO del sprint

- Todos los criterios pre-IA concretos definidos en `SPEC/03_ALCANCE_Y_TRAZABILIDAD.md` están cubiertos con código + evidencia o marcados como pendientes razonados por imposibilidad real.
- Los cambios son compatibles con ADR-008: CANCELLED, CheckIn.voidedAt, auditoría append-only, sin eliminaciones físicas de operaciones normales.
- Backend: lint, tests, E2E PostgreSQL real y build en verde en ambiente disponible; Flutter: analyze/test/Web build y revisión Android según capacidad.
- Compose local reproduce el sistema sobre DB real; seed solo local/demo; smoke con dos identidades verifica permisos, historial, negocio y sin LLM.
- Preparación de despliegue con rutas operativas aprobadas y runbooks seguros sin secretos; gating de IA en público.
- Varios commits revisables; un reporte final, matriz DONE/PARTIAL/BLOCKED/DEFERRED, riesgos, comandos precisos, decisiones y handoff humano.
- Estado `READY_FOR_HUMAN_VALIDATION` solo si TODOS los gates obligatorios pre-IA comprobables pasan. Si faltan credenciales cloud o entorno Android, etiquetar `EXTERNAL_HUMAN_ACTION` o `ENVIRONMENT_LIMITATION`; no simular validación.

## 6. Principio de implementación

Inspeccionar primero y conservar comportamiento existente correcto. No rehacer 54.7 % ni inventar trabajo ya hecho. Implementar **slices verticales** API ↔ Flutter ↔ test ↔ documentación cuando aplique. Priorizar cierre verificable y evitar sobrearquitectura.

## 7. Orden interno único

1. Fase 01: inventario dinámico, diagnóstico de gap, test inicial.
2. Fase 02: UX y core consolidado.
3. Fase 03: analítica, auditoría y red de apoyo; tests de privacidad.
4. Fase 04: UI y contratos de resúmenes preparados sin generación real.
5. Fase 05: accesibilidad, seguridad, Android y regresión automatizada.
6. Fase 06: DevOps y preparación de despliegue ADR-007.
7. Fase 07: smoke técnico de Codex, consolidación de evidencias, reporte/decisiones y handoff.

No existe gate de validación humana **entre las fases internas**; el gate humano es al final de este único bloque. Las fases no son bloques independientes según el HARNESS, aunque pueden activarse por separado para recuperar una ejecución.

## 8. Control de decisiones

Codex decide detalles técnicos locales permitidos (nombres de helpers, organización menor, fixtures, mensajes UI). Si se requiere alterar una regla de dominio, contrato oficial, flujo de permisos, ADR, stack, topología, retención de datos, semántica de IA o costos, **no decide**: registra `DECISION_REQUIRED` con opciones/recomendación, evita exclusivamente el cambio dependiente y continúa con tareas independientes. No consulta al usuario durante el sprint salvo imposibilidad absoluta de mantener el estado seguro; acumula pendientes para el cierre.

## 9. Reconocimiento de límites de validación

Se admite cierre técnico local sin cuentas cloud, sin acceso a red, sin dispositivo Android físico o sin proveedor IA. Tales elementos son pendientes explícitos, no fallas ocultas ni evidencia simulada. El despliegue público y su aceptación corresponden al responsable después de revisar y mergear el bloque.
