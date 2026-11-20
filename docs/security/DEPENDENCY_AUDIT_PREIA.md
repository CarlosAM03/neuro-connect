# Dependency audit — beta pre-IA

Fecha local: 2026-11-19, America/Tijuana. Node 22.16.0 / npm 11.7.0.
Reevaluación del lock aceptado en Avance 1; no modifica su informe histórico.

| Medición ejecutada | Inicial | Final tras parches |
|---|---|---|
| npm audit --json | 8 moderate / 7 high / 0 critical (15 paquetes) | 0 moderate / 3 high / 0 critical |
| npm audit --omit=dev --json | 1 moderate / 7 high / 0 critical (8 paquetes) | 0 moderate / 3 high / 0 critical |

Exit 1 en auditorías por hallazgos; no se presenta audit=0. JSON local ignorado
en `tmp/preia-audit*.json`. No credenciales en esos archivos. Reproducir desde
backend con `npm ci`, `npm run prisma:generate`, `npm audit --json` y
`npm audit --omit=dev --json`. El reporte final registra la regresión funcional.

## Correcciones compatibles

- Nest platform-express 11.2.7→11.2.11; body-parser 2.3.0→2.4.0 y multer
  2.4.0→2.5.0; qs 6.16.0→6.17.1. Corrigen advisories posteriores a octubre.
- Override **limitado a @prisma/config → effect 3.22.1**, desde 3.21.0, corrige
  ReDoS de TemplateLiteral sin migrar Prisma ni alterar cliente/schema.
- typescript-eslint 8.71.2→8.73.0 y su árbol admitido por el mantenedor; resuelve
  minimatch dev mediante su dependencia upstream (sin override mayor propio).
- Se conserva override js-yaml 5.4.3 de Swagger. Sin `audit fix --force`, downgrade
  Prisma, actualización masiva del stack o nuevas librerías de producto.

Fuentes contrastadas: [body-parser](https://github.com/advisories/GHSA-27r3-jxmh-p828),
[multer](https://github.com/advisories/GHSA-q7qp-rjg7-q26m),
[Effect](https://github.com/advisories/GHSA-7589-6fvf-x4pw).

## Residual de tooling, no aceptado como seguridad productiva definitiva

Los tres high son **un advisory** de
[deepmerge-ts](https://github.com/advisories/GHSA-ggr8-5vv4-36mx), propagado a
@prisma/config y prisma. Prisma 6.19.3 fija deepmerge-ts 7.1.5; parche 8 exige
cambio mayor/compatibilidad nueva. No se fuerza esa sustitución ni Prisma 7/8.
Prisma CLI permanece en imagen para migrate deploy; por eso cuenta como runtime.
La API importa @prisma/client; no tiene rutas de carga de configuración JS ni
grafo recursivo del usuario hacia deepmerge. Esta evaluación de alcanzabilidad
es una inferencia del código instalado y de los controladores actuales, no una
garantía de ausencia del paquete vulnerable. Schema/config/migrations son archivos
confiables y versionados; no aceptar configuración remota o uploads ejecutables.

La baseline histórica aceptó temporalmente este riesgo de tooling en local.
Antes de publicación, el responsable debe revisar el residual y elegir mantener
temporalmente esas restricciones o autorizar un incremento separado de Prisma
cuando exista parche compatible. Ver DEC-001 en resultados del sprint. Los gates
funcionales pueden pasar sin que la auditoría devuelva cero; el workflow muestra
el advisory y no decide esa aceptación humana.

`npm run audit:gate` falla cerrado si la consulta no está disponible o aparece
cualquier paquete/advisory distinto del residual documentado. Solo permite ese
advisory y sus tres nombres afectados, informa el conteo y exige revisión humana
antes de desplegar. El workflow manual ejecuta esta política, sin ignorar
genéricamente exit codes ni aceptar automáticamente nuevas vulnerabilidades.
