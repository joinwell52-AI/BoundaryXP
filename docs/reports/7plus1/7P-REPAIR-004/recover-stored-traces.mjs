// Report-only recovery. Never reruns the Parser or rewrites a saved trace/error.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {meetingAssertions} from '../7P-REPAIR-001/test-support/meeting-assertions.mjs';
const dir='docs/reports/7plus1/7P-REPAIR-004',read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),put=(p,o)=>fs.writeFileSync(p,typeof o==='string'?o:JSON.stringify(o,null,2)+'\n',{flag:'wx'}),freeze=read(dir+'/IMPLEMENTATION-FROZEN.json'),attempts=read(dir+'/RUNS.json'),rows=[];
for(const [p,h]of Object.entries(freeze.files))assert.equal(hash(p),h);
for(const x of attempts){
 const out=dir+'/replay/'+x.sample_id,trace=out+'/trace.json',before=hash(trace),r=read(trace),c=r.compiler_v03,attempt=read(out+'/ATTEMPTED.json');
 assert.equal(r.parser_revision,'v0.3-7p-repair-004');assert.equal(c.source.sha256,attempt.source_sha256);
 assert(x.error?.stack.includes('traceMarkdown'));
 put(out+'/actual-7plus1.json',c.canonical_7plus1);
 const json=JSON.stringify(r,null,2),fence='`'.repeat(Math.max(3,...[...json.matchAll(/`+/gu)].map(m=>m[0].length+1)));
 put(out+'/trace.md','# 7P-REPAIR-004 saved native Trace\n\nReport-only rendering of the first saved trace.json. Original runtime Markdown export failed; ERROR.json is retained. No parsing or semantic changes.\n\n'+fence+'json\n'+json+'\n'+fence+'\n');
 const row={sample_id:x.sample_id,run_id:x.run_id,status:'COMPLETE',parser_status:r.parser_status,contract_gates:r.contract_gate_results.status,source_sha256:c.source.sha256,engine:freeze.engine,duration_ms:x.duration_ms,duration_note:'Original parse plus failed Markdown-export attempt; no reparse.',actual_path:out+'/actual-7plus1.json',trace_path:trace,trace_sha256:before,model_signals:c.nlp_signals.semantic_model_signals.models.map(m=>({resource:m.resource,path:m.path,actually_loaded:m.actually_loaded,manifest_sha256:m.manifest_sha256})),model_diagnostics:c.nlp_signals.semantic_model_signals.diagnostics,ref_assertions:x.sample_id==='REF-001'?meetingAssertions(r):null,original_attempt_status:x.status,original_export_status:'FAILED',original_error_path:out+'/ERROR.json',report_recovery:'DIRECT_RENDER_FROM_UNCHANGED_FIRST_TRACE'};
 assert.equal(hash(trace),before);put(out+'/RUN.json',row);rows.push(row);
}
put(dir+'/PARSER-RUNS.json',rows);
put(dir+'/EXPORT-INCIDENT.json',{cause:'Copied exporter revision guard still recognizes v0.3-7p-repair-003-r03; the new v0.3-7p-repair-004 snapshot falls through the legacy chain and dereferences absent legacy_output.full_trace.',location:'research/7plus1-parser/v0.3-7p-repair-004/export.mjs:5',affected:rows.map(r=>r.sample_id),first_attempt_log:'RUNS.json',runtime_export_fixed:false,parser_and_saved_trace_unchanged:true,recovery:'Report-only rendering and canonical extraction from immutable first trace.json; no fabricated legacy object or revision spoof.',frozen_implementation_unchanged:true});
console.log(JSON.stringify({saved_parser_snapshots:rows.length,original_export_failures:rows.length,contract_gates:rows.map(r=>r.contract_gates),ref_failed:rows[0].ref_assertions.filter(a=>!a.pass)}));
