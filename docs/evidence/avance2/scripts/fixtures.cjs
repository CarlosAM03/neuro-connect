// Synthetic C2 fixtures only; private browser credentials stay under ignored tmp/.
const fs=require('node:fs');
const {randomUUID,randomBytes}=require('node:crypto');
const path=require('node:path');
const root=process.cwd(); process.loadEnvFile('backend/.env');
if(process.env.NODE_ENV==='production'||!['localhost','127.0.0.1'].includes(new URL(process.env.DATABASE_URL).hostname))throw Error('Local development only');
const {PrismaClient}=require(path.join(root,'backend/node_modules/@prisma/client')); const db=new PrismaClient();
const file='tmp/c2-private-fixtures.json', mode=process.argv[2]||'create';
const base='http://localhost:3000/api/v1';
async function api(method,p,data,token,status=200){
 const r=await fetch(base+p,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
 if(r.status!==status)throw Error(`${method} ${p.split('/').slice(0,2).join('/')} expected${status}, got${r.status}`);
 return status===204?null:r.json();
}
(async()=>{
 if(mode==='create'){
  if(fs.existsSync(file))throw Error('C2 fixture state exists; preserve it');
  const suffix=randomBytes(5).toString('hex'),password=randomBytes(24).toString('base64url');
  const state={createdAt:new Date().toISOString(),password,accounts:[],goals:[]};
  for(const role of ['owner','supporter']){
   const email=`c2-${role}-${suffix}@example.com`;
   const user=await api('POST','/auth/register',{email,password,displayName:role==='owner'?'Propietaria C2 · Datos sintéticos':'Apoyo C2 · Datos sintéticos'},null,201);
   const login=await api('POST','/auth/login',{email,password});state.accounts.push({role,email,id:user.id,token:login.accessToken});
  }
  fs.mkdirSync('tmp',{recursive:true}); fs.writeFileSync(file,JSON.stringify(state));
  const token=state.accounts[0].token;
  for(const [title,status]of [['C2 · Preparar una lectura','ACTIVE'],['C2 · Organizar materiales','PAUSED'],['C2 · Cerrar una actividad','COMPLETED'],['C2 · Objetivo histórico','CANCELLED']]){
   const goal=await api('POST','/goals',{title,category:'Evidencia sintética'},token,201);state.goals.push(goal.id);fs.writeFileSync(file,JSON.stringify(state));
   for(const [i,progress]of [20,45,70].entries()){
    const c=await api('POST',`/goals/${goal.id}/check-ins`,{progress,difficulty:2,completion:'PARTIAL',notes:'NOTA PRIVADA SINTÉTICA C2 — nunca compartida'},token,201);
    // Deliberate fixture dates, not claimed as an actual user's historical activity.
    await db.checkIn.update({where:{id:c.id},data:{createdAt:new Date(Date.now()-(2-i)*3*86400000)}});
   }
   if(status!=='ACTIVE')await api('PATCH',`/goals/${goal.id}`,{status},token);
  }
  const relation=await api('POST','/support-network/relationships',{supporterEmail:state.accounts[1].email,canViewGoals:true,canViewProgress:true,canViewSummaries:false,expiresAt:new Date(Date.now()+7*86400000).toISOString()},token,201);state.relation=relation.id;
  fs.writeFileSync(file,JSON.stringify(state));
  console.log('PASS: two synthetic identities, four goal statuses, twelve effective CheckIns, active read-only grant; private credentials retained only under ignored tmp.');
 }else{
  const s=JSON.parse(fs.readFileSync(file,'utf8')),owner=s.accounts[0],supporter=s.accounts[1];
  const shared=`/support-network/owners/${owner.id}`;
  if(mode==='verify'){
   const goals=await api('GET',shared+'/goals',undefined,supporter.token);if(goals.length!==4)throw Error('Shared goals mismatch');
   const progress=await api('GET',`${shared}/goals/${s.goals[0]}/progress`,undefined,supporter.token);if(JSON.stringify(progress).includes('NOTA PRIVADA')||progress.timeline.length!==3)throw Error('Private projection mismatch');
   await api('PATCH',`/goals/${s.goals[0]}`,{title:'Forbidden'},supporter.token,404);
   const before=await db.aISummary.count({where:{userId:owner.id}});await api('POST','/ai/summaries',{},owner.token,503);
   if(before!==await db.aISummary.count({where:{userId:owner.id}}))throw Error('Unexpected summary persistence');
   console.log('PASS: B reads four statuses/three effective points, no private notes; B write404; generation503 with zero inserted summaries.');
  }else if(mode==='revoke'){
   await api('POST',`/support-network/relationships/${s.relation}/revoke`,{},owner.token);
   await api('GET',shared+'/goals',undefined,supporter.token,404);console.log('PASS: owner revoked, next delegated request404.');
  }else if(mode==='cleanup'){
   const ids=s.accounts.map(a=>a.id);for(const a of s.accounts)if(!/^c2-(owner|supporter)-[a-f0-9]{10}@example\.com$/.test(a.email))throw Error('Unsafe fixture identity');
   const rows=await db.user.findMany({where:{id:{in:ids},email:{in:s.accounts.map(a=>a.email)}}});if(rows.length!==2)throw Error('Fixture identity mismatch');
   await db.user.deleteMany({where:{id:{in:ids}}});fs.unlinkSync(file);console.log('PASS: removed exactly the two C2 synthetic identities and private temporary state.');
  }else throw Error('Unknown mode');
 }
})().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>db.$disconnect());
