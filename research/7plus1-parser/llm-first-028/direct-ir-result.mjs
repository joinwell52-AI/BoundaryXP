// Deterministic reporting of saved evidence; never repair semantics from source text.
import {projectDirectIR} from './direct-ir-view.mjs';
import {calculateDirectIR} from './direct-ir-calculate.mjs';
import {renderDirectCalculations} from './direct-ir-render-results.mjs';
import {runKernel} from '../../../src/bxp/ir-kernel/service.mjs';
import {repairableFrameCodes} from '../../../src/bxp/ir-kernel/frames.mjs';
import {declareBoundary} from '../../../src/bxp/ir-kernel/declaration.mjs';

function suggestion(code){
 if(code==='REVISION_NOT_APPLIED')return '核对修订目标与允许修改的节点；只提交相关局部修订并独立审阅。原候选和未应用补丁均保留。';
 if(/SOURCE|PROVENANCE/.test(code))return '核对原文引文、出现次数及来源引用；补足真实依据，不由程序猜测原意。';
 if(/REFERENCE|TARGET|BINDING/.test(code))return '核对引用ID、目标类型与对象身份；修正关联后重做技术检查。';
 if(/SCHEMA|TYPE|UNIT/.test(code))return '按同版合同核对字段、类型、单位及算子参数；表达能力不足时保留缺口。';
 if(/AUDIT|COVERAGE/.test(code))return '逐来源核对遗漏或争议，仅修订有依据的相关节点；不能把审阅一致当作正确证明。';
 return '核对该节点及依赖的合同表达和消费者支持；补齐有依据的局部结构后复算，不删除限制换取通过。';
}

export function finishDirectIR(ir,acceptance,revisionOutcome=null,{declarative=false}={}){
 if(declarative&&ir.contract_version==='candidate-ir/2.0')return finishDeclaration(ir,acceptance,revisionOutcome);
 if(ir.contract_version==='candidate-ir/2.0')return finishKernelIR(ir,acceptance,revisionOutcome);
 const technical={...acceptance,diagnostics:[...(acceptance.diagnostics??[])]};
 if(revisionOutcome?.status==='NOT_APPLIED'&&!technical.diagnostics.some(x=>x.code==='REVISION_NOT_APPLIED'))technical.diagnostics.push({code:'REVISION_NOT_APPLIED',reason:'局部修订未应用：'+revisionOutcome.reason});
 const blocked=!technical.technical_ok;
 const issues=[...(technical.errors??[]),...technical.diagnostics];
 const marker={code:'DIRECT_IR_TECHNICAL_REJECTED',reason:'IR存在技术问题；已生成问题报告，尚无可确认的数学结论。'};
 let canonical,chinese,boundary_calculations;
 if(blocked){
  canonical={format:'boundx-direct-ir-7plus1/1',contract_version:ir.contract_version,slots:Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,{status:'UNRESOLVED',items:[],entries:[]}])),unresolved:technical.rows.filter(r=>r.status!=='ACCEPTED').map(r=>({id:r.id,status:r.status})),gaps:[marker,...technical.diagnostics],business_decision:null,execution_authorization:null};
  boundary_calculations={format:'boundx-direct-ir-calculation/1',status:'PARTIAL',calculation_performed:false,gaps:[marker,...issues],joint:{status:'PARTIAL',base:{result:'unknown',witness:null}},business_decision:null,execution_authorization:null};
  chinese='# 本次处理完成，发现待修正问题\n\n原始IR、独立审阅与逐项问题均已保留。当前IR技术检查未通过，未把无效结构当作数学结论。';
 }else{
  ({canonical,chinese}=projectDirectIR(ir,technical));
  boundary_calculations=calculateDirectIR(ir,technical);
  chinese+='\n'+renderDirectCalculations(boundary_calculations);
 }
 const findings=[...new Map([...issues,...(boundary_calculations.gaps??[])].map(x=>{
  const code=x.code??'CALCULATION_GAP',node_id=x.node_id??x.id??null;
  const reason=x.reason??x.message??code;
  const explanations={IR_NODE_UNRESOLVED:'该IR节点仍有审阅疑点或依赖未决，不能用于确认相关结论。',IR_NODE_REJECTED:'该IR节点存在审阅反对项，需要逐来源核对。'};
  const item={code,node_id,field_path:x.field_path??x.path??null,problem:explanations[reason]??reason,source_refs:x.source_refs??[],impact:blocked?'尚不能确认数学结果；原IR和审阅已保留。':'相关结论未决，不代表整份边界已完整计算。',suggestion:suggestion(code)};
  return [JSON.stringify(item),item];
 })).values()];
 const problem_report={format:'boundx-ir-problem-report/1',status:findings.length?'REVIEW_REQUIRED':'NO_RECORDED_GAPS',findings,revision_outcome:revisionOutcome,semantic_correctness_proven:false};
 if(findings.length)chinese+='\n\n## 发现的问题与修订建议\n\n'+findings.map((x,i)=>`${i+1}. ${x.problem}${x.node_id?'（'+x.node_id+'）':''}\n   影响：${x.impact}\n   建议：${x.suggestion}`).join('\n');
 return {technical,canonical,chinese,boundary_calculations,problem_report};
}
function finishDeclaration(ir,technical,revisionOutcome){
 let declared;const gaps=[...technical.errors,...technical.diagnostics,...technical.rows.filter(r=>r.status!=='ACCEPTED').map(r=>({code:'NODE_REVIEW_REQUIRED',id:r.id}))];
 if(technical.technical_ok){try{declared=declareBoundary(ir);gaps.push(...declared.compiled.semantic_gaps);}catch(e){gaps.push(e.diagnostic??{code:'BOUNDARY_COMPILE_ERROR',reason:e.message});}}
 const canonical=declared?.canonical??{format:'boundx-kernel-7plus1/1',slots:Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,{status:'UNRESOLVED',items:[],entries:[]}]))};
 canonical.unresolved=technical.rows.filter(r=>r.status!=='ACCEPTED');canonical.gaps=gaps;canonical.business_decision=null;canonical.execution_authorization=null;
 const byId=new Map(technical.rows.map(r=>[r.id,r]));for(const slot of Object.values(canonical.slots))for(const item of slot.entries??[]){item.status=byId.get(item.id)?.status??'UNRESOLVED';item.text=[item.kind==='BASIS_DECLARATION'?'依据声明':item.modality,item.subject_label,item.roles.map(r=>r.role+'='+r.value.id).join('；'),item.expression].filter(Boolean).join('；');item.sources=technical.source_links.filter(s=>item.source_refs.includes(s.id));}
 const status=gaps.length||!declared?'PARTIAL':'BOUNDARY_READY';
 const boundary_calculations={format:'boundx-declarative-boundary/1',status,compile_status:declared?'SUPPORTED':'FAILED',result:'BOUNDARY_DECLARED',verification:'STRUCTURE_AND_SOURCE_CHECKED_NOT_SEMANTIC_PROOF',query_status:'AWAITING_PLAN_OR_EVIDENCE',static_values:declared?.static_values??[],rules:ir.requirements.map(r=>({id:r.id,kind:r.kind,modality:r.modality,subject:r.subject,scope_id:r.scope_id,body:r.body,applicability:r.applicability,source_refs:r.source_refs})),variables:ir.variables,source_table:ir.source_table,core_sha256:declared?.compiled.core_sha256??null,gaps,calculation_performed:!!declared,witness_generated:false,business_decision:null,execution_authorization:null};
 const findings=gaps.map(g=>({...g,problem:g.reason??g.message??g.code,suggestion:'核对本条原文及候选结构；仅修有依据的边界，不补执行安排。'}));
 const chinese=(declared?.chinese??'# 边界待修正')+'\n\n## 边界建立结果\n\n'+(status==='BOUNDARY_READY'?'边界已建立，待核验具体规划或执行证据。':'仍有边界表达或审阅问题。')+'\n未生成PM执行安排或完整执行见证；未判断业务完成。\n\n### 确定的静态计算\n'+boundary_calculations.static_values.map(x=>'- '+x.id+' / '+x.operator+' = '+JSON.stringify(x.value)).join('\n')+'\n\n'+findings.map(f=>'- '+f.problem).join('\n');
 return {technical,canonical,chinese,boundary_calculations,problem_report:{status:gaps.length?'REVIEW_REQUIRED':'NO_RECORDED_GAPS',findings,revision_outcome:revisionOutcome,semantic_correctness_proven:false},...(declared?{kernel_core:declared.compiled}:{})};
}
async function finishKernelIR(ir,technical,revisionOutcome){
 const emptySlots=()=>Object.fromEntries('IOAPRVCB'.split('').map(k=>[k,{status:'UNRESOLVED',items:[],entries:[]}]));
 if(!technical.technical_ok&&(technical.errors??[]).some(e=>!repairableFrameCodes.has(e.code)))return {technical,canonical:{slots:emptySlots(),unresolved:technical.errors,gaps:technical.errors},chinese:'来源、类型或绑定检查未通过；原候选与问题保留，未执行数学查询。',boundary_calculations:{format:'boundx-kernel-result/1',status:'PARTIAL',ir_status:'INVALID',compile_status:'FAILED',result:'NOT_RUN',verification:'NOT_RUN',calculation_performed:false,diagnostics:technical.errors,gaps:technical.errors},problem_report:{status:'REVIEW_REQUIRED',findings:technical.errors,semantic_correctness_proven:false}};
 const result=await runKernel(ir,{kind:'ANALYZE'}),unreviewed=technical.rows.filter(r=>r.status!=='ACCEPTED'),gaps=[...(result.compiled?.semantic_gaps??[]),...technical.diagnostics,...(technical.audit_status==='NOT_PERFORMED'?[{code:'AUDIT_COVERAGE_BLOCKED',affected_node_count:unreviewed.length}]:unreviewed.map(r=>({code:'NODE_REVIEW_REQUIRED',id:r.id})))];
 const calculation=result.calculation;gaps.push(...(calculation.diagnostics??[]));if(!technical.technical_ok)calculation.ir_status='INVALID';else if(gaps.length&&calculation.ir_status!=='INVALID')calculation.ir_status='SEMANTIC_REVIEW_REQUIRED';
 const status=calculation.compile_status!=='SUPPORTED'||gaps.length||!['SAT','UNSAT','SATISFIED','VIOLATED'].includes(calculation.result)?'PARTIAL':calculation.result==='UNSAT'?'CONFLICT':'CALCULATED';
 const canonical=result.canonical??{slots:emptySlots()};canonical.unresolved=unreviewed;canonical.gaps=gaps;
 const byId=new Map(technical.rows.map(r=>[r.id,r]));for(const slot of Object.values(canonical.slots))for(const item of slot.entries??[]){item.status=byId.get(item.id)?.status??'UNRESOLVED';item.text=[item.kind==='BASIS_DECLARATION'?'依据声明':item.modality,item.subject_label,item.roles.map(r=>r.role+'='+r.value.id).join('；'),item.expression].filter(Boolean).join('；');item.sources=technical.source_links.filter(s=>item.source_refs.includes(s.id));}
 const findings=gaps.map(g=>({...g,problem:g.reason??g.message??g.code,suggestion:'核对所指节点的原文依据、同版合同和查询支持条件；保留原候选，不删除边界。'}));
 const partText=(calculation.parts??[]).map(p=>'必要约束子问题：'+p.result+'；覆盖'+p.query_scope.requirements.length+'条要求；'+p.verification+'。局部SAT不证明整案可满足。').join('\n');
 return {technical,canonical,kernel_core:result.compiled,chinese:(result.chinese??'')+'\n\n## 计算\n\n'+calculation.result+'；证明等级：'+calculation.verification+'。'+(gaps.length?'存在审阅或计算支持限制，不能宣称完整边界已通过。':'')+'\n'+partText+'\n'+findings.map(f=>'- '+f.problem+(f.node_id?'（'+f.node_id+'）':'')).join('\n'),boundary_calculations:{...calculation,format:'boundx-kernel-result/1',status,gaps,kernel_summary:result.summary,calculation_performed:calculation.result!=='NOT_RUN'||(calculation.parts??[]).some(p=>['SAT','UNSAT'].includes(p.result)),core_sha256:result.compiled?.core_sha256},problem_report:{status:gaps.length?'REVIEW_REQUIRED':'NO_RECORDED_GAPS',findings,revision_outcome:revisionOutcome,semantic_correctness_proven:false}};
}
