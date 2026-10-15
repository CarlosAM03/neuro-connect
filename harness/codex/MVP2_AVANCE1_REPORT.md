# Bloque 3 — estabilidad e inicio MVP-2

- Block: cierre técnico Avance 1.
- Branch: mvp2-avance1, creada directamente de origin/main después de fetch y fast-forward local seguro.
- Base commit: dcc91e24fdf5ad338159e67cb72374eb805f2a78, merge humano PR #2; PR #1 también presente.
- Final commit: commit documental final que contiene este reporte; resolver con `git log -1 --format=%H -- harness/codex/MVP2_AVANCE1_REPORT.md`. Implementation commit validado: `5597689bebf57d3915c7c992a33a5e43d0abda04`. El hash de un commit no puede incluirse dentro de su propio contenido.
- Status técnico: READY_FOR_HUMAN_VALIDATION. Entrega Git/PR y CI remoto: pendientes de publicación al completar handoff; se actualizarán aquí con evidencia real.
- Fecha de validación: 14 de octubre de 2026, America/Tijuana. Node22.16.0, Flutter3.47.5/Dart3.13.4, PostgreSQL16, Docker Desktop Linux containers.

## Stabilization performed

Baseline antes de IA: lint/backend34unitarias/build PASS; Flutter analyze/15tests PASS; Compose tres servicios healthy,48E2E PostgreSQL real,seed y smokes MVP-0/MVP-1/aislamiento2usuarios/seed PASS. Navegador register/login/vacío/Goal/CheckIn35/snapshot/history/Analytics/insuficiente/gráfica PASS. No cambios de aplicación previos a validar regresión horizontal. Sin defectos funcionales detectados en esta baseline.

Docker Desktop no iniciaba por engine.sock IPC obsoleto (cero bytes, reparse point). Diagnóstico corroborado con log local y https://github.com/docker/for-win/issues/15064. Docker detenido mediante CLI; directorio que contenía SOLO ese socket preservado como C:/Users/Carl0/AppData/Local/docker-secrets-engine.mvp2-avance1-backup-20261014, sin borrar ni leer secretos/volúmenes. Docker recreó el directorio y engine29.8.1 volvió a responder. No reset de fábrica ni actualización manual.

## Implementation Decisions

- AISummary scaffold requerido físicamente por PLAN §7.4 y ADR-001 §§27–33: schema/migration/índices/FK, sin generar/persistir resúmenes desde preview ni exponer CRUD productivo.
- AI Preview exclusivamente API/Swagger, sin nueva pantalla Flutter: ADR-004 §119 y plan §26.
- Preview requiere JWT, owner actual y AI_PREVIEW_ENABLED; providerConfigured=false. Sin proveedor real, API key ni benchmark.
- SummaryContextBuilder consume Analytics, proyecta whitelist de métricas/títulos/estado y flag insufficientHistory; no notes, email, IDs ni credenciales.

## Scope / MVP-0 regression result / MVP-1 regression result

MVP-0 DONE y MVP-1 DONE se refieren a entregables integrados por el humano en PR#1/#2, con regresión técnica verificada antes y después de iniciar IA. MVP-2 queda STARTED, sin porcentaje global inventado ni aceptación humana de este bloque. Sin refactor amplio de UI/dominio.

Regresión MVP-0: Auth/Users/Goals/CheckIns/DTOs/ownership/lifecycle/progress/history conservados; 35 E2E y 13 unitarias previas continúan pasando. Regresión MVP-1: 13 E2E y21 unitarias previas, overview/trends/timeline/aislamiento conservados. Flutter mantiene sus15 tests (núcleo+analytics/loading/vacío/error-retry/insuficiente). No cambió código Flutter.

## Issues found and fixes applied

Los primeros intentos Compose fallaron porque el engine Docker no estaba disponible; se corrigió el socket IPC descrito arriba y se repitió la validación hasta healthy. No se detectaron defectos funcionales de la baseline integrada ni tests inestables que exigieran refactor. Swagger conservaba el título MVP-0; se actualizó a NeuroConnect API — Avance1 al añadir el contrato técnico. El smoke dentro del contenedor recibió un guard fail-fast de producción, comprobado con salida1 esperada antes de acceso a DB; no se trata de un gate fallido.

## AiModule / AiSummaryService / AiProvider / MockAiProvider

AiModule importa AnalyticsModule, registra controller/builder/prompt/servicio y enlaza el token DI AI_PROVIDER a MockAiProvider. AiProvider.generateSummary(context) devuelve GeneratedSummary `{content,provider,model}` sin tipos de SDK. AiSummaryService.preview usa contexto+prompt y NO invoca al proveedor. generateDevelopmentSummary es una costura interna para probar la abstracción; no tiene endpoint público.

MockAiProvider es determinístico: texto derivado exclusivamente del contexto, provider=mock, model=development-mock y etiqueta **Development mock only — no es IA generativa real**. Sin fetch/HTTP/SDK/red; rechaza generación bajo NODE_ENV=production. No es una selección de modelo definitivo. No hay benchmark ni API externa.

## SummaryContextBuilder / SummaryContext schema / Data minimization

AnalyticsService.summarySource filtra ownerId y obtiene Goal metadata mínima+CheckIns seleccionados dentro de un único snapshot RepeatableRead, ordenado estable por Goal.id. Ejecuta las mismas reglas puras de Analytics; el builder NO recalcula métricas/clasificaciones ni consulta Prisma directamente.

Contrato global: periodDays=28; totalGoals, activeGoals, pausedGoals, completedGoals, completionRate, averageProgress, checkInsLast28Days, checkInFrequencyPerWeek, inactiveGoals; goals[]. Cada Goal incluye únicamente title,status,progress,trend,averageDifficulty,daysSinceLastCheckIn,insufficientHistory. Nulls/insuficiente de Analytics se conservan. La ventana de28d aplica a frecuencia; dificultad/tendencia siguen las reglas del historial oficial, sin nuevo periodo alternativo.

Builder construye un objeto con allowlist explícita, sin spread de resultados upstream. Excluye campos de email, password/passwordHash, JWT/Authorization/access/refresh tokens, DATABASE_URL/API keys, IDs de usuario/Goal/externos, description, CheckIn.notes, permisos/SupportRelationship y otros usuarios. Los títulos son el único texto de Goal permitido como dato por ADR-005; no son instrucciones. No se envía contexto a terceros en este bloque. Tests inyectan campos extra/centinelas y comprueban claves exactas, exclusión, no mutación y conservación de valores.

## PromptBuilder / Prompt safety rules

Salida string `SYSTEM\n<instrucciones fijas>\n\nUSER\n<JSON estructurado>`, sin lógica de DB ni proveedor. Orden estable del contexto produce mismo prompt. Restricciones explícitas: solo datos dados, no inventar/alterar/recalcular métricas, no diagnóstico psicológico/psiquiátrico/neuropsicológico/médico, no inferir emociones/intenciones/condiciones/síntomas, no recomendaciones médicas/tratamiento ni evaluación profesional; lenguaje neutral/no culpabilizante, explicación breve y reconocimiento de insufficientHistory. Títulos/valores del JSON son datos, no instrucciones. Test adversarial verifica que delimitadores inyectados en títulos quedan escapados dentro de JSON. No optimización específica de proveedor.

## AI Preview / Swagger changes / Frontend changes

Única ruta IA: `GET /api/v1/ai/summary/context`, JWT obligatorio y owner derivado exclusivamente de identidad autenticada. Respuesta exacta `{context,prompt,providerConfigured:false}`. AI_PREVIEW_ENABLED=false devuelve404 a usuario autenticado; sin JWT401. Config valida true/false, defaultfalse; Compose local habilita por defecto y plantilla productiva deshabilita. AI_PROVIDER solo acepta mock. AI_MODEL/AI_API_KEY reservados vacíos, no consumidos ni requeridos.

Swagger documenta bearer auth, DTOs anidados, flag siemprefalse, errores401/404 y naturaleza técnica/sin IA real. Preview nunca llama al mock ni escribe AISummary/Goal/CheckIn, verificado con spies y snapshots reales. No hay endpoint extra de generación mock, persistencia o CRUD. ADR-004§119 y PLAN§26 requieren evidencia API, por lo que no se añadió pantalla Flutter ni experiencia final IA. Frontend existente íntegro.

## AISummary persistence decision / Database/migration changes

PLAN§7.4 exige crear el modelo desde este avance; ADR-001§§27–33 define su estructura. Se implementó AISummary físico como scaffold, no lifecycle productivo. Campos: UUID, userId FK User con cascade, periodStart/periodEnd/createdAt TIMESTAMPTZ(3), inputSnapshot JSONB, content/provider/model nullable, status enum PENDING(default)/COMPLETED/FAILED. Índices userId y (userId,createdAt); SQL CHECK periodStart≤periodEnd. No SupportRelationship.

Migration Prisma: `20261014000200_ai_summary_scaffold`, generada mediante prisma migrate diff desde schema base y complementada con CHECK SQL. No se editó migration previa ni ADR. Cadena completa (core+scaffold) aplicada a PostgreSQL recién creada `avance1_clean_<uuid>_test`; verificadas cuatro tablas vacías y eliminada solo esa DB temporal. E2E PostgreSQL separado verifica defaults/JSON/UTC/FK/periodo/índices. Preview/mock dejan tabla vacía; persistencia automática, PENDING→COMPLETED/FAILED, timeouts y history API quedan diferidos.

## Backend changes / Docker regression / CI regression

Nuevo feature backend/src/ai y método de fuente Analytics; AppModule/config/Swagger actualizados. Schema/migration scaffold. Tests unit/E2E y smoke existente ampliados. No dependencias npm/pub nuevas ni SDK. Actualizadas solo las variables necesarias de ejemplos/setup/Compose.

Conservados Dockerfiles productivos multi-stage/sin root/sin devDependencies, imágenes independientes y PostgreSQL externo mediante DATABASE_URL en plantilla productiva. Backend runtime incluye únicamente el smoke operativo seleccionado en scripts/smoke.cjs; resto de tests sigue excluido del contexto. Compose mantiene PostgreSQL16→readiness backend→frontend healthy y un comando `docker compose up -d --build --wait`. Smoke se puede ejecutar dentro del contenedor sin Node/Flutter en host. Config productiva validada con valores sintéticos y sin conexiones externas.

CI conserva gates e incorpora branch mvp2-avance1; runner E2E habilita preview/mock sin claves ni APIs externas. Resultado remoto pendiente hasta push; no se afirma antes de observar Actions.

## Tests executed / Test results / Build results

| Gate final | Resultado |
|---|---|
| backend npm run lint | PASS, también después del smoke final |
| backend npm test | PASS58 tests/4 suites:34 previos+22 pipeline IA+2 config |
| backend npm run test:e2e | PASS57 tests/3 suites:48 previos+9 IA/scaffold, PostgreSQL real |
| backend npm run build | PASS |
| flutter analyze --no-pub | PASS no issues; dependencias ya resueltas |
| flutter test --no-pub | PASS15 tests |
| flutter build web --no-pub --dart-define=API_BASE_URL=http://localhost:3000/api/v1 | PASS |
| docker build -t neuroconnect-backend:avance1 ./backend | PASS; Compose recompiló además el guard final del smoke |
| docker build -t neuroconnect-frontend:avance1 ./app | PASS |
| docker compose up -d --build --wait | PASS antes/después IA, tres servicios healthy |
| Cadena migrations PostgreSQL vacía | PASS2 migrations, cuatro tablas vacías |
| Seed real desde container | PASS antes/después IA; dataset3 Goals/15 CheckIns intacto |
| npm --prefix backend run smoke:seed | PASS PROGRESSING/STABLE/INACTIVE y métricas |
| docker compose exec backend node scripts/smoke.cjs | PASS flujo completo/preview/2usuarios/cleanup |
| Smoke NODE_ENV=production | PASS rechazo esperado exit1 antes de DB |
| Plantilla compose.prod config --quiet | PASS con URL/valores sintéticos |
| Swagger/API/browser | PASS detallado abajo |
| git diff --check | PASS |

Unitarias verifican contrato Analytics, determinismo, allowlist, exclusión de campos extra y secretos, métricas sin recalcular, vacío/insuficiente, prompt seguro/vendor-neutral/JSON, mock sin fetch y producción bloqueada, preview sin invocar proveedor y desactivación404. E2E compara con Analytics REAL, ownership con query userId/ownerId falsificada, vacío de otro owner, JSON exacto, ningún cambio/persistencia y scaffold SQL. No hay tests que consuman LLM externo ni SQLite.

## Smoke test results / Browser/API validation

Smoke containerizado: readiness→register/login2usuarios→profile→Goal CRUD/lifecycle→CheckIns→snapshots/history→overview/Goal analytics/trends/timeline→SummaryContext/prompt/providerConfigured=false→aislamiento/privacidad→limpieza propia. PAUSED/COMPLETED rechazan CheckIns. Guard de producción se ensayó mediante override de un proceso exec, sin cambiar el servidor.

Navegador integrado real, frontend127.0.0.1:5173/APIlocalhost3000/PG container: register/login/vacío→Goal Organizar Avance1→CheckIn35 con nota privada sintética→snapshot/history/analytics punto+insuficiente→después de IA, CheckIn65→historial2/overview65.00%/frecuencia0.50/gráfica35→65/PROGRESSING→reload/session restore→perfil/logout. No pantalla IA inventada. Swagger abierto con contrato/descripción y Execute sin JWT dio401 real. Petición HTTP autenticada del mismo usuario dio contexto65/PROGRESSING; JSON guardado tras comprobar que no incluía token/email/password/nota/Goal.id. No JWT en evidencia ni archivos versionados.

Evidencias: docs/evidence/avance1/dashboard-chart.png y ai-preview.json. Test de error/retry/vacío/insuficiente de Flutter se mantuvo verde; no se reclama una nueva simulación manual de caída de red en este bloque. Cuenta exacta del navegador eliminada con su Goal/2 CheckIns; smokes limpian sus usuarios, E2E usa DB separada. Demo/volumen preservados. Shutdown `docker compose stop`: tres contenedores exit0. Pestañas temporales cerradas.

## Files changed / Dependencies added

- backend/src/ai/{ai.module,ai.controller,ai-summary.service,summary-context.builder,summary-context.dto,prompt.builder,ai.provider,mock-ai.provider,ai.pipeline.spec}.ts.
- backend/src/analytics/analytics.service.ts; backend/src/{app.module,bootstrap}.ts; backend/src/config/environment.ts/spec.
- backend/prisma/schema.prisma y migration20261014000200_ai_summary_scaffold.
- backend/test/e2e/ai.e2e-spec.ts; backend/test/{run-e2e,smoke}.cjs.
- backend/{Dockerfile,.dockerignore,.env.example}; .env.example/.gitignore; compose.yaml; infra/setup-local.cjs y compose.prod.example.yml; ambos workflows.
- README raíz/backend, docs/architecture/{API,ARCHITECTURE,DATA_MODEL}.md; docs/AVANCE-1.md; evidencia avance1; este reporte y MVP2_AVANCE1_PR.md.
- Dependencias añadidas: ninguna. Sin SDK, API externa, credencial AI ni servicio pagado.

## Known limitations / Deviations / Technical debt / Explicit deferred MVP-2 work

Sin blocker funcional conocido. No desviaciones de arquitectura/dominio/documentación. No MVP-2 DONE ni versión1.0.0 DONE. Proveedor/modelo definitivo PENDING; no benchmark, llamadas LLM, evaluación clínica ni resultados generativos reales. Mock no valida calidad de un futuro modelo. No lifecycle productivo/persistencia/historial de resúmenes ni frontend final IA; no red de apoyo, permisos delegados, cloud, deployment/TLS, monitoreo/backup/hardening MVP-4, RAG/agentes/colas.

Analytics lee todo el historial y dashboard consulta por Goal como baseline. Advertencia Prisma package.json config y advisories heredadas quedan para actualización/hardening, sin audit fix --force. Android/iOS y DB productiva externa no ejecutados. Primera build necesita Internet. Backup IPC local de cero bytes permanece preservado fuera del repo. Docs/AVANCE-1.md tiene exactamente seis secciones académicas y marca retroalimentación/valoración humana con [PENDIENTE DE VALIDACIÓN DEL AUTOR]; no PDF final ni porcentajes globales artificiales.

## Human Validation Checklist

Casillas para el autor; evidencia técnica ejecutada arriba.

- [ ] branch nació de main actualizado
- [ ] stack completo inicia con un comando
- [ ] PostgreSQL healthy
- [ ] backend healthy
- [ ] frontend healthy
- [ ] Swagger funciona
- [ ] register funciona
- [ ] login funciona
- [ ] session restore funciona
- [ ] logout funciona
- [ ] profile funciona
- [ ] Goal CRUD funciona
- [ ] lifecycle funciona
- [ ] CheckIn funciona
- [ ] progress/history funcionan
- [ ] Analytics Overview funciona
- [ ] Goal Analytics funciona
- [ ] dashboard funciona
- [ ] gráfica funciona
- [ ] tendencias funcionan
- [ ] error/retry funciona
- [ ] AiModule carga
- [ ] SummaryContext usa Analytics
- [ ] SummaryContext excluye datos sensibles
- [ ] PromptBuilder genera prompt controlado
- [ ] prompt contiene restricciones no clínicas
- [ ] AiProvider está desacoplado del proveedor
- [ ] MockAiProvider es determinístico
- [ ] MockAiProvider está identificado como development-only
- [ ] AI Preview requiere autenticación
- [ ] AI Preview usa solo datos del propietario
- [ ] AI Preview devuelve providerConfigured=false
- [ ] ningún proveedor real fue llamado
- [ ] no existe API key requerida para ejecutar Avance1
- [ ] cross-user access continúa rechazado
- [ ] backend lint pasa
- [ ] backend unit tests pasan
- [ ] backend E2E pasan
- [ ] backend build pasa
- [ ] Flutter analyze pasa
- [ ] Flutter tests pasan
- [ ] Flutter Web build pasa
- [ ] backend Docker build pasa
- [ ] frontend Docker build pasa
- [ ] Compose smoke pasa
- [ ] CI remoto pasa
- [ ] docs/AVANCE-1.md refleja estado real
- [ ] MVP2_AVANCE1_REPORT.md está completo

## Smoke humano final del Avance 1 — comandos exactos

Con Docker disponible y .env coherente configurado desde el ejemplo (preserva credenciales existentes), en la raíz de la rama mvp2-avance1:

```powershell
docker compose up -d --build --wait
docker compose ps
docker compose exec backend node seed-dist/seed.js
docker compose exec backend node scripts/smoke.cjs
curl.exe -fsS http://localhost:3000/api/v1/health/ready
curl.exe -fsS http://localhost:5173/healthz
```

Frontend http://localhost:5173: registrar cuenta nueva/login, ver vacío, crear Goal, editarlo, CheckIns35/65, comprobar historial/progress, dashboard/gráfica/tendencia; pausar/completar rechaza CheckIn, reactivar vuelve a habilitarlo. Progreso40 posterior muestra DECLINING. Reload verifica restore, perfil/logout y segundo usuario verifica aislamiento. Demo seed usa demo@neuroconnect.local y SEED_PASSWORD local para PROGRESSING/STABLE/INACTIVE.

Swagger http://localhost:3000/api/docs: login en POST/auth/login, copiar accessToken a Authorize/bearer, ejecutar GET/analytics/overview y GET/analytics/goals/{goalId}, después GET/ai/summary/context. Debe coincidir con Analytics, incluir prompt SYSTEM/USER y providerConfigured=false, sin nota/email/IDs/credenciales. Sin bearer responde401. No existe endpoint público para ejecutar mock; se prueba por tests, no se presenta como IA real. AI_PREVIEW_ENABLED=false deshabilita preview (404 autenticado). El smoke containerizado anterior ya prueba automáticamente Auth/Goals/CheckIns/Analytics/preview y aislamiento con dos cuentas, y limpia sus datos; no necesita Node/Flutter en host.

Para repetir gates de desarrollo, backend/.env configurado y Node/Flutter disponibles: raíz `node infra/setup-test.cjs`; backend `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`; app `flutter analyze`, `flutter test`, `flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1`. La validación humana principal puede hacerse solo con Docker y navegador.

Apagado seguro, conservando volumen y datos:

```powershell
docker compose stop
```
