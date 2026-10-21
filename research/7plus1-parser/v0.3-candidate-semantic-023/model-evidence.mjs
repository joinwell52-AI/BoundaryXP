import fs from 'node:fs';import path from 'node:path';
import {modelRequest} from '../p0-semantic-repair-r02/linguistic.mjs';
import {POLICY} from '../p0-semantic-repair-v0.1/normalization.mjs';
import {validateDirectory} from '../../../src/product/packages.mjs';
import {assembleEffectiveSemanticLibrary} from '../../../src/product/effective-semantic-library.mjs';
import {conceptCatalog} from '../../../src/product/trace-semantic-grounding.mjs';
import {hash} from '../p0-semantic-repair-r02/source.mjs';
let cached;
function catalog(){if(cached)return cached;const l1=validateDirectory('D:/boundx/domain-packs/l1/core-ontology'),l2=validateDirectory('D:/boundx/domain-packs/l2/software-ai/0.2.0',[l1]);return cached={packs:[l1,l2].map(p=>({name:p.descriptor.name,version:p.descriptor.version,digest:p.digest})),concepts:conceptCatalog(assembleEffectiveSemanticLibrary({l1,l2:[l2]}),[l1,l2]).filter(c=>['actions','ontology_operation'].includes(c.entry.kind))};}
export async function candidateModelEvidence(f){
 const {packs,concepts}=catalog(),report={policy:POLICY,packs,models:[],observations:[],relation_validation:[],diagnostics:[],LLM:'NOT_USED',mdeberta_v3_base_main_path:false};
 const events=f.semantic_nodes.filter(n=>n.node_type==='EVENT'&&f.candidate_semantic_graph.candidate_relations.some(r=>r.head_node_id===n.node_id));
 const sm=new Map(f.source_spans.map(s=>[s.span_id,s])),nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n]));
 async function call(resource,input){try{const out=await modelRequest({resource,...input});report.models.push({resource,path:out.path,actually_loaded:true,input,output:out,manifest_sha256:hash(fs.readFileSync(path.join(out.path,'MANIFEST.json'))),role:'CANDIDATE_EVIDENCE_ONLY',direct_certifications:0});return out;}catch(e){report.diagnostics.push({resource,code:'MODEL_EVIDENCE_UNAVAILABLE',message:e.message,fallback:'NO_MODEL_EVIDENCE; Gamma still requires source syntax/types'});return null;}}
 if(!events.length)return report;
 const queries=events.map(n=>({id:n.node_id,text:n.source_span_ids.map(i=>sm.get(i)?.text).filter(Boolean).join('\n')})),candidates=concepts.map(x=>({id:x.candidate_id,text:x.entry.retrieval_text||x.aliases.join(' / ')}));
 const bge=await call('bge-m3',{queries,candidates}),secondary=queries.filter(q=>bge?.retrieval.some(x=>x.query_id===q.id)),e5=secondary.length?await call('multilingual-e5-large',{queries:secondary,candidates}):null;
 for(const n of events)report.observations.push({node_id:n.node_id,bge:bge?.retrieval.find(x=>x.query_id===n.node_id)?.candidates??[],e5:e5?.retrieval.find(x=>x.query_id===n.node_id)?.candidates??[],status:'CANDIDATE_RANKING_ONLY'});
 const role={AGENT:'执行者 / performer',PATIENT:'作用对象 / target',RESULT:'产物 / result',RECIPIENT:'接收者 / recipient',FORBIDS:'被禁止操作的对象 / forbidden target',LIMIT:'数量限制 / quantitative limit'},claims=[];
 for(const r of f.candidate_semantic_graph.candidate_relations){if(!role[r.relation_type])continue;const h=nm.get(r.head_node_id),t=nm.get(r.tail_node_id),a=f.analyses.find(a=>a.cl.id===r.clause_id);if(!a)continue;
  const cond=f.expression_plans.get(h.node_id)?.condition_expr_id,antecedent=cond?f.expressions.condition_expr_nodes.find(e=>e.expr_id===cond)?.source_span_ids.map(i=>sm.get(i)?.text).filter(Boolean).join(' / '):null;
  const consequent='“'+h.surface.trim()+'”的'+role[r.relation_type]+'是“'+t.surface.trim()+'”；动作模态 '+(h.metadata.modality??'SOURCE_STATE');
  const hypothesis=(antecedent?'如果 '+antecedent+'，那么 ':'')+consequent,premise=[...new Set(r.evidence_span_ids.map(i=>sm.get(i)?.text).filter(Boolean))].join('\n');
  claims.push({id:r.relation_id,premise,hypothesis});report.relation_validation.push({relation_id:r.relation_id,hypothesis,premise,antecedent,consequent,polarity:h.metadata.modality==='FORBIDDEN'?'NEGATIVE':'POSITIVE',modality:h.metadata.modality??null,scope_refs:[f.expression_plans.get(h.node_id)?.scope_expr_id].filter(Boolean),template:'CANDIDATE_ROLE_MODAL_CONDITIONAL_V1',source_span_ids:r.evidence_span_ids});
 }
 if(claims.length){const nli=await call('mdeberta-nli',{claims});for(const x of report.relation_validation)x.nli=nli?.predictions.find(p=>p.claim_id===x.relation_id)??null;}
 return report;
}
