# PROMPT ÚNICO — ACTIVAR SPRINT COMPLETO NEUROCONNECT PRE-IA

Activa el bloque `PREIA-BETA-READINESS` de NeuroConnect. Estoy en la raíz del repositorio `CarlosAM03/neuro-connect`; he copiado la carpeta `harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/`. **Ejecuta autónomamente TODO el bloque de desarrollo pre-IA, recorriendo las FASES 01→07 en orden, sin pedirme autorización entre fases y realizando commits pequeños por unidad coherente.** Solo tendré una intervención humana al recibir tu handoff y ejecutar mi smoke Docker local. No crees PR, no hagas merge a main, push, tag ni despliegue cloud.

## Orden de lectura obligatorio

1. `harness/HARNESS.md` completo.
2. `harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/00_LEEME_INICIO.md`.
3. `harness/codex/NEUROCONNECT_SPRINT_BETA_PREIA/contexto/BASELINE_Y_RUTAS.md`.
4. `docs/ADRS/` oficiales, con prioridad por responsabilidad, especialmente ADR-008, ADR-007, ADR-005; anteproyecto, `README.md`, `docs/Planeacion/ROADMAP_V1.md`, `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md`, reportes previos.
5. Todos los `SPEC/*.md` del paquete, particularmente `01_CONTRATO_SPRINT.md`, `03_ALCANCE_Y_TRAZABILIDAD.md`, `08_CRITERIOS_ACEPTACION.md`.
6. `PROMPTS/FASE_01_*.md` ... `PROMPTS/FASE_07_*.md`, una fase a la vez.

## Reglas

- Trátalo como UN SOLO BLOCK del HARNESS, no como siete bloques que exijan PR humano entre ellos. Usa rama `sprint/pre-ia-beta` nacida de main vigente y conserva main intacta. Si la rama existe, inspecciónala sin sobreescribir.
- **Primero inspecciona repositorio, código, CI y tests reales; no reimplementes nada ya validado.** Los porcentajes 54.7 % son un freeze histórico, no el estado actual del código.
- Construye core, UX, analytics, audit, soporte, pantallas IA preparadas sin LLM, seguridad/accesibilidad, Android y readiness DevOps; reproduce y revalida los flujos con PostgreSQL real.
- Mantén **exactamente ADR-007**: Cloudflare Pages + OCI Always Free (alternativa Render Free) + Neon Free; $0. Nada de Vercel ni AWS. **No aprovisiones ni despliegues servicios públicos:** deja instrucciones y artefactos para que yo haga el primer deploy manual después del PR/merge.
- No consumas LLM, no selecciones proveedor/modelo, no generes resúmenes simulados visibles como si fueran IA real. `MockAiProvider` solo desarrollo/test; `AI Preview` desactivado en configuración pública.
- Protege historial no destructivo, permisos Owner/Supporter, notes, auditoría y allowlist; no cambies reglas de negocio, DB, contratos o arquitectura sin mi aprobación.
- **No interrumpas el sprint por una decisión aislada**: registra `DECISION_REQUIRED` y limita solo la tarea afectada. Continúa trabajo independiente. En situación insegura (secreto, destrucción de datos, facturación o acceso externo), detente con reporte de riesgo.
- Después de cada fase registra avance duradero en `RESULTADOS/PROGRESO.md` (SHA, pruebas, commits, gaps y siguiente fase), para reanudación por límite de sesión. Realiza aproximadamente 2–5 commits coherentes por fase donde haya cambios; no un mega commit. Documenta las decisiones menores.
- No uses datos clínicos ni pacientes reales para pruebas; usa fixtures sintéticos.
- Al final haz tus tests y smoke local según el ambiente disponible, produce `RESULTADOS/REPORTE_FINAL_SPRINT.md`, `RESULTADOS/DECISIONES_PENDIENTES.md`, `RESULTADOS/HANDOFF_HUMANO.md`, matriz de gates y lista detallada de pruebas. Reporta fallos/limitaciones sin falsear resultado.

## Cierre esperado

Entrégame una síntesis honesta con estado HARNESS (`READY_FOR_HUMAN_VALIDATION` / `PARTIALLY_COMPLETE` / `BLOCKED` / `FAILED_VALIDATION`), branch, base/final SHA, lista de commits por fase, cobertura real, tests ejecutados, pasos exactos para `docker compose` y smoke de dos cuentas, decisiones que necesites de mí y acciones manuales de primer despliegue. **No declares HUMAN_ACCEPTED ni v1.0.0 concluida.**

Comienza ahora por FASE 01 y sigue autónomamente hasta FASE 07 o un bloqueo total de seguridad. No te limites a explicar el plan: impleméntalo.
