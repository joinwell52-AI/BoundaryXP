import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseAndEvaluateBxpTask, protocolInfo, taskSchema, resultSchema } from '../bxp/index.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
function call(requests: any[]) {
  const child=spawnSync(process.execPath,[root+'mcp.mjs'],{encoding:'utf8',input:requests.map(value=>typeof value==='string'?value:JSON.stringify(value)).join('\n')+'\n',maxBuffer:10_000_000});
  assert.equal(child.status,0,child.stderr);
  return child.stdout.trim().split('\n').map(line=>JSON.parse(line));
}
for(const variant of ['complete','b-absent','unresolved','conflict']) test(`MCP/CLI/core equality ${variant}`,()=>{
  const path=root+`examples/bxp/en-${variant}.json`,raw=readFileSync(path,'utf8');
  const output=call([
    {id:1,jsonrpc:'2.0',method:'tools/call',params:{name:'bx_evaluate_task',arguments:JSON.parse(raw)}},
    {id:2,jsonrpc:'2.0',method:'tools/call',params:{name:'bx_evaluate_task_json',arguments:{raw_json:raw}}},
  ]);
  const cli=spawnSync(process.execPath,[root+'cli.mjs','evaluate',path],{encoding:'utf8'});
  assert.equal(cli.status,0,cli.stderr);
  for(const message of output)assert.deepEqual(JSON.parse(message.result.content[0].text),JSON.parse(cli.stdout));
});
test('MCP lists canonical tools first, schema resources and explicit legacy',()=>{
  const output=call([{id:1,method:'initialize'},{id:2,method:'tools/list'},{id:3,method:'resources/list'},
    {id:4,method:'resources/read',params:{uri:taskSchema.$id}},
    {id:5,method:'resources/read',params:{uri:'boundx://protocol-info'}}]);
  assert.match(output[0].result.instructions,/7\+1/);
  assert.deepEqual(output[1].result.tools.slice(0,2).map((item:any)=>item.name),['bx_evaluate_task','bx_evaluate_task_json']);
  assert.deepEqual(output[1].result.tools[0].inputSchema,taskSchema);
  const additional=output[1].result.tools.slice(2);
  assert.ok(additional.filter((item:any)=>item.name.startsWith('bx_legacy_')).every((item:any)=>item.description.includes('not BXP')));
  assert.deepEqual(additional.filter((item:any)=>!item.name.startsWith('bx_legacy_')).map((item:any)=>item.name),
    ['bx_list_semantic_packs','bx_get_semantic_pack_info','bx_prepare_admin_task','bx_evaluate_admin_candidate']);
  assert.ok(output[2].result.resources.some((item:any)=>item.uri===resultSchema.$id));
  assert.deepEqual(JSON.parse(output[3].result.contents[0].text),taskSchema);
  assert.deepEqual(JSON.parse(output[4].result.contents[0].text),protocolInfo());
});
test('MCP raw tool rejects duplicate keys and precision; outer JSON also stays strict',()=>{
  const raws=['{"x":1,"x":2}','{"x":1.0000000000000001}','{}'];
  const messages=call(raws.map((raw,index)=>({id:index,method:'tools/call',params:{name:'bx_evaluate_task_json',arguments:{raw_json:raw}}})));
  messages.forEach((message,index)=>assert.deepEqual(JSON.parse(message.result.content[0].text),parseAndEvaluateBxpTask(raws[index])));
  const malformed=call(['{"id":1,"method":"ping","method":"tools/list"}']);
  assert.equal(malformed[0].error.code,-32700);
});
test('MCP rejects legacy objects at canonical entry and removed unnamespaced tool names',()=>{
  const legacy=JSON.parse(readFileSync(root+'examples/task.json','utf8'));
  const result=call([{id:1,method:'tools/call',params:{name:'bx_evaluate_task',arguments:legacy}},
    {id:2,method:'tools/call',params:{name:'bx_review_task',arguments:{document:legacy}}}]);
  assert.equal(JSON.parse(result[0].result.content[0].text).evaluation.validation,'invalid');
  assert.equal(result[1].result.isError,true);
});
test('MCP transport rejects invalid UTF-8 before decoding',()=>{
  const input=Buffer.concat([Buffer.from('{"id":1,"method":"ping","extra":"'),Buffer.from([0xc3,0x28]),Buffer.from('"}\n')]);
  const child=spawnSync(process.execPath,[root+'mcp.mjs'],{encoding:'utf8',input});
  assert.equal(child.status,0,child.stderr);
  assert.equal(JSON.parse(child.stdout).error.code,-32700);
});
