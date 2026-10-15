# feat: add NeuroConnect support network and historical audit

Implementa MVP-1.5 conforme a ADR-008 sobre `04f6c8983b18881ba9d52899f70348bb1673d9f4`, conservando la baseline de Avance 1. Las acciones funcionales conservan la historia y el owner controla qué comparte con cada supporter.

- **Persistencia:** Goal CANCELLED/cancel/reactivate, CheckIn voidedAt y recálculo del progreso efectivo. Migraciones aditivas; aliases DELETE deprecated ejecutan cancel/void sin borrar registros. Analytics ignora voided, distingue cancelledGoals y excluye cancelados del denominador de completionRate.
- **Auditoría:** AuditEvent append-only, owner/actor y JSONB mediante allowlist sin secrets ni notes. Mutación + audit en la misma transacción, GET privado paginado y Activity en español. PostgreSQL rechaza UPDATE/DELETE directos; cascades quedan para cleanup interno de fixtures, sin API de eliminación de cuenta.
- **Red de apoyo:** relación única por par, alta por correo exacto existente, permisos dependientes, expiración por request, revoke/reactivate sin eliminar. SupportAccessService centraliza autorización; proyecciones separadas read-only incluyen CANCELLED y nunca notes/auditoría. Bloqueo compartido de Goal mantiene consistencia snapshot/timeline durante CheckIns concurrentes.
- **Flutter:** Mi red de apoyo, Personas a las que apoyo, contexto explícito del owner, vistas delegadas según permisos y Activity. Repositorios tipados, estados loading/error/retry/vacío y actualización dinámica de acceso; no rol global.
- **Seed/Docker:** tres cuentas sintéticas, cinco Goals, 25 CheckIns, dos permisos diferenciados y 37 eventos en DB limpia. Reejecutar conserva historia/auditoría. Mismo stack local de tres servicios e imágenes independientes; PostgreSQL externo en ejemplo productivo.

Validación local completa:

- Backend lint, **67 unit tests**, **72 E2E PostgreSQL reales**, build: PASS.
- Flutter analyze, **25 tests**, build web con Wasm dry run: PASS.
- Cuatro migrations desde DB vacía, seed dos veces con37 eventos estables: PASS; upgrade de baseline existente sin reset: PASS.
- Ambas imágenes Docker, Compose3 healthy, seed y smoke HTTP contenedorizado: PASS.
- Browser dual-user: Cancelado visible con VIEW_GOALS, progreso40% después de permiso, notes privadas, read-only, revoke→siguiente refresh sin acceso, reactivate→recuperación y Activity: PASS. Cruce PostgreSQL/API confirma misma relación y denegación404 de mutaciones/audit ajenos.
- Regresión Auth/Goals/CheckIns/Analytics/Dashboard/AI Preview: PASS; providerConfigured=false y sin proveedor externo.
- `git diff --check`: PASS.

CI remoto sobre `550e8acde141be05e942c634ed44294121685cea`: [Backend CI PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38699155050) y [Frontend CI PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38699154991), incluidas imágenes Docker. Los commits posteriores de handoff solo actualizan documentación.

Reporte completo y checklist humano: `harness/codex/MVP15_REPORT.md`.

Validación humana desde la raíz:

```powershell
git switch mvp1.5-support-audit
if (-not (Test-Path .env) -and -not (Test-Path backend/.env)) { node infra/setup-local.cjs }
docker compose up -d --build --wait
docker compose exec -T backend node seed-dist/seed.js
docker compose exec -T backend node scripts/smoke.cjs
docker compose ps
```

Abrir `http://127.0.0.1:5173` y `http://127.0.0.1:3000/api/docs`. Owner `demo@neuroconnect.local`; supporters `supporter@neuroconnect.local` (objetivos/progreso) y `supporter-goals@neuroconnect.local` (solo objetivos), todos con SEED_PASSWORD local. Desde Perfil revisar red, vistas compartidas y Activity. Los datos existentes se conservan; no eliminar el volumen para repetir el seed.

Limitaciones: no reconstruye historia físicamente eliminada antes de ADR-008; IA real/modelo/AISummary productivo/UI IA siguen diferidos. Web validada; APK/iOS no compilados. Findings previos de dependencias documentados en el reporte (runtime2 moderate/3 high), sin introducir dependencias nuevas. No paid services ni deployment nuevo. Aceptación humana pendiente.


Creación automática del PR: el conector GitHub devolvió403 `Resource not accessible by integration`. Rama publicada, validación técnica READY_FOR_HUMAN_VALIDATION. [Abrir comparación y crear PR manual](https://github.com/CarlosAM03/neuro-connect/compare/main...mvp1.5-support-audit?expand=1). Título recomendado: `feat: add NeuroConnect support network and historical audit`. Este archivo conserva el body completo para la revisión manual; no se realizó merge ni auto-merge.
