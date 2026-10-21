import {OUT,read,save,sha} from './util.mjs';
const rows=[];
for(const id of ['F01','F02','F03','F04','F05']){
 const base=id==='F03'?'NROOT-001':'S03',input=read(`${OUT}/inputs/${base}/input.json`),g=input.graph,argument=g.candidate_relations.find(r=>r.relation_type==='PATIENT'),tail=g.semantic_nodes.find(n=>n.node_id===argument.tail_node_id),tokens=g.evidence.filter(e=>e.channel==='SYNTAX');
 const before=structuredClone(g);let feature;
 if(id==='F01'){argument.tail_node_id='ABSENT-ENDPOINT';feature='single tail node reference';}
 if(id==='F02'){g.source_spans.find(s=>s.span_id===tail.source_span_ids[0]).start++;feature='single source span offset';}
 if(id==='F03'){g.candidate_expressions.find(e=>e.expression_type==='condition_expr_nodes').relation_ids=[];feature='single condition expression dependency list';}
 if(id==='F04'){const s=g.source_spans.find(s=>s.span_id===tail.source_span_ids[0]);for(const e of tokens)for(const t of e.tokens)if(t.start===s.start&&t.end===s.end)t.head=-1;feature='object ownership head witness (duplicate evidence copies treated as one witness)';}
 if(id==='F05'){const alternate=structuredClone(argument);Object.assign(alternate,{relation_id:argument.relation_id+'-alternative',candidate_relation_id:argument.candidate_relation_id+'-alternative',relation_type:'THEME'});g.candidate_relations.push(alternate);g.candidate_relation_ids.push(alternate.candidate_relation_id);g.competition_groups.push({competition_group_id:'fault-explicit-role-competition',kind:'ARGUMENT_ROLE',candidate_ids:[argument.candidate_relation_id,alternate.candidate_relation_id],source_span_ids:argument.source_span_ids,claimed_unique_selected_candidate_id:argument.candidate_relation_id});feature='one additional compatible argument-role interpretation with an untrusted unique-selection claim';}
 const expectation=read(`${OUT}/INPUT-FREEZE.json`).faults.find(x=>x.id===id);
 save(`${OUT}/fault-inputs/${id}/input.json`,input);save(`${OUT}/fault-inputs/${id}/mutation.json`,{base,feature,before_graph_sha256:sha(Buffer.from(JSON.stringify(before))),after_graph_sha256:sha(Buffer.from(JSON.stringify(g))),expectation});rows.push({id,base,feature,input_sha256:sha(Buffer.from(JSON.stringify(input)))});
}
save(`${OUT}/FAULT-FREEZE.json`,{before_gamma_repair:true,rows});
