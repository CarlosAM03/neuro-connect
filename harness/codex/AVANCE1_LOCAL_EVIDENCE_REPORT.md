# AVANCE1_LOCAL_EVIDENCE_REPORT

## Identificación y continuidad

- Block: AVANCE-1-LOCAL-EVIDENCE.
- Branch: `docs/avance1-local-evidence`.
- Base commit: `e81fcbdd5c3e1154733ac220d4596dd059af759d` (main, merge PR #6 del freeze).
- Fecha: 2026-10-15, America/Tijuana.
- Status: **READY_FOR_HUMAN_VALIDATION_WITH_DOCUMENTED_GAPS**.
- Final commit: resolver con `git rev-parse HEAD` después del handoff; el SHA literal
  se entrega en la respuesta final, evitando intentar guardar el hash del propio commit.

Se retomó la ejecución interrumpida por límite de uso. Las primeras operaciones
fueron git status --short --branch, git log -1 --oneline y git branch -vv. Se
confirmaron la rama existente, HEAD e81fcbd y únicamente la carpeta de evidencias
untracked. No se recreó rama, no se cambió a main y no se descartó historial/trabajo.
Se inspeccionaron la carpeta de capturas y el fixture temporal antes de continuar.

01/02/03 existían, abrían y tenían contenido JPEG pese a la extensión PNG. 01 era
utilizable y se conservó con conversión de formato sin cambiar píxeles. 02/03 tenían
render incompleto y baja resolución: se recapturaron. La nueva superficie estable
permitió 1280×720, sin cambios de aplicación. Se descartaron las tomas defectuosas
sobrescribiendo solo los nombres correspondientes autorizados.

## Entorno y fuentes

Windows, PowerShell, Docker Compose y navegador integrado de Codex. Flutter Web
real servido por frontend local; backend NestJS; PostgreSQL 16. Servicios existentes
healthy en las verificaciones inicial y final. No reconstrucción, seed adicional,
reset de datos o volúmenes durante esta continuación.

- Flutter: http://127.0.0.1:5173.
- Backend: http://127.0.0.1:3000/api/v1.
- Swagger: http://127.0.0.1:3000/api/docs.
- PostgreSQL local: loopback 5434.
- CI: páginas públicas GitHub, sin iniciar sesión ni usar credenciales GitHub.

Fuentes revisadas: AVANCE-1, baseline freeze, roadmap, closeout, reportes closeout y
freeze, README, HARNESS y las pantallas/implementación existentes relevantes. El
freeze ejecutable de referencia documental es fad9cf7; el base de esta rama incluye
su cierre documental integrado e81fcbd. No se modifica la autoridad documental.

## Usuarios y fixture

- demo@neuroconnect.local — Cuenta de demostración, owner.
- supporter@neuroconnect.local — Apoyo de demostración, consulta delegada y preview
  de contexto propio vacío.
- supporter-goals@neuroconnect.local — relación existente mostrada como Apoyo solo
  objetivos; no se inició sesión con esta cuenta en la continuación.

Fixture temporal usado: **YES**, datos del fixture existente
`tmp/avance1-evidence/fixture.cjs`, inspeccionado; no fue necesario volver a ejecutarlo.
Fixture versionado: **NO** (tmp está ignorado). No se incorpora a seed/backend/scripts.
Se usaron helpers temporales de captura/validación en esa misma carpeta ignorada.
Un archivo transitorio con sesión sintética para Swagger se eliminó inmediatamente
tras cargarlo en memoria; no se imprimió ni versionó. La pestaña Swagger se cerró.

El objetivo adicional y sus tres CheckIns se documentan íntegramente en el índice.
Se canceló únicamente ese objetivo mediante UI y confirmación reversible. Sigue
visible y conserva historia y 70 %. Se preservaron las cinco metas del seed y ambas
relaciones activas sin cambiar permisos. No hubo borrado de datos previos/reales.

## Capturas y revisión

18 PNG finales: 01–16, 18 y 19, con nombres exactos definidos por el bloque.
Índice completo de las 19 posiciones y requisitos/datos/permisos:
[README de evidencias](../../docs/evidence/avance1-local/README.md).

| Grupo | Dimensiones | Cantidad | Verificación |
| --- | --- | --- | --- |
| 01-login.png | 1836×1080 | 1 | PNG / apertura / revisión visual PASS |
| 02-profile.png a 14-activity-audit.png | 1280×720 | 13 | PNG / apertura / revisión visual PASS |
| 15-ai-preview.png, 16-swagger.png, 18-ci-backend.png, 19-ci-frontend.png | 1265×712 | 4 | PNG / apertura / revisión visual PASS |

Conversión de transporte JPEG a PNG sin alterar dimensiones/píxeles, comprobación
RGB idéntico y verificación independiente de apertura/formato mediante Pillow.
Ningún reescalado, blur, overlay, retoque ni simulación. Se revisaron visualmente
todas las imágenes por separado, incluyendo la imagen inicial de login conservada.

- Detalle/formulario/historia: PASS, tres CheckIns 20/40/70 y notas sintéticas neutras.
- CANCELLED: PASS, Cancelado explícito e historia conservada; check-in deshabilitado.
- Dashboard/gráfica: PASS, métricas reales y cinco puntos del seed con fechas/ejes.
- Owner/supporter: PASS, relaciones/permisos, owner autorizado y vistas de solo lectura.
- Privacidad delegada: PASS visual, sin notes ni auditoría del owner en vista compartida.
- Actividad: PASS, creación, CheckIns, cancelación y relaciones reales en lenguaje humano.
- AI Preview: PASS, GET real HTTP 200 con context/prompt/providerConfigured=false;
  no pantalla de generación productiva, no llamada a proveedor y no resumen persistido.
- Swagger: PASS, título/versionado/endpoints /api/v1, captura anterior a autorización.
- CI del freeze: PASS, Backend y Frontend del mismo main e81fcbd.

Privacy review: **PASS**. Sin valores de password/JWT/Authorization/Bearer/API keys,
cookies, tokens, DATABASE_URL, SEED_PASSWORD, correos/nombres/datos reales, autofill
sensible ni filesystem paths. Solo datos sintéticos y metadatos públicos necesarios
del repositorio GitHub. Los textos del formulario y el botón Authorize no son secretos.

## Brecha 17 y Docker

**17-compose-healthy.png: NOT AVAILABLE AS UI EVIDENCE.** La consola dedicada no
apareció como ventana capturable en el inventario nativo, incluso tras intentos de
apertura. No se inventó un screenshot ni se sustituyó por una terminal dibujada.
No es una falta funcional de Compose. Su salida técnica real se conserva en README:
postgres, backend y frontend healthy, puertos loopback 5434/3000/5173. Repetir:

```powershell
docker compose ps --format 'table {{.Service}}\t{{.Status}}\t{{.Ports}}'
```

La captura pendiente puede completarse humanamente con ese comando en una terminal
limpia sin rutas personales ni secretos. No requiere cambios de código o volúmenes.
Esta limitación afecta únicamente a la evidencia visual 17, no a las otras 18.

## Archivos, validaciones y Git

Changes funcionales: **NONE**. No código, dependencias, schema, migrations, tests,
workflows, Compose, arquitectura, dominio ni contratos modificados. No se crearon
funciones nuevas ni se corrigieron bugs. No se ejecutaron tests/builds locales de
producto innecesarios en un bloque de capturas; se comprueba CI remoto separadamente.

Solo se versiona:

- docs/evidence/avance1-local/: 18 PNG y README.md.
- harness/codex/AVANCE1_LOCAL_EVIDENCE_REPORT.md: este reporte.

Total: 20 archivos añadidos. tmp/avance1-evidence no está versionado. No PR, merge,
auto-merge, tag o release. No reset, clean, rebase, amend ni force push.
Validaciones: formato/dimensiones/apertura 18/18 PASS; revisión visual y privacidad
18/18 PASS; docker compose ps PASS; git diff --check PASS. El diff respecto al base
se revisa limitado a evidencia/reporte y se confirma estado limpio antes del handoff.

## CI y publicación

Capturas de main e81fcbd:
- Backend CI: [38720476346 — success](https://github.com/CarlosAM03/neuro-connect/actions/runs/38720476346).
- Frontend CI: [38720476335 — success](https://github.com/CarlosAM03/neuro-connect/actions/runs/38720476335).

Publicación de la rama y CI del bloque: pendiente de la comprobación posterior al push;
se actualizará este apartado con resultados reales antes del handoff final.

## Validación humana

- [x] Rama existente/base preservadas.
- [x] Stack real healthy y datos sintéticos disponibles.
- [x] 01–16, 18 y 19 válidas; índices y permisos documentados.
- [ ] 17-compose-healthy.png: brecha de captura documentada, salida técnica PASS.
- [x] Cada imagen revisada por privacidad y formato.
- [x] Sin datos reales/secretos visibles ni cambios funcionales.
- [x] Fixture temporal no versionado.
- [x] README y reporte creados.
- [ ] Revisar localmente las 18 imágenes y completar la captura 17 en terminal.
- [ ] Publicación/CI/working tree final: completar tras push.

Status: **READY_FOR_HUMAN_VALIDATION_WITH_DOCUMENTED_GAPS**. No HUMAN_ACCEPTED.
