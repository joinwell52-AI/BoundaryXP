// Version-selected adapter. Original Skills remain immutable; installation selects the contract.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import path from 'node:path';import {sha256} from './source.mjs';
import {v2Schema,v2AuditSchema,modelRegistry} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
import {calculationOutputSchema} from './boundary-calculation-schema.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export function directIRKernelBundle(phase,{parseMethod='SKILL'}={}){
 if(!['parse','audit'].includes(phase)||!['SKILL','SKILL1'].includes(parseMethod))throw Error('KERNEL_RESOURCE_SELECTION');
 const file=parseMethod==='SKILL1'?`skill-profiles/semantics-first-r02/boundx-semantic-${phase}/SKILL.md`:`skills/boundx-semantic-${phase}/SKILL.md`,original=fs.readFileSync(path.join(here,file),'utf8');
 const adapted=original.replaceAll('candidate-ir/1.4','candidate-ir/2.0').replaceAll('contracts/candidate-ir-v1/CONTRACT.md','docs/ir-kernel/CONTRACT.md')+'\n\n本次职责配置为LLM_BOUNDARY_CALCULATION_R01。这是原Skill的同版运行扩展，取代旧版“模型不计算、不生成数学见证”的限制；模型负责IR与完整边界计算候选，审阅负责两者。只加载本阶段Skill，不读取另一阶段Skill。共同方法及样例见已内联BOUNDARY-CALCULATION-METHOD.md。IR格式仍2.0；运行输出扩展Schema由CLI实际提交。NUMBER.literal为精确字符串；root_task引用唯一TASK；TOTAL_DURATION.subject是REAL时长变量；无法表达的明示含义保留来源缺口，并在完整数学边界中明确表达，不把程序未支持当作原文歧义。';
 const contract=fs.readFileSync(new URL('../../../docs/ir-kernel/CONTRACT.md',import.meta.url),'utf8');
 if(!contract.includes('`candidate-ir/2.0`')||v2Schema.properties.contract_version.const!==v2AuditSchema.properties.contract_version.const)throw Error('KERNEL_RESOURCE_CONTRACT_MISMATCH');
 const method=fs.readFileSync(new URL('../../../docs/ir-kernel/BOUNDARY-CALCULATION-METHOD.md',import.meta.url),'utf8');
 const resources=[{path:file+'#llm-boundary-r01-interface-adapter',text:adapted,original_sha256:sha256(original)},{path:'docs/ir-kernel/CONTRACT.md',text:contract},{path:'docs/ir-kernel/BOUNDARY-CALCULATION-METHOD.md',text:method},{path:'kernel/operator-registry.json',text:JSON.stringify(modelRegistry)},...(phase==='audit'?[{path:'kernel/candidate-ir.schema.json',text:JSON.stringify(calculationOutputSchema('parse'))},{path:'kernel/candidate-ir-audit.schema.json',text:JSON.stringify(calculationOutputSchema('audit'))}]:[])].map(r=>({...r,sha256:sha256(r.text)}));
 const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',schema:calculationOutputSchema(phase),resources,text,sha256:sha256(text),parse_method:parseMethod,enabled_by_default:false,real_model_acceptance:'NOT_RUN',mode:'INLINE_BUNDLE',transport_version:'DIRECT_CANDIDATE_IR_R01',request_profile:'LLM_BOUNDARY_CALCULATION_R01',resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_LLM_BOUNDARY_R01':'IR_LLM_BOUNDARY_R01',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'runtime/'+(phase==='parse'?'ir-with-boundary-calculation':'ir-and-calculation-audit')+'.schema.json'}};
}
