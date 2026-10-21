import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {compileNative} from '../../../../research/7plus1-parser/v0.3-candidate-semantic-023/engine.mjs';
try{const d=sourceDocument('由 QA 检查 routes.csv。');const s=await analyze(d);const r=compileNative(d,s);console.log(JSON.stringify({gates:r.candidate_graph_gate_results,contract:r.contract_gate_results,relations:r.compiler_v03.relations,candidates:r.compiler_v03.candidate_semantic_graph.candidate_relations.map(x=>({type:x.relation_type,state:x.candidate_state})),source:r.source_spans},null,2));}finally{await closeNlp();}
