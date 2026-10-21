import fs from 'node:fs';import path from 'node:path';import {randomUUID,createHash} from 'node:crypto';
import {HistoryStore as LegacyStore} from '../v0.3-core-skeleton/history.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export class HistoryStore extends LegacyStore{
 save(result){if(result.contract_version!=='0.3-p0-closure')throw Error('V03_P0_SNAPSHOT_REQUIRED');const metadata=result.compiler_v03.metadata,id=metadata.run_id;
  const payload={run_id:id,created_at:metadata.created_at,parser_version:'0.3-p0-closure',parser_status:result.contract_gate_results.status==='PASS'?'V03_P0_WITH_UNIMPLEMENTED_STAGES':'V03_CONTRACT_FAILURE',source_text:result.compiler_v03.source.raw_text,source_sha256:metadata.source_sha256,result_json:structuredClone(result)};
  const raw=JSON.stringify({format:'boundx-parser-history/v0.3-p0-closure',sha256:hash(payload),payload},null,2)+'\n',dest=this.file(id),temp=path.join(this.root,'.pending-'+randomUUID());fs.writeFileSync(temp,raw,{flag:'wx'});try{fs.linkSync(temp,dest);}finally{fs.unlinkSync(temp);}return this.get(id);
 }
 get(id){const raw=JSON.parse(fs.readFileSync(this.file(id),'utf8'));if(['boundx-local-history/v1','boundx-parser-history/v0.3'].includes(raw.format))return super.get(id);const p=raw.payload;if(raw.format!=='boundx-parser-history/v0.3-p0-closure'||hash(p)!==raw.sha256||p.run_id!==id||p.result_json.contract_version!=='0.3-p0-closure'||p.source_text!==p.result_json.compiler_v03.source.raw_text||p.source_sha256!==p.result_json.compiler_v03.metadata.source_sha256)throw Error('HISTORY_INTEGRITY');return {run_id:id,created_at:p.created_at,result:p.result_json,snapshot:p};}
}
