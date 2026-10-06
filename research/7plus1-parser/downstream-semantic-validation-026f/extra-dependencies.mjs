import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {CODE,OUT,save,sha} from './util.mjs';
// The predecessor JS snapshot omitted schema-registry data loaded by URL.
// Restore ONLY committed, unchanged registry data from the exact evidence
// commit, and disclose this addition rather than silently reading current data.
const commit='4dea24229f4189bb699bd1eef621bf928a0882b7';
const names=['domain-packs/action-frame.schema.json'];
const rows=[];
for(const p of names){const bytes=execFileSync('git',['show',`${commit}:${p}`],{maxBuffer:8*1024*1024});if(!bytes.equals(fs.readFileSync(p)))throw Error('CURRENT_REGISTRY_BYTES_DIFFER_FROM_EVIDENCE '+p);for(const arm of ['baseline','trial']){const target=`${CODE}/${arm}/${p}`;fs.mkdirSync(target.substring(0,target.lastIndexOf('/')),{recursive:true});if(fs.existsSync(target)){if(!fs.readFileSync(target).equals(bytes))throw Error('EXISTING_SCHEMA_MISMATCH');}else fs.writeFileSync(target,bytes,{flag:'wx'});}rows.push({file:p,sha256:sha(bytes),bytes:bytes.length,source_commit:commit});}
save(`${OUT}/SNAPSHOT-EXTRA-DOMAIN-SCHEMA.json`,{reason:'Legacy normalization transitive package validator eagerly loads schema JSON; missing from JS-only 026E snapshot.',files:rows,current_source_bytes_verified_equal:true});
console.log('Registry data restored',rows.length);
