// Imperative marking belongs to document syntax, not a task/entity lookup table.
export function imperativePrefix(prefix){
 const body=prefix.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s*)/u,'').replace(/[*_]/gu,'').trim();
 return !body||/^(?:则|并|同时|同步|首先|随后|最后|逐项|逐条|then|and|please)\s*$/iu.test(body);
}
export function plainHeading(text){return text.replace(/[*_`]/gu,'').trim();}
// Clause segmentation is not a new document-level imperative boundary.
// Inspect the owning source block, including quotes/parentheses spanning clauses.
export function directiveLayer(scope,at){
 const s=scope?.source_span;if(!s)return {allowed:false,reason:'SOURCE_BLOCK_UNAVAILABLE'};
 const before=[...s.quote].slice(0,at-s.start).join(''),stack=[],pairs={'“':'”','「':'」','『':'』','（':'）','(':')','"':'"',"'":"'",'`':'`'};
 for(let i=0;i<before.length;i++){
  const ch=before[i];if((ch==='"'||ch==="'")&&/[\p{L}\p{N}]/u.test(before[i-1]??'')&&/[\p{L}\p{N}]/u.test(before[i+1]??''))continue;
  if(ch===stack.at(-1)){stack.pop();continue;}if(stack.at(-1)==='`')continue;
  if(pairs[ch])stack.push(pairs[ch]);
 }
 if(stack.length)return {allowed:false,reason:'ENCLOSED_PREDICATE_LAYER',open_delimiters:stack};
 const local=before.slice(Math.max(before.lastIndexOf('。'),before.lastIndexOf(';'),before.lastIndexOf('；'),before.lastIndexOf('!'),before.lastIndexOf('！'))+1);
 const body=local.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s*)/u,'').replace(/[*_]/gu,'').trim();
 const conditional=/^(?:如果|若|当|if\b)[\s\S]*[,，]\s*(?:则|then)\s*$/iu.test(body);
 return {allowed:imperativePrefix(local)||negativeImperativePrefix(local,'')||/^(?:只|仅|only)\s*$/iu.test(body)||conditional,reason:conditional?'EXPLICIT_CONDITIONAL_CONSEQUENT':'SOURCE_MAIN_LAYER_PREFIX',source_prefix:local};
}
export function negativeImperativePrefix(prefix,predicate){
 const body=prefix.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s*)/u,'').replace(/[*_]/gu,'').trim();
 // Bare task-initial negation is not a negated obligation or a copular state.
 return /^(?:不|不再)$/u.test(body)&&!/^(?:需要|要求|必|须|是|属于|存在|受|变)$/u.test(predicate);
}
