import fs from 'node:fs';import path from 'node:path';import {OUT,read,write,sha,walk} from './audit-tools.mjs';

// Offline audit only; never imported by the runtime. First outputs must be sealed first.
const suffix=process.argv[3]?'-'+process.argv[3]:'';
const stageOrder=['STRUCTURE','NLP_SIGNAL','SPAN_LATTICE','SEMANTIC_NODE','CANDIDATE_GENERATION','CANDIDATE_EXPRESSION','EVIDENCE_ATTACHMENT','GAMMA_CERTIFICATION','ELIGIBILITY','BOUNDARY_IR','PROJECTION','PROOF','COVERAGE'];
function firstStage(c,item){const g=c.candidate_semantic_graph,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),target=item.object??item.value??item.target??item.participant;
 if(target&&typeof target==='string'){
  const norm=s=>String(s).replace(/\s|[“”`"']/gu,'').toLowerCase(),nodes=g.semantic_nodes.filter(n=>norm(n.surface).includes(norm(target)));
  if(!nodes.length)return 'SEMANTIC_NODE';
  const rs=g.candidate_relations.filter(r=>nodes.some(n=>[r.head_node_id,r.tail_node_id].includes(n.node_id)));
  if(!rs.length)return 'CANDIDATE_GENERATION';
  if(rs.some(r=>c.gamma_certification.decisions.find(d=>d.candidate_relation_id===r.candidate_relation_id)?.decision!=='CERTIFIED'))return 'GAMMA_CERTIFICATION';
 }
 return 'CANDIDATE_GENERATION';
}
export function offlineInventory(r){const c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),sm=new Map(r.source_spans.map(s=>[s.span_id,s]));return {source:r.compiler_v03.source.raw_text,slots:c.canonical_7plus1,unresolved:c.unresolved,facts:c.boundary_ir.facts.map(f=>({...f,predicate:nm.get(f.predicate_node_id)?.surface,sense:nm.get(f.predicate_node_id)?.metadata.sense,modality:nm.get(f.predicate_node_id)?.metadata.modality,subjects:f.subject_node_ids.map(i=>nm.get(i)?.surface),objects:f.object_node_ids.map(i=>nm.get(i)?.surface),participants:f.participant_node_ids.map(i=>({surface:nm.get(i)?.surface,roles:nm.get(i)?.metadata.participant_roles})),source_spans:f.source_span_ids.map(i=>sm.get(i)),scope:c.boundary_ir.set_expr_nodes.find(e=>e.expr_id===f.scope_expr_id),condition:c.boundary_ir.condition_expr_nodes.find(e=>e.expr_id===f.condition_expr_id),quantity:c.boundary_ir.quantity_expr_nodes.find(e=>e.expr_id===f.quantity_expr_id)}))};}
if(process.argv[2]==='seal-first'){
 const first=read(OUT+'/ADMIN-FIRST-OUTPUTS'+suffix+'.json'),files=walk(OUT+'/replay'+suffix).map(p=>({path:p,sha256:sha(fs.readFileSync(p))}));write('FIRST-OUTPUT-SEAL'+suffix+'.json',{sealed_at:new Date().toISOString(),candidate_hash:first.candidate_hash,total:first.total,files,semantic_answers_not_used_to_change_implementation:true});
}else if(process.argv[2]==='inventory'){
 if(!fs.existsSync(OUT+'/FIRST-OUTPUT-SEAL'+suffix+'.json'))throw Error('FIRST_OUTPUTS_NOT_SEALED');
 const first=read(OUT+'/ADMIN-FIRST-OUTPUTS'+suffix+'.json'),rows=[];
 for(const row of first.rows){if(row.execution_status!=='OUTPUT_SAVED'){rows.push({...row,semantic_status:'NO_FINAL_OUTPUT',first_divergence:'CANDIDATE_EXPRESSION',reason:'Scope-consistency assertion blocks Boundary IR: actual first error retained. Upstream diagnostic replay must verify earliest stage.'});continue;}
  const r=read(OUT+'/'+row.trace),inv=offlineInventory(r);write('review-inventory'+suffix+'/'+row.corpus+'/'+row.id+'.json',inv);
  rows.push({...row,semantic_status:'REQUIRES_SOURCE_REVIEW',review_inventory:'review-inventory'+suffix+'/'+row.corpus+'/'+row.id+'.json',resolved_entries:Object.values(inv.slots).filter(x=>x?.entries).reduce((a,s)=>a+s.entries.filter(e=>e.state==='RESOLVED').length,0)});
 }
 write('REVIEW-INVENTORY'+suffix+'.json',{rows,scope:'Full fact/scope/condition/quantity/source inventory, not an automatic semantic accuracy certificate'});
}
