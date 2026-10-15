# Avance 1 — NeuroConnect

Documento editable de evidencia técnica para el autor. Corte: 14 de octubre de 2026 (America/Tijuana). No es el PDF académico final. La validación humana del cierre está pendiente; las integraciones de MVP-0/1 fueron confirmadas por el responsable en PR #1 y PR #2.

## 1. Breve recordatorio del objetivo y planificación inicial

NeuroConnect busca integrar objetivos personales, check-ins, historial, indicadores descriptivos y, posteriormente, resúmenes generativos y una red de apoyo autorizada. El anteproyecto establece un MVP académico no clínico, monolito modular Flutter/NestJS/Prisma/PostgreSQL, sin diagnósticos ni inferencias emocionales.

El cronograma inicial sitúa backend del 5 al 18 de octubre, Flutter del 19 de octubre al 1 de noviembre, Analytics del 2 al 8 de noviembre, IA del 9 al 15 de noviembre, red de apoyo del 16 al 22 de noviembre y cierre hasta la primera semana de diciembre. El roadmap y plan operativo adelantan para Avance 1: MVP-0 completo, MVP-1 completo e inicio técnico de MVP-2; no completan la versión 1.0.0 ni sustituyen el cronograma del anteproyecto.

## 2. Actividades realizadas

- MVP-0 integrado: autenticación JWT/Argon2id, perfil, Goal CRUD/lifecycle, CheckIns, snapshot de progreso, historial, ownership y aislamiento real en PostgreSQL 16.
- MVP-1 integrado: métricas/tendencias determinísticas, overview/Goal Analytics, dashboard Flutter con API real, gráfica fl_chart, vacío/insuficiente/error-retry, navegación y tests.
- Baseline integrada verificada antes de IA: 34 pruebas unitarias y 48 E2E backend, 15 tests Flutter, smokes, seed, Compose y navegador. Docker Desktop requirió recuperación de un socket IPC obsoleto; se conservó su directorio, sin reset de volúmenes.
- Inicio MVP-2: AiModule/AiSummaryService, SummaryContextBuilder que consume Analytics real mediante whitelist, PromptBuilder SYSTEM/USER neutral, AiProvider y MockAiProvider determinístico **Development mock only**, preview autenticado `{context,prompt,providerConfigured:false}`. No proveedor real ni API key.
- AISummary scaffold físico conforme PLAN§7.4/ADR-001, con migration/enum/FK/índices/JSONB/UTC y periodo válido. El preview/mock no persisten resúmenes; no se expone generación pública ni UI final de IA.
- Stack reproducible con un comando Compose, frontend/backend independientes, PostgreSQL externo en plantilla productiva. Smoke completo ejecutable dentro del backend container.

Evidencias reproducibles: código/tests/workflows, [reporte del cierre](../harness/codex/MVP2_AVANCE1_REPORT.md), [reporte MVP-0](../harness/codex/MVP0_REPORT.md), [reporte MVP-1](../harness/codex/MVP1_REPORT.md), Swagger local y docs/evidence/. Resultados finales y enlaces CI se registran en el reporte del cierre. Swagger documenta únicamente el preview técnico, no IA generativa real.

Comparación: se conservan arquitectura y dominio originales; frontend y Analytics fueron adelantados según el plan operativo. El bloque 3 estabiliza lo integrado e implementa exclusivamente el inicio de IA aprobado.

## 3. Porcentaje de avance

| Incremento | Planificado para Avance1 | Implementado | Validación |
|---|---|---|---|
| MVP-0 |100 % del núcleo definido por DoD| Núcleo integrado PR #1 | Regresión técnica ejecutada; revisión final del autor pendiente |
| MVP-1 |100 % de Analytics/dashboard definido por DoD| Integrado PR #2 | Regresión técnica ejecutada; revisión final del autor pendiente |
| MVP-2 | Inicio técnico, no módulo completo |8/8 entregables del inicio: módulo, servicio, contexto, prompt, interfaz, mock, preview y scaffold AISummary| Tests de privacidad/ownership y pipeline; gates finales en reporte |
| MVP-3/MVP-4 | Fuera de estos bloques | No adelantados deliberadamente | No reclamados |

Los porcentajes de 100 % de MVP-0/1 corresponden a sus entregables y DoD, no al proyecto completo ni a eficacia clínica. MVP-2 permanece **STARTED**: no se asigna 20 %, 25 % o 30 % porque no existe un denominador ponderado aprobado que lo sustente. La relación 8/8 describe solamente el subconjunto inicial, no el 100 % de MVP-2. No se calcula un porcentaje global ficticio de la versión 1.0.0. Porcentajes y valoración académica final: **[PENDIENTE DE VALIDACIÓN DEL AUTOR]**.

## 4. Dificultades

Dificultad técnica observada: Docker Desktop fallaba al iniciar por un socket IPC obsoleto. Solución aplicada: parada por CLI, verificación de que el directorio contenía únicamente el socket de cero bytes, preservación mediante renombrado y recreación por Docker; engine/Compose volvieron a funcionar. No reset de fábrica ni modificación de credenciales/volúmenes.

Deuda no bloqueante heredada: advertencia de configuración Prisma y advisories de dependencias; se conserva la versión compatible de ADR y se difiere hardening/actualización mayor. Limitaciones y cualquier bloqueo de entrega GitHub se registran exactamente en el reporte. Dificultades personales/organizativas del autor: **[PENDIENTE DE VALIDACIÓN DEL AUTOR]**.

## 5. Retroalimentación

**[PENDIENTE DE VALIDACIÓN DEL AUTOR]**. No se dispone de comentarios del profesor, usuarios ni evaluaciones humanas de este cierre para transcribir. La confirmación de integración de PR #1 y PR #2 es evidencia de baseline aceptada; no se transforma en retroalimentación académica inventada ni aceptación del bloque 3.

## 6. Próximas actividades

Validar humanamente la rama mvp2-avance1, revisar reporte/Swagger/flujo Docker y PR antes de merge manual. Consolidar evidencia académica con el autor; no producir todavía PDF final.

Completar MVP-2 posteriormente: evaluación formal ADR-005, comparación de modelos con inputs/criterios congelados, selección sustentada de proveedor/modelo, integración real sin mezclar cálculo oficial, lifecycle/persistencia/historia AISummary, errores/timeouts y frontend final. Después: red de apoyo/permisos y hardening/deployment conforme roadmap. Mantener costo obligatorio cero y no adelantar servicios pagados, RAG ni agentes.
