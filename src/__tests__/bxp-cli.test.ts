import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseAndEvaluateBxpTask, protocolInfo } from '../bxp/index.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'boundx-cli-'));
const path = join(directory,'中文 task.json');
after(() => { unlinkSync(path); rmdirSync(directory); });
const cli = (...args: string[]) => spawnSync(process.execPath,[root+'cli.mjs',...args],{encoding:'utf8',maxBuffer:8_000_000});
for (const variant of ['complete','b-absent','unresolved','conflict']) {
  test(`CLI BXP ${variant}`, () => {
    const input = root+`examples/bxp/zh-CN-${variant}.json`;
    const result = cli('evaluate',input);
    assert.equal(result.status,0,result.stderr);
    assert.equal(result.stderr,'');
    assert.deepEqual(JSON.parse(result.stdout),parseAndEvaluateBxpTask(readFileSync(input)));
  });
}
for (const [name,raw] of [['schema','{}'],['duplicate','{"x":1,"x":2}'],['precision','{"x":1.0000000000000001}'],['oversize',' '.repeat(2000001)],['utf8',Buffer.from([0xff])]] as const) {
  test(`CLI rejects ${name} with invalid result and zero process status`, () => {
    writeFileSync(path,raw);
    const result=cli('evaluate',path);
    assert.equal(result.status,0,result.stderr);
    assert.equal(result.stderr,'');
    assert.deepEqual(JSON.parse(result.stdout),parseAndEvaluateBxpTask(raw));
  });
}
test('CLI versions and explicit legacy boundary', () => {
  assert.deepEqual(JSON.parse(cli('protocol-info').stdout),protocolInfo());
  const legacy=cli('legacy','task',root+'examples/task.json');
  assert.equal(legacy.status,0); assert.match(legacy.stderr,/Deprecated legacy/);
  assert.notEqual(JSON.parse(legacy.stdout).schema,'boundx-result/v1');
  assert.notEqual(cli('task',root+'examples/task.json').status,0);
  assert.equal(JSON.parse(cli('evaluate',root+'examples/task.json').stdout).evaluation.validation,'invalid');
});
