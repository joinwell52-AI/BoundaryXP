import {OUT,BASE,read,save,sha} from './util.mjs';
import {sourceDocument} from './baseline/research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
import {prepareCandidates,freezeCandidateGraph} from './baseline/research/7plus1-parser/v0.3-candidate-parsing-026/candidates.mjs';
import {pack} from './pack.mjs';
const row=read(`${BASE}/development/r050/root/RESULTS.json`).rows[0],t=read(`${BASE}/${row.trace}`),c=t.compiler_v03;
const f=prepareCandidates(sourceDocument(c.source.raw_text),c.nlp_signals),g=freezeCandidateGraph(f,c.nlp_signals.semantic_model_signals);
const keys=Object.keys(g),equal=Object.fromEntries(keys.map(k=>[k,JSON.stringify(g[k])===JSON.stringify(c.candidate_semantic_graph[k])]));
save(`${OUT}/AUTOMATIC-REHYDRATION-PROBE.json`,{id:row.id,trace:`${BASE}/${row.trace}`,trace_sha256:sha(Buffer.from(JSON.stringify(t))),field_equality:equal,regenerated_candidates_are_not_new_model_calls:true});
save(`${OUT}/automatic-probe-input.json`,pack(f,c.candidate_semantic_graph));console.log(JSON.stringify(equal));
