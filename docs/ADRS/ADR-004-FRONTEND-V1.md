
# ADR-004 — Arquitectura y diseño del frontend de NeuroConnect v1.0.0

**Estado:** Aceptado para implementación  
**Fecha:** 14 de octubre de 2026  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Decisión:** Arquitectura, navegación, estado, contratos, UX, accesibilidad y organización del cliente Flutter  
**Responsable:** Carlos Benjamín Armenta Márquez  

---

# 1. Contexto

NeuroConnect requiere una aplicación cliente capaz de proporcionar una experiencia completa para dos contextos de uso:

```text
propietario de información
+
miembro de una red de apoyo
```

El frontend deberá permitir que una persona:

- se registre;
- inicie sesión;
- consulte y edite su perfil;
- gestione objetivos;
- registre check-ins;
- consulte historial;
- visualice indicadores;
- consulte tendencias;
- genere y consulte resúmenes mediante IA;
- administre su red de apoyo;
- defina permisos;
- consulte información que otros usuarios hayan autorizado.

La aplicación deberá funcionar a partir de una sola base de código y estará dirigida a:

```text
Web
Android
iOS compatible
```

La versión v1.0.0 representa un MVP académico.

Por esta razón el frontend debe priorizar:

```text
claridad
+
consistencia
+
bajo costo de implementación
+
accesibilidad
+
testabilidad
+
responsive design
+
separación de responsabilidades
```

sobre:

```text
animaciones complejas
+
arquitectura ceremonial
+
personalización extrema
+
funciones comerciales
+
optimización prematura
```

---

# 2. Relación con otros documentos

Este ADR forma parte de la baseline arquitectónica de NeuroConnect.

Jerarquía:

```text
Anteproyecto
    ↓
ADR-001 — Persistencia y modelo de datos
    ↓
ADR-002 — Dominio y reglas de negocio
    ↓
ADR-003 — Backend
    ↓
ADR-004 — Frontend
    ↓
Planes de implementación
    ↓
Documentación técnica
    ↓
Código
```

---

# 3. Responsabilidad de ADR-001

ADR-001 continúa siendo autoridad para:

- modelo de datos;
- persistencia;
- relaciones;
- UUID;
- timestamps;
- `Goal.progress`;
- `CheckIn`;
- `AISummary`;
- `SupportRelationship`.

El frontend no deberá asumir reglas diferentes de las persistidas por el sistema.

---

# 4. Responsabilidad de ADR-002

ADR-002 continúa siendo autoridad para:

- actores;
- lifecycle de Goal;
- significado de CheckIn;
- reglas analíticas;
- IA;
- permisos;
- privacidad;
- lenguaje;
- límites clínicos;
- navegación conceptual;
- comportamiento funcional.

ADR-004 no redefine estas reglas.

---

# 5. Responsabilidad de ADR-003

ADR-003 continúa siendo autoridad para:

- API REST;
- `/api/v1`;
- autenticación JWT;
- endpoints;
- códigos HTTP;
- contratos;
- ownership;
- autorización delegada;
- estructura de errores;
- integración con IA;
- rutas de SupportNetwork.

El frontend deberá consumir esos contratos.

---

# 6. Decisión principal

El frontend oficial de NeuroConnect v1.0.0 será implementado mediante:

```text
Flutter
+
Dart
+
Material 3
+
Riverpod
+
go_router
+
Dio
+
fl_chart
```

El proyecto mantendrá:

```text
una sola base de código
```

para:

```text
Web
Android
iOS
```

---

# 7. Arquitectura general

```text
┌───────────────────────────────────┐
│             Flutter               │
│                                   │
│  Presentation                     │
│  State / Controllers              │
│  Repositories / API abstraction   │
│  Core services                    │
└─────────────────┬─────────────────┘
                  │
              HTTPS / JSON
                  │
                  ▼
        ┌──────────────────┐
        │ NestJS REST API  │
        │     /api/v1      │
        └──────────────────┘
```

---

# 8. Principio arquitectónico

La filosofía será:

> **Feature-first, con separación suficiente para probar y mantener el cliente, evitando una Clean Architecture ceremonial.**

No se implementará una arquitectura de múltiples capas rígidas como:

```text
domain/
entities/
usecases/
ports/
adapters/
gateways/
mappers/
datasources/
repositories/
```

para cada operación cuando no exista necesidad real.

---

# 9. Estructura principal

La aplicación se organizará por funcionalidad.

```text
app/
│
├── lib/
│   ├── main.dart
│   │
│   ├── app/
│   │   ├── app.dart
│   │   ├── router.dart
│   │   └── theme.dart
│   │
│   ├── core/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── storage/
│   │   ├── widgets/
│   │   └── utils/
│   │
│   └── features/
│       ├── auth/
│       ├── profile/
│       ├── dashboard/
│       ├── goals/
│       ├── check_ins/
│       ├── ai/
│       └── support_network/
│
├── test/
│
├── integration_test/
│
├── web/
├── android/
├── ios/
│
├── pubspec.yaml
└── README.md
```

---

# 10. Organización feature-first

Cada feature podrá utilizar una estructura equivalente a:

```text
goals/
│
├── data/
│   ├── goal_api.dart
│   ├── goal_repository.dart
│   └── goal_models.dart
│
├── application/
│   └── goal_providers.dart
│
└── presentation/
    ├── pages/
    └── widgets/
```

No será obligatorio crear una carpeta cuando no aporte valor.

---

# 11. Regla contra sobrearquitectura

No se crearán:

```text
IGoalRepository
GoalRepositoryImpl
GoalUseCase
GoalInteractor
GoalMapper
GoalEntity
GoalDto
```

simultáneamente si una implementación más sencilla es suficiente.

Se utilizarán abstracciones únicamente donde:

- exista estado;
- exista integración remota;
- exista lógica reutilizable;
- exista una frontera que facilite pruebas.

---

# 12. Dependencias principales

Se utilizarán:

```text
flutter_riverpod
go_router
dio
fl_chart
```

y una solución apropiada para almacenamiento seguro o persistencia de sesión.

No se incorporarán librerías adicionales sin una necesidad concreta.

---

# 13. State management

El mecanismo oficial será:

```text
Riverpod
```

Razones:

- separación del widget tree;
- dependency injection ligera;
- manejo de estados async;
- testabilidad;
- buena integración con arquitectura feature-first;
- evita boilerplate excesivo.

---

# 14. Opciones rechazadas de estado

## 14.1 setState como estrategia global

```text
RECHAZADO
```

Puede utilizarse para estado estrictamente local de UI.

No deberá administrar:

- sesión;
- objetivos;
- analytics;
- red de apoyo;
- estado remoto.

---

## 14.2 Bloc

```text
RECHAZADO PARA v1.0.0
```

No existe necesidad suficiente para introducir:

- events;
- states;
- blocs;

para cada flujo.

---

## 14.3 Provider clásico

```text
RECHAZADO
```

Riverpod proporciona una frontera más flexible para estado y dependencias.

---

## 14.4 Redux

```text
RECHAZADO
```

La complejidad del producto no justifica un store global centralizado de ese nivel.

---

# 15. Estado local y remoto

Se distinguirán dos tipos.

## Estado local

Ejemplos:

```text
password visible
tab seleccionada
valor temporal de slider
formulario sin enviar
```

Puede permanecer dentro del widget.

## Estado remoto

Ejemplos:

```text
currentUser
goals
checkIns
analytics
aiSummaries
supportRelationships
```

deberá ser administrado mediante Providers/Notifiers.

---

# 16. Principio de autoridad de datos

El frontend:

```text
NO
```

será fuente autoritativa de datos de negocio.

La autoridad reside en:

```text
backend
```

El cliente puede mantener estado local o cache temporal, pero después de una operación de escritura deberá sincronizarse con la API.

---

# 17. Navegación

La navegación oficial utilizará:

```text
go_router
```

---

# 18. Navegación principal autenticada

Las secciones principales serán:

```text
Dashboard
Objetivos
Red de apoyo
Perfil
```

En móviles podrán mostrarse mediante:

```text
NavigationBar
```

En layouts amplios podrá utilizarse:

```text
NavigationRail
```

o navegación lateral equivalente.

---

# 19. Rutas conceptuales

```text
/login
/register

/dashboard

/goals
/goals/new
/goals/:goalId
/goals/:goalId/edit
/goals/:goalId/check-in

/ai/summaries
/ai/summaries/:summaryId

/support
/support/manage
/support/manage/:relationshipId
/support/shared/:ownerId

/profile
```

Las rutas exactas internas podrán variar sin cambiar la semántica.

---

# 20. Redirect de autenticación

Si un usuario no autenticado intenta acceder a una ruta privada:

```text
→ /login
```

Si un usuario autenticado accede a:

```text
/login
/register
```

podrá redirigirse:

```text
→ /dashboard
```

---

# 21. Estado de sesión

La sesión estará representada conceptualmente como:

```text
unknown
unauthenticated
authenticated
```

No deberá tratarse el arranque inicial como:

```text
unauthenticated
```

antes de comprobar almacenamiento de sesión.

---

# 22. Splash / bootstrap

Durante inicio:

```text
App launch
   ↓
leer token
   ↓
si existe
   ↓
GET /auth/me
   ↓
válido?
```

Si sí:

```text
authenticated
```

Si no:

```text
eliminar token
→ login
```

---

# 23. Autenticación

El cliente consumirá:

```text
POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/me
```

---

# 24. AuthRepository

La feature Auth encapsulará:

```text
register()
login()
restoreSession()
logout()
```

Los widgets no deberán utilizar Dio directamente.

---

# 25. Token

El backend retorna:

```text
accessToken
```

El token será administrado por una abstracción:

```text
AuthTokenStore
```

---

# 26. Almacenamiento móvil del token

En:

```text
Android
iOS
```

se utilizará almacenamiento seguro proporcionado por el sistema operativo mediante una librería Flutter adecuada.

No se almacenará el JWT en:

```text
SharedPreferences
```

si existe almacenamiento seguro disponible.

---

# 27. Almacenamiento Web

En Web no existe una equivalencia perfecta al keystore nativo.

Para v1.0.0 se utilizará almacenamiento de sesión del navegador mediante un adaptador específico.

Preferencia:

```text
session-scoped storage
```

en lugar de persistencia indefinida.

Consecuencia:

cerrar la sesión del navegador o eliminar los datos del sitio puede requerir iniciar sesión nuevamente.

---

# 28. Regla sobre token Web

El frontend no deberá asumir que el almacenamiento Web convierte el JWT en un secreto inaccesible.

Por ello:

- no se almacenarán datos clínicos;
- no se persistirá información sensible adicional;
- se evitará ejecución arbitraria de scripts;
- se consumirán únicamente orígenes configurados.

---

# 29. Logout

Logout deberá:

1. eliminar token;
2. limpiar providers asociados a sesión;
3. limpiar caches privados;
4. navegar a `/login`.

No requiere request al backend en v1.0.0.

---

# 30. Dio

La comunicación HTTP utilizará:

```text
Dio
```

Una única configuración central será creada mediante:

```text
ApiClient
```

o equivalente.

---

# 31. Base URL

La URL del backend no se hardcodeará.

Se configurará mediante:

```text
--dart-define
```

o configuración equivalente.

Ejemplo conceptual:

```text
API_BASE_URL=https://api.example.com/api/v1
```

---

# 32. Configuración por entorno

Como mínimo se distinguirán:

```text
development
production
```

Podrá existir:

```text
test
```

para integración automatizada.

---

# 33. ApiClient

Será responsable de:

- base URL;
- headers;
- timeout;
- serialización;
- interceptors;
- autenticación;
- normalización inicial de errores.

---

# 34. Authorization header

Para requests autenticadas:

```text
Authorization: Bearer <JWT>
```

será agregado automáticamente.

Los widgets no construirán este header manualmente.

---

# 35. Interceptor de autenticación

Un interceptor podrá leer:

```text
AuthTokenStore
```

y adjuntar el token.

No contendrá reglas de negocio.

---

# 36. Respuesta 401

Si una request privada devuelve:

```text
401
```

el cliente deberá tratar la sesión como inválida.

Flujo:

```text
401
 ↓
clear token
 ↓
clear private state
 ↓
login
```

---

# 37. No refresh automático

Como ADR-003 no implementa refresh tokens, el frontend:

```text
NO
```

intentará refrescar tokens silenciosamente.

---

# 38. Timeouts

Las requests deberán tener timeout finito.

Las solicitudes de IA podrán utilizar un timeout diferente del CRUD convencional debido al tiempo de respuesta del proveedor.

No existirán requests de red sin timeout.

---

# 39. Retries

El frontend no realizará retries automáticos indiscriminados sobre:

```text
POST
PATCH
DELETE
```

para evitar duplicar escrituras.

Una operación fallida deberá mostrar estado recuperable al usuario.

---

# 40. Modelos del cliente

El frontend podrá definir modelos propios para representar los contratos API.

Ejemplos:

```text
UserModel
GoalModel
CheckInModel
AnalyticsOverview
GoalAnalytics
AiSummaryModel
SupportRelationshipModel
```

---

# 41. No compartir modelos Prisma

Flutter no conocerá:

```text
Prisma
schema.prisma
tipos internos backend
```

Únicamente conocerá contratos HTTP.

---

# 42. Serialización

Para v1.0.0 podrá utilizarse:

- serialización manual;
- `json_serializable`;

según la cantidad de modelos.

Si se incorpora generación de código deberá mantenerse simple y reproducible.

---

# 43. No Freezed obligatorio

`freezed`:

```text
NO
```

será obligatorio para v1.0.0.

Puede utilizarse solamente si reduce complejidad real.

---

# 44. Errores

El cliente deberá transformar errores HTTP en errores de aplicación comprensibles.

Ejemplos:

```text
401 → sesión inválida
404 → recurso no disponible
409 → conflicto
429 → demasiadas solicitudes
500+ → error temporal del servicio
network → sin conexión / servidor inaccesible
```

---

# 45. AppException

Podrá definirse una jerarquía sencilla:

```text
AppException

├── NetworkException
├── UnauthorizedException
├── ValidationException
├── NotFoundException
├── ConflictException
└── ServerException
```

No se requiere una jerarquía excesivamente detallada.

---

# 46. Mensajes de error

La interfaz:

```text
NO
```

mostrará directamente:

- stack traces;
- excepciones Dart;
- JSON crudo;
- errores de Prisma;
- errores internos NestJS.

---

# 47. Mensajes neutrales

Ejemplo:

```text
No fue posible guardar el check-in.
Intenta nuevamente.
```

Evitar:

```text
Something went wrong: DioException...
```

---

# 48. Formularios

Los formularios tendrán validación cliente para:

- feedback inmediato;
- campos requeridos;
- rangos;
- formato.

Sin embargo:

```text
backend
```

continúa siendo la autoridad final.

---

# 49. Doble envío

Mientras exista una mutación en curso:

```text
submit button
```

deberá quedar temporalmente deshabilitado.

Esto reduce operaciones duplicadas.

---

# 50. Indicadores de carga

Toda operación async visible deberá representar:

```text
loading
success
error
```

No se dejarán pantallas aparentemente congeladas.

---

# 51. Skeletons y spinners

No se requiere un sistema complejo de skeleton loading.

Se podrá utilizar:

```text
CircularProgressIndicator
```

o componentes discretos cuando corresponda.

---

# 52. Empty states

Toda colección deberá tener un estado vacío explícito.

Ejemplo Goals:

> Aún no tienes objetivos. Crea uno para comenzar tu seguimiento.

No mostrar simplemente:

```text
[]
```

o un espacio vacío.

---

# 53. Error states

Los errores recuperables deberán incluir, cuando tenga sentido:

```text
Reintentar
```

---

# 54. Pull-to-refresh

En Android podrá implementarse refresh manual en listados.

En Web deberá existir una acción equivalente si se requiere.

No depender del gesto como única forma de actualizar.

---

# 55. Cache

v1.0.0 no implementará una base de datos local completa.

No se utilizarán:

```text
Hive
Isar
SQLite
Drift
```

para replicar información del backend.

---

# 56. Estado temporal

Los datos remotos podrán mantenerse en memoria mediante Riverpod durante la sesión.

Después de escrituras se invalidarán/refrescarán providers relevantes.

---

# 57. Offline mode

La v1.0.0:

```text
NO
```

será offline-first.

Se requiere conexión al backend para operar.

Si no existe conexión deberá mostrarse un error claro.

---

# 58. Optimistic UI

No se utilizará optimistic update para operaciones sensibles como:

- eliminar Goal;
- eliminar CheckIn;
- revocar acceso;
- modificar permisos.

La UI esperará confirmación del backend.

---

# 59. Uso limitado de optimistic state

Podrá utilizarse únicamente para estado visual local donde un rollback sea trivial.

No constituye patrón obligatorio.

---

# 60. Theme

La aplicación utilizará:

```text
Material 3
```

como sistema visual base.

Se definirá:

```text
ThemeData
```

central.

---

# 61. Colores

La aplicación utilizará una paleta limitada.

No se definirán colores directamente en cada pantalla.

Los widgets deberán consumir:

```text
Theme.of(context).colorScheme
```

o tokens equivalentes.

---

# 62. Accent colors

Los colores utilizados para estados deberán complementar texto/iconografía.

El color:

```text
NO
```

será el único canal semántico.

---

# 63. Tipografía

Se utilizará una jerarquía consistente de Material.

Ejemplo:

```text
display / headline → muy limitado
title             → encabezados
body              → contenido
label             → controles
```

No se crearán tamaños arbitrarios por pantalla.

---

# 64. Densidad visual

El diseño priorizará:

- espacio;
- claridad;
- agrupación;
- bloques pequeños;
- una jerarquía evidente.

Se evitarán dashboards saturados.

---

# 65. Animaciones

Las animaciones serán:

```text
breves
funcionales
opcionales
```

No se utilizarán:

- loops;
- fondos animados;
- parpadeos;
- movimiento decorativo continuo.

---

# 66. Neurodivergencia y diseño

La condición temática del proyecto:

```text
NO
```

se utilizará para asumir que todas las personas neurodivergentes tienen las mismas preferencias.

La interfaz buscará:

```text
predictibilidad
claridad
consistencia
baja sobrecarga
control del usuario
```

sin afirmar universalidad clínica.

---

# 67. Lenguaje

La UI de v1.0.0 estará principalmente en:

```text
español
```

El código permanecerá en inglés.

---

# 68. Terminología obligatoria

Utilizar:

```text
Objetivo
Check-in
Progreso
Dificultad
Cumplimiento
Historial
Tendencia
Resumen IA
Red de apoyo
Miembro de apoyo
```

---

# 69. Terminología prohibida

No utilizar como términos normales del producto:

```text
Paciente
Diagnóstico
Tratamiento
Patología
Síntoma
Caso clínico
```

---

# 70. Lenguaje no culpabilizante

Correcto:

> Sin seguimiento reciente.

Incorrecto:

> Has fallado en mantener tu objetivo.

---

# 71. Estado INACTIVE

El enum técnico:

```text
INACTIVE
```

deberá mostrarse al usuario mediante una traducción neutral.

Preferencia:

```text
Sin seguimiento reciente
```

---

# 72. Estados de tendencia

Traducciones de interfaz:

```text
PROGRESSING → Progreso creciente
STABLE      → Progreso estable
DECLINING   → Progreso decreciente
INACTIVE    → Sin seguimiento reciente
```

Para PAUSED/COMPLETED se deberá indicar que corresponde a una:

```text
tendencia histórica
```

cuando aplique.

---

# 73. Accesibilidad

La aplicación deberá considerar como mínimo:

- contraste;
- tamaño de targets táctiles;
- labels;
- navegación coherente;
- texto escalable;
- semantics;
- foco en Web;
- teclado cuando aplique.

---

# 74. Semantics

IconButtons y controles sin texto visible deberán proporcionar:

```text
tooltip
semantic label
```

cuando corresponda.

---

# 75. Touch targets

Los controles interactivos deberán respetar tamaños táctiles razonables según Material.

No utilizar elementos excesivamente pequeños para:

- borrar;
- editar;
- seleccionar dificultad;
- cambiar permisos.

---

# 76. Escala de texto

Las pantallas no deberán romperse con incremento razonable del tamaño de texto del sistema.

Evitar alturas fijas para contenedores con contenido textual.

---

# 77. Teclado Web

Los formularios deberán funcionar correctamente mediante:

```text
Tab
Shift+Tab
Enter
```

cuando sea aplicable.

---

# 78. Responsive design

La aplicación no estará diseñada únicamente para móvil.

Debe adaptarse al menos a:

```text
mobile
tablet
desktop/web
```

---

# 79. Breakpoints

Se utilizarán breakpoints centralizados.

Valores orientativos:

```text
compact < 600
medium  600–1023
expanded >= 1024
```

Los valores podrán ajustarse si la implementación lo requiere.

---

# 80. Navegación responsive

Compact:

```text
NavigationBar
```

Expanded:

```text
NavigationRail
```

o sidebar equivalente.

---

# 81. Ancho máximo

En Web las pantallas de lectura y formularios no deberán expandir texto indefinidamente.

Se utilizarán contenedores con un ancho máximo razonable.

Ejemplo:

```text
800–1200 px
```

dependiendo del contenido.

---

# 82. Formularios Web

Los formularios como login y Goal:

```text
NO
```

ocuparán todo el ancho de una pantalla de escritorio.

---

# 83. Dashboard

El Dashboard será la pantalla inicial autenticada.

Objetivo:

> Presentar una visión rápida del seguimiento actual sin saturar al usuario.

---

# 84. Dashboard owner

Mostrará como mínimo:

```text
objetivos activos
objetivos completados
progreso promedio
check-ins últimos 28 días
frecuencia semanal
objetivos sin seguimiento reciente
```

---

# 85. Cards

Las métricas principales podrán utilizar cards.

No se mostrará cada indicador disponible como una card independiente.

Se priorizarán las métricas definidas por ADR-002.

---

# 86. Dashboard chart

La versión v1.0.0 utilizará:

```text
fl_chart
```

para visualización.

Como mínimo deberá existir una gráfica temporal de progreso.

---

# 87. Gráficas

Las gráficas deberán:

- tener título;
- labels suficientes;
- unidades;
- estados vacíos;
- no depender exclusivamente de color.

---

# 88. No analytics inventado

El frontend no recalculará reglas analíticas oficiales para reemplazar resultados del backend.

Ejemplo:

```text
trend
completionRate
checkInFrequency
```

deberán provenir de la API.

---

# 89. Transformaciones permitidas

El frontend sí podrá transformar:

```text
0.3333 → 33.33 %
```

o:

```text
PROGRESSING → Progreso creciente
```

para presentación.

No cambiará semántica.

---

# 90. Goals list

La vista de objetivos mostrará:

```text
title
status
progress
category si existe
targetDate si existe
```

---

# 91. Goal card

Cada objetivo deberá ser fácilmente distinguible.

Una card podrá incluir:

```text
Título
Estado
Progreso
Barra de progreso
```

---

# 92. Goal create

Formulario:

```text
title *
description
category
targetDate
```

No contendrá:

```text
progress
status
```

porque el backend establece:

```text
progress = 0
status = ACTIVE
```

---

# 93. Goal edit

Permitirá:

```text
title
description
category
targetDate
status
```

No permitirá:

```text
progress
```

---

# 94. Goal lifecycle UX

Las acciones deberán utilizar lenguaje explícito:

```text
Pausar objetivo
Reactivar objetivo
Marcar como completado
```

No ocultar cambios de estado detrás de iconos ambiguos.

---

# 95. Confirmaciones Goal

Eliminar un Goal requiere confirmación.

Ejemplo:

> ¿Eliminar este objetivo? También se eliminará su historial de check-ins.

---

# 96. Progress

El progreso se mostrará como:

```text
porcentaje
+
barra de progreso
```

cuando sea apropiado.

---

# 97. Progress no editable en Goal

No existirá slider de progreso dentro de:

```text
Editar objetivo
```

Para cambiar progreso deberá utilizarse:

```text
Registrar check-in
```

---

# 98. Goal Detail

Mostrará:

```text
title
description
category
status
progress
targetDate
trend
lastCheckIn
timeline
```

según datos disponibles.

---

# 99. CheckIn create

Formulario:

```text
Progreso
Dificultad
Cumplimiento
Comentario opcional
```

---

# 100. Progress input

Podrá implementarse mediante:

```text
Slider
+
valor numérico visible
```

Rango:

```text
0..100
```

---

# 101. Difficulty input

Rango:

```text
1..5
```

La interfaz deberá mostrar significado comprensible:

```text
1 Muy baja
2 Baja
3 Media
4 Alta
5 Muy alta
```

---

# 102. Completion input

Opciones:

```text
No cumplido
Parcial
Cumplido
```

correspondientes a:

```text
NOT_MET
PARTIAL
MET
```

---

# 103. CheckIn notes

`notes` podrá mostrarse únicamente al owner.

No deberá aparecer en:

```text
supporter views
AI screens
shared progress
```

---

# 104. CheckIn en Goal no activo

Si Goal:

```text
PAUSED
COMPLETED
```

el botón:

```text
Registrar check-in
```

no deberá habilitarse.

La interfaz deberá explicar el motivo.

Ejemplo:

> Reactiva el objetivo para registrar nuevos check-ins.

---

# 105. Historial CheckIn

Por defecto visual:

```text
más reciente primero
```

La gráfica podrá ordenar cronológicamente:

```text
antiguo → reciente
```

---

# 106. Eliminar CheckIn

La operación requerirá confirmación.

Debe advertir que el progreso actual puede cambiar si se elimina el último registro.

---

# 107. Analytics

La presentación deberá distinguir:

```text
hechos calculados
```

de:

```text
contenido generado por IA
```

---

# 108. Analytics labels

Ejemplos:

```text
Progreso promedio
Frecuencia de seguimiento
Dificultad promedio
Cambio de progreso
Último check-in
```

---

# 109. Datos insuficientes

Cuando:

```text
insufficientHistory = true
```

mostrar:

> Aún no existen suficientes check-ins para identificar una tendencia.

No mostrar una conclusión fuerte.

---

# 110. IA

La IA será presentada como:

```text
Resumen generado por IA
```

Nunca como:

```text
Evaluación
Diagnóstico
Análisis psicológico
```

---

# 111. Disclaimer IA

Toda vista de contenido generado incluirá una advertencia equivalente a:

> Este contenido fue generado mediante inteligencia artificial a partir de tus indicadores de seguimiento. Es informativo y no constituye una evaluación profesional o clínica.

---

# 112. Generar resumen

Solo el owner podrá ver:

```text
Generar resumen
```

La acción llamará:

```text
POST /api/v1/ai/summaries
```

---

# 113. Estado de generación

Mientras se genera:

- deshabilitar botón;
- mostrar loading;
- evitar múltiples submits.

---

# 114. Fallo IA

Si falla:

> No fue posible generar el resumen en este momento. Puedes intentarlo nuevamente.

No mostrar contenido mock.

---

# 115. Resumen COMPLETED

Mostrar:

```text
content
periodStart
periodEnd
createdAt
```

junto con disclaimer.

---

# 116. Resumen FAILED

Puede mostrarse en historial como:

```text
No generado
```

o excluirse de la vista principal según UX.

No debe mostrar contenido inexistente.

---

# 117. Historial IA

La UI permitirá consultar resúmenes anteriores del owner.

Orden:

```text
createdAt DESC
```

---

# 118. Regeneración

El botón:

```text
Generar nuevo resumen
```

creará otro recurso.

No reemplazará visualmente la historia anterior como si nunca hubiera existido.

---

# 119. AI Preview

El endpoint técnico de preview:

```text
/ai/summary/context
```

no tendrá pantalla dentro del producto final.

Podrá utilizarse únicamente para desarrollo/evidencia mientras esté habilitado.

---

# 120. Red de apoyo

La navegación:

```text
Red de apoyo
```

deberá separar conceptualmente:

```text
Mi red
```

de:

```text
Personas a las que apoyo
```

---

# 121. Mi red

Corresponde a relaciones donde:

```text
owner = currentUser
```

El usuario puede:

- agregar;
- consultar;
- modificar permisos;
- cambiar expiración;
- revocar;
- reactivar.

---

# 122. Personas a las que apoyo

Corresponde a:

```text
GET /support-network/supporting
```

El usuario solamente puede:

```text
consultar
```

lo autorizado.

---

# 123. Agregar miembro

El formulario solicitará:

```text
email
permisos
expiresAt opcional
```

---

# 124. Email supporter

No existirá:

```text
buscador global de personas
autocomplete global
directorio público
```

El usuario deberá introducir el email conocido.

---

# 125. Permisos UI

La interfaz deberá representar:

```text
Ver objetivos
Ver progreso
Ver resúmenes IA
```

---

# 126. Dependencia VIEW_PROGRESS

Si el usuario activa:

```text
Ver progreso
```

la UI deberá activar también:

```text
Ver objetivos
```

o impedir una combinación inválida.

---

# 127. Dependencia VIEW_SUMMARIES

Si activa:

```text
Ver resúmenes IA
```

también deberá estar activo:

```text
Ver objetivos
```

---

# 128. Backend sigue validando permisos

La lógica visual anterior mejora UX.

Sin embargo:

```text
backend
```

continúa siendo la autoridad y deberá rechazar combinaciones inválidas.

---

# 129. Relación sin permisos

La UI no permitirá guardar:

```text
false
false
false
```

Deberá indicar:

> Selecciona al menos un permiso.

---

# 130. Expiración

El usuario podrá seleccionar:

```text
Sin fecha de expiración
```

o:

```text
fecha
```

No se requiere selector complejo de duración.

---

# 131. Revocación

La interfaz deberá solicitar confirmación:

> ¿Revocar el acceso de este miembro?

Después de éxito:

```text
estado = revocado
```

debe reflejarse inmediatamente.

---

# 132. Reactivación

Una relación revocada podrá presentar:

```text
Reactivar acceso
```

y solicitar nuevamente:

- permisos;
- expiración.

---

# 133. Estado de relación

La UI distinguirá:

```text
Activa
Expirada
Revocada
```

No únicamente mediante color.

---

# 134. Vista delegada

Cuando un supporter accede a información de otra persona deberá existir contexto visual claro.

Ejemplo:

```text
Información compartida por Ana
```

Esto evita confundir información propia con información delegada.

---

# 135. Navegación delegada

La vista compartida deberá permanecer separada conceptualmente de:

```text
Mis objetivos
```

No mezclar Goals de múltiples propietarios en una sola lista sin contexto.

---

# 136. Owner identity delegada

El frontend solo mostrará información de identidad que el backend haya autorizado para la relación.

No deberá inferir o almacenar datos adicionales.

---

# 137. VIEW_GOALS

La vista podrá mostrar:

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

# 138. VIEW_PROGRESS

Además podrá mostrar:

```text
timeline
progress
difficulty
completion
trend
analytics permitida
```

Nunca:

```text
notes
```

---

# 139. VIEW_SUMMARIES

Mostrará únicamente resúmenes:

```text
COMPLETED
```

compartibles por backend.

No mostrará:

```text
inputSnapshot
provider
model
```

---

# 140. Supporter read-only

En vistas delegadas no deberán existir botones de:

```text
Editar
Eliminar
Registrar check-in
Cambiar estado
Generar IA
Modificar permisos
```

---

# 141. Acceso revocado durante navegación

Si una request delegada devuelve:

```text
404
```

tras haber existido acceso anteriormente, la UI deberá:

- cerrar la vista;
- invalidar estado delegado;
- volver a `Personas a las que apoyo`;
- mostrar mensaje neutral.

Ejemplo:

> Esta información ya no está disponible.

---

# 142. Perfil

La pantalla mostrará:

```text
displayName
email
```

---

# 143. Editar perfil

Solo:

```text
displayName
```

será modificable en v1.0.0.

El email podrá mostrarse como:

```text
solo lectura
```

---

# 144. Logout

Perfil deberá ofrecer:

```text
Cerrar sesión
```

---

# 145. No administración global

No existirán pantallas:

```text
Admin
Usuarios
Roles globales
Moderación
```

---

# 146. Componentes compartidos

Se podrán crear widgets reutilizables como:

```text
AppScaffold
AsyncValueView
EmptyState
ErrorState
MetricCard
GoalCard
TrendBadge
ConfirmationDialog
```

Solo si aparecen en múltiples lugares.

---

# 147. AsyncValue

Riverpod `AsyncValue` o equivalente podrá usarse para representar:

```text
loading
data
error
```

en estado remoto.

---

# 148. Repositories

Cada feature que consume API podrá tener un repository simple.

Ejemplo:

```text
GoalRepository
```

Responsabilidades:

```text
getGoals()
getGoal()
createGoal()
updateGoal()
deleteGoal()
```

---

# 149. Repository en frontend

El repository:

```text
NO
```

representa una abstracción de base de datos.

Representa la frontera entre:

```text
application state
```

y:

```text
remote API
```

---

# 150. API classes

Una feature podrá separar:

```text
GoalApi
```

de:

```text
GoalRepository
```

solo cuando reduzca acoplamiento.

Para features pequeñas ambas responsabilidades podrán integrarse.

---

# 151. No Dio en widgets

Prohibido:

```dart
Dio().get(...)
```

directamente dentro de una pantalla.

La cadena correcta será:

```text
Widget
 ↓
Provider / Notifier
 ↓
Repository
 ↓
ApiClient
```

---

# 152. Mutaciones

Flujo típico:

```text
User action
   ↓
Notifier
   ↓
Repository
   ↓
API
   ↓
success
   ↓
invalidate related providers
```

---

# 153. Invalidación después de Goal

Después de:

```text
create
update
delete
```

invalidar cuando corresponda:

```text
goalList
goalDetail
analyticsOverview
```

---

# 154. Invalidación después de CheckIn

Después de crear/eliminar:

```text
goalDetail
checkInHistory
goalAnalytics
analyticsOverview
```

deberán actualizarse.

---

# 155. Invalidación después de AI

Después de generación:

```text
aiSummaryList
latestSummary
```

---

# 156. Invalidación SupportNetwork

Después de:

```text
create
update
revoke
reactivate
```

actualizar:

```text
ownerRelationships
supportingRelationships
```

cuando corresponda.

---

# 157. Estado stale

No se requiere estrategia avanzada de cache invalidation con timestamps.

La invalidación explícita después de mutaciones es suficiente para v1.0.0.

---

# 158. Seguridad visual

Ocultar un botón:

```text
NO
```

equivale a autorización.

El backend continúa validando todas las operaciones.

---

# 159. IDs

Los UUID podrán existir internamente en rutas/estado.

La interfaz:

```text
NO
```

los mostrará normalmente al usuario.

---

# 160. Fechas

El backend entrega:

```text
UTC ISO 8601
```

Flutter convertirá a:

```text
zona horaria local del dispositivo
```

para presentación.

---

# 161. Fecha relativa

La UI podrá mostrar:

```text
Hace 2 días
```

cuando ayude a lectura.

Cuando exista ambigüedad deberá permitir ver fecha exacta.

---

# 162. TargetDate

Se mostrará en formato local comprensible.

No cambiar la semántica del timestamp enviado por backend.

---

# 163. Testing

El frontend deberá contar con:

```text
unit tests
widget tests
integration tests
```

según criticidad.

---

# 164. Qué priorizar en tests

Prioridad:

```text
auth state
routing guards
repositories
state notifiers
form validation
critical widgets
main user flows
```

---

# 165. Unit tests

Cubrir funciones como:

- parsing;
- formatters relevantes;
- mapping de errores;
- estado de sesión;
- controllers/notifiers con lógica.

---

# 166. Widget tests Auth

Cubrir:

```text
login required fields
invalid email feedback
loading state
error state
successful redirect
```

---

# 167. Widget tests Goal

Cubrir:

```text
create form

progress field absent

status actions

check-in unavailable if PAUSED

check-in unavailable if COMPLETED
```

---

# 168. Widget tests Support

Cubrir:

```text
permission dependency

all permissions false disabled

revoked state

read-only supporter view
```

---

# 169. Widget tests IA

Cubrir:

```text
disclaimer visible

loading generation

FAILED state

COMPLETED content
```

---

# 170. Integration testing

El flujo crítico de app deberá cubrir:

```text
login
↓
dashboard
↓
create Goal
↓
create CheckIn
↓
view Analytics
```

---

# 171. Integration test v1.0.0

Idealmente:

```text
User A login
create Goal
create CheckIns
generate AI

User A creates supporter relation

User B login
views delegated data

User B cannot edit

User A revokes

User B loses access
```

---

# 172. Backend real vs mocks

Widget/unit tests podrán utilizar repositories falsos.

Integration tests de aceptación deberán utilizar:

```text
backend real
```

contra un entorno de pruebas cuando sea viable.

---

# 173. Golden tests

No se requiere una suite completa de golden tests para v1.0.0.

Podrán añadirse para componentes críticos si no incrementan demasiado el costo.

---

# 174. Flutter analyze

Antes de considerar cualquier incremento terminado deberá pasar:

```bash
flutter analyze
```

sin errores.

---

# 175. Flutter test

Deberá pasar:

```bash
flutter test
```

---

# 176. Web build

Deberá pasar:

```bash
flutter build web
```

---

# 177. Android build

Para v1.0.0 deberá producirse al menos un build Android funcional.

Ejemplo:

```bash
flutter build apk
```

o variante elegida para distribución de demostración.

---

# 178. iOS

El código deberá conservar compatibilidad conceptual con iOS.

La ausencia de infraestructura macOS para generar un IPA:

```text
NO
```

implica incumplimiento funcional del diseño multiplataforma.

La publicación iOS no forma parte de v1.0.0.

---

# 179. Web

Web será una plataforma de demostración principal.

Debe funcionar:

- routing;
- refresh;
- responsive;
- API;
- auth;
- gráficos.

---

# 180. URL strategy Web

La estrategia de URLs deberá permitir deployment estable.

Podrá utilizarse:

```text
path URL
```

si el hosting permite rewrite hacia `index.html`.

Si no:

```text
hash routing
```

podrá utilizarse para simplificar hosting.

Esta decisión podrá adaptarse al proveedor de despliegue.

---

# 181. Browser refresh

Una ruta profunda como:

```text
/goals/<id>
```

deberá sobrevivir refresh cuando la configuración de hosting lo permita.

---

# 182. CORS

El frontend solo consumirá el backend configurado.

Problemas CORS:

```text
NO
```

deberán resolverse deshabilitando controles del navegador.

Se configurarán correctamente backend y origen Web.

---

# 183. Secrets

Flutter no almacenará:

```text
DATABASE_URL
JWT_SECRET
AI_API_KEY
LLM secret
```

---

# 184. API Base URL

La URL del backend:

```text
NO
```

se considera un secreto.

Puede formar parte del build.

---

# 185. Configuración build Web

Ejemplo:

```bash
flutter build web \
  --dart-define=API_BASE_URL=https://api.neuroconnect.example/api/v1
```

---

# 186. Configuración build Android

Ejemplo:

```bash
flutter build apk \
  --dart-define=API_BASE_URL=https://api.neuroconnect.example/api/v1
```

---

# 187. Network Android

Android release deberá tener permiso de internet.

El deployment productivo utilizará:

```text
HTTPS
```

---

# 188. Cleartext HTTP

HTTP podrá utilizarse únicamente durante desarrollo local cuando sea necesario.

No será aceptable como configuración de release público.

---

# 189. Logs frontend

Durante desarrollo podrán existir logs técnicos.

No se deberá imprimir:

```text
JWT
password
AI summary privado
CheckIn.notes
datos completos de requests sensibles
```

---

# 190. Debug banner / debug behavior

Los builds utilizados como evidencia final no deberán mostrar información de debugging innecesaria.

---

# 191. Analytics telemetry

NeuroConnect v1.0.0 no integrará:

```text
Google Analytics
Firebase Analytics
Mixpanel
Sentry user tracking
```

por defecto.

No son necesarios para el MVP.

---

# 192. Push notifications

No se implementarán.

---

# 193. Local notifications

No se implementarán.

---

# 194. File upload

No existe flujo de upload de:

```text
imágenes
PDF
audio
video
```

en v1.0.0.

---

# 195. Cámara y micrófono

La app no solicitará permisos para:

```text
camera
microphone
```

---

# 196. Location

La app no solicitará:

```text
ubicación
```

---

# 197. Accessibility permissions

No serán necesarios permisos especiales del sistema.

---

# 198. Gamificación

No existirán:

```text
streaks
ranking
points
badges competitivos
```

---

# 199. Notificaciones punitivas

No mostrar mensajes que intenten culpabilizar al usuario por:

- bajo progreso;
- falta de check-ins;
- inactividad.

---

# 200. Visualización de dificultad

La dificultad no deberá representarse como:

```text
mal / bueno
```

Es un dato autorreportado.

---

# 201. Visualización de progreso decreciente

`DECLINING` deberá mostrarse descriptivamente.

Ejemplo:

```text
Progreso decreciente
```

No:

```text
Mal desempeño
```

---

# 202. Contratos API

Toda modificación incompatible del backend deberá reflejarse en:

- modelos Flutter;
- repositories;
- tests;
- documentación.

El frontend no deberá compensar silenciosamente un contrato backend incorrecto.

---

# 203. API version

El cliente consumirá exclusivamente:

```text
/api/v1
```

durante esta release.

---

# 204. Headers

El cliente podrá enviar:

```text
Accept: application/json
Content-Type: application/json
Authorization: Bearer ...
X-Request-Id: ...
```

cuando corresponda.

---

# 205. Request ID

Si se implementa soporte para `X-Request-Id`, el frontend podrá generar un UUID por request o dejar que backend lo genere.

No es requisito crítico para Avance 1.

---

# 206. Códigos 404

Un 404 en información propia podrá representar:

```text
recurso inexistente
o
recurso no accesible
```

La UI no intentará distinguir ambos casos.

---

# 207. Códigos 409

Los conflictos deberán convertirse en mensajes funcionales.

Ejemplo:

```text
Ya existe una relación de apoyo con esta persona.
```

cuando el backend permita revelar ese contexto al owner.

---

# 208. Códigos 429

Mostrar:

> Se realizaron demasiadas solicitudes. Espera un momento e inténtalo nuevamente.

Especialmente relevante para:

- login;
- IA.

---

# 209. Error 5xx

Mostrar mensaje general recuperable.

No culpar al usuario.

---

# 210. Estados globales de app

La aplicación tendrá al menos:

```text
bootstrap
authenticated
unauthenticated
```

No se requiere un store global para toda la aplicación.

---

# 211. Estado de conectividad

No se implementará un monitor permanente de conectividad.

Los errores de red serán detectados mediante requests.

---

# 212. Background execution

La app no necesita mantener tareas en background.

---

# 213. Lifecycle móvil

Si la aplicación vuelve desde background:

```text
NO
```

será obligatorio recargar toda la aplicación.

Los datos podrán refrescarse en navegación o mediante acciones del usuario.

---

# 214. Pantallas v1.0.0

Como mínimo:

```text
Login
Register

Dashboard

Goals List
Goal Create
Goal Detail
Goal Edit
CheckIn Create
CheckIn History

AI Summaries
AI Summary Detail

Support Network
Create Support Relationship
Edit Support Relationship
Supporting Users
Shared Owner View

Profile
```

---

# 215. Pantallas fuera de alcance

No existirán:

```text
Admin Dashboard
Chat
Notifications
Billing
Plans
Social Feed
Clinical Record
Diagnosis
Video Call
Settings avanzados
```

---

# 216. Diseño del Dashboard

Orden sugerido:

```text
Saludo / contexto

Métricas principales

Objetivos activos

Gráfica de progreso

Resumen IA / CTA

Actividad reciente
```

No es obligatorio mostrar todas las secciones simultáneamente en móvil.

---

# 217. Dashboard sin objetivos

Mostrar:

```text
Aún no tienes objetivos.
```

y CTA:

```text
Crear primer objetivo
```

No mostrar gráficas vacías sin contexto.

---

# 218. Dashboard con datos insuficientes

Mostrar mensaje descriptivo.

Ejemplo:

> Registra más check-ins para comenzar a visualizar tendencias.

---

# 219. Dashboard IA sin summaries

Mostrar CTA:

```text
Generar resumen
```

cuando exista información suficiente.

Si no existe información útil deberá explicarse.

---

# 220. Minimum data for IA

El frontend no definirá una regla distinta a backend para determinar si puede generarse.

La API será autoridad.

---

# 221. Botones destructivos

Acciones como:

```text
Eliminar objetivo
Eliminar check-in
Revocar acceso
```

deberán distinguirse visualmente como destructivas.

---

# 222. Confirm dialogs

No abusar de confirmaciones para acciones reversibles pequeñas.

Sí utilizarlas para:

- delete;
- revoke;
- operaciones con pérdida de información.

---

# 223. SnackBars

Podrán utilizarse para confirmaciones breves.

Ejemplo:

```text
Objetivo creado.
Check-in registrado.
Acceso revocado.
```

---

# 224. SnackBars de error

No serán el único mecanismo para errores que requieran acción del usuario.

Errores de formulario deberán aparecer cerca del contenido relevante.

---

# 225. Feedback de IA

Después de generar:

```text
Resumen generado.
```

y navegar/actualizar la vista.

---

# 226. Estado de botones

Estados:

```text
enabled
disabled
loading
```

deben ser visualmente distinguibles.

---

# 227. Duplicación de navegación

No crear múltiples caminos diferentes que realicen exactamente la misma tarea sin motivo.

---

# 228. Deep links internos

No son requisito funcional prioritario.

Las rutas deberán ser navegables de forma estable.

---

# 229. Browser title

Web podrá actualizar títulos de página para rutas principales.

Ejemplo:

```text
Dashboard | NeuroConnect
Objetivos | NeuroConnect
```

Funcionalidad recomendable, no bloqueante para Avance 1.

---

# 230. Branding

La v1.0.0 utilizará el nombre:

```text
NeuroConnect
```

No se diseñará un sistema de marca extenso.

---

# 231. Logo

Puede utilizarse un logo simple si ya existe.

La falta de logo definitivo:

```text
NO
```

debe bloquear desarrollo.

---

# 232. Iconografía

Se preferirán:

```text
Material Icons
```

para evitar dependencias visuales innecesarias.

---

# 233. Dependencias visuales

No incorporar:

- múltiples paquetes de iconos;
- frameworks CSS externos;
- animaciones de terceros;

sin necesidad.

---

# 234. Performance

La versión v1.0.0 deberá evitar problemas obvios de rendimiento.

No se requiere microoptimización.

---

# 235. Listas

Utilizar widgets lazy:

```text
ListView.builder
```

o equivalentes para historiales/listas extensas.

---

# 236. Rebuilds

Riverpod deberá utilizarse razonablemente para evitar reconstruir toda la app ante cualquier cambio.

No se requiere profiling exhaustivo.

---

# 237. Imágenes

El producto no depende de imágenes pesadas.

Esto reduce requerimientos de caching multimedia.

---

# 238. Gráficas

No recrear series innecesariamente en cada frame.

Transformar datos al construir el estado cuando sea razonable.

---

# 239. Platform checks

Se evitarán bloques:

```dart
if (Platform.isAndroid) ...
```

distribuidos por toda la app.

Las diferencias de plataforma deberán centralizarse cuando existan.

---

# 240. Web compatibility

No importar directamente APIs de:

```text
dart:io
```

en código compartido que deba compilar para Web.

---

# 241. Abstracciones específicas de plataforma

Ejemplo:

```text
AuthTokenStore
```

podrá tener:

```text
MobileAuthTokenStore
WebAuthTokenStore
```

si es necesario.

---

# 242. iOS compatibility

No incorporar dependencias exclusivamente Android cuando exista una alternativa multiplataforma razonable.

---

# 243. Semantic Versioning

La aplicación cliente seguirá:

```text
1.0.0
```

para la release académica final.

Antes podrán utilizarse:

```text
0.1.0
0.2.0
...
```

---

# 244. Build metadata

Flutter podrá utilizar:

```text
version: 1.0.0+1
```

en `pubspec.yaml` para el release.

---

# 245. DoD frontend MVP-0

Debe existir:

```text
register
login
restore session
logout
goals
goal detail
create goal
edit goal
check-in
history
```

con backend real.

---

# 246. DoD frontend MVP-1

Debe existir:

```text
dashboard
analytics overview
goal analytics
progress chart
trend presentation
empty states
insufficient history states
```

---

# 247. DoD frontend MVP-2

Debe existir:

```text
generate AI summary
loading
success
failure
history
detail
disclaimer
```

con proveedor real en backend.

---

# 248. DoD frontend MVP-3

Debe existir:

```text
create relationship
permissions
expiration
revoke
reactivate
supporting list
delegated read-only views
```

---

# 249. DoD frontend MVP-4

Debe existir:

```text
responsive pass
accessibility pass
error-state pass
testing
Web build
Android build
deployment configuration
documentation
```

---

# 250. Definition of Done v1.0.0

La aplicación cliente se considera completa cuando:

```text
MVP-0 = completo
MVP-1 = completo
MVP-2 = completo
MVP-3 = completo
MVP-4 = completo
```

y puede completar el escenario E2E definido por ADR-002.

---

# 251. Flujo E2E owner

```text
Launch
  ↓
Register / Login
  ↓
Dashboard
  ↓
Create Goal
  ↓
Goal Detail
  ↓
Create CheckIn
  ↓
History
  ↓
Analytics
  ↓
Generate AI Summary
  ↓
View AI Summary
  ↓
Create SupportRelationship
  ↓
Grant Permissions
```

---

# 252. Flujo E2E supporter

```text
Login
  ↓
Red de apoyo
  ↓
Personas a las que apoyo
  ↓
Seleccionar owner
  ↓
Ver Goals autorizados
  ↓
Ver Progress si permitido
  ↓
Ver Summaries si permitido
```

---

# 253. Flujo de revocación

```text
Owner revokes
       ↓
Backend persists revokedAt
       ↓
Supporter requests shared resource
       ↓
404
       ↓
Frontend closes shared view
       ↓
Información ya no disponible
```

---

# 254. Reglas inmutables para Codex

Codex no podrá reinterpretar:

```text
Flutter como cliente oficial

una sola base de código

Material 3

Riverpod como state management

go_router para navegación

Dio para HTTP

feature-first

sin Clean Architecture ceremonial

frontend no es autoridad de negocio

backend valida todo

/api/v1

JWT Bearer

token detrás de AuthTokenStore

logout limpia estado privado

Goal.progress no se edita directamente

CheckIn solo para Goal ACTIVE

notes owner-only

analytics proviene de backend

IA se distingue visualmente de métricas

disclaimer IA obligatorio

supporter read-only

vistas delegadas separadas de datos propios

VIEW_PROGRESS requiere VIEW_GOALS

VIEW_SUMMARIES requiere VIEW_GOALS

red de apoyo sin buscador global

Web + Android como aceptación mínima

iOS compatible

sin offline-first

sin DB local

sin gamificación competitiva

sin lenguaje clínico

sin lenguaje culpabilizante
```

---

# 255. Dependencias prohibidas sin revisión

No incorporar por iniciativa propia:

```text
Bloc

Redux

GetX

Firebase como backend paralelo

Supabase como backend paralelo

Hive

Isar

SQLite

Drift

GraphQL client

WebSocket client

vector database client

analytics/tracking SDK

push notification SDK
```

si no existe una decisión que lo justifique.

---

# 256. Decisiones diferidas

Este ADR no decide:

- branding definitivo;
- logo definitivo;
- internacionalización completa;
- modo oscuro obligatorio;
- preferencias visuales avanzadas;
- offline mode;
- sincronización offline;
- biometría;
- refresh tokens;
- push notifications;
- deep linking externo;
- app store release;
- Play Store release;
- analytics telemetry;
- crash reporting externo;
- feature flags remotos;
- configuración dinámica remota.

Si alguna se incorpora deberá evaluarse separadamente.

---

# 257. Riesgo 1 — Sobrediseño del frontend

Mitigación:

```text
feature-first
+
Riverpod
+
repository simple
+
sin capas ceremoniales
```

---

# 258. Riesgo 2 — Reglas de negocio duplicadas

Mitigación:

```text
backend = autoridad
```

El frontend solo implementa:

- validación para UX;
- representación;
- restricciones visuales.

---

# 259. Riesgo 3 — Estado desactualizado

Mitigación:

```text
invalidación explícita de providers
```

después de mutaciones.

---

# 260. Riesgo 4 — Exposición de JWT

Mitigación:

```text
AuthTokenStore
```

con almacenamiento seguro en móvil y alcance de sesión en Web.

---

# 261. Riesgo 5 — Confusión owner/supporter

Mitigación:

- navegación separada;
- encabezado de contexto;
- acciones write ocultas;
- rutas distintas.

---

# 262. Riesgo 6 — Interpretar IA como diagnóstico

Mitigación:

- label `Resumen generado por IA`;
- disclaimer;
- separación visual;
- lenguaje neutral;
- no notas;
- métricas mostradas independientemente.

---

# 263. Riesgo 7 — Sobrecarga visual

Mitigación:

- Material 3;
- jerarquía;
- espacio;
- pocas métricas prioritarias;
- una gráfica principal;
- disclosure progresivo.

---

# 264. Riesgo 8 — Divergencia Web/Mobile

Mitigación:

```text
responsive widgets
+
misma lógica
+
mínimo código condicional por plataforma
```

---

# 265. Consecuencias positivas

La decisión permite:

- una sola aplicación;
- Web + Android + iOS;
- desarrollo rápido;
- arquitectura comprensible;
- pruebas de estado;
- navegación declarativa;
- integración sencilla con REST;
- UI responsive;
- bajo número de dependencias;
- buena separación entre owner y supporter;
- trazabilidad entre frontend y ADR-003.

---

# 266. Consecuencias negativas

La decisión implica:

- dependencia de Flutter;
- Riverpod como paradigma específico;
- sesión Web almacenada en entorno menos seguro que móvil;
- ausencia de modo offline;
- necesidad de manejar responsive manualmente;
- UI dependiente de disponibilidad de backend.

Estas limitaciones son aceptables para el MVP académico v1.0.0.

---

# 267. Política de modificación

Cambios sobre:

```text
framework cliente
state management
navigation
HTTP client
session storage
feature structure
responsive strategy
owner/supporter UX
AI presentation
accessibility baseline
```

requieren revisión de este ADR o creación de un nuevo ADR.

---

# 268. Estado

```text
ACEPTADA PARA IMPLEMENTACIÓN
```

---

# 269. Resumen arquitectónico

```text
                    ┌───────────────────────────┐
                    │        Flutter App        │
                    │                           │
                    │   Material 3              │
                    │   go_router               │
                    │   Riverpod                │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Feature State        │
                    │                           │
                    │ Auth                      │
                    │ Goals                     │
                    │ CheckIns                  │
                    │ Dashboard                 │
                    │ AI                        │
                    │ SupportNetwork            │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │       Repositories        │
                    │                           │
                    │     ApiClient / Dio       │
                    └─────────────┬─────────────┘
                                  │
                           HTTPS / JSON
                                  │
                                  ▼
                      ┌────────────────────┐
                      │ NestJS /api/v1     │
                      └────────────────────┘
```

---

# 270. Resumen de navegación

```text
Unauthenticated
│
├── Login
└── Register

Authenticated
│
├── Dashboard
│
├── Objetivos
│   ├── Crear
│   ├── Detalle
│   ├── Editar
│   ├── Historial
│   └── Check-in
│
├── Red de apoyo
│   ├── Mi red
│   │   ├── Agregar
│   │   ├── Permisos
│   │   ├── Revocar
│   │   └── Reactivar
│   │
│   └── Personas a las que apoyo
│       └── Vista compartida read-only
│
├── Resúmenes IA
│   ├── Generar
│   ├── Historial
│   └── Detalle
│
└── Perfil
    ├── displayName
    ├── email
    └── Logout
```

---

# 271. Resumen del flujo de estado

```text
UI
 ↓
Notifier / Provider
 ↓
Repository
 ↓
ApiClient
 ↓
NestJS
 ↓
Response
 ↓
Repository
 ↓
Provider state
 ↓
UI
```

---

# 272. Resumen de seguridad cliente

```text
JWT
 ↓
AuthTokenStore

Mobile
 ↓
secure platform storage

Web
 ↓
session-scoped storage

API
 ↓
Bearer token

401
 ↓
clear session
 ↓
login
```

---

# 273. Resumen UX

```text
claridad
+
predictibilidad
+
baja sobrecarga
+
lenguaje neutral
+
control del usuario
+
responsive design
+
accesibilidad básica
```

---

# 274. Filosofía del frontend v1.0.0

> **El frontend presenta y organiza la experiencia, pero no decide el dominio: Flutter muestra los datos y acciones disponibles, Riverpod coordina el estado, el backend conserva la autoridad sobre reglas y permisos, y la interfaz diferencia explícitamente los hechos calculados de las explicaciones generadas por inteligencia artificial.**
