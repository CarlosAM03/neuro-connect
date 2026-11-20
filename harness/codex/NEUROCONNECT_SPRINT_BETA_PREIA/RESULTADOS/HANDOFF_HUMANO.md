# Handoff único — validación humana local

Estado: **PARTIALLY_COMPLETE**, fases01–07 recorridas en un bloque. Implementación
Web/backend entregada; Android sin SDK, iOS sin Xcode y seguridad productiva con
DEC-001 pendiente. No HUMAN_ACCEPTED ni v1.0.0 concluida.

- Rama: `sprint/pre-ia-beta`; base `46b4304c563b0234102d79265a79f2292a6605e0`.
- SHA final: `git rev-parse HEAD` al recibir esta entrega; el commit documental
  que contiene este archivo se identifica con `git log -1 --format=%H --
  harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/RESULTADOS/HANDOFF_HUMANO.md`.
- Commits/gates/inventario: `REPORTE_FINAL_SPRINT.md`, `MATRIZ_ENTREGABLES.md` y
  `PRUEBAS.md`. DEC-001 en `DECISIONES_PENDIENTES.md`.
- Main intacta. Sin push, PR, merge, tag, release o despliegue público.
- Servicios Compose detenidos al finalizar (exit0); el arranque de abajo los vuelve a iniciar con el volumen conservado.
- Los doce reportes previos eliminados de su ruta anterior y `AVANCE_1/` sin
  seguimiento ya estaban al iniciar: se preservaron fuera de nuestros commits.
  El working tree no se declara limpio por esos cambios humanos.

## Arranque desde raíz (PowerShell)

Si ya existe `.env`, conservarlo. Si no existe, copiar `.env.example` y configurar
localmente POSTGRES_PASSWORD, JWT_SECRET aleatorio>=32 caracteres y SEED_PASSWORD
>=12 caracteres para seed opcional. No pegar valores en chat, reportes o Git.

```powershell
git branch --show-current
git log --oneline main..HEAD
git status --short
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
Invoke-WebRequest http://localhost:3000/api/v1/health
Invoke-WebRequest http://localhost:3000/api/v1/health/ready
docker compose exec backend node scripts/smoke.cjs
```

URLs: Web `http://localhost:5173`, API `http://localhost:3000/api/v1` y Swagger
local `http://localhost:3000/api/docs`. Primer build requiere descargar dependencias;
la ejecución posterior usa artefactos locales. No hay dependencia de LLM.

Seed demo **opcional**, preserva historia si ya existe:

```powershell
docker compose exec backend node seed-dist/seed.js
```

Cuenta owner `demo@neuroconnect.local`, supporter `supporter@neuroconnect.local`,
otro supporter `supporter-goals@neuroconnect.local`; contraseña configurada por ti
en SEED_PASSWORD, no se muestra aquí. Si modificaste los fixtures antes, no esperes
que el seed reinicie estados/permisos. El smoke técnico crea y limpia sus propias
dos cuentas sintéticas; no reutiliza ni borra tus cuentas.

## Smoke de dos cuentas

Usar dos sesiones (normal/incógnito) con cuentas sintéticas A y B; completar los
20 casos de `../OPERACION/SMOKE_LOCAL_HUMANO.md` y registrar PASS/FAIL/NOT_RUN:

1. A registro/login, refrescar sesión y deep link; editar perfil. Crear Goal
   ACTIVE/0; check-ins40 y70 con nota sintética privada. Dashboard/historial coherentes.
2. Pausar impide check-in; reactivar permite. Invalidar70 conserva registro y
   vuelve a40; Activity explica ambos porcentajes. Cancelar/reactivar conserva
   historia; 100% no completa automáticamente. Probar búsqueda y cinco filtros.
3. B sin relación no ve A. A agrega email exacto de B con VIEW_GOALS. B ve cuatro
   estados y snapshot; no progreso detallado sin VIEW_PROGRESS. A lo concede,
   B ve timeline efectiva, nunca notes/AuditEvent; no puede escribir en A.
4. A revoca: B pulsa Actualizar y prueba deep link; acceso desaparece. Probar
   expiración y reactivación con permisos actuales. B conserva sus datos propios.
5. Perfil → Mis resúmenes: aviso de generación indisponible, lista vacía sin
   contenido inventado. Con VIEW_SUMMARIES, B también ve colección vacía real;
   no se crean fixtures IA en la DB de producto. POST autenticado `/ai/summaries`
   responde503 y no persiste. Preview técnico solo local, no salida generativa.
6. Navegar en390px/escritorio, zoom/texto200%, teclado Tab y lector de pantalla;
   revisar formularios/diálogos/gráfica. Logout y volver atrás no muestra datos.
7. Reiniciar con `docker compose restart` y `docker compose up -d --wait`; historia
   persiste. Al terminar: `docker compose stop`. Nunca `down -v` ni reset/clean.

## Gates directos y recuperación (opcionales con Node/Flutter instalados)

```powershell
node infra/setup-test.cjs
Set-Location backend
npm ci
npm run prisma:generate
npm run lint
npm test
npm run test:e2e
npm run build
npm run audit:gate
npm run smoke:migrations
Set-Location ..
node infra/backup-restore-smoke.cjs
node infra/persistence-smoke.cjs
Set-Location app
flutter pub get --enforce-lockfile
flutter analyze
flutter test
flutter build web --no-web-resources-cdn --dart-define=API_BASE_URL=http://localhost:3000/api/v1
Set-Location ..
```

`setup-test` requiere también backend/.env local configurado; si falta y ya tienes
.env raíz, crear backend/.env a partir del ejemplo sin sobrescribir credenciales.
En esta máquina Flutter está en C:/src/flutter/bin y requiere System32/Git en PATH.
Los ensayos usan solo DB/usuarios sintéticos propios y no borran volúmenes.
`npm audit` sigue exit1 por residual; policy gate solo admite el advisory documentado.

Android: seguir `docs/operations/CLIENT-PLATFORMS.md`; APK/install aún NOT_RUN por
SDK ausente. iOS: requiere macOS. Primer deploy humano y monitoreo en
`ACCIONES_EXTERNAS.md` / `docs/operations/DEPLOYMENT-RUNBOOK.md`, sin costo obligatorio.

## Human Validation Checklist

- [ ] Revisé diff/commits y los cambios locales previos de reportes.
- [ ] Compose/health/smoke técnico pasan y revisé el flujo A/B completo.
- [ ] Confirmé privacidad, cancel/reactivate/void, Activity y generación indisponible.
- [ ] Revisé teclado, responsive, texto grande y lector de pantalla.
- [ ] Dejé Android/iOS como NOT_RUN o aporté evidencia real de instalación/ejecución.
- [ ] Respondí DEC-001 antes de cualquier publicación.
- [ ] Completé `SMOKE_HUMANO.md` desde plantilla y envié observaciones mediante
  `../PROMPTS/CIERRE_POST_SMOKE.md`. No abriré sprint IA por accidente.
