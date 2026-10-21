import crypto from 'node:crypto';
import {MAX_SOURCE_BYTES} from './input-limits.mjs';
export const sha256=x=>crypto.createHash('sha256').update(x).digest('hex');
export function prepareSource(bytes){
 if(bytes.length>MAX_SOURCE_BYTES)throw Error('SOURCE_BYTE_LIMIT: input preserved, not truncated');
 const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);
 if(Buffer.from(text,'utf8').compare(Buffer.from(bytes))!==0)throw Error('SOURCE_UTF8_ROUNDTRIP_FAILED');
 const chars=Array.from(text);
 if(!text.replaceAll('\uFEFF','').trim())throw Error('EMPTY_SOURCE');
 let start=0;
 const lines=text.split('\n').map((t,i)=>{const row={id:`L${i+1}`,text:t,span:[start,start+Array.from(t).length]};start=row.span[1]+1;return row;});
 // Literal hints only: never assign an action, scope, role or slot.
 // Keep UTF-16 regex offsets and Unicode source coordinates separate. Walk
 // each intervening segment once instead of rescanning the entire prefix for
 // every literal; this performs no semantic inference.
 let offset=0,coordinate=0;
 const literals=Array.from(text.matchAll(/(?<![\w.-])[\w.-]+\.(?:csv|md|json|yaml|log|db)\b|\b[A-Z]+-\d+\b|\d+(?:\.\d+)?/g),m=>{
  coordinate+=Array.from(text.slice(offset,m.index)).length;
  const start=coordinate;coordinate+=Array.from(m[0]).length;offset=m.index+m[0].length;
  return {text:m[0],span:[start,coordinate]};
 });
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
