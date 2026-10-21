export function pack(f,g){
 const maps=Object.fromEntries(Object.entries(f).filter(([k,v])=>v instanceof Map||v instanceof Set).map(([k,v])=>[k,{kind:v instanceof Map?'Map':'Set',values:[...v]}]));
 const fields=Object.fromEntries(Object.entries(f).filter(([k,v])=>!['tools','doc','candidate_runtime_observer','proposals','candidate_semantic_graph'].includes(k)&&!(v instanceof Map)&&!(v instanceof Set)));
 return JSON.parse(JSON.stringify({source:f.source,fields,maps,graph:g}));
}
