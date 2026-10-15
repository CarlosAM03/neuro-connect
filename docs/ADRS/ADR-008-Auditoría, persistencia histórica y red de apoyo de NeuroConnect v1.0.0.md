
# ADR-008 — Auditoría, persistencia histórica y red de apoyo de NeuroConnect v1.0.0

**Estado:** Aceptado para implementación  
**Fecha:** 14 de octubre de 2026  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Decisión:** Persistencia no destructiva, auditoría de acciones, objetivos cancelados y validación anticipada del flujo de red de apoyo  
**Responsable:** Carlos Benjamín Armenta Márquez  

---

# 1. Contexto

NeuroConnect v1.0.0 ya define como parte de su arquitectura:

- usuarios propietarios de información;
- miembros de red de apoyo;
- objetivos;
- check-ins;
- historial;
- analítica;
- permisos de consulta;
- expiración;
- revocación;
- vistas delegadas read-only.

La documentación inicial permitió eliminaciones físicas durante las primeras etapas del MVP y dejó para una fase posterior decisiones como:

- soft deletion;
- auditoría;
- retención;
- persistencia histórica completa.

Después de implementar MVP-0 y MVP-1 surgió un requerimiento funcional más adecuado para el propósito de NeuroConnect:

> Las acciones relevantes del usuario no deberán destruir información histórica.

Además, antes de continuar con la integración completa de IA se desea validar el flujo principal de:

```text
propietario
    ↕
red de apoyo
```

para comprobar tempranamente:

- autorización;
- visibilidad;
- permisos;
- aislamiento;
- revocación;
- objetivos cancelados;
- comportamiento de ambos usuarios.

Por ello se introduce un incremento intermedio:

```text
MVP-1.5
```

entre:

```text
MVP-1
```

y la continuación de:

```text
MVP-2
```

---

# 2. Objetivo de la decisión

Establecer para NeuroConnect v1.0.0 que:

```text
las acciones del usuario cambian estado
pero no destruyen historia
```

y adelantar la implementación funcional de la red de apoyo necesaria para validar:

```text
Owner
   ↓
autoriza Supporter
   ↓
define visibilidad
   ↓
Supporter consulta
   ↓
Owner modifica permisos
   ↓
Owner revoca
   ↓
Supporter pierde acceso
```

antes de continuar con la integración real del proveedor de IA.

---

# 3. Relación con el anteproyecto

Esta decisión:

```text
NO
```

amplía el objetivo académico principal.

La red de apoyo, permisos, historial y control de información ya forman parte del alcance de NeuroConnect.

Este ADR únicamente:

```text
refina la persistencia
+
adelanta la validación de permisos
+
agrega trazabilidad de acciones
```

dentro de la misma v1.0.0.

---

# 4. Relación con el roadmap

La secuencia operativa pasa temporalmente de:

```text
MVP-0
 ↓
MVP-1
 ↓
MVP-2
 ↓
MVP-3
```

a:

```text
MVP-0
 ↓
MVP-1
 ↓
Avance 1
 ↓
MVP-1.5
 ↓
MVP-2
 ↓
MVP-3 remainder
 ↓
MVP-4
```

MVP-1.5 adelanta el núcleo funcional de la red de apoyo.

No necesariamente elimina todo trabajo posterior de MVP-3.

---

# 5. Alcance de MVP-1.5

MVP-1.5 deberá implementar:

```text
persistencia no destructiva

Goal CANCELLED

CheckIn voiding

AuditEvent append-only

historial de actividad visible al propietario

SupportRelationship

permisos de visibilidad

expiración

revocación

reactivación

vistas delegadas

objetivos cancelados visibles para supporter

flujo E2E Owner ↔ Supporter
```

---

# 6. Decisión principal de persistencia

A partir de este ADR:

```text
NO se realizarán eliminaciones físicas
de registros funcionales de usuario
durante el uso normal de NeuroConnect v1.0.0.
```

Los cambios que anteriormente utilizaban:

```text
DELETE
```

deberán representarse mediante:

```text
transiciones de estado
+
eventos de auditoría
```

---

# 7. Decisiones anteriores reemplazadas

Este ADR reemplaza específicamente las decisiones previas que permitían:

```text
physical Goal deletion

physical CheckIn deletion

cascade deletion como operación funcional normal
```

Estas operaciones dejan de formar parte del comportamiento de producto.

---

# 8. Alcance de “no eliminar”

La regla aplica a:

```text
Goal

CheckIn

SupportRelationship

AuditEvent
```

durante el funcionamiento normal de la aplicación.

---

# 9. Eliminación de cuenta

La eliminación completa de una cuenta continúa fuera del alcance de v1.0.0.

No deberá implementarse:

```text
DELETE /users/me
```

como parte de MVP-1.5.

Una futura política de eliminación/anominización de cuentas requerirá decisión independiente.

---

# 10. Estado CANCELLED para Goal

El enum de Goal se amplía a:

```text
ACTIVE
PAUSED
COMPLETED
CANCELLED
```

---

# 11. Significado de CANCELLED

`CANCELLED` significa:

> El propietario decidió dejar de continuar el objetivo, pero el objetivo y todo su historial continúan formando parte de su registro histórico.

Cancelar:

```text
NO
```

significa eliminar.

---

# 12. Goal cancelado conserva

Un Goal `CANCELLED` conserva:

```text
id

ownerId

title

description

category

progress

targetDate

createdAt

updatedAt

CheckIns

AuditEvents
```

---

# 13. Check-ins en Goal cancelado

Un Goal:

```text
CANCELLED
```

no acepta nuevos CheckIns.

La regla de creación queda:

```text
CheckIn permitido
únicamente si
Goal.status = ACTIVE
```

---

# 14. Reactivación

Un objetivo cancelado podrá ser reactivado por su propietario.

Transición:

```text
CANCELLED
   ↓
ACTIVE
```

deberá:

- conservar su historial;
- conservar sus check-ins anteriores;
- registrar un nuevo AuditEvent.

La reactivación no borra el evento de cancelación anterior.

---

# 15. State machine de Goal

La máquina de estados v1.0.0 será conceptualmente:

```text
ACTIVE
 ├── PAUSED
 ├── COMPLETED
 └── CANCELLED

PAUSED
 ├── ACTIVE
 └── CANCELLED

COMPLETED
 └── ACTIVE

CANCELLED
 └── ACTIVE
```

No se realizará ninguna transición mediante borrado físico.

---

# 16. Endpoint de eliminación de Goal

El comportamiento actual equivalente a:

```text
DELETE /api/v1/goals/:goalId
```

deja de representar una eliminación física.

La implementación deberá migrar hacia una operación explícita de cancelación.

Endpoint canónico recomendado:

```text
POST /api/v1/goals/:goalId/cancel
```

y para restaurar:

```text
POST /api/v1/goals/:goalId/reactivate
```

Si temporalmente se conserva el endpoint `DELETE` por compatibilidad:

```text
NO
```

podrá ejecutar un `DELETE` físico.

Deberá:

- quedar deprecated;
- ejecutar semántica de cancelación;
- documentarse claramente en Swagger.

Preferencia:

```text
eliminar DELETE del contrato antes de v1.0.0
```

y utilizar acciones explícitas.

---

# 17. No eliminación de CheckIn

Un CheckIn creado representa un hecho histórico.

Por tanto:

```text
NO
```

se eliminará físicamente.

---

# 18. Corrección de CheckIn

Cuando el propietario necesite invalidar un CheckIn:

```text
CheckIn
   ↓
VOIDED
```

o equivalente mediante:

```text
voidedAt
```

---

# 19. Modelo recomendado CheckIn

Agregar:

```text
voidedAt DateTime?
```

Un CheckIn es efectivo si:

```text
voidedAt == null
```

---

# 20. CheckIn VOIDED

Un CheckIn invalidado:

- permanece en PostgreSQL;
- permanece asociado al Goal;
- conserva sus valores originales;
- deja de participar en Analytics;
- no se utiliza para Goal.progress;
- genera AuditEvent.

---

# 21. Recalcular Goal.progress

Cuando se invalida el CheckIn más reciente:

```text
Goal.progress
```

se recalculará a partir del último CheckIn:

```text
voidedAt == null
```

Si no existe ninguno:

```text
Goal.progress = 0
```

---

# 22. Analytics y CheckIns invalidados

Analytics deberá ignorar:

```text
CheckIn.voidedAt != null
```

para:

- progreso actual;
- progreso anterior;
- frecuencia;
- dificultad promedio;
- tendencias;
- timeline analítica;
- inactividad.

---

# 23. Analytics y Goal CANCELLED

Un Goal cancelado:

```text
NO
```

se considera inactivo.

`INACTIVE` continúa aplicando únicamente a Goals operativos según las reglas analíticas vigentes.

---

# 24. Métricas con objetivos cancelados

Se añadirá:

```text
cancelledGoals
```

al overview analítico.

El sistema distinguirá entre:

```text
totalGoals
```

y:

```text
goals elegibles para completionRate
```

---

# 25. CompletionRate

Un objetivo cancelado no representa necesariamente incumplimiento.

Por tanto:

```text
eligibleGoals =
ACTIVE
+
PAUSED
+
COMPLETED
```

y:

```text
completionRate =
completedGoals / eligibleGoals × 100
```

Si:

```text
eligibleGoals = 0
```

entonces:

```text
completionRate = 0
```

---

# 26. totalGoals

`totalGoals` continúa representando:

```text
todos los Goals persistidos
```

incluyendo:

```text
CANCELLED
```

Esto permite distinguir:

```text
historial total
```

de:

```text
objetivos operativos
```

---

# 27. AuditEvent

Se introduce una nueva entidad:

```text
AuditEvent
```

que registra acciones de negocio relevantes realizadas por usuarios autenticados.

---

# 28. Naturaleza de AuditEvent

AuditEvent será:

```text
append-only
```

No deberá existir:

```text
PATCH AuditEvent

DELETE AuditEvent
```

---

# 29. Modelo conceptual

```text
User
 ├── Goal
 │    └── CheckIn
 │
 ├── SupportRelationship
 │
 ├── AISummary
 │
 └── AuditEvent
```

---

# 30. Modelo conceptual de AuditEvent

Campos mínimos:

```text
id

ownerId

actorId

action

entityType

entityId

payload

occurredAt
```

---

# 31. ownerId

`ownerId` representa:

> El usuario al que pertenece el historial funcional donde debe aparecer el evento.

Ejemplo:

```text
Carlos cancela su Goal
```

entonces:

```text
ownerId = Carlos
actorId = Carlos
```

---

# 32. actorId

`actorId` representa:

> El usuario autenticado que produjo la acción.

Durante v1.0.0, las acciones auditadas de negocio serán producidas principalmente por el propietario.

Supporter es read-only y por tanto no genera mutaciones sobre recursos del owner.

---

# 33. entityType

Valores iniciales:

```text
USER

GOAL

CHECK_IN

SUPPORT_RELATIONSHIP
```

Podrá extenderse posteriormente con:

```text
AI_SUMMARY
```

cuando MVP-2 completo lo requiera.

---

# 34. AuditAction

Acciones iniciales:

```text
ACCOUNT_REGISTERED

PROFILE_UPDATED

GOAL_CREATED

GOAL_UPDATED

GOAL_STATUS_CHANGED

GOAL_CANCELLED

GOAL_REACTIVATED

CHECKIN_CREATED

CHECKIN_VOIDED

SUPPORT_RELATIONSHIP_CREATED

SUPPORT_PERMISSIONS_UPDATED

SUPPORT_RELATIONSHIP_REVOKED

SUPPORT_RELATIONSHIP_REACTIVATED

SUPPORT_EXPIRATION_UPDATED
```

---

# 35. Lecturas no auditadas

v1.0.0:

```text
NO
```

registrará un AuditEvent por cada:

```text
GET
```

o visualización.

Razones:

- ruido;
- crecimiento innecesario;
- menor valor funcional;
- no forma parte del requerimiento de trazabilidad de cambios.

La auditoría se concentra en:

```text
mutaciones de estado
```

---

# 36. Login/logout

Login y logout:

```text
NO
```

formarán parte inicialmente del AuditEvent funcional.

Podrán agregarse posteriormente como:

```text
security audit events
```

si existe necesidad.

---

# 37. Payload

`payload` será:

```text
JSONB
```

con información estructurada y minimizada.

No será una copia arbitraria completa del request HTTP.

---

# 38. Datos permitidos en payload

Ejemplos:

```json
{
  "previousStatus": "ACTIVE",
  "newStatus": "CANCELLED"
}
```

o:

```json
{
  "changedFields": [
    "title",
    "targetDate"
  ]
}
```

o:

```json
{
  "canViewGoals": true,
  "canViewProgress": false,
  "canViewSummaries": false
}
```

---

# 39. Datos prohibidos en AuditEvent

Nunca almacenar:

```text
password

passwordHash

JWT

Authorization header

API keys

DATABASE_URL

refresh/access token

SEED_PASSWORD
```

---

# 40. CheckIn.notes en auditoría

`CheckIn.notes`:

```text
NO
```

será copiado dentro de `AuditEvent.payload`.

El CheckIn original ya conserva el dato owner-only.

Duplicarlo en auditoría aumenta innecesariamente exposición.

---

# 41. Atomicidad

Toda acción auditada deberá ejecutar:

```text
domain mutation
+
AuditEvent creation
```

en la misma transacción PostgreSQL cuando ambas operaciones formen una única acción de negocio.

Ejemplo:

```text
cancel Goal
+
insert GOAL_CANCELLED AuditEvent
```

debe ser atómico.

---

# 42. Ejemplo CheckIn

```text
Create CheckIn
+
Update Goal.progress
+
Create CHECKIN_CREATED AuditEvent
```

debe ejecutarse como una única operación lógica.

---

# 43. Inmutabilidad de auditoría

La aplicación:

```text
NO
```

expondrá servicios que modifiquen o eliminen AuditEvents.

Cuando sea viable durante la migración, PostgreSQL deberá reforzar esta propiedad mediante:

- ausencia de endpoints;
- ausencia de métodos de actualización/eliminación;
- constraints/triggers si resultan apropiados y mantenibles.

---

# 44. Alcance histórico de la auditoría

AuditEvent comienza a garantizar trazabilidad:

```text
desde la migración de ADR-008 en adelante
```

No es posible reconstruir automáticamente:

```text
información eliminada físicamente
antes de ADR-008
```

si ya no existe en PostgreSQL.

No se inventarán eventos históricos.

---

# 45. Historial visible al propietario

El propietario tendrá una vista:

```text
Actividad
```

o:

```text
Historial de actividad
```

desde Flutter.

---

# 46. API de auditoría

Endpoint owner-only:

```text
GET /api/v1/audit-events
```

Debe soportar:

```text
paginación
```

y preferentemente filtros básicos como:

```text
entityType

action

fecha
```

sin convertir v1.0.0 en un sistema avanzado de reporting.

---

# 47. Orden de auditoría

Por defecto:

```text
occurredAt DESC
```

evento más reciente primero.

---

# 48. Presentación de auditoría

Flutter deberá transformar eventos en texto comprensible.

Ejemplos:

```text
Cancelaste el objetivo “Preparar examen”.
```

```text
Actualizaste los permisos de Juan.
```

```text
Invalidaste un check-in del objetivo “Proyecto final”.
```

No mostrar al usuario principal una representación JSON cruda como experiencia normal.

---

# 49. AuditEvent es owner-only

Durante v1.0.0:

```text
AuditEvent
```

será visible únicamente para:

```text
owner
```

No se compartirá con miembros de apoyo.

---

# 50. Motivo

La auditoría puede revelar:

- existencia de relaciones;
- cambios de permisos;
- acciones privadas;
- estructura interna de seguimiento.

Por tanto, no forma parte de las proyecciones delegadas iniciales.

Un futuro permiso:

```text
VIEW_AUDIT
```

requerirá otro ADR.

---

# 51. Red de apoyo

MVP-1.5 implementará físicamente:

```text
SupportRelationship
```

antes de completar la integración real de MVP-2.

---

# 52. Rol contextual

No se agregará:

```text
User.role
```

global.

Una misma persona puede ser:

```text
owner de sus datos
+
supporter de otra persona
```

simultáneamente.

---

# 53. SupportRelationship

Campos funcionales:

```text
id

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

# 54. Regla de identidad

No puede existir:

```text
ownerId == supporterId
```

---

# 55. Relación única

Para un par:

```text
ownerId
+
supporterId
```

existirá una única relación lógica.

La reactivación reutilizará la relación histórica en lugar de crear duplicados innecesarios.

---

# 56. Alta del supporter

El propietario agregará a un miembro mediante:

```text
email exacto
```

de una cuenta existente.

No existirá:

```text
directorio global de usuarios

buscador abierto de personas
```

---

# 57. Permisos

Se conservan:

```text
VIEW_GOALS

VIEW_PROGRESS

VIEW_SUMMARIES
```

persistidos mediante:

```text
canViewGoals

canViewProgress

canViewSummaries
```

---

# 58. Dependencias entre permisos

Se mantiene:

```text
VIEW_PROGRESS
requiere
VIEW_GOALS
```

y:

```text
VIEW_SUMMARIES
requiere
VIEW_GOALS
```

---

# 59. Relación sin permisos

No se permitirá:

```text
false
false
false
```

Una relación activa debe otorgar al menos una visibilidad funcional válida.

---

# 60. Control por integrante

Los permisos se configuran:

```text
por SupportRelationship
```

y no globalmente.

Ejemplo:

```text
Ana
VIEW_GOALS = true
VIEW_PROGRESS = true

Luis
VIEW_GOALS = true
VIEW_PROGRESS = false
```

El propietario controla individualmente lo que cada persona puede observar.

---

# 61. Objetivos cancelados para la red de apoyo

Un supporter con:

```text
VIEW_GOALS = true
```

podrá consultar Goals con cualquiera de los estados:

```text
ACTIVE

PAUSED

COMPLETED

CANCELLED
```

---

# 62. Justificación

Los Goals cancelados forman parte de:

```text
la historia de seguimiento
```

y no deben desaparecer de la perspectiva de una persona de apoyo que tiene permiso para consultar objetivos.

---

# 63. Presentación de CANCELLED

Flutter deberá mostrar el estado:

```text
Cancelado
```

de forma visualmente distinguible, pero no culpabilizante.

No deberá ocultarlo automáticamente.

---

# 64. VIEW_GOALS

`VIEW_GOALS` permite ver:

```text
title

description

category

status

progress

targetDate
```

incluyendo Goals `CANCELLED`.

No permite ver:

```text
CheckIn.notes
```

---

# 65. VIEW_PROGRESS

Cuando:

```text
canViewProgress = true
```

el supporter podrá ver:

- progreso actual;
- timeline de CheckIns efectivos;
- fechas;
- porcentajes;
- dificultad;
- completion;
- tendencias;
- métricas autorizadas.

---

# 66. CheckIns invalidados y supporter

Los CheckIns:

```text
VOIDED
```

no aparecerán en la timeline normal de progreso delegada.

Su existencia sigue conservada en PostgreSQL y en la auditoría privada del propietario.

---

# 67. VIEW_SUMMARIES durante MVP-1.5

El permiso:

```text
VIEW_SUMMARIES
```

puede implementarse físicamente en `SupportRelationship`.

Sin embargo, hasta que MVP-2 completo produzca `AISummary` reales:

```text
no existe obligación de demostrar contenido IA real
```

durante MVP-1.5.

El permiso debe quedar listo para ser utilizado posteriormente.

---

# 68. Supporter read-only

El supporter:

```text
NO
```

puede:

- modificar Goal;
- cancelar Goal;
- reactivar Goal;
- crear CheckIn;
- invalidar CheckIn;
- generar resumen IA;
- modificar permisos;
- revocar relación;
- leer AuditEvent del owner.

---

# 69. Rutas delegadas

Se mantienen separadas de las rutas owner.

Ejemplos:

```text
GET /api/v1/support-network/owners/:ownerId/goals

GET /api/v1/support-network/owners/:ownerId/goals/:goalId

GET /api/v1/support-network/owners/:ownerId/goals/:goalId/progress

GET /api/v1/support-network/owners/:ownerId/summaries
```

---

# 70. SupportAccessService

Toda lectura delegada debe pasar por:

```text
SupportAccessService
```

y aplicar:

```text
relationship exists?
      ↓
active?
      ↓
not expired?
      ↓
not revoked?
      ↓
required permission?
      ↓
safe projection
```

---

# 71. Fallo de autorización

Cuando no exista acceso delegado válido:

```text
404
```

continúa siendo la respuesta preferida para evitar revelar existencia de recursos ajenos.

---

# 72. Expiración

Una relación está activa si:

```text
revokedAt == null

AND

(
 expiresAt == null
 OR
 expiresAt > now
)
```

No se requiere worker.

---

# 73. Revocación

Revocar:

```text
NO
```

elimina SupportRelationship.

Se establece:

```text
revokedAt = now
```

y se registra:

```text
SUPPORT_RELATIONSHIP_REVOKED
```

en AuditEvent.

El acceso debe desaparecer en la siguiente request.

---

# 74. Reactivación

Una relación revocada podrá reactivarse.

La reactivación:

- limpia `revokedAt`;
- actualiza permisos;
- actualiza `expiresAt` cuando corresponda;
- registra AuditEvent.

---

# 75. Cambios de permisos

Cualquier cambio de:

```text
canViewGoals

canViewProgress

canViewSummaries
```

genera:

```text
SUPPORT_PERMISSIONS_UPDATED
```

---

# 76. Frontend Owner

El propietario deberá disponer de:

```text
Mi red de apoyo
```

con capacidad para:

- agregar integrante;
- ver estado de relación;
- modificar permisos;
- establecer expiración;
- revocar;
- reactivar.

---

# 77. Frontend Supporter

Un usuario autenticado deberá disponer de:

```text
Personas a las que apoyo
```

o equivalente.

Desde ahí podrá seleccionar un owner y acceder a la proyección autorizada.

---

# 78. Dos contextos simultáneos

Una misma cuenta podrá mostrar:

```text
Mis objetivos
```

y:

```text
Personas a las que apoyo
```

sin cambiar un rol global.

---

# 79. No role switch

No existirá un mecanismo:

```text
Cambiar rol: OWNER / SUPPORTER
```

La navegación representa contextos distintos del mismo usuario.

---

# 80. Separación visual

Las vistas delegadas deberán indicar claramente:

```text
Estás viendo información compartida por <displayName>
```

para evitar confusión con datos propios.

---

# 81. Auditoría y SupportRelationship

Las siguientes acciones deberán aparecer en el historial del propietario:

```text
agregó supporter

cambió permisos

cambió expiración

revocó relación

reactivó relación
```

---

# 82. Auditoría y Goal

Como mínimo:

```text
creó Goal

actualizó Goal

cambió status

canceló Goal

reactivó Goal
```

---

# 83. Auditoría y CheckIn

Como mínimo:

```text
creó CheckIn

invalidó CheckIn
```

---

# 84. Auditoría y Profile

Como mínimo:

```text
actualizó perfil
```

sin persistir secretos.

---

# 85. Cambios requeridos en persistencia

El esquema deberá evolucionar aproximadamente hacia:

```text
User
 ├── Goal
 │    └── CheckIn
 │
 ├── SupportRelationship (owner)
 ├── SupportRelationship (supporter)
 ├── AISummary
 └── AuditEvent
```

---

# 86. Migración requerida

MVP-1.5 requerirá migration para:

```text
GoalStatus.CANCELLED

CheckIn.voidedAt

SupportRelationship

AuditEvent
```

más:

- constraints;
- foreign keys;
- índices.

---

# 87. Índices recomendados

Como mínimo:

```text
Goal(ownerId, status)

CheckIn(goalId, createdAt)

SupportRelationship(ownerId)

SupportRelationship(supporterId)

SupportRelationship(ownerId, supporterId) UNIQUE

AuditEvent(ownerId, occurredAt)

AuditEvent(ownerId, entityType, entityId)
```

---

# 88. Cascades

Las relaciones de base de datos podrán conservar constraints referenciales.

Sin embargo:

```text
Cascade Delete
```

no deberá utilizarse como mecanismo funcional normal de la aplicación.

La ausencia de endpoints de eliminación física debe impedir llegar a dicha operación durante uso normal.

---

# 89. AuditEvent y transacciones

Operaciones como:

```text
Goal cancel

Goal reactivate

CheckIn create

CheckIn void

SupportRelationship create

Permission update

Revoke

Reactivate
```

deberán producir su AuditEvent dentro de la misma operación transaccional.

---

# 90. Seed

El seed deberá demostrar:

```text
Owner A

Supporter B

Goal ACTIVE

Goal COMPLETED

Goal CANCELLED

CheckIns

SupportRelationship

permisos diferenciados

AuditEvents
```

sin utilizar información personal real.

---

# 91. Flujo E2E principal MVP-1.5

Debe probarse:

```text
User A registers
        ↓
User B registers
        ↓
A creates Goal 1
        ↓
A creates Goal 2
        ↓
A creates CheckIns
        ↓
A cancels Goal 2
        ↓
A adds B as supporter
        ↓
A grants VIEW_GOALS
        ↓
B opens “Personas a las que apoyo”
        ↓
B selects A
        ↓
B sees Goal 1
        ↓
B sees Goal 2 as CANCELLED
        ↓
B cannot see detailed progress
        ↓
A enables VIEW_PROGRESS
        ↓
B can see authorized progress
        ↓
B cannot see notes
        ↓
B cannot mutate anything
        ↓
A revokes relationship
        ↓
B immediately loses access
```

---

# 92. Flujo E2E de auditoría

Debe probarse:

```text
A creates Goal
    ↓
GOAL_CREATED

A creates CheckIn
    ↓
CHECKIN_CREATED

A cancels Goal
    ↓
GOAL_CANCELLED

A creates SupportRelationship
    ↓
SUPPORT_RELATIONSHIP_CREATED

A changes permissions
    ↓
SUPPORT_PERMISSIONS_UPDATED

A revokes
    ↓
SUPPORT_RELATIONSHIP_REVOKED

A opens activity
    ↓
all events visible in chronological history
```

---

# 93. Flujo E2E de CheckIn invalidado

```text
Goal progress = 70
        ↓
latest CheckIn progress = 70
        ↓
owner voids CheckIn
        ↓
CheckIn remains persisted
        ↓
CHECKIN_VOIDED recorded
        ↓
Goal.progress recalculated
        ↓
Analytics recalculated
```

---

# 94. Pruebas de seguridad

Debe comprobarse:

```text
User C without relationship
cannot read A

B without VIEW_PROGRESS
cannot read progress

B with VIEW_GOALS
can see CANCELLED goal

B cannot read notes

B cannot mutate Goal

B cannot create CheckIn

B cannot void CheckIn

B cannot view A AuditEvents

revoked B loses access

expired B loses access
```

---

# 95. Pruebas de auditoría

Debe comprobarse:

- cada mutación crítica crea exactamente un evento;
- evento pertenece al owner correcto;
- actor correcto;
- timestamp UTC;
- payload sin secretos;
- no existe API de modificación;
- no existe API de eliminación;
- operación y evento son atómicos.

---

# 96. Pruebas de persistencia

Debe comprobarse:

```text
cancel Goal
→ row still exists

void CheckIn
→ row still exists

revoke SupportRelationship
→ row still exists
```

---

# 97. Dashboard

Dashboard Owner deberá distinguir:

```text
activeGoals

pausedGoals

completedGoals

cancelledGoals
```

---

# 98. Goal lists

El propietario podrá filtrar:

```text
Todos

Activos

Pausados

Completados

Cancelados
```

si la UX lo permite sin complejidad excesiva.

Como mínimo:

```text
CANCELLED
```

no podrá desaparecer de la historia.

---

# 99. Supporter Goal list

El supporter con `VIEW_GOALS` debe recibir:

```text
ACTIVE
PAUSED
COMPLETED
CANCELLED
```

sin ocultar automáticamente estados históricos.

---

# 100. IA después de MVP-1.5

MVP-1.5 no selecciona proveedor IA.

Cuando se retome MVP-2:

```text
SummaryContextBuilder
```

deberá adaptarse al nuevo dominio.

Si se incluyen objetivos cancelados:

```text
status = CANCELLED
```

debe permanecer explícito.

La IA nunca deberá interpretar cancelación como:

- fracaso;
- síntoma;
- condición clínica;
- estado emocional.

---

# 101. AI Analytics compatibility

El pipeline existente:

```text
Analytics
 ↓
SummaryContext
 ↓
Prompt
```

deberá continuar funcionando después de introducir `CANCELLED`.

Los tests de regresión deberán comprobarlo antes de retomar el proveedor real.

---

# 102. Alcance fuera de MVP-1.5

No implementar todavía:

```text
real LLM provider

model selection

advanced audit reporting

security login audit

VIEW_AUDIT para supporter

notifications

invitation emails

chat

comments between users

supporter writes

account deletion

advanced retention policies

data export

RAG

agents
```

---

# 103. Alternativas consideradas — Eliminación física

## Alternativa A

```text
DELETE físico
```

Resultado:

```text
RECHAZADA
```

porque rompe trazabilidad y hace desaparecer información histórica.

---

# 104. Alternativa B — Soft delete genérico

```text
deletedAt
```

para todas las entidades.

Resultado:

```text
RECHAZADA COMO MODELO ÚNICO
```

porque no describe correctamente el significado de negocio.

Un Goal no está simplemente “borrado”:

```text
está CANCELLED
```

Un CheckIn incorrecto:

```text
está VOIDED
```

Una relación:

```text
está REVOKED
```

Se prefieren estados semánticos.

---

# 105. Alternativa C — Estados semánticos + AuditEvent

```text
CANCELLED
VOIDED
REVOKED
+
AuditEvent
```

Resultado:

```text
ACEPTADA
```

porque conserva:

- información;
- semántica;
- trazabilidad;
- capacidad de auditoría;
- experiencia comprensible.

---

# 106. Alternativas de auditoría

Se consideró almacenar únicamente:

```text
updatedAt
```

Resultado:

```text
RECHAZADO
```

porque solo describe el último cambio.

---

# 107. Snapshot completo por versión

Crear una copia completa de cada entidad por cada cambio:

```text
GoalVersion
CheckInVersion
...
```

Resultado:

```text
RECHAZADO PARA v1.0.0
```

por complejidad innecesaria.

---

# 108. AuditEvent genérico

```text
evento append-only
+
payload minimizado
```

Resultado:

```text
ACEPTADO
```

porque proporciona trazabilidad suficiente para el MVP sin convertir PostgreSQL en un sistema event-sourced.

---

# 109. Event sourcing

No se utilizará:

```text
event sourcing
```

AuditEvent:

```text
NO
```

será la fuente primaria para reconstruir el estado actual.

La fuente actual continúa siendo:

```text
User
Goal
CheckIn
SupportRelationship
```

---

# 110. Consecuencias positivas

La decisión permite:

- conservar historial;
- explicar al usuario qué ocurrió;
- mostrar Goals cancelados;
- evitar pérdida accidental de información;
- mejorar trazabilidad académica;
- probar temprano la red de apoyo;
- reforzar privacidad;
- validar permisos antes de IA real;
- conservar comportamiento contextual owner/supporter.

---

# 111. Consecuencias negativas

Introduce:

- nueva migración;
- más tablas;
- más escritura por cada mutación;
- necesidad de mantener eventos consistentes;
- cambios a tests MVP-0;
- cambios a Analytics MVP-1;
- cambios a UI;
- necesidad de actualizar AI Preview después de Avance 1.

Estas consecuencias se aceptan porque todavía existe margen suficiente antes del cierre del semestre.

---

# 112. Riesgo — crecimiento de AuditEvent

Para v1.0.0 el volumen académico será bajo.

No se implementará:

```text
archival storage
partitioning
data warehouse
```

---

# 113. Riesgo — datos sensibles duplicados

Mitigación:

```text
allowlist de payload
+
no raw request dumps
+
no notes
+
no credentials
```

---

# 114. Riesgo — inconsistencias entre acción y auditoría

Mitigación:

```text
same database transaction
```

para las mutaciones críticas.

---

# 115. Riesgo — confusión Owner / Supporter

Mitigación:

- rutas separadas;
- pantallas separadas;
- mensaje de contexto;
- permisos centralizados en backend.

---

# 116. Riesgo — adelantar MVP-3

La red de apoyo originalmente se implementaría después de MVP-2.

Mitigación:

MVP-1.5 implementa únicamente:

```text
núcleo de relación
+
permisos
+
lectura delegada
+
auditoría
```

No agrega funciones secundarias.

---

# 117. Orden de implementación recomendado

Después del cierre de Avance 1:

```text
1. migration CANCELLED / VOIDED / AuditEvent / SupportRelationship

2. audit infrastructure

3. migrate Goal deletion → cancellation

4. migrate CheckIn deletion → void

5. analytics regression

6. support relationship backend

7. delegated authorization

8. owner support UI

9. supporter UI

10. audit UI

11. E2E dual-user

12. Docker / CI / smoke regression

13. update AI Preview compatibility

14. handoff MVP-1.5
```

---

# 118. Branch sugerida

El bloque de Codex deberá utilizar:

```text
mvp1.5-support-audit
```

creada desde:

```text
main
```

después de que el cierre de Avance 1 haya sido:

```text
validado
+
integrado
```

---

# 119. No trabajar encima de branch de Avance 1

La secuencia será:

```text
mvp2-avance1
      ↓
human smoke
      ↓
PR
      ↓
main
      ↓
mvp1.5-support-audit
```

---

# 120. Definition of Done MVP-1.5 — Persistencia

```text
[ ] GoalStatus incluye CANCELLED

[ ] cancelar Goal no elimina row

[ ] reactivar Goal conserva historia

[ ] CheckIn no se elimina físicamente

[ ] CheckIn puede invalidarse

[ ] void recalcula Goal.progress

[ ] Analytics ignora CheckIns invalidados

[ ] SupportRelationship no se elimina al revocar

[ ] AuditEvent append-only existe

[ ] migración funciona desde DB limpia
```

---

# 121. Definition of Done MVP-1.5 — Auditoría

```text
[ ] Goal mutations generan AuditEvent

[ ] CheckIn mutations generan AuditEvent

[ ] SupportRelationship mutations generan AuditEvent

[ ] Profile update genera AuditEvent

[ ] payload no contiene secretos

[ ] AuditEvent es owner-only

[ ] historial visible en Flutter

[ ] no existen endpoints de update/delete de audit
```

---

# 122. Definition of Done MVP-1.5 — SupportNetwork

```text
[ ] owner puede agregar supporter existente

[ ] no existe relación consigo mismo

[ ] permisos funcionan

[ ] dependencias entre permisos funcionan

[ ] expiración funciona

[ ] revocación funciona

[ ] reactivación funciona

[ ] supporter puede listar owners que apoya

[ ] supporter puede consultar Goals autorizados

[ ] supporter ve CANCELLED Goals

[ ] supporter ve progress solo con permiso

[ ] supporter nunca ve notes

[ ] supporter no puede escribir

[ ] ausencia de permiso devuelve acceso denegado seguro

[ ] relación revocada bloquea siguiente request
```

---

# 123. Definition of Done MVP-1.5 — E2E

```text
[ ] User A y User B creados

[ ] A crea objetivos

[ ] A registra progreso

[ ] A cancela objetivo

[ ] cancelado permanece persistido

[ ] A agrega B

[ ] B ve objetivo cancelado

[ ] B no ve progreso sin permiso

[ ] A habilita VIEW_PROGRESS

[ ] B ve progreso

[ ] B no ve notes

[ ] B no puede modificar recursos

[ ] A cambia permisos

[ ] cambio se refleja inmediatamente

[ ] A revoca

[ ] B pierde acceso

[ ] A consulta AuditEvent

[ ] acciones anteriores aparecen
```

---

# 124. Regression Gate

MVP-1.5 no estará terminado si rompe:

```text
Auth

Goals

CheckIns

History

Analytics

Dashboard

AI Preview del Avance 1

Docker Compose

CI
```

---

# 125. Estado posterior a MVP-1.5

Después del merge:

```text
MVP-0
DONE

MVP-1
DONE

MVP-1.5
DONE

MVP-2
STARTED
```

y el siguiente bloque retomará:

```text
MVP-2 completion
```

con:

```text
proveedor real
+
modelo seleccionado
+
AISummary
+
frontend IA
```

---

# 126. Cambios sobre documentos anteriores

Este ADR modifica expresamente las siguientes decisiones anteriores:

## ADR-001

Se reemplaza:

```text
physical deletion allowed during MVP
```

por:

```text
semantic state transitions
+
append-only audit
```

Soft deletion y auditoría dejan de estar diferidos.

---

## ADR-002

Se amplía:

```text
GoalStatus
```

con:

```text
CANCELLED
```

y se establece persistencia histórica.

Los permisos existentes se mantienen.

---

## ADR-003

Los endpoints y servicios de eliminación deberán adaptarse para no ejecutar borrado físico.

Se adelanta físicamente:

```text
SupportNetworkModule
+
SupportAccessService
```

---

## ADR-004

Flutter deberá incorporar:

```text
cancelled Goal state

Historial de actividad

Mi red de apoyo

Personas a las que apoyo

permission management

delegated read-only views
```

---

## ADR-006

Se conserva la arquitectura general.

Únicamente cambia el orden de implementación al introducir:

```text
MVP-1.5
```

antes de completar MVP-2.

---

## ADR-007

Sin cambios arquitectónicos.

MVP-1.5 deberá utilizar la misma:

```text
Docker
+
Compose
+
CI
+
PostgreSQL
```

baseline.

---

# 127. Reglas inmutables para Codex

Codex no podrá reinterpretar:

```text
no physical domain deletion

Goal CANCELLED is persistent

CheckIn voiding instead of deletion

AuditEvent append-only

audit owner-only

supporter role is contextual

supporter read-only

VIEW_GOALS includes CANCELLED

VIEW_PROGRESS requires VIEW_GOALS

VIEW_SUMMARIES requires VIEW_GOALS

notes never shared with supporter

permissions are per SupportRelationship

revoke does not delete relation

relationship expiration checked per request

owner and supporter views remain separate

Analytics ignores VOIDED CheckIns

CANCELLED is not INACTIVE

all critical mutations audited atomically
```

---

# 128. Criterio final

MVP-1.5 se considera exitoso cuando pueda demostrarse:

> Un usuario puede conservar un historial no destructivo de sus acciones, cancelar objetivos sin perderlos, consultar su propia auditoría y autorizar a otro usuario como miembro de apoyo con permisos específicos; el miembro de apoyo puede ver únicamente la información autorizada —incluidos los objetivos cancelados— y pierde inmediatamente el acceso cuando el propietario revoca la relación.

---

# 129. Estado de la decisión

```text
ACEPTADA PARA IMPLEMENTACIÓN
```

---

# 130. Filosofía de la decisión

> **En NeuroConnect la historia no desaparece: las acciones cambian el estado de la información, la auditoría conserva qué ocurrió y la red de apoyo observa únicamente aquello que el propietario decidió compartir.**

Este ADR hace algo importante que conviene dejar deliberadamente explícito: **no estamos implementando un simple `soft delete` genérico**. Estamos dando semántica a cada caso:

```text
Goal ya no deseado
→ CANCELLED

CheckIn incorrecto
→ VOIDED

SupportRelationship retirada
→ REVOKED

Acción realizada
→ AuditEvent
```

Eso es mucho más coherente con el dominio que llenar todas las tablas de `deletedAt`.
