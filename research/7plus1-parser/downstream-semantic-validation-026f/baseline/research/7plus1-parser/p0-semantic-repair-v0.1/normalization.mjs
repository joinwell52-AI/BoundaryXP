import path from 'node:path';import fs from 'node:fs';import {fileURLToPath} from 'node:url';
import {modelRequest} from './linguistic.mjs';import {hash} from './source.mjs';
import {validateDirectory} from '../../../src/product/packages.mjs';import {assembleEffectiveSemanticLibrary} from '../../../src/product/effective-semantic-library.mjs';import {conceptCatalog} from '../../../src/product/trace-semantic-grounding.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');let library;
export const POLICY=Object.freeze({version:'p0-normalization-call-policy-v1',top_k:3,nli_entailment_min:.9,max_length:512,batch_size:4,models_create_facts:false,models_assign_slots:false,mdeberta_v3_base_main_path:false});
function catalog(){if(library)return library;const l1=validateDirectory(path.join(ROOT,'domain-packs/l1/core-ontology')),l2=validateDirectory(path.join(ROOT,'domain-packs/l2/software-ai/0.2.0'),[l1]);return library={packs:[l1,l2].map(p=>({name:p.descriptor.name,version:p.descriptor.version,digest:p.digest})),concepts:conceptCatalog(assembleEffectiveSemanticLibrary({l1,l2:[l2]}),[l1,l2]).filter(c=>['actions','ontology_operation'].includes(c.entry.kind))};}
export async function warmSemantic(){return Promise.all(['bge-m3','multilingual-e5-large','mdeberta-nli'].map(resource=>modelRequest({resource,warmup:true})));}
export async function normalize(semantic){
 const {packs,concepts}=catalog(),report={policy:POLICY,packs,observations:[],models:[],diagnostics:[],metrics:{bge_ms:0,e5_ms:0,nli_ms:0,bge_batches:0,e5_batches:0,nli_batches:0,nli_pairs:0,model_load_count:0}};
 const targets=semantic.frames.filter(f=>f.syntax_signal),unresolved=[];
 for(const f of targets){const exact=concepts.filter(c=>c.aliases.some(a=>a.toLowerCase()===f.predicate.surface.toLowerCase()));if(exact.length===1){f.predicate.normalized=exact[0].entry.id;report.observations.push({frame_id:f.id,status:'EXACT_PACK_ALIAS',concept_ref:exact[0].entry,evidence:f.evidence});}else unresolved.push(f);}
 if(!unresolved.length)return report;
 const candidates=concepts.map(c=>({id:c.candidate_id,text:c.entry.retrieval_text||c.aliases.join(' / ')})),queries=unresolved.map(f=>({id:f.id,text:f.evidence[0].source_span.quote}));
 async function call(resource,payload,label){try{const r=await modelRequest({resource,...payload});report.models.push({resource,path:r.path,loaded:true,input:payload,output:r,manifest_sha256:hash(fs.readFileSync(path.join(r.path,'MANIFEST.json')))});report.metrics[label+'_ms']+=r.ms;report.metrics[label+'_batches']+=r.batches;report.metrics.model_load_count+=r.model_load_count;return r;}catch(e){report.diagnostics.push({code:'NORMALIZATION_UNAVAILABLE',resource,message:e.message});return null;}}
 const bge=await call('bge-m3',{queries,candidates},'bge');
 // E5 is a cross-check only for unresolved targets for which primary retrieval exists.
 const secondary=queries.filter(q=>bge?.retrieval.some(r=>r.query_id===q.id&&r.candidates.length)),e5=secondary.length?await call('multilingual-e5-large',{queries:secondary,candidates},'e5'):null;
 const claims=[];
 for(const f of unresolved){const primary=bge?.retrieval.find(r=>r.query_id===f.id)?.candidates??[],cross=e5?.retrieval.find(r=>r.query_id===f.id)?.candidates??[],row={frame_id:f.id,status:'UNSUPPORTED_NORMALIZATION',source_span:f.predicate_span,bge:primary,e5:cross,candidates:[]};
  for(const p of primary){const c=concepts.find(c=>c.candidate_id===p.candidate_id);if(!c)continue;const alias=c.aliases.find(a=>/\p{Script=Han}/u.test(a))??c.aliases[0];const item={candidate_id:c.candidate_id,alias,concept_ref:c.entry,lexical_support:c.aliases.some(a=>a.toLowerCase()===f.predicate.surface.toLowerCase()),crosscheck:cross.some(x=>x.candidate_id===c.candidate_id)};row.candidates.push(item);
   if(item.crosscheck&&['FORBID','RESTRICT'].includes(f.modality)){const source=f.evidence[0].source_span,chars=[...source.quote],context=f.condition.flatMap(c=>c.members.map(m=>m.text)).join('\n'),premise=[context,source.quote].filter(Boolean).join('\n'),hypothesis=[context,chars.slice(0,f.predicate_span.start-source.start).join('')+alias+chars.slice(f.predicate_span.end-source.start).join('')].filter(Boolean).join('\n');item.claim_id=f.id+':'+c.candidate_id;claims.push({id:item.claim_id,premise,hypothesis,evidence:f.evidence});}
  }report.observations.push(row);
 }
 if(claims.length){report.metrics.nli_pairs=claims.length;const nli=await call('mdeberta-nli',{claims},'nli');for(const row of report.observations)for(const c of row.candidates??[])c.nli=nli?.predictions.find(p=>p.claim_id===c.claim_id)??null;}
 // Retrieval/entailment alone is never an equivalence proof. Unsupported labels keep the exact source predicate.
 return report;
}
