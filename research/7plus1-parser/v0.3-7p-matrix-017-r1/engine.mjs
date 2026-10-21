import {sourceDocument} from '../p0-semantic-repair-r02/source.mjs';
import {analyze} from '../v0.3-7p-composition-014/linguistic.mjs';
import {compileNative,parse7Plus1 as shortParse} from '../v0.3-7p-short-direct-016-r2/engine.mjs';
import {uid,slots,recoverStructure,orchestrationCandidates} from './structure.mjs';
export {recoverStructure,orchestrationCandidates};
const unique=xs=>[...new Set(xs)];
function status(items,states=[]){if(states.includes('PARSER_COVERAGE_FAILURE'))return 'PARSER_COVERAGE_FAILURE';if(states.includes('UNRESOLVED')||items.some(x=>x.state==='UNRESOLVED'))return 'UNRESOLVED';return items.length?'RESOLVED':'ABSENT';}
export function composeMatrix(doc,structure,localRuns){
 const items=[],diagnostics=[...structure.diagnostics],byId=new Map(),local=Object.fromEntries(structure.wp_tree.wps.map(w=>[w.wp_id,Object.fromEntries(slots.map(s=>[s,{status:'ABSENT',items:[],inherited_refs:[]}]))]));
 const toGlobal=(view,sp)=>doc.span(view.start+sp.start,view.start+sp.end);
 for(const run of localRuns){const c=run.result.compiler_v03,view=structure.views.find(v=>v.view_id===run.view_id),nodes=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),ns=id=>nodes.get(nodes.get(id)?.metadata.referent_node_id??id),spans=run.result.source_spans;
  const viewBlocks=structure.blocks.filter(b=>view.block_ids.includes(b.block_id));
  const structuralOnly=view.wp_id==='WP0'&&viewBlocks.every(b=>/^本任务(?:分|包含|分为)[^。]*(?:阶段)[。]?$/u.test(b.source_span.quote)&&!/(?:依据|不得|禁止|负责|必须)/u.test(b.source_span.quote)||/^(?:这)?[两二三\d]个[^。]{0,10}阶段(?:可(?:以)?并行|同时进行)[。]?$/u.test(b.source_span.quote));
  if(structuralOnly){run.matrix_accountability={state:'STRUCTURAL_ONLY',rule:'EXPLICIT_STAGE_INVENTORY_OR_ORCHESTRATION',source_spans:viewBlocks.map(b=>b.source_span),raw_short_trace_preserved:true};continue;}
  for(const slot of slots){const src=c.canonical_7plus1[slot];local[view.wp_id][slot].status=status(local[view.wp_id][slot].items,[local[view.wp_id][slot].status,src.status]);
   for(const entry of src.entries){const facts=entry.boundary_fact_ids.map(id=>c.boundary_ir.facts.find(f=>f.boundary_fact_id===id)),objects=unique(facts.flatMap(f=>f.object_node_ids)),objectNodes=objects.map(ns),predicateNodes=unique(facts.map(f=>f.predicate_node_id).filter(Boolean)).map(ns),globalSpans=entry.source_span_ids.map(id=>spans.find(s=>s.span_id===id)).filter(Boolean).map(s=>toGlobal(view,s));
    const typedLiteral=objectNodes.length===1&&objectNodes[0]?.metadata.literal_tag==='FILEPATH',artifact=typedLiteral?{kind:'FILEPATH',literal:objectNodes[0].surface,case_sensitive:true,document_id:doc.source.source_id}:null;
    const id=uid(doc.source.sha256,view.view_id,slot,entry.canonical_entry_id),semanticIdentity=artifact?uid(doc.source.sha256,'artifact',artifact.literal):uid(doc.source.sha256,view.view_id,entry.canonical_entry_id);
    const item={semantic_item_id:id,slot,semantic_identity:semanticIdentity,value:entry.display_value,state:entry.state,wp_id:view.wp_id,parent_wp_id:view.wp_id==='WP0'?null:'WP0',stage_role:slot==='I'?'EXTERNAL_INPUT':slot==='O'?'FINAL_OUTPUT':slot==='C'?(/(?:整个任务|本任务|the task)/iu.test(globalSpans.map(s=>s.quote).join(' '))?'GLOBAL_COMPLETION':'LOCAL_COMPLETION'):view.wp_id==='WP0'&&['B','V'].includes(slot)?'GLOBAL_CONSTRAINT':null,source_block_ids:structure.blocks.filter(b=>b.wp_id===view.wp_id&&globalSpans.some(s=>s.start<b.source_span.end&&s.end>b.source_span.start)).map(b=>b.block_id),source_spans:globalSpans,scope:entry.scope_expr_id?{local_run_id:view.view_id,expr_id:entry.scope_expr_id}:null,condition:entry.condition_expr_id?{local_run_id:view.view_id,expr_id:entry.condition_expr_id}:null,quantity:entry.quantity_expr_id?{local_run_id:view.view_id,expr_id:entry.quantity_expr_id}:null,boundary_fact_ids:entry.boundary_fact_ids,proof_lineage:{local_run_id:view.view_id,source_sha256:c.source.sha256,canonical_entry_id:entry.canonical_entry_id,source_offset:view.start,local_proof_refs:entry.proof_refs??[],boundary_fact_ids:entry.boundary_fact_ids,contract_gate:run.result.contract_gate_results.status},artifact,produced_by:[],consumed_by:[],facts:structuredClone(facts),predicate_senses:predicateNodes.map(n=>n?.metadata.sense),object_values:objectNodes.map(n=>n?.surface),participant_values:unique(facts.flatMap(f=>f.participant_node_ids).map(i=>ns(i)?.surface)),unresolved_refs:entry.unresolved_refs??[]};
    item.proof_lineage.local_proof_refs=c.proof_dag.nodes.filter(n=>n.canonical_entry_id===entry.canonical_entry_id||entry.boundary_fact_ids.includes(n.boundary_fact_id)).map(n=>n.id);
    items.push(item);byId.set(id,item);local[view.wp_id][slot].items.push(id);
   }
  }
  for(const u of c.unresolved)diagnostics.push({type:u.kind,wp_id:view.wp_id,local_run_id:view.view_id,local_unresolved_id:u.unresolved_id,reason:u.reason,source_spans:u.related_clause_ids.map(id=>c.nlp_signals.clauses.find(x=>x.id===id)?.span).filter(Boolean).map(s=>toGlobal(view,s))});
 }
 const candidates=orchestrationCandidates(doc,structure),edges=[],unresolvedEdges=[];diagnostics.push(...candidates.unresolved);
 for(const edge of candidates.edges){if(edge.state==='UNRESOLVED'){unresolvedEdges.push(edge);continue;}if(edge.type==='REQUIRES_COMPLETION'){const completions=items.filter(i=>i.wp_id===edge.to_wp&&i.slot==='C'&&i.state==='RESOLVED');if(completions.length!==1||local[edge.to_wp].C.status!=='RESOLVED'){unresolvedEdges.push({...edge,state:'UNRESOLVED',reason:'Predecessor completion is not uniquely certified by local R2',candidate_completion_ids:completions.map(i=>i.semantic_item_id)});continue;}edge.completion_item_id=completions[0].semantic_item_id;edge.state='RESOLVED';edge.proof.local_completion_proof=completions[0].proof_lineage;}edges.push(edge);}
 for(const input of items.filter(i=>i.slot==='I'&&i.artifact&&i.wp_id!=='WP0')){
  const producers=items.filter(i=>i.slot==='O'&&i.artifact&&i.semantic_identity===input.semantic_identity&&i.wp_id!==input.wp_id&&i.state==='RESOLVED');
  if(producers.length>1){diagnostics.push({type:'UNRESOLVED_ARTIFACT_PRODUCER',item_id:input.semantic_item_id,candidates:producers.map(i=>i.semantic_item_id)});continue;}
  if(producers.length===1&&input.state==='RESOLVED'){const output=producers[0];input.stage_role='INTERMEDIATE_INPUT';input.produced_by=[output.wp_id];output.stage_role='INTERMEDIATE_OUTPUT';output.consumed_by=unique([...output.consumed_by,input.wp_id]);for(const type of ['PRODUCES_FOR','CONSUMES_OUTPUT'])edges.push({edge_id:uid(type,output.semantic_item_id,input.semantic_item_id),type,state:'RESOLVED',from_wp:type==='PRODUCES_FOR'?output.wp_id:input.wp_id,to_wp:type==='PRODUCES_FOR'?input.wp_id:output.wp_id,output_item_id:output.semantic_item_id,input_item_id:input.semantic_item_id,semantic_identity:input.semantic_identity,source_spans:[...output.source_spans,...input.source_spans],proof:{rule:'SAME_TYPED_FILE_IDENTITY_AND_UNIQUE_CERTIFIED_LOCAL_PRODUCER',local:[output.proof_lineage,input.proof_lineage]}});}
 }
 // References to a root constraint are not copied local BoundaryFacts.
 for(const root of items.filter(i=>i.wp_id==='WP0'&&['B','V'].includes(i.slot)&&i.state==='RESOLVED'))for(const wp of structure.wp_tree.wps.filter(w=>w.wp_id!=='WP0')){
  const targets=items.filter(i=>i.wp_id===wp.wp_id&&i.slot==='I'&&i.semantic_identity===root.semantic_identity);
  if(root.slot==='B'&&targets.length)local[wp.wp_id].B.inherited_refs.push({item_id:root.semantic_item_id,rule:'ROOT_CONSTRAINT_EXPLICIT_OBJECT_IDENTITY',input_item_ids:targets.map(i=>i.semantic_item_id)});
  // A root BASIS is inherited only as an explicit root contract, never from
  // shared strings. Child-local basis mentions remain visible for review.
  if(root.slot==='V'){local[wp.wp_id].V.inherited_refs.push({item_id:root.semantic_item_id,rule:'EXPLICIT_ROOT_BASIS_GOVERNS_CHILD'});edges.push({edge_id:uid('USES_AS_BASIS',wp.wp_id,root.semantic_item_id),type:'USES_AS_BASIS',from_wp:wp.wp_id,to_wp:'WP0',basis_item_id:root.semantic_item_id,state:'RESOLVED',source_spans:root.source_spans,proof:{rule:'EXPLICIT_ROOT_BASIS',local:root.proof_lineage}});}
 }
 for(const wp of Object.values(local))for(const slot of slots)wp[slot].status=status([...wp[slot].items,...wp[slot].inherited_refs.map(x=>x.item_id)].map(id=>byId.get(id)),[wp[slot].status]);
 const matrix={columns:slots,rows:structure.wp_tree.wps.map(w=>({row_id:w.wp_id,cells:Object.fromEntries(slots.map(s=>[s,[...local[w.wp_id][s].items,...local[w.wp_id][s].inherited_refs.map(x=>x.item_id)]]))})),block_rows:structure.blocks.map(b=>({row_id:b.block_id,cells:Object.fromEntries(slots.map(s=>[s,items.filter(i=>i.slot===s&&i.source_block_ids.includes(b.block_id)).map(i=>i.semantic_item_id)]))}))};
 for(const b of structure.blocks){b.local_semantic_items=items.filter(i=>i.source_block_ids.includes(b.block_id)).map(i=>i.semantic_item_id);b.unresolved_items=diagnostics.filter(d=>d.source_spans?.some(s=>s.start<b.source_span.end&&s.end>b.source_span.start));}
 const global=Object.fromEntries(slots.map(slot=>[slot,{status:status(items.filter(i=>i.slot===slot),Object.values(local).map(w=>w[slot].status)),entries:items.filter(i=>i.slot===slot).map(i=>i.semantic_item_id)}]));
 const scheduling=edges.filter(e=>['SEQUENCE','PRODUCES_FOR','REQUIRES_COMPLETION'].includes(e.type)).map(e=>({from:e.type==='REQUIRES_COMPLETION'?e.to_wp:e.from_wp,to:e.type==='REQUIRES_COMPLETION'?e.from_wp:e.to_wp,evidence_edge_id:e.edge_id}));
 const reachable=(from,to,seen=new Set())=>{if(from===to)return true;if(seen.has(from))return false;seen.add(from);return scheduling.filter(e=>e.from===from).some(e=>reachable(e.to,to,seen));};
 const cyclic=scheduling.filter(e=>reachable(e.to,e.from));if(cyclic.length)diagnostics.push({type:'ORCHESTRATION_CYCLE',edges:cyclic,state:'UNRESOLVED'});
 return {compiler_version:'0.3-7p-matrix-017-r1',source:doc.source,blocks:structure.blocks,wp_tree:structure.wp_tree,source_views:structure.views,syntax_gaps:structure.syntax_gaps,local_7plus1:local,semantic_items:items,semantic_matrix:matrix,dependency_dag:{edges,unresolved_edges:unresolvedEdges,scheduling_edges:scheduling,acyclic:cyclic.length===0},canonical_7plus1:global,diagnostics,local_runs:localRuns,first_divergence:diagnostics[0]??unresolvedEdges[0]??null};
}
export async function parseMatrix(input,{signalsByView}={}){
 const doc=sourceDocument(input),structure=recoverStructure(doc),localRuns=[];
 for(const view of structure.views){const localDoc=sourceDocument(view.source_span.quote),signals=signalsByView?.[view.view_id]??await analyze(localDoc);localRuns.push({view_id:view.view_id,wp_id:view.wp_id,source_span:view.source_span,result:compileNative(localDoc,structuredClone(signals),{run_id:uid(doc.source.sha256,view.view_id),created_at:'2026-10-03T00:00:00.000Z'})});}
 return composeMatrix(doc,structure,localRuns);
}
// The short entry is exactly the validated engine; no alternate slot rules.
export const parse7Plus1=shortParse;
