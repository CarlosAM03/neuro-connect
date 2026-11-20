# Fuentes incorporadas y origen

En `contexto/fuentes-originales/` hay copias literales de las fuentes suministradas al proyecto (anteproyecto, ADR-001 a ADR-008, ROADMAP, PLAN, HARNESS, README y reporte PDF del Avance 1). Se incluyen para facilitar auditoría y continuidad, pero se excluyen del seguimiento Git por duplicar material canónico y documentos binarios. **Nunca modificar estos originales.**

No se adjunta `splnproc1703 (1).docm`: no forma parte de la línea base técnica de NeuroConnect y es un documento con macros ajeno al objetivo de este sprint.

Además, el repositorio ya contiene documentos vivos que **no se duplicaron en el ZIP** para evitar copias divergentes:

- `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md` — matriz granular de 148 entregables; fuente principal de IDs y estado.
- `docs/Planeacion/avance1-closeout.md` — plan histórico.
- `harness/codex/AVANCE1_CLOSEOUT_REPORT.md` y `AVANCE1_FREEZE_REPORT.md` — evidencia pasada.
- Código completo `backend/`, `app/`, workflows y Compose.

Esos documentos **son parte obligatoria del contexto de Codex** y deben consultarse en el repositorio que contenga esta carpeta. El ZIP no es un clon del monorepo ni debe reemplazarlo. Si se ejecuta sin el repositorio, corresponde `BLOCKED: missing canonical project`, no generar una app nueva.
