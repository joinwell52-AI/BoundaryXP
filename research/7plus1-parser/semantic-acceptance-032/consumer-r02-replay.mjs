// Consumer-only correction: exact frozen model responses, no new semantic score.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {report,write} from './prepare.mjs';import {sha256} from '../llm-first-028/source.mjs';
const root=path.resolve('.boundx/experiments/032/packages/consumer-c2'),manifest=JSON.parse(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json'))),core=path.join(root,'research/7plus1-parser/llm-first-028');
const {buildBundle}=await import(pathToFileURL(path.join(core,'bundle.mjs'))),{replay7Plus1}=await import(pathToFileURL(path.join(core,'engine.mjs'))),frozen=JSON.parse(fs.readFileSync(path.join(report,'CANDIDATE-FROZEN.json')));
assert.equal(buildBundle('parse').sha256,frozen.parse_bundle_sha256);assert.equal(buildBundle('audit').sha256,frozen.audit_bundle_sha256);
const records=[];for(const id of ['Q01','Q02','Q03']){
 const priorDir=path.join(report,'runs/final',id,'run'),prior=JSON.parse(fs.readFileSync(path.join(priorDir,'trace.json'))),out=path.join(report,'runs/consumer-r02-replay',id,'run'),result=replay7Plus1(fs.readFileSync(path.join(report,'inputs',id+'.txt')),{output:out,replayFrom:priorDir});
 assert.deepEqual(result.canonical,prior.canonical);assert.equal(result.chinese,prior.chinese);assert.deepEqual(result.technical,prior.technical);
 records.push({id,source_sha256:result.source.sha256,prior_trace_sha256:sha256(fs.readFileSync(path.join(priorDir,'trace.json'))),replay_trace_sha256:sha256(fs.readFileSync(path.join(out,'trace.json'))),canonical_identical:true,chinese_identical:true,technical_identical:true,real_model_calls:0,new_model_score:false});
}
write('CONSUMER-R02-REPLAY.json',{version:manifest.version,compiler_revision:manifest.compiler_revision,contract:manifest.contract,implementation_commit:manifest.source_commit,package_sha256:sha256(fs.readFileSync(path.join(root,'PRODUCT-MANIFEST.json'))),parse_bundle_unchanged:true,audit_bundle_unchanged:true,model_provider_unchanged:true,records,real_model_calls:0,does_not_complete_remaining_76_compilations:true});console.log(JSON.stringify({replays:records.length,unchanged:true,model_calls:0}));
