# Referencia de comandos de verificación

**Verificar contra código real antes de ejecutar.** Los comandos provienen de la configuración observada en `main` (19-nov-2026); pueden cambiar en el sprint. No son resultados ejecutados.

```bash
# Desde raíz: Docker Compose exige .env local con variables del Compose
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 backend

# API local por defecto
curl -i http://localhost:3000/api/v1/health
curl -i http://localhost:3000/api/v1/health/ready

# Desde backend con Node 22 compatible
cd backend
npm ci
npm run lint
npm test
npm run test:e2e
npm run build
# Los scripts smoke requieren contexto/servicios; revisar su contrato antes
npm run smoke
npm run smoke:seed
npm run smoke:migrations

# Desde app con Flutter compatible
cd ../app
flutter pub get
flutter analyze
flutter test
flutter build web --dart-define=API_BASE_URL=http://localhost:3000/api/v1
# Solo si Android SDK disponible:
flutter build apk --dart-define=API_BASE_URL=<url_reachable_from_android>/api/v1
```

El stack observó `postgres:16-bookworm`, exposición `127.0.0.1:5434→5432`, `127.0.0.1:3000→3000` y `127.0.0.1:5173→8080`. Nunca usar `docker compose down -v`, `prisma migrate reset`, `git clean -fd` sobre datos del usuario. Los scripts `smoke:*` pueden crear datos en DB; utilizarlos únicamente sobre entorno de ensayo.

## Gate table Codex

| Gate | Comando/evidencia | Resultado |
|---|---|---|
| Backend lint | `npm run lint` | NOT_RUN |
| Backend unit | `npm test` | NOT_RUN |
| Backend E2E PostgreSQL | `npm run test:e2e` | NOT_RUN |
| Backend build | `npm run build` | NOT_RUN |
| Flutter analyze | `flutter analyze` | NOT_RUN |
| Flutter unit/widget | `flutter test` | NOT_RUN |
| Flutter Web build | `flutter build web ...` | NOT_RUN |
| Docker build/healthy | `docker compose up -d --build` | NOT_RUN |
| HTTP smoke A/B | API/UI real | NOT_RUN |
| Android APK | `flutter build apk ...` | NOT_RUN |
| Backup+restore DB prueba | Script/runbook | NOT_RUN |

Actualizar esta tabla en el reporte de Codex; conservar `NOT_RUN` cuando falte SDK, Docker, acceso o DB.
