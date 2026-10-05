// Explicit enumeration syntax establishes a local nominal operand domain.
// This recognizer does not assign slots or invent omitted arguments.
export function scopeOperands(cl){
 const points=[...cl.span.quote],text=points.join('');
 const marker=/(?:范围|对象|输入|scope|inputs?)\s*(?:仅限|只限于|为|包括|包含|：|:|is\b|includes?\b)|^(?:重点|主要)?覆盖/iu.exec(text);
 if(!marker)return [];
 const offset=[...text.slice(0,marker.index+marker[0].length)].length;
 const parts=[];let start=offset,depth=0,quote=null,previousConnector=null;
 for(let i=offset;i<=points.length;i++){
  const c=points[i];
  if(quote){if(c===quote)quote=null;continue;}
  if(c==='“'||c==='"'||c==='`'){quote=c==='“'?'”':c;continue;}
  if(c==='('||c==='（')depth++;
  if(c===')'||c==='）')depth--;
  const rest=points.slice(i).join(''),connector=depth===0?/^(?:以及|和|与|及|、|,|，|\s+and\s+)/iu.exec(rest):null;
  if(i===points.length||connector){
   let a=start,b=i;while(a<b&&/\s/u.test(points[a]))a++;while(b>a&&/[\s。；;.!]/u.test(points[b-1]))b--;
   const tokens=cl.tokens.filter(t=>t.start<cl.span.start+b&&t.end>cl.span.start+a);
   if(a<b&&tokens.some(t=>/^(?:NN|NR|NT|NOUN|PROPN|PRON)/u.test(t.pos??'')))parts.push({start:cl.span.start+a,end:cl.span.start+b,token_ids:tokens.map(t=>t.id),connector_before:parts.length?previousConnector:null});
   if(connector){previousConnector=connector[0];i+=[...connector[0]].length-1;start=i+1;}
  }
 }
 return parts;
}
