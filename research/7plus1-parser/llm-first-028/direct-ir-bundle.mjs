import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {sha256} from './source.mjs';import {candidateSchema,auditSchema} from './contracts/candidate-ir-v1/schema.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
export function directIRBundle(phase,{parseMethod='SKILL'}={}){
 if(!['parse','audit'].includes(phase))throw Error('DIRECT_IR_PHASE');
 parseMethod??='SKILL';if(!['SKILL','SKILL1'].includes(parseMethod))throw Error('INVALID_PARSE_METHOD');
 const skillPath=parseMethod==='SKILL1'?`skill-profiles/semantics-first-r02/boundx-semantic-${phase}/SKILL.md`:`skills/boundx-semantic-${phase}/SKILL.md`;
 const names=[skillPath,'contracts/candidate-ir-v1/CONTRACT.md','contracts/candidate-ir-v1/operator-registry.json',...(phase==='audit'?['contracts/candidate-ir-v1/candidate-ir.schema.json','contracts/candidate-ir-v1/candidate-ir-audit.schema.json']:[])];
 const resources=names.map(p=>{const text=fs.readFileSync(path.join(root,p),'utf8');return {path:p,text,sha256:sha256(text)};});
 const schema=phase==='parse'?candidateSchema:auditSchema;
 const expected=candidateSchema.properties.contract_version.const,skill=resources[0].text;
 if(!skill.includes('name: boundx-semantic-'+phase)||!skill.includes('接口版本：'+expected)||!resources.find(r=>r.path.endsWith('CONTRACT.md'))?.text.includes(expected))throw Error('SKILL_CONTRACT_VERSION_MISMATCH');
 const version=candidateSchema.properties.contract_version.const;
 const preface=phase==='parse'?`显式调用 $boundx-semantic-${phase}。本次目标为直接候选IR接口${version}，Schema仅经CLI结构化输出交付。资源按以下原字节加载；不是原生Skill加载声明。\n`:`显式调用 $boundx-semantic-${phase}。本次目标为直接候选IR接口${version}。输出Schema通过CLI结构化输出交付；审阅同时提供两份Schema正文供合同核对。资源按以下原字节加载；不是原生Skill加载声明。\n`;
 const text=preface+resources.map(r=>`\n<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('');
 return {phase,name:'boundx-semantic-'+phase,parse_method:parseMethod,mode:'INLINE_BUNDLE',schema,resources,text,sha256:sha256(text),transport_version:'DIRECT_CANDIDATE_IR_R01',resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_HOST_1_4':'DIRECT_CANDIDATE_IR_R01',request_profile:'DIRECT_CANDIDATE_IR_R01',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'contracts/candidate-ir-v1/'+(phase==='parse'?'candidate-ir':'candidate-ir-audit')+'.schema.json'}};
}
