# ACCIONES_EXTERNAS — tarea del responsable tras aprobación

| ID | Tipo | Acción exacta | Prerrequisitos | Evidencia requerida | Estado |
|---|---|---|---|---|---|
| EXT-01 | PR | Code review y merge humano a main | CI/Smoke local | PR humano | OPEN |
| EXT-02 | Infra | Seleccionar topología ADR-007 A o B, confirmar $0 | Cuenta/condiciones actuales | Proveedor gratuito confirmado | OPEN |
| EXT-03 | Infra | Provisionar OCI/Render/Neon/Cloudflare por usuario | Cuentas, no Codex | Recursos reales, sin secretos en reportes | OPEN |
| EXT-04 | Deployment | Configurar secretos y migraciones prod | Runbooks, aprobación | logs redactados | OPEN |
| EXT-05 | Deployment | Publicar backend/API/Web vía HTTPS | Build prod | URLs y smoke externo | OPEN |
| EXT-06 | Operations | Monitoring, backup, restore, rollback ensayados | Recursos reales | Evidencia de pruebas | OPEN |
| EXT-07 | Producto | Sprint posterior modelo/LLM real | ADR-005 | Benchmark/adapters/IA funcional | DEFERRED |
