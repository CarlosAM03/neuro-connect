# Especificación de pruebas, seguridad, experiencia y plataformas

## Pruebas y calidad

- Conservación de todos los tests existentes. No comentar/skip tests para obtener verde ni modificar expectativas para esconder bug.
- Backend: `npm ci`, `npm run lint`, `npm test`, `npm run test:e2e` contra PostgreSQL 16 real, `npm run build`, `npm run smoke`, cuando los comandos/entorno estén disponibles. No usar SQLite como sustituto.
- Flutter: `flutter pub get`, `flutter analyze`, `flutter test`, `flutter build web` con `--dart-define=API_BASE_URL=...`. Construcción Android `flutter build apk` si SDK local disponible; ejecución práctica con API en emulador/dispositivo cuando el entorno lo permita.
- Validar startup/health/readiness, migraciones desde DB nueva, reejecución seed, persistencia por reinicio Docker, network errors y graceful recovery. Si pruebas destructivas afectan volúmenes, ejecutar en ambiente efímero de test, nunca sobre DB del usuario.
- CI actual conservado; incorporar tests faltantes sin reemplazar workflows originales ni introducir servicios de pago.

## Security review (sin rediseñar)

- Ownership estricto y relación activa por request; deep links denegados sin sesión/permiso; no cross-user data en caché tras logout/cambio de identidad.
- Validaciones DTO whitelist y forbidNonWhitelisted; JWT expiración, password hash no expuesto, no mass assignment de progress/status no permitido.
- CORS explícito por orígenes; secretos nunca en Flutter, git, Docker image, logs, commits, reportes o CI output. Swagger/AI Preview según configuración.
- Revisar advisories conocidos Prisma/deepmerge-ts registrados en Avance 1 y comprobar estado actual; upgrades solo si seguros y compatibles con Node/Flutter/Prisma/ADR, sin actualización masiva para "limpiar" auditoría. Documentar riesgos residuales con impacto.
- `CheckIn.notes` privado owner-only en soporte, auditoría e IA; payload auditoría minimizado.
- No agregar telemetría de terceros ni trackers por iniciativa propia.

## Accesibilidad y UX

- Responsiveness Web móvil/tableta/escritorio, resolución amplia y estrecha, sin overflow.
- Text scaling, teclado, focus, labels/semantics, contraste, touch targets y estados loading/empty/error/retry.
- Las animaciones son opcionales, limitadas y respetan legibilidad; no exigir rediseño completo ni asset externo.
- Confirmaciones de cancelar, invalidar, revocar; errores de red/caducidad no presentan falsos éxitos.

## Android e iOS

- Android APK construible y demostrable, API URL configurable para emulador/dispositivo; documentar ajustes de red/SSL de desarrollo y HTTPS recomendado. No comprometer datos con cleartext indiscriminado de producción.
- iOS: revisar estructura de proyecto y compatibilidad conceptual; no exigir compilación iOS sin macOS/Xcode. Aclarar límite verificable.

## Definición de evidencia

Por cada comando: fecha, entorno, SHA, comando, exit code, total suites y resultado; guardar logs cuando no expongan secretos, sin inventar cifras. Evidencia manual no sustituye CI; CI no sustituye smoke humano. No declarar pruebas Android si solo se produjo un APK sin ejecución.
