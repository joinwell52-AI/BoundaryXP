// Imperative marking belongs to document syntax, not a task/entity lookup table.
export function imperativePrefix(prefix){
 const body=prefix.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s*)/u,'').replace(/[*_]/gu,'').trim();
 return !body||/^(?:则|并|同时|then|and)\s*$/iu.test(body);
}
export function plainHeading(text){return text.replace(/[*_`]/gu,'').trim();}
