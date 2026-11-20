# Primera beta manual — ADR-007

Preparación operativa; no acredita despliegue público ni aceptación. Topología A:
Cloudflare Pages + OCI Always Free (contenedor NestJS) + Neon Free PostgreSQL 16.
Alternativa B: Cloudflare Pages + Render Free (mismo Dockerfile) + Neon Free.
Costo recurrente obligatorio $0. El responsable verifica cuotas, capacidad y
condiciones gratuitas en las consolas antes de crear recursos; si no hay capacidad,
detiene esa alta y evalúa la alternativa aprobada. Sin addons, autoscaling pagado,
dominio comprado ni despliegue automático desde este repositorio.

## Precondiciones y configuración

Tras smoke humano, revisión y merge humano: registrar SHA aprobado, gates CI y
auditoría residual en `docs/security/DEPENDENCY_AUDIT_PREIA.md`. Revisar migraciones
antes de ejecutarlas y obtener backup si la DB ya contiene datos.

Configurar en el proveedor, fuera de Git y de Flutter:

| Variable | Valor/configuración |
|---|---|
| NODE_ENV | production |
| DATABASE_URL | conexión PostgreSQL externa directa con TLS; credencial del responsable |
| JWT_SECRET | secreto aleatorio de al menos 32 caracteres |
| JWT_EXPIRES_IN | 8h u otra duración aceptada |
| CORS_ORIGINS | origen HTTPS exacto de Pages, sin wildcard ni slash final |
| PORT | puerto asignado por el host (3000 en VM) |
| SWAGGER_ENABLED | false |
| AI_PREVIEW_ENABLED | false (la app rechaza true en producción) |
| AI_PROVIDER | mock; solo seam interno bloqueado en production, sin generación pública |

No configurar AI_API_KEY ni modelo. No cargar SEED_PASSWORD en producción. No
ejecutar seed, migrate dev, reset ni publicar el puerto PostgreSQL. La conexión
directa de Neon sirve para migraciones; verificar PostgreSQL 16 al crear la DB.
No cambiar el esquema o añadir pooling por iniciativa del operador.

## Backend portable

Desde raíz, sustituir SHA por el commit aprobado (etiqueta de imagen local, no tag Git):

```sh
docker build -t neuroconnect-backend:SHA ./backend
docker run --rm --env-file .env.production neuroconnect-backend:SHA npm run migrate:deploy
docker run -d --name neuroconnect-api --restart unless-stopped --env-file .env.production -p 127.0.0.1:3000:3000 neuroconnect-backend:SHA
```

En OCI: provisionar manualmente una VM elegible Always Free, acceso SSH por clave,
firewall mínimo y proxy HTTPS Caddy o Nginx + Let's Encrypt según ADR-007. Elegir
primero un nombre DNS gratuito y método TLS compatible; no asumir que la IP de la
VM proporciona HTTPS. Exponer solamente HTTPS y SSH restringido; API por loopback.
Conservar imagen anterior por SHA y base externa al contenedor. Nunca agregar
Docker socket o credenciales del host al contenedor de aplicación.

En Render: crear manualmente Web Service **Free**, root directory `backend`,
runtime Docker, Dockerfile `Dockerfile`, health path `/api/v1/health/ready`.
Desactivar auto deploy para el primer cambio controlado. Configurar las variables
anteriores y el comando de arranque `sh -c 'npm run migrate:deploy && exec node dist/main.js'`.
No depender del filesystem efímero, no crear PostgreSQL sidecar ni servicio pagado.
Revisar UI actual del proveedor, cold starts y plan Free antes de confirmar.

## Flutter Web / Cloudflare Pages

Con API HTTPS real saludable, desde `app`:

```sh
flutter pub get --enforce-lockfile
flutter build web --release --no-web-resources-cdn --dart-define=API_BASE_URL=https://API_HOST/api/v1
```

`API_HOST` debe sustituirse por el host real. Subir **build/web** manualmente a
Cloudflare Pages mediante Direct Upload (dashboard). No subir fuentes, .env o
node_modules. Confirmar subdominio gratuito pages.dev. Direct Upload implica
elegir ese modo de proyecto: no habilita integración Git automática en ese mismo
proyecto después. La SPA usa el fallback de Pages al no existir `404.html` raíz.
El cliente conserva su estrategia actual de URLs (incluidas rutas hash).
Probar refresh/deep link a objetivos y resúmenes autenticados, y redirección a login
sin sesión. Verificar URL API embebida en build y CORS desde el navegador.

## Verificación y rollback

- GET HTTPS `/api/v1/health` y `/api/v1/health/ready` deben responder 200.
- Swagger y preview deben quedar inaccesibles; POST autenticado `/ai/summaries`
  debe responder 503 sin inserción en AISummary. No interpretar esto como IA operativa.
- Ejecutar flujo A/B manual del handoff; comprobar revocación y notes privadas.
- Reiniciar solo backend y verificar historia persistente en Neon.
- Configurar monitor gratuito de Web/API y alertas conforme INCIDENT-RUNBOOK.
- Registrar URLs, SHA, fecha, plan $0 y resultados; no copiar credenciales a evidencia.

Para rollback, detener el contenedor nuevo y recrear con la **imagen anterior por
SHA** y mismo env externo; en Render seleccionar despliegue anterior aprobado;
en Pages volver al artefacto previo con su API compatible. Health + smoke A/B.
No ejecutar down migrations ni restaurar encima de DB viva. Si schema es
incompatible, detener escrituras y aplicar BACKUP-RESTORE-RUNBOOK hacia DB nueva.

Fuentes consultadas 2026-11-19: [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/),
[SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/),
[Neon TLS](https://neon.com/docs/connect/connect-securely).
La consola y cuotas finales requieren verificación humana; no se ejecutaron altas.
