
# NeuroConnect — Roadmap integral de desarrollo v1.0.0

**Estado:** Aprobado para ejecución  
**Fecha de baseline:** 14 de octubre de 2026  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Periodo académico:** Agosto–Diciembre 2026  
**Fecha objetivo de cierre:** Primera semana de diciembre de 2026  
**Responsable:** Carlos Benjamín Armenta Márquez  
**Materia:** Inteligencia Artificial (G)  
**Modalidad:** Global  

---

# 1. Propósito

Este documento define el roadmap completo de implementación de NeuroConnect desde la baseline documental actual hasta la entrega de la versión académica:

```text
v1.0.0
```

El roadmap convierte en una secuencia ejecutable las decisiones contenidas en:

```text
Anteproyecto oficial

ADR-001 — Esquema relacional y modelo de datos
ADR-002 — Dominio y diseño
ADR-003 — Backend
ADR-004 — Frontend
ADR-005 — Integración de IA
ADR-006 — Arquitectura integral
ADR-007 — DevOps e infraestructura

PLAN_IMPLEMENTACION_AVANCE_1.md
```

Su función es responder:

```text
qué debe existir
+
en qué orden debe construirse
+
cuándo debe estar terminado
+
qué define que una etapa está completa
+
qué evidencia debe conservarse
+
qué falta para v1.0.0
```

---

# 2. Autoridad documental

La jerarquía del proyecto será:

```text
Anteproyecto oficial
        ↓
ADR aceptados
        ↓
ROADMAP_V1
        ↓
Planes de implementación específicos
        ↓
Código
        ↓
Evidencias
```

El roadmap:

```text
NO
```

puede modificar unilateralmente:

- objetivo del proyecto;
- población objetivo;
- delimitación;
- arquitectura;
- dominio;
- modelo de datos;
- contratos;
- reglas de privacidad;
- estrategia IA;
- tecnologías aprobadas.

---

# 3. Relación con el cronograma del anteproyecto

El anteproyecto establece el siguiente cronograma académico:

```text
25 sep – 4 oct
Anteproyecto
Investigación
Requerimientos
Estado del arte inicial
Arquitectura
Modelo conceptual
Mockups

5 – 18 oct
Backend base
Autenticación
Usuarios
Objetivos
Check-ins
Base de datos

19 oct – 1 nov
Cliente Flutter
Autenticación
Objetivos
Check-ins
Historial

2 – 8 nov
Analítica
Indicadores
Tendencias
Dashboard

9 – 15 nov
IA generativa
Prompts
Resúmenes
Validación

16 – 22 nov
Red de apoyo
Permisos
Expiración
Compartición
Revocación

23 – 29 nov
Pruebas
Correcciones
UX
Seguridad
Despliegue

30 nov – 6 dic
Documento final
Evidencias
Resultados
Conclusiones
Presentación
Entrega
```

Este roadmap conserva esas fechas como:

```text
baseline académica oficial
```

---

# 4. Aceleración técnica del Avance 1

`PLAN_IMPLEMENTACION_AVANCE_1.md` adelanta parte del trabajo originalmente previsto para noviembre.

Objetivo del Avance 1:

```text
MVP-0 = 100 %

MVP-1 = 100 %

MVP-2 = 20–30 %

MVP-3 = 0 %

MVP-4 = 0 %
```

Por tanto, el proyecto podrá llegar al 16 de octubre adelantado respecto al cronograma original.

Esto se interpreta como:

```text
aceleración de implementación
```

y no como:

```text
modificación del alcance oficial
```

---

# 5. Objetivo final de v1.0.0

Al finalizar el semestre NeuroConnect deberá permitir el siguiente flujo:

```text
Usuario se registra
      ↓
Inicia sesión
      ↓
Crea objetivo
      ↓
Registra check-ins
      ↓
Consulta historial
      ↓
Consulta dashboard
      ↓
Obtiene indicadores
      ↓
Obtiene tendencias
      ↓
Genera resumen mediante IA
      ↓
Agrega miembro de apoyo
      ↓
Define permisos
      ↓
Miembro consulta información autorizada
      ↓
Propietario modifica/revoca acceso
      ↓
Acceso desaparece
```

---

# 6. Resultado académico esperado

v1.0.0 deberá demostrar:

```text
seguimiento estructurado
+
persistencia
+
analítica determinística
+
IA generativa
+
control de acceso
+
red de apoyo
+
privacidad
+
multiplataforma
+
despliegue público
```

---

# 7. Definition of Done global

NeuroConnect v1.0.0 se considerará terminado únicamente cuando:

```text
MVP-0 = DONE
MVP-1 = DONE
MVP-2 = DONE
MVP-3 = DONE
MVP-4 = DONE
```

y el escenario E2E completo funcione.

---

# 8. Incrementos oficiales

La versión 1.0.0 estará compuesta por:

```text
MVP-0
Núcleo

MVP-1
Analítica

MVP-2
IA

MVP-3
Red de apoyo

MVP-4
Cierre y hardening
```

---

# 9. Estado general al iniciar este roadmap

Al 14 de octubre de 2026 existe:

```text
Documentación
██████████ 100 % baseline arquitectónica

Código
pendiente de inicialización / implementación
```

Baseline documental disponible:

```text
Anteproyecto
ADR-001
ADR-002
ADR-003
ADR-004
ADR-005
ADR-006
ADR-007
PLAN_IMPLEMENTACION_AVANCE_1
ROADMAP_V1
```

---

# 10. Macro-roadmap

```text
Documentación base
      ↓
Repository Foundation
      ↓
MVP-0
      ↓
MVP-1
      ↓
Avance 1
      ↓
MVP-2
      ↓
MVP-3
      ↓
Integration Hardening
      ↓
MVP-4
      ↓
Release Candidate
      ↓
v1.0.0
      ↓
Documento final
```

---

# 11. Roadmap temporal global

```text
14–16 oct
Avance 1
MVP-0 + MVP-1 + inicio MVP-2

17–18 oct
Estabilización post-Avance 1

19 oct – 1 nov
Consolidación Flutter y experiencia completa MVP-0/MVP-1

2 – 8 nov
Validación y hardening Analytics/Dashboard
Preparación formal MVP-2

9 – 15 nov
MVP-2 IA completo

16 – 22 nov
MVP-3 Red de apoyo completo

23 – 29 nov
MVP-4
Testing
UX
Security
DevOps
Deployment

30 nov – 6 dic
Release v1.0.0
Documentación académica
Evidencias
Presentación
Entrega
```

---

# 12. Regla de ejecución

Se trabajará mediante:

```text
vertical slices
```

y no mediante:

```text
todos los módulos parcialmente terminados
```

Prioridad:

```text
funciona de extremo a extremo
        >
cantidad de funcionalidades iniciadas
```

---

# 13. Fase 0 — Baseline documental

## Estado esperado

```text
DONE
```

## Incluye

```text
Anteproyecto

ADR-001
ADR-002
ADR-003
ADR-004
ADR-005
ADR-006
ADR-007

PLAN_IMPLEMENTACION_AVANCE_1
ROADMAP_V1
```

## Gate

Antes de generar código:

```text
[ ] Codex leyó documentación
[ ] contradicciones identificadas
[ ] ninguna decisión estructural pendiente bloqueante
```

---

# 14. Fase 1 — Repository Foundation

Objetivo:

> Convertir la documentación en un repositorio ejecutable y reproducible.

---

# 15. Estructura objetivo

```text
neuro-connect/
│
├── app/
│
├── backend/
│
├── docs/
│   ├── ADRS/
│   ├── Planeacion/
│   ├── evidence/
│   ├── ai/
│   └── operations/
│
├── infra/
│
├── .github/
│   └── workflows/
│
├── compose.yaml
├── .gitignore
├── README.md
└── LICENSE
```

---

# 16. Foundation Backend

Crear:

```text
backend/
```

con:

```text
NestJS
TypeScript
Prisma
PostgreSQL
Jest
Swagger
ConfigModule
ValidationPipe
JWT
Argon2id
```

---

# 17. Foundation Flutter

Crear:

```text
app/
```

con:

```text
Flutter
Material 3
Riverpod
go_router
Dio
fl_chart
```

---

# 18. Foundation DevOps

Crear:

```text
Dockerfile
Docker Compose
.env.example
.gitignore
health endpoint
GitHub Actions baseline
```

---

# 19. Gate de Foundation

No iniciar lógica funcional antes de verificar:

```text
[ ] backend compila
[ ] frontend compila
[ ] PostgreSQL inicia
[ ] Prisma conecta
[ ] migrations funcionan
[ ] backend tests ejecutan
[ ] Flutter tests ejecutan
[ ] Docker build funciona
```

---

# 20. MVP-0 — Núcleo

## Objetivo

Construir el sistema mínimo capaz de:

```text
registrar usuarios
+
autenticar
+
crear objetivos
+
registrar check-ins
+
conservar historial
```

---

# 21. Alcance MVP-0

Incluye:

```text
Auth
Users
Goals
CheckIns
Profile
Persistence
Ownership
History
```

---

# 22. Backend MVP-0

Módulos:

```text
AuthModule
UsersModule
GoalsModule
CheckInsModule
```

---

# 23. Auth

Implementar:

```text
POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/me
```

---

# 24. User

Debe contener:

```text
id
email
passwordHash
displayName
createdAt
updatedAt
```

---

# 25. Seguridad Auth

Obligatorio:

```text
Argon2id

JWT Bearer

passwordHash nunca expuesto

DTO validation

ownership
```

---

# 26. Goals

Implementar:

```text
create
list
detail
update
delete
```

---

# 27. Goal lifecycle

Estados:

```text
ACTIVE
PAUSED
COMPLETED
```

---

# 28. Goal progress

Regla:

```text
Goal.progress
```

se actualiza mediante:

```text
CheckIn
```

No mediante edición directa del objetivo.

---

# 29. CheckIns

Campos:

```text
progress
difficulty
completion
notes
createdAt
```

---

# 30. Validaciones CheckIn

```text
progress ∈ [0,100]

difficulty ∈ [1,5]

completion ∈
NOT_MET
PARTIAL
MET
```

---

# 31. Regla CheckIn

Solo se podrá crear para:

```text
Goal.status = ACTIVE
```

---

# 32. Transacción CheckIn

Crear check-in y actualizar:

```text
Goal.progress
```

deberá mantenerse consistente.

---

# 33. Historial

Debe permitir:

```text
Goal
   ↓
CheckIns
   ↓
timeline
```

---

# 34. Flutter MVP-0

Pantallas:

```text
Register
Login

Profile

Goals List
Goal Create
Goal Detail
Goal Edit

CheckIn Create
CheckIn History
```

---

# 35. Session

Implementar:

```text
unknown
unauthenticated
authenticated
```

---

# 36. Restore session

Flujo:

```text
token
 ↓
GET /auth/me
 ↓
session valid?
```

---

# 37. Definition of Done MVP-0

```text
[ ] registro funciona

[ ] login funciona

[ ] sesión se restaura

[ ] logout funciona

[ ] perfil puede consultarse

[ ] objetivo puede crearse

[ ] objetivo puede editarse

[ ] objetivo puede eliminarse

[ ] objetivos están aislados por owner

[ ] check-in puede crearse

[ ] Goal.progress se actualiza

[ ] historial puede consultarse

[ ] PAUSED rechaza nuevos check-ins

[ ] COMPLETED rechaza nuevos check-ins

[ ] frontend consume backend real

[ ] tests pasan
```

---

# 38. MVP-1 — Analítica

## Objetivo

Convertir el historial de seguimiento en:

```text
indicadores
+
tendencias
+
visualización
```

---

# 39. AnalyticsModule

Formará parte del backend NestJS.

No será microservicio.

---

# 40. Métricas globales

Implementar como mínimo:

```text
totalGoals

activeGoals

pausedGoals

completedGoals

completionRate

averageProgress

checkInsLast28Days

checkInFrequencyPerWeek

inactiveGoals
```

---

# 41. Métricas por Goal

```text
progress

deltaProgress

averageDifficulty

daysSinceLastCheckIn

checkInCount

trend

insufficientHistory
```

---

# 42. Tendencias

Clasificaciones:

```text
PROGRESSING

STABLE

DECLINING

INACTIVE
```

---

# 43. Naturaleza de tendencias

Estas categorías son:

```text
descripciones matemáticas
```

y nunca:

```text
diagnósticos
evaluaciones psicológicas
```

---

# 44. API Analytics

Deberá permitir como mínimo:

```text
GET /api/v1/analytics/overview

GET /api/v1/analytics/goals/:goalId
```

según contratos finales de ADR-003.

---

# 45. Dashboard

Debe mostrar:

```text
objetivos activos

objetivos completados

progreso promedio

check-ins recientes

frecuencia

inactividad

tendencias

historial temporal
```

---

# 46. Gráfica

Debe existir al menos:

```text
progress over time
```

mediante:

```text
fl_chart
```

---

# 47. Insufficient history

Cuando no existan datos suficientes:

```text
insufficientHistory = true
```

La interfaz deberá indicarlo explícitamente.

---

# 48. Definition of Done MVP-1

```text
[ ] overview analytics funciona

[ ] goal analytics funciona

[ ] métricas son determinísticas

[ ] tendencias tienen tests

[ ] casos límite tienen tests

[ ] dashboard consume API real

[ ] gráfica temporal funciona

[ ] empty states funcionan

[ ] insufficient history funciona

[ ] no existe cálculo IA en Analytics

[ ] pruebas E2E pasan
```

---

# 49. Milestone — Avance 1

## Fecha

```text
16 de octubre de 2026
```

## Objetivo técnico

```text
MVP-0 = 100 %

MVP-1 = 100 %

MVP-2 = iniciado
```

---

# 50. MVP-2 iniciado en Avance 1

Debe existir:

```text
AiModule

SummaryContextBuilder

PromptBuilder

AiProvider

MockAiProvider

AI Preview
```

---

# 51. Lo que NO requiere Avance 1

No requiere:

```text
LLM real

MODEL-EVALUATION completo

SupportNetwork

deployment final

hardening final
```

---

# 52. Evidencias Avance 1

Capturar:

```text
repositorio

arquitectura

Docker

Swagger

registro

login

objetivos

check-ins

historial

dashboard

analytics

tests

AI preview

estado del proyecto
```

---

# 53. Gate post-Avance 1

Después del 16 de octubre:

```text
NO
```

continuar inmediatamente agregando funcionalidad si:

```text
MVP-0 o MVP-1
```

tienen defectos críticos.

Primero:

```text
stabilize
```

---

# 54. Fase de estabilización — 17 y 18 octubre

Objetivo:

```text
convertir Avance 1 en baseline confiable
```

---

# 55. Actividades post-Avance 1

```text
resolver bugs

eliminar mocks accidentales

revisar tests

actualizar documentación

limpiar TODO críticos

revisar migrations

revisar seeds

tag de baseline
```

---

# 56. Release sugerida

```text
v0.4.0
```

o versión equivalente que represente:

```text
MVP-0 + MVP-1
```

---

# 57. 19 octubre – 1 noviembre

Esta ventana del anteproyecto corresponde formalmente al cliente Flutter.

Dado que parte del frontend habrá sido adelantado para Avance 1, se utilizará para:

```text
consolidar
+
completar
+
refinar
```

la experiencia móvil/Web.

---

# 58. Trabajo Flutter de consolidación

Completar:

```text
responsive layout

mobile navigation

desktop navigation

forms

validation UX

loading states

error states

empty states

session behavior

routing

accessibility baseline
```

---

# 59. Android

Durante esta fase deberá probarse:

```text
flutter build apk
```

y:

```text
app real
→
backend
```

---

# 60. Web

Validar:

```text
flutter build web

responsive

browser refresh

routing

auth

API
```

---

# 61. Compatibilidad iOS

Mantener:

```text
single Flutter codebase
```

sin introducir dependencias que rompan compilación conceptual para iOS.

No se exige:

```text
App Store publication
```

---

# 62. Gate frontend consolidado

```text
[ ] Web usable

[ ] Android usable

[ ] same API

[ ] no platform-specific domain logic

[ ] navigation complete

[ ] forms complete

[ ] accessibility baseline
```

---

# 63. 2 – 8 noviembre

Según el cronograma oficial:

```text
Analytics
Dashboard
Tendencias
```

Como MVP-1 deberá haberse adelantado, esta semana se utilizará como:

```text
validation + hardening buffer
```

y para preparar MVP-2.

---

# 64. Hardening Analytics

Revisar:

```text
fórmulas

boundary cases

timezone

ordering

no CheckIns

1 CheckIn

many CheckIns

paused goals

completed goals

inactive goals
```

---

# 65. Dataset analítico sintético

Crear casos reproducibles:

```text
PROGRESSING

STABLE

DECLINING

INACTIVE

insufficient history
```

---

# 66. Preparación formal de IA

Antes de comparar modelos deberán estar estables:

```text
Analytics contracts

SummaryContext schema

Prompt v1

AISummary persistence
```

---

# 67. MVP-2 — IA generativa

## Ventana oficial

```text
9 – 15 noviembre
```

---

# 68. Objetivo MVP-2

Implementar:

```text
Analytics
    ↓
SummaryContext
    ↓
Prompt
    ↓
AiProvider
    ↓
Real LLM
    ↓
AISummary
```

---

# 69. Modelo IA

La elección:

```text
NO
```

se encuentra cerrada anticipadamente.

Debe ejecutarse ADR-005.

---

# 70. Shortlist

Evaluar mínimo:

```text
6 alternativas
```

entre las familias aprobadas por ADR-005.

---

# 71. Estrategias de evaluación

Ejecutar:

```text
Weighted Decision Matrix

Blind NeuroConnect Benchmark

Integration / Operational Spike
```

---

# 72. Benchmark

Utilizar:

```text
mínimo 30 casos sintéticos
```

Idealmente:

```text
50–100
```

si el tiempo disponible lo permite.

---

# 73. Criterios críticos IA

Prioridad:

```text
fidelidad

seguridad

no inferencia clínica

español

consistencia

latencia

costo
```

---

# 74. Criterios eliminatorios

Descartar modelo si:

```text
inventa métricas

contradice valores

diagnostica

recomienda tratamiento

ignora restricciones

viola requisitos de privacidad
```

---

# 75. Selección final

Producir:

```text
docs/ai/MODEL-EVALUATION.md
```

---

# 76. Adapter productivo

Implementar únicamente:

```text
1 proveedor real principal
```

para v1.0.0.

---

# 77. AISummary lifecycle

```text
PENDING
   ↓
COMPLETED
```

o:

```text
PENDING
   ↓
FAILED
```

---

# 78. Datos enviados al LLM

Solamente:

```text
SummaryContext
```

---

# 79. Datos excluidos

Nunca:

```text
password

passwordHash

JWT

email

CheckIn.notes

SupportRelationship

permissions

credentials

unnecessary IDs
```

---

# 80. Frontend IA

Implementar:

```text
Generate Summary

loading

success

failure

history

detail

disclaimer
```

---

# 81. Disclaimer

Toda salida deberá identificarse explícitamente como:

```text
contenido generado por IA
```

y no como evaluación profesional.

---

# 82. Definition of Done MVP-2

```text
[ ] model evaluation complete

[ ] provider selected

[ ] model selected

[ ] adapter real implementado

[ ] API key solo backend

[ ] SummaryContextBuilder estable

[ ] PromptBuilder estable

[ ] PENDING funciona

[ ] COMPLETED funciona

[ ] FAILED funciona

[ ] inputSnapshot persiste

[ ] provider persiste

[ ] model persiste

[ ] history funciona

[ ] frontend completo

[ ] disclaimer visible

[ ] notes excluidas

[ ] benchmark documentado

[ ] integración real probada
```

---

# 83. Milestone posterior a MVP-2

Versión sugerida:

```text
v0.7.0
```

Significado:

```text
Core
+
Analytics
+
AI
```

completos.

---

# 84. MVP-3 — Red de apoyo

## Ventana oficial

```text
16 – 22 noviembre
```

---

# 85. Objetivo

Permitir:

```text
propietario
   ↓
autoriza
   ↓
supporter
   ↓
consulta selectiva
```

---

# 86. SupportRelationship

Implementar:

```text
ownerId

supporterId

canViewGoals

canViewProgress

canViewSummaries

authorizedAt

expiresAt

revokedAt
```

---

# 87. Permisos

```text
VIEW_GOALS

VIEW_PROGRESS

VIEW_SUMMARIES
```

---

# 88. Dependencias de permisos

```text
VIEW_PROGRESS
→ requiere VIEW_GOALS

VIEW_SUMMARIES
→ requiere VIEW_GOALS
```

---

# 89. Alta de supporter

La relación se creará mediante:

```text
email conocido
```

No habrá:

```text
directorio global de usuarios
```

---

# 90. Estados de relación

```text
ACTIVE

EXPIRED

REVOKED
```

---

# 91. Expiración

Se evaluará:

```text
en tiempo de request
```

No requiere worker.

---

# 92. Revocación

Debe surtir efecto:

```text
en la siguiente request
```

---

# 93. Reactivación

Permitirá restablecer:

```text
permisos
+
expiresAt
```

---

# 94. Supporter

Será:

```text
read-only
```

---

# 95. Vistas delegadas

Deben ser independientes de:

```text
mis objetivos
```

---

# 96. SupportAccessService

Toda lectura delegada deberá pasar por:

```text
relationship active?
       ↓
permission available?
       ↓
safe projection
```

---

# 97. Proyección VIEW_GOALS

Puede incluir:

```text
title
description
category
status
progress
targetDate
```

según contrato backend.

---

# 98. Proyección VIEW_PROGRESS

Puede agregar:

```text
timeline
difficulty
completion
trend
analytics
```

Nunca:

```text
notes
```

---

# 99. Proyección VIEW_SUMMARIES

Solo:

```text
COMPLETED summaries
```

Nunca:

```text
inputSnapshot
provider internals
model internals
```

---

# 100. Frontend SupportNetwork

Implementar:

```text
Mi red

Agregar miembro

Editar permisos

Expiración

Revocar

Reactivar

Personas a las que apoyo

Vista delegada
```

---

# 101. Definition of Done MVP-3

```text
[ ] relation create

[ ] duplicate control

[ ] permissions validation

[ ] expiration works

[ ] revoke works

[ ] reactivate works

[ ] supporter list works

[ ] delegated goals work

[ ] delegated progress works

[ ] delegated summaries work

[ ] notes never exposed

[ ] write operations impossible

[ ] revoked access disappears

[ ] expired access disappears

[ ] cross-user E2E passes
```

---

# 102. Milestone MVP-3

Versión sugerida:

```text
v0.9.0
```

Significa:

```text
toda funcionalidad v1
implementada
```

Falta:

```text
hardening
+
deployment
+
release
```

---

# 103. MVP-4 — Cierre

## Ventana oficial

```text
23 – 29 noviembre
```

---

# 104. Objetivo MVP-4

Transformar:

```text
feature-complete
```

en:

```text
release-ready
```

---

# 105. Categorías MVP-4

```text
Testing

Security

UX

Accessibility

DevOps

Deployment

Observability

Recovery

Documentation
```

---

# 106. Testing backend

Ejecutar:

```text
unit tests

integration tests

E2E
```

---

# 107. Testing frontend

Ejecutar:

```text
unit tests

widget tests

integration tests
```

---

# 108. E2E principal

```text
User A register
        ↓
Goal
        ↓
CheckIns
        ↓
Analytics
        ↓
AI
        ↓
User B
        ↓
SupportRelation
        ↓
Delegated access
        ↓
Revoke
        ↓
Access denied
```

---

# 109. Seguridad

Revisar:

```text
authentication

ownership

delegated authorization

DTO validation

rate limiting

Helmet

CORS

secrets

logging

LLM boundary

SQL access through Prisma
```

---

# 110. UX

Revisar:

```text
loading

empty

error

confirmation

responsive

labels

neutral language

no clinical terminology
```

---

# 111. Accesibilidad

Validar:

```text
contrast

text scaling

touch targets

semantics

keyboard Web

focus
```

---

# 112. DevOps

Completar:

```text
Docker

Compose

CI

public backend

public frontend

persistent DB

HTTPS

health

monitoring

logs

backups

restore

rollback
```

---

# 113. Infraestructura

Costo obligatorio:

```text
$0
```

---

# 114. Deployment objetivo

Preferido:

```text
Cloudflare Pages
      ↓
Flutter Web

Always-Free Linux VM
      ↓
Docker NestJS

Managed PostgreSQL Free
```

Fallback:

```text
Cloudflare Pages
+
Render Free
+
Neon Free
```

o equivalentes que respeten ADR-007.

---

# 115. Web pública

Debe poder abrirse:

```text
desde Internet
```

sin:

```text
VPN

LAN

túnel temporal

computadora del desarrollador
```

---

# 116. API pública

Debe exponer:

```text
HTTPS
/api/v1
```

---

# 117. Android

APK deberá consumir:

```text
same public API
```

que Flutter Web.

---

# 118. CI

GitHub Actions deberá validar como mínimo:

```text
backend:
lint
tests
E2E
build

frontend:
analyze
tests
web build
```

---

# 119. Monitoring

Mínimo:

```text
Web availability

API health
```

---

# 120. Logging

Debe existir acceso a:

```text
application logs

deployment logs
```

sin datos sensibles.

---

# 121. Backup

Debe ejecutarse:

```text
pg_dump
```

antes de release final.

---

# 122. Restore test

Antes de v1.0.0:

```text
backup
 ↓
new DB
 ↓
restore
 ↓
application validation
```

---

# 123. Runbooks

Crear:

```text
docs/operations/DEPLOYMENT-RUNBOOK.md

docs/operations/BACKUP-RESTORE-RUNBOOK.md

docs/operations/INCIDENT-RUNBOOK.md

docs/operations/RELEASE-RUNBOOK.md
```

---

# 124. Definition of Done MVP-4

```text
[ ] E2E completo

[ ] security review

[ ] responsive review

[ ] accessibility baseline

[ ] Docker reproducible

[ ] CI green

[ ] HTTPS public

[ ] Web public

[ ] API public

[ ] Android connected

[ ] persistent DB

[ ] monitoring

[ ] logs

[ ] backup

[ ] restore test

[ ] rollback procedure

[ ] runbooks

[ ] infrastructure cost = $0
```

---

# 125. Feature Freeze

Fecha objetivo:

```text
25–29 noviembre
```

---

# 126. Regla de freeze

Después de:

```text
feature freeze
```

no se incorporarán nuevas funcionalidades salvo:

```text
bug fixes
security fixes
release blockers
```

---

# 127. Release Candidate

Crear:

```text
v1.0.0-rc.1
```

---

# 128. Criterio RC

```text
[ ] MVP-0 DONE
[ ] MVP-1 DONE
[ ] MVP-2 DONE
[ ] MVP-3 DONE
[ ] MVP-4 funcional
[ ] tests green
[ ] deployment public
```

---

# 129. RC testing

Ejecutar desde:

```text
navegador externo
+
Android real
```

---

# 130. No evidencia sobre localhost

Las evidencias finales principales deberán usar:

```text
deployment público
```

cuando corresponda.

---

# 131. 30 noviembre – 6 diciembre

Esta ventana:

```text
NO
```

será utilizada para desarrollar funcionalidades nuevas.

---

# 132. Objetivo de la última semana

```text
release
+
evidencias
+
resultados
+
documentación
+
presentación
```

---

# 133. Release v1.0.0

Antes de publicar:

```text
CI green
    ↓
backup
    ↓
migrations
    ↓
backend deploy
    ↓
health
    ↓
frontend deploy
    ↓
smoke test
    ↓
E2E
    ↓
tag v1.0.0
```

---

# 134. Version final

```text
v1.0.0
```

representará:

> MVP académico completo de NeuroConnect correspondiente al proyecto final de Inteligencia Artificial (G).

---

# 135. Evidencias v1.0.0

Capturar como mínimo:

```text
Flutter Web público

Android

Login

Profile

Goals

CheckIns

History

Dashboard

Analytics

Trend

AI summary

AI disclaimer

SupportNetwork

Permissions

Delegated view

Revocation

Swagger

Database

Tests

CI

Deployment

HTTPS

Health

Monitoring
```

---

# 136. Evidencia IA

Conservar:

```text
MODEL-EVALUATION

benchmark

modelo elegido

prompt

input estructurado

summary

latencia

resultados
```

sin exponer API keys.

---

# 137. Evidencia privacidad

Demostrar:

```text
User B
→ no access

permission granted
→ limited access

permission revoked
→ no access
```

---

# 138. Evidencia analítica

Demostrar al menos:

```text
PROGRESSING

STABLE

DECLINING

INACTIVE
```

mediante datasets reproducibles.

---

# 139. Documento final

Deberá obtener contenido técnico del repositorio real.

No:

```text
describir funcionalidades inexistentes
```

---

# 140. Resultados

El documento deberá distinguir:

```text
planificado

implementado

validado

limitaciones

trabajo futuro
```

---

# 141. Congelación de evidencia

Una vez capturadas evidencias:

```text
NO production changes
```

salvo corrección bloqueante.

---

# 142. Final Acceptance Test

El criterio principal será:

```text
Usuario A
  ↓
Registro
  ↓
Objetivo
  ↓
Check-ins
  ↓
Historial
  ↓
Dashboard
  ↓
Analytics
  ↓
Resumen IA
  ↓
SupportRelationship
  ↓
Usuario B
  ↓
Consulta autorizada
  ↓
Revocación
  ↓
Acceso rechazado
```

---

# 143. Acceptance Test — Seguridad

Adicionalmente:

```text
User B
```

no deberá poder:

```text
editar Goal de A

crear CheckIn de A

eliminar Goal de A

generar IA para A

modificar permisos de A

ver notes

ver datos no autorizados
```

---

# 144. Acceptance Test — IA

La salida:

```text
NO
```

deberá:

```text
inventar métricas

diagnosticar

inferir trastornos

recomendar medicamentos

contradecir datos
```

---

# 145. Acceptance Test — Multiplataforma

```text
Web
+
Android
```

deberán completar el flujo principal contra:

```text
same public API
```

---

# 146. Acceptance Test — DevOps

Validar:

```text
HTTPS

health

restart

logs

backup

restore

public access

$0 infrastructure
```

---

# 147. Matriz de completitud por MVP

| Incremento | Función | Estado objetivo final |
|---|---|---:|
| MVP-0 | Auth, Users, Goals, CheckIns | 100 % |
| MVP-1 | Analytics + Dashboard | 100 % |
| MVP-2 | IA generativa | 100 % |
| MVP-3 | Red de apoyo | 100 % |
| MVP-4 | Hardening + Deployment | 100 % |

---

# 148. Mapeo contra resultados esperados del anteproyecto

| Resultado comprometido | Incremento |
|---|---|
| Autenticación | MVP-0 |
| Perfil | MVP-0 |
| Objetivos | MVP-0 |
| Check-ins | MVP-0 |
| Historial | MVP-0 |
| Dashboard | MVP-1 |
| Indicadores | MVP-1 |
| Tendencias | MVP-1 |
| IA generativa | MVP-2 |
| Resúmenes | MVP-2 |
| Recomendaciones generales | MVP-2 |
| Red de apoyo | MVP-3 |
| Permisos | MVP-3 |
| Expiración | MVP-3 |
| Revocación | MVP-3 |
| Pruebas | MVP-4 |
| UX | MVP-4 |
| Seguridad | MVP-4 |
| Deployment | MVP-4 |
| Documentación final | Cierre académico |

---

# 149. Mapeo contra cronograma académico

| Periodo | Anteproyecto | Roadmap operativo |
|---|---|---|
| 25 sep – 4 oct | Anteproyecto, investigación, arquitectura | Baseline conceptual |
| 5 – 18 oct | Backend base | MVP-0 + MVP-1 adelantado + inicio MVP-2 |
| 19 oct – 1 nov | Flutter | Consolidación completa Flutter |
| 2 – 8 nov | Analytics + Dashboard | Hardening analytics + preparación IA |
| 9 – 15 nov | IA generativa | MVP-2 |
| 16 – 22 nov | Red de apoyo | MVP-3 |
| 23 – 29 nov | Pruebas, UX, seguridad, deployment | MVP-4 |
| 30 nov – 6 dic | Documento y entrega | Release v1.0.0 + cierre académico |

---

# 150. Razón de la aceleración

Adelantar MVP-1 antes del 16 de octubre proporciona:

```text
buffer
+
capacidad de validación
+
menor riesgo final
```

y permite que noviembre sea utilizado principalmente para:

```text
IA
+
red de apoyo
+
hardening
```

---

# 151. Buffer de proyecto

La principal reserva temporal será:

```text
19 oct – 8 nov
```

porque parte del trabajo originalmente previsto para esa ventana deberá estar disponible desde Avance 1.

---

# 152. Uso correcto del buffer

El buffer se utilizará para:

```text
bugs

tests

UX

Android

responsive

refactoring controlado

documentation

IA preparation
```

No para:

```text
scope expansion
```

---

# 153. Scope Lock v1.0.0

NeuroConnect v1.0.0:

```text
NO
```

incorporará:

```text
diagnóstico

tratamiento

expediente clínico

emotion recognition

camera analysis

voice analysis

wearables

chat

social network

notifications

video calls

RAG

agents

fine-tuning

microservices

Kubernetes

offline-first

custom ML training
```

---

# 154. Backlog post-v1

Cualquier idea fuera del Scope Lock se registrará como:

```text
Future Work
```

sin implementarse durante el semestre.

---

# 155. Política de deuda técnica

Deuda aceptable:

```text
optimización prematura pendiente

cosmética menor

features futuras
```

Deuda no aceptable para v1:

```text
auth insegura

ownership roto

datos cruzados

tests críticos fallando

DB inconsistente

IA inventando sistemáticamente

deployment no reproducible
```

---

# 156. Priorización

Orden:

```text
P0
Seguridad / integridad / flujo principal

P1
Funcionalidad requerida por anteproyecto

P2
UX y robustez

P3
Mejoras opcionales
```

---

# 157. Regla de tiempo

Ante conflicto entre:

```text
feature opcional
```

y:

```text
test / seguridad / entrega
```

gana:

```text
test / seguridad / entrega
```

---

# 158. Gestión de cambios

Si durante implementación surge una decisión no cubierta:

```text
¿cambia arquitectura?
       ↓
      sí
       ↓
nuevo ADR / revisión ADR
```

Si no:

```text
documentar en plan técnico
```

---

# 159. Codex y decisiones

Codex podrá:

```text
implementar
refactorizar
probar
documentar
```

pero no podrá cambiar por iniciativa propia:

```text
alcance

dominio

stack

modelo de datos

arquitectura

permisos

IA boundary

DevOps cost constraint
```

---

# 160. Estrategia de commits

Preferencia:

```text
feat:

fix:

test:

refactor:

docs:

build:

ci:

chore:
```

---

# 161. Versionamiento sugerido

```text
v0.1.x
Foundation

v0.2.x – v0.4.x
MVP-0 / MVP-1

v0.5.x – v0.7.x
MVP-2

v0.8.x – v0.9.x
MVP-3 / hardening

v1.0.0-rc.x
Release Candidate

v1.0.0
Final
```

La numeración exacta podrá variar sin alterar los milestones.

---

# 162. Git baseline

```text
main
```

deberá permanecer:

```text
deployable
```

---

# 163. CI gate

No etiquetar release si:

```text
backend CI = red

frontend CI = red
```

---

# 164. Quality gate MVP

Un MVP:

```text
NO
```

se considera terminado únicamente porque compile.

Debe:

```text
funcionar
+
tener pruebas
+
integrarse
+
estar documentado
```

---

# 165. Evidencia continua

Durante desarrollo deberá conservarse evidencia en:

```text
docs/evidence/
```

cuando sea útil.

---

# 166. No esperar al final para evidencia

Después de cada milestone:

```text
capturar
+
documentar
```

las pruebas relevantes.

---

# 167. Estado objetivo 16 octubre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
███░░░░░░░ 20–30 %

MVP-3
░░░░░░░░░░ 0 %

MVP-4
░░░░░░░░░░ 0 %
```

---

# 168. Estado objetivo 1 noviembre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
████░░░░░░ 30–40 %

Frontend Foundation
██████████ 100 %
```

---

# 169. Estado objetivo 8 noviembre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
█████░░░░░ 40–50 %

MVP-3
░░░░░░░░░░ 0 %
```

---

# 170. Estado objetivo 15 noviembre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
██████████ 100 %

MVP-3
░░░░░░░░░░ 0 %

MVP-4
██░░░░░░░░ 10–20 %
```

---

# 171. Estado objetivo 22 noviembre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
██████████ 100 %

MVP-3
██████████ 100 %

MVP-4
████░░░░░░ 30–40 %
```

---

# 172. Estado objetivo 29 noviembre

```text
MVP-0
██████████ 100 %

MVP-1
██████████ 100 %

MVP-2
██████████ 100 %

MVP-3
██████████ 100 %

MVP-4
█████████░ 90–100 %
```

---

# 173. Estado objetivo primera semana diciembre

```text
NeuroConnect v1.0.0

██████████ 100 %
```

---

# 174. Componentes obligatorios de v1.0.0

```text
Flutter Client

NestJS REST API

PostgreSQL

Prisma

Auth

Users

Goals

CheckIns

Analytics

Dashboard

AI

AISummary

SupportNetwork

Delegated Access

Docker

CI

Public Deployment

Monitoring

Backup / Restore

Documentation
```

---

# 175. Matriz de dependencias

```text
Database
   ↓
Auth
   ↓
Goals
   ↓
CheckIns
   ↓
Analytics
   ↓
AI

Users
   ↓
SupportRelationship
   ↓
Delegated Access

Backend APIs
   ↓
Flutter
```

---

# 176. Camino crítico

El camino crítico del proyecto es:

```text
DB
 ↓
Auth
 ↓
Goal
 ↓
CheckIn
 ↓
Analytics
 ↓
AI
 ↓
SupportNetwork
 ↓
E2E
 ↓
Deployment
```

---

# 177. Elementos paralelizables

Pueden avanzar paralelamente:

```text
Flutter UX

tests

documentation

Docker

CI

evidence capture
```

si no bloquean el camino crítico.

---

# 178. Riesgos temporales prioritarios

Los principales riesgos para diciembre son:

```text
MVP-2 model selection

SupportNetwork authorization

Flutter Web/Android integration

public deployment

final E2E
```

---

# 179. Mitigación IA

La evaluación tiene:

```text
timebox
```

y no debe consumir toda la iteración.

---

# 180. Mitigación SupportNetwork

No incorporar:

```text
chat

notifications

invitations complejas

directory
```

---

# 181. Mitigación frontend

Mantener:

```text
single Flutter codebase
```

---

# 182. Mitigación deployment

Mantener:

```text
Docker portability
+
2 approved zero-cost topologies
```

---

# 183. Mitigación documentación

Actualizar documentación:

```text
durante desarrollo
```

y no solo el último día.

---

# 184. Quality Gate antes del freeze

```text
[ ] P0 bugs = 0

[ ] authentication secure

[ ] ownership proven

[ ] support authorization proven

[ ] AI benchmark complete

[ ] Web operational

[ ] Android operational

[ ] deployment public

[ ] CI green
```

---

# 185. Quality Gate antes de v1.0.0

```text
[ ] all MVP DoD satisfied

[ ] final E2E passes

[ ] security tests pass

[ ] backup exists

[ ] restore tested

[ ] health public

[ ] monitoring active

[ ] no secrets leaked

[ ] cost = $0

[ ] evidence captured

[ ] docs updated
```

---

# 186. Entregables técnicos finales

```text
Source code

Flutter Web build

Android APK

NestJS backend

Prisma migrations

PostgreSQL schema

Dockerfile

Compose

GitHub Actions

AI evaluation

Tests

Runbooks

Public URLs

v1.0.0 Git tag
```

---

# 187. Entregables académicos finales

```text
Documento final

Evidencias

Resultados

Conclusiones

Limitaciones

Trabajo futuro

Presentación
```

---

# 188. Separación técnico/académica

El software constituye:

```text
evidencia
```

para el documento académico.

El documento académico:

```text
NO
```

sustituye validación técnica.

---

# 189. Regla de resultados

Solo documentar como resultado:

```text
lo que fue realmente ejecutado
+
validado
+
observado
```

---

# 190. Métricas de cierre recomendadas

Registrar:

```text
tests total

tests passed

API endpoints

E2E scenarios passed

AI benchmark cases

AI critical failures

Web deployment status

Android build status

infrastructure cost
```

---

# 191. Resultado mínimo aceptable

Si todo el alcance obligatorio está implementado y:

```text
E2E principal
```

funciona, NeuroConnect cumple su objetivo académico incluso si algunas mejoras visuales o técnicas quedan como trabajo futuro.

---

# 192. Resultado no aceptable

No podrá considerarse v1.0.0 si falta cualquiera de:

```text
Goals

CheckIns

Analytics

AI real

SupportNetwork

permission enforcement

public Web

Android functional build

tests del flujo crítico
```

---

# 193. Freeze de alcance

A partir de este roadmap:

```text
scope v1.0.0
```

se considera cerrado.

---

# 194. Cambios futuros

Toda nueva idea deberá clasificarse como:

```text
required bug fix

required compliance fix

future v1.1+

out of scope
```

---

# 195. Vista resumida del semestre

```text
SEP
│
├── Investigación
├── Anteproyecto
└── Baseline

OCT
│
├── ADRs
├── Repository
├── MVP-0
├── MVP-1
├── Avance 1
└── Flutter consolidation

NOV
│
├── Analytics hardening
├── MVP-2 IA
├── MVP-3 Support Network
├── MVP-4
├── Testing
└── Deployment

DEC
│
├── v1.0.0
├── Evidencias
├── Documento final
└── Presentación
```

---

# 196. Vista por incrementos

```text
                 OCT                    NOV                     DEC
                  │                      │                       │
MVP-0 ────────────██████████ DONE
                  │
MVP-1 ────────────██████████ DONE
                  │
MVP-2 ────────────███────────██████████ DONE
                  │
MVP-3 ─────────────────────────────██████████ DONE
                  │
MVP-4 ───────────────────────────────────██████████ DONE
                  │
v1.0.0 ───────────────────────────────────────────────●
```

---

# 197. Release train

```text
Foundation
   ↓
Core
   ↓
Analytics
   ↓
Avance 1
   ↓
AI
   ↓
Support
   ↓
Hardening
   ↓
RC
   ↓
v1.0.0
```

---

# 198. Responsabilidad

Todo el roadmap será ejecutado bajo responsabilidad de:

```text
Carlos Benjamín Armenta Márquez
```

de acuerdo con la naturaleza individual del proyecto.

---

# 199. Reglas para Codex

Antes de iniciar una fase Codex deberá:

```text
1. leer ADR aplicables

2. leer este roadmap

3. leer plan específico si existe

4. inspeccionar estado real del repo

5. comparar implementación contra DoD

6. implementar únicamente scope autorizado

7. ejecutar tests

8. documentar desviaciones

9. no declarar DONE si existe gate fallido
```

---

# 200. Prohibición de interpretación automática del porcentaje

Los porcentajes del roadmap representan:

```text
estado objetivo
```

No podrán declararse cumplidos sin comparar con:

```text
código real
+
tests
+
evidencias
```

---

# 201. Actualización del roadmap

Este documento podrá actualizar:

```text
estado

fecha real

desviaciones

riesgos

milestones
```

sin cambiar decisiones de arquitectura.

---

# 202. Registro de desviaciones

Cuando exista retraso:

```text
Planned
Actual
Cause
Impact
Recovery Action
```

deberán documentarse.

---

# 203. No mover automáticamente la fecha final

Una desviación:

```text
NO
```

implica mover la fecha de entrega académica.

Se deberá ajustar:

```text
implementación
+
prioridades
+
scope no obligatorio
```

---

# 204. Contingencia final

Si entre 23 y 29 de noviembre aparece riesgo de no terminar:

Prioridad absoluta:

```text
1. flujo E2E

2. permisos y privacidad

3. IA real

4. Web + Android

5. deployment

6. pruebas

7. documentación

8. polish visual
```

---

# 205. Funciones sacrificables primero

Si existe presión extrema:

```text
animaciones

branding avanzado

personalización

gráficas secundarias

UX ornamental
```

podrán reducirse.

---

# 206. Funciones no sacrificables

No podrán eliminarse:

```text
Auth

Goals

CheckIns

Analytics

Dashboard

AI

SupportNetwork

Permissions

Revocation

Privacy

Web

Android

Testing básico
```

porque forman parte del resultado comprometido.

---

# 207. Criterio definitivo de éxito

NeuroConnect v1.0.0 será exitoso cuando pueda demostrarse que:

> una persona puede registrar y seguir objetivos mediante check-ins, obtener indicadores y tendencias determinísticas, recibir un resumen generado por IA a partir de esos resultados y compartir selectivamente dicha información con un integrante autorizado de su red de apoyo, conservando control sobre permisos y revocación.

---

# 208. Estado final esperado

```text
NeuroConnect v1.0.0

Functional       DONE
Backend          DONE
Frontend         DONE
Database         DONE
Analytics        DONE
AI               DONE
Support Network  DONE
Security         DONE
Testing          DONE
Deployment       DONE
Documentation    DONE

Public Web       AVAILABLE
Android          FUNCTIONAL
iOS codebase     COMPATIBLE

Infrastructure
Cost             $0
```

---

# 209. Filosofía del roadmap

> **El roadmap de NeuroConnect prioriza terminar un sistema completo antes que construir un sistema innecesariamente grande. Cada incremento agrega una capacidad demostrable sobre una baseline funcional: primero registrar, después analizar, después explicar mediante IA, después compartir con control y finalmente endurecer, desplegar y documentar. La meta del semestre no es dejar componentes experimentales dispersos, sino entregar una v1.0.0 coherente, pública, reproducible y defendible académicamente.**

---

# 210. Estado del documento

```text
ROADMAP V1.0.0
APROBADO PARA EJECUCIÓN
```
