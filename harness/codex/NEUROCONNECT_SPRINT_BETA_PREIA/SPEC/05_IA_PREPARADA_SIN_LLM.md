# Frontera de IA: preparar sin entregar IA real

## Arquitectura que se preserva

`PostgreSQL → AnalyticsModule → SummaryContextBuilder → PromptBuilder / AiProvider → AISummary`. Analytics es autoridad. Flutter no llama al proveedor ni a DB. El LLM no decide permisos ni cambia objetivos/check-ins. El contrato `AiProvider` existente se reutiliza.

## Se permite dentro de este sprint

- Inspeccionar scaffold `AiModule`, `AiSummaryService`, builder/context allowlist, `MockAiProvider`, `AISummary` y `AI Preview`.
- Preparar **contratos de API de lectura** y proyecciones seguras con datos artificiales/fixtures solo en pruebas. Las rutas productivas que dependan de generación deben quedar explícitamente deshabilitadas cuando falta un proveedor real; conservar response code semántico y mensaje de servicio no disponible acorde al contrato vigente.
- Construir Flutter UI de lista, detalle, loading, error, retry y disclaimer, utilizando repositorios/proveedores testeables. En runtime sin IA real, una sección informativa `Función de resúmenes aún no disponible` puede explicar que se habilitará más adelante.
- Preparar `VIEW_SUMMARIES` en backend y frontend para leer únicamente `AISummary.status=COMPLETED` autorizado, sin `inputSnapshot`, contexto interno, prompts, email, notes, secretos, payloads de auditoría ni IDs internos innecesarios. Probar con fixtures persistidos en DB de test, no con mock presentado como resumen real al usuario.
- Revisar feature flags y asegurar `AI_PREVIEW_ENABLED=false` en configuración productiva y que `AI_PROVIDER=mock` NO habilite generación pública.
- Preparar tests de contrato/lifecycle mediante fakes, sin marcar la integración del modelo real como probada.

## NO se permite

- Consultar proveedores, gastar créditos, crear API keys, llamar LLM real, seleccionar modelo, benchmarking o decidir precio/latencia/costo de IA.
- Generar automáticamente resúmenes por check-in o cron; introducir RAG, vector DB, agentes o instrucciones libres directas del usuario.
- Producir texto clínico, diagnóstico, inferencias emocionales o recomendaciones de tratamientos.
- Enviar `CheckIn.notes`, email, password, tokens, IDs internos innecesarios, relaciones/permisos a servicios externos.
- Llenar la DB productiva con resúmenes inventados para aparente demostración de IA.

## Dependencias documentadas para sprint posterior

La baseline `M2-11..M2-40` sigue pendiente salvo partes implementables y validadas realmente con fixtures que deben reportarse como **preparación**. M3-24..26 exige resultados reales para DoD final, aunque sus rutas/UI se preparen. Reportar exactamente esas limitaciones.
