import {id,uniq} from '../../v0.3-7p-composition-014/identity.mjs';
import {boundaryDomain} from '../../v0.3-7p-composition-014/discourse.mjs';
import {predicateEnclosure,buildSemanticOwnership} from '../../v0.3-7p-composition-014/semantic-ownership.mjs';
import {PREDICATE_WORDS} from './lexical.mjs';
import {srlPredicate,predicateLayer} from '../predicate-ownership.mjs';

// A finite predicate lexicon generates graph candidates, never slot values.
// Every candidate below still goes through ownership, Eligibility, the frozen
// graph views, source/proof verification and slot-local coverage.
const WORDS={read:['读取','查看','read'],review:['检查','核查','核对','核验','复核','审查','inspect','check','review'],generate:['生成','编写','创建','generate','create','write'],send:['提交','交给','发送','send','sends'],modify:['修改','改动','更改','change','modify'],delete:['删除','delete'],restore:['恢复','restore'],connect:['连接','connect'],load:['加载','load'],run:['发起','执行','运行','perform','execute'],call:['调用','call'],coordinate:['协调','coordinate'],adjust:['调整','adjust'],rebuild:['重建','rebuild'],report:['汇报','上报','报告','report'],install:['安装','install'],merge:['合并','merge'],explain:['解释','explain'],aggregate:['汇总','汇合','aggregate'],notify:['通知','notify'],stop:['停止','stop'],restart:['重启','restart'],approve:['批准','审批','approve'],receive:['接收','收到','receive'],locate:['定位','locate'],analyze:['分析','analyze'],record:['记录','record'],upload:['上传','upload'],download:['下载','download'],train:['训练','train'],sync:['同步','sync'],overwrite:['覆盖','overwrite'],replace:['更换','replace'],change:['改变'],classify:['判为','判定','判断'],allocate:['分配'],repair:['修复','repair'],add:['新增','add'],write:['写入'],compare:['对比','compare'],statistics:['统计','count']};
const dict=new Map(Object.entries({...WORDS,...PREDICATE_WORDS}).filter(([s])=>!['complete','confirm','retry'].includes(s)).flatMap(([sense,words])=>words.map(w=>[w,sense])));
const matcher=new RegExp([...dict.keys()].sort((a,b)=>b.length-a.length).map(w=>/^[a-z]/u.test(w)?'\\b'+w+'\\b':w).join('|'),'giu');
const rolePrefix=/^[A-Z][A-Z0-9_-]{1,15}$/u;
const nonExecution=/^(?:只有|若|如果|当|未经|未获|if\b|when\b|unless\b)|(?:确认|confirm(?:s)?\b).*(?:后|after\b)|(?:已|已经|has been|have been).*(?:生成|generated)|(?:任务|task).*(?:才完成|complete)/iu;
const content=/^(?:文档|报告|document|report).*(?:包含|写入|说明|列出|contain)|^(?:必须|须)?(?:列出|写明|标记)/iu;
const cps=s=>[...s].length;
const trimRange=(cp,start,end)=>{while(start<end&&/\s/u.test(cp[start]))start++;while(end>start&&/[\s。.!?！？]/u.test(cp[end-1]))end--;return {start,end,text:cp.slice(start,end).join('')};};

export function closeAdminRoot(f){
 const cp=[...f.source.raw_text],{node,relation,span,task}=f.tools;
 const log={version:'ADMIN_ROOT_018',root_scope:'ADMIN_ROOT_SINGLE_AUTHORITY_SCOPE',rules:[],rejections:[],retired_diagnostics:[],unhandled:[],WP_decomposition:false};f.semantic_decoding.admin_root=log;
 const mentions=[],outputs=[],explicitRoles=new Map(f.semantic_nodes.filter(n=>n.metadata.participant_eligibility?.eligible&&n.metadata.participant_roles?.length).map(n=>[n.node_id,[...n.metadata.participant_roles]]));
 const sourceSpan=n=>f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 const markRole=(actor,role,evidence)=>{actor.metadata.participant_eligibility={eligible:true,reason:'EXPLICIT_PARTICIPATION_SYNTAX',source_span_ids:uniq(evidence)};actor.metadata.participant_roles=uniq([...(explicitRoles.get(actor.node_id)??[]),role]);explicitRoles.set(actor.node_id,actor.metadata.participant_roles);};
 const make=(list,body)=>{const expr={expr_id:id(f.source.sha256,'expr',body),...body};if(!list.some(x=>x.expr_id===expr.expr_id))list.push(expr);return expr.expr_id;};
 function edge(a,type,h,t,extra=[]){const r=relation(a.cl,type,h,t,[a.sid,...extra]);if(r){r.state='SUPPORTED';delete r.unresolved_ref;r.evidence_tier='HARD';r.rule_refs=uniq([...r.rule_refs,'ADMIN_ROOT_LOCAL_TYPED_SYNTAX']);}return r;}
 function person(a,start,end,role){const range=trimRange(cp,start,end);if(!range.text)return null;const candidate=node(a.cl,'ENTITY',range.start,range.end,{literal_tag:'PERSON',sense:'PARTICIPANT_IDENTITY',owner:a.cl.id,discourse:a.discourse});markRole(candidate,role,[a.sid,...candidate.source_span_ids]);mentions.push({a,node:candidate});return candidate;}
 function actorRange(a,range){
  if(!range.text)return null;
  const text=range.text.replace(/^(?:(?:请|请由|最后|并|此次|本次|由|and\b|then\b|by\b|please\b)\s*)+/iu,'').replace(/(?:\s*(?:组织|完成|进行|开展|organize|organise|只负责|负责|才能|必须|可以|最后|统一|立即|明确|只|仅|must|may))+\s*$/iu,'').trim();
  if(!text)return null;const start=range.start+cps(range.text.slice(0,range.text.indexOf(text))),end=start+cps(text);
  const ner=a.cl.entities?.some(e=>['PERSON','PER'].includes(e.label)&&e.span.start>=start&&e.span.end<=end);
  const names=a.cl.tokens.filter(t=>t.start>=start&&t.end<=end&&/^(NR|PROPN)$/u.test(t.pos??''));
  const explicitSubject=/^[A-Z][a-z]+$/u.test(text)&&a.cl.tokens.some(t=>t.start===start&&t.end===end&&/^nsubj$/u.test(t.dep??''));
  if(explicitSubject)return {start,end};
  if(rolePrefix.test(text)||ner||names.length&&a.cl.tokens.filter(t=>t.start>=start&&t.end<=end).every(t=>/^(NR|NN|PROPN|NOUN)$/u.test(t.pos??'')))return {start,end};
  const coordinated=text.split(/\s*(?:和|与|及|、|\band\b)\s*/iu);if(coordinated.length>1&&coordinated.every(x=>rolePrefix.test(x)))return {start,end,members:coordinated.map(x=>({start:start+cps(text.slice(0,text.indexOf(x))),end:start+cps(text.slice(0,text.indexOf(x)))+cps(x)}))};
  return null;
 }
 function retire(a,why){
  const ids=new Set(f.semantic_nodes.filter(n=>n.metadata.clause_id===a.cl.id).map(n=>n.node_id));
  for(const r of f.relations.filter(r=>r.clause_id===a.cl.id)){r.state='REJECTED';delete r.unresolved_ref;}
  for(const e of a.events){delete e.unresolved_ref;delete e.metadata.modality_unresolved;e.metadata.retired_by_admin_root=why;f.expression_plans.delete(e.node_id);}
  const removed=f.unresolved.filter(u=>u.related_clause_ids.length===1&&u.related_clause_ids[0]===a.cl.id&&u.related_node_ids.every(i=>ids.has(i)));
  log.retired_diagnostics.push(...removed.map(u=>({...structuredClone(u),replacement_evidence_span_ids:[a.sid],reason:why})));f.unresolved=f.unresolved.filter(u=>!removed.includes(u));a.events=[];a.handled=true;
  const retiredIds=new Set(removed.map(u=>u.unresolved_id));for(const n of f.semantic_nodes)if(retiredIds.has(n.unresolved_ref)){delete n.unresolved_ref;n.state='RESOLVED';n.metadata.retired_by_admin_root=why;}
 }
 function setPlan(a,e,objects,rs){
  if(!objects.length)return;
  const items=objects.map((n,i)=>make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:uniq([a.sid,...n.source_span_ids]),relation_ids:[rs[i].relation_id]}));
  const quantifier=objects.length===1?/^(?:所有|全部|每)/u.test(objects[0].surface)?'ALL':/^(?:任一|任何)/u.test(objects[0].surface)?'ANY':null:null;
  const qid=quantifier?make(f.expressions.set_expr_nodes,{kind:quantifier,base_entity_node_id:objects[0].node_id,source_span_ids:[a.sid,...objects[0].source_span_ids],relation_ids:rs.map(r=>r.relation_id)}):items.length===1?items[0]:make(f.expressions.set_expr_nodes,{kind:'UNION',operand_expr_ids:items,source_span_ids:[a.sid],relation_ids:rs.map(r=>r.relation_id)});
  f.expression_plans.set(e.node_id,{scope_expr_id:qid});
 }
 function nominal(a,start,end,{fileOnly=false,eventNominal=false,qualifiedObject=false}={}){
  const r=trimRange(cp,start,end),tokens=a.cl.tokens.filter(t=>t.start>=r.start&&t.end<=r.end);
  const files=f.nlp_signals.literals.filter(l=>l.span.start>=r.start&&l.span.end<=r.end&&['FILE','PATH','IDENTIFIER'].includes(l.type)&&/\.[A-Za-z0-9]{1,8}$/u.test(l.span.quote));
  if(files.length){
   const residue=cp.slice(r.start,r.end).map((ch,i)=>files.some(l=>r.start+i>=l.span.start&&r.start+i<l.span.end)?' ':ch).join('');
   if(!/^(?:\s|和|与|及|、|或|以及|\band\b|\bor\b)+$/iu.test(residue.trim()?residue:' ')){
    if(!qualifiedObject)return null;
    return [node(a.cl,'ENTITY',r.start,r.end,{sense:'LOCAL_OBJECT',owner:a.cl.id,discourse:a.discourse,local_qualifier:r.text,embedded_artifact_spans:files.map(l=>l.span)})];
   }
   return files.map(l=>node(a.cl,'ENTITY',l.span.start,l.span.end,{literal_tag:'FILEPATH',sense:'ARTIFACT',artifact_identity:id('ARTIFACT',l.span.quote),owner:a.cl.id,discourse:a.discourse,literal_id:l.id}));
  }
  if(!r.text||/^(?:时|后|它|其|这些|those|it)$/iu.test(r.text))return null;
  const rs=qualifiedObject?[]:[...r.text.matchAll(/以及|和|与|或|、|\band\b|\bor\b/giu)];
  // Keep local modifiers on the entire nominal if there is no explicit list.
  const parts=[];let pos=r.start;for(const m of rs){const at=r.start+cps(r.text.slice(0,m.index));parts.push(trimRange(cp,pos,at));pos=at+cps(m[0]);}parts.push(trimRange(cp,pos,r.end));
  if(parts.some(p=>!p.text||/^(?:给|向|to\b|before\b|after\b)/iu.test(p.text)))return null;
  // Nominalized complements may be tagged VV (e.g. implementations or
  // configurations). The explicit predicate/complement syntax, not a noun POS
  // majority, licenses this exact argument span.
  return parts.map(p=>node(a.cl,'ENTITY',p.start,p.end,{sense:'LOCAL_OBJECT',owner:a.cl.id,discourse:a.discourse,local_qualifier:p.text}));
 }
 function uniqueOutput(a,text){
  if(!/^(?:报告|检查报告|汇总报告|文档|该报告|该文档|report|the report|it)$/iu.test(text.trim()))return null;
  const domain=[...new Map(outputs.filter(o=>sourceSpan(o).start<a.cl.span.start).map(n=>[n.metadata.artifact_identity??n.surface,n])).values()];
  if(domain.length!==1)return null;
  f.semantic_decoding.argument_domain_certificates??=[];f.semantic_decoding.argument_domain_certificates.push({clause_id:a.cl.id,reference_text:text.trim(),selected_object_ids:[domain[0].node_id],candidate_object_ids:[domain[0].node_id],rule:'UNIQUE_GENERATED_OUTPUT_LOCAL_REFERENCE',source_span_ids:uniq([a.sid,...domain[0].source_span_ids]),relation_ids:f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='RESULT'&&r.tail_node_id===domain[0].node_id).map(r=>r.relation_id)});
  const local=a.cl.span.quote.indexOf(text.trim());if(local>=0){const at=a.cl.span.start+cps(a.cl.span.quote.slice(0,local));const ref=node(a.cl,'ENTITY',at,at+cps(text.trim()),{sense:'LOCAL_ARTIFACT_REFERENCE',owner:a.cl.id,discourse:a.discourse});const r=edge(a,'COREFERENCE',ref,domain[0],[...domain[0].source_span_ids]);f.semantic_decoding.object_alias_ir??=[];if(!f.semantic_decoding.object_alias_ir.some(x=>x.relation_id===r.relation_id))f.semantic_decoding.object_alias_ir.push({reference_node_id:ref.node_id,object_node_id:domain[0].node_id,relation_id:r.relation_id,rule:'UNIQUE_GENERATED_OUTPUT_LOCAL_REFERENCE',source_span_ids:uniq([a.sid,...ref.source_span_ids,...domain[0].source_span_ids])});}
  return domain[0];
 }
 for(const a of f.analyses){
  const raw=a.cl.span.quote;
  if(f.retained_typed_clause_ids?.has(a.cl.id))continue;
  if(a.r2_nonexecution||!boundaryDomain(a.discourse)||content.test(raw)||(nonExecution.test(raw)&&!a.condition_layer&&!/(?:不得|禁止|不允许)/u.test(raw))||predicateEnclosure({start:a.cl.span.start,quote:raw},a.cl.span.start).length){log.unhandled.push({clause_id:a.cl.id,reason:'DOMAIN_OR_NESTED_PREDICATE_NOT_A_SIMPLE_DIRECTIVE',source_span_ids:[a.sid]});continue;}
  // Time constraints require an explicit task-wide target, not a nearby verb.
  const duration=/(?:整个|全部|本次|此次).*(?:任务|核查|检查|排查)|\b(?:entire|whole) task\b/iu.test(raw)?/(?:在\s*|超过\s*|within\s+)(\d+)\s*(分钟|minutes?)/iu.exec(raw):null;
  if(duration&&/(?:须|必须|不得超过|must)/iu.test(raw)){
   const at=a.cl.span.start+cps(raw.slice(0,duration.index)),digits=at+cps(duration[0].slice(0,duration[0].indexOf(duration[1]))),value=node(a.cl,'VALUE',digits,digits+cps(duration[1]),{sense:'SCALAR',comparator:'LTE',owner:a.cl.id,discourse:a.discourse});
   retire(a,'EXPLICIT_TASK_WIDE_DURATION');const witness=edge(a,'LIMIT',task,value);
   const expr=make(f.expressions.quantity_expr_nodes,{metric:'TIME',target_node_ids:[task.node_id],upper_bound:{inclusive:true,value:Number(duration[1])},unit:duration[2],value_node_ids:[value.node_id],source_span_ids:[a.sid,...value.source_span_ids],relation_ids:[witness.relation_id]});
   f.expression_plans.set(task.node_id,{quantity_expr_id:expr});value.metadata.quantity_classification={resource_eligible:true,category:'EXECUTION_RESOURCE'};
   log.rules.push({rule:'EXPLICIT_TASK_WIDE_DURATION',clause_id:a.cl.id,relation_ids:[witness.relation_id],quantity_expr_id:expr,source_span_ids:[a.sid]});continue;
  }
  const exact=[...raw.matchAll(matcher)].map(m=>({text:m[0],sense:dict.get(m[0].toLowerCase()),start:a.cl.span.start+cps(raw.slice(0,m.index)),end:a.cl.span.start+cps(raw.slice(0,m.index))+cps(m[0])}));
  // The real NLP lemma is a candidate, with the inflected token's exact span.
  // It cannot override a literal or turn a noun modifier into a root action.
  const lemma=a.cl.tokens.filter(t=>/^(VERB|VV)$/u.test(t.pos??'')&&dict.has(t.lemma?.toLowerCase())).map(t=>({text:t.text,sense:dict.get(t.lemma.toLowerCase()),start:t.start,end:t.end}));
  const lexicalVerbs=[...new Map([...exact,...lemma].map(v=>[v.start+':'+v.end,v])).values()].sort((a,b)=>a.start-b.start).filter((v,index)=>{
   const tokens=a.cl.tokens.filter(t=>t.start>=v.start&&t.end<=v.end),head=tokens[0];
   if(!head||!tokens.some(t=>t.end===v.end)||head.start!==v.start)return false;
   if(predicateLayer(a.cl,head).kind!=='MAIN')return false;
   if(/^(NN|NOUN)$/u.test(head.pos??'')&&/^(dobj|obj)$/u.test(head.dep??'')&&/^(停止|中止|终止|stop|abort)$/iu.test(a.cl.tokens[head.head]?.text??''))return false;
   const localDirective=v.start===a.cl.span.start&&['read','review','compare','statistics'].includes(v.sense),coordinated=/不得|禁止|must not|do not/iu.test(raw)&&/[、或并且和与]\s*$/u.test(cp.slice(a.cl.span.start,v.start).join(''))&&/^(NN|NOUN)$/u.test(head.pos??'')&&/^compound/u.test(head.dep??'')&&/^(NN|NR|NOUN|PROPN)$/u.test(a.cl.tokens[head.head]?.pos??'');
   if(!/^(?:VV|VERB)$/u.test(head.pos??'')&&!srlPredicate(a.cl,head)&&/^(?:compound|nmod|amod|attr)/u.test(head.dep??'')&&!localDirective&&!coordinated)return false;
   return (!a.r2_execution_start||v.start>=a.r2_execution_start)&&(v.text.toLowerCase()!=='report'&&v.text!=='报告'||/^(VV|VERB)$/u.test(head.pos??'')||/向\s*[^\s]+\s*(?:统一|升级)?$/u.test(cp.slice(a.cl.span.start,v.start).join('')))&&!f.nlp_signals.literals.some(l=>l.span.start<=v.start&&l.span.end>=v.end&&['FILE','PATH','IDENTIFIER','VERSION','REFERENCE'].includes(l.type));
  });
  // A lexical predicate inside the argument is not another root predicate.
  // Subsequent roots require an overt coordination/temporal connector.
  const verbs=lexicalVerbs.filter((v,i)=>!i||/(?:并|及|以及|和|或|、|\band\b|\bor\b|\bbefore\s+|\bafter\s+)\s*(?:\s*(?:向|给|to|由|by)\s*)?(?:[\p{L}\p{N}_-]+\s+)?(?:必须|须|可以|重新|再|must(?:\s+not)?|may)?\s*$/iu.test(cp.slice(a.cl.span.start,v.start).join('')));if(!verbs.length)continue;
  const selectedVerbs=a.r2_execution_start?verbs.filter(v=>v.start>=a.r2_execution_start):verbs;if(!selectedVerbs.length)continue;verbs.splice(0,verbs.length,...selectedVerbs);
  const first=verbs[0];let prefix=trimRange(cp,a.r2_execution_start??a.cl.span.start,first.start);if(a.basis_header){prefix=trimRange(cp,a.cl.span.start,a.basis_header.prefix_end);}if(a.r2_assignment_actor)prefix=a.r2_assignment_actor;const forbidden=/(?:不得|禁止|严禁|不允许|do not|must not|不执行|不在本任务中)/iu.test(raw.slice(0,raw.indexOf(first.text)+cps(first.text))),withdrawn=/(?:无需|不要求|not required|need not)/iu.test(prefix.text);
  if(withdrawn)continue;
  let actor=actorRange(a,prefix),coordinator=a.r2_coordinator??null,preposedRecipient=null,preposedObject=null,environment=null;
  const location=/^(.+?)\s*(?:只|仅)?在(.+?)\s*$/u.exec(prefix.text);if(location){const x=trimRange(cp,prefix.start,prefix.start+cps(location[1]));const who=actorRange(a,x);if(who){actor=who;const pos=prefix.start+cps(prefix.text.slice(0,prefix.text.indexOf(location[2])));environment=trimRange(cp,pos,pos+cps(location[2]));}}
  if(['send','report','notify'].includes(first.sense)){
   const pre=/^(.+?)\s*(?:向|to\s+)(.+?)\s*$/iu.exec(prefix.text);
   if(pre){const s=prefix.start+cps(prefix.text.slice(0,prefix.text.indexOf(pre[1]))),r=prefix.start+cps(prefix.text.slice(0,prefix.text.lastIndexOf(pre[2])));actor=actorRange(a,{start:s,end:s+cps(pre[1]),text:pre[1]});preposedRecipient=actorRange(a,{start:r,end:r+cps(pre[2]),text:pre[2]});}
  }
  const disposal=/^(.*?)\s*(?:将|把)(.+?)\s*$/u.exec(prefix.text);if(disposal){const s=prefix.start+cps(prefix.text.slice(0,prefix.text.indexOf(disposal[1]))),o=prefix.start+cps(prefix.text.slice(0,prefix.text.lastIndexOf(disposal[2])));actor=actorRange(a,{start:s,end:s+cps(disposal[1]),text:disposal[1]});preposedObject=trimRange(cp,o,o+cps(disposal[2]));}
  // Explicit assignment has two roles: the assigner and the governed actor.
  const assignment=/^(.+?)\s*(?:安排|assigns?)\s+(.+?)\s*(?:to\s+)?$/iu.exec(prefix.text);
  if(assignment){const p1=prefix.start+cps(prefix.text.slice(0,prefix.text.indexOf(assignment[1]))),p2=prefix.start+cps(prefix.text.slice(0,prefix.text.lastIndexOf(assignment[2])));const x=actorRange(a,{start:p1,end:p1+cps(assignment[1]),text:assignment[1]}),y=actorRange(a,{start:p2,end:p2+cps(assignment[2].replace(/\s+to\s*$/iu,'')),text:assignment[2].replace(/\s+to\s*$/iu,'')});if(x&&y){coordinator=x;actor=y;}else continue;}
  const inherited=mentions.filter(x=>x.a.cl.sentence_id===a.cl.sentence_id&&x.a.cl.span.end<a.cl.span.start&&x.node.metadata.participant_roles.includes('PERFORMER'));
  const domain=[...new Map(inherited.map(x=>[x.node.surface,x.node])).values()];
  const imperative=/^(?:随后|接着|然后|next\b|then\b|并|也|请|只|仅|将|把|才能|才可|可以|必须|立即|分别|不得|禁止|otherwise\b|do not\b|please\b|must\b|may\b|and\b)/iu.test(prefix.text)||!prefix.text;
  if(!actor&&!forbidden&&!imperative)continue;
  // A purpose recipient is explicitly governed by transfer, not a new action.
  const purpose=first.sense==='send'&&/^(?:并)?交给\s*/u.test(raw)?/^(?:并)?交给\s*(.+?)\s*(复核|审核)$/u.exec(raw):null;
  const specs=[];
  if(purpose){const target=uniqueOutput(a,'报告');const recipientStart=a.cl.span.start+cps(raw.slice(0,raw.indexOf(purpose[1]))),candidate=actorRange(a,{start:recipientStart,end:recipientStart+cps(purpose[1]),text:purpose[1]});if(!target||!candidate)continue;specs.push({verb:first,objects:[target],reviewer:candidate,modality:'REQUIRED'});}
  else for(const [i,v] of verbs.entries()){
   const end=verbs[i+1]?verbs[i+1].start:a.r2_execution_end??a.cl.span.end;
   let range=trimRange(cp,v.end,end),recipient=preposedRecipient,localActor=null,temporal=null;
   if(i&&/(?:\bbefore\s+|\bafter\s+)/iu.test(cp.slice(verbs[i-1].end,v.start).join(''))){
    const between=cp.slice(verbs[i-1].end,v.start).join(''),mark=/(?:\bbefore\s+|\bafter\s+)/iu.exec(between),start=verbs[i-1].end+cps(between.slice(0,mark.index))+cps(mark[0]),r=trimRange(cp,start,v.start);localActor=actorRange(a,r);temporal=mark[0].trim().toUpperCase();if(!localActor){specs.length=0;break;}
   }
   const boundary=/(?:\bbefore\s+|\bafter\s+)/iu.exec(range.text);if(boundary)range=trimRange(cp,range.start,range.start+cps(range.text.slice(0,boundary.index)));
   const next=verbs[i+1];if(next){range=trimRange(cp,v.end,range.end);range.text=range.text.replace(/(?:并|及|和|或|以及|、|and|or)(?:\s*(?:向|给|to)\s*[\p{L}\p{N}_-]+)?\s*(?:重新|再|must(?:\s+not)?|may)?\s*$/iu,'').trim();range.end=range.start+cps(range.text);}
   if(i&&['send','report','notify'].includes(v.sense)){const between=cp.slice(verbs[i-1].end,v.start).join(''),pre=/(?:并|and)\s*(?:向|to\s+)(.+?)\s*$/iu.exec(between);if(pre){const start=verbs[i-1].end+cps(between.slice(0,pre.index))+cps(pre[0].slice(0,pre[0].indexOf(pre[1])));recipient=actorRange(a,{text:pre[1],start,end:start+cps(pre[1])});}}
   if(['send','report','notify'].includes(v.sense)){
    if(preposedObject&&i===0){const rec=range.text.replace(/^(?:给|向|to)\s*/iu,'');const at=range.end-cps(rec);recipient=actorRange(a,{text:rec,start:at,end:range.end})??(rec?{start:at,end:range.end,text:rec,nonParticipant:true}:null);range=preposedObject;}
    const rec=/(?:给|向|to\s+)([\s\S]+)$/iu.exec(range.text);if(rec){const start=range.start+cps(range.text.slice(0,rec.index))+cps(rec[0].slice(0,rec[0].indexOf(rec[1])))+cps(rec[1])-cps(rec[1].trimStart());const text=rec[1].trim();recipient=actorRange(a,{start,end:start+cps(text),text})??(text?{start,end:start+cps(text),text,nonParticipant:true}:null);range=trimRange(cp,range.start,range.start+cps(range.text.slice(0,rec.index)));}
   }
   if(preposedObject&&i===0&&!['send','report','notify'].includes(v.sense)){const complement=range;range=preposedObject;if(complement.text){f.semantic_decoding.predicate_complements??=[];f.semantic_decoding.predicate_complements.push({predicate_span:{start:v.start,end:v.end},complement_span:{start:complement.start,end:complement.end},complement_text:complement.text,source_span_ids:[a.sid],rule:'EXPLICIT_DISPOSAL_OBJECT_WITH_LOCAL_COMPLEMENT'});}}
   if((v.sense==='report'||v.text==='交给')&&!recipient){const candidate=actorRange(a,range);if(candidate){recipient=candidate;range={start:range.end,end:range.end,text:''};}}
   let objects=['send','report','review','receive'].includes(v.sense)&&uniqueOutput(a,range.text)?[uniqueOutput(a,range.text)]:nominal(a,range.start,range.end,{fileOnly:v.sense==='generate',eventNominal:['run','locate','statistics','analyze','classify'].includes(v.sense),qualifiedObject:['read','review'].includes(v.sense)});
   if(!objects?.length&&['send','report'].includes(v.sense)&&recipient){const local=specs.filter(s=>s.verb.sense==='generate').flatMap(s=>s.objects);const output=local.length===1?local[0]:uniqueOutput(a,'报告');if(output)objects=[output];}
   if(objects?.length&&['send','report'].includes(v.sense)&&!range.text){f.semantic_decoding.argument_domain_certificates??=[];f.semantic_decoding.argument_domain_certificates.push({clause_id:a.cl.id,reference_text:'IMPLICIT_OUTPUT',selected_object_ids:objects.map(n=>n.node_id),candidate_object_ids:objects.map(n=>n.node_id),rule:'EXPLICIT_TRANSFER_OF_UNIQUE_LOCAL_RESULT',source_span_ids:uniq([a.sid,...objects.flatMap(n=>n.source_span_ids)]),relation_ids:[]});}
   if(!objects?.length&&next&&/^(?:\s|或|和|及|、|重新|再|and|or)*$/iu.test(cp.slice(v.end,next.start).join('')))objects=[];
   if(!objects){specs.length=0;break;}
   const between=i?cp.slice(verbs[i-1].end,v.start).join(''):prefix.text;
   const modality=forbidden||/(?:不得|must not|do not)/iu.test(between)?'FORBIDDEN':/(?:可以|允许|才能|才可|\bmay\b|\bcan\b)/iu.test(between)?'PERMITTED':'REQUIRED';
   if(v.sense==='notify'&&objects?.length===1){const target=actorRange(a,{start:range.start,end:range.end,text:range.text});if(target)recipient=target;}
   specs.push({verb:v,objects,recipient,modality,localActor,temporal});
  }
  for(let i=specs.length-2;i>=0;i--)if(!specs[i].objects.length&&specs[i+1].objects.length&&specs[i].modality===specs[i+1].modality)specs[i].objects=specs[i+1].objects;
  if(!specs.length||specs.some(s=>!s.objects.length))continue;
  const prior=[...a.events];
  // Preserve accepted R2 subjects on the exact predicate use-site. No new
  // nearest-text or document-wide assignment inference is introduced here.
  const priorSubjects=new Map(prior.map(e=>[sourceSpan(e).start,f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='AGENT'&&r.head_node_id===e.node_id).map(r=>f.semantic_nodes.find(n=>n.node_id===r.tail_node_id))]));
  retire(a,'CLOSED_LOCAL_PREDICATE_ARGUMENT_DOMAIN');
  const firstRole=['coordinate','allocate'].includes(first.sense)?'COLLABORATOR':first.sense==='receive'?'RECIPIENT':first.sense==='review'&&/^(?:复核|review)$/iu.test(first.text)?'REVIEWER':'PERFORMER';
  const actorNodes=actor?.members?actor.members.map(x=>person(a,x.start,x.end,firstRole)):actor?[person(a,actor.start,actor.end,firstRole)]:!forbidden&&domain.length===1?[domain[0]]:[];
  const actorNode=actorNodes[0]??null;
  if(environment){const n=node(a.cl,'ENTITY',environment.start,environment.end,{sense:'EXECUTION_ENVIRONMENT',owner:a.cl.id,discourse:a.discourse});const r=edge(a,'SCOPE_MEMBER',task,n);f.relation_scope_plans.set(r.relation_id,make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:n.node_id,source_span_ids:[a.sid,...n.source_span_ids],relation_ids:[r.relation_id]}));}
  if(coordinator){const n=person(a,coordinator.start,coordinator.end,'COLLABORATOR');const st=node(a.cl,'STATE',coordinator.end,actor.start,{sense:'EXPLICIT_ASSIGNMENT',owner:a.cl.id,discourse:a.discourse});edge(a,'AGENT',st,n);a.state=st;}
  let previousEvent=null;
  for(const s of specs){
   const metadata={sense:s.verb.sense,owner:a.cl.id,discourse:a.discourse,modality:s.modality,stop:s.verb.sense==='stop'&&s.modality!=='FORBIDDEN',modality_rule:'EXPLICIT_ROOT_DIRECTIVE_SYNTAX',frame_certification:{state:'CANDIDATE_SUPPORTED',boundary_role:'EXECUTION',frame_id:id(a.cl.id,'admin',s.verb.start),source_span_ids:[a.sid]}};
   const e=node(a.cl,'EVENT',s.verb.start,s.verb.end,metadata);Object.assign(e.metadata,metadata);e.state='RESOLVED';delete e.metadata.modality_unresolved;delete e.unresolved_ref;a.events.push(e);
   const rs=s.objects.map(o=>edge(a,s.modality==='FORBIDDEN'?'FORBIDS':s.verb.sense==='generate'?'RESULT':['send','report'].includes(s.verb.sense)?'THEME':'PATIENT',e,o));setPlan(a,e,s.objects,rs);
   const accepted=priorSubjects.get(s.verb.start)??[];
   const eventActor=s.localActor?person(a,s.localActor.start,s.localActor.end,'PERFORMER'):actorNode??(accepted.length===1?accepted[0]:null);
   if(eventActor&&s.modality!=='FORBIDDEN'){const role=['coordinate','allocate'].includes(s.verb.sense)?'COLLABORATOR':s.verb.sense==='receive'?'RECIPIENT':s.verb.sense==='review'&&/^(?:复核|review)$/iu.test(s.verb.text)?'REVIEWER':'PERFORMER';for(const n of actor?.members&&!s.localActor?actorNodes:[eventActor]){markRole(n,role,[a.sid,...n.source_span_ids]);edge(a,'AGENT',e,n);}}
   if(s.temporal&&previousEvent){
    const before=s.temporal==='BEFORE'?previousEvent:e,after=s.temporal==='BEFORE'?e:previousEvent;
    const st=node(a.cl,'STATE',sourceSpan(before).start,sourceSpan(before).end,{sense:'EVENT_COMPLETED',owner:a.cl.id,discourse:a.discourse,event_node_id:before.node_id,object_node_ids:f.relations.filter(r=>r.head_node_id===before.node_id&&r.state==='SUPPORTED'&&['PATIENT','RESULT','THEME'].includes(r.relation_type)).map(r=>r.tail_node_id)});
    const rel=edge(a,'CONDITION_OF',st,after),expr=make(f.expressions.condition_expr_nodes,{op:'STATE_REF',state_node_id:st.node_id,source_span_ids:[a.sid,...st.source_span_ids],relation_ids:[rel.relation_id]});f.expression_plans.set(after.node_id,{...f.expression_plans.get(after.node_id),condition_expr_id:expr});edge(a,'SEQUENCE',before,after);log.rules.push({rule:'EXPLICIT_TEMPORAL_SUBJECT_LAYER',condition_expr_id:expr,source_span_ids:[a.sid],actor_node_id:eventActor?.node_id,relation_ids:[rel.relation_id]});
   }
   if(s.reviewer){const n=person(a,s.reviewer.start,s.reviewer.end,'REVIEWER');const reviewVerb=lexicalVerbs.find(v=>v.sense==='review');const metadata={sense:'review',owner:a.cl.id,discourse:a.discourse,modality:'REQUIRED',modality_rule:'EXPLICIT_TRANSFER_PURPOSE',frame_certification:{state:'CANDIDATE_SUPPORTED',boundary_role:'EXECUTION',frame_id:id(a.cl.id,'review-purpose'),source_span_ids:[a.sid]}};const reviewed=node(a.cl,'EVENT',reviewVerb.start,reviewVerb.end,metadata);Object.assign(reviewed.metadata,metadata);delete reviewed.metadata.modality_unresolved;delete reviewed.unresolved_ref;a.events.push(reviewed);edge(a,'AGENT',reviewed,n);edge(a,'RECIPIENT',e,n);markRole(n,'RECIPIENT',[a.sid]);const rs=s.objects.map(o=>edge(a,'PATIENT',reviewed,o));setPlan(a,reviewed,s.objects,rs);edge(a,'CONJUNCTION',e,reviewed);}
   if(s.recipient){const n=s.recipient.nonParticipant?node(a.cl,'ENTITY',s.recipient.start,s.recipient.end,{sense:'DISPATCH_DESTINATION',owner:a.cl.id,discourse:a.discourse}):person(a,s.recipient.start,s.recipient.end,'RECIPIENT');edge(a,'RECIPIENT',e,n);}
   if(s.verb.sense==='generate'&&s.modality!=='FORBIDDEN')outputs.push(...s.objects);
   if((['read','review','locate','explain','analyze','compare','statistics'].includes(s.verb.sense)||s.verb.sense==='run'&&s.objects.some(o=>/检查|check|inspection/iu.test(o.surface)))&&s.modality!=='FORBIDDEN')for(const object of s.objects){
    // Reviewing this task's output is not a new external input.
    if(outputs.some(n=>n.node_id===object.node_id||n.surface===object.surface))continue;
    const r=edge(a,'SCOPE_MEMBER',task,object);f.relation_scope_plans.set(r.relation_id,make(f.expressions.set_expr_nodes,{kind:'ITEM',entity_node_id:object.node_id,source_span_ids:[a.sid,...object.source_span_ids],relation_ids:[r.relation_id]}));
   }
   log.rules.push({rule:'CLOSED_LOCAL_PREDICATE_ARGUMENT_DOMAIN',clause_id:a.cl.id,event_node_id:e.node_id,object_node_ids:s.objects.map(n=>n.node_id),actor_node_id:eventActor?.node_id??null,retired_event_ids:prior.map(n=>n.node_id),source_span_ids:[a.sid],relation_ids:f.relations.filter(r=>r.state==='SUPPORTED'&&r.head_node_id===e.node_id).map(r=>r.relation_id)});previousEvent=e;
  }
 }
 f.tools.attachContext();buildSemanticOwnership(f,'ADMIN_ROOT_FINAL');
 const uids=new Set(f.unresolved.map(u=>u.unresolved_id));for(const b of f.relation_bundles){b.unresolved_refs=b.unresolved_refs.filter(i=>uids.has(i));b.relation_ids=uniq(f.relations.filter(r=>b.clause_ids.includes(r.clause_id)).map(r=>r.relation_id));b.bundle_state=b.unresolved_refs.length?'PARTIALLY_RESOLVED':'RESOLVED';}
 f.admin_explicit_roles=explicitRoles;return f;
}

// The shared eligibility engine adds PERFORMER to every EVENT AGENT. Retain
// only roles with a certified participation use-site in this candidate.
export function finalizeAdminRoles(f){
 const people=f.semantic_nodes.filter(n=>n.metadata.participant_eligibility?.eligible),nm=id=>f.semantic_nodes.find(n=>n.node_id===id);
 for(const n of people){if(n.metadata.identity_name)continue;const names=uniq(people.filter(p=>(p.surface===n.surface||p.metadata.identity_name===n.surface)&&p.metadata.identity_name).map(p=>p.metadata.identity_name));if(names.length===1)n.metadata.identity_name=names[0];}
 const identity=n=>n.metadata.identity_name??n.surface,executors=new Set(f.relations.filter(r=>r.state==='SUPPORTED'&&r.relation_type==='AGENT'&&nm(r.head_node_id).node_type==='EVENT'&&['REQUIRED','PERMITTED'].includes(nm(r.head_node_id).metadata.modality)&&!nm(r.head_node_id).metadata.retired_reason).map(r=>identity(nm(r.tail_node_id))));
 for(const n of people){const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id),text=a?.cl.span.quote??'';if(text.includes(n.surface)&&/(?:负责(?:这项|本项|此项|本|此|这)?(?:工作|任务)|is responsible for (?:this |the )?task)/iu.test(text))executors.add(identity(n));}
 const identities=new Map();for(const [key,roles] of f.admin_explicit_roles??[]){const n=nm(key),name=identity(n),supported=roles.filter(role=>role!=='PERFORMER'||executors.has(name));identities.set(name,uniq([...(identities.get(name)??[]),...supported]));}for(const n of people){const roles=identities.get(identity(n));if(roles)n.metadata.participant_roles=roles;}return f;
}


