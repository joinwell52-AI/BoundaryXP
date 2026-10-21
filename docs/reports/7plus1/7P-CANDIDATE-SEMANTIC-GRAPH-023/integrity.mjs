import fs from 'node:fs';
import assert from 'node:assert/strict';
import {OUT,read,write,sha,git} from './audit-tools.mjs';

const baseline=read(OUT+'/BASELINE.json'),differences=[];
for(const row of [...baseline.files,...baseline.models]){
 const actual=fs.existsSync(row.path)&&fs.statSync(row.path).isFile()?sha(fs.readFileSync(row.path)):null;
 if(actual!==row.sha256)differences.push({path:row.path,before:row.sha256,after:actual});
}
const frozen=read(OUT+'/IMPLEMENTATION-FREEZE-r05.json');
const freezeDifferences=frozen.files.filter(r=>sha(fs.readFileSync(r.path))!==r.sha256);
const rawSeals=['FIRST-OUTPUT-SEAL.json','FIRST-OUTPUT-SEAL-r05.json'].map(name=>{
 const seal=read(OUT+'/'+name),invalid=seal.files.filter(r=>!fs.existsSync(r.path)||sha(fs.readFileSync(r.path))!==r.sha256);
 return {seal:name,sha256:sha(fs.readFileSync(OUT+'/'+name)),files:seal.files.length,invalid};
});
const original=read(OUT+'/ADMIN-FIRST-OUTPUTS.json'),final=read(OUT+'/ADMIN-FIRST-OUTPUTS-r05.json');
// Error summary rows omit source_sha256. Compare the saved source bytes for
// every attempt, including failures, rather than comparing an optional ID/hash.
const sourcePairs=final.rows.map(r=>{const key=r.corpus+'/'+r.id;return {case:key,before:sha(fs.readFileSync(OUT+'/replay/'+key+'/source.md')),after:sha(fs.readFileSync(OUT+'/replay-r05/'+key+'/source.md'))};});
const sourceDifferences=sourcePairs.filter(r=>r.before!==r.after);
const dirtyUnchanged=git(['status','--porcelain=v1','-uno'])===baseline.dirty;
const scriptsUnchanged=JSON.stringify(read('package.json').scripts)===JSON.stringify(baseline.production_scripts);
const status=differences.length||freezeDifferences.length||rawSeals.some(s=>s.invalid.length)||sourceDifferences.length||!dirtyUnchanged||!scriptsUnchanged?'FAIL':'PASS';
write('PRESERVATION-AUDIT'+(process.argv[2]?'-'+process.argv[2]:'')+'.json',{status,base_commit:baseline.base_commit,old_tracked_paths_checked:baseline.files.length,nlp_model_files_checked:baseline.models.length,differences,frozen_candidate_hash:frozen.candidate_hash,freezeDifferences,rawSeals,source_pairs_checked:final.rows.length,source_pairs:sourcePairs,sourceDifferences,unrelated_tracked_dirty_state_unchanged:dirtyUnchanged,production_scripts_unchanged:scriptsUnchanged,semantic_weight_bytes_compared_with_pre_task_baseline:false,semantic_weight_note:'Observed resource manifests and revision identifiers are retained in MODEL-ROLE-AUDIT; no pre-task weight-byte baseline was collected. Do not interpret manifest IDs as a full weight-byte audit.',previous_seals_preserved:true,initial_audit_correction:'PRESERVATION-AUDIT.json retained: its source comparison used optional hashes missing in 11 error summary rows. This audit compares all 200 actual saved source files.'});
assert.equal(status,'PASS');
console.log(JSON.stringify({status,old_paths:baseline.files.length,models:baseline.models.length,raw_files:rawSeals.map(s=>s.files),source_pairs:final.rows.length}));
