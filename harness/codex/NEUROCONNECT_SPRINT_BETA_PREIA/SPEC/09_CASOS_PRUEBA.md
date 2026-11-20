# Casos de prueba y escenarios reproducibles

> Codex debe incorporar casos automáticos donde sea razonable y pruebas manuales en el handoff. Cada caso requiere PASS/FAIL/NOT_RUN y evidencia (nombre test, comando, exit code, SHA). No son afirmaciones de ejecución.

| Caso | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| AUTH-01 | Cuenta inexistente | Registro válido | Crea User, email normalizado, no filtra hash |
| AUTH-02 | Sesión válida | Refrescar Web/navegación deep link | Se restaura sesión antes de render privado |
| AUTH-03 | Logout | Navegar hacia atrás/deep link privado | No se exponen datos de cuenta anterior |
| GOAL-01 | Owner A | Crear Goal | ACTIVE/0, histórico/auditoría correspondiente |
| GOAL-02 | Goal activo | Editar metadatos | progress no editable directamente |
| GOAL-03 | Goal ACTIVE, PAUSED, COMPLETED, CANCELLED | Registrar check-in | Solo ACTIVE acepta |
| GOAL-04 | Goal progreso 40, luego 70 | Invalidar último check-in | Se conserva registro, progress vuelve a 40, auditoría |
| GOAL-05 | Goal activo | Cancelar/reactivar | Historia conserva ambos eventos y check-ins |
| ANALYTICS-01 | CheckIns efectivos/voided | Consultar overview | Ignora voided, canceled no aporta al denominador elegible |
| ANALYTICS-02 | Último CheckIn >7d activo | Consultar tendencia | INACTIVE, nunca diagnóstico |
| ANALYTICS-03 | Solo cancelados | Consultar overview | completionRate/averageProgress según semántica vigente, no NaN |
| SUP-01 | A, B y C | B sin relación solicita Goals de A | 401/403/404 según contrato seguro; sin fuga |
| SUP-02 | A otorga VIEW_GOALS a B | B consulta A | Listado cuatro estados con proyección autorizada, sin progreso restringido |
| SUP-03 | A añade VIEW_PROGRESS | B consulta A | Progreso autorizado sin notes ni AuditEvent |
| SUP-04 | B intenta crear/modificar/void Goal de A | HTTP mutación | Rechazo, BD sin mutación ni AuditEvent ajeno |
| SUP-05 | A revoca a B | B actualiza/deep link | Denegación inmediata; no cache sensible visible |
| SUP-06 | Permiso vencido | B lee A | Denegación en cada request |
| SUP-07 | A reactiva | B consulta | Solo permisos/vigencia explícitos actuales |
| AUD-01 | A hace mutación | Consulta Activity | Evento una vez, owner/actor/timestamp correctos, sin secrets |
| AUD-02 | Fallo de inserción auditoría | Mutación transaccional | Rollback completo |
| AI-SEAM-01 | Sin LLM configurado | Abrir sección IA | Mensaje no disponible; NO resumen inventado |
| AI-SEAM-02 | Fixture COMPLETED owner A | B con VIEW_SUMMARIES | Proyección mínima sin inputSnapshot/internals |
| AI-SEAM-03 | Fixture COMPLETED owner A | C sin autorización / B revocado | Denegación, incluso deep link |
| AI-SEAM-04 | Fixture FAILED/PENDING | B consulta | No se comparte como resumen válido |
| WEB-01 | Pantalla estrecha y ancha | Navegar formularios/tabs | Sin overflow y con navegación equivalente |
| WEB-02 | Texto grande / teclado | Usar formularios | Labels, focus y controles accesibles |
| OPS-01 | Compose local | Restart containers | PostgreSQL persiste volumen no borrado |
| OPS-02 | DB vacía prueba | migrate deploy + seed de desarrollo | Migraciones consistentes, seed no destruye historia |
| OPS-03 | DB prueba con datos | pg_dump + restore en DB distinta | Conteos/lecturas íntegros, no afecta origen |
| OPS-04 | Build frontend prod sin LLM | Abrir en entorno probado | No preview o mock de IA expuestos |
| ANDROID-01 | SDK + dispositivo disponible | Instalar APK, autenticar y seguir Goal | Flujo funciona usando URL API apropiada |

**Notas:** no introducir tests destructivos contra DB del usuario. Si una prueba no es automatizable sin credenciales, documentar la acción humana exacta y dejar `NOT_RUN`; no presentar la imposibilidad como PASS.
