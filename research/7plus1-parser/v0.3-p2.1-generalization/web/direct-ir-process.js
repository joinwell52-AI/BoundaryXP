// Presentation of saved typed IR only. No semantic extraction or model calls.
const list=x=>Array.isArray(x)?x:[];
export function directIRProcess(trace){
 const p=trace.proposal??trace.ir,a=trace.audit,t=trace.technical,c=trace.canonical,calc=trace.boundary_calculations;
 const nodes=new Map(['entities','variables','events','states','expressions','requirements'].flatMap(k=>list(p?.[k]).map(n=>[n.id,n])));
 const name=r=>nodes.get(r?.id??r)?.label??r?.id??r??'未指定';
 const sources=n=>list(n?.source_refs).map(id=>list(t?.source_links??p?.source_table).find(s=>s.id===id)).filter(Boolean);
 const base={time:null,notes:[],rows:[],headers:[],ready:false};
 return {stages:[
  {...base,id:'parse',title:'1. LLM直接生成候选IR：语义与可计算表达',actor:'Codex + boundx-semantic-parse',input:'原文、解析Skill、共享IR合同与Schema。',work:'模型解释动作、对象、角色、条件和范围，直接给出带来源的IR。程序不再重新猜语义或另造IR。',ready:!!p,outcome:p?`${list(p.events).length}个事件，${list(p.states).length}个状态，${list(p.expressions).length}个计算表达式，${list(p.requirements).length}项要求。`:'等待模型候选IR；没有返回前不伪造内容。',headers:['模型识别的事件','角色与对象','语义层'],rows:list(p?.events).map(e=>({cells:[e.label,e.roles.map(r=>r.role+'：'+name(r.value)).join('；'),e.layer+' / '+e.use],sources:sources(e)})),notes:list(p?.issues).map(x=>x.reason),raw:p},
  {...base,id:'audit',title:'2. 新会话独立审阅候选IR',actor:'第二次Codex调用 + boundx-semantic-audit',input:'同一原文、原始候选IR、同版合同和Schema。',work:'逐项检查漏项、多造、身份绑定、条件方向及范围。新会话不等于人工审定。',ready:!!a,outcome:a?`${list(a.reviews).length}项核对，${list(a.omissions).length}项遗漏。`:'等待独立审阅。',headers:['核对对象','结论','依据'],rows:list(a?.reviews).map(r=>({cells:[name(r.target),r.verdict,r.reason],sources:list(r.source_refs).map(id=>list(a.source_table).find(s=>s.id===id)).filter(Boolean)})),notes:list(a?.issues).map(x=>x.reason),raw:a},
  {...base,id:'technical',title:'3. 程序技术校验：原始IR不改写',actor:'程序，零模型调用',input:'候选IR、审阅结果、来源及引用。',work:'校验Schema、类型、来源、引用与依赖；接受状态单独保存，不覆盖模型IR。技术接受不是业务授权。',ready:!!t,outcome:t?`技术合同${t.technical_ok?'通过':'失败'}；${list(t.rows).filter(r=>r.status==='ACCEPTED').length}个节点接受，${list(t.rows).filter(r=>r.status!=='ACCEPTED').length}个节点待处理。`:'等待技术校验。',headers:['节点','技术状态','被阻断的依赖'],rows:list(t?.rows).map(r=>({cells:[name(r.id),r.status,list(r.blocked_dependencies).map(name).join('；')],sources:sources(nodes.get(r.id))})),notes:[...list(t?.errors).map(x=>x.code+' · '+(x.id??x.path??'结构')),...list(t?.diagnostics).map(x=>x.reason??x.code)],raw:t},
  {...base,id:'canonical',title:'4. 固定7+1视图：使用同一候选IR与接受状态',actor:'确定性程序，零模型调用',input:'原始候选IR和技术接受记录。',work:'按同版映射显示八个边界维度，中文、JSON与导出同源。不新增语义、不另生成IR。',ready:!!c,outcome:c?'最终7+1在下方展示。':'等待固定视图。',headers:['维度','状态','条目数'],rows:Object.entries(c?.slots??{}).map(([k,v])=>({cells:[k,v.status,String(list(v.items).length)],sources:[]})),raw:c},
  {...base,id:'calculus',title:'5. 程序边界计算：公式、数值与缺口',actor:'既有确定性计算Core，零模型调用',input:'同一IR的类型化表达式及技术接受记录。',work:'计算支持的集合、区间、逻辑与时序约束。未实现消费者明确列为缺口，不以模型审阅替代计算。',ready:!!calc,outcome:calc?`${calc.status}；联合结果：${calc.joint?.base?.result??'未保存'}；缺口${list(calc.gaps).length}项。`:'等待计算。',headers:['缺口节点','原因'],rows:list(calc?.gaps).map(x=>({cells:[name(x.node_id),x.reason],sources:[]})),notes:['可满足不等于已经执行完成；业务裁决和执行授权均为空。'],raw:calc}
 ]};
}
