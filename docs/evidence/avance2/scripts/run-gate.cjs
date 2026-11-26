// Capture actual command output, redacted before writing any public artifact.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const [label, directory, program, ...args] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('Safe label required');
const root = process.cwd();
const out = path.join(root, 'docs/evidence/avance2/pruebas'); fs.mkdirSync(out, {recursive:true});
const secrets = [];
for (const file of ['.env', 'backend/.env']) {
  if (!fs.existsSync(file)) continue;
  const env = require(path.join(root, 'backend/node_modules/dotenv')).parse(fs.readFileSync(file));
  for (const [k,v] of Object.entries(env)) if (/PASSWORD|SECRET|DATABASE_URL|API_KEY|TOKEN/.test(k) && v) secrets.push(v);
}
function redact(input) {
  let text = input;
  for(const secret of secrets.sort((a,b)=>b.length-a.length)) text = text.split(secret).join('[REDACTED]');
  return text.replace(/\x1b\[[0-9;]*m/g,'').replace(/postgres(?:ql)?:\/\/[^\s"']+/gi,'[DATABASE_URL_REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi,'Bearer [REDACTED]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'[JWT_REDACTED]')
    .split(root).join('<repo>').split(root.replace(/\\/g,'/')).join('<repo>');
}
const started = new Date().toISOString();
const sha = spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim();
let binary=program, commandArgs=args;
if(program==='npm') {
  binary=process.execPath;
  const candidates=[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),path.join(process.env.APPDATA||'', 'npm/node_modules/npm/bin/npm-cli.js')];
  const cli=candidates.find(p=>fs.existsSync(p)); if(!cli)throw Error('npm CLI unavailable'); commandArgs=[cli,...args];
}
const result=spawnSync(binary,commandArgs,{cwd:path.resolve(directory),env:{...process.env,PRISMA_HIDE_UPDATE_MESSAGE:'true',FLUTTER_SUPPRESS_ANALYTICS:'true',CI:'true'},encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});
const ended=new Date().toISOString(), code=result.status??1;
const output=redact((result.stdout||'')+'\n'+(result.stderr||'')+(result.error?'\n'+result.error.name:''));
const entry={label,command:[program,...args].join(' '),directory,sha,started,ended,exitCode:code};
if(fs.existsSync(path.join(out,label+'.txt'))){
  let attempt=1;while(fs.existsSync(path.join(out,`${label}-attempt-${attempt}.txt`)))attempt++;
  for(const ext of ['txt','json'])fs.copyFileSync(path.join(out,label+'.'+ext),path.join(out,`${label}-attempt-${attempt}.${ext}`));
}
fs.writeFileSync(path.join(out,label+'.txt'),JSON.stringify(entry,null,2)+'\n\n'+output);
fs.writeFileSync(path.join(out,label+'.json'),JSON.stringify(entry,null,2)+'\n');
console.log(label,'exit='+code,output.split(/\r?\n/).slice(-12).join('\n'));
process.exitCode=code;
