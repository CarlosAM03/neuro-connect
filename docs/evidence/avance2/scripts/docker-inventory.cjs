const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const stage=process.argv[2]; if(!['ANTES','PRE_LIMPIEZA','DESPUES'].includes(stage))throw Error('Stage required');
const commands=[['context','show'],['version','--format','{{.Server.Version}}'],['ps','-a','--format','{{.ID}}|{{.Names}}|{{.Label "com.docker.compose.project"}}|{{.Status}}|{{.Image}}|{{.Size}}'],['image','ls','--format','{{.ID}}|{{.Repository}}:{{.Tag}}|{{.Size}}'],['volume','ls','--format','{{.Name}}|{{.Driver}}'],['system','df'],['compose','ps','-a']];
const date=new Date().toISOString(); let output=`# Docker ${stage}\n\nCaptura CLI real: ${date}. Sin Env, credenciales ni inspect completo.\n`;
for(const args of commands){const r=spawnSync('docker',args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error('Docker inventory failed'); output+=`\n## docker ${args.slice(0,3).join(' ')}\n\n\`\`\`text\n${r.stdout.trim()}\n\`\`\`\n`;}
fs.mkdirSync('docs/evidence/avance2/docker',{recursive:true});fs.writeFileSync(`docs/evidence/avance2/docker/${stage}.md`,output);console.log(output);
