import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { setImmediate as tick } from 'node:timers/promises';
import { CORE_ELEMENTS } from '../src/bxp/index.mjs';

async function harness(onRequest, industries = []) {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, { value: '', textContent: '', disabled: false, handlers: {},
      children: [], addEventListener(name, callback) { (this.handlers[name] ??= []).push(callback); }, append(child) { this.children.push(child); }, replaceChildren() {},
      dispatchEvent(event) { for (const callback of this.handlers[event.type] ?? []) callback(event); } });
    return elements.get(id);
  };
  const l1 = { scope: 'boundx', pack_id: 'core-ontology', version: '1.1.0', digest: 'a'.repeat(64) };
  const response = value => ({ ok: true, json: async () => value });
  const fetch = async (url, options) => {
    if (url === '/api/protocol-info') return response({ core_elements: CORE_ELEMENTS });
    const input = JSON.parse(options.body);
    if (input.method === 'bx_list_semantic_packs') return response({ installed: [{ ...l1, layer: 'L1' }, ...industries], active: [l1] });
    return onRequest(input, response);
  };
  const document = { getElementById: element, querySelector: () => ({ content: 'token' }), createElement: () => ({}) };
  await runInNewContext('(async()=>{' + readFileSync(new URL('./admin-product.mjs', import.meta.url), 'utf8') + '\n})()', { document, fetch });
  return { element, click: id => element(id).handlers.click[0](), change: id => element(id).dispatchEvent({ type: 'input' }) };
}

test('ADMIN homepage makes the new workspace discoverable and scopes persistence claims', () => {
  const html = readFileSync(new URL('./bxp.html', import.meta.url), 'utf8');
  assert.match(html, /href="\/admin"/);
  assert.match(html, /saves prepared snapshots locally/);
  assert.match(html, /compatible Host/);
});

test('late prepare response cannot restore a snapshot after source changes', async () => {
  let resolve;
  const ui = await harness((input, response) => new Promise(done => { resolve = value => done(response(value)); }));
  ui.element('source').value = 'old source';
  const pending = ui.click('prepare');
  await tick();
  ui.element('source').value = 'new source'; ui.change('source');
  resolve({ prepare_id: 'old', source: { text: 'old source' } }); await pending;
  assert.equal(ui.element('raw').textContent, '');
  assert.match(ui.element('status').textContent, /Stale/);
});

test('late evaluation cannot replace the stale notice with an old report', async () => {
  let resolve;
  const ui = await harness((input, response) => input.method === 'bx_prepare_admin_task'
    ? response({ prepare_id: 'same' }) : new Promise(done => { resolve = value => done(response(value)); }));
  ui.element('source').value = 'source'; await ui.click('prepare');
  ui.element('candidate').value = '{"prepare_id":"same"}';
  const pending = ui.click('evaluate'); await tick();
  ui.change('industry'); resolve({ computed: true, report: 'obsolete report' }); await pending;
  assert.equal(ui.element('report').textContent, '');
  assert.match(ui.element('status').textContent, /Stale/);
});

test('late employee build cannot become the current downloadable package', async () => {
  let resolve;
  const ui = await harness((input, response) => new Promise(done => { resolve = value => done(response(value)); }));
  const pending = ui.click('employee-build'); await tick();
  ui.change('employee-csv'); resolve({ archive: 'old', reference: { pack_id: 'old' } }); await pending;
  await ui.click('employee-download');
  assert.match(ui.element('status').textContent, /Build first/);
});

test('industry selector lists six installed packages without silently activating a selection', async () => {
  const names = ['software-ai', 'ops-sys', 'fleet-logistics', 'warehouse-inventory', 'customer-refund', 'auto-rental'];
  const industries = names.map((pack_id, index) => ({ scope: 'boundx', pack_id, version: '1.0.0', digest: String(index).repeat(64), layer: 'L2' }));
  let calls = 0;
  const ui = await harness(() => { calls++; throw new Error('Unexpected request'); }, industries);
  assert.equal(ui.element('industry').children.length, 6);
  ui.element('industry').value = industries[1].digest; ui.change('industry');
  await ui.click('prepare');
  assert.equal(calls, 0);
  assert.match(ui.element('status').textContent, /Confirm industry activation first/);
});
