# Decisiones y pendientes — PREIA-BETA-READINESS

## DEC-001 — Residual de Prisma antes de publicación

- Estado: OPEN; tipo SECURITY / DEPLOYMENT. Fuente: HARNESS §§32–39 y ADR-007
  (dependencias/seguridad/costo), auditoría de Avance 1 y reevaluación actual.
- Hecho: audit final/runtime reportan tres paquetes high por un advisory
  deepmerge-ts, dependiente de Prisma CLI 6.19.3. No hay parche compatible7.x.
  API no procesa configuración recursiva del usuario con ese módulo. Está presente
  en imagen para migraciones; no se declara audit=0 ni seguridad productiva final.
- Decisión para el primer deploy: ¿mantener temporalmente esa restricción de
  tooling confiable o autorizar un incremento separado de Prisma cuando exista
  corrección compatible/verificada?
- A: mantener temporalmente y revisar cada release; menor cambio, residual físico.
- B: bloquear publicación hasta actualización compatible validada; mayor demora,
  sin aceptar residual. No forzar override mayor8 o Prisma7/8 en este bloque.
- Recomendación no decidida por Codex: reevaluar antes de exponer públicamente;
  si sigue sin parche compatible, aceptación explícita y acotada por el responsable.
- Parte limitada: aceptación de seguridad productiva/M4-12 y M4-25. La beta local,
  tests, hardening, recuperación y runbooks se entregan de forma independiente.
- Retomar: revisar audit actual, aprobar alternativa, aplicar solo cambio autorizado,
  npm ci/Prisma/lint/unit/E2E PostgreSQL/build/Docker/smoke y auditar de nuevo.
- Detalle y fuentes: `docs/security/DEPENDENCY_AUDIT_PREIA.md`.

## ENVIRONMENT_LIMITATION

- ENV-001: Android SDK ausente. `flutter doctor -v` lo confirma y build APK exit1.
  No APK construido/instalado ni flujo Android demostrado. Instalar SDK y seguir
  `docs/operations/CLIENT-PLATFORMS.md`; no habilitar cleartext global para ocultarlo.
- ENV-002: iOS no compilable en Windows; proyecto inspeccionado, sin evidencia de
  Xcode ni ejecución. Verificación macOS posterior.
- ENV-003: workflow release-check parseado/revisado localmente; no ejecutado en
  GitHub al no hacer push. No se declara CI remoto verde ni Android CI probado.

## EXTERNAL_HUMAN_ACTION

- Smoke local definitivo, aceptación y revisión de commits/reorganización humana
  de reportes previos. Posterior PR/merge exclusivamente humanos.
- Cloudflare Pages + OCI Always Free o Render Free + Neon16 Free: provisionar solo
  si plan actual permite $0; configurar TLS, secretos/CORS, backup protegido,
  monitor/alertas y verificar HTTPS A/B. Ninguna cuenta/servicio público creado.
- Política concreta de custodia/retención de backups debe definirla el responsable;
  no hay política de eliminación nueva ni borrado automático de datos funcionales.

## DEFERRED_AI

M2-11..27 y M2-40: evaluación, benchmark, proveedor/modelo/adapter y respuestas
reales. M2-28..39 y M3-24..26 solo preparados donde son independientes; falta
lifecycle real, snapshot de llamada, fidelidad/latencia/errores y flujo A→LLM→B.
No hay SDK/key/consumo externo de LLM; fixtures viven solo en DB de test.

## DEFECT / riesgo residual

No se aceptan tests fallidos propios como DONE. Fallos corregidos durante ejecución:
fixture Flutter con fecha inválida, tres avisos analyzer, overflow AppBar a200% y
ciclo SemanticsHandle del test. Los reintentos pasan y quedan enumerados en reporte.
Las limitaciones Android/iOS y la revisión visual humana completa siguen abiertas.
