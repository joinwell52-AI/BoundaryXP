import fs from 'node:fs';
import {read,write,OUT,sha,walk} from './audit-tools.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-admin-root-024/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
const freeze=read(OUT+'/IMPLEMENTATION-FREEZE.json');
if(freeze.status!=='FROZEN_BEFORE_NATURAL_100_FIRST_OBSERVATION'||read(OUT+'/source-audits/root-model-r04.json').closed!==50)throw Error('HOLDOUT_NOT_AUTHORIZED_YET');
function verify(){const changed=freeze.code_rules_schema_packs_protocol_files.filter(x=>sha(fs.readFileSync(x.path))!==x.sha256);if(changed.length)throw Error('FROZEN_IMPLEMENTATION_DRIFT '+JSON.stringify(changed));}
verify();const file='fixtures/7plus1/admin-root-natural-100-v1/CASES.md',raw=fs.readFileSync(file,'utf8'),headings=[...raw.matchAll(/^##\s+(\S*\d{3})(?:\s+[^\r\n]*)?\r?\n/gmu)],rows=[];
if(headings.length!==100)throw Error('UNEXPECTED_HOLDOUT_FORMAT; first read retained only, no parser run');
write('natural-first/r01/CORPUS.md',raw);
const inputs=headings.map((m,i)=>({id:m[1],text:raw.slice(m.index+m[0].length,headings[i+1]?.index??raw.length).trim(),heading:m[0].trim()}));
write('natural-first/r01/INPUT-MANIFEST.json',{original_file:file,original_sha256:sha(raw),first_read_at:new Date().toISOString(),freeze_sha256:sha(fs.readFileSync(OUT+'/IMPLEMENTATION-FREEZE.json')),inputs:inputs.map(x=>({id:x.id,heading:x.heading,sha256:sha(x.text),codepoints:[...x.text].length}))});
try{for(const item of inputs){verify();const base='natural-first/r01/'+item.id+'/';write(base+'source.md',item.text);
 try{const result=await parse7Plus1(item.text);write(base+'trace.json',result);const c=result.compiler_v03;const row={id:item.id,status:'OUTPUT_SAVED',trace:base+'trace.json',source_sha256:sha(item.text),gate:result.candidate_graph_gate_results.status,contract:result.contract_gate_results.status,unknown:c.unresolved.length,parser_status:result.parser_status,model_diagnostics:c.nlp_signals.semantic_model_signals.diagnostics};rows.push(row);console.log(JSON.stringify(row));}
 catch(e){write(base+'error.json',{message:e.message,stack:e.stack});const row={id:item.id,status:'ERROR_SAVED',error:base+'error.json',source:base+'source.md',source_sha256:sha(item.text)};rows.push(row);console.log(JSON.stringify(row));}
}}finally{await closeNlp();}
verify();write('natural-first/r01/RESULTS.json',{first_run:true,no_repair_or_retry:true,implementation_frozen:freeze.candidate_sha256,total:rows.length,outputs:rows.filter(r=>r.status==='OUTPUT_SAVED').length,runtime_errors:rows.filter(r=>r.status==='ERROR_SAVED').length,rows});
const files=walk(OUT+'/natural-first/r01').map(path=>({path:path.slice(OUT.length+1),sha256:sha(fs.readFileSync(path))}));write('NATURAL-FIRST-OUTPUT-SEAL.json',{status:'SEALED_FIRST_OUTPUTS_BEFORE_READ_ONLY_DIAGNOSTICS',created_at:new Date().toISOString(),implementation_sha256:freeze.candidate_sha256,files});
console.log(JSON.stringify({total:rows.length,errors:rows.filter(r=>r.status==='ERROR_SAVED').length,first_outputs_sealed:true}));
