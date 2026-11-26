# Handoff único — cierre C2 del Avance 2

**Subbloque C2: evidencia completada, READY_FOR_HUMAN_VALIDATION documental.**
El proyecto/sprint beta continúa **PARTIALLY_COMPLETE** por IA real, otras
plataformas, operación pública, DEC-001 y aceptación FORMAL aún pendientes.
No se declara HUMAN_ACCEPTED, release ni 100% del proyecto.

## 1. Baseline y commits

Rama de continuidad `sprint/pre-ia-beta`; base inspeccionada local/remota:
`4f2ced9fdacfaaa7e071bf91cdffd5b3412da2ae`. Main conserva
`46b4304c563b0234102d79265a79f2292a6605e0`. Solo estaba sin seguimiento el paquete
C2 recibido. C2 no cambia código funcional, lockfiles, schema/migrations, ADR ni Compose.

| Commit | Unidad |
|---|---|
| c86b3ee | Activación, constancia manual, guía y runner de evidencia sanitizada |
| 5fed3aa | Pruebas observadas, reintentos y modelo de datos contrastado |
| 36825d8 | Capturas auténticas del navegador y logs actuales |
| 00b664f | Limpieza Docker selectiva y comprobación posterior |
| Commit que contiene este handoff | Manifiesto, fuentes y cierre/publicación controlada |

El SHA final se obtiene en la rama con `git log -1 --format=%H --
docs/evidence/avance2/HANDOFF_C2.md`; la respuesta final comunica el SHA exacto.

## 2. Antecedente humano y demo nueva

**Tu smoke exploratorio manual YA fue realizado satisfactoriamente**, comunicado
el 26/nov/2026: recorriste las pestañas y valoraste positivamente funcionamiento y
aspecto. Su hora exacta y capturas originales no fueron precisadas. Se conserva
como testimonio independiente, sin atribuirlo a Codex ni exigirte repetirlo.

Codex ejecutó una demo nueva con dos cuentas sintéticas: A propietario y B apoyo.
Cuatro objetivos en los cuatro estados, doce check-ins, búsqueda/filtro,
dashboard/gráfica, permisos y expiración, B autorizado, A revoca **desde la UI** y
B es denegado al actualizar. Privacidad/API verificadas por E2E y fixture script.
Se confirmó generación503 sin filas; no hay modelo/proveedor LLM real.

## 3. Resultados actuales

- Backend: lint/build PASS; **73 unitarias / 6 suites** y **78 E2E / 5 suites** PASS.
- Flutter: analyze sin incidencias, **33 tests** PASS y build Web PASS (168.8 s).
- Compose: build de ambas imágenes y tres servicios healthy; smoke HTTP A/B PASS.
- DB: PostgreSQL16.15, seis entidades, siete FK, cuatro migraciones aplicadas;
  `AuditEvent.entityId` no es una FK universal. Seed doble estable,37 eventos.
- Backup/restore: DB sintética nueva, seis tablas y checksums iguales, PASS.
- Reinicio: Goal/CheckIn/sesión/Audit persistentes, PASS antes y después de limpiar.
- Audit: exit1 con **3 high**,0 moderate/critical, por advisory residual conocido
  deepmerge-ts/Prisma. Policy gate exit0 no significa audit=0 ni resuelve DEC-001.
- Scanner de evidencia sin secretos conocidos; capturas inspeccionadas visualmente.

[Comandos exactos, UTC, versiones, exits y fallos conservados](pruebas/resumen.md).
Node22.16.0; npm host11.7.0/runner10.9.2; Flutter3.47.5/Dart3.13.4; Docker29.9.2.
Fallos iniciales de DB no iniciada se retuvieron como `*-attempt-1`, luego PASS;
un arranque paralelo al build tuvo estado intermedio y se verificó el final healthy.

## 4. Evidencias legibles y ERD

- [Login](capturas/01_login.jpg), [búsqueda/filtro](capturas/02_objetivos_filtros.jpg).
- [Dashboard](capturas/03_dashboard_grafica.jpg) y [gráfica completa](capturas/03b_dashboard_grafica_detalle.jpg).
- [Owner/permisos](capturas/04_owner_soporte_permisos.jpg) y [editor](capturas/04b_owner_editor_permisos.jpg).
- [B autorizado](capturas/05_supporter_acceso_autorizado.jpg), [B revocado](capturas/06_supporter_acceso_revocado.jpg).
- [Sin IA](capturas/07_resumen_sin_ia.jpg), [tres servicios](capturas/08_compose_estado.txt).
- [ERD SVG](diagramas/modelo_entidad_relacion.svg), [Mermaid editable](diagramas/modelo_entidad_relacion.mmd),
  [prueba real de FK/migraciones](diagramas/bd_prueba.json).
- [Manifiesto completo](MANIFIESTO_EVIDENCIAS.md): rutas, fechas, SHA, origen y rúbrica.

**Diferencia de formato explícita:** la API del navegador devuelve JPEG nativo;
se entregan nueve `.jpg` originales1280×720,DPR observado1.5. No se renombraron a
PNG ni se retocaron/recortaron para ocultar errores. El sufijo `b` es otra captura
real tras scroll/abrir diálogo. Compose/pruebas se entregan en logs legibles,
alternativa permitida por SPEC/S2. El SVG es documentación, no interfaz inventada.

Fixtures de gráfica: valores20/45/70 con timestamps asignados a hoy−6/hoy−3/hoy;
son datos sintéticos, no actividad real de una persona. Las dos cuentas se
limpiaron exactamente por sus IDs propios y sus credenciales temporales se borraron.

## 5. Limpieza Docker

[Resumen](docker/RESUMEN_LIMPIEZA.md), [antes](docker/ANTES.md),
[previo inmediato](docker/PRE_LIMPIEZA.md), [operaciones](docker/OPERACIONES.md),
[después](docker/DESPUES.md).

- Retirados33 contenedores ajenos detenidos; preservados los3 oficiales y2 antiguos
  NeuroConnect ambiguos (`lucid_visvesvaraya`, `upbeat_spence`). No intervenir estos
  últimos sin una decisión futura de su propietario.
- Imágenes37→3; caché154→0. Docker reportó24.4GB en image prune y14.27GB en
  builder prune, métricas separadas que no garantizan su suma como espacio físico
  de Windows. No se compactó VHDX ni se tocó WSL.
- **32 volúmenes conservados**, nombres idénticos y tamaño reportado1.303GB.
- Startup/smoke/persistencia posteriores PASS. Al terminar, los3servicios oficiales
  quedan detenidos con exit0 y conservados. No se eliminó ningún volumen.

## 6. Reproducir sin repetir el smoke humano como obligación

Desde raíz, conservar `.env` local. Si se clona por primera vez, configurarlo
desde `.env.example` con secretos locales que no se publiquen.

```powershell
git switch sprint/pre-ia-beta
docker compose config --quiet
docker compose up -d --wait
docker compose ps
Invoke-WebRequest http://localhost:3000/api/v1/health/ready
docker compose exec -T backend node scripts/smoke.cjs
docker compose stop
```

Web `http://localhost:5173`; API `http://localhost:3000/api/v1`. Las imágenes locales
conservadas no requieren reconstrucción para arrancar. Si no están disponibles,
`docker compose up -d --build --wait`; tras limpiar caché puede descargar/compilar
varios minutos. No `down -v`,volume prune ni eliminación de recursos ambiguos.
[Guía completa](EJECUCION_LOCAL.md). No se publican contraseñas ni JWT para reproducir.

## 7. Publicación y seguridad

Rama autorizada exclusivamente:
[sprint/pre-ia-beta](https://github.com/CarlosAM03/neuro-connect/tree/sprint/pre-ia-beta).
[Directorio de evidencias](https://github.com/CarlosAM03/neuro-connect/tree/sprint/pre-ia-beta/docs/evidence/avance2).
[Handoff remoto](https://github.com/CarlosAM03/neuro-connect/blob/sprint/pre-ia-beta/docs/evidence/avance2/HANDOFF_C2.md).

La publicación se confirma únicamente al obtener push exitoso y equivalencia
`git rev-parse HEAD` / `git ls-remote origin refs/heads/sprint/pre-ia-beta`.
El cierre remoto exacto queda comunicado en la respuesta final. Si esa operación
falla, estos archivos locales siguen siendo la entrega y no se afirma publicación.
Sin force push,PR,merge,tag,despliegue ni integración IA. Los PDF recibidos se
mantienen locales e intactos; no se genera nueva versión académica.

## 8. Límites y acciones humanas realmente pendientes

Revisión FORMAL de evidencia/rama/release y DEC-001; IA real por proceso ADR-005,
Android/iOS, CI remoto acreditado, hosting HTTPS/monitor/backups operacionales de
otros sprints. No se usan resultados locales para declarar CI remoto verde.
Topologías ADR-007 intactas: Cloudflare Pages + OCI Always Free(oRenderFree) +
Neon Free, costo obligatorio$0. No se provisionó ninguno de esos servicios.

## 9. Para actualizar el PDF académico desde ChatGPT

1. Leer este handoff y el manifiesto usando las URLs remotas exactas anteriores.
2. Incorporar01/02/03+03b/04+04b/05/06/07 como **capturas del26/nov/2026**,
   sin reemplazar la fecha de las imágenes históricas del Avance1.
3. Usar el SVG/Mermaid y la prueba de BD; no agregar FK universal a entityId.
4. Usar73/78/33 solo como conteos reejecutados en C2 y enlazar logs/fechas/exits.
5. Actualizar la narrativa “rama local/capturas pendientes” solo si la publicación
   fue confirmada, citando el SHA final de la respuesta o el remoto.
6. Mantener separadas tu exploración manual satisfactoria y la evidencia nueva
   automatizada/de navegador de Codex. No inventar acta detallada del recorrido previo.
7. Conservar DEC-001,IA/Android/operación pública y aceptación formal pendientes;
   no reinterpretar54.7% histórico como porcentaje actual ni declarar100%.
8. El autor realiza la actualización del PDF; C2 no lo editó ni lo regeneró.

## Human Validation Checklist

- [x] Smoke exploratorio local del responsable confirmado satisfactoriamente.
- [x] Capturas/pruebas actuales y limpieza selectiva documentadas por Codex.
- [ ] Revisar formalmente evidencias/DEC-001 y decidir pasos posteriores.
- [ ] PR/merge/release solo mediante autorización y revisión humana posteriores.
