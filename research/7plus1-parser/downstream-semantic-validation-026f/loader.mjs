import {pathToFileURL} from 'node:url';
import {CODE} from './util.mjs';
export async function hydrate(input,arm){
 const prefix=`${CODE}/${arm}/research/7plus1-parser`;
 const {sourceDocument}=await import(pathToFileURL(`${process.cwd()}/${prefix}/p0-semantic-repair-r02/source.mjs`));
 const {nativeFrontend}=await import(pathToFileURL(`${process.cwd()}/${prefix}/v0.3-candidate-parsing-026/frontend.mjs`));
 const {deepFreeze}=await import(pathToFileURL(`${process.cwd()}/${prefix}/v0.3-candidate-parsing-026/candidates.mjs`));
 const data=structuredClone(input),f=nativeFrontend(sourceDocument(data.source.raw_text),{clauses:[],literals:[],metrics:{},models:[]});
 // Keep the source tools' captured registries alive. The downstream uses their
 // span/unknown helpers but cannot propose relations after Γ.
 for(const [k,v]of Object.entries(data.fields)){
  if(Array.isArray(v)&&Array.isArray(f[k]))f[k].splice(0,f[k].length,...v);else f[k]=v;
 }
 for(const [k,v]of Object.entries(data.maps))f[k]=v.kind==='Map'?new Map(v.values):new Set(v.values);
 f.tools.task=f.semantic_nodes.find(n=>n.node_id===f.tools.task.node_id);
 f.candidate_semantic_graph=deepFreeze(data.graph);
 return f;
}
export async function execute(input,arm='baseline',domain='REVIEWED_GRAPH_TEST_ONLY'){
 const f=await hydrate(input,arm);
 const file='downstream-core.mjs';
 const engine=await import(pathToFileURL(`${process.cwd()}/${CODE}/${arm}/research/7plus1-parser/v0.3-candidate-parsing-026/${file}`));
 return engine.compileFrozenCandidates(f,f.candidate_semantic_graph,input.fields.nlp_signals.semantic_model_signals??{status:'REVIEWED_GRAPH_TEST_ONLY',models:[],observations:[],relation_validation:[]},{input_domain:domain,run_id:'026F-FROZEN-DOWNSTREAM',created_at:'2026-10-06T00:00:00.000Z'});
}
