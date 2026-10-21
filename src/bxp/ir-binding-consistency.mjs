// Structural transport assertions. These never infer what the source meant.
export function checkIRBindings(ir){
 const rows=[],events=new Map((ir.facts??[]).filter(f=>f.kind==='EVENT'&&f.status==='ACCEPTED').map(f=>[f.event.id,f.event]));
 for(const f of ir.facts??[]){if(f.status!=='ACCEPTED'||f.kind!=='ROLE')continue;
  rows.push({id:f.id,pass:!!f.claim&&f.claim.event_id===f.event?.id&&f.claim.entity_id===f.entity?.id&&events.has(f.event?.id),rule:'ROLE_EVENT_ENTITY_BINDING',sources:f.sources});
 }
 for(const r of ir.artifact_dependencies??[]){if(r.status!=='ACCEPTED')continue;
  const producer=(ir.facts??[]).find(f=>f.kind==='ROLE'&&f.status==='ACCEPTED'&&f.claim.event_id===r.producer_event_id&&f.claim.entity_id===r.artifact_id&&f.claim.role==='RESULT');
  const consumer=(ir.facts??[]).find(f=>f.kind==='ROLE'&&f.status==='ACCEPTED'&&f.claim.event_id===r.consumer_event_id&&f.claim.entity_id===r.artifact_id&&['OBJECT','INPUT_OBJECT','DELIVERABLE'].includes(f.claim.role));
  rows.push({id:r.id,pass:!!producer&&!!consumer,rule:'CURRENT_RESULT_USE_IDENTITY_BINDING',sources:r.sources});
 }
 return {valid:rows.every(x=>x.pass),checks:rows};
}
