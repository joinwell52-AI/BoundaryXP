import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createProductHost } from '../product/host.mjs';
import { createApp } from '../../ui-server.mjs';
import { readBoundedFile } from '../product/files.mjs';
import { IDS, validateProduct } from '../product/contracts.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));
function replay(task, prepared) {
  const convert = value => {
    if (Array.isArray(value)) return value.map(convert);
    if (!value || typeof value !== 'object') return value;
    if (Object.hasOwn(value, 'quote')) return { source_id: value.source_id ?? 'task', quote: value.quote };
    return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'normalized').map(([key, child]) => [key, convert(child)]));
  };
  return { schema: 'boundx-extraction-candidate/v1', prepare_id: prepared.prepare_id,
    source_digest: prepared.source_digest, context_digest: prepared.context_digest,
    elements: convert(task.elements), constraints: convert(task.constraints),
    producer: { producer_kind: 'structured-replay', adapter_version: '0.1.0', model_id: 'unknown' }, clarifications: [] };
}

test('product CLI, MCP and guarded HTTP preserve identical tasks, results and three-layer reports', async () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-entries-'));
  const options = { root, tenant: 'tenant-a', allowDirectoryDisclosure: false };
  const host = createProductHost(options);
  const server = createApp({ productOptions: options });
  try {
    const reference = host.registry.importDirectory(join(repository, 'domain-packs/l1/core-ontology'));
    host.registry.activate(reference);
    const task = JSON.parse(readFileSync(join(repository, 'examples/bxp/en-complete.json'), 'utf8'));
    const input = { source: task.source, profile: task.profile, packs: [reference] };
    const prepared = host.invoke('bx_prepare_admin_task', input);
    const candidate = replay(task, prepared);
    const expected = host.invoke('bx_evaluate_admin_candidate', { candidate });
    assert.equal(expected.computed, true);
    const preparePath = join(root, 'prepare.json'), candidatePath = join(root, 'candidate.json');
    writeFileSync(preparePath, JSON.stringify(prepared));
    writeFileSync(candidatePath, JSON.stringify(candidate));
    const env = { ...process.env, BOUNDARYXP_DATA_DIR: root, BOUNDARYXP_TENANT: 'tenant-a', BOUNDARYXP_ALLOW_L3_DISCLOSURE: '0' };
    const cli = spawnSync(process.execPath, [join(repository, 'cli.mjs'), 'evaluate-candidate', preparePath, candidatePath], { env, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout), expected);
    const mcp = spawnSync(process.execPath, [join(repository, 'mcp.mjs')], { env, encoding: 'utf8', input: JSON.stringify({ id: 1,
      method: 'tools/call', params: { name: 'bx_evaluate_admin_candidate', arguments: { candidate } } }) + '\n' });
    assert.equal(mcp.status, 0, mcp.stderr);
    assert.deepEqual(JSON.parse(JSON.parse(mcp.stdout).result.content[0].text), expected);
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    const page = await fetch(origin + '/admin').then(response => response.text());
    const token = page.match(/name="boundx-token" content="([a-f0-9]+)"/)[1];
    const post = (args, authorized = true) => fetch(origin + '/api/admin-product', { method: 'POST',
      headers: { 'content-type': 'application/json', origin, 'x-boundx-token': authorized ? token : 'wrong' },
      body: JSON.stringify({ method: 'bx_evaluate_admin_candidate', arguments: args }) });
    assert.deepEqual(await (await post({ raw_candidate: JSON.stringify(candidate) })).json(), expected);
    assert.equal((await post({ candidate }, false)).status, 403);
    assert.equal((await post({ raw_candidate: '{"prepare_id":"first","prepare_id":"second"}' })).status, 400);
    assert.equal((await post({ raw_candidate: JSON.stringify(candidate), candidate })).status, 400);
    const forged = structuredClone(candidate);
    forged.elements.I.entries[0].evidence[0].quote = 'not in original';
    const rejected = await (await post({ candidate: forged })).json();
    assert.equal(rejected.computed, false);
    assert.equal(rejected.result, null);
    assert.equal(expected.result.business_decision, null);
    assert.equal(expected.result.execution_authorization, null);
    for (const layer of [1, 2, 3]) assert.ok(expected.report.includes('【Layer ' + layer + '：'));
  } finally {
    if (server.listening) await new Promise<void>(resolve => server.close(() => resolve()));
    rmSync(root, { recursive: true, force: true });
  }
});

test('prepare rejects unknown source fields, duplicate profile fields and malformed pack identities', () => {
  const base = { source: { text: 'Read report.', language: 'en' }, profile: { id: 'org.boundx.test', required_elements: ['I'] },
    packs: [{ scope: 'boundx', pack_id: 'core-ontology', version: '1.1.0', digest: 'a'.repeat(64) }] };
  assert.doesNotThrow(() => validateProduct(IDS.prepare, base));
  for (const change of [value => { value.source.approved = true; }, value => { value.profile.required_elements.push('I'); },
    value => { value.packs[0].digest = 'latest'; }, value => { value.sources = [{ id: 'x', text: 'missing metadata' }]; }]) {
    const value = structuredClone(base); change(value);
    assert.throws(() => validateProduct(IDS.prepare, value), { code: 'PRODUCT_SCHEMA' });
  }
});

test('bounded local input rejects over-limit files before parsing', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-file-limit-'));
  try {
    const path = join(root, 'input.json');
    writeFileSync(path, '12345');
    assert.throws(() => readBoundedFile(path, 4), { code: 'INPUT_LIMIT' });
    assert.equal(readBoundedFile(path, 5).toString(), '12345');
    assert.throws(() => readBoundedFile(root), { code: 'FILE_TYPE' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});
