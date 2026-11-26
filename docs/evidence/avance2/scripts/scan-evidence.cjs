const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=process.cwd(),dotenv=require(path.join(root,'backend/node_modules/dotenv'));
const secrets=[];for(const f of ['.env','backend/.env'])if(fs.existsSync(f))for(const[k,v]of Object.entries(dotenv.parse(fs.readFileSync(f))))if(/PASSWORD|SECRET|DATABASE_URL|API_KEY|TOKEN/.test(k)&&v&&v.length>=8)secrets.push(v);
const git=args=>{const r=spawnSync('git',args,{encoding:'utf8'});if(r.status!==0)throw Error('Git scan inventory failed');return r.stdout.split(/\r?\n/).filter(Boolean);};
const files=[...new Set([...git(['diff','--name-only','main...HEAD']),...git(['ls-files','--others','--exclude-standard']),...git(['diff','--name-only'])])].filter(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
const findings=[];let textFiles=0;
for(const f of files){
 if(/(^|\/)\.env(?:\.|$)/.test(f)&&!f.endsWith('.env.example'))findings.push({file:f,reason:'environment file'});
 if(!/\.(md|json|txt|ya?ml|[cm]?js|ts|dart|prisma|sql|svg|mmd|gitignore)$/.test(f))continue;
 textFiles++;const s=fs.readFileSync(f,'utf8');
 if(secrets.some(v=>s.includes(v)))findings.push({file:f,reason:'local secret value'});
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(s)||/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(s))findings.push({file:f,reason:'private key or JWT'});
}
const report={date:new Date().toISOString(),textFilesScanned:textFiles,findings,scope:'branch diff from main + untracked evidence, excludes ignored local inputs; JPEG manually reviewed'};
fs.writeFileSync('docs/evidence/avance2/pruebas/escaneo_secretos.json',JSON.stringify(report,null,2)+'\n');
console.log(findings.length?'FAIL: inspect findings by path only':`PASS: ${textFiles} text files scanned; no known local secrets, JWT or private keys. JPEG captures reviewed visually.`);if(findings.length)process.exitCode=1;
