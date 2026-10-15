# Avance 1 — Baseline freeze

## 1. Identificación del corte

- Proyecto: NeuroConnect, Inteligencia Artificial (G), agosto–diciembre de 2026.
- Responsable: Carlos Benjamín Armenta Márquez.
- Corte: **15 de octubre de 2026**, America/Tijuana (UTC−07:00 en este corte).
- Estado de Avance 1: **CLOSED**; closeout integrado humanamente mediante PR #5.
- Bloque actual: AVANCE-1-DOCUMENTAL-FREEZE; únicamente documentación.
- Esta es una **fuente técnica consolidada**, no el documento/PDF académico final,
  una calificación, evidencia de eficacia clínica o aceptación humana de este bloque.

## 2. Baseline Git

**freezeCommit = `fad9cf73924fc334c57a77526a9f017069ceb4c5`**.
Es el HEAD de main actualizado desde el que nace `docs/avance1-freeze`; contiene
el merge PR #5, `sprint/avance1-closeout → main`, realizado el
2026-10-15T09:25:19Z / 2026-10-15 02:25:19 America/Tijuana. No había commits
posteriores ni cambios locales al crear la rama. El commit de publicación de este
documento será distinto del freezeCommit: no cambia la baseline ejecutable.

| PR integrado | Incremento | Merge commit | Fecha/hora America/Tijuana |
| --- | --- | --- | --- |
| [#1 — Mvp0](https://github.com/CarlosAM03/neuro-connect/pull/1) | Repository Foundation + MVP-0 | fd371d0c1ac552d383ddd95465e5bc1093048cae | 2026-10-14 04:04:21 |
| [#2 — Mvp1](https://github.com/CarlosAM03/neuro-connect/pull/2) | MVP-1 | dcc91e24fdf5ad338159e67cb72374eb805f2a78 | 2026-10-14 05:21:21 |
| [#3 — Mvp2 avance1](https://github.com/CarlosAM03/neuro-connect/pull/3) | Foundation MVP-2 + estabilidad | 04f6c8983b18881ba9d52899f70348bb1673d9f4 | 2026-10-14 19:45:49 |
| [#4 — Mvp1.5 support audit](https://github.com/CarlosAM03/neuro-connect/pull/4) | MVP-1.5 | d3920d955956263b3baac72d0dd4a350e697df9e | 2026-10-15 00:42:26 |
| [#5 — Sprint/avance1 closeout](https://github.com/CarlosAM03/neuro-connect/pull/5) | AVANCE-1-CLOSEOUT | fad9cf73924fc334c57a77526a9f017069ceb4c5 | 2026-10-15 02:25:19 |

Fechas contrastadas con Git (`git log --merges --format='%H %cI %s'`) y campos
merged/merge_commit_sha/merged_at de cada PR. Son fechas verificadas de integración,
no estimaciones de horas trabajadas ni prueba de cuándo comenzó cada tarea.

## 3. Propósito del freeze y autoridad

Conservar una fotografía trazable para preparar después narrativa, capturas,
resultados, dificultades, porcentajes y cambios del cronograma del entregable académico.
Autoridad: anteproyecto → ADR aceptados → roadmap/plan → HARNESS → evidencia.
ADR-008 prevalece sobre los puntos que modifica explícitamente. Closeout fija las
decisiones semánticas aprobadas de averageProgress y CHECKIN_VOIDED, sin editar ADRs.
Este inventario mide el alcance vigente; no crea requisitos ni reemplaza sus DoD.

Abreviaturas de fuentes utilizadas en las matrices:

| Clave | Fuente |
| --- | --- |
| A | [Anteproyecto](../ADRS/Anteproyecto_NeuroConnect_IA_G_Carlos_Armenta.pdf), §§3.4–3.5,5–8, páginas5–12 |
| R | [ROADMAP_V1](ROADMAP_V1.md), números § corresponden a sus encabezados originales |
| P | [PLAN_IMPLEMENTACION_AVANCE_1](PLAN_IMPLEMENTACION_AVANCE_1.md) |
| D1 | [ADR-001 — Persistencia](<../ADRS/ADR-001 — Esquema relacional y modelo de datos de NeuroConnect.md>) |
| D2 | [ADR-002 — Dominio](../ADRS/ADR-002-DOMINIO-Y-DISENO-V1.md) |
| D3 | [ADR-003 — Backend](../ADRS/ADR-003-BACKEND-V1.md) |
| D4 | [ADR-004 — Frontend](../ADRS/ADR-004-FRONTEND-V1.md) |
| D5 | [ADR-005 — IA](../ADRS/ADR-005-INTEGRACION-IA-V1.md), arquitectura aceptada; modelo pendiente |
| D6 | [ADR-006 — Arquitectura](../ADRS/ADR-006-ARQUITECTURA-SISTEMA-V1.md) |
| D7 | [ADR-007 — DevOps](../ADRS/ADR-007-DEVOPS-INFRAESTRUCTURA-V1.md) |
| D8 | [ADR-008 — Historia, auditoría y soporte](<../ADRS/ADR-008-Auditoría, persistencia histórica y red de apoyo de NeuroConnect v1.0.0.md>) |
| C | [Plan closeout](avance1-closeout.md), especialmente §§8–10,14–15,26–30 |
| H | [HARNESS](../../harness/HARNESS.md), jerarquía, validación, Git y aceptación humana |

## 4. Plan original

El universo de v1.0.0 conserva **MVP-0 → MVP-1 → MVP-2 → MVP-3 → MVP-4**.
Avance 1 planeaba completar MVP-0, MVP-1 e iniciar técnicamente MVP-2. La generación
LLM real, sus resúmenes y el cierre de producción nunca fueron condición para
declarar completa esa foundation. Tampoco equivalía Avance 1 a toda v1.0.0.
Se conserva el cronograma académico de A§8/R, reproducido en §13.

## 5. Ejecución real

MVP-0 → MVP-1 → foundation MVP-2 → MVP-1.5/core MVP-3 adelantado →
AVANCE-1-CLOSEOUT → **Avance 2/MVP-2 completion pendiente** → MVP-3 remainder → MVP-4.

El desarrollo se encontró por delante de las ventanas técnicas iniciales. El margen
se aprovechó para estabilizar historia, auditoría y autorización delegada antes de
IA real. MVP-1.5 reorganizó la ejecución sin crear un sexto bloque de alcance. La IA
real se reservó deliberadamente para Avance 2 sobre contratos estables; no se
describe esa reorganización como fallo o retraso de una ventana aún no iniciada.

## 6. Evolución de los MVP

| Incremento original | Estado de aceptación al corte | Observación |
| --- | --- | --- |
| MVP-0 | DONE | Núcleo y Web; dominio vigente incorpora cancelación/void no destructivos |
| MVP-1 | DONE | Analytics/Dashboard determinísticos, semántica estabilizada por closeout |
| MVP-2 | STARTED / foundation only | Arquitectura/contexto/prompt/mock/preview/schema; no LLM real |
| MVP-3 | Core adelantado; DoD completo PENDING | Resto de resúmenes productivos depende de MVP-2 |
| MVP-4 | PENDING como cierre final | Varios prerrequisitos locales ya existen; release readiness no validada |

| Incremento de ejecución | Estado | Alcance adelantado y ubicación única en el cálculo |
| --- | --- | --- |
| MVP-1.5 | DONE, PR #4 integrado | CANCELLED/void/historia → MVP-0; Analytics adaptado → MVP-1; relaciones/permisos/auditoría privada → MVP-3; no subtotal global propio |
| AVANCE-1-CLOSEOUT | Integrado, PR #5 | Corrige contratos existentes y documenta seguridad/CI; no suma otro MVP |

## 7. Metodología de cálculo de avance

**Estimación técnica por entregables verificables**, inventario versión1 del corte.
Se parte de los DoD R§37/48/82/101/124 y requisitos asociados A/D1–D8; se separan
resultados observables cuando un requisito compuesto permite comprobaciones
independientes. Cada fila con ID `M0-...` a `M4-...` constituye una unidad de peso1,
con fuente normativa y evidencia de implementación o brecha. No se pondera por
horas, esfuerzo, líneas, archivos, commits ni importancia clínica.

Reglas para reproducir y limitar sesgos:

1. DONE exige artefacto existente más validación registrada que cubra el criterio.
   PENDING incluye implementación inexistente o falta de evidencia del resultado
   final. La mera presencia de un schema, proyecto de plataforma, endpoint vacío
   o mock no demuestra funcionamiento productivo.
2. Se normalizan duplicados entre DoD y ADR: un requisito repetido tiene una sola
   fila. Frontend y API son resultados independientes cuando requieren validaciones
   distintas; la tabla no cuenta cada pantalla además de cada endpoint homólogo.
   Una fila de pruebas cubre la validación de una familia, no cada test individual.
3. Cada fila pertenece a un único MVP. Foundation de infraestructura se ubica en
   MVP-4 como prerrequisito realizado; schema de negocio en el MVP de su entidad.
   Auditoría transversal de D8 se asigna una sola vez a MVP-3; cancelación/void
   una sola vez a MVP-0. MVP-1.5 no añade filas duplicadas ni un denominador nuevo.
4. En IA se distinguen el scaffold físico y el lifecycle productivo. La allowlist
   y prompt se consideran DONE en la frontera local; su cumplimiento por un modelo
   real se valida por las filas pendientes de benchmark/integración.
5. Las pruebas de núcleo completadas no sustituyen la regresión final con IA real,
   plataformas y despliegue: sus criterios son diferentes y están explícitos.
6. Excluidos del universo: funcionalidades post-v1 expresamente fuera de alcance
   (chat, notificaciones, RAG, agentes, fine-tuning, etc.). La preparación académica
   y release final sí se incluyen por A§7/R§133–142/186–187.

Fórmulas (redondeo decimal **a1 decimal, half-up**, aplicado al resultado):

```text
MVP_i % = 100 × count(DONE con prefijo Mi-) / count(filas con prefijo Mi-)
PROJECT COMPLETION % = 100 × count(DONE en M0..M4) / count(filas en M0..M4)
PROJECT REMAINING % = 100 − PROJECT COMPLETION %
Participación pendiente de MVP_i = 100 × count(PENDING Mi-) / TOTAL global
```

No se promedian porcentajes de MVP: sus denominadores son distintos. La granularidad
es una decisión de medición publicada y revisable, no una escala oficial del docente.
Un cambio de inventario requiere versión y explicación; no puede alterarse para
inflar el indicador. No mide esfuerzo restante: una integración externa puede
costar más que varias filas DONE. Tampoco sustituye la aceptación binaria de cada DoD.

## 8. Porcentaje por MVP original — inventario atómico

Las claves de evidencia E0/E1/E2/E15/EC y código se resuelven en §20. Para PENDING,
la última columna identifica la prueba/artefacto que falta; no simula evidencia.

### MVP-0 — Núcleo

| ID | Entregable / criterio verificable | Estado | Fuente | Evidencia al freeze |
| --- | --- | --- | --- | --- |
| M0-01 | Registro crea usuario con email normalizado y unicidad | DONE | R§23,37; D3§189 | AUTH; E0; EC |
| M0-02 | Contraseña usa Argon2id y no se expone passwordHash | DONE | R§25; D3§189 | AUTH; core E2E |
| M0-03 | Login emite JWT y guard rechaza token inválido/expirado | DONE | R§23,25 | AUTH; core E2E |
| M0-04 | Restauración /auth/me y estado de sesión inicial | DONE | R§35–37; D4 | SESSION; E0 |
| M0-05 | Logout elimina sesión y datos privados del cliente | DONE | R§37 | SESSION; widget tests; E0 |
| M0-06 | Perfil propio se consulta | DONE | R§21,37 | PROFILE; core E2E |
| M0-07 | Perfil actualiza displayName con DTO | DONE | P§8.2; D3§189 | PROFILE; core E2E |
| M0-08 | Goal create arranca ACTIVE/0, metadata validada | DONE | R§26–28; D3§190 | GOALS; core E2E |
| M0-09 | Goal list muestra solo datos propios | DONE | R§26,37 | GOALS; core E2E |
| M0-10 | Goal detail valida owner y UUID | DONE | R§26; D3§190 | GOALS; core E2E |
| M0-11 | Goal update modifica metadata sin editar progress | DONE | R§26,28 | GOALS; core E2E |
| M0-12 | Lifecycle ACTIVE/PAUSED/COMPLETED aplica transiciones válidas | DONE | R§27; D8 | goal.policy; E15; EC |
| M0-13 | CANCELLED conserva Goal e historia, sustituyendo delete destructivo | DONE | D8§120; R§37 actualizado por D8 | GOALS; support-audit E2E |
| M0-14 | Reactivación preserva la historia del Goal | DONE | D8§120 | GOALS; E15 |
| M0-15 | CheckIn create valida progreso/dificultad/completion/notes | DONE | R§29–30; D3§191 | CHECKINS; core E2E |
| M0-16 | PAUSED, COMPLETED y CANCELLED rechazan CheckIns | DONE | R§31,37; D8 | goal.policy; core/support E2E |
| M0-17 | CheckIn + Goal.progress se escriben atómicamente | DONE | R§32; D3§191 | CHECKINS; concurrency E2E |
| M0-18 | Historial efectivo privado se consulta en orden temporal | DONE | R§33,37 | CHECKINS; E0/E15 |
| M0-19 | Detalle owner conserva acceso al CheckIn histórico invalidado | DONE | D3§191; D8 | CHECKINS; support-audit E2E |
| M0-20 | Void conserva fila y recalcula snapshot desde último efectivo o0 | DONE | D8§120; C§9 | CHECKINS; EC:40→70→void→40 |
| M0-21 | Ownership y parent binding impiden acceso/mutación cruzados | DONE | R§25,37; D1§47 | core/support E2E; EC |
| M0-22 | DTO rechaza mass assignment y campos desconocidos | DONE | R§25; D3§189 | bootstrap; core E2E |
| M0-23 | Schema User/Goal/CheckIn tiene FK, índices, UTC y restricciones SQL | DONE | D1; P§7 | schema y migrations; EC |
| M0-24 | Seed núcleo reproducible conserva datos al reejecutar | DONE | P§10; D8 | seed; migration-smoke; EC |
| M0-25 | Flutter consume Auth/Profile/Goals/CheckIns/historia reales | DONE | R§34,37; D4 | app features; browser E0/E15 |
| M0-26 | Pruebas automatizadas del núcleo y cliente pasan | DONE | R§37; D3§195 | core E2E/widget tests; EC |

### MVP-1 — Analítica

| ID | Entregable / criterio verificable | Estado | Fuente | Evidencia al freeze |
| --- | --- | --- | --- | --- |
| M1-01 | Overview expone conteos por estado incluyendo CANCELLED | DONE | R§40,48; D8 | ANALYTICS; EC |
| M1-02 | completionRate usa COMPLETED/elegibles, vacío→0 | DONE | D8§25; C§8 | analytics.rules y tests |
| M1-03 | averageProgress promedia elegibles, vacío→0, redondeo | DONE | R§40; C§8 | EC:73.33 y solo cancelados0 |
| M1-04 | Ventana28d y frecuencia semanal determinísticas | DONE | R§40; D2§41 | analytics.rules y tests |
| M1-05 | Analytics por Goal expone snapshot/anterior/delta | DONE | R§41,48 | ANALYTICS; analytics E2E |
| M1-06 | Dificultad promedio e intervalo desde último CheckIn | DONE | R§41; P§15.4 | ANALYTICS; tests |
| M1-07 | Clasificación PROGRESSING/STABLE/DECLINING por delta | DONE | R§42; P§14 | analytics.rules.spec; E1 |
| M1-08 | INACTIVE solo ACTIVE sin registro o >7 días | DONE | R§42; D8§23 | analytics.rules.spec; EC |
| M1-09 | Timeline cronológica excluye CheckIns voided | DONE | R§41; D8§22 | ANALYTICS; support-audit E2E |
| M1-10 | Historia insuficiente y límites temporales explícitos | DONE | R§47–48; D2§54 | analytics.rules.spec; E1 |
| M1-11 | Métricas read-only, sin IA, aisladas por owner | DONE | R§43,48; D3§192 | analytics.service; analytics E2E |
| M1-12 | Dashboard consume métricas reales sin recálculo cliente | DONE | R§45,48 | dashboard_page; EC widget73.33 |
| M1-13 | Gráfica temporal por Goal consume timeline remota | DONE | R§46,48 | progress_chart; E1 browser |
| M1-14 | Dashboard/Goal Analytics manejan loading/error/retry/empty | DONE | R§45,47–48; D4 | analytics_test; E1 |
| M1-15 | Unitarias de reglas/casos límite y E2E Analytics pasan | DONE | R§48 | analytics suites; EC |

### MVP-2 — Foundation y generación real

| ID | Entregable / criterio verificable | Estado | Fuente | Evidencia o brecha |
| --- | --- | --- | --- | --- |
| M2-01 | AiModule registrado y consume AnalyticsModule | DONE | P§23; D6§104 | AI; E2 |
| M2-02 | AiSummaryService coordina contexto/prompt/proveedor interno | DONE | P§23; D5 | AI; E2 (solo seam desarrollo) |
| M2-03 | SummaryContextBuilder copia métricas oficiales estables | DONE | R§82; D5§193 | context builder; EC73.33 |
| M2-04 | Context allowlist excluye notes/identidad/secretos/permisos | DONE | D5§17,193; D6§44 | pipeline tests/AI E2E |
| M2-05 | PromptBuilder SYSTEM/USER fija restricciones no clínicas | DONE | R§82; D5§193 | prompt.builder; pipeline tests |
| M2-06 | AiProvider define contrato independiente de proveedor | DONE | D5§193; P§27 | ai.provider; E2 |
| M2-07 | MockAiProvider determinístico se identifica como desarrollo | DONE | D5§50–51; P§27 | mock-ai.provider; E2 |
| M2-08 | AI Preview autenticado/feature-gated, sin llamada ni persistencia | DONE | P§26; C§23 | AI E2E; EC smoke |
| M2-09 | AISummary schema/migration scaffold con estados/JSONB/periodo/FK | DONE | D1§27–33; P§7.4 | schema; AI E2E scaffold |
| M2-10 | Tests unitarios de foundation/contexto/prompt/privacidad pasan | DONE | D5§193; P§26 | pipeline suite; E2/EC |
| M2-11 | Investigación/catálogo vigente de al menos6 alternativas | PENDING | R§70; D5§194 | No catálogo/evaluación; no investigación en este bloque |
| M2-12 | Weighted Decision Matrix ejecutada | PENDING | R§71; D5§194 | Matriz y resultados ausentes |
| M2-13 | Dataset sintético de benchmark ≥30 casos, incluidos adversariales | PENDING | R§72; D5§194 | Preview fixtures no equivalen a benchmark |
| M2-14 | Blind NeuroConnect Benchmark ejecutado y documentado | PENDING | R§71–74,82; D5§194 | Falta ejecución ciega/fidelidad/seguridad/español |
| M2-15 | Spike operativo con2–3 finalistas integrados | PENDING | R§71; D5§194 | Sin adapters reales/spike |
| M2-16 | Costos reales de candidatos medidos | PENDING | D5§194 | Sin medición |
| M2-17 | Latencia real de candidatos medida | PENDING | D5§194 | Sin medición |
| M2-18 | Privacidad de candidatos/proveedor revisada | PENDING | D5§194 | Frontera local no acredita proveedor externo |
| M2-19 | Proveedor principal seleccionado formalmente | PENDING | R§82; D5§193 | Selección no realizada |
| M2-20 | Modelo primario seleccionado formalmente | PENDING | R§82; D5§194 | Selección no realizada |
| M2-21 | Candidato secundario documentado | PENDING | D5§194 | Documento ausente |
| M2-22 | MODEL-EVALUATION y decisión formal/ADR documentados | PENDING | R§75; D5§194 | docs/ai/MODEL-EVALUATION.md no existe |
| M2-23 | Adapter productivo de un proveedor real | PENDING | R§76,82; D5§193 | Solo mock |
| M2-24 | Configuración real de provider/model y API key solo backend | PENDING | D5§46–49; R§82 | Config scaffold no prueba secreto/proveedor operativo |
| M2-25 | Timeout configurable en llamada LLM real | PENDING | D5§43; R§82 | No llamada externa |
| M2-26 | Errores/rate limit reales normalizados sin retry ilimitado | PENDING | D5§44–45,56 | No adapter real |
| M2-27 | Validación básica de salida real (vacío/longitud/formato) | PENDING | D5§61 | Sin salida real |
| M2-28 | Generación bajo demanda persiste PENDING antes de llamar LLM | PENDING | D5§53–54; R§77 | Sin endpoint de generación productiva |
| M2-29 | inputSnapshot/periodo exactos persisten para cada generación | PENDING | D1§30; R§82 | Solo scaffold, no generación real |
| M2-30 | Éxito persiste COMPLETED con content real | PENDING | D5§55; R§82 | Sin lifecycle productivo |
| M2-31 | Fallo persiste FAILED sin afectar datos del dominio | PENDING | D5§56–57; R§82 | Sin lifecycle productivo |
| M2-32 | Trazabilidad real provider/model conservada por generación | PENDING | D5§55,59–60; R§82 | Campos nullable no prueban trazabilidad real |
| M2-33 | API de historial owner conserva generaciones sin sobrescribir | PENDING | D5§58; R§82 | No API de historial productivo |
| M2-34 | API de detalle owner devuelve resumen autorizado | PENDING | R§80; D3§80 | No API de detalle productivo |
| M2-35 | Flutter permite generar resumen con loading/éxito | PENDING | R§80,82; D4 | No feature IA en app |
| M2-36 | Flutter maneja fallo/reintento explícito de generación | PENDING | R§80; D5§44–45 | No feature IA en app |
| M2-37 | Flutter lista historial de resúmenes | PENDING | R§80; D4§117 | No feature IA en app |
| M2-38 | Flutter muestra detalle y disclaimer de contenido generado | PENDING | R§80–82; D4 | No detalle/disclaimer IA productivos |
| M2-39 | Pruebas del lifecycle productivo y regresión dominio/soporte | PENDING | D5§193; D2§139 | Suites actuales solo preview/mock |
| M2-40 | Integración real valida fidelidad, privacidad y salida no clínica | PENDING | R§82; D5§193 | Sin integración/proveedor; prompt no demuestra obediencia de modelo |

### MVP-3 — Red de apoyo y auditoría de autorización

| ID | Entregable / criterio verificable | Estado | Fuente | Evidencia o brecha |
| --- | --- | --- | --- | --- |
| M3-01 | SupportRelationship persiste owner/supporter/permisos/vigencia | DONE | R§86; D1§34; D8 | schema; E15 |
| M3-02 | Owner agrega cuenta existente por email exacto, sin directorio | DONE | R§89,101 | SUPPORT; support-audit E2E |
| M3-03 | Autorelación rechazada | DONE | D8§122 | support-audit E2E |
| M3-04 | Duplicados owner/supporter rechazados con unicidad SQL | DONE | R§101; D8 | schema; support-audit E2E |
| M3-05 | Owner lista/consulta relaciones propias | DONE | D3§194; R§100 | SUPPORT; E15 |
| M3-06 | Owner actualiza permisos, dependencias y all-false rechazado | DONE | R§87–88,101; D8 | support.dto/access; support-audit E2E |
| M3-07 | Vigencia/expiración se evalúa por request | DONE | R§91,101 | support-access; E15 smoke/E2E |
| M3-08 | Revocación retiene relación y deniega siguiente request | DONE | R§92,101; D8 | SUPPORT; E15 browser/E2E |
| M3-09 | Reactivación reutiliza relación con permisos/expiry explícitos | DONE | R§93,101 | SUPPORT; E15 browser/E2E |
| M3-10 | Supporter lista owners con relación activa | DONE | R§94,101 | support-access; E15 |
| M3-11 | VIEW_GOALS lista/detalla proyección segura de los4 estados | DONE | R§97,101; D8§122 | SUPPORT; E15:ACTIVE/PAUSED/COMPLETED/CANCELLED |
| M3-12 | VIEW_PROGRESS habilita métricas/timeline efectiva consistente | DONE | R§98,101 | SUPPORT; shared lock/concurrency E2E |
| M3-13 | Guard VIEW_SUMMARIES comprueba permiso sin simular datos | DONE | R§87; D8 | summaries() guard real, respuesta[]; solo frontera |
| M3-14 | Notes privadas y ausencia de audit del owner en proyecciones | DONE | R§98,101; D6§43; D8 | support-audit E2E; E15 |
| M3-15 | Supporter read-only y tercero sin relación sin acceso | DONE | R§94,101; D6§42 | support-audit E2E; EC |
| M3-16 | Flutter owner administra red/permisos/expiry/revoke/reactivate | DONE | R§100; D8 | owner_support_page; support_test; E15 |
| M3-17 | Flutter separa vistas propias/delegadas y refresca permisos | DONE | R§95,100; D4 | supporter_page; E15 dual-user |
| M3-18 | Tests cross-user permisos/expiry/revoke/reactivate pasan | DONE | R§101; D8§123 | support-audit E2E; EC |
| M3-19 | AuditEvent minimizado registra actor/owner/acción/UTC | DONE | D8§27–40,121 | AUDIT; allowlist tests; EC70/40 |
| M3-20 | Mutación auditada y evento son atómicos, rollback probado | DONE | D8§41–42,121 | audit failure injection E2E; EC |
| M3-21 | Auditoría append-only: sin update/delete API y SQL protegido | DONE | D8§43,121 | migration append-only; support-audit E2E |
| M3-22 | API owner de Activity tiene paginación/filtros/aislamiento | DONE | D8§45–49,121 | audit.module; support-audit E2E |
| M3-23 | Flutter Activity legible admite payload actual e histórico | DONE | D8§48,121; C§10 | activity_repository; support_test; EC |
| M3-24 | VIEW_SUMMARIES devuelve solo COMPLETED, sin snapshot/internals | PENDING | R§99,101; D2§89 | summaries() devuelve[]; falta consulta/proyección productiva |
| M3-25 | Flutter supporter lista/abre resúmenes autorizados | PENDING | R§100; D4§252 | No vista de resumen productivo |
| M3-26 | E2E delegación real AISummary y revoke/expiry de sus vistas | PENDING | R§101; D3§196 | Guard probado; falta resumen real y flujo completo |

### MVP-4 — Prerrequisitos existentes y cierre final

| ID | Entregable / criterio verificable | Estado | Fuente | Evidencia o brecha |
| --- | --- | --- | --- | --- |
| M4-01 | Imagen Docker backend reproducible | DONE | R§124; D7§260 | Dockerfile backend; EC builds |
| M4-02 | Imagen Docker frontend reproducible | DONE | R§112; D7§260 | Dockerfile app; EC builds |
| M4-03 | Compose local PostgreSQL16/API/Web healthy con volumen | DONE | D7§260; P§29 | compose.yaml; EC smoke/migrations |
| M4-04 | Flutter Web release build reproducible | DONE | D7§260 | EC Web build291.9s; CI |
| M4-05 | Backend CI activo en pushes/PR con PostgreSQL E2E | DONE | R§118,124; D7§260 | backend-ci.yml; EC CI |
| M4-06 | Frontend CI activo analyze/tests/Web/Docker | DONE | R§118,124; D7§260 | frontend-ci.yml; EC CI |
| M4-07 | Health/readiness API consultable sin datos sensibles | DONE | R§112; D7§266 | health.controller; EC HTTP200 local |
| M4-08 | Regresión backend final con todo MVP-2/3 productivo | PENDING | R§106,124 | Tests actuales no cubren IA real inexistente |
| M4-09 | Integración cliente final de todos los flujos | PENDING | R§107; D4§250–253 | Widget suites actuales no son validación final integrada |
| M4-10 | E2E principal completo A→AI→B→revocación | PENDING | R§108,124,142 | Smoke actual sustituye IA por preview, no cumple final |
| M4-11 | Security review final de todas las fronteras, incluida IA | PENDING | R§109,124; D7§265 | Review parcial no acredita servicio productivo |
| M4-12 | Reevaluación de dependencias antes de release | PENDING | C§11–12; D7§265 | Auditoría actual conserva excepciones; revisar en MVP-4 |
| M4-13 | Responsive/UX final de todos los flujos, incluida IA | PENDING | R§110,124 | Web actual probado; falta revisión final completa |
| M4-14 | Contraste accesible validado | PENDING | R§111,124 | Sin evidencia sistemática de contraste |
| M4-15 | Escalado de texto validado | PENDING | R§111 | Sin evidencia final de text scaling |
| M4-16 | Touch targets validados | PENDING | R§111 | Sin revisión completa |
| M4-17 | Semantics accesibles validadas | PENDING | R§111 | Activación de accesibilidad en smoke no prueba cobertura |
| M4-18 | Navegación teclado/focus Web validada | PENDING | R§111; D4§77 | Sin prueba final de recorrido por teclado |
| M4-19 | Android APK reproducible instalado y conectado a API pública | PENDING | R§117,124; D7§263 | Proyecto Android existe, build/flujo final no acreditados |
| M4-20 | Compatibilidad de proyecto iOS verificada | PENDING | A§7; R§61; D4§178 | Proyecto existe; no verificación de SDK/build iOS |
| M4-21 | Backend desplegado públicamente, independiente del equipo local | PENDING | R§114,116,124 | Solo entorno local/plantilla |
| M4-22 | Flutter Web público accesible externamente | PENDING | R§115,124 | Solo localhost |
| M4-23 | HTTPS público Web/API validado | PENDING | R§124; D7§262 | HTTP loopback no equivale a HTTPS público |
| M4-24 | PostgreSQL productivo persistente y protegido | PENDING | R§112,124; D7§260 | Volumen local/plantilla externa no prueban DB productiva |
| M4-25 | Configuración productiva de secretos/red/CORS verificada | PENDING | R§109; D7§265 | Controles locales presentes; sin despliegue para comprobarlos |
| M4-26 | Monitoring de disponibilidad Web | PENDING | R§119; D7§266 | Sin monitor configurado |
| M4-27 | Monitoring de API/alerta operativa | PENDING | R§119; D7§266 | Health local no equivale a monitor/alerta |
| M4-28 | Logs de aplicación/deployment accesibles y seguros en producción | PENDING | R§120,124; D7§266 | Logging local existe; operación desplegada no validada |
| M4-29 | Backup pg_dump protegido ejecutado | PENDING | R§121,124 | Sin evidencia de backup final |
| M4-30 | Restore en nueva DB y validación de aplicación | PENDING | R§122,124; D7§264 | Migration-smoke no es restauración de backup |
| M4-31 | Procedimiento rollback documentado y verificable | PENDING | R§124; D7§260 | Sin procedimiento de release probado |
| M4-32 | DEPLOYMENT-RUNBOOK disponible | PENDING | R§123,124 | docs/operations/DEPLOYMENT-RUNBOOK.md ausente |
| M4-33 | BACKUP-RESTORE-RUNBOOK disponible | PENDING | R§123,124 | docs/operations/BACKUP-RESTORE-RUNBOOK.md ausente |
| M4-34 | INCIDENT-RUNBOOK disponible | PENDING | R§123,124 | docs/operations/INCIDENT-RUNBOOK.md ausente |
| M4-35 | RELEASE-RUNBOOK disponible | PENDING | R§123,124 | docs/operations/RELEASE-RUNBOOK.md ausente |
| M4-36 | release-check ejecuta readiness de release | PENDING | C§14 | Workflow explícitamente diferido a MVP-4 |
| M4-37 | Infraestructura productiva total$0 comprobada | PENDING | R§113,124; D7§261 | Ausencia de gasto local no prueba topología productiva |
| M4-38 | Documento académico final/resultados/conclusiones/limitaciones | PENDING | A§7; R§139,187 | Freeze y reportes no son documento académico final |
| M4-39 | Evidencias finales de Web/Android/IA/privacidad/despliegue | PENDING | R§135–141,187 | Capturas locales parciales; falta paquete final público |
| M4-40 | Presentación/demostración final preparada | PENDING | A§8; R§187 | Sin presentación final registrada |
| M4-41 | Release v1.0.0 versionada tras aceptación final | PENDING | R§133–134,186 | No tag/release v1.0.0; no se crea aquí |

### Resumen calculado

| MVP | Entregables totales | DONE | Pendientes | Avance técnico |
| --- | ---: | ---: | ---: | ---: |
| MVP-0 | 26 | 26 | 0 | 100.0 % |
| MVP-1 | 15 | 15 | 0 | 100.0 % |
| MVP-2 | 40 | 10 | 30 | 25.0 % |
| MVP-3 | 26 | 23 | 3 | 88.5 % |
| MVP-4 | 41 | 7 | 34 | 17.1 % |
| **Global** | **148** | **81** | **67** | **54.7 %** |

## 9. Porcentaje global estimado de v1.0.0

**Estimación técnica por entregables verificables:**

- **COMPLETED = 54.7 %** (81 DONE / 148 entregables).
- **REMAINING = 45.3 %** (67 PENDING / 148 entregables).
- Fórmula aplicada a los conteos globales, sin promedio simple de MVP ni MVP-1.5 adicional.

Estos valores cuantifican este inventario, no una calificación, porcentaje oficial
del profesor, eficacia clínica, ponderación científica ni esfuerzo/tiempo consumido.
El proyecto no está feature-complete ni release-ready aunque Avance 1 esté CLOSED.

## 10. Trabajo pendiente para NeuroConnect v1.0.0

| Bloque restante | IDs | PENDING | Participación del alcance global pendiente |
| --- | --- | ---: | ---: |
| MVP-2 | M2-11..M2-40 | 30 | 20.3 puntos porcentuales |
| MVP-3 remainder | M3-24..M3-26 | 3 | 2.0 puntos porcentuales |
| MVP-4 | M4-08..M4-41 | 34 | 23.0 puntos porcentuales |

Las participaciones pendientes se calculan sobre el mismo denominador global;
su suma sin redondear coincide con el restante. El redondeo de filas puede diferir
0.1 puntos; las fracciones y los IDs permiten reproducirlo sin doble conteo.

### MVP-2 — IA real

M2-11..40: investigación/catálogo6+, matriz ponderada, dataset≥30 y casos
adversariales, benchmark ciego, spike con finalistas, costo/latencia/privacidad,
selección formal de proveedor/modelo/alternativa y decisión documentada. Después:
adapter/configuración real solo backend, timeout, errores controlados, validación
de salida, generación bajo demanda y lifecycle PENDING→COMPLETED/FAILED con periodo,
inputSnapshot, provider/model e historial owner. Faltan generación, errores,
historial/detalle/disclaimer Flutter y validación real de fidelidad/privacidad,
incluida regresión con SupportNetwork. No se investiga ni implementa aquí.

### MVP-3 — remainder

M3-24..26 son exactamente el resto de esta matriz: consulta/proyección real de
AISummary COMPLETED bajo VIEW_SUMMARIES, sin inputSnapshot ni internals; pantalla
delegada de lista/detalle; prueba integrada con resúmenes reales, aislamiento y
pérdida de acceso por revoke/expiry. Crear/generar/persistir AISummary pertenece
solo a MVP-2; aquí se cuenta su consumo delegado, no otra generación.
La respuesta vacía actual y sus guard tests no satisfacen este DoD productivo.

### MVP-4 — cierre final

M4-08..41 cubren testing final backend/cliente/E2E con IA real, review de UX y
accesibilidad, reevaluación de seguridad, Android instalado, compatibilidad iOS,
deployment público, HTTPS, PostgreSQL productivo, secretos/red, monitoring y logs,
backup/restore/rollback, cuatro runbooks, release-check, costo$0 comprobado,
documentación/presentación/evidencias finales y release v1.0.0. La infraestructura
local realizada no declara satisfechos esos criterios de producción.

## 11. Trabajo completado adelantadamente

Flutter Web funcional, Analytics/Dashboard, foundation IA y el core SupportNetwork
se ejecutaron antes de sus ventanas originales. MVP-1.5 incorpora permisos dinámicos,
expiración/revoke/reactivate, lectura read-only, notas privadas, historia y Activity.
Se cuenta en M0/M1/M3, nunca como otro MVP. Docker/Compose/CI fueron prerrequisitos
adelantados de MVP-4 (M4-01..07), sin afirmar su aceptación final.

## 12. Cambio respecto al cronograma original

La modificación fue de orden, no de objetivo final ni nueva fecha académica.
Persistencia/auditoría/autorización se validaron antes del proveedor real. El buffer
se reserva para investigación, integración, validación multiplataforma y cierre.
Integrar antes una rama no prueba ahorro de horas; no se deducen productividad ni
fecha final nueva a partir de commits.

## 13. Cronograma inicial vs ejecución real

### Cronograma oficial original (A§8, páginas11–12; conservado)

| Ventana 2026 | Actividad original |
| --- | --- |
| 25 sep – 4 oct | Anteproyecto / investigación / requerimientos / arquitectura / modelo / mockups |
| 5 – 18 oct | Backend base: Auth, usuarios, Goals, CheckIns y DB |
| 19 oct – 1 nov | Cliente Flutter: Auth, Goals, CheckIns e historia |
| 2 – 8 nov | Analytics, indicadores, tendencias y Dashboard |
| 9 – 15 nov | IA generativa, prompts, resúmenes y validación |
| 16 – 22 nov | Red de apoyo, permisos, expiración, compartición y revocación |
| 23 – 29 nov | Testing / correcciones / UX / security / deployment |
| 30 nov – 6 dic | Documento / evidencia / resultados / conclusiones / presentación / entrega |

### Comparación documentada al freeze

| Bloque original | Ventana original | Estado al freeze | Ejecución real comprobable | Variación |
| --- | --- | --- | --- | --- |
| Anteproyecto/arquitectura | 25 sep – 4 oct | Anteproyecto y ADR disponibles | Anteproyecto fechado25sep; ADR1–7 fechados14oct; Git no acredita fecha real de terminación dentro de la ventana | Fecha documental25sep: ON PLAN; cierre integral de la fase no fechado, sin delta inventado |
| Backend base | 5 – 18 oct | DONE | PR#1 integrado14oct; semántica/historia estabilizada PR#4–5 el15oct | ON PLAN; integración núcleo4 días antes del fin18oct |
| Flutter núcleo | 19 oct – 1 nov | Web DONE; Android/iOS aceptación pendiente | Web núcleo PR#1 el14oct, Analytics PR#2 el14oct; soporte/closeout15oct | COMPLETED EARLY para baseline Web:5 días antes del inicio19oct; plataformas restantes PENDING |
| Analytics/Dashboard | 2 – 8 nov | DONE | PR#2 integrado14oct; closeout semántico PR#5 el15oct | COMPLETED EARLY:19 días antes del inicio2nov; estabilización18 días antes |
| IA generativa | 9 – 15 nov | Foundation DONE; IA real PENDING | PR#3 integrado14oct local; ninguna generación real | IN PROGRESS EARLY:foundation26 días antes del inicio9nov; IA real DEFERRED BY REBASELINE a Avance2, sin nueva fecha comprometida |
| SupportNetwork | 16 – 22 nov | Core DONE, summaries remainder PENDING | PR#4 integrado15oct | ADVANCED EARLY:core32 días antes del inicio16nov; no se atribuye ese delta a MVP-3 completo |
| Testing/UX/security/deployment | 23 – 29 nov | Prerrequisitos locales avanzados, cierre PENDING | Tests/CI/Docker/audit local PR#1–5; sin deployment/release hardening | ADVANCED EARLY solo prerequisitos; aceptación final PENDING |
| Release/evidencia/documento/presentación | 30 nov – 6 dic | PENDING | Reportes/freeze son insumos parciales | PENDING; no se adelanta la fecha final |

Deltas en días naturales = fecha de inicio/fin planificada menos fecha local de
merge, con ambas a nivel de fecha (sin contar horas ni días laborables). No se
confunde14oct local del PR#3 con15oct UTC. Para arquitectura no se convierte fecha
de publicación de ADR en fecha inventada de finalización de toda la fase.

## 14. Proyección técnica posterior al Avance 1

**FORECAST / REBASELINE TÉCNICA**, no cronograma académico nuevo ni compromiso fechado:

1. Avance2: MVP-2 research → evaluación → selección sustentada → implementación real.
2. MVP-3 remainder: proyección/UI/regresión de resúmenes ya productivos.
3. MVP-4: revisión final, multiplataforma, producción$0, recuperación y evidencia/release.

Se mantiene el **CRONOGRAMA OFICIAL ORIGINAL** y el objetivo académico de **primera
semana de diciembre de2026** (ventana final30nov–6dic). El adelanto es schedule
buffer para trabajo incierto; no se mueve esa fecha por iniciativa del agente.
Cambiar el forecast o priorización no implica aprobar un proveedor, modelo o gasto.

## 15. Baseline funcional congelada

### Dominio congelado

- Auth JWT/Argon2id, Profile, Goals y CheckIns con DTO/ownership backend; Flutter es
  cliente no confiable. Registro/login/sesión/logout y Web funcionales.
- Lifecycle: ACTIVE→PAUSED/COMPLETED/CANCELLED; PAUSED→ACTIVE/CANCELLED;
  COMPLETED→ACTIVE; CANCELLED→ACTIVE; misma transición idempotente. Completar es
  explícito, independiente de100%; solo ACTIVE admite nuevos CheckIns.
- CANCELLED mantiene fila e historia. Void mantiene CheckIn y recalcula Goal.progress
  desde último efectivo o0. No edición directa del snapshot. Lock de Goal serializa
  mutaciones. Audit nuevo distingue progreso invalidado70 de resultante40.
- AuditEvent minimizado, owner-only y append-only; mutación+evento atómicos.
  No notes/secretos en payload. Eventos anteriores no se reescriben y Activity
  conserva lectura compatible. actorId==ownerId aceptado para mutaciones owner-only;
  cambio de actor exige revisar firma/autorización, no inferir nuevos roles.
  Las cascadas FK permanecen para limpieza interna controlada de datos sintéticos;
  no existe API de borrado de cuenta ni eliminación física normal del dominio.
- SupportRelationship con permisos VIEW_GOALS/VIEW_PROGRESS/VIEW_SUMMARIES; progress
  y summaries requieren goals, all-false rechazado, sin autorelación/duplicados.
  Expiry/revoke se evalúan por request; reactivate conserva relación/historia.
  Supporter read-only, todos los estados visibles con permiso, notes privadas,
  sin acceso al audit del owner. Resúmenes productivos siguen pendientes.

### Analytics congelado

- totalGoals incluye los4 estados. completionRate=100×COMPLETED/elegibles;
  averageProgress=sum(progress elegibles)/count(elegibles); elegibles=ACTIVE+
  PAUSED+COMPLETED, sin elegibles→0; redondeo métricas2decimales.80/40/100 y
  CANCELLED10→73.33 promedio,33.33 cumplimiento,total4.
- Frecuencia: CheckIns efectivos en ventana cerrada[now−28d,now] /4 semanas.
  Delta=snapshot−penúltimo efectivo; ≥5 PROGRESSING, ≤−5 DECLINING, otro STABLE.
  Menos de2 registros: insufficientHistory y delta/anterior null; no predicción.
- ACTIVE sin CheckIn o con más de7 días transcurridos es INACTIVE y tiene precedencia
  sobre delta. PAUSED/COMPLETED/CANCELLED conservan clasificación histórica, nunca
  INACTIVE. Cancelación no es fracaso ni inferencia clínica/emocional.
- Difficulty promedio usa historia efectiva completa; días usa intervalos UTC
  completos. Voided se excluye de timeline/frecuencia/dificultad/tendencias; datos
  fuente no se mutan y no se persiste la analítica derivada. Snapshot RepeatableRead
  evita contexto construido sobre distintas lecturas concurrentes.

## 16. Baseline IA congelada

**PostgreSQL → Analytics → SummaryContext → PromptBuilder → AiProvider**.
SummaryContextBuilder copia métricas oficiales, no recalcula ni consulta secretos.
Allowlist: periodDays28 y métricas overview, goals con title/status/progress/trend/
averageDifficulty/daysSinceLastCheckIn/insufficientHistory. Sin identidad/email,
IDs innecesarios, notes/description, permisos/relaciones, JWT/credenciales.

Prompt fijo SYSTEM + datos JSON USER restringe diagnóstico, tratamiento, inferencias
clínicas y métricas inventadas. Preview autenticado muestra contexto/prompt con
providerConfigured=false, sin invocar LLM o persistir AISummary. Mock interno es
solo desarrollo; schema PENDING/COMPLETED/FAILED no equivale a lifecycle productivo.

Es la entrada estable para el benchmark futuro de Avance2; no garantiza el
comportamiento de un modelo todavía no evaluado. No proveedor/modelo definitivo,
selección, SDK real, llamada externa, resumen productivo o UI IA realizados.

Freeze no es inmutabilidad absoluta: se admiten bugs confirmados, seguridad,
requisitos aprobados, ADR nuevo o decisión formal derivada de MVP-2. Los cambios
deben conservar trazabilidad y repetir las validaciones aplicables.

## 17. Riesgos y deudas conocidas

Fuente de seguridad: [DEPENDENCY_AUDIT_AVANCE1](../security/DEPENDENCY_AUDIT_AVANCE1.md).
Resultado histórico al closeout: runtime0moderate/3high (un advisory deepmerge-ts
propagado a Prisma/config); completo5moderate/32high. js-yaml de Swagger fue
corregido5.3.0→5.4.3. La evaluación documenta alcance no alcanzable desde requests
de negocio y riesgo residual de configuración/tooling; no se transforma ese conteo
en tres vulnerabilidades explotables de API ni en garantía de riesgo cero.
Reevaluación antes de producción/MVP-4 o cambios de configuración no confiable.
No nueva auditoría/npm install en este bloque documental.

Deployment, HTTPS/DB productiva, Android/iOS, accessibility final y release hardening
pendientes. Sin evaluación/LLM reales, no se afirma fidelidad de salidas ni eficacia.
Datos físicamente borrados antes de D8 no se reconstruyen; auditoría comienza en
su adopción. Reportes antiguos contienen estados pre-merge válidos en su momento;
este freeze/tabla de merges determina el corte actual, sin borrar esa historia.

## 18. Trabajo explícitamente diferido

Avance2: M2-11..40 y después M3-24..26. MVP-4: M4-08..41; release-check permanece
DEFERRED→MVP-4. No deployment, tag, release, nuevos tests, dependencias ni código
en este bloque. Funciones fuera de v1.0.0 no entran al denominador ni se implementan.

## 19. Entrada a Avance 2

Avance1CLOSED; MVP0/MVP1 DONE; MVP2 STARTED foundation; MVP3core adelantado por
MVP1.5; MVP4 aceptación PENDING. Contexto estable y datos sintéticos disponibles;
primer trabajo futuro es investigación/evaluación conforme D5, no elegir modelo
por anticipado. Debe producir evidencia de candidatos/matriz/benchmark/spike antes
de formalizar selección. Este freeze no activa ese trabajo.

## 20. Evidencias y reproducción de la lectura

| Clave | Evidencia | Qué demuestra |
| --- | --- | --- |
| E0 | [MVP0_REPORT](../../harness/codex/MVP0_REPORT.md) | Núcleo/backend/Flutter, browser smoke y pruebas iniciales; PR#1 integrado |
| E1 | [MVP1_REPORT](../../harness/codex/MVP1_REPORT.md) | Métricas, tendencias, gráfico, datasets, dashboard real y browser; PR#2 integrado |
| E2 | [MVP2_AVANCE1_REPORT](../../harness/codex/MVP2_AVANCE1_REPORT.md) | Foundation/preview/scaffold y privacidad, sin IA real; PR#3 integrado |
| E15 | [MVP15_REPORT](../../harness/codex/MVP15_REPORT.md) | Historia, audit, permisos, dual-user browser, revoke/reactivate y aceptación previa; PR#4 integrado |
| EC | [AVANCE1_CLOSEOUT_REPORT](../../harness/codex/AVANCE1_CLOSEOUT_REPORT.md) | Regresión70unit/73E2E/27Flutter; Web/backend/Docker PASS;4migrations; seed doble37eventos; smoke70/40,73.33; PR#5 integrado |
| AUTH | [auth.service](../../backend/src/auth/auth.service.ts), [core E2E](../../backend/test/e2e/core.e2e-spec.ts) | Registro/Argon2id/login/JWT/privacidad/aislamiento |
| SESSION | [session](../../app/lib/core/auth/session.dart), [widget tests](../../app/test/widget_test.dart) | Restore/logout/limpieza y UI núcleo |
| PROFILE | [users.service](../../backend/src/users/users.service.ts) | Perfil propio y actualización DTO |
| GOALS | [goals.service](../../backend/src/goals/goals.service.ts), [goal.policy](../../backend/src/goals/goal.policy.ts) | Lifecycle/CANCELLED/ownership |
| CHECKINS | [check-ins.service](../../backend/src/check-ins/check-ins.service.ts) | Creación/void/snapshot/historial privados |
| ANALYTICS | [rules](../../backend/src/analytics/analytics.rules.ts), [service](../../backend/src/analytics/analytics.service.ts), [tests](../../backend/src/analytics/analytics.rules.spec.ts) | Fórmulas/ventanas/cancelados/void/read-only |
| AI | [module](../../backend/src/ai/ai.module.ts), [service](../../backend/src/ai/ai-summary.service.ts), [builder](../../backend/src/ai/summary-context.builder.ts), [AI E2E](../../backend/test/e2e/ai.e2e-spec.ts) | Estado limitado a foundation; preview sin generación/persistencia |
| SUPPORT | [support service](../../backend/src/support-network/support-network.service.ts), [access](../../backend/src/support-network/support-access.service.ts), [support E2E](../../backend/test/e2e/support-audit.e2e-spec.ts) | Matriz de permisos/aislamiento y summaries()=[] |
| AUDIT | [audit helper](../../backend/src/audit/audit.ts), [audit module](../../backend/src/audit/audit.module.ts) | Allowlist/owner/actor/Activity; rollback e inmutabilidad en support E2E |
| DB | [schema](../../backend/prisma/schema.prisma), [migrations](../../backend/prisma/migrations), [seed](../../backend/prisma/seed.ts) | Persistencia real y scaffold diferenciado |
| OPS | [Compose](../../compose.yaml), [backend Dockerfile](../../backend/Dockerfile), [app Dockerfile](../../app/Dockerfile) | Entorno local reproducible, no deployment público |
| UI | [Dashboard](../../app/lib/features/analytics/dashboard_page.dart), [supporter UI](../../app/lib/features/support/supporter_page.dart), [Activity](../../app/lib/features/activity/activity_repository.dart) | Consumo de API, read-only y mensajes compatibles |
| BROWSER | [capturas MVP1](../evidence/mvp1), [captura Avance1](../evidence/avance1/dashboard-chart.png), E0/E1/E2/E15 | Evidencia visual histórica; imágenes MVP15 locales fuera de Git según E15, no nuevas capturas en este bloque |
| SECURITY | [auditoría de dependencias](../security/DEPENDENCY_AUDIT_AVANCE1.md) | Advisories, parche y excepciones; no equivalencia audit=0 |
| CI | [Backend final closeout PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38711840598), [Frontend final closeout PASS](https://github.com/CarlosAM03/neuro-connect/actions/runs/38711840571) | Gates sobre ce727fb17ad1b320273181161d6ba21a22eb8a24, padre de freezeCommit |

Los resultados técnicos se heredan de las ejecuciones existentes; **no se vuelven
a ejecutar suites ni builds locales** para este cambio documental. Los workflows
de la rama documental correrán por CI generalizado y se registrarán en el reporte
actual. No se atribuye feedback al profesor ni se inventan validaciones humanas.

Lecturas reproducibles, sin modificar el checkout:

```powershell
git show fad9cf73924fc334c57a77526a9f017069ceb4c5:backend/src/analytics/analytics.rules.ts
git show fad9cf73924fc334c57a77526a9f017069ceb4c5:backend/src/support-network/support-network.service.ts
git log --merges --format='%H %cI %s' main
git diff --name-only fad9cf73924fc334c57a77526a9f017069ceb4c5...HEAD
git diff --check
```

Para recalcular, leer exclusivamente filas `| M[0-4]-NN |`, contar estado DONE/PENDING
por prefijo y aplicar §7; las tablas de resumen no crean unidades nuevas.

Ejemplo reproducible con Python3 (biblioteca estándar, sin instalar dependencias),
ejecutado desde la raíz del repositorio:

```python
import re
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP

text = Path('docs/Planeacion/AVANCE1_BASELINE_FREEZE.md').read_text(encoding='utf-8')
rows = re.findall(r'^\| M([0-4])-\d{2} \| .*? \| (DONE|PENDING) \|', text, re.M)
def percent(n, total):
    return (Decimal(n) * 100 / total).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
for mvp in map(str, range(5)):
    group = [state for group_id, state in rows if group_id == mvp]
    done = group.count('DONE')
    print('MVP-' + mvp, len(group), done, len(group) - done, percent(done, len(group)))
done = sum(state == 'DONE' for _, state in rows)
print('GLOBAL', len(rows), done, len(rows) - done, percent(done, len(rows)))
print('REMAINING', Decimal(100) - percent(done, len(rows)))
```

## 21. Conclusión del Avance 1

Avance1 queda **CLOSED** sobre freezeCommit fad9cf7, con núcleo, historia/audit,
Analytics/Dashboard, red de apoyo core y foundation IA demostrables. La estimación
técnica es **54.7 % completado / 45.3 % restante**, bajo el inventario
publicado y sin doble conteo. La versión1.0.0 y MVP2/MVP3/MVP4 finales no se declaran
completos. El siguiente entregable académico podrá usar este documento como fuente,
agregando narrativa/evidencias/valoración del autor; todavía no es el PDF final.
La aceptación de este bloque documental requiere revisión/PR/merge humanos.
