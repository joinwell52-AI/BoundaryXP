// A protected literal scanner can absorb adjacent Chinese verbs. A real
// verbal token plus explicit conditional/modal syntax supplies a boundary;
// quoted filenames and ordinary nominal tokens are never reinterpreted.
export function typedLiteralBoundaries(signals,lexicon){
 const words=[...new Set(Object.values(lexicon).flat())].filter(w=>/\p{Script=Han}/u.test(w)&&[...w].length>1).sort((a,b)=>b.length-a.length),repairs=[];
 const literals=signals.literals.map(l=>{
  if(!['FILE','PATH'].includes(l.type))return l;
  const a=signals.clauses.find(a=>a.span.start<=l.span.start&&a.span.end>=l.span.end&&/^(未经|未获|若|如果)/u.test(a.span.quote)),token=a?.tokens.find(t=>t.start===l.span.start&&t.end===l.span.end&&/^(VV|VERB)$/u.test(t.pos??''));
  if(!token)return l;
  const parts=/^(批准|确认|审核)(不得|禁止|必须|须)(.+)$/u.exec(token.text),verb=parts&&words.find(w=>parts[3].startsWith(w)),suffix=verb&&parts[3].slice(verb.length);
  if(!suffix||!/^[A-Za-z0-9_.\/-]+\.[A-Za-z0-9]+$/u.test(suffix))return l;
  const start=token.end-[...suffix].length,derived={...l,id:l.id+':source-boundary',span:{...l.span,start,quote:suffix},original_literal:l,provider:'VERBAL_MODAL_TYPED_LITERAL_BOUNDARY'};
  repairs.push({clause_id:a.id,original_literal:l,derived_literal:derived,verbal_token_id:token.id,rule:'CONDITIONAL_VERBAL_MODAL_LITERAL_BOUNDARY'});return derived;
 });
 return {literals,repairs};
}
