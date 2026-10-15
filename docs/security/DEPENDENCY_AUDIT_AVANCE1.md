# Dependency audit — Avance 1 closeout

Fecha: 2026-10-15. Backend Node 22.16.0 / npm 10.9.2, package-lock v3.
Auditoría de la baseline aceptada `d3920d9` y de la corrección del sprint.
Los resultados describen este lock y esta fecha; no garantizan ausencia de futuras
vulnerabilidades ni sustituyen un gate de release. Sin `audit fix --force`, upgrades
mayores, downgrades Prisma ni cambios de arquitectura.

## Método y resultado reproducible

Desde `backend/`:

```powershell
npm ci
npm audit
npm audit --omit=dev
npm audit --json
npm audit --omit=dev --json
npm ls js-yaml deepmerge-ts braces sprintf-js --all
```

`npm audit` devuelve exit 1 cuando detecta advisories; es un resultado esperado de
la medición, no una suite funcional fallida. No se oculta ni modifica ese resultado.
La ejecución inicial y final también se guardó como JSON local ignorado en
`tmp/avance1-closeout/`. No hay secretos en la evidencia versionada.

| Medición | Inicial | Final |
| --- | --- | --- |
| Completa | 38 paquetes: 6 moderate / 32 high | 37 paquetes: 5 moderate / 32 high |
| `--omit=dev` | 5 paquetes: 2 moderate / 3 high | 3 paquetes: 0 moderate / 3 high |
| Advisories raíz distintos | 4 | 3 |
| Critical | 0 | 0 |

El número de paquetes incluye metavulnerabilidades propagadas por npm: los tres
high runtime son **un solo advisory** en deepmerge-ts propagado a @prisma/config
y prisma. Mantener ese dato evita presentar tres fallos explotables independientes.

## Análisis por advisory

### GHSA-r3ph-w7gj-g6xm — js-yaml — moderate — FIXED

- Dependencia transitiva runtime: backend → @nestjs/swagger@11.4.7 →
  js-yaml@5.3.0. Swagger es directo; el parser es transitivo.
- Rango afectado >=5.0.0 <=5.4.0; versión corregida 5.4.1. Instalado final 5.4.3.
- Exposición: Swagger usa `jsyaml.dump(documentToSerialize)` para serializar el
  documento propio; no se encontró `load()` de YAML controlado por usuarios.
- Acción: override **limitado a @nestjs/swagger → js-yaml:5.4.3**. Es minor dentro
  de major5, con lock reproducible; Swagger fijaba exactamente5.3.0 y no existía
  una versión posterior de Swagger11 que eliminara ese pin en esta fecha.
- El advisory ya no aparece en el audit final. Verificación funcional de Swagger,
  contratos E2E y Docker forma parte de los gates del reporte del sprint.
- Fuente: [advisory y parche](https://github.com/advisories/GHSA-r3ph-w7gj-g6xm).

### GHSA-ggr8-5vv4-36mx — deepmerge-ts — high — NOT_RUNTIME_REACHABLE

- Dependencia transitiva clasificada runtime por npm: backend → prisma@6.19.3
  (directa) → @prisma/config@6.19.3 → deepmerge-ts@7.1.5.
- Rango afectado <8.0.0; corrección8.0.0. Prisma6.19.3 fija exactamente7.1.5;
  no hay parche compatible7.x que cierre el advisory. El audit propone bajar
  Prisma a6.12.0; no se ejecuta un downgrade ni override mayor8 incompatible.
- Condición del fallo: fusionar grafos de objetos recursivos. JSON ordinario no
  produce referencias cíclicas. Riesgo genérico: agotamiento de stack/DoS.
- Análisis del código instalado: `@prisma/config/dist/index.js`,
  `loadConfigTsOrJs`, importa deepmerge para cargar configuración local c12;
  deshabilita configuración remota/giget/extend. No es el cliente de consultas.
  `backend/src` importa @prisma/client; ningún controller/servicio procesa datos
  HTTP con @prisma/config o deepmerge-ts. No existen uploads/config dinámica.
- Prisma CLI sí está en la imagen final para `migrate deploy` antes del arranque.
  Por eso `--omit=dev` lo cuenta. La clasificación significa **no alcanzable desde
  requests de negocio en esta implementación**, no ausencia física del paquete.
- Mitigación vigente: configuración/schema/migrations confiables y versionados,
  imagen no-root, sin endpoints de edición de configuración; no aceptar módulos JS
  o grafos aportados por terceros. Un atacante que ya modifica archivos de arranque
  tiene una capacidad mayor que este DoS.
- Aceptación temporal del riesgo residual de tooling: **ACCEPTED_TEMPORARILY**.
  El objetivo ideal runtime high=0 no se alcanza; se acepta esta baseline local
  académica porque no existe ruta de entrada HTTP al merge vulnerable y no hay
  despliegue público en este sprint. No se afirma seguridad de producción final.
- Reevaluar al primer parche compatible de Prisma/config o **antes de cualquier
  despliegue público/MVP-4**, y de inmediato si aparece configuración no confiable,
  carga remota o ejecución de Prisma CLI desde requests. Responsable: mantenedor.
  No bloquea el closeout funcional conforme al criterio de riesgo evaluado del plan.
- Fuente: [condiciones y versión corregida](https://github.com/advisories/GHSA-ggr8-5vv4-36mx).

### GHSA-vfj7-8cjw-p6xm — braces — high — NOT_RUNTIME_REACHABLE

- Transitiva **dev**: backend → jest@29.7.0 → @jest/core@29.7.0 →
  micromatch@4.0.8 → braces@3.0.3. También alcanzada por ramas de ts-jest/Jest.
- Rango afectado <=3.0.3; advisory sin versión corregida. npm propone Jest30.5.2
  para evitar esa rama, un major fuera de actualización compatible del sprint.
- Riesgo: patrones de llaves profundamente anidados causan stack exhaustion.
  Inputs efectivos son patrones de tests/repositorio confiables, no requests.
  Jest/braces no están en la imagen runtime tras `npm prune --omit=dev`.
- Acción: conservar tests y contratos; no reducir suites ni forzar major.
  Limitación de cadena: **TRANSITIVE_NO_COMPATIBLE_FIX**. Ejecutar CI solo sobre
  código revisable con permisos mínimos, sin secretos de producción. Un PR ejecuta
  código y no se presume confiable por pasar esta evaluación.
- Reevaluar antes de MVP-4 o al publicarse parche compatible; no es un high runtime.
- Fuente: [advisory, rango y ausencia de parche](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

### GHSA-hp3w-g68c-fv3c — sprintf-js — moderate — NOT_RUNTIME_REACHABLE

- Transitiva **dev**: backend → ts-jest@29.4.14 → @jest/transform@29.7.0 →
  babel-plugin-istanbul → @istanbuljs/load-nyc-config@1.1.0 → js-yaml@3.15.2 →
  argparse@1.0.10 → sprintf-js@1.0.3.
- Rango afectado <=1.1.3; sin versión corregida publicada en el advisory.
  No se sustituye js-yaml3 por major5 en tooling ni se fuerza Jest30.
- Riesgo: strings de formato con precisión no acotada. Solo configuración y
  mensajes del tooling de cobertura; no datos de negocio/HTTP. Ausente de runtime.
- Acción: **TRANSITIVE_NO_COMPATIBLE_FIX** para la cadena; mantener configuración
  confiable y reevaluar al aparecer solución compatible o antes de MVP-4.
- Fuente: [advisory y exposición requerida](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).

## Validación y alcance

El único cambio del lock es js-yaml5.3.0→5.4.3; dependencias directas, Prisma,
NestJS, Jest, Flutter y sus contratos permanecen en los majors aceptados.
Los resultados exactos de lint, 70 unitarias, E2E, Flutter, builds, Docker,
migrations, seed y smoke se registran en el reporte del sprint tras ejecutarlos.
Swagger JSON/YAML deben servir correctamente tras el cambio; no se desactiva
Swagger ni una protección de seguridad para ocultar advisories.

## Inventario de paquetes marcados

La siguiente tabla identifica también cada metavulnerabilidad de npm (no solo las
cuatro causas raíz). `via` nombra el siguiente eslabón hacia los advisories ya
analizados; la clasificación de alcance y mitigación se hereda de ellos.

| Paquete | Severidad inicial | Tipo / alcance | Instalado inicial → final | via | Clasificación final |
| --- | --- | --- | --- | --- | --- |
| @istanbuljs/load-nyc-config | moderate | transitiva / dev | 1.1.0 → 1.1.0 | js-yaml | NOT_RUNTIME_REACHABLE |
| @jest/console | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-message-util | NOT_RUNTIME_REACHABLE |
| @jest/core | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/console, @jest/reporters, @jest/test-result, @jest/transform, jest-config, jest-haste-map, jest-message-util, jest-resolve, jest-resolve-dependencies, jest-runner, jest-runtime, jest-snapshot, jest-watcher, micromatch | NOT_RUNTIME_REACHABLE |
| @jest/environment | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/fake-timers | NOT_RUNTIME_REACHABLE |
| @jest/expect | high | transitiva / dev | 29.7.0 → 29.7.0 | expect, jest-snapshot | NOT_RUNTIME_REACHABLE |
| @jest/fake-timers | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-message-util | NOT_RUNTIME_REACHABLE |
| @jest/globals | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/environment, @jest/expect | NOT_RUNTIME_REACHABLE |
| @jest/reporters | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/console, @jest/test-result, @jest/transform, jest-message-util | NOT_RUNTIME_REACHABLE |
| @jest/test-result | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/console | NOT_RUNTIME_REACHABLE |
| @jest/test-sequencer | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/test-result, jest-haste-map | NOT_RUNTIME_REACHABLE |
| @jest/transform | high | transitiva / dev | 29.7.0 → 29.7.0 | babel-plugin-istanbul, jest-haste-map, micromatch | NOT_RUNTIME_REACHABLE |
| @nestjs/swagger | moderate | directa / runtime instalado | 11.4.7 → 11.4.7 | js-yaml | FIXED |
| @prisma/config | high | transitiva / runtime instalado | 6.19.3 → 6.19.3 | deepmerge-ts | NOT_RUNTIME_REACHABLE |
| @types/jest | high | directa / dev | 29.5.14 → 29.5.14 | expect | NOT_RUNTIME_REACHABLE |
| argparse | moderate | transitiva / dev | 1.0.10 → 1.0.10 | sprintf-js | NOT_RUNTIME_REACHABLE |
| babel-jest | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/transform, babel-plugin-istanbul | NOT_RUNTIME_REACHABLE |
| babel-plugin-istanbul | moderate | transitiva / dev | 6.1.1 → 6.1.1 | @istanbuljs/load-nyc-config | NOT_RUNTIME_REACHABLE |
| braces | high | transitiva / dev | 3.0.3 → 3.0.3 | GHSA-vfj7-8cjw-p6xm | NOT_RUNTIME_REACHABLE |
| create-jest | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-config | NOT_RUNTIME_REACHABLE |
| deepmerge-ts | high | transitiva / runtime instalado | 7.1.5 → 7.1.5 | GHSA-ggr8-5vv4-36mx | NOT_RUNTIME_REACHABLE |
| expect | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-message-util | NOT_RUNTIME_REACHABLE |
| jest | high | directa / dev | 29.7.0 → 29.7.0 | @jest/core, jest-cli | NOT_RUNTIME_REACHABLE |
| jest-circus | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/environment, @jest/expect, @jest/test-result, jest-message-util, jest-runtime, jest-snapshot | NOT_RUNTIME_REACHABLE |
| jest-cli | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/core, @jest/test-result, create-jest, jest-config | NOT_RUNTIME_REACHABLE |
| jest-config | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/test-sequencer, babel-jest, jest-circus, jest-environment-node, jest-resolve, jest-runner, micromatch | NOT_RUNTIME_REACHABLE |
| jest-environment-node | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/environment, @jest/fake-timers | NOT_RUNTIME_REACHABLE |
| jest-haste-map | high | transitiva / dev | 29.7.0 → 29.7.0 | micromatch | NOT_RUNTIME_REACHABLE |
| jest-message-util | high | transitiva / dev | 29.7.0 → 29.7.0 | micromatch | NOT_RUNTIME_REACHABLE |
| jest-resolve | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-haste-map | NOT_RUNTIME_REACHABLE |
| jest-resolve-dependencies | high | transitiva / dev | 29.7.0 → 29.7.0 | jest-snapshot | NOT_RUNTIME_REACHABLE |
| jest-runner | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/console, @jest/environment, @jest/test-result, @jest/transform, jest-environment-node, jest-haste-map, jest-message-util, jest-resolve, jest-runtime, jest-watcher | NOT_RUNTIME_REACHABLE |
| jest-runtime | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/environment, @jest/fake-timers, @jest/globals, @jest/test-result, @jest/transform, jest-haste-map, jest-message-util, jest-resolve, jest-snapshot | NOT_RUNTIME_REACHABLE |
| jest-snapshot | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/transform, expect, jest-message-util | NOT_RUNTIME_REACHABLE |
| jest-watcher | high | transitiva / dev | 29.7.0 → 29.7.0 | @jest/test-result | NOT_RUNTIME_REACHABLE |
| js-yaml | moderate | transitiva / runtime instalado | 3.15.2, 5.3.0 → 3.15.2, 5.4.3 | GHSA-r3ph-w7gj-g6xm, argparse | runtime FIXED; dev NOT_RUNTIME_REACHABLE |
| micromatch | high | transitiva / dev | 4.0.8 → 4.0.8 | braces | NOT_RUNTIME_REACHABLE |
| prisma | high | directa / runtime instalado | 6.19.3 → 6.19.3 | @prisma/config | NOT_RUNTIME_REACHABLE |
| sprintf-js | moderate | transitiva / dev | 1.0.3 → 1.0.3 | GHSA-hp3w-g68c-fv3c | NOT_RUNTIME_REACHABLE |

Rutas verificadas del lock final (un camino mínimo por paquete; npm puede tener otros):

- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/transform@29.7.0 → babel-plugin-istanbul@6.1.1 → @istanbuljs/load-nyc-config@1.1.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/console@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-runner@29.7.0 → @jest/environment@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0 → jest-circus@29.7.0 → @jest/expect@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-runtime@29.7.0 → @jest/fake-timers@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-runtime@29.7.0 → @jest/globals@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/reporters@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/test-result@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0 → @jest/test-sequencer@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/transform@29.7.0
- backend → @nestjs/swagger@11.4.7
- backend → prisma@6.19.3 → @prisma/config@6.19.3
- backend → @types/jest@29.5.14
- backend → @nestjs/swagger@11.4.7 → js-yaml@5.4.3 → argparse@2.0.1
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0 → babel-jest@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/transform@29.7.0 → babel-plugin-istanbul@6.1.1
- backend → jest@29.7.0 → @jest/core@29.7.0 → micromatch@4.0.8 → braces@3.0.3
- backend → jest@29.7.0 → jest-cli@29.7.0 → create-jest@29.7.0
- backend → prisma@6.19.3 → @prisma/config@6.19.3 → deepmerge-ts@7.1.5
- backend → @types/jest@29.5.14 → expect@29.7.0
- backend → jest@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0 → jest-circus@29.7.0
- backend → jest@29.7.0 → jest-cli@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-config@29.7.0 → jest-environment-node@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-haste-map@29.7.0
- backend → @types/jest@29.5.14 → expect@29.7.0 → jest-message-util@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-resolve@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-resolve-dependencies@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-runner@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-runtime@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-snapshot@29.7.0
- backend → jest@29.7.0 → @jest/core@29.7.0 → jest-watcher@29.7.0
- backend → @nestjs/swagger@11.4.7 → js-yaml@5.4.3
- backend → jest@29.7.0 → @jest/core@29.7.0 → micromatch@4.0.8
- backend → prisma@6.19.3
- backend → jest@29.7.0 → @jest/core@29.7.0 → @jest/transform@29.7.0 → babel-plugin-istanbul@6.1.1 → @istanbuljs/load-nyc-config@1.1.0 → js-yaml@3.15.2 → argparse@1.0.10 → sprintf-js@1.0.3

### Salida final resumida sin secretos

```text
npm audit: 37 vulnerabilities (5 moderate, 32 high), exit 1
npm audit --omit=dev: 3 vulnerabilities (3 high), exit 1
Root advisories remaining: deepmerge-ts, braces, sprintf-js
Runtime advisory remaining: deepmerge-ts (prisma → @prisma/config)
Compatible override applied: @nestjs/swagger → js-yaml 5.4.3
```
