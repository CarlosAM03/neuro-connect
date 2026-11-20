# NeuroConnect — Paquete ejecutable Codex: beta funcional previa a IA

**Versión del paquete:** 1.0.0 · **Preparación:** 2026-11-19 · **Destino recomendado:** `neuro-connect/harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/`.

## Qué es

Una especificación operativa, contexto técnico y prompts para ejecutar **un único bloque de desarrollo compuesto por fases internas**, con Codex trabajando autónomamente hasta entregar un único handoff para inspección y prueba local humana. No es un cambio de arquitectura, no sustituye al arnés permanente y no concede autonomía para decisiones de negocio.

**Objetivo de salida:** una beta pre-IA localmente validada, funcional, reproducible y lista para que el responsable humano configure y ejecute el primer despliegue siguiendo ADR-007. La integración con un LLM real, el despliegue público efectivamente ejecutado, la aceptación humana y la release académica v1.0.0 quedan fuera de la autodeclaración de Codex.

## Dónde copiarla

1. Descomprime el ZIP y copia la carpeta `NEUROCONNECT_SPRINT_BETA_PREIA` dentro de `harness/codex/` en tu clon de `CarlosAM03/neuro-connect`.
2. No sustituyas `harness/HARNESS.md`, `docs/ADRS`, `docs/Planeacion` ni el código existente.
3. Abre Codex desde la **raíz del repositorio**; usa **`PROMPTS/ACTIVAR_SPRINT_COMPLETO.md`** como primer mensaje, o **`PROMPTS/FASE_01_*.md`** si deseas ejecución por fase.
4. Codex debe examinar `git status`, `main`, la estructura real y la baseline vigente antes de crear rama y modificar código.
5. En ejecución integral, no se requieren prompts intermedios: Codex lee y ejecuta las fases `01` a `07` en orden. Cada fase admite varios commits atómicos en la **misma rama del bloque**.
6. Al concluir, Codex entrega `RESULTADOS/REPORTE_FINAL_SPRINT.md`, `RESULTADOS/DECISIONES_PENDIENTES.md` y `RESULTADOS/HANDOFF_HUMANO.md` e indica claramente sus estados.
7. El responsable ejecuta `OPERACION/SMOKE_LOCAL_HUMANO.md`. Tras el smoke, usar `PROMPTS/CIERRE_POST_SMOKE.md` con observaciones y decisiones, para una segunda pasada sobre la misma rama o una nueva rama de correcciones conforme a HARNESS.

## Prioridad normativa

Anteproyecto oficial > ADR-001..008 (ADR-008 prevalece solo en lo que modifica) > `ROADMAP_V1` / planes aceptados > `harness/HARNESS.md` > SPEC de este sprint > prompts de fase > código. Si hay contradicción, Codex documenta y bloquea SOLO el fragmento afectado. **Las copias en `contexto/fuentes-originales/` son referencias inmutables; los documentos canónicos ya existentes en el repositorio mandan**.

## Modos disponibles

- **Todo el sprint:** `PROMPTS/ACTIVAR_SPRINT_COMPLETO.md` (predeterminado). Una rama `sprint/pre-ia-beta`, fases 01–07 internas, commits parciales y un solo handoff humano.
- **Por fase:** `PROMPTS/FASE_01...FASE_07...`. Solo ejecutar una fase si las anteriores están completadas o su omisión está documentada. La misma rama del sprint; no fusionar entre fases.
- **Reanudar:** `PROMPTS/REANUDAR_SPRINT.md`, usando la bitácora durable y estado Git.
- **Después del smoke:** `PROMPTS/CIERRE_POST_SMOKE.md` para correcciones y resolución de bloqueos autorizados por el usuario.

## Contenido

- `SPEC/`: contrato funcional, arquitectónico, seguridad, DevOps, trazabilidad, estado de baseline y decisiones.
- `PROMPTS/`: activador maestro, siete fases, reanudación y cierre post-smoke.
- `OPERACION/`: instrucciones de prueba humana y despliegue controlado.
- `PLANTILLAS/`: formato de reporte, decisiones, evidencias y registro de avance.
- `contexto/`: inventario, notas verificadas del repositorio y copias de documentación suministrada.
- `scripts/`: verificador local de integridad del paquete.

**No ejecutar `git reset --hard`, `git clean -fd`, `git push --force`, borrados masivos ni comandos de despliegue sobre cuentas reales. Nunca almacenar secretos en commits, logs o reportes.**
