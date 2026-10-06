import fs from 'node:fs';import path from 'node:path';
import {modelRequest} from '../p0-semantic-repair-r02/linguistic.mjs';
import {POLICY} from '../p0-semantic-repair-v0.1/normalization.mjs';
import {validateDirectory} from '../../../src/product/packages.mjs';
import {assembleEffectiveSemanticLibrary} from '../../../src/product/effective-semantic-library.mjs';
import {conceptCatalog} from '../../../src/product/trace-semantic-grounding.mjs';
import {hash} from '../p0-semantic-repair-r02/source.mjs';
import {nliPropositions} from './nli-propositions.mjs';
import {id} from '../v0.3-7p-composition-014/identity.mjs';
import {normalizationCandidates} from './normalization-evidence.mjs';
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
 const validatedTypes=new Set(['AGENT','PATIENT','THEME','RESULT','RECIPIENT','FORBIDS','RESTRICTS','LIMIT']),claims=[];
 for(const r of f.candidate_semantic_graph.candidate_relations){if(!validatedTypes.has(r.relation_type))continue;
  for(const proposition of nliPropositions(f,r)){const candidate_hypothesis_id=id(r.candidate_relation_id,'NLI',proposition.condition_expr_id??null,proposition.scope_refs??[],proposition.argument_binding??null);proposition.candidate_hypothesis_id=candidate_hypothesis_id;report.relation_validation.push(proposition);
   if(proposition.status!=='SUPPORTED_HYPOTHESIS_STRUCTURE'){report.diagnostics.push({code:proposition.status,relation_id:r.relation_id,candidate_hypothesis_id,fallback:'PRESERVE_TYPED_UNRESOLVED; DO_NOT_FLATTEN_HYPOTHESIS'});continue;}
   claims.push({id:candidate_hypothesis_id,premise:proposition.premise,hypothesis:proposition.hypothesis});
  }
 }
 report.normalization_candidates=normalizationCandidates(f,concepts,report.observations);
 const normalizationClaims=report.normalization_candidates.filter(c=>c.candidate_state==='PROPOSED'&&c.hypothesis&&c.premise).map(c=>({id:c.candidate_id,premise:c.premise,hypothesis:c.hypothesis}));
 if(claims.length||normalizationClaims.length){const nli=await call('mdeberta-nli',{claims:[...claims,...normalizationClaims]});for(const x of report.relation_validation)x.nli=nli?.predictions.find(p=>p.claim_id===x.candidate_hypothesis_id)??null;for(const x of report.normalization_candidates)x.nli=nli?.predictions.find(p=>p.claim_id===x.candidate_id)??null;}
 return report;
}
