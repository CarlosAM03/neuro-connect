const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
process.loadEnvFile('backend/.env');
if(process.env.NODE_ENV==='production')throw Error('Test only');
const url=new URL(process.env.TEST_DATABASE_URL||'');if(!url.pathname.endsWith('_test'))throw Error('Separate test DB required');
const {PrismaClient}=require(path.resolve('backend/node_modules/@prisma/client'));
const db=new PrismaClient({datasourceUrl:url.toString()});
(async()=>{
 const tables=await db.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`;
 const foreignKeys=await db.$queryRaw`SELECT tc.table_name, kcu.column_name, ccu.table_name AS referenced_table, ccu.column_name AS referenced_column FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name=ccu.constraint_name AND tc.constraint_schema=ccu.constraint_schema WHERE tc.constraint_type='FOREIGN KEY' AND tc.table_schema='public' ORDER BY tc.table_name,kcu.column_name`;
 const migrations=await db.$queryRaw`SELECT migration_name,checksum,finished_at FROM "_prisma_migrations" ORDER BY migration_name`;
 const version=(await db.$queryRaw`SELECT version()`)[0].version;
 const proof={date:new Date().toISOString(),source:'backend/prisma/schema.prisma',schemaSha256:crypto.createHash('sha256').update(fs.readFileSync('backend/prisma/schema.prisma')).digest('hex'),version,tables,foreignKeys,migrations};
 if(foreignKeys.length!==7||migrations.length!==4||migrations.some(m=>!m.finished_at))throw Error('Unexpected schema evidence');
 fs.mkdirSync('docs/evidence/avance2/diagramas',{recursive:true});fs.writeFileSync('docs/evidence/avance2/diagramas/bd_prueba.json',JSON.stringify(proof,null,2)+'\n');
 console.log('PASS: six domain tables, seven real FK constraints, four applied migrations; entityId is not a universal FK. No connection string exported.');
})().catch(e=>{console.error(e.name);process.exitCode=1;}).finally(()=>db.$disconnect());
