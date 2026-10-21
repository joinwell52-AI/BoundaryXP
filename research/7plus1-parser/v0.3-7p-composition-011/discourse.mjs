import {id} from './identity.mjs';
import {plainHeading,imperativePrefix,directiveLayer} from './instruction-syntax.mjs';

// These are document genres and section roles, not business entities or fixture vocabulary.
const genre=/(?:prompt|spec(?:ification)?|document|文档|规范|提示词|说明书)/iu;
const author=/(?:编写|撰写|起草|新建|修订|修改|生成|落一份|write|draft|author|create)/iu;
const content=/(?:正文|内容|行为约束|章节|段式|段都|场景.*表|contents?|body|instructions?)/iu;
const role=title=>/背景|background|历史|history|现场|现状|observations?|current state/iu.test(title)?'BACKGROUND':/理由|动机|rationale/iu.test(title)?'RATIONALE':/决策|decision/iu.test(title)?'DECISION':/不做|不实现|不修改|out.of.scope|anti.scope|non.goals/iu.test(title)?'OUT_OF_SCOPE':/验收|acceptance|criteria/iu.test(title)?'ACCEPTANCE':/示例|example/iu.test(title)?'EXAMPLE':/交付|必做|目标|deliverables?|required|goals?/iu.test(title)?'DELIVERABLE_SPEC':null;
export function annotateDocument(doc){
 const {raw_text,sha256}=doc.source,points=[...raw_text],blocks=doc.structure.nodes.filter(n=>n.type!=='TABLE_CELL');
 const authoring=blocks.some(b=>!['CODE_BLOCK','CODE_FENCE'].includes(b.type)&&author.test(b.source_span.quote)&&genre.test(b.source_span.quote));
 const annotations=[],headings=[],lists=[];let meta=false,table=null,descriptiveContinuation=null;
 for(const b of blocks){const q=b.source_span.quote,trim=q.trim(),markup=!['CODE_BLOCK','CODE_FENCE'].includes(b.type),heading=markup?/^\s*(#{1,6})\s+(.+)/u.exec(q):null,bullet=markup?/^(\s*)(?:(\d+)[.)]|[-*+])\s+(.*)/u.exec(q):null,indent=/^\s*/u.exec(q)[0].length;
  if(b.type==='YAML_DELIMITER'){meta=!meta;}
  let markerSpan=null;
  if(heading){descriptiveContinuation=null;const prior=headings.at(-1);while(headings.length&&headings.at(-1).level>=heading[1].length)headings.pop();lists.length=0;
   const title=heading[2],parent=headings.at(-1),explicit=role(plainHeading(title)),kind=explicit??(authoring&&(content.test(plainHeading(title))||/^§\s*\d/u.test(title)&&prior?.kind==='OUTPUT_CONTENT')?'OUTPUT_CONTENT':parent?.kind??'CURRENT_TASK');
   headings.push({id:b.id,level:heading[1].length,kind,title});markerSpan={start:b.source_span.start,end:b.source_span.start+[...q.slice(0,q.indexOf(heading[2]))].length};
  }
  if(bullet){while(lists.length&&lists.at(-1).indent>=bullet[1].length)lists.pop();
   const bodyTitle=bullet[3].replace(/\*|`/gu,'');
   lists.push({id:b.id,indent:bullet[1].length,kind:authoring&&/^(?:内容|正文|行为约束|contents?|body|instructions?)/iu.test(bodyTitle)?'OUTPUT_CONTENT':lists.at(-1)?.kind??headings.at(-1)?.kind??'CURRENT_TASK'});
  }else if(markup&&trim&&!heading&&lists.length&&indent<=lists.at(-1).indent&&!/^\s*\*\*/u.test(q))lists.length=0;
  let kind=lists.at(-1)?.kind??headings.at(-1)?.kind??'CURRENT_TASK',owner=lists.at(-1)?.id??headings.at(-1)?.id??'document';
  if(meta||b.type==='YAML_DELIMITER')kind='METADATA';
  else if(['CODE_BLOCK','CODE_FENCE'].includes(b.type))kind='CODE';
  else if(/^\s*>/u.test(q))kind='QUOTE';
  else if(['TABLE_ROW','TABLE_ALIGNMENT'].includes(b.type))kind='TABLE';
  const inherited_kind=lists.at(-1)?.kind??headings.at(-1)?.kind??'CURRENT_TASK';
  if(markup&&trim&&!heading&&!bullet){
   descriptiveContinuation=['BACKGROUND','RATIONALE'].includes(inherited_kind)&&/[:：]\s*$/u.test(q)&&/(?:没覆盖|未覆盖|未包含|缺少|does not cover|not included|missing)/iu.test(plainHeading(q))?{structure_id:b.id,source_span:b.source_span}:null;
  }
  if(kind==='TABLE'){if(!table)table={table_id:id(sha256,'table',b.id),header_row_id:null};if(b.role==='HEADER')table.header_row_id=b.id;}else if(trim)table=null;
  const a={annotation_id:id(sha256,'discourse',b.id),structure_id:b.id,kind,inherited_kind,owner_structure_id:owner,structural_path:['document',...headings.map(h=>h.id),...lists.map(l=>l.id)].filter((v,i,a)=>a.indexOf(v)===i),source_span:b.source_span,heading_marker_span:markerSpan,...(bullet&&descriptiveContinuation?{descriptive_list_header:descriptiveContinuation}:{}),...(table&&kind==='TABLE'?{table_id:table.table_id,row_id:b.id,header_row_id:table.header_row_id,cells:doc.structure.nodes.filter(c=>c.parent===b.id).map(c=>({cell_id:c.id,column_id:table.table_id+':column:'+c.column_index,column_index:c.column_index,source_span:c.source_span,header_cell_id:table.header_row_id+':cell:'+c.column_index}))}:{})};annotations.push(a);
 }
 return {authoring_document:authoring,annotations,source_sha256:sha256,rule:'MARKUP_HIERARCHY_AND_DOCUMENT_GENRE',raw_source_unchanged:true};
}
const inactive=new Set(['BACKGROUND','RATIONALE','EXAMPLE','CODE','QUOTE','TABLE','METADATA','OUTPUT_CONTENT']);
export function boundaryDomain(scope){return scope&&!inactive.has(scope.kind);}
export function prepareDiscourse(f){
 const d=annotateDocument(f.doc);f.discourse=d;
 const inquiryGovernors=d.annotations.filter(x=>['CURRENT_TASK','DELIVERABLE_SPEC'].includes(x.kind)&&/(?:回答以下问题|回答下列问题|answer (?:the )?following questions)\s*[:：]/iu.test(x.source_span.quote));
 for(const a of f.analyses){const line=d.annotations.find(x=>x.source_span.start<=a.cl.span.start&&x.source_span.end>a.cl.span.start);a.discourse={...line,kind:line?.kind??'CURRENT_TASK'};
  // An explicit locative document-content complement starts at the content predicate,
  // not at a nearby document noun. Sentence siblings inherit only this declared domain.
  const q=a.cl.span.quote,m=/(?:prompt|spec(?:ification)?|文档|规范|提示词|说明书)(?:\s*中|\s*内|\s+must\s+contain|\s+contains?)\s*(?:要求|写|包含|规定|须|必须)?/iu.exec(q);
  if(m)a.discourse={...a.discourse,kind:'OUTPUT_CONTENT',content_marker_span:{start:a.cl.span.start+[...q.slice(0,m.index)].length,end:a.cl.span.start+[...q.slice(0,m.index+m[0].length)].length}};
  const primary=a.cl.tokens.find(t=>/^root$/iu.test(t.dep??'')&&/^(?:VV|VERB)$/u.test(t.pos??'')),layer=primary&&directiveLayer(a.discourse,primary.start);
  if(layer?.reason==='ENCLOSED_PREDICATE_LAYER'&&layer.open_delimiters.some(ch=>['”','」','』','"',"'"].includes(ch))){
   a.discourse={...a.discourse,kind:'QUOTE',syntactic_layer:'QUOTED_PREDICATE',quoted_predicate_span:{start:primary.start,end:primary.end}};
  }
  // Questions under an explicit answer-the-following header are content to
  // investigate/report. An embedded command in the question is not execution.
  if(['CURRENT_TASK','DELIVERABLE_SPEC'].includes(a.discourse.kind)&&/[?？]\s*$/u.test(line?.source_span.quote??'')){
   const governors=inquiryGovernors.filter(g=>g.source_span.start<line.source_span.start&&a.discourse.structural_path.includes(g.owner_structure_id));
   if(governors.length===1){const g=governors[0];a.discourse={...a.discourse,kind:'OUTPUT_CONTENT',syntactic_layer:'INTERROGATIVE_CONTENT',inquiry_governor_structure_id:g.structure_id,inquiry_governor_span:g.source_span};(d.inquiry_layers??=[]).push({clause_id:a.cl.id,source_span_ids:[a.sid,f.tools.span(g.source_span.start,g.source_span.end)],governor_structure_id:g.structure_id,structural_path:a.discourse.structural_path,rule:'EXPLICIT_STRUCTURAL_INQUIRY_CONTENT'});}
   else if(/[?？]/u.test(a.cl.delimiter??'')){
    a.discourse={...a.discourse,syntactic_layer:'UNBOUND_INTERROGATIVE',interrogative_not_asserted:true};
    for(const event of a.events){event.metadata.modality='UNSTATED';event.metadata.modality_unresolved=f.tools.unknown(a.cl,'UNRESOLVED_RELATION','Interrogative modality is not an asserted task obligation',[event.node_id]);}
   }
  }
  if(['BACKGROUND','RATIONALE'].includes(a.discourse.kind)){
   const root=a.cl.tokens.find(t=>/^root$/iu.test(t.dep??'')&&/^(?:VV|VERB)$/u.test(t.pos??'')),prefix=root?[...q].slice(0,root.start-a.cl.span.start).join(''):null;
   const directive=!a.discourse.descriptive_list_header&&(root&&directiveLayer(a.discourse,root.start).allowed&&imperativePrefix(prefix)||root&&/^\s*(?:[-*+]\s+|\d+[.)]\s*)?(?:必须|务必|须|不得|禁止|严禁|must|shall|do not)\s*$/iu.test(prefix));
   if(directive){a.discourse={...a.discourse,kind:'CURRENT_TASK',inherited_kind:line.kind,mixed_section:true,directive_marker_span:{start:a.cl.span.start,end:root.start}};(d.mixed_section_children??=[]).push({clause_id:a.cl.id,parent_structure_id:line.owner_structure_id,source_span_ids:[a.sid],rule:'EXPLICIT_DIRECTIVE_INSIDE_CONTEXT_SECTION'});}
  }
  // Described agents in an authored document's amendment are embedded subjects;
  // the amendment's source/version provenance is retained independently.
  if(d.authoring_document&&a.discourse.structural_path?.some(s=>d.annotations.find(x=>x.structure_id===s)?.source_span.quote.match(/修订说明|amendment note/iu))&&/agent\s*(?:必须|不准|不得|应|must|shall)/iu.test(q.replaceAll('*','')))a.discourse={...a.discourse,kind:'OUTPUT_CONTENT'};
  const dash=/(?:写|write)(?:—{1,2}|[:：])/iu.exec(q);
  if(d.authoring_document&&dash)a.discourse={...a.discourse,kind:'OUTPUT_CONTENT',content_marker_span:{start:a.cl.span.start+[...q.slice(0,dash.index)].length,end:a.cl.span.start+[...q.slice(0,dash.index+dash[0].length)].length}};
  const preceding=f.analyses.find(p=>p.cl.sentence_id===a.cl.sentence_id&&p.cl.span.end<a.cl.span.start&&p.discourse?.content_marker_span);
  if(preceding&&!/^(?:本任务|当前任务|this task)/iu.test(q))a.discourse={...a.discourse,kind:'OUTPUT_CONTENT',content_marker_span:preceding.discourse.content_marker_span};
  const listMarker=/^\s*(?:\d+[.)]|[-*+])\s+/u.exec(line?.source_span.quote??'');
  const markerEnd=listMarker?line.source_span.start+[...listMarker[0]].length:null;
  const onlyListMarker=markerEnd!==null&&a.cl.span.start>=line.source_span.start&&a.cl.span.end<=markerEnd&&/^[\d.)*+\-\s]+$/u.test(q);
  const headingTitle=line?.heading_marker_span&&plainHeading((line.source_span.quote.replace(/^\s*#{1,6}\s+/u,'')));
  const roleHeading=headingTitle&&/^(?:范围|目标|修法|现场|测试|关联|背景|历史|理由|动机|决策|验收(?:标准|条件)?|不做|交付(?:物)?|必做|正文|内容|scope|goals?|background|history|rationale|decision|tests?|acceptance(?: criteria)?|deliverables?|required|contents?|body)$/iu.test(headingTitle);
  if((onlyListMarker||roleHeading)&&!a.events.length){a.handled=true;a.structure_only=true;a.source_accountability={state:'NON_BOUNDARY',reason:onlyListMarker?'EXPLICIT_LIST_MARKER':'EXPLICIT_SECTION_ROLE_MARKER',source_span_ids:[a.sid],structure_id:line.structure_id};}
  a.discourse.domain_id=id(f.source.sha256,'domain',a.discourse.kind,a.discourse.owner_structure_id);
  if(!boundaryDomain(a.discourse))a.parent_structure_id=a.discourse.domain_id;
  for(const n of f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id))n.metadata.discourse=a.discourse;
 }
 // Whole quoted/code/heading marker nodes are not arguments, even when the NLP model tags them NR.
 for(const n of f.semantic_nodes){const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);if(a)n.metadata.discourse=a.discourse;}
 d.structural_accountability=f.analyses.filter(a=>a.source_accountability).map(a=>({clause_id:a.cl.id,...a.source_accountability}));
 f.semantic_decoding.discourse=d;return f;
}
export function finalDiscourse(f){
 for(const n of f.semantic_nodes){const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id);if(a)n.metadata.discourse=a.discourse;}
 const outputs=f.relations.filter(r=>r.relation_type==='RESULT'&&r.state==='RESOLVED'&&boundaryDomain(f.semantic_nodes.find(n=>n.node_id===r.head_node_id)?.metadata.discourse)).map(r=>r.tail_node_id);
 f.semantic_decoding.discourse.output_content_requirements=f.analyses.filter(a=>a.discourse.kind==='OUTPUT_CONTENT').map(a=>({requirement_id:id(f.source.sha256,'output-content',a.cl.id),scope:'OUTPUT_CONTENT',source_span_ids:[a.sid],clause_id:a.cl.id,structural_path:a.discourse.structural_path,semantic_node_ids:f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id).map(n=>n.node_id),relation_ids:f.relations.filter(r=>r.clause_id===a.cl.id).map(r=>r.relation_id),owning_output_candidates:outputs,ownership_status:outputs.length===1?'UNIQUE_OUTPUT':'UNRESOLVED_OUTPUT_SET',content_parsing_status:a.handled?'PARTIAL_TYPED_CONTENT':'UNSUPPORTED_CONTENT'}));
 return f;
}
