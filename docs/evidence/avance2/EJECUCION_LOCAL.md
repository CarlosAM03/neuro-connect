# Reproducir la beta de Avance 2

Requisitos: Git y Docker Desktop con motor Linux. Tres servicios oficiales:
frontend Flutter Web, backend NestJS y PostgreSQL 16. Desde raíz, en
`sprint/pre-ia-beta`, conservar `.env` existente; si falta, copiar `.env.example`
y configurar secretos locales fuera de Git. No imprimir `docker compose config`
expandido: usar `--quiet`. No se necesitan proveedor ni claves LLM.

```powershell
git status --short
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
Invoke-WebRequest http://localhost:3000/api/v1/health/ready
docker compose exec -T backend node scripts/smoke.cjs
```

Web: `http://localhost:5173`; API: `http://localhost:3000/api/v1`; Swagger de desarrollo:
`http://localhost:3000/api/docs`. Registrar dos cuentas **sintéticas** con contraseñas
locales que no se compartan: propietario A y apoyo B. A crea objetivos, registra
check-ins 20/45/70 y consulta Seguimiento; otorga a B permiso para objetivos y
progreso con expiración futura; B consulta Personas a las que apoyo, sin notas
privadas ni auditoría de A. A revoca y B actualiza: acceso denegado. Las capturas
C2 documentan una ejecución concreta de ese flujo, con cuentas de evidencia aisladas.

Perfil → Mis resúmenes muestra indisponibilidad. POST autenticado `/ai/summaries`
responde 503 sin crear filas; no se muestran textos mock como generación real.

Para tests directos: Node 22.16, dependencias backend y Flutter 3.47.5/Dart 3.13.4.
`node infra/setup-test.cjs` prepara una DB separada; ejecutar lint/test/test:e2e/build
desde backend, analyze/test/build web desde app. Los comandos, fechas, conteos y
exits efectivamente observados quedan en `pruebas/`.

```powershell
docker compose stop
```

Conserva los tres contenedores y todos los volúmenes. No usar `down -v`, reset,
volume prune ni limpiar recursos ajenos activos. El smoke exploratorio del autor
ya fue confirmado; esto es una guía reproducible, no un nuevo requisito de repetición.
