import {id,uniq} from '../v0.3-7p-composition-014/identity.mjs';
import {buildSemanticOwnership} from '../v0.3-7p-composition-014/semantic-ownership.mjs';
import {graphApi,length} from './graph-api.mjs';
export function prepareOwnership(f){for(const a of f.analyses){const text=a.cl.span.quote;const review=/^\s*(?:[A-Z][A-Z0-9_-]*|[\p{Script=Han}]{2,8})\s*(?:确认|复核|审核).*后$/u.test(text);const current=/^(?:不执行|不得|禁止|严禁)/u.test(text)&&/文档|报告/u.test(text);if(a.discourse.kind==='OUTPUT_CONTENT'&&(review||current)){a.discourse={...a.discourse,kind:'CURRENT_TASK',ownership_recovery_rule:'EXPLICIT_OUTER_REVIEW_OR_CONSTRAINT'};for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id))n.metadata.discourse=a.discourse;}}return f;}
// Discourse classification is separate from execution candidate generation.
// The requirement keeps its own source even when its words resemble actions.
export function closeContentAndStructure(f){
 const {retire,edge,outputs}=graphApi(f),records=f.semantic_decoding.discourse.output_content_requirements;
 f.semantic_decoding.output_content_ir={requirements:[],structural_nodes:[]};const log=f.semantic_decoding.output_content_ir;
 for(const a of f.analyses){const raw=a.cl.span.quote;
  const retained=records.find(q=>q.clause_id===a.cl.id&&q.ownership_status==='UNIQUE_OUTPUT'&&(['TYPED_CONTENT','TYPED_OUTPUT_SECTION'].includes(q.content_parsing_status)));
  if(retained){log.requirements.push(retained);continue;}
  if(/^#{1,6}\s+\S/u.test(raw)){
   retire(a,'MARKDOWN_HEADING_IS_STRUCTURAL');const n=f.tools.node(a.cl,'DISCOURSE',a.cl.span.start,a.cl.span.end,{sense:'SECTION_HEADING',discourse:a.discourse,owner:a.discourse.owner_structure_id});log.structural_nodes.push({node_id:n.node_id,clause_id:a.cl.id,source_span_ids:[a.sid],structural_path:a.discourse.structural_path});continue;
  }
  const explicit=/^(?:并|也)?(?:在)?(?:报告|文档|指南|纪要|report|document|guide)\s*(?:中|里|内)?\s*(?:必须|须|应|要|must)?\s*(?:逐项|明确|原样|分别|单独)?\s*(?:包含|写入|写明|列出|说明|记录|contain|include)/iu.test(raw)||/在报告中(?:单独)?列出/u.test(raw)||/(?:应|必须)(?:列入报告|标记为|标为)/u.test(raw)&&!/不得|禁止/u.test(raw)||/保持待确认/u.test(raw);
  const list=/^(?:(?:必须|须|否则)\s*)?(?:列出|写明|标记|单独列出|分别列出)/u.test(raw);
  const recorded=/^(?:必须|须|应)?(?:在报告中|在文档中|标记为|记为)/u.test(raw)&&/(?:待确认|未确认|无差异|已批准|记录)/iu.test(raw);
  if(!explicit&&!list&&!recorded&&a.discourse.kind!=='OUTPUT_CONTENT')continue;
  const owners=outputs(a);if(!owners.length)continue;
  const title=/(?:报告|文档|指南|report|document|guide)/iu.exec(raw);
  const specific=f.nlp_signals.literals.filter(l=>['FILE','PATH'].includes(l.type)&&l.span.start>=a.cl.span.start&&l.span.end<=a.cl.span.end);
  const named=owners.filter(n=>specific.some(l=>l.span.quote===n.surface));const domain=named.length?named:owners;
  retire(a,'OUTPUT_CONTENT_REQUIREMENT_SEPARATED_FROM_EXECUTION');a.discourse={...a.discourse,kind:'OUTPUT_CONTENT'};
  const state=f.tools.node(a.cl,'STATE',a.cl.span.start,a.cl.span.end,{sense:'OUTPUT_CONTENT_REQUIREMENT',owner:a.cl.id,discourse:a.discourse,polarity:'POSITIVE',content_text:raw});a.state=state;
  const relation_ids=domain.length===1?[edge(a,'CONJUNCTION',state,domain[0]).relation_id]:[];
  const requirement={requirement_id:id(f.source.sha256,a.cl.id,'content'),clause_id:a.cl.id,semantic_node_ids:[state.node_id],owner_output_ids:domain.length===1?[domain[0].node_id]:[],ownership_status:domain.length===1?'UNIQUE_OUTPUT':'AMBIGUOUS_OUTPUT',ownership_evidence_relation_ids:relation_ids,source_span_ids:uniq([a.sid,...domain.flatMap(n=>n.source_span_ids)]),content_text:raw,rule:specific.length?'EXPLICIT_ARTIFACT_CONTENT':'UNIQUE_ROOT_OUTPUT_CONTENT_DOMAIN'};
  records.push(requirement);log.requirements.push(requirement);
  if(domain.length!==1){const u=f.tools.unknown(a.cl,'UNRESOLVED_SCOPE','Output-content requirement has multiple explicit output owners',domain.map(n=>n.node_id));state.unresolved_ref=u;state.state='UNRESOLVED';}
 }
 f.tools.attachContext();buildSemanticOwnership(f,'ADMIN_ROOT_019_CONTENT');return f;
}
export function closeEmbeddedInputs(f){const {edge,expr}=graphApi(f);f.semantic_decoding.embedded_artifact_ir=[];
 for(const a of f.analyses)for(const e of a.events){if(!['read','review'].includes(e.metadata.sense)||!['REQUIRED','PERMITTED'].includes(e.metadata.modality))continue;
  for(const r of f.relations.filter(r=>r.state==='RESOLVED'&&r.head_node_id===e.node_id&&r.relation_type==='PATIENT')){
   const object=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);
   for(const s of object.metadata.embedded_artifact_spans??[]){const artifact=f.tools.node(a.cl,'ENTITY',s.start,s.end,{sense:'ARTIFACT',literal_tag:'FILEPATH',artifact_identity:id('ARTIFACT',s.quote),owner:a.cl.id,discourse:a.discourse});const witness=edge(a,'SCOPE_MEMBER',f.tools.task,artifact);const q=expr(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:artifact.node_id,source_span_ids:uniq([a.sid,...artifact.source_span_ids]),relation_ids:[witness.relation_id]});f.relation_scope_plans.set(witness.relation_id,q);f.semantic_decoding.embedded_artifact_ir.push({event_node_id:e.node_id,object_node_id:object.node_id,artifact_node_id:artifact.node_id,source_span_ids:[a.sid,...artifact.source_span_ids],relation_ids:[witness.relation_id]});}
  }
 }return f;}
