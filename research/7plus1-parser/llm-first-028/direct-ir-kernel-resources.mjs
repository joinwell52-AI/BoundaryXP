// Version-selected adapter. Original Skills remain immutable; installation selects the contract.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import path from 'node:path';import {sha256} from './source.mjs';
import {v2Schema,v2AuditSchema,modelRegistry} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export function directIRKernelBundle(phase,{parseMethod='SKILL'}={}){
 if(!['parse','audit'].includes(phase)||!['SKILL','SKILL1'].includes(parseMethod))throw Error('KERNEL_RESOURCE_SELECTION');
 const file=parseMethod==='SKILL1'?`skill-profiles/semantics-first-r02/boundx-semantic-${phase}/SKILL.md`:`skills/boundx-semantic-${phase}/SKILL.md`,original=fs.readFileSync(path.join(here,file),'utf8');
 const adapted=original.replaceAll('candidate-ir/1.4','candidate-ir/2.0').replaceAll('contracts/candidate-ir-v1/CONTRACT.md','docs/ir-kernel/CONTRACT.md')+'\n\n候选接口2.0/r02：同版完整合同已内联为docs/ir-kernel/CONTRACT.md；算子参数与支持范围见kernel/operator-registry.json。候选或补丁输出Schema由宿主通过CLI_OUTPUT_SCHEMA_ONLY实际提交；审阅另收到候选与审阅Schema。无需自行读取本地文件。NUMBER.literal为精确字符串；root_task引用唯一TASK；sequences最大次数不代表发生数。TOTAL_DURATION.subject是REAL时长变量；完整收件参数顺序为接收者、产物、可选交付事件。核对同一对象变量、开始时前提和数量目标；无法表达的明示含义保留来源缺口。';
 const contract=fs.readFileSync(new URL('../../../docs/ir-kernel/CONTRACT.md',import.meta.url),'utf8');
 if(!contract.includes('`candidate-ir/2.0`')||v2Schema.properties.contract_version.const!==v2AuditSchema.properties.contract_version.const)throw Error('KERNEL_RESOURCE_CONTRACT_MISMATCH');
 const resources=[{path:file+'#kernel-2.0-r02-interface-adapter',text:adapted,original_sha256:sha256(original)},{path:'docs/ir-kernel/CONTRACT.md',text:contract},{path:'kernel/operator-registry.json',text:JSON.stringify(modelRegistry)},...(phase==='audit'?[{path:'kernel/candidate-ir.schema.json',text:JSON.stringify(v2Schema)},{path:'kernel/candidate-ir-audit.schema.json',text:JSON.stringify(v2AuditSchema)}]:[])].map(r=>({...r,sha256:sha256(r.text)}));
 const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',schema:phase==='parse'?v2Schema:v2AuditSchema,resources,text,sha256:sha256(text),parse_method:parseMethod,enabled_by_default:false,real_model_acceptance:'NOT_RUN',original_skills_unchanged:true,mode:'INLINE_BUNDLE',transport_version:'DIRECT_CANDIDATE_IR_R01',request_profile:'DIRECT_CANDIDATE_IR_R01',resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_KERNEL_2_0':'IR_KERNEL_2_0',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'docs/ir-kernel/'+(phase==='parse'?'candidate-ir.schema.json':'candidate-ir-audit.schema.json')}};
}
