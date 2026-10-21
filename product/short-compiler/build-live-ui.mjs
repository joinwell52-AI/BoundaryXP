// Derive an immutable observability update from the complete installed version.
// Never copy development semantic code/contracts over the installed product.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
import {lockProduct} from './resources.mjs';
const repo=process.cwd(),home=path.join(repo,'.boundx/short-compiler-031-r1'),base=path.join(home,'versions','0.1.0-candidate.031-r1.2-ui.4');
const current=JSON.parse(fs.readFileSync(path.join(home,'current.json'),'utf8'));if(!['0.1.0-candidate.031-r1.2-ui.4','0.1.0-candidate.031-r1.2-ui.6'].includes(current.version))throw Error('BASE_INSTALLATION_CHANGED');
const baseline=lockProduct(base);baseline.verify();const version='0.1.0-candidate.031-r1.2-ui.7',target=path.join(home,'versions',version);
if(fs.existsSync(target))throw Error('IMMUTABLE_CANDIDATE_ALREADY_EXISTS');
const sha=b=>createHash('sha256').update(b).digest('hex'),web='research/7plus1-parser/v0.3-p2.1-generalization/web/',core='research/7plus1-parser/llm-first-028/';
const normalize=s=>s.replaceAll('\r\n','\n').replaceAll('source_lineage:sourceLineage,','').replaceAll(',sourceLineage','').replaceAll(",sourceLineage",'').replaceAll("'parent_run_id',",'').replaceAll(",'parent_run_id'",'').replaceAll('record.source_lineage=sourceLineage;','').replaceAll('&&(prior.source_lineage?.parent_run_id??null)===(sourceLineage?.parent_run_id??null)','').replaceAll('source_lineage_supported:true','source_lineage_supported:false');
function applyDiff(before,diff){
 const sections=normalize(diff).split(/^@@.*@@.*\n/m).slice(1);let value=before.replaceAll('\r\n','\n');
 for(const section of sections){const lines=section.split('\n').filter(l=>[' ','+','-'].includes(l[0]));const old=lines.filter(l=>l[0]!=='+').map(l=>l.slice(1)).join('\n'),next=lines.filter(l=>l[0]!=='-').map(l=>l.slice(1)).join('\n');
  const at=value.indexOf(old);if(at<0||value.indexOf(old,at+1)>=0)throw Error('AMBIGUOUS_OR_MISSING_PATCH_CONTEXT:'+old.slice(0,100));value=value.slice(0,at)+next+value.slice(at+old.length);
 }return value;
}
const manifest=JSON.parse(fs.readFileSync(path.join(base,'PRODUCT-MANIFEST.json'),'utf8')),updates=new Map(),patches=[];
for(const rel of [core+'engine.mjs',core+'service.mjs']){
 const diff=execFileSync('git',['diff','--unified=1','2b50498e566b2d5c0a860ab1967e8bcd673577d3','--',rel],{cwd:repo,encoding:'utf8'});if(!diff.includes('@@'))throw Error('OBSERVABILITY_DIFF_REQUIRED:'+rel);
 updates.set(rel,applyDiff(fs.readFileSync(path.join(base,rel),'utf8'),diff));patches.push({path:rel,patch_sha256:sha(diff),adaptation:'Only remove existing 032 source-lineage context; preserve installed 031 behavior'});
}
const provider=core+'provider.mjs',processFile=core+'process.mjs';
const changeOnce=(s,old,next)=>{if(!s.includes(old)||s.indexOf(old)!==s.lastIndexOf(old))throw Error('EXACT_OBSERVABILITY_ANCHOR_MISSING:'+old.slice(0,60));return s.replace(old,next);};
let pv=fs.readFileSync(path.join(base,provider),'utf8');
pv=changeOnce(pv,'signal,onEvent,requestBudget})','signal,onEvent,onActivity=()=>{},requestBudget})');
pv=changeOnce(pv,'  const execution=await runChild(probe.binary,args,',"  onActivity({signal:'REQUEST_STARTED',attempt});\n  let retryCount=0;const onStderr=text=>{const count=(text.match(/retrying sampling request|stream connection failed; waiting to retry/g)??[]).length;if(count>retryCount){retryCount=count;onActivity({signal:'TRANSPORT_RETRY',attempt,retry_count:count});}};\n  const execution=await runChild(probe.binary,args,");
pv=changeOnce(pv,'signal,timeoutMs,onEvent,env:','signal,timeoutMs,onEvent,onStderr,env:');
pv=changeOnce(pv,'if(result.exit_code===0&&schemaCheck.ok&&!timedOut)return {value,attempts,request,receipt};',"if(result.exit_code===0&&schemaCheck.ok&&!timedOut){onActivity({signal:'RESPONSE_VALIDATED',attempt});return {value,attempts,request,receipt};}");
updates.set(provider,pv);
let pc=fs.readFileSync(path.join(base,processFile),'utf8');pc=changeOnce(pc,'onEvent=()=>{},env=process.env','onEvent=()=>{},onStderr=()=>{},env=process.env');pc=changeOnce(pc,"child.stderr.on('data',chunk=>stderr+=chunk);","child.stderr.on('data',chunk=>{stderr+=chunk;onStderr(stderr);});");updates.set(processFile,pc);
for(const rel of [web+'native-app.js',web+'process-view.js',web+'style.css',core+'observability.mjs'])updates.set(rel,fs.readFileSync(path.join(repo,rel)));
for(const [rel,bytes] of updates){if(rel.endsWith('.mjs')||rel.endsWith('.js')){const result=execFileSync(process.execPath,['--check','--input-type=module'],{input:bytes,stdio:['pipe','pipe','pipe']});}}
for(const x of manifest.files){const p=path.join(target,x.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(base,x.path),p,fs.constants.COPYFILE_EXCL);}
for(const [rel,bytes] of updates)fs.writeFileSync(path.join(target,rel),bytes);
for(const rel of ['package.json','package-lock.json']){const p=path.join(target,rel),x=JSON.parse(fs.readFileSync(p,'utf8'));x.version=version;if(x.packages?.[''])x.packages[''].version=version;fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');}
const paths=[...new Set([...manifest.files.map(x=>x.path),core+'observability.mjs'])];
const final={...manifest,version,created_at:new Date().toISOString(),source_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),presentation_revision:'live-process.1',presentation_only:false,change_scope:'live telemetry and explicitly selected per-run model settings; frozen semantic methods unchanged',semantic_base:'0.1.0-candidate.031-r1.2',parent_version:manifest.version,parent_manifest:baseline.snapshot.manifest_sha256,files:paths.map(rel=>({path:rel,sha256:sha(fs.readFileSync(path.join(target,rel)))}))};
fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(final,null,2)+'\n',{flag:'wx'});fs.cpSync(path.join(base,'node_modules'),path.join(target,'node_modules'),{recursive:true});
baseline.verify();const lock=lockProduct(target);lock.verify();
const result={version,root:target,manifest:lock.snapshot.manifest_sha256,changed:[...updates.keys(),'package.json','package-lock.json'],patches,skills_contract_schema_projection_unchanged:true,model_calls:0,pointer_changed:false};
fs.writeFileSync(path.join(target,'LIVE-UI-BUILD.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
