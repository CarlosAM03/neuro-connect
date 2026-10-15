# Avance 1 — NeuroConnect

Documento editable de evidencia técnica para el autor. Corte histórico inicial:
14 de octubre de 2026; actualización de ejecución real: 15 de octubre de 2026
(America/Tijuana). No es el PDF académico final. Las secciones 1–6 conservan el
corte del bloque 3; la sección posterior distingue la ejecución real y el cierre
técnico. El closeout ya fue integrado mediante PR #5 el 15 de octubre de 2026;
la fuente consolidada del corte es [AVANCE1_BASELINE_FREEZE](Planeacion/AVANCE1_BASELINE_FREEZE.md).

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

Para el freeze de Avance 1 se incorpora una **Estimación técnica por entregables
verificables**, con inventario atómico y fuentes publicados en
[AVANCE1_BASELINE_FREEZE](Planeacion/AVANCE1_BASELINE_FREEZE.md), §§7–10.
No representa una calificación académica, una ponderación oficial del profesor ni
eficacia clínica. La tabla anterior conserva el corte histórico del bloque3;
el inventario actualizado prevalece para esta medición. La relación 8/8 histórica
describe solo la foundation inicial, no todo MVP-2.

**Overall technical completion: 54.7 %** (81 DONE / 148 entregables).
**Remaining v1.0.0 scope: 45.3 %** (67 PENDING).

| MVP original | Total | DONE | PENDING | Avance técnico |
| --- | ---: | ---: | ---: | ---: |
| MVP-0 | 26 | 26 | 0 | 100.0 % |
| MVP-1 | 15 | 15 | 0 | 100.0 % |
| MVP-2 | 40 | 10 | 30 | 25.0 % |
| MVP-3 | 26 | 23 | 3 | 88.5 % |
| MVP-4 | 41 | 7 | 34 | 17.1 % |

MVP-1.5 se mapea a los MVP originales, sin sexto subtotal ni doble conteo.
MVP-3 aún requiere resúmenes delegados productivos; MVP-4 tiene prerrequisitos
locales realizados, pero su aceptación final sigue pendiente. El restante se
distribuye en 20.3 puntos de MVP-2, 2.0 de MVP-3 y 23.0 de MVP-4, sobre 148 unidades.
Valoración académica y revisión humana de esta estimación: pendientes del autor.

## 4. Dificultades

Dificultad técnica observada: Docker Desktop fallaba al iniciar por un socket IPC obsoleto. Solución aplicada: parada por CLI, verificación de que el directorio contenía únicamente el socket de cero bytes, preservación mediante renombrado y recreación por Docker; engine/Compose volvieron a funcionar. No reset de fábrica ni modificación de credenciales/volúmenes.

Deuda no bloqueante heredada: advertencia de configuración Prisma y advisories de dependencias; se conserva la versión compatible de ADR y se difiere hardening/actualización mayor. Limitaciones y cualquier bloqueo de entrega GitHub se registran exactamente en el reporte. Dificultades personales/organizativas del autor: **[PENDIENTE DE VALIDACIÓN DEL AUTOR]**.

## 5. Retroalimentación

**[PENDIENTE DE VALIDACIÓN DEL AUTOR]**. No se dispone de comentarios del profesor, usuarios ni evaluaciones humanas de este cierre para transcribir. La confirmación de integración de PR #1 y PR #2 es evidencia de baseline aceptada; no se transforma en retroalimentación académica inventada ni aceptación del bloque 3.

## 6. Próximas actividades

Validar humanamente la rama mvp2-avance1, revisar reporte/Swagger/flujo Docker y PR antes de merge manual. Consolidar evidencia académica con el autor; no producir todavía PDF final.

Completar MVP-2 posteriormente: evaluación formal ADR-005, comparación de modelos con inputs/criterios congelados, selección sustentada de proveedor/modelo, integración real sin mezclar cálculo oficial, lifecycle/persistencia/historia AISummary, errores/timeouts y frontend final. Después: red de apoyo/permisos y hardening/deployment conforme roadmap. Mantener costo obligatorio cero y no adelantar servicios pagados, RAG ni agentes.

## 7. Resultado real — actualización posterior a MVP-1.5

**Plan inicial de Avance 1:** MVP-0 completo + MVP-1 completo + inicio de MVP-2.

**Resultado real:** MVP-0 completo + MVP-1 completo + foundation de MVP-2 +
MVP-1.5 completo + estabilización AVANCE-1-CLOSEOUT. MVP-1.5 fue una modificación
al plan inicial debido a un avance técnico superior al cronograma previsto. Permitió
validar anticipadamente persistencia histórica, auditoría, red de apoyo, permisos,
autorización entre usuarios, revocación y vistas delegadas antes de integrar IA real.
Estas capacidades adelantaron el core previsto para MVP-3; no formaban parte del
plan original de Avance 1 ni implican todo MVP-3 finalizado.

PR #4 fue integrado humanamente en `d3920d955956263b3baac72d0dd4a350e697df9e`.
El responsable confirmó PASS local para build/start Compose, seed, smoke completo y
los tres servicios healthy. La sección post-merge de MVP15_REPORT conserva esa
aceptación sin cambiar el registro pre-merge. No se inventa feedback académico.

| Capacidad al cierre técnico | Estado |
| --- | --- |
| Auth, Profile, Goals, CheckIns | DONE |
| Persistencia histórica, auditoría | DONE |
| Analytics, Dashboard | DONE |
| SupportNetwork core, permisos delegados | DONE |
| Arquitectura IA, contexto, safety prompt, abstracción de proveedor | DONE |
| LLM real, evaluación de modelos, AISummary productivo, UI IA | NOT STARTED |
| Deployment público, aceptación Android, release hardening | PENDING |

El contrato PostgreSQL → Analytics → SummaryContext se estabiliza en este sprint:
averageProgress excluye CANCELLED y CHECKIN_VOIDED distingue el progreso invalidado
del snapshot resultante. Los eventos históricos permanecen inmutables. La evidencia
final de pruebas, seguridad, CI y reproducibilidad corresponde a
`harness/codex/AVANCE1_CLOSEOUT_REPORT.md`.

Avance 2 comenzará posteriormente con investigación de modelos candidatos,
comparación, matriz ponderada, benchmark ciego, spike operativo, decisión conforme
ADR-005, proveedor real, lifecycle AISummary, UI IA y finalización MVP-2. Ninguna
investigación o integración externa se ejecuta en este sprint. `release-check.yml`
queda DEFERRED → MVP-4; no se crean tags/releases ni se declara v1.0.0 completa.

## 8. AVANCE 1 — CLOSED

Cierre técnico registrado después de gates locales y Backend CI/Frontend CI PASS
sobre `884fc2fbaca97218957d56bbfdc791e7621e6f1a`:70 unitarias,73 E2E PostgreSQL,
27 Flutter, lint/analyze/builds Web,4 migrations desde DB limpia, seed idempotente,
ambas imágenes Docker, Compose3healthy y full HTTP smoke con70/40 y73.33.
Dependencias: parche compatible YAML aplicado; riesgos transitivos restantes
evaluados y documentados explícitamente. Evidencia y pasos exactos en el reporte.

Estado del sprint: **READY_FOR_HUMAN_VALIDATION**. Este cierre técnico no sustituye
la validación local/revisión/PR/merge humanos. No se declara HUMAN_ACCEPTED para
closeout. La baseline funcional y los contratos Analytics/SummaryContext quedan
preparados para Avance2, sin iniciarlo automáticamente ni crear tag/release.

### Estado posterior al merge del closeout — 15 de octubre de 2026

El párrafo anterior registra el handoff previo al merge. El PR #5 ya está
**MERGED** en `fad9cf73924fc334c57a77526a9f017069ceb4c5`, baseline humana aceptada
para el freeze. **AVANCE 1 — CLOSED**. Esta actualización no reescribe los reportes
históricos ni equivale a aceptar el nuevo bloque documental.

El [freeze consolidado](Planeacion/AVANCE1_BASELINE_FREEZE.md) distingue plan original,
ejecución real, 148 entregables, avance 54.7 % / restante 45.3 %, variaciones de fechas
verificadas y forecast técnico sin mover el objetivo académico de la primera semana
de diciembre de 2026. Avance 2 comienza posteriormente con investigación/evaluación
formal, implementación real de MVP-2, después MVP-3 remainder y MVP-4. Este texto
es fuente técnica para el futuro documento/PDF académico, no su versión final.
