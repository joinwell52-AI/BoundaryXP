export function checks(x,r){
 const c=r.compiler_v03,audit=c.nlp_signals.semantic_decoding.semantic_ownership,ns=c.semantic_nodes,facts=c.boundary_ir.facts,sp=new Map(r.source_spans.map(s=>[s.span_id,s])),events=ns.filter(n=>n.node_type==='EVENT'),owners=audit.records;
 const q=(n,s)=>n.surface===s||sp.get(n.source_span_ids[0])?.text===s;
 const targets=events.filter(n=>q(n,x.predicate)),records=owners.filter(o=>targets.some(n=>n.node_id===o.node_id));
 const emitted=n=>facts.some(f=>f.predicate_node_id===n.node_id&&!f.fact_type.startsWith('AUX'));
 const out=[];const add=(check,pass,evidence)=>out.push({check,pass:!!pass,evidence});
 add('shared-owner-consumed',audit?.consumed_by.includes('ELIGIBILITY')&&audit.decisions.length>0,audit?.decisions.length);
 add('all-nodes-accounted',owners.length===ns.length&&owners.every(o=>o.status==='AMBIGUOUS'||o.semantic_owner_id),owners.length);
 add('all-owner-provenance-exact',owners.every(o=>o.source_span_ids.length&&o.source_span_ids.every(i=>{const s=sp.get(i);return s&&[...x.text].slice(s.start,s.end).join('')===s.text;})),null);
 switch(x.expected_mechanism_contract){
 case 'CURRENT_TASK_SUBTASK':add('nested-task-inherited-positive',records.length&&records.every(o=>o.owner_category==='CURRENT_TASK_SUBTASK')&&targets.some(emitted),records);break;
 case 'BACKGROUND':{const b=owners.filter(o=>o.owner_category==='BACKGROUND');add('background-not-current-execution',b.length&&!facts.some(f=>!f.fact_type.startsWith('AUX')&&b.some(o=>o.node_id===f.predicate_node_id)),b);break;}
 case 'PARENTHETICAL':add('explanation-not-outer-prohibition',records.length&&records.every(o=>o.predicate_layer==='PARENTHETICAL')&&targets.every(n=>!emitted(n)),records);add('outer-prohibition-retained',facts.some(f=>f.fact_type==='FORBID'&&f.state==='RESOLVED'&&q(ns.find(n=>n.node_id===f.predicate_node_id),'删除')),facts.filter(f=>f.fact_type==='FORBID'));break;
 case 'OUTPUT_CONTENT':add('owned-local-modal-retained',records.length&&records.every(o=>o.owner_category==='OUTPUT_CONTENT'&&o.owner_output_ids.length&&o.ownership_relation_ids.length)&&targets.every(n=>!emitted(n)),records);if(x.mechanism==='multilingual sibling owners')add('sibling-set-preserved',records.some(o=>o.owner_output_ids.length===2),records);break;
 case 'ACCEPTANCE':add('acceptance-not-current-execution',records.length&&records.every(o=>o.owner_category==='ACCEPTANCE')&&targets.every(n=>!emitted(n)),records);break;
 case 'CODE':{const code=owners.filter(o=>o.predicate_layer==='CODE');add('code-source-remains-evidence',code.length&&!events.some(n=>code.some(o=>o.node_id===n.node_id)&&emitted(n)),code);if(x.mechanism==='owned code declaration')add('explicit-prose-declaration-retained',facts.some(f=>f.fact_type==='DELIVERABLE'&&f.state==='RESOLVED'&&f.object_node_ids.some(i=>q(ns.find(n=>n.node_id===i),'summarize'))),facts.filter(f=>f.fact_type==='DELIVERABLE'));break;}
 case 'DISTINCT_OWNER_IDENTITIES':add('same-surface-owner-distinction',records.length>=2&&new Set(records.map(o=>o.semantic_owner_id)).size>=2&&targets.filter(emitted).length===1,records);break;
 case 'CONDITION_BRANCH_LOCAL':{const ef=targets.map(n=>facts.find(f=>f.fact_type==='ACTION'&&f.predicate_node_id===n.node_id));add('condition-not-carried-to-sibling',ef.length===2&&ef[0]?.condition_expr_id&&!ef[1]?.condition_expr_id,ef);break;}
 default:add('stage-not-R1',false,x.stage);
 }
 return out;
}
