# Gobernanza, autonomía, cambios y Git

## Fuentes y políticas de ejecución

Leer `harness/HARNESS.md` completo. Este documento **instancia un BLOCK único `PREIA-BETA-READINESS`**, subdividido en fases internas; no sustituye el patrón de PR humano entre bloques independientes. Mantener main protegida.

## Inicio y repositorio con paquete copiado

- Registrar `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, `git remote -v`, y si está disponible `git fetch` sin modificar el contenido. Si no puede consultar remotos, anotar limitación.
- Si hay modificaciones locales del usuario o cambios no conocidos, NO descartar, sobrescribir ni mezclar automáticamente; documentar y trabajar sin tocar esos archivos o solicitar intervención en el handoff si bloquearan. El paquete de sprint copiado sin versionar es un input previsto, no un error.
- La rama del sprint será `sprint/pre-ia-beta` partiendo de `main` actualizado (o del main disponible cuando no haya remote). Si ya existe, inspeccionarla; no recrearla ni borrarla. Jamás crear commits de features sobre main.
- Versionar la especificación/prompts y plantillas según corresponda. La carpeta `contexto/fuentes-originales/` está excluida del control de versiones para evitar duplicar material canónico/archivos binarios; verificar que las fuentes canónicas existan en repo.

## Commit strategy

- Aproximadamente **2–5 commits coherentes por fase** cuando hay cambios reales; no es cuota rígida. No agrupar el sprint entero en un solo commit, ni crear commits artificiales sin cambio.
- Validar tests adecuados antes de cada conjunto significativo; en lo posible un commit no debe dejar rota la rama por largos períodos.
- Convenciones: `docs(preia): ...`, `fix(goals): ...`, `feat(support): ...`, `test(analytics): ...`, `fix(ui): ...`, `ci: ...`, `build: ...`.
- Reportar SHAs y cambios por fase. No rebase destructivo, `reset --hard`, `clean -fd`, force push, commit de `.env`, edición binaria de originales, PR/merge/tag automático, release ni despliegue cloud sin autorización.
- Push de rama únicamente si el usuario lo autorizó explícitamente en el comando de activación o la política del HARNESS vigente lo permite; en este paquete **no se autoriza push por defecto**.

## Estado durable y reanudación

Crear `RESULTADOS/PROGRESO.md` y actualizar tras cada fase: base SHA, HEAD, fase, unit tests/builds corridos, cambios, tareas abiertas, limitaciones, commits y siguiente fase. Leerlo primero al reanudar. Nunca afirmar que una fase pasó sin evidencia. Si el agente termina por límite de contexto, dejar checkpoint y usar `PROMPTS/REANUDAR_SPRINT.md`.

## Tipos de pendiente

- `DEFERRED_AI`: requiere LLM real; fuera de este sprint, no fallo.
- `EXTERNAL_HUMAN_ACTION`: cuenta/credencial/provisión/despliegue/aceptación exclusivamente humana.
- `DECISION_REQUIRED`: cambio de dominio, seguridad o arquitectura no autorizado; presentar alternativas.
- `ENVIRONMENT_LIMITATION`: herramienta no disponible; indicar cómo reproducir y qué faltó validar.
- `DEFECT`: funcionalidad esperada falla; arreglarla si no bloquea una decisión.
- `NICE_TO_HAVE`: mejora opcional excluida de gates. No introducir si arriesga fecha/calidad.

## Estados de cierre HARNESS

`READY_FOR_HUMAN_VALIDATION`, `PARTIALLY_COMPLETE`, `BLOCKED`, `FAILED_VALIDATION`. Nunca `HUMAN_ACCEPTED`, nunca `PRODUCTION_READY` sin deploy y verificación efectiva, nunca 100 % de v1.0.0 sin IA real.
