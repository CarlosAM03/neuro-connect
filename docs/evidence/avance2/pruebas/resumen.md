# Pruebas actuales C2 — 26 de noviembre de 2026

Resultados observados, no metas copiadas del sprint anterior. Base de aplicación:
`4f2ced9fdacfaaa7e071bf91cdffd5b3412da2ae`; no hubo cambios en app, backend,
schema, migrations ni Compose durante C2. Cada `.json` de este directorio registra
comando exacto, directorio, SHA del checkout documental, inicio/fin UTC y exit code.
Cada `.txt` conserva stdout/stderr sanitizados. Hora local = UTC−08:00 (Tijuana).

| Gate | Resultado | Evidencia real |
|---|---|---|
| npm run lint, backend | PASS, exit 0 | [backend-lint.txt](backend-lint.txt) |
| npm test, backend | **73 PASS / 6 suites**, exit 0 | [backend-unit.txt](backend-unit.txt) |
| npm run test:e2e, PostgreSQL | **78 PASS / 5 suites**, exit 0 | [backend-e2e.txt](backend-e2e.txt) |
| npm run build, backend | PASS, exit 0 | [backend-build.txt](backend-build.txt) |
| Flutter analyze --no-pub | PASS, sin incidencias, exit 0 | [flutter-analyze.txt](flutter-analyze.txt) |
| Flutter test --no-pub --reporter expanded | **33 PASS**, exit 0 | [flutter-test.txt](flutter-test.txt) |
| Flutter build web, API localhost | PASS, 168.8 s, exit 0 | [flutter-web.txt](flutter-web.txt) |
| Docker Compose build + startup | PASS, tres servicios healthy | [08_compose_estado.txt](../capturas/08_compose_estado.txt), log de build adjunto al cerrar |
| Schema / migraciones | PASS: seis tablas de dominio, siete FK, cuatro migrations aplicadas | [database-proof.txt](database-proof.txt), [BD test](../diagramas/bd_prueba.json) |
| Migraciones vacías + seed dos veces | PASS, 37 eventos estables, exit 0 | [migrations-seed.txt](migrations-seed.txt) |
| pg_dump / pg_restore en DB nueva de prueba | PASS, seis tablas y checksums iguales, exit 0 | [backup-restore.txt](backup-restore.txt) |
| Fixtures A/B y privacidad | PASS: cuatro estados, tres puntos, sin notes, write B404 y generación503 sin filas | [fixture-privacy.txt](fixture-privacy.txt) |
| Smoke HTTP completo | PASS, exit 0 | [smoke-http.txt](smoke-http.txt) |
| Persistencia al reiniciar tres servicios | PASS, exit 0 | [persistence.txt](persistence.txt) |
| npm audit --omit=dev --json | **exit 1**: 3 high, 0 moderate/critical | [audit-runtime.txt](audit-runtime.txt) |
| npm run audit:gate | PASS de política, exit 0; no audit=0 ni aceptación DEC-001 | [audit-policy.txt](audit-policy.txt) |
| Eliminación exacta de fixtures C2 | PASS: dos cuentas sintéticas propias; estado temporal eliminado | [fixtures-cleanup.txt](fixtures-cleanup.txt) |
| Post limpieza: startup/smoke/persistencia | PASS, exit 0 en los tres | logs `post-cleanup-*` con exit observado |

Entorno: Windows; Node 22.16.0; npm host 11.7.0 y **npm runner 10.9.2** (CLI instalado
junto a Node, comprobado con su ejecutable); Flutter 3.47.5 / Dart 3.13.4; Docker29.9.2;
PostgreSQL16.15 según consulta en DB de prueba. No se midió porcentaje de cobertura.

## Fallos y diferencias conservados

- E2E, evidencia de BD y backup fallaron inicialmente antes de que PostgreSQL
  estuviera arrancado. Los tres archivos `*-attempt-1.*` conservan esas salidas;
  los reintentos healthy pasan. No se eliminaron ni debilitaron tests.
- Un arranque `--no-build` coincidió con la recreación de frontend del build
  principal y devolvió un estado intermedio de contenedor saliendo. El `up --build
  --wait` principal terminó exit0; estado final y smoke actuales saludables.
- Primera apertura del navegador antes de frontend dio connection refused;
  capturas válidas se tomaron después del arranque. No se adjunta error como demo.
- API de capturas entrega **JPEG nativo** (1280×720, DPR observado1.5), no PNG.
  Se conservan bytes originales sin recorte, reescritura de UI o conversión. Las
  capturas con sufijo `b` son otra vista real/scroll, no retoque de la imagen.
- Se exportó ERD SVG válido y Mermaid editable; no había Graphviz/PyMuPDF para
  rasterizar localmente. El SVG es un diagrama de documentación, nunca una captura
  reconstruida del producto. `entityId` no se dibuja como FK.
- La auditoría confirma el residual conocido deepmerge-ts, propagado a Prisma y
  @prisma/config. DEC-001 sigue abierta; no se actualizaron versiones mayores.

## Qué acredita cada ensayo

Core/analytics/audit/support se verifican en PostgreSQL real y smoke HTTP. Capturas
registran login sin credenciales, filtro cancelados/búsqueda, gráfica de progreso,
permisos/expiración, B autorizado, A revoca desde UI y B denegado al refrescar,
y resúmenes vacíos honestos. Fixtures: 2 cuentas, 4 objetivos, 12 check-ins;
fechas de check-in asignadas explícitamente a hoy−6/hoy−3/hoy para ilustrar evolución
**sintética**, sin atribuirlas a actividad humana histórica.

El smoke exploratorio manual del autor **ya se realizó satisfactoriamente** y se
documenta como declaración independiente, no como salida de runners de Codex.
No se exige repetirlo. Aceptación formal de rama/release y DEC-001 permanecen
reservadas al responsable. No se ejecutó IA real, Android/iOS, despliegue, PR/merge
ni un workflow remoto manual. Un push puede disparar CI normal, cuyo resultado no
se presume verde ni se sustituye por los resultados locales.
