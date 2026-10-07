import crypto from 'node:crypto';
export const sha256=x=>crypto.createHash('sha256').update(x).digest('hex');
export function prepareSource(bytes){
 const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);
 if(Buffer.from(text,'utf8').compare(Buffer.from(bytes))!==0)throw Error('SOURCE_UTF8_ROUNDTRIP_FAILED');
 const chars=Array.from(text);
 if(!chars.length)throw Error('EMPTY_SOURCE');
 if(chars.length>300)throw Error('SHORT_TEXT_SCOPE_EXCEEDED: input preserved, not truncated');
 let start=0;
 const lines=text.split('\n').map((t,i)=>{const row={id:`L${i+1}`,text:t,span:[start,start+Array.from(t).length]};start=row.span[1]+1;return row;});
 // Literal hints only: never assign an action, scope, role or slot.
 const literals=Array.from(text.matchAll(/[\w.-]+\.(?:csv|md|json|yaml|log|db)\b|\b[A-Z]+-\d+\b|\d+(?:\.\d+)?/g),m=>({text:m[0],span:[Array.from(text.slice(0,m.index)).length,Array.from(text.slice(0,m.index+m[0].length)).length]}));
 return {text,sha256:sha256(bytes),encoding:'UTF-8',codepoints:chars.length,lines,literals};
}
export function linkQuote(source,citation){
 const a=Array.from(source.text), q=Array.from(citation.quote), starts=[];
 for(let i=0;i<=a.length-q.length;i++)if(q.every((c,j)=>a[i+j]===c))starts.push(i);
 const start=starts[citation.occurrence-1];
 if(start===undefined)throw Error(`SOURCE_QUOTE_NOT_FOUND: ${JSON.stringify(citation)}`);
 return {...citation,span:[start,start+q.length],source_sha256:source.sha256};
}
export function linkSources(source,citations){return citations.map(c=>linkQuote(source,c));}
