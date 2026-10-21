import {uniq} from './util.mjs';
export function attachNlpEvidence(graph,raw=null){
 const evidence=[];
 const spans=new Map(graph.source_spans.map(s=>[s.span_id,s]));
 for(const relation of graph.relations){
  const h=graph.nodes.find(n=>n.id===relation.head),t=graph.nodes.find(n=>n.id===relation.tail),hs=spans.get(h?.source_span_ids[0]),ts=spans.get(t?.source_span_ids[0]);
  let signal='NO_EVIDENCE',witnesses=[];
  if(raw&&hs&&ts)for(const clause of raw.clauses??[]){
   const tokens=clause.tokens??[],heads=tokens.map((tok,i)=>({tok,i})).filter(({tok})=>tok.start>=hs.start&&tok.end<=hs.end);
   for(const {tok,i}of heads)for(const arg of tokens.filter(a=>a.start>=ts.start&&a.end<=ts.end&&a.head===i)){
    const accepted=relation.type==='AGENT'?/^(nsubj|nsubjpass|nsubj:pass)$/u:relation.type==='PATIENT'||relation.type==='THEME'||relation.type==='RESULT'?/^(obj|dobj|iobj|nsubjpass|nsubj:pass)$/u:null;
    if(accepted?.test(arg.dep??'')){signal='SUPPORT';witnesses.push({channel:'NLP_DEP',clause_id:clause.id,predicate_token:tok,argument_token:arg});}
   }
  }
  evidence.push({candidate_id:relation.id,signal,origin:raw?.provider??'NLP_NOT_AVAILABLE',witnesses});
 }
 const typed=graph.nodes.filter(n=>n.source_span_ids.some(sid=>{const s=spans.get(sid);return graph.source.typed_spans.some(l=>s&&l.span.start===s.start&&l.span.end===s.end);})).map(n=>({candidate_id:n.id,signal:'SUPPORT',channel:'TYPED_LITERAL',meaning:'Literal identity only, never semantic role certification'}));
 return {evidence,typed,models:raw?.models??[],fresh_model_calls:0,availability:raw?'FROZEN_LINGUISTIC_CACHE':'NOT_AVAILABLE',channels:{HanLP_spaCy:raw?'FROZEN_CACHE':'NOT_AVAILABLE',DEP:raw?'SUPPORT_OR_NO_EVIDENCE':'NOT_AVAILABLE',SRL:'PRESERVED_WHEN_IN_RAW_CACHE_NOT_USED_TO_INVENT_RELATIONS',SDP:'NOT_SELECTED',CON:'NOT_SELECTED',BGE_E5:'NOT_SELECTED_NO_V04_CANDIDATE_COMPATIBLE_RETRIEVAL_ADAPTER',NLI:'NOT_SELECTED_NO_V04_HYPOTHESIS_ADAPTER'},generates_nodes:false,generates_relations:false};
}
