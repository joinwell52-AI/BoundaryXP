import {createHash} from 'node:crypto';import {lexical} from '../v0.3-7p-composition-014/typed-literals.mjs';
export const uid=(...x)=>'matrix:'+createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0,24);
export const slots=['I','O','A','P','R','V','C','B'];
const compact=s=>s.replace(/\s/gu,'');
function stageHeader(text){
 const start=text.match(/^(.{1,24}?(?:阶段|检查))(?=由|读取|必须|只能|只有在|开始)/u)?.[1];
 if(start&&!/^(?:本|这|两|二|三|四|所有|各|每|全部|第[一二三四五六七八九十\d]+阶段完成)/u.test(start))return start;
 const join=text.match(/[，,]\s*([^，,。]{1,16}阶段)开始/u)?.[1];return join??null;
}
export function recoverStructure(doc){
 const points=[...doc.source.raw_text],literals=lexical(doc),blocks=[],gaps=[];let start=0;
 for(let i=0;i<=points.length;i++){
  if(i<points.length&&(literals.some(l=>l.span.start<=i&&l.span.end>i)||!/[。.!?！？\n]/u.test(points[i])))continue;
  const rawEnd=i<points.length?i+1:i;let a=start,b=rawEnd;while(a<b&&/\s/u.test(points[a]))a++;while(b>a&&/\s/u.test(points[b-1]))b--;
  if(start<a)gaps.push(doc.span(start,a));if(b<rawEnd)gaps.push(doc.span(b,rawEnd));
  if(b>a)blocks.push({block_id:'B'+(blocks.length+1),order:blocks.length,source_span:doc.span(a,b),block_type:'SENTENCE_GROUP',discourse_domain:'CURRENT_TASK',candidate_wp_owner:[],local_semantic_items:[],unresolved_items:[]});start=rawEnd;
 }
 const wps=[{wp_id:'WP0',parent_wp_id:null,stage_label:'ROOT_TASK',declaration_span:doc.span(0,0),block_ids:[],local_run_ids:[]}],diagnostics=[];let active='WP0';
 for(const b of blocks){
  const text=b.source_span.quote,label=stageHeader(text);
  if(label){let wp=wps.find(w=>compact(w.stage_label)===compact(label));if(!wp){wp={wp_id:'WP'+wps.length,parent_wp_id:'WP0',stage_label:label,declaration_span:b.source_span,block_ids:[],local_run_ids:[]};wps.push(wp);}active=wp.wp_id;}
  const parent=doc.structure.nodes.find(n=>n.source_span.start<=b.source_span.start&&n.source_span.end>=b.source_span.end),siblings=blocks.filter(x=>parent&&x.source_span.start>=parent.source_span.start&&x.source_span.end<=parent.source_span.end);
  const globalRestriction=/^(不得|禁止|不允许)/u.test(text)&&siblings.length===1&&!label;
  const rootDeclaration=/^本任务/u.test(text)&&active==='WP0';
  const orchestration=/(?:可(?:以)?并行|同时进行|并发执行|阶段.*完成后.*开始|检查.*完成后.*开始)/u.test(text);
  const globalOnly=globalRestriction||rootDeclaration||orchestration&&!label;
  const owner=globalOnly?'WP0':active;b.candidate_wp_owner=[owner];b.wp_id=owner;b.block_type=globalRestriction?'ROOT_CONSTRAINT':rootDeclaration?'ROOT_DECLARATION':orchestration?'ORCHESTRATION':label?'STAGE_DECLARATION':'LOCAL_TASK';
  wps.find(w=>w.wp_id===owner).block_ids.push(b.block_id);
 }
 if(wps.length>4)diagnostics.push({type:'UNSUPPORTED_WP_DEPTH_OR_COUNT',reason:'017 supports at most three sibling child WPs',wp_ids:wps.map(w=>w.wp_id)});
 // Exact contiguous views, not paragraph=WP: neighboring same-owner blocks
 // can span paragraphs; a root constraint breaks a child view explicitly.
 const views=[];for(const b of blocks){const last=views.at(-1);if(last?.wp_id===b.wp_id){last.block_ids.push(b.block_id);last.end=b.source_span.end;}else views.push({view_id:'view:'+(views.length+1),wp_id:b.wp_id,block_ids:[b.block_id],start:b.source_span.start,end:b.source_span.end});}
 for(const v of views){v.source_span=doc.span(v.start,v.end);wps.find(w=>w.wp_id===v.wp_id).local_run_ids.push(v.view_id);}
 return {blocks,wp_tree:{root:'WP0',wps},views,syntax_gaps:gaps,diagnostics,source_accountability:'Blocks plus exact whitespace spans preserve every source codepoint'};
}
export function orchestrationCandidates(doc,structure){
 const {blocks,wp_tree:{wps}}=structure,edges=[],unresolved=[];
 const add=(type,from,to,b,extra={})=>edges.push({edge_id:uid(doc.source.sha256,type,from,to,b.block_id),type,from_wp:from,to_wp:to,state:'CANDIDATE',source_spans:[b.source_span],proof:{rule:'EXPLICIT_ORCHESTRATION_SYNTAX',block_id:b.block_id},...extra});
 const children=wps.filter(w=>w.parent_wp_id==='WP0');
 for(const b of blocks){const q=b.source_span.quote;
  const named=children.filter(w=>compact(q).includes(compact(w.stage_label))),target=b.wp_id!=='WP0'?children.find(w=>w.wp_id===b.wp_id):null;
  const prior=children.filter(w=>w.declaration_span.start<b.source_span.start&&w!==target);
  const count=q.match(/([两二三四\d])个[^，。]{0,8}阶段/u)?.[1],number=count?({'两':2,'二':2,'三':3,'四':4}[count]??Number(count)):null;
  const collective=number&&prior.length===number?prior:[];
  const positive=/(?:可(?:以)?并行|允许并行|同时进行|并发执行)/u.test(q)&&!/(?:不得|禁止|不允许|不能|不可)[^。]{0,8}(?:并行|同时|并发)/u.test(q);
  if(positive){const domain=named.length===2?named:collective;if(domain.length===2)add('PARALLEL',domain[0].wp_id,domain[1].wp_id,b,{state:'RESOLVED',proof:{rule:'POSITIVE_PARALLEL_PERMISSION_AND_UNIQUE_TWO_SIBLINGS',block_id:b.block_id,declaration_spans:domain.map(w=>w.declaration_span)}});else unresolved.push({type:'UNRESOLVED_ORCHESTRATION_DOMAIN',source_span:b.source_span,reason:'Positive parallel permission lacks a unique two-WP domain'});}
  if(!target||!/(?:完成后|完成之后).*开始/u.test(q))continue;
  const predecessors=named.filter(w=>w!==target),domain=predecessors.length?predecessors:collective;
  if(!domain.length){unresolved.push({type:'UNRESOLVED_COMPLETION_PREDECESSOR',source_span:b.source_span,target_wp:target.wp_id});continue;}
  const and=domain.length>1&&/(?:都完成|全部完成|均完成)/u.test(q);
  if(domain.length>1&&!and){unresolved.push({type:'UNRESOLVED_JOIN_OPERATOR',source_span:b.source_span});continue;}
  for(const w of domain){add('REQUIRES_COMPLETION',target.wp_id,w.wp_id,b,{enable_wp:target.wp_id,join_operator:and?'AND':null,join_id:and?uid(doc.source.sha256,'join',b.block_id):null});if(domain.length===1)add('SEQUENCE',w.wp_id,target.wp_id,b,{state:'RESOLVED'});}
 }
 for(const edge of edges.filter(e=>e.type==='PARALLEL')){const conflict=edges.find(e=>e.type==='SEQUENCE'&&[edge.from_wp,edge.to_wp].includes(e.from_wp)&&[edge.from_wp,edge.to_wp].includes(e.to_wp));if(conflict){edge.state=conflict.state='UNRESOLVED';edge.reason=conflict.reason='Contradictory explicit ordering constraints';unresolved.push({type:'CONTRADICTED_ORCHESTRATION',edge_ids:[edge.edge_id,conflict.edge_id]});}}
 return {edges,unresolved};
}
