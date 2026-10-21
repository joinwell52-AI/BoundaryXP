import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {ROOT,REPORT,read,save,sha} from './util.mjs';
const old='docs/reports/7plus1/7P-CANDIDATE-PARSING-ARCHITECTURE-026-LONG';
const groups={root:35,natural:70,exposed200:140},rows=[];
for(const [corpus,count]of Object.entries(groups)){
 const entries=[];
 for(const r of read(`${old}/development/r050/${corpus}/RESULTS.json`).rows){
  const c=read(`${old}/${r.trace}`).compiler_v03,source=c.source.raw_text;
  if(sha(Buffer.from(source))!==r.source_sha256)throw Error('SOURCE_CHANGED '+r.id);
  const prefix=`${REPORT}/sources/${corpus}/${r.id}`;
  save(`${prefix}/source.md`,source);
  // Only original linguistic signals, never legacy semantic decoding or final slots.
  const nlp={source_sha256:r.source_sha256,models:c.nlp_signals.models??[],clauses:c.nlp_signals.clauses??[],literals:c.nlp_signals.literals??[],original_trace_sha256:sha(fs.readFileSync(`${old}/${r.trace}`)),provider:'FROZEN_EXISTING_LINGUISTIC_EVIDENCE_NOT_NEW_CALL'};
  save(`${prefix}/nlp.json`,nlp);
  entries.push({id:r.id,corpus,source_sha256:r.source_sha256,source_path:prefix+'/source.md',nlp_path:prefix+'/nlp.json',nlp_sha256:sha(fs.readFileSync(prefix+'/nlp.json')),rank:sha('027-v1\0'+corpus+'\0'+r.id)});
 }
 entries.sort((a,b)=>a.rank.localeCompare(b.rank));
 for(const [i,r]of entries.entries())rows.push({...r,split:i<count?'development':'locked'});
}
save(`${REPORT}/SPLIT-FREEZE.json`,{algorithm:'SHA256(UTF8(027-v1 NUL corpus NUL case_id)); ascending hex per corpus; fixed first 35/70/140 development; rest locked',frozen_before_any_codex_parser_call:true,no_new_blind_dataset:true,total:rows.length,development:rows.filter(r=>r.split==='development').length,locked:rows.filter(r=>r.split==='locked').length,rows});
save(`${REPORT}/HYPOTHESIS-v1.json`,{parser_version:1,auditor_version:1,gamma_policy_version:1,hypothesis:'LLM-primary semantic proposals plus independently requested coverage audit and finite deterministic certification can preserve cross-surface predicate/argument/discourse semantics without parallel NLP semantic generation.',primary_gate:'Source-semantic correctness, independent binding/modality/condition/coverage checks, then complete Root 7+1 closure',minimum_expected_delta:'Cross-category improvements against reproduced historical 16/50,9/100,200/200; historical scores are not new results',falsification:'Unsupported certified fact, clear omission, collapsed ambiguity, locked first-run semantic error, or provider cannot execute automatically',stop_rule:'At most 4 parser,3 auditor,3 evidence-policy major versions; two successive versions without net improvement stop direction; no tuning after locked first run',adjustment_budget:{parser:4,auditor:3,gamma:3},provider_inputs:'Source + literal/structure contract only. No expected, old semantic outputs, root-cause notes or benchmark case IDs.'});
for(const [name,args]of [['version',['--version']],['help',['--help']],['exec-help',['exec','--help']],['features',['features','list']]]){
 const r=execFileSync('codex.cmd',args,{encoding:'utf8',shell:process.platform==='win32'});save(`${REPORT}/environment/codex-${name}.txt`,r);
}
save(`${REPORT}/environment/GIT.json`,{head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),node:process.version,platform:process.platform,previous_seal_sha256:sha(fs.readFileSync('docs/reports/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F/SEAL.json'))});
save(`${ROOT}/.gitattributes`,'* -text\n');save(`${REPORT}/.gitattributes`,'* -text\n');
console.log(JSON.stringify({total:rows.length,development:245,locked:105}));
