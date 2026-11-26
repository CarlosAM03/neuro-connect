# Limpieza Docker controlada C2

Contexto `desktop-linux`, Docker29.9.2. Inventarios: [inicial](ANTES.md),
[justo antes de limpiar](PRE_LIMPIEZA.md), [posterior](DESPUES.md).
IDs/criterios/comandos/reclamación literal: [OPERACIONES.md](OPERACIONES.md).

| Recurso | Antes de limpiar | Después |
|---|---|---|
| Contenedores | 38 totales / 3 activos | 5 totales / 3 activos |
| Imágenes | 37 / 28.17 GB reportados | 3 / 1.566 GB reportados |
| Build cache | 154 registros / 14.27 GB | 0 / 0 B |
| Volúmenes | 32 / 1.303 GB | **32 / 1.303 GB**, mismos nombres |

Se retiraron **33 contenedores ajenos detenidos** con nombres/proyectos identificados
y revalidación de estado antes de cada `docker rm ID` (sin force y sin -v).
Se preservaron frontend/backend/postgres de NeuroConnect y sus imágenes utilizadas.
Los contenedores históricos `lucid_visvesvaraya` y `upbeat_spence`, etiquetados como
NeuroConnect, permanecen detenidos por pertenencia ambigua. No hubo contenedores
ajenos activos intervenidos ni borrado de redes, volúmenes, datos o WSL.

`docker image prune -a -f` se ejecutó después de la selección y comprobación de
preservación; el comando reportó **24.4 GB** recuperados. `docker builder prune
-a -f` reportó **14.27 GB**. Son métricas de Docker de categorías que pueden
compartir capas: no se suman como espacio físico garantizado recuperado en Windows
ni se afirma compactación del VHDX. Eliminar caché encarece una reconstrucción
futura (descarga y compilación), pero no impide arrancar imágenes conservadas.

Verificación posterior: `docker compose up -d --wait`, smoke HTTP A/B y ensayo
Goal/CheckIn/Audit tras reinicio; resultados en `../pruebas/post-cleanup-*`.
El cierre final detiene solamente los tres servicios oficiales con `compose stop`,
conservando los cinco contenedores y todos los volúmenes. No se afirma que haya
quedado un único contenedor ni que se eliminaron los dos recursos ambiguos.
