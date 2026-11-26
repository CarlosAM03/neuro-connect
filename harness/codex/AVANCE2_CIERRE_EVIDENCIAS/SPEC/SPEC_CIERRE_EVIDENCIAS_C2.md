# SPEC — Evidencias verificables y prototipo entregable para Avance 2

## S0. Contexto y límites

El profesor solicita ocho aspectos: (1) desarrollo funcional, (2) prototipo navegable/ejecutable, (3) base de datos y arquitectura, (4) evidencias, (5) comparación cronograma, (6) pruebas/validaciones, (7) documentación técnica y (8) plan de cierre. La narrativa de todos ya existe en el PDF de referencia. **Faltan capturas actuales, publicación de la evidencia reproducible y contraste del esquema en la rama de trabajo.** La revisión manual de navegación en la máquina del responsable ya se realizó y se confirmó el 26/nov/2026; eso acredita experiencia exploratoria satisfactoria, no resultados de pruebas detalladas ni una aceptación formal de release. Este bloque se limita a cerrar esas brechas. No es sprint de IA, despliegue, Android ni release.

Partir del estado local existente. Referencia informada por el autor: rama `sprint/pre-ia-beta`, SHA `05c584c7db193e90128d1ba996db080410645335`, 12 commits locales y `PARTIALLY_COMPLETE` al 19/nov/2026. **No asumir** que es HEAD actual ni reescribir historia. Verificar `git status`, `git branch -vv`, `git log -1`, `git remote -v`, tree y los archivos `RESULTADOS/*`. Preservar modificaciones previas o de otras tareas.

## S1. Verificación reproducible del prototipo actual (entregable 2)

**Antecedente humano confirmado:** el responsable ya recorrió las pestañas de la beta local en su equipo y reportó que funcionaban y se veían satisfactoriamente. NO repetir esta tarea como requisito pendiente del responsable. La ejecución de Codex a continuación tiene un fin distinto: generar evidencia objetiva, capturas y logs actuales con datos sintéticos.

- Comprobar requisitos de `.env` sin revelar valores. Usar exclusivamente datos sintéticos aislados.
- Ejecutar `docker compose up -d --build`; corroborar frontend, backend y postgres (el Compose oficial tiene **tres servicios/contenedores**, no uno).
- Health/readiness, página de Flutter Web y ruta SPA deben funcionar. Registrar puertos y comandos, nunca contraseñas, JWT ni headers.
- Demostración real de dos cuentas: A (owner), B (supporter). Validar registro/login, objetivos (creación/filtro), check-ins, gráfica, alta de relación con permisos, lectura limitada, revocación y acceso denegado a B tras revocar.
- Verificar que IA generativa NO está conectada: estado deshabilitado/503 sin crear registros ni fingir respuestas.
- Crear guía simple `docs/evidence/avance2/EJECUCION_LOCAL.md` con requisitos, arranque, rutas, instrucciones para crear cuentas sintéticas y cierre seguro; no subir `.env`.

## S2. Capturas auténticas del sprint (entregable 4)

Guardar bajo `docs/evidence/avance2/capturas/`, PNG nativos del navegador, sin recortar para esconder errores ni editar contenidos. Usar viewport/dpi registrados y fecha real de captura. Mínimos:

1. `01_login.png` — pantalla real de login sin credenciales.
2. `02_objetivos_filtros.png` — objetivos y funcionalidad de búsqueda/filtros.
3. `03_dashboard_grafica.png` — dashboard y evolución temporal basada en check-ins de datos sintéticos.
4. `04_owner_soporte_permisos.png` — owner administra permisos y expiración.
5. `05_supporter_acceso_autorizado.png` — B ve únicamente datos permitidos.
6. `06_supporter_acceso_revocado.png` — B ya no accede tras revocación (sin URLs ni tokens sensibles visibles).
7. `07_resumen_sin_ia.png` — UI real de indisponibilidad y ausencia de resúmenes generados.
8. `08_compose_estado.png` — evidencia de tres servicios, healthy, con identificadores seguros (captura o salida redactada a `.txt`).
9. `09_pruebas_resumen.png` — evidencia de resultados reales, con comandos, conteos y exit codes; se aceptan logs `.txt` si screenshot es ilegible.

Si las capturas automatizadas no son posibles en el entorno, NO dibujar una interfaz ni reutilizar Avance 1 como si fuera actual: documentar bloqueo y entregar una **guía de capturas manuales** con los datos sintéticos usados.

## S3. Evidencia de BD y arquitectura (entregable 3)

- Leer `backend/prisma/schema.prisma` real en la rama; corroborar tablas User, Goal, CheckIn, SupportRelationship, AuditEvent y AISummary, FK y cardinalidades.
- Generar `diagramas/modelo_entidad_relacion.mmd` o `.dot`, y exportar PNG/SVG si hay renderer; incluir fuente editable y referencia al SHA. No inventar FKs: `AuditEvent.entityId` no es FK universal.
- Registrar `prisma migrate status` / migraciones aplicadas o evidencia equivalente con DB de prueba. No incluir cadenas de conexión. No alterar schema/migrations salvo fallo demostrado que bloquee captura y quede autorizado por los ADR.

## S4. Pruebas actuales y errores (entregable 6)

- Reejecutar lo disponible: lint/build y unit backend, E2E PostgreSQL, Flutter analyze/test/build web, smoke HTTP, control de privacidad (owner-supporter), `pg_dump`/`pg_restore` en BD de **prueba separada** si seguro. No modificar ni borrar volúmenes/datos reales.
- Registrar comando, fecha UTC/local, versión de herramientas, SHA, estado, exit code, conteo observado, motivo de omisión. Los números 73/78/33 son antecedente **no meta forzada**.
- Reevaluar vulnerabilidades con salida apta para compartir (resumir advisory sin rutas ni secretos). DEC-001 sigue abierta: no declarar que está cerrada ni forzar cambio mayor de Prisma.
- Guardar `pruebas/resumen.md`, logs redacted y fallas. No enviar HTML/snapshots con datos privados o claves.

## S5. Integridad documental, evidencias versionadas y publicación controlada

- Crear `docs/evidence/avance2/README.md` (qué puede demostrarse / qué sigue pendiente).
- Crear `docs/evidence/avance2/MANIFIESTO_EVIDENCIAS.md` usando la plantilla: cada archivo -> ruta -> fecha -> SHA -> comando/origen -> cuenta sintética -> requisito (1-8) -> estado.
- Actualizar `harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/RESULTADOS/` solo con enlaces de continuidad o en `docs/evidence/avance2/`, sin sobreescribir informes anteriores.
- Crear `docs/evidence/avance2/HANDOFF_C2.md` con comandos exactos para que el humano reproduzca y para que ChatGPT pueda leer evidencia desde GitHub.
- Commits pequeños: (a) plan + guía de reproducibilidad, (b) diagramas y pruebas, (c) capturas + manifiesto, (d) reporte limpieza. No forzar números si algún paso no modifica archivos.
- Autorizar `git push -u origin sprint/pre-ia-beta` (SOLO esta rama) **después** de escaneo de secretos, `git diff --check` y revisión de evidencias. NO PR, merge, etiqueta release ni deployment. Si no hay credenciales GitHub, documentar bloqueo y empaquetar evidencias localmente, sin afirmar publicación.

## S6. Liberación controlada de espacio Docker (ver documento dedicado)

- Inspección ANTES; preservación de NeuroConnect (frontend/backend/postgres), imágenes utilizadas y volúmenes.
- Limpieza de contenedores **detenidos y claramente ajenos** a NeuroConnect, imágenes ya sin referencias y caché de build; capturar el espacio recuperado.
- Contenedores ajenos activos o ambiguos: no intervenir automáticamente; identificarlos para decisión del propietario. La instrucción de limpiar sobrantes no equivale a interrumpir servicios en ejecución ni borrar datos.
- Inspección DESPUÉS y smoke básico de NeuroConnect. Conservar contenedores de NeuroConnect incluso si quedan detenidos al terminar; Docker Compose requiere tres servicios.

## S7. Definition of Done

DONE académico de este *subbloque* solo si hay: (1) demo actual, (2) capturas actuales de al menos los flujos principales, (3) ERD referenciado al schema, (4) pruebas actuales y logs, (5) manifiesto, (6) limpieza segura y comparación de espacio, (7) rama de evidencias accesible remotamente o bloqueo explícito, (8) handoff único. De lo contrario marcar PARTIALLY_COMPLETE y listar causas, sin bloquear otras tareas.

No se declara finalizado el proyecto completo; siguen pendientes IA real, Android, CI remoto, deployment, aceptación FORMAL de rama/release y DEC-001. La navegación exploratoria humana local SÍ se realizó; no afirmar que nunca existió ni que equivale a aprobación formal del release.
