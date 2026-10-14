
# NeuroConnect — Codex Autonomous Implementation Harness

**Estado:** Activo  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Modo:** Implementación autónoma supervisada  
**Responsable humano:** Carlos Benjamín Armenta Márquez  
**Agente de implementación:** Codex  

---

# 1. Propósito

Este documento establece el contrato operativo permanente bajo el cual Codex deberá trabajar de forma autónoma dentro del repositorio de NeuroConnect.

Su objetivo es permitir que los prompts de ejecución sean pequeños y específicos.

Los prompts posteriores deberán funcionar como:

```text
activadores de bloques de trabajo
```

y no como nuevas especificaciones arquitectónicas.

El modelo de trabajo será:

```text
Documentación oficial
        ↓
HARNESS.md
        ↓
Prompt activador
        ↓
Codex implementa autónomamente
        ↓
Tests
        ↓
Commits
        ↓
Handoff
        ↓
Validación humana local
        ↓
Pull Request humano
        ↓
main
```

---

# 2. Principio fundamental

Codex deberá actuar como:

```text
implementador autónomo
+
ingeniero de software
+
tester
+
documentador técnico
```

pero no como:

```text
propietario del producto
+
arquitecto con libertad para redefinir decisiones
+
autoridad para modificar alcance
```

La autonomía existe dentro de la arquitectura y alcance ya aprobados.

---

# 3. Fuente de autoridad

Antes de implementar cualquier bloque Codex deberá considerar la siguiente jerarquía:

```text
1. Anteproyecto oficial
        ↓
2. ADR aceptados
        ↓
3. ROADMAP_V1.md
        ↓
4. PLAN_IMPLEMENTACION_AVANCE_1.md
        ↓
5. HARNESS.md
        ↓
6. Prompt activador del bloque
        ↓
7. Código existente
        ↓
8. Documentación generada por Codex
```

---

# 4. Significado de la jerarquía

Un documento inferior:

```text
NO
```

puede modificar una decisión establecida por un documento superior.

Ejemplo:

```text
Prompt
```

no puede sustituir:

```text
ADR
```

salvo que el responsable humano lo indique explícitamente.

---

# 5. Documentación oficial

Codex deberá leer, según el alcance del bloque:

```text
README.md

docs/ADRS/
├── ADR-001 — Esquema relacional y modelo de datos de NeuroConnect.md
├── ADR-002-DOMINIO-Y-DISENO-V1.md
├── ADR-003-BACKEND-V1.md
├── ADR-004-FRONTEND-V1.md
├── ADR-005-INTEGRACION-IA-V1.md
├── ADR-006-ARQUITECTURA-SISTEMA-V1.md
├── ADR-007-DEVOPS-INFRAESTRUCTURA-V1.md
└── Anteproyecto_NeuroConnect_IA_G_Carlos_Armenta.pdf

docs/Planeacion/
├── PLAN_IMPLEMENTACION_AVANCE_1.md
└── ROADMAP_V1.md
```

---

# 6. Regla de lectura

Codex no deberá asumir que la información contenida en el prompt activador representa toda la especificación.

El prompt:

```text
activa
```

el trabajo.

La documentación:

```text
define
```

el trabajo.

---

# 7. Inspección previa obligatoria

Antes de modificar archivos Codex deberá:

```text
1. inspeccionar el directorio actual

2. identificar si Git ya está inicializado

3. identificar branch actual

4. revisar git status

5. localizar documentación oficial

6. leer documentación aplicable

7. inspeccionar código existente

8. identificar tests existentes

9. identificar configuración existente

10. comparar estado real contra el bloque solicitado
```

No deberá comenzar generando código sin inspeccionar primero.

---

# 8. No confiar en estado supuesto

Codex no deberá asumir que:

```text
un MVP anterior está completo
```

únicamente porque el prompt siguiente fue enviado.

Deberá verificar que el estado existente sea consistente con la baseline esperada.

---

# 9. Confianza en integración humana

Sin embargo, cuando un nuevo bloque sea activado después de que el responsable humano confirme que el PR anterior fue integrado:

```text
main
```

se considerará la baseline aceptada.

Codex deberá trabajar sobre ella y no reauditar exhaustivamente todo el proyecto salvo que encuentre inconsistencias reales.

---

# 10. Inicialización del repositorio

Actualmente el proyecto puede existir únicamente como directorio documental.

Si:

```text
.git
```

no existe al iniciar el primer bloque, Codex está autorizado a inicializar el repositorio.

---

# 11. Git initialization

El procedimiento será:

```bash
git init -b main
```

o equivalente compatible con la versión instalada de Git.

---

# 12. Baseline inicial

Antes de desarrollar MVP-0 deberá existir una baseline en:

```text
main
```

que contenga exclusivamente el estado documental inicial y archivos de configuración ya presentes.

El commit sugerido es:

```text
chore: establish project documentation baseline
```

---

# 13. Excepción de escritura sobre main

El commit de baseline inicial constituye la única excepción donde Codex puede crear directamente un commit en:

```text
main
```

sin que exista previamente otra rama.

Después:

```text
main
```

se considera protegida lógicamente.

---

# 14. Regla general de main

Después de la baseline inicial Codex:

```text
NO
```

deberá desarrollar directamente sobre:

```text
main
```

---

# 15. Main como baseline aceptada

`main` representa:

```text
trabajo integrado
+
validado por el responsable humano
```

y deberá mantenerse:

```text
estable
+
reproducible
+
potencialmente desplegable
```

---

# 16. Pull Requests

Codex:

```text
NO
```

creará, aprobará ni fusionará Pull Requests salvo autorización explícita futura.

El responsable humano realizará los PR.

---

# 17. Merge

Codex:

```text
NO
```

fusionará branches de implementación hacia:

```text
main
```

---

# 18. Validación humana

Entre bloques existirá obligatoriamente:

```text
Codex implementation
        ↓
Codex automated validation
        ↓
Human local validation
        ↓
Human Pull Request
        ↓
Merge to main
        ↓
Next block
```

---

# 19. Modelo de branches para Avance 1

El Avance 1 se dividirá en tres bloques.

## Bloque 1

```text
branch:
mvp0
```

Objetivo:

```text
MVP-0 completo
```

---

## Bloque 2

```text
branch:
mvp1
```

Objetivo:

```text
MVP-1 completo
```

---

## Bloque 3

```text
branch:
mvp2-avance1
```

Objetivo:

```text
estabilización de MVP-0/MVP-1
+
inicio controlado de MVP-2
```

No significa:

```text
MVP-2 completo
```

---

# 20. Branches posteriores

Después de Avance 1 podrán utilizarse ramas equivalentes a:

```text
mvp2-completion

mvp3

mvp4

release-v1
```

según el roadmap.

---

# 21. Regla para crear una branch

Cada branch nueva deberá partir de:

```text
main actualizado
```

después de integrar el bloque anterior.

Procedimiento conceptual:

```bash
git checkout main
git pull
git checkout -b <branch>
```

Si no existe remote:

```text
git pull
```

se omitirá.

---

# 22. No encadenar branches sin integración

Prohibido:

```text
mvp0
 ↓
mvp1
 ↓
mvp2
```

sin pasar por:

```text
main
```

entre incrementos.

La secuencia correcta será:

```text
main
 ↓
mvp0
 ↓
PR humano
 ↓
main
 ↓
mvp1
 ↓
PR humano
 ↓
main
 ↓
mvp2-avance1
```

---

# 23. Razón

Esto garantiza que cada bloque se construya únicamente sobre:

```text
trabajo aceptado
```

y no sobre trabajo todavía pendiente de validación.

---

# 24. Branch existente

Si la branch objetivo ya existe Codex deberá:

```text
inspeccionarla
```

antes de crear o eliminar nada.

Nunca deberá sobrescribirla automáticamente.

---

# 25. Operaciones Git destructivas

Codex no realizará sin autorización explícita:

```text
git reset --hard

git clean -fd

git rebase main

git push --force

git push --force-with-lease

git branch -D

history rewriting
```

---

# 26. Push remoto

Por defecto Codex podrá preparar:

```text
commits locales
```

pero no necesita publicar la branch.

Si existe remote configurado y el prompt activador autoriza push:

```text
push branch
```

será válido.

Nunca deberá hacer:

```text
push directo a main
```

---

# 27. Scope del prompt activador

Cada prompt deberá definir un:

```text
BLOCK
```

Ejemplo:

```text
BLOCK = MVP-0
```

Codex deberá implementar:

```text
todo lo necesario para satisfacer el Definition of Done del bloque
```

pero nada perteneciente deliberadamente a bloques posteriores.

---

# 28. Regla anti-scope-creep

Si durante MVP-0 Codex detecta que podría implementar:

```text
Analytics
AI
SupportNetwork
```

no deberá hacerlo.

Debe limitarse a:

```text
MVP-0
```

salvo infraestructura mínima necesaria para permitir su funcionamiento.

---

# 29. Foundation pertenece al primer bloque

Como el repositorio todavía no está inicializado, el bloque MVP-0 está autorizado para implementar previamente:

```text
Repository Foundation
```

definida por ROADMAP_V1.

Esto incluye:

```text
Git

monorepo structure

backend foundation

Flutter foundation

PostgreSQL

Prisma

Docker

Compose

configuration

basic CI

health

README adjustments required by actual implementation
```

---

# 30. Foundation no constituye scope adicional

Repository Foundation es una:

```text
precondición técnica
```

de MVP-0.

No constituye un MVP separado.

---

# 31. Autonomía de implementación

Dentro del bloque autorizado Codex podrá decidir autónomamente:

```text
nombres de variables internas

nombres de funciones internas

separación razonable de archivos

refactors locales

test fixtures

helper functions

orden interno de implementación

mensajes técnicos

implementación concreta compatible con ADR

dependencias menores estrictamente necesarias
```

---

# 32. Decisiones que Codex no puede tomar

Codex no podrá modificar autónomamente:

```text
alcance del producto

arquitectura

framework frontend

framework backend

database

ORM

modelo de datos

reglas de dominio

reglas analíticas

authentication model

permissions model

privacy rules

AI boundary

deployment constraints

zero-cost requirement

MVP definitions
```

---

# 33. Decisión arquitectónica nueva

Si Codex detecta que necesita una decisión que:

```text
cambia un ADR
```

deberá detener esa parte de la implementación.

Deberá documentar:

```text
problema

por qué bloquea

alternativas

recomendación
```

y esperar decisión humana.

---

# 34. Decisiones menores

No deberá detenerse por decisiones triviales como:

```text
nombre de helper

organización interna menor

método equivalente de framework

mensaje de error no especificado

fixture de test
```

si puede resolverlas consistentemente.

---

# 35. Principio de mínima innovación

Cuando existan varias soluciones técnicamente correctas Codex deberá preferir:

```text
la más simple
```

que:

```text
cumpla documentación
+
sea testeable
+
sea mantenible
```

---

# 36. Prohibición de sobrearquitectura

No introducir por iniciativa propia:

```text
microservices

CQRS

event sourcing

GraphQL

Redis

Kafka

RabbitMQ

service mesh

Kubernetes

repository layers ceremoniales

generic frameworks internos

plugin systems

RAG

vector databases

agents
```

---

# 37. Dependencias nuevas

Antes de agregar una dependencia Codex deberá preguntarse:

```text
¿ya existe una solución en el stack?

¿la dependencia es realmente necesaria?

¿es compatible con Web/Android/iOS cuando corresponda?

¿aumenta innecesariamente complejidad?

¿introduce costo?
```

---

# 38. Dependencias menores

Codex puede agregar dependencias de implementación si:

```text
son necesarias
+
son compatibles con ADR
+
no cambian arquitectura
+
no introducen servicios pagos
```

Deberá documentarlas en el reporte del bloque.

---

# 39. Dependencias significativas

Una dependencia que cambie:

```text
arquitectura

seguridad

persistencia

state management

HTTP stack

deployment

AI integration
```

requiere decisión humana.

---

# 40. Versiones

Codex deberá preferir:

```text
versiones estables
```

compatibles con el stack actual.

No deberá actualizar automáticamente todo el proyecto a la versión más reciente si no es necesario.

---

# 41. Lockfiles

Deberán versionarse cuando corresponda:

```text
package-lock.json

pubspec.lock
```

---

# 42. Código

El código deberá priorizar:

```text
claridad

tipado

testabilidad

responsabilidad única razonable

consistencia

manejo explícito de errores
```

---

# 43. No código provisional oculto

Codex no deberá dejar implementaciones simuladas presentadas como reales.

Ejemplos:

```text
TODO que retorna success

fake analytics

fake database

fake login

hardcoded user

hardcoded summary presentado como IA real
```

---

# 44. Mocks permitidos

Los mocks son aceptables únicamente cuando:

```text
la documentación los autoriza
```

o para:

```text
tests
```

Ejemplo:

```text
MockAiProvider
```

durante Avance 1.

Debe quedar claramente identificado como:

```text
development/test mock
```

---

# 45. Secrets

Codex nunca deberá:

```text
generar secretos reales en Git

commit .env

inventar production credentials

imprimir tokens

poner API keys en Flutter

poner JWT_SECRET en código
```

---

# 46. `.env.example`

Debe contener:

```text
keys
```

pero no:

```text
secret values
```

---

# 47. Servicios externos

Codex no deberá crear recursos externos que:

```text
requieran pago
```

sin autorización.

---

# 48. Cloud deployment durante Avance 1

El deployment final:

```text
NO
```

es requisito obligatorio de los tres bloques del Avance 1.

Avance 1 podrá validarse localmente.

---

# 49. Docker

La reproducibilidad local sí forma parte del trabajo temprano.

Cuando el bloque lo requiera deberá verificarse:

```text
docker compose
```

desde un entorno limpio razonable.

---

# 50. Tests como parte de implementación

Los tests:

```text
NO
```

son una actividad opcional posterior.

Forman parte del bloque.

---

# 51. Test-first pragmático

Codex puede utilizar:

```text
test-first
```

o:

```text
implementation-first
```

según la naturaleza del cambio.

El resultado obligatorio es:

```text
feature
+
tests
```

---

# 52. Calidad mínima

No se considera terminado un bloque si:

```text
compile = true
```

pero:

```text
tests = failing
```

---

# 53. Backend validation gate

Cuando corresponda deberán ejecutarse como mínimo:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

Si los scripts reales utilizan otros nombres equivalentes, utilizar los definidos por el repositorio.

---

# 54. Flutter validation gate

Cuando corresponda deberán ejecutarse:

```bash
flutter analyze
flutter test
flutter build web
```

---

# 55. Android

Cuando el bloque o roadmap lo requiera:

```bash
flutter build apk
```

deberá ejecutarse.

No es obligatorio en cada pequeño commit.

---

# 56. Prisma

Cuando cambie el esquema:

```text
schema.prisma
```

Codex deberá:

```text
crear migration

generar Prisma Client

validar migration

actualizar seed si corresponde

ejecutar tests
```

---

# 57. Producción

No utilizar:

```bash
prisma migrate dev
```

como estrategia de deployment productivo.

---

# 58. Database tests

Tests E2E backend deberán utilizar:

```text
PostgreSQL
```

y no una DB distinta para simplificar artificialmente la suite.

---

# 59. Smoke test de Codex

Antes del handoff Codex deberá realizar, hasta donde el entorno permita:

```text
startup
+
critical request path
+
shutdown/cleanup
```

además de los tests automatizados.

---

# 60. Smoke test humano

El smoke test de aceptación definitivo entre bloques será ejecutado por:

```text
responsable humano
```

después del handoff.

---

# 61. Codex no autoaprueba

Codex puede declarar:

```text
IMPLEMENTATION COMPLETE
```

pero no:

```text
HUMAN ACCEPTED
```

---

# 62. Estados de bloque

Cada bloque puede terminar en uno de cuatro estados:

```text
READY_FOR_HUMAN_VALIDATION

PARTIALLY_COMPLETE

BLOCKED

FAILED_VALIDATION
```

---

# 63. READY_FOR_HUMAN_VALIDATION

Solo se utilizará si:

```text
scope implementado

tests requeridos pasan

build requerido pasa

working tree controlado

commits creados

report actualizado

sin blocker conocido
```

---

# 64. PARTIALLY_COMPLETE

Se utilizará si:

```text
parte del scope funciona
```

pero falta algún requisito no crítico o existe limitación del entorno.

Nunca presentar como:

```text
DONE
```

---

# 65. BLOCKED

Utilizar cuando sea imposible continuar sin:

```text
decisión humana

credential

external resource

arquitectural clarification

missing dependency outside Codex control
```

---

# 66. FAILED_VALIDATION

Utilizar cuando:

```text
implementation exists
```

pero:

```text
required tests/build fail
```

al terminar el trabajo.

---

# 67. No ocultar fallos

Codex deberá reportar:

```text
comando

resultado

error

impacto
```

de cualquier gate fallido.

---

# 68. Reintentos

Ante un fallo técnico Codex deberá intentar:

```text
diagnosticar
+
corregir
+
volver a probar
```

antes de declarar bloqueo.

---

# 69. No pedir ayuda prematuramente

Codex no deberá interrumpir trabajo autónomo por:

```text
errores de compilación corregibles

tests fallando

configuración local reparable

imports

tipos

lint

errores de migration propios de implementación
```

Debe resolverlos.

---

# 70. Condiciones reales para detenerse

Debe detenerse ante:

```text
contradicción documental irresoluble

decisión arquitectónica nueva

operación destructiva de datos reales

credential ausente indispensable

servicio pago requerido

acción irreversible externa

requisito imposible de satisfacer
```

---

# 71. Contradicciones documentales

Si encuentra contradicción entre dos documentos deberá:

```text
1. aplicar jerarquía documental

2. comprobar si un ADR posterior reemplaza explícitamente otro

3. evitar asumir silenciosamente

4. documentar el conflicto si sigue existiendo
```

---

# 72. No modificar documentación oficial para hacer coincidir código

Si el código contradice ADR:

```text
corregir código
```

No:

```text
cambiar ADR
```

salvo instrucción humana explícita.

---

# 73. Documentación generada por Codex

Codex tendrá un workspace propio:

```text
harness/codex/
```

---

# 74. Naturaleza del workspace

El contenido de:

```text
harness/codex/
```

es:

```text
operativo
+
informativo
```

y no:

```text
normativo
```

---

# 75. Autoridad de documentación Codex

Los documentos dentro de:

```text
harness/codex/
```

nunca podrán reemplazar:

```text
Anteproyecto
ADR
Roadmap
Plan
Harness
```

---

# 76. Uso del workspace

Codex podrá almacenar:

```text
reportes de bloque

resultados de tests

decisiones menores

hallazgos

deuda técnica

desviaciones

handoffs

notas de validación
```

---

# 77. Archivo recomendado por bloque

Durante Avance 1:

```text
harness/codex/
├── MVP0_REPORT.md
├── MVP1_REPORT.md
└── MVP2_AVANCE1_REPORT.md
```

Los archivos se crearán cuando su bloque sea ejecutado.

---

# 78. Contenido mínimo del reporte

Cada reporte deberá contener:

```text
Block

Branch

Base commit

Final commit

Scope

Implemented

Not implemented

Files changed

Database changes

Dependencies added

Tests executed

Test results

Build results

Smoke test results

Known limitations

Deviations

Technical debt

Human validation checklist

Status
```

---

# 79. Reporte como handoff

El reporte deberá permitir al responsable humano:

```text
entender qué cambió
+
ejecutar validación local
+
hacer code review
+
abrir PR
```

sin reconstruir todo el contexto manualmente.

---

# 80. Registro de decisiones menores

Si Codex toma una decisión de implementación no establecida expresamente pero permitida por el harness deberá registrarla bajo:

```text
Implementation Decisions
```

en el reporte correspondiente.

---

# 81. No generar ADR propio

Codex:

```text
NO
```

creará nuevos ADR autónomamente.

Puede recomendar uno.

---

# 82. Commits

Codex deberá realizar commits durante el desarrollo.

No dejar todo el bloque como:

```text
un único commit gigante
```

salvo que el cambio sea realmente pequeño.

---

# 83. Commit strategy

Los commits deberán representar unidades coherentes.

Ejemplo MVP-0:

```text
chore: initialize neuroconnect monorepo

build: add postgres and docker development environment

feat: implement prisma domain schema

feat: implement authentication

feat: implement goal management

feat: implement check-in tracking

feat: add flutter authentication flow

feat: add flutter goals and check-ins

test: cover mvp0 critical flows

docs: document mvp0 implementation
```

La secuencia exacta dependerá de la implementación.

---

# 84. Conventional commits

Preferir:

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

# 85. Commits deben pasar validación razonable

Codex no deberá crear conscientemente commits intermedios que dejen:

```text
main-equivalent branch state
```

irreparable o sin compilar durante largos periodos.

Los commits deben ser revisables.

---

# 86. Commit final

El último commit del bloque deberá dejar:

```text
clean implementation
+
updated report
```

---

# 87. Working tree al entregar

Idealmente:

```bash
git status
```

deberá mostrar:

```text
working tree clean
```

---

# 88. Archivos no versionables

No incluir:

```text
.env

credentials

database dumps con datos sensibles

build output innecesario

IDE caches

OS files
```

---

# 89. Evidencia

No se requiere llenar el repositorio de screenshots durante cada implementación.

Codex deberá conservar evidencia textual reproducible principalmente mediante:

```text
tests
+
commands
+
reports
```

---

# 90. Evidence directory

`docs/evidence/` podrá utilizarse únicamente cuando:

```text
el plan
```

o el responsable humano lo solicite.

---

# 91. README

Codex podrá actualizar:

```text
README.md
```

cuando la implementación real haga necesario reemplazar:

```text
comandos objetivo
```

por:

```text
comandos reales verificados
```

---

# 92. README no es changelog

No agregar al README detalles temporales de cada sesión.

Esos pertenecen a:

```text
harness/codex/
```

---

# 93. ADRs durante implementación

Por defecto:

```text
read-only
```

---

# 94. Roadmap durante bloques

Por defecto:

```text
read-only
```

salvo que el prompt autorice actualizar estado.

---

# 95. Plan de Avance 1

Durante los tres primeros bloques:

```text
PLAN_IMPLEMENTACION_AVANCE_1.md
```

es especificación operativa obligatoria.

---

# 96. Bloque 1 — MVP-0

La primera ejecución deberá comprender:

```text
Repository Foundation
+
MVP-0
```

---

# 97. Objetivo de MVP-0

El sistema deberá soportar:

```text
register
→
login
→
profile
→
create Goal
→
Goal lifecycle
→
create CheckIn
→
history
```

---

# 98. Gate MVP-0

Codex deberá utilizar el:

```text
Definition of Done MVP-0
```

del roadmap y plan como autoridad.

No podrá reducirlo en el prompt de ejecución.

---

# 99. Handoff MVP-0

Codex termina en:

```text
branch:
mvp0
```

Estado esperado:

```text
READY_FOR_HUMAN_VALIDATION
```

---

# 100. Después de MVP-0

El responsable humano realizará:

```text
local smoke test
+
review
+
PR mvp0 → main
+
merge
```

---

# 101. Bloque 2 — MVP-1

No deberá iniciarse hasta que:

```text
MVP-0
```

haya sido integrado en:

```text
main
```

por el responsable humano.

---

# 102. Base MVP-1

La branch:

```text
mvp1
```

deberá nacer de:

```text
main
```

que ya contiene MVP-0 aceptado.

---

# 103. Scope MVP-1

Implementar:

```text
AnalyticsModule
+
Dashboard
+
Trends
+
Charts
+
tests
```

según documentación oficial.

---

# 104. Regla analítica

Analytics:

```text
NO
```

puede ser sustituido por IA.

Debe permanecer:

```text
determinístico
```

---

# 105. Handoff MVP-1

Final:

```text
branch:
mvp1
```

con:

```text
harness/codex/MVP1_REPORT.md
```

---

# 106. Después de MVP-1

Responsable humano:

```text
local smoke test

review

PR mvp1 → main

merge
```

---

# 107. Bloque 3 — Estabilidad + MVP-2 Avance 1

La tercera branch será:

```text
mvp2-avance1
```

---

# 108. Base Bloque 3

Debe partir de:

```text
main
```

después de integrar:

```text
MVP-0
+
MVP-1
```

---

# 109. Prioridad del Bloque 3

El orden será:

```text
1. estabilidad de MVP-0

2. estabilidad de MVP-1

3. corrección de defectos detectables

4. integración horizontal

5. inicio controlado de MVP-2
```

---

# 110. Scope IA de Avance 1

Debe implementarse únicamente la porción aprobada para Avance 1:

```text
AiModule

SummaryContextBuilder

PromptBuilder

AiProvider

MockAiProvider

AI Preview
```

---

# 111. No completar IA real anticipadamente

En este bloque:

```text
NO
```

es obligatorio:

```text
elegir proveedor definitivo

elegir modelo definitivo

ejecutar benchmark completo

integrar API externa real

completar MVP-2
```

---

# 112. Razón

ADR-005 mantiene:

```text
provider
+
model
```

pendientes de evaluación formal durante la etapa correspondiente de MVP-2.

---

# 113. Handoff Bloque 3

Debe generar:

```text
harness/codex/MVP2_AVANCE1_REPORT.md
```

y finalizar en:

```text
READY_FOR_HUMAN_VALIDATION
```

si todos los gates correspondientes pasan.

---

# 114. Cierre de Avance 1

Después de integrar el tercer PR:

```text
main
```

deberá contener:

```text
MVP-0 completo
+
MVP-1 completo
+
inicio documentado de MVP-2
```

---

# 115. Smoke test final de Avance 1

Este smoke test será:

```text
humano
```

sobre:

```text
main
```

después de integrar los tres PR.

---

# 116. Objetivo del smoke test final

Validar de extremo a extremo:

```text
repository bootstrap

Docker / PostgreSQL

migrations

seed

backend

Swagger

register

login

profile

Goals

CheckIns

history

Analytics

Dashboard

AI Preview
```

---

# 117. Resultado del smoke test

El responsable humano determinará:

```text
Avance 1 accepted
```

o:

```text
fix required
```

---

# 118. Correcciones posteriores a integración

Si el smoke test de Avance 1 detecta problemas después de integrar:

```text
main
```

se creará una branch específica.

Ejemplo:

```text
fix/avance1-smoke
```

No se editará directamente `main`.

---

# 119. Activadores

Un prompt de Codex deberá poder ser tan simple como:

```text
Ejecuta el Bloque 1 — MVP-0 conforme a
harness/HARNESS.md y la documentación oficial.
```

Ese mensaje constituye autorización para:

```text
leer
planificar internamente
implementar
probar
documentar
commit
```

dentro del bloque.

---

# 120. No requerir reconfirmaciones

Una vez activado un bloque Codex:

```text
NO
```

deberá pedir autorización nuevamente para:

```text
crear archivos

instalar dependencias necesarias

ejecutar tests

ejecutar builds

crear migrations

hacer commits en la branch

actualizar su reporte
```

si todo está dentro del scope aprobado.

---

# 121. Acciones que siguen requiriendo autorización

Aunque exista un bloque activo:

```text
push a main

merge

PR merge

paid infrastructure

destructive database operation

architecture change

real external credentials

production deployment no solicitado
```

no están implícitamente autorizadas.

---

# 122. Trabajo autónomo continuo

Codex deberá continuar trabajando hasta:

```text
block complete
```

o:

```text
real blocker
```

No debe detenerse después de cada subtask para pedir:

```text
¿continúo?
```

---

# 123. Corrección autónoma

Si durante validación aparecen fallos causados por su implementación:

```text
Codex debe corregirlos
```

antes del handoff.

---

# 124. No reducir scope para hacer pasar tests

Codex no deberá:

```text
eliminar tests

desactivar validaciones

hacer skip de casos críticos

debilitar seguridad

eliminar requirements
```

para obtener un resultado verde.

---

# 125. Test failures preexistentes

Si un test ya fallaba antes del bloque:

```text
documentar
```

y determinar si:

```text
bloque actual debe corregirlo
```

según impacto.

No adjudicarlo silenciosamente al nuevo trabajo.

---

# 126. Refactoring

Codex puede refactorizar código previo cuando:

```text
sea necesario para implementar el bloque
```

pero deberá evitar:

```text
refactors extensos sin relación con scope
```

---

# 127. Compatibilidad hacia atrás entre bloques

MVP-1 no deberá romper MVP-0.

MVP-2 no deberá romper MVP-0 ni MVP-1.

Cada bloque deberá volver a ejecutar pruebas relevantes anteriores.

---

# 128. Regression gate

Antes del handoff:

```text
all previous critical flows
```

deberán continuar funcionando.

---

# 129. Definition of Done no negociable

Un bloque no puede declararse terminado simplemente porque:

```text
la feature principal funciona
```

Debe cumplir su:

```text
Definition of Done
```

completo dentro de lo verificable por Codex.

---

# 130. Desarrollo basado en vertical slices

Preferir:

```text
database
→
backend
→
frontend
→
test
```

por funcionalidad.

Evitar:

```text
todo backend
→
todo frontend
→
todos tests al final
```

cuando una vertical slice permita validar antes.

---

# 131. Prioridades

Orden general:

```text
P0
integridad
seguridad
flujo principal

P1
scope obligatorio del bloque

P2
tests
robustez
UX necesaria

P3
polish
```

---

# 132. Funcionalidad ornamental

Nunca deberá retrasar:

```text
correctness

security

tests

delivery
```

---

# 133. Seguridad

Codex deberá asumir:

```text
Flutter = untrusted client
```

El backend debe validar:

```text
authentication

authorization

ownership

DTOs

permissions
```

---

# 134. Frontend security

Ocultar un botón:

```text
NO
```

constituye autorización.

---

# 135. Privacidad

Nunca debilitar:

```text
owner isolation

notes owner-only

support permissions

AI data minimization
```

---

# 136. IA

Hasta que ADR-005 seleccione modelo:

```text
no vendor lock-in
```

---

# 137. AI Preview

Durante Avance 1 deberá ser claramente:

```text
development functionality
```

y no simular que existe un modelo productivo.

---

# 138. Documentación de comandos

Todo comando importante que el responsable humano necesite para validar deberá quedar en:

```text
README
```

o:

```text
report del bloque
```

---

# 139. Handoff obligatorio

Al terminar un bloque Codex deberá responder con un resumen compacto que contenga:

```text
Branch
Final commit
Implementation status
What was implemented
Validation commands
Tests result
Known issues
Report path
Human validation steps
```

---

# 140. No narrativa innecesaria

El handoff debe permitir pasar directamente a:

```text
human smoke test
```

---

# 141. Human validation checklist

Cada reporte deberá terminar con una sección:

```text
Human Validation Checklist
```

específica para el bloque.

---

# 142. MVP-0 human validation

Como mínimo:

```text
[ ] clean clone / environment works

[ ] PostgreSQL starts

[ ] migrations apply

[ ] seed works

[ ] backend starts

[ ] Flutter starts

[ ] registration works

[ ] login works

[ ] session works

[ ] Goal CRUD works

[ ] Goal lifecycle works

[ ] CheckIn works

[ ] progress updates

[ ] history works

[ ] user isolation works
```

---

# 143. MVP-1 human validation

Como mínimo:

```text
[ ] overview loads

[ ] goal analytics loads

[ ] progressing case

[ ] stable case

[ ] declining case

[ ] inactive case

[ ] insufficient-history case

[ ] dashboard matches API

[ ] chart renders

[ ] existing MVP-0 flow still works
```

---

# 144. MVP-2 Avance 1 human validation

Como mínimo:

```text
[ ] MVP-0 regression smoke passes

[ ] MVP-1 regression smoke passes

[ ] AiModule loads

[ ] SummaryContext contains allowed fields

[ ] sensitive fields absent

[ ] PromptBuilder produces controlled prompt

[ ] AiProvider abstraction exists

[ ] MockAiProvider clearly identified

[ ] AI Preview works

[ ] no real provider falsely represented
```

---

# 145. Pull Request responsibility

Después de validar:

```text
responsable humano
```

realizará:

```text
PR
+
review final
+
merge
```

---

# 146. Codex personal workspace después del merge

Los reportes de Codex pueden permanecer versionados como historial técnico.

No deben convertirse en documentación académica oficial automáticamente.

---

# 147. Próximo bloque

Codex no empezará automáticamente el siguiente MVP.

Necesita:

```text
nuevo prompt activador
```

---

# 148. Significado del nuevo prompt

El nuevo prompt implica que:

```text
el responsable humano terminó la validación del bloque anterior
```

salvo que el prompt diga lo contrario.

---

# 149. Si main no contiene el bloque anterior

Si el nuevo prompt activa MVP-1 pero Codex detecta que:

```text
main no contiene MVP-0
```

deberá detenerse y reportarlo.

No deberá construir MVP-1 encima de una branch antigua.

---

# 150. Si working tree contiene cambios humanos

Codex deberá:

```text
preservarlos
```

y evaluar si interfieren con el bloque.

No debe descartarlos.

---

# 151. No asumir autoría

Archivos existentes deberán tratarse como trabajo válido del proyecto.

Codex no deberá reemplazarlos completamente solo por preferir otra implementación.

---

# 152. Cambios mínimos suficientes

Preferir:

```text
modify
```

sobre:

```text
rewrite everything
```

cuando exista código funcional.

---

# 153. Código generado previamente por Codex

Tampoco debe considerarse inmutable.

Si tests o documentación demuestran un defecto:

```text
corregirlo
```

---

# 154. Finalidad académica

La implementación debe permanecer:

```text
comprensible
+
defendible
```

por el responsable humano.

Evitar soluciones innecesariamente complejas que dificulten explicar:

```text
cómo funciona
+
por qué se diseñó así
```

---

# 155. Transparencia

Codex deberá documentar:

```text
qué implementó

qué validó

qué no pudo validar

qué queda pendiente
```

sin exagerar el estado.

---

# 156. Prohibición de claims falsos

Nunca afirmar:

```text
tested
```

si no se ejecutó el test.

Nunca afirmar:

```text
build successful
```

si no se ejecutó el build.

Nunca afirmar:

```text
MVP complete
```

si existe un DoD incumplido.

---

# 157. Desarrollo reproducible

El objetivo de cada bloque es que el responsable humano pueda:

```text
clone
→
configure
→
run
→
test
```

sin conocimiento implícito de la sesión de Codex.

---

# 158. Regla de handoff

Nada crítico para ejecutar el proyecto deberá existir únicamente en:

```text
conversation context
```

Debe quedar:

```text
en código
+
config
+
README
+
report
```

---

# 159. Estado esperado después de Avance 1

Después de los tres bloques y sus respectivos PR:

```text
main
```

deberá representar:

```text
MVP-0 = DONE

MVP-1 = DONE

MVP-2 = STARTED
```

de acuerdo con el roadmap académico.

---

# 160. Estado que no debe reclamarse

Avance 1:

```text
NO
```

implica:

```text
MVP-2 DONE
MVP-3 DONE
MVP-4 DONE
v1.0.0 DONE
```

---

# 161. Continuidad posterior

Este harness seguirá siendo válido después de Avance 1.

Nuevos prompts podrán activar:

```text
MVP-2 completion

MVP-3

MVP-4

release hardening

v1.0.0
```

sin volver a redefinir el modo de trabajo.

---

# 162. Regla maestra

Ante cualquier decisión durante implementación Codex deberá aplicar:

```text
¿Está definida por documentación oficial?
        │
        ├── sí → obedecerla
        │
        └── no
             ↓
¿Es una decisión local reversible?
        │
        ├── sí → decidir, implementar y documentar
        │
        └── no
             ↓
¿Cambia arquitectura, dominio, seguridad o alcance?
        │
        ├── sí → detener esa parte y solicitar decisión
        │
        └── no → elegir solución mínima consistente
```

---

# 163. Regla maestra de calidad

```text
NO DONE
WITHOUT
VALIDATION
```

---

# 164. Regla maestra de Git

```text
main
=
human-accepted baseline
```

Codex trabaja en:

```text
isolated implementation branches
```

---

# 165. Regla maestra de autonomía

```text
Prompt activa el bloque.

Documentación define el bloque.

Codex ejecuta el bloque.

Tests validan técnicamente el bloque.

Humano acepta el bloque.
```

---

# 166. Estado del Harness

```text
ACTIVE

Applies to:
NeuroConnect v1.0.0 development lifecycle
```
