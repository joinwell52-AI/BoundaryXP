import fs from'node:fs';import{compileNative}from '../../../../research/7plus1-parser/v0.3-7p-repair-004/engine.mjs';import{sourceDocument}from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
for(const id of process.argv.slice(2)){
 const x=JSON.parse(fs.readFileSync('docs/reports/7plus1/7P-REPAIR-004/non-gold/'+id+'.json')),r=compileNative(sourceDocument(x.text),x.signals),c=r.compiler_v03;
 console.log(id,JSON.stringify(x.signals.clauses.map(a=>({id:a.id,s:a.sentence_id,text:a.span.quote,t:a.tokens.map(t=>[t.text,t.pos,t.head,t.dep])}))));
 console.log('nodes',JSON.stringify(c.semantic_nodes.filter(n=>n.node_type==='EVENT').map(n=>[n.node_id,n.surface,n.metadata.modality])));
 console.log('edges',JSON.stringify(c.relations.filter(r=>r.state==='RESOLVED').map(r=>[r.relation_type,c.semantic_nodes.find(n=>n.node_id===r.head_node_id)?.surface,c.semantic_nodes.find(n=>n.node_id===r.tail_node_id)?.surface])));
 console.log('gates',r.contract_gate_results.status,'audit',JSON.stringify({edges:c.nlp_signals.semantic_decoding.edge_closure?.edges.length,decisions:c.nlp_signals.semantic_decoding.edge_closure?.decisions}));
}
