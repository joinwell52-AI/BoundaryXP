import {uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {expressionCandidate as expr} from './expression-api.mjs';
const quantifier=t=>/^(全部|所有|任何|每|每个|每项|all|any|every)$/iu.test(t.text);
// Propose every local state/argument reading; outer-layer ownership and
// uniqueness are certified by Γ. No candidate is retired or chosen here.
export function stateArgumentCandidates(f){
 f.proposals.provider='LOCAL_STATE_ARGUMENT_CANDIDATES';
 const ledger=f.semantic_decoding.state_argument_candidates=[],nm=i=>f.semantic_nodes.find(n=>n.node_id===i),sp=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 for(const use of [...f.relations].filter(r=>r.relation_type==='PATIENT'&&['confirm','review'].includes(nm(r.head_node_id)?.metadata.sense))){
  const a=f.analyses.find(a=>a.cl.id===use.clause_id),argument=nm(use.tail_node_id),s=sp(argument),ts=a.cl.tokens;
  if(!ts.some(t=>t.start>=s.start&&t.end<=s.end&&/^(VV|VERB)$/u.test(t.pos??'')))continue;
  const st=f.tools.node(a.cl,'STATE',s.start,s.end,{sense:'ATTESTED_PROPOSITION_CONTENT',owner:use.head_node_id,syntactic_layer:'PROPOSITION_COMPLEMENT',source_span_ids:argument.source_span_ids}),r=f.tools.relation(a.cl,'CONJUNCTION',nm(use.head_node_id),st,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:'EXPLICIT_ATTESTED_PROPOSITION_ARGUMENT',source_span_ids:[a.sid,...argument.source_span_ids],dependency_relation_ids:[use.relation_id]});r.dependency_relation_ids=[use.relation_id];
 }
 for(const st of [...f.semantic_nodes].filter(n=>n.node_type==='STATE'&&['EXPLICIT_CONDITION_STATE','ATTESTED_PROPOSITION_CONTENT','PROCEDURAL_PREREQUISITE_STATE','REQUIRED_PROPOSITION_STATE'].includes(n.metadata.sense))){
  const a=f.analyses.find(a=>a.cl.id===st.metadata.clause_id),s=sp(st),ts=a.cl.tokens,within=t=>t.start>=s.start&&t.end<=s.end;
  const options=[];
  for(const frame of a.cl.srl??[]){const p=frame.find(x=>x[1]==='PRED'),pt=ts[p?.[2]];if(!pt||!within(pt))continue;
   for(const role of frame.filter(x=>/^ARG[01]$/u.test(x[1]))){const part=ts.slice(role[2],role[3]);if(part.length&&part.every(within)&&part.some(t=>/^(NN|NR|NOUN|PROPN)$/u.test(t.pos??'')))options.push({pt,part,rule:'LOCAL_SRL_STATE_ARGUMENT',role:role[1]});}
  }
  for(const pt of ts.filter(t=>within(t)&&/^(VV|VERB|ADJ)$/u.test(t.pos??'')&&!/rcomp/u.test(t.dep??''))){
   for(const head of ts.filter(t=>within(t)&&t.head===ts.indexOf(pt)&&/^(nsubj|nsubjpass|nsubj:pass|dobj|obj)$/u.test(t.dep??'')&&/^(NN|NR|NOUN|PROPN)$/u.test(t.pos??''))){
    const ids=new Set([ts.indexOf(head)]);for(let prior=-1;prior!==ids.size;){prior=ids.size;ts.forEach((t,i)=>{if(within(t)&&ids.has(t.head)&&/^(compound(?::.*)?|amod|det|case|nmod:assmod|acl|conj|cc|dep)$/u.test(t.dep??''))ids.add(i);});}
    const part=ts.filter((t,i)=>ids.has(i));if(part.length)options.push({pt,part,rule:'LOCAL_DEPENDENCY_STATE_ARGUMENT',role:head.dep});
   }
  }
  for(const option of options){let part=option.part.slice().sort((x,y)=>x.start-y.start);const pt=option.pt;
   if(part.some(t=>t.id===pt.id)||part.some(t=>!within(t)))continue;
   const q=ts.find(t=>within(t)&&quantifier(t)&&t.end<=part[0].start&&part.some(n=>ts.indexOf(n)===t.head));if(q)part.unshift(q);
   const start=part[0].start,end=part.at(-1).end;if(end<=start)continue;
   const qm=part.find(quantifier),kind=qm?/^(任何|any)$/iu.test(qm.text)?'ANY':'ALL':null;
   const argument=f.tools.node(a.cl,'ENTITY',start,end,{sense:'STATE_ARGUMENT',owner:st.node_id,syntax_token_ids:part.map(t=>t.id),quantifier:kind}),r=f.tools.relation(a.cl,'CONJUNCTION',st,argument,[a.sid]);r.generic_evidence??=[];r.generic_evidence.push({rule:option.rule,predicate_token_id:pt.id,argument_role:option.role,token_ids:part.map(t=>t.id),source_span_ids:[a.sid,...st.source_span_ids,...argument.source_span_ids]});
   const qualifierTokens=part.filter(t=>/^(VV|VERB)$/u.test(t.pos??'')&&t.end<=pt.start),qualifiers=[],relationIds=[r.relation_id];
   for(const t of qualifierTokens){const n=f.tools.node(a.cl,'STATE',t.start,t.end,{sense:'LOCAL_ARGUMENT_QUALIFIER',owner:argument.node_id,token_id:t.id,syntactic_layer:'NOMINAL_QUALIFIER',predicate:t.text}),edge=f.tools.relation(a.cl,'CONJUNCTION',argument,n,[a.sid]);edge.generic_evidence??=[];edge.generic_evidence.push({rule:'LOCAL_STATE_NOMINAL_QUALIFIER',token_ids:[t.id,pt.id],source_span_ids:[a.sid]});relationIds.push(edge.relation_id);qualifiers.push(n);}
   const connector=part.find(t=>/^(或|或者|or|和|与|及|and)$/iu.test(t.text)),children=qualifiers.map(n=>expr(f,'condition_expr_nodes',{op:'STATE_REF',state_node_id:n.node_id,source_span_ids:[a.sid,...n.source_span_ids],relation_ids:relationIds}));
   const qualifierExpr=children.length===1?children[0]:children.length>1&&connector?expr(f,'condition_expr_nodes',{op:/或|or/iu.test(connector.text)?'OR':'AND',operand_expr_ids:children,source_span_ids:[a.sid],relation_ids:relationIds}):null;
   const scope=kind?expr(f,'set_expr_nodes',{kind,base_entity_node_id:argument.node_id,source_span_ids:[a.sid,...argument.source_span_ids],relation_ids:[r.relation_id]}):null;
   const body={state_node_id:st.node_id,argument_node_id:argument.node_id,predicate_token_id:pt.id,quantifier:kind,scope_expr_id:scope,qualifier_expr_id:qualifierExpr,qualifier_state_ids:qualifiers.map(n=>n.node_id),relation_ids:uniq(relationIds),source_span_ids:uniq([a.sid,...st.source_span_ids,...argument.source_span_ids]),rule:option.rule};if(!ledger.some(p=>p.state_node_id===body.state_node_id&&p.argument_node_id===body.argument_node_id&&p.predicate_token_id===body.predicate_token_id))ledger.push(body);
  }
  // Coverage is a source predicate over report/list references, not an
  // invented claim that the coverage test has succeeded.
  if(/覆盖|\bcover(?:s|age)?\b/iu.test(st.surface)){
   const qs=ts.filter(t=>within(t)&&quantifier(t));st.metadata.coverage_requirement_candidate={predicate:'COVER',quantifier:qs.length?'ALL':'UNSTATED',marker_token_ids:qs.map(t=>t.id),source_span_ids:st.source_span_ids,owning_state_node_id:st.node_id};
  }
 }
 return f;
}
