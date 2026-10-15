# NeuroConnect — Sprint AVANCE-1-CLOSEOUT

**Estado:** Planificado para ejecución  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Sprint:** AVANCE-1-CLOSEOUT  
**Rama objetivo:** `sprint/avance1-closeout`  
**Responsable:** Carlos Benjamín Armenta Márquez  
**Fecha de definición:** 15 de octubre de 2026  

---

# 1. Propósito

Este documento define el último sprint de estabilización correspondiente al **Avance 1** de NeuroConnect.

Su propósito es cerrar los hallazgos técnicos, semánticos, de seguridad y documentales detectados después de MVP-1.5, sin incorporar nuevas funcionalidades de producto ni avanzar todavía con la integración productiva de inteligencia artificial.

El sprint debe dejar una baseline estable, reproducible y documentada que permita declarar:

```text
AVANCE 1 — CLOSED
```

A partir de esa baseline, todo el trabajo relacionado con investigación de modelos, benchmark, selección de proveedor/modelo e integración real de IA formará parte de **Avance 2**.

---

# 2. Relación con la documentación del proyecto

Este sprint conserva como autoridad la documentación ya aceptada del proyecto:

```text
Anteproyecto oficial
        ↓
ADR-001 … ADR-008
        ↓
ROADMAP_V1.md
        ↓
PLAN_IMPLEMENTACION_AVANCE_1.md
        ↓
HARNESS.md
        ↓
este documento
```

Este plan no reemplaza decisiones arquitectónicas ni modifica el objetivo académico del proyecto.

ADR-008 introdujo deliberadamente MVP-1.5 antes de continuar MVP-2 para validar persistencia histórica, auditoría, red de apoyo y autorización delegada. Este sprint cierra las deudas detectadas después de esa implementación y congela la baseline que será utilizada por Avance 2.

---

# 3. Naturaleza del sprint

AVANCE-1-CLOSEOUT es un sprint de:

```text
estabilización
+
corrección semántica
+
seguridad de dependencias
+
consistencia documental
+
regresión
```

No es un nuevo MVP funcional.

No debe utilizarse para agregar funcionalidades que no formen parte del alcance actual.

---

# 4. Rama de trabajo

La rama será:

```text
sprint/avance1-closeout
```

Debe crearse desde `main` después de que MVP-1.5 se encuentre integrado.

Flujo esperado:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c sprint/avance1-closeout
```

`main` representa la baseline aceptada por el responsable humano.

---

# 5. Estado funcional previo al sprint

Antes de AVANCE-1-CLOSEOUT, la baseline funcional se considera:

```text
MVP-0        DONE
MVP-1        DONE
MVP-1.5      DONE
MVP-2        STARTED / foundation only
MVP-3 core   ADVANCED THROUGH MVP-1.5
MVP-4        PENDING
```

La foundation de MVP-2 ya incluye:

```text
AiModule
AiSummaryService
SummaryContextBuilder
PromptBuilder
AiProvider
MockAiProvider
AI Preview
AISummary scaffold
```

No existe todavía proveedor LLM real ni selección definitiva de modelo.

---

# 6. Objetivo general del sprint

Cerrar todos los hallazgos actualmente identificados que puedan afectar:

- fidelidad de auditoría;
- semántica de Analytics;
- contrato previo al LLM;
- seguridad de dependencias;
- continuidad de CI;
- coherencia documental;
- reproducibilidad de la baseline.

Al terminar, la semántica:

```text
PostgreSQL
    ↓
Analytics
    ↓
SummaryContext
```

debe quedar congelada para poder evaluar modelos generativos sobre un contrato estable durante Avance 2.

---

# 7. Hallazgos a cerrar

| Prioridad | Hallazgo | Resolución |
|---|---|---|
| P1 antes de producción | Vulnerabilidades `high` runtime reportadas por `npm audit` | Auditar cada advisory, determinar alcance real, aplicar correcciones compatibles y documentar cualquier aceptación temporal. |
| P2 | `CHECKIN_VOIDED.progress` representa el snapshot posterior y no el CheckIn invalidado | Sustituir el payload ambiguo por `voidedProgress` y `resultingGoalProgress`. |
| P2 | `averageProgress` incluye Goals `CANCELLED` sin decisión explícita | Excluir `CANCELLED`; calcular solo sobre `ACTIVE + PAUSED + COMPLETED`. |
| P2 | `ROADMAP_V1.md` no refleja MVP-1.5 ni el adelanto de MVP-3 core | Registrar estado real y separar plan original de ejecución real. |
| P2 | `MVP15_REPORT.md` conserva estado pre-merge | Añadir sección post-merge y aceptación humana sin borrar el historial original. |
| P2 | README omite ADR-008 como fuente de verdad | Incorporar ADR-008 y explicar precedencia de ADR posteriores. |
| P3 | CI contiene nombres históricos de ramas | Generalizar CI para futuras ramas sin requerir edición por sprint. |
| P3 | `release-check.yml` no existe | Cerrar como `DEFERRED → MVP-4`; no implementarlo ahora. |
| P3 | `appendAudit()` asume `actorId = ownerId` | Mantener para v1 mientras las mutaciones sean owner-only; documentar trigger de refactor futuro. |
| P3 | Flutter conserva metadata/boilerplate inicial | Limpiar metadata visible y comentarios innecesarios sin refactor funcional. |

---

# 8. Decisión semántica — `averageProgress`

`averageProgress` representará el progreso promedio de objetivos operativos/elegibles.

Los estados elegibles serán:

```text
ACTIVE
PAUSED
COMPLETED
```

Los Goals `CANCELLED` permanecerán en `totalGoals`, pero no participarán en `averageProgress`.

Definición:

```text
eligibleGoals =
ACTIVE
+
PAUSED
+
COMPLETED
```

```text
averageProgress =
Σ eligibleGoal.progress
/
eligibleGoals.length
```

Si:

```text
eligibleGoals.length == 0
```

entonces:

```text
averageProgress = 0
```

Ejemplo obligatorio de prueba:

```text
ACTIVE      80
PAUSED      40
COMPLETED  100
CANCELLED   10

averageProgress = 73.33
```

No:

```text
57.5
```

Esta decisión mantiene coherencia con `completionRate`, que también excluye objetivos `CANCELLED` de su denominador operativo.

---

# 9. Corrección semántica — `CHECKIN_VOIDED`

El evento `CHECKIN_VOIDED` no deberá utilizar un campo ambiguo:

```text
progress
```

si ese valor representa el snapshot resultante del Goal y no el CheckIn invalidado.

El payload deberá expresar ambos conceptos explícitamente.

Ejemplo:

```json
{
  "goalId": "...",
  "goalTitle": "...",
  "voidedProgress": 70,
  "resultingGoalProgress": 40
}
```

Interpretación:

```text
voidedProgress
=
progreso contenido en el CheckIn invalidado
```

```text
resultingGoalProgress
=
progreso efectivo del Goal después del void
```

El CheckIn invalidado deberá leerse antes de aplicar la operación de invalidación para conservar la semántica correcta del evento.

---

# 10. Cambios relacionados con auditoría

La corrección de `CHECKIN_VOIDED` requerirá revisar:

```text
Audit allowlist
Activity formatter
unit tests
E2E tests
```

No debe modificarse la naturaleza append-only de `AuditEvent`.

No debe ampliarse el payload con datos sensibles o innecesarios.

Continúan prohibidos:

```text
password
passwordHash
JWT
Authorization
API keys
DATABASE_URL
SEED_PASSWORD
CheckIn.notes
```

---

# 11. Auditoría de dependencias

Crear:

```text
docs/security/DEPENDENCY_AUDIT_AVANCE1.md
```

El objetivo es analizar el riesgo real de las vulnerabilidades reportadas por `npm audit`, no simplemente obtener un resultado numérico de cero.

Para cada advisory deberá documentarse:

```text
package
severity
direct / transitive
runtime / dev
dependency path
affected version
fixed version
reachable from production?
actual exposure in NeuroConnect?
action
result
```

Resultados permitidos:

```text
FIXED
NOT_RUNTIME_REACHABLE
TRANSITIVE_NO_COMPATIBLE_FIX
ACCEPTED_TEMPORARILY
```

Toda aceptación temporal deberá incluir justificación y condición de reevaluación.

---

# 12. Política de actualización de dependencias

Si existe una actualización:

```text
compatible
+
no rompe contratos
+
tests pass
+
Docker pass
```

se aplicará.

No se utilizará:

```bash
npm audit fix --force
```

como estrategia automática.

No se aceptará silenciosamente un major upgrade con breaking changes únicamente para reducir el contador de advisories.

El objetivo ideal es:

```text
runtime high = 0
```

pero el criterio de aceptación real será:

```text
riesgo conocido
+
clasificado
+
mitigado o documentado
```

---

# 13. CI — generalización de ramas

Los workflows no deberán requerir añadir manualmente cada nueva rama de desarrollo.

La configuración deberá permitir validación de ramas futuras como:

```text
sprint/avance1-closeout
mvp2-research
mvp2-provider
mvp2-completion
release/v1
```

Se recomienda una estrategia equivalente a:

```yaml
push:
pull_request:
```

para cualquier rama relevante del repositorio.

La implementación concreta podrá optimizarse siempre que futuras ramas reciban CI automáticamente.

---

# 14. `release-check.yml`

`release-check.yml` no forma parte de este sprint.

El hallazgo se cerrará como:

```text
Status:
DEFERRED

Target:
MVP-4

Reason:
release-check valida release readiness,
no la baseline funcional de Avance 1.
```

En MVP-4 deberá considerar, como mínimo:

```text
backend CI
frontend CI
Android build
migration check
security gate
Docker artifacts
backup / restore
release metadata
```

No deberá implementarse prematuramente en AVANCE-1-CLOSEOUT.

---

# 15. Decisión sobre `actorId`

Para la baseline actual se acepta:

```text
actorId == ownerId
```

porque las mutaciones auditadas de negocio siguen siendo owner-only y los supporters son read-only.

Estado:

```text
DECISION ACCEPTED FOR V1
```

No se realizará refactor durante este sprint.

Trigger explícito para revisar la decisión:

```text
cualquier mutación donde
actorId != ownerId
```

Ejemplos futuros:

- administrador;
- supporter con escritura;
- acción automática de sistema;
- worker/background job que produzca eventos de negocio.

En ese momento deberá evolucionarse hacia una firma equivalente a:

```text
appendAudit(
  tx,
  ownerId,
  actorId,
  ...
)
```

---

# 16. Flutter — limpieza de metadata

Realizar únicamente limpieza mínima.

Objetivo aproximado:

```yaml
name: neuroconnect
description: "NeuroConnect — Red Inteligente de Apoyo"
version: 0.1.0+1
```

Eliminar comentarios boilerplate que no aporten valor.

No realizar:

- reorganización de features;
- refactor general de widgets;
- cambios de navegación;
- cambios de state management;
- redesign visual.

---

# 17. Actualización de README

El README deberá reflejar ADR-008 como fuente de autoridad.

La sección correspondiente deberá quedar conceptualmente:

```text
Persistencia base
→ ADR-001

Dominio
→ ADR-002

Backend
→ ADR-003

Frontend
→ ADR-004

IA
→ ADR-005

Arquitectura
→ ADR-006

DevOps
→ ADR-007

Persistencia histórica / auditoría / red de apoyo
→ ADR-008
```

Debe indicarse que un ADR posterior prevalece únicamente sobre los puntos que modifica explícitamente.

---

# 18. Actualización de ROADMAP_V1.md

El roadmap deberá distinguir claramente:

```text
PLAN ORIGINAL
```

de:

```text
ESTADO REAL
```

Estado real posterior a MVP-1.5:

```text
MVP-0          DONE
MVP-1          DONE
MVP-1.5        DONE
MVP-2          STARTED / foundation only
MVP-3 core     ADVANCED THROUGH MVP-1.5
MVP-4          PENDING
```

Debe registrarse que MVP-1.5 adelantó deliberadamente capacidades originalmente previstas para MVP-3.

---

# 19. Separación Avance 1 / Avance 2

El roadmap deberá dejar explícito:

```text
AVANCE 1
=
baseline funcional hasta MVP-1.5
+
foundation técnica de MVP-2
```

```text
AVANCE 2
=
investigación de modelos
+
benchmark
+
selección
+
integración IA real
+
AISummary productivo
+
UI IA
```

La investigación de modelos no comenzará dentro de este sprint.

---

# 20. Actualización de `MVP15_REPORT.md`

No se eliminará ni reescribirá el estado histórico generado antes del merge.

Se añadirá una sección posterior equivalente a:

```text
## Post-Merge Human Acceptance

Date: 2026-10-15

PR #4:
MERGED

Merge commit:
d3920d955956263b3baac72d0dd4a350e697df9e

Human local validation:
PASS

Validated:
- Docker Compose build/start
- seed
- full smoke
- PostgreSQL healthy
- backend healthy
- frontend healthy

Final acceptance:
HUMAN_ACCEPTED
```

La sección original deberá permanecer para conservar la trazabilidad temporal del reporte.

---

# 21. Actualización de `docs/AVANCE-1.md`

`docs/AVANCE-1.md` deberá representar el estado real al cierre del sprint.

La narrativa debe distinguir:

```text
Plan inicial
```

de:

```text
Resultado real
```

Plan inicial:

```text
MVP-0 completo
MVP-1 completo
inicio MVP-2
```

Resultado real:

```text
MVP-0 completo
MVP-1 completo
foundation MVP-2
+
MVP-1.5 completo
```

MVP-1.5 deberá describirse como una modificación al plan inicial realizada debido al avance técnico superior al cronograma previsto y utilizada para validar anticipadamente:

- persistencia histórica;
- auditoría;
- red de apoyo;
- permisos;
- autorización entre usuarios;
- revocación;
- vistas delegadas.

No deberá presentarse como una actividad que siempre estuvo incluida en el plan original del Avance 1.

---

# 22. Congelación de Analytics antes de IA real

Después de este sprint deberá considerarse estable el contrato:

```text
PostgreSQL
    ↓
Analytics
    ↓
SummaryContext
```

MVP-2/Avance 2 podrá evaluar modelos contra esa baseline.

No deberán cambiarse reglas fundamentales de Analytics durante el benchmark salvo que se detecte un defecto real y documentado.

---

# 23. Regresión de AI Preview

La modificación de `averageProgress` deberá reflejarse automáticamente en `SummaryContext` mediante Analytics.

Debe verificarse que:

```text
AI Preview
```

continúe funcionando y que no exista cálculo alternativo dentro de `SummaryContextBuilder`.

Debe mantenerse:

```text
providerConfigured = false
```

No se integrará ningún proveedor real en este sprint.

---

# 24. Fases de ejecución

## Fase 1 — Baseline

Ejecutar todos los gates existentes antes de realizar cambios.

Verificar:

```text
backend tests
Flutter tests
Docker
Compose
migrations
seed
smoke
```

Registrar resultados iniciales.

---

## Fase 2 — Correcciones semánticas

Implementar:

```text
CHECKIN_VOIDED payload
+
averageProgress
```

Añadir/actualizar pruebas.

---

## Fase 3 — Auditoría de dependencias

Ejecutar auditoría reproducible y crear:

```text
docs/security/DEPENDENCY_AUDIT_AVANCE1.md
```

Aplicar únicamente actualizaciones compatibles justificadas.

---

## Fase 4 — CI y metadata

Implementar:

```text
CI branch generalization
+
Flutter metadata cleanup
```

No agregar release pipeline.

---

## Fase 5 — Sincronización documental

Actualizar:

```text
README.md
ROADMAP_V1.md
MVP15_REPORT.md
docs/AVANCE-1.md
```

Registrar explícitamente los hallazgos diferidos.

---

## Fase 6 — Regresión final

Ejecutar todos los gates técnicos y smoke del sistema completo.

---

# 25. Scope excluido

AVANCE-1-CLOSEOUT no implementará:

```text
model research
model benchmark
provider comparison
provider real
LLM API integration
productive AISummary generation
AI UI final
RAG
vector database
agents
fine-tuning
MVP-3 additional features
public deployment
monitoring
backup/restore production
release-check workflow
Android final acceptance
MVP-4 hardening
```

---

# 26. Definition of Done

El sprint no podrá declararse cerrado hasta cumplir:

```text
[ ] CHECKIN_VOIDED audit semantics corrected
[ ] audit tests updated
[ ] Activity representation updated

[ ] averageProgress excludes CANCELLED
[ ] analytics tests updated
[ ] Dashboard regression PASS
[ ] AI Preview regression PASS

[ ] npm dependency audit executed
[ ] all runtime highs evaluated
[ ] compatible security fixes applied
[ ] dependency audit document created

[ ] CI works for future branches
[ ] backend CI PASS
[ ] frontend CI PASS

[ ] README references ADR-008
[ ] ROADMAP reflects MVP-1.5 actual state
[ ] MVP15 report has post-merge acceptance
[ ] AVANCE-1 reflects final actual implementation

[ ] release-check explicitly deferred to MVP-4
[ ] actorId design explicitly accepted until multi-actor mutation exists

[ ] Flutter metadata cleaned

[ ] backend lint PASS
[ ] backend unit PASS
[ ] backend E2E PASS
[ ] backend build PASS

[ ] Flutter analyze PASS
[ ] Flutter tests PASS
[ ] Flutter Web build PASS

[ ] migrations from clean DB PASS
[ ] seed PASS
[ ] full HTTP smoke PASS

[ ] backend Docker build PASS
[ ] frontend Docker build PASS

[ ] docker compose up -d --build --wait PASS
[ ] PostgreSQL healthy
[ ] backend healthy
[ ] frontend healthy

[ ] git diff --check PASS
[ ] working tree clean
```

---

# 27. Baseline funcional a congelar

Después de completar el sprint, la fotografía funcional del Avance 1 será:

```text
Auth                    DONE
Profile                 DONE
Goals                   DONE
CheckIns                DONE
Historical persistence  DONE
Audit                   DONE
Analytics               DONE
Dashboard               DONE
SupportNetwork core     DONE
Delegated permissions   DONE

AI architecture         DONE
AI context              DONE
AI safety prompt        DONE
AI provider abstraction DONE

Real LLM                NOT STARTED
Model evaluation        NOT STARTED
Productive AISummary    NOT STARTED
AI UI                   NOT STARTED

Public deployment       PENDING
Android acceptance      PENDING
Release hardening       PENDING
```

---

# 28. Estado conceptual posterior

Al cerrar este sprint:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        AVANCE 1
          CLOSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

El proyecto continuará con:

```text
AVANCE 2
```

---

# 29. Entrada a Avance 2

Avance 2 comenzará con investigación y validación de IA.

Secuencia esperada:

```text
Research
    ↓
6+ candidate models
    ↓
Weighted Decision Matrix
    ↓
Blind NeuroConnect Benchmark
    ↓
Integration / Operational Spike
    ↓
Model decision
    ↓
Provider integration
    ↓
AISummary lifecycle
    ↓
AI UI
    ↓
MVP-2 completion
```

No deberá seleccionarse un modelo antes de completar la metodología establecida en ADR-005.

---

# 30. Criterio de freeze

Una vez completado AVANCE-1-CLOSEOUT y aceptado por el responsable humano:

```text
Analytics contract
+
SummaryContext contract
+
MVP-1.5 domain semantics
```

se consideran baseline estable para la investigación de Avance 2.

Los cambios posteriores deberán limitarse a:

- defectos confirmados;
- seguridad;
- requisitos explícitamente aprobados;
- decisiones derivadas del proceso formal de MVP-2.

---

# 31. Tag de baseline

Después del merge y validación humana podrá crearse un tag opcional como:

```text
avance-1
```

o:

```text
v0.2.0-avance1
```

La selección definitiva del tag se realizará después del cierre del PR.

No debe utilizarse:

```text
v1.0.0
```

porque la versión final del sistema todavía no está completa.

---

# 32. Criterio de éxito

AVANCE-1-CLOSEOUT será exitoso cuando:

> NeuroConnect conserve una baseline funcional y reproducible con dominio, persistencia histórica, auditoría, Analytics, red de apoyo y permisos estabilizados; las métricas que alimentarán IA tengan semántica definida; los riesgos de dependencias se encuentren comprendidos y documentados; y la documentación refleje fielmente el trabajo realmente realizado antes de iniciar la investigación de modelos del Avance 2.

---

# 33. Estado del documento

```text
PLAN DE SPRINT
AVANCE-1-CLOSEOUT

PENDIENTE DE EJECUCIÓN
```
