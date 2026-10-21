// Read-only views of the model's IR. Never parse source text to fill semantics.
import {compileCore} from '../../../src/bxp/ir-kernel/index.mjs';import {projectCore} from '../../../src/bxp/ir-kernel/projection.mjs';
export function projectDirectIR(ir,acceptance){
 if(ir.contract_version==='candidate-ir/2.0')return projectCore(compileCore(ir));
 const collections=['entities','variables','events','states','expressions','requirements'];
 const nodes=new Map(collections.flatMap(k=>ir[k].map(n=>[n.id,n]))),statuses=new Map(acceptance.rows.map(r=>[r.id,r.status]));
 const labels={REQUIRED:'必须',PERMITTED:'允许',NOT_REQUIRED:'无需',FORBIDDEN:'禁止',UNSTATED:'未明确',PERFORMER:'执行者',ORGANIZER:'组织者',REVIEWER:'复核者',APPROVER:'批准者',RECIPIENT:'接收者',COLLABORATOR:'协作者',INPUT_OBJECT:'输入对象',OBJECT:'对象',RESULT:'结果',DELIVERABLE:'交付物',BASIS:'依据',CONTENT:'内容',ENVIRONMENT:'执行环境'};
 const show=(r,seen=new Set())=>{if(!r)return '未指定';const n=nodes.get(r.id);if(!n)return '缺失引用 '+r.id;if(seen.has(r.id))return n.label??r.id;const next=new Set([...seen,r.id]);
  if(r.kind!=='EXPRESSION')return n.label??r.id;
  const a=n.arguments.map(x=>show(x,next));
  const infix={UNION:'∪',INTERSECTION:'∩',DIFFERENCE:'∖',AND:'∧',OR:'∨',IMPLIES:'⇒',IFF:'⇔',EQ:'=',LT:'<',LTE:'≤',GT:'>',GTE:'≥',ADD:'+',MEMBER:'∈',SUBSET:'⊆',BEFORE:'先于'};
  if(n.operator==='NUMBER'||n.operator==='BOOLEAN')return String(n.literal)+(n.unit?' '+n.unit:'');
  if(n.operator==='SET')return '{'+a.join('，')+'}';
  if(infix[n.operator])return '('+a.join(' '+infix[n.operator]+' ')+')';
  if(n.operator==='GROUP_MEMBERS')return a[0]+'的成员';
  if(n.operator==='TASK_EVENTS')return a[0]+'范围内的全部执行事件（含后续事件）';
  if(n.operator==='TASK_EXTERNAL_INPUTS')return a[0]+'实际使用的外部输入集合';
  if(n.operator==='TRUE_AT_START')return a[1]+'开始时，'+a[0]+'已成立';
  if(n.operator==='IMMEDIATE_AFTER')return a[0]+'触发后，'+a[1]+'立即优先响应（无数值延迟要求）';
  const op={NOT:'非',STATE_VALUE:'状态成立',EVENT_OCCURRED:'事件发生',EVENT_START:'开始时点',EVENT_END:'结束时点',STATE_ESTABLISHED:'状态成立时点',REAL_INTERVAL:'实数区间',INTEGER_RANGE:'整数区间',CARDINALITY:'数量',OBJECT_OF:'对象',RECIPIENT_OF:'接收者',ENVIRONMENT_OF:'环境',EVENT_INSTANCE:'事件实例',PREVIOUS_INSTANCE:'紧邻前次实例',FORALL:'对所有成员',EXISTS:'存在成员'};
  return (op[n.operator]??n.operator)+'('+a.join('，')+')';
 };
 const slots=Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,{status:'ABSENT',items:[]}]));
 const put=(slot,node,text,extra={})=>slots[slot].items.push({id:node.id,node_ref:node.id,text,status:statuses.get(node.id)??'UNRESOLVED',source_refs:node.source_refs,sources:(acceptance.source_links??[]).filter(s=>node.source_refs.includes(s.id)),...extra});
 const refs=value=>!value||typeof value!=='object'?[]:value.kind&&value.id&&Object.keys(value).length===2?[value]:Object.values(value).flatMap(refs);
 const exprNodes=r=>{const seen=new Set(),out=[];const visit=x=>{if(!x||seen.has(x.id))return;seen.add(x.id);const n=nodes.get(x.id);if(!n)return;out.push(n);if(x.kind==='EXPRESSION')n.arguments.forEach(visit);};visit(r);return out;};
 const modalText=r=>(r.applicability?'当'+show(r.applicability)+'时，':'')+labels[r.modality];
 for(const e of ir.events){const norm=ir.requirements.filter(r=>['EVENT_NORM','STOP'].includes(r.kind)&&r.subject?.id===e.id);const gates=ir.requirements.filter(r=>r.kind==='CONSTRAINT'&&r.subject?.id===e.id);
  const modal=norm.map(modalText).join(' / ')||'未明确义务',gateText=gates.map(r=>'；执行时'+modalText(r)+'满足：'+show(r.body)).join('');
  const related=[...norm,...gates],extra={related_requirement_ids:related.map(r=>r.id),status:statuses.get(e.id)==='ACCEPTED'&&related.every(r=>statuses.get(r.id)==='ACCEPTED')?'ACCEPTED':'UNRESOLVED'};
  if(e.use==='CURRENT_TASK'&&e.kind==='ACTION'&&norm.length)put('A',e,modal+'：'+e.label+'；'+e.roles.map(r=>(labels[r.role]??r.role)+'='+show(r.value)).join('；')+gateText,extra);
  for(const role of e.roles){const text=e.label+'：'+labels[role.role]+'='+show(role.value);if(['PERFORMER','ORGANIZER','REVIEWER','APPROVER','RECIPIENT','COLLABORATOR'].includes(role.role))put('P',e,text,{role:role.role,value:role.value});if(role.role==='INPUT_OBJECT')put('I',e,text,{value:role.value});if(['RESULT','DELIVERABLE'].includes(role.role))put('O',e,text+'；'+modal+gateText,{value:role.value,...extra});if(role.role==='BASIS')put('V',e,text,{value:role.value});}
 }
 for(const r of ir.requirements){const body=nodes.get(r.body.id),norm=['EVENT_NORM','STOP'].includes(r.kind),isTrue=body?.operator==='BOOLEAN'&&body.literal===true,sameOccurrence=body?.operator==='EVENT_OCCURRED'&&body.arguments[0]?.id===r.subject?.id;
  const description=norm?(sameOccurrence?show(r.body):'事件发生('+show(r.subject)+')'+(isTrue?'':' 且 '+show(r.body))):show(r.body);
  const local=r.kind==='CONSTRAINT'&&nodes.get(r.subject?.id)?.kind==='ACTION';
  const use=r.data_use,origin={EXTERNAL:'外部输入',INTERNAL:'内部产物',NON_INPUT:'非输入通信内容',UNSTATED:'来源未明确'},availability={AT_USE:'使用点所需数据可用',USED_PORTION:'所用部分可用',COMPLETE_RESULT:'完整结果可用'};
  const text=r.kind==='DATA_USE'?modalText(r)+'：'+show(use.consumer)+'使用'+show(use.object)+'；来源='+origin[use.origin]+'；生产者='+show(use.producer)+'；依赖='+availability[use.availability]:
   (local?'执行'+show(r.subject)+'时，':'')+modalText(r)+'：'+description;
  if(r.modality==='FORBIDDEN'||r.kind==='STOP')put('B',r,text);
  if(['STOP','COMPLETION'].includes(r.kind))put('C',r,text);
  if(r.kind==='DATA_USE'&&use?.origin!=='NON_INPUT')put('I',r,text,{external_input:use?.origin==='EXTERNAL',origin:use?.origin});
  const tree=exprNodes(r.body),environment=body?.operator==='FORALL'&&tree.some(n=>n.operator==='TASK_EVENTS')&&tree.some(n=>n.operator==='ENVIRONMENT_OF');
  const views=environment?[...new Set([...r.views.filter(v=>v!=='R'),'I'])]:r.views;
  for(const slot of views)if(!slots[slot].items.some(x=>x.id===r.id))put(slot,r,text,{declared_views:r.views,...(environment?{projection_rule:'TYPED_TASK_ENVIRONMENT_IS_INPUT_SCOPE'}:{})});
 }
 const unresolved=acceptance.rows.filter(r=>r.status!=='ACCEPTED').map(r=>({id:r.id,status:r.status,reason:r.blocked_dependencies?'引用的节点尚未接受':'审阅或技术校验未接受'}));
 const gaps=acceptance.diagnostics.map(d=>({...d,reason:d.reason??d.code}));
 for(const slot of Object.values(slots)){if(slot.items.length)slot.status=slot.items.every(x=>x.status==='ACCEPTED')?'RESOLVED':'UNRESOLVED';slot.entries=slot.items;}
 const canonical={format:'boundx-direct-ir-7plus1/1',contract_version:ir.contract_version,slots,unresolved,gaps,business_decision:null,execution_authorization:null};
 const chinese='# 7+1边界视图\n\n'+Object.entries(slots).map(([k,s])=>'## '+k+'\n\n'+(s.items.length?s.items.map(x=>'- '+x.text+'（'+x.status+'）').join('\n'):'原文未在此视图中表达。')).join('\n\n')+'\n\n技术接受不等于业务授权。\n';
 return {canonical,chinese,describe:show};
}
