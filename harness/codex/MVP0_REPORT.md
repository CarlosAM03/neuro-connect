# MVP0_REPORT — NeuroConnect

## Block / Branch / Base commit / Final commit

- Block: Bloque 1 — Repository Foundation + MVP-0.
- Branch: `mvp0`, creada directamente desde `origin/main` tras fetch.
- Base commit: `ef60051cc456a563163ac194b30e190000d8940a`.
- Final commit: commit documental final que contiene este reporte. Implementation commit validado: `9f7f72fd18081fc03e97d6906b3bcbfe0507f288`. Después del handoff se resuelve sin ambigüedad con `git log -1 --format=%H -- harness/codex/MVP0_REPORT.md`; el hash de un commit no puede incluirse dentro de su propio contenido.
- Status: READY_FOR_HUMAN_VALIDATION.
- Fecha de ejecución: 14 de octubre de 2026, America/Tijuana.

## Scope / Implemented

Foundation reproducible y flujo real register → login → profile → Goal CRUD/lifecycle → CheckIn → Goal.progress → history. Backend NestJS, PostgreSQL 16/Prisma, Flutter Web, ownership, validación, pruebas y documentación operativa. No se modificaron ADRs, roadmap, plan ni HARNESS.

## Not implemented

Analytics/MVP-1, Dashboard, tendencias calculadas, IA/AiModule/MVP-2, AISummary, SupportNetwork/MVP-3, producción y hardening de MVP-4. Sin refresh tokens, verificación de correo o recuperación de contraseña conforme ADRs. fl_chart está instalado por Foundation, sin implementar gráficas. APK/iOS no compilados en este bloque. Los entregables académicos completos de Avance 1 y su evidencia de Analytics/IA corresponden a bloques siguientes.

## Repository Foundation implemented

- Monorepo `backend/`, `app/`, `infra/`, `docs/architecture/`, `.github/workflows/`.
- Node 22.16.0 fijado en .nvmrc y Docker; npm package-lock versionado.
- Flutter 3.47.5 / Dart 3.13.4 y pubspec.lock; proyectos Web, Android, iOS.
- ConfigModule validado, PrismaService único, ValidationPipe global estricto, health/readiness, CORS, Helmet, Swagger.
- PostgreSQL 16 en Compose con healthcheck, named volume y puerto de host loopback 5434.
- Docker multistage, runtime non-root, sin secretos ni tests en imagen final.
- CI backend con PostgreSQL 16; CI frontend con analyze/tests/web build.
- Setup local genera credenciales aleatorias en archivos ignorados sin imprimirlas; setup test crea una DB separada.
- Gate Foundation ejecutado antes de implementar lógica funcional: todos los checks iniciales pasaron.

## Backend implementation

AuthModule: Argon2id, normalización trim/lowercase de email, JWT HS256 con sub/iat/exp y duración configurable, Passport JWT, guard global privado por defecto, endpoints públicos explícitos, throttling de registro/login (20/min por ruta/IP). Registro devuelve un usuario seguro; login devuelve accessToken; auth/me restaura identidad.

UsersModule: GET/PATCH users/me; solo displayName editable. Proyección segura id/email/displayName/timestamps; nunca passwordHash. No directorio público ni roles globales.

GoalsModule: crear, listar, detalle, actualizar metadata/status, eliminar. Defaults ACTIVE/0; API rechaza progress/ownerId/timestamps. Transiciones ACTIVE→PAUSED/COMPLETED; PAUSED→ACTIVE/COMPLETED; COMPLETED→ACTIVE. Misma transición de estado es idempotente. Completar no requiere 100%; llegar a 100% no completa automáticamente.

CheckInsModule: rutas anidadas create/history/detail/delete; no edición. Solo ACTIVE acepta creación. DTO entero progress 0..100, difficulty 1..5, enum completion y notes opcionales. Cada query valida owner y parent goal; recursos ajenos responden 404. Historial privado con fecha/dificultad/cumplimiento/notes.

Goal lifecycle, eliminación y mutaciones de CheckIn adquieren el mismo bloqueo PostgreSQL FOR UPDATE sobre el objetivo, dentro de Prisma $transaction. Crear registro y actualizar snapshot es atómico. Eliminar recalcula desde el último restante, o 0. Timestamps de creación monotónicos por objetivo resuelven solicitudes dentro del mismo milisegundo. Prisma tiene maxWait 10s / timeout 15s explícitos.

Errores consistentes statusCode/code/message/path/timestamp. No stacks, passwords, tokens ni notes en respuestas de error/logs. Swagger documenta Bearer, DTOs, parámetros, recursos de respuesta y errores. Health público, readiness comprueba SELECT 1 sin filtrar infraestructura.

## Frontend implementation

Material 3, español y localización de controles Material. Feature-first con repositorios, Riverpod y go_router; widgets no usan Dio directamente. Sesión inicial desconocida/loading, no autenticada o autenticada. Restore utiliza /auth/me; un 401 privado elimina token y cambia sesión. Fallo temporal permite reintento explícito sin borrar un token potencialmente válido. Web: sessionStorage; móvil: flutter_secure_storage. Logout elimina token y los providers privados reaccionan al cambio de identidad.

Pantallas: Register/Login, Profile read/update/logout, Goals list/create/edit/detail, lifecycle, CheckIn create/history/delete. Loading/error/retry/empty states, submit deshabilitado mientras guarda, formularios validados, progreso no editable en Goal. Eliminar objetivo o registro requiere confirmación que explica cascada/cambio de snapshot. PAUSED/COMPLETED deshabilitan CheckIn y explican reactivación. API_BASE_URL se configura con dart-define; el backend sigue siendo la autoridad.

## Database changes / Migrations

`backend/prisma/schema.prisma`: User, Goal, CheckIn; enums GoalStatus y CheckInCompletion. UUID, TIMESTAMPTZ(3) UTC, email unique, cascadas, índices de owner/status y goal/createdAt. Sin tablas de funcionalidades futuras.

Migración `20261014000100_mvp0_core`: tablas/enums/FKs/índices y CHECK SQL independientes sobre Goal.progress, CheckIn.progress y difficulty. Aplicada desde cero en la DB local inicialmente vacía y en neuroconnect_test inicialmente vacía. `prisma migrate deploy` también se repitió sin pendientes. No se modificó una DB productiva ni se usó SQLite.

## Seed

`backend/prisma/seed.ts`, ejecución explícita, bloqueado con NODE_ENV=production. SEED_PASSWORD externo. Cuenta demo@neuroconnect.local, tres objetivos con IDs determinísticos y cinco check-ins cada uno. Fechas relativas al día UTC actual distribuidas en semanas; datasets crecientes, estables y sin actividad reciente, preparados para MVP-1 sin calcular Analytics. Reejecutar reemplaza únicamente esos tres historiales demo y no toca usuarios/objetivos ajenos. Ejecutado dos veces; verificado 3 Goals/15 CheckIns y snapshots consistentes.

## Files changed

Principales: compose.yaml, .env.example, .gitignore/.gitattributes/.nvmrc, infra/setup-local.cjs, infra/setup-test.cjs, workflows CI; backend package/lock/tsconfig/eslint/Dockerfile, prisma schema/migration/seed, src config/bootstrap/health/auth/users/goals/check-ins/common/prisma, test E2E/smoke; app proyectos de plataforma, lib app/core/features, test/widget_test.dart, pubspec/lock y Web metadata; README y docs/architecture/{ARCHITECTURE,DATA_MODEL,API}.md; este reporte.

Lista exhaustiva reproducible: `git diff --name-status ef60051cc456a563163ac194b30e190000d8940a...mvp0`.

## Dependencies added

Backend runtime (lock): Nest common/core/platform-express 11.2.7, config 4.0.4, jwt 11.0.2, passport 11.0.5, swagger 11.4.7, throttler 6.7.1; Prisma/client 6.19.3, argon2 0.44.0, class-transformer 0.5.1, class-validator 0.14.4, helmet 8.3.0, passport 0.7.0/passport-jwt 4.0.1, reflect-metadata 0.2.2, rxjs 7.8.2. Tooling: TypeScript 5.9.3, Jest 29.7.0/ts-jest 29.4.14, supertest 7.3.1, tsx 4.23.15, ESLint/typescript-eslint/Prettier y tipos correspondientes.

Flutter lock: flutter_riverpod 3.4.3, go_router 18.0.2, Dio 5.11.1, fl_chart 1.2.0, flutter_secure_storage 11.2.0, web 1.1.1, flutter_localizations (SDK), flutter_lints 6.0.0. Sin servicios externos pagos.

## Implementation Decisions / Deviations

- Jerarquía HARNESS aplicada; las ambigüedades del plan sobre edición directa de progress se resuelven con ADR-002 §16: prohibida.
- Delete CheckIn incluido por ADR-002 §35 / ADR-003 §56, aunque ADR-001 menciona MVP-1 y el plan lo permite provisionalmente; no agrega edición del historial.
- UI/history API newest-first conforme ADR-003/004; timestamps mantienen secuencia histórica.
- Solo entidades MVP-0; no AiModule/Analytics/SupportNetwork ni tablas futuras.
- Puerto Web 5173 tras fallo de bind de Windows en 8080; CORS permite localhost/127.0.0.1 configurados. No se modificaron protecciones de Windows.
- PR/push mvp0 expresamente autorizados por activación; main no se modificó ni se fusionó.
- No contradicción documental irresoluble ni cambio de arquitectura. Reporte operativo, no ADR.

## Tests executed / Test results / Build results

| Gate | Resultado final |
| --- | --- |
| npm run lint | PASS |
| npm test | PASS — 13 tests, 2 suites |
| npm run test:e2e | PASS — 35 tests, PostgreSQL 16 real |
| npm run build | PASS |
| flutter analyze | PASS — sin incidencias |
| flutter test | PASS — 10 tests |
| flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1 | PASS |
| Prisma generate/migrate deploy | PASS; migraciones desde cero y repetición |
| npm run seed (dos veces) | PASS; 3 objetivos/15 registros/snapshots correctos |
| Docker build / Compose completo | PASS; PostgreSQL/backend healthy |
| npm run smoke | PASS — live HTTP, dos usuarios, limpieza |
| Flutter run -d web-server, puerto 5173 | PASS; cliente servido y conectado a API |

E2E cubre: Argon2id/proyección segura, JWT expirado/inválido, DTO/mass assignment, perfil, CRUD, defaults, todos los accesos cruzados, parent binding, lifecycle, 100% independiente, límites numéricos/enum, historial, recálculo por borrado, creación concurrente y carrera lifecycle/CheckIn, cascadas y CHECK SQL. No mocks de DB. Las cuentas E2E son únicas y se limpian.

Flutter cubre: ausencia/restauración/token inválido, login/logout/limpieza privada, error temporal y reintento, bootstrap sin mostrar datos privados, validación/navegación de registro, editor sin progreso, historial/CheckIn deshabilitado para PAUSED, formulario ACTIVE con límites.

Fallos intermedios corregidos: conflicto de container-name por dos invocaciones Compose superpuestas durante descarga inicial (repetición secuencial PASS); Docker build con cwd/context incorrecto (context raíz corregido, PASS); timeout de transacciones concurrentes Prisma (límites explícitos, PASS); lint de runner CommonJS (configuración de globals/ámbito correcta, PASS); análisis Flutter de estilo/context async (corregido); restauración Riverpod con retries automáticos ante 503 (retry explícito, prueba PASS); Flutter bind 8080 rechazado por Windows (5173 PASS); primer smoke antes de que acabara arranque Docker (repetido tras healthy, PASS). El primer stop Docker terminó backend en 137 porque un shell no transmitía SIGTERM; se cambió el comando Compose a exec node, se repitieron startup/smoke/stop y ambos servicios salieron con código 0. No tests eliminados o requisitos debilitados.

## Docker validation

`docker build -t neuroconnect-backend:mvp0 ./backend` y `docker compose --profile full up -d --build --wait` ejecutados. PostgreSQL identificado como 16.15. Backend aplica migraciones versionadas y usa exec node para recibir SIGTERM antes de servir; runtime non-root, Prisma generado en build, compiled JS y dependencias runtime. Health/readiness y smoke HTTP PASS. Al cerrar se detuvieron backend/PostgreSQL con compose stop y Flutter con q; el volumen permanece para repetición local; no se borraron volúmenes con datos reales. Setup de la base test es independiente.

## Smoke test results

- HTTP live con dos cuentas: register/login/auth-me/profile update, Goal create/read/list/update/delete, dos CheckIns, progress/history/detail, PAUSED/COMPLETED rechazan, reactivación, borrado del último y snapshot anterior, aislamiento 404 y auth 401. Limpia sus propias cuentas/objetivos.
- Navegador Flutter real (127.0.0.1:5173, API Compose real): PASS — registro, login, recarga restaura sesión, perfil consultado/actualizado, Goal create/detail/edit/list, CheckIn al 50%, historial con notes, PAUSED y COMPLETED deshabilitan nuevos CheckIns, reactivación, confirmaciones de eliminación, borrar último CheckIn restaura 0%, Goal delete, logout y recarga permanecen en login. Verificación adicional de DB confirmó displayName actualizado y cero Goals tras borrar; se limpió exclusivamente la cuenta sintética UI. Sin datos privados visibles después de logout. Servicios cerrados con exit 0; Flutter terminó con q.

## Known limitations / Technical debt / Known issues

- Validación humana definitiva pendiente; no se declara HUMAN ACCEPTED.
- npm audit final runtime: 5 avisos (3 high: prisma/@prisma/config/deepmerge-ts; 2 moderate: swagger/js-yaml). Audit completo: 38 (6 moderate/32 high), mayormente tooling Jest/transitivas. Prisma se actualizó a 6.19.3 y se intentó audit fix compatible; los restantes proponen cambios incompatibles. No se hizo force ni cambio de stack. Revisar antes de un release público; hardening/producción fuera de MVP-0. Estos avisos no impidieron los gates funcionales locales.
- Node 22.16.0 y ESLint 9 fijados y verificados; actualización de toolchain/dependencias para release queda pendiente.
- JWT sin revocación del servidor/refresh conforme ADR. sessionStorage no es un keystore Web; móvil usa almacenamiento seguro.
- Sin paginación en listas/historial para el MVP académico; pendiente si volumen futuro lo requiere.
- SDK iOS/build APK y deploy público no verificados; proyectos generados presentes.
- Sin licencia nueva seleccionada por el agente; roadmap muestra LICENSE como estructura objetivo, pero no define autorización de licencia. No se inventó un permiso de redistribución.
- Ningún blocker funcional conocido al finalizar los gates; avisos y límites registrados para revisión.

## Comandos para validación humana local

PowerShell, desde un clon limpio:

```powershell
git clone --branch mvp0 https://github.com/CarlosAM03/neuro-connect.git
cd neuro-connect
node infra/setup-local.cjs
docker compose up -d --wait postgres
cd backend
npm ci
npm run prisma:generate
npm run migrate:deploy
npm run seed
cd ..
node infra/setup-test.cjs
docker compose --profile full up -d --build --wait
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
npm run smoke
cd ../app
flutter pub get --enforce-lockfile
flutter analyze
flutter test
flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=5173 --dart-define=API_BASE_URL=http://localhost:3000/api/v1
```

Abrir http://127.0.0.1:5173 y http://localhost:3000/api/docs. Crear cuenta propia de prueba o entrar como demo@neuroconnect.local usando SEED_PASSWORD de backend/.env. No compartir ese archivo. Repetir el checklist. Para backend sin Docker: parar solo backend Compose y usar `npm run start:dev` desde backend. No ejecutar ambos sobre puerto 3000.

Al terminar Flutter: `q`. Desde raíz: `docker compose --profile full stop` (conserva datos). No se necesita down -v. Setup se niega a sobrescribir archivos .env existentes; para configuración existente conservar sus credenciales y ajustar CORS/puertos manualmente con los ejemplos.

## Human Validation Checklist

- [ ] clean clone / environment works
- [ ] PostgreSQL starts
- [ ] migrations apply
- [ ] seed works
- [ ] backend starts
- [ ] Flutter starts
- [ ] registration works
- [ ] login works
- [ ] session restore works
- [ ] logout works
- [ ] profile works
- [ ] Goal create works
- [ ] Goal list works
- [ ] Goal detail works
- [ ] Goal update works
- [ ] Goal delete works
- [ ] Goal lifecycle works
- [ ] PAUSED rejects CheckIn
- [ ] COMPLETED rejects CheckIn
- [ ] CheckIn creation works
- [ ] Goal.progress updates correctly
- [ ] history works
- [ ] user isolation works
- [ ] Swagger/OpenAPI works
- [ ] backend automated tests pass
- [ ] Flutter tests pass
- [ ] Flutter Web build passes
- [ ] Docker / Compose reproducibility validated
