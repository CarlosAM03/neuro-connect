# Limpieza Docker controlada: preservar recursos del Avance 2

## Principio de seguridad

El usuario pidió liberar espacio de imágenes/containers sobrantes, dejando los recursos de la demo de NeuroConnect. **El Compose actual tiene tres servicios (frontend/backend/postgres)**, no un único contenedor. Proteger los tres, sus imágenes y todo volumen, especialmente `postgres_data` y cualquier BD de usuario.

## Antes de hacer cambios

1. Detectar el contexto Docker actual y ruta del repo. Ejecutar y guardar resumen seguro: `docker context show`, `docker ps -a`, `docker image ls`, `docker volume ls`, `docker system df`, `docker compose ps`.
2. Listar IDs, nombres, `com.docker.compose.project`, estado, imagen y tamaño sin exportar `.Env`, `docker inspect` completo, credenciales ni mounts sensibles.
3. Identificar el proyecto `neuroconnect` según `compose.yaml`; asegurar que frontend, backend y postgres existen y health/smoke pasan.
4. Registrar `docs/evidence/avance2/docker/ANTES.md`: proyecto, recursos que se preservan, candidatos a remoción, criterio y espacio inicial. Ninguna destrucción antes del inventario.

## Acciones autorizadas sin más decisiones

- Quitar **contenedores detenidos/exited/dead** inequívocamente ajenos a NeuroConnect después de registrar sus IDs/nombres. Si la pertenencia es dudosa, conservar y marcar pendiente.
- Quitar imágenes que hayan quedado **sin referencia por ningún contenedor preservado** y que no sean necesarias para los contenedores NeuroConnect. `docker image prune -a` únicamente DESPUÉS de eliminar contenedores sobrantes y comprobar preservación de los tres del demo. Si no se cumplen las condiciones, ejecutar eliminaciones selectivas.
- Limpiar caché Docker build no necesaria, sin volúmenes (`docker builder prune`, y solo si se registra costo de reconstrucción posible).
- Registrar conteos, IDs relevantes y `docker system df` después.

## NO ejecutar

- `docker compose down -v`
- `docker volume prune`, `docker system prune --volumes`, `docker rm -v`
- borrar volúmenes, directorios de datos, backups, redes activas compartidas o recursos WSL por fuera del alcance Docker
- detener/eliminar contenedores **ajenos y activos** sin confirmación explícita del dueño de la sesión; preservar y reportar
- eliminar servicios de Compose NeuroConnect o imágenes asociadas, aunque no estén arrancados
- usar `docker system prune -a -f --volumes`

## Comprobación final

- `docker compose ps -a` documenta tres servicios (pueden quedar `stopped` después del smoke).
- `docker compose up -d` funciona y `GET /api/v1/health/ready` pasa. Probar que un Goal/CheckIn sintético registrado en la BD permanece tras reinicio, si la prueba es segura.
- `docker compose stop` conserva contenedores y volúmenes.
- `docs/evidence/avance2/docker/DESPUES.md` incluye espacio recuperado, candidatos omitidos y motivo. No afirmar 'solo NeuroConnect quedó' cuando hay otros contenedores ajenos activos que se preservaron por seguridad.

Nota: el comando `docker container prune` no discrimina el proyecto; preferir selección explícita de IDs tras inventario. Los volúmenes se preservan incluso si quedan sin uso.
