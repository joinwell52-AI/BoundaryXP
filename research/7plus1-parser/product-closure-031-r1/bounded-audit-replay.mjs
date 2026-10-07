// Evaluation transport: replay an unchanged first response, then exercise the
// installed product's one real audit-driven revision. No expected facts enter it.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {report} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';
const id=process.argv[2];if(!/^Q\d{2}$/.test(id??''))throw Error('CASE_ARGUMENT_REQUIRED');
const root=path.resolve('.boundx/experiments/031-r1/upgrade-home-c3/versions/0.1.0-candidate.031-r1.2');
const {lockProduct}=await import(pathToFileURL(path.join(root,'product/short-compiler/resources.mjs')));const lock=lockProduct(root);
const core=path.join(root,'research/7plus1-parser/llm-first-028');
const {buildBundle}=await import(pathToFileURL(path.join(core,'bundle.mjs')));
const {parse7Plus1}=await import(pathToFileURL(path.join(core,'engine.mjs')));
const {callCodex}=await import(pathToFileURL(path.join(core,'provider.mjs')));
const {auditBindingRevisionFeedback}=await import(pathToFileURL(path.join(core,'revision.mjs')));
const origin=path.join(report,'runs/final',id,'run'),prior=JSON.parse(fs.readFileSync(path.join(origin,'revision-0/trace.json'))),bytes=fs.readFileSync(path.join(report,'inputs',id+'.txt'));
if(prior.source.sha256!==sha256(bytes))throw Error('SOURCE_CHANGED');
for(const phase of ['parse','audit'])if(JSON.parse(fs.readFileSync(path.join(origin,'revision-0',phase+'-call/request-0.json'))).bundle_sha256!==buildBundle(phase).sha256)throw Error('MODEL_VISIBLE_BUNDLE_CHANGED');
const feedback=auditBindingRevisionFeedback(prior.technical,prior.proposal,prior.audit);if(!feedback.length)throw Error('NO_TYPED_BINDING_REVISION_TRIGGER');
if(!process.argv.includes('--execute')){fs.writeFileSync(path.join(report,'CAPTURED-BINDING-TRIGGER.json'),JSON.stringify({id,origin_trace_sha256:sha256(fs.readFileSync(path.join(origin,'revision-0/trace.json'))),feedback,real_calls:0,selects_replacement:false},null,2)+'\n',{flag:'wx'});console.log('Captured trigger verified; zero calls');process.exit(0);}
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const count=()=>{const f=walk(path.join(report,'runs'));const outer=f.filter(p=>/request-\d+\.json$/.test(p)).length,retries=f.filter(p=>/stderr-\d+\.txt$/.test(p)).reduce((n,p)=>n+(fs.readFileSync(p,'utf8').match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length,0);return{outer,retries,conservative:outer+retries};};
if(180-count().conservative<6)throw Error('INSUFFICIENT_CONSERVATIVE_RESERVE');
const dir=path.join(report,'runs/correction',id);fs.mkdirSync(dir,{recursive:true});const output=path.join(dir,'run'),probe=JSON.parse(fs.readFileSync(path.join(report,'ENVIRONMENT.json'))),started=Date.now();
const mode='CAPTURED_FIRST_PLUS_REAL_BOUNDED_REVISION',originProof={trace_sha256:sha256(fs.readFileSync(path.join(origin,'revision-0/trace.json'))),origin,first_candidate_sha256:sha256(JSON.stringify(prior.proposal)),first_audit_sha256:sha256(JSON.stringify(prior.audit))};
fs.writeFileSync(path.join(dir,'launch.json'),JSON.stringify({id,mode,source_sha256:sha256(bytes),product_snapshot:lock.snapshot,originProof,max_new_outer_requests:4,conservative_before:count()},null,2)+'\n',{flag:'wx'});
let captured=0,error=null,result=null;
const call=async o=>{
 if(captured<2){captured++;const phase=o.bundle.phase,receipt=JSON.parse(fs.readFileSync(path.join(origin,'revision-0',phase+'-call/receipt-0.json')));fs.mkdirSync(o.directory,{recursive:true});fs.writeFileSync(path.join(o.directory,'capture-origin.json'),JSON.stringify({...originProof,phase,origin_thread_id:receipt.thread_id,real_calls_here:0},null,2)+'\n',{flag:'wx'});return{value:structuredClone(phase==='parse'?prior.proposal:prior.audit),receipt,attempts:[]};}
 return callCodex(o);
};
try{result=await parse7Plus1(bytes,{output,probe,call,maxModelRequests:4,resourceGuard:lock.verify,productSnapshot:lock.snapshot});}catch(e){error={code:e.code??null,message:e.message};}
fs.writeFileSync(path.join(dir,'execution.json'),JSON.stringify({id,mode,execution_status:error?'RUN_FAILED':'RUN_SUCCEEDED',semantic_status:'NOT_REVIEWED',elapsed_ms:Date.now()-started,error,revision:result?.revision??null,originProof,real_new_calls:walk(output).filter(p=>/request-\d+\.json$/.test(p)).length,counts_after:count()},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({id,mode,error,revision:result?.revision,counts:count()}));if(error)process.exitCode=1;
