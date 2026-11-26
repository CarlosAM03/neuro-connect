# NeuroConnect — Cierre acotado de evidencias del Avance 2

**Objeto:** completar la evidencia ejecutable, visual y documental del reporte académico del Avance 2. NO implementar nuevo sprint funcional ni IA real.  
**Insumo académico:** `REFERENCIAS/NeuroConnect_Avance_2_Actualizado_Smoke_Manual_2026-11-26.pdf` (informe actualizado; todavía pendiente de incorporar capturas del sprint).  
**Repo objetivo:** `CarlosAM03/neuro-connect`.  
**Rama de continuidad:** `sprint/pre-ia-beta` — HEAD local de referencia comunicado: `05c584c7db193e90128d1ba996db080410645335` (verificar, no asumir).  
**Validación humana de navegación:** YA EFECTUADA por el responsable en su máquina local (revisión de pestañas y experiencia visual satisfactoria), comunicada el 26/nov/2026. **Aceptación formal de rama, revisión de DEC-001 y merge:** aún reservadas al responsable.  

## Activación

1. Copiar esta carpeta a `harness/codex/AVANCE2_CIERRE_EVIDENCIAS/` del repositorio local.
2. Abrir Codex en la raíz del repo, no dentro de la carpeta.
3. Usar íntegro `PROMPTS/ACTIVAR_CIERRE_C2.md`, o el prompt corto de la respuesta de ChatGPT.
4. Codex trabaja sobre `sprint/pre-ia-beta`, preservando trabajo ajeno, sin PR, merge ni deployment. Puede publicar **esa rama** como parte de la entrega de evidencias, tras revisar que no incluya secretos.
5. Codex debe conservar como antecedente el smoke humano ya confirmado: no declararlo pendiente ni exigir repetirlo; sí debe realizar verificaciones automatizadas reproducibles y generar capturas reales nuevas.
6. Codex entregará `docs/evidence/avance2/` con imágenes actuales, logs redactados, esquema, manifiesto y handoff. También un inventario de limpieza Docker anterior/posterior.

## Reglas indeclinables

- Leer `harness/HARNESS.md`, anteproyecto, ADR-001..008 y `docs/Planeacion/AVANCE1_BASELINE_FREEZE.md` antes de editar.
- No sustituir ni alterar las decisiones de ADR-007 (Cloudflare Pages, OCI/Render, Neon, costo cero).
- No usar salida mock como si fuera generación IA real; no publicar/deployar ni crear PR ni fusionar main.
- Nada de pruebas, screenshots o métricas inventadas; indicar fuentes, fechas y versiones.
- No modificar `NeuroConnect_Avance_2_Consolidado...pdf` ni generar versiones PDF desde Codex: el autor actualizará el documento académico con la evidencia publicada.
- No ejecutar limpieza Docker ciega ni eliminar volúmenes.

Lea `SPEC/SPEC_CIERRE_EVIDENCIAS_C2.md` y `OPERACION/DOCKER_LIMPIEZA_CONTROLADA.md` completos.
