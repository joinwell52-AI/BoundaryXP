// Protected filename syntax may cross a model's period boundary. Rejoin only
// that exact syntax interval; every original clause/token remains evidence.
export function recoverLiteralStructure(signals,source){
 const cp=[...source],literals=[...signals.literals],recoveries=[];
 const syntax=/(?<![A-Za-z0-9_])([A-Za-z0-9_][A-Za-z0-9_\p{Script=Han}./\\-]*\.(?:json|ya?ml|md|txt|csv|log|toml|ini|py|mjs|js|ts|tsx|zip|html|pdf|docx))(?![A-Za-z0-9_])/giu;
 for(const m of source.matchAll(syntax)){if(!/\p{Script=Han}/u.test(m[1]))continue;const start=[...source.slice(0,m.index)].length,end=start+[...m[1]].length;if(literals.some(l=>l.span.start===start&&l.span.end===end))continue;
  literals.push({id:'source-literal:'+start+':'+end,type:'FILE',span:{source_id:signals.clauses[0]?.span.source_id,start,end,quote:m[1]},provider:'EXPLICIT_MIXED_FILENAME_SYNTAX'});
 }
 const clauses=[];for(let i=0;i<signals.clauses.length;i++){const first=signals.clauses[i],spanLiteral=literals.filter(l=>l.span.start>=first.span.start&&l.span.start<first.span.end&&l.span.end>first.span.end);if(!spanLiteral.length){clauses.push(first);continue;}const stop=Math.max(...spanLiteral.map(l=>l.span.end)),parts=[first];while(i+1<signals.clauses.length&&signals.clauses[i+1].span.start<stop)parts.push(signals.clauses[++i]);
  if(parts.at(-1).span.end<stop){clauses.push(...parts);continue;}
  let offset=0;const tokens=[];for(const part of parts){for(const t of part.tokens)tokens.push({...t,head:t.head+offset,original_clause_id:part.id});offset+=part.tokens.length;}
  const merged={...first,span:{...first.span,end:parts.at(-1).span.end,quote:cp.slice(first.span.start,parts.at(-1).span.end).join('')},delimiter:parts.at(-1).delimiter,tokens,entities:parts.flatMap(p=>p.entities??[]),srl:[],source_literal_recovery:{rule:'PERIOD_INSIDE_EXACT_FILENAME_SYNTAX',original_clauses:parts.map(p=>({id:p.id,span:p.span,model:p.model,tokens:p.tokens,srl:p.srl??[]})),literal_spans:spanLiteral.map(l=>l.span)}};
  clauses.push(merged);recoveries.push({clause_id:merged.id,...merged.source_literal_recovery});
 }
 return {literals,clauses,recoveries};
}
