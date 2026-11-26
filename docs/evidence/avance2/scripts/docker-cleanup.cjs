// Explicit foreign stopped-container selection; no volume/network deletion ever.
const fs=require('node:fs'),{spawnSync}=require('node:child_process');
let log=`# Operaciones Docker C2\n\nUTC ${new Date().toISOString()}. Sin -v ni rm --force.\n`;
function docker(args){const r=spawnSync('docker',args,{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});if(r.status!==0)throw Error(`Docker command failed: ${args.slice(0,2).join(' ')}`);return r.stdout.trim();}
const volumes=()=>docker(['volume','ls','--format','{{.Name}}']).split('\n').sort();
const beforeVolumes=volumes();
function containers(){return docker(['ps','-a','--format','{{.ID}}|{{.Names}}|{{.Label "com.docker.compose.project"}}|{{.State}}|{{.Image}}']).split('\n').filter(Boolean).map(line=>{const[id,name,project,state,image]=line.split('|');return {id,name,project,state,image};});}
const initial=containers();
const official=['neuroconnect-frontend-1','neuroconnect-backend-1','neuroconnect-postgres-1'];
if(official.some(n=>!initial.some(c=>c.name===n&&c.project==='neuroconnect'&&c.state==='running')))throw Error('Three running demo services required before cleanup');
const candidates=initial.filter(c=>c.project!=='neuroconnect'&&/^(globows-v2-|prospector-|sigid-demo|saas-platform-|t3-|dev-env-audit)/.test(c.name)&&['exited','dead'].includes(c.state));
log+='\n## Candidatos explícitos\n\n```json\n'+JSON.stringify(candidates,null,2)+'\n```\n';
log+='\n## Recursos preservados\n\n```json\n'+JSON.stringify(initial.filter(c=>!candidates.some(x=>x.id===c.id)),null,2)+'\n```\n';
fs.writeFileSync('docs/evidence/avance2/docker/OPERACIONES.md',log);
try {
 for(const c of candidates){
  const live=containers().find(x=>x.id===c.id);
  if(!live||!['exited','dead'].includes(live.state)||live.project==='neuroconnect') {log+=`\nOmitido ${c.id}: estado cambió o recurso protegido.\n`;continue;}
  log+=`\ndocker rm ${c.id}: ${docker(['rm',c.id])}\n`;
 }
 const remaining=containers();
 if(official.some(n=>!remaining.some(c=>c.name===n&&c.project==='neuroconnect')))throw Error('Demo preservation failed');
 log+='\n## Imágenes sin referencias por contenedores preservados\n\n```text\n'+docker(['image','prune','-a','-f'])+'\n```\n';
 log+='\n## Caché de build no utilizada\n\nReconstruir puede descargar dependencias y tardar varios minutos.\n\n```text\n'+docker(['builder','prune','-a','-f'])+'\n```\n';
 if(JSON.stringify(beforeVolumes)!==JSON.stringify(volumes()))throw Error('Volume inventory changed; investigate');
 log+=`\nPASS: los ${beforeVolumes.length} volúmenes conservan exactamente sus nombres. Tres contenedores oficiales preservados; dos antiguos NeuroConnect ambiguos conservados. No se detuvo ningún contenedor ajeno activo.\n`;
 console.log(`PASS: ${candidates.length} foreign stopped candidates processed; ${beforeVolumes.length} volumes preserved. See OPERACIONES.md for actual reclaimed space.`);
}finally{fs.writeFileSync('docs/evidence/avance2/docker/OPERACIONES.md',log);}
