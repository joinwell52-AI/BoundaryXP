import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256} from './source.mjs';
import {contractVersion,proposalSchema,auditSchema} from './contracts/schema.mjs';
import {requestProfile,outputSchemaDelivery,renderResources} from './prompt-profile.mjs';
import {applyWireBundle,wireVersion} from './compact-wire.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
export const comparisonProfile='COMPACT_R01';
export function parseMethod(value='SKILL'){
 if(!['SKILL','SKILL1','MD'].includes(value))throw Error('INVALID_PARSE_METHOD');
 return value;
}
const expected={
 'essentials.md':'29e6fb06563dbd618d00c709fa1297c013dd8183b53cfed6f8de520b2622fcda',
 'semantic-contract.md':'6e3a598352e68cace6d3a4a33e1bbfae9c0a06cad58395d8b640fc6759fc7b81',
 'proposal.schema.json':'27858e74ebe75345e6c17ee865e375ec1978cf50cfd93a2135fe12f522e58329'
};
export function comparisonBundle(phase,method){
 parseMethod(method);if(!['parse','audit'].includes(phase))throw Error('INVALID_SKILL_PHASE');
 if(contractVersion!=='031-r1.1')throw Error('COMPARISON_CONTRACT_VERSION_MISMATCH');
 const name=phase==='audit'?'boundx-semantic-audit':method==='SKILL'?'boundx-semantic-parse':'boundx-r02-md';
 const items=phase==='audit'?[['skills/boundx-semantic-audit/SKILL.md','skills/boundx-semantic-audit/SKILL.md']]:method==='SKILL'?[['skills/boundx-semantic-parse/SKILL.md','skills/boundx-semantic-parse/SKILL.md']]:[['BOUNDARYXP-LLM-SEMANTIC-ESSENTIALS.zh-CN.md','contracts/comparison/essentials.md']];
 items.push(['contracts/semantic-contract.md','contracts/comparison/semantic-contract.md'],['contracts/proposal.schema.json','contracts/comparison/proposal.schema.json']);
 if(phase==='audit')items.push(['contracts/audit.schema.json','contracts/comparison/audit.schema.json']);
 const resources=items.map(([logical,source_path])=>{
  const bytes=fs.readFileSync(path.join(root,source_path)),digest=sha256(bytes),file=path.basename(source_path);
  if(expected[file]&&expected[file]!==digest)throw Error('COMPARISON_RESOURCE_DIGEST_MISMATCH:'+file);
  const text=bytes.toString('utf8');return {path:logical,source_path,sha256:digest,characters:Array.from(text).length,text};
 });
 for(const [file,schema] of [['proposal.schema.json',proposalSchema],['audit.schema.json',auditSchema]]){
  const resource=resources.find(r=>r.path==='contracts/'+file);
  if(resource&&JSON.stringify(JSON.parse(resource.text))!==JSON.stringify(schema))throw Error('SKILL_SCHEMA_CONSUMER_MISMATCH');
 }
 const schema=JSON.parse(resources.find(r=>r.path===`contracts/${phase==='parse'?'proposal':'audit'}.schema.json`).text);
 const header=phase==='audit'?'按以下审阅Skill独立核对原文与候选。':'按以下解析说明理解原文，生成候选语义结构。';
 const delivery=outputSchemaDelivery(phase,schema);
 const text=header+'加载方式 INLINE_BUNDLE：宿主读取所选资源，本次目标输出Schema通过CLI结构化输出通道交付。只消费这些资源，禁止工具、文件、网络、业务操作。\n'+renderResources(resources,delivery);
 return applyWireBundle({phase,name,mode:'INLINE_BUNDLE',parse_method:method,resource_profile:comparisonProfile,request_profile:requestProfile,schema_delivery:delivery,resources,schema,text,sha256:sha256(text)});
}
export const bundleEvidence=b=>({phase:b.phase,name:b.name,bundle_sha256:b.sha256,characters:Array.from(b.text).length,request_profile:b.request_profile,schema_delivery:b.schema_delivery,resources:b.resources.map(({text,...r})=>r)});
export function comparisonEvidence(method){return {parse_method:parseMethod(method),resource_profile:comparisonProfile,request_profile:wireVersion,transport_version:wireVersion,selected_resources:{parse:bundleEvidence(comparisonBundle('parse',method)),audit:bundleEvidence(comparisonBundle('audit',method))}};}
