# FASE 05 — Hardening, accesibilidad y compatibilidad cliente

1. Correr y corregir lint/tests/backend E2E/Flutter analyze/tests y builds con comandos reales. Tests E2E usan PostgreSQL 16. Incluir regresión de core/support/analytics/audit/UI IA unavailable.
2. Revisar advisories conocidas de Prisma/deepmerge-ts y nuevas dependencias. Corregir actualizaciones compatibles únicamente; justificar riesgos sin introducir major upgrades silenciosos ni ocultar vulnerabilidades.
3. Revisar autenticación/autorización/DTOs/ownership/caché/secretos/CORS/feature flags y filtración de notes/AuditEvent/InputSnapshot; reforzar tests negativos.
4. Validar responsive, contraste, escalado de texto, focus/keyboard, semantics/touch targets, mensajes de errores; reparar deficiencias puntuales de UX sin rediseño completo.
5. Probar `flutter build apk` en ambiente Android disponible; instalar y ejecutar contra API local/pública si existe emulador/dispositivo. Si el entorno no tiene SDK/ADB, anotar limitación exacta y runbook humano; no declarar APK instalado.
6. Evaluar proyecto iOS con lo verificable, sin pretender ejecutar Xcode fuera de macOS. No pedir App Store/Play Store.

**Commits:** separados por hardening, accessibility, tests, plataforma. **Gate:** evidencia de comandos con exit codes y riesgos residuales. Fase 06.
