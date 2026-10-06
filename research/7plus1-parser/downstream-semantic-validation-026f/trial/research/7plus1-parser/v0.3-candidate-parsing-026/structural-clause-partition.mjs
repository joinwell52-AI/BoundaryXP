import {predicateEnclosure} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
// Source punctuation partitions consumption; the original NLP registry stays
// intact, including dependencies crossing a structural continuation marker.
export function structuralClausePartition(cl,literals){
 const marks=cl.tokens.filter(t=>t.dep==='punct'&&/^[：:]$/u.test(t.text)&&!literals.some(l=>l.span.start<=t.start&&l.span.end>=t.end)&&!predicateEnclosure({start:cl.span.start,quote:cl.span.quote},t.start).length);
 if(!marks.length)return [cl];
 const ranges=[],points=[...cl.span.quote];let start=cl.span.start;
 for(const m of marks){ranges.push({start,end:m.start,delimiter:m.text,marker:m});start=m.end;}ranges.push({start,end:cl.span.end,delimiter:cl.delimiter});
 return ranges.filter(r=>r.end>r.start).map((r,segment)=>{
  while(r.start<r.end&&/\s/u.test(points[r.start-cl.span.start]))r.start++;
  const indices=cl.tokens.map((t,i)=>({t,i})).filter(({t})=>t.start>=r.start&&t.end<=r.end),map=new Map(indices.map(({i},j)=>[i,j]));
  const tokens=indices.map(({t},j)=>({...t,head:map.get(t.head)??j,...(!map.has(t.head)?{external_dependency:{head_token_id:cl.tokens[t.head]?.id,original_clause_id:cl.id,relation:t.dep}}:{})}));
  const srl=(cl.srl??[]).filter(fr=>fr.some(row=>row[1]==='PRED'&&map.has(row[2])&&map.has(row[3]-1))).map(fr=>fr.filter(row=>map.has(row[2])&&map.has(row[3]-1)).map(row=>[row[0],row[1],map.get(row[2]),map.get(row[3]-1)+1]));
  return {...cl,id:cl.id+':colon:'+segment,tokens,srl,entities:cl.entities.filter(e=>e.span.start>=r.start&&e.span.end<=r.end),span:{...cl.span,start:r.start,end:r.end,quote:points.slice(r.start-cl.span.start,r.end-cl.span.start).join('')},delimiter:r.delimiter,source_structure_partition:{original_clause_id:cl.id,segment,marker_span:r.marker?{start:r.marker.start,end:r.marker.end,quote:r.marker.text}:null,rule:'EXPLICIT_UNQUOTED_COLON_CONTINUATION'}};
 });
}
