import{id,uniq}from'./identity.mjs';
// An explicit shared test example is a content contract owned by the insertion
// instruction. Its concrete example call is never silently renamed for siblings.
export function closeOwnedTestContracts(f){
 const {span,node}=f.tools,points=[...f.source.raw_text],nm=new Map(f.semantic_nodes.map(n=>[n.node_id,n])),audit={version:'7P-CLOSURE-008',contracts:[],unresolved:[]};f.semantic_decoding.owned_test_contract=audit;
 const offset=(base,s,i)=>base+[...s.slice(0,i)].length;
 const support=(n,sid)=>{const cid=id(f.source.sha256,'test-contract-evidence',n.node_id,sid);if(!f.span_lattice.candidates.some(c=>c.span_candidate_id===cid))f.span_lattice.candidates.push({span_candidate_id:cid,source_span_id:sid,candidate_type:'DISCOURSE',status:'SELECTED',evidence_tier:'STRONG',provider_refs:['OWNED_TEST_CONTENT'],diagnostic_refs:[]});n.source_span_ids=uniq([...n.source_span_ids,sid]);n.span_candidate_ids=uniq([...n.span_candidate_ids,cid]);};
 for(const frame of f.semantic_decoding.frame_certification.test_insertions.filter(x=>x.state==='CERTIFIED')){
  const main=nm.get(frame.event_node_id),a=f.analyses.find(a=>a.cl.id===main.metadata.clause_id),code=f.source_spans.find(s=>s.span_id===frame.code_span_id),contract={contract_id:id(f.source.sha256,'owned-test-contract',frame.frame_id),owning_event_id:main.node_id,insertion_frame_id:frame.frame_id,file_node_ids:frame.file_node_ids,distribution:frame.distribution,source_span_ids:[...frame.source_span_ids],structural_path:frame.structural_path,state:'PARTIAL',scenario_components:[],naming_constraints:[],example_is_shared:true,example_entity_substitution:false};
  const clauses=[...code.text.matchAll(/#[^\r\n]*/gu)];
  for(const m of clauses){const s=offset(code.start,code.text,m.index),e=s+[...m[0]].length,ref=span(s,e),text=m[0].replace(/^#\s*/u,'');
   const expected=/(?:应该|应当|须|must|should)\s*(?:拿到|得到|返回|return|receive|produce)\s*(.+?)\s*(?:而不是|而非|rather than|not)\s*(.+?)\s*$/iu.exec(text),precondition=/^(?:预存入|预置|预先(?:创建|写入)|prepopulate|pre-create|seed)\s+(.+)$/iu.exec(text);
   const component={component_id:id(contract.contract_id,ref),source_span_ids:[ref],source_text:text,role:expected?'EXPECTED_AND_EXCLUDED_RESULT':precondition?'PRECONDITION':'UNINTERPRETED_TEST_COMMENT',interpreted:false};
   if(expected){component.interpreted=true;const expectedAt=m[0].indexOf(expected[1]),excludedAt=m[0].lastIndexOf(expected[2]),desired=node(a.cl,'ENTITY',offset(s,m[0],expectedAt),offset(s,m[0],expectedAt+expected[1].length),{sense:'TEST_EXPECTED_RESULT',owner:contract.contract_id,discourse:{...a.discourse,kind:'CODE'},participant_eligibility:{eligible:false,reason:'OWNED_TEST_ARGUMENT'}}),excluded=node(a.cl,'ENTITY',offset(s,m[0],excludedAt),offset(s,m[0],excludedAt+expected[2].length),{sense:'TEST_EXCLUDED_RESULT',owner:contract.contract_id,discourse:{...a.discourse,kind:'CODE'},participant_eligibility:{eligible:false,reason:'OWNED_TEST_ARGUMENT'}});component.expected_node_id=desired.node_id;component.excluded_node_id=excluded.node_id;component.polarity={expected:'POSITIVE',excluded:'NEGATIVE'};component.example_call_reference=text.slice(0,text.indexOf(expected[0])).trim();}
   if(precondition){component.interpreted=true;component.precondition_text=precondition[1];component.state='SOURCE_PRECONDITION';}
   contract.scenario_components.push(component);contract.source_span_ids.push(ref);
  }
  // Only a unique insertion under the exact same heading-owner may consume an
  // explicit test-name statement. Nearness or a matching file stem is irrelevant.
  const siblings=f.semantic_decoding.frame_certification.test_insertions.filter(x=>x.state==='CERTIFIED'&&nm.get(x.event_node_id).metadata.discourse?.owner_structure_id===a.discourse.owner_structure_id);
  const statements=f.discourse.annotations.filter(x=>x.owner_structure_id===a.discourse.owner_structure_id&&x.kind===a.discourse.kind&&/(?:测试(?:名字|名|名称)|test\s+names?)\s*(?:要|必须|must|shall|should)?\s*(?:明确)?\s*(?:包含|include|contain)/iu.test(x.source_span.quote));
  if(siblings.length===1)for(const statement of statements){const q=statement.source_span.quote,literals=[...q.matchAll(/`([^`\r\n]+)`/gu)];if(literals.length!==1){audit.unresolved.push({contract_id:contract.contract_id,reason:'TEST_NAMING_TARGET_NOT_UNIQUE',source_span_ids:[span(statement.source_span.start,statement.source_span.end)]});continue;}const m=literals[0],s=offset(statement.source_span.start,q,m.index+1),sid=span(s,s+[...m[1]].length);contract.naming_constraints.push({kind:'CONTAINS_SOURCE_LABEL',literal:m[1],source_span_ids:[sid,span(statement.source_span.start,statement.source_span.end)],source_structural_path:statement.structural_path});contract.source_span_ids.push(...contract.naming_constraints.at(-1).source_span_ids);}
  contract.source_span_ids=uniq(contract.source_span_ids);contract.state=contract.scenario_components.some(c=>c.role==='PRECONDITION')&&contract.scenario_components.some(c=>c.role==='EXPECTED_AND_EXCLUDED_RESULT')&&contract.naming_constraints.length?'STRUCTURALLY_ACCOUNTED':'PARTIAL';
  // Do not replace the original distribution, artifact role or scope. Preserve
  // the contract as owned components of the one real governing action/output.
  main.metadata.owned_test_contract=contract;for(const sid of contract.source_span_ids)support(main,sid);for(const file of frame.file_node_ids){const n=nm.get(file);n.metadata.owned_test_contract_ids=uniq([...(n.metadata.owned_test_contract_ids??[]),contract.contract_id]);}
  audit.contracts.push(contract);
 }
 return f;
}
