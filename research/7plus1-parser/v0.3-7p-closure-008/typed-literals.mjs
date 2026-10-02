import {lexical as inheritedLexical} from '../p0-semantic-repair-r02/linguistic.mjs';
// Preserve complete source literals before punctuation segmentation. No entity-to-slot map.
export function lexical(doc){
 const text=doc.source.raw_text, full=[];
 // An explicitly delimited path with brace alternatives is one protected
 // source operand. Retention does not evaluate or expand the alternatives.
 for(const m of text.matchAll(/`([^`\n]+)`/gu)){
  const q=m[1];if(!/^[\w\p{L}\p{N}./\\*?{},<>-]+$/u.test(q)||!/[\\/]/u.test(q)||!/\{[^{}]+,[^{}]+\}/u.test(q)||q.replace(/\{[^{}]+\}/gu,'').match(/[{}]/u))continue;
  const start=[...text.slice(0,m.index+1)].length;full.push({type:'PATH',span:doc.span(start,start+[...q].length)});
 }
 const patterns={URI:/\b[A-Za-z][A-Za-z0-9+.-]*:\/\/[^\s<>`"'，。；]+/gu,PATH:/(?<![\w\p{L}\p{N}./\\])(?:[A-Za-z]:[\\/]|\.{1,2}[\\/]|[\w\p{L}\p{N}.-]+[\\/])(?:[\w\p{L}\p{N}.*?{}<>-]+[\\/])*(?:[\w\p{L}\p{N}.*?{}<>-]+(?:\.[\w\p{L}\p{N}.*?{}<>-]+)*)?/gu,FILE:/(?<![\w\p{L}\p{N}./\\])(?:\.[\w\p{L}\p{N}.-]+|[\w\p{L}\p{N}*?{}<>-]+(?:\.[\w\p{L}\p{N}*?{}<>-]+)*\.(?:json|yaml|yml|md|txt|py|js|ts|csv|toml|log))(?![\w\p{L}\p{N}./\\])/giu};
 for(const [type,re] of Object.entries(patterns))for(const m of text.matchAll(re)){
  // A slash-separated collection of bare words is not necessarily a file path.
  if(type==='PATH'&&!/[.*?{}<>\\]/u.test(m[0])&&!m[0].endsWith('/')&&!/^(?:[A-Za-z]:|\.)/u.test(m[0]))continue;
  const start=[...text.slice(0,m.index)].length,end=start+[...m[0]].length;
  if(!full.some(x=>x.span.start<=start&&x.span.end>=end))full.push({type,span:doc.span(start,end)});
 }
 const points=[...text],old=inheritedLexical(doc).filter(l=>!full.some(p=>p.span.start<=l.span.start&&p.span.end>=l.span.end)&&!(l.type==='PATH'&&/[\w\p{L}\p{N}]/u.test(points[l.span.start-1]??'')));
 return [...full,...old].sort((a,b)=>a.span.start-b.span.start||b.span.end-a.span.end).map((l,i)=>({...l,id:'literal:'+i}));
}
