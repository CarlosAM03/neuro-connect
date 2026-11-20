# Baseline verificada antes del sprint

## Repositorio

- GitHub: `https://github.com/CarlosAM03/neuro-connect`
- Rama predeterminada: `main`
- Último commit de main consultado el 2026-11-19: `46b4304c563b0234102d79265a79f2292a6605e0` (merge PR #7 de evidencias, fechado 2026-10-15). **No tratarlo como HEAD inmutable**: Codex debe verificarlo contra la rama local y remota actual al iniciar.
- Ramas históricas observadas: `mvp0`, `mvp1`, `mvp2-avance1`, `mvp1.5-support-audit`, `sprint/avance1-closeout`, `docs/avance1-freeze`, `docs/avance1-local-evidence`, `main`.
- Inventario vigente al freeze: 148 entregables, 81 DONE y 67 PENDING = 54.7 % (medición histórica al 15 de octubre; no porcentaje real de noviembre).

| Incremento | DONE | Total | Pendiente |
|---|---:|---:|---:|
| MVP-0 núcleo | 26 | 26 | 0 |
| MVP-1 analítica | 15 | 15 | 0 |
| MVP-2 IA | 10 | 40 | 30 |
| MVP-3 red de apoyo | 23 | 26 | 3 |
| MVP-4 cierre | 7 | 41 | 34 |

## Archivos canónicos que DEBEN consultarse en el repositorio

- `README.md`
- `harness/HARNESS.md` **(no reemplazar)**
- `docs/ADRS/Anteproyecto_NeuroConnect_IA_G_Carlos_Armenta.pdf`
- `docs/ADRS/ADR-001 — Esquema relacional y modelo de datos de NeuroConnect.md`
- `docs/ADRS/ADR-002-DOMINIO-Y-DISENO-V1.md`
- `docs/ADRS/ADR-003-BACKEND-V1.md`
- `docs/ADRS/ADR-004-FRONTEND-V1.md`
- `docs/ADRS/ADR-005-INTEGRACION-IA-V1.md`
- `docs/ADRS/ADR-006-ARQUITECTURA-SISTEMA-V1.md`
- `docs/ADRS/ADR-007-DEVOPS-INFRAESTRUCTURA-V1.md`
- `docs/ADRS/ADR-008-Auditoría, persistencia histórica y red de apoyo de NeuroConnect v1.0.0.md`
- `docs/Planeacion/ROADMAP_V1.md`
- `docs/Planeacion/PLAN_IMPLEMENTACION_AVANCE_1.md`
- `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md` **(inventario granular original, con IDs M0..M4)**
- `docs/Planeacion/avance1-closeout.md`
- `harness/codex/AVANCE1_CLOSEOUT_REPORT.md`
- `harness/codex/AVANCE1_FREEZE_REPORT.md`

Si alguno falta, buscarlo en el árbol antes de suponer inexistencia y dejar la ausencia explícita. La copia del contexto NO autoriza sobreescribir la fuente original.

## Estado técnico reproducible del freeze, no garantía actual

- Backend: NestJS 11, TypeScript, Prisma 6, PostgreSQL 16, JWT/Argon2id, Swagger. `backend/package.json` usa Node `>=22.16.0 <23`.
- Flutter/Dart: `app/pubspec.yaml` establece Flutter `3.47.5`, Riverpod, go_router, Dio, fl_chart, Material 3.
- `compose.yaml`: `postgres`, `backend` y `frontend`; PostgreSQL expuesto solo por loopback (puerto host 5434 por defecto); API `http://localhost:3000/api/v1`; Web `http://localhost:5173`; imagen frontend sirve dentro del contenedor en puerto 8080.
- `AI_PROVIDER: mock` y `AI_PREVIEW_ENABLED: true` en compose **solo desarrollo**. Prohibido exponer mock como IA generativa real o habilitar preview técnico en despliegue público.
- Scripts backend: `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run smoke`, `npm run smoke:seed`, `npm run smoke:migrations`, `npm run migrate:deploy`.
- Evidencia freeze: 70 unitarias backend, 73 E2E backend, 27 pruebas Flutter, 4 migraciones, CI y smoke local satisfactorios. Repetirlos: no son garantías del estado actual.

## Integridad de línea base

**No modificar** anteproyecto/ADR/plan original por iniciativa propia. Si es indispensable cambiar uno, registrar un bloqueador para revisión humana. Documentar divergencias de README o código sin reescribir jerarquía documental silenciosamente.
