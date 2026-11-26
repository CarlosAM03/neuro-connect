// Code-native documentation, not a screenshot or reconstructed product interface.
const fs=require('node:fs');
const cards=[
 ['User',470,100,['PK id : UUID','UK email','passwordHash, displayName','createdAt, updatedAt']],
 ['Goal',50,325,['PK id : UUID','FK ownerId → User.id','title, description?, category?','status, progress (snapshot)','targetDate?, createdAt, updatedAt']],
 ['CheckIn',50,650,['PK id : UUID','FK goalId → Goal.id','progress, difficulty, completion','notes? (owner-only)','voidedAt?, createdAt']],
 ['AISummary',890,325,['PK id : UUID','FK userId → User.id','periodStart, periodEnd','inputSnapshot (internal)','content?, provider?, model?','status, createdAt']],
 ['SupportRelationship',450,325,['PK id : UUID','FK ownerId → User.id','FK supporterId → User.id','canViewGoals/Progress/Summaries','authorizedAt, expiresAt?, revokedAt?','UK (ownerId, supporterId)']],
 ['AuditEvent',450,650,['PK id : UUID','FK ownerId → User.id','FK actorId → User.id','action, entityType, entityId','payload, occurredAt','entityId: business reference, NOT FK']],
];
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1020" viewBox="0 0 1280 1020"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0 0L10 4L0 8" fill="#275d69"/></marker></defs><rect width="1280" height="1020" fill="#f6f8f9"/><g font-family="Arial,sans-serif" fill="#18343c"><text x="40" y="38" font-size="26">NeuroConnect — Modelo relacional implementado</text><text x="40" y="67" font-size="16">schema.prisma @4f2ced9 · seis entidades · siete FK reales · 1 → 0..N en cada vínculo</text>`;
for(const d of ['M500 235H210V320','M650 235V320','M800 235H1050V320','M210 530V645','M800 180H1230V925H820V770'])svg+=`<path d="${d}" fill="none" stroke="#275d69" stroke-width="3" marker-end="url(#arrow)"/>`;
svg+='<text x="45" y="290" font-size="16">ownerId (1 → 0..N)</text><text x="665" y="285" font-size="15">ownerId + supporterId (2 FK)</text><text x="925" y="290" font-size="16">userId (1 → 0..N)</text><text x="225" y="600" font-size="16">goalId (1 → 0..N)</text><text x="875" y="905" font-size="16">ownerId + actorId (2 FK)</text>';
for(const [name,x,y,lines]of cards){const h=64+lines.length*28;svg+=`<rect x="${x}" y="${y}" width="360" height="${h}" rx="10" fill="white" stroke="#275d69" stroke-width="2"/><rect x="${x}" y="${y}" width="360" height="46" rx="10" fill="#275d69"/><text x="${x+14}" y="${y+30}" fill="white" font-size="22">${name}</text>`;lines.forEach((l,i)=>svg+=`<text x="${x+14}" y="${y+75+i*28}" font-size="16">${escape(l)}</text>`);}
svg+='<text x="40" y="975" font-size="17">Historial no destructivo: CANCELLED, voidedAt y auditoría append-only (ADR-008).</text><text x="40" y="1001" font-size="15">Fuente editable: modelo_entidad_relacion.mmd · Flecha resume relación; no atribuye FK a AuditEvent.entityId.</text></g></svg>';
fs.writeFileSync('docs/evidence/avance2/diagramas/modelo_entidad_relacion.svg',svg);console.log('SVG documentation exported from schema model.');
