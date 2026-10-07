import {id} from './util.mjs';
export function linkQuote(source,ref){
 const points=[...source.raw_text],quote=[...ref.quote];
 if(!quote.length)return {status:'INVALID_QUOTE',reason:'EMPTY_SOURCE_QUOTE'};
 const region=ref.clause_id?source.regions.find(c=>c.id===ref.clause_id):null;
 if(ref.clause_id&&!region)return {status:'INVALID_ANCHOR',reason:'UNKNOWN_CLAUSE_ID'};
 const min=region?.span.start??0,max=region?.span.end??points.length,found=[];
 for(let i=min;i+quote.length<=max;i++)if(points.slice(i,i+quote.length).join('')===ref.quote)found.push(i);
 if(!found.length)return {status:'INVALID_QUOTE',reason:'QUOTE_NOT_IN_DECLARED_SOURCE'};
 let candidates=found;
 if(ref.context_anchor!==null&&ref.context_anchor!==undefined){
  const anchor=[...ref.context_anchor],ranges=[];
  for(let i=min;i+anchor.length<=max;i++)if(points.slice(i,i+anchor.length).join('')===ref.context_anchor)ranges.push([i,i+anchor.length]);
  candidates=candidates.filter(i=>ranges.some(([a,b])=>i>=a&&i+quote.length<=b));
 }
 if(ref.occurrence!==null&&ref.occurrence!==undefined){if(ref.occurrence<0||ref.occurrence>=found.length)return {status:'INVALID_ANCHOR',reason:'OCCURRENCE_OUT_OF_RANGE'};candidates=candidates.filter(i=>i===found[ref.occurrence]);}
 if(candidates.length!==1)return {status:'AMBIGUOUS_ALIGNMENT',reason:'QUOTE_NOT_UNIQUELY_ALIGNED',alternatives:candidates.map(start=>({start,end:start+quote.length}))};
 const start=candidates[0],end=start+quote.length;
 return {status:'ALIGNED',span:{span_id:id(source.sha256,'span',start,end),start,end,quote:ref.quote,clause_id:ref.clause_id??source.regions.find(r=>start>=r.span.start&&end<=r.span.end)?.id??null}};
}
