import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {hash} from '../p0-semantic-repair-v0.1/source.mjs';

export class HistoryStore {
 constructor(root){this.root=path.resolve(root);fs.mkdirSync(this.root,{recursive:true});if(fs.lstatSync(this.root).isSymbolicLink())throw Error('UNSAFE_HISTORY_ROOT');this.root=fs.realpathSync(this.root);}
 file(id){if(typeof id!=='string'||! /^[A-Za-z0-9][A-Za-z0-9_-]{1,100}$/u.test(id))throw Error('INVALID_RUN_ID');const p=path.join(this.root,id+'.json');if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('UNSAFE_HISTORY_FILE');return p;}
 save(result,{id=new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8),created_at=new Date().toISOString(),origin=null}={}){
  const payload={run_id:id,created_at,parser_version:result.parser_revision??'unknown',parser_status:result.parser_status,source_text:result.source.raw_text,source_sha256:result.source.sha256,canonical_7plus1:result.slots,unresolved:Object.values(result.slots).flatMap(s=>s.entries).filter(e=>e.state!=='RESOLVED'),diagnostics:result.diagnostics,result_json:result,origin};
  const raw=JSON.stringify({format:'boundx-local-history/v1',sha256:hash(payload),payload},null,2)+'\n',dest=this.file(id),temp=path.join(this.root,'.pending-'+randomUUID());
  fs.writeFileSync(temp,raw,{flag:'wx'});try{fs.linkSync(temp,dest);}finally{fs.unlinkSync(temp);}return this.get(id);
 }
 get(id){const raw=JSON.parse(fs.readFileSync(this.file(id),'utf8'));if(raw.format!=='boundx-local-history/v1'||hash(raw.payload)!==raw.sha256||raw.payload.run_id!==id)throw Error('HISTORY_INTEGRITY');const p=raw.payload;if(p.source_text!==p.result_json.source.raw_text||p.source_sha256!==p.result_json.source.sha256||JSON.stringify(p.canonical_7plus1)!==JSON.stringify(p.result_json.slots))throw Error('HISTORY_SNAPSHOT_MISMATCH');return {run_id:p.run_id,created_at:p.created_at,result:p.result_json,snapshot:p};}
 list(){return fs.readdirSync(this.root).filter(n=>/^[A-Za-z0-9][A-Za-z0-9_-]{1,100}\.json$/u.test(n)).map(n=>{const id=n.slice(0,-5);try{const {snapshot:p}=this.get(id);return {run_id:id,created_at:p.created_at,parser_version:p.parser_version,parser_status:p.parser_status,summary:[...p.source_text].slice(0,80).join(''),corrupt:false};}catch(e){return {run_id:id,corrupt:true,parser_status:'CORRUPT_HISTORY',summary:'损坏记录，可删除；其他历史不受影响',error:e.message};}}).sort((a,b)=>b.run_id.localeCompare(a.run_id));}
 delete(id){fs.unlinkSync(this.file(id));}
 clear(){const ids=this.list().map(r=>r.run_id);for(const id of ids)this.delete(id);return ids.length;}
 // One-time copy only. Deleting a managed snapshot never changes sealed evidence or re-imports it.
 importLegacy(runs){const marker=path.join(this.root,'.legacy-import-v1.json');if(fs.existsSync(marker))return;const report=[];if(fs.existsSync(runs))for(const id of fs.readdirSync(runs)){try{const dir=path.join(runs,id);if(!fs.statSync(dir).isDirectory())continue;const m=JSON.parse(fs.readFileSync(path.join(dir,'MANIFEST.json'),'utf8')),raw=fs.readFileSync(path.join(dir,'RESULT.json'));if(hash(raw)!==m.files['RESULT.json']||hash(fs.readFileSync(path.join(dir,'SOURCE.txt')))!==m.files['SOURCE.txt'])throw Error('LEGACY_INTEGRITY');if(!fs.existsSync(this.file(id)))this.save(JSON.parse(raw),{id,created_at:fs.statSync(path.join(dir,'MANIFEST.json')).birthtime.toISOString(),origin:{kind:'sealed-run-copy',path:dir}});report.push({id,status:'COPIED'});}catch(e){report.push({id,status:'SKIPPED',error:e.message});}}fs.writeFileSync(marker,JSON.stringify(report,null,2),{flag:'wx'});}
}

const names={I:'Input',O:'Output',A:'Actions',P:'Participants',R:'Resources',V:'Version / Basis',C:'Completion / Stop',B:'Forbidden / Restriction'};
const safe=s=>String(s??'').replace(/[\r\n]+/gu,' ').replace(/([\\`*_<>\[\]])/gu,'\\$1');
export function markdown(run){const p=run.snapshot,r=run.result,raw=p.source_text,max=Math.max(2,...Array.from(raw.matchAll(/`+/gu),m=>m[0].length)),fence='`'.repeat(max+1);
 const lines=['# BoundX 7+1 Parser Test Result','',`- Run ID: ${safe(p.run_id)}`,`- Time: ${safe(p.created_at)}`,`- Parser Version: ${safe(p.parser_version)}`,`- Parser Status: ${safe(p.parser_status)}`,`- Source SHA-256: ${safe(p.source_sha256)}`,'','## 原始任务','',fence+'text'];
 // Raw source is inserted verbatim (including CRLF/BOM); fence length cannot collide with source.
 let out=lines.join('\n')+'\n'+raw+'\n'+fence+'\n\n## Canonical 7+1\n';
 for(const [slot,name] of Object.entries(names)){const value=p.canonical_7plus1[slot];out+=`\n### ${slot} — ${name}\nStatus: ${safe(value.status)}\n`;for(const e of value.entries){out+=`- ${safe(e.display??e.evidence?.[0]?.source_span?.quote??e.id)} [${safe(e.state)}]\n`;if(e.condition?.length)out+=`  - Condition: ${safe(e.condition.flatMap(c=>c.members?.map(m=>m.text)??[]).join(' AND '))}\n`;}if(!value.entries.length)out+='- （无条目）\n';}
 out+='\n## Unresolved / Ambiguous / Unsupported\n\n';out+=p.unresolved.length?p.unresolved.map(e=>`- ${safe(e.display??e.id)} [${safe(e.state)}]`).join('\n')+'\n':'- （无条目）\n';
 out+='\n## Diagnostics\n\n';const diagnostics=[...(r.diagnostics??[]),...(r.normalization?.diagnostics??[])];out+=diagnostics.length?diagnostics.map(d=>'- '+safe(JSON.stringify(d))).join('\n')+'\n':'- （无诊断）\n';return out;
}
export function exportName(run){const date=run.created_at.replace(/[-:]/g,'').replace('T','-').slice(0,15);return `7plus1-result-${date}-${run.run_id.slice(-8)}.md`;}
