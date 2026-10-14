
# ADR-007 — DevOps, infraestructura, despliegue y operación de NeuroConnect v1.0.0

**Estado:** Aceptado para implementación  
**Fecha:** 14 de octubre de 2026  
**Proyecto:** NeuroConnect  
**Versión objetivo:** v1.0.0  
**Decisión:** Estrategia DevOps, containerización, infraestructura, CI/CD, despliegue público, observabilidad, respaldo, recuperación, seguridad operacional y mantenimiento con costo obligatorio de $0 para el proyecto académico  
**Responsable:** Carlos Benjamín Armenta Márquez  

---

# 1. Contexto

NeuroConnect v1.0.0 es un proyecto académico que deberá finalizar con una aplicación funcional y públicamente demostrable.

La arquitectura integral ya define:

```text
Flutter
    ↓
HTTPS / REST / JSON
    ↓
NestJS Modular Monolith
    ↓
Prisma
    ↓
PostgreSQL 16

NestJS
    ↓
External LLM Provider
```

La solución necesita además una estrategia operativa que permita:

- desarrollo reproducible;
- ejecución local;
- containerización;
- integración continua;
- despliegue;
- publicación Web;
- acceso desde Android;
- base de datos persistente;
- HTTPS;
- secretos;
- monitoreo;
- logging;
- health checks;
- backups;
- recuperación;
- mantenimiento;
- actualización;
- rollback;
- control de costos.

Existe una restricción adicional fundamental:

```text
Costo obligatorio de infraestructura
durante el proyecto académico:

$0 MXN
$0 USD
```

No deberá ser necesario contratar:

- VPS;
- hosting;
- bases de datos;
- dominios;
- certificados;
- herramientas DevOps;
- herramientas de monitoreo;
- container registries;
- pipelines CI/CD;

para completar, demostrar y mantener NeuroConnect v1.0.0 durante su periodo académico.

---

# 2. Objetivo

Definir una estrategia DevOps que permita que NeuroConnect sea:

```text
reproducible
+
portable
+
público
+
seguro
+
observable
+
recuperable
+
mantenible
+
desplegable
+
costo cero
```

sin modificar la arquitectura funcional definida en ADR-001 a ADR-006.

---

# 3. Relación con ADR anteriores

La jerarquía documental queda:

```text
Anteproyecto
    ↓
ADR-001 — Persistencia
    ↓
ADR-002 — Dominio
    ↓
ADR-003 — Backend
    ↓
ADR-004 — Frontend
    ↓
ADR-005 — IA
    ↓
ADR-006 — Arquitectura integral
    ↓
ADR-007 — DevOps e infraestructura
    ↓
Planes de implementación
    ↓
Código
```

---

# 4. Responsabilidad de ADR-007

ADR-007 será autoridad sobre:

- Docker;
- Docker Compose;
- infraestructura de ejecución;
- infraestructura pública;
- ambientes;
- CI;
- CD;
- deployment;
- hosting;
- TLS;
- DNS técnico;
- secretos operativos;
- health checks;
- logging operativo;
- monitoreo;
- backups;
- restore;
- rollback;
- mantenimiento;
- seguridad de infraestructura;
- control de costos;
- runbooks.

No redefine:

- dominio;
- esquema;
- contratos API;
- arquitectura interna Flutter;
- arquitectura interna NestJS;
- modelo IA.

---

# 5. Restricción principal de costo

La infraestructura de v1.0.0 deberá mantener:

```text
MonthlyInfrastructureCost = 0
```

durante el proyecto académico.

Esto constituye:

```text
requisito arquitectónico
```

y no únicamente una preferencia.

---

# 6. Significado de costo cero

Costo cero significa:

```text
no pagos recurrentes
+
no compra obligatoria de dominio
+
no VPS pagado
+
no DB pagada
+
no monitoring pagado
+
no CI pagado
+
no certificado pagado
```

---

# 7. Servicios externos IA

El consumo del proveedor LLM está regulado por ADR-005.

Cuando sea posible deberá utilizar:

```text
free tier
créditos educativos
créditos promocionales
```

Si ningún proveedor adecuado permite uso real dentro del presupuesto académico:

```text
la selección deberá reconsiderarse
```

antes de generar costos.

---

# 8. Prohibición de gasto silencioso

Codex y cualquier automatización:

```text
NO
```

podrán:

- habilitar planes pagados;
- introducir servicios con facturación;
- aumentar recursos automáticamente;
- registrar infraestructura de pago;
- activar addons con costo;
- exceder intencionalmente free tiers.

---

# 9. Principio de portabilidad

La aplicación:

```text
NO
```

quedará diseñada alrededor de APIs propietarias del proveedor de hosting.

El artefacto backend será:

```text
Docker image
```

ejecutable sobre cualquier host compatible.

---

# 10. Estrategia general

La infraestructura tendrá tres niveles:

```text
Local Development
        ↓
CI Validation
        ↓
Public Deployment
```

---

# 11. Desarrollo local

```text
Developer Machine
      │
      ├── Flutter
      │
      ├── NestJS
      │
      └── Docker Compose
             ↓
         PostgreSQL
```

---

# 12. Producción académica

Arquitectura lógica:

```text
Internet
   │
   ├── Flutter Web
   │
   └── Android
          ↓
        HTTPS
          ↓
       NestJS
          ↓
      PostgreSQL

       NestJS
          ↓
        HTTPS
          ↓
     LLM Provider
```

---

# 13. Estrategia multi-proveedor

La arquitectura DevOps no dependerá de un único proveedor gratuito.

Se aprobarán dos topologías productivas.

```text
Topology A
Host-based Always-Free

Topology B
Managed Free-Tier
```

---

# 14. Motivo de dos topologías

Los free tiers pueden modificar:

- capacidad;
- límites;
- disponibilidad;
- requisitos de registro;
- políticas;
- suspensión;
- productos.

Por ello:

> La disponibilidad de un proveedor gratuito no debe convertirse en un single point of failure del proyecto académico.

---

# 15. Topología A — Host Linux gratuito

Será la opción preferida cuando exista capacidad Always-Free disponible.

Arquitectura:

```text
Cloudflare Pages
     │
     │ Flutter Web
     ▼
   Internet
     │
     │ HTTPS
     ▼
┌──────────────────────────────┐
│ Always-Free Linux VM         │
│                              │
│ Docker                       │
│                              │
│ ┌──────────────────────────┐ │
│ │ Reverse Proxy            │ │
│ └─────────────┬────────────┘ │
│               │              │
│ ┌─────────────▼────────────┐ │
│ │ NeuroConnect Backend     │ │
│ │ NestJS Docker Container  │ │
│ └─────────────┬────────────┘ │
└───────────────┼──────────────┘
                │
                │ TLS
                ▼
       Managed PostgreSQL
          Free Tier
```

---

# 16. Host recomendado

Proveedor candidato principal:

```text
Oracle Cloud Infrastructure
Always Free Compute
```

si existe capacidad disponible al momento del deployment.

---

# 17. Razón para utilizar VM

Permite demostrar:

- Linux;
- Docker;
- networking;
- firewall;
- reverse proxy;
- deployment;
- operaciones;
- logs;
- mantenimiento;

sin costo de infraestructura.

---

# 18. Base de datos en Topology A

Por defecto se preferirá:

```text
Managed PostgreSQL Free Tier
```

en lugar de ejecutar PostgreSQL en la misma VM pública.

Proveedor candidato:

```text
Neon PostgreSQL Free
```

---

# 19. Motivo para separar DB de la VM

Permite:

- persistencia independiente;
- menor riesgo ante pérdida de VM;
- menor administración;
- conexión cifrada;
- recuperación más sencilla;
- menor consumo de RAM del host.

---

# 20. Topología A alternativa completamente self-hosted

Si fuera necesario:

```text
Linux VM
  │
  ├── reverse-proxy
  ├── backend
  └── postgres
```

mediante Docker Compose.

Esta variante será aceptable únicamente si:

```text
persistent volume
+
backup externo
+
firewall
+
PostgreSQL no público
```

están correctamente configurados.

---

# 21. Topología B — Servicios administrados gratuitos

Topología de respaldo:

```text
┌──────────────────────────┐
│ Cloudflare Pages         │
│ Flutter Web              │
└─────────────┬────────────┘
              │
              │ HTTPS
              ▼
┌──────────────────────────┐
│ Render Free Web Service  │
│                          │
│ Docker                   │
│ NestJS                   │
└─────────────┬────────────┘
              │
              │ TLS
              ▼
┌──────────────────────────┐
│ Neon PostgreSQL Free     │
└──────────────────────────┘

NestJS
   │
   └── HTTPS → LLM Provider
```

---

# 22. Función de Topology B

Será utilizada cuando:

- no exista capacidad OCI;
- se necesite deployment inmediato;
- se quiera reducir administración Linux;
- la VM gratuita no pueda aprovisionarse;
- falle el host principal.

---

# 23. Equivalencia funcional

Ambas topologías deberán exponer exactamente:

```text
Flutter Web
+
NestJS /api/v1
+
PostgreSQL
+
External LLM
```

El código de aplicación no deberá distinguir cuál topología está activa.

---

# 24. Cloudflare Pages

Se utilizará como opción preferida para:

```text
Flutter Web
```

---

# 25. Flutter Web como contenido estático

El build:

```bash
flutter build web
```

produce assets estáticos.

Por ello no se necesita servidor de aplicación dedicado para frontend.

---

# 26. URL gratuita

La aplicación podrá utilizar:

```text
*.pages.dev
```

sin comprar dominio.

---

# 27. Dominio personalizado

No es requisito para v1.0.0.

Si el responsable ya posee uno:

```text
puede utilizarse
```

sin que su compra se considere dependencia del proyecto.

---

# 28. Política de dominio

El proyecto deberá poder operar completamente utilizando únicamente:

```text
subdominios gratuitos de proveedores
```

---

# 29. Backend container

El backend NestJS tendrá un:

```text
backend/Dockerfile
```

oficial.

---

# 30. Dockerfile como artefacto productivo

El mismo Dockerfile deberá servir para:

```text
local
CI
Render
Linux VM
```

---

# 31. Multi-stage build

El Dockerfile utilizará conceptualmente:

```text
Stage 1
Dependencies

Stage 2
Build

Stage 3
Runtime
```

---

# 32. Imagen de runtime

La imagen final no deberá contener innecesariamente:

- código de tests;
- caches;
- herramientas de desarrollo;
- archivos locales;
- secretos.

---

# 33. Usuario no root

Cuando la imagen base lo permita razonablemente:

```text
NestJS
```

deberá ejecutarse como:

```text
non-root user
```

---

# 34. Node

La imagen utilizará:

```text
Node.js LTS
```

compatible con la versión aprobada de NestJS.

---

# 35. Prisma

Durante build:

```text
prisma generate
```

deberá ejecutarse antes de compilar el backend.

---

# 36. Start command

Producción utilizará:

```text
node dist/main.js
```

o script equivalente:

```text
npm run start:prod
```

---

# 37. Healthcheck Docker

La imagen podrá definir un healthcheck basado en:

```text
GET /api/v1/health
```

cuando el runtime lo soporte.

---

# 38. Docker Compose

En raíz existirá:

```text
docker-compose.yml
```

o:

```text
compose.yaml
```

---

# 39. Docker Compose de desarrollo

Como mínimo podrá contener:

```text
postgres
backend
```

---

# 40. Frontend en desarrollo

Flutter no requiere ejecutarse dentro de Docker.

Se utilizará:

```bash
flutter run
```

---

# 41. Perfil Docker opcional

Podrá existir un perfil para levantar backend:

```bash
docker compose up -d postgres backend
```

---

# 42. Volumen PostgreSQL local

PostgreSQL local deberá utilizar:

```text
named volume
```

para evitar pérdida accidental entre restarts.

---

# 43. No bind mount de secretos

Los secretos no se incorporarán dentro de imágenes ni repositorios.

---

# 44. `.dockerignore`

Backend deberá tener:

```text
.dockerignore
```

incluyendo:

```text
node_modules
dist
.git
.env
coverage
test artifacts
```

cuando corresponda.

---

# 45. Registry

No será obligatorio utilizar un container registry externo.

---

# 46. Render deployment

Render podrá construir directamente desde:

```text
Dockerfile
```

conectado a Git.

---

# 47. OCI deployment

Sobre VM podrá realizarse:

```text
git pull
docker compose build
docker compose up -d
```

durante v1.0.0.

---

# 48. GHCR

GitHub Container Registry podrá incorporarse posteriormente si simplifica deployment.

No es requisito inicial.

---

# 49. Source of truth

GitHub será:

```text
source of truth
```

para:

- código;
- Dockerfiles;
- Compose;
- workflows;
- documentación;
- migraciones.

---

# 50. Repository visibility

Para maximizar el uso de CI gratuito y permitir evaluación académica, la opción preferida será:

```text
public repository
```

si no existe contenido que deba permanecer privado.

---

# 51. Información prohibida en repositorio público

Nunca:

```text
.env
API keys
JWT_SECRET
DATABASE_URL
production passwords
private SSH keys
provider credentials
```

---

# 52. `.gitignore`

Deberá excluir como mínimo:

```text
.env
.env.*
!.env.example

*.pem
*.key

node_modules/
dist/
coverage/

.dart_tool/
build/
```

según el componente.

---

# 53. `.env.example`

Cada aplicación deberá documentar configuración requerida sin valores secretos.

Backend:

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

---

# 54. Frontend config

Flutter utilizará:

```text
API_BASE_URL
```

como build configuration.

No contiene secretos.

---

# 55. Entornos

Existirán conceptualmente:

```text
development
test
production
```

---

# 56. Development

Objetivo:

```text
desarrollo rápido
```

Puede utilizar:

- Docker PostgreSQL local;
- backend local;
- Flutter local;
- MockAiProvider.

---

# 57. Test

Objetivo:

```text
automatización reproducible
```

Utilizará:

- PostgreSQL de testing;
- backend temporal;
- datos sintéticos;
- IA mock salvo tests específicos.

---

# 58. Production

Objetivo:

```text
demostración pública académica
```

Utilizará:

- hosting público;
- PostgreSQL persistente;
- HTTPS;
- LLM real al completar MVP-2;
- secrets del proveedor.

---

# 59. No staging permanente obligatorio

Para mantener costo cero:

```text
staging permanente
```

no es requisito.

---

# 60. Preview environments

Cloudflare Pages podrá generar previews temporales de frontend cuando estén disponibles.

No se requiere backend staging permanente.

---

# 61. CI

La plataforma principal será:

```text
GitHub Actions
```

---

# 62. Objetivo de CI

Ningún commit candidato a producción deberá desplegarse sin validar:

```text
lint
+
tests
+
build
```

---

# 63. Backend CI

Workflow conceptual:

```text
checkout
   ↓
setup Node
   ↓
npm ci
   ↓
prisma generate
   ↓
lint
   ↓
unit tests
   ↓
E2E tests
   ↓
build
```

---

# 64. PostgreSQL en CI

Los tests E2E deberán utilizar:

```text
PostgreSQL service container
```

o mecanismo equivalente.

No SQLite.

---

# 65. Frontend CI

Workflow conceptual:

```text
checkout
   ↓
setup Flutter
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

# 66. Android CI

El build Android podrá ejecutarse:

- en CI para releases;
- localmente para iteraciones.

No será necesario compilar APK en cada commit si incrementa excesivamente tiempo de CI.

---

# 67. AI tests en CI

No se llamará al proveedor real de IA en cada commit.

Se utilizará:

```text
MockAiProvider
```

---

# 68. Test real de IA

Se ejecutará:

```text
manualmente
```

o en workflow explícito y controlado.

Objetivo:

- no consumir créditos innecesariamente;
- no introducir costos;
- evitar flakiness.

---

# 69. Workflows propuestos

```text
.github/
└── workflows/
    ├── backend-ci.yml
    ├── frontend-ci.yml
    └── release-check.yml
```

---

# 70. CI trigger

Como mínimo:

```text
pull_request

push:
  branches:
    - main
```

---

# 71. Release check

Antes de una release deberá verificar:

```text
backend lint
backend tests
backend E2E
backend build

frontend analyze
frontend tests
frontend web build
```

---

# 72. Continuous Deployment

CD será:

```text
semi-automatic
```

durante v1.0.0.

---

# 73. Razón

Se desea evitar:

```text
commit accidental
      ↓
producción rota
```

durante entregas académicas.

---

# 74. Frontend CD

Cloudflare Pages podrá desplegar automáticamente:

```text
main
```

después de actualización.

---

# 75. Backend CD administrado

En Render podrá utilizarse:

```text
Git integration
```

y auto-deploy desde:

```text
main
```

cuando CI esté estable.

---

# 76. Backend CD host Linux

Para OCI/VM:

```text
deployment manual controlado
```

será suficiente para v1.0.0.

---

# 77. No SSH automático inicialmente

No se almacenará una clave SSH productiva en GitHub únicamente para implementar CD antes de que exista necesidad.

---

# 78. Deployment procedure VM

Flujo:

```text
CI green
   ↓
merge main
   ↓
SSH
   ↓
git fetch
   ↓
git checkout release
   ↓
docker compose build
   ↓
prisma migrate deploy
   ↓
docker compose up -d
   ↓
health check
```

---

# 79. Regla crítica de migraciones

Nunca:

```text
deploy backend
```

sin considerar previamente:

```text
database migration compatibility
```

---

# 80. Production migrations

Se utilizará:

```bash
npx prisma migrate deploy
```

---

# 81. Prohibido en producción

```bash
npx prisma migrate dev
```

---

# 82. Migration-first deployment

Cuando exista migración compatible:

```text
backup
   ↓
migrate deploy
   ↓
new backend
   ↓
health
```

---

# 83. Cambios destructivos

Una migración destructiva deberá:

1. generar backup;
2. revisarse manualmente;
3. probarse en local/test;
4. desplegarse únicamente después de validación.

---

# 84. Rollback de aplicación

El backend deberá poder regresar a:

```text
previous known-good image/commit
```

---

# 85. Rollback en Render

Se podrá utilizar:

```text
provider rollback
```

cuando esté disponible.

---

# 86. Rollback VM

Se conservará:

```text
previous release commit/tag
```

---

# 87. Tags

Releases importantes utilizarán:

```text
v0.1.0
v0.2.0
...
v1.0.0
```

---

# 88. Rollback y DB

Un rollback de aplicación:

```text
NO
```

implica automáticamente rollback de DB.

---

# 89. Regla de compatibilidad

Preferir migraciones:

```text
backward-compatible
```

cuando sea posible.

---

# 90. Frontend deployment

Build:

```bash
flutter build web \
  --dart-define=API_BASE_URL=<PUBLIC_API>
```

---

# 91. Android build

Build:

```bash
flutter build apk \
  --dart-define=API_BASE_URL=<PUBLIC_API>
```

---

# 92. API pública única

Web y Android utilizarán:

```text
la misma API HTTPS
```

---

# 93. TLS

El acceso público deberá utilizar:

```text
HTTPS obligatorio
```

---

# 94. TLS administrado

Cuando el proveedor incluya certificados administrados:

```text
preferir provider-managed TLS
```

---

# 95. TLS sobre VM

Si se utiliza VM propia se podrá utilizar:

```text
Caddy
```

o:

```text
Nginx + Let's Encrypt / Certbot
```

---

# 96. Preferencia reverse proxy VM

Para reducir configuración manual:

```text
Caddy
```

será una alternativa preferente cuando se necesite provisioning automático de TLS.

Nginx continúa siendo aceptable.

---

# 97. Reverse proxy responsibilities

Responsable de:

- TLS termination;
- redirect HTTP → HTTPS;
- forwarding a NestJS;
- headers necesarios;
- límites básicos de request.

---

# 98. NestJS binding

Dentro del container:

```text
0.0.0.0:${PORT}
```

---

# 99. Exposición de puertos

Externamente deberán exponerse únicamente:

```text
80
443
```

cuando se utilice VM con reverse proxy.

---

# 100. Puerto NestJS

El puerto interno del backend:

```text
NO
```

deberá estar abierto directamente a Internet cuando exista reverse proxy.

---

# 101. PostgreSQL público

Si PostgreSQL es self-hosted:

```text
5432
```

NO deberá exponerse al Internet público.

---

# 102. Managed PostgreSQL

Si se utiliza Neon u otro servicio administrado:

```text
TLS
```

será obligatorio cuando el proveedor lo soporte/requiera.

---

# 103. DATABASE_URL

Solo estará disponible:

```text
backend runtime
```

---

# 104. Firewall VM

Solo permitir:

```text
22/TCP
80/TCP
443/TCP
```

según necesidad.

---

# 105. SSH

Se preferirá:

```text
public-key authentication
```

---

# 106. SSH passwords

Cuando sea posible:

```text
password authentication = disabled
```

---

# 107. Root SSH

Cuando sea posible:

```text
PermitRootLogin no
```

---

# 108. Administración VM

Utilizar usuario administrativo no-root con:

```text
sudo
```

---

# 109. Firewall de host

Podrá utilizarse:

```text
UFW
```

o firewall equivalente del proveedor.

---

# 110. Cloud firewall

Las reglas del security group/network security list deberán aplicar además principio de mínimo acceso.

---

# 111. Docker socket

El socket Docker:

```text
NO
```

será expuesto públicamente.

---

# 112. Secrets management

Se utilizarán:

```text
provider environment variables
```

o archivos `.env` locales protegidos.

---

# 113. Secrets en VM

Archivo:

```text
/opt/neuroconnect/.env
```

o equivalente.

Permisos:

```text
600
```

cuando sea viable.

---

# 114. Secrets en CI

GitHub Secrets solo contendrá credenciales necesarias para workflows que realmente las utilicen.

---

# 115. No secrets in build arguments

Evitar:

```text
docker build --build-arg SECRET=...
```

porque puede dejar información en capas/historial.

---

# 116. JWT secret

Deberá ser:

- aleatorio;
- suficientemente largo;
- diferente de desarrollo;
- no versionado.

---

# 117. AI API key

Solo existirá:

```text
backend production
```

---

# 118. Secret rotation

Si una credencial se filtra:

```text
revocar
+
generar nueva
+
redeploy
```

---

# 119. No secretos en evidencias académicas

Capturas para PDF:

```text
NO
```

deberán mostrar:

- `.env`;
- API keys;
- JWT_SECRET;
- DATABASE_URL completa;
- passwords;
- tokens.

---

# 120. CORS

Producción permitirá únicamente:

```text
Flutter Web production origin
```

y otros orígenes explícitamente autorizados.

---

# 121. Android y CORS

CORS es una política de navegador.

La configuración continuará siendo estricta para Web sin impedir acceso móvil legítimo.

---

# 122. Security headers

Backend utilizará:

```text
Helmet
```

de acuerdo con ADR-003.

---

# 123. Rate limiting

Backend utilizará:

```text
NestJS Throttler
```

o equivalente ya aprobado.

---

# 124. Monitoreo

La operación pública tendrá tres niveles:

```text
L1 — Availability
L2 — Application
L3 — Infrastructure
```

---

# 125. Availability monitoring

Se utilizará preferentemente:

```text
UptimeRobot Free
```

o servicio gratuito equivalente.

---

# 126. Monitores mínimos

```text
1. Flutter Web root

2. Backend /api/v1/health
```

---

# 127. Monitor frontend

Verifica:

```text
HTTP 2xx
```

sobre la URL pública.

---

# 128. Monitor API

Verifica:

```text
GET /api/v1/health
```

---

# 129. Trade-off con hosts que duermen

En servicios gratuitos que suspenden aplicaciones por inactividad:

```text
external health polling
```

puede mantener activa la instancia y consumir su cuota mensual.

---

# 130. Política para Render Free

No se utilizará monitoreo frecuente para evadir deliberadamente las políticas del proveedor.

Antes de habilitar el monitor permanente se verificará:

```text
free instance allowance
+
provider policy
```

---

# 131. Cold starts

Si se utiliza una plataforma con sleep:

```text
cold start
```

se considera una limitación operativa aceptable del MVP académico.

---

# 132. UX ante cold start

El frontend deberá tolerar razonablemente:

```text
primera request lenta
```

y mostrar loading/error recuperable.

---

# 133. Host Always-Free

Si se utiliza una VM permanente:

```text
health monitoring continuo
```

sí podrá mantenerse habilitado.

---

# 134. Application monitoring

El backend proporcionará:

```text
health endpoint
logs
request IDs
status codes
```

---

# 135. Health liveness

```text
GET /api/v1/health
```

comprueba:

```text
process alive
```

---

# 136. Readiness

Podrá existir:

```text
GET /api/v1/health/ready
```

para comprobar:

```text
application
+
database
```

---

# 137. Health security

Health endpoints no mostrarán:

- passwords;
- connection strings;
- hostnames internos sensibles;
- env vars;
- stack traces.

---

# 138. Logging

Los logs de aplicación deberán enviarse a:

```text
stdout
stderr
```

---

# 139. Motivo

Esto permite que funcionen indistintamente con:

```text
docker logs
Render logs
OCI logs
future container platform
```

---

# 140. Structured logging

Se preferirán logs estructurados cuando esté disponible.

Campos:

```text
timestamp
level
requestId
method
path
status
duration
```

---

# 141. Datos prohibidos en logs

No registrar:

```text
password
passwordHash
JWT
Authorization header
AI API key
DATABASE_URL
CheckIn.notes
full AI prompt
full inputSnapshot
```

---

# 142. Log level production

Normalmente:

```text
info
warn
error
```

---

# 143. Debug logs

```text
debug
```

deberá habilitarse únicamente para troubleshooting controlado.

---

# 144. Log retention

No se requiere retención histórica extensa.

El hosting gratuito podrá utilizar su retención disponible.

---

# 145. Better Stack opcional

Si se necesita centralización adicional y su free tier sigue siendo suficiente podrá incorporarse:

```text
Better Stack
```

sin convertirse en dependencia obligatoria.

---

# 146. Principio observability zero-cost

Ninguna herramienta externa de observabilidad será obligatoria si requiere pago.

---

# 147. Alertas

Como mínimo podrán utilizarse:

```text
email alerts
```

del monitor externo.

---

# 148. Pager / SMS

No son requisito.

---

# 149. Status page

Podrá utilizarse una status page gratuita durante demostraciones.

No es requisito funcional del producto.

---

# 150. Infraestructura VM monitoring

Sobre VM podrán utilizarse herramientas estándar:

```text
docker stats
free
df
top
journalctl
```

---

# 151. Métricas a revisar

```text
CPU

RAM

disk

container status

API availability

database connectivity
```

---

# 152. No Prometheus/Grafana obligatorios

No se desplegarán únicamente para aparentar una arquitectura más sofisticada.

---

# 153. Motivo

El volumen académico no justifica su costo operacional.

---

# 154. Docker restart policy

En VM:

```yaml
restart: unless-stopped
```

o estrategia equivalente.

---

# 155. Recuperación tras reboot

El host deberá poder:

```text
reboot
↓
Docker starts
↓
containers restart
↓
API returns healthy
```

---

# 156. Docker daemon

Deberá habilitarse para iniciar con el host cuando se use VM.

---

# 157. PostgreSQL managed availability

Si Neon suspende compute en inactividad:

```text
wake-up automático
```

se considera compatible con el MVP mientras preserve datos.

---

# 158. Persistencia

Datos de producción:

```text
NO
```

deberán almacenarse en filesystem efímero del backend.

---

# 159. Filesystem backend

Se considera:

```text
ephemeral
```

---

# 160. No uploads

Esto es compatible con la arquitectura porque NeuroConnect v1.0.0 no requiere almacenamiento de archivos.

---

# 161. Backup strategy

Todo despliegue productivo deberá tener una estrategia reproducible de respaldo de PostgreSQL.

---

# 162. Herramienta base

Se utilizará:

```bash
pg_dump
```

---

# 163. Restore

Se utilizará:

```bash
pg_restore
```

o:

```bash
psql
```

según el formato generado.

---

# 164. Backup antes de cambios críticos

Obligatorio antes de:

```text
migración destructiva
release importante
cambio de proveedor DB
```

---

# 165. Backup académico periódico

Durante desarrollo activo:

```text
mínimo antes de cada release académica
```

---

# 166. Backup semanal

Una copia semanal es recomendable cuando exista información persistente relevante.

---

# 167. Automatización de backup

No se introducirá cron cloud pagado.

Podrá utilizarse:

```text
GitHub Actions scheduled workflow
```

si:

- no expone datos;
- el repositorio/artefacto es privado;
- existe una ubicación segura.

---

# 168. Backups y repositorio

Backups de DB:

```text
NO
```

deberán committearse al repositorio.

---

# 169. Datos sintéticos

Como el proyecto académico prioriza datos sintéticos, un backup podrá ser menos crítico que en un sistema clínico.

Aun así se validará recuperación.

---

# 170. Backup encryption

Si un backup contiene información real:

```text
deberá cifrarse
```

antes de almacenarse fuera de la infraestructura.

---

# 171. Recovery test

Al menos una vez antes de v1.0.0:

```text
backup
   ↓
new database
   ↓
restore
   ↓
application validation
```

deberá ejecutarse.

---

# 172. Recovery Time Objective académico

No existe SLA formal.

Objetivo operativo:

```text
recuperar una demo funcional
durante la misma sesión de mantenimiento
```

---

# 173. Recovery Point Objective académico

Dado el contexto:

```text
último backup manual/release
```

es aceptable.

---

# 174. Disaster recovery

Ante pérdida total del host:

```text
GitHub
   ↓
new host
   ↓
Docker
   ↓
environment
   ↓
database connection
   ↓
deploy
```

---

# 175. Infraestructura reconstruible

El host:

```text
NO
```

debe ser una pieza artesanal imposible de recrear.

---

# 176. Runbook de reconstrucción

Se creará:

```text
docs/operations/DEPLOYMENT-RUNBOOK.md
```

---

# 177. Runbook de backup

```text
docs/operations/BACKUP-RESTORE-RUNBOOK.md
```

---

# 178. Runbook de incidentes

```text
docs/operations/INCIDENT-RUNBOOK.md
```

---

# 179. Runbook de release

```text
docs/operations/RELEASE-RUNBOOK.md
```

---

# 180. Directorio DevOps

Estructura propuesta:

```text
neuro-connect/
│
├── app/
│
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
│
├── infra/
│   ├── compose/
│   │   ├── compose.dev.yml
│   │   └── compose.prod.yml
│   │
│   └── proxy/
│       └── Caddyfile
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── release-check.yml
│
├── docs/
│   ├── ADRS/
│   │   ├── ADR-001...
│   │   ├── ADR-002...
│   │   ├── ADR-003...
│   │   ├── ADR-004...
│   │   ├── ADR-005...
│   │   ├── ADR-006...
│   │   └── ADR-007-DEVOPS-INFRAESTRUCTURA-V1.md
│   │
│   ├── Planeacion/
│   │
│   ├── operations/
│   │   ├── DEPLOYMENT-RUNBOOK.md
│   │   ├── BACKUP-RESTORE-RUNBOOK.md
│   │   ├── INCIDENT-RUNBOOK.md
│   │   └── RELEASE-RUNBOOK.md
│   │
│   └── Anteproyecto...
│
├── compose.yaml
├── .gitignore
└── README.md
```

---

# 181. Infrastructure as Code

v1.0.0 no requiere:

```text
Terraform
Pulumi
Ansible
```

---

# 182. Motivo

Existe:

```text
1 backend
+
1 database
+
1 static frontend
```

y el tiempo académico no justifica otra herramienta.

---

# 183. Config-as-code

Sí deberán versionarse:

```text
Dockerfile
Compose
proxy config
CI workflows
```

---

# 184. Proveedor cloud no es arquitectura

Mover backend de:

```text
Render → OCI
```

no cambia la arquitectura mientras continúe:

```text
Dockerized NestJS
+
same env contract
+
same PostgreSQL
+
same API
```

---

# 185. Portability test

Antes del cierre deberá comprobarse que backend puede ejecutar:

```bash
docker build
docker run
```

sin depender de APIs de Render u OCI.

---

# 186. Zero-cost provider gate

Antes de crear cualquier recurso cloud deberá comprobarse:

```text
[ ] existe plan $0

[ ] no existe cargo fijo

[ ] recurso seleccionado es free

[ ] límites son suficientes

[ ] no se activa autoscaling pagado

[ ] no se activa almacenamiento pagado

[ ] no se activa IP dedicada pagada

[ ] no se requiere dominio pagado

[ ] no se requiere certificado pagado
```

---

# 187. Billing safety

Cuando el proveedor permita establecer:

```text
budget
spending limit
quota
```

deberá configurarse para minimizar riesgo de cobro.

---

# 188. Regla de tarjeta

Si un proveedor exige método de pago para verificar identidad:

```text
NO
```

se interpretará automáticamente como permiso para utilizar recursos pagados.

---

# 189. Cost review

Antes de cada nueva dependencia de infraestructura se responderá:

```text
¿Puede esto generar un cargo?
```

Si la respuesta es:

```text
sí
```

deberá existir una alternativa $0 antes de adoptarla.

---

# 190. Reporte de costo

La documentación final podrá incluir:

```text
Infrastructure monthly cost: $0
```

y explicar free tiers empleados.

---

# 191. Free-tier drift

Los límites de los servicios:

```text
pueden cambiar
```

durante el semestre.

---

# 192. Política ante cambio de free tier

Si un proveedor elimina su plan gratuito:

1. no pagar automáticamente;
2. congelar infraestructura afectada;
3. revisar Topology A/B;
4. migrar al proveedor alternativo;
5. actualizar ADR-007 si cambia la arquitectura;
6. documentar la migración.

---

# 193. Render Free

Puede utilizarse para backend académico cuando siga existiendo un Web Service gratuito compatible con el Dockerfile.

---

# 194. Limitación aceptada de Render

La posible suspensión por inactividad:

```text
es aceptable
```

para el MVP.

---

# 195. Render filesystem

El sistema:

```text
NO
```

dependerá de filesystem local persistente.

---

# 196. Render Postgres

No será opción preferida para la DB académica si su plan gratuito conserva expiración temporal.

Se preferirá una base gratuita persistente de mayor duración.

---

# 197. Neon

Será candidato preferente para:

```text
managed PostgreSQL
```

mientras su plan gratuito sea suficiente para:

- schema;
- migrations;
- datos sintéticos;
- demo.

---

# 198. No dependencia específica Neon

El código utiliza:

```text
standard PostgreSQL
+
Prisma
```

No APIs propietarias de Neon.

---

# 199. Migración de DB

Cambiar proveedor deberá requerir principalmente:

```text
pg_dump
↓
new PostgreSQL
↓
restore
↓
DATABASE_URL
```

---

# 200. Cloudflare Pages

Será candidato preferente para Flutter Web.

---

# 201. No Cloudflare Functions

Frontend v1.0.0 será:

```text
static assets only
```

No se utilizarán Pages Functions para introducir otro backend.

---

# 202. Motivo

Evita:

- duplicar lógica;
- consumir cuotas de Functions;
- fragmentar arquitectura.

---

# 203. GitHub Actions

Será sistema CI oficial mientras continúe cumpliendo la restricción de costo cero.

---

# 204. Dependabot

Podrá habilitarse para:

- npm;
- GitHub Actions;
- Flutter/Dart cuando sea compatible.

---

# 205. Dependency review

Los cambios de dependencias deberán revisarse antes de releases importantes.

---

# 206. Actualizaciones automáticas

Dependabot:

```text
NO
```

fusionará cambios automáticamente sin CI.

---

# 207. Vulnerabilidades críticas

Una vulnerabilidad conocida crítica en dependencia directa deberá priorizarse antes de release.

---

# 208. Docker image updates

La imagen base deberá fijarse a una versión compatible y mantenerse durante el proyecto salvo necesidad.

---

# 209. No `latest`

Evitar:

```dockerfile
FROM node:latest
```

---

# 210. Preferencia

Utilizar versión LTS explícita.

---

# 211. Reproducibilidad npm

Backend utilizará:

```bash
npm ci
```

en CI y Docker.

---

# 212. Lockfiles

Deberán versionarse:

```text
package-lock.json
pubspec.lock
```

cuando corresponda.

---

# 213. Release procedure

Antes de release:

```text
git clean
   ↓
CI green
   ↓
backup
   ↓
migrations
   ↓
deploy backend
   ↓
health check
   ↓
deploy frontend
   ↓
smoke test
   ↓
tag
```

---

# 214. Smoke test

Como mínimo:

```text
GET /health

register/login

GET /auth/me

create/read Goal

analytics overview
```

Cuando estén disponibles:

```text
AI summary

support delegated read
```

---

# 215. Post-deployment validation

Validar:

```text
frontend loads

API responds

DB reachable

CORS correct

JWT works

HTTPS valid

Swagger expected state
```

---

# 216. Rollback trigger

Rollback cuando:

```text
health fails
auth broken
migrations incompatible
critical E2E path broken
```

---

# 217. Maintenance window

No se requiere una ventana formal.

Las actualizaciones deberán realizarse evitando horas inmediatamente anteriores a una demostración.

---

# 218. Freeze académico

Antes de una entrega importante:

```text
release candidate
↓
freeze
↓
evidence capture
↓
submission
```

---

# 219. No deploy durante captura

Mientras se preparan evidencias:

```text
production
```

deberá permanecer estable.

---

# 220. Branching

Estrategia sencilla:

```text
main
dev
feature/*
```

---

# 221. Main

Representa:

```text
deployable baseline
```

---

# 222. Dev

Representa:

```text
integration branch
```

si el flujo realmente la necesita.

---

# 223. Feature branches

Opcionales pero recomendables para cambios de riesgo.

---

# 224. Protected main

Cuando GitHub lo permita sin costo y sin bloquear flujo académico:

```text
main
```

deberá requerir CI exitoso antes del merge.

---

# 225. Conventional commits

Se recomienda:

```text
feat:
fix:
docs:
test:
refactor:
build:
ci:
chore:
```

---

# 226. Versionamiento

Semantic Versioning:

```text
0.x.x durante desarrollo

1.0.0 release final
```

---

# 227. Seguridad operacional

La infraestructura seguirá:

```text
least privilege
+
minimum exposure
+
secret separation
+
patching
+
backups
+
monitoring
```

---

# 228. Patching host

En VM Linux:

```text
security updates
```

deberán aplicarse durante mantenimiento controlado.

---

# 229. Automatic unattended upgrades

Podrán habilitarse para parches de seguridad si se valida que no reinicien servicios en momentos críticos.

No son requisito obligatorio.

---

# 230. Docker updates

No ejecutar automáticamente nuevas imágenes no probadas en producción.

---

# 231. Database updates

El proveedor administrado será responsable de infraestructura del motor.

El proyecto continúa siendo responsable de:

```text
schema migrations
+
application compatibility
```

---

# 232. Dependency security

Antes de release:

```bash
npm audit
```

podrá utilizarse como señal adicional.

No sustituye revisión.

---

# 233. SAST

GitHub CodeQL podrá incorporarse si está disponible gratuitamente para el repositorio.

No será bloqueante para Avance 1.

---

# 234. Secret scanning

Si GitHub ofrece secret scanning para el repositorio, deberá permanecer habilitado.

---

# 235. Secret leak procedure

Si una key llega a Git:

```text
1. revocar key

2. generar nueva

3. actualizar secret

4. limpiar exposición cuando sea necesario

5. investigar alcance

6. documentar incidente
```

Eliminar únicamente el archivo:

```text
NO
```

es suficiente si el secreto ya fue publicado.

---

# 236. Data minimization

Producción académica utilizará preferentemente:

```text
synthetic data
```

---

# 237. Datos personales reales

No deberán utilizarse para pruebas operativas cuando no sean necesarios.

---

# 238. Backup exposure

Nunca incluir backups en:

```text
public GitHub artifacts
public releases
Cloudflare assets
```

---

# 239. Incident levels

Clasificación simple:

```text
SEV-1
Servicio inutilizable / datos en riesgo

SEV-2
Función importante degradada

SEV-3
Problema menor
```

---

# 240. SEV-1 ejemplos

- DB inaccesible;
- autenticación completamente rota;
- secreto expuesto;
- pérdida de datos;
- acceso entre usuarios no autorizado.

---

# 241. SEV-2 ejemplos

- IA caída;
- dashboard indisponible;
- cold starts excesivos;
- monitor intermitente.

---

# 242. SEV-3 ejemplos

- error visual;
- Swagger temporalmente indisponible;
- warning no crítico.

---

# 243. Incident response

```text
Detect
  ↓
Contain
  ↓
Diagnose
  ↓
Restore
  ↓
Validate
  ↓
Document
```

---

# 244. IA como dependencia degradable

Si el proveedor IA falla:

```text
Auth
Goals
CheckIns
Analytics
SupportNetwork
```

deben continuar funcionando.

---

# 245. Failure mode frontend

Si API no responde:

```text
mostrar estado recuperable
+
permitir retry
```

---

# 246. Failure mode DB

Backend deberá:

```text
fail clearly
```

y readiness deberá indicar indisponibilidad.

---

# 247. Failure mode host

Monitor externo deberá detectar indisponibilidad cuando esté configurado.

---

# 248. Maintenance documentation

Toda operación no trivial deberá terminar incorporándose a:

```text
docs/operations/
```

si puede volver a ser necesaria.

---

# 249. No conocimiento exclusivamente mental

El proyecto no deberá depender de recordar manualmente:

- puertos;
- deployment commands;
- migrations;
- backup commands;
- URLs;
- startup order.

---

# 250. README raíz

Deberá explicar:

```text
prerequisites
setup
local run
tests
build
architecture
deployment references
```

---

# 251. Backend README

Deberá explicar:

```text
env
database
migrations
seed
tests
Docker
health
Swagger
```

---

# 252. Frontend README

Deberá explicar:

```text
Flutter version
API_BASE_URL
run
test
build Web
build Android
```

---

# 253. Operations README

Podrá existir:

```text
docs/operations/README.md
```

como índice de runbooks.

---

# 254. Avance 1

Para Avance 1 será suficiente que DevOps deje implementado:

```text
Dockerfile backend

Docker Compose local

PostgreSQL reproducible

.env.example

GitHub repository

basic CI

health endpoint

builds reproducibles
```

---

# 255. Deployment para Avance 1

Si el tiempo lo permite:

```text
public Web
+
public API
```

deberán quedar desplegados para capturar evidencia.

---

# 256. No bloquear Avance 1

No deberán bloquear la implementación funcional:

- dominio propio;
- OCI provisioning;
- monitoring avanzado;
- full CI/CD;
- dashboards externos.

---

# 257. MVP-2

Añadirá operacionalmente:

```text
AI_PROVIDER
AI_MODEL
AI_API_KEY
LLM monitoring/error handling
```

---

# 258. MVP-3

No requiere nuevos servicios de infraestructura.

`SupportRelationship` funcionará sobre:

```text
same PostgreSQL
+
same NestJS
```

---

# 259. MVP-4

Será la etapa principal para:

```text
public deployment hardening

monitoring

backups

restore test

security review

runbooks

release v1.0.0
```

---

# 260. Definition of Done DevOps v1.0.0

Se considera completa cuando:

```text
[ ] backend containerizado

[ ] Dockerfile reproducible

[ ] Compose local funcional

[ ] PostgreSQL reproducible

[ ] Flutter Web build reproducible

[ ] Android build reproducible

[ ] CI backend activo

[ ] CI frontend activo

[ ] tests antes de release

[ ] API pública HTTPS

[ ] Flutter Web público HTTPS

[ ] PostgreSQL persistente

[ ] secrets externos al repo

[ ] health endpoint público

[ ] availability monitoring configurado

[ ] logs accesibles

[ ] migrations automatizables

[ ] backup probado

[ ] restore probado

[ ] rollback documentado

[ ] runbooks disponibles

[ ] costo infraestructura = $0
```

---

# 261. Definition of Done de costo

Antes de v1.0.0 deberá verificarse:

```text
Compute            $0
Database           $0
Frontend hosting   $0
TLS                $0
CI                  $0
Monitoring         $0
Domain             $0 requerido
Container tooling  $0
```

Resultado:

```text
Total recurring infrastructure cost
=
$0
```

---

# 262. Definition of Done de publicación

Debe ser posible:

```text
navegador externo
    ↓
Flutter Web
    ↓
public HTTPS API
    ↓
PostgreSQL
```

sin:

- VPN;
- red universitaria;
- red doméstica;
- conexión local;
- túnel manual.

---

# 263. Definition of Done Android

APK instalado en dispositivo externo deberá consumir:

```text
same public HTTPS API
```

---

# 264. Definition of Done de recuperación

Se deberá demostrar al menos documentalmente y mediante prueba controlada:

```text
clean environment
   ↓
clone
   ↓
configure
   ↓
migrate
   ↓
deploy
   ↓
restore if required
   ↓
healthy application
```

---

# 265. Definition of Done de seguridad

```text
[ ] no secrets in repository

[ ] no DB port exposed

[ ] HTTPS public

[ ] CORS restricted

[ ] JWT secret external

[ ] AI key external

[ ] SSH key auth where applicable

[ ] firewall where applicable

[ ] non-root application where practical

[ ] dependency checks

[ ] backups protected

[ ] sensitive data absent from logs
```

---

# 266. Definition of Done de observabilidad

```text
[ ] frontend availability observable

[ ] API availability observable

[ ] health endpoint

[ ] backend logs

[ ] deployment logs

[ ] alert channel

[ ] troubleshooting runbook
```

---

# 267. Reglas inmutables para Codex

Codex no podrá reinterpretar:

```text
infrastructure cost = $0

Docker as backend deployment artifact

Docker Compose for reproducible local environment

public HTTPS deployment

GitHub as source of truth

GitHub Actions as CI baseline

no secrets in repository

PostgreSQL persistent

no DB in ephemeral backend filesystem

Cloudflare Pages allowed for Web

Always-Free Linux VM allowed

Render Free allowed as fallback

Neon PostgreSQL Free allowed as managed DB

same Dockerfile portable between providers

provider-specific code prohibited

health checks mandatory

logs to stdout/stderr

backup/restore required before v1

no paid autoscaling

no paid addons

no Kubernetes

no infrastructure complexity without justification
```

---

# 268. Prohibiciones

No introducir sin nuevo ADR:

```text
Kubernetes

Docker Swarm

service mesh

paid VPS

paid PostgreSQL

paid monitoring

paid logging

paid container registry

paid domain requirement

multi-region infrastructure

load balancer paid

Redis cluster

message broker

managed Kubernetes

Terraform Cloud paid services
```

---

# 269. Tecnologías aprobadas

```text
Docker
Docker Compose

Linux

Git
GitHub
GitHub Actions

Cloudflare Pages

Oracle Cloud Always Free
or equivalent eligible Linux host

Render Free
or equivalent container PaaS

Neon PostgreSQL Free
or equivalent PostgreSQL free tier

UptimeRobot Free
or equivalent uptime monitor

Caddy
or
Nginx + Let's Encrypt

pg_dump
pg_restore
```

---

# 270. Qué significa “o equivalente”

Un sustituto podrá utilizarse si:

```text
cost = $0

supports architecture

supports HTTPS

does not introduce vendor lock-in

provides sufficient limits

does not weaken security
```

---

# 271. Cambio de proveedor

Cambiar:

```text
Cloudflare → equivalent static host

Render → OCI

OCI → Render

Neon → PostgreSQL equivalent
```

no requiere nuevo ADR si:

```text
arquitectura
+
contratos
+
seguridad
+
costo cero
```

permanecen sin cambios.

Deberá actualizarse documentación operacional.

---

# 272. Cambio arquitectónico

Sí requiere nuevo ADR:

```text
PostgreSQL → different database

Docker backend → serverless functions

NestJS → different backend

Flutter direct DB access

frontend direct AI access

multiple databases

microservices
```

---

# 273. Riesgo 1 — Free tier desaparece

Mitigación:

```text
portable Docker artifact
+
two approved topologies
+
provider-independent PostgreSQL
```

---

# 274. Riesgo 2 — OCI sin capacidad

Mitigación:

```text
Topology B
Cloudflare + Render + Neon
```

---

# 275. Riesgo 3 — Render cold start

Mitigación:

```text
loading UX
+
health validation
+
optional migration to Always-Free VM
```

---

# 276. Riesgo 4 — Límite de DB

Mitigación:

- bajo volumen académico;
- datos sintéticos;
- no archivos;
- no logs persistidos en DB;
- control de crecimiento.

---

# 277. Riesgo 5 — Costos accidentales

Mitigación:

```text
free-tier gate
+
no paid addons
+
no autoscaling
+
billing review
```

---

# 278. Riesgo 6 — Secret leak

Mitigación:

```text
.gitignore
+
provider secrets
+
GitHub secret scanning
+
rotation procedure
```

---

# 279. Riesgo 7 — Deployment rompe producción

Mitigación:

```text
CI
+
backup
+
health check
+
smoke test
+
rollback
```

---

# 280. Riesgo 8 — Host perdido

Mitigación:

```text
GitHub source of truth
+
Docker
+
managed DB
+
runbooks
```

---

# 281. Riesgo 9 — Datos perdidos

Mitigación:

```text
managed persistence
+
pg_dump
+
restore test
```

---

# 282. Riesgo 10 — Monitoring mantiene viva una instancia gratuita

Mitigación:

- respetar políticas;
- revisar consumo;
- no utilizar monitor como mecanismo de evasión;
- preferir VM Always-Free si se requiere disponibilidad continua.

---

# 283. Riesgo 11 — Infraestructura demasiado compleja

Mitigación:

```text
one frontend
+
one backend
+
one database
+
one external AI provider
```

---

# 284. Consecuencias positivas

La decisión permite:

- deployment público;
- costo cero;
- experiencia DevOps real;
- Docker;
- CI;
- HTTPS;
- monitoring;
- backups;
- portabilidad;
- recuperación;
- documentación operativa;
- ausencia de dependencia física local;
- demostración Web/Android;
- migración entre proveedores.

---

# 285. Consecuencias negativas

La estrategia acepta:

- límites de free tiers;
- posible cold start;
- menor SLA;
- disponibilidad variable de VMs gratuitas;
- cuotas reducidas;
- cambios de política de terceros;
- mantenimiento manual sobre VM;
- ausencia de infraestructura de alta disponibilidad.

Estas limitaciones son aceptables para:

```text
MVP académico
```

---

# 286. Infraestructura objetivo preferida

Cuando exista capacidad Always-Free:

```text
                         ┌────────────────────────┐
                         │   Cloudflare Pages     │
                         │      Flutter Web       │
                         └───────────┬────────────┘
                                     │
                                     │ HTTPS
                                     ▼
                         ┌────────────────────────┐
                         │ Always-Free Linux VM   │
                         │                        │
                         │ Docker                 │
                         │ ┌────────────────────┐ │
                         │ │ Reverse Proxy      │ │
                         │ └─────────┬──────────┘ │
                         │           │            │
                         │ ┌─────────▼──────────┐ │
                         │ │ NestJS Container   │ │
                         │ └─────────┬──────────┘ │
                         └───────────┼────────────┘
                                     │
                                     │ TLS
                                     ▼
                         ┌────────────────────────┐
                         │ Neon PostgreSQL Free   │
                         └────────────────────────┘

NestJS
   │
   └──────── HTTPS ────────> LLM Provider
```

---

# 287. Infraestructura objetivo fallback

```text
                         ┌────────────────────────┐
                         │ Cloudflare Pages       │
                         │ Flutter Web            │
                         └───────────┬────────────┘
                                     │
                                     │ HTTPS
                                     ▼
                         ┌────────────────────────┐
                         │ Render Free            │
                         │ Docker Web Service     │
                         │ NestJS                 │
                         └───────────┬────────────┘
                                     │
                                     │ TLS
                                     ▼
                         ┌────────────────────────┐
                         │ Neon PostgreSQL Free   │
                         └────────────────────────┘

NestJS
   │
   └──────── HTTPS ────────> LLM Provider
```

---

# 288. Pipeline DevOps global

```text
Developer
    ↓
feature branch
    ↓
GitHub
    ↓
Pull Request
    ↓
┌──────────────────────────────┐
│       GitHub Actions         │
│                              │
│ Backend                      │
│ ├── lint                     │
│ ├── unit tests               │
│ ├── E2E PostgreSQL           │
│ └── build                    │
│                              │
│ Frontend                     │
│ ├── analyze                  │
│ ├── tests                    │
│ └── Web build                │
└──────────────┬───────────────┘
               │
               │ green
               ▼
              main
               │
      ┌────────┴──────────┐
      │                   │
      ▼                   ▼
Cloudflare Pages      Backend Deployment
Flutter Web           Docker
                          │
                          ▼
                     PostgreSQL
```

---

# 289. Pipeline release

```text
Code complete
    ↓
CI green
    ↓
Backup
    ↓
Migration review
    ↓
Deploy DB migration
    ↓
Deploy backend
    ↓
Health check
    ↓
Deploy frontend
    ↓
Smoke test
    ↓
External monitor
    ↓
Tag release
```

---

# 290. Flujo de recuperación

```text
Incident
   ↓
Assess
   ↓
Application problem?
 ┌───────┴────────┐
 yes              no
 │                 │
 rollback        infrastructure
 │                 │
 health          rebuild host
 │                 │
 └─────────┬───────┘
           ↓
      database intact?
       │           │
      yes          no
       │           │
       │         restore
       │           │
       └─────┬─────┘
             ↓
         smoke test
             ↓
          restored
```

---

# 291. Cost architecture

```text
GitHub repository        $0
GitHub Actions           $0
Docker                   $0
Cloudflare Pages         $0
Linux compute            $0
or Render Free           $0
PostgreSQL Free          $0
TLS                      $0
Uptime monitoring        $0
Domain requirement       $0
────────────────────────────
Infrastructure total     $0
```

La IA se controlará separadamente conforme ADR-005 y deberá permanecer dentro del presupuesto académico aprobado.

---

# 292. Estado de la decisión

```text
ACEPTADA PARA IMPLEMENTACIÓN
```

---

# 293. Política de modificación

Cualquier cambio que introduzca:

```text
costo obligatorio
+
nueva infraestructura persistente
+
nueva dependencia operacional
+
nuevo componente de red
+
nuevo mecanismo de deployment
```

deberá evaluarse contra este ADR.

Si altera significativamente la arquitectura:

```text
nuevo ADR
```

será obligatorio.

---

# 294. Resumen de decisiones

```text
Monorepo GitHub

Dockerized NestJS

Docker Compose local

Flutter Web static hosting

PostgreSQL managed free tier preferred

Always-Free Linux VM preferred for permanent backend

Render Free accepted as deployment fallback

Cloudflare Pages preferred for Flutter Web

Neon Free preferred as managed PostgreSQL candidate

GitHub Actions for CI

HTTPS mandatory

provider-managed TLS preferred

Uptime monitoring free

health endpoints

stdout/stderr logs

secrets outside repository

pg_dump / restore

rollback documented

two deployment topologies

provider independence

cost = $0
```

---

# 295. Filosofía DevOps de NeuroConnect v1.0.0

> **La infraestructura de NeuroConnect deberá ser tan reproducible como su código: el backend se empaqueta en Docker, GitHub conserva la fuente de verdad, CI valida cada versión, PostgreSQL conserva los datos fuera del ciclo de vida del contenedor y el despliegue puede migrarse entre infraestructura gratuita sin modificar la aplicación. La operación académica prioriza seguridad, observabilidad, recuperación y portabilidad, pero mantiene como restricción explícita que la infraestructura completa pueda publicarse y mantenerse con una inversión obligatoria de cero pesos.**
