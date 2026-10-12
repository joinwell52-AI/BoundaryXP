import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256} from './source.mjs';
import {contractVersion,proposalSchema,auditSchema} from './contracts/schema.mjs';
import {comparisonBundle} from './comparison-bundle.mjs';
import {requestProfile,outputSchemaDelivery,renderResources} from './prompt-profile.mjs';
import {applyWireBundle} from './compact-wire.mjs';
import {directIRBundle} from './direct-ir-bundle.mjs';
export const ROOT=path.dirname(fileURLToPath(import.meta.url));
export function buildBundle(phase,{parseMethod=null}={}){
 if(parseMethod==='MD')throw Error('MD_COMPARISON_STOPPED');
 return directIRBundle(phase);
}
export function buildLegacyBundle(phase,{parseMethod=null}={}){
 if(parseMethod==='MD')throw Error('MD_COMPARISON_STOPPED');
 if(parseMethod!==null&&parseMethod!=='SKILL')throw Error('INVALID_PARSE_METHOD');
 if(!['parse','audit'].includes(phase))throw Error('INVALID_SKILL_PHASE');
 const name=`boundx-semantic-${phase}`;
 const files=[`skills/${name}/SKILL.md`,'contracts/semantic-contract.md','contracts/proposal.schema.json',...(phase==='audit'?['contracts/audit.schema.json']:[])];
 const resources=files.map(relative=>{const bytes=fs.readFileSync(path.join(ROOT,relative));return {path:relative,sha256:sha256(bytes),text:bytes.toString('utf8')};});
 const schema=JSON.parse(resources.find(r=>r.path===`contracts/${phase==='parse'?'proposal':'audit'}.schema.json`).text);
 if(schema.properties.contract_version.const!==contractVersion)throw Error('SKILL_CONTRACT_VERSION_MISMATCH');
 for(const [file,expected] of [['proposal.schema.json',proposalSchema],['audit.schema.json',auditSchema]]){
  const resource=resources.find(r=>r.path==='contracts/'+file);
  if(resource&&JSON.stringify(JSON.parse(resource.text))!==JSON.stringify(expected))throw Error('SKILL_SCHEMA_CONSUMER_MISMATCH');
 }
 const delivery=outputSchemaDelivery(phase,schema);
 const text=`显式调用 $${name}。加载方式 INLINE_BUNDLE：宿主从真实 Skill 与同源合同读取资源，本次目标输出Schema通过CLI结构化输出通道交付；不是原生 Skill 加载声明。只消费这些资源，禁止工具、文件、网络、业务操作。\n`+renderResources(resources,delivery);
  return applyWireBundle({phase,name,mode:'INLINE_BUNDLE',resource_profile:'SEMANTIC_CLOSURE_R02',request_profile:requestProfile,schema_delivery:delivery,resources,schema,text,sha256:sha256(text)});
}
