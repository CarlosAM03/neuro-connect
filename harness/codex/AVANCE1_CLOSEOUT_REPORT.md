# AVANCE1_CLOSEOUT_REPORT

## Sprint / Branch / Base / Scope

- Sprint: AVANCE-1-CLOSEOUT, iniciado 2026-10-15.
- Branch: `sprint/avance1-closeout`, creada directamente desde `origin/main`.
- Base commit: `d3920d955956263b3baac72d0dd4a350e697df9e` (merge humano PR #4).
- Primer commit: `4152bf6`, únicamente el plan humano existente, sin editarlo.
- Scope: correcciones semánticas CHECKIN_VOIDED/averageProgress, auditoría de dependencias, CI general, metadata Flutter y sincronización documental. Sin nuevas capacidades ni IA real.
- Status: IN_PROGRESS. Final commit y validaciones finales pendientes.

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

## Human Validation Checklist

- [ ] Revisar corrección void 70 → snapshot 40 y Activity nueva/histórica.
- [ ] Revisar promedio elegible 73.33 y mismo valor en AI Preview.
- [ ] Revisar auditoría de seguridad y excepciones documentadas.
- [ ] Reproducir Compose, seed y smoke completos.
- [ ] Revisar CI final y documentación de cierre antes del PR humano.
