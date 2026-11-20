# Smoke test humano — NeuroConnect beta pre-IA

**Responsable:** validación manual posterior al handoff de Codex. **No sustituye tests de Codex.** Ejecutar desde raíz del repositorio, después de revisar reportes de la rama `sprint/pre-ia-beta`. En PowerShell usar los comandos de consola equivalentes. **No usar base de datos productiva, no borrar volúmenes ni ejecutar `down -v`.**

## A. Preparación

1. Verificar `git status`, `git branch --show-current`, `git log -1 --oneline`; estar en branch de Codex, no main. Revisar `RESULTADOS/HANDOFF_HUMANO.md` (puede contener rutas/puertos actualizados).
2. Instalar/iniciar Docker Desktop/Engine. Revisar `compose.yaml` y `.env.example` actuales; si no existe `.env` de la raíz, **crear localmente** desde `.env.example` si existe y definir secretos de desarrollo no reales, sin publicar ni compartirlos. No usar llaves IA reales. Verificar `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`, puertos, CORS y API_BASE_URL. Si hay datos locales valiosos, hacer respaldo previo.
3. Comando orientativo conforme al Compose verificado del freeze:

```powershell
docker compose config
docker compose up -d --build
docker compose ps
```

4. Esperar a que `postgres` y `backend` estén healthy. Según Compose inicial, frontend `http://localhost:5173` y API `http://localhost:3000/api/v1`; confirmar si Codex actualizó la configuración. Health:

```powershell
Invoke-WebRequest http://localhost:3000/api/v1/health
Invoke-WebRequest http://localhost:3000/api/v1/health/ready
```

5. Si falla, revisar sin exponer secretos:

```powershell
docker compose logs --tail=100 postgres
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
```

## B. Flujo manual de producto

| N° | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| 01 | Crear usuario Owner A e iniciar sesión | Registro/login correctos | [ ] PASS [ ] FAIL |
| 02 | Refrescar navegador y navegar a ruta privada | Sesión se restaura / protección correcta | [ ] PASS [ ] FAIL |
| 03 | Modificar displayName de A | Perfil se actualiza y persiste | [ ] PASS [ ] FAIL |
| 04 | Crear objetivo y check-ins 40% y 70% | Progress 70%, historial íntegro | [ ] PASS [ ] FAIL |
| 05 | Consultar dashboard y detalle | Indicadores y timeline corresponden al API | [ ] PASS [ ] FAIL |
| 06 | Pausar objetivo e intentar check-in | Rechazo consistente; reactivar permite nuevo | [ ] PASS [ ] FAIL |
| 07 | Invalidar check-in 70% | Último efectivo 40%; fila invalidada permanece en historia | [ ] PASS [ ] FAIL |
| 08 | Cancelar y reactivar otro objetivo | No se borra meta/historial; cambia estado correcto | [ ] PASS [ ] FAIL |
| 09 | Revisar Activity | Eventos legibles y no filtrados fuera del owner | [ ] PASS [ ] FAIL |
| 10 | Crear usuario B | B tiene su propio dashboard/objetivos separados | [ ] PASS [ ] FAIL |
| 11 | B intenta ver recursos de A sin relación | Rechazo; no fuga de información | [ ] PASS [ ] FAIL |
| 12 | A añade B con VIEW_GOALS | B ve metas autorizadas y estados históricos | [ ] PASS [ ] FAIL |
| 13 | B sin VIEW_PROGRESS consulta a A | No expone progreso detallado/notes | [ ] PASS [ ] FAIL |
| 14 | A concede VIEW_PROGRESS | B ve progreso autorizado, nunca notes ni AuditEvent | [ ] PASS [ ] FAIL |
| 15 | B intenta modificar meta/check-in de A | Imposible desde UI y API | [ ] PASS [ ] FAIL |
| 16 | A revoca acceso a B | B pierde acceso al refrescar y vía deep link | [ ] PASS [ ] FAIL |
| 17 | Verificar vigencia y reactivación | Respeta expiración y permisos actuales | [ ] PASS [ ] FAIL |
| 18 | Abrir IA sin proveedor configurado | Mensaje honesto de indisponibilidad, no mock engañoso | [ ] PASS [ ] FAIL |
| 19 | Navegación a 390px y desktop; teclado | Sin overflow, focus/labels consistentes | [ ] PASS [ ] FAIL |
| 20 | Reiniciar contenedores sin eliminar volumen | Datos persisten | [ ] PASS [ ] FAIL |

Para los pasos 12–17 alterna dos sesiones de navegador (normal/incógnito) para mantener identidades simultáneas. Si `VIEW_SUMMARIES` tiene fixtures solo de test, **no esperes resúmenes reales en la UI de producción**.

## C. Android (solo si tienes SDK/dispositivo)

Revisa `RESULTADOS/HANDOFF_HUMANO.md` para comando exacto y URL apropiada. `localhost` en dispositivo no equivale al host: usar configuración de red correspondiente, sin debilitar TLS productivo. Comprobar login, metas, check-ins, dashboard y soporte. Si no disponible, anotar `NOT_RUN`, no PASS.

## D. Cierre seguro

`docker compose stop` detiene servicios; `docker compose down` no borra volúmenes por sí solo. **No usar `docker compose down -v`**. No limpiar a ciegas bases locales. Completar `RESULTADOS/SMOKE_HUMANO.md` desde plantilla y pegarlo en `PROMPTS/CIERRE_POST_SMOKE.md` para la pasada de cierre.

## E. Evidencias

Registrar fecha, SHA, SO/versión Docker, comandos, screenshots sin credenciales, PASS/FAIL por caso, logs redactados, bugs reproducibles con secuencia precisa y tus decisiones expresas sobre `DEC-NNN`.
