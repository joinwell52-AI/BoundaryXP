// Identity associations and declared result-instance availability are different relations.
// No source text, predicate dictionary, filename heuristic or scheduler is used here.
import {sha256} from './source.mjs';
export const artifactRule='031-r1-artifact-flow-v1';
export function artifactRelations(g,checks){
 const items=new Map([...g.entities,...g.events,...g.claims].map(x=>[x.id,x])),rows=new Map(checks.rows.map(x=>[x.id,x]));
 const positive=e=>e?.use==='CURRENT_TASK'&&e.polarity==='POSITIVE'&&['REQUIRED','PERMITTED'].includes(e.modality);
 const sources=ids=>ids.flatMap(id=>rows.get(id)?.sources??[]);
 const inputsStatus=ids=>ids.some(id=>rows.get(id)?.status==='REJECTED')?'REJECTED':ids.some(id=>(rows.get(id)?.identity_status??rows.get(id)?.status)!=='ACCEPTED')?'UNRESOLVED':'ACCEPTED';
 const results=g.claims.filter(x=>x.kind==='ROLE'&&x.role==='RESULT');
 const uses=g.claims.filter(x=>x.kind==='ROLE'&&['OBJECT','INPUT_OBJECT','DELIVERABLE'].includes(x.role));
 const associations=results.flatMap(p=>uses.filter(u=>u.entity_id===p.entity_id&&u.event_id!==p.event_id).map(u=>{
  const refs=[p.id,u.id,p.entity_id,p.event_id,u.event_id];
  return {id:'ai:'+sha256(JSON.stringify([p.id,u.id])).slice(0,20),kind:'IDENTITY_ASSOCIATION',origin:'DERIVED',rule_version:artifactRule,artifact_id:p.entity_id,producer_event_id:p.event_id,consumer_event_id:u.event_id,producer_result_id:p.id,consumer_role_id:u.id,status:inputsStatus(refs),input_claim_ids:[p.id,u.id],sources:sources(refs),implies_availability:false,implies_event_order:false};
 }));
 const availability=g.claims.filter(x=>x.kind==='ARTIFACT_USE'&&x.artifact_use).map(c=>{
  const p=items.get(c.artifact_use.producer_result_id),u=items.get(c.artifact_use.consumer_role_id),producer=items.get(p?.event_id),consumer=items.get(u?.event_id);
  const refs=[c.id,p?.id,u?.id,c.entity_id,producer?.id,consumer?.id,...(producer?.constraint_ids??[]),...(consumer?.constraint_ids??[])].filter(Boolean);
  const eligible=p?.kind==='ROLE'&&p.role==='RESULT'&&u?.kind==='ROLE'&&p.entity_id===c.entity_id&&u.entity_id===c.entity_id&&u.event_id===c.event_id&&p.event_id!==c.event_id&&positive(producer)&&positive(consumer);
  return {id:'ad:'+sha256(JSON.stringify([c.id,p?.id,u?.id])).slice(0,20),kind:'ARTIFACT_AVAILABILITY',origin:'DERIVED',rule_version:artifactRule,artifact_id:c.entity_id,producer_event_id:producer?.id??null,consumer_event_id:consumer?.id??null,producer_result_id:p?.id??null,consumer_role_id:u?.id??null,binding_claim_id:c.id,availability:c.artifact_use.availability,status:eligible?inputsStatus(refs):'UNRESOLVED',eligible,input_claim_ids:[c.id,p?.id,u?.id].filter(Boolean),provenance_refs:refs,sources:sources(refs),producer_modality:producer?.modality??null,consumer_modality:consumer?.modality??null,producer_constraints:producer?.constraint_ids??[],consumer_constraints:consumer?.constraint_ids??[],implies_whole_producer_completed:false,implies_event_order:false,observed_available:'UNKNOWN'};
 });
 return {associations,availability};
}
export function evaluateArtifactAvailability(relation,observation){
 if(!relation.eligible||relation.status!=='ACCEPTED'||!observation||observation.artifact_id!==relation.artifact_id||observation.producer_event_id!==relation.producer_event_id)return 'UNKNOWN';
 const value=relation.availability==='COMPLETE_RESULT'?observation.complete_result_available:observation.used_portion_available;
 return typeof value==='boolean'?(value?'TRUE':'FALSE'):'UNKNOWN';
}
