import {sourceDocument} from '../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {analyze,closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
import {prepareCandidates} from '../../../../research/7plus1-parser/v0.3-admin-root-024/candidates.mjs';
const d=sourceDocument(process.argv[2]),signals=await analyze(d),f=prepareCandidates(d,signals);
console.log(JSON.stringify({clauses:signals.clauses,states:f.semantic_nodes.filter(n=>n.node_type==='STATE'),arguments:f.semantic_decoding.state_argument_ir,relations:f.relations.filter(r=>['CONDITION_OF','COMPLETION_OF'].includes(r.relation_type)),plans:[...f.expression_plans]}));await closeNlp();
