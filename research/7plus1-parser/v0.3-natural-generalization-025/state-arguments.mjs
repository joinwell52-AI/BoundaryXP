import {graphApi} from './migration/graph-api.mjs';
import {uniq} from '../v0.3-7p-composition-014/identity.mjs';

// State propositions retain their local SRL arguments independently of task
// actions. A quantified noun is an argument, not an inferred file identity.
export function stateArguments(f){
 const {nm,sp,edge,expr}=graphApi(f),log=[];f.semantic_decoding.state_argument_ir=log;
 for(const st of [...f.semantic_nodes].filter(n=>n.node_type==='STATE'&&['EXPLICIT_CONDITION_STATE','ATTESTED_PROPOSITION_CONTENT','REQUIRED_PROPOSITION_STATE'].includes(n.metadata.sense)&&!n.metadata.object_node_ids?.length)){
  const a=f.analyses.find(a=>a.cl.id===st.metadata.clause_id);if(!a)continue;
  const s=sp(st),tokens=a.cl.tokens.filter(t=>t.start>=s.start&&t.end<=s.end),frames=(a.cl.srl??[]).filter(frame=>{
   const pred=frame.find(x=>x[1]==='PRED'),t=pred&&a.cl.tokens[pred[2]];return t&&t.start>=s.start&&t.end<=s.end;
  });
  const options=frames.flatMap(frame=>{const p=frame.find(x=>x[1]==='PRED'),arg=frame.find(x=>x[1]==='ARG1'),pt=a.cl.tokens[p?.[2]],part=arg?a.cl.tokens.slice(arg[2],arg[3]):[];return pt&&part.length? [{pt,part}]:[];});
  // Only the outer predicative frame can own the state's main argument.
  const outer=options.filter(x=>!options.some(y=>y!==x&&y.part.some(t=>t.id===x.pt.id)));
  let candidate=outer.sort((x,y)=>y.pt.start-x.pt.start)[0];
  {
   const q=tokens.find(t=>/^(全部|所有|任何|每个|每项|all|any|every)$/iu.test(t.text)),predicates=tokens.filter(t=>/^(VV|VERB)$/u.test(t.pos)&&t.start>(q?.start??Infinity)&&!t.dep.includes('rcomp')&&tokens.some(x=>x.head===a.cl.tokens.indexOf(t)&&x.dep.includes('rcomp'))),pt=predicates.at(-1);
   if(q&&pt&&(!candidate||candidate.pt.start<pt.start)){const part=tokens.filter(t=>t.start>=q.start&&t.end<=pt.start);if(part.some(t=>/^(NN|NNS|NOUN)$/u.test(t.pos)))candidate={pt,part,fallback:'SOURCE_QUANTIFIER_RESULTATIVE_PREDICATE'};}
  }
  if(!candidate){
   const dependencies=tokens.filter(t=>/^(VV|VERB|ADJ)$/u.test(t.pos)&&!t.dep.includes('rcomp')).flatMap(pt=>{
    const heads=tokens.filter(t=>t.head===a.cl.tokens.indexOf(pt)&&/^(nsubj|nsubjpass|nsubj:pass|dobj|obj)$/u.test(t.dep)&&/^(NN|NNS|NOUN|PROPN)$/u.test(t.pos));
    if(heads.length!==1)return [];
    const ids=new Set([a.cl.tokens.indexOf(heads[0])]);let changed=true;while(changed){changed=false;for(const t of tokens)if(ids.has(t.head)&&['compound:nn','compound','amod','det','nmod:assmod'].includes(t.dep)&&!ids.has(a.cl.tokens.indexOf(t))){ids.add(a.cl.tokens.indexOf(t));changed=true;}}
    const part=tokens.filter(t=>ids.has(a.cl.tokens.indexOf(t))).sort((x,y)=>x.start-y.start);return [{pt,part,fallback:'LOCAL_STATE_DEPENDENCY_ARGUMENT'}];
   });
   if(dependencies.length===1)candidate=dependencies[0];
  }
  if(!candidate)continue;
  const {pt,part}=candidate;
  const determiners=tokens.filter(t=>t.dep==='det'&&t.end<=part[0].start&&part.some(n=>a.cl.tokens.indexOf(n)===t.head)&&/^(全部|所有|任何|每个|每项|all|any|every)$/iu.test(t.text));
  part.unshift(...determiners);part.sort((x,y)=>x.start-y.start);
  const start=part[0].start,end=part.at(-1).end;
  if(part.some(t=>t.start<s.start||t.end>s.end)||part.some(t=>/^(且|并|and)$/iu.test(t.text)))continue;
  const quantifier=part.find(t=>/^(全部|所有|任何|每个|每项|all|any|every)$/iu.test(t.text));
  const noun=part.filter(t=>/^(NN|NNS|NOUN|PROPN)$/u.test(t.pos)).at(-1);if(!noun)continue;
  const argument=f.tools.node(a.cl,'ENTITY',start,end,{sense:'STATE_ARGUMENT',owner:st.node_id,discourse:a.discourse,syntactic_layer:st.metadata.syntactic_layer,syntax_token_ids:part.map(t=>t.id),quantifier:quantifier?/^(任何|any)$/iu.test(quantifier.text)?'ANY':'ALL':null});
  const relation=edge(a,'CONJUNCTION',st,argument);st.metadata.object_node_ids=[argument.node_id];st.metadata.predicate_token_id=pt.id;st.metadata.predicate_state=pt.text;st.metadata.state_argument_relation_ids=[relation.relation_id];
  const relations=[relation],qualifiers=candidate.fallback?[]:part.filter(t=>frames.some(frame=>{const p=frame.find(x=>x[1]==='PRED');if(!p||a.cl.tokens[p[2]]?.id!==t.id)return false;const args=frame.filter(x=>/^ARG[01]$/u.test(x[1]));if(args.some(arg=>a.cl.tokens.slice(arg[2],arg[3]).some(x=>x.id===noun.id)))return true;let q=t,seen=new Set();while(q&&!seen.has(q.id)){seen.add(q.id);if(q.dep==='acl'&&a.cl.tokens[q.head]?.id===noun.id)return true;if(q.dep!=='conj')return false;q=a.cl.tokens[q.head];}return false;}));
  const qualifierStates=qualifiers.map(t=>{
   const q=f.tools.node(a.cl,'STATE',t.start,t.end,{sense:'LOCAL_ARGUMENT_QUALIFIER',owner:argument.node_id,discourse:a.discourse,syntactic_layer:'NOMINAL_QUALIFIER',object_node_ids:[argument.node_id],predicate:t.text,token_id:t.id,predicate_source_span_id:f.tools.span(t.start,t.end),source_quantifier:argument.metadata.quantifier});
   const r=edge(a,'CONJUNCTION',argument,q),obj=edge(a,'CONJUNCTION',q,argument);relations.push(r,obj);return {q,r,obj};
  });
  const connector=part.find(t=>t.pos==='CC'&&/^(或|或者|or|和|与|及|and)$/iu.test(t.text));
  let qualifierExpr=null;if(qualifierStates.length&&(!connector||qualifierStates.length===2)){
   const children=qualifierStates.map(({q,r,obj})=>expr(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:q.node_id,source_span_ids:uniq([...q.source_span_ids,...argument.source_span_ids]),relation_ids:[r.relation_id,obj.relation_id]}));
   qualifierExpr=children.length===1?children[0]:expr(f.expressions.condition_expr_nodes,{op:/^(或|或者|or)$/iu.test(connector.text)?'OR':'AND',operand_expr_ids:children,source_span_ids:uniq([a.sid,...argument.source_span_ids]),relation_ids:relations.map(r=>r.relation_id)});
  }
  let domainExpr=null;if(argument.metadata.quantifier)domainExpr=expr(f.expressions.set_expr_nodes,{kind:argument.metadata.quantifier,base_entity_node_id:argument.node_id,source_span_ids:uniq([a.sid,...argument.source_span_ids]),relation_ids:[]});
  st.metadata.state_argument_contract={argument_node_id:argument.node_id,predicate_token_id:pt.id,quantifier:argument.metadata.quantifier,scope_expr_id:domainExpr,qualifier_expr_id:qualifierExpr,qualifier_state_ids:qualifierStates.map(x=>x.q.node_id),source_span_ids:uniq([a.sid,...st.source_span_ids,...argument.source_span_ids]),rule:'LOCAL_SRL_STATE_PREDICATE_ARGUMENT'};
  for(const r of f.relations.filter(r=>r.state==='SUPPORTED'&&(r.head_node_id===st.node_id&&['COMPLETION_OF','CONDITION_OF'].includes(r.relation_type)||r.tail_node_id===st.node_id&&r.relation_type==='CONJUNCTION')))r.dependency_relation_ids=uniq([...(r.dependency_relation_ids??[]),...relations.map(x=>x.relation_id)]);
  log.push({state_node_id:st.node_id,...st.metadata.state_argument_contract,relation_ids:relations.map(r=>r.relation_id)});
 }
 return f;
}
