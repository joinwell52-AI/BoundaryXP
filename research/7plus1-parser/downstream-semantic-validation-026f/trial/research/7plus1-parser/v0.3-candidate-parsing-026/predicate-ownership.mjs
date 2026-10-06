// Language operators and their local dependency ownership, not domain entities.
export function isGovernedOperator(cl,t){
 const i=cl.tokens.indexOf(t),children=cl.tokens.filter(q=>q!==t&&q.head===i);
 if(/^(aux(?::|$)|cop$|case$|mark$)/u.test(t.dep??''))return true;
 if(t.dep==='advmod:rcomp'&&/^(到|向)$/u.test(t.text)&&/^(VV|VERB)$/u.test(cl.tokens[t.head]?.pos??''))return true;
 if(t.text==='请'||/^please$/iu.test(t.text))return children.some(q=>/^(VV|VERB)/u.test(q.pos??'')&&/ccomp|xcomp|obj|dobj/u.test(q.dep??''))||(/xcomp|intj|advmod/u.test(t.dep??'')&&/^(VV|VERB)/u.test(cl.tokens[t.head]?.pos??'')&&t.start<cl.tokens[t.head].start)||cl.tokens.indexOf(t)===0&&cl.tokens.some(q=>q.start>t.end&&(/^(VV|VERB)$/u.test(q.pos??'')||/^(组织|organize|organise)$/iu.test(q.lemma??q.text)));
 if(/^(要求|需要|允许|禁止|require|requires|permit|permits)$/iu.test(t.text))return children.some(q=>/^(VV|VERB)/u.test(q.pos??'')&&/ccomp|xcomp/u.test(q.dep??''))||t.dep==='xcomp'&&cl.tokens[t.head]?.start>=t.end&&/^(VV|VERB)$/u.test(cl.tokens[t.head]?.pos??'');
 if(t.text==='得')return cl.tokens.some(q=>q.end===t.start&&q.text==='不')&&cl.tokens[t.head]!==t;
 return false;
}
export function governingDirective(cl,t){
 if(cl.quoted_directive)return {modality:'REQUIRED',start:cl.quoted_directive.governor_span.start,end:cl.quoted_directive.governor_span.end,token_ids:[cl.quoted_directive.governor_token_id],governing_token_path:[cl.quoted_directive.wrapper_clause_id,cl.quoted_directive.governor_token_id,t.id],role:'EXPLICIT_QUOTED_DIRECTIVE_OPERATOR'};
 const seen=new Set();let i=cl.tokens.indexOf(t);
 while(i>=0&&!seen.has(i)){seen.add(i);const q=cl.tokens[i];if(!q)break;
  if((q.text==='请'||/^please$/iu.test(q.text)||/^(要求|require|requires)$/iu.test(q.lemma??q.text))&&isGovernedOperator(cl,q))return {modality:'REQUIRED',start:q.start,end:q.end,token_ids:[q.id],governing_token_path:[...seen].map(i=>cl.tokens[i].id),role:'DIRECTIVE_OPERATOR'};
  const attached=cl.tokens.find(v=>(v.text==='请'||/^(please|要求|require|requires)$/iu.test(v.text))&&v.head===i&&isGovernedOperator(cl,v));
  if(attached)return {modality:'REQUIRED',start:attached.start,end:attached.end,token_ids:[attached.id],governing_token_path:[...seen].map(i=>cl.tokens[i].id),role:'DIRECTIVE_OPERATOR'};
  if(q.head===i)break;i=q.head;
 }
 return null;
}
export function predicateLayer(cl,t){
 const originalIndex=cl.tokens.indexOf(t);
 if(srlPredicate(cl,t)&&cl.tokens.some(n=>n.head===originalIndex&&n.dep==='neg')&&cl.tokens.some(n=>n.start<t.start&&/^(得|禁止|must)$/iu.test(n.text)))return {kind:'MAIN',attachment_token_ids:[t.id],rule:'SRL_AND_EXPLICIT_NEGATION_TARGET'};
 let i=cl.tokens.indexOf(t),seen=new Set();
 while(i>=0&&!seen.has(i)){seen.add(i);const q=cl.tokens[i];if(!q)break;
  if(/^(acl(?::|$)|relcl$)/u.test(q.dep??''))return {kind:'NOMINAL_QUALIFIER',owner_token_id:cl.tokens[q.head]?.id,attachment_token_ids:[...seen].map(i=>cl.tokens[i].id)};
  const head=cl.tokens[q.head];if(head&&head!==q&&/ccomp|dobj|obj|compound:vc/u.test(q.dep??'')&&/^(停止|中止|终止|stop|abort|确认|确保|confirm|ensure)$/iu.test(head.text)){
   const temporalBoundary=cl.tokens.some(m=>m.head===q.head&&/^(case|mark)$/u.test(m.dep??'')&&/^(后|之后|after|before)$/iu.test(m.text)&&m.end<=q.start);
   if(temporalBoundary)return {kind:'MAIN',owner_token_id:q.id,attachment_token_ids:[...seen].map(i=>cl.tokens[i].id),rule:'EXPLICIT_TEMPORAL_CONSEQUENT_OUTSIDE_COMPLEMENT'};
   return {kind:/^(确认|确保|confirm|ensure)$/iu.test(head.text)?'PROPOSITION_COMPLEMENT':'AFFECTED_ACTION',owner_token_id:head.id,attachment_token_ids:[...seen].map(i=>cl.tokens[i].id)};
  }
  if(q.head===i)break;i=q.head;
 }
 return {kind:'MAIN',attachment_token_ids:[t.id]};
}
export function srlPredicate(cl,t){const index=cl.tokens.indexOf(t);return (cl.srl??[]).flat().some(row=>row[1]==='PRED'&&row[2]<=index&&row[3]>index);}
