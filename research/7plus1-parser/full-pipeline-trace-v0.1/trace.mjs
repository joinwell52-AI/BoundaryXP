import {performance} from 'node:perf_hooks';
export const STEPS=['step1_structure','step2_nlp','step3_semantic_nodes','step4_semantic_relations','step5_boundary_eligibility','step6_boundary_ir','step7_canonical_7plus1'];
const spans=x=>{const found=[];function visit(v){if(!v||typeof v!=='object')return;if(typeof v.source_id==='string'&&Number.isInteger(v.start)&&Number.isInteger(v.end)&&typeof v.quote==='string')found.push(v);else for(const a of Object.values(v))visit(a);}visit(x);return [...new Map(found.map(s=>[s.source_id+':'+s.start+':'+s.end,s])).values()];};
const snapshot=(items,extra={})=>({status:'AVAILABLE',items,...extra});
const absent=reason=>({status:'NOT_IMPLEMENTED',items:[],reason});
const row=(id,type,data)=>({id,type,data,source_spans:spans(data)});
export function buildTrace(result,metadata){
 const start=performance.now(),r=result,clauses=r.signals?.clauses??[],nodes=r.gsg?.nodes??[],relations=r.gsg?.relations??[];
 const source=r.source,points=[...source.raw_text],covered=new Uint8Array(points.length);
 for(const n of r.structure?.nodes??[])for(let i=Math.max(0,n.source_span.start);i<Math.min(points.length,n.source_span.end);i++)covered[i]=1;
 const unaccounted=[];for(let i=0;i<covered.length;i++)if(!covered[i]){const a=i;while(i+1<covered.length&&!covered[i+1])i++;unaccounted.push({source_id:source.source_id,start:a,end:i+1,quote:points.slice(a,i+1).join('')});}
 const structure=[...(r.structure?.nodes??[]).map(n=>row(n.id,n.type,n)),...clauses.map((c,i)=>row(c.id,'CLAUSE',{...c,tokens:undefined,entities:undefined,srl:undefined,pos_alternatives:undefined,ordinal:i,parent_ids:(r.structure?.nodes??[]).filter(n=>n.source_span.start<=c.span.start&&n.source_span.end>=c.span.end).map(n=>n.id),parent_basis:'EXACT_SPAN_CONTAINMENT_DISPLAY_ONLY'}))];
 const nlp=clauses.flatMap(c=>[...c.tokens.map(t=>row(t.id,'TOKEN',{...t,provider:c.model,clause_id:c.id})),...(c.entities??[]).map((e,i)=>row(c.id+':ner:'+i,'NER',{...e,provider:'spaCy',clause_id:c.id})),row(c.id+':analysis','POS_SRL',{provider:c.model,pos_alternatives:c.pos_alternatives,srl:c.srl,clause_id:c.id,span:c.span})]);
 nlp.push(...(r.signals?.literals??[]).map(l=>row(l.id,'TYPED_LITERAL',{...l,provider:'TypedRecognizer'})));
 for(const [i,call] of (r.normalization?.models??[]).entries())nlp.push(row('model-call:'+i,'NORMALIZATION_SIGNAL',{...call,provider:call.resource,execution_phase:'AFTER_FRAME_CONSTRUCTION'}));
 const edges=relations.map((e,i)=>row('relation:'+i,e.type,e));
 for(const [collection,type] of [['coreference','COREFERENCE'],['coordination','CONJUNCTION'],['discourse','DISCOURSE']])for(const [i,e] of (r[collection]??[]).entries())edges.push(row(collection+':'+i,type,{...e,collection}));
 const diagnostics=(r.diagnostics??[]).map(d=>({...d,first_observed_stage:d.code==='UNSUPPORTED_TASK_ROLE'?'STEP3_NODE':/REFER|CONDITION/u.test(d.code??'')?'STEP4_RELATION':'STEP3_NODE',affected_clause:d.clause_ref??d.source_span??null,affected_relation:null,affected_slot:d.affected_slots??[],reason:d.reason??d.code,stage_basis:'buildFrames emission; first observation only, not root-cause claim'}));
 diagnostics.push(...(r.normalization?.diagnostics??[]).map(d=>({...d,first_observed_stage:'STEP2_NLP',affected_clause:null,affected_relation:null,affected_slot:[],reason:d.message??d.code,stage_basis:'Normalization signal producer (executes after frame assembly)'})));
 const canonical=Object.entries(r.slots).flatMap(([slot,s])=>s.entries.map(e=>row(e.id,slot,{...e,slot,slot_status:s.status})));
 const lineage=canonical.map(item=>{
  const e=item.data,frameIds=e.frame_refs??[],linked=edges.filter(x=>frameIds.includes(x.data.from)||frameIds.includes(x.data.to)),nodeIds=[...new Set([...frameIds,...linked.flatMap(x=>[x.data.from,x.data.to]).filter(Boolean)])].filter(id=>nodes.some(n=>n.id===id));
  const evidence=[...(e.evidence??[]),...nodes.filter(n=>nodeIds.includes(n.id)).flatMap(n=>n.evidence??[])],signalIds=[...new Set(evidence.flatMap(x=>x.linguistic_signal_refs??[]))].filter(id=>nlp.some(x=>x.id===id));
  const sourceSpans=spans(evidence),clauseIds=clauses.filter(c=>sourceSpans.some(s=>s.start<c.span.end&&s.end>c.span.start)).map(c=>c.id);
  const missing=['STEP5_TYPED_ELIGIBILITY','STEP6_BOUNDARY_IR'];if(!linked.length)missing.push('STEP4_RELATION');if(!nodeIds.length)missing.push('STEP3_NODE');if(!signalIds.length)missing.push('STEP2_NLP');if(!clauseIds.length)missing.push('STEP1_CLAUSE');
  const record={slotEntryId:e.id,boundaryFactIds:[],eligibilityIds:[],relationIds:linked.map(x=>x.id),nodeIds,nlpSignalIds:signalIds,clauseIds,sourceSpans,status:'LINEAGE_FAILURE',missing};
  diagnostics.push({code:'LINEAGE_FAILURE',first_observed_stage:missing.includes('STEP4_RELATION')?'STEP4_RELATION':'STEP5_ELIGIBILITY',affected_clause:clauseIds,affected_relation:record.relationIds,affected_slot:[item.type],reason:'Required intermediate contract is absent; no reverse-derived facts were created.',slot_entry_id:e.id,missing});return record;
 });
 const modelCalls=r.normalization?.models??[],noIndexInvocation=modelCalls.length===0&&r.signals?.metrics?.hanlp_ms!==undefined;
 const measuredIndex=noIndexInvocation||modelCalls.some(m=>typeof m.output?.index_warmup_ms==='number'),indexMs=measuredIndex?(modelCalls.reduce((n,m)=>n+(m.output?.index_warmup_ms??0),0)):null;
 const p=r.performance??{},unknown={hanlp_ms:'Existing worker exposes only combined NLP time',spacy_ms:'Existing worker exposes only combined NLP time',step3_ms:'Nodes and relations share buildFrames',step4_ms:'Nodes and relations share buildFrames',step5_ms:'Eligibility is not a separate stage',step6_ms:'Boundary IR not implemented',index_warmup_ms:'Existing worker does not separate index construction from query embedding'};
 return {metadata:{...metadata,parserVersion:r.parser_revision,sourceSha256:source.sha256,parserStatus:r.parser_status,traceVersion:'full-pipeline-trace-v0.1'},source,
  step1_structure:snapshot(structure,{source_codepoints:points.length,accounted_codepoints:covered.reduce((a,b)=>a+b,0),unaccounted_spans:unaccounted,accountability:r.structure?.accountability,coverage_basis:'Union of actual structural spans; not semantic coverage'}),
  step2_nlp:snapshot(nlp,{raw_signals:r.signals,normalization:r.normalization}),
  step3_semantic_nodes:snapshot(nodes.map(n=>row(n.id,n.type,n)),{frames:r.frames,original_types_preserved:true}),
  semantic_assembly_iterations:[],semantic_assembly_status:absent('No iterative solver/before-after events in frozen engine'),
  step4_semantic_relations:snapshot(edges),
  step5_boundary_eligibility:{...absent('No typed eligibility contract; aggregate projection observations are not per-fact eligibility decisions'),observations:r.decisions??[]},
  boundary_compilation_iterations:[],boundary_compilation_status:absent('No eligibility/IR feedback solver'),
  step6_boundary_ir:absent('Frozen engine projects frames directly; no independent Boundary Fact IR'),
  step7_canonical_7plus1:snapshot(canonical,{slots:r.slots}),lineage,diagnostics,
  performance:{total_ms:p.total_ms,step1_ms:p.structure_ms,step2_ms:p.nlp_ms,step3_ms:null,step4_ms:null,step3_step4_combined_ms:p.gsg_ms,step5_ms:null,step6_ms:null,step7_ms:p.projection_ms,hanlp_ms:r.signals?.metrics?.hanlp_ms??null,spacy_ms:r.signals?.metrics?.spacy_ms??null,bge_ms:p.bge_ms,e5_ms:p.e5_ms,nli_ms:p.nli_ms,model_load_count:p.model_load_count,index_warmup_ms:indexMs,parse_excluding_index_ms:indexMs===null?null:p.total_ms-indexMs,unmeasured:Object.fromEntries(Object.entries(unknown).filter(([k])=>!(k==='hanlp_ms'&&r.signals?.metrics?.hanlp_ms!==undefined)&&!(k==='spacy_ms'&&r.signals?.metrics?.spacy_ms!==undefined)&&!(k==='index_warmup_ms'&&measuredIndex))),raw:p,trace_assembly_ms:performance.now()-start}};
}
export function traceMarkdown(t){const fence=value=>{const text=typeof value==='string'?value:JSON.stringify(value,null,2);const longest=Math.max(2,...[...text.matchAll(/`+/gu)].map(m=>m[0].length));const f='`'.repeat(longest+1);return f+'\n'+text+'\n'+f;};
 const sections=[['Metadata',t.metadata],['Source',t.source.raw_text],['Step 1 — Structure',t.step1_structure],['Step 2 — NLP Signals',t.step2_nlp],['Step 3 — Semantic Nodes',t.step3_semantic_nodes],['Step 3↔4 — Semantic Assembly Iterations',{status:t.semantic_assembly_status,iterations:t.semantic_assembly_iterations}],['Step 4 — Semantic Relations',t.step4_semantic_relations],['Step 5 — Boundary Eligibility',t.step5_boundary_eligibility],['Step 5↔6 — Boundary Compilation Iterations',{status:t.boundary_compilation_status,iterations:t.boundary_compilation_iterations}],['Step 6 — Boundary IR',t.step6_boundary_ir],['Step 7 — Canonical 7+1',t.step7_canonical_7plus1],['Lineage',t.lineage],['Diagnostics',t.diagnostics],['Performance',t.performance]];
 return '# BoundX 7+1 Parser Full Trace\n\n'+sections.map(([title,data])=>'## '+title+'\n\n'+fence(data)).join('\n\n')+'\n';
}
