# AVANCE1_CLOSEOUT_REPORT

## Sprint / Branch / Base / Scope

- Sprint: AVANCE-1-CLOSEOUT, iniciado 2026-10-15.
- Branch: `sprint/avance1-closeout`, creada directamente desde `origin/main`.
- Base commit: `d3920d955956263b3baac72d0dd4a350e697df9e` (merge humano PR #4).
- Primer commit: `4152bf6`, únicamente el plan humano existente, sin editarlo.
- Scope: correcciones semánticas CHECKIN_VOIDED/averageProgress, auditoría de dependencias, CI general, metadata Flutter y sincronización documental. Sin nuevas capacidades ni IA real.
- Status: **READY_FOR_HUMAN_VALIDATION**. **AVANCE 1 — CLOSED** técnicamente;
  aceptación humana de este sprint pendiente. MVP0/1/1.5DONE; MVP2STARTED foundation;
  MVP3coreADVANCED THROUGH MVP1.5; MVP4PENDING. No v1.0.0DONE.
- Validated commit: `884fc2fbaca97218957d56bbfdc791e7621e6f1a`, contiene todos los
  cambios ejecutables y los gates CI backend/frontend verdes. Cambios posteriores
  son exclusivamente documentación de cierre.
- Final commit: commit documental final que contiene este reporte, resoluble con
  `git log -1 --format=%H -- harness/codex/AVANCE1_CLOSEOUT_REPORT.md` y `git rev-parse HEAD`
  en la entrega. No se incluye el hash del propio commit en su contenido porque lo
  alteraría. El SHA concreto de entrega se informa en el handoff final.

## Baseline antes de modificar código

Inspeccionados working tree, remote, ramas e historial. Único cambio inicial:
`docs/Planeacion/avance1-closeout.md` sin seguimiento; preservado y versionado.
Los commits de MVP-1.5 permanecen como ancestros de la nueva rama. Leídos los
reportes MVP0, MVP1, MVP2_AVANCE1 y MVP15 y contratos operativos existentes.

| Gate | Baseline |
| --- | --- |
| Backend lint | PASS |
| Backend unit | PASS: 67 / 4 suites |
| Backend E2E / build | PASS: 72 E2E / 4 suites; build PASS |
| Flutter analyze | PASS: sin incidencias |
| Flutter test / web build | PASS: 25 tests; Web build 214.2s |
| Migrations PostgreSQL vacía | PASS: 4 migrations |
| Seed dos veces | PASS: 3 usuarios, 5 Goals, 25 CheckIns, 2 relaciones, 37 eventos estables |
| Seed API | PASS: baseline averageProgress 55.4 |
| Backend Docker | PASS |
| Frontend Docker / Compose / smoke | PASS: ambas imágenes; 3 servicios healthy; full HTTP smoke PASS |
| npm audit --json | 38 paquetes afectados: 6 moderate / 32 high |
| npm audit --omit=dev --json | 5 paquetes afectados: 2 moderate / 3 high |

Salidas JSON iniciales conservadas localmente en `tmp/avance1-closeout/`, ignoradas
por Git. Los conteos incluyen propagación transitiva; no equivalen a 38 advisories
distintos. Ninguna corrección de código aplicada antes de completar baseline.

## CHECKIN_VOIDED correction

Commit `72d0b7c`. El progreso original se lee antes de invalidar, bajo el bloqueo
del Goal. Lectura, voidedAt, recálculo y appendAudit permanecen en la misma
transacción. El payload nuevo contiene goalId, goalTitle, voidedProgress y
resultingGoalProgress; elimina el campo ambiguo progress. Prueba E2E:40→70→void70
conserva el CheckIn70, restaura Goal40 y audita70/40. La allowlist unitaria rechaza
notes, hashes, tokens y campos de otras acciones. Activity expresa ambos porcentajes
en español y admite eventos históricos mediante el mensaje genérico anterior.
No se reescriben eventos ni migrations; rollback y append-only PostgreSQL siguen
probados en la suite existente.

## averageProgress / Analytics / AI Preview

Commit `a290600`. EligibleGoals=ACTIVE+PAUSED+COMPLETED. Promedio sobre elegibles,
redondeado a dos decimales; ningún elegible→0. CANCELLED sigue en totalGoals;
completionRate conserva su denominador elegible. Fixture80/40/100/CANCELLED10
produce73.33, total4 y completionRate33.33. Solo cancelados→promedio0.

Unitarias verifican cálculo puro e inmutabilidad; E2E comprueba Analytics y preview
sobre PostgreSQL con los cuatro estados, después todos cancelados. El spy confirma
que el proveedor no es invocado y AISummary no crece. ContextBuilder únicamente
copia Analytics, sin cálculo paralelo; unit test lo prueba con73.33 frente a una
lista de Goals distinta. Dashboard muestra73.33% recibido, total4/cancelados1;
no divide el promedio por totalGoals. No IA real, SDK, claves, red externa ni UI IA.
Seed API esperado cambia55.4→60.5, sin modificar datos sintéticos existentes.

## Dependency audit / updates / unresolved

Commit `b6fad06`; detalle completo en `docs/security/DEPENDENCY_AUDIT_AVANCE1.md`.
Cuatro advisories raíz iniciales, todos evaluados con fuentes enlazadas y código
instalado. Único cambio de lock: js-yaml5.3.0→5.4.3, override menor limitado a Swagger.
Inicial completa6moderate/32high; final5moderate/32high (37 paquetes). Runtime
inicial2moderate/3high; final0moderate/3high. Los3high runtime provienen de un único
advisory deepmerge-ts, propagado a Prisma/config. Permanece físicamente como tooling
de migración, sin ruta HTTP a configuración cíclica. Riesgo residual aceptado
temporalmente y reevaluación obligatoria antes de producción/MVP-4 o nueva entrada
de configuración no confiable. Braces/sprintf dev no alcanzables en runtime y sin
parche compatible; no majors/force/downgrades. No se reclama audit=0.

## CI generalization / Flutter metadata

Commit `6313402`: push y pull_request para todas las ramas, sin lista histórica;
conserva npm ci/Prisma/migrate/lint/unit/E2E/build/Docker y Flutter pub/analyze/test/
web/Docker, permisos contents:read y ausencia de secretos IA.
Commit `beb083b`: name neuroconnect, description NeuroConnect — Red Inteligente de
Apoyo, version0.1.0+1, private publish_to:none; comentarios boilerplate eliminados.
No cambios de navegación, estado, dependencias Flutter o rediseño.

## Documentary synchronization / decisions

- README incluye ADR001–008 por finalidad; posteriores prevalecen solo sobre puntos
  explícitamente modificados.
- ROADMAP conserva el plan/cronograma original y agrega ESTADO REAL: MVP0/1/1.5DONE,
  MVP2STARTED foundation, MVP3coreADVANCED THROUGH MVP1.5, MVP4PENDING. Separa Avance2
  futuro (investigación, matriz, benchmark, spike, decisión, proveedor, AISummary/UI).
- MVP15_REPORT conserva su historia pre-merge y añade aceptación humana del PR#4,
  merge d3920d9 y PASS local. HUMAN_ACCEPTED aplica solo al bloque anterior.
- docs/AVANCE-1 conserva el corte inicial y explica el adelanto deliberado MVP1.5
  por progreso superior al cronograma, con resultado real separado del plan inicial.
- actorId==ownerId: DECISION ACCEPTED FOR V1; firma de appendAudit sin refactor.
  Trigger: cualquier mutación actorId!=ownerId (admin, supporter escritor, sistema,
  worker). Owner-only actual y supporter read-only sostienen la decisión.
- release-check.yml: DEFERRED→MVP4; readiness incluye CI, Android, migrations,
  seguridad, Docker artifacts, backup/restore, release metadata. No workflow añadido.
- ADRs, HARNESS, plan operativo anterior y documento humano del sprint sin cambios.

## Final regression results

| Gate | Resultado |
| --- | --- |
| npm run lint | PASS |
| npm test | PASS:70 /5 suites |
| npm run test:e2e | PASS:73 /4 suites, PostgreSQL16 |
| npm run build | PASS |
| flutter analyze | PASS, sin incidencias |
| flutter test | PASS:27 |
| flutter build web | PASS:291.9s, Wasm dry run PASS |
| npm run smoke:migrations | PASS:4 migrations desde DB vacía, seed dos veces |
| npm run smoke:seed | PASS:5Goals/25CheckIns, averageProgress60.5 |
| Docker backend/frontend / Compose | PASS:ambas imágenes;3servicios healthy |
| Container seed / full HTTP smoke | PASS:core/support/audit/AI y contratos70/40,73.33 |
| Backend CI / Frontend CI | PASS: ambos sobre884fc2f, enlaces abajo |

Swagger JSON y YAML HTTP200; frontend /healthz HTTP200. Imagen final confirma
js-yaml5.4.3 y ausencia de jest/braces/sprintf-js. Audit de texto final ejecutado
también sin --json: ambos comandos devuelven1 por advisories conocidos (no ocultos).
El build Docker del frontend usa pubspec con los mismos campos; después solo se
normalizaron líneas vacías de YAML para git diff --check, sin cambio de metadata.
Los servicios permanecen activos para validación humana y el volumen se conserva.

## Remote CI / delivery

- [Backend CI PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38711095196)
  sobre `884fc2fbaca97218957d56bbfdc791e7621e6f1a`: npm ci, Prisma/migrations,
  lint,70unit,73E2E,build,Docker.
- [Frontend CI PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38711095122)
  sobre el mismo SHA: pub lock, analyze,27tests,Web y Docker.
- La rama nueva recibió automáticamente ambos workflows por push: verificación real
  de generalización. El commit final documental vuelve a dispararlos; se comprueba
  su conclusión en el handoff sin modificar producto ni requisitos.
- Resultados del HEAD entregado: [Backend branch CI](https://github.com/CarlosAM03/neuro-connect/actions/workflows/backend-ci.yml?query=branch%3Asprint%2Favance1-closeout),
  [Frontend branch CI](https://github.com/CarlosAM03/neuro-connect/actions/workflows/frontend-ci.yml?query=branch%3Asprint%2Favance1-closeout).
- Publicación exclusiva de `origin/sprint/avance1-closeout`; sin push de main,
  merge, auto-merge, rebase, amend, force, tags, releases ni intento de crear PR.
  Main aceptado sigue d3920d9 al cierre del trabajo.
- [Compare para PR humano](https://github.com/CarlosAM03/neuro-connect/compare/main...sprint/avance1-closeout?expand=1).
  Título/body completos en `harness/codex/AVANCE1_CLOSEOUT_PR.md`.
- `git diff --check` PASS; working tree limpio al publicar, y se vuelve a verificar
  tras el commit documental final. Plan humano idéntico a4152bf6, ADRs intactos.

## Hallazgos cerrados / Definition of Done técnico

- [x] CHECKIN_VOIDED, allowlist, Activity y pruebas corregidos; semántica70/40.
- [x] averageProgress elegible, solo cancelados0, totalGoals conservado;73.33.
- [x] Analytics, Dashboard y AI Preview regresión PASS.
- [x] npm audit completo/runtime, todos los advisories evaluados, fix compatible y documento.
- [x] CI en ramas futuras demostrado; Backend y Frontend CI PASS.
- [x] README/ROADMAP/MVP15 post-merge/AVANCE1 sincronizados, sin borrar historia.
- [x] release-check diferido explícitamente MVP4; actorId aceptado con trigger.
- [x] Metadata Flutter limpia sin refactor funcional.
- [x] Backend lint/unit/E2E/build PASS; Flutter analyze/test/Web PASS.
- [x] Migrations DB vacía y seed repetido PASS; full container HTTP smoke PASS.
- [x] Ambas imágenes Docker y Compose PASS; PostgreSQL/backend/frontend healthy.
- [x] diff --check PASS; publicación de rama con working tree limpio verificada.

Checklist técnica completada por evidencia automática; no significa aceptación
humana del sprint. La checklist manual final permanece sin marcar para el autor.

Las14 respuestas500 con PrismaClientUnknownRequestError durante E2E son fallos de
auditoría inyectados deliberadamente: verifican rollback atómico. Ningún test
desactivado o eliminado. Gates baseline antes de código y gates finales separados.

## Database / migrations / seed

Sin cambios de schema ni nuevas migrations. Las4 existentes se aplican desde una DB
sintética vacía, creada con nombre neuroconnect_migration_*_test y eliminada por el
script al terminar. Nunca se resetea el volumen local. Seed repetido conserva3users,
5Goals,25CheckIns,2relaciones y37AuditEvents idénticos; incluye ACTIVE/COMPLETED/
CANCELLED y supporters con permisos diferenciados. Historial humano preservado.

## Files changed

Listado exhaustivo reproducible:
`git diff --name-status d3920d955956263b3baac72d0dd4a350e697df9e...HEAD`.
Backend: CheckInsService, audit helper/test, Analytics rules/DTO/tests, AI pipeline
test, E2E AI/support, seed-smoke/full smoke y package/lock. Flutter: Activity formatter,
support/analytics/fixture tests y pubspec metadata. Workflows: backend/frontend.
Docs: plan humano incorporado, README, ROADMAP, AVANCE-1, architecture/API y decisiones,
seguridad, post-merge MVP15 y reporte/body PR del sprint. Sin archivos temporales,
.env, claves ni credenciales versionadas. Artefactos antiguos ignorados conservados.

## Known limitations / deferred work

Runtime high=3 evaluados, no corregibles dentro de Prisma6 compatible. Audit completo
no es verde y no se presenta como tal. Prisma avisa de package.json#prisma deprecado
para major7; no se cambia ORM/config por ese aviso. No despliegue público, Android
final, release-check, backups productivos ni MVP4hardening. No investigación/modelos,
proveedor externo, AISummary productivo, UI IA o nuevas funciones de soporte.
No tags/releases. PR exclusivamente humano; no se intenta crearlo por ningún medio.
Aceptación local/revisión/merge de este sprint pendientes del responsable.

## Human smoke commands

Desde la raíz, PowerShell (preserva .env existentes):

```powershell
git switch sprint/avance1-closeout
if (-not (Test-Path .env) -and -not (Test-Path backend/.env)) { node infra/setup-local.cjs }
docker compose up -d --build --wait
docker compose exec -T backend node seed-dist/seed.js
docker compose exec -T backend node scripts/smoke.cjs
docker compose ps
```

Abrir http://127.0.0.1:5173 y http://127.0.0.1:3000/api/docs. Usar demo y supporters
del seed con SEED_PASSWORD local; no copiar secretos al reporte/PR. El smoke crea y
limpia exclusivamente sus propias cuentas sintéticas y prueba ambos contratos nuevos.
Para gates host desde clon nuevo: npm ci/Prisma generate, node infra/setup-test.cjs
y comandos de las tablas desde backend/app. DB de tests siempre separada *_test.

## Human Validation Checklist

- [ ] Revisar corrección void 70 → snapshot 40 y Activity nueva/histórica.
- [ ] Confirmar CheckIn70 retenido y excluido de historia efectiva; evento nuevo sin progress ambiguo ni notes.
- [ ] Confirmar Activity antigua no inventa porcentaje invalidado a partir del snapshot histórico.
- [ ] Revisar promedio elegible 73.33 y mismo valor en AI Preview.
- [ ] Confirmar total4, cancelados1 y cumplimiento33.33; solo cancelados→promedio0.
- [ ] Confirmar Dashboard reproduce73.33% y preview mantiene providerConfigured=false.
- [ ] Revisar auditoría de seguridad y excepciones documentadas.
- [ ] Revisar js-yaml5.4.3 y riesgo residual Prisma antes de considerar producción.
- [ ] Reproducir Compose, seed y smoke completos.
- [ ] Abrir Web/Swagger y verificar privacidad/read-only Owner/Supporter sin regresión.
- [ ] Revisar separación plan original/ejecución real y aceptación previa MVP1.5.
- [ ] Confirmar release-check→MVP4 y trigger futuro de actorId sin ampliación del scope.
- [ ] Revisar CI final y documentación de cierre antes del PR humano.
