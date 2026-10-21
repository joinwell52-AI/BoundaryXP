import {uniq} from './identity.mjs';
import {boundaryDomain} from './discourse.mjs';
import {comparatorIn,scalarAfter} from './grammar.mjs';

const roles=new Set(['PERFORMER','APPROVER','REVIEWER','RECIPIENT','COLLABORATOR']);
const pronoun=/^(?:本身|这|那|谁|谁们|什么|哪个|它们?|他们?|她们?|我们|该|其|上述|we|us|it|they|them|this|that|who|whom|someone)$/iu;
const technical=/^[#*`|\s]+$|(?:\.[a-z]{1,6}\b|\(.*\)|::|\/|\\)|^(?:pip|npm|git|python|node)\s|(?:Error|Schema|Config|Event|Enum|API|generator|模块|接口|枚举|计数|prompt|schema|diff|RETRY|ESCALATE)$/u;
function evidence(f,n){
 const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id),sp=f.source_spans.find(s=>s.span_id===n.source_span_ids[0]);
 if(!a||!boundaryDomain(a.discourse)&&a.discourse.kind!=='METADATA')return {eligible:false,reason:'NON_CURRENT_DISCOURSE'};
 if(n.node_type==='UNKNOWN_REFERENT'||pronoun.test(n.surface))return {eligible:false,reason:'UNRESOLVED_IDENTITY'};
 const inlineCode=[...a.cl.span.quote.matchAll(/`([^`\n]+)`/gu)].some(m=>{const start=a.cl.span.start+[...a.cl.span.quote.slice(0,m.index)].length;return start<sp.start&&start+[...m[0]].length>sp.end;});
 if(inlineCode&&!/^[A-Z][A-Z0-9_-]{1,20}$/u.test(n.surface))return {eligible:false,reason:'INLINE_CODE_IS_NOT_IDENTITY'};
 if(technical.test(n.surface)||['FILEPATH','URI','VERSION','COMMIT','NUMBER','DURATION','SYSTEM'].includes(n.metadata.literal_tag))return {eligible:false,reason:'NON_PARTICIPANT_TYPE'};
 const ner=a.cl.entities.filter(e=>['PERSON','PER'].includes(e.label)&&e.span.start>=sp.start&&e.span.end<=sp.end).filter(e=>{
  const prefix=[...f.source.raw_text].slice(sp.start,e.span.start).join('').trim(),suffix=[...f.source.raw_text].slice(e.span.end,sp.end).join('').trim();
  return !prefix&&!suffix||!suffix&&/(?:工程师|经理|主管|专员|管理员|编辑|负责人|复核人|审核人|engineer|manager|supervisor|editor|reviewer|administrator)$/iu.test(prefix);
 });
 const namedTokens=a.cl.tokens.filter((t,i)=>t.start>=sp.start&&t.end<=sp.end&&/^\p{Script=Han}{2,4}$/u.test(t.text)&&(a.cl.pos_alternatives?.['pos/pku']?.[i]==='nr'||a.cl.pos_alternatives?.['pos/863']?.[i]==='nh'));
 const prefix=[...a.cl.span.quote].slice(0,sp.start-a.cl.span.start).join(''),suffix=[...a.cl.span.quote].slice(sp.end-a.cl.span.start).join('');
 const declaration=/^(?:sender|recipient)\s*[:：]\s*$/iu.test(prefix.trim())&&a.discourse.kind==='METADATA';
 const explicit=/(?:由|交给|提交给|提交|发送给|通知|向|by|to)\s*$/iu.test(prefix)||/^\s*(?:负责|审核|复核|审查|审批|批准|同意|授权|协作|is responsible|reviews?\b|approves?\b|approval\b)/iu.test(suffix);
 const roleCode=/^(?:[A-Z][A-Z0-9_-]{1,20}|(?:agent|代理|角色)[-_\s]*[A-Za-z0-9]+)$/u.test(n.surface)&&explicit;
 // ROLE_PHRASE is the recognizer's exact named-role evidence; POS=NR alone is never used.
 const namedRole=n.metadata.literal_tag==='ROLE';
 return {eligible:declaration||ner.length>0||namedTokens.length>0||namedRole||roleCode||explicit,reason:declaration?'FRONTMATTER_IDENTITY':ner.length?'PERSON_NER':namedTokens.length?'PERSON_NAME_TAG':namedRole?'EXPLICIT_ROLE_PHRASE':roleCode?'EXPLICIT_ROLE_CODE':explicit?'RESPONSIBILITY_SYNTAX':'SRL_AGENT_IS_NOT_IDENTITY',source_span_ids:n.source_span_ids,ner_evidence:ner,name_token_evidence:namedTokens.map(t=>t.id)};
}
export function participantEligibility(f){
 const ledger=[];
 for(const n of f.semantic_nodes.filter(n=>['ENTITY','UNKNOWN_REFERENT'].includes(n.node_type))){const e=evidence(f,n);n.metadata.participant_eligibility=e;
  if(!e.eligible){delete n.metadata.participant_roles;if(n.metadata.literal_tag==='PERSON')delete n.metadata.literal_tag;}
  else n.metadata.participant_roles=(n.metadata.participant_roles??[]).filter(r=>roles.has(r));
  if(f.relations.some(r=>r.tail_node_id===n.node_id&&['AGENT','RECIPIENT'].includes(r.relation_type)))ledger.push({node_id:n.node_id,...e});
 }
 // Source aliases may inherit identity only from one independently eligible endpoint.
 for(const n of f.semantic_nodes.filter(n=>!n.metadata.participant_eligibility?.eligible)){
  const refs=uniq([n.metadata.referent_node_id,...(n.metadata.resolution?.selected_node_ids??[])]).map(i=>f.semantic_nodes.find(x=>x.node_id===i)).filter(x=>x?.metadata.participant_eligibility?.eligible);
  if(refs.length===1&&n.state==='RESOLVED'){n.metadata.participant_eligibility={eligible:true,reason:'UNIQUE_VERIFIED_IDENTITY',antecedent_node_id:refs[0].node_id,source_span_ids:uniq([...n.source_span_ids,...refs[0].source_span_ids])};n.metadata.participant_roles=[...(refs[0].metadata.participant_roles??[])];}
 }
 f.semantic_decoding.participant_eligibility=ledger;return f;
}
export function prepareQuantityTargets(f){
 for(const a of f.analyses){if(!boundaryDomain(a.discourse))continue;
  const marker=comparatorIn(a.cl),count=scalarAfter(a.cl,marker);if(!count)continue;
  const chars=[...a.cl.span.quote],suffix=chars.slice(count.end-a.cl.span.start).join('');
  // Duration modifying a state is a threshold on that state, not on an adjacent verb.
  const m=/^\s*(天|日|小时|分钟|秒|days?|hours?|minutes?|seconds?)\s*(无回应|无响应|未响应|未处理|未完成|未活动|without\s+(?:response|activity)|unanswered|inactive)/iu.exec(suffix);
  if(m){const end=count.end+[...m[0]].length;const target=f.tools.node(a.cl,'DISCOURSE',marker.start,end,{sense:'DURATION_STATE_THRESHOLD',quantity_class:'THRESHOLD',state_span_id:f.tools.span(count.end+[...m[0]].length-[...m[2]].length,end),discourse:a.discourse});a.quantity_target=target;a.handled=true;}
 }
 return f;
}
export function classifyQuantity(f,n,head){
 const a=f.analyses.find(a=>a.cl.id===n.metadata.clause_id),q=a?.cl.span.quote??'',expr=f.expressions?.quantity_expr_nodes.find(e=>e.value_node_ids.includes(n.node_id)),unit=expr?.unit;
 let type='NUMBER';
 if(n.metadata.literal_tag==='VERSION'||/版本|version/iu.test(q))type='VERSION';
 else if(head?.metadata.quantity_class==='THRESHOLD')type='THRESHOLD';
 else if(/第\s*[\d一二三四五六七八九十]+/u.test(q))type='ORDINAL';
 else if(unit&&/分钟|小时|秒|天|日|minutes?|hours?|seconds?|days?/iu.test(unit))type='DURATION';
 else if(/截止|deadline|before.*\d{4}-\d{2}/iu.test(q))type='DEADLINE';
 else if(unit&&/元|美元/iu.test(unit)||/预算|成本|budget|cost/iu.test(q))type='BUDGET';
 else if(/内存|容量|并发|memory|capacity|concurren/iu.test(q)||unit&&/bytes?|MB|GB/iu.test(unit))type='CAPACITY';
 else if(head?.node_type==='EVENT'&&head.metadata.modality==='PERMITTED'&&expr?.upper_bound&&unit&&/次|轮|批|件|times?/iu.test(unit))type='LIMIT';
 else if(/测试|tests?/iu.test(q))type='COUNT_OF_TEST';
 else if(/验收|acceptance|criteria|anti.pattern/iu.test(q))type='COUNT_OF_CRITERIA';
 else if(/枚举|enum/iu.test(q))type='ENUM_COUNT';
 else if(/schema|文件|报告|清单|commits?|outputs?|artifacts?/iu.test(q))type='COUNT_OF_OUTPUT';
 else if(/上限|资源|限额|quota|resource limit/iu.test(q))type='LIMIT';
 const eligible=['DURATION','DEADLINE','BUDGET','CAPACITY','LIMIT','THRESHOLD'].includes(type)&&boundaryDomain(a?.discourse);
 return {classification:type,resource_eligible:eligible,source_span_ids:uniq([...n.source_span_ids,...(a?[a.sid]:[])]),target_node_id:head?.node_id,unit:unit??null,discourse:a?.discourse,reason:eligible?'EXPLICIT_RESOURCE_OR_STATE_LIMIT':'QUANTITY_DOES_NOT_IMPLY_RESOURCE'};
}
