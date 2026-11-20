# FASE 04 — Producto preparado para IA sin conectar un LLM

**Objetivo:** terminar la experiencia y las fronteras independientes del proveedor, preservando ADR-005.

1. Inspeccionar `AiModule`, `AiProvider`, `AiSummaryService`, builders/context, mock/preview, modelo AISummary y rutas. No crear lógica duplicada ni alterar contrato ya aprobado.
2. Preparar repositorios Flutter y vistas de generación/descripción/historial/detalle, states loading/empty/error/retry y disclaimer. Sin LLM, UI informa honestamente `Resúmenes generados por IA aún no disponibles`; nunca simular resúmenes productivos.
3. Preparar rutas owner de historial/detalle de AISummary cuando el contrato real y DB lo permitan; no poblar producto con fake. Tests pueden usar AISummary fixtures creados en DB de test, aislados, identificados y limpiables.
4. Completar la proyección `VIEW_SUMMARIES`: solo `COMPLETED`, propietario correcto, permiso activo y vigencia; sin inputSnapshot/prompt, info interna, notes ni PII. Flutter supporter puede tener pantalla lista pero vacía en ausencia de resultados reales. Probar 401/403/404 / revocación / expiración / deep link con fixtures.
5. Asegurar separación IA preview para desarrollo y deshabilitación en producción: mock no habilita generación pública; sin keys ni SDK externo.
6. Registrar `M2-28..40` y `M3-24..26` como **preparados o pendientes finales**, no marcarlos DONE por fixture. Nada de modelo/benchmark/evaluación de proveedores.

**Commits sugeridos:** `feat(ai-ui): add gated summary experience`, `feat(support): add safe summary read projection`, `test(ai-seam): enforce authorization without real llm`. **Gate:** UI y API no mienten sobre generación y no filtran datos; pruebas de contrato con fixtures pasan. Avanzar FASE 05.
