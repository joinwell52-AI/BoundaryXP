import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256} from './source.mjs';
export const ROOT=path.dirname(fileURLToPath(import.meta.url));
export function buildBundle(phase){
 if(!['parse','audit'].includes(phase))throw Error('INVALID_SKILL_PHASE');
 const name=`boundx-semantic-${phase}`;
 const files=[`skills/${name}/SKILL.md`,'contracts/semantic-contract.md','contracts/proposal.schema.json',...(phase==='audit'?['contracts/audit.schema.json']:[])];
 const resources=files.map(relative=>{const bytes=fs.readFileSync(path.join(ROOT,relative));return {path:relative,sha256:sha256(bytes),text:bytes.toString('utf8')};});
 const schema=JSON.parse(resources.find(r=>r.path===`contracts/${phase==='parse'?'proposal':'audit'}.schema.json`).text);
 if(schema.properties.contract_version.const!=='028-r02.2')throw Error('SKILL_CONTRACT_VERSION_MISMATCH');
 const text=`显式调用 $${name}。加载方式 INLINE_BUNDLE：以下是宿主从真实 Skill 与同源合同读取的完整资源，不是原生 Skill 加载声明。只消费这些资源，禁止工具、文件、网络、业务操作。\n`+resources.map(r=>`\n<RESOURCE path=${JSON.stringify(r.path)} sha256=${r.sha256}>\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name,mode:'INLINE_BUNDLE',resources,schema,text,sha256:sha256(text)};
}
