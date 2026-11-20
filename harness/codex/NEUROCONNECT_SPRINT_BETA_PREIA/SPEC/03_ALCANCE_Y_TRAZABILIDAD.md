# Matriz de trazabilidad de la baseline de 148 entregables

**Fuente autoritativa:** `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md` en la rama `main`. Esta tabla **no sustituye** el inventario original y no modifica el porcentaje histórico; ordena los 67 pendientes conocidos en el corte de octubre según su tratamiento en el sprint pre-IA. Las clases `PREPARAR` y `ACCIÓN HUMANA` **no equivalen a DONE**. La ejecución debe actualizar estados por pruebas y evidencia, no por intención.

## Clasificación

- **EJECUTAR+PROBAR (E):** trabajo independiente del proveedor externo; Codex debe implementarlo y ejecutarlo si el entorno lo permite.
- **PREPARAR, VALIDACIÓN FINAL DESPUÉS (P):** completar lo independiente y conservar criterio final PENDING hasta datos reales/validación externa.
- **DIFERIR (D):** exclusivamente proveedor real, cierre académico/release final o evidencia con IA externa.
- **ACCIÓN HUMANA EXTERNA (H):** despliegue y verificación real dependientes de cuentas/infraestructura del responsable; Codex prepara su runbook.

**MVP-0 (26/26) y MVP-1 (15/15):** se someten a regresión; no reabrir ni volver a sumar sin defecto demostrado. **MVP-3 (23/26):** guard VIEW_SUMMARIES ya probado, no equivale a summaries reales.

## MVP-2 · 30 entregables pendientes

| ID | Criterio pendiente | Tratamiento pre-IA |
|---|---|---|
| `M2-11` | Catálogo de ≥6 proveedores/modelos | DIFERIR A SPRINT IA/RELEASE |
| `M2-12` | Weighted Decision Matrix | DIFERIR A SPRINT IA/RELEASE |
| `M2-13` | Benchmark sintético ≥30 casos | DIFERIR A SPRINT IA/RELEASE |
| `M2-14` | Blind benchmark | DIFERIR A SPRINT IA/RELEASE |
| `M2-15` | Spike con 2–3 finalistas | DIFERIR A SPRINT IA/RELEASE |
| `M2-16` | Costos reales medidos | DIFERIR A SPRINT IA/RELEASE |
| `M2-17` | Latencia real medida | DIFERIR A SPRINT IA/RELEASE |
| `M2-18` | Privacidad del proveedor revisada | DIFERIR A SPRINT IA/RELEASE |
| `M2-19` | Proveedor principal seleccionado | DIFERIR A SPRINT IA/RELEASE |
| `M2-20` | Modelo principal seleccionado | DIFERIR A SPRINT IA/RELEASE |
| `M2-21` | Alternativa secundaria documentada | DIFERIR A SPRINT IA/RELEASE |
| `M2-22` | MODEL-EVALUATION/ADR final | DIFERIR A SPRINT IA/RELEASE |
| `M2-23` | Adapter productivo LLM | DIFERIR A SPRINT IA/RELEASE |
| `M2-24` | API key/config de proveedor real | DIFERIR A SPRINT IA/RELEASE |
| `M2-25` | Timeout de llamada real | DIFERIR A SPRINT IA/RELEASE |
| `M2-26` | Normalización rate limit/errores reales | DIFERIR A SPRINT IA/RELEASE |
| `M2-27` | Validación de respuesta LLM real | DIFERIR A SPRINT IA/RELEASE |
| `M2-28` | POST generación real y PENDING | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-29` | Input snapshot persistido en generación | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-30` | Resultado COMPLETED con contenido real | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-31` | Fallo FAILED de generación real | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-32` | Trazabilidad provider/model reales | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-33` | API owner historial de resúmenes | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-34` | API owner detalle autorizado | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-35` | Flutter generación loading/éxito | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-36` | Flutter errores/reintentos IA | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-37` | Flutter historial de resúmenes | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-38` | Flutter detalle/disclaimer IA | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-39` | Tests lifecycle + regresión IA real | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M2-40` | Verificación fidelidad/privacidad real LLM | DIFERIR A SPRINT IA/RELEASE |

## MVP-3 · 3 entregables pendientes

| ID | Criterio pendiente | Tratamiento pre-IA |
|---|---|---|
| `M3-24` | VIEW_SUMMARIES solo COMPLETED, sin datos internos | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M3-25` | Flutter lista/detalle resúmenes delegados | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M3-26` | E2E summary real + revocación/expiry | PREPARAR, VALIDACIÓN FINAL DESPUÉS |

## MVP-4 · 34 entregables pendientes

| ID | Criterio pendiente | Tratamiento pre-IA |
|---|---|---|
| `M4-08` | Regresión backend final con IA y soporte reales | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-09` | Integración final Flutter todos los flujos | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-10` | E2E A→IA real→B→revocación | DIFERIR A SPRINT IA/RELEASE |
| `M4-11` | Security review final incluyendo LLM | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-12` | Reevaluar dependencias/advisories | EJECUTAR+PROBAR |
| `M4-13` | Responsive UX final incluidos resúmenes IA | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-14` | Contraste accesible | EJECUTAR+PROBAR |
| `M4-15` | Escalado de texto | EJECUTAR+PROBAR |
| `M4-16` | Touch targets | EJECUTAR+PROBAR |
| `M4-17` | Semantics | EJECUTAR+PROBAR |
| `M4-18` | Teclado/focus Web | EJECUTAR+PROBAR |
| `M4-19` | APK Android instalado y API pública | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-20` | Compatibilidad proyecto iOS | EJECUTAR+PROBAR |
| `M4-21` | Backend público independiente de equipo local | ACCIÓN HUMANA EXTERNA |
| `M4-22` | Flutter Web público | ACCIÓN HUMANA EXTERNA |
| `M4-23` | HTTPS público Web/API | ACCIÓN HUMANA EXTERNA |
| `M4-24` | DB productiva persistente/protegida | ACCIÓN HUMANA EXTERNA |
| `M4-25` | Secretos/red/CORS prod verificados | ACCIÓN HUMANA EXTERNA |
| `M4-26` | Monitor disponibilidad Web | ACCIÓN HUMANA EXTERNA |
| `M4-27` | Monitor API/alerta operativa | ACCIÓN HUMANA EXTERNA |
| `M4-28` | Logs productivos seguros | ACCIÓN HUMANA EXTERNA |
| `M4-29` | Backup protegido productivo ejecutado | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-30` | Restore probado en DB nueva | EJECUTAR+PROBAR |
| `M4-31` | Rollback documentado/verificable | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-32` | Deployment runbook | EJECUTAR+PROBAR |
| `M4-33` | Backup/restore runbook | EJECUTAR+PROBAR |
| `M4-34` | Incident runbook | EJECUTAR+PROBAR |
| `M4-35` | Release runbook | EJECUTAR+PROBAR |
| `M4-36` | Release-check workflow | EJECUTAR+PROBAR |
| `M4-37` | Costo $0 productivo comprobado | ACCIÓN HUMANA EXTERNA |
| `M4-38` | Documento académico final | DIFERIR A SPRINT IA/RELEASE |
| `M4-39` | Evidencias Web/Android/IA/deployment final | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-40` | Presentación/demo final | PREPARAR, VALIDACIÓN FINAL DESPUÉS |
| `M4-41` | Tag/release final v1.0.0 | DIFERIR A SPRINT IA/RELEASE |

## Cómo actualizar

1. Codex compara cada fila con el código y tests reales antes de trabajar. Cambios posteriores a freeze invalidan cualquier suposición.
2. Reporta `ALREADY_DONE`, `IMPLEMENTED_AND_VALIDATED`, `PARTIALLY_PREPARED`, `DEFERRED_AI`, `EXTERNAL_HUMAN_ACTION`, `DECISION_REQUIRED`, `FAILED_VALIDATION` por ID y con evidencia.
3. No convertir la definición de DoD de v1.0.0 en un DoD más débil solo para subir %. No cambiar denominadores 148/67 sin inventario nuevo versionado y validación humana.
4. Sumar de forma separada: **cobertura del sprint pre-IA** versus **avance global académico**. Nunca expresar "la IA es 10%" como dato medido.
5. Copiar la matriz de estado final a `RESULTADOS/REPORTE_FINAL_SPRINT.md` o generar archivo anexo en `RESULTADOS/`.
