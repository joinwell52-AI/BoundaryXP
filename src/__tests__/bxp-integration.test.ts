import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdtempSync, unlinkSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import * as core from '../bxp/index.mjs';
import * as publicApi from '../index.ts';
import {createApp} from '../../ui-server.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
test('package main exports the single production implementation, not legacy semantics',()=>{
  for(const name of ['evaluateBxpTask','parseAndEvaluateBxpTask','validateBxpTask','validateBxpResult','protocolInfo'])assert.equal(publicApi[name],core[name]);
  assert.ok(!('reviewBoundX' in publicApi));assert.ok(!('BOUNDARY_PARAMETERS' in publicApi));
  assert.equal(publicApi.taskSchema,core.taskSchema);
});

for(const locale of ['zh-CN','en'])test(`all six ${locale} cases plus non-BMP: Core/CLI/MCP/HTTP end-to-end`,async context=>{
  const app=createApp({fetchImpl:()=>{throw Error('No network allowed');}});
  await new Promise<void>(resolve=>app.listen(0,'127.0.0.1',resolve));
  context.after(()=>new Promise<void>(resolve=>{app.close(resolve);app.closeAllConnections();}));
  const origin='http://127.0.0.1:'+app.address().port;
  const html=await(await fetch(origin,{headers:{Connection:'close'}})).text(),token=html.match(/name="session-token" content="([a-f0-9]+)"/)![1];
  const directory=mkdtempSync(join(tmpdir(),'boundx-e2e-')),path=join(directory,'双语 input.json');
  context.after(()=>{unlinkSync(path);rmdirSync(directory);});
  for(const variant of ['complete','b-absent','unresolved','multi-source','unresolved-scope','conflict']){
    const task=JSON.parse(readFileSync(root+`examples/bxp/${locale}-${variant}.json`,'utf8'));
    const prefix='😀𠮷 e\u0301 中文 English\n';task.source.text=prefix+task.source.text;
    const visit=(value:any)=>{
      if(!value||typeof value!=='object')return;
      if(typeof value.quote==='string'&&(!value.source_id||value.source_id==='task')){value.start+=Array.from(prefix).length;value.end+=Array.from(prefix).length;}
      for(const child of Object.values(value))visit(child);
    };
    visit(task.elements);visit(task.constraints);visit(task.scopes);
    const raw=JSON.stringify(task),expected=core.parseAndEvaluateBxpTask(raw);
    assert.equal(expected.evaluation.validation,'valid',variant);assert.equal(expected.business_decision,null);assert.equal(expected.execution_authorization,null);
    writeFileSync(path,raw,'utf8');
    const cli=spawnSync(process.execPath,[root+'cli.mjs','evaluate',path],{encoding:'utf8'});
    assert.equal(cli.status,0,cli.stderr);assert.deepEqual(JSON.parse(cli.stdout),expected,variant);
    const mcp=spawnSync(process.execPath,[root+'mcp.mjs'],{encoding:'utf8',input:JSON.stringify({id:1,method:'tools/call',params:{name:'bx_evaluate_task_json',arguments:{raw_json:raw}}})+'\n'});
    assert.equal(mcp.status,0,mcp.stderr);assert.deepEqual(JSON.parse(JSON.parse(mcp.stdout).result.content[0].text),expected,variant);
    const response=await fetch(origin+'/api/bxp/evaluate',{method:'POST',headers:{Origin:origin,Connection:'close','Content-Type':'application/json','X-BoundX-Token':token},body:raw});
    assert.equal(response.status,200);assert.deepEqual(await response.json(),expected,variant);
  }
});
