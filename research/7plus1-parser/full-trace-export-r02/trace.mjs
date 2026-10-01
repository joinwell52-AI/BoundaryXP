import {buildTrace as original,traceMarkdown as originalMarkdown,STEPS} from '../full-pipeline-trace-v0.1/trace.mjs';
export {STEPS};
export const ANNOTATION_TYPES=['TECHNICAL_LITERAL','ENTITY','PERSON','ROLE','PREDICATE','REFERENCE','VERSION','NUMBER','RESOURCE','NEGATION','MODALITY','CONDITION','DISCOURSE'];
const palette=['#dcecff','#e4e7eb','#ffe3d2','#e8ddff','#d6f0e2','#dcecff','#dcecff','#fff0cb','#fff0cb','#ffdce1','#ffdce1','#e1e4ff','#e1e4ff'];
export function buildTrace(result,metadata){return enrichTrace(original(result,metadata));}
// Executed once on save. These are debug labels for existing signals, not new semantic claims.
export function enrichTrace(trace){
 const t=structuredClone(trace),text=t.source.raw_text,chars=[...text],spans=[];
 const add=(s,type,row)=>{if(!s||!Number.isInteger(s.start)||!Number.isInteger(s.end)||s.start<0||s.end>chars.length||s.end<=s.start||chars.slice(s.start,s.end).join('')!==s.quote)return;spans.push({start:s.start,end:s.end,quote:s.quote,annotation_type:type,display_color:palette[ANNOTATION_TYPES.indexOf(type)],category:type,provider:row.data.provider??'NOT_RECORDED',source_signal_id:row.id});};
 for(const row of t.step2_nlp.items){const d=row.data,s=d.span??row.source_spans[0];
  if(row.type==='TYPED_LITERAL')add(s,({REFERENCE:'REFERENCE',VERSION:'VERSION',NUMBER:'NUMBER',DURATION:'RESOURCE',ROLE_PHRASE:'ROLE',LOCATION_PHRASE:'ENTITY'})[d.type]??'TECHNICAL_LITERAL',row);
  if(row.type==='NER')add(s,['PERSON','PER'].includes(d.label)?'PERSON':'ENTITY',row);
  if(row.type==='TOKEN'){
   if(/^(VV|VERB|VA)$/u.test(d.pos??''))add(s,'PREDICATE',row);
   if(/^(neg|advmod:neg)$/u.test(d.dep??''))add(s,'NEGATION',row);
   if(d.pos==='MD'||d.modality!=null)add(s,'MODALITY',row);
   if(d.condition===true)add(s,'CONDITION',row);
   if(/^(CS|SCONJ|CC|CCONJ)$/u.test(d.pos??''))add(s,'DISCOURSE',row);
  }
  row.display_fields={token_id:row.type==='TOKEN'?row.id:null,token:d.text??null,span:s??null,POS:d.pos??null,lemma:d.lemma??null,dependency:d.dep??null,head:d.head??null,NER:row.type==='NER'?d.label:null,typed_literal:row.type==='TYPED_LITERAL'?d.type:null,negation:d.negation??null,modality:d.modality??null,coordination:d.coordination??null,subordination:d.subordination??null,provider:d.provider??null,clause_id:d.clause_id??null};
 }
 t.annotated_source={raw_text:text,spans,coordinate_system:'UNICODE_CODEPOINT',supported_types:ANNOTATION_TYPES,missing_signal_policy:'No invented model output. Missing display fields are null. CONDITION needs an explicit condition signal; conjunction POS alone is DISCOURSE.'};
 t.graph={nodes:t.step3_semantic_nodes.items.map(n=>({node_id:n.id,label:n.data.surface??n.data.predicate?.surface??n.id,type:n.type,state:n.data.state??null,evidence_refs:n.source_spans})),edges:t.step4_semantic_relations.items.filter(r=>typeof r.data.from==='string'&&typeof r.data.to==='string').map(r=>({id:r.id,relation:r.type,from:r.data.from,to:r.data.to,state:r.data.state??null,evidence_refs:r.source_spans})),unlinked_relation_ids:t.step4_semantic_relations.items.filter(r=>typeof r.data.from!=='string'||typeof r.data.to!=='string').map(r=>r.id)};
 t.metadata.traceVersion='full-trace-export-r02';return t;
}
export function traceMarkdown(t){const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('|','&#124;').replaceAll('\n','<br>');return originalMarkdown(t)+'\n## Annotated Source Spans\n\n'+(t.annotated_source?'Span | Text | Type | Provider\n--- | --- | --- | ---\n'+t.annotated_source.spans.map(s=>`[${s.start},${s.end}) | [${s.annotation_type}: ${esc(s.quote)}] | ${s.annotation_type} | ${esc(s.provider)}`).join('\n'):'ANNOTATIONS_NOT_RECORDED — historical snapshot is not recomputed')+'\n\n## Graph\n\n'+JSON.stringify(t.graph??{status:'GRAPH_NOT_RECORDED'},null,2)+'\n';}
