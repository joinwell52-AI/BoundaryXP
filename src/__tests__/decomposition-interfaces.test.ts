import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reviewDecomposition } from '../index.ts';
const root = fileURLToPath(new URL('../../', import.meta.url));
const sample = JSON.parse(readFileSync(root + 'examples/decomposition-d044.json', 'utf8'));
test('D044 partial projection identifies scheme versus implementation; corrected guarantee removes that gap', () => {
  const r=reviewDecomposition(sample);
  assert.ok(r.findings.some(f=>f.kind==='input_gap' && f.location==='T3' && f.witness?.scheme && !f.witness.implemented));
  const corrected=structuredClone(sample);
  // A constructed control, not an authorized edit to the historical PM plan.
  corrected.plan_text += '\n对照：方案完成并实施完成。';
  corrected.tasks[1].ensures={expr:{all:['scheme','implemented']},quote:'方案完成并实施完成'};
  assert.ok(!reviewDecomposition(corrected).findings.some(f=>f.kind==='input_gap' && f.location==='T3'));
});
test('CLI and MCP process results match function; malformed input returns tool error', () => {
  const expected=reviewDecomposition(sample);
  const cli=spawnSync(process.execPath,[root+'cli.mjs','legacy','decomposition',root+'examples/decomposition-d044.json'],{encoding:'utf8'});
  assert.equal(cli.status,0,cli.stderr); assert.deepEqual(JSON.parse(cli.stdout),expected);
  const lines=[{jsonrpc:'2.0',id:1,method:'tools/list'},
    {jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'bx_legacy_review_decomposition',arguments:{input:sample}}},
    {jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'bx_legacy_review_decomposition',arguments:{input:{}}}}];
  const mcp=spawnSync(process.execPath,[root+'mcp.mjs'],{encoding:'utf8',input:lines.map(x=>JSON.stringify(x)).join('\n')+'\n'});
  assert.equal(mcp.status,0,mcp.stderr);
  const results=mcp.stdout.trim().split('\n').map(x=>JSON.parse(x));
  assert.ok(results[0].result.tools.some((t:any)=>t.name==='bx_legacy_review_decomposition'));
  assert.deepEqual(JSON.parse(results[1].result.content[0].text),expected);
  assert.equal(results[2].result.isError,true);
});
