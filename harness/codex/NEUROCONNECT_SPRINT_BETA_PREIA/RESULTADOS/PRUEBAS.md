# Evidencia de validación — 2026-11-19 (America/Tijuana)

Entorno: Windows11, Node22.16.0, npm11.7.0, Flutter3.47.5/Dart3.13.4,
Docker Engine29.9.2 Desktop y PostgreSQL16 en Compose. Solo datos sintéticos.
Base `46b4304`; ejecución incremental hasta código `6284814`. El commit final
añade únicamente documentos. No medición porcentual de cobertura de código.

## Comandos realmente ejecutados

Rutas relativas a raíz, salvo las columnas backend/app. Exit codes son del comando
individual, no se confunde el exit1 esperado de audit con fallos de compilación.

| Directorio | Comando | Exit | Resultado observado |
|---|---|---:|---|
| raíz | git fetch origin | 0 en reintento autorizado | main=origin/main=46b4304; primer intento sandbox denegado |
| backend | npm test (baseline) | 0 | 70 tests /5 suites |
| backend | npm run lint (baseline y final) | 0 | sin errores |
| backend | npm run build (baseline y final) | 0 | TypeScript compila |
| raíz | docker info / docker compose ps | 0 tras iniciar Desktop | inicialmente motor detenido; se recuperó |
| raíz | docker compose up -d --wait postgres | 0 | PostgreSQL16 healthy, volumen conservado |
| raíz | node infra/setup-test.cjs | 0 | base separada neuroconnect_test configurada |
| backend | npm run test:e2e (baseline) | 0 | 73 tests /4 suites PostgreSQL16 |
| app | flutter --version (PATH corregido) | 0 | 3.47.5 /Dart3.13.4; primer intento PATH sin System32 falló |
| app | flutter test --no-pub (con filtros) | 0 | 28 tests |
| app | flutter test --no-pub test/support_test.dart | 0 | 11 tests tras tendencia histórica |
| backend | npm run test:e2e (summary reads) | 0 | 78 tests /5 suites |
| backend | npm update @nestjs/platform-express body-parser qs typescript-eslint --ignore-scripts --no-audit --no-fund | 0 | actualizaciones compatibles del lock y effect acotado |
| backend | npm ci --no-audit --no-fund | 0 | 578 paquetes, lock reproducible |
| backend | npm run prisma:generate | 0 | Prisma Client6.19.3 |
| backend | npm test (final, telemetría) | 0 | 73 tests /6 suites |
| backend | npm run test:e2e (final, telemetría/parches) | 0 | 78 tests /5 suites,81.054s; log local tmp/preia-final-e2e.log |
| backend | npm run smoke:migrations | 0 | 4 migraciones en DB nueva; seed dos veces:3 usuarios/5 goals/25 check-ins/2 relaciones/37 eventos estables |
| backend | npm audit --json (inicial/final) | 1 /1 | 15 afectados (8 moderate/7high)→3high;0critical |
| backend | npm audit --omit=dev --json (inicial/final) | 1 /1 | 8 afectados (1moderate/7high)→3high;0critical |
| backend | npm run audit:gate | 0 | solo residual conocido GHSA-ggr8-5vv4-36mx y tres paquetes; no audit=0 |
| app | flutter analyze --no-pub (final) | 0 | No issues found; último reintento29.7s |
| app | flutter test --no-pub (regresión ampliada) | 0 | 33 tests |
| app | flutter test --no-pub test/summaries_test.dart test/support_test.dart (último refresh) | 0 | 13 tests |
| app | flutter test --no-pub test/accessibility_test.dart (final) | 0 | 3 tests;320/1280px texto200%,focus editable real,contrast/labels/targets Auth |
| app | flutter build web --no-pub --no-web-resources-cdn --dart-define=API_BASE_URL=http://localhost:3000/api/v1 | 0 | build Web host204.9s y posterior169.7s; artefacto final recompilado también en Docker |
| app | flutter doctor -v | 0 diagnóstico | Android SDK ausente; Chrome no detectado por Flutter; Edge disponible |
| app | flutter build apk --no-pub --dart-define=API_BASE_URL=https://example.invalid/api/v1 | 1 | No Android SDK found; URL placeholder deliberada, no APK ni API pública |
| raíz | node infra/backup-restore-smoke.cjs | 0 | pg_dump custom→DBnueva→pg_restore; seis tablas y migration checksums idénticos; dos DB propias eliminadas |
| raíz | docker compose up -d --build --wait (inicial/final) | 0 /0 | backend+frontend Docker build; postgres/backend/frontend healthy |
| raíz | docker compose exec -T backend node scripts/smoke.cjs | 0 | flujo HTTP completo A/B; summary reads vacío/POST503 sin persistencia; limpieza controlada |
| raíz | node infra/persistence-smoke.cjs (final) | 0 | Goal40/CheckIn/sesión/audit preservados tras restart3servicios; cierre de pools del harness corregido |
| raíz | docker compose run --rm --no-deps -e NODE_ENV=production -e AI_PREVIEW_ENABLED=false backend node -e "const {validateEnvironment}=require('./dist/config/environment'); if(validateEnvironment(process.env).AI_PREVIEW_ENABLED!==false)process.exit(1);console.log('PASS: production preview disabled');" | 0 | contenedor efímero local, sin API pública ni mutación |
| raíz | fetch local health/ready/Web, CORS Origin permitido y fallback SPA (Node) | 0 autorizado | status200; X-Request-Id en API; CORS exacto y HTML SPA |
| raíz | verificador_paquete.py --allow-missing-originals | 0 | 51 hashes OK,0 fallos |
| raíz | js-yaml load workflows/compose examples | 0 | YAML parseado; release-check solo workflow_dispatch,3jobs |
| raíz | git diff --check / node --check scripts | 0 | sin errores |
| raíz | docker compose stop / docker compose ps -a | 0 | shutdown final de los tres servicios con exit0; volumen preservado |
| navegador | CUA IAB → localhost:5173 → Enable accessibility | observado | login Web real renderiza título,labels email/password,Entrar/Crear cuenta; no autenticación humana simulada |

No ejecutar `docker compose config` sin --quiet en evidencia: puede expandir secretos.
Logs crudos de build/E2E quedan en tmp ignorado; evidencia durable es esta tabla,
tests versionados y comandos reproducibles, no promesas de un pipeline remoto.

## Fallos diagnosticados y correcciones

- Flutter SDK inicialmente fuera de PATH y sandbox sin acceso a caché; usar
  System32/Git/Flutter en PATH y ejecución local autorizada. No cambio de SDK.
- Primer format tenía paths relativos incorrectos desde app; se corrigieron antes
  de commit. Analyzer encontró dos if sin bloque y un import obsoleto: corregidos.
- Fixture summary con fecha incompleta no parseaba en Dart: fixture UTC completo,
  tests2PASS. No alteró producción ni relajó expectativas.
- Test320px/200% descubrió overflow real de AppBar: Nuevo objetivo es IconButton
  con tooltip en ancho reducido/texto grande. Targets48 y Wrap fechas/paginación.
- SemanticsHandle del nuevo test se liberaba demasiado tarde: dispose antes de
  verificación final. Contraste/targets/labels y focus editable pasan.
- Reinicio: dos intentos fallaron por sockets/pool del harness retenidos al detener
  PostgreSQL/backend, no por pérdida de datos. Se desconecta Prisma antes de restart
  y HTTP de ensayo usa Connection:close. ReintentoPASS. Limpieza adicional de dos
  fixtures exactos creados por esta sesión, sin borrar cuentas ajenas ni volúmenes.
- Dos probesHTTP sin escalación devolvieron TypeError por restricción de red del
  sandbox; un intento además coincidió con restart. Verificación autorizada y
  secuencial posterior200/CORS/SPA. No se contabilizan como PASS inicial.
- PyYAML no estaba disponible; YAML validado con js-yaml ya instalado. No nueva
  dependencia innecesaria ni instalación global.
- Los mensajes500 Prisma en E2E support-audit son fallos inyectados deliberadamente
  para verificar rollback de dominio+AuditEvent, no fallos de suite ocultados.

## Casos SPEC/09 y evidencia

| Casos | Estado | Evidencia y límite |
|---|---|---|
| AUTH-01 | PASS | core.e2e:registro/login/hash y email; smoke A/B |
| AUTH-02,AUTH-03 | PASS automatizado | widget_test:restore/bootstrap/logout/identidad anterior; validación manual full-browser pendiente |
| GOAL-01..05 | PASS | core/support-audit E2E y smoke; ACTIVE/0,status,100% independiente,40→70→void40,cancel/reactivate |
| ANALYTICS-01..03 | PASS | analytics.rules/analytics E2E:28d,bordes7d/28d,cancelados,void,eligible73.33,sin NaN |
| SUP-01..07 | PASS | support-audit E2E A/B/C,dep permisos,expiry/revoke/reactivate,no writes,no notes/audit; Flutter refresh13PASS |
| AUD-01,AUD-02 | PASS | audit.spec/support-audit:allowlist,append-only trigger,atomicidad rollback y eventos únicos |
| AI-SEAM-01 | PASS | summaries_test UI unavailable,POST503 sin persistencia y sin mock visible |
| AI-SEAM-02..04 | PASS preparación | summary-reads E2E:COMPLETED fixture,minimización,A/B/C,deep links,expiry/revoke,FAILED/PENDING excluidos |
| WEB-01,WEB-02 | PARTIAL | tests320/1280/200%,teclado y guidelines Auth; login real observado; todas las pantallas/lector requieren smoke humano |
| OPS-01 | PASS | persistence-smoke:reinicio3servicios preserva Goal/checkin/audit/sesión |
| OPS-02 | PASS | migration smoke:DBvacía4migraciones,seed dos veces estable |
| OPS-03 | PASS | backup-restore-smoke:DBsintética distinta,seis tablas+migrations idénticos |
| OPS-04 | PASS local / públicoNOT_RUN | flag prod false en contenedor,validación rechaza true; no deploy público |
| ANDROID-01 | NOT_RUN | build intentado exit1:sin SDK; instalación/flujo no ejecutados |

## No ejecutado / sin claim

- CI remoto GitHub, publicación Pages/OCI/Render/Neon, TLS/monitor/backup productivos.
- APK instalado, dispositivo físico/emulador, iOS/Xcode y lector de pantalla humano.
- Generación LLM, lifecycle real,snapshot de llamada,fidelidad,benchmark,costo/latencia.
- Seed API `npm run smoke:seed` sobre DB principal no se ejecutó: no se asumió que
  sus fixtures persistentes locales estaban intactos. Seed/migrations sí se
  comprobaron en DB nueva y backup sintético, sin reescribir datos previos.
- No porcentaje de cobertura Jest/Dart medido ni v1.0.0/aceptación humana.
