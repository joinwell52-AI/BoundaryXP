// Version-selected adapter. Original Skills remain immutable; installation selects the contract.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import path from 'node:path';import {sha256} from './source.mjs';
import {v2Schema,v2AuditSchema,registry} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
export function directIRKernelBundle(phase,{parseMethod='SKILL'}={}){
 if(!['parse','audit'].includes(phase)||!['SKILL','SKILL1'].includes(parseMethod))throw Error('KERNEL_RESOURCE_SELECTION');
 const file=parseMethod==='SKILL1'?`skill-profiles/semantics-first-r02/boundx-semantic-${phase}/SKILL.md`:`skills/boundx-semantic-${phase}/SKILL.md`,original=fs.readFileSync(path.join(here,file),'utf8');
 const adapted=original.replaceAll('candidate-ir/1.4','candidate-ir/2.0')+'\n\n候选接口 2.0 补充：NUMBER.literal 使用精确数字字符串；root_task 引用唯一 TASK；sequences 显式给出模板、owner、索引基数及覆盖范围，最大次数不代表实际发生数。审阅须额外核对 sequence 字段。不得把查询快照、真实执行观测或可满足见证伪造成原文事实。无法表达的自然语言必须保留来源缺口。';
 const contract=fs.readFileSync(new URL('../../../docs/ir-kernel/SEMANTICS.md',import.meta.url),'utf8');
 const resources=[{path:file+'#kernel-2.0-interface-adapter',text:adapted,original_sha256:sha256(original)},{path:'docs/ir-kernel/SEMANTICS.md',text:contract},{path:'kernel/operator-registry.json',text:JSON.stringify(registry)},...(phase==='audit'?[{path:'kernel/candidate-ir.schema.json',text:JSON.stringify(v2Schema)},{path:'kernel/candidate-ir-audit.schema.json',text:JSON.stringify(v2AuditSchema)}]:[])].map(r=>({...r,sha256:sha256(r.text)}));
 const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',schema:phase==='parse'?v2Schema:v2AuditSchema,resources,text,sha256:sha256(text),parse_method:parseMethod,enabled_by_default:false,real_model_acceptance:'NOT_RUN',original_skills_unchanged:true,mode:'INLINE_BUNDLE',transport_version:'DIRECT_CANDIDATE_IR_R01',request_profile:'DIRECT_CANDIDATE_IR_R01',resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_KERNEL_2_0':'IR_KERNEL_2_0',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'docs/ir-kernel/'+(phase==='parse'?'candidate-ir.schema.json':'candidate-ir-audit.schema.json')}};
}
