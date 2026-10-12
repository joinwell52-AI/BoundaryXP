import {sha256} from './source.mjs';
export const requestProfile='SCHEMA_ONCE_R01';
export function outputSchemaDelivery(phase,schema){
 if(!['parse','audit'].includes(phase))throw Error('INVALID_SKILL_PHASE');
 return{mode:'CLI_OUTPUT_SCHEMA',path:`contracts/${phase==='parse'?'proposal':'audit'}.schema.json`,schema_sha256:sha256(JSON.stringify(schema)),inline_body:false,fields_or_constraints_removed:false};
}
export function renderResources(resources,delivery){
 const target=resources.filter(r=>r.path===delivery.path);
 if(target.length!==1||sha256(JSON.stringify(JSON.parse(target[0].text)))!==delivery.schema_sha256)throw Error('OUTPUT_SCHEMA_DELIVERY_MISMATCH');
 return resources.map(r=>r.path===delivery.path
  ?`\n<OUTPUT_SCHEMA path=${JSON.stringify(r.path)} sha256=${delivery.schema_sha256} delivery="CLI_OUTPUT_SCHEMA">\n本次输出的完整JSON Schema由宿主通过Codex CLI的--output-schema提供，不在正文重复；全部字段、枚举、必填项与约束仍须遵守。\n</OUTPUT_SCHEMA>`
  :`\n<RESOURCE path=${JSON.stringify(r.path)} sha256=${r.sha256}>\n${r.text}\n</RESOURCE>`).join('\n');
}
