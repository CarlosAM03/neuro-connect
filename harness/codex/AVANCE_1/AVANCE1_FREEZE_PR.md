# docs: freeze Avance 1 baseline and remaining scope

## Propósito / baseline

Congelar documentalmente Avance1CLOSED tras PR#5, sin código, arquitectura, dominio,
Analytics, SummaryContext, dependencias, tests nuevos ni investigación/IA real.
**freezeCommit/base = fad9cf73924fc334c57a77526a9f017069ceb4c5**; no se crea tag/release.
Es fuente técnica para el posterior entregable académico, no el PDF académico final.

## Medición reproducible

**Estimación técnica por entregables verificables**. Inventario con148IDs únicos,
extraídos de los DoD y ADR, cada fila DONE/PENDING con fuente y evidencia/brecha.
MVP-1.5 se distribuye entre los cinco MVP originales; no hay sexto denominador ni
doble conteo. Global=81DONE/148×100=**54.7 %**; restante67/148=**45.3 %**.
Redondeo a1decimal, sin promedio simple de porcentajes de MVP. No mide horas/esfuerzo,
calificación oficial ni eficacia clínica. Código Python de recálculo en el freeze.

| MVP | Total | DONE | PENDING | Avance técnico |
| --- | ---: | ---: | ---: | ---: |
| MVP-0 | 26 | 26 | 0 | 100.0 % |
| MVP-1 | 15 | 15 | 0 | 100.0 % |
| MVP-2 | 40 | 10 | 30 | 25.0 % |
| MVP-3 | 26 | 23 | 3 | 88.5 % |
| MVP-4 | 41 | 7 | 34 | 17.1 % |

## Cronograma / pendiente / Avance2

Conserva cronograma oficial: backend5–18oct, Flutter19oct–1nov, Analytics2–8nov,
IA9–15nov, soporte16–22nov, cierre23–29nov y evidencia/entrega30nov–6dic.
Fechas de integración verificadas: Web núcleo14oct (5días antes de su ventana),
Analytics14oct (19días antes), foundation IA14oct (26días antes, sin IA real),
core soporte15oct (32días antes, con summaries remainder pendiente).

El margen se usó para MVP1.5/historia/audit/autorización antes de integrar IA.
Secuencia restante: Avance2 research/evaluación/implementación MVP2 → MVP3remainder →
MVP4. Es forecast técnico sin fechas nuevas comprometidas; objetivo académico de
primera semana de diciembre2026 intacto.

Pendiente:30entregables IA real/evaluación/lifecycle AISummary/frontend;
3de consulta/UI/E2E de summaries delegados;34de testing final, accesibilidad,
Android/iOS, deployment/HTTPS/DB productiva, seguridad,monitoring/recuperación,
runbooks/release-check/documentación/evidencias/presentación/release.
Contratos dominio/Analytics/SummaryContext se describen tal como existen, sin
cambiarlos. Advisories residuales remiten a la auditoría de seguridad anterior.

## Archivos

- Nuevo `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md`:21secciones e inventario completo.
- `docs/AVANCE-1.md`:porcentajes/metodología/enlace/estado post-merge PR#5.
- `docs/Planeacion/ROADMAP_V1.md`:estado real y referencia, PLAN ORIGINAL intacto.
- `harness/codex/AVANCE1_FREEZE_REPORT.md`:trazabilidad y validación.
- `harness/codex/AVANCE1_FREEZE_PR.md`:este body para creación manual.

README/ADR/HARNESS/plan operativo sin cambios; no rutas backend/app/infra/CI alteradas.

## Validación / revisión humana

Recuento de148filas/81DONE/67PENDING, coherencia de porcentajes, enlaces locales,
cinco merges y PLAN ORIGINAL sin cambios verificados; git diff --check PASS.
No se repiten suites/builds locales por cambio documental. Evidencia técnica
heredada de closeout70unit/73E2E/27Flutter/migrations/seed/Docker/smoke.
Backend CI y Frontend CI **PASS** sobre5ccfbe98fdc00843933446ddaadfd969195bcce7;
el commit final documental se comprueba otra vez antes del handoff. Resultados y
enlaces en `harness/codex/AVANCE1_FREEZE_REPORT.md`. Workflows sin modificaciones.

Revisar inventario, cálculo, pendientes, fechas y ausencia de código en diff;
recalcular con el ejemplo del freeze y confirmar ambos CI antes del merge manual.
Este bloque se entrega READY_FOR_HUMAN_VALIDATION tras CI verde; no se declara
aceptación humana automática ni v1.0.0 completa.

Compare:
https://github.com/CarlosAM03/neuro-connect/compare/main...docs/avance1-freeze?expand=1

El agente no crea el PR, no mergea y no habilita auto-merge.
