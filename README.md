
# NeuroConnect

> Plataforma Inteligente para el Seguimiento de Objetivos y Gestión de Redes de Apoyo en Personas Neurodivergentes.

[![Status](https://img.shields.io/badge/status-en%20desarrollo-orange)](#estado-del-proyecto)
[![Target](https://img.shields.io/badge/target-v1.0.0-blue)](#roadmap-v100)
[![Architecture](https://img.shields.io/badge/backend-NestJS-red)](#stack-tecnológico)
[![Frontend](https://img.shields.io/badge/frontend-Flutter-blue)](#stack-tecnológico)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791)](#stack-tecnológico)

---

## Estado del proyecto

**NeuroConnect se encuentra actualmente en desarrollo.**

La versión objetivo del semestre es:

```text
v1.0.0
```

La v1.0.0 corresponde al MVP académico completo definido para la asignatura:

```text
Inteligencia Artificial (G)
Instituto Tecnológico de Tijuana
Periodo Agosto–Diciembre 2026
```

El desarrollo está organizado incrementalmente mediante:

```text
MVP-0 — Núcleo
MVP-1 — Analítica
MVP-2 — Inteligencia Artificial
MVP-3 — Red de apoyo
MVP-4 — Cierre y hardening
```

La fecha objetivo de finalización es:

```text
Primera semana de diciembre de 2026
```

> El estado de una funcionalidad no debe inferirse únicamente por aparecer documentada en este README.  
> La implementación real y su nivel de avance deberán consultarse en el código, pruebas y documentación de planificación.

---

# Descripción

NeuroConnect es un sistema multiplataforma orientado al seguimiento de objetivos personales y a la gestión controlada de redes de apoyo para personas neurodivergentes.

El sistema busca permitir que una persona pueda:

- crear objetivos;
- registrar check-ins periódicos;
- conservar un historial de progreso;
- consultar indicadores y tendencias;
- visualizar su seguimiento mediante un dashboard;
- generar resúmenes mediante inteligencia artificial;
- incorporar integrantes a una red de apoyo;
- decidir qué información comparte;
- establecer permisos;
- establecer una fecha de expiración del acceso;
- revocar posteriormente dicho acceso.

El flujo funcional objetivo de v1.0.0 es:

```text
Registro
   ↓
Inicio de sesión
   ↓
Objetivos
   ↓
Check-ins
   ↓
Historial
   ↓
Analítica
   ↓
Dashboard
   ↓
Resumen mediante IA
   ↓
Red de apoyo
   ↓
Permisos
   ↓
Consulta autorizada
   ↓
Revocación
```

---

# Propósito académico

NeuroConnect se desarrolla como:

```text
MVP académico
```

y no como producto clínico o comercial terminado.

El proyecto busca demostrar de forma integrada:

- desarrollo de software;
- diseño de dominio;
- persistencia relacional;
- desarrollo multiplataforma;
- analítica descriptiva;
- minería de datos básica;
- inteligencia artificial generativa;
- autorización;
- privacidad;
- DevOps;
- despliegue público;
- validación mediante pruebas.

---

# Alcance de v1.0.0

La versión v1.0.0 deberá incluir:

## Núcleo

- registro;
- autenticación;
- perfil;
- objetivos;
- check-ins;
- historial;
- ownership de información.

## Analítica

- indicadores descriptivos;
- progreso promedio;
- frecuencia de seguimiento;
- tasa de cumplimiento;
- variación de progreso;
- dificultad promedio;
- inactividad;
- clasificación de tendencias;
- dashboard;
- visualización temporal.

## Inteligencia Artificial

- construcción de contexto estructurado;
- integración mediante `AiProvider`;
- selección evaluada de un modelo generativo;
- generación de resúmenes;
- recomendaciones generales;
- persistencia de `AISummary`;
- historial de resúmenes;
- trazabilidad del contexto utilizado.

## Red de apoyo

- relaciones entre usuarios;
- permisos de lectura;
- expiración;
- revocación;
- reactivación;
- consultas delegadas;
- aislamiento de información.

## Cierre técnico

- pruebas;
- seguridad básica;
- UX;
- accesibilidad básica;
- Docker;
- CI;
- deployment público;
- HTTPS;
- monitoreo;
- backup y restore;
- documentación.

---

# Fuera de alcance de v1.0.0

NeuroConnect v1.0.0 no pretende implementar:

- diagnóstico psicológico;
- diagnóstico psiquiátrico;
- diagnóstico médico;
- recomendaciones clínicas;
- tratamiento;
- expedientes clínicos;
- detección automática de trastornos;
- reconocimiento de emociones;
- análisis facial;
- análisis de voz;
- wearables;
- chat;
- red social;
- videollamadas;
- sistema de emergencias;
- notificaciones push;
- RAG;
- agentes autónomos;
- fine-tuning;
- entrenamiento de modelos propios;
- vector databases;
- microservicios;
- Kubernetes;
- funcionamiento offline-first;
- publicación obligatoria en App Store o Play Store.

Las capacidades anteriores podrán evaluarse exclusivamente como trabajo futuro.

---

# Principio fundamental de IA

La inteligencia artificial no constituye la fuente autoritativa de análisis.

El pipeline de NeuroConnect es:

```text
Datos del usuario
       ↓
Analytics determinístico
       ↓
Indicadores estructurados
       ↓
SummaryContext
       ↓
Modelo generativo
       ↓
Explicación
```

Nunca:

```text
Datos
  ↓
LLM
  ↓
Métricas oficiales
```

Los indicadores y tendencias son calculados por el sistema.

La IA únicamente transforma resultados estructurados en lenguaje comprensible.

---

# Delimitación de IA

El modelo generativo podrá:

- resumir resultados;
- describir tendencias;
- identificar seguimiento reciente o ausencia de este;
- generar recomendaciones generales de organización y seguimiento.

No podrá:

- diagnosticar;
- inferir condiciones clínicas;
- inferir emociones no registradas;
- recomendar medicamentos;
- recomendar tratamientos;
- modificar información;
- ejecutar acciones sobre la cuenta;
- consultar directamente la base de datos.

La elección definitiva del proveedor y modelo para v1.0.0 permanece sujeta al proceso de evaluación definido en:

```text
docs/ADRS/ADR-005-INTEGRACION-IA-V1.md
```

---

# Privacidad

NeuroConnect sigue el principio:

```text
private by default
```

La información de una persona no estará disponible para otro usuario salvo que exista una relación de apoyo válida y permisos explícitos.

Los permisos iniciales son:

```text
VIEW_GOALS
VIEW_PROGRESS
VIEW_SUMMARIES
```

El propietario podrá controlar:

```text
qué información
+
con quién
+
durante cuánto tiempo
```

se comparte.

El acceso podrá:

```text
expirar
```

o ser:

```text
revocado
```

por el propietario.

---

# Datos enviados a IA

La integración con el proveedor de IA utilizará minimización de datos.

Podrán enviarse indicadores como:

```text
progress
trend
averageDifficulty
daysSinceLastCheckIn
completionRate
checkInFrequencyPerWeek
```

cuando sean necesarios.

No deberán enviarse:

```text
password
passwordHash
JWT
email
CheckIn.notes
SupportRelationship
permissions
API keys
DATABASE_URL
información innecesaria de identidad
```

---

# Arquitectura

NeuroConnect utiliza una arquitectura cliente-servidor basada en un monolito modular.

```text
┌───────────────────────────────────────┐
│             Flutter App               │
│                                       │
│ Web        Android        iOS         │
│                                       │
│ Material 3                            │
│ Riverpod                              │
│ go_router                             │
│ Dio                                   │
└──────────────────┬────────────────────┘
                   │
                   │ HTTPS
                   │ REST / JSON
                   ▼
┌───────────────────────────────────────┐
│             NestJS API                │
│              /api/v1                  │
│                                       │
│ AuthModule                            │
│ UsersModule                           │
│ GoalsModule                           │
│ CheckInsModule                        │
│ AnalyticsModule                       │
│ AiModule                              │
│ SupportNetworkModule                  │
└───────────────┬─────────────┬─────────┘
                │             │
                │ Prisma      │ HTTPS
                ▼             ▼
       ┌──────────────┐   ┌───────────────┐
       │ PostgreSQL   │   │ LLM Provider  │
       │     16       │   │   Model TBD   │
       └──────────────┘   └───────────────┘
```

---

# Principios arquitectónicos

La v1.0.0 mantiene las siguientes reglas:

```text
Flutter = experiencia cliente

NestJS = autoridad de negocio

PostgreSQL = fuente persistente de verdad

Analytics = resultados determinísticos

LLM = explicación generativa

SupportRelationship = autorización delegada
```

No existen conexiones directas:

```text
Flutter → PostgreSQL

Flutter → LLM Provider

LLM Provider → PostgreSQL
```

Todo acceso pasa por:

```text
Flutter
   ↓
NestJS
```

---

# Stack tecnológico

## Frontend

```text
Flutter
Dart
Material 3
Riverpod
go_router
Dio
fl_chart
```

Objetivos:

```text
Web
Android
iOS compatible
```

La aceptación académica mínima de v1.0.0 requiere:

```text
Web funcional
+
Android demostrable
```

---

## Backend

```text
NestJS
TypeScript
Prisma
JWT
Argon2id
class-validator
Swagger / OpenAPI
Jest
```

Arquitectura:

```text
Modular Monolith
```

API:

```text
/api/v1
```

---

## Persistencia

```text
PostgreSQL 16
+
Prisma ORM
```

Entidades principales:

```text
User

Goal

CheckIn

AISummary

SupportRelationship
```

---

## DevOps

```text
Docker
Docker Compose
Git
GitHub
GitHub Actions
```

Deployment objetivo mediante infraestructura gratuita.

Opciones aprobadas incluyen:

```text
Flutter Web
→ static hosting gratuito

NestJS
→ Docker sobre host Linux gratuito
o PaaS gratuito compatible

PostgreSQL
→ managed PostgreSQL free tier
```

---

# Estructura del monorepo

La estructura objetivo es:

```text
neuro-connect/
│
├── app/
│   ├── lib/
│   ├── test/
│   ├── integration_test/
│   ├── web/
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   └── README.md
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── goals/
│   │   ├── check-ins/
│   │   ├── analytics/
│   │   ├── ai/
│   │   ├── support-network/
│   │   ├── common/
│   │   ├── config/
│   │   └── prisma/
│   │
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── ADRS/
│   ├── Planeacion/
│   ├── ai/
│   ├── evidence/
│   └── operations/
│
├── infra/
│   ├── compose/
│   └── proxy/
│
├── .github/
│   └── workflows/
│
├── compose.yaml
├── .gitignore
└── README.md
```

Algunas carpetas serán creadas progresivamente conforme avance la implementación.

---

# Documentación

La documentación constituye parte de la baseline del proyecto.

Actualmente se encuentra organizada en:

```text
docs/
│
├── ADRS/
│   ├── ADR-001 — Esquema relacional y modelo de datos de NeuroConnect.md
│   ├── ADR-002-DOMINIO-Y-DISENO-V1.md
│   ├── ADR-003-BACKEND-V1.md
│   ├── ADR-004-FRONTEND-V1.md
│   ├── ADR-005-INTEGRACION-IA-V1.md
│   ├── ADR-006-ARQUITECTURA-SISTEMA-V1.md
│   ├── ADR-007-DEVOPS-INFRAESTRUCTURA-V1.md
│   └── Anteproyecto_NeuroConnect_IA_G_Carlos_Armenta.pdf
│
└── Planeacion/
    ├── PLAN_IMPLEMENTACION_AVANCE_1.md
    └── ROADMAP_V1.md
```

---

# ADRs

## ADR-001 — Persistencia y modelo de datos

Define:

- PostgreSQL;
- Prisma;
- entidades;
- relaciones;
- constraints;
- ownership;
- snapshots;
- persistencia de IA.

---

## ADR-002 — Dominio y diseño

Define:

- actores;
- comportamiento;
- reglas de negocio;
- objetivos;
- check-ins;
- analítica;
- red de apoyo;
- privacidad;
- delimitaciones.

---

## ADR-003 — Backend

Define:

- NestJS;
- módulos;
- API REST;
- autenticación;
- autorización;
- DTO;
- errores;
- transacciones;
- testing backend.

---

## ADR-004 — Frontend

Define:

- Flutter;
- arquitectura feature-first;
- Riverpod;
- go_router;
- Dio;
- Material 3;
- navegación;
- UX;
- responsive design;
- accesibilidad.

---

## ADR-005 — Integración IA

Define:

- `SummaryContextBuilder`;
- `PromptBuilder`;
- `AiProvider`;
- restricciones;
- privacidad;
- benchmark;
- proceso de selección del modelo.

El proveedor/modelo final todavía deberá seleccionarse mediante evaluación durante MVP-2.

---

## ADR-006 — Arquitectura del sistema

Integra:

```text
Flutter
+
NestJS
+
PostgreSQL
+
Analytics
+
IA
+
SupportNetwork
```

en la arquitectura integral de v1.0.0.

---

## ADR-007 — DevOps e infraestructura

Define:

- Docker;
- Docker Compose;
- CI;
- deployment;
- HTTPS;
- monitoreo;
- logs;
- backups;
- recovery;
- operación;
- costo de infraestructura igual a cero.

---

# Planeación

## Roadmap general

Consultar:

```text
docs/Planeacion/ROADMAP_V1.md
```

Define el camino completo:

```text
Foundation
   ↓
MVP-0
   ↓
MVP-1
   ↓
MVP-2
   ↓
MVP-3
   ↓
MVP-4
   ↓
Release Candidate
   ↓
v1.0.0
```

---

## Avance 1

Consultar:

```text
docs/Planeacion/PLAN_IMPLEMENTACION_AVANCE_1.md
```

Meta técnica:

```text
MVP-0
100 %

MVP-1
100 %

MVP-2
20–30 %
```

La implementación real deberá validarse antes de declarar estos porcentajes alcanzados.

---

# Roadmap v1.0.0

## MVP-0 — Núcleo

```text
Auth
Users
Goals
CheckIns
Persistence
History
```

Criterio principal:

```text
register
→ login
→ create goal
→ create check-in
→ history
```

---

## MVP-1 — Analítica

```text
Analytics
Dashboard
Trends
Charts
```

Criterio principal:

```text
CheckIns
→ deterministic analytics
→ dashboard
```

---

## MVP-2 — Inteligencia Artificial

```text
SummaryContextBuilder
PromptBuilder
AiProvider
Model Evaluation
Real LLM
AISummary
```

Criterio principal:

```text
Analytics
→ structured context
→ real model
→ persisted summary
```

---

## MVP-3 — Red de apoyo

```text
SupportRelationship
Permissions
Expiration
Revocation
Delegated Views
```

Criterio principal:

```text
Owner grants access
→ Supporter reads allowed data
→ Owner revokes
→ Access disappears
```

---

## MVP-4 — Cierre

```text
Testing
UX
Accessibility
Security
DevOps
Deployment
Monitoring
Backup
Restore
Documentation
```

Criterio principal:

```text
release demostrable
de extremo a extremo
```

---

# Cronograma académico

| Periodo | Actividad |
|---|---|
| 25 sep – 4 oct | Anteproyecto, investigación, arquitectura y modelo conceptual |
| 5 – 18 oct | Backend base, autenticación, usuarios, objetivos, check-ins y base de datos |
| 19 oct – 1 nov | Cliente Flutter, autenticación, objetivos, check-ins e historial |
| 2 – 8 nov | Analítica, indicadores, tendencias y dashboard |
| 9 – 15 nov | IA generativa, prompts, resúmenes y validación |
| 16 – 22 nov | Red de apoyo, permisos, expiración y revocación |
| 23 – 29 nov | Pruebas, UX, seguridad y deployment |
| 30 nov – 6 dic | Release final, evidencias, documento y presentación |

El roadmap técnico puede adelantar trabajo respecto a estas ventanas, pero no altera los compromisos académicos del anteproyecto.

---

# Requisitos de desarrollo

## Backend

Se requiere:

```text
Node.js LTS
npm
Docker
Docker Compose
```

---

## Frontend

Se requiere:

```text
Flutter SDK
Dart
Android SDK
```

Para Web:

```text
Chrome
```

o navegador compatible con Flutter Web.

---

## Base de datos

Desarrollo utiliza:

```text
PostgreSQL 16
```

preferentemente mediante Docker Compose.

---

# Desarrollo local

MVP-0 ofrece autenticación, perfil, objetivos, lifecycle, check-ins e historial. MVP-1 añade Analytics determinístico, seguimiento, tendencias y gráficas. Avance 1 inicia MVP-2 con contexto/prompt técnico y mock de desarrollo, sin proveedor generativo real. MVP-1.5 incorpora ADR-008: cancelación persistente, invalidación de check-ins, auditoría privada y red de apoyo con permisos de lectura, expiración y revocación/reactivación. Versiones verificadas: Node 22.16.0, Flutter 3.47.5 / Dart 3.13.4, PostgreSQL 16.

## Local con Docker

Clona el repositorio y copia `.env.example` a `.env`. Configura `POSTGRES_PASSWORD`, `JWT_SECRET` (al menos 32 caracteres aleatorios) y, si usarás el seed, `SEED_PASSWORD` (al menos 12 caracteres). Conserva estos archivos fuera de Git. Si ya existe un entorno, conserva sus credenciales y agrega únicamente las claves nuevas del ejemplo.

Con Docker Engine y Compose disponibles, desde la raíz:

```sh
docker compose up -d --build --wait
```

Este comando construye frontend y backend, inicia PostgreSQL, aplica migrations y espera los healthchecks en orden. No requiere Node ni Flutter instalados en el host. La primera compilación descarga el SDK Flutter y dependencias; posteriores builds reutilizan la caché.

- Frontend: http://localhost:5173
- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/docs
- Readiness: http://localhost:3000/api/v1/health/ready
- PostgreSQL: loopback, puerto 5434 y volumen persistente.

Seed opcional, desde raíz:

```sh
docker compose exec backend node seed-dist/seed.js
```

El seed crea el owner `demo@neuroconnect.local`, `supporter@neuroconnect.local` (objetivos y progreso) y `supporter-goals@neuroconnect.local` (solo objetivos), cinco objetivos y veinticinco check-ins. Conserva los patrones creciente, estable e inactivo y agrega un objetivo completado y otro cancelado. Las tres cuentas utilizan `SEED_PASSWORD` local; nunca se imprime. Reejecutarlo conserva registros, estados, permisos y auditoría existentes; no reinicia cambios del usuario. Para repetir el escenario original utiliza una base de prueba nueva, sin borrar el volumen de desarrollo.

Smoke técnico completo, también sin Node/Flutter locales:

```sh
docker compose exec backend node scripts/smoke.cjs
```

Crea dos cuentas sintéticas, valida Auth/Goals/CheckIns/Analytics/AI Preview, permisos Owner/Supporter, cancelación, void, expiración, revocación/reactivación y auditoría. Limpia únicamente sus fixtures mediante Prisma interno; las APIs públicas no borran dominio. Es development-only y rechaza NODE_ENV=production antes de acceder a la base. El dashboard y la gráfica se validan desde el navegador.

En Swagger autoriza un JWT obtenido con `/auth/login` y prueba `GET /api/v1/ai/summary/context`. Devuelve `{context,prompt,providerConfigured:false}`: datos propios minimizados y prompt SYSTEM/USER, sin llamar al mock/proveedor ni persistir AISummary. `AI_PREVIEW_ENABLED` controla el endpoint (false responde404 con sesión válida); Compose local lo habilita por defecto, la plantilla productiva lo deshabilita. Solo está soportado `AI_PROVIDER=mock`; no requiere AI_API_KEY ni selecciona modelo. El mock interno se identifica como **Development mock only** y no tiene endpoint público de generación ni pantalla Flutter. El modelo AISummary existe como scaffold requerido por PLAN §7.4, con FK/índices/periodo, para completar MVP-2 posteriormente.

`API_BASE_URL` se incorpora al **build** del frontend. Su valor local predeterminado es `http://localhost:3000/api/v1`, accesible desde el navegador. Cambiarlo requiere reconstruir la imagen. No uses el hostname interno `backend`. Si cambias frontend host/puerto, actualiza también `CORS_ORIGINS` y `FRONTEND_PORT`. CORS permite por defecto localhost y 127.0.0.1:5173.

```sh
docker compose ps
docker compose logs backend
docker compose stop
```

Detener conserva el volumen. No elimines el volumen para validar un entorno existente.

## Desarrollo directo (opcional)

Para un entorno nuevo, `node infra/setup-local.cjs` genera `.env` y `backend/.env` con credenciales locales aleatorias y no sobrescribe archivos existentes. También puedes configurar manualmente ambos ejemplos. El backend directo usa `DATABASE_URL` apuntando al puerto PostgreSQL del host; Compose lo configura mediante el DNS interno.

```sh
docker compose up -d --wait postgres
cd backend
npm ci
npm run prisma:generate
npm run migrate:deploy
npm run seed
npm run start:dev
```

En otra terminal:

```sh
cd app
flutter pub get --enforce-lockfile
flutter run -d chrome --web-port=5173 --dart-define=API_BASE_URL=http://localhost:3000/api/v1
```

Utiliza backend/Flutter directos o sus contenedores a la vez para evitar conflictos de puertos. También puede usarse `-d web-server --web-hostname=127.0.0.1`.

## Validación

Con Node y Flutter para desarrollo, desde raíz:

```sh
node infra/setup-test.cjs
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
npm run smoke
cd ../app
flutter analyze
flutter test
flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1
cd ..
docker build -t neuroconnect-backend:local ./backend
docker build -t neuroconnect-frontend:local ./app
```

E2E utiliza PostgreSQL real y una base separada cuyo nombre termina en `_test`. `setup-test.cjs` prepara esa base. El smoke requiere backend escuchando en 3000 y `backend/.env` configurado; verifica MVP-0 y Analytics con dos cuentas sintéticas y elimina únicamente sus datos. No imprime tokens ni contraseñas. Para verificar tendencias, estados históricos y métricas del seed: desde `backend`, `npm run smoke:seed` después de ejecutar el seed. `npm run smoke:migrations` aplica la cadena completa y seed dos veces en una DB temporal nueva con sufijo `_test`, valida que no se dupliquen eventos y limpia solo esa DB. Requiere `TEST_DATABASE_URL` y `SEED_PASSWORD` locales.

## Artefactos productivos

`backend/Dockerfile` produce NestJS/Prisma sin devDependencies y ejecuta como usuario node. `app/Dockerfile` compila Flutter Web y sirve assets mediante Nginx sin root, con fallback SPA y healthcheck. Los artefactos son independientes.

En producción, PostgreSQL es externo y se localiza exclusivamente mediante `DATABASE_URL`. El ejemplo `infra/compose/compose.prod.example.yml` contiene frontend/backend y ninguna base de datos; utiliza secretos del entorno y `API_BASE_URL` HTTPS pública al compilar. Es una plantilla operativa, no un deployment ejecutado. TLS, hosting público y hardening corresponden a bloques posteriores.

Android e iOS conservan los proyectos existentes; este bloque valida Web. Para dispositivos usa una API HTTPS accesible. MVP-1.5: desde Perfil abre **Mi red de apoyo**, **Personas a las que apoyo** o **Historial de actividad**. Comparte por correo exacto de una cuenta existente; las notas siempre son privadas. Los objetivos cancelados permanecen visibles; progreso detallado requiere permiso adicional. Las vistas compartidas son solo lectura y Actualizar vuelve a comprobar acceso/permisos. Resúmenes compartidos está preparado como permiso y colección vacía, sin IA real. Reporte y checklist: [MVP15_REPORT.md](harness/codex/MVP15_REPORT.md).

Evidencias y checklist del cierre: [MVP2_AVANCE1_REPORT.md](harness/codex/MVP2_AVANCE1_REPORT.md). Documento académico editable: [AVANCE-1.md](docs/AVANCE-1.md); requiere revisión del autor y no constituye el PDF final.

---

# Variables de entorno

El backend utilizará variables equivalentes a:

```env
NODE_ENV=
PORT=

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=

CORS_ORIGINS=

AI_PROVIDER=
AI_MODEL=
AI_API_KEY=
AI_TIMEOUT_MS=

SWAGGER_ENABLED=
AI_PREVIEW_ENABLED=
```

Los valores reales:

```text
NO
```

deberán versionarse.

---

# Configuración Flutter

La URL de API se proporcionará mediante build configuration.

Ejemplo:

```bash
flutter build web \
  --dart-define=API_BASE_URL=https://<api-host>/api/v1
```

`API_BASE_URL` no constituye un secreto.

---

# Seguridad de secretos

Nunca deberán committearse:

```text
.env

DATABASE_URL

JWT_SECRET

AI_API_KEY

passwords

private keys

access tokens

production credentials
```

Si un secreto llega al historial Git:

```text
revocar
→
rotar
→
actualizar configuración
```

Eliminar simplemente el archivo no es suficiente.

---

# API

La API pública está versionada mediante:

```text
/api/v1
```

Swagger/OpenAPI utilizará:

```text
/api/docs
```

cuando esté habilitado.

Health:

```text
GET /api/v1/health
```

Readiness podrá utilizar:

```text
GET /api/v1/health/ready
```

---

# Backend modules

La v1.0.0 define:

```text
AuthModule

UsersModule

GoalsModule

CheckInsModule

AnalyticsModule

AiModule

SupportNetworkModule
```

No forman parte del alcance:

```text
AdminModule

ChatModule

NotificationModule

BillingModule
```

---

# Flujo de datos

```text
Flutter
   ↓
NestJS Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

Para IA:

```text
PostgreSQL
   ↓
AnalyticsModule
   ↓
SummaryContextBuilder
   ↓
PromptBuilder
   ↓
AiProvider
   ↓
LLM
   ↓
AISummary
```

---

# Analytics

Analytics será:

```text
determinístico
+
read-only
+
no persistido
```

Las métricas se derivan de:

```text
Goal
+
CheckIn
```

Entre ellas:

```text
completionRate

averageProgress

checkInFrequencyPerWeek

progressDelta

averageDifficulty

daysSinceLastCheckIn

trend
```

---

# Tendencias

La versión v1.0.0 utiliza:

```text
PROGRESSING
STABLE
DECLINING
INACTIVE
```

Estas categorías describen únicamente el comportamiento temporal de los datos registrados.

No representan:

```text
estado psicológico
estado emocional
diagnóstico
```

---

# Testing

## Backend

La calidad del backend se validará mediante:

```text
unit tests
+
integration tests
+
E2E tests
```

Comandos objetivo:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

Los E2E deberán utilizar PostgreSQL real.

No SQLite.

---

## Flutter

Validaciones objetivo:

```bash
flutter analyze
flutter test
flutter build web
```

Antes de v1.0.0 deberá generarse además un build Android funcional.

---

# Prueba E2E final

El principal criterio de aceptación de v1.0.0 será:

```text
User A
  ↓
Register
  ↓
Login
  ↓
Create Goal
  ↓
Create CheckIns
  ↓
History
  ↓
Analytics
  ↓
Dashboard
  ↓
Generate AI Summary
  ↓
Create SupportRelationship
  ↓
Grant Permissions

User B
  ↓
Login
  ↓
Read Authorized Data
  ↓
Cannot Write

User A
  ↓
Revoke Access

User B
  ↓
No Access
```

---

# DevOps

El backend será empaquetado mediante:

```text
Docker
```

y deberá conservar portabilidad entre proveedores.

El mismo artefacto deberá poder utilizarse en:

```text
local

CI

PaaS gratuito

Linux host
```

---

# CI

La baseline utiliza:

```text
GitHub Actions
```

Workflows previstos:

```text
.github/
└── workflows/
    ├── backend-ci.yml
    ├── frontend-ci.yml
    └── release-check.yml
```

---

# CI backend

Pipeline:

```text
checkout
   ↓
npm ci
   ↓
prisma generate
   ↓
lint
   ↓
unit tests
   ↓
E2E
   ↓
build
```

---

# CI frontend

Pipeline:

```text
checkout
   ↓
flutter pub get
   ↓
flutter analyze
   ↓
flutter test
   ↓
flutter build web
```

---

# Infraestructura académica

El proyecto tiene una restricción explícita:

```text
Costo recurrente obligatorio
=
$0
```

La infraestructura deberá poder funcionar utilizando:

- free tiers;
- infraestructura Always-Free;
- certificados gratuitos;
- hosting estático gratuito;
- PostgreSQL gratuito;
- CI gratuito;
- monitoreo gratuito.

No se requiere adquirir un dominio.

---

# Deployment

La topología objetivo es conceptualmente:

```text
Flutter Web
    ↓
Static Hosting
    ↓
HTTPS
    ↓
NestJS Docker
    ↓
PostgreSQL

NestJS
    ↓
HTTPS
    ↓
LLM Provider
```

---

# Portabilidad de infraestructura

El código no deberá depender de APIs propietarias de un proveedor específico de hosting.

Cambiar:

```text
PaaS A
→
Linux VM
```

o:

```text
PostgreSQL Provider A
→
PostgreSQL Provider B
```

no debe requerir modificar reglas de negocio.

---

# Monitoreo

La operación pública deberá observar al menos:

```text
Flutter Web availability

Backend health
```

El backend proporcionará además:

```text
logs
status codes
request IDs
health endpoints
```

---

# Backups

La base de datos productiva deberá contar con una estrategia basada en:

```text
pg_dump
```

y restauración mediante:

```text
pg_restore
```

o:

```text
psql
```

Antes de v1.0.0 deberá realizarse al menos una prueba controlada de:

```text
backup
   ↓
new database
   ↓
restore
   ↓
application validation
```

---

# Desarrollo multiplataforma

NeuroConnect mantiene una única base Flutter para:

```text
Web

Android

iOS
```

La v1.0.0 académica requiere:

```text
Web funcional

Android demostrable

iOS compatible a nivel de proyecto
```

No requiere publicación en tiendas.

---

# Diseño y UX

La interfaz utiliza:

```text
Material 3
```

y prioriza:

```text
claridad

predictibilidad

consistencia

baja sobrecarga

lenguaje neutral

control del usuario
```

---

# Lenguaje del producto

La interfaz v1.0.0 estará principalmente en español.

El código utiliza nombres en inglés.

Ejemplos:

```text
Goal
CheckIn
SupportRelationship
AISummary
```

Interfaz:

```text
Objetivo
Check-in
Red de apoyo
Resumen IA
```

---

# Terminología

El producto evita utilizar como lenguaje habitual:

```text
Paciente

Diagnóstico

Tratamiento

Patología

Síntoma

Caso clínico
```

NeuroConnect no se presenta como herramienta clínica.

---

# Estado de IA

La integración definitiva del modelo permanece:

```text
PENDING MODEL SELECTION
```

hasta ejecutar la metodología documentada en ADR-005.

La evaluación deberá considerar al menos seis alternativas y utilizar:

```text
Weighted Decision Matrix

Blind NeuroConnect Benchmark

Integration / Operational Spike
```

El modelo ganador será seleccionado específicamente para el caso de NeuroConnect.

---

# Principios de ingeniería

El proyecto prioriza:

```text
simplicidad

modularidad

testabilidad

seguridad

trazabilidad

reproducibilidad

privacidad

entrega completa
```

sobre:

```text
sobrearquitectura

escalabilidad prematura

infraestructura distribuida

abstracciones innecesarias
```

---

# Decisiones deliberadamente evitadas

v1.0.0 no utiliza:

```text
Microservices

GraphQL

Redis

Kafka

RabbitMQ

Kubernetes

Service Mesh

Vector Database

LangChain

RAG

Agents

Multiple Databases
```

salvo que un ADR posterior justifique formalmente un cambio.

---

# Fuente de verdad documental

Antes de modificar una decisión estructural debe revisarse la documentación correspondiente.

```text
Persistencia
→ ADR-001

Dominio
→ ADR-002

Backend
→ ADR-003

Frontend
→ ADR-004

IA
→ ADR-005

Arquitectura integral
→ ADR-006

DevOps
→ ADR-007

Roadmap
→ ROADMAP_V1.md
```

---

# Política de cambios

Una modificación significativa sobre:

- arquitectura;
- framework;
- base de datos;
- autenticación;
- modelo de autorización;
- integración IA;
- deployment topology;

deberá documentarse mediante:

```text
actualización formal
```

o:

```text
nuevo ADR
```

antes de convertirse en nueva baseline.

---

# Estado de releases

Mientras v1.0.0 no se encuentre liberada:

```text
0.x.x
```

representará versiones de desarrollo.

La release académica final será:

```text
v1.0.0
```

---

# Criterio para v1.0.0

La versión no será considerada terminada únicamente porque:

```text
compile
```

Debe:

```text
funcionar
+
integrarse
+
estar probada
+
estar desplegada
+
estar documentada
```

---

# Autor

**Carlos Benjamín Armenta Márquez**

```text
Ingeniería en Sistemas Computacionales
Instituto Tecnológico de Tijuana

Inteligencia Artificial (G)
Periodo Agosto–Diciembre 2026
```

Proyecto académico individual.

---

# Advertencia

NeuroConnect v1.0.0 es un prototipo académico.

Los indicadores y resúmenes proporcionados por el sistema tienen finalidad informativa y de seguimiento.

No constituyen:

- diagnóstico;
- evaluación psicológica;
- evaluación médica;
- tratamiento;
- recomendación clínica;
- sustitución de atención profesional.

---

# Estado final esperado

```text
NeuroConnect v1.0.0

Frontend         DONE
Backend          DONE
Database         DONE
Analytics        DONE
AI               DONE
Support Network  DONE
Security         DONE
Testing          DONE
Deployment       DONE
Documentation    DONE

Web              PUBLIC
Android          FUNCTIONAL
iOS              COMPATIBLE

Infrastructure
Cost             $0
```

---

## NeuroConnect

> Registrar primero. Analizar después. Explicar con IA únicamente sobre resultados verificables. Compartir solo bajo control del usuario.
