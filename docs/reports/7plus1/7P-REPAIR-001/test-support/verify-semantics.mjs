// Evaluation fixtures are intentionally separate from runtime implementation.
export function assertions(r,id,text){
 const c=r.compiler_v03,ir=c.boundary_ir,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),checks=[];
 const check=(name,ok,detail)=>checks.push({name,pass:!!ok,...(detail?{detail}: {})});
 const negative=['T07','T08'].includes(id);
 check('contract_gates',r.contract_gate_results.status==='PASS');
 if(!negative){check('positive_no_unresolved',c.unresolved.length===0,c.unresolved);check('no_coverage_failure',Object.values(c.canonical_7plus1).filter(s=>s.slot).every(s=>s.status!=='PARSER_COVERAGE_FAILURE'));}
 if(id==='T07'){const refs=c.semantic_nodes.filter(n=>n.node_type==='UNKNOWN_REFERENT');check('ambiguous_set_abstains',refs.some(n=>n.state==='UNRESOLVED'&&n.metadata.resolution?.candidate_node_ids.length===3&&n.metadata.resolution.selected_node_ids.length===0));return checks;}
 if(id==='T08'){check('ambiguous_retry_abstains',c.unresolved.some(u=>u.kind==='UNRESOLVED_QUANTIFICATION'));check('no_false_quantity_resolution',c.canonical_7plus1.R.entries.every(e=>e.state!=='RESOLVED'));return checks;}
 const actions={T01:['月末','读取','一致性检查','生成','提交'],T02:['季度','读取','一致性检查','抽样复检','生成','发送'],T03:['季度','读取','价格核对','资质复核'],T04:['核验','检查','身份核验','签署状态确认'],T05:['validate','read','schema validation','smoke testing','create','send'],T06:['归档前核验','读取','一致性检查','扫描'],T09:['检查','生成','通知'],T10:['导出','保存']}[id];
 for(const word of actions)check('action_'+word,c.canonical_7plus1.A.entries.some(e=>e.state==='RESOLVED'&&e.display_value.includes(word)));
 if(['T01','T02','T03','T04','T05','T06'].includes(id)){
  const count={T01:2,T02:3,T03:2,T04:3,T05:2,T06:3}[id];
  check('set_cardinality',c.semantic_nodes.some(n=>n.node_type==='UNKNOWN_REFERENT'&&n.state==='RESOLVED'&&n.metadata.resolution?.selected_node_ids.length===count));
  const inputFiles=c.canonical_7plus1.I.entries.filter(e=>/\.(?:csv|xlsx|pdf|docx|parquet|json|yaml|md)\b/iu.test(e.display_value));check('input_file_coverage',inputFiles.length>=count);
  check('conditional_deliverable',c.canonical_7plus1.O.entries.some(e=>e.state==='RESOLVED'&&e.condition_expr_id));
  check('participant_identity_unique',c.canonical_7plus1.P.entries.filter(e=>e.display_value.includes('PERFORMER')).length===1);
  check('recipient_role',c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('RECIPIENT')));
  check('approver_role',c.canonical_7plus1.P.entries.some(e=>e.display_value.includes('APPROVER')));
  const upper={T01:5,T02:6,T03:2,T04:1,T05:3,T06:4}[id];check('resource_upper_bound',c.canonical_7plus1.R.entries.some(e=>ir.quantity_expr_nodes.find(q=>q.expr_id===e.quantity_expr_id)?.upper_bound?.value===upper));
  check('completion_AND',c.canonical_7plus1.C.entries.some(e=>ir.condition_expr_nodes.find(q=>q.expr_id===e.condition_expr_id)?.op==='AND'));
  if(id!=='T04'){const lower={T01:3,T02:2,T03:4,T05:2,T06:2}[id];check('completion_quantity_not_R',ir.quantity_expr_nodes.some(q=>q.lower_bound?.value===lower&&q.target_node_ids.every(n=>nm.get(n)?.node_type==='STATE'))&&c.canonical_7plus1.R.entries.every(e=>!ir.quantity_expr_nodes.find(q=>q.expr_id===e.quantity_expr_id)?.lower_bound));}
  check('forbidden_coverage',c.canonical_7plus1.B.entries.filter(e=>e.state==='RESOLVED').length>=(id==='T04'?2:3));
  check('NOT_REQUIRED_preserved',c.semantic_nodes.some(n=>n.metadata.modality==='NOT_REQUIRED'));
  check('NOT_REQUIRED_not_B',ir.facts.filter(f=>f.fact_type==='FORBID').every(f=>nm.get(f.predicate_node_id)?.metadata.modality!=='NOT_REQUIRED'));
 }
 if(['T02','T04','T05','T06'].includes(id))check('sequence_forward',c.relations.some(r=>r.relation_type==='SEQUENCE'&&r.state==='RESOLVED'&&c.source.raw_text.indexOf(nm.get(r.head_node_id)?.surface.trim())<c.source.raw_text.indexOf(nm.get(r.tail_node_id)?.surface.trim())));
 if(id==='T09'){check('output_OR',c.canonical_7plus1.O.entries.some(e=>ir.condition_expr_nodes.find(q=>q.expr_id===e.condition_expr_id)?.op==='OR'));check('completion_AND',c.canonical_7plus1.C.entries.some(e=>ir.condition_expr_nodes.find(q=>q.expr_id===e.condition_expr_id)?.op==='AND'));check('percent_not_resource',c.canonical_7plus1.R.entries.length===0);check('conditional_forbid',c.canonical_7plus1.B.entries.some(e=>e.state==='RESOLVED'&&e.condition_expr_id));}
 if(id==='T10'){check('permissions_preserved',ir.facts.filter(f=>f.fact_type==='ACTION').every(f=>nm.get(f.predicate_node_id)?.metadata.modality==='PERMITTED'));check('NOT_REQUIRED_preserved',c.semantic_nodes.some(n=>n.metadata.modality==='NOT_REQUIRED'));check('forbid_only_upload',c.canonical_7plus1.B.entries.length===1);}
 check('no_duplicate_display',c.canonical_7plus1.A.entries.concat(c.canonical_7plus1.B.entries).every(e=>!/(\S{4,})\s+\1/u.test(e.display_value)));
 return checks;
}
