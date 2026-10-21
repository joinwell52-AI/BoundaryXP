import fs from 'node:fs';import {prepareNative} from '../../../../research/7plus1-parser/v0.3-7p-short-direct-016/engine.mjs';import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';import {out,read} from './common.mjs';
const id=process.argv[2],dir=out+'baseline-014/'+id+'/',f=prepareNative(sourceDocument(fs.readFileSync(dir+'source.md')),read(dir+'signals.json')),ns=f.semantic_nodes;
console.log(JSON.stringify(ns.map(n=>({id:n.node_id,type:n.node_type,s:n.surface,sense:n.metadata.sense,c:n.metadata.clause_id,retired:n.metadata.retired_by_short_direct,modal:n.metadata.modality})),null,2));
console.log(JSON.stringify(f.relations.filter(r=>r.state!=='REJECTED').map(r=>({id:r.relation_id,cl:r.clause_id,type:r.relation_type,state:r.state,head:ns.find(n=>n.node_id===r.head_node_id)?.surface,tail:ns.find(n=>n.node_id===r.tail_node_id)?.surface})),null,2));
console.log('UNRESOLVED',JSON.stringify(f.unresolved));
