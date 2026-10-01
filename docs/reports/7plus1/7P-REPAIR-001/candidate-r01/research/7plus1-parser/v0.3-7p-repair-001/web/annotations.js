// Shared by the live UI and offline HTML. Overlaps retain every annotation identity.
export function annotationSegments(source){
 const chars=[...source.raw_text],cuts=[...new Set([0,chars.length,...source.spans.flatMap(s=>[s.start,s.end])])].sort((a,b)=>a-b);
 return cuts.slice(0,-1).map((start,i)=>{const end=cuts[i+1];return {start,end,text:chars.slice(start,end).join(''),annotations:source.spans.map((s,index)=>({...s,index})).filter(s=>s.start<=start&&s.end>=end)};});
}
