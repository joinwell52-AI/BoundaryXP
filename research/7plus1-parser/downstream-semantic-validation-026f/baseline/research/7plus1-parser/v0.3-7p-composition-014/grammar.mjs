// Closed grammatical operators. All matching is over exact source spans, never fixture identity.
export const COMPARATORS = Object.freeze([
 ['不得超过','LTE'],['不超过','LTE'],['最多','LTE'],['至多','LTE'],
 ['不得少于','GTE'],['不少于','GTE'],['至少','GTE'],['最少','GTE'],
 ['恰好','EQ'],['正好','EQ'],['共','EQ'],['以内','LTE'],['超过','GT'],['低于','LT'],
 ['at most','LTE'],['at least','GTE'],['exactly','EQ'],['maximum','LTE'],['minimum','GTE'],['within','LTE'],['<=','LTE'],['>=','GTE'],['≤','LTE'],['≥','GTE']
]);
export function comparatorIn(clause) {
 const hits=COMPARATORS.flatMap(([surface,op])=>{
  const i=clause.span.quote.toLowerCase().indexOf(surface);
  return i<0?[]:[{surface,op,start:clause.span.start+[...clause.span.quote.slice(0,i)].length,end:clause.span.start+[...clause.span.quote.slice(0,i)].length+[...surface].length}];
 }).sort((a,b)=>a.start-b.start||b.surface.length-a.surface.length);
 const marker=hits[0];
 return marker?{...marker,token_ids:clause.tokens.filter(t=>t.start<marker.end&&t.end>marker.start).map(t=>t.id)}:null;
}
export const SUPPORT_VERBS = Object.freeze(['进行','执行','开展','实施','完成','负责','组织','办理','conduct','perform','execute','run']);
export const MODALS=Object.freeze([
 ['不需要','NOT_REQUIRED'],['无需','NOT_REQUIRED'],['无须','NOT_REQUIRED'],['不必','NOT_REQUIRED'],['不要求','NOT_REQUIRED'],
 ['不应该','FORBIDDEN'],['不应','FORBIDDEN'],['不准','FORBIDDEN'],['不要','FORBIDDEN'],['不允许','FORBIDDEN'],['不得','FORBIDDEN'],['禁止','FORBIDDEN'],['严禁','FORBIDDEN'],['不可','FORBIDDEN'],['不能','FORBIDDEN'],
 ['应该','REQUIRED'],['应当','REQUIRED'],['需要','REQUIRED'],['必须','REQUIRED'],['务必','REQUIRED'],['应','REQUIRED'],['需','REQUIRED'],['须','REQUIRED'],
 ['可以','PERMITTED'],['允许','PERMITTED'],['可','PERMITTED']
]);
export function explicitModal(cl,at,predicate){
 const quote=[...cl.span.quote].slice(0,at-cl.span.start).join(''),hits=[];
 for(const [word,modality] of MODALS){let from=0,i;while((i=quote.indexOf(word,from))>=0){const start=cl.span.start+[...quote.slice(0,i)].length,end=start+[...word].length;hits.push({word,modality,start,end});from=i+word.length;}}
 const exact=hits.filter(h=>{const ts=cl.tokens.filter(t=>t.start<h.end&&t.end>h.start);return ts.length&&ts[0].start===h.start&&ts.at(-1).end===h.end;}).filter(h=>!hits.some(o=>o.start<=h.start&&o.end>=h.end&&(o.start<h.start||o.end>h.end)));
 const chain=[];let current=cl.tokens.indexOf(predicate);while(current>=0&&!chain.includes(current)){chain.push(current);const head=cl.tokens[current]?.head;if(head===current)break;current=head;}
 const governed=exact.map(h=>{const ts=cl.tokens.filter(t=>t.start<h.end&&t.end>h.start),distances=ts.flatMap(t=>[chain.indexOf(t.head),chain.indexOf(cl.tokens.indexOf(t))]).filter(d=>d>=0);return {...h,token_ids:ts.map(t=>t.id),distance:distances.length?Math.min(...distances):Infinity};}).filter(h=>Number.isFinite(h.distance));
 const minimum=Math.min(...governed.map(h=>h.distance)),best=governed.filter(h=>h.distance===minimum),modes=[...new Set(best.map(h=>h.modality))];
 if(modes.length>1)return {ambiguous:true,candidates:best};
 const chosen=best.at(-1);return chosen?{...chosen,governing_token_path:chain.map(i=>cl.tokens[i].id)}:null;
}
export function scalarAfter(clause,marker){
 if(!marker)return null;
 const local=[...clause.span.quote].slice(marker.end-clause.span.start).join('');
 const m=/^\s*([0-9]+(?:\.[0-9]+)?|[一二两三四五六七八九十]|one|two|three|four|five|six)(?=\s|次|轮|批|家|件|天|日|分钟|小时|秒|元|美元|MB|GB|%|$)/iu.exec(local);
 if(!m)return null;
 const start=marker.end+[...m[0]].length-[...m[1]].length,end=start+[...m[1]].length;
 const token=clause.tokens.find(t=>t.start<=start&&t.end>=end);
 return {text:m[1],start,end,id:token?.id??'SOURCE_SCALAR'};
}
