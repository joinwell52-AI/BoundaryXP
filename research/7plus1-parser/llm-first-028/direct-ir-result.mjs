// Deterministic reporting of saved evidence; never repair semantics from source text.
import {projectDirectIR} from './direct-ir-view.mjs';
import {calculateDirectIR} from './direct-ir-calculate.mjs';
import {renderDirectCalculations} from './direct-ir-render-results.mjs';

function suggestion(code){
 if(code==='REVISION_NOT_APPLIED')return '核对修订目标与允许修改的节点；只提交相关局部修订并独立审阅。原候选和未应用补丁均保留。';
 if(/SOURCE|PROVENANCE/.test(code))return '核对原文引文、出现次数及来源引用；补足真实依据，不由程序猜测原意。';
 if(/REFERENCE|TARGET|BINDING/.test(code))return '核对引用ID、目标类型与对象身份；修正关联后重做技术检查。';
 if(/SCHEMA|TYPE|UNIT/.test(code))return '按同版合同核对字段、类型、单位及算子参数；表达能力不足时保留缺口。';
 if(/AUDIT|COVERAGE/.test(code))return '逐来源核对遗漏或争议，仅修订有依据的相关节点；不能把审阅一致当作正确证明。';
 return '核对该节点及依赖的合同表达和消费者支持；补齐有依据的局部结构后复算，不删除限制换取通过。';
}

export function finishDirectIR(ir,acceptance,revisionOutcome=null){
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
