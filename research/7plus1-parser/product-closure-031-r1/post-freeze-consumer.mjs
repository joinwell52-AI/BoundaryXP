// Evaluation-only impact check. Original responses are not rewritten.
import fs from 'node:fs';import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {report} from './prepare.mjs';
import {buildBundle} from '../llm-first-028/bundle.mjs';
import {replay7Plus1} from '../llm-first-028/engine.mjs';
import {auditBindingRevisionFeedback} from '../llm-first-028/revision.mjs';
import {sha256} from '../llm-first-028/source.mjs';
const c2=path.resolve('.boundx/experiments/031-r1/packages/final-c2');
const priorBundle=(await import(pathToFileURL(path.join(c2,'research/7plus1-parser/llm-first-028/bundle.mjs')))).buildBundle;
const bundles=['parse','audit'].map(phase=>({phase,before:priorBundle(phase).sha256,after:buildBundle(phase).sha256}));
if(bundles.some(x=>x.before!==x.after))throw Error('MODEL_VISIBLE_BUNDLE_CHANGED');
const scan=process.argv.includes('--scan-only'),rows=[];
for(const group of ['final','repeat','new'])for(const id of fs.readdirSync(path.join(report,'runs',group))){
 const dir=path.join(report,'runs',group,id),p=path.join(dir,'run/trace.json');
 if(!fs.existsSync(p)||!fs.existsSync(path.join(dir,'execution.json')))continue;
 const t=JSON.parse(fs.readFileSync(p)),feedback=auditBindingRevisionFeedback(t.technical,t.proposal,t.audit);
 let replay=null;if(!scan){
  const out=path.join(report,'consumer-c3-replay',group,id);
  replay=replay7Plus1(fs.readFileSync(path.join(dir,'run/source.txt')),{output:out,replayFrom:path.join(dir,'run')});
  if(JSON.stringify(replay.canonical)!==JSON.stringify(t.canonical)||replay.chinese!==t.chinese)throw Error('UNEXPECTED_SEMANTIC_CONSUMER_DELTA:'+group+'/'+id);
 }
 rows.push({case:group+'/'+id,source_sha256:t.source.sha256,origin_trace_sha256:sha256(fs.readFileSync(p)),canonical_identical:replay?true:null,chinese_identical:replay?true:null,revision_eligibility:feedback,real_calls:0});
}
const result={compiler:'031-r1-c3',model_bundles:bundles,model_visible_resources_changed:false,rows,real_calls:0,eligible:rows.filter(x=>x.revision_eligibility.length).map(x=>x.case)};
if(!scan)fs.writeFileSync(path.join(report,'POST-FREEZE-CONSUMER-CHECK.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({bundles,completed:rows.length,eligible:result.eligible,real_calls:0}));
