import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import vm from 'node:vm';
import {parse7Plus1,replay7Plus1} from '../research/7plus1-parser/llm-first-028/engine.mjs';
import {callCodex,buildPrompt} from '../research/7plus1-parser/llm-first-028/provider.mjs';
import {boundaryReportBundle} from '../research/7plus1-parser/llm-first-028/boundary-report.mjs';
import {partialArtifacts,publicProgress} from '../research/7plus1-parser/llm-first-028/observability.mjs';
import {processView,renderCompilerProcess,renderReportText} from '../research/7plus1-parser/v0.3-p2.1-generalization/web/process-view.js';
import {createServer} from '../research/7plus1-parser/llm-first-028/service.mjs';
const source=Buffer.from('两组各选两个，交集一个，合计三个；逐成员记录身份，不合并记录。');
const generated='# I 输入与边界\n两组选集X、Y：|X|=|Y|=2，|X∩Y|=1，|X∪Y|=3。\n来源：“两组各选两个，交集一个，合计三个”。\n# O 记录\n每个组—成员关系保持独立记录；未替PM选择具体集合。\n# B 禁止\n不能合并记录。\n<script>malicious()</script>';
const audited='发现问题：候选应明确记录的逐成员来源。建议补齐；未逐条列出其他支持理由。';
const probe={binary:'MOCK_NO_MODEL',version:'offline-fixture',binary_sha256:null,outputs:{features:{stdout:''}}};
function harness(t,{sameSession=false,emptyAudit=false}={}){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-report-test-')),calls=[];
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const call=args=>callCodex({...args,execute:async(binary,argv,options)=>{
  assert.equal(binary,'MOCK_NO_MODEL');assert.ok(!argv.includes('--output-schema'));assert.equal(args.bundle.schema,null);
  assert.equal((options.input.match(/<SOURCE_DATA>/g)??[]).length,1);assert.equal(options.env.OPENAI_API_KEY,undefined);
  assert.equal(options.env.CODEX_API_KEY,undefined);calls.push({phase:args.bundle.phase,input:options.input});
  const isAudit=args.bundle.phase==='audit';if(isAudit){assert.equal(args.candidate.text,generated);assert.ok(options.input.includes(JSON.stringify(args.candidate)));}
  const raw=isAudit?(emptyAudit?'':audited):generated;fs.writeFileSync(argv[argv.indexOf('--output-last-message')+1],raw);
  const thread=sameSession?'same':isAudit?'audit-session':'parse-session';
  return {exit_code:0,elapsed_ms:isAudit?20:30,stdout:JSON.stringify({type:'thread.started',thread_id:thread})+'\n'+JSON.stringify({type:'turn.completed',usage:{output_tokens:123}}),stderr:'',timed_out:false};
 }});
 return {root,calls,call,options:{output:path.join(root,'run'),probe,call,productSnapshot:{contract:'candidate-ir/2.0'},maxModelRequests:2}};
}
test('existing public engine accepts unrestricted report; two serial calls preserve all content and partial results',async t=>{
 const h=harness(t),signals=[];
 const result=await parse7Plus1(source,{...h.options,onProgress:p=>{signals.push(publicProgress(p));if(p.signal==='PARSE_READY'){const partial=partialArtifacts(h.options.output,{revision:0});assert.equal(partial.proposal.text,generated);assert.equal(partial.audit,null);}}});
 assert.deepEqual(h.calls.map(c=>c.phase),['parse','audit']);assert.equal(result.report,generated);assert.equal(result.review,audited);assert.equal(result.canonical.report,generated);
 assert.equal(result.technical.semantic_completeness,'NOT_PROGRAM_VERIFIED');assert.equal(result.boundary_calculations.program_verification,'NOT_PERFORMED');assert.equal(result.business_decision,null);assert.equal(result.execution_authorization,null);
 assert.equal(result.model_calls.parse[0].schema_check.schema_applied,false);assert.ok(signals.some(p=>p.signal==='REPORT_SAVED'));
 const replay=await replay7Plus1(source,{replayFrom:h.options.output,output:path.join(h.root,'replay')});assert.equal(replay.report,generated);assert.equal(replay.review,audited);assert.equal(replay.real_calls_in_this_replay,0);
 const id='10000000-0000-4000-8000-000000000101',data=path.join(h.root,'data'),dir=path.join(data,'runs',id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'trace.json'),JSON.stringify(result));fs.writeFileSync(path.join(dir,'run.json'),JSON.stringify({run_id:id,status:'COMPLETED',source_text:source.toString(),source_sha256:result.source.sha256}));
 const server=createServer({dataRoot:data,legacyRoot:path.join(h.root,'empty'),productSnapshot:{contract:'candidate-ir/2.0'},parse:()=>{throw Error('MODEL_FORBIDDEN');}});
 for(const suffix of ['', '/json','/export','/trace.md','/trace.html','/trace.json','/calculations.json']){
  const response=await new Promise(resolve=>{let status;server.emit('request',{method:'GET',url:'/api/runs/'+id+suffix,headers:{host:'127.0.0.1:58618'},socket:{localPort:58618}},{setHeader(){},writeHead(s){status=s;},end(body){resolve({status,body:String(body)});}});});
  assert.equal(response.status,200,suffix);if(suffix==='/json')assert.equal(JSON.parse(response.body).report,generated);if(suffix==='/trace.html')assert.ok(!response.body.includes('<script>'));
 }
 assert.equal(server.listening,false);
});
test('review failure retains generation and does not cause automatic rewrite',async t=>{const h=harness(t,{emptyAudit:true});await assert.rejects(parse7Plus1(source,h.options),/MODEL_REPORT_EMPTY/);assert.equal(h.calls.length,2);assert.equal(partialArtifacts(h.options.output,{status:'FAILED',revision:0}).proposal.text,generated);assert.ok(!fs.existsSync(path.join(h.options.output,'trace.json')));});
test('reused session cannot be labelled independent review',async t=>{const h=harness(t,{sameSession:true});await assert.rejects(parse7Plus1(source,h.options),/AUDIT_SESSION_NOT_INDEPENDENT/);assert.equal(h.calls.length,2);});
test('both skills deliver only their own phase plus same short method; source included once',()=>{
 for(const parseMethod of ['SKILL','SKILL1'])for(const phase of ['parse','audit']){const b=boundaryReportBundle(phase,{parseMethod});assert.equal(b.resources.length,2);assert.ok(b.resources[0].path.includes('semantic-'+phase+'/'));assert.equal(b.schema,null);const prompt=buildPrompt({bundle:b,source:{text:'unique source'}});assert.equal(prompt.split('unique source').length-1,1);assert.ok(!b.resources.some(r=>r.path.endsWith('.schema.json')));}
});
class Element{constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.textContent='';}append(...xs){for(const x of xs){if(x&&typeof x==='object')x.parentElement=this;this.children.push(x);}}replaceChildren(...xs){this.children=[];this.append(...xs);}setAttribute(k,v){this[k]=v;}querySelectorAll(){return [];}querySelector(){return null;}}
const content=e=>[e.textContent,...e.children.map(c=>typeof c==='string'?c:content(c))].join(' ');
test('actual native app render accepts partial and final free reports without invoking old calculation renderer',()=>{
 const code=fs.readFileSync('research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','utf8');
 const renderCode=code.slice(code.indexOf('function render(run)'),code.indexOf('function directPanel('));
 for(const finished of [false,true]){
  const elements=new Map(),get=id=>{if(!elements.has(id)){const e=new Element('div');e.parentElement={insertAdjacentElement(){}};e.insertAdjacentElement=()=>{};elements.set(id,e);}return elements.get(id);};
  const run={run_id:'mock',request_profile:'BOUNDARY_REPORT_R01',status:finished?'COMPLETED':'RUNNING',stage:finished?'COMPLETED':'AUDITING',elapsed_ms:123000,progress:{proposal:{text:generated}},source_text:source.toString(),result:finished?{report:generated,review:audited}:null};
  const context={$:get,el:(tag,text)=>{const e=new Element(tag);e.textContent=text??'';return e;},document:{createElement:tag=>new Element(tag),createTextNode:x=>x},renderReportText:(target,text)=>target.append(new Element('report'),text),renderBoundaryCalculations:()=>{throw Error('OLD_CALCULATOR_FORBIDDEN');},renderModelInfo(){},renderCompilerProcess(){},updateViewedSettings(){},highlight(){},jsonPost(){},panel(){},count(){},stages:{COMPLETED:'complete',AUDITING:'audit'},errors:{},current:null,session:{},tab:'pending'};
  vm.createContext(context);vm.runInContext(renderCode,context);context.render(run);
  assert.match(content(get('boundary-summary')),/X∪Y/);if(finished)assert.match(content(get('boundary-summary')),/发现问题/);assert.match(get('trace-summary').textContent,/程序核对记录/);
 }
});
test('idle, partial, reviewed and failed reports render without old IR fields or fake schema claims',()=>{
 const previous=globalThis.document;globalThis.document={createElement:tag=>new Element(tag)};
 try{for(const status of ['RUNNING','COMPLETED','FAILED']){const run={run_id:'mock',request_profile:'BOUNDARY_REPORT_R01',status,stage:status==='RUNNING'?'AUDITING':status,progress:{proposal:{text:generated},audit:status==='COMPLETED'?{text:audited}:null},stages:[{stage:'PARSING',signal:'REPORT_SAVED'}]};const target=new Element('div');renderCompilerProcess(target,run);assert.deepEqual(processView(run).stages.map(s=>s.id),['parse','audit','technical']);assert.match(content(target),/程序负责：核对记录、保存与展示/);assert.doesNotMatch(content(target),/模型响应通过Schema检查/);}
 const target=new Element('div');renderReportText(target,generated);assert.match(content(target),/malicious/);const tags=e=>[e.tag,...e.children.filter(x=>typeof x==='object').flatMap(tags)];assert.ok(!tags(target).includes('script'));assert.match(content(target),/X∪Y/);
 const idle=new Element('div');renderCompilerProcess(idle,{},{session:{request_profile:'BOUNDARY_REPORT_R01'}});assert.doesNotMatch(content(idle),/生成Boundary IR/);
 }finally{globalThis.document=previous;}
});
