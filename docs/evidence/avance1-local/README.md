# Evidencias locales de Avance 1

Corte visual: 15 de octubre de 2026 (America/Tijuana). Baseline documental integrada:
`e81fcbdd5c3e1154733ac220d4596dd059af759d`, merge del freeze en main.
Este conjunto documenta pantallas existentes; no cambia funcionalidad ni declara
aceptación humana, generación IA real o cierre de v1.0.0.

**Resultado: 18 PNG de 19 posiciones.** La posición 17 está pendiente por una
limitación de captura de la consola, detallada abajo. No se creó una imagen sustituta.

| Archivo | Evidencia | Qué demuestra | MVP | Datos utilizados |
| --- | --- | --- | --- | --- |
| [01-login.png](01-login.png) | Login | Branding, correo, contraseña vacía y acción de entrada | MVP-0 | Formulario sin credenciales visibles |
| [02-profile.png](02-profile.png) | Perfil | Sesión owner, nombre, correo y accesos disponibles | MVP-0 | Cuenta de demostración, demo@neuroconnect.local |
| [03-goals-list.png](03-goals-list.png) | Objetivos | Lista con Activo, Cancelado y Completado; categoría y progreso | MVP-0 / MVP-1.5 | Seed y objetivo adicional aún activo en esta toma |
| [04-goal-detail.png](04-goal-detail.png) | Detalle | Descripción, categoría, fecha objetivo, 70 %, estado y acciones | MVP-0 | Objetivo adicional sintético |
| [05-checkin-create.png](05-checkin-create.png) | Formulario | Progreso, dificultad, cumplimiento y comentario privado opcional | MVP-0 | Valores iniciales 70 %, dificultad media y parcial; no se envió otro registro |
| [06-checkin-history.png](06-checkin-history.png) | Historia | Tres registros efectivos, orden descendente, fechas, dificultad y cumplimiento | MVP-0 | 70 %, 40 %, 20 %; comentario neutro de evidencia |
| [07-goal-cancelled.png](07-goal-cancelled.png) | Cancelación | Cancelado visible, registro nuevo deshabilitado, reactivación e historia conservada | MVP-1.5 | Mismo objetivo adicional tras cancelación reversible |
| [08-dashboard.png](08-dashboard.png) | Seguimiento | Métricas determinísticas: activos, completados, cancelados, promedio y frecuencia | MVP-1 | Owner: 6 objetivos, 3 activos, 1 completado, 2 cancelados; promedio 60,50 % |
| [09-progress-chart.png](09-progress-chart.png) | Gráfica | Serie temporal real con cinco puntos y ejes | MVP-1 | Seed: Organizar las entregas, 10/20/35/45/60 %, 18/09–14/10/2026 |
| [10-support-owner.png](10-support-owner.png) | Mi red de apoyo | Relaciones activas, permisos explícitos, sin expiración y acciones owner | MVP-1.5 | Apoyo solo objetivos; Apoyo de demostración |
| [11-supporter-owners.png](11-supporter-owners.png) | Personas a las que apoyo | Owner autorizado y contexto de solo lectura | MVP-1.5 | supporter@neuroconnect.local consulta Cuenta de demostración |
| [12-delegated-goals.png](12-delegated-goals.png) | Objetivos compartidos | Contexto owner, Cancelado visible y aviso de privacidad/solo lectura | MVP-1.5 | Relación activa con VIEW_GOALS y VIEW_PROGRESS; sin comentarios |
| [13-delegated-progress.png](13-delegated-progress.png) | Progreso compartido | Diálogo real de consulta, gráfica, dificultad y tres registros sin notes | MVP-1.5 | VIEW_PROGRESS activo, mismo objetivo adicional cancelado |
| [14-activity-audit.png](14-activity-audit.png) | Actividad privada | Eventos reales en lenguaje humano: creación, check-ins, cancelación y relaciones | MVP-1.5 | Auditoría del owner sintético; no auditoría delegada |
| [15-ai-preview.png](15-ai-preview.png) | AI Preview técnico | Respuesta HTTP 200 del GET /api/v1/ai/summary/context, context, prompt y providerConfigured=false | Foundation MVP-2 | Cuenta supporter: no tiene objetivos propios, por eso context contiene ceros; no son métricas delegadas |
| [16-swagger.png](16-swagger.png) | OpenAPI | NeuroConnect API, versión y endpoints /api/v1 de Health/Auth | Foundation | http://127.0.0.1:3000/api/docs, sin autorización aplicada en la toma |
| 17-compose-healthy.png — **NOT AVAILABLE** | Compose | NOT AVAILABLE AS UI EVIDENCE: consola no expuesta como ventana capturable; salida técnica real registrada abajo | Foundation | Stack local existente, sin reconstrucción ni eliminación de volúmenes |
| [18-ci-backend.png](18-ci-backend.png) | Backend CI | Success del freeze integrado en main, commit e81fcbd | Foundation / Avance 1 | Run público [38720476346](https://github.com/CarlosAM03/neuro-connect/actions/runs/38720476346), sin login GitHub |
| [19-ci-frontend.png](19-ci-frontend.png) | Frontend CI | Success del mismo freeze en main | Foundation / Avance 1 | Run público [38720476335](https://github.com/CarlosAM03/neuro-connect/actions/runs/38720476335), sin login GitHub |

## Datos y condiciones

Se reutilizaron el seed local y el fixture temporal ya existente
`tmp/avance1-evidence/fixture.cjs`. El fixture no está versionado ni forma parte del
producto. No se reconstruyó el stack, no se reejecutó el seed durante esta
continuación y no se eliminaron volúmenes ni datos previos.

Cuentas del seed: `demo@neuroconnect.local` (Cuenta de demostración),
`supporter@neuroconnect.local` (Apoyo de demostración) y relación existente con
`supporter-goals@neuroconnect.local` (Apoyo solo objetivos). No se publican contraseñas.
El owner y el supporter se autenticaron sucesivamente en la UI real.

El fixture de la ejecución anterior creó únicamente el objetivo
**Evidencia local Avance 1 — Organizar una actividad**, descripción
“Objetivo sintético para documentar las pantallas existentes de NeuroConnect.”,
categoría Evidencia local y fecha objetivo 01/11/2026. Tiene tres CheckIns 20/40/70,
dificultad 3, cumplimiento PARTIAL y comentario
“Registro de prueba para evidencia local”. La continuación canceló ese objetivo
mediante la confirmación existente: “Conservarás su historial y podrás reactivarlo”.
No se modificaron permisos, expiraciones ni objetivos del seed para conseguir las fotos.

Las tomas son secuenciales: 03–06 son anteriores a la cancelación; 07–14 reflejan
el estado posterior. El dashboard excluye los cancelados de las métricas que
corresponde según las reglas existentes. La gráfica 09 corresponde al objetivo
del seed indicado en su selector, no al primer objetivo de la sección Tendencias.
Los tres registros del fixture ocurrieron el mismo día; su orden descendente se
ve en 06 y su orden de progreso temporal en 13.

12/13 requieren relación activa con VIEW_GOALS y VIEW_PROGRESS. VIEW_SUMMARIES
permanece deshabilitado. El supporter solo consulta: no se muestran acciones de
escritura ni comentarios privados. Las notas neutras de 04/06/07 pertenecen a la
cuenta owner sintética y no aparecen en 12/13. Una captura visual no sustituye las
pruebas de autorización del backend; este bloque no vuelve a auditar el producto.

AI Preview carece de pantalla productiva de generación: se usa Swagger con una
respuesta real de la cuenta supporter (contexto propio vacío). La autorización se
aplicó temporalmente sin fotografiar el diálogo ni el curl y la pestaña se cerró
al terminar. La URL, respuesta 200, contexto, prompt controlado y false son visibles;
el método GET se verifica en la operación OpenAPI. No se llamó un proveedor IA ni
se generó/persistió un resumen. El prompt explica expresamente que cancelar no
implica fracaso. Los encabezados de respuesta visibles no contienen credenciales.

## Reproducción local

Desde la raíz, reutilizar el entorno local configurado siguiendo el README principal.
No imprimir variables ni contraseñas en la terminal de captura.

```powershell
docker compose ps
# Solo si los servicios no están activos:
docker compose up -d --build --wait
# Solo si es necesario preparar una instalación local nueva y sintética:
docker compose exec -T backend node seed-dist/seed.js
```

Abrir Flutter en http://127.0.0.1:5173 y Swagger en
http://127.0.0.1:3000/api/docs. Usar las credenciales demo del mecanismo de setup local,
sin fotografiarlas. Perfil da acceso a red, personas apoyadas y actividad. Seguimiento
contiene el dashboard y selector de gráfica. Objetivos permite detalle, formulario,
historial y cancelación reversible. Para reproducir datos adicionales, usar el
formulario existente y los valores sintéticos descritos arriba; no es necesario
versionar ni incorporar el fixture temporal al producto.

## Posición 17: brecha de captura, comprobación técnica real

`docker compose ps --format 'table {{.Service}}\t{{.Status}}\t{{.Ports}}'` se ejecutó
correctamente durante la continuación del 15/10/2026:

```text
SERVICE    STATUS                 PORTS
backend    Up 2 hours (healthy)   127.0.0.1:3000->3000/tcp
frontend   Up 2 hours (healthy)   127.0.0.1:5173->8080/tcp
postgres   Up 2 hours (healthy)   127.0.0.1:5434->5432/tcp
```

Se preparó una consola dedicada sin secretos, pero su ventana no fue devuelta por
el inventario de captura nativo después de los intentos de apertura. Por tanto,
no hay imagen 17 ni una representación artificial de terminal. Para completar esa
posición humanamente, abrir una terminal limpia, ejecutar el comando anterior y
capturar su salida como `17-compose-healthy.png`, ocultando la ruta personal del
prompt de forma natural. No hace falta reconstruir ni resetear el entorno.

## Formato, revisión y límites

- 01: PNG 1836×1080, conservada sin recaptura.
- 02–14: PNG 1280×720, render completo y legible.
- 15/16/18/19: PNG 1265×712, superficie técnica del navegador.
- El transporte de captura devolvió JPEG: se convirtió a PNG sin cambiar tamaño,
  recortar, retocar ni recomprimir con pérdida. Se compararon todos los píxeles RGB
  antes/después y se verificó formato y apertura de cada PNG.
- 02/03 originales se recapturaron por render incompleto y baja resolución. El resto
  corresponde a UI/servicios reales. No se alteró la UI para la foto.
- Revisión visual individual de las 18 imágenes: PASS. Sin valores de contraseñas,
  JWT, Authorization/Bearer, API keys, cookies, variables sensibles, datos reales o
  rutas personales. El rótulo de contraseña vacío de 01 y el botón Authorize de
  Swagger no contienen credenciales. GitHub muestra únicamente metadatos públicos
  del repositorio solicitado, incluyendo su handle y commit.
- No se modificó código, esquema, dependencias, tests, workflows ni documentación
  de autoridad. No se ejecutaron gates de producto de nuevo: no cambió producto.
- CI del freeze: ambas capturas corresponden a main e81fcbd, no a esta rama de
  evidencias. El reporte registra por separado el CI posterior a su publicación.

Estado del conjunto: **READY_FOR_HUMAN_VALIDATION_WITH_DOCUMENTED_GAPS**.
