// Offline PM comparison against the exact saved user-run declaration. No LLM.
import fs from 'node:fs';import {pathToFileURL} from 'node:url';
import {lowerBoundaryRules} from '../research/7plus1-parser/llm-first-028/boundary-rules.mjs';
import {compileCore} from '../src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from '../src/bxp/ir-kernel/evaluate.mjs';
import {evaluateRequirements} from '../src/bxp/ir-kernel/rules.mjs';
import {compareRetryAllocations} from '../src/bxp/ir-kernel/plan-budget.mjs';
import {projectCore} from '../src/bxp/ir-kernel/projection.mjs';
export function compare002(wire){
 const {ir,groups}=lowerBoundaryRules(wire),compiled=compileCore(ir),core=compiled.core;
 const ids=names=>names.flatMap(name=>groups[name].filter(r=>r.kind==='REQUIREMENT').map(r=>r.id));
 const reqs=names=>ir.requirements.filter(r=>ids(names).includes(r.id));
 const exact=events=>({events,completeness:{kind:'EXACT_SNAPSHOT',task_id:'t',basis:'Explicit PM comparison hypothesis; not an execution observation'}});
 const event=(id,operation,object,actor,recipient,extra={})=>({id,task_id:'t',occurred:true,operation,roles:[['PERFORMER',actor],['OBJECT',object],['RECIPIENT',recipient]].filter(([,v])=>v).map(([role,id])=>({role,value:{kind:'ENTITY',id}})),...extra});
 const check=(requirements,events,extra={})=>evaluateRequirements(core,{requirements,plan:exact(events),variables:{choice:{object:'a'}},...extra});
 const choice=reqs(['choice']).filter(r=>r.kind==='CONSTRAINT').map(r=>r.id);
 const retry=reqs(['retry']).filter(r=>r.modality==='REQUIRED').map(r=>r.id);
 const reads=[1,2,3].map(index=>({id:'planned_'+index,template_id:'read',index,task_id:'t',occurred:true,start:String(index*2),completed:true}));
 const failure=ir.states.find(s=>s.kind==='FAILURE'),previousIndex=ir.expressions.find(e=>e.operator==='EVENT_INSTANCE'&&e.arguments[1]?.kind==='VARIABLE').arguments[1].id;
 const states=Object.fromEntries([2,3].map(index=>[evaluateCore(core,{kind:'STATE',id:failure.id},{},{[previousIndex]:{number:String(index)}}).state,{value:true,established_at:String(index*2-1)}]));
 const passed=evaluateCore(core,{kind:'STATE',id:'passed'}).state,received=evaluateCore(core,{kind:'STATE',id:'received'}).state;
 const rows=[
  {id:'P01',label:'固定a，直接前次失败后重试，额外最多2次',expected:'SATISFIED',actual:check([...ids(['choice']),...retry],reads,{states})},
  {id:'P02',label:'首次a，失败改读b',expected:'VIOLATED',actual:check(choice,[event('read_a','READ','a','dev'),event('read_b','READ','b','dev')])},
  {id:'P03',label:'同一业务拆成两个子任务，各分配2次重试',expected:'VIOLATED',actual:compareRetryAllocations(core,{template_id:'read',scope_id:'t',allocations:[{fragment_id:'child_1',max_extra:2},{fragment_id:'child_2',max_extra:2}],complete:true})},
  {id:'P04',label:'QA未通过就开始交付check',expected:'VIOLATED',actual:check(ids(['gdeliver']),[event('early','DELIVER','check','pm','admin',{start:'5'})],{states:{[passed]:{value:false}}})},
  {id:'P05',label:'任意人把extra交给ADMIN',expected:'VIOLATED',actual:check(ids(['noextra']),[event('extra_out','DELIVER','extra','dev','admin')])},
  {id:'P06',label:'声明完整规划却省略PM交付check',expected:'VIOLATED',actual:check(ids(['ndeliver']),[])},
  {id:'R01',label:'QA未收到报告就复核，REVIEWER必须被识别',expected:'VIOLATED',actual:check(ids(['greview']),[{id:'review',task_id:'t',occurred:true,start:'5'}],{states:{[received]:{value:false}}})},
  {id:'R02',label:'QA开始时已经通过，相关交付前提满足',expected:'SATISFIED',actual:check(ids(['gdeliver']),[event('later','DELIVER','check','pm','admin',{start:'5'})],{states:{[passed]:{value:true,established_at:'4'}}})},
  {id:'R03',label:'QA状态未提供，前提保持未知',expected:'UNKNOWN',actual:check(ids(['gdeliver']),[event('unknown','DELIVER','check','pm','admin',{start:'5'})])},
  {id:'R04',label:'只提供规划片段，遗漏交付不直接判违反',expected:'UNKNOWN',actual:evaluateRequirements(core,{requirements:ids(['ndeliver']),plan:{events:[]}})},
 ];
 const projection=projectCore(compiled);
 return {kind:'OFFLINE_PM_PLAN_COMPARISON',model_calls:0,raw_declaration_unchanged:true,core_sha256:compiled.core_sha256,rows:rows.map(row=>({...row,pass:row.actual.result===row.expected})),
  output_projection:projection.canonical.slots.O.items.map(e=>({id:e.id,kind:e.kind,operation:e.operation,modality:e.modality})),
  retained_model_gap:'delex lacks DEV actor; original declaration and audit are not repaired or regraded',
  scope:'Only listed clauses and hypothetical plans; not whole-product semantic approval, actual execution or authorization',business_decision:null,execution_authorization:null};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=compare002(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));if(result.rows.some(r=>!r.pass))process.exitCode=1;}
