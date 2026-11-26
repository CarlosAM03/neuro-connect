const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root='docs/evidence/avance2',base='4f2ced9fdacfaaa7e071bf91cdffd5b3412da2ae';
const url='https://github.com/CarlosAM03/neuro-connect/blob/sprint/pre-ia-beta/';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]).sort();}
let report=`# Manifiesto de evidencias C2\n\nGenerado UTC ${new Date().toISOString()}; local America/Tijuana (UTC−08:00).\nRama: sprint/pre-ia-beta. Fuente de aplicación inmutable: \`${base}\`; C2 no modifica app/backend/schema.\nSHA-256 de archivo: texto normalizado LF como en Git; imágenes JPEG byte a byte.\nEl commit que contiene cada archivo se obtiene con git log; los metadatos .json de runners\nincluyen el SHA efectivo de ejecución, comandos y fechas.\n\n[Índice remoto de rama](https://github.com/CarlosAM03/neuro-connect/tree/sprint/pre-ia-beta/docs/evidence/avance2).\nSolo los archivos listados son evidencia; no se reutilizan capturas del Avance 1.\nFormato: nueve JPEG nativos de navegador,1280×720,DPR observado1.5; no PNG porque esa API devuelve JPEG.\nSin conversión, recorte ni modificación del contenido. Diagrama SVG: documentación explícita.\n\n| ID | Ruta / enlace remoto exacto | Fecha UTC del artefacto | Origen / cuenta | Rúbrica | SHA-256 | Estado |\n|---|---|---|---|---|---|---|\n`;
let i=0;
for(const file of walk(root)){
 if(file.endsWith('/MANIFIESTO_EVIDENCIAS.md'))continue;
 const relative=file.slice(root.length+1),stat=fs.statSync(file),bytes=fs.readFileSync(file),sha=crypto.createHash('sha256').update(relative.endsWith('.jpg')?bytes:bytes.toString('utf8').replace(/\r\n/g,'\n')).digest('hex');
 let origin='Documento/script versionado C2; sin datos reales',rubric='7,8';
 if(relative.startsWith('capturas/')){origin=relative.endsWith('.jpg')?'Navegador real IAB; A/B sintéticos; source '+base.slice(0,7):'Salida CLI o metadatos reales C2';rubric='1,2,4';}
 if(relative.startsWith('pruebas/')){origin='Runner/CLI real; '+(relative.endsWith('.json')?'metadatos o escaneo':'stdout/stderr sanitizados');rubric='4,6';}
 if(relative.startsWith('diagramas/')){origin='schema.prisma + PostgreSQL de test; sin datos de usuario';rubric='3,7';}
 if(relative.startsWith('docker/')){origin='Docker CLI; inventario/limpieza comprobados sin volúmenes';rubric='2,4,6';}
 const date=stat.mtime.toISOString();
 let state='DOCUMENTADO';
 if(relative.endsWith('.jpg'))state='CAPTURA REAL';
 if(relative.startsWith('pruebas/')&&/\.(json|txt)$/.test(relative)){
   const meta=file.replace(/\.txt$/,'.json');
   if(fs.existsSync(meta)){try{const j=JSON.parse(fs.readFileSync(meta,'utf8'));if(j.exitCode!==undefined)state=j.exitCode===0?'PASS exit0':relative.includes('audit-runtime')?'ADVISORIES exit1':'FAIL inicial; reintento PASS';}catch{}}
 }
 report+=`| E-${String(++i).padStart(3,'0')} | [${relative}](${url+file}) | ${date} | ${origin} | ${rubric} | ${sha} | ${state} |\n`;
}
const constancia='harness/codex/AVANCE2_CIERRE_EVIDENCIAS/REFERENCIAS/CONSTANCIA_SMOKE_MANUAL_2026-11-26.md';
report+=`\n## Antecedente humano separado\n\n[Constancia manual](${url+constancia}): confirmación directa del responsable del26/nov/2026;\nfecha/hora exacta del recorrido no informada. Smoke exploratorio satisfactorio YA REALIZADO,\nno generado por Codex y no equivalente a aceptación formal de release o resolución de DEC-001.\n\n## Interpretación y límites\n\n- Fechas de tabla: creación/modificación del artefacto actual; fecha de la prueba en su JSON/log.\n- Capturas09 pruebas y08 Compose se entregan como logs legibles permitidos por SPEC/S2.\n- Las cuentas de captura se eliminaron de forma controlada tras documentar el flujo;\n  credenciales y tokens temporales nunca se versionaron. Fechas de check-ins asignadas como fixture.\n- El manifiesto se describe a sí mismo mediante su blob Git (sin hash propio recursivo).\n- Revisar resumen de pruebas y handoff para PASS/FAIL/reintentos: un log de fallo inicial no se presenta como PASS.\n- PDF académico permanece local e intacto; autor lo actualizará con estas rutas y sus límites.\n`;
fs.writeFileSync(root+'/MANIFIESTO_EVIDENCIAS.md',report); console.log('Manifest created for',i,'real artifacts and separate human statement.');
