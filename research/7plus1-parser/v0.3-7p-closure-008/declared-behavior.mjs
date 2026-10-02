import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {id,uniq} from './identity.mjs';
const directory=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(directory,'../../..');
// Parse source, never import/execute it. Failure is explicit and cannot certify behavior.
export function inspectOwnedDeclaration(code,symbol){
 const run=spawnSync(path.join(root,'.boundx/nlp-venv/Scripts/python.exe'),['-X','utf8',path.join(directory,'static-evidence.py')],{input:JSON.stringify({code,symbol}),encoding:'utf8',windowsHide:true,timeout:10000,maxBuffer:2e6});
 if(run.status!==0)return{status:'UNSUPPORTED',reason:'STATIC_INSPECTOR_UNAVAILABLE',detail:run.error?.message??run.stderr,executed:false};
 try{return JSON.parse(run.stdout);}catch{return{status:'UNSUPPORTED',reason:'INVALID_STATIC_INSPECTOR_OUTPUT',executed:false};}
}
export function bindArguments(parameters,actuals){
 const result=[],used=new Set(),positionals=actuals.filter(a=>!a.keyword),named=actuals.filter(a=>a.keyword);let cursor=0;
 if(new Set(named.map(a=>a.keyword)).size!==named.length)return{status:'UNRESOLVED',reason:'DUPLICATE_KEYWORD_ARGUMENT',bindings:[]};
 if(parameters.some(p=>p.kind==='VAR_KEYWORD'))return{status:'UNRESOLVED',reason:'OPEN_KEYWORD_DOMAIN_UNSUPPORTED',bindings:[]};
 for(const formal of parameters){
  if(formal.kind==='VAR_POSITIONAL'){const items=positionals.slice(cursor);items.forEach(a=>used.add(a));cursor=positionals.length;result.push({formal,actuals:items,operator:'SEQUENCE',multiplicity:items.length});continue;}
  const keyword=named.find(a=>a.keyword===formal.name),positional=formal.kind!=='KEYWORD_ONLY'?positionals[cursor]:null;
  if(keyword&&formal.kind==='POSITIONAL_ONLY')return{status:'UNRESOLVED',reason:'POSITIONAL_ONLY_GIVEN_BY_KEYWORD',bindings:[]};
  if(keyword&&positional)return{status:'UNRESOLVED',reason:'FORMAL_GIVEN_TWICE',bindings:[]};
  const actual=keyword??positional;if(actual){if(!keyword)cursor++;used.add(actual);result.push({formal,actuals:[actual],operator:'ITEM',multiplicity:1});}
  else if(formal.default_range)result.push({formal,actuals:[],operator:'DECLARED_DEFAULT',multiplicity:0,default_range:formal.default_range});
  else return{status:'UNRESOLVED',reason:'REQUIRED_FORMAL_UNBOUND',formal_name:formal.name,bindings:[]};
 }
 if(cursor!==positionals.length||named.some(a=>!used.has(a)))return{status:'UNRESOLVED',reason:'ARITY_OR_UNKNOWN_KEYWORD',bindings:[]};
 return{status:'CERTIFIED',bindings:result};
}
export function closeDeclaredBehavior(f){
 const {node,span,relation,unknown,task}=f.tools,nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),frames=f.semantic_decoding.frame_certification,identity=f.semantic_decoding.cross_instruction_identity;
 const audit={version:'7P-CLOSURE-008',declarations:[],bindings:[],instantiations:[],executed:false};f.semantic_decoding.declared_behavior=audit;
 const set=body=>{const record={expr_id:id(f.source.sha256,'expr',body),...body};if(!f.expressions.set_expr_nodes.some(e=>e.expr_id===record.expr_id))f.expressions.set_expr_nodes.push(record);return record.expr_id;};
 function support(n,sourceIds){for(const sid of sourceIds){const cid=id(f.source.sha256,'owned-static-evidence',n.node_id,sid);if(!f.span_lattice.candidates.some(c=>c.span_candidate_id===cid))f.span_lattice.candidates.push({span_candidate_id:cid,source_span_id:sid,candidate_type:'DISCOURSE',status:'SELECTED',evidence_tier:'STRONG',provider_refs:['OWNED_STATIC_DECLARATION'],diagnostic_refs:[]});n.source_span_ids=uniq([...n.source_span_ids,sid]);n.span_candidate_ids=uniq([...n.span_candidate_ids,cid]);}}
 const sids=(codeSpan,range)=>range?[span(codeSpan.start+range[0],codeSpan.start+range[1])]:[];
 function edge(a,kind,head,tail,evidence,record){const r=relation(a.cl,kind,head,tail,evidence);if(!r)throw Error('STATIC_EVIDENCE_ILLEGAL_RELATION '+kind);r.evidence_span_ids=uniq([...r.evidence_span_ids,...evidence]);r.rule_refs=uniq([...r.rule_refs,'OWNED_STATIC_DECLARATION',record.record_id]);record.relation_ids.push(r.relation_id);return r;}
 for(const frame of frames.code_ownership.filter(r=>r.state==='CERTIFIED'&&r.frame_kind==='FUNCTION_DECLARATION')){
  const main=nm.get(frame.event_node_id),symbol=nm.get(frame.declared_symbol_node_id),a=f.analyses.find(a=>a.cl.id===main.metadata.clause_id),codeSpan=f.source_spans.find(s=>s.span_id===frame.code_span_id),inspected=inspectOwnedDeclaration(codeSpan.text,symbol.surface),record={record_id:id(f.source.sha256,'static-declaration',frame.frame_id),declaration_frame_id:frame.frame_id,symbol_node_id:symbol.node_id,code_span_id:frame.code_span_id,source_span_ids:[...frame.source_span_ids],structural_path:frame.structural_path,relation_ids:[],inspection:inspected,status:inspected.status,executed:false};audit.declarations.push(record);
  if(inspected.status!=='SIGNATURE_AVAILABLE')continue;
  record.formals=inspected.parameters.map(p=>{const start=codeSpan.start+p.range[0],pn=node(a.cl,'ENTITY',start,start+[...p.name].length,{sense:'DECLARATION_FORMAL',owner:frame.frame_id,discourse:{...a.discourse,kind:'CODE'},technical_type:'FORMAL_PARAMETER',formal_kind:p.kind,formal_identity:id(f.source.sha256,frame.frame_id,p.name),participant_eligibility:{eligible:false,reason:'DECLARATION_FORMAL'}});nm.set(pn.node_id,pn);return{...p,node_id:pn.node_id,source_span_ids:pn.source_span_ids};});
  record.source_span_ids=uniq([...record.source_span_ids,...record.formals.flatMap(p=>p.source_span_ids)]);
  for(const binding of identity.call_bindings.filter(b=>b.state==='CERTIFIED'&&b.declaration_frame_id===frame.frame_id)){
   const call=frames.call_sites.find(c=>c.frame_id===binding.call_frame_id),callMain=nm.get(call.event_node_id),callBehavior=nm.get(call.behavior_node_id),ca=f.analyses.find(a=>a.cl.id===callMain.metadata.clause_id),actuals=call.argument_node_ids.map(i=>({node_id:i,source_span_ids:nm.get(i).source_span_ids,expression:nm.get(i).metadata.argument_kind??nm.get(i).metadata.technical_type,keyword:nm.get(i).metadata.argument_keyword})),bound=bindArguments(record.formals,actuals),br={record_id:id(f.source.sha256,'formal-actual',frame.frame_id,call.frame_id),declaration_record_id:record.record_id,call_frame_id:call.frame_id,call_event_id:call.event_node_id,status:bound.status,reason:bound.reason,source_span_ids:uniq([...record.source_span_ids,...call.source_span_ids]),structural_paths:[frame.structural_path,call.structural_path],relation_ids:[],bindings:bound.bindings};audit.bindings.push(br);
   if(bound.status!=='CERTIFIED'){br.unresolved_ref=unknown(ca.cl,'UNRESOLVED_RELATION',bound.reason,[call.event_node_id,symbol.node_id]);callMain.metadata.declared_behavior_unresolved=br.unresolved_ref;continue;}
   callMain.metadata.formal_actual_binding=br;
   if(inspected.behavior.status!=='SUPPORTED'){br.behavior_status='UNSUPPORTED';br.behavior_reason=inspected.behavior.reason;continue;}
   const formal=br.bindings.find(b=>b.formal.name===inspected.behavior.formal_name);if(!formal||!formal.actuals.length){br.behavior_status='UNSUPPORTED';br.behavior_reason='EMPTY_OR_UNBOUND_DIRECTORY_DOMAIN';continue;}
   const shape=inspected.behavior,localEvidence=uniq([frame.code_span_id,...sids(codeSpan,shape.docstring_range),...sids(codeSpan,shape.iteration_range),...sids(codeSpan,shape.file_predicate_range),...sids(codeSpan,shape.yield_range),...formal.formal.source_span_ids]),members=[],instance={record_id:id(f.source.sha256,'instantiated-behavior',call.frame_id,record.record_id),status:'CERTIFIED',call_frame_id:call.frame_id,declaration_record_id:record.record_id,formal_actual_record_id:br.record_id,owning_call_event_id:callMain.node_id,member_node_id:identity.continuity.find(i=>i.call_frame_id===call.frame_id&&i.state==='CERTIFIED')?.member_node_id??call.owner_node_id,source_span_ids:uniq([...localEvidence,...call.source_span_ids]),structural_paths:br.structural_paths,relation_ids:[],collection_node_ids:[],scope_expr_ids:[],executed:false,meaning:'Declared file-basename enumeration instantiated over the explicit supplied directory arguments.'};
   for(const actual of formal.actuals){const actualNode=nm.get(actual.node_id),range=shape.member_range,collection=node(ca.cl,'ENTITY',codeSpan.start+range[0],codeSpan.start+range[1],{sense:'DECLARED_FILE_COLLECTION',owner:id(call.frame_id,actual.node_id),discourse:ca.discourse,technical_type:'SOURCE_MEMBER_COLLECTION',artifact_roles:['EXISTING_INPUT'],participant_eligibility:{eligible:false,reason:'STATIC_FILE_COLLECTION'},structural_ownership:{declaration_frame_id:frame.frame_id,call_frame_id:call.frame_id,argument_node_id:actual.node_id,structural_paths:br.structural_paths,source_span_ids:uniq([...localEvidence,...actual.source_span_ids])},collection:{member_kind:'FILE',name_projection:true,container_node_id:actual.node_id,formal_node_id:formal.formal.node_id,source_filter_span_ids:sids(codeSpan,shape.file_predicate_range),source_member_span_ids:sids(codeSpan,range),source_yield_span_ids:sids(codeSpan,shape.yield_range)}});nm.set(collection.node_id,collection);const r=edge(ca,'PATIENT',callBehavior,collection,instance.source_span_ids,instance);edge(ca,'CONJUNCTION',collection,actualNode,instance.source_span_ids,instance);const sr=edge(ca,'SCOPE_MEMBER',task,collection,instance.source_span_ids,instance),inputScope=set({kind:'ALL',base_entity_node_id:collection.node_id,source_span_ids:instance.source_span_ids,relation_ids:[sr.relation_id]});f.relation_scope_plans.set(sr.relation_id,inputScope);const scope=set({kind:'ALL',base_entity_node_id:collection.node_id,source_span_ids:instance.source_span_ids,relation_ids:[r.relation_id]});instance.collection_node_ids.push(collection.node_id);instance.scope_expr_ids.push(scope);members.push(collection);}
   instance.argument_sequence=actuals.map(a=>a.node_id);instance.formal_node_id=formal.formal.node_id;instance.collection_scope_expr_id=set({kind:'UNION',operand_expr_ids:instance.scope_expr_ids,source_span_ids:instance.source_span_ids,relation_ids:instance.relation_ids.filter(i=>f.relations.find(r=>r.relation_id===i)?.relation_type==='PATIENT')});
   for(const i of instance.collection_node_ids)support(nm.get(i),instance.source_span_ids);
   support(callMain,instance.source_span_ids);support(callBehavior,instance.source_span_ids);
   callBehavior.metadata.declared_behavior=instance;callMain.metadata.certified_behavior.declared_instantiation=instance;
   const composition=identity.compositions.find(c=>c.call_frame_id===call.frame_id);if(composition){const governor=nm.get(composition.governing_event_id);support(governor,instance.source_span_ids);governor.metadata.certified_behavior.declared_instantiations??=[];governor.metadata.certified_behavior.declared_instantiations.push(instance);}
   // Preserve the original directory-argument scope: it has different objects
   // from the instantiated file collection and must not be cross-bound.
   audit.instantiations.push(instance);br.behavior_status='CERTIFIED';
   f.relation_bundles.push({bundle_id:id(f.source.sha256,'static-instantiation',instance.record_id),clause_ids:[ca.cl.id],relation_ids:instance.relation_ids,bundle_state:'RESOLVED',unresolved_refs:[]});
  }
 }
 return f;
}
