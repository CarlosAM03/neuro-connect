# Matriz final de los 67 pendientes históricos

Fuente: SPEC/03 y freeze canónico. No se modifica 81/148 ni54.7% del corte histórico.
MVP-0/MVP-1 y soporte/audit core: ALREADY_DONE, revalidados con regresión; no se vuelven a sumar.
IMPLEMENTED_AND_VALIDATED significa el entregable indicado, no v1.0.0.
DEFERRED_AI también agrupa los ítems de cierre académico/release diferidos a ese sprint.

| ID | Criterio original | Estado real | Evidencia / límite |
|---|---|---|---|
| M2-11 | Catálogo de ≥6 proveedores/modelos | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-12 | Weighted Decision Matrix | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-13 | Benchmark sintético ≥30 casos | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-14 | Blind benchmark | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-15 | Spike con 2–3 finalistas | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-16 | Costos reales medidos | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-17 | Latencia real medida | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-18 | Privacidad del proveedor revisada | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-19 | Proveedor principal seleccionado | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-20 | Modelo principal seleccionado | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-21 | Alternativa secundaria documentada | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-22 | MODEL-EVALUATION/ADR final | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-23 | Adapter productivo LLM | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-24 | API key/config de proveedor real | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-25 | Timeout de llamada real | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-26 | Normalización rate limit/errores reales | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-27 | Validación de respuesta LLM real | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M2-28 | POST generación real y PENDING | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-29 | Input snapshot persistido en generación | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-30 | Resultado COMPLETED con contenido real | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-31 | Fallo FAILED de generación real | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-32 | Trazabilidad provider/model reales | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-33 | API owner historial de resúmenes | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-34 | API owner detalle autorizado | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-35 | Flutter generación loading/éxito | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-36 | Flutter errores/reintentos IA | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-37 | Flutter historial de resúmenes | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-38 | Flutter detalle/disclaimer IA | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-39 | Tests lifecycle + regresión IA real | PARTIALLY_PREPARED | AiProvider/context/model existentes; GET owner list/detail, POST503 y summary-reads.e2e fixtures. No lifecycle generativo ni snapshot de llamada real. |
| M2-40 | Verificación fidelidad/privacidad real LLM | DEFERRED_AI | ADR-005: evaluación, proveedor, respuesta real y fidelidad fuera de este bloque. |
| M3-24 | VIEW_SUMMARIES solo COMPLETED, sin datos internos | PARTIALLY_PREPARED | Proyección COMPLETED + list/detail UI; E2E78 y tests Flutter. Sin summary de LLM real ni DoD final. |
| M3-25 | Flutter lista/detalle resúmenes delegados | PARTIALLY_PREPARED | Proyección COMPLETED + list/detail UI; E2E78 y tests Flutter. Sin summary de LLM real ni DoD final. |
| M3-26 | E2E summary real + revocación/expiry | PARTIALLY_PREPARED | Proyección COMPLETED + list/detail UI; E2E78 y tests Flutter. Sin summary de LLM real ni DoD final. |
| M4-08 | Regresión backend final con IA y soporte reales | PARTIALLY_PREPARED | 73 unit/6 +78 E2E/5 PASS; regresión pre-IA real sobre PostgreSQL. Falta proveedor real para DoD final. |
| M4-09 | Integración final Flutter todos los flujos | PARTIALLY_PREPARED | 33 Flutter PASS +13 subset tras refresh; Web build/Compose. Smoke humano completo y flujos IA real pendientes. |
| M4-10 | E2E A→IA real→B→revocación | DEFERRED_AI | Flujo LLM real o cierre académico/release futuro. Sin tag ni aceptación final. |
| M4-11 | Security review final incluyendo LLM | PARTIALLY_PREPARED | Aislamiento/DTO/allowlist/read-only/preview/log privacy revisados y probados. Falta revisión final LLM y DEC-001. |
| M4-12 | Reevaluar dependencias/advisories | PARTIALLY_PREPARED | Auditorías ejecutadas; 15→3 high, un advisory residual tooling; DEC-001 antes de publicación. |
| M4-13 | Responsive UX final incluidos resúmenes IA | PARTIALLY_PREPARED | Material3 conservado; filtros y UI summary; pruebas responsive y fix AppBar. Revisión humana de todas las vistas pendiente. |
| M4-14 | Contraste accesible | PARTIALLY_PREPARED | accessibility_test.dart:320/1280px a200%, Auth contrast/labels/targets/Tab; falta revisión visual/lector en todas las vistas. |
| M4-15 | Escalado de texto | PARTIALLY_PREPARED | accessibility_test.dart:320/1280px a200%, Auth contrast/labels/targets/Tab; falta revisión visual/lector en todas las vistas. |
| M4-16 | Touch targets | PARTIALLY_PREPARED | accessibility_test.dart:320/1280px a200%, Auth contrast/labels/targets/Tab; falta revisión visual/lector en todas las vistas. |
| M4-17 | Semantics | PARTIALLY_PREPARED | accessibility_test.dart:320/1280px a200%, Auth contrast/labels/targets/Tab; falta revisión visual/lector en todas las vistas. |
| M4-18 | Teclado/focus Web | PARTIALLY_PREPARED | accessibility_test.dart:320/1280px a200%, Auth contrast/labels/targets/Tab; falta revisión visual/lector en todas las vistas. |
| M4-19 | APK Android instalado y API pública | ENVIRONMENT_LIMITATION | flutter doctor y build apk: Android SDK ausente, exit1. Sin APK ni instalación. |
| M4-20 | Compatibilidad proyecto iOS | PARTIALLY_PREPARED | Runner/Info.plist/AppDelegate inspeccionados; sin nuevas dependencias nativas. Windows no valida Xcode. |
| M4-21 | Backend público independiente de equipo local | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-22 | Flutter Web público | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-23 | HTTPS público Web/API | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-24 | DB productiva persistente/protegida | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-25 | Secretos/red/CORS prod verificados | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-26 | Monitor disponibilidad Web | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-27 | Monitor API/alerta operativa | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-28 | Logs productivos seguros | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-29 | Backup protegido productivo ejecutado | PARTIALLY_PREPARED | Ensayo pg_dump/restore sintético PASS y runbook; falta backup productivo cifrado/offsite del responsable. |
| M4-30 | Restore probado en DB nueva | IMPLEMENTED_AND_VALIDATED | infra/backup-restore-smoke.cjs exit0: PostgreSQL16, seis tablas + checksums de migraciones idénticos en DB nueva. |
| M4-31 | Rollback documentado/verificable | PARTIALLY_PREPARED | Rollback imagen/Web documentado; no despliegue público que revertir ni down migration nueva. |
| M4-32 | Deployment runbook | IMPLEMENTED_AND_VALIDATED | docs/operations/*-RUNBOOK.md revisados; comandos locales Docker/migration/backup probados. Publicación/incidente reales no ejecutados. |
| M4-33 | Backup/restore runbook | IMPLEMENTED_AND_VALIDATED | docs/operations/*-RUNBOOK.md revisados; comandos locales Docker/migration/backup probados. Publicación/incidente reales no ejecutados. |
| M4-34 | Incident runbook | IMPLEMENTED_AND_VALIDATED | docs/operations/*-RUNBOOK.md revisados; comandos locales Docker/migration/backup probados. Publicación/incidente reales no ejecutados. |
| M4-35 | Release runbook | IMPLEMENTED_AND_VALIDATED | docs/operations/*-RUNBOOK.md revisados; comandos locales Docker/migration/backup probados. Publicación/incidente reales no ejecutados. |
| M4-36 | Release-check workflow | PARTIALLY_PREPARED | release-check.yml manual, tres jobs, parse YAML PASS; no run GitHub remoto porque no hubo push. |
| M4-37 | Costo $0 productivo comprobado | EXTERNAL_HUMAN_ACTION | ACCIONES_EXTERNAS.md; ninguna alta/deploy/TLS/monitor/costo público validado. |
| M4-38 | Documento académico final | DEFERRED_AI | Flujo LLM real o cierre académico/release futuro. Sin tag ni aceptación final. |
| M4-39 | Evidencias Web/Android/IA/deployment final | PARTIALLY_PREPARED | Runbooks, handoff y escenario demo pre-IA preparados; evidencia final Web/Android/LLM/deploy aún pendiente. |
| M4-40 | Presentación/demo final | PARTIALLY_PREPARED | Runbooks, handoff y escenario demo pre-IA preparados; evidencia final Web/Android/LLM/deploy aún pendiente. |
| M4-41 | Tag/release final v1.0.0 | DEFERRED_AI | Flujo LLM real o cierre académico/release futuro. Sin tag ni aceptación final. |

## Conteos de clasificación (no porcentaje académico)

- DEFERRED_AI: 21
- PARTIALLY_PREPARED: 31
- ENVIRONMENT_LIMITATION: 1
- EXTERNAL_HUMAN_ACTION: 9
- IMPLEMENTED_AND_VALIDATED: 5

Total:67; no hay porcentaje de cobertura de código medido. Las pruebas de fixtures solo acreditan preparación, nunca integración LLM real.
